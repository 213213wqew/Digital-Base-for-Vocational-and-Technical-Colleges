import request from '@/utils/request-data'

/**
 * 字段配置VO，对应 sys_import_field_config
 */
export interface FieldConfigVO {
  id?: number // 主键ID
  tableName: string // 表名
  tableChineseName?: string // 表中文名
  fieldName: string // 字段名
  fieldLabel: string // 字段中文名
  fieldType: string // 字段类型
  isRequired: number // 是否必填(0:否,1:是)
  isDefault: number // 是否为默认值字段(0:否,1:是)
  isIdentifier: number // 是否标识字段(0:否,1:是)
  idTemplate: number // 是否是模板(0:否,1:是)
  maxLength?: number // 最大长度
  dictType?: string // 字典类型
  fieldExample?: string // 字段示例
  validationRules?: string // 验证规则
  validationField?: string // 验证字段名(用于数据验证时关联的字段)
  validationDatabase?: string // 验证数据库名(用于数据验证时查询的数据库)
  fieldProcessor?: string // 字段处理器类型
  transformRules?: string // 数据转换规则
  sortOrder?: number // 排序
  enableStatus: number // 启用状态(0:禁用,1:启用)
  createTime?: string // 创建时间
  updateTime?: string // 更新时间
}

/**
 * 查询字段配置列表
 * @param params 查询参数
 * @returns 字段配置VO数组
 */
export function listFieldConfig(params: {
  tableName?: string
  tableChineseName?: string
  fieldName?: string
  enableStatus?: number
}) {
  return request.get<{ data: FieldConfigVO[] }>('/data/api/common/import/field-config/list', params)
}

/**
 * 新增字段配置
 * @param data 字段配置数据
 * @returns 操作结果
 */
export function addFieldConfig(data: Partial<FieldConfigVO>) {
  return request.post('/data/api/common/import/field-config', data)
}

/**
 * 编辑字段配置
 * @param data 字段配置数据
 * @returns 操作结果
 */
export function updateFieldConfig(data: Partial<FieldConfigVO>) {
  return request.put('/data/api/common/import/field-config', data)
}

/**
 * 删除字段配置
 * @param id 字段配置ID
 * @returns 操作结果
 */
export function deleteFieldConfig(id: number) {
  return request.delete(`/data/api/common/import/field-config/${id}`)
}

/**
 * 分页查询字段配置
 * @param params 分页+查询参数
 * @returns 分页结果
 */
export function pageFieldConfig(params: {
  pageNum: number
  pageSize: number
  tableName?: string
  tableChineseName?: string
  fieldName?: string
  validationField?: string
  validationDatabase?: string
  enableStatus?: number
  sortField?: string
  sortOrder?: string
}) {
  return request.post<{ data: { records: FieldConfigVO[]; total: number } }>(
    '/data/api/common/import/field-config/page',
    params
  )
}

/**
 * 根据表中文名更新字段配置
 * @param tableChineseName 表中文名
 * @returns 更新结果
 */
export function updateByTableChineseName(tableChineseName: string) {
  return request.post('/data/api/common/import/field-config/update-by-table-chinese-name', null, {
    params: { tableChineseName }
  })
}

/**
 * 更新验证字段和验证数据库
 * @param tableChineseName 表中文名（可选）
 * @returns 更新结果
 */
export function updateValidationFields(tableChineseName?: string) {
  return request.post('/data/api/common/import/field-config/update-validation-fields', null, {
    params: { tableChineseName }
  })
}