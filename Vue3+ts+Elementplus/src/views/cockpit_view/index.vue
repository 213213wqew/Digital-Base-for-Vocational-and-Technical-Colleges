<template>
  <div class="dashboard-container" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- 顶部标题栏 -->
    <header class="dashboard-header">
      <div class="header-left">
        <div class="logo">🎓</div>
      </div>
      <div class="header-center">
        <div class="system-info">
          <h1 class="main-title">职业院校数字基座高职数据标准监控中心</h1>
          <p class="sub-title">Digital Infrastructure Monitoring Center for Vocational Colleges</p>
        </div>
      </div>
      <div class="header-right">
        <div class="current-time">
          <div class="date">{{ currentDate }}</div>
          <div class="time">{{ currentTime }}</div>
        </div>
        <div class="weather">
          <span class="weather-icon">☀️</span>
          <span class="temp">25°C</span>
        </div>
        <!-- 下拉菜单按钮 -->
        <div class="dropdown-toggle" @click="toggleDropdown">
          <i class="dropdown-icon">⚙️</i>
          <span class="dropdown-text">设置</span>
          <i class="arrow-icon" :class="{ 'arrow-up': showDropdown }">▼</i>
        </div>
      </div>
    </header>

    <!-- 下拉菜单 -->
    <div class="dropdown-menu" :class="{ show: showDropdown }">
      <div class="dropdown-content">
        <div class="dropdown-item" @click="exportData">
          <i class="item-icon">📊</i>
          <span>导出数据</span>
        </div>
        <div class="dropdown-item" @click="refreshData">
          <i class="item-icon">🔄</i>
          <span>刷新数据</span>
        </div>
        <div class="dropdown-item" @click="toggleFullscreen">
          <i class="item-icon">📺</i>
          <span>{{ isFullscreen ? '退出全屏' : '全屏模式' }}</span>
        </div>
        <div class="dropdown-item" @click="systemSettings">
          <i class="item-icon">⚙️</i>
          <span>系统设置</span>
        </div>
        <div class="dropdown-item" @click="viewLogs">
          <i class="item-icon">📋</i>
          <span>查看日志</span>
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <main class="dashboard-main">
      <!-- 中间主图表区 -->
      <section class="center-panel">
        <!-- 模块切换导航 -->
        <div class="module-nav">
          <div class="nav-title">数据监控中心</div>
          <div class="nav-tabs">
            <button 
              v-for="module in modules" 
              :key="module.key"
              class="nav-tab"
              :class="{ active: activeModule === module.key }"
              @click="switchModule(module.key)"
            >
              <i class="tab-icon">{{ module.icon }}</i>
              <span class="tab-label">{{ module.label }}</span>
            </button>
          </div>
          <div class="nav-status">
            <span class="status-indicator"></span>
            <span class="status-text">{{ modules.find(m => m.key === activeModule)?.label }} 监控中</span>
          </div>
        </div>

        <!-- 模块内容展示区 -->
        <div class="module-content">
          <Transition name="module-fade" mode="out-in">
            <KeepAlive>
              <component :is="currentModuleComponent" :key="activeModule" />
            </KeepAlive>
          </Transition>
        </div>
      </section>

      <!-- 右侧数据面板 -->
      <aside class="right-panel">
        <!-- 数据质量监控 -->
        <div class="panel-card">
          <div class="card-header">
            <i class="icon">🔍</i>
            <span class="title">数据质量监控</span>
          </div>
          <div class="card-body">
            <div class="data-row">
              <span class="label">数据完整性</span>
              <span class="value">98.7<em>%</em></span>
            </div>
            <div class="data-row">
              <span class="label">数据准确性</span>
              <span class="value">97.2<em>%</em></span>
            </div>
            <div class="data-row">
              <span class="label">数据一致性</span>
              <span class="value">96.8<em>%</em></span>
            </div>
            <div class="data-row">
              <span class="label">数据及时性</span>
              <span class="value">99.1<em>%</em></span>
            </div>
          </div>
        </div>

        <!-- 报表统计 -->
        <div class="panel-card">
          <div class="card-header">
            <i class="icon">📈</i>
            <span class="title">报表统计</span>
          </div>
          <div class="card-body">
            <div class="data-row">
              <span class="label">总报表数</span>
              <span class="value">98<em>份</em></span>
            </div>
            <div class="data-row">
              <span class="label">本月新增</span>
              <span class="value">12<em>份</em></span>
            </div>
            <div class="data-row">
              <span class="label">上报率</span>
              <span class="value">92.6<em>%</em></span>
            </div>
            <div class="data-row">
              <span class="label">合格率</span>
              <span class="value">95.3<em>%</em></span>
            </div>
          </div>
        </div>

        <!-- 系统状态 -->
        <div class="panel-card">
          <div class="card-header">
            <i class="icon">⚡</i>
            <span class="title">系统状态</span>
          </div>
          <div class="card-body">
            <div class="data-row">
              <span class="label">CPU使用率</span>
              <span class="value">32.5<em>%</em></span>
            </div>
            <div class="data-row">
              <span class="label">内存使用率</span>
              <span class="value">68.9<em>%</em></span>
            </div>
            <div class="data-row">
              <span class="label">磁盘使用率</span>
              <span class="value">45.7<em>%</em></span>
            </div>
            <div class="data-row">
              <span class="label">网络流量</span>
              <span class="value">1.2<em>MB/s</em></span>
            </div>
          </div>
        </div>

        <!-- 实时动态 -->
        <div class="panel-card">
          <div class="card-header">
            <i class="icon">📡</i>
            <span class="title">实时动态</span>
          </div>
          <div class="card-body activity-list">
            <div class="activity-item">
              <div class="activity-time">15:42</div>
              <div class="activity-text">数据同步完成</div>
            </div>
            <div class="activity-item">
              <div class="activity-time">15:35</div>
              <div class="activity-text">新增学生数据</div>
            </div>
            <div class="activity-item">
              <div class="activity-time">15:28</div>
              <div class="activity-text">课程表更新</div>
            </div>
            <div class="activity-item">
              <div class="activity-time">15:20</div>
              <div class="activity-text">教师信息修改</div>
            </div>
            <div class="activity-item">
              <div class="activity-time">15:15</div>
              <div class="activity-text">系统自动备份</div>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <!-- 底部状态栏 -->
    <footer class="dashboard-footer">
      <div class="footer-left">
        <span class="status-item">
          <i class="status-dot online"></i>
          系统运行正常
        </span>
        <span class="status-item">
          <i class="status-dot sync"></i>
          数据同步中
        </span>
      </div>
      <div class="footer-right">
        <span class="online-users">当前在线: {{ onlineUsers }} 人</span>
        <span class="last-update">最后更新: {{ lastUpdateTime }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { defineAsyncComponent } from 'vue'

// 动态导入模块组件
const SchoolManagement = defineAsyncComponent(() => import('./modules/school-management/index.vue'))
const StudentManagement = defineAsyncComponent(() => import('./modules/student-management/index.vue'))
const TeacherManagement = defineAsyncComponent(() => import('./modules/teacher-management/index.vue'))
const ReportManagement = defineAsyncComponent(() => import('./modules/report-management/index.vue'))
const QualityMonitoring = defineAsyncComponent(() => import('./modules/quality-monitoring/index.vue'))

// 响应式数据
const currentDate = ref('')
const currentTime = ref('')
const onlineUsers = ref(256)
const lastUpdateTime = ref('')
const activeModule = ref('school-management')
const showDropdown = ref(false)

// 模块配置
const modules = ref([
  {
    key: 'school-management',
    label: '学校管理',
    icon: '🏫',
    component: 'SchoolManagement'
  },
  {
    key: 'student-management',
    label: '学生管理',
    icon: '🎓',
    component: 'StudentManagement'
  },
  {
    key: 'teacher-management',
    label: '教师管理',
    icon: '👨‍🏫',
    component: 'TeacherManagement'
  },
  {
    key: 'report-management',
    label: '报表管理',
    icon: '📊',
    component: 'ReportManagement'
  },
  {
    key: 'quality-monitoring',
    label: '质量监控',
    icon: '🔍',
    component: 'QualityMonitoring'
  }
])

// 计算属性
const currentModuleComponent = computed(() => {
  const componentMap: { [key: string]: any } = {
    'school-management': SchoolManagement,
    'student-management': StudentManagement,
    'teacher-management': TeacherManagement,
    'report-management': ReportManagement,
    'quality-monitoring': QualityMonitoring
  }
  return componentMap[activeModule.value] || SchoolManagement
})

// 图表数据
const chartPoints = ref([
  { x: 100, y: 180 },
  { x: 200, y: 120 },
  { x: 300, y: 100 },
  { x: 400, y: 150 },
  { x: 500, y: 90 },
  { x: 600, y: 140 },
  { x: 700, y: 110 }
])

const chartLabels = ref(['11/13', '11/14', '11/15', '11/16', '11/17', '11/18', '今日'])

// 方法
const switchModule = (moduleKey: string) => {
  activeModule.value = moduleKey
  console.log('切换模块:', moduleKey)
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const exportData = () => {
  alert('导出数据功能待实现')
}

const refreshData = () => {
  alert('刷新数据功能待实现')
}

// 全屏状态
const isFullscreen = ref(false)

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  
  // 添加或移除全屏class到body
  const body = document.body
  if (isFullscreen.value) {
    body.classList.add('cockpit-fullscreen')
  } else {
    body.classList.remove('cockpit-fullscreen')
  }
  
  console.log('驾驶舱全屏模式:', isFullscreen.value ? '开启' : '关闭')
}

const systemSettings = () => {
  alert('系统设置功能待实现')
}

const viewLogs = () => {
  alert('查看日志功能待实现')
}

// 时间更新
const updateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    weekday: 'short'
  })
  currentTime.value = now.toLocaleTimeString('zh-CN', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  lastUpdateTime.value = now.toLocaleTimeString('zh-CN', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  })
}

let timeInterval: number

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
  // 清理全屏状态
  document.body.classList.remove('cockpit-fullscreen')
})
</script>

<style scoped lang="scss">
.dashboard-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%);
  color: #ffffff;
  font-family: 'Microsoft YaHei', sans-serif;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(0, 123, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(0, 200, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

// 头部样式
.dashboard-header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  background: linear-gradient(90deg, rgba(26, 35, 50, 0.9) 0%, rgba(15, 20, 25, 0.9) 100%);
  border-bottom: 2px solid rgba(0, 123, 255, 0.3);
  backdrop-filter: blur(10px);

  .header-left {
    display: flex;
    align-items: center;
    width: 100px;

    .logo {
      font-size: 48px;
      filter: drop-shadow(0 0 10px rgba(0, 123, 255, 0.5));
    }
  }

  .header-center {
    flex: 1;
    text-align: center;

    .system-info {
      .main-title {
        font-size: 28px;
        font-weight: bold;
        margin: 0;
        background: linear-gradient(90deg, #00bfff, #0080ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 20px rgba(0, 191, 255, 0.3);
      }

      .sub-title {
        font-size: 14px;
        color: #7fb3d3;
        margin: 5px 0 0 0;
        opacity: 0.8;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 30px;
    width: 200px;
    justify-content: flex-end;

    .current-time {
      text-align: right;

      .date {
        font-size: 16px;
        color: #7fb3d3;
        margin-bottom: 5px;
      }

      .time {
        font-size: 24px;
        font-weight: bold;
        color: #00bfff;
        text-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
      }
    }

    .weather {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 15px;
      background: rgba(0, 123, 255, 0.1);
      border: 1px solid rgba(0, 123, 255, 0.3);
      border-radius: 8px;

      .weather-icon {
        font-size: 20px;
      }

      .temp {
        font-size: 18px;
        font-weight: bold;
        color: #00bfff;
      }
    }
  }
}

// 下拉菜单样式
.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background: rgba(0, 123, 255, 0.1);
  border: 1px solid rgba(0, 123, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(5px);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #7fb3d3;

  &:hover {
    background: rgba(0, 123, 255, 0.2);
    color: #00bfff;
  }

  .dropdown-icon {
    font-size: 18px;
  }

  .dropdown-text {
    font-weight: bold;
  }

  .arrow-icon {
    font-size: 14px;
    transition: transform 0.3s ease;

    &.arrow-up {
      transform: rotate(180deg);
    }
  }
}

.dropdown-menu {
  position: absolute;
  top: 100px; /* Adjust based on header height */
  right: 30px;
  background: linear-gradient(135deg, rgba(26, 35, 50, 0.9) 0%, rgba(15, 20, 25, 0.9) 100%);
  border: 1px solid rgba(0, 123, 255, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;

  &.show {
    opacity: 1;
    visibility: visible;
  }

  .dropdown-content {
    padding: 10px 0;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    color: #7fb3d3;

    &:hover {
      background: rgba(0, 123, 255, 0.2);
      color: #00bfff;
    }

    .item-icon {
      font-size: 18px;
    }
  }
}

// 主体内容
.dashboard-main {
  height: calc(100vh - 120px);
  display: grid;
  grid-template-columns: 4fr 1fr;
  gap: 15px;
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

// 侧边栏面板样式
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  min-width: 0; /* 允许收缩 */
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 123, 255, 0.5);
    border-radius: 2px;
  }
}

// 面板卡片样式
.panel-card {
  background: linear-gradient(135deg, rgba(26, 35, 50, 0.8) 0%, rgba(15, 20, 25, 0.8) 100%);
  border: 1px solid rgba(0, 123, 255, 0.3);
  border-radius: 8px;
  padding: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 123, 255, 0.5);
    box-shadow: 0 12px 40px rgba(0, 123, 255, 0.2);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 123, 255, 0.2);

    .icon {
      font-size: 16px;
    }

    .title {
      font-size: 14px;
      font-weight: bold;
      color: #00bfff;
    }
  }

  .card-body {
    .data-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-size: 12px;
        color: #7fb3d3;
      }

      .value {
        font-size: 14px;
        font-weight: bold;
        color: #00f5ff;
        text-shadow: 0 0 10px rgba(0, 245, 255, 0.3);

        em {
          font-size: 10px;
          font-style: normal;
          color: #7fb3d3;
          margin-left: 2px;
        }
      }
    }
  }

  // 活动列表特殊样式
  .activity-list {
    .activity-item {
      display: flex;
      gap: 8px;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);

      &:last-child {
        border-bottom: none;
      }

      .activity-time {
        font-size: 10px;
        color: #7fb3d3;
        width: 35px;
        flex-shrink: 0;
      }

      .activity-text {
        font-size: 11px;
        color: #ffffff;
        opacity: 0.9;
      }
    }
  }
}

// 中间面板样式
.center-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 0; /* 允许内容收缩 */
  overflow: hidden; /* 防止内容溢出 */

  // 模块切换导航
  .module-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background: linear-gradient(135deg, rgba(26, 35, 50, 0.8) 0%, rgba(15, 20, 25, 0.8) 100%);
    border: 1px solid rgba(0, 123, 255, 0.3);
    border-radius: 8px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    flex-shrink: 0; /* 防止导航栏缩小 */

    .nav-title {
      font-size: 16px;
      font-weight: bold;
      color: #00bfff;
      margin-right: 15px;
      white-space: nowrap; /* 防止标题换行 */
    }

    .nav-tabs {
      display: flex;
      gap: 12px;
      padding: 4px 8px;
      background: rgba(0, 123, 255, 0.1);
      border: 1px solid rgba(0, 123, 255, 0.3);
      border-radius: 6px;
      backdrop-filter: blur(5px);
      flex: 1; /* 占据可用空间 */
      justify-content: center; /* 居中排列 */
      overflow-x: auto; /* 允许水平滚动 */

      .nav-tab {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px;
        background: none;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 13px;
        color: #7fb3d3;
        white-space: nowrap; /* 防止标签文字换行 */
        flex-shrink: 0; /* 防止标签收缩 */

        &:hover {
          background: rgba(0, 123, 255, 0.2);
          color: #00bfff;
        }

        &.active {
          background: rgba(0, 123, 255, 0.3);
          color: #00bfff;
          font-weight: bold;
        }

        .tab-icon {
          font-size: 16px;
        }

        .tab-label {
          font-weight: bold;
        }
      }
    }

    .nav-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #7fb3d3;
      white-space: nowrap; /* 防止状态文字换行 */

      .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #00ff88;
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
      }
    }
  }

  // 模块内容展示区
  .module-content {
    flex: 1;
    background: linear-gradient(135deg, rgba(26, 35, 50, 0.8) 0%, rgba(15, 20, 25, 0.8) 100%);
    border: 1px solid rgba(0, 123, 255, 0.3);
    border-radius: 8px;
    padding: 15px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    overflow: auto;
    min-height: 0; /* 允许内容收缩 */

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 123, 255, 0.5);
      border-radius: 2px;
    }
  }
}

// 底部状态栏
.dashboard-footer {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  background: linear-gradient(90deg, rgba(26, 35, 50, 0.9) 0%, rgba(15, 20, 25, 0.9) 100%);
  border-top: 1px solid rgba(0, 123, 255, 0.3);
  backdrop-filter: blur(10px);

  .footer-left, .footer-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #7fb3d3;

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;

      &.online {
        background: #00ff88;
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
      }

      &.sync {
        background: #00bfff;
        box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
        animation: pulse 2s infinite;
      }
    }
  }

  .online-users, .last-update {
    font-size: 12px;
    color: #7fb3d3;
  }
}

// 动画效果
// 模块切换动画
.module-fade-enter-active,
.module-fade-leave-active {
  transition: all 0.3s ease;
}

.module-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.module-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

// 响应式适配
@media (max-width: 1600px) {
  .dashboard-main {
    grid-template-columns: 4fr 1fr;
    gap: 12px;
    padding: 12px;
  }
  
  .right-panel {
    gap: 12px;
  }
  
  .panel-card {
    padding: 12px;
  }
  
  .main-stats .stat-item .stat-value {
    font-size: 28px;
  }
}

@media (max-width: 1400px) {
  .dashboard-main {
    grid-template-columns: 4fr 1fr;
    gap: 10px;
    padding: 10px;
  }
  
  .right-panel {
    gap: 10px;
  }
  
  .dashboard-header {
    .header-center .system-info .main-title {
      font-size: 24px;
    }
    
    .header-right {
      width: auto;
      gap: 15px;
      
      .dropdown-toggle {
        padding: 6px 10px;
        font-size: 12px;
        
        .dropdown-text {
          display: none; /* 隐藏设置文字，只显示图标 */
        }
      }
    }
  }
  
  .center-panel .module-nav {
    .nav-tabs {
      gap: 10px;
      
      .nav-tab {
        padding: 6px 10px;
        font-size: 12px;
        
        .tab-label {
          display: none; /* 在小屏幕上只显示图标 */
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  .dashboard-main {
    grid-template-columns: 4fr 1fr;
    gap: 8px;
    padding: 8px;
  }
  
  .right-panel {
    gap: 8px;
  }
  
  .dashboard-header {
    .header-center .system-info .main-title {
      font-size: 22px;
    }
  }
  
  .panel-card {
    padding: 10px;
    
    .card-header {
      .title {
        font-size: 12px;
      }
    }
  }
}

@media (max-width: 1024px) {
  .dashboard-main {
    grid-template-columns: 5fr 2fr;
  }
  
  .panel-card .card-body .data-row {
    .label {
      font-size: 11px;
    }
    
    .value {
      font-size: 12px;
    }
  }
}

@media (max-width: 900px) {
  .dashboard-main {
    grid-template-columns: 2fr 1fr;
  }
  
  .panel-card {
    padding: 8px;
    
    .card-header .title {
      font-size: 11px;
    }
    
    .card-body .data-row {
      .label {
        font-size: 10px;
      }
      
      .value {
        font-size: 11px;
      }
    }
  }
}

@media (max-width: 768px) {
  .dashboard-main {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .right-panel {
    display: none;
  }
  
  .dashboard-header {
    padding: 0 15px;
    
    .header-right {
      width: auto;
      gap: 15px;
    }
    
    .header-center .system-info .main-title {
      font-size: 18px;
    }
  }
  
  .dropdown-menu {
    right: 15px;
  }
}

// 全屏模式样式
:deep(.cockpit-fullscreen) {
  .layout-header,
  .layout-sidebar,
  .breadcrumb-container,
  .tags-view {
    display: none !important;
  }
  
  .layout-main {
    left: 0 !important;
    top: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}

// 驾驶舱全屏模式
.dashboard-container.is-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999 !important;
  background: linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%) !important;
  
  // 全屏时调整内部布局
  .dashboard-main {
    padding: 20px !important;
    gap: 20px !important;
    height: calc(100vh - 120px) !important; // 减去header和footer的高度
  }
  
  .right-panel {
    // 全屏时右侧面板可以稍微窄一些
    max-width: 350px;
  }
  
  .center-panel {
    // 确保中央面板充分利用空间
    min-height: 100%;
  }
  
  // 全屏时的模块内容优化
  .module-content {
    height: calc(100vh - 200px) !important; // 优化高度计算
  }
}

// 为了确保在各种布局下都能正常工作
body.cockpit-fullscreen {
  overflow: hidden !important;
  
  .layout-container {
    .layout-header,
    .layout-sidebar,
    .breadcrumb-container,
    .tags-view {
      display: none !important;
    }
    
    .layout-main {
      left: 0 !important;
      top: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      padding: 0 !important;
      margin: 0 !important;
    }
  }
}
</style>