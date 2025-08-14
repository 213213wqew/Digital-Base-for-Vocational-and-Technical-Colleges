import request from '@/utils/request'

// ==================== 类型定义 ====================

/**
 * 国家平台资源对接数据清洗信息
 */
export interface OdsGjptzydjsjqxInfo {
  id: number
  zjsjwyxbs: string          // 主键数据唯一性标识
  xxdm: string               // 学校代码
  zyh: string                // 资源号 - 关键字段，用于判断更新还是新增
  zymc: string               // 资源名称
  zylxm: string              // 资源类型码
  zylxmText?: string         // 资源类型码文本
  zyms: string               // 资源描述
  zyzt: string               // 资源状态
  zyztText?: string          // 资源状态文本
  cjsj: string               // 创建时间
  gxsj: string               // 更新时间
  sjcjsj: string             // 数据采集时间
  reportStatus: string       // 上报状态
  enableStatus: string       // 启用状态
  createTime: string         // 创建时间
  updateTime: string         // 更新时间
}

/**
 * 查询参数
 */
export interface OdsGjptzydjsjqxQuery {
  zjsjwyxbs?: string
  xxdm?: string
  zyh?: string               // 资源号
  zymc?: string              // 资源名称
  zylxm?: string             // 资源类型码
  zyzt?: string              // 资源状态
  pageNum: number
  pageSize: number
}

/**
 * 表单数据
 */
export interface OdsGjptzydjsjqxForm {
  id?: number
  zjsjwyxbs?: string         // 主键数据唯一性标识
  xxdm: string               // 学校代码
  zyh: string                // 资源号 - 必填
  zymc: string               // 资源名称 - 必填
  zylxm: string              // 资源类型码 - 必填
  zyms?: string              // 资源描述
  zyzt: string               // 资源状态 - 必填
  cjsj?: string              // 创建时间
  gxsj?: string              // 更新时间
  sjcjsj: string             // 数据采集时间 - 必填
  reportStatus: string       // 上报状态
  enableStatus: string       // 启用状态
}

/**
 * Excel解析结果
 */
export interface ExcelParseResult {
  headers: Array<{
    columnName: string
    columnIndex: number
  }>
  dataPreview: Array<Array<string>>
  totalRows: number
}

/**
 * 字段映射配置
 */
export interface FieldMapping {
  [columnIndex: string]: string // columnIndex -> systemFieldName
}

/**
 * 导入配置
 */
export interface ImportConfig {
  fieldMapping: FieldMapping
  unmappedFieldsDefaults: Record<string, any>
  startRow: number
  autoGenerateId: boolean
}

/**
 * 系统字段定义
 */
export interface SystemField {
  field: string
  label: string
  type: 'string' | 'number' | 'date' | 'select'
  required: boolean
  maxLength?: number
  options?: Array<{ label: string; value: string }>
}

/**
 * 字典选项
 */
export interface DictOption {
  label: string
  value: string
}

/**
 * 导入结果
 */
export interface ImportResult {
  success: boolean
  message: string
  totalCount: number
  successCount: number
  failCount: number
  updateCount: number    // 更新数量
  insertCount: number    // 新增数量
  errors?: Array<{
    row: number
    field: string
    message: string
  }>
}

// ==================== API接口 ====================

/**
 * 获取分页列表
 */
export function getGjptzydjsjqxDataPage(params: OdsGjptzydjsjqxQuery) {
  return request({
    url: '/data/ods-gjptzydjsjqx/page',
    method: 'get',
    params
  })
}

/**
 * 根据ID获取详情
 */
export function getGjptzydjsjqxDataById(id: number) {
  return request({
    url: `/data/ods-gjptzydjsjqx/${id}`,
    method: 'get'
  })
}

/**
 * 新增数据
 */
export function addGjptzydjsjqxData(data: OdsGjptzydjsjqxForm) {
  return request({
    url: '/data/ods-gjptzydjsjqx',
    method: 'post',
    data
  })
}

/**
 * 更新数据
 */
export function updateGjptzydjsjqxData(data: OdsGjptzydjsjqxForm) {
  return request({
    url: '/data/ods-gjptzydjsjqx',
    method: 'put',
    data
  })
}

/**
 * 删除数据
 */
export function deleteGjptzydjsjqxData(id: number) {
  return request({
    url: `/data/ods-gjptzydjsjqx/${id}`,
    method: 'delete'
  })
}

/**
 * 批量删除数据
 */
export function batchDeleteGjptzydjsjqxData(ids: number[]) {
  return request({
    url: '/data/ods-gjptzydjsjqx/batch',
    method: 'delete',
    data: ids
  })
}

/**
 * 导出Excel
 */
export function exportGjptzydjsjqxData(params: OdsGjptzydjsjqxQuery) {
  return request({
    url: '/data/ods-gjptzydjsjqx/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

/**
 * 解析Excel表头
 * @param file Excel文件
 */
export function parseExcelHeaders(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/data/ods-gjptzydjsjqx/parse-excel-headers',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 带字段映射的数据导入
 * @param file Excel文件
 * @param config 导入配置
 */
export function importGjptzydjsjqxDataWithMapping(file: File, config: ImportConfig) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('config', JSON.stringify(config))
  
  return request({
    url: '/data/ods-gjptzydjsjqx/import-with-mapping',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 300000 // 5分钟超时
  })
}

/**
 * 下载导入模板
 */
export function downloadTemplate(config?: any) {
  return request({
    url: '/data/ods-gjptzydjsjqx/download-template',
    method: 'get',
    params: config,
    responseType: 'blob'
  })
}

/**
 * 获取系统字段定义
 */
export function getSystemFields(): SystemField[] {
  return [
    {
      field: 'xxdm',
      label: '学校代码',
      type: 'string',
      required: true,
      maxLength: 10
    },
    {
      field: 'zyh',
      label: '资源号',
      type: 'string',
      required: true,
      maxLength: 50
    },
    {
      field: 'zymc',
      label: '资源名称',
      type: 'string',
      required: true,
      maxLength: 200
    },
    {
      field: 'zylxm',
      label: '资源类型码',
      type: 'select',
      required: true,
      maxLength: 2
    },
    {
      field: 'zyms',
      label: '资源描述',
      type: 'string',
      required: false,
      maxLength: 1000
    },
    {
      field: 'zyzt',
      label: '资源状态',
      type: 'select',
      required: true,
      maxLength: 2
    },
    {
      field: 'cjsj',
      label: '创建时间',
      type: 'date',
      required: false
    },
    {
      field: 'gxsj',
      label: '更新时间',
      type: 'date',
      required: false
    },
    {
      field: 'sjcjsj',
      label: '数据采集时间',
      type: 'date',
      required: true
    },
    {
      field: 'reportStatus',
      label: '上报状态',
      type: 'select',
      required: false
    },
    {
      field: 'enableStatus',
      label: '启用状态',
      type: 'select',
      required: false
    }
  ]
}

/**
 * 获取资源类型选项
 */
export function getResourceTypeOptions() {
  return request({
    url: '/system/dict/data/type/resource_type',
    method: 'get'
  })
}

/**
 * 获取资源状态选项
 */
export function getResourceStatusOptions() {
  return request({
    url: '/system/dict/data/type/resource_status',
    method: 'get'
  })
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request({
    url: '/system/config/school-code',
    method: 'get'
  })
}