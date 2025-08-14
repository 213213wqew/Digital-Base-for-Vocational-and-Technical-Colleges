<template>
    <div class="simple-excel-upload">
        <!-- 文件上传区域 -->
        <el-form label-width="100px">
            <el-form-item label="Excel文件">
                <el-upload ref="uploadRef" :auto-upload="false" :show-file-list="true" :limit="1" accept=".xlsx,.xls"
                    :on-change="handleFileChange" :on-remove="handleFileRemove" :before-upload="beforeUpload">
                    <el-button type="primary" icon="Upload">选择Excel文件</el-button>
                    <template #tip>
                        <div class="el-upload__tip">
                            支持 .xlsx/.xls 格式，文件大小不超过 10MB
                        </div>
                    </template>
                </el-upload>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleImport" :loading="importing" :disabled="!selectedFile">
                    {{ importing ? '导入中...' : '开始导入' }}
                </el-button>
                <el-button @click="handleReset">重置</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
        </el-form>

        <!-- 导入进度 -->
        <div v-if="importing" class="progress-section">
            <el-progress :percentage="importProgress" :status="importStatus" />
            <p class="progress-text">{{ progressText }}</p>
        </div>

        <!-- 导入结果 -->
        <div v-if="importResult" class="result-section">
            <el-alert :title="importResult.message" :type="importResult.success ? 'success' : 'warning'" show-icon>
                <div class="result-stats">
                    <span>总行数: <strong>{{ importResult.totalRows }}</strong></span>
                    <span>成功: <strong class="success-text">{{ importResult.successRows }}</strong></span>
                    <span>失败: <strong class="error-text">{{ importResult.failedRows }}</strong></span>
                    <span>耗时: <strong>{{ importResult.processingTime }}ms</strong></span>
                </div>
            </el-alert>

            <!-- 错误详情 -->
            <div v-if="importResult.errors && importResult.errors.length > 0" class="error-details">
                <el-collapse>
                    <el-collapse-item title="查看错误详情">
                        <el-table :data="importResult.errors" size="small" max-height="300">
                            <el-table-column prop="rowNumber" label="行号" width="80" />
                            <el-table-column prop="fieldName" label="字段" width="120" />
                            <el-table-column prop="errorMessage" label="错误信息" />
                            <el-table-column prop="originalValue" label="原始值" width="120" />
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadInstance } from 'element-plus'
import { simpleImportData } from '@/api-admin/low-level-import'

// Props
const props = defineProps<{
    tableName: string
}>()

// Emits
const emit = defineEmits<{
    success: [result: ImportResult]
    cancel: []
}>()

// 导入结果类型
interface ImportResult {
    success: boolean
    totalRows: number
    successRows: number
    failedRows: number
    errors: ImportError[]
    processingTime: number
    message: string
}

interface ImportError {
    rowNumber: number
    fieldName: string
    errorMessage: string
    originalValue: string
}

// 响应式数据
const uploadRef = ref<UploadInstance>()
const selectedFile = ref<File | null>(null)
const importing = ref(false)
const importProgress = ref(0)
const importStatus = ref<'success' | 'exception' | 'warning' | ''>('')
const progressText = ref('')
const importResult = ref<ImportResult | null>(null)

// 文件选择变化
const handleFileChange = (file: UploadFile) => {
    if (file.raw) {
        selectedFile.value = file.raw
        importResult.value = null // 清除之前的结果
    }
}

// 文件移除
const handleFileRemove = () => {
    selectedFile.value = null
    importResult.value = null
}

// 上传前验证
const beforeUpload = (file: File) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
    const isLt10M = file.size / 1024 / 1024 < 10

    if (!isExcel) {
        ElMessage.error('只能上传Excel文件!')
        return false
    }
    if (!isLt10M) {
        ElMessage.error('文件大小不能超过 10MB!')
        return false
    }
    return false // 阻止自动上传
}

// 处理导入
const handleImport = async () => {
    if (!selectedFile.value) {
        ElMessage.warning('请先选择要导入的Excel文件')
        return
    }

    try {
        importing.value = true
        importProgress.value = 0
        importStatus.value = ''
        progressText.value = '正在上传文件...'

        // 模拟进度更新
        const progressInterval = setInterval(() => {
            if (importProgress.value < 90) {
                importProgress.value += 10
                if (importProgress.value < 30) {
                    progressText.value = '正在解析Excel文件...'
                } else if (importProgress.value < 60) {
                    progressText.value = '正在验证数据...'
                } else {
                    progressText.value = '正在保存数据...'
                }
            }
        }, 200)

        // 调用导入API
        const response = await importData(props.tableName, selectedFile.value)

        clearInterval(progressInterval)
        importProgress.value = 100
        
        console.log('完整响应:', response)
        
        // 正确解析后端返回的数据结构
        let resultData
        if (response && response.data) {
            // 如果response.data.data存在，说明是嵌套结构
            if (response.data.data) {
                resultData = response.data.data
            } else {
                // 否则直接使用response.data
                resultData = response.data
            }
        } else {
            // 如果response本身就是数据
            resultData = response
        }
        
        console.log('解析后的导入结果:', resultData)
        
        if (!resultData) {
            throw new Error('无法解析导入结果数据')
        }
        
        importStatus.value = resultData.success ? 'success' : 'warning'
        progressText.value = resultData.message || '导入完成'

        // 设置导入结果
        importResult.value = resultData

        if (resultData.success) {
            ElMessage.success(`导入成功！共导入 ${resultData.successRows} 条数据`)
        } else {
            ElMessage.warning(`导入完成，成功 ${resultData.successRows} 条，失败 ${resultData.failedRows} 条`)
        }

        // 触发成功事件
        emit('success', resultData)

    } catch (error) {
        console.error('导入失败:', error)
        importProgress.value = 100
        importStatus.value = 'exception'
        progressText.value = '导入失败'
        ElMessage.error('导入失败，请检查文件格式或稍后重试')
    } finally {
        importing.value = false
    }
}

// 重置
const handleReset = () => {
    selectedFile.value = null
    importResult.value = null
    importProgress.value = 0
    importStatus.value = ''
    progressText.value = ''
    uploadRef.value?.clearFiles()
}

// 取消
const handleCancel = () => {
    emit('cancel')
}

// 简化的导入API调用
const importData = async (tableName: string, file: File): Promise<any> => {
    const formData = new FormData()
    formData.append('file', file)
   
    const response = await simpleImportData(tableName, file) as any
    return response
}
</script>

<style scoped>
.simple-excel-upload {
    margin-top: 20px;
}

.progress-section {
    margin-top: 20px;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 6px;
}

.progress-text {
    text-align: center;
    margin-top: 8px;
    color: #606266;
    font-size: 14px;
}

.result-section {
    margin-top: 20px;
}

.result-stats {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 8px;
}

.result-stats span {
    font-size: 14px;
    color: #606266;
}

.success-text {
    color: #67c23a;
}

.error-text {
    color: #f56c6c;
}

.error-details {
    margin-top: 16px;
}

:deep(.el-upload__tip) {
    color: #909399;
    font-size: 12px;
    margin-top: 8px;
}
</style>