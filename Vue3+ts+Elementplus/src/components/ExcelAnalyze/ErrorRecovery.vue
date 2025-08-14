<template>
  <div class="error-recovery">
    <!-- 错误信息展示 -->
    <el-alert
      :title="errorInfo.title"
      :type="alertType"
      :description="errorInfo.message"
      show-icon
      :closable="false"
      class="error-alert"
    />

    <!-- 数据验证错误特殊处理 -->
    <div v-if="isDataValidationError" class="data-validation-error">
      <el-alert
        title="数据格式错误"
        type="warning"
        :description="dataValidationMessage"
        show-icon
        :closable="false"
        class="validation-alert"
      />
      
      <div class="validation-help">
        <h4>常见问题解决方案：</h4>
        <ul>
          <li><strong>数值超出范围：</strong>检查Excel中的数值是否在合理范围内</li>
          <li><strong>文本过长：</strong>检查文本内容是否超过字段长度限制</li>
          <li><strong>格式错误：</strong>确保日期、编码等格式正确</li>
          <li><strong>空值处理：</strong>确保必填字段不为空</li>
        </ul>
      </div>
    </div>

    <!-- 错误详情 -->
    <div v-if="error.detail" class="error-detail">
      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="错误详情" name="detail">
          <p class="detail-text">{{ error.detail }}</p>
          <div v-if="error.field" class="error-context">
            <el-tag size="small" type="info">字段：{{ error.field }}</el-tag>
          </div>
          <div v-if="error.row !== undefined" class="error-context">
            <el-tag size="small" type="warning">行号：{{ error.row }}</el-tag>
          </div>
          <div v-if="error.column !== undefined" class="error-context">
            <el-tag size="small" type="warning">列号：{{ error.column }}</el-tag>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 解决建议 -->
    <div v-if="error.suggestions?.length" class="error-suggestions">
      <h4 class="suggestions-title">
        <el-icon><InfoFilled /></el-icon>
        解决建议
      </h4>
      <ul class="suggestions-list">
        <li
          v-for="(suggestion, index) in error.suggestions"
          :key="index"
          class="suggestion-item"
        >
          <el-icon class="suggestion-icon"><ArrowRight /></el-icon>
          {{ suggestion }}
        </li>
      </ul>
    </div>

    <!-- 恢复操作按钮 -->
    <div v-if="recoveryActions?.length" class="recovery-actions">
      <h4 class="actions-title">
        <el-icon><Tools /></el-icon>
        恢复操作
      </h4>
      <div class="actions-buttons">
        <el-button
          v-for="action in recoveryActions"
          :key="action.label"
          :type="action.type || 'primary'"
          :loading="actionLoading[action.label]"
          @click="handleAction(action)"
          class="action-button"
        >
          {{ action.label }}
        </el-button>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <el-button
        type="info"
        size="small"
        @click="copyErrorInfo"
        :icon="CopyDocument"
      >
        复制错误信息
      </el-button>
      <el-button
        type="info"
        size="small"
        @click="reportError"
        :icon="Warning"
      >
        反馈问题
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  InfoFilled,
  ArrowRight,
  Tools,
  CopyDocument,
  Warning
} from '@element-plus/icons-vue'
import type { ExcelAnalyzeError, RecoveryAction } from '@/utils/excelAnalyzeErrorHandler'
import { ERROR_CODES } from '@/utils/excelAnalyzeErrorHandler'

// 组件属性
interface Props {
  error: ExcelAnalyzeError
  recoveryActions?: RecoveryAction[]
  showSuggestions?: boolean
  showActions?: boolean
}

// 组件事件
interface Emits {
  (e: 'action-complete', actionLabel: string): void
  (e: 'error-reported', error: ExcelAnalyzeError): void
}

const props = withDefaults(defineProps<Props>(), {
  showSuggestions: true,
  showActions: true
})

const emit = defineEmits<Emits>()

// 响应式数据
const activeCollapse = ref<string[]>([])
const actionLoading = reactive<Record<string, boolean>>({})

// 错误信息映射
const ERROR_INFO_MAP: Record<string, { title: string; type: string }> = {
  [ERROR_CODES.FILE_TOO_LARGE]: { title: '文件过大', type: 'warning' },
  [ERROR_CODES.FILE_FORMAT_INVALID]: { title: '文件格式错误', type: 'error' },
  [ERROR_CODES.FILE_CORRUPTED]: { title: '文件损坏', type: 'error' },
  [ERROR_CODES.FILE_EMPTY]: { title: '文件为空', type: 'warning' },
  [ERROR_CODES.FILE_UPLOAD_FAILED]: { title: '上传失败', type: 'error' },
  [ERROR_CODES.HEADER_NOT_FOUND]: { title: '表头缺失', type: 'warning' },
  [ERROR_CODES.HEADER_DUPLICATE]: { title: '表头重复', type: 'warning' },
  [ERROR_CODES.REQUIRED_FIELD_MISSING]: { title: '必填字段缺失', type: 'error' },
  [ERROR_CODES.FIELD_MAPPING_INVALID]: { title: '字段映射错误', type: 'error' },
  [ERROR_CODES.DATA_TYPE_MISMATCH]: { title: '数据类型错误', type: 'error' },
  [ERROR_CODES.DATA_LENGTH_EXCEEDED]: { title: '数据长度超限', type: 'warning' },
  [ERROR_CODES.DATA_FORMAT_INVALID]: { title: '数据格式错误', type: 'error' },
  [ERROR_CODES.REQUIRED_VALUE_MISSING]: { title: '必填值缺失', type: 'error' },
  [ERROR_CODES.DICT_VALUE_NOT_FOUND]: { title: '字典值未找到', type: 'warning' },
  [ERROR_CODES.TRANSFORM_RULE_ERROR]: { title: '转换规则错误', type: 'error' },
  [ERROR_CODES.DICT_MAPPING_FAILED]: { title: '字典映射失败', type: 'warning' },
  [ERROR_CODES.CUSTOM_RULE_ERROR]: { title: '自定义规则错误', type: 'error' },
  [ERROR_CODES.IMPORT_PERMISSION_DENIED]: { title: '权限不足', type: 'error' },
  [ERROR_CODES.IMPORT_CONFLICT]: { title: '导入冲突', type: 'warning' },
  [ERROR_CODES.IMPORT_TIMEOUT]: { title: '导入超时', type: 'warning' },
  [ERROR_CODES.IMPORT_CANCELLED]: { title: '导入已取消', type: 'info' },
  [ERROR_CODES.SESSION_EXPIRED]: { title: '会话过期', type: 'warning' },
  [ERROR_CODES.NETWORK_ERROR]: { title: '网络错误', type: 'error' },
  [ERROR_CODES.SERVER_ERROR]: { title: '服务器错误', type: 'error' },
  [ERROR_CODES.UNKNOWN_ERROR]: { title: '未知错误', type: 'error' }
}

// 计算属性
const errorInfo = computed(() => {
  const info = ERROR_INFO_MAP[props.error.code]
  return {
    title: info?.title || '操作失败',
    message: props.error.message
  }
})

const alertType = computed(() => {
  const info = ERROR_INFO_MAP[props.error.code]
  return (info?.type || 'error') as 'success' | 'warning' | 'info' | 'error'
})

// 数据验证错误特殊处理
const isDataValidationError = computed(() => {
  const message = props.error.message
  return message && (
    message.includes('数据验证失败') ||
    message.includes('数据格式错误') ||
    message.includes('字段') && message.includes('超出范围') ||
    message.includes('Data truncated for column')
  )
})

const dataValidationMessage = computed(() => {
  const message = props.error.message
  
  // 如果是数据验证错误，提取具体的错误信息
  if (isDataValidationError.value) {
    // 尝试从错误信息中提取字段名和具体问题
    const fieldMatch = message.match(/字段 ['"]([^'"]+)['"]/)
    const fieldName = fieldMatch ? fieldMatch[1] : ''
    
    if (message.includes('实习时长')) {
      return `实习时长字段的值超出范围。数值必须在 -32,768 到 32,767 之间，请检查Excel数据中的实习时长数值。`
    } else if (message.includes('成绩')) {
      return `成绩字段的值超出范围。请检查Excel数据中的成绩数值是否合理。`
    } else if (message.includes('报酬') || message.includes('金额')) {
      return `金额字段的值超出范围。请检查Excel数据中的金额数值是否合理。`
    } else if (message.includes('过长')) {
      return `文本内容过长。请检查Excel数据中的文本长度是否超过字段限制。`
    } else if (fieldName) {
      return `字段 '${fieldName}' 的数据格式不正确或超出范围限制。请检查Excel数据中的相关字段。`
    } else {
      return `数据格式不正确，某些字段的值超出了数据库的限制范围。请检查Excel数据中的数值和文本长度。`
    }
  }
  
  return message
})

// 方法
const handleAction = async (action: RecoveryAction) => {
  try {
    actionLoading[action.label] = true
    await action.action()
    emit('action-complete', action.label)
    ElMessage.success(`${action.label}操作完成`)
  } catch (error) {
    console.error(`恢复操作失败:`, error)
    ElMessage.error(`${action.label}操作失败`)
  } finally {
    actionLoading[action.label] = false
  }
}

const copyErrorInfo = async () => {
  try {
    const errorText = `
错误代码: ${props.error.code}
错误信息: ${props.error.message}
${props.error.detail ? `详细说明: ${props.error.detail}` : ''}
${props.error.field ? `相关字段: ${props.error.field}` : ''}
${props.error.row !== undefined ? `错误行号: ${props.error.row}` : ''}
${props.error.column !== undefined ? `错误列号: ${props.error.column}` : ''}
发生时间: ${new Date().toLocaleString()}
    `.trim()

    await navigator.clipboard.writeText(errorText)
    ElMessage.success('错误信息已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败，请手动选择文本复制')
  }
}

const reportError = () => {
  emit('error-reported', props.error)
  ElMessage.info('感谢您的反馈，我们会尽快处理')
}
</script>

<style scoped lang="scss">
.error-recovery {
  .error-alert {
    margin-bottom: 16px;
  }

  .data-validation-error {
    margin-bottom: 16px;

    .validation-alert {
      margin-bottom: 12px;
    }

    .validation-help {
      background-color: #f0f9ff;
      border: 1px solid #b3d8ff;
      border-radius: 4px;
      padding: 12px;
      margin-top: 12px;

      h4 {
        margin: 0 0 8px 0;
        color: #1890ff;
        font-size: 14px;
        font-weight: 600;
      }

      ul {
        margin: 0;
        padding-left: 20px;
        color: #606266;
        font-size: 13px;
        line-height: 1.6;

        li {
          margin-bottom: 4px;

          strong {
            color: #303133;
          }
        }
      }
    }
  }

  .error-detail {
    margin-bottom: 16px;

    .detail-text {
      margin: 0 0 12px 0;
      color: #606266;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .error-context {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
  }

  .error-suggestions {
    margin-bottom: 20px;
    padding: 16px;
    background-color: #f0f9ff;
    border-radius: 6px;
    border-left: 4px solid #409eff;

    .suggestions-title {
      margin: 0 0 12px 0;
      color: #409eff;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .suggestions-list {
      margin: 0;
      padding: 0;
      list-style: none;

      .suggestion-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 8px;
        color: #606266;
        font-size: 14px;
        line-height: 1.5;

        .suggestion-icon {
          color: #409eff;
          margin-top: 2px;
          flex-shrink: 0;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .recovery-actions {
    margin-bottom: 20px;
    padding: 16px;
    background-color: #fdf6ec;
    border-radius: 6px;
    border-left: 4px solid #e6a23c;

    .actions-title {
      margin: 0 0 12px 0;
      color: #e6a23c;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .actions-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .action-button {
        min-width: 100px;
      }
    }
  }

  .quick-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #e4e7ed;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .error-recovery {
    .recovery-actions .actions-buttons {
      flex-direction: column;

      .action-button {
        width: 100%;
      }
    }

    .quick-actions {
      flex-direction: column;

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>