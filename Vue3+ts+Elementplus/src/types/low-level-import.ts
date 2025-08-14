// 低级导入功能类型定义

export interface EntityFieldInfo {
  fieldName: string
  displayName: string
  fieldType: string
  required: boolean
  order: number
  dictType?: string
  dateFormat?: string
  validation?: string
}

export interface ImportError {
  rowNumber: number
  fieldName: string
  errorMessage: string
  originalValue: string
}

export interface ImportResult {
  success: boolean
  totalRows: number
  successRows: number
  failedRows: number
  errors: ImportError[]
  processingTime: number
  message: string
}

// 组件Props类型
export interface LowLevelImportProps {
  tableName: string
  modelValue: boolean
}

// 组件Emits类型
export interface LowLevelImportEmits {
  'update:modelValue': [value: boolean]
  'success': [result: ImportResult]
}