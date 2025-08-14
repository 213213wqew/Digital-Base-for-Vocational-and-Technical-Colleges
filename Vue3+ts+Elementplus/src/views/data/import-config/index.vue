<template>
  <div class="center-container">
    <div class="page-header">
      <h2>通用导入功能配置管理</h2>
      <p class="page-description">
        管理98个数据表的Excel导入配置，支持智能字段匹配和高级配置
      </p>
    </div>
    <el-row :gutter="32" class="main-row">
      <!-- 左侧：快速操作 + 系统统计 -->
      <el-col :xs="24" :md="8">
        <el-card class="feature-card">
          <template #header>
            <div class="card-header">
              <span>快速操作</span>
            </div>
          </template>
          <div class="feature-list">
            <div class="feature-list-item">
              <el-icon class="feature-icon"><Setting /></el-icon>
              <div class="feature-info">
                <div class="feature-title">配置管理</div>
                <div class="feature-desc">管理导入配置、字段定义、匹配规则</div>
              </div>
              <el-button type="primary" @click="goToConfig">进入配置</el-button>
            </div>
            <div class="feature-list-item">
              <el-icon class="feature-icon"><Document /></el-icon>
              <div class="feature-info">
                <div class="feature-title">使用示例</div>
                <div class="feature-desc">查看通用导入组件的使用方法和示例</div>
              </div>
              <el-button type="success" @click="showExample">查看示例</el-button>
            </div>
            <div class="feature-list-item">
              <el-icon class="feature-icon"><DataAnalysis /></el-icon>
              <div class="feature-info">
                <div class="feature-title">导入日志</div>
                <div class="feature-desc">查看导入历史记录和统计信息</div>
              </div>
              <el-button type="warning" @click="goToLogs">查看日志</el-button>
            </div>
          </div>
        </el-card>
        <el-card class="stats-card">
          <template #header>
            <div class="card-header">
              <span>系统统计</span>
            </div>
          </template>
          <el-row :gutter="32" justify="center">
            <el-col :xs="12" :sm="6">
              <div class="stat-item">
                <div class="stat-number">{{ stats.totalTables }}</div>
                <div class="stat-label">总表数</div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-item">
                <div class="stat-number">{{ stats.configuredTables }}</div>
                <div class="stat-label">已配置</div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-item">
                <div class="stat-number">{{ stats.enabledTables }}</div>
                <div class="stat-label">已启用</div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-item">
                <div class="stat-number">{{ stats.todayImports }}</div>
                <div class="stat-label">今日导入</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <!-- 右侧：快速测试 -->
      <el-col :xs="24" :md="16">
        <el-card class="test-card">
          <template #header>
            <div class="card-header">
              <span>快速测试</span>
            </div>
          </template>
          <div class="test-content">
            <p>选择一个表进行导入功能测试：</p>
            <div class="test-row">
              <el-select
                v-model="testTableName"
                filterable
                remote
                reserve-keyword
                placeholder="请选择测试表"
                @change="handleTableChange"
                :remote-method="fetchTableOptions"
                :loading="tableLoading"
                style="width: 300px; margin-right: 20px;"
              >
                <el-option
                  v-for="item in tableOptions"
                  :key="item.tableName"
                  :label="item.tableLabel + '（' + item.tableName + '）'"
                  :value="item.tableName"
                />
              </el-select>
              <el-button type="primary" @click="testImport" :disabled="!testTableName">
                开始导入
              </el-button>
              <el-button
                type="primary"
                @click="handleDownloadTemplate(testTableName)"
                :disabled="!testTableName"
                style="margin-left: 12px;"
              >
                下载导入模板
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 通用导入组件 -->
    <UniversalImportDialog
      ref="importRef"
      :table-name="testTableName"
      :title="`${getTableLabel(testTableName)} - 智能导入测试`"
      height="1800px"
      @success="handleImportSuccess"
      @error="handleImportError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Setting, Document, DataAnalysis } from '@element-plus/icons-vue'
import UniversalImportDialog from '@/components/CommonImport/UniversalImportDialog.vue'
import { CommonImportAPI } from '@/api-data/data/data_base/common/import'

// 响应式数据
const testTableName = ref('')
const tableChineseName = ref('')
const importRef = ref()

// 远程表选项
const tableOptions = ref<any[]>([])
const tableLoading = ref(false)

const fetchTableOptions = async (query: string) => {
  if (!query) {
    tableOptions.value = []
    return
  }
  tableLoading.value = true
  try {
    const res = await CommonImportAPI.getTableNames(query) as any
    tableOptions.value = res.data || []
  } finally {
    tableLoading.value = false
  }
}

// 统计数据
const stats = reactive({
  totalTables: 98,
  configuredTables: 3,
  enabledTables: 3,
  todayImports: 0
})

// 方法
const goToConfig = () => {
  ElMessage.info('配置管理功能开发中...')
}

const showExample = () => {
  ElMessage.info('使用示例功能开发中...')
}

const goToLogs = () => {
  ElMessage.info('导入日志功能开发中...')
}

const testImport = () => {
  if (!testTableName.value) {
    ElMessage.warning('请先选择测试表')
    return
  }
  importRef.value?.open()
}

const handleImportSuccess = (result: any) => {
  ElMessage.success(`测试导入成功！成功导入 ${result.successRows} 条数据`)
  console.log('导入结果:', result)
}

const handleImportError = (error: any) => {
  ElMessage.error(`测试导入失败：${error.message}`)
  console.error('导入错误:', error)
}

const handleDownloadTemplate = async (tableName: string) => {
  if (!tableName) {
    ElMessage.warning('请先选择表')
    return
  }
  try {
    await CommonImportAPI.downloadFieldTemplate(tableName, tableChineseName.value)
    ElMessage.success('模板下载成功')
  } catch (e) {
    ElMessage.error('模板下载失败')
  }
}

const getTableLabel = (tableName: string) => {
  const table = tableOptions.value.find(item => item.tableName === tableName)
  if (table) return table.tableLabel + '（' + table.tableName + '）'
  return tableName
}
const handleTableChange = (value: string) => {
  const table = tableOptions.value.find(item => item.tableName === value)
  if (table) {
    tableChineseName.value = table.tableLabel
  }
}

// 生命周期
onMounted(() => {
  // 加载统计数据
  loadStats()
  })

const loadStats = () => {
  // 这里可以调用API获取真实的统计数据
  // 目前使用模拟数据
}
</script>

<style lang="scss" scoped>
.center-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 24px 0;
  background: #F5F7FA;
}
.main-row {
  align-items: flex-start;
}
.page-header {
  margin-bottom: 18px;
  text-align: center;
  h2 {
    font-size: 36px;
    font-weight: 800;
    color: #2B4C7E;
    margin-bottom: 6px;
    letter-spacing: 2px;
  }
  .page-description {
    color: #A0AEC0;
    font-size: 16px;
    font-weight: 400;
  }
}
.feature-card, .stats-card, .test-card {
  border-radius: 12px;
  border: 1px solid #E5EAF3;
  box-shadow: 0 2px 8px 0 rgba(43,76,126,0.04);
  background: #fff;
  margin-bottom: 16px;
}
.stats-card, .test-card {
  padding: 12px 0 12px 0;
}
.feature-item {
  border: none;
  box-shadow: none;
  .feature-content {
    .feature-icon {
      color: #2B4C7E;
      font-size: 44px;
      margin-bottom: 12px;
    }
    h3 {
      font-size: 18px;
      font-weight: 700;
      color: #2B4C7E;
    }
    p {
      color: #A0AEC0;
      font-size: 14px;
      margin-bottom: 18px;
    }
    .el-button {
      background: #2B4C7E;
      border: none;
      color: #fff;
      font-weight: 600;
      border-radius: 6px;
      min-width: 96px;
      transition: background 0.2s;
    }
    .el-button:hover {
      background: #1A3254;
    }
  }
}
.stats-card .stat-number {
  color: #2B4C7E;
  font-size: 40px;
  font-weight: 800;
}
.stats-card .stat-label {
  color: #A0AEC0;
  font-size: 14px;
}
.test-card .el-button {
  background: #2B4C7E;
  border: none;
  color: #fff;
  font-weight: 600;
  border-radius: 6px;
}
.test-card .el-button:hover {
  background: #1A3254;
}
.test-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  .el-select {
    min-width: 220px;
  }
  .el-button {
    min-width: 120px;
    border-radius: 6px;
  }
}
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  .feature-list-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 6px 0;
    .feature-icon {
      font-size: 32px;
      color: #2B4C7E;
    }
    .feature-info {
      flex: 1;
      .feature-title {
        font-size: 16px;
        font-weight: 700;
        color: #2B4C7E;
      }
      .feature-desc {
        font-size: 13px;
        color: #A0AEC0;
      }
    }
    .el-button {
      min-width: 80px;
      height: 32px;
      font-size: 14px;
      border-radius: 6px;
    }
  }
}
@media (max-width: 900px) {
  .main-row {
    flex-direction: column;
  }
  .feature-card, .stats-card, .test-card {
    margin-bottom: 20px;
  }
  .feature-item {
    height: 180px !important;
  }
  .stat-item {
    padding: 12px 0 8px 0 !important;
    .stat-number {
      font-size: 30px !important;
    }
    .stat-label {
      font-size: 13px !important;
    }
  }
}
</style> 