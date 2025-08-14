<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    width="500px"
    :close-on-click-modal="false"
    :show-close="false"
    center
    class="progress-dialog"
  >
    <div class="progress-content">
      <!-- 进度条 -->
      <div class="progress-section">
        <el-progress
          :percentage="percentage"
          :status="getProgressStatus(status)"
          :stroke-width="8"
          :show-text="false"
        />
        <div class="progress-text">{{ percentage }}%</div>
      </div>

      <!-- 状态信息 -->
      <div class="status-section">
        <div class="status-text" :class="`status-${status}`">
          <el-icon v-if="status === 'success'" class="status-icon">
            <SuccessFilled />
          </el-icon>
          <el-icon v-else-if="status === 'exception' || status === 'error'" class="status-icon">
            <CircleCloseFilled />
          </el-icon>
          <el-icon v-else-if="status === 'warning'" class="status-icon">
            <WarningFilled />
          </el-icon>
          <el-icon v-else class="status-icon loading">
            <Loading />
          </el-icon>
          {{ statusText }}
        </div>
        
        <!-- 详细信息 -->
        <div v-if="detailInfo" class="detail-info">
          {{ detailInfo }}
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          v-if="status === 'success' || status === 'exception' || status === 'error'"
          type="primary"
          @click="handleClose"
        >
          {{ status === 'success' ? '完成' : '关闭' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { SuccessFilled, CircleCloseFilled, WarningFilled, Loading } from '@element-plus/icons-vue'

// 定义组件属性
interface Props {
  modelValue: boolean
  title: string
  percentage: number
  status: 'success' | 'exception' | 'warning' | 'error' | 'loading' | '' | undefined
  statusText: string
  detailInfo?: string
}

// 定义事件
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '处理中...',
  percentage: 0,
  status: '',
  statusText: '正在处理...',
  detailInfo: ''
})

const emit = defineEmits<Emits>()

// 映射状态到element-plus进度条支持的状态
const getProgressStatus = (status: string | undefined): 'success' | 'exception' | 'warning' | '' | undefined => {
  if (status === 'error') return 'exception'
  if (status === 'loading') return ''
  if (status === 'success') return 'success'
  if (status === 'warning') return 'warning'
  if (status === 'exception') return 'exception'
  return ''
}

// 关闭对话框
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped>
.progress-dialog {
  :deep(.el-dialog__body) {
    padding: 30px 20px;
  }
  
  :deep(.el-dialog__footer) {
    padding: 15px 20px 20px;
    text-align: center;
  }
}

.progress-content {
  text-align: center;
}

.progress-section {
  margin-bottom: 30px;
  
  .progress-text {
    margin-top: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #409eff;
  }
}

.status-section {
  .status-text {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 15px;
    
    .status-icon {
      margin-right: 8px;
      font-size: 18px;
      
      &.loading {
        animation: rotate 2s linear infinite;
      }
    }
    
    &.status-success {
      color: #67c23a;
    }
    
    &.status-exception,
    &.status-error {
      color: #f56c6c;
    }
    
    &.status-warning {
      color: #e6a23c;
    }
    
    &.status-loading,
    &.status- {
      color: #409eff;
    }
  }
  
  .detail-info {
    font-size: 14px;
    color: #606266;
    line-height: 1.5;
    background-color: #f5f7fa;
    padding: 12px 16px;
    border-radius: 6px;
    border: 1px solid #e4e7ed;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>