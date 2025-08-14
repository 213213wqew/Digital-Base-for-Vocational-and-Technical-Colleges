import request from '@/utils/request-data'

/**
 * 字段匹配建议VO
 */
export interface MatchingSuggestion {
  fieldName: string           // 系统字段名
  fieldLabel: string          // 字段中文名
  fieldType: string           // 字段类型
  confidence: number          // 匹配置信度(0-100)
  matchStrategy: string       // 匹配策略
  isRequired: boolean         // 是否必填字段
  isDefault: boolean          // 是否默认值字段
  isIdentifier: boolean       // 是否标识字段
  fieldExample: string        // 字段示例
  matchedPattern: string      // 匹配的模式
}

/**
 * 自动映射结果VO
 */
export interface AutoMappingResult {
  tableName: string                                    // 表名
  tableLabel: string                                   // 表中文名
  totalHeaders: number                                 // 总的Excel列数
  matchedHeaders: number                               // 成功匹配的列数
  matchRate: number                                    // 匹配成功率
  mappingResults: Record<string, MatchingSuggestion[]> // 映射结果
  autoMappedFields: Record<string, MatchingSuggestion> // 自动映射的字段
  unmatchedHeaders: string[]                           // 未匹配的Excel列
  processingTime: number                               // 匹配处理时间(毫秒)
}

/**
 * 高级匹配请求VO
 */
export interface AdvancedMatchRequest {
  headers: string[]                    // Excel表头列表
  matchThreshold: number               // 匹配阈值(0-100)
  matchStrategies: string[]            // 匹配策略列表
  autoMapping: boolean                 // 是否启用自动映射
  customRules?: CustomMatchRule[]      // 自定义匹配规则
  enableFuzzyMatch: boolean            // 是否启用模糊匹配
  enablePinyinMatch: boolean           // 是否启用拼音匹配
  enableSemanticMatch: boolean         // 是否启用语义匹配
}

/**
 * 自定义匹配规则
 */
export interface CustomMatchRule {
  excelPattern: string    // Excel列名模式
  systemField: string     // 系统字段名
  priority: number        // 优先级
  confidence: number      // 置信度
}

/**
 * 获取字段匹配建议
 * @param tableName 表名
 * @param excelHeader Excel列名
 * @returns 匹配建议列表
 */
export function getMatchingSuggestions(tableName: string, excelHeader: string) {
  return request.get<{ data: MatchingSuggestion[] }>(
    `/data/api/common/import/smart-mapping/${tableName}/suggestions`,
    { excelHeader }
  )
}

/**
 * 执行高级智能匹配
 * @param tableName 表名
 * @param request 高级匹配请求
 * @returns 自动映射结果
 */
export function performAdvancedMatching(tableName: string, matchRequest: AdvancedMatchRequest) {
  return request.post<{ data: AutoMappingResult }>(
    `/data/api/common/import/smart-mapping/${tableName}/advanced-match`,
    matchRequest
  )
}

/**
 * 批量获取字段映射建议
 * @param tableName 表名
 * @param excelHeaders Excel列名列表
 * @returns 自动映射结果
 */
export function batchGetMappingSuggestions(tableName: string, excelHeaders: string[]) {
  return request.post<{ data: AutoMappingResult }>(
    `/data/api/common/import/smart-mapping/${tableName}/batch-suggestions`,
    excelHeaders
  )
}

/**
 * 计算字符串相似度
 * @param source 源字符串
 * @param target 目标字符串
 * @returns 相似度(0-100)
 */
export function calculateStringSimilarity(source: string, target: string) {
  return request.get<{ data: number }>(
    '/data/api/common/import/smart-mapping/similarity',
    { source, target }
  )
}