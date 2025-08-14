<template>
  <div class="quality-monitoring-module">
    <!-- 数据质量概览 -->
    <div class="quality-overview">
      <div class="overview-header">
        <h3><span class="icon">🔍</span>数据质量监控概览</h3>
        <div class="last-updated">最后更新: {{ lastUpdated }}</div>
      </div>
      <div class="overview-stats">
        <div class="stat-card" v-for="stat in qualityOverview" :key="stat.key">
          <div class="stat-icon" :class="stat.status">{{ stat.icon }}</div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}%</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-trend" :class="stat.trend">
              <span class="trend-arrow">{{ stat.trendIcon }}</span>
              <span>{{ stat.change }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 质量监控详情 -->
    <div class="quality-details">
      <!-- 数据完整性检查 -->
      <div class="detail-section">
        <div class="section-header">
          <h4><span class="icon">📊</span>数据完整性检查</h4>
          <div class="health-indicator">
            <span class="indicator-dot" :class="integrityStatus"></span>
            <span class="indicator-text">{{ integrityStatusText }}</span>
          </div>
        </div>
        <div class="integrity-grid">
          <div class="integrity-item" v-for="item in integrityChecks" :key="item.table">
            <div class="item-header">
              <span class="table-name">{{ item.table }}</span>
              <span class="completion-rate" :class="getCompletionClass(item.completeness)">
                {{ item.completeness }}%
              </span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :class="getCompletionClass(item.completeness)"
                :style="{ width: `${item.completeness}%` }"
              ></div>
            </div>
            <div class="item-details">
              <span class="records-count">{{ item.totalRecords.toLocaleString() }} 条记录</span>
              <span class="missing-count">缺失: {{ item.missingRecords }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据准确性监控 -->
      <div class="detail-section">
        <div class="section-header">
          <h4><span class="icon">🎯</span>数据准确性监控</h4>
          <div class="health-indicator">
            <span class="indicator-dot" :class="accuracyStatus"></span>
            <span class="indicator-text">{{ accuracyStatusText }}</span>
          </div>
        </div>
        <div class="accuracy-grid">
          <div class="accuracy-item" v-for="item in accuracyChecks" :key="item.category">
            <div class="item-icon">{{ item.icon }}</div>
            <div class="item-content">
              <div class="item-name">{{ item.category }}</div>
              <div class="accuracy-score" :class="getAccuracyClass(item.accuracy)">
                {{ item.accuracy }}%
              </div>
              <div class="error-count">错误: {{ item.errors }} 条</div>
            </div>
            <div class="item-actions">
              <button class="action-btn" @click="viewDetails(item)">查看详情</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据一致性验证 -->
      <div class="detail-section">
        <div class="section-header">
          <h4><span class="icon">🔄</span>数据一致性验证</h4>
          <div class="health-indicator">
            <span class="indicator-dot" :class="consistencyStatus"></span>
            <span class="indicator-text">{{ consistencyStatusText }}</span>
          </div>
        </div>
        <div class="consistency-checks">
          <div class="check-item" v-for="check in consistencyChecks" :key="check.id">
            <div class="check-header">
              <span class="check-name">{{ check.name }}</span>
              <span class="check-status" :class="check.status">{{ check.statusText }}</span>
            </div>
            <div class="check-description">{{ check.description }}</div>
            <div class="check-result">
              <span class="result-text">{{ check.result }}</span>
              <span class="check-time">{{ check.lastCheck }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时质量监控 -->
    <div class="realtime-monitoring">
      <div class="monitoring-header">
        <h4><span class="icon">📡</span>实时质量监控</h4>
        <div class="monitoring-controls">
          <button class="control-btn" :class="{ active: isMonitoring }" @click="toggleMonitoring">
            {{ isMonitoring ? '停止监控' : '开始监控' }}
          </button>
        </div>
      </div>
      <div class="monitoring-content">
        <div class="alert-panel">
          <div class="alert-header">
            <span class="alert-title">质量警报</span>
            <span class="alert-count">{{ qualityAlerts.length }}</span>
          </div>
          <div class="alert-list">
            <div class="alert-item" v-for="alert in qualityAlerts" :key="alert.id" :class="alert.level">
              <div class="alert-icon">{{ alert.icon }}</div>
              <div class="alert-content">
                <div class="alert-message">{{ alert.message }}</div>
                <div class="alert-time">{{ alert.time }}</div>
              </div>
              <div class="alert-actions">
                <button class="alert-action" @click="handleAlert(alert)">处理</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 质量趋势分析 -->
    <div class="quality-trends">
      <div class="trends-header">
        <h4><span class="icon">📈</span>质量趋势分析</h4>
        <div class="trend-controls">
          <button 
            v-for="period in ['7天', '30天', '90天']" 
            :key="period"
            class="period-btn"
            :class="{ active: selectedTrendPeriod === period }"
            @click="selectedTrendPeriod = period"
          >
            {{ period }}
          </button>
        </div>
      </div>
      <div class="trends-content">
        <div class="trend-chart-container">
          <canvas ref="trendChart" class="trend-chart"></canvas>
        </div>
        <div class="trend-summary">
          <div class="summary-item" v-for="summary in trendSummary" :key="summary.metric">
            <div class="summary-label">{{ summary.metric }}</div>
            <div class="summary-value" :class="summary.trend">{{ summary.value }}</div>
            <div class="summary-change">{{ summary.change }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 响应式数据
const lastUpdated = ref('')
const selectedTrendPeriod = ref('7天')
const isMonitoring = ref(true)

// 质量概览数据
const qualityOverview = ref([
  {
    key: 'overall',
    label: '总体质量',
    value: 96.2,
    icon: '📊',
    status: 'excellent',
    trend: 'up',
    trendIcon: '↗',
    change: '+2.3'
  },
  {
    key: 'completeness',
    label: '完整性',
    value: 98.5,
    icon: '✅',
    status: 'excellent',
    trend: 'up',
    trendIcon: '↗',
    change: '+1.2'
  },
  {
    key: 'accuracy',
    label: '准确性',
    value: 94.8,
    icon: '🎯',
    status: 'good',
    trend: 'up',
    trendIcon: '↗',
    change: '+0.5'
  },
  {
    key: 'consistency',
    label: '一致性',
    value: 95.3,
    icon: '🔄',
    status: 'good',
    trend: 'down',
    trendIcon: '↘',
    change: '-0.8'
  }
])

// 数据完整性检查
const integrityChecks = ref([
  { table: '学生基本信息', completeness: 98.5, totalRecords: 15680, missingRecords: 235 },
  { table: '教师信息', completeness: 99.2, totalRecords: 1236, missingRecords: 10 },
  { table: '课程信息', completeness: 96.8, totalRecords: 2580, missingRecords: 83 },
  { table: '成绩记录', completeness: 97.3, totalRecords: 125600, missingRecords: 3390 },
  { table: '考勤记录', completeness: 95.1, totalRecords: 892000, missingRecords: 43708 },
  { table: '设备信息', completeness: 100.0, totalRecords: 8520, missingRecords: 0 }
])

// 数据准确性监控
const accuracyChecks = ref([
  { category: '学生信息', accuracy: 96.8, errors: 502, icon: '👥' },
  { category: '教师信息', accuracy: 98.2, errors: 22, icon: '👨‍🏫' },
  { category: '课程信息', accuracy: 94.5, errors: 142, icon: '📚' },
  { category: '成绩数据', accuracy: 92.1, errors: 9923, icon: '📊' },
  { category: '财务数据', accuracy: 99.8, errors: 5, icon: '💰' },
  { category: '设备数据', accuracy: 97.6, errors: 204, icon: '🔧' }
])

// 数据一致性验证
const consistencyChecks = ref([
  {
    id: 'student-enrollment',
    name: '学生注册信息一致性',
    description: '检查学生在不同系统中的注册信息是否一致',
    status: 'passed',
    statusText: '通过',
    result: '发现 5 条不一致记录，已自动修复',
    lastCheck: '5分钟前'
  },
  {
    id: 'course-schedule',
    name: '课程安排一致性',
    description: '验证课程表与教师安排、教室分配的一致性',
    status: 'warning',
    statusText: '警告',
    result: '发现 12 条时间冲突，需要手动处理',
    lastCheck: '10分钟前'
  },
  {
    id: 'grade-record',
    name: '成绩记录一致性',
    description: '检查成绩记录与考试安排的一致性',
    status: 'passed',
    statusText: '通过',
    result: '所有成绩记录与考试安排一致',
    lastCheck: '15分钟前'
  }
])

// 质量警报
const qualityAlerts = ref([
  {
    id: 'alert-1',
    level: 'high',
    icon: '🚨',
    message: '学生考勤数据完整性低于95%',
    time: '2分钟前'
  },
  {
    id: 'alert-2',
    level: 'medium',
    icon: '⚠️',
    message: '课程安排存在时间冲突',
    time: '8分钟前'
  },
  {
    id: 'alert-3',
    level: 'low',
    icon: '💡',
    message: '建议优化成绩录入流程',
    time: '15分钟前'
  }
])

// 趋势分析摘要
const trendSummary = ref([
  { metric: '完整性趋势', value: '稳定上升', change: '+1.2% (7天)', trend: 'up' },
  { metric: '准确性趋势', value: '轻微改善', change: '+0.5% (7天)', trend: 'up' },
  { metric: '一致性趋势', value: '略有下降', change: '-0.8% (7天)', trend: 'down' },
  { metric: '处理效率', value: '显著提升', change: '+15% (7天)', trend: 'up' }
])

// 计算属性
const integrityStatus = computed(() => {
  const avgCompleteness = integrityChecks.value.reduce((sum, item) => sum + item.completeness, 0) / integrityChecks.value.length
  return avgCompleteness >= 98 ? 'excellent' : avgCompleteness >= 95 ? 'good' : 'warning'
})

const integrityStatusText = computed(() => {
  const status = integrityStatus.value
  return status === 'excellent' ? '优秀' : status === 'good' ? '良好' : '需要关注'
})

const accuracyStatus = computed(() => {
  const avgAccuracy = accuracyChecks.value.reduce((sum, item) => sum + item.accuracy, 0) / accuracyChecks.value.length
  return avgAccuracy >= 98 ? 'excellent' : avgAccuracy >= 95 ? 'good' : 'warning'
})

const accuracyStatusText = computed(() => {
  const status = accuracyStatus.value
  return status === 'excellent' ? '优秀' : status === 'good' ? '良好' : '需要关注'
})

const consistencyStatus = computed(() => {
  const passedChecks = consistencyChecks.value.filter(check => check.status === 'passed').length
  const warningChecks = consistencyChecks.value.filter(check => check.status === 'warning').length
  
  if (warningChecks === 0) return 'excellent'
  if (passedChecks >= warningChecks) return 'good'
  return 'warning'
})

const consistencyStatusText = computed(() => {
  const status = consistencyStatus.value
  return status === 'excellent' ? '优秀' : status === 'good' ? '良好' : '需要关注'
})

// 方法
const getCompletionClass = (completeness: number) => {
  if (completeness >= 98) return 'excellent'
  if (completeness >= 95) return 'good'
  return 'warning'
}

const getAccuracyClass = (accuracy: number) => {
  if (accuracy >= 98) return 'excellent'
  if (accuracy >= 95) return 'good'
  return 'warning'
}

const viewDetails = (item: any) => {
  console.log('查看详情:', item)
}

const toggleMonitoring = () => {
  isMonitoring.value = !isMonitoring.value
}

const handleAlert = (alert: any) => {
  console.log('处理警报:', alert)
}

const updateTime = () => {
  const now = new Date()
  lastUpdated.value = now.toLocaleTimeString()
}

// 生命周期
onMounted(() => {
  updateTime()
  const interval = setInterval(updateTime, 30000) // 每30秒更新一次
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped lang="scss">
.quality-monitoring-module {
  padding: 20px;
  background: #0a0e27;
  color: #fff;
  min-height: 100vh;

  .quality-overview {
    margin-bottom: 30px;
    
    .overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h3 {
        margin: 0;
        font-size: 24px;
        color: #fff;
        
        .icon {
          margin-right: 10px;
        }
      }
      
      .last-updated {
        font-size: 14px;
        color: #8b9dc3;
      }
    }
    
    .overview-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      
      .stat-card {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        padding: 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        transition: transform 0.3s ease;
        
        &:hover {
          transform: translateY(-5px);
        }
        
        .stat-icon {
          font-size: 40px;
          margin-right: 15px;
          
          &.excellent { color: #00ff88; }
          &.good { color: #ffb366; }
          &.warning { color: #ff6b6b; }
        }
        
        .stat-content {
          flex: 1;
          
          .stat-value {
            font-size: 32px;
            font-weight: bold;
            color: #fff;
            margin-bottom: 5px;
          }
          
          .stat-label {
            font-size: 14px;
            color: #8b9dc3;
            margin-bottom: 8px;
          }
          
          .stat-trend {
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 5px;
            
            &.up { color: #00ff88; }
            &.down { color: #ff6b6b; }
          }
        }
      }
    }
  }

  .quality-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
    
    .detail-section {
      background: #151b3d;
      padding: 20px;
      border-radius: 12px;
      
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        
        h4 {
          margin: 0;
          font-size: 18px;
          color: #fff;
          
          .icon {
            margin-right: 8px;
          }
        }
        
        .health-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .indicator-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            
            &.excellent { background: #00ff88; }
            &.good { background: #ffb366; }
            &.warning { background: #ff6b6b; }
          }
          
          .indicator-text {
            font-size: 14px;
            color: #8b9dc3;
          }
        }
      }
      
      .integrity-grid {
        display: grid;
        gap: 15px;
        
        .integrity-item {
          background: #0a0e27;
          padding: 15px;
          border-radius: 8px;
          
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            
            .table-name {
              font-size: 14px;
              color: #fff;
            }
            
            .completion-rate {
              font-weight: bold;
              
              &.excellent { color: #00ff88; }
              &.good { color: #ffb366; }
              &.warning { color: #ff6b6b; }
            }
          }
          
          .progress-bar {
            width: 100%;
            height: 6px;
            background: #2a2a2a;
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 10px;
            
            .progress-fill {
              height: 100%;
              transition: width 0.3s ease;
              
              &.excellent { background: #00ff88; }
              &.good { background: #ffb366; }
              &.warning { background: #ff6b6b; }
            }
          }
          
          .item-details {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #8b9dc3;
          }
        }
      }
      
      .accuracy-grid {
        display: grid;
        gap: 15px;
        
        .accuracy-item {
          background: #0a0e27;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 15px;
          
          .item-icon {
            font-size: 24px;
          }
          
          .item-content {
            flex: 1;
            
            .item-name {
              font-size: 14px;
              color: #fff;
              margin-bottom: 5px;
            }
            
            .accuracy-score {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
              
              &.excellent { color: #00ff88; }
              &.good { color: #ffb366; }
              &.warning { color: #ff6b6b; }
            }
            
            .error-count {
              font-size: 12px;
              color: #8b9dc3;
            }
          }
          
          .item-actions {
            .action-btn {
              padding: 5px 10px;
              background: #2a5298;
              color: #fff;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              
              &:hover {
                background: #1e3c72;
              }
            }
          }
        }
      }
      
      .consistency-checks {
        display: grid;
        gap: 15px;
        
        .check-item {
          background: #0a0e27;
          padding: 15px;
          border-radius: 8px;
          
          .check-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            
            .check-name {
              font-size: 14px;
              color: #fff;
            }
            
            .check-status {
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
              
              &.passed {
                background: #00ff88;
                color: #0a0e27;
              }
              
              &.warning {
                background: #ffb366;
                color: #0a0e27;
              }
              
              &.failed {
                background: #ff6b6b;
                color: #fff;
              }
            }
          }
          
          .check-description {
            font-size: 12px;
            color: #8b9dc3;
            margin-bottom: 10px;
          }
          
          .check-result {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .result-text {
              font-size: 13px;
              color: #fff;
            }
            
            .check-time {
              font-size: 12px;
              color: #8b9dc3;
            }
          }
        }
      }
    }
  }

  .realtime-monitoring {
    background: #151b3d;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 30px;
    
    .monitoring-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h4 {
        margin: 0;
        font-size: 18px;
        color: #fff;
        
        .icon {
          margin-right: 8px;
        }
      }
      
      .monitoring-controls {
        .control-btn {
          padding: 8px 16px;
          background: #2a5298;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          
          &.active {
            background: #ff6b6b;
          }
          
          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
    
    .monitoring-content {
      .alert-panel {
        .alert-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          
          .alert-title {
            font-size: 16px;
            color: #fff;
          }
          
          .alert-count {
            background: #ff6b6b;
            color: #fff;
            padding: 4px 8px;
            border-radius: 50%;
            font-size: 12px;
            min-width: 20px;
            text-align: center;
          }
        }
        
        .alert-list {
          display: grid;
          gap: 10px;
          
          .alert-item {
            background: #0a0e27;
            padding: 15px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 15px;
            border-left: 4px solid;
            
            &.high { border-left-color: #ff6b6b; }
            &.medium { border-left-color: #ffb366; }
            &.low { border-left-color: #00ff88; }
            
            .alert-icon {
              font-size: 20px;
            }
            
            .alert-content {
              flex: 1;
              
              .alert-message {
                font-size: 14px;
                color: #fff;
                margin-bottom: 5px;
              }
              
              .alert-time {
                font-size: 12px;
                color: #8b9dc3;
              }
            }
            
            .alert-actions {
              .alert-action {
                padding: 5px 10px;
                background: #2a5298;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                
                &:hover {
                  background: #1e3c72;
                }
              }
            }
          }
        }
      }
    }
  }

  .quality-trends {
    background: #151b3d;
    padding: 20px;
    border-radius: 12px;
    
    .trends-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h4 {
        margin: 0;
        font-size: 18px;
        color: #fff;
        
        .icon {
          margin-right: 8px;
        }
      }
      
      .trend-controls {
        display: flex;
        gap: 10px;
        
        .period-btn {
          padding: 6px 12px;
          background: #2a2a2a;
          color: #8b9dc3;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          
          &.active {
            background: #2a5298;
            color: #fff;
          }
          
          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
    
    .trends-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      
      .trend-chart-container {
        background: #0a0e27;
        padding: 20px;
        border-radius: 8px;
        
        .trend-chart {
          width: 100%;
          height: 200px;
        }
      }
      
      .trend-summary {
        display: grid;
        gap: 15px;
        
        .summary-item {
          background: #0a0e27;
          padding: 15px;
          border-radius: 8px;
          
          .summary-label {
            font-size: 14px;
            color: #8b9dc3;
            margin-bottom: 5px;
          }
          
          .summary-value {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
            
            &.up { color: #00ff88; }
            &.down { color: #ff6b6b; }
          }
          
          .summary-change {
            font-size: 12px;
            color: #8b9dc3;
          }
        }
      }
    }
  }
}
</style> 