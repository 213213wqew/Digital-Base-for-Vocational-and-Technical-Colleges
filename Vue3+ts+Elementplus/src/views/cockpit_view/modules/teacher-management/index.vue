<template>
  <div class="teacher-management-module">
    <!-- 顶部统计面板 -->
    <div class="stats-dashboard">
      <div class="stat-card" v-for="(stat, index) in topStats" :key="index">
        <div class="stat-icon" :class="stat.iconClass">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stat.number }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-trend" :class="stat.trendClass">
            <i :class="stat.trendIcon"></i>
            <span>{{ stat.trend }}</span>
          </div>
        </div>
        <div class="stat-animation"></div>
      </div>
    </div>

    <!-- 主要内容区 - 2x2网格布局 -->
    <div class="content-grid">
      <!-- 职称分布饼图 -->
      <div class="card chart-card">
        <div class="card-header">
          <h3><i class="fas fa-chart-pie"></i> 职称分布</h3>
          <div class="card-meta">教师职称结构分析</div>
        </div>
        <div class="card-body">
          <div class="chart-container" ref="titleChartRef"></div>
          <div class="chart-legend">
            <div class="legend-item" v-for="(item, index) in titleDistribution" :key="index">
              <div class="legend-dot" :style="{ backgroundColor: item.color }"></div>
              <div class="legend-name">{{ item.name }}</div>
              <div class="legend-value">{{ item.count }}人</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 教学质量雷达图 -->
      <div class="card chart-card">
        <div class="card-header">
          <h3><i class="fas fa-star"></i> 教学质量评估</h3>
          <div class="quality-score">{{ overallQuality }}分</div>
        </div>
        <div class="card-body">
          <div class="chart-container" ref="qualityChartRef"></div>
          <div class="quality-summary">
            <div class="summary-item">
              <span class="summary-label">理论课程</span>
              <span class="summary-value positive">4.6</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">实践课程</span>
              <span class="summary-value positive">4.8</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">在线课程</span>
              <span class="summary-value positive">4.4</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 师资建设进度 -->
      <div class="card chart-card">
        <div class="card-header">
          <h3><i class="fas fa-seedling"></i> 师资建设进度</h3>
          <div class="total-progress">{{ totalProgress }}%</div>
        </div>
        <div class="card-body">
          <div class="chart-container" ref="progressChartRef"></div>
          <div class="progress-summary">
            <div class="summary-item">
              <span class="summary-label">培训完成率</span>
              <span class="summary-value positive">85%</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">学历提升</span>
              <span class="summary-value positive">72%</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">技能认证</span>
              <span class="summary-value positive">90%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 课程管理信息面板 -->
      <div class="card info-card">
        <div class="card-header">
          <h3><i class="fas fa-book-open"></i> 课程管理</h3>
          <div class="header-stats">
            <span class="stat-badge active">进行中: {{ activeCourses }}门</span>
            <span class="stat-badge completed">已完成: {{ completedCourses }}门</span>
          </div>
        </div>
        <div class="card-body">
          <div class="mini-chart-section">
            <div class="section-title">
              <i class="fas fa-chart-bar"></i>
              课程分布
              <span class="quality-score">{{ totalCourses }}门</span>
            </div>
            <div class="mini-chart-container">
              <div class="mini-chart" ref="courseChartRef"></div>
            </div>
          </div>
          
          <div class="mini-chart-section">
            <div class="section-title">
              <i class="fas fa-trophy"></i>
              优秀教师排行
            </div>
            <div class="teacher-rankings">
              <div class="ranking-item" v-for="(teacher, index) in topTeachers" :key="index">
                <div class="ranking-header">
                  <div class="rank-badge" :class="`rank-${index + 1}`">
                    {{ index + 1 }}
                  </div>
                  <div class="teacher-info">
                    <span class="teacher-name">{{ teacher.name }}</span>
                    <span class="teacher-dept">{{ teacher.department }}</span>
                  </div>
                  <div class="teacher-score">{{ teacher.score }}</div>
                </div>
                <div class="teacher-bar">
                  <div class="teacher-fill" :style="{ width: `${teacher.percent}%`, backgroundColor: teacher.color }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部实时动态 -->
    <div class="bottom-section">
      <div class="card activity-card">
        <div class="card-header">
          <h3><i class="fas fa-rss"></i> 实时动态</h3>
          <div class="live-indicator">
            <div class="live-dot"></div>
            实时更新
          </div>
        </div>
        <div class="card-body">
          <!-- 动态列表 -->
          <div class="activity-section">
            <div class="activity-grid">
              <div class="activity-item" v-for="(activity, index) in recentActivities.slice(0, 6)" :key="index">
                <div class="activity-icon" :class="activity.type">
                  <i :class="activity.icon"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-text">{{ activity.text }}</div>
                  <div class="activity-time">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 趋势图表 -->
          <div class="trend-section">
            <div class="trend-header">
              <h4><i class="fas fa-chart-line"></i> 师资发展趋势</h4>
              <div class="trend-value">
                <span class="current-year">2024</span>
                <span class="current-count">{{ currentYearCount }}</span>
              </div>
            </div>
            <div class="trend-chart">
              <div ref="trendChartRef" class="trend-chart-container"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'

// 顶部统计数据 - 3行2列
const topStats = ref([
  {
    number: '1,236',
    label: '教职工总数',
    icon: 'fas fa-users',
    iconClass: 'icon-blue',
    trend: '+28',
    trendIcon: 'fas fa-arrow-up',
    trendClass: 'trend-up'
  },
  {
    number: '856',
    label: '专任教师',
    icon: 'fas fa-chalkboard-teacher',
    iconClass: 'icon-cyan',
    trend: '+18',
    trendIcon: 'fas fa-arrow-up',
    trendClass: 'trend-up'
  },
  {
    number: '125',
    label: '高级职称',
    icon: 'fas fa-medal',
    iconClass: 'icon-teal',
    trend: '+8',
    trendIcon: 'fas fa-arrow-up',
    trendClass: 'trend-up'
  },
  {
    number: '1,250',
    label: '开设课程',
    icon: 'fas fa-book',
    iconClass: 'icon-indigo',
    trend: '+45',
    trendIcon: 'fas fa-arrow-up',
    trendClass: 'trend-up'
  },
  {
    number: '89',
    label: '教学名师',
    icon: 'fas fa-star',
    iconClass: 'icon-slate',
    trend: '+3',
    trendIcon: 'fas fa-arrow-up',
    trendClass: 'trend-up'
  },
  {
    number: '156',
    label: '双师型教师',
    icon: 'fas fa-user-graduate',
    iconClass: 'icon-emerald',
    trend: '+12',
    trendIcon: 'fas fa-arrow-up',
    trendClass: 'trend-up'
  }
])

// 职称分布数据
const titleDistribution = [
  { name: '教授', count: 45, color: '#3B82F6' },
  { name: '副教授', count: 125, color: '#06B6D4' },
  { name: '讲师', count: 385, color: '#8B5CF6' },
  { name: '助教', count: 301, color: '#10B981' }
]

// 教学质量数据
const qualityData = ref([
  { subject: '理论课程', score: 4.6 },
  { subject: '实践课程', score: 4.8 },
  { subject: '在线课程', score: 4.4 },
  { subject: '实验指导', score: 4.7 },
  { subject: '论文指导', score: 4.5 }
])

// 师资建设数据
const developmentData = ref([
  { name: '教师培训计划', value: 85, color: '#3B82F6' },
  { name: '学历提升项目', value: 72, color: '#06B6D4' },
  { name: '技能认证', value: 90, color: '#8B5CF6' },
  { name: '学术交流', value: 68, color: '#10B981' },
  { name: '科研能力', value: 78, color: '#F59E0B' }
])

// 课程数据
const courseData = ref([
  { name: '进行中', value: 320, color: '#3B82F6' },
  { name: '已完成', value: 580, color: '#10B981' },
  { name: '计划中', value: 180, color: '#F59E0B' },
  { name: '暂停', value: 45, color: '#EF4444' }
])

// 优秀教师排行
const topTeachers = ref([
  { name: '张明教授', department: '计算机学院', score: 4.9, percent: 98, color: '#3B82F6' },
  { name: '李华副教授', department: '软件学院', score: 4.8, percent: 96, color: '#06B6D4' },
  { name: '王强教授', department: '人工智能学院', score: 4.7, percent: 94, color: '#8B5CF6' },
  { name: '刘芳讲师', department: '数据科学学院', score: 4.6, percent: 92, color: '#10B981' }
])

// 最近活动数据
const recentActivities = ref([
  { text: '张教授的《数据结构》课程获得学生好评', time: '2分钟前', icon: 'fas fa-thumbs-up', type: 'success' },
  { text: '李副教授完成了新课程大纲设计', time: '15分钟前', icon: 'fas fa-file-alt', type: 'info' },
  { text: '本周教学质量评估已开始', time: '1小时前', icon: 'fas fa-clipboard-check', type: 'warning' },
  { text: '王教授荣获"优秀教师"称号', time: '2小时前', icon: 'fas fa-award', type: 'success' },
  { text: '师资培训计划正式启动', time: '3小时前', icon: 'fas fa-graduation-cap', type: 'info' },
  { text: '新学期课程安排已发布', time: '4小时前', icon: 'fas fa-calendar', type: 'info' },
  { text: '教学设备更新维护完成', time: '5小时前', icon: 'fas fa-tools', type: 'success' },
  { text: '学科建设专题会议召开', time: '6小时前', icon: 'fas fa-users', type: 'info' },
  { text: '优秀教案评选活动开始', time: '7小时前', icon: 'fas fa-book', type: 'warning' },
  { text: '教师职业发展规划研讨会', time: '8小时前', icon: 'fas fa-chart-line', type: 'info' }
])

// 图表引用
const titleChartRef = ref()
const qualityChartRef = ref()
const progressChartRef = ref()
const courseChartRef = ref()
const trendChartRef = ref()

// 师资发展趋势数据
const trendData = ref([
  { year: '2019', count: 3200 },
  { year: '2020', count: 3400 },
  { year: '2021', count: 3600 },
  { year: '2022', count: 3800 },
  { year: '2023', count: 4000 },
  { year: '2024', count: 4200 }
])

// 计算属性
const overallQuality = computed(() => {
  const avg = qualityData.value.reduce((sum, item) => sum + item.score, 0) / qualityData.value.length
  return avg.toFixed(1)
})

const totalProgress = computed(() => {
  const avg = developmentData.value.reduce((sum, item) => sum + item.value, 0) / developmentData.value.length
  return Math.round(avg)
})

const activeCourses = computed(() => {
  return courseData.value.find(item => item.name === '进行中')?.value || 0
})

const completedCourses = computed(() => {
  return courseData.value.find(item => item.name === '已完成')?.value || 0
})

const totalCourses = computed(() => {
  return courseData.value.reduce((sum, item) => sum + item.value, 0)
})

const currentYearCount = computed(() => {
  const currentYear = trendData.value.find(item => item.year === '2024')
  return currentYear ? currentYear.count.toLocaleString() : '0'
})

// 初始化职称分布饼图
const initTitleChart = () => {
  if (!titleChartRef.value) {
    console.error('titleChartRef is not ready')
    return
  }
  
  try {
    const chart = echarts.init(titleChartRef.value)
    
    const option = {
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: titleDistribution.map(item => ({
          name: item.name,
          value: item.count,
          itemStyle: { color: item.color }
        })),
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
        label: { show: false },
        labelLine: { show: false }
      }],
      backgroundColor: 'transparent'
    }
    
    chart.setOption(option)
    window.addEventListener('resize', () => chart.resize())
    console.log('Title chart initialized successfully')
  } catch (error) {
    console.error('Error initializing title chart:', error)
  }
}

// 初始化教学质量雷达图
const initQualityChart = () => {
  if (!qualityChartRef.value) {
    console.error('qualityChartRef is not ready')
    return
  }
  
  try {
    const chart = echarts.init(qualityChartRef.value)
  
    const option = {
      radar: {
        indicator: qualityData.value.map(item => ({
          name: item.subject,
          max: 5
        })),
        radius: '70%',
        center: ['50%', '50%'],
        axisName: {
          color: '#94A3B8',
          fontSize: 10
        },
        axisLine: {
          lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        splitLine: {
          lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        splitArea: { show: false }
      },
      series: [{
        type: 'radar',
        data: [{
          value: qualityData.value.map(item => item.score),
          areaStyle: {
            color: {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
              ]
            }
          },
          lineStyle: { color: '#3B82F6', width: 2 },
          itemStyle: { color: '#3B82F6' }
        }]
      }],
      backgroundColor: 'transparent'
    }
    
    chart.setOption(option)
    window.addEventListener('resize', () => chart.resize())
    console.log('Quality chart initialized successfully')
  } catch (error) {
    console.error('Error initializing quality chart:', error)
  }
}

// 初始化师资建设进度图
const initProgressChart = () => {
  if (!progressChartRef.value) {
    console.error('progressChartRef is not ready')
    return
  }
  
  try {
    const chart = echarts.init(progressChartRef.value)
    
    const option = {
      grid: { top: '10%', left: '3%', right: '4%', bottom: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        data: developmentData.value.map(item => item.name),
        axisLabel: { color: '#94A3B8', fontSize: 10, interval: 0, rotate: -45 },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { color: '#94A3B8', fontSize: 10 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
      },
      series: [{
        type: 'bar',
        data: developmentData.value.map(item => ({
          value: item.value,
          itemStyle: { color: item.color }
        })),
        barWidth: '60%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.3)' } }
      }],
      backgroundColor: 'transparent'
    }
    
    chart.setOption(option)
    window.addEventListener('resize', () => chart.resize())
    console.log('Progress chart initialized successfully')
  } catch (error) {
    console.error('Error initializing progress chart:', error)
  }
}

// 初始化课程迷你图
const initCourseChart = () => {
  if (!courseChartRef.value) {
    console.error('courseChartRef is not ready')
    return
  }
  
  try {
    const chart = echarts.init(courseChartRef.value)
    
    const option = {
      series: [{
        type: 'pie',
        radius: ['50%', '80%'],
        center: ['50%', '50%'],
        data: courseData.value.slice(0, 4).map(item => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: item.color }
        })),
        label: { show: false },
        labelLine: { show: false }
      }],
      backgroundColor: 'transparent'
    }
    
    chart.setOption(option)
    window.addEventListener('resize', () => chart.resize())
    console.log('Course chart initialized successfully')
  } catch (error) {
    console.error('Error initializing course chart:', error)
  }
}

// 初始化趋势图表
const initTrendChart = () => {
  if (!trendChartRef.value) {
    console.error('trendChartRef is not ready')
    return
  }
  
  try {
    const chart = echarts.init(trendChartRef.value)
    
    const option = {
      grid: { 
        top: '10%', 
        left: '3%', 
        right: '4%', 
        bottom: '10%', 
        containLabel: true 
      },
      xAxis: {
        type: 'category',
        data: trendData.value.map(item => item.year),
        axisLabel: { 
          color: '#94A3B8', 
          fontSize: 12 
        },
        axisLine: { 
          lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } 
        },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: { 
          color: '#94A3B8', 
          fontSize: 10,
          formatter: function(value: number) {
            if (value >= 1000) {
              return (value/1000).toFixed(1) + 'k'
            }
            return value
          }
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { 
          lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } 
        }
      },
      series: [{
        type: 'line',
        data: trendData.value.map(item => item.count),
        smooth: true,
        lineStyle: {
          color: '#06B6D4',
          width: 3
        },
        itemStyle: {
          color: '#06B6D4',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(6, 182, 212, 0.3)' },
              { offset: 1, color: 'rgba(6, 182, 212, 0.05)' }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(6, 182, 212, 0.5)'
          }
        }
      }],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: { color: '#fff' },
        formatter: function(params: any) {
          const data = params[0]
          return `${data.name}<br/>${data.seriesName}: ${data.value.toLocaleString()}`
        }
      },
      backgroundColor: 'transparent'
    }
    
    chart.setOption(option)
    window.addEventListener('resize', () => chart.resize())
    console.log('Trend chart initialized successfully')
  } catch (error) {
    console.error('Error initializing trend chart:', error)
  }
}

// 组件挂载后初始化
onMounted(() => {
  console.log('Component mounted, initializing charts...')
  
  // 使用更长的延迟确保DOM完全渲染后再初始化图表
      setTimeout(() => {
      console.log('DOM refs check:', {
        titleChart: !!titleChartRef.value,
        qualityChart: !!qualityChartRef.value,
        progressChart: !!progressChartRef.value,
        courseChart: !!courseChartRef.value,
        trendChart: !!trendChartRef.value
      })
      
      if (titleChartRef.value) initTitleChart()
      if (qualityChartRef.value) initQualityChart()
      if (progressChartRef.value) initProgressChart()
      if (courseChartRef.value) initCourseChart()
      if (trendChartRef.value) initTrendChart()
    }, 500)
})
</script>

<style scoped lang="scss">
.teacher-management-module {
  padding: 24px;
  background: #0a0e27;
  color: #fff;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

// 顶部统计面板
.stats-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  
  .stat-card {
    position: relative;
    background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #fff;
      
      &.icon-blue { background: linear-gradient(135deg, #667eea, #764ba2); }
      &.icon-green { background: linear-gradient(135deg, #f093fb, #f5576c); }
      &.icon-gold { background: linear-gradient(135deg, #ffd89b, #19547b); }
      &.icon-purple { background: linear-gradient(135deg, #a8edea, #fed6e3); }
      &.icon-orange { background: linear-gradient(135deg, #ff9a9e, #fecfef); }
      &.icon-cyan { background: linear-gradient(135deg, #a8edea, #fed6e3); }
    }
    
    .stat-content {
      flex: 1;
      
      .stat-number {
        font-size: 28px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 4px;
        line-height: 1;
      }
      
      .stat-label {
        font-size: 14px;
        color: #8b9dc3;
        margin-bottom: 8px;
      }
      
      .stat-trend {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        font-weight: 500;
        
        &.trend-up {
          color: #00ff88;
        }
      }
    }
    
    .stat-animation {
      position: absolute;
      top: 0;
      right: -50%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transform: skewX(-20deg);
      transition: all 0.6s ease;
      opacity: 0;
    }
    
    &:hover .stat-animation {
      right: 100%;
      opacity: 1;
    }
  }
}

// 主要内容区 - 2x2网格布局
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
  min-height: 520px;
  align-items: stretch;
}

// 卡片样式
.card {
  background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.15);
  }
  
  .card-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      
      i {
        font-size: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    
    .card-meta {
      font-size: 12px;
      color: #8b9dc3;
    }
    
    .quality-score, .development-progress {
      font-size: 24px;
      font-weight: 700;
      color: #00ff88;
    }
  }
  
  .card-body {
    padding: 20px 24px 24px;
  }
}

// 职称分布图
.title-distribution-card {
  .chart-container {
    display: flex;
    gap: 24px;
    align-items: center;
    
    .donut-chart {
      position: relative;
      width: 120px;
      height: 120px;
      
      .donut-svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }
      
      .chart-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        
        .center-number {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }
        
        .center-label {
          font-size: 12px;
          color: #8b9dc3;
        }
      }
    }
    
    .legend-grid {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .legend-info {
          display: flex;
          flex-direction: column;
          
          .legend-name {
            font-size: 14px;
            color: #fff;
          }
          
          .legend-count {
            font-size: 12px;
            color: #8b9dc3;
          }
        }
      }
    }
  }
}

// 教学质量
.quality-card {
  .quality-metrics {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .metric-row {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .metric-info {
        min-width: 80px;
        
        .metric-name {
          display: block;
          font-size: 14px;
          color: #fff;
        }
        
        .metric-value {
          font-size: 12px;
          color: #8b9dc3;
        }
      }
      
      .metric-bar {
        flex: 1;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
        
        .metric-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      }
      
      .metric-percent {
        min-width: 40px;
        text-align: right;
        font-size: 12px;
        color: #8b9dc3;
      }
    }
  }
}

// 课程管理
.course-card {
  .card-header {
    .course-filter {
      display: flex;
      gap: 4px;
      
      .filter-btn {
        padding: 6px 12px;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: #8b9dc3;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover, &.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-color: transparent;
          color: #fff;
        }
      }
    }
  }
  
  .course-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 400px;
    overflow-y: auto;
    
    .course-item {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      padding: 16px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.06);
        transform: translateX(4px);
      }
      
      .course-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .course-title {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }
        
        .course-status {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          
          &.status-active {
            background: rgba(0, 255, 136, 0.2);
            color: #00ff88;
          }
          
          &.status-completed {
            background: rgba(102, 126, 234, 0.2);
            color: #667eea;
          }
          
          &.status-planned {
            background: rgba(255, 181, 107, 0.2);
            color: #ffb56b;
          }
        }
      }
      
      .course-details {
        display: flex;
        gap: 16px;
        margin-bottom: 12px;
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #8b9dc3;
          
          &.rating {
            color: #ffd700;
          }
          
          i {
            font-size: 10px;
          }
        }
      }
      
      .course-progress {
        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 12px;
          color: #8b9dc3;
        }
        
        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #00ff88, #00d4aa);
            border-radius: 2px;
            transition: width 0.3s ease;
          }
        }
      }
    }
  }
}

// 实时动态卡片
.activity-card {
  .card-header {
    .live-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #00ff88;
      
      .live-dot {
        width: 8px;
        height: 8px;
        background: #00ff88;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
    }
  }
  
  .card-body {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  // 动态列表部分
  .activity-section {
    .activity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 12px;
      
      .activity-item {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateX(2px);
        }
        
        .activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          
          &.success {
            background: rgba(0, 255, 136, 0.2);
            color: #00ff88;
          }
          
          &.info {
            background: rgba(102, 126, 234, 0.2);
            color: #667eea;
          }
          
          &.warning {
            background: rgba(255, 181, 107, 0.2);
            color: #ffb56b;
          }
        }
        
        .activity-content {
          flex: 1;
          
          .activity-text {
            font-size: 14px;
            color: #fff;
            margin-bottom: 4px;
            line-height: 1.4;
          }
          
          .activity-time {
            font-size: 12px;
            color: #8b9dc3;
          }
        }
      }
    }
  }
  
  // 趋势图表部分
  .trend-section {
    .trend-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        
        i {
          font-size: 18px;
          color: #06B6D4;
        }
      }
      
      .trend-value {
        display: flex;
        align-items: baseline;
        gap: 8px;
        
        .current-year {
          font-size: 14px;
          color: #8b9dc3;
        }
        
        .current-count {
          font-size: 24px;
          font-weight: 700;
          color: #06B6D4;
        }
      }
    }
    
    .trend-chart {
      .trend-chart-container {
        width: 100%;
        height: 200px;
        min-height: 200px;
        position: relative;
      }
    }
  }
}

// 师资建设
.development-card {
  .development-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .dev-item {
      display: flex;
      gap: 12px;
      
      .dev-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 16px;
      }
      
      .dev-content {
        flex: 1;
        
        .dev-title {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }
        
        .dev-desc {
          font-size: 12px;
          color: #8b9dc3;
          margin-bottom: 8px;
        }
        
        .dev-progress {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .progress-bar {
            flex: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            
            .progress-fill {
              height: 100%;
              border-radius: 3px;
              transition: width 0.3s ease;
            }
          }
          
          .progress-text {
            font-size: 12px;
            color: #8b9dc3;
            min-width: 30px;
          }
        }
      }
    }
  }
}

// 教师排行
.ranking-card {
  .ranking-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .ranking-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.06);
        transform: translateX(4px);
      }
      
      .rank-badge {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        color: #fff;
        
        &.rank-1 { background: linear-gradient(135deg, #ffd700, #ffed4e); }
        &.rank-2 { background: linear-gradient(135deg, #c0c0c0, #e8e8e8); }
        &.rank-3 { background: linear-gradient(135deg, #cd7f32, #ffb347); }
        &:not(.rank-1):not(.rank-2):not(.rank-3) { 
          background: rgba(255, 255, 255, 0.1); 
        }
      }
      
      .teacher-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .teacher-info {
        flex: 1;
        
        .teacher-name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 2px;
        }
        
        .teacher-dept {
          font-size: 12px;
          color: #8b9dc3;
        }
      }
      
      .teacher-score {
        font-size: 16px;
        font-weight: 700;
        color: #00ff88;
      }
    }
  }
}

// 图表容器样式
.chart-container {
  width: 100%;
  height: 300px;
  min-height: 300px;
  position: relative;
}

.mini-chart {
  width: 100%;
  height: 120px;
  min-height: 120px;
  position: relative;
}

.mini-chart-container {
  margin-top: 12px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// 响应式设计
@media (max-width: 1200px) {
  .content-layout {
    grid-template-columns: 1fr 1fr;
    
    .right-column {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
  }
}

@media (max-width: 768px) {
  .stats-dashboard {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
  }
  
  .content-layout {
    grid-template-columns: 1fr;
    gap: 20px;
    
    .right-column {
      grid-template-columns: 1fr;
    }
  }
  
  .teacher-management-module {
    padding: 16px;
  }
}
</style> 