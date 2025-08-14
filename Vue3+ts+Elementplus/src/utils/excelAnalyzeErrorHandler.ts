import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import type { AxiosError } from 'axios'

// Excel解析相关错误类型定义
export interface ExcelAnalyzeError {
  code: string
  message: string
  detail?: string
  field?: string
  row?: number
  column?: number
  suggestions?: string[]
  recoveryActions?: RecoveryAction[]
}

export interface RecoveryAction {
  label: string
  action: () => void | Promise<void>
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

// 错误代码常量
export const ERROR_CODES = {
  // 文件上传相关错误
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_FORMAT_INVALID: 'FILE_FORMAT_INVALID',
  FILE_CORRUPTED: 'FILE_CORRUPTED',
  FILE_EMPTY: 'FILE_EMPTY',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  
  // 表头匹配相关错误
  HEADER_NOT_FOUND: 'HEADER_NOT_FOUND',
  HEADER_DUPLICATE: 'HEADER_DUPLICATE',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  FIELD_MAPPING_INVALID: 'FIELD_MAPPING_INVALID',
  
  // 数据验证相关错误
  DATA_TYPE_MISMATCH: 'DATA_TYPE_MISMATCH',
  DATA_LENGTH_EXCEEDED: 'DATA_LENGTH_EXCEEDED',
  DATA_FORMAT_INVALID: 'DATA_FORMAT_INVALID',
  REQUIRED_VALUE_MISSING: 'REQUIRED_VALUE_MISSING',
  DICT_VALUE_NOT_FOUND: 'DICT_VALUE_NOT_FOUND',
  
  // 数据转换相关错误
  TRANSFORM_RULE_ERROR: 'TRANSFORM_RULE_ERROR',
  DICT_MAPPING_FAILED: 'DICT_MAPPING_FAILED',
  CUSTOM_RULE_ERROR: 'CUSTOM_RULE_ERROR',
  
  // 导入相关错误
  IMPORT_PERMISSION_DENIED: 'IMPORT_PERMISSION_DENIED',
  IMPORT_CONFLICT: 'IMPORT_CONFLICT',
  IMPORT_TIMEOUT: 'IMPORT_TIMEOUT',
  IMPORT_CANCELLED: 'IMPORT_CANCELLED',
  
  // 系统相关错误
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const

// 错误信息映射
const ERROR_MESSAGES: Record<string, { title: string; message: string; suggestions?: string[] }> = {
  [ERROR_CODES.FILE_TOO_LARGE]: {
    title: '文件过大',
    message: '上传的Excel文件超过了大小限制',
    suggestions: [
      '请选择小于50MB的Excel文件',
      '可以尝试删除不必要的工作表或数据',
      '建议将大文件分批处理'
    ]
  },
  [ERROR_CODES.FILE_FORMAT_INVALID]: {
    title: '文件格式不支持',
    message: '请上传.xlsx或.xls格式的Excel文件',
    suggestions: [
      '确保文件扩展名为.xlsx或.xls',
      '如果是其他格式，请先转换为Excel格式',
      '检查文件是否损坏'
    ]
  },
  [ERROR_CODES.FILE_CORRUPTED]: {
    title: '文件损坏',
    message: 'Excel文件可能已损坏，无法正常读取',
    suggestions: [
      '尝试用Excel软件打开文件检查',
      '重新保存文件后再次上传',
      '联系文件提供方确认文件完整性'
    ]
  },
  [ERROR_CODES.FILE_EMPTY]: {
    title: '文件为空',
    message: 'Excel文件中没有找到有效数据',
    suggestions: [
      '确保Excel文件包含数据行',
      '检查是否选择了正确的工作表',
      '确认数据从第一行开始'
    ]
  },
  [ERROR_CODES.HEADER_NOT_FOUND]: {
    title: '表头缺失',
    message: 'Excel文件中缺少必要的表头信息',
    suggestions: [
      '确保第一行包含完整的表头',
      '检查表头名称是否正确',
      '参考模板文件的表头格式'
    ]
  },
  [ERROR_CODES.REQUIRED_FIELD_MISSING]: {
    title: '必填字段缺失',
    message: '存在必填字段未匹配到Excel表头',
    suggestions: [
      '检查Excel文件是否包含所有必填字段',
      '手动调整字段匹配关系',
      '下载标准模板重新整理数据'
    ]
  },
  [ERROR_CODES.DATA_TYPE_MISMATCH]: {
    title: '数据类型不匹配',
    message: '数据类型与字段要求不符',
    suggestions: [
      '检查数字字段是否包含文本内容',
      '确认日期格式是否正确',
      '移除特殊字符或空格'
    ]
  },
  [ERROR_CODES.DICT_VALUE_NOT_FOUND]: {
    title: '字典值未找到',
    message: '数据中包含系统不识别的字典值',
    suggestions: [
      '检查数据是否使用了正确的字典值',
      '可以配置自定义匹配规则',
      '联系管理员更新字典数据'
    ]
  },
  [ERROR_CODES.IMPORT_PERMISSION_DENIED]: {
    title: '权限不足',
    message: '您没有执行此导入操作的权限',
    suggestions: [
      '联系管理员申请相应权限',
      '确认当前角色是否有导入权限',
      '检查是否选择了正确的目标表'
    ]
  },
  [ERROR_CODES.SESSION_EXPIRED]: {
    title: '会话已过期',
    message: '当前操作会话已过期，请重新开始',
    suggestions: [
      '点击重新开始按钮',
      '重新上传Excel文件',
      '如果问题持续，请刷新页面'
    ]
  },
  [ERROR_CODES.NETWORK_ERROR]: {
    title: '网络连接异常',
    message: '网络连接不稳定，请检查网络状态',
    suggestions: [
      '检查网络连接是否正常',
      '稍后重试操作',
      '如果问题持续，请联系技术支持'
    ]
  }
}

/**
 * Excel解析错误处理器类
 */
export class ExcelAnalyzeErrorHandler {
  /**
   * 处理API响应错误
   */
  static handleApiError(error: any, context?: string): ExcelAnalyzeError {
    let excelError: ExcelAnalyzeError

    if (error.response) {
      // HTTP错误响应
      const { status, data } = error.response
      excelError = this.parseHttpError(status, data, context)
    } else if (error.request) {
      // 网络错误
      excelError = {
        code: ERROR_CODES.NETWORK_ERROR,
        message: '网络连接失败',
        detail: '请检查网络连接后重试'
      }
    } else {
      // 其他错误
      excelError = {
        code: ERROR_CODES.UNKNOWN_ERROR,
        message: error.message || '未知错误',
        detail: '请联系技术支持'
      }
    }

    return excelError
  }

  /**
   * 解析HTTP错误响应
   */
  private static parseHttpError(status: number, data: any, context?: string): ExcelAnalyzeError {
    // 尝试从响应数据中提取错误信息
    const errorCode = data?.code || data?.errorCode
    const errorMessage = data?.message || data?.msg || data?.error

    // 根据业务错误代码返回具体错误
    if (errorCode && ERROR_MESSAGES[errorCode]) {
      return {
        code: errorCode,
        message: errorMessage || ERROR_MESSAGES[errorCode].message,
        detail: data?.detail,
        suggestions: ERROR_MESSAGES[errorCode].suggestions
      }
    }

    // 根据HTTP状态码返回通用错误
    switch (status) {
      case 400:
        return {
          code: 'BAD_REQUEST',
          message: errorMessage || '请求参数错误',
          detail: data?.detail || '请检查输入数据的格式和完整性'
        }
      case 401:
        return {
          code: 'UNAUTHORIZED',
          message: '登录已过期',
          detail: '请重新登录后继续操作'
        }
      case 403:
        return {
          code: ERROR_CODES.IMPORT_PERMISSION_DENIED,
          message: errorMessage || '权限不足',
          detail: '您没有执行此操作的权限'
        }
      case 404:
        return {
          code: 'NOT_FOUND',
          message: errorMessage || '资源不存在',
          detail: '请确认操作的数据是否存在'
        }
      case 413:
        return {
          code: ERROR_CODES.FILE_TOO_LARGE,
          message: errorMessage || '文件过大',
          detail: '请选择较小的文件或分批处理'
        }
      case 500:
        return {
          code: ERROR_CODES.SERVER_ERROR,
          message: errorMessage || '服务器内部错误',
          detail: '请稍后重试，如问题持续请联系技术支持'
        }
      default:
        return {
          code: ERROR_CODES.UNKNOWN_ERROR,
          message: errorMessage || `HTTP ${status} 错误`,
          detail: data?.detail || '请联系技术支持'
        }
    }
  }

  /**
   * 显示错误消息
   */
  static showError(error: ExcelAnalyzeError, options?: {
    showDetail?: boolean
    showSuggestions?: boolean
    duration?: number
  }) {
    const { showDetail = true, showSuggestions = true, duration = 5000 } = options || {}

    let message = error.message
    if (showDetail && error.detail) {
      message += `\n${error.detail}`
    }

    ElMessage({
      type: 'error',
      message,
      duration,
      showClose: true,
      dangerouslyUseHTMLString: false
    })

    // 如果有建议，显示通知
    if (showSuggestions && error.suggestions?.length) {
      this.showSuggestions(error)
    }
  }

  /**
   * 显示建议通知
   */
  static showSuggestions(error: ExcelAnalyzeError) {
    if (!error.suggestions?.length) return

    const suggestionHtml = error.suggestions
      .map(suggestion => `• ${suggestion}`)
      .join('<br>')

    ElNotification({
      title: '解决建议',
      message: suggestionHtml,
      type: 'info',
      duration: 10000,
      dangerouslyUseHTMLString: true,
      position: 'bottom-right'
    })
  }

  /**
   * 显示错误对话框（用于严重错误）
   */
  static async showErrorDialog(error: ExcelAnalyzeError, recoveryActions?: RecoveryAction[]) {
    const errorInfo = ERROR_MESSAGES[error.code]
    const title = errorInfo?.title || '操作失败'

    let content = `<p><strong>错误信息：</strong>${error.message}</p>`
    
    if (error.detail) {
      content += `<p><strong>详细说明：</strong>${error.detail}</p>`
    }

    if (error.suggestions?.length) {
      content += '<p><strong>解决建议：</strong></p><ul>'
      error.suggestions.forEach(suggestion => {
        content += `<li>${suggestion}</li>`
      })
      content += '</ul>'
    }

    try {
      await ElMessageBox({
        title,
        message: content,
        type: 'error',
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        showCancelButton: !!recoveryActions?.length,
        cancelButtonText: recoveryActions?.length ? '尝试恢复' : '取消'
      })
    } catch (action) {
      if (action === 'cancel' && recoveryActions?.length) {
        this.showRecoveryActions(recoveryActions)
      }
    }
  }

  /**
   * 显示恢复操作选项
   */
  static async showRecoveryActions(actions: RecoveryAction[]) {
    if (!actions.length) return

    const buttons = actions.map(action => ({
      text: action.label,
      type: action.type || 'primary',
      onClick: action.action
    }))

    // 这里可以实现一个自定义的恢复操作对话框
    // 暂时使用简单的确认框
    for (const action of actions) {
      try {
        await ElMessageBox.confirm(
          `是否执行恢复操作：${action.label}？`,
          '恢复操作',
          {
            confirmButtonText: action.label,
            cancelButtonText: '跳过',
            type: 'warning'
          }
        )
        await action.action()
        break // 执行成功后退出循环
      } catch (error) {
        // 用户取消或执行失败，继续下一个选项
        continue
      }
    }
  }

  /**
   * 处理文件上传错误
   */
  static handleFileUploadError(error: any, file?: File): ExcelAnalyzeError {
    // 检查文件大小
    if (file && file.size > 50 * 1024 * 1024) {
      return {
        code: ERROR_CODES.FILE_TOO_LARGE,
        message: `文件大小 ${(file.size / 1024 / 1024).toFixed(2)}MB 超过限制`,
        detail: '请选择小于50MB的Excel文件',
        suggestions: ERROR_MESSAGES[ERROR_CODES.FILE_TOO_LARGE].suggestions
      }
    }

    // 检查文件格式
    if (file && !file.name.match(/\.(xlsx|xls)$/i)) {
      return {
        code: ERROR_CODES.FILE_FORMAT_INVALID,
        message: '不支持的文件格式',
        detail: `当前文件格式：${file.name.split('.').pop()}`,
        suggestions: ERROR_MESSAGES[ERROR_CODES.FILE_FORMAT_INVALID].suggestions
      }
    }

    return this.handleApiError(error, 'file_upload')
  }

  /**
   * 处理字段匹配错误
   */
  static handleFieldMatchingError(error: any, context?: {
    missingFields?: string[]
    duplicateHeaders?: string[]
  }): ExcelAnalyzeError {
    const excelError = this.handleApiError(error, 'field_matching')

    // 添加上下文信息
    if (context?.missingFields?.length) {
      excelError.detail = `缺失必填字段：${context.missingFields.join(', ')}`
      excelError.suggestions = [
        '检查Excel文件是否包含所有必填字段',
        '手动调整字段匹配关系',
        '下载标准模板重新整理数据'
      ]
    }

    if (context?.duplicateHeaders?.length) {
      excelError.detail = `重复的表头：${context.duplicateHeaders.join(', ')}`
      excelError.suggestions = [
        '移除重复的表头列',
        '重命名重复的表头',
        '确保每个表头都是唯一的'
      ]
    }

    return excelError
  }

  /**
   * 处理数据验证错误
   */
  static handleDataValidationError(error: any, context?: {
    errorRows?: number[]
    errorFields?: string[]
  }): ExcelAnalyzeError {
    const excelError = this.handleApiError(error, 'data_validation')

    // 添加上下文信息
    if (context?.errorRows?.length) {
      excelError.detail = `错误行数：${context.errorRows.slice(0, 10).join(', ')}${
        context.errorRows.length > 10 ? '...' : ''
      }`
    }

    if (context?.errorFields?.length) {
      excelError.detail = (excelError.detail || '') + 
        `\n错误字段：${context.errorFields.join(', ')}`
    }

    return excelError
  }

  /**
   * 处理导入错误
   */
  static handleImportError(error: any, context?: {
    processedRows?: number
    totalRows?: number
  }): ExcelAnalyzeError {
    const excelError = this.handleApiError(error, 'import')

    // 添加上下文信息
    if (context?.processedRows !== undefined && context?.totalRows !== undefined) {
      excelError.detail = `已处理 ${context.processedRows}/${context.totalRows} 行数据`
      excelError.suggestions = [
        '可以选择跳过错误行继续导入',
        '修复错误数据后重新导入',
        '联系管理员检查系统状态'
      ]
    }

    return excelError
  }

  /**
   * 创建恢复操作
   */
  static createRecoveryActions(context: {
    onRetry?: () => void | Promise<void>
    onReset?: () => void | Promise<void>
    onSkip?: () => void | Promise<void>
    onDownloadTemplate?: () => void | Promise<void>
  }): RecoveryAction[] {
    const actions: RecoveryAction[] = []

    if (context.onRetry) {
      actions.push({
        label: '重试',
        action: context.onRetry,
        type: 'primary'
      })
    }

    if (context.onReset) {
      actions.push({
        label: '重新开始',
        action: context.onReset,
        type: 'warning'
      })
    }

    if (context.onSkip) {
      actions.push({
        label: '跳过错误',
        action: context.onSkip,
        type: 'info'
      })
    }

    if (context.onDownloadTemplate) {
      actions.push({
        label: '下载模板',
        action: context.onDownloadTemplate,
        type: 'success'
      })
    }

    return actions
  }
}

// 导出便捷方法
export const handleExcelError = ExcelAnalyzeErrorHandler.handleApiError
export const showExcelError = ExcelAnalyzeErrorHandler.showError
export const showExcelErrorDialog = ExcelAnalyzeErrorHandler.showErrorDialog