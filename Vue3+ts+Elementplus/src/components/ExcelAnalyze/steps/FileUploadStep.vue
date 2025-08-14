<template>
  <div class="file-upload-step">
    <div class="upload-header">
      <h3>上传Excel文件</h3>
      <p class="upload-description">
        请选择要导入到 <strong>{{ tableLabel || tableName }}</strong> 的Excel文件
      </p>
    </div>

    <div class="upload-area">
      <el-upload ref="uploadRef" class="excel-upload" drag :http-request="customUpload" :before-upload="beforeUpload"
        :on-progress="handleUploadProgress" :show-file-list="false" :auto-upload="true" accept=".xlsx,.xls"
        :disabled="uploading">
        <div class="upload-content">
          <el-icon class="el-icon--upload" :size="60">
            <UploadFilled />
          </el-icon>
          <div class="el-upload__text">
            将Excel文件拖到此处，或<em>点击上传</em>
          </div>
          <div class="el-upload__tip">
            支持 .xlsx 和 .xls 格式，文件大小不超过 {{ maxFileSize }}MB
          </div>
        </div>
      </el-upload>

      <!-- 上传进度 -->
      <div v-if="uploading" class="upload-progress">
        <el-progress :percentage="uploadProgress" :status="uploadStatus" :stroke-width="8" />
        <p class="progress-text">{{ progressText }}</p>
      </div>

      <!-- 上传结果 -->
      <div v-if="uploadResult" class="upload-result">
        <!-- 成功结果 -->
        <div v-if="uploadResult.success">
          <el-alert title="文件上传成功" type="success" :description="uploadResult.message || '文件解析完成，可以进行下一步操作'" show-icon
            :closable="false" />

          <!-- 数据读取状态 -->
          <div v-if="uploadResult.data?.sessionId && !dataReady" class="data-reading-status">
            <el-alert title="正在读取Excel数据..." type="info" :closable="false">
              <template #default>
                <div class="reading-progress">
                  <el-progress :percentage="readingProgress" :stroke-width="6" />
                  <p class="reading-text">{{ readingText }}</p>
                </div>
              </template>
            </el-alert>
          </div>

          <div class="file-info">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="文件名">
                {{ uploadResult.data?.fileName }}
              </el-descriptions-item>
              <el-descriptions-item label="文件大小">
                {{ uploadResult.data?.fileSize ? formatFileSize(uploadResult.data.fileSize) : '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="总行数">
                {{ uploadResult.data?.totalRows || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="总列数">
                {{ uploadResult.data?.totalColumns || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="上传时间">
                {{ uploadResult.data?.uploadTime ? formatUploadTime(uploadResult.data.uploadTime) : '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="会话ID">
                {{ uploadResult.data?.sessionId || '-' }}
              </el-descriptions-item>
            </el-descriptions>

            <!-- 表头预览 -->
            <div v-if="uploadResult.data?.headers?.length" class="headers-preview">
              <div class="headers-header">
                <h4>检测到的表头字段（{{ uploadResult.data.headers.length }}个）：</h4>
                <div class="search-box">
                  <el-input
                    v-model="headerSearchKeyword"
                    placeholder="搜索表头字段..."
                    size="small"
                    clearable
                    style="width: 200px;"
                  >
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                </div>
              </div>

              <!-- 表格形式显示表头 -->
              <el-table :data="filteredHeaderTableData" max-height="500" size="small" border class="headers-table">
                <el-table-column prop="index" label="序号" width="60" align="center" />
                <el-table-column prop="column" label="列标识" width="80" align="center" />
                <el-table-column prop="headerName" label="表头名称" min-width="150" show-overflow-tooltip />
                <el-table-column prop="dataType" label="数据类型" width="100" align="center">
                  <template #default="{ row }">
                    <el-tag size="small" :type="getDataTypeTagType(row.dataType)">
                      {{ row.dataType }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="sampleData" label="示例数据" min-width="120" show-overflow-tooltip />
              </el-table>

              <!-- 折叠显示选项 -->
               
            </div>
          </div>
        </div>

        <!-- 错误结果 -->
        <div v-else class="upload-error">
          <ErrorRecovery :error="uploadError" :recovery-actions="uploadRecoveryActions"
            @action-complete="handleRecoveryAction" @error-reported="handleErrorReport" />
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="step-actions">
      <el-button v-if="uploadResult?.success" type="primary" @click="handleNext" :disabled="!canNext">
        下一步：字段匹配
      </el-button>
      <el-button v-if="uploadResult && !uploadResult.success" @click="resetUpload">
        重新上传
      </el-button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, ArrowUp, ArrowDown, Search } from '@element-plus/icons-vue'
import type { UploadInstance, UploadRequestOptions, UploadRawFile } from 'element-plus'
import { ExcelAnalyzeErrorHandler } from '@/utils/excelAnalyzeErrorHandler'
import ErrorRecovery from '../ErrorRecovery.vue'
import type { ExcelAnalyzeError, RecoveryAction } from '@/utils/excelAnalyzeErrorHandler'
import { excelAnalyzeApi } from '@/api/excelAnalyze'
import type { FileUploadResponse } from '@/api/excelAnalyze'

// 组件属性
interface Props {
  tableName: string
  tableLabel?: string
}

// 组件事件
interface Emits {
  (e: 'upload-success', data: FileUploadResponse): void
  (e: 'next-step'): void
}

const props = withDefaults(defineProps<Props>(), {
  tableLabel: ''
})

const emit = defineEmits<Emits>()

// 类型声明
interface UploadResult {
  success: boolean;
  message: string;
  data?: FileUploadResponse;
}

// 响应式数据
const uploadRef = ref<UploadInstance>()
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadStatus = ref<'success' | 'exception' | ''>('')
const uploadResult = ref<UploadResult | null>(null)
const uploadError = ref<ExcelAnalyzeError | null>(null)
const currentFile = ref<File | null>(null)
const headerSearchKeyword = ref('')

// 数据读取状态
const dataReady = ref(false)
const readingProgress = ref(0)
const readingText = ref('正在读取Excel数据...')
const statusCheckInterval = ref<number | null>(null)

// 配置
const maxFileSize = 50 // MB

// 计算属性
const progressText = computed(() => {
  if (uploadProgress.value === 100) {
    return '文件上传完成，正在解析...'
  }
  return `正在上传文件... ${uploadProgress.value}%`
})

const canNext = computed(() => {
  return !!(uploadResult.value?.success && uploadResult.value?.data?.sessionId)
})

const uploadRecoveryActions = computed((): RecoveryAction[] => {
  if (!uploadError.value) return []

  return ExcelAnalyzeErrorHandler.createRecoveryActions({
    onRetry: () => handleRetryUpload(),
    onReset: () => resetUpload()
  })
})

// 表头表格数据
const headerTableData = computed(() => {
  if (!uploadResult.value?.data?.headers) {
    return []
  }

  const headers = uploadResult.value.data.headers

  return headers.map((header: any, index: number) => ({
    index: index + 1,
    column: header.columnLetter || getColumnLetter(index),
    headerName: (header.headerName || `列${index + 1}`).replace(/\*/g, ''), // 去掉*字符
    dataType: header.dataType || 'STRING',
    sampleData: header.sampleData || '-'
  }))
})

// 过滤后的表头数据
const filteredHeaderTableData = computed(() => {
  if (!headerSearchKeyword.value) {
    return headerTableData.value
  }
  
  const keyword = headerSearchKeyword.value.toLowerCase()
  return headerTableData.value.filter(item => 
    item.headerName.toLowerCase().includes(keyword) ||
    item.column.toLowerCase().includes(keyword) ||
    item.sampleData.toLowerCase().includes(keyword)
  )
})

// 获取列字母标识
const getColumnLetter = (columnIndex: number): string => {
  let result = ''
  while (columnIndex >= 0) {
    result = String.fromCharCode(65 + (columnIndex % 26)) + result
    columnIndex = Math.floor(columnIndex / 26) - 1
  }
  return result
}

// 获取数据类型标签类型
const getDataTypeTagType = (dataType: string): 'success' | 'warning' | 'primary' | 'info' | 'danger' | undefined => {
  const typeMap: Record<string, 'success' | 'warning' | 'primary' | 'info' | 'danger' | undefined> = {
    'STRING': undefined,
    'NUMBER': 'success',
    'DATE': 'warning',
    'BOOLEAN': 'info'
  }
  return typeMap[dataType] || undefined
}

// 方法
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatUploadTime = (timeStr: string): string => {
  if (!timeStr) return ''
  try {
    const date = new Date(timeStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return timeStr
  }
}

const validateFile = (file: File): { valid: boolean; message?: string } => {
  // 检查文件类型
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  const validExtensions = ['.xls', '.xlsx']
  const fileName = file.name.toLowerCase()
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
  const hasValidType = validTypes.includes(file.type)

  if (!hasValidType && !hasValidExtension) {
    return {
      valid: false,
      message: '请上传Excel文件（.xlsx或.xls格式）'
    }
  }

  // 检查文件大小
  const fileSizeMB = file.size / 1024 / 1024
  if (fileSizeMB > maxFileSize) {
    return {
      valid: false,
      message: `文件大小不能超过 ${maxFileSize}MB，当前文件大小：${fileSizeMB.toFixed(2)}MB`
    }
  }

  // 检查文件是否为空
  if (file.size === 0) {
    return {
      valid: false,
      message: '文件不能为空'
    }
  }

  return { valid: true }
}

const beforeUpload = (rawFile: UploadRawFile): boolean => {
  // 保存当前文件
  currentFile.value = rawFile as File

  // 验证文件
  const validation = validateFile(rawFile as File)
  if (!validation.valid) {
    ElMessage.error(validation.message!)
    return false
  }

  // 重置状态
  uploadResult.value = null
  uploadError.value = null
  uploading.value = true
  uploadProgress.value = 0
  uploadStatus.value = ''

  return true
}

const customUpload = async (options: UploadRequestOptions) => {
  const { file } = options

  try {
    // 模拟上传进度
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 10
      }
    }, 200)

    // 调用API上传文件
    const response = await excelAnalyzeApi.uploadExcelFile(file, {
      tableName: props.tableName,
      tableLabel: props.tableLabel
    })

    // 清除进度模拟
    clearInterval(progressInterval)
    uploadProgress.value = 100

    // 处理成功响应
    handleUploadSuccess(response)

  } catch (error) {
    console.error('文件上传失败:', error)
    handleUploadError(error)
  }
}

const handleUploadProgress = (evt: any) => {
  if (evt.percent !== undefined) {
    uploadProgress.value = Math.round(evt.percent)
  }
}

const handleUploadSuccess = (response: FileUploadResponse) => {
  uploading.value = false
  uploadProgress.value = 100
  uploadStatus.value = 'success'

  const result: UploadResult = {
    success: true,
    message: '文件上传成功',
    data: response
  }

  uploadResult.value = result

  // 开始检查数据读取状态
  if (response.sessionId) {
    startStatusCheck(response.sessionId)
  }

  // 触发成功事件
  emit('upload-success', response)
  ElMessage.success('文件上传成功，正在读取数据...')
}

const handleUploadError = (error: any) => {
  uploading.value = false
  uploadStatus.value = 'exception'

  // 使用错误处理器处理上传错误
  uploadError.value = ExcelAnalyzeErrorHandler.handleFileUploadError(error, currentFile.value || undefined)

  uploadResult.value = {
    success: false,
    message: uploadError.value.message
  }

  // 显示错误信息
  ExcelAnalyzeErrorHandler.showError(uploadError.value, {
    showSuggestions: false, // 在组件中显示建议
    duration: 5000
  })
}

const resetUpload = () => {
  // 停止状态检查
  stopStatusCheck()
  
  uploadResult.value = null
  uploadError.value = null
  uploading.value = false
  uploadProgress.value = 0
  uploadStatus.value = ''
  currentFile.value = null
  
  // 重置数据读取状态
  dataReady.value = false
  readingProgress.value = 0
  readingText.value = '正在读取Excel数据...'
}

const handleNext = () => {
  if (canNext.value) {
    emit('next-step')
  }
}

// 恢复操作处理方法
const handleRetryUpload = async () => {
  if (currentFile.value) {
    resetUpload()

    try {
      // 重新上传当前文件
      await customUpload({
        file: currentFile.value,
        filename: currentFile.value.name,
        uid: Date.now().toString(),
        action: '',
        headers: {},
        data: {},
        withCredentials: false,
        onProgress: () => { },
        onSuccess: () => { },
        onError: () => { }
      })
    } catch (error) {
      console.error('重试上传失败:', error)
      ElMessage.error('重试上传失败，请重新选择文件')
    }
  } else {
    ElMessage.info('请重新选择文件上传')
  }
}



const handleRecoveryAction = (actionLabel: string) => {
  console.log(`恢复操作完成: ${actionLabel}`)
  ElMessage.success(`${actionLabel}操作已完成`)
}

const handleErrorReport = (error: ExcelAnalyzeError) => {
  // 可以发送错误报告到后端
  console.log('用户反馈错误:', error)
  ElMessage.info('错误报告已记录，感谢您的反馈')
}

// 开始检查数据读取状态
const startStatusCheck = (sessionId: string) => {
  // 清除之前的定时器
  if (statusCheckInterval.value) {
    clearInterval(statusCheckInterval.value)
  }
  
  // 重置状态
  dataReady.value = false
  readingProgress.value = 0
  readingText.value = '正在读取Excel数据...'
  
  // 开始轮询检查状态
  statusCheckInterval.value = setInterval(async () => {
    try {
      const status = await excelAnalyzeApi.checkUploadStatus(sessionId)
      
      if (status.isReady) {
        // 数据读取完成
        dataReady.value = true
        readingProgress.value = 100
        readingText.value = '数据读取完成！'
        
        // 清除定时器
        if (statusCheckInterval.value) {
          clearInterval(statusCheckInterval.value)
          statusCheckInterval.value = null
        }
        
        ElMessage.success('Excel数据读取完成，可以进行下一步操作')
      } else {
        // 更新进度（模拟进度）
        readingProgress.value = Math.min(readingProgress.value + 10, 90)
        readingText.value = `正在读取Excel数据... (${status.dataCount || 0} 行)`
      }
    } catch (error) {
      console.error('检查数据读取状态失败:', error)
      readingText.value = '数据读取状态检查失败'
    }
  }, 1000) // 每秒检查一次
}

// 停止状态检查
const stopStatusCheck = () => {
  if (statusCheckInterval.value) {
    clearInterval(statusCheckInterval.value)
    statusCheckInterval.value = null
  }
}

// 暴露方法给父组件
defineExpose({
  resetUpload,
  getCurrentFile: () => currentFile.value,
  getUploadResult: () => uploadResult.value,
  retryUpload: handleRetryUpload
})
</script>

<style scoped lang="scss">
.file-upload-step {
  .upload-header {
    text-align: center;
    margin-bottom: 30px;

    h3 {
      margin: 0 0 10px 0;
      color: #303133;
      font-size: 18px;
      font-weight: 600;
    }

    .upload-description {
      margin: 0;
      color: #606266;
      font-size: 14px;

      strong {
        color: #409eff;
      }
    }
  }

  .upload-area {
    margin-bottom: 30px;

    .excel-upload {
      width: 100%;

      :deep(.el-upload) {
        width: 100%;
      }

      :deep(.el-upload-dragger) {
        width: 100%;
        height: 200px;
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        background-color: #fafafa;
        transition: all 0.3s;

        &:hover {
          border-color: #409eff;
          background-color: #f0f9ff;
        }
      }

      .upload-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;

        .el-icon--upload {
          color: #c0c4cc;
          margin-bottom: 16px;
        }

        .el-upload__text {
          color: #606266;
          font-size: 14px;
          margin-bottom: 8px;

          em {
            color: #409eff;
            font-style: normal;
          }
        }

        .el-upload__tip {
          color: #909399;
          font-size: 12px;
        }
      }
    }

    .upload-progress {
      margin-top: 20px;
      text-align: center;

      .progress-text {
        margin-top: 10px;
        color: #606266;
        font-size: 14px;
      }
    }

    .upload-result {
      margin-top: 20px;

      .data-reading-status {
        margin: 20px 0;
        
        .reading-progress {
          margin-top: 10px;
          
          .reading-text {
            margin-top: 8px;
            color: #606266;
            font-size: 14px;
            text-align: center;
          }
        }
      }

      .file-info {
        margin-top: 20px;

        .headers-preview {
          margin-top: 20px;

          h4 {
            margin: 0 0 10px 0;
            color: #303133;
            font-size: 14px;
            font-weight: 600;
          }

          .headers-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .header-tag {
              margin: 0;
            }
          }
        }
      }
    }
  }

  .step-actions {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
  }
}
</style>