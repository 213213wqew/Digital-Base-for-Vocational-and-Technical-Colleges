<template>
  <div class="import-confirm-step">
    <div class="confirm-header">
      <h3>确认导入</h3>
      <p class="confirm-description">
        请确认导入信息，点击"开始导入"将数据写入数据库
      </p>
    </div>


    <!-- 导入摘要 -->
    <div class="import-summary">
      <el-card shadow="hover" class="summary-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">
              <el-icon class="header-icon"><Document /></el-icon>
              导入摘要
            </span>
            <el-tag :type="getSummaryTagType()" size="large" effect="dark">
              {{ getSummaryStatus() }}
            </el-tag>
          </div>
        </template>
        
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="summary-item">
              <div class="summary-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="summary-value">{{ importSummary.statistics?.totalRows || 0 }}</div>
              <div class="summary-label">总行数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item success">
              <div class="summary-icon">
                <el-icon><Check /></el-icon>
              </div>
              <div class="summary-value">{{ importSummary.statistics?.validRows || 0 }}</div>
              <div class="summary-label">可导入行数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item error">
              <div class="summary-icon">
                <el-icon><Close /></el-icon>
              </div>
              <div class="summary-value">{{ importSummary.statistics?.errorRows || 0 }}</div>
              <div class="summary-label">错误行数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item warning">
              <div class="summary-icon">
                <el-icon><Warning /></el-icon>
              </div>
              <div class="summary-value">{{ importSummary.statistics?.warningRows || 0 }}</div>
              <div class="summary-label">警告行数</div>
            </div>
          </el-col>
        </el-row>
        
        <!-- 文件信息 -->
        <div v-if="importSummary.fileName" class="file-info">
          <el-divider content-position="left">
            <span class="divider-title">
              <el-icon><Folder /></el-icon>
              文件信息
            </span>
          </el-divider>
          <el-descriptions :column="3" size="small" border>
            <el-descriptions-item label="文件名">
              <div class="file-name-container">
                <el-tag type="info" size="small" effect="plain">{{ getDisplayFileName() }}</el-tag>
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="downloadFile"
                  :loading="downloading"
                  class="download-btn"
                >
                  <el-icon><Download /></el-icon>
                  下载
                </el-button>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="文件大小">
              {{ formatFileSize(importSummary.fileSize) }}
            </el-descriptions-item>
            <el-descriptions-item label="上传时间">
              {{ formatTime(importSummary.uploadTime) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>
    </div>

    <!-- 数据验证结果 -->
    <div v-if="validationResult || validating" class="validation-result">
      <el-card shadow="hover" class="validation-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">
              <el-icon class="header-icon"><DataAnalysis /></el-icon>
              数据验证结果
            </span>
            <div class="header-actions">
              <div v-if="validating" class="validating-status">
                <el-icon class="is-loading"><Loading /></el-icon>
                <span>验证中...</span>
              </div>
              <el-tag v-else :type="getValidationTagType()" size="large" effect="dark">
                {{ getValidationStatus() }}
              </el-tag>
              <el-button 
                v-if="!validating && validationResult" 
                type="primary" 
                size="small" 
                @click="validateData"
                :disabled="importing"
              >
                <el-icon><Refresh /></el-icon>
                重新验证
              </el-button>
            </div>
          </div>
        </template>
        
        <div v-if="validating" class="validating-content">
          <el-progress :percentage="0" :indeterminate="true" />
          <p class="validating-text">正在验证Excel数据，请稍候...</p>
          <p class="validating-detail">检查数据格式、长度限制、必填字段等</p>
        </div>
        
        <div v-else-if="validationResult" class="validation-content">
          <!-- 数据状态提示 -->
          <div class="data-status-info" style="margin-bottom: 15px;">
            <el-alert
              :title="`当前验证：${validationResult.dataType === 'TRANSFORMED' ? '转换后的数据' : '原始数据'}`"
              :type="validationResult.dataType === 'TRANSFORMED' ? 'success' : 'info'"
              :closable="false"
              show-icon
              size="small"
            >
              <template #default>
                <span v-if="validationResult.dataType === 'TRANSFORMED'">
                  验证的是经过数据转换处理后的数据，已应用了转换规则。
                </span>
                <span v-else>
                  验证的是从Excel文件中读取的原始数据，未进行任何转换处理。
                </span>
              </template>
            </el-alert>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="validation-item">
                <div class="validation-icon">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="validation-value">{{ validationResult.totalRows || 0 }}</div>
                <div class="validation-label">总行数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="validation-item success">
                <div class="validation-icon">
                  <el-icon><Check /></el-icon>
                </div>
                <div class="validation-value">{{ validationResult.totalRows || 0 }}</div>
                <div class="validation-label">有效行数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="validation-item error">
                <div class="validation-icon">
                  <el-icon><Close /></el-icon>
                </div>
                <div class="validation-value">{{ validationResult.errorRows || 0 }}</div>
                <div class="validation-label">错误行数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="validation-item warning">
                <div class="validation-icon">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="validation-value">{{ validationResult.warningRows || 0 }}</div>
                <div class="validation-label">警告行数</div>
              </div>
            </el-col>
          </el-row>
          
          <!-- 错误详情按钮 -->
          <div v-if="validationResult.errors && validationResult.errors.length > 0" class="error-actions">
            <el-button 
              :type="getErrorButtonType()"
              size="large" 
              @click="showErrorDetails"
              class="error-details-btn-main"
            >
              <el-icon><View /></el-icon>
              查看{{ getErrorButtonText() }} ({{ getTotalIssuesCount() }}个{{ getIssueTypeText() }})
            </el-button>
          </div>
          
          <!-- 验证错误提示 -->
          <div v-if="validationResult.errors && validationResult.errors.length > 0" class="validation-errors-tip">
            <el-alert
              :title="getValidationAlertTitle()"
              :type="getValidationAlertType()"
              :closable="false"
              show-icon
            />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 错误信息显示 -->
    <div v-if="importError" class="import-error">
      <ErrorRecovery
        :error="importError"
        :recovery-actions="importRecoveryActions"
        @action-complete="handleRecoveryAction"
        @error-reported="handleErrorReport"
      />
    </div>

    <!-- 导入选项 -->
    <div class="import-options">
      <el-card shadow="hover" class="options-card">
        <template #header>
          <span class="header-title">
            <el-icon class="header-icon"><Setting /></el-icon>
            导入选项
          </span>
        </template>
        
        <el-form :model="importOptions" label-width="120px">
          <!-- 目标数据库表信息 -->
          <!-- <el-form-item label="目标表">
            <div class="table-info">
              <div class="table-display">
                <el-tag type="info" size="large" effect="plain">
                  {{ getFullTableName() }}
                </el-tag>
              </div>
              <div class="table-details">
                <p class="table-label">{{ props.tableLabel || '未知表' }}</p>
                <p class="table-code">{{ props.tableName || '未知表名' }}</p>
                <p v-if="props.subsetCode" class="subset-code">子集代码: {{ props.subsetCode }}</p>
              </div>
            </div>
          </el-form-item> -->
          
          <el-form-item label="导入模式">
            <el-radio-group v-model="importOptions.importMode">
              <el-radio label="insert">仅插入新数据</el-radio>
              <!-- <el-radio label="update">更新已存在数据</el-radio>
              <el-radio label="upsert">插入或更新</el-radio> -->
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="错误处理">
            <el-radio-group v-model="importOptions.errorHandling">
              <!-- <el-radio label="skip">跳过错误行</el-radio> -->
              <el-radio label="stop">遇到错误停止</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="批量大小">
            <el-input-number
              v-model="importOptions.batchSize"
              :min="100"
              :max="5000"
              :step="100"
              style="width: 200px"
            />
            <span class="option-tip">每批处理的数据行数</span>
          </el-form-item>
    
      
          <!-- <el-form-item label="备份数据">
            <el-switch
              v-model="importOptions.createBackup"
              active-text="导入前创建数据备份"
            />
          </el-form-item> -->
            
          <!-- <el-form-item label="导入说明">
            <el-input
              v-model="importOptions.description"
              type="textarea"
              :rows="3"
              placeholder="请输入本次导入的说明信息（可选）"
              maxlength="500"
              show-word-limit
            />
          </el-form-item> -->
        </el-form>
      </el-card>
    </div>

    <!-- 导入进度 -->
    <div v-if="importing" class="import-progress">
      <el-card shadow="never">
        <template #header>
          <span>导入进度</span>
        </template>
        
        <div class="progress-content">
          <el-progress
            :percentage="importProgress.percentage"
            :status="importProgress.status"
            :stroke-width="12"
          />
          <div class="progress-info">
            <p class="progress-text">{{ importProgress.message }}</p>
            <p class="progress-detail">
              已处理: {{ importProgress.processedRows }}/{{ importProgress.totalRows }} 行
              <span v-if="importProgress.successRows > 0">
                | 成功: {{ importProgress.successRows }}
              </span>
              <span v-if="importProgress.errorRows > 0">
                | 失败: {{ importProgress.errorRows }}
              </span>
            </p>
          </div>
        </div>
        
        <!-- 实时日志 -->
        <div v-if="importLogs.length" class="import-logs">
          <h4>导入日志</h4>
          <div class="logs-container">
            <div
              v-for="(log, index) in importLogs"
              :key="index"
              :class="['log-item', log.level]"
            >
              <span class="log-time">{{ formatTime(log.timestamp) }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 导入结果 -->
    <div v-if="importResult" class="import-result">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>导入结果</span>
            <el-tag
              :type="importResult.success ? 'success' : 'danger'"
              size="large"
            >
              {{ importResult.success ? '导入成功' : '导入失败' }}
            </el-tag>
          </div>
        </template>
        
        <div v-if="importResult.success" class="success-result">
          <el-result
            icon="success"
            title="导入完成"
            :sub-title="`成功导入 ${importResult.successCount} 条数据`"
          >
            <template #extra>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="总处理行数">
                  {{ importResult.totalRows }}
                </el-descriptions-item>
                <el-descriptions-item label="成功行数">
                  {{ importResult.successCount }}
                </el-descriptions-item>
                <el-descriptions-item label="失败行数">
                  {{ importResult.errorCount }}
                </el-descriptions-item>
                <el-descriptions-item label="处理耗时">
                  {{ formatDuration(importResult.duration) }}
                </el-descriptions-item>
              </el-descriptions>
              
              <!-- 成功后的操作选项 -->
              <div class="success-actions">
                <el-alert
                  title="导入成功！"
                  type="success"
                  :closable="false"
                  show-icon
                  style="margin-bottom: 16px;"
                >
                  <template #default>
                    <p>数据已成功导入到数据库，您可以选择以下操作：</p>
                  </template>
                </el-alert>
                
                <div class="action-buttons">
                  
                  <el-button 
                    type="success" 
                    size="large"
                    @click="handleGoToTargetPage"
                  >
                    <el-icon><Location /></el-icon>
                    跳转到目标页面
                  </el-button>
                  
                  <el-button 
                    size="large"
                    @click="handleContinueImport"
                  >
                    <el-icon><Refresh /></el-icon>
                    继续导入其他数据
                  </el-button>
                </div>
              </div>
            </template>
          </el-result>
        </div>
        
        <div v-else class="error-result">
          <el-result
            icon="error"
            title="导入失败"
            :sub-title="importResult.message"
          >
            <template #extra>
              <el-button type="primary" @click="handleRetryImport">
                重试导入
              </el-button>
              <el-button @click="handleViewErrors">
                查看错误详情
              </el-button>
            </template>
          </el-result>
        </div>
      </el-card>
    </div>

    <!-- 操作按钮 - 只在导入前和导入中显示 -->
    <div v-if="!importResult || !importResult.success" class="step-actions">
      <el-button
        v-if="!importing && !importResult"
        @click="handlePrev"
      >
        上一步
      </el-button>
      <el-button
        v-if="!importing && !importResult"
        type="success"
        size="large"
        @click="handleStartImport"
        :disabled="!canStartImport"
      >
        <el-icon><Upload /></el-icon>
        开始导入
      </el-button>
      <el-button
        v-if="importing"
        type="danger"
        @click="handleCancelImport"
      >
        取消导入
      </el-button>
      <!-- 导入失败时显示完成按钮 -->
      <el-button
        v-if="importResult && !importResult.success"
        type="primary"
        @click="handleComplete"
      >
        完成
      </el-button>
    </div>
  </div>

  <!-- 错误详情弹窗 -->
  <el-dialog
    v-model="errorDetailsVisible"
    title="验证错误详情"
    width="80%"
    :close-on-click-modal="!validating"
    :close-on-press-escape="!validating"
    :show-close="!validating"
  >
    <!-- 加载遮罩层 -->
    <div v-if="validating" class="dialog-loading-mask">
      <div class="loading-content">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p class="loading-text">数据验证中，请稍候...</p>
        <p class="loading-detail">检查数据格式、长度限制、必填字段等</p>
      </div>
    </div>
    <div v-if="validationResult && validationResult.errors && validationResult.errors.length > 0">
      <el-alert
        :title="`共发现 ${validationResult.errors.length} 个验证错误`"
        type="error"
        :closable="false"
        show-icon
        style="margin-bottom: 20px;"
      />
      
      <el-table :data="validationResult.errors" size="small" max-height="500" border>
        <el-table-column label="序号" width="55" type="index" align="center" />
        <el-table-column prop="rowNumber" label="行号" width="80" align="center" />
        <el-table-column prop="columnName" label="Excel列名" width="150" />
        <el-table-column prop="fieldLabel" label="字段名称" width="150" />
        <el-table-column prop="value" label="错误值" width="120" show-overflow-tooltip />
        <el-table-column prop="errorType" label="错误类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getErrorTypeTag(row.errorType)" size="small">
              {{ getErrorTypeLabel(row.errorType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="errorMessage" label="错误信息" min-width="200" show-overflow-tooltip />
        <el-table-column prop="errorLevel" label="级别" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.errorLevel === 'ERROR' ? 'danger' : 'warning'" size="small">
              {{ row.errorLevel === 'ERROR' ? '错误' : '警告' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <div style="margin-top: 15px; color: #909399; font-size: 12px;">
        <p>• 行号：Excel文件中的实际行号（从第3行开始为数据行）</p>
        <p>• 错误类型：必填（字段不能为空）、长度（超过最大长度限制）、格式（数据类型不匹配）</p>
        <p>• 级别：错误（必须修复）、警告（建议修复）</p>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="errorDetailsVisible = false" :disabled="validating">关闭</el-button>
        <el-button type="primary" @click="validateData" :disabled="validating">
          <el-icon><Refresh /></el-icon>
          重新验证
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Upload, 
  Loading, 
  Refresh, 
  View, 
  Document, 
  Check, 
  Close, 
  Warning, 
  Folder, 
  DataAnalysis, 
  Setting, 
  CircleCheck,
  Download,
  Location
} from '@element-plus/icons-vue'
import { ExcelAnalyzeErrorHandler } from '@/utils/excelAnalyzeErrorHandler'
import ErrorRecovery from '../ErrorRecovery.vue'
import type { ExcelAnalyzeError, RecoveryAction } from '@/utils/excelAnalyzeErrorHandler'
import { excelAnalyzeApi } from '@/api/excelAnalyze'
import type { ImportResultResponse } from '@/api/excelAnalyze'

// 组件属性
interface Props {
  sessionId: string
  importSummary: any
  tableName?: string
  tableLabel?: string
  subsetCode?: string
}

// 组件事件
interface Emits {
  (e: 'import-complete', result: any): void
  (e: 'prev-step'): void
  (e: 'view-imported-data', data: any): void
  (e: 'go-to-target-page', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 导入结果类型
interface ImportResult {
  success: boolean;
  message: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  duration: number;
}
// 导入进度类型
interface ImportProgress {
  percentage: number;
  status: '' | 'success' | 'warning' | 'exception';
  message: string;
  processedRows: number;
  totalRows: number;
  successRows: number;
  errorRows: number;
}

// 响应式数据
const importing = ref(false)
const importResult = ref<ImportResult | null>(null)
const importError = ref<ExcelAnalyzeError | null>(null)
const validationResult = ref<any>(null)
const validating = ref(false)
const downloading = ref(false)
const importProgress = ref<ImportProgress>({
  percentage: 0,
  status: '',
  message: '准备导入...',
  processedRows: 0,
  totalRows: 0,
  successRows: 0,
  errorRows: 0
})

const importOptions = ref({
  importMode: 'insert',
  errorHandling: 'skip',
  batchSize: 1000,
  createBackup: false,
  description: ''
})

const importLogs = ref<any[]>([])
let progressTimer: number | null = null

// 生命周期
onMounted(() => {
  // 组件挂载时立即显示验证中状态，然后自动执行数据验证
  validating.value = true
  validateData()
})

// 计算属性
const canStartImport = computed(() => {
  return props.importSummary?.statistics?.validRows > 0 && 
         (!validationResult.value || validationResult.value.errorRows === 0)
})

// 获取完整数据库表名
const getFullTableName = () => {
  if (!props.tableName) {
    return '未知表'
  }
  
  // 格式: data_base_+子集类+_+表名
  if (props.subsetCode) {
    // 将子集代码转换为小写
    const lowercaseSubsetCode = props.subsetCode.toLowerCase()
    return `data_base_${lowercaseSubsetCode}_${props.tableName}`
  }
  
  // 如果没有子集代码，只显示表名
  return props.tableName
}

const importRecoveryActions = computed((): RecoveryAction[] => {
  if (!importError.value) return []
  
  return ExcelAnalyzeErrorHandler.createRecoveryActions({
    onRetry: () => handleRetryImportAction(),
    onReset: () => handleResetImport(),
    onSkip: () => handleSkipImportErrors()
  })
})

// 方法
const getSummaryTagType = (): 'success' | 'warning' | 'danger' | 'info' => {
  const stats = props.importSummary?.statistics
  if (!stats) return 'info'
  
  if (stats.errorRows === 0) return 'success'
  if (stats.validRows === 0) return 'danger'
  return 'warning'
}

const getSummaryStatus = (): string => {
  const stats = props.importSummary?.statistics
  if (!stats) return '准备中'
  
  if (stats.errorRows === 0) return '数据完整'
  if (stats.validRows === 0) return '数据异常'
  return '部分异常'
}

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString()
}

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分${seconds % 60}秒`
  } else if (minutes > 0) {
    return `${minutes}分${seconds % 60}秒`
  } else {
    return `${seconds}秒`
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleStartImport = async () => {
  try {
    const confirmed = await ElMessageBox.confirm(
      `确认导入 ${props.importSummary.statistics.validRows-1} 条数据到数据库？`,
      '确认导入',
      {
        confirmButtonText: '确认导入',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    if (confirmed) {
      await startImport()
    }
  } catch (error) {
    // 用户取消
  }
}

const startImport = async () => {
  try {
    importing.value = true
    importResult.value = null
    importError.value = null
    importLogs.value = []
    
    // 重置进度
    importProgress.value = {
      percentage: 0,
      status: '',
      message: '开始导入...',
      processedRows: 0,
      totalRows: props.importSummary.statistics?.validRows || 0,
      successRows: 0,
      errorRows: 0
    }
    
    // 根据导入模式选择不同的API
    let response
    console.log('开始导入，模式:', importOptions.value.importMode)
    console.log('错误处理:', importOptions.value.errorHandling)
    
    if (importOptions.value.importMode === 'insert') {
      // 插入新数据
      console.log('调用insertNewData API')
      response = await excelAnalyzeApi.insertNewData(
        props.sessionId,
        {
          ignoreErrors: importOptions.value.errorHandling === 'skip'
        }
      )
    } else if (importOptions.value.importMode === 'update') {
      // 更新现有数据
      console.log('调用updateExistingData API')
      response = await excelAnalyzeApi.updateExistingData(
        props.sessionId,
        {
          ignoreErrors: importOptions.value.errorHandling === 'skip'
        }
      )
    } else {
      // 默认使用兼容的API
      console.log('调用confirmImport API')
      response = await excelAnalyzeApi.confirmImport(
        props.sessionId,
        {
          importMode: importOptions.value.importMode,
          ignoreErrors: importOptions.value.errorHandling === 'skip'
        }
      )
    }
    
    // 处理导入结果
    importing.value = false
    
    // 添加调试日志
    console.log('导入API响应:', response)
    console.log('successRows:', response.successRows)
    console.log('totalRows:', response.totalRows)
    console.log('errorRows:', response.errorRows)
    
    // 更健壮的成功判断逻辑
    const isSuccess = response.successRows > 0 || (response.totalRows > 0 && response.errorRows === 0)
    
    importResult.value = {
      success: isSuccess,
      message: isSuccess ? '导入完成' : '导入失败',
      totalRows: response.totalRows,
      successCount: response.successRows,
      errorCount: response.errorRows,
      duration: 0 // API响应中没有duration字段，可以计算或设为0
    }
    
    // 更新进度为100%
    importProgress.value = {
      percentage: 100,
      status: isSuccess ? 'success' : 'exception',
      message: isSuccess ? '导入完成' : '导入失败',
      processedRows: response.totalRows,
      totalRows: response.totalRows,
      successRows: response.successRows,
      errorRows: response.errorRows
    }
    
    // 添加导入日志
    if (response.errors?.length) {
      importLogs.value = response.errors.map(error => ({
        timestamp: Date.now(),
        level: 'error',
        message: `${error.field}: ${error.errorMessage}`
      }))
    }
    
    emit('import-complete', importResult.value)
    
    if (isSuccess) {
      ElMessage.success(`导入完成，成功导入 ${response.successRows} 条数据`)
    } else {
      ElMessage.error('导入失败，请检查数据格式')
    }
    
  } catch (error: any) {
    console.error('启动导入失败:', error)
    
    // 使用错误处理器处理导入错误
    importError.value = ExcelAnalyzeErrorHandler.handleImportError(error, {
      processedRows: importProgress.value.processedRows,
      totalRows: importProgress.value.totalRows
    })
    
    ExcelAnalyzeErrorHandler.showError(importError.value)
    importing.value = false
  }
}

const startProgressPolling = () => {
  progressTimer = setInterval(async () => {
    try {
      const response = await fetch(`/api/excel-analyze/sessions/${props.sessionId}/import-progress`)
      const result = await response.json()
      
      if (result.success) {
        const progress = result.data
        importProgress.value = {
          percentage: Math.round((progress.processedRows / progress.totalRows) * 100),
          status: progress.status === 'error' ? 'exception' : '',
          message: progress.message,
          processedRows: progress.processedRows,
          totalRows: progress.totalRows,
          successRows: progress.successRows,
          errorRows: progress.errorRows
        }
        
        // 添加新日志
        if (progress.logs?.length) {
          importLogs.value.push(...progress.logs)
        }
        
        // 检查是否完成
        if (progress.status === 'completed' || progress.status === 'error') {
          stopProgressPolling()
          importing.value = false
          importResult.value = {
            success: progress.status === 'completed',
            message: progress.message,
            totalRows: progress.totalRows,
            successCount: progress.successRows,
            errorCount: progress.errorRows,
            duration: progress.duration
          }
          
          emit('import-complete', importResult.value)
        }
      }
    } catch (error) {
      console.error('获取导入进度失败:', error)
    }
  }, 2000) // 每2秒轮询一次
}

const stopProgressPolling = () => {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

const handleCancelImport = async () => {
  try {
    const confirmed = await ElMessageBox.confirm(
      '确认取消导入？已导入的数据将保留。',
      '取消导入',
      {
        confirmButtonText: '确认取消',
        cancelButtonText: '继续导入',
        type: 'warning'
      }
    )
    
    if (confirmed) {
      const success = await excelAnalyzeApi.deleteSession(props.sessionId)
      
      if (success) {
        stopProgressPolling()
        importing.value = false
        ElMessage.success('导入已取消')
      } else {
        throw new Error('取消导入失败')
      }
    }
  } catch (error: any) {
    console.error('取消导入失败:', error)
    
    const cancelError = ExcelAnalyzeErrorHandler.handleApiError(error, 'cancel_import')
    ExcelAnalyzeErrorHandler.showError(cancelError, {
      showSuggestions: true,
      duration: 5000
    })
  }
}

const handleRetryImport = () => {
  importResult.value = null
  importLogs.value = []
}

const handleViewErrors = () => {
  // 打开错误详情对话框或跳转到错误页面
  ElMessage.info('查看错误详情功能待实现')
}

const handlePrev = () => {
  emit('prev-step')
}

const handleComplete = () => {
  emit('import-complete', importResult.value)
}

// 查看导入的数据
const handleViewImportedData = () => {
  const targetTableName = getFullTableName()
  ElMessage.info(`即将跳转到 ${targetTableName} 的数据列表页面`)
  
  // 触发事件让父组件处理跳转
  emit('view-imported-data', {
    tableName: targetTableName,
    sessionId: props.sessionId,
    importResult: importResult.value
  })
}

// 跳转到目标页面
const handleGoToTargetPage = () => {
  const targetTableName = getFullTableName()
  ElMessage.success(`正在跳转到 ${targetTableName} 的管理页面`)
  
  // 触发跳转事件并关闭弹窗
  emit('go-to-target-page', {
    tableName: targetTableName,
    sessionId: props.sessionId,
    importResult: importResult.value,
    closeModal: true
  })
}

// 继续导入其他数据
const handleContinueImport = () => {
  // 关闭弹窗并刷新主页面数据
  ElMessage.success('导入完成，正在刷新数据列表')
  
  // 触发事件通知父组件关闭弹窗并刷新数据
  emit('import-complete', {
    ...importResult.value,
    action: 'continue_import',
    refreshData: true
  })
}

// 错误处理和恢复操作方法
const handleRetryImportAction = async () => {
  importError.value = null
  await startImport()
}

const handleResetImport = () => {
  importError.value = null
  importResult.value = null
  importLogs.value = []
  importing.value = false
  stopProgressPolling()
  
  // 重置导入选项
  importOptions.value = {
    importMode: 'insert',
    errorHandling: 'skip',
    batchSize: 1000,
    createBackup: false,
    description: ''
  }
  
  ElMessage.success('已重置导入设置')
}

const handleSkipImportErrors = () => {
  importError.value = null
  importOptions.value.errorHandling = 'skip'
  ElMessage.success('已设置为跳过错误行模式')
}

const handleRecoveryAction = (actionLabel: string) => {
  console.log(`恢复操作完成: ${actionLabel}`)
}

const handleErrorReport = (error: ExcelAnalyzeError) => {
  console.log('用户反馈错误:', error)
}

// 数据验证方法
const validateData = async () => {
  try {
    // 设置验证状态（如果还没设置的话）
    if (!validating.value) {
      validating.value = true
    }
    validationResult.value = null
    importLogs.value = []

    // 记录开始时间，确保最少显示2秒
    const startTime = Date.now()
    const minDisplayTime = 2000 // 最少显示2秒

    // 获取文件名和转换状态
    const fileName = props.importSummary?.fileName
    const hasTransformedData = props.importSummary?.hasTransformedData
    
    if (!fileName) {
      ElMessage.error('无法获取文件名，验证失败')
      return
    }

    // 调用数据验证API，传递文件名和转换状态
    const response = await excelAnalyzeApi.validateImportData(props.sessionId, fileName, hasTransformedData)
    
    validationResult.value = response
    ElMessage.success('数据验证完成')
    
    // 计算已经过去的时间
    const elapsedTime = Date.now() - startTime
    
    // 如果还没到2秒，等待剩余时间
    if (elapsedTime < minDisplayTime) {
      const remainingTime = minDisplayTime - elapsedTime
      await new Promise(resolve => setTimeout(resolve, remainingTime))
    }
  } catch (error: any) {
    console.error('数据验证失败:', error)
    validationResult.value = null
    importError.value = ExcelAnalyzeErrorHandler.handleApiError(error, 'validate_data')
    ExcelAnalyzeErrorHandler.showError(importError.value)
  } finally {
    validating.value = false
  }
}

// 验证状态相关方法
const getValidationTagType = (): 'success' | 'warning' | 'danger' | 'info' => {
  if (!validationResult.value) return 'info'
  
  if (validationResult.value.errorRows === 0) return 'success'
  if (validationResult.value.validRows === 0) return 'danger'
  return 'warning'
}

const getValidationStatus = (): string => {
  if (!validationResult.value) return '验证中'
  
  if (validationResult.value.errorRows === 0) return '验证通过'
  if (validationResult.value.validRows === 0) return '验证失败'
  return '部分通过'
}

// 获取错误按钮类型
const getErrorButtonType = (): 'danger' | 'warning' => {
  if (!validationResult.value) return 'danger'
  
  // 如果有错误，显示红色按钮
  if (validationResult.value.errorRows > 0) return 'danger'
  // 如果只有警告，显示橙色按钮
  return 'warning'
}

// 获取错误按钮文本
const getErrorButtonText = (): string => {
  if (!validationResult.value) return '错误详情'
  
  // 如果有错误，显示"错误详情"
  if (validationResult.value.errorRows > 0) return '错误详情'
  // 如果只有警告，显示"警告详情"
  return '警告详情'
}

// 获取总问题数量
const getTotalIssuesCount = (): number => {
  if (!validationResult.value) return 0
  
  // 返回错误和警告的总数
  return validationResult.value.errorRows + validationResult.value.warningRows
}

// 获取问题类型文本
const getIssueTypeText = (): string => {
  if (!validationResult.value) return '问题'
  
  // 如果只有错误，显示"错误"
  if (validationResult.value.errorRows > 0 && validationResult.value.warningRows === 0) {
    return '错误'
  }
  // 如果只有警告，显示"警告"
  if (validationResult.value.errorRows === 0 && validationResult.value.warningRows > 0) {
    return '警告'
  }
  // 如果既有错误又有警告，显示"问题"
  return '问题'
}

// 获取验证提示标题
const getValidationAlertTitle = (): string => {
  if (!validationResult.value) return ''
  
  const errorCount = validationResult.value.errorRows
  const warningCount = validationResult.value.warningRows
  
  if (errorCount > 0 && warningCount === 0) {
    return `发现 ${errorCount} 个验证错误，请点击上方按钮查看详细信息`
  } else if (errorCount === 0 && warningCount > 0) {
    return `发现 ${warningCount} 个验证警告，请点击上方按钮查看详细信息`
  } else if (errorCount > 0 && warningCount > 0) {
    return `发现 ${errorCount} 个验证错误和 ${warningCount} 个验证警告，请点击上方按钮查看详细信息`
  }
  
  return ''
}

// 获取验证提示类型
const getValidationAlertType = (): 'error' | 'warning' => {
  if (!validationResult.value) return 'warning'
  
  // 如果有错误，显示错误类型
  if (validationResult.value.errorRows > 0) return 'error'
  // 如果只有警告，显示警告类型
  return 'warning'
}

const getErrorTypeTag = (errorType: string): 'danger' | 'warning' | 'info' => {
  switch (errorType) {
    case 'REQUIRED':
      return 'danger'
    case 'FORMAT':
      return 'warning'
    case 'LENGTH':
      return 'warning'
    default:
      return 'info'
  }
}

const getErrorTypeLabel = (errorType: string): string => {
  switch (errorType) {
    case 'REQUIRED':
      return '必填'
    case 'FORMAT':
      return '格式'
    case 'LENGTH':
      return '长度'
    default:
      return '其他'
  }
}

// 错误详情弹窗相关
const errorDetailsVisible = ref(false)

const showErrorDetails = () => {
  errorDetailsVisible.value = true
}

// 获取显示的文件名
const getDisplayFileName = () => {
  if (!props.importSummary?.fileName) {
    return '未知文件'
  }
  
  // 如果当前验证的是转换后的数据，显示转换后的文件名
  if (validationResult.value?.dataType === 'TRANSFORMED') {
    // 简化转换后的文件名，只保留基础名称和转换标识
    const baseName = props.importSummary.fileName.replace('.xlsx', '')
    return `${baseName}_transformed.xlsx`
  }
  
  // 否则显示原始文件名
  return props.importSummary.fileName
}

// 下载文件方法
const downloadFile = async () => {
  if (!props.importSummary?.fileName) {
    ElMessage.warning('没有可下载的文件')
    return
  }
  
  downloading.value = true
  
  try {
    let blob: Blob
    let fileName: string
    
    // 根据当前验证的数据类型决定下载哪种文件
    if (validationResult.value?.dataType === 'TRANSFORMED') {
      // 下载转换后的文件
      blob = await excelAnalyzeApi.downloadTransformedFile(props.sessionId, {
        fileName: getDisplayFileName()
      })
      fileName = getDisplayFileName()
    } else {
      // 下载原始文件
      blob = await excelAnalyzeApi.downloadOriginalFile(props.sessionId, {
        fileName: props.importSummary.fileName
      })
      fileName = props.importSummary.fileName
    }
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    
    // 添加到DOM并触发下载
    document.body.appendChild(link)
    link.click()
    
    // 清理DOM和URL
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    const downloadType = validationResult.value?.dataType === 'TRANSFORMED' ? '转换后的文件' : '原始文件'
    ElMessage.success(`${downloadType}下载已开始`)
  } catch (error) {
    console.error('下载文件失败:', error)
    ElMessage.error('下载文件失败，请重试')
  } finally {
    downloading.value = false
  }
}



onUnmounted(() => {
  stopProgressPolling()
})
</script>

<style scoped lang="scss">
.import-confirm-step {
  .confirm-header {
    text-align: center;
    margin-bottom: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    
    h3 {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 20px;
      font-weight: 600;
    }
    
    .confirm-description {
      margin: 0;
      color: #606266;
      font-size: 14px;
      line-height: 1.5;
    }
  }
  
  .import-summary {
    margin-bottom: 24px;
    
    .summary-card {
      border-radius: 8px;
      border: 1px solid #e4e7ed;
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #f0f0f0;
        
        .header-title {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          
          .header-icon {
            margin-right: 8px;
            color: #409eff;
          }
        }
      }
    }
    
    .summary-item {
      text-align: center;
      padding: 16px 12px;
      border-radius: 8px;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border: 1px solid #e4e7ed;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .summary-icon {
        margin-bottom: 8px;
        
        .el-icon {
          font-size: 20px;
          color: #909399;
        }
      }
      
      .summary-value {
        font-size: 28px;
        font-weight: 700;
        color: #303133;
        margin-bottom: 6px;
        line-height: 1;
      }
      
      .summary-label {
        font-size: 13px;
        color: #606266;
        font-weight: 500;
      }
      
      &.success {
        background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
        border-color: #b3d8ff;
        
        .summary-icon .el-icon {
          color: #67c23a;
        }
        
        .summary-value {
          color: #67c23a;
        }
      }
      
      &.error {
        background: linear-gradient(135deg, #fef0f0 0%, #ffe6e6 100%);
        border-color: #fbc4c4;
        
        .summary-icon .el-icon {
          color: #f56c6c;
        }
        
        .summary-value {
          color: #f56c6c;
        }
      }
      
      &.warning {
        background: linear-gradient(135deg, #fdf6ec 0%, #fef7e6 100%);
        border-color: #f5dab1;
        
        .summary-icon .el-icon {
          color: #e6a23c;
        }
        
        .summary-value {
          color: #e6a23c;
        }
      }
    }
    
    .file-info {
      margin-top: 20px;
      
      .divider-title {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
        color: #606266;
        
        .el-icon {
          margin-right: 6px;
          color: #409eff;
        }
      }
      
      .file-name-container {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .download-btn {
          padding: 4px 8px;
          font-size: 12px;
          height: auto;
          line-height: 1.2;
          border-radius: 4px;
          
          .el-icon {
            margin-right: 4px;
          }
        }
      }
    }
  }
  
  .validation-result {
    margin-bottom: 24px;
    
    .validation-card {
      border-radius: 8px;
      border: 1px solid #e4e7ed;
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #f0f0f0;
        
        .header-title {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          
          .header-icon {
            margin-right: 8px;
            color: #409eff;
          }
        }
      }
      
      .header-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .validating-status {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #606266;
        font-size: 14px;
        font-weight: 500;
      }

      .validating-content {
        text-align: center;
        padding: 30px 0;

        .validating-text {
          margin-top: 15px;
          color: #606266;
          font-size: 16px;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .validating-detail {
          margin: 0;
          color: #909399;
          font-size: 14px;
        }
      }

      .validation-content {
        .data-status-info {
          margin-bottom: 20px;
        }

        .validation-item {
          text-align: center;
          padding: 16px 12px;
          border-radius: 8px;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border: 1px solid #e4e7ed;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          min-height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .validation-icon {
            margin-bottom: 8px;
            
            .el-icon {
              font-size: 20px;
              color: #909399;
            }
          }
          
          .validation-value {
            font-size: 28px;
            font-weight: 700;
            color: #303133;
            margin-bottom: 6px;
            line-height: 1;
          }
          
          .validation-label {
            font-size: 13px;
            color: #606266;
            font-weight: 500;
            margin-bottom: 8px;
          }
          
          &.success {
            background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
            border-color: #b3d8ff;
            
            .validation-icon .el-icon {
              color: #67c23a;
            }
            
            .validation-value {
              color: #67c23a;
            }
          }
          
          &.error {
            background: linear-gradient(135deg, #fef0f0 0%, #ffe6e6 100%);
            border-color: #fbc4c4;
            
            .validation-icon .el-icon {
              color: #f56c6c;
            }
            
            .validation-value {
              color: #f56c6c;
            }
          }
          
          &.warning {
            background: linear-gradient(135deg, #fdf6ec 0%, #fef7e6 100%);
            border-color: #f5dab1;
            
            .validation-icon .el-icon {
              color: #e6a23c;
            }
            
            .validation-value {
              color: #e6a23c;
            }
          }
        }
        
        .error-actions {
          margin: 20px 0;
          text-align: center;
          
          .error-details-btn-main {
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 500;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
            
            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
            }
          }
        }
        
        .validation-errors-tip {
          margin-top: 16px;
        }
      }
    }
  }
  
  .import-options {
    margin-bottom: 24px;
    
    .options-card {
      border-radius: 8px;
      border: 1px solid #e4e7ed;
      
      .card-header {
        padding: 16px 20px;
        border-bottom: 1px solid #f0f0f0;
        
        .header-title {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          
          .header-icon {
            margin-right: 8px;
            color: #409eff;
          }
        }
      }
    }
    
    .option-tip {
      margin-left: 10px;
      color: #909399;
      font-size: 12px;
    }
    
    .table-info {
      .table-display {
        margin-bottom: 12px;
        
        .el-tag {
          font-size: 14px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
        }
      }
      
      .table-details {
        .table-label {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: #606266;
          font-weight: 500;
        }
        
        .table-code {
          margin: 0 0 4px 0;
          font-size: 12px;
          color: #909399;
          font-family: 'Courier New', monospace;
        }
        
        .subset-code {
          margin: 0;
          font-size: 12px;
          color: #67c23a;
          font-weight: 500;
        }
      }
    }
  }
  
  .import-progress {
    margin-bottom: 20px;
    
    .progress-content {
      margin-bottom: 20px;
      
      .progress-info {
        margin-top: 15px;
        text-align: center;
        
        .progress-text {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #303133;
        }
        
        .progress-detail {
          margin: 0;
          font-size: 12px;
          color: #909399;
        }
      }
    }
    
    .import-logs {
      h4 {
        margin: 0 0 10px 0;
        color: #303133;
        font-size: 14px;
        font-weight: 600;
      }
      
      .logs-container {
        max-height: 200px;
        overflow-y: auto;
        background-color: #f8f9fa;
        border-radius: 4px;
        padding: 10px;
        
        .log-item {
          display: flex;
          gap: 10px;
          margin-bottom: 5px;
          font-size: 12px;
          
          .log-time {
            color: #909399;
            white-space: nowrap;
          }
          
          .log-message {
            flex: 1;
          }
          
          &.info {
            color: #303133;
          }
          
          &.success {
            color: #67c23a;
          }
          
          &.warning {
            color: #e6a23c;
          }
          
          &.error {
            color: #f56c6c;
          }
        }
      }
    }
  }
  
  .import-result {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .success-result,
    .error-result {
      :deep(.el-result) {
        padding: 20px 0;
      }
      
      .success-actions {
        margin-top: 20px;
        
        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-top: 16px;
          
          .el-button {
            min-width: 140px;
            padding: 12px 20px;
            font-weight: 500;
            border-radius: 8px;
            transition: all 0.3s ease;
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .el-icon {
              margin-right: 6px;
            }
          }
        }
      }
    }
  }
  
  .step-actions {
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid #f0f0f0;
    margin-top: 30px;
    
    .el-button {
      margin: 0 8px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      &.el-button--success {
        background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
        border-color: #67c23a;
        
        &:hover {
          background: linear-gradient(135deg, #85ce61 0%, #95d475 100%);
          border-color: #85ce61;
        }
      }
      
      &.el-button--danger {
        background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
        border-color: #f56c6c;
        
        &:hover {
          background: linear-gradient(135deg, #f78989 0%, #f89898 100%);
          border-color: #f78989;
        }
      }
    }
  }
}

// 弹窗加载遮罩层样式
:deep(.el-dialog) {
  .dialog-loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    
    .loading-content {
      text-align: center;
      
      .el-icon {
        font-size: 32px;
        color: #409eff;
        margin-bottom: 15px;
      }
      
      .loading-text {
        margin: 0 0 8px 0;
        font-size: 16px;
        color: #303133;
        font-weight: 500;
      }
      
      .loading-detail {
        margin: 0;
        font-size: 14px;
        color: #909399;
      }
    }
  }
}
</style>