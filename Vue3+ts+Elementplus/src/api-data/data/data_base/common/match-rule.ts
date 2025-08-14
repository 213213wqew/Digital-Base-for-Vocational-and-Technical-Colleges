import request from '@/utils/request-data'

export interface MatchRule {
  id?: number
  tableName: string
  fieldName: string
  matchPatterns: string[] | string
  matchPriority: number
  exactMatch: number  // 修正为number类型，与后端Integer一致
  matchStrategy: string
  confidenceThreshold: number
  enableStatus: number
  createTime?: string  // 可选字段，编辑时不传递
  updateTime?: string  // 可选字段，编辑时不传递
}

export default {
  // 查询规则列表
  list(fieldName: string, tableName: string) {
    return request.get('/data/api/common/import/match-rule/list', {  fieldName:fieldName, tableName:tableName  })
  },
  // 新增规则
  add(data: MatchRule) {
    return request.post('/data/api/common/import/match-rule', data)
  },
  // 编辑规则
  edit(data: MatchRule) {
    return request.put('/data/api/common/import/match-rule', data)
  },
  // 删除规则
  delete(id: number) {
    return request.delete(`/data/api/common/import/match-rule/${id}`)
  },
  // 批量导入/导出
  batch(data: MatchRule[]) {
    return request.post('/data/api/common/import/match-rule/batch', data)
  },
  /**
   * 分页查询匹配规则
   * @param params 分页+查询参数
   * @returns 分页结果
   */
  pageMatchRule(params: {
    pageNum: number
    pageSize: number
    tableName?: string
    tableChineseName?: string
    fieldName?: string
  }) {
    return request.post<{ data: { records: MatchRule[]; total: number } }>(
      '/data/api/common/import/match-rule/page',
      params
    )
  },
  
  /**
   * 根据表中文名更新匹配规则
   * @param tableChineseName 表中文名
   * @returns 更新结果
   */
  updateByTableChineseName(tableChineseName: string) {
    return request.post('/data/api/common/import/match-rule/update-by-table-chinese-name', null, {
      params: { tableChineseName }
    })
  }
} 