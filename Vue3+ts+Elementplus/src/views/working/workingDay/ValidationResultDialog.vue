<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    class="validation-result-dialog"
  >
    <!-- 数据校验进度条 -->
    <div v-if="showProgress" class="validation-progress">
      <div class="progress-header">
        <h4>数据校验进度</h4>
        <p class="progress-subtitle">正在验证数据，请稍候...</p>
      </div>
      
      <div class="progress-container">
        <div class="progress-info">
          <div class="progress-text">
            <span>正在处理数据...</span>
            <span class="progress-percentage">{{ progressPercentage }}%</span>
          </div>
          <el-progress 
            :percentage="progressPercentage" 
            :status="progressStatus"
            :stroke-width="8"
            :show-text="false"
          />
          <div class="progress-details">
            <span>已处理: {{ processedRecords }} / {{ totalRecords }} 条记录</span>
            <span v-if="currentField">当前验证字段: {{ currentField }}</span>
            <span v-if="fieldCount">验证字段: {{ validatedFields || 0 }} / {{ fieldCount }} 个</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="validation-summary">
      <el-alert
        :title="summaryTitle"
        :type="validationResults.length > 0 ? 'error' : 'success'"
        :closable="false"
        show-icon
      >
        <template #default>
          <div class="summary-content">
            <p v-if="validationResults.length > 0">
              发现 <strong>{{ validationResults.length }}</strong> 个数据校验问题，请检查并修正相关数据。
            </p>
            <p v-else>
              所有字段的验证都成功通过，数据质量良好。
            </p>
          </div>
        </template>
      </el-alert>
    </div>

    <!-- 校验失败的结果表格 -->
    <div v-if="validationResults.length > 0" class="validation-details">
      <h4>详细错误信息：</h4>
      <el-table
        :data="validationResults"
        border
        stripe
        style="width: 100%"
        max-height="400"
      >
        <el-table-column prop="fieldName" label="字段名" width="120" />
        <el-table-column prop="fieldLabel" label="字段说明" width="120" />
        <el-table-column prop="fieldValue" label="当前值" width="120" show-overflow-tooltip />
        <el-table-column prop="validationDatabase" label="验证表" width="120" />
        <el-table-column prop="validationField" label="验证字段" width="120" />
        <el-table-column prop="message" label="错误信息" min-width="200" show-overflow-tooltip />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'failed' ? 'danger' : 'warning'" size="small">
              {{ row.status === 'failed' ? '失败' : '错误' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 校验成功的提示 -->
    <div v-else class="validation-success">
      <div class="success-icon">
        <el-icon size="60" color="#67c23a"><CircleCheckFilled /></el-icon>
      </div>
      <div class="success-message">
        <h3>数据校验通过</h3>
        <p>所有字段的验证都成功通过，数据质量良好，可以安全上报。</p>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button 
          v-if="validationResults.length > 0" 
          type="primary" 
          @click="handleExport"
        >
          导出错误报告
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheckFilled } from '@element-plus/icons-vue'

interface ValidationResult {
  fieldName: string
  fieldLabel: string
  fieldValue: any
  validationField: string
  validationDatabase: string
  validationValue: any
  status: 'failed' | 'error'
  message: string
}

interface Props {
  modelValue: boolean
  validationResults: ValidationResult[]
  tableName?: string
  showProgress?: boolean
  progressPercentage?: number
  progressStatus?: 'success' | 'exception' | 'warning' | undefined
  processedRecords?: number
  totalRecords?: number
  currentField?: string
  fieldCount?: number
  validatedFields?: number
}

const props = withDefaults(defineProps<Props>(), {
  tableName: '',
  showProgress: false,
  progressPercentage: 0,
  progressStatus: 'success',
  processedRecords: 0,
  totalRecords: 0,
  currentField: '',
  fieldCount: 0,
  validatedFields: 0
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const title = computed(() => {
  if (props.validationResults.length > 0) {
    return `数据校验结果 - ${props.tableName} (发现 ${props.validationResults.length} 个问题)`
  }
  return `数据校验结果 - ${props.tableName} (校验通过)`
})

const summaryTitle = computed(() => {
  if (props.validationResults.length > 0) {
    return `数据校验失败`
  }
  return `数据校验成功`
})

function handleClose() {
  visible.value = false
}

function handleExport() {
  try {
    const exportData = {
      tableName: props.tableName,
      validationTime: new Date().toISOString(),
      totalErrors: props.validationResults.length,
      errors: props.validationResults
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `validation-report-${props.tableName}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    ElMessage.success('错误报告导出成功')
  } catch (error) {
    ElMessage.error('导出失败：' + error)
  }
}
</script>

<style scoped>
.validation-result-dialog {
  .validation-progress {
    margin-bottom: 20px;
    
    .progress-header {
      margin-bottom: 16px;
      
      h4 {
        margin: 0 0 8px 0;
        color: #303133;
        font-size: 16px;
        font-weight: 600;
      }
      
      .progress-subtitle {
        margin: 0;
        color: #606266;
        font-size: 14px;
      }
    }
    
    .progress-container {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      
      .progress-info {
        .progress-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-weight: 500;
          color: #303133;
        }
        
        .progress-percentage {
          font-size: 16px;
          font-weight: bold;
          color: #409eff;
        }
        
        .progress-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          font-size: 14px;
          color: #606266;
          
          span {
            background: #f0f2f5;
            padding: 4px 8px;
            border-radius: 4px;
            margin-right: 8px;
          }
        }
      }
    }
  }
  
  .validation-summary {
    margin-bottom: 20px;
  }
  
  .summary-content {
    margin-top: 8px;
  }
  
  .validation-details {
    margin-top: 20px;
    
    h4 {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 16px;
    }
  }
  
  .validation-success {
    text-align: center;
    padding: 40px 20px;
    
    .success-icon {
      margin-bottom: 20px;
    }
    
    .success-message {
      h3 {
        margin: 0 0 12px 0;
        color: #67c23a;
        font-size: 20px;
      }
      
      p {
        margin: 0;
        color: #606266;
        font-size: 14px;
      }
    }
  }
  
  .dialog-footer {
    text-align: right;
  }
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #ebeef5;
  padding: 15px 20px;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__footer) {
  border-top: 1px solid #ebeef5;
  padding: 15px 20px;
}
</style> 