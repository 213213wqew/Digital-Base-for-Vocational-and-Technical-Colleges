import { request } from '@/utils/request-data'
import type { ApiResponse } from "@/utils/request-data"

// 数据类型定义
export interface OdsSxbxgmqksjInfo {
  id?: number
  zjsjwyxbs: string
  xxdm: string
  xh: string
  xsxm: string
  bxxzmc?: string
  bdh?: string
  bxfczfmc?: string
  bxgmrq?: string
  bxgmrqDisplay?: string
  bxgmfm?: string
  bxgmfmText?: string
  gmbxzlm?: string
  gmbxzlmText?: string
  sjcjsj?: string
  sjcjsjDisplay?: string
  reportStatus?: string
  reportStatusText?: string
  enableStatus?: string
  createTime?: string
  updateTime?: string
}

export interface OdsSxbxgmqksjQuery {
  zjsjwyxbs?: string
  xxdm?: string
  xh?: string
  xsxm?: string
  bxxzmc?: string
  bdh?: string
  bxfczfmc?: string
  bxgmrqStart?: string
  bxgmrqEnd?: string
  bxgmfm?: string
  gmbxzlm?: string
  sjcjsjStart?: string
  sjcjsjEnd?: string
  reportStatus?: string
  enableStatus?: string
  pageNum?: number
  pageSize?: number
  orderByColumn?: string
  isAsc?: string
}

export interface OdsSxbxgmqksjForm {
  id?: number
  zjsjwyxbs: string
  xxdm: string
  xh: string
  xsxm: string
  bxxzmc?: string
  bdh?: string
  bxfczfmc?: string
  bxgmrq?: string
  bxgmfm?: string
  gmbxzlm?: string
  sjcjsj?: string
  reportStatus?: string
  enableStatus?: string
}

export interface DictOption {
  value: string
  label: string
}

// 导入功能相关类型定义
export interface ImportResult {
  totalCount: number
  successCount: number
  failureCount: number
  updateCount: number
  insertCount: number
  errors: string[]
}

export interface SystemField {
  field: string
  label: string
  type: 'string' | 'number' | 'date' | 'select'
  required: boolean
  maxLength?: number
  options?: DictOption[]
}

// Excel表头接口
export interface ExcelHeader {
  columnIndex: number
  columnName: string
}

// Excel解析结果接口
export interface ExcelParseResult {
  headers: ExcelHeader[]
  dataPreview: any[]
  totalRows: number
}

// 字段映射关系接口
export interface FieldMapping {
  [key: string]: string
}

// 导入配置接口
export interface ImportConfig {
  fieldMapping: Record<string, string>
  unmappedFieldsDefaults?: Record<string, string>
  startRow?: number
  autoGenerateId?: boolean
}

// 基础CRUD API
export function getOdsSxbxgmqksjPage(query: OdsSxbxgmqksjQuery) {
  return request.post<ApiResponse<any>>('/data/data/data-base/zygjx/ods-sxbxgmqksj/page', query)
}

export function getOdsSxbxgmqksjById(id: number) {
  return request.get<ApiResponse<OdsSxbxgmqksjInfo>>(`/data/data/data-base/zygjx/ods-sxbxgmqksj/${id}`)
}

export function addOdsSxbxgmqksj(data: OdsSxbxgmqksjForm) {
  return request.post<ApiResponse<number>>('/data/data/data-base/zygjx/ods-sxbxgmqksj/add', data)
}

export function updateOdsSxbxgmqksj(data: OdsSxbxgmqksjForm) {
  return request.put<ApiResponse<boolean>>('/data/data/data-base/zygjx/ods-sxbxgmqksj/update', data)
}

export function deleteOdsSxbxgmqksj(id: number) {
  return request.delete<ApiResponse<boolean>>(`/data/data/data-base/zygjx/ods-sxbxgmqksj/${id}`)
}

export function batchDeleteOdsSxbxgmqksj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>('/data/data/data-base/zygjx/ods-sxbxgmqksj/batch/delete', { data: ids })
}

export function exportOdsSxbxgmqksj(query: OdsSxbxgmqksjQuery) {
  return request.post<Blob>('/data/data/data-base/zygjx/ods-sxbxgmqksj/export', query, { responseType: 'blob' })
}

export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(`/data/data/data-base/zygjx/ods-sxbxgmqksj/single/report-status/${id}`, { reportStatus })
}

export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(`/data/data/data-base/zygjx/ods-sxbxgmqksj/single/enable-status/${id}`, { enableStatus })
}
 
/**
 * 获取系统学校代码
 * @returns Promise<ApiResponse<string>>
 */
export function getSystemSchoolCode(): Promise<ApiResponse<string>> {
  return request.get(
    "/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}
// 导入功能API - 修复路径和实现
/**
 * 解析Excel文件表头
 * @param file Excel文件
 * @returns Excel解析结果
 */
export function parseExcelHeaders(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request.post<ApiResponse<ExcelParseResult>>(
    '/data/data/data-base/zygjx/ods-sxbxgmqksj/parse-excel-headers',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000
    }
  )
}

/**
 * 导入实习保险购买情况数据（带字段映射）
 * @param file Excel文件
 * @param config 导入配置
 * @returns 导入结果
 */
export function importOdsSxbxgmqksjWithMapping(file: File, config: ImportConfig) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fieldMapping', JSON.stringify(config.fieldMapping))
  formData.append('defaultValues', JSON.stringify(config.unmappedFieldsDefaults))
  formData.append('updateByStudentNumber', 'true') // 默认根据学号更新
  
  return request.post<ApiResponse<ImportResult>>(
    '/data/data/data-base/zygjx/ods-sxbxgmqksj/import-with-mapping',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 120000
    }
  )
}

/**
 * 下载导入模板
 * @returns 二进制流
 */
export function downloadTemplate() {
  return request.post<Blob>(
    '/data/data/data-base/zygjx/ods-sxbxgmqksj/download-template', 
    {}, 
    { responseType: 'blob' }
  )
}

/**
 * 获取系统字段定义（用于Excel导入映射）
 * @returns 系统字段列表
 */
export function getSystemFields(): SystemField[] {
  return [
    { field: 'zjsjwyxbs', label: '主键数据唯一性标识', type: 'string', required: false, maxLength: 32 },
    { field: 'xxdm', label: '学校代码', type: 'string', required: false, maxLength: 10 },
    { field: 'xh', label: '学号', type: 'string', required: true, maxLength: 20 },
    { field: 'xsxm', label: '学生姓名', type: 'string', required: true, maxLength: 36 },
    { field: 'bxxzmc', label: '保险险种名称', type: 'string', required: false, maxLength: 120 },
    { field: 'bdh', label: '保单号', type: 'string', required: false, maxLength: 64 },
    { field: 'bxfczfmc', label: '保险费出资方名称', type: 'string', required: false, maxLength: 200 },
    { field: 'bxgmrq', label: '保险购买日期', type: 'date', required: false },
    { field: 'bxgmfm', label: '保险购买方码', type: 'select', required: false },
    { field: 'gmbxzlm', label: '购买保险种类码', type: 'select', required: false },
    { field: 'sjcjsj', label: '数据采集时间', type: 'date', required: false },
    { field: 'reportStatus', label: '上报状态', type: 'select', required: false },
    { field: 'enableStatus', label: '启用状态', type: 'select', required: false }
  ]
}
