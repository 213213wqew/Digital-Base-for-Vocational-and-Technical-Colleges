// 职业院校数字基座大屏模拟数据生成器

// 学生状态数据
export const generateStudentStatusData = () => {
  return [
    { value: 14520, name: '在校学习', itemStyle: { color: '#4fd6ff' } },
    { value: 1680, name: '企业实习', itemStyle: { color: '#36ce9e' } },
    { value: 320, name: '休学保留', itemStyle: { color: '#f39c12' } },
    { value: 160, name: '其他状态', itemStyle: { color: '#e74c3c' } }
  ]
}

// 专业分布数据
export const generateMajorDistributionData = () => {
  const majors = ['智能制造', '电子商务', '计算机技术', '汽车工程', '建筑工程', '护理健康', '数字媒体', '现代物流']
  const data = majors.map(major => ({
    name: major,
    value: Math.floor(Math.random() * 2000) + 1500 // 1500-3500之间
  }))
  
  return {
    categories: data.map(item => item.name),
    values: data.map(item => item.value)
  }
}

// 课程类型分布
export const generateCourseTypeData = () => {
  return [
    { value: 520, name: '必修课程', itemStyle: { color: '#4fd6ff' } },
    { value: 380, name: '选修课程', itemStyle: { color: '#36ce9e' } },
    { value: 350, name: '实践课程', itemStyle: { color: '#f39c12' } },
    { value: 180, name: '线上课程', itemStyle: { color: '#9b59b6' } }
  ]
}

// 月度趋势数据
export const generateMonthlyTrendData = () => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  
  return {
    months,
    courseCompletion: months.map(() => Math.floor(Math.random() * 10) + 85), // 85-95%
    teachingQuality: months.map(() => (Math.random() * 0.5 + 4.5).toFixed(1)), // 4.5-5.0
    employmentRate: months.map(() => Math.floor(Math.random() * 8) + 93), // 93-100%
    digitalEquipment: months.map(() => Math.floor(Math.random() * 15) + 80) // 80-95%
  }
}

// 教学资源利用率数据
export const generateResourceUtilizationData = () => {
  return {
    indicators: [
      { name: '智能教室', max: 100 },
      { name: '实训基地', max: 100 },
      { name: '数字设备', max: 100 },
      { name: '网络平台', max: 100 },
      { name: '教学软件', max: 100 },
      { name: '虚拟实验', max: 100 }
    ],
    data: [
      {
        value: [85, 78, 92, 95, 88, 83],
        name: '利用率',
        itemStyle: { color: '#4fd6ff' },
        areaStyle: { color: 'rgba(79, 214, 255, 0.3)' }
      }
    ]
  }
}

// 统计概览数据
export const generateOverviewStats = () => {
  return {
    studentTotal: 15680 + Math.floor(Math.random() * 200), // 动态变化
    teacherTotal: 860 + Math.floor(Math.random() * 20),
    courseTotal: 1250 + Math.floor(Math.random() * 50),
    classroomTotal: 320 + Math.floor(Math.random() * 10),
    labTotal: 85 + Math.floor(Math.random() * 5),
    digitalDevices: 2800 + Math.floor(Math.random() * 100)
  }
}

// 关键性能指标
export const generateKeyMetrics = () => {
  return {
    courseCompletionRate: (Math.random() * 5 + 90).toFixed(1), // 90-95%
    teachingQualityScore: (Math.random() * 0.3 + 4.6).toFixed(1), // 4.6-4.9
    employmentRate: (Math.random() * 4 + 95).toFixed(1), // 95-99%
    digitalEquipmentRate: (Math.random() * 10 + 85).toFixed(1), // 85-95%
    onlineParticipation: (Math.random() * 8 + 88).toFixed(1), // 88-96%
    industryCooperationRate: (Math.random() * 15 + 75).toFixed(1) // 75-90%
  }
}

// 数据质量监控
export const generateDataQuality = () => {
  return {
    completeness: Math.floor(Math.random() * 5) + 93, // 93-98%
    accuracy: Math.floor(Math.random() * 3) + 96, // 96-99%
    timeliness: Math.floor(Math.random() * 8) + 90, // 90-98%
    consistency: Math.floor(Math.random() * 5) + 92 // 92-97%
  }
}

// 实时新闻动态
export const generateRealTimeNews = () => {
  const newsTemplates = [
    '智能制造专业学生在全国技能大赛中获得一等奖',
    '新建数字化实训基地正式投入使用，可容纳500名学生同时实训',
    '与华为公司签署校企合作协议，共建5G+智慧教育实验室',
    '本学期线上教学质量评估结果出炉，满意度达到98.5%',
    '毕业生就业质量报告发布，对口就业率创新高',
    '数字化校园建设项目通过验收，实现全场景智能化管理',
    '新增3个国家级优质专业建设项目获批立项',
    '学生创新创业项目在省级比赛中斩获金奖',
    '教师团队获得国家级教学成果奖二等奖',
    '智慧图书馆系统上线，支持AI智能推荐功能'
  ]
  
  const getRandomTime = () => {
    const hour = Math.floor(Math.random() * 12) + 8 // 8-19点
    const minute = Math.floor(Math.random() * 60)
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }
  
  return newsTemplates.map(content => ({
    time: getRandomTime(),
    content,
    type: Math.random() > 0.5 ? 'success' : 'info'
  })).sort((a, b) => b.time.localeCompare(a.time))
}

// 院系数据分布
export const generateDepartmentData = () => {
  const departments = [
    '智能制造学院',
    '信息技术学院', 
    '商贸管理学院',
    '交通工程学院',
    '建筑工程学院',
    '健康护理学院',
    '艺术设计学院',
    '基础教育学院'
  ]
  
  return departments.map(dept => ({
    name: dept,
    students: Math.floor(Math.random() * 1500) + 1000,
    teachers: Math.floor(Math.random() * 80) + 50,
    courses: Math.floor(Math.random() * 100) + 80,
    labs: Math.floor(Math.random() * 15) + 8
  }))
}

// 技能证书获取情况
export const generateCertificateData = () => {
  const certificates = [
    '国家职业资格证书',
    '行业技能等级证书',
    '专项能力证书',
    '国际认证证书',
    '企业内部证书'
  ]
  
  return certificates.map(cert => ({
    name: cert,
    count: Math.floor(Math.random() * 800) + 200,
    passRate: Math.floor(Math.random() * 20) + 80
  }))
}

// 校企合作数据
export const generateCooperationData = () => {
  return {
    totalPartners: 156 + Math.floor(Math.random() * 20),
    activeProjects: 89 + Math.floor(Math.random() * 10),
    internshipBases: 245 + Math.floor(Math.random() * 15),
    graduateEmployed: Math.floor(Math.random() * 5) + 93, // 就业率
    industryDistribution: [
      { name: '制造业', value: 35, color: '#4fd6ff' },
      { name: '信息技术', value: 28, color: '#36ce9e' },
      { name: '现代服务业', value: 22, color: '#f39c12' },
      { name: '建筑工程', value: 15, color: '#e74c3c' }
    ]
  }
}

// 实时在线数据
export const generateOnlineData = () => {
  return {
    onlineStudents: Math.floor(Math.random() * 3000) + 8000,
    onlineTeachers: Math.floor(Math.random() * 200) + 400,
    activeCourses: Math.floor(Math.random() * 100) + 250,
    systemLoad: Math.floor(Math.random() * 30) + 60, // 系统负载 60-90%
    networkQuality: Math.floor(Math.random() * 10) + 90 // 网络质量 90-100%
  }
}

// 生成98张表的上报率测试数据，区分年报、月报、周报、日报
export function getReportRateMockData() {
  const months = Array.from({ length: 12 }, (_, i) => `${i + 1}月`)
  // 假设年报10张，月报40张，周报30张，日报18张
  const yearCount = 10, monthCount = 40, weekCount = 30, dayCount = 18
  // 年报：只在12月有上报
  const yearReport = months.map((m, i) => (i === 11 ? yearCount : 0))
  // 月报：每月都上报
  const monthReport = months.map(() => monthCount)
  // 周报：每月按4周上报
  const weekReport = months.map(() => Math.round(weekCount * (Math.random() * 0.2 + 0.8)))
  // 日报：每月按28~31天上报
  const dayReport = months.map(() => Math.round(dayCount * (Math.random() * 0.2 + 0.8)))
  // 合计上报数
  const totalReport = months.map((_, i) => yearReport[i] + monthReport[i] + weekReport[i] + dayReport[i])
  // 上报率（假设应报98张）
  const reportRate = totalReport.map(n => Math.round((n / 98) * 100))
  // 本季度（假设为10~12月）
  const quarterMonths = months.slice(9, 12)
  const quarterReportRate = reportRate.slice(9, 12)
  // 本月（假设为12月）
  const monthLabel = [months[11]]
  const monthReportRate = [reportRate[11]]
  return {
    year: { months, reportRate },
    quarter: { months: quarterMonths, reportRate: quarterReportRate },
    month: { months: monthLabel, reportRate: monthReportRate }
  }
}

// 获取所有模拟数据
export const getAllMockData = () => {
  return {
    studentStatus: generateStudentStatusData(),
    majorDistribution: generateMajorDistributionData(),
    courseType: generateCourseTypeData(),
    monthlyTrend: generateMonthlyTrendData(),
    resourceUtilization: generateResourceUtilizationData(),
    overviewStats: generateOverviewStats(),
    keyMetrics: generateKeyMetrics(),
    dataQuality: generateDataQuality(),
    realTimeNews: generateRealTimeNews(),
    departments: generateDepartmentData(),
    certificates: generateCertificateData(),
    cooperation: generateCooperationData(),
    onlineData: generateOnlineData()
  }
}

// 定时更新数据
export const createDataUpdater = (callback: (data: any) => void, interval: number = 5000) => {
  const update = () => {
    callback(getAllMockData())
  }
  
  // 立即执行一次
  update()
  
  // 设置定时器
  const timer = setInterval(update, interval)
  
  // 返回清理函数
  return () => clearInterval(timer)
} 