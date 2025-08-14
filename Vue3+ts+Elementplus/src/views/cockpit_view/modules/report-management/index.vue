<template>
  <div class="report-management-module">
    <!-- 上报管理模块标题 -->
    <!-- <div class="module-header">
      <h2><span class="icon">📊</span>上报管理</h2>
      <p class="module-desc">数据上报率、统计分析、质量监控、合规管理</p>
    </div> -->

    <!-- 上报管理内容区域 -->
    <div class="module-content">
      <!-- 上报概况统计 -->
      <div class="report-overview-section">
        <div class="section-header">
          <h3><span class="icon">📈</span>上报概况</h3>
          <div class="update-time">更新时间：{{ updateTime }}</div>
        </div>
        <div class="overview-grid">
          <div class="overview-card" v-for="(item, index) in reportOverview" :key="index">
            <div class="card-icon">{{ item.icon }}</div>
            <div class="card-content">
              <div class="card-value">{{ item.value }}</div>
              <div class="card-label">{{ item.label }}</div>
              <div class="card-change" :class="item.changeType">
                {{ item.change }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 上报率统计 -->
      <div class="report-rate-section">
        <div class="section-header">
          <h3><span class="icon">📊</span>上报率统计</h3>
          <div class="rate-controls">
            <button 
              v-for="period in ['本月', '本季度', '本年']" 
              :key="period"
              class="period-btn"
              :class="{ active: selectedPeriod === period }"
              @click="selectedPeriod = period"
            >
              {{ period }}
            </button>
          </div>
        </div>
        <div class="rate-grid">
          <div class="rate-card" v-for="(rate, index) in reportRates" :key="index">
            <div class="rate-header">
              <div class="rate-title">{{ rate.title }}</div>
              <div class="rate-percentage" :class="getRateClass(rate.percentage)">
                {{ rate.percentage }}%
              </div>
            </div>
            <div class="rate-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${rate.percentage}%` }" :class="getRateClass(rate.percentage)"></div>
              </div>
            </div>
            <div class="rate-stats">
              <div class="stat-item">
                <span class="stat-label">应报：</span>
                <span class="stat-value">{{ rate.required }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">已报：</span>
                <span class="stat-value">{{ rate.submitted }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">逾期：</span>
                <span class="stat-value">{{ rate.overdue }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 上报类型分析 -->
      <div class="report-type-section">
        <div class="section-header">
          <h3><span class="icon">📋</span>上报类型分析</h3>
        </div>
        <div class="type-grid">
          <div class="type-card" v-for="(type, index) in reportTypes" :key="index">
            <div class="type-header">
              <div class="type-icon" :style="{ backgroundColor: type.color }">{{ type.icon }}</div>
              <div class="type-info">
                <div class="type-name">{{ type.name }}</div>
                <div class="type-count">{{ type.count }}张表</div>
              </div>
            </div>
            <div class="type-stats">
              <div class="type-stat">
                <div class="stat-label">完成率</div>
                <div class="stat-value">{{ type.completionRate }}%</div>
              </div>
              <div class="type-stat">
                <div class="stat-label">及时率</div>
                <div class="stat-value">{{ type.timelyRate }}%</div>
              </div>
              <div class="type-stat">
                <div class="stat-label">质量分</div>
                <div class="stat-value">{{ type.qualityScore }}</div>
              </div>
            </div>
            <div class="type-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${type.completionRate}%`, backgroundColor: type.color }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 质量监控 -->
      <div class="quality-monitor-section">
        <div class="section-header">
          <h3><span class="icon">🔍</span>质量监控</h3>
        </div>
        <div class="quality-grid">
          <div class="quality-card" v-for="(quality, index) in qualityMonitor" :key="index">
            <div class="quality-header">
              <div class="quality-title">{{ quality.title }}</div>
              <div class="quality-score" :class="getQualityClass(quality.score)">
                {{ quality.score }}
              </div>
            </div>
            <div class="quality-indicators">
              <div class="indicator-item" v-for="(indicator, idx) in quality.indicators" :key="idx">
                <div class="indicator-name">{{ indicator.name }}</div>
                <div class="indicator-value" :class="getIndicatorClass(indicator.value)">
                  {{ indicator.value }}%
                </div>
              </div>
            </div>
            <div class="quality-trend">
              <div class="trend-label">趋势</div>
              <div class="trend-value" :class="quality.trendType">
                {{ quality.trend }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 合规管理 -->
      <div class="compliance-section">
        <div class="section-header">
          <h3><span class="icon">⚖️</span>合规管理</h3>
        </div>
        <div class="compliance-grid">
          <div class="compliance-card">
            <div class="compliance-header">
              <h4>合规检查</h4>
            </div>
            <div class="compliance-content">
              <div class="compliance-item" v-for="(item, index) in complianceChecks" :key="index">
                <div class="compliance-icon" :class="item.status">{{ item.icon }}</div>
                <div class="compliance-info">
                  <div class="compliance-title">{{ item.title }}</div>
                  <div class="compliance-detail">{{ item.detail }}</div>
                </div>
                <div class="compliance-status" :class="item.status">{{ item.statusText }}</div>
              </div>
            </div>
          </div>
          <div class="compliance-card">
            <div class="compliance-header">
              <h4>预警提醒</h4>
            </div>
            <div class="compliance-content">
              <div class="compliance-item" v-for="(warning, index) in warningAlerts" :key="index">
                <div class="compliance-icon warning">{{ warning.icon }}</div>
                <div class="compliance-info">
                  <div class="compliance-title">{{ warning.title }}</div>
                  <div class="compliance-detail">{{ warning.detail }}</div>
                </div>
                <div class="compliance-time">{{ warning.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// 更新时间
const updateTime = ref('')
const selectedPeriod = ref('本月')

// 上报概况统计
const reportOverview = reactive([
  {
    icon: '📊',
    value: '98张',
    label: '表格总数',
    change: '+2',
    changeType: 'increase'
  },
  {
    icon: '✅',
    value: '92%',
    label: '总体上报率',
    change: '+3%',
    changeType: 'increase'
  },
  {
    icon: '🕐',
    value: '89%',
    label: '及时上报率',
    change: '+5%',
    changeType: 'increase'
  },
  {
    icon: '🎯',
    value: '95%',
    label: '数据质量分',
    change: '+2%',
    changeType: 'increase'
  },
  {
    icon: '⚠️',
    value: '8张',
    label: '逾期表格',
    change: '-3',
    changeType: 'decrease'
  },
  {
    icon: '🔄',
    value: '5张',
    label: '待审核',
    change: '-2',
    changeType: 'decrease'
  }
])

// 上报率统计
const reportRates = reactive([
  {
    title: '年报数据',
    percentage: 95,
    required: 10,
    submitted: 10,
    overdue: 0
  },
  {
    title: '月报数据',
    percentage: 92,
    required: 40,
    submitted: 37,
    overdue: 3
  },
  {
    title: '周报数据',
    percentage: 88,
    required: 30,
    submitted: 26,
    overdue: 4
  },
  {
    title: '日报数据',
    percentage: 94,
    required: 18,
    submitted: 17,
    overdue: 1
  }
])

// 上报类型分析
const reportTypes = reactive([
  {
    name: '学生数据',
    count: 25,
    completionRate: 96,
    timelyRate: 92,
    qualityScore: 98,
    color: '#4fd6ff',
    icon: '👨‍🎓'
  },
  {
    name: '教师数据',
    count: 20,
    completionRate: 94,
    timelyRate: 90,
    qualityScore: 95,
    color: '#36ce9e',
    icon: '👨‍🏫'
  },
  {
    name: '教学数据',
    count: 18,
    completionRate: 88,
    timelyRate: 85,
    qualityScore: 92,
    color: '#f39c12',
    icon: '📚'
  },
  {
    name: '财务数据',
    count: 15,
    completionRate: 92,
    timelyRate: 88,
    qualityScore: 94,
    color: '#9b59b6',
    icon: '💰'
  },
  {
    name: '设备数据',
    count: 12,
    completionRate: 90,
    timelyRate: 86,
    qualityScore: 90,
    color: '#e74c3c',
    icon: '🏢'
  },
  {
    name: '其他数据',
    count: 8,
    completionRate: 85,
    timelyRate: 82,
    qualityScore: 88,
    color: '#95a5a6',
    icon: '📋'
  }
])

// 质量监控
const qualityMonitor = reactive([
  {
    title: '数据完整性',
    score: 96,
    indicators: [
      { name: '必填项完整', value: 98 },
      { name: '数据格式正确', value: 95 },
      { name: '逻辑关系正确', value: 94 }
    ],
    trend: '+2%',
    trendType: 'increase'
  },
  {
    title: '数据准确性',
    score: 94,
    indicators: [
      { name: '数据校验通过', value: 96 },
      { name: '历史数据对比', value: 92 },
      { name: '异常数据检测', value: 94 }
    ],
    trend: '+1%',
    trendType: 'increase'
  },
  {
    title: '数据时效性',
    score: 89,
    indicators: [
      { name: '按时提交', value: 92 },
      { name: '数据更新及时', value: 88 },
      { name: '响应速度', value: 87 }
    ],
    trend: '+3%',
    trendType: 'increase'
  },
  {
    title: '数据一致性',
    score: 92,
    indicators: [
      { name: '跨系统一致', value: 94 },
      { name: '部门间一致', value: 90 },
      { name: '时间序列一致', value: 92 }
    ],
    trend: '+1%',
    trendType: 'increase'
  }
])

// 合规检查
const complianceChecks = reactive([
  {
    title: '数据保密性检查',
    detail: '敏感数据加密处理',
    status: 'pass',
    statusText: '通过',
    icon: '🔒'
  },
  {
    title: '权限管理检查',
    detail: '访问权限分级管理',
    status: 'pass',
    statusText: '通过',
    icon: '🔑'
  },
  {
    title: '数据备份检查',
    detail: '定期数据备份机制',
    status: 'warning',
    statusText: '待改进',
    icon: '💾'
  },
  {
    title: '审计日志检查',
    detail: '操作日志完整记录',
    status: 'pass',
    statusText: '通过',
    icon: '📝'
  }
])

// 预警提醒
const warningAlerts = reactive([
  {
    title: '学生数据逾期',
    detail: '有3张学生信息表未按时提交',
    time: '2小时前',
    icon: '⚠️'
  },
  {
    title: '数据质量异常',
    detail: '教师信息表存在数据不一致',
    time: '4小时前',
    icon: '🔍'
  },
  {
    title: '系统维护通知',
    detail: '明日2:00-4:00系统维护',
    time: '6小时前',
    icon: '🔧'
  },
  {
    title: '权限即将过期',
    detail: '部分用户权限将在3天后过期',
    time: '1天前',
    icon: '🔐'
  }
])

// 获取上报率等级样式
const getRateClass = (percentage: number) => {
  if (percentage >= 95) return 'excellent'
  if (percentage >= 90) return 'good'
  if (percentage >= 80) return 'average'
  return 'poor'
}

// 获取质量分等级样式
const getQualityClass = (score: number) => {
  if (score >= 95) return 'excellent'
  if (score >= 90) return 'good'
  if (score >= 80) return 'average'
  return 'poor'
}

// 获取指标等级样式
const getIndicatorClass = (value: number) => {
  if (value >= 95) return 'excellent'
  if (value >= 90) return 'good'
  if (value >= 80) return 'average'
  return 'poor'
}

// 更新时间
const updateCurrentTime = () => {
  const now = new Date()
  updateTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  updateCurrentTime()
  // 每分钟更新一次时间
  setInterval(updateCurrentTime, 60000)
})
</script>

<style scoped lang="scss">
.report-management-module {
  height: 100%;
  padding: 20px;
  color: #ffffff;
  font-family: 'Microsoft YaHei', sans-serif;
}

.module-header {
  margin-bottom: 30px;
  text-align: center;
  
  h2 {
    font-size: 24px;
    margin: 0 0 8px 0;
    color: #4fd6ff;
    text-shadow: 0 0 10px rgba(79, 214, 255, 0.5);
    
    .icon {
      margin-right: 10px;
      font-size: 28px;
    }
  }
  
  .module-desc {
    font-size: 14px;
    color: #8fc5ff;
    margin: 0;
    opacity: 0.9;
  }
}

.module-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: calc(100% - 100px);
  overflow-y: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    font-size: 18px;
    color: #4fd6ff;
    margin: 0;
    display: flex;
    align-items: center;
    
    .icon {
      margin-right: 8px;
      font-size: 20px;
    }
  }
  
  .update-time {
    font-size: 12px;
    color: #8fc5ff;
    opacity: 0.8;
  }
  
  .rate-controls {
    display: flex;
    gap: 8px;
    
    .period-btn {
      background: rgba(79, 214, 255, 0.1);
      border: 1px solid rgba(79, 214, 255, 0.3);
      color: #8fc5ff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover,
      &.active {
        background: rgba(79, 214, 255, 0.2);
        color: #4fd6ff;
        border-color: rgba(79, 214, 255, 0.5);
      }
    }
  }
}

// 上报概况统计样式
.report-overview-section {
  .overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .overview-card {
    background: rgba(79, 214, 255, 0.1);
    border: 1px solid rgba(79, 214, 255, 0.3);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(79, 214, 255, 0.3);
      border-color: rgba(79, 214, 255, 0.5);
    }
    
    .card-icon {
      font-size: 32px;
      filter: drop-shadow(0 0 8px #4fd6ff);
    }
    
    .card-content {
      flex: 1;
      
      .card-value {
        font-size: 24px;
        font-weight: bold;
        color: #4fd6ff;
        margin-bottom: 4px;
      }
      
      .card-label {
        font-size: 14px;
        color: #8fc5ff;
        margin-bottom: 6px;
      }
      
      .card-change {
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 10px;
        
        &.increase {
          color: #36ce9e;
          background: rgba(54, 206, 158, 0.2);
        }
        
        &.decrease {
          color: #36ce9e;
          background: rgba(54, 206, 158, 0.2);
        }
      }
    }
  }
}

// 上报率统计样式
.report-rate-section {
  .rate-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .rate-card {
    background: rgba(26, 35, 50, 0.8);
    border: 1px solid rgba(79, 214, 255, 0.3);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(79, 214, 255, 0.3);
    }
    
    .rate-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      .rate-title {
        font-size: 16px;
        color: #4fd6ff;
      }
      
      .rate-percentage {
        font-size: 20px;
        font-weight: bold;
        
        &.excellent { color: #36ce9e; }
        &.good { color: #4fd6ff; }
        &.average { color: #f39c12; }
        &.poor { color: #e74c3c; }
      }
    }
    
    .rate-progress {
      margin-bottom: 15px;
      
      .progress-bar {
        height: 8px;
        background: rgba(79, 214, 255, 0.2);
        border-radius: 4px;
        overflow: hidden;
        
        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
          
          &.excellent { background: #36ce9e; }
          &.good { background: #4fd6ff; }
          &.average { background: #f39c12; }
          &.poor { background: #e74c3c; }
        }
      }
    }
    
    .rate-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      
      .stat-item {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        
        .stat-label {
          color: #8fc5ff;
        }
        
        .stat-value {
          color: #ffffff;
          font-weight: bold;
        }
      }
    }
  }
}

// 上报类型分析样式
.report-type-section {
  .type-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .type-card {
    background: rgba(26, 35, 50, 0.8);
    border: 1px solid rgba(79, 214, 255, 0.3);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(79, 214, 255, 0.3);
    }
    
    .type-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;
      
      .type-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #ffffff;
      }
      
      .type-info {
        flex: 1;
        
        .type-name {
          font-size: 16px;
          color: #4fd6ff;
          margin-bottom: 4px;
        }
        
        .type-count {
          font-size: 12px;
          color: #8fc5ff;
        }
      }
    }
    
    .type-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 15px;
      
      .type-stat {
        text-align: center;
        
        .stat-label {
          font-size: 12px;
          color: #8fc5ff;
          margin-bottom: 4px;
        }
        
        .stat-value {
          font-size: 14px;
          font-weight: bold;
          color: #ffffff;
        }
      }
    }
    
    .type-progress {
      .progress-bar {
        height: 8px;
        background: rgba(79, 214, 255, 0.2);
        border-radius: 4px;
        overflow: hidden;
        
        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
      }
    }
  }
}

// 质量监控样式
.quality-monitor-section {
  .quality-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .quality-card {
    background: rgba(26, 35, 50, 0.8);
    border: 1px solid rgba(79, 214, 255, 0.3);
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(79, 214, 255, 0.3);
    }
    
    .quality-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      .quality-title {
        font-size: 16px;
        color: #4fd6ff;
      }
      
      .quality-score {
        font-size: 20px;
        font-weight: bold;
        
        &.excellent { color: #36ce9e; }
        &.good { color: #4fd6ff; }
        &.average { color: #f39c12; }
        &.poor { color: #e74c3c; }
      }
    }
    
    .quality-indicators {
      margin-bottom: 15px;
      
      .indicator-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .indicator-name {
          font-size: 14px;
          color: #8fc5ff;
        }
        
        .indicator-value {
          font-size: 14px;
          font-weight: bold;
          
          &.excellent { color: #36ce9e; }
          &.good { color: #4fd6ff; }
          &.average { color: #f39c12; }
          &.poor { color: #e74c3c; }
        }
      }
    }
    
    .quality-trend {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .trend-label {
        font-size: 12px;
        color: #8fc5ff;
      }
      
      .trend-value {
        font-size: 12px;
        font-weight: bold;
        
        &.increase {
          color: #36ce9e;
        }
        
        &.decrease {
          color: #e74c3c;
        }
      }
    }
  }
}

// 合规管理样式
.compliance-section {
  .compliance-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  
  .compliance-card {
    background: rgba(26, 35, 50, 0.8);
    border: 1px solid rgba(79, 214, 255, 0.3);
    border-radius: 12px;
    padding: 20px;
    
    .compliance-header {
      margin-bottom: 20px;
      
      h4 {
        font-size: 16px;
        color: #4fd6ff;
        margin: 0;
      }
    }
    
    .compliance-content {
      display: flex;
      flex-direction: column;
      gap: 15px;
      
      .compliance-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: rgba(79, 214, 255, 0.1);
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(79, 214, 255, 0.2);
        }
        
        .compliance-icon {
          font-size: 20px;
          width: 24px;
          text-align: center;
          
          &.pass { color: #36ce9e; }
          &.warning { color: #f39c12; }
          &.error { color: #e74c3c; }
        }
        
        .compliance-info {
          flex: 1;
          
          .compliance-title {
            font-size: 14px;
            color: #ffffff;
            margin-bottom: 4px;
          }
          
          .compliance-detail {
            font-size: 12px;
            color: #8fc5ff;
          }
        }
        
        .compliance-status {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 12px;
          
          &.pass {
            color: #36ce9e;
            background: rgba(54, 206, 158, 0.2);
          }
          
          &.warning {
            color: #f39c12;
            background: rgba(243, 156, 18, 0.2);
          }
          
          &.error {
            color: #e74c3c;
            background: rgba(231, 76, 60, 0.2);
          }
        }
        
        .compliance-time {
          font-size: 12px;
          color: #8fc5ff;
        }
      }
    }
  }
}

// 滚动条样式
.module-content::-webkit-scrollbar {
  width: 6px;
}

.module-content::-webkit-scrollbar-track {
  background: rgba(79, 214, 255, 0.1);
  border-radius: 3px;
}

.module-content::-webkit-scrollbar-thumb {
  background: rgba(79, 214, 255, 0.5);
  border-radius: 3px;
  
  &:hover {
    background: rgba(79, 214, 255, 0.7);
  }
}
</style> 