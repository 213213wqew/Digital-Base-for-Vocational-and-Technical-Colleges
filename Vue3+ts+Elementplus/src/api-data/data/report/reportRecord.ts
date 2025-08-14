import request from '@/utils/request-data'

// 上报记录相关类型定义
export interface ReportRecordInfo {
  id?: number
  tableId: number
  tableCode: string
  tableName: string
  deptId: number
  deptName: string
  userId: string
  username: string
  subsetCode?: string
  subsetName?: string
  catalogCode?: string
  catalogName?: string
  subcatalogCode?: string
  subcatalogName?: string
  reportFrequency?: string
  reportDate: string
  reportTime: string
  reportStatus: number
  reportStatusText?: string
  remark?: string
  createTime?: string
  updateTime?: string
}

export interface ReportRecordQuery {
  tableCode?: string
  tableName?: string
  deptId?: number
  deptName?: string
  userId?: string
  username?: string
  subsetCode?: string
  subsetName?: string
  catalogCode?: string
  catalogName?: string
  subcatalogCode?: string
  subcatalogName?: string
  reportFrequency?: string
  reportStatus?: number
  reportDateStart?: string
  reportDateEnd?: string
  pageNum: number
  pageSize: number
}

export interface ReportRecordForm {
  id?: number
  tableId: number
  tableCode: string
  tableName: string
  deptId: number
  deptName: string
  userId: string
  username: string
  subsetCode?: string
  subsetName?: string
  catalogCode?: string
  catalogName?: string
  subcatalogCode?: string
  subcatalogName?: string
  reportFrequency?: string
  reportDate: string
  reportTime: string
  reportStatus: number
  remark?: string
}

// 统计相关类型定义
export interface ReportStatisticsQuery {
  startDate?: string
  endDate?: string
  deptIds?: number[]
  userIds?: string[]
  subsetCodes?: string[]
  catalogCodes?: string[]
  subcatalogCodes?: string[]
  reportFrequencies?: string[]
  reportStatuses?: number[]
}

export interface ReportStatisticsVO {
  overview: {
    totalTables: number
    reportedTables: number
    unreportedTables: number
    reportRate: number
    todayReported: number
    weekReported: number
    monthReported: number
  }
  userStats: Array<{
    userId: string
    username: string
    deptName: string
    totalAssigned: number
    reportedCount: number
    reportRate: number
    lastReportTime: string
  }>
  deptStats: Array<{
    deptId: number
    deptName: string
    totalTables: number
    reportedTables: number
    unreportedTables: number
    reportRate: number
    userCount: number
    activeUserCount: number
    todayReported: number
    weekReported: number
    monthReported: number
  }>
  categoryStats: {
    subsetStats: Array<{
      subsetCode: string
      subsetName: string
      totalTables: number
      reportedTables: number
      reportRate: number
    }>
    catalogStats: Array<{
      catalogCode: string
      catalogName: string
      totalTables: number
      reportedTables: number
      reportRate: number
    }>
    subcatalogStats: Array<{
      subcatalogCode: string
      subcatalogName: string
      totalTables: number
      reportedTables: number
      reportRate: number
    }>
  }
  timeStats: {
    dailyStats: Array<{
      date: string
      totalTables: number
      reportedTables: number
      reportRate: number
    }>
    weeklyStats: Array<{
      week: string
      totalTables: number
      reportedTables: number
      reportRate: number
    }>
    monthlyStats: Array<{
      month: string
      totalTables: number
      reportedTables: number
      reportRate: number
    }>
  }
}

// 上报记录API
export const reportRecordApi = {
  // 分页查询上报记录
  getReportRecordPage(params: ReportRecordQuery) {
    return request.post('/data/data/report-record/list', params)
  },

  // 获取上报记录详情
  getReportRecordById(id: number) {
    return request.get(`/data/data/report-record/${id}`)
  },

  // 新增上报记录
  addReportRecord(params: ReportRecordForm) {
    return request.post('/data/data/report-record', params)
  },

  // 修改上报记录
  updateReportRecord(params: ReportRecordForm) {
    return request.put('/data/data/report-record', params)
  },

  // 删除上报记录
  deleteReportRecord(id: number) {
    return request.delete(`/data/data/report-record/${id}`)
  },

  // 批量删除上报记录
  batchDeleteReportRecord(ids: number[]) {
    return request.delete('/data/data/report-record/batch', { data: ids })
  },

  // 获取上报统计信息
  getReportStatistics(params: ReportStatisticsQuery) {
    return request.post('/data/data/report-record/statistics', params)
  },

  // 获取用户上报统计
  getUserReportStatistics(params: ReportStatisticsQuery) {
    return request.post('/data/data/report-record/statistics/user', params)
  },

  // 获取部门上报统计
  getDeptReportStatistics(params: ReportStatisticsQuery) {
    return request.post('/data/data/report-record/statistics/dept', params)
  },

  // 获取分类统计
  getCategoryReportStatistics(params: ReportStatisticsQuery) {
    return request.post('/data/data/report-record/statistics/category', params)
  },

  // 获取时间维度统计
  getTimeReportStatistics(params: ReportStatisticsQuery) {
    return request.post('/data/data/report-record/statistics/time', params)
  }
} 