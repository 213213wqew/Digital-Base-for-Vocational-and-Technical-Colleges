import request from '@/utils/request'

// 获取概览统计数据
export function getOverviewStats() {
  return request.get('/cockpit/statistics/overview')
}

// 获取学生状态分布数据
export function getStudentStatusDistribution() {
  return request.get('/cockpit/statistics/student-status')
}

// 获取专业分布数据
export function getMajorDistribution() {
  return request.get('/cockpit/statistics/major-distribution')
}

// 获取课程类型分布数据
export function getCourseTypeDistribution() {
  return request.get('/cockpit/statistics/course-type')
}

// 获取月度趋势数据
export function getMonthlyTrend() {
  return request.get('/cockpit/statistics/monthly-trend')
}

// 获取教学资源利用率数据
export function getResourceUtilization() {
  return request.get('/cockpit/statistics/resource-utilization')
}

// 获取关键指标数据
export function getKeyMetrics() {
  return request.get('/cockpit/statistics/key-metrics')
}

// 获取数据质量监控数据
export function getDataQuality() {
  return request.get('/cockpit/statistics/data-quality')
}

// 获取系统状态数据
export function getSystemStatus() {
  return request.get('/cockpit/statistics/system-status')
}

// 获取实时动态新闻
export function getRealtimeNews() {
  return request.get('/cockpit/statistics/realtime-news')
}

// 获取所有驾驶舱数据（一次性获取）
export function getAllCockpitData() {
  return request.get('/cockpit/statistics/all')
} 