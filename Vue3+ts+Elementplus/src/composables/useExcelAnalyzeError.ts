import { ref, computed } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { 
  ExcelAnalyzeErrorHandler, 
  type ExcelAnalyzeError, 
  type RecoveryAction,
  ERROR_CODES 
} from '@/utils/excelAnalyzeErrorHandler'

/**
 * Excel解析错误处理组合式函数
 */
export function useExcelAnalyzeError() {
  // 当前错误状态
  const currentError = ref<ExcelAnalyzeError | null>(null)
  const errorHistory = ref<ExcelAnalyzeError[]>([])
  const isRecovering = ref(false)

  // 计算属性
  const hasError = computed(() => !!currentError.value)
  const errorCount = computed(() => errorHistory.value.length)
  const canRecover = computed(() => hasError.value && !isRecovering.value)

  /**
   * 处理错误
   */
  const handleError = (
    error: any, 
    context?: string,
    options?: {
      showMessage?: boolean
      showNotification?: boolean
      addToHistory?: boolean
      autoRecover?: boolean
    }
  ) => {
    const { 
      showMessage = true, 
      showNotification = false, 
      addToHistory = true,
      autoRecover = false
    } = options || {}

    // 解析错误
    let excelError: ExcelAnalyzeError
    
    if (error instanceof Error) {
      excelError = ExcelAnalyzeErrorHandler.handleApiError(error, context)
    } else if (typeof error === 'object' && error.code) {
      excelError = error as ExcelAnalyzeError
    } else {
      excelError = {
        code: ERROR_CODES.UNKNOWN_ERROR,
        message: String(error) || '未知错误',
        detail: context ? `上下文: ${context}` : undefined
      }
    }

    // 设置当前错误
    currentError.value = excelError

    // 添加到历史记录
    if (addToHistory) {
      errorHistory.value.push({
        ...excelError,
        timestamp: Date.now()
      } as ExcelAnalyzeError & { timestamp: number })
    }

    // 显示错误消息
    if (showMessage) {
      ExcelAnalyzeErrorHandler.showError(excelError, {
        showSuggestions: !showNotification
      })
    }

    // 显示通知
    if (showNotification) {
      ExcelAnalyzeErrorHandler.showSuggestions(excelError)
    }

    // 自动恢复
    if (autoRecover) {
      attemptAutoRecover(excelError)
    }

    return excelError
  }

  /**
   * 处理文件上传错误
   */
  const handleFileUploadError = (error: any, file?: File) => {
    const excelError = ExcelAnalyzeErrorHandler.handleFileUploadError(error, file)
    currentError.value = excelError
    errorHistory.value.push(excelError)
    
    // 显示错误信息
    ExcelAnalyzeErrorHandler.showError(excelError)
    
    return excelError
  }

  /**
   * 处理字段匹配错误
   */
  const handleFieldMatchingError = (
    error: any, 
    context?: {
      missingFields?: string[]
      duplicateHeaders?: string[]
    }
  ) => {
    const excelError = ExcelAnalyzeErrorHandler.handleFieldMatchingError(error, context)
    currentError.value = excelError
    errorHistory.value.push(excelError)
    
    // 显示错误信息
    ExcelAnalyzeErrorHandler.showError(excelError)
    
    return excelError
  }

  /**
   * 处理数据验证错误
   */
  const handleDataValidationError = (
    error: any,
    context?: {
      errorRows?: number[]
      errorFields?: string[]
    }
  ) => {
    const excelError = ExcelAnalyzeErrorHandler.handleDataValidationError(error, context)
    currentError.value = excelError
    errorHistory.value.push(excelError)
    
    // 显示错误信息
    ExcelAnalyzeErrorHandler.showError(excelError)
    
    return excelError
  }

  /**
   * 处理导入错误
   */
  const handleImportError = (
    error: any,
    context?: {
      processedRows?: number
      totalRows?: number
    }
  ) => {
    const excelError = ExcelAnalyzeErrorHandler.handleImportError(error, context)
    currentError.value = excelError
    errorHistory.value.push(excelError)
    
    // 显示错误信息
    ExcelAnalyzeErrorHandler.showError(excelError)
    
    return excelError
  }

  /**
   * 清除当前错误
   */
  const clearError = () => {
    currentError.value = null
  }

  /**
   * 清除所有错误历史
   */
  const clearErrorHistory = () => {
    errorHistory.value = []
    currentError.value = null
  }

  /**
   * 执行恢复操作
   */
  const executeRecovery = async (action: RecoveryAction) => {
    if (!canRecover.value) return

    try {
      isRecovering.value = true
      await action.action()
      
      // 恢复成功，清除当前错误
      clearError()
      ElMessage.success(`${action.label}操作完成`)
    } catch (recoveryError) {
      console.error('恢复操作失败:', recoveryError)
      ElMessage.error(`${action.label}操作失败`)
      
      // 处理恢复失败的错误
      handleError(recoveryError, 'recovery_failed', {
        showMessage: true,
        addToHistory: false
      })
    } finally {
      isRecovering.value = false
    }
  }

  /**
   * 尝试自动恢复
   */
  const attemptAutoRecover = async (error: ExcelAnalyzeError) => {
    // 根据错误类型尝试自动恢复
    switch (error.code) {
      case ERROR_CODES.SESSION_EXPIRED:
        // 会话过期，尝试重新创建会话
        ElNotification({
          title: '会话已过期',
          message: '正在尝试重新建立连接...',
          type: 'warning',
          duration: 3000
        })
        break
        
      case ERROR_CODES.NETWORK_ERROR:
        // 网络错误，延迟后重试
        ElNotification({
          title: '网络连接异常',
          message: '将在3秒后自动重试...',
          type: 'warning',
          duration: 3000
        })
        break
        
      default:
        // 其他错误不进行自动恢复
        break
    }
  }

  /**
   * 获取错误统计信息
   */
  const getErrorStats = () => {
    const stats = {
      total: errorHistory.value.length,
      byType: {} as Record<string, number>,
      recent: errorHistory.value.slice(-5) // 最近5个错误
    }

    errorHistory.value.forEach(error => {
      stats.byType[error.code] = (stats.byType[error.code] || 0) + 1
    })

    return stats
  }

  /**
   * 导出错误报告
   */
  const exportErrorReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      currentError: currentError.value,
      errorHistory: errorHistory.value,
      stats: getErrorStats(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `excel-analyze-error-report-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)

    ElMessage.success('错误报告已导出')
  }

  /**
   * 显示错误详情对话框
   */
  const showErrorDialog = async (error?: ExcelAnalyzeError, recoveryActions?: RecoveryAction[]) => {
    const targetError = error || currentError.value
    if (!targetError) return

    await ExcelAnalyzeErrorHandler.showErrorDialog(targetError, recoveryActions)
  }

  /**
   * 创建恢复操作
   */
  const createRecoveryActions = (context: {
    onRetry?: () => void | Promise<void>
    onReset?: () => void | Promise<void>
    onSkip?: () => void | Promise<void>
    onDownloadTemplate?: () => void | Promise<void>
  }): RecoveryAction[] => {
    return ExcelAnalyzeErrorHandler.createRecoveryActions(context)
  }

  /**
   * 监听全局错误
   */
  const setupGlobalErrorHandler = () => {
    // 监听未捕获的Promise错误
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && typeof event.reason === 'object') {
        // 检查是否是Excel解析相关的错误
        if (event.reason.message?.includes('excel') || 
            event.reason.message?.includes('import') ||
            event.reason.message?.includes('upload')) {
          handleError(event.reason, 'unhandled_promise_rejection', {
            showMessage: true,
            addToHistory: true
          })
          event.preventDefault() // 阻止默认的错误处理
        }
      }
    })

    // 监听全局错误
    window.addEventListener('error', (event) => {
      if (event.error && typeof event.error === 'object') {
        // 检查是否是Excel解析相关的错误
        if (event.error.message?.includes('excel') || 
            event.error.message?.includes('import') ||
            event.error.message?.includes('upload')) {
          handleError(event.error, 'global_error', {
            showMessage: false, // 避免重复显示
            addToHistory: true
          })
        }
      }
    })
  }

  return {
    // 状态
    currentError,
    errorHistory,
    isRecovering,
    hasError,
    errorCount,
    canRecover,

    // 方法
    handleError,
    handleFileUploadError,
    handleFieldMatchingError,
    handleDataValidationError,
    handleImportError,
    clearError,
    clearErrorHistory,
    executeRecovery,
    attemptAutoRecover,
    getErrorStats,
    exportErrorReport,
    showErrorDialog,
    createRecoveryActions,
    setupGlobalErrorHandler
  }
}

// 创建全局实例
export const globalExcelErrorHandler = useExcelAnalyzeError()