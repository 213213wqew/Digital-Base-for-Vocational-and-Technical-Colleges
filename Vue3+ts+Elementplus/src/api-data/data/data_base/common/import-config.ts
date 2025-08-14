import request from '@/utils/request-data'
import { log } from 'vxe-table'

/**
 * 导入配置主表 VO
 * 对应 sys_import_config 数据表
 */
export interface ImportConfigVO {
  id?: number // 主键ID
  tableName: string // 表名
  tableLabel: string // 表中文名称
  moduleName: string // 模块名
  subsetCode?: string // 数据子集代码
  apiBasePath: string // API基础路径
  importModes?: string // 导入模式
  templateExcludeFields?: string // 模板排除字段
  defaultValues?: string // 默认值配置
  urlAddress?: string // 自动获取数据的URL地址
  jsonType?: string // 源JSON配置
  jsonField?: string // 目标JSON配置
  jsonTargetField?: string // 目标字段string
  enableStatus?: number // 启用状态
  lastImportTime?: string // 最近导入时间
  fieldCount?: number // 字段数量
  createTime?: string // 创建时间
  updateTime?: string // 更新时间
}

/**
 * 查询导入配置列表
 * @param params 查询参数（表名、模块名、状态）
 * @returns 导入配置VO数组
 */
export function listImportConfig(params: {
  tableName?: string
  moduleName?: string
  enableStatus?: number
}) {
  return request.get<{ data: ImportConfigVO[] }>('/data/api/common/import/config/list', { tableName: params.tableName, moduleName: params.moduleName, enableStatus: params.enableStatus })
}

/**
 * 新增导入配置
 * @param data 配置数据
 * @returns 操作结果
 */
export function addImportConfig(data: Partial<ImportConfigVO>) {
  return request.post('/data/api/common/import/config', data)
}

/**
 * 编辑导入配置
 * @param data 配置数据
 * @returns 操作结果
 */
export function updateImportConfig(data: Partial<ImportConfigVO>) {
  return request.put('/data/api/common/import/config', data)
}

/**
 * 删除导入配置
 * @param id 配置ID
 * @returns 操作结果
 */
export function deleteImportConfig(id: number) {
  return request.delete<any>('/data/api/common/import/config/delete', { id })
}

/**
 * 测试URL连接
 * @param urlAddress URL地址
 * @returns 测试结果
 */
export function testUrlConnection(urlAddress: string) {
  return request.post<any>('/data/api/data/auto-fetch/test-url', { urlAddress })
}

/**
 * 验证JSON配置
 * @param jsonType JSON类型配置
 * @param jsonField JSON字段映射配置
 * @returns 验证结果
 */
export function validateJsonConfig(jsonType: string, jsonField: string) {
  return request.post<any>('/data/api/data/auto-fetch/validate-json', { jsonType, jsonField })
}

/**
 * 自动获取数据
 * @param tableName 表名
 * @returns 获取到的数据
 */
export function fetchDataByTableName(tableName: string) {
  return request.get<any>(`/data/api/data/auto-fetch/data/${tableName}`)
}

/**
 * 分页查询导入配置
 * @param params 分页+查询参数
 * @returns 分页结果
 */
export function pageImportConfig(params: {
  pageNum: number
  pageSize: number
  tableName?: string
  moduleName?: string
  enableStatus?: number
}) {
  return request.post<{ data: { records: ImportConfigVO[]; total: number } }>(
    '/data/api/common/import/config/page',
    params
  )
} 