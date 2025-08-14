import { request, type ApiResponse } from '@/utils/request-data'
import type { AxiosResponse } from 'axios'

// Excel分析相关类型定义
export interface SupportedTable {
  tableName: string
  tableLabel: string
  moduleName: string
  subsetCode: string
  apiBasePath: string
  importModes: string
  enableStatus: number
  enabled: boolean
  createTime: string
  updateTime: string
}

export interface FileUploadResult {
  sessionId: string
  fileName: string
  filePath: string
  fileSize: number
  totalRows: number
  totalColumns: number
  headers: string[]
}

export interface FieldConfig {
  fieldName: string
  fieldLabel: string
  fieldType: string
  fieldLength: number
  required: boolean
  fieldComment: string
}

export interface MatchRule {
  ruleId: string
  ruleName: string
  matchType: string
  matchPattern: string
  priority: number
}

export interface FieldMapping {
  excelHeader: string
  columnIndex: number
  matchedField: string
  matchScore: number
  fieldInfo: FieldConfig
}

export interface DataPreview {
  previewData: any[]
  statistics: {
    totalRows: number
    validRows: number
    errorRows: number
    warningRows: number
  }
}

export interface ImportResult {
  success: boolean
  message: string
  totalRows: number
  successCount: number
  errorCount: number
  duration: number
}

// Excel分析相关API接口

/**
 * 获取支持的表配置列表
 */
export function getSupportedTables(params?: {
  moduleName?: string
  enableStatus?: number
}): Promise<AxiosResponse<ApiResponse<SupportedTable[]>>> {
  return request.get('/api/excel-analyze/tables', params)
}

/**
 * 上传Excel文件
 */
export function uploadExcelFile(formData: FormData): Promise<AxiosResponse<ApiResponse<FileUploadResult>>> {
  return request.post('/api/excel-analyze/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取表字段配置
 */
export function getTableFieldConfig(tableName: string): Promise<AxiosResponse<ApiResponse<{
  tableName: string
  fieldConfigs: FieldConfig[]
  matchRules: MatchRule[]
  fieldCount: number
  ruleCount: number
}>>> {
  return request.get(`/data/api/excel-analyze/tables/${tableName}/fields`)
}

/**
 * 获取会话信息
 */
export function getSessionInfo(sessionId: string): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.get(`/data/api/excel-analyze/sessions/${sessionId}`)
}

/**
 * 删除会话
 */
export function deleteSession(sessionId: string): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.delete(`/data/api/excel-analyze/sessions/${sessionId}`)
}

/**
 * 获取字段配置
 */
export function getFieldConfigs(sessionId: string): Promise<AxiosResponse<ApiResponse<{
  fieldConfigs: FieldConfig[]
  matchRules: MatchRule[]
}>>> {
  return request.get(`/data/api/excel-analyze/sessions/${sessionId}/field-configs`)
}

/**
 * 获取字段匹配结果
 */
export function getFieldMatching(sessionId: string): Promise<AxiosResponse<ApiResponse<{
  matchings: FieldMapping[]
}>>> {
  return request.get(`/data/api/excel-analyze/sessions/${sessionId}/field-matching`)
}

/**
 * 执行自动匹配
 */
export function executeAutoMatch(sessionId: string): Promise<AxiosResponse<ApiResponse<{
  matchings: FieldMapping[]
}>>> {
  return request.post(`/data/api/excel-analyze/sessions/${sessionId}/auto-match`)
}

/**
 * 获取字段匹配建议
 */
export function getFieldSuggestions(sessionId: string, data: {
  excelHeader: string
  columnIndex: number
}): Promise<AxiosResponse<ApiResponse<{
  suggestions: any[]
}>>> {
  return request.post(`/data/api/excel-analyze/sessions/${sessionId}/field-suggestions`, data)
}

/**
 * 保存字段映射
 */
export function saveFieldMappings(sessionId: string, data: {
  mappings: FieldMapping[]
}): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.post(`/data/api/excel-analyze/sessions/${sessionId}/save-mappings`, data)
}

/**
 * 获取数据预览
 */
export function getDataPreview(sessionId: string, data: {
  fieldMappings: FieldMapping[]
  transformSettings: any
}): Promise<AxiosResponse<ApiResponse<DataPreview>>> {
  return request.post(`/data/api/excel-analyze/sessions/${sessionId}/data-preview`, data)
}

/**
 * 导出错误数据
 */
export function exportErrorData(sessionId: string): Promise<Blob> {
  return request.post(`/data/api/excel-analyze/sessions/${sessionId}/export-errors`, {}, {
    responseType: 'blob'
  })
}

/**
 * 开始导入数据
 */
export function startImport(sessionId: string, data: {
  importOptions: any
}): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.post(`/data/api/excel-analyze/sessions/${sessionId}/import`, data)
}

/**
 * 获取导入进度
 */
export function getImportProgress(sessionId: string): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.get(`/data/api/excel-analyze/sessions/${sessionId}/import-progress`)
}

/**
 * 取消导入
 */
export function cancelImport(sessionId: string): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.post(`/data/api/excel-analyze/sessions/${sessionId}/cancel-import`)
}

/**
 * 获取系统状态
 */
export function getSystemStatus(): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.get('/data/api/excel-analyze/status')
}

// 表头匹配相关API

/**
 * 获取表头匹配建议
 */
export function getHeaderMatchingSuggestions(data: {
  sessionId: string
  headers: string[]
  tableName: string
}): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.post('/data/api/header-matching/suggestions', data)
}

/**
 * 保存字段映射配置
 */
export function saveFieldMapping(data: {
  sessionId: string
  mappings: any[]
}): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.post('/data/api/header-matching/save-mapping', data)
}

/**
 * 获取字段映射配置
 */
export function getFieldMapping(sessionId: string): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.get(`/data/api/header-matching/mapping/${sessionId}`)
}

/**
 * 更新匹配规则
 */
export function updateMatchingRule(data: {
  sessionId: string
  ruleId: string
  rule: any
}): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.post('/data/api/header-matching/update-rule', data)
}

// 数据转换相关API

/**
 * 执行数据转换
 */
export function executeDataTransform(data: {
  sessionId: string
  mappings: any[]
  transformRules: any[]
}): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.post('/data/api/data-transform/execute', data)
}

/**
 * 获取转换预览
 */
export function getTransformPreview(data: {
  sessionId: string
  mappings: any[]
  sampleSize?: number
}): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.post('/data/api/data-transform/preview', data)
}

/**
 * 验证数据
 */
export function validateData(data: {
  sessionId: string
  validationRules: any[]
}): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.post('/data/api/data-transform/validate', data)
}

/**
 * 获取验证结果
 */
export function getValidationResult(sessionId: string): Promise<AxiosResponse<ApiResponse<any>>> {
  return request.get(`/data/api/data-transform/validation-result/${sessionId}`)
}

// 文件下载相关API

/**
 * 下载处理结果
 */
export function downloadProcessedFile(sessionId: string, fileType: string): Promise<Blob> {
  return request.get(`/data/api/file-download/processed/${sessionId}`, { fileType }, {
    responseType: 'blob'
  })
}

/**
 * 下载匹配配置模板
 */
export function downloadMappingTemplate(sessionId: string): Promise<Blob> {
  return request.get(`/data/api/file-download/mapping-template/${sessionId}`, {}, {
    responseType: 'blob'
  })
}

/**
 * 下载错误报告
 */
export function downloadErrorReport(sessionId: string): Promise<Blob> {
  return request.get(`/data/api/file-download/error-report/${sessionId}`, {}, {
    responseType: 'blob'
  })
}

/**
 * 生成导入报告
 */
export function generateImportReport(sessionId: string): Promise<Blob> {
  return request.post(`/data/api/file-download/import-report/${sessionId}`, {}, {
    responseType: 'blob'
  })
}
/**
 * 根据字典代码获取选项列表
 * @param dictCode 字典代码
 */
export function getDictOptions(dictCode: string) {
  return request.get<ApiResponse<Array<{ value: string; label: string }>>>(
    `/data/data/data-base-source/options/${dictCode}`
  );
}
