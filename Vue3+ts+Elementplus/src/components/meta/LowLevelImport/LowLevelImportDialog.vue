<template>
    <el-dialog title="数据导入" v-model="visible" width="700px" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="import-content">
            <!-- 模板下载区域 -->
            <div class="template-section">
                <el-alert title="导入说明" type="info" :closable="false" show-icon>
                    <template #default>
                        <p>1. 请先下载导入模板，了解正确的字段顺序和数据格式</p>
                        <p>2. 按照模板格式准备数据，Excel列顺序必须与模板一致</p>
                        <p>3. 支持 .xlsx 和 .xls 格式的Excel文件</p>
                    </template>
                </el-alert>

                <div class="template-download">
                    <el-button type="primary" @click="handleDownloadTemplate" :loading="downloadLoading"
                        icon="Download">
                        下载导入模板
                    </el-button>
                    <span class="tip">建议先下载模板了解数据格式</span>
                </div>
            </div>

            <!-- 文件上传区域 -->
            <div class="upload-section">
                <el-upload ref="uploadRef" class="upload-demo" drag :auto-upload="false" :show-file-list="true"
                    :limit="1" accept=".xlsx,.xls" :on-change="handleFileChange" :on-remove="handleFileRemove"
                    :before-upload="beforeUpload">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        将Excel文件拖到此处，或<em>点击上传</em>
                    </div>
                    <template #tip>
                        <div class="el-upload__tip">
                            只能上传 .xlsx/.xls 文件，且不超过 10MB
                        </div>
                    </template>
                </el-upload>
            </div>

            <!-- 导入进度 -->
            <div v-if="importing" class="progress-section">
                <el-progress :percentage="importProgress" :status="importStatus" :stroke-width="8" />
                <p class="progress-text">{{ progressText }}</p>
            </div>

            <!-- 导入结果显示 -->
            <div v-if="importResult" class="result-section">
                <el-alert :title="importResult.message" :type="importResult.success ? 'success' : 'warning'"
                    :closable="false" show-icon>
                    <template #default>
                        <div class="result-stats">
                            <span>总行数: <strong>{{ importResult.totalRows }}</strong></span>
                            <span>成功: <strong class="success-text">{{ importResult.successRows }}</strong></span>
                            <span>失败: <strong class="error-text">{{ importResult.failedRows }}</strong></span>
                            <span>耗时: <strong>{{ importResult.processingTime }}ms</strong></span>
                        </div>
                    </template>
                </el-alert>

                <!-- 错误详情 -->
                <div v-if="importResult.errors && importResult.errors.length > 0" class="error-details">
                    <el-collapse v-model="activeErrorCollapse">
                        <el-collapse-item title="查看错误详情" name="errors">
                            <el-table :data="importResult.errors" size="small" max-height="200" style="width: 100%">
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

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleImport" :loading="importing" :disabled="!selectedFile">
                    {{ importing ? '导入中...' : '开始导入' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadFile, UploadFiles, UploadInstance } from 'element-plus'
import { importData, downloadTemplate } from '@/api-admin/low-level-import'
import type { ImportResult } from '@/types/low-level-import'

// Props 和 Emits
const props = withDefaults(defineProps<{
    tableName: string
    modelValue: boolean
}>(), {
    modelValue: false
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'success': [result: ImportResult]
}>()

// 响应式数据
const uploadRef = ref<UploadInstance>()
const selectedFile = ref<File | null>(null)
const importing = ref(false)
const downloadLoading = ref(false)
const importResult = ref<ImportResult | null>(null)
const importProgress = ref(0)
const importStatus = ref<'success' | 'exception' | 'warning' | ''>('')
const progressText = ref('')
const activeErrorCollapse = ref<string[]>([])

// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

// 监听弹窗关闭，重置状态
watch(visible, (newVal) => {
    if (!newVal) {
        resetState()
    }
})

// 重置状态
const resetState = () => {
    selectedFile.value = null
    importing.value = false
    downloadLoading.value = false
    importResult.value = null
    importProgress.value = 0
    importStatus.value = ''
    progressText.value = ''
    activeErrorCollapse.value = []
    uploadRef.value?.clearFiles()
}

// 下载模板
const handleDownloadTemplate = async () => {
    try {
        downloadLoading.value = true
        await downloadTemplate(props.tableName)
        ElMessage.success('模板下载成功')
    } catch (error) {
        console.error('模板下载失败:', error)
        ElMessage.error('模板下载失败，请稍后重试')
    } finally {
        downloadLoading.value = false
    }
}

// 文件选择变化
const handleFileChange = (file: UploadFile, files: UploadFiles) => {
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
        progressText.value = '正在解析Excel文件...'

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

        const response = await importData(props.tableName, selectedFile.value)
        const result = response.data

        clearInterval(progressInterval)
        importProgress.value = 100
        importStatus.value = result.success ? 'success' : 'warning'
        progressText.value = result.success ? '导入完成!' : '导入完成，但存在错误'

        importResult.value = result

        if (result.success) {
            ElMessage.success(`导入成功！共导入 ${result.successRows} 条数据`)
            emit('success', result)
        } else {
            ElMessage.warning(`导入完成，成功 ${result.successRows} 条，失败 ${result.failedRows} 条`)
        }

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

// 关闭弹窗
const handleClose = async () => {
    if (importing.value) {
        try {
            await ElMessageBox.confirm('导入正在进行中，确定要关闭吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
        } catch {
            return // 用户取消关闭
        }
    }

    visible.value = false
}
</script>

<style scoped>
.import-content {
    padding: 0 4px;
}

.template-section {
    margin-bottom: 24px;
}

.template-download {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
}

.tip {
    color: #909399;
    font-size: 13px;
}

.upload-section {
    margin-bottom: 24px;
}

.progress-section {
    margin-bottom: 24px;
}

.progress-text {
    text-align: center;
    margin-top: 8px;
    color: #606266;
    font-size: 14px;
}

.result-section {
    margin-bottom: 16px;
}

.result-stats {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
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

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

:deep(.el-upload-dragger) {
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    width: 100%;
    height: 180px;
    text-align: center;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

:deep(.el-upload-dragger:hover) {
    border-color: #409eff;
}

:deep(.el-icon--upload) {
    font-size: 67px;
    color: #c0c4cc;
    margin: 40px 0 16px;
    line-height: 50px;
}
</style>