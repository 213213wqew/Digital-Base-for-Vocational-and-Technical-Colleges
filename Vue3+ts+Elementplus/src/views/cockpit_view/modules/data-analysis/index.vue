<template>
  <div class="data-analysis-module">
    <!-- 数据分析概览 -->
    <div class="analysis-overview">
      <div class="overview-header">
        <h3><span class="icon">📊</span>数据分析概览</h3>
        <div class="analysis-time">分析时间: {{ analysisTime }}</div>
      </div>
      <div class="overview-metrics">
        <div class="metric-card" v-for="metric in overviewMetrics" :key="metric.key">
          <div class="metric-icon">{{ metric.icon }}</div>
          <div class="metric-content">
            <div class="metric-value">{{ metric.value }}</div>
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-trend" :class="metric.trend">{{ metric.change }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学生数据分析 -->
    <div class="analysis-section">
      <div class="section-header">
        <h4><span class="icon">🎓</span>学生数据分析</h4>
        <div class="section-actions">
          <button class="action-btn" @click="exportStudentReport">导出报告</button>
        </div>
      </div>
      <div class="analysis-content">
        <div class="analysis-grid">
          <div class="analysis-item" v-for="item in studentAnalysis" :key="item.category">
            <div class="item-header">
              <span class="item-title">{{ item.category }}</span>
              <span class="item-score" :class="item.level">{{ item.score }}</span>
            </div>
            <div class="item-chart">
              <canvas :ref="'studentChart' + item.category" class="mini-chart"></canvas>
            </div>
            <div class="item-insights">
              <div class="insight" v-for="insight in item.insights" :key="insight">
                <span class="insight-dot"></span>
                <span class="insight-text">{{ insight }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 教学数据分析 -->
    <div class="analysis-section">
      <div class="section-header">
        <h4><span class="icon">📚</span>教学数据分析</h4>
        <div class="section-actions">
          <button class="action-btn" @click="exportTeachingReport">导出报告</button>
        </div>
      </div>
      <div class="analysis-content">
        <div class="teaching-analysis">
          <div class="teaching-metrics">
            <div class="teaching-metric" v-for="metric in teachingMetrics" :key="metric.name">
              <div class="metric-header">
                <span class="metric-name">{{ metric.name }}</span>
                <span class="metric-value">{{ metric.value }}</span>
              </div>
              <div class="metric-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: metric.progress + '%' }" :class="metric.level"></div>
                </div>
              </div>
              <div class="metric-comparison">
                <span class="comparison-text">{{ metric.comparison }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 资源利用分析 -->
    <div class="analysis-section">
      <div class="section-header">
        <h4><span class="icon">🏢</span>资源利用分析</h4>
        <div class="section-actions">
          <button class="action-btn" @click="exportResourceReport">导出报告</button>
        </div>
      </div>
      <div class="analysis-content">
        <div class="resource-analysis">
          <div class="resource-overview">
            <div class="resource-stat" v-for="stat in resourceStats" :key="stat.type">
              <div class="stat-icon">{{ stat.icon }}</div>
              <div class="stat-content">
                <div class="stat-name">{{ stat.name }}</div>
                <div class="stat-utilization">{{ stat.utilization }}%</div>
                <div class="stat-status" :class="stat.status">{{ stat.statusText }}</div>
              </div>
            </div>
          </div>
          <div class="resource-details">
            <div class="detail-item" v-for="detail in resourceDetails" :key="detail.resource">
              <div class="detail-header">
                <span class="resource-name">{{ detail.resource }}</span>
                <span class="peak-time">高峰时段: {{ detail.peakTime }}</span>
              </div>
              <div class="utilization-chart">
                <div class="chart-bar" v-for="hour in detail.hourlyData" :key="hour.time">
                  <div class="bar-fill" :style="{ height: hour.value + '%' }" :class="getUtilizationClass(hour.value)"></div>
                  <div class="bar-label">{{ hour.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预测分析 -->
    <div class="analysis-section">
      <div class="section-header">
        <h4><span class="icon">🔮</span>预测分析</h4>
        <div class="section-controls">
          <select v-model="selectedPredictionModel" class="model-select">
            <option value="linear">线性回归</option>
            <option value="polynomial">多项式回归</option>
            <option value="neural">神经网络</option>
          </select>
        </div>
      </div>
      <div class="analysis-content">
        <div class="prediction-grid">
          <div class="prediction-item" v-for="prediction in predictions" :key="prediction.category">
            <div class="prediction-header">
              <span class="prediction-title">{{ prediction.category }}</span>
              <span class="prediction-confidence">置信度: {{ prediction.confidence }}%</span>
            </div>
            <div class="prediction-chart">
              <canvas :ref="'predictionChart' + prediction.category" class="prediction-canvas"></canvas>
            </div>
            <div class="prediction-summary">
              <div class="summary-item">
                <span class="summary-label">预测趋势:</span>
                <span class="summary-value" :class="prediction.trend">{{ prediction.trendText }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">关键因素:</span>
                <span class="summary-value">{{ prediction.keyFactors.join(', ') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义报表 -->
    <div class="analysis-section">
      <div class="section-header">
        <h4><span class="icon">📋</span>自定义报表</h4>
        <div class="section-actions">
          <button class="action-btn primary" @click="createCustomReport">创建报表</button>
        </div>
      </div>
      <div class="analysis-content">
        <div class="custom-reports">
          <div class="report-templates">
            <div class="template-item" v-for="template in reportTemplates" :key="template.id">
              <div class="template-header">
                <span class="template-name">{{ template.name }}</span>
                <span class="template-type">{{ template.type }}</span>
              </div>
              <div class="template-description">{{ template.description }}</div>
              <div class="template-actions">
                <button class="template-btn" @click="useTemplate(template)">使用模板</button>
                <button class="template-btn secondary" @click="previewTemplate(template)">预览</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 响应式数据
const analysisTime = ref('')
const selectedPredictionModel = ref('linear')

// 概览指标
const overviewMetrics = ref([
  { key: 'total_students', label: '学生总数', value: '15,680', icon: '👥', trend: 'up', change: '+2.3%' },
  { key: 'active_courses', label: '活跃课程', value: '2,580', icon: '📚', trend: 'up', change: '+5.1%' },
  { key: 'avg_score', label: '平均成绩', value: '82.5', icon: '📊', trend: 'up', change: '+1.8%' },
  { key: 'resource_usage', label: '资源利用率', value: '78.3%', icon: '🏢', trend: 'down', change: '-2.1%' }
])

// 学生数据分析
const studentAnalysis = ref([
  {
    category: '学习表现',
    score: '85.2',
    level: 'good',
    insights: ['优秀学生比例上升5%', '学习积极性提高', '课业完成率达92%']
  },
  {
    category: '出勤情况',
    score: '91.8',
    level: 'excellent',
    insights: ['出勤率稳定在90%以上', '病假比例下降', '迟到现象减少']
  },
  {
    category: '专业分布',
    score: '76.4',
    level: 'good',
    insights: ['热门专业需求增长', '新兴专业关注度提升', '专业均衡性改善']
  }
])

// 教学指标
const teachingMetrics = ref([
  { name: '课程满意度', value: '4.3/5.0', progress: 86, level: 'good', comparison: '比上季度提升8%' },
  { name: '教学质量评分', value: '88.5', progress: 89, level: 'excellent', comparison: '超过目标值3.5分' },
  { name: '课程完成率', value: '94.2%', progress: 94, level: 'excellent', comparison: '达到预期目标' },
  { name: '师生互动频率', value: '72.8%', progress: 73, level: 'good', comparison: '较上月增长12%' }
])

// 资源统计
const resourceStats = ref([
  { type: 'classroom', name: '教室利用率', utilization: 78, icon: '🏛️', status: 'good', statusText: '良好' },
  { type: 'equipment', name: '设备使用率', utilization: 65, icon: '💻', status: 'medium', statusText: '中等' },
  { type: 'library', name: '图书馆利用率', utilization: 83, icon: '📚', status: 'excellent', statusText: '优秀' },
  { type: 'lab', name: '实验室利用率', utilization: 71, icon: '🧪', status: 'good', statusText: '良好' }
])

// 资源详情
const resourceDetails = ref([
  {
    resource: '多媒体教室',
    peakTime: '09:00-11:00',
    hourlyData: [
      { time: '08:00', value: 45 },
      { time: '09:00', value: 89 },
      { time: '10:00', value: 95 },
      { time: '11:00', value: 78 },
      { time: '14:00', value: 82 },
      { time: '15:00', value: 76 },
      { time: '16:00', value: 69 }
    ]
  }
])

// 预测数据
const predictions = ref([
  {
    category: '学生入学率',
    confidence: 87,
    trend: 'up',
    trendText: '预计增长12%',
    keyFactors: ['专业热度', '就业率', '社会需求']
  },
  {
    category: '教学质量',
    confidence: 92,
    trend: 'up',
    trendText: '持续改善',
    keyFactors: ['师资配备', '设备更新', '课程优化']
  },
  {
    category: '资源需求',
    confidence: 78,
    trend: 'up',
    trendText: '需求增长8%',
    keyFactors: ['学生规模', '课程数量', '设备老化']
  }
])

// 报表模板
const reportTemplates = ref([
  { id: 1, name: '学生学习报告', type: '周报', description: '包含学习进度、成绩分析、出勤统计等' },
  { id: 2, name: '教学质量报告', type: '月报', description: '教学效果评估、课程满意度、师生反馈等' },
  { id: 3, name: '资源利用报告', type: '月报', description: '设备使用率、教室占用率、资源配置建议' },
  { id: 4, name: '综合分析报告', type: '季报', description: '全面的数据分析和趋势预测' }
])

// 方法
const getUtilizationClass = (value: number) => {
  if (value >= 90) return 'high'
  if (value >= 70) return 'medium'
  return 'low'
}

const exportStudentReport = () => {
  console.log('导出学生报告')
}

const exportTeachingReport = () => {
  console.log('导出教学报告')
}

const exportResourceReport = () => {
  console.log('导出资源报告')
}

const createCustomReport = () => {
  console.log('创建自定义报表')
}

const useTemplate = (template: any) => {
  console.log('使用模板:', template)
}

const previewTemplate = (template: any) => {
  console.log('预览模板:', template)
}

const updateAnalysisTime = () => {
  const now = new Date()
  analysisTime.value = now.toLocaleString()
}

// 生命周期
onMounted(() => {
  updateAnalysisTime()
})
</script>

<style scoped lang="scss">
.data-analysis-module {
  padding: 20px;
  background: #0a0e27;
  color: #fff;
  min-height: 100vh;

  .analysis-overview {
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
      
      .analysis-time {
        font-size: 14px;
        color: #8b9dc3;
      }
    }
    
    .overview-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      
      .metric-card {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        padding: 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        transition: transform 0.3s ease;
        
        &:hover {
          transform: translateY(-5px);
        }
        
        .metric-icon {
          font-size: 40px;
          margin-right: 15px;
        }
        
        .metric-content {
          flex: 1;
          
          .metric-value {
            font-size: 28px;
            font-weight: bold;
            color: #fff;
            margin-bottom: 5px;
          }
          
          .metric-label {
            font-size: 14px;
            color: #8b9dc3;
            margin-bottom: 8px;
          }
          
          .metric-trend {
            font-size: 12px;
            
            &.up { color: #00ff88; }
            &.down { color: #ff6b6b; }
          }
        }
      }
    }
  }

  .analysis-section {
    background: #151b3d;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 30px;
    
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
      
      .section-actions {
        display: flex;
        gap: 10px;
        
        .action-btn {
          padding: 8px 16px;
          background: #2a5298;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          
          &.primary {
            background: #00ff88;
            color: #0a0e27;
          }
          
          &:hover {
            opacity: 0.9;
          }
        }
      }
      
      .section-controls {
        .model-select {
          padding: 8px 12px;
          background: #0a0e27;
          color: #fff;
          border: 1px solid #2a5298;
          border-radius: 6px;
        }
      }
    }
    
    .analysis-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      
      .analysis-item {
        background: #0a0e27;
        padding: 20px;
        border-radius: 8px;
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          
          .item-title {
            font-size: 16px;
            color: #fff;
          }
          
          .item-score {
            font-size: 18px;
            font-weight: bold;
            
            &.excellent { color: #00ff88; }
            &.good { color: #ffb366; }
            &.medium { color: #fff; }
          }
        }
        
        .item-chart {
          margin-bottom: 15px;
          
          .mini-chart {
            width: 100%;
            height: 80px;
          }
        }
        
        .item-insights {
          .insight {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            
            .insight-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #00ff88;
            }
            
            .insight-text {
              font-size: 14px;
              color: #8b9dc3;
            }
          }
        }
      }
    }
    
    .teaching-analysis {
      .teaching-metrics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        
        .teaching-metric {
          background: #0a0e27;
          padding: 20px;
          border-radius: 8px;
          
          .metric-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            
            .metric-name {
              font-size: 14px;
              color: #fff;
            }
            
            .metric-value {
              font-size: 16px;
              font-weight: bold;
              color: #00ff88;
            }
          }
          
          .metric-progress {
            margin-bottom: 10px;
            
            .progress-bar {
              width: 100%;
              height: 8px;
              background: #2a2a2a;
              border-radius: 4px;
              overflow: hidden;
              
              .progress-fill {
                height: 100%;
                transition: width 0.3s ease;
                
                &.excellent { background: #00ff88; }
                &.good { background: #ffb366; }
                &.medium { background: #fff; }
              }
            }
          }
          
          .metric-comparison {
            .comparison-text {
              font-size: 12px;
              color: #8b9dc3;
            }
          }
        }
      }
    }
    
    .resource-analysis {
      .resource-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
        
        .resource-stat {
          background: #0a0e27;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 15px;
          
          .stat-icon {
            font-size: 30px;
          }
          
          .stat-content {
            flex: 1;
            
            .stat-name {
              font-size: 14px;
              color: #8b9dc3;
              margin-bottom: 5px;
            }
            
            .stat-utilization {
              font-size: 20px;
              font-weight: bold;
              color: #fff;
              margin-bottom: 5px;
            }
            
            .stat-status {
              font-size: 12px;
              
              &.excellent { color: #00ff88; }
              &.good { color: #ffb366; }
              &.medium { color: #fff; }
            }
          }
        }
      }
      
      .resource-details {
        .detail-item {
          background: #0a0e27;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 15px;
          
          .detail-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            
            .resource-name {
              font-size: 16px;
              color: #fff;
            }
            
            .peak-time {
              font-size: 14px;
              color: #8b9dc3;
            }
          }
          
          .utilization-chart {
            display: flex;
            justify-content: space-between;
            align-items: end;
            height: 80px;
            
            .chart-bar {
              flex: 1;
              margin: 0 2px;
              display: flex;
              flex-direction: column;
              align-items: center;
              
              .bar-fill {
                width: 100%;
                transition: height 0.3s ease;
                border-radius: 2px 2px 0 0;
                
                &.high { background: #ff6b6b; }
                &.medium { background: #ffb366; }
                &.low { background: #00ff88; }
              }
              
              .bar-label {
                font-size: 10px;
                color: #8b9dc3;
                margin-top: 5px;
              }
            }
          }
        }
      }
    }
    
    .prediction-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      
      .prediction-item {
        background: #0a0e27;
        padding: 20px;
        border-radius: 8px;
        
        .prediction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          
          .prediction-title {
            font-size: 16px;
            color: #fff;
          }
          
          .prediction-confidence {
            font-size: 14px;
            color: #8b9dc3;
          }
        }
        
        .prediction-chart {
          margin-bottom: 15px;
          
          .prediction-canvas {
            width: 100%;
            height: 120px;
          }
        }
        
        .prediction-summary {
          .summary-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            
            .summary-label {
              font-size: 14px;
              color: #8b9dc3;
              min-width: 80px;
            }
            
            .summary-value {
              font-size: 14px;
              color: #fff;
              
              &.up { color: #00ff88; }
              &.down { color: #ff6b6b; }
            }
          }
        }
      }
    }
    
    .custom-reports {
      .report-templates {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        
        .template-item {
          background: #0a0e27;
          padding: 20px;
          border-radius: 8px;
          
          .template-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            
            .template-name {
              font-size: 16px;
              color: #fff;
            }
            
            .template-type {
              padding: 4px 8px;
              background: #2a5298;
              color: #fff;
              border-radius: 4px;
              font-size: 12px;
            }
          }
          
          .template-description {
            font-size: 14px;
            color: #8b9dc3;
            margin-bottom: 15px;
          }
          
          .template-actions {
            display: flex;
            gap: 10px;
            
            .template-btn {
              padding: 8px 12px;
              background: #2a5298;
              color: #fff;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              
              &.secondary {
                background: #0a0e27;
                border: 1px solid #2a5298;
              }
              
              &:hover {
                opacity: 0.9;
              }
            }
          }
        }
      }
    }
  }
}
</style> 