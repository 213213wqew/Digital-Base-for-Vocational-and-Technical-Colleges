<template>
  <div class="student-management-module">
    <!-- 顶部统计数据 -->
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
            {{ stat.trend }}
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="content-grid">
      <!-- 学籍状态分布饼图 -->
      <div class="card chart-card">
        <div class="card-header">
          <h3><i class="fas fa-chart-pie"></i> 学籍状态分布</h3>
          <div class="card-meta">各学籍状态分布统计</div>
        </div>
        <div class="card-body">
          <div class="chart-container" ref="statusChartRef"></div>
          <div class="chart-legend">
            <div class="legend-item" v-for="(item, index) in studentStatusData" :key="index">
              <div class="legend-dot" :style="{ backgroundColor: item.color }"></div>
              <div class="legend-name">{{ item.name }}</div>
              <div class="legend-value">{{ item.value }}人</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 专业学生对比柱状图 -->
      <div class="card chart-card">
        <div class="card-header">
          <h3><i class="fas fa-chart-bar"></i> 专业学生对比</h3>
          <div class="chart-filter">
            <button class="filter-btn" :class="{ active: activeFilter === 'total' }" @click="activeFilter = 'total'">总数</button>
            <button class="filter-btn" :class="{ active: activeFilter === 'freshmen' }" @click="activeFilter = 'freshmen'">新生</button>
            <button class="filter-btn" :class="{ active: activeFilter === 'graduates' }" @click="activeFilter = 'graduates'">毕业生</button>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" ref="majorChartRef"></div>
        </div>
      </div>

      <!-- 成绩分析趋势图 -->
      <div class="card chart-card">
        <div class="card-header">
          <h3><i class="fas fa-chart-line"></i> 成绩分析趋势</h3>
          <div class="total-enrollment">{{ totalStudents }}人</div>
        </div>
        <div class="card-body">
          <div class="chart-container" ref="gradeChartRef"></div>
          <div class="trend-summary">
            <div class="summary-item">
              <span class="summary-label">平均分</span>
              <span class="summary-value positive">85.5</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">优秀率</span>
              <span class="summary-value positive">23.8%</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">及格率</span>
              <span class="summary-value positive">98.6%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 奖惩统计信息面板 -->
      <div class="card info-card">
        <div class="card-header">
          <h3><i class="fas fa-trophy"></i> 奖惩统计</h3>
          <div class="header-stats">
            <span class="stat-badge reward">奖励: {{ totalRewards }}人</span>
            <span class="stat-badge punishment">处分: {{ totalPunishments }}人</span>
          </div>
        </div>
        <div class="card-body">
          <div class="mini-chart-section">
            <div class="section-title">
              <i class="fas fa-award"></i>
              奖励分布
              <span class="quality-score">{{ totalRewards }}人</span>
            </div>
            <div class="mini-chart-container">
              <div class="mini-chart" ref="rewardChartRef"></div>
            </div>
          </div>
          
          <div class="mini-chart-section">
            <div class="section-title">
              <i class="fas fa-exclamation-triangle"></i>
              处分情况
            </div>
            <div class="punishment-categories">
              <div class="punishment-category" v-for="(punishment, index) in punishmentList" :key="index">
                <div class="category-header">
                  <div class="category-icon" :style="{ backgroundColor: punishment.color }">
                    <i class="fas fa-exclamation"></i>
                  </div>
                  <div class="category-info">
                    <span class="category-name">{{ punishment.title }}</span>
                    <span class="category-count">{{ punishment.count }}人</span>
                  </div>
                  <div class="category-percent">{{ punishment.percent }}%</div>
                </div>
                <div class="category-bar">
                  <div class="category-fill" :style="{ width: `${punishment.percent}%`, backgroundColor: punishment.color }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部实时活动 -->
    <div class="bottom-section">
      <div class="card activity-card">
        <div class="card-header">
          <h3><i class="fas fa-bell"></i> 学生动态</h3>
          <div class="live-indicator">
            <div class="live-dot"></div>
            实时更新
          </div>
        </div>
        <div class="card-body">
          <div class="activity-grid">
            <div class="activity-item" v-for="(activity, index) in recentActivities" :key="index">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed, watch } from 'vue'
import * as echarts from 'echarts'

// 顶部统计数据
const topStats = ref([
  { number: '15,680', label: '在校学生', icon: 'fas fa-user-graduate', iconClass: 'icon-blue', trend: '+320', trendIcon: 'fas fa-arrow-up', trendClass: 'trend-up' },
  { number: '3,850', label: '新入学', icon: 'fas fa-plus-circle', iconClass: 'icon-cyan', trend: '+120', trendIcon: 'fas fa-arrow-up', trendClass: 'trend-up' },
  { number: '3,200', label: '即将毕业', icon: 'fas fa-graduation-cap', iconClass: 'icon-teal', trend: '+80', trendIcon: 'fas fa-arrow-up', trendClass: 'trend-up' },
  { number: '1,250', label: '优秀学生', icon: 'fas fa-star', iconClass: 'icon-indigo', trend: '+45', trendIcon: 'fas fa-arrow-up', trendClass: 'trend-up' },
  { number: '125', label: '预警学生', icon: 'fas fa-exclamation-triangle', iconClass: 'icon-slate', trend: '-15', trendIcon: 'fas fa-arrow-down', trendClass: 'trend-down' },
  { number: '89', label: '休学学生', icon: 'fas fa-pause-circle', iconClass: 'icon-emerald', trend: '+5', trendIcon: 'fas fa-arrow-up', trendClass: 'trend-up' }
])

// 学籍状态数据
const studentStatusData = [
  { name: '在校学习', value: 14520, color: '#3B82F6' },
  { name: '企业实习', value: 680, color: '#06B6D4' },
  { name: '休学保留', value: 320, color: '#F59E0B' },
  { name: '其他状态', value: 160, color: '#EF4444' }
]

// 专业学生数据
const majorData = ref([
  { name: '智能制造技术', total: 2150, freshmen: 520, graduates: 480, color: '#3B82F6' },
  { name: '软件技术', total: 1980, freshmen: 480, graduates: 450, color: '#06B6D4' },
  { name: '电子商务', total: 1750, freshmen: 420, graduates: 380, color: '#8B5CF6' },
  { name: '建筑工程技术', total: 1650, freshmen: 380, graduates: 360, color: '#10B981' },
  { name: '汽车检测与维修', total: 1450, freshmen: 350, graduates: 320, color: '#F59E0B' },
  { name: '护理专业', total: 1320, freshmen: 320, graduates: 280, color: '#EF4444' }
])

// 成绩分析数据
const gradeData = ref([
  { subject: '专业核心课程', score: 82.5, count: 15680 },
  { subject: '公共基础课程', score: 85.2, count: 15680 },
  { subject: '实践技能课程', score: 88.9, count: 15680 }
])

// 奖励数据
const rewardData = ref([
  { name: '国家奖学金', value: 45, color: '#10B981' },
  { name: '国家励志奖学金', value: 320, color: '#3B82F6' },
  { name: '学院奖学金', value: 1250, color: '#06B6D4' },
  { name: '优秀学生干部', value: 280, color: '#8B5CF6' }
])

// 处分数据
const punishmentList = ref([
  { title: '警告处分', count: 85, color: '#F59E0B', percent: 51.5 },
  { title: '严重警告', count: 45, color: '#EF4444', percent: 27.3 },
  { title: '记过处分', count: 25, color: '#DC2626', percent: 15.2 },
  { title: '留校察看', count: 8, color: '#991B1B', percent: 4.8 },
  { title: '开除学籍', count: 2, color: '#7F1D1D', percent: 1.2 }
])

// 最近活动数据
const recentActivities = ref([
  { text: '2024届毕业生学位授予仪式圆满举行', time: '2分钟前', icon: 'fas fa-graduation-cap', type: 'success' },
  { text: '智能制造学院新生报到工作顺利完成', time: '5分钟前', icon: 'fas fa-user-plus', type: 'info' },
  { text: '学生会主席团换届选举结果公示', time: '8分钟前', icon: 'fas fa-vote-yea', type: 'info' },
  { text: '校园安全检查发现违规用电学生宿舍', time: '12分钟前', icon: 'fas fa-exclamation-triangle', type: 'warning' },
  { text: '2024年国家奖学金评选结果出炉', time: '15分钟前', icon: 'fas fa-trophy', type: 'success' },
  { text: '期末考试违纪学生处理决定发布', time: '18分钟前', icon: 'fas fa-ban', type: 'warning' },
  { text: '优秀毕业生就业推荐会成功举办', time: '22分钟前', icon: 'fas fa-briefcase', type: 'success' },
  { text: '学生心理健康辅导中心开放日活动', time: '25分钟前', icon: 'fas fa-heart', type: 'info' },
  { text: '全国技能大赛获奖学生表彰大会', time: '28分钟前', icon: 'fas fa-medal', type: 'success' },
  { text: '新学期学籍注册工作全面启动', time: '30分钟前', icon: 'fas fa-clipboard-check', type: 'info' }
])

// 图表引用
const statusChartRef = ref()
const majorChartRef = ref()
const gradeChartRef = ref()
const rewardChartRef = ref()

// 活动筛选器
const activeFilter = ref('total')

// 计算属性
const totalStudents = computed(() => {
  return studentStatusData.reduce((sum, item) => sum + item.value, 0).toLocaleString()
})

const totalRewards = computed(() => {
  return rewardData.value.reduce((sum, item) => sum + item.value, 0)
})

const totalPunishments = computed(() => {
  return punishmentList.value.reduce((sum, item) => sum + item.count, 0)
})

// 初始化学籍状态饼图
const initStatusChart = () => {
  const chart = echarts.init(statusChartRef.value)
  
  const option = {
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      data: studentStatusData.map(item => ({
        name: item.name,
        value: item.value,
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
}

// 初始化专业对比柱状图
const initMajorChart = () => {
  const chart = echarts.init(majorChartRef.value)
  
  const updateChart = () => {
    const dataKey = activeFilter.value
    const data = majorData.value.map(item => ({
      name: item.name.length > 6 ? item.name.substring(0, 6) + '...' : item.name,
      value: item[dataKey as keyof typeof item] as number,
      itemStyle: { color: item.color }
    }))
    
    const option = {
      grid: { top: '10%', left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        axisLabel: { color: '#94A3B8', fontSize: 10, interval: 0, rotate: -30 },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#94A3B8', fontSize: 10 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
      },
      series: [{
        type: 'bar',
        data: data,
        barWidth: '60%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.3)' } }
      }],
      backgroundColor: 'transparent'
    }
    
    chart.setOption(option)
  }
  
  updateChart()
  
  // 监听筛选器变化
  watch(() => activeFilter.value, updateChart)
  
  window.addEventListener('resize', () => chart.resize())
}

// 初始化成绩趋势图
const initGradeChart = () => {
  const chart = echarts.init(gradeChartRef.value)
  
  const option = {
    grid: { top: '15%', left: '3%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: gradeData.value.map(item => item.subject),
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      min: 75,
      max: 95,
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    },
    series: [{
      type: 'line',
      data: gradeData.value.map(item => item.score),
      smooth: true,
      lineStyle: { color: '#3B82F6', width: 3 },
      itemStyle: { color: '#3B82F6' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
          ]
        }
      }
    }],
    backgroundColor: 'transparent'
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化奖励迷你图
const initRewardChart = () => {
  const chart = echarts.init(rewardChartRef.value)
  
  const option = {
    series: [{
      type: 'pie',
      radius: ['50%', '80%'],
      center: ['50%', '50%'],
      data: rewardData.value.slice(0, 4).map(item => ({
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
}

// 组件挂载后初始化
onMounted(() => {
  nextTick(() => {
    initStatusChart()
    initMajorChart()
    initGradeChart()
    initRewardChart()
  })
})
</script>

<style scoped lang="scss">
.student-management-module {
  padding: 24px;
  background: 
    radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.06) 0%, transparent 40%),
    radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.06) 0%, transparent 40%),
    linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%);
  color: #fff;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 15% 85%, rgba(59, 130, 246, 0.02) 0%, transparent 35%),
      radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.02) 0%, transparent 35%),
      radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.02) 0%, transparent 40%);
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
}

// 顶部统计仪表板 - 3行2列网格
.stats-dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  height: 240px;

  .stat-card {
    position: relative;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      transition: all 0.3s ease;
    }
    
    &::before {
      top: -1px;
      left: -1px;
      border-top: 2px solid transparent;
      border-left: 2px solid transparent;
      border-image: linear-gradient(135deg, #3B82F6, #06B6D4) 1;
      border-radius: 16px 0 0 0;
    }
    
    &::after {
      bottom: -1px;
      right: -1px;
      border-bottom: 2px solid transparent;
      border-right: 2px solid transparent;
      border-image: linear-gradient(135deg, #8B5CF6, #10B981) 1;
      border-radius: 0 0 16px 0;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 8px 32px rgba(59, 130, 246, 0.15),
        0 0 30px rgba(59, 130, 246, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
      
      &::before,
      &::after {
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
      }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #fff;
      flex-shrink: 0;
      
      &.icon-blue { background: linear-gradient(135deg, #3B82F6, #1D4ED8); }
      &.icon-cyan { background: linear-gradient(135deg, #06B6D4, #0891B2); }
      &.icon-teal { background: linear-gradient(135deg, #14B8A6, #0D9488); }
      &.icon-indigo { background: linear-gradient(135deg, #6366F1, #4F46E5); }
      &.icon-slate { background: linear-gradient(135deg, #64748B, #475569); }
      &.icon-emerald { background: linear-gradient(135deg, #10B981, #059669); }
    }

    .stat-content {
      flex: 1;
      
      .stat-number {
        font-size: 24px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 4px;
        line-height: 1;
      }

      .stat-label {
        font-size: 13px;
        color: #94A3B8;
        margin-bottom: 6px;
        font-weight: 500;
      }

      .stat-trend {
        font-size: 11px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;

        &.trend-up { color: #10B981; }
        &.trend-down { color: #EF4444; }
      }
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
  height: 520px;
}

// 卡片样式
.card {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    transition: all 0.3s ease;
    z-index: 1;
  }
  
  &::before {
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
    border-top: 2px solid transparent;
    border-left: 2px solid transparent;
    border-image: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%) 1;
    border-radius: 16px 0 0 0;
    opacity: 0.7;
  }
  
  &::after {
    bottom: 0;
    right: 0;
    width: 30px;
    height: 30px;
    border-bottom: 2px solid transparent;
    border-right: 2px solid transparent;
    border-image: linear-gradient(135deg, #8B5CF6 0%, #10B981 100%) 1;
    border-radius: 0 0 16px 0;
    opacity: 0.7;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.2), 0 0 40px rgba(59, 130, 246, 0.1);
    
    &::before,
    &::after {
      opacity: 1;
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
      width: 40px;
      height: 40px;
    }
  }
  
  .card-header {
    position: relative;
    padding: 16px 20px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
      border-top: 1px solid transparent;
      border-right: 1px solid transparent;
      border-image: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3)) 1;
      border-radius: 0 16px 0 0;
      opacity: 0.6;
    }
    
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      
      i {
        font-size: 18px;
        background: linear-gradient(135deg, #3B82F6, #06B6D4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    
    .card-meta {
      font-size: 11px;
      color: #94A3B8;
    }
    
    .total-enrollment, .quality-score {
      font-size: 18px;
      font-weight: 700;
      color: #10B981;
    }
    
    .header-stats {
      display: flex;
      gap: 8px;
      
      .stat-badge {
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        
        &.reward {
          background: rgba(59, 130, 246, 0.2);
          color: #3B82F6;
        }
        
        &.punishment {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
        }
      }
    }
    
    .chart-filter {
      display: flex;
      gap: 4px;
      
      .filter-btn {
        position: relative;
        padding: 4px 8px;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 6px;
        color: #CBD5E1;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 8px;
          height: 8px;
          border-top: 1px solid transparent;
          border-right: 1px solid transparent;
          border-image: linear-gradient(135deg, #3B82F6, #06B6D4) 1;
          border-radius: 0 6px 0 0;
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        &:hover, &.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1));
          border-color: rgba(59, 130, 246, 0.3);
          color: #fff;
          
          &::before {
            opacity: 1;
          }
        }
        
        &.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2));
        }
      }
    }
  }
  
  .card-body {
    padding: 16px 20px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

// 图表容器
.chart-container {
  width: 100%;
  height: 180px;
  flex-shrink: 0;
}

.mini-chart {
  width: 100%;
  height: 120px;
}

// 图表卡片特殊样式
.chart-card {
  .chart-legend {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 12px;
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      
      .legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      
      .legend-name {
        color: #fff;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .legend-value {
        color: #94A3B8;
        font-weight: 600;
      }
    }
  }
  
  .trend-summary {
    display: flex;
    justify-content: space-around;
    margin-top: 12px;
    
    .summary-item {
      text-align: center;
      
      .summary-label {
        display: block;
        font-size: 11px;
        color: #94A3B8;
        margin-bottom: 4px;
      }
      
      .summary-value {
        font-size: 14px;
        font-weight: 600;
        
        &.positive {
          color: #10B981;
        }
      }
    }
  }
}

// 信息卡片
.info-card {
  .card-body {
    gap: 16px;
  }
  
  .mini-chart-section {
    .section-title {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      
      i {
        font-size: 14px;
        color: #3B82F6;
      }
      
      .quality-score {
        margin-left: auto;
        font-size: 14px;
        color: #10B981;
      }
    }
    
    .mini-chart-container {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    
    .punishment-categories {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .punishment-category {
        .category-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          
          .category-icon {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 10px;
            flex-shrink: 0;
          }
          
          .category-info {
            flex: 1;
            display: flex;
            gap: 4px;
            font-size: 11px;
            
            .category-name {
              color: #fff;
              font-weight: 600;
            }
            
            .category-count {
              color: #94A3B8;
            }
          }
          
          .category-percent {
            font-size: 11px;
            font-weight: 600;
            color: #fff;
          }
        }
        
        .category-bar {
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          
          .category-fill {
            height: 100%;
            border-radius: 2px;
            transition: width 0.3s ease;
          }
        }
      }
    }
  }
}

// 底部区域
.bottom-section {
  .activity-card {
    .activity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 12px;
      
      .activity-item {
        position: relative;
        display: flex;
        gap: 10px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 15px;
          height: 15px;
          border-top: 1px solid transparent;
          border-left: 1px solid transparent;
          border-image: linear-gradient(135deg, #3B82F6, #06B6D4) 1;
          border-radius: 8px 0 0 0;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        
        &:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(2px);
          
          &::before {
            opacity: 1;
          }
        }
        
        .activity-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
          
          &.success {
            background: rgba(16, 185, 129, 0.2);
            color: #10B981;
          }
          
          &.info {
            background: rgba(59, 130, 246, 0.2);
            color: #3B82F6;
          }
          
          &.warning {
            background: rgba(245, 158, 11, 0.2);
            color: #F59E0B;
          }
        }
        
        .activity-content {
          flex: 1;
          min-width: 0;
          
          .activity-text {
            font-size: 12px;
            color: #fff;
            margin-bottom: 3px;
            line-height: 1.3;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .activity-time {
            font-size: 10px;
            color: #94A3B8;
          }
        }
      }
    }
    
    .live-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #10B981;
      
      .live-dot {
        width: 6px;
        height: 6px;
        background: #10B981;
        border-radius: 50%;
        animation: pulse 2s infinite;
        box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
      }
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// 响应式设计
@media (max-width: 1200px) {
  .stats-dashboard {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    height: 160px;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    height: auto;
  }
}

@media (max-width: 768px) {
  .stats-dashboard {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(3, 1fr);
    gap: 16px;
    height: 200px;
  }
  
  .student-management-module {
    padding: 16px;
  }
  
  .content-grid {
    gap: 16px;
  }
}
</style> 