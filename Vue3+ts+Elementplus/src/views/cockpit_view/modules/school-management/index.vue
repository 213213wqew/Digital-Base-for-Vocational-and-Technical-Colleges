<template>
  <div class="school-management-module">
    <!-- 顶部统计面板 - 3行2列对称布局 -->
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
      <!-- 院系分布饼图 -->
      <div class="card chart-card">
        <div class="card-header">
          <h3><i class="fas fa-chart-pie"></i>院系分布</h3>
          <div class="card-meta">各院系学生分布统计</div>
        </div>
        <div class="card-body">
          <div ref="departmentPieChart" class="chart-container"></div>
          <div class="chart-legend">
            <div 
              class="legend-item" 
              v-for="(dept, index) in departmentData.slice(0, 4)" 
              :key="index"
            >
              <div class="legend-dot" :style="{ backgroundColor: dept.color }"></div>
              <span class="legend-name">{{ dept.name.replace('学院', '') }}</span>
              <span class="legend-value">{{ dept.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 院系规模对比 -->
      <div class="card chart-card">
        <div class="card-header">
          <h3><i class="fas fa-chart-bar"></i>院系规模对比</h3>
          <div class="chart-filter">
            <button 
              class="filter-btn" 
              :class="{ active: activeFilter === filter }"
              v-for="filter in scaleFilters" 
              :key="filter"
              @click="activeFilter = filter"
            >
              {{ filter }}
            </button>
          </div>
        </div>
        <div class="card-body">
          <div ref="scaleBarChart" class="chart-container"></div>
        </div>
      </div>

      <!-- 招生趋势 -->
      <div class="card chart-card">
        <div class="card-header">
          <h3><i class="fas fa-chart-line"></i>招生趋势</h3>
          <div class="total-enrollment">{{ currentYearEnrollment }}人</div>
        </div>
        <div class="card-body">
          <div ref="enrollmentChart" class="chart-container"></div>
          <div class="trend-summary">
            <div class="summary-item">
              <span class="summary-label">年均增长</span>
              <span class="summary-value positive">+8.5%</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">目标完成</span>
              <span class="summary-value positive">105%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 师资与专业 -->
      <div class="card info-card">
        <div class="card-header">
          <h3><i class="fas fa-users-cog"></i>师资与专业</h3>
          <div class="header-stats">
            <span class="stat-badge faculty">1,236人</span>
            <span class="stat-badge major">45专业</span>
          </div>
        </div>
        <div class="card-body">
          <!-- 师资力量饼图 -->
          <div class="mini-chart-section">
            <div class="section-title">
              <i class="fas fa-users"></i>
              <span>师资结构</span>
            </div>
            <div class="mini-chart-container">
              <div ref="facultyChart" class="mini-chart"></div>
              <div class="faculty-details">
                <div 
                  class="faculty-item" 
                  v-for="(item, index) in facultyData" 
                  :key="index"
                >
                  <div class="faculty-dot" :style="{ backgroundColor: item.color }"></div>
                  <span class="faculty-name">{{ item.name }}</span>
                  <span class="faculty-count">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 专业分布 -->
          <div class="mini-chart-section">
            <div class="section-title">
              <i class="fas fa-graduation-cap"></i>
              <span>专业分布</span>
            </div>
            <div class="major-categories">
              <div 
                class="major-category" 
                v-for="(category, index) in majorCategories.slice(0, 4)" 
                :key="index"
              >
                <div class="category-header">
                  <div class="category-icon" :style="{ backgroundColor: category.color }">
                    <i :class="category.icon"></i>
                  </div>
                  <div class="category-info">
                    <span class="category-name">{{ category.name }}</span>
                    <span class="category-count">{{ category.count }}个</span>
                  </div>
                  <span class="category-percent">{{ category.percent }}%</span>
                </div>
                <div class="category-bar">
                  <div 
                    class="category-fill" 
                    :style="{ 
                      width: `${category.percent}%`,
                      backgroundColor: category.color 
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 教学质量雷达图 -->
          <div class="mini-chart-section">
            <div class="section-title">
              <i class="fas fa-star"></i>
              <span>教学质量</span>
              <span class="quality-score">4.7分</span>
            </div>
            <div ref="qualityRadarChart" class="mini-chart"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部动态信息 -->
    <div class="bottom-section">
      <div class="card activity-card">
        <div class="card-header">
          <h3><i class="fas fa-bell"></i>最新动态</h3>
          <div class="live-indicator">
            <div class="live-dot"></div>
            <span>实时更新</span>
          </div>
        </div>
        <div class="card-body">
          <div class="activity-grid">
            <div 
              class="activity-item" 
              v-for="(activity, index) in recentActivities" 
              :key="index"
            >
              <div class="activity-icon" :class="activity.type">
                <i :class="activity.icon"></i>
              </div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.message }}</div>
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
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 图表实例
const departmentPieChart = ref<HTMLElement>()
const enrollmentChart = ref<HTMLElement>()
const scaleBarChart = ref<HTMLElement>()
const facultyChart = ref<HTMLElement>()
const qualityRadarChart = ref<HTMLElement>()

// 顶部统计数据 - 3行2列
const topStats = ref([
  {
    number: '8',
    label: '二级学院',
    icon: 'fas fa-university',
    iconClass: 'icon-blue',
    trend: '+1',
    trendIcon: 'fas fa-arrow-up',
    trendClass: 'trend-up'
  },
  {
    number: '45',
    label: '专业设置',
    icon: 'fas fa-graduation-cap',
    iconClass: 'icon-cyan',
    trend: '+3',
    trendIcon: 'fas fa-arrow-up',
    trendClass: 'trend-up'
  },
  {
    number: '1,236',
    label: '教职工',
    icon: 'fas fa-chalkboard-teacher',
    iconClass: 'icon-teal',
    trend: '+28',
    trendIcon: 'fas fa-arrow-up',
    trendClass: 'trend-up'
  },
  {
    number: '15,680',
    label: '在校生',
    icon: 'fas fa-user-graduate',
    iconClass: 'icon-indigo',
    trend: '+320',
    trendIcon: 'fas fa-arrow-up',
    trendClass: 'trend-up'
  },
  {
    number: '125',
    label: '实训基地',
    icon: 'fas fa-industry',
    iconClass: 'icon-slate',
    trend: '+5',
    trendIcon: 'fas fa-arrow-up',
    trendClass: 'trend-up'
  },
  {
    number: '96.8%',
    label: '就业率',
    icon: 'fas fa-briefcase',
    iconClass: 'icon-emerald',
    trend: '+2.3%',
    trendIcon: 'fas fa-arrow-up',
    trendClass: 'trend-up'
  }
])

// 院系数据
const departmentData = [
  { name: '智能制造学院', value: 2150, color: '#3B82F6' },
  { name: '信息技术学院', value: 2350, color: '#06B6D4' },
  { name: '经济管理学院', value: 1950, color: '#8B5CF6' },
  { name: '建筑工程学院', value: 1650, color: '#10B981' },
  { name: '现代服务学院', value: 1850, color: '#F59E0B' },
  { name: '艺术设计学院', value: 1250, color: '#EF4444' },
  { name: '健康护理学院', value: 950, color: '#84CC16' },
  { name: '继续教育学院', value: 2525, color: '#6366F1' }
]

// 招生数据
const enrollmentData = {
  years: ['2019', '2020', '2021', '2022', '2023', '2024'],
  data: [3200, 3400, 3100, 3600, 3800, 4200]
}

const currentYearEnrollment = ref('4,200')

// 筛选器
const scaleFilters = ref(['学生数', '教师数', '专业数'])
const activeFilter = ref('学生数')

// 专业分类
const majorCategories = ref([
  { name: '装备制造', count: 12, percent: 26.7, color: '#3B82F6', icon: 'fas fa-cogs' },
  { name: '电子信息', count: 8, percent: 17.8, color: '#06B6D4', icon: 'fas fa-microchip' },
  { name: '财经商贸', count: 6, percent: 13.3, color: '#8B5CF6', icon: 'fas fa-chart-line' },
  { name: '土木建筑', count: 5, percent: 11.1, color: '#10B981', icon: 'fas fa-building' },
  { name: '旅游服务', count: 4, percent: 8.9, color: '#F59E0B', icon: 'fas fa-plane' },
  { name: '文化艺术', count: 4, percent: 8.9, color: '#EF4444', icon: 'fas fa-palette' },
  { name: '医药卫生', count: 3, percent: 6.7, color: '#84CC16', icon: 'fas fa-stethoscope' },
  { name: '其他类别', count: 3, percent: 6.7, color: '#6366F1', icon: 'fas fa-ellipsis-h' }
])

// 师资数据
const facultyData = ref([
  { name: '教授', value: 125, color: '#3B82F6' },
  { name: '副教授', value: 235, color: '#06B6D4' },
  { name: '讲师', value: 456, color: '#8B5CF6' },
  { name: '助教', value: 420, color: '#10B981' }
])

// 最新动态
const recentActivities = ref([
  {
    message: '智能制造学院新增工业机器人专业',
    time: '2小时前',
    type: 'success',
    icon: 'fas fa-plus-circle'
  },
  {
    message: '信息技术学院与华为签署校企合作协议',
    time: '4小时前',
    type: 'info',
    icon: 'fas fa-handshake'
  },
  {
    message: '经济管理学院举办就业招聘会',
    time: '6小时前',
    type: 'warning',
    icon: 'fas fa-briefcase'
  },
  {
    message: '艺术设计学院学生作品获国家级奖项',
    time: '8小时前',
    type: 'success',
    icon: 'fas fa-trophy'
  },
  {
    message: '健康护理学院开展实习基地建设',
    time: '1天前',
    type: 'info',
    icon: 'fas fa-hospital'
  }
])

// 初始化院系分布饼图
const initDepartmentPieChart = () => {
  if (!departmentPieChart.value) return
  
  const chart = echarts.init(departmentPieChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#4fd6ff',
      textStyle: { color: '#ffffff' }
    },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '50%'],
      data: departmentData,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#0a0e27',
        borderWidth: 2
      },
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化招生趋势图
const initEnrollmentChart = () => {
  if (!enrollmentChart.value) return
  
  const chart = echarts.init(enrollmentChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#4fd6ff',
      textStyle: { color: '#ffffff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: enrollmentData.years,
      axisLine: { lineStyle: { color: '#4fd6ff' } },
      axisLabel: { color: '#8fc5ff' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4fd6ff' } },
      axisLabel: { color: '#8fc5ff' },
      splitLine: { lineStyle: { color: 'rgba(79, 214, 255, 0.2)' } }
    },
    series: [{
      data: enrollmentData.data,
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#4fd6ff',
        width: 3
      },
      itemStyle: {
        color: '#4fd6ff',
        borderColor: '#ffffff',
        borderWidth: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(79, 214, 255, 0.3)' },
            { offset: 1, color: 'rgba(79, 214, 255, 0.1)' }
          ]
        }
      }
    }]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化院系规模对比图
const initScaleBarChart = () => {
  if (!scaleBarChart.value) return
  
  const chart = echarts.init(scaleBarChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#4fd6ff',
      textStyle: { color: '#ffffff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: departmentData.map(item => item.name.replace('学院', '')),
      axisLine: { lineStyle: { color: '#4fd6ff' } },
      axisLabel: { 
        color: '#8fc5ff',
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4fd6ff' } },
      axisLabel: { color: '#8fc5ff' },
      splitLine: { lineStyle: { color: 'rgba(79, 214, 255, 0.2)' } }
    },
    series: [{
      data: departmentData.map(item => ({
        value: item.value,
        itemStyle: { color: item.color }
      })),
      type: 'bar',
      barWidth: '60%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0]
      }
    }]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化师资力量图
const initFacultyChart = () => {
  if (!facultyChart.value) return
  
  const chart = echarts.init(facultyChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#4fd6ff',
      textStyle: { color: '#ffffff' }
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      data: facultyData.value,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#0a0e27',
        borderWidth: 2
      },
      label: {
        show: false
      },
      labelLine: {
        show: false
      }
    }]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 初始化教学质量雷达图
const initQualityRadarChart = () => {
  if (!qualityRadarChart.value) return
  
  const chart = echarts.init(qualityRadarChart.value)
  
  const option = {
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#4fd6ff',
      textStyle: { color: '#ffffff' }
    },
    radar: {
      radius: '65%',
      indicator: [
        { name: '理论', max: 100 },
        { name: '实践', max: 100 },
        { name: '设施', max: 100 },
        { name: '师资', max: 100 },
        { name: '评价', max: 100 },
        { name: '就业', max: 100 }
      ],
      axisName: {
        color: '#8fc5ff',
        fontSize: 11
      },
      axisLine: {
        lineStyle: { color: 'rgba(79, 214, 255, 0.3)' }
      },
      splitLine: {
        lineStyle: { color: 'rgba(79, 214, 255, 0.2)' }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(79, 214, 255, 0.05)', 'transparent']
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [92, 88, 85, 94, 90, 87],
        name: '教学质量',
        itemStyle: { color: '#4fd6ff' },
        areaStyle: {
          color: 'rgba(79, 214, 255, 0.3)'
        },
        lineStyle: {
          color: '#4fd6ff',
          width: 2
        }
      }]
    }]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

onMounted(() => {
  nextTick(() => {
    initDepartmentPieChart()
    initEnrollmentChart()
    initScaleBarChart()
    initFacultyChart()
    initQualityRadarChart()
  })
})
</script>

<style scoped lang="scss">
.school-management-module {
  padding: 24px;
  background: 
    radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.06) 0%, transparent 40%),
    radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.06) 0%, transparent 40%),
    linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%);
  color: #fff;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 15% 85%, rgba(59, 130, 246, 0.04) 0%, transparent 35%),
      radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.04) 0%, transparent 35%),
      radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.02) 0%, transparent 40%);
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
}

// 顶部统计面板 - 3行2列对称布局
.stats-dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
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
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    
    // 四角装饰
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
      border-color: rgba(59, 130, 246, 0.2);
      
      &::before {
        border-image: linear-gradient(135deg, #3B82F6, #06B6D4, #8B5CF6) 1;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
      }
      
      &::after {
        border-image: linear-gradient(135deg, #8B5CF6, #10B981, #F59E0B) 1;
        box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
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
      
      &.icon-blue { 
        background: linear-gradient(135deg, #3B82F6, #1D4ED8);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }
      &.icon-cyan { 
        background: linear-gradient(135deg, #06B6D4, #0891B2);
        box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }
      &.icon-teal { 
        background: linear-gradient(135deg, #14B8A6, #0D9488);
        box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }
      &.icon-indigo { 
        background: linear-gradient(135deg, #6366F1, #4F46E5);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }
      &.icon-slate { 
        background: linear-gradient(135deg, #64748B, #475569);
        box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }
      &.icon-emerald { 
        background: linear-gradient(135deg, #10B981, #059669);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }
    }
    
    .stat-content {
      flex: 1;
      min-width: 0;
      
      .stat-number {
        font-size: 22px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 2px;
        line-height: 1;
      }
      
      .stat-label {
        font-size: 13px;
        color: #8b9dc3;
        margin-bottom: 6px;
      }
      
      .stat-trend {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
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
  box-shadow: 
    0 6px 24px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  // 四角装饰线条
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
    box-shadow: 
      0 12px 40px rgba(59, 130, 246, 0.2),
      0 0 40px rgba(59, 130, 246, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: rgba(59, 130, 246, 0.15);
    
    &::before {
      opacity: 1;
      border-image: linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #8B5CF6 100%) 1;
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
      width: 40px;
      height: 40px;
    }
    
    &::after {
      opacity: 1;
      border-image: linear-gradient(135deg, #8B5CF6 0%, #10B981 50%, #F59E0B 100%) 1;
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
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
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
    
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
        
        &.faculty {
          background: rgba(59, 130, 246, 0.2);
          color: #3B82F6;
        }
        
        &.major {
          background: rgba(139, 92, 246, 0.2);
          color: #8B5CF6;
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
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
          transform: translateY(-1px);
          
          &::before {
            opacity: 1;
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
          }
        }
        
        &.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2));
          border-color: rgba(59, 130, 246, 0.5);
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
    
    .faculty-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      flex: 1;
      
      .faculty-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        
        .faculty-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .faculty-name {
          color: #fff;
          flex: 1;
        }
        
        .faculty-count {
          color: #94A3B8;
          font-weight: 600;
        }
      }
    }
    
    .major-categories {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .major-category {
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
            border-color: rgba(59, 130, 246, 0.15);
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
            transform: translateX(2px);
            
            &::before {
              opacity: 1;
              box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
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
  
  .school-management-module {
    padding: 16px;
  }
  
  .content-grid {
    gap: 16px;
  }
}
</style> 