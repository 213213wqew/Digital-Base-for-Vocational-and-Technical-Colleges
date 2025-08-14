<template>
  <div class="data-import-page">
    <div class="page-header">
      <h1>Excel数据导入高级匹配验证</h1>
      <p>选择要导入的数据表，系统将提供智能字段匹配和数据验证功能</p>
    </div>

    <!-- 表格选择区域 -->
    <div class="table-selection-section">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>选择导入目标表</span>
            <el-button type="text" @click="refreshTableConfigs">
              <el-icon>
                <Refresh />
              </el-icon>
              刷新配置
            </el-button>
          </div>
        </template>

        <!-- 搜索和筛选 -->
        <div class="filter-section">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input v-model="searchKeyword" placeholder="搜索表名或模块" clearable @input="handleSearch">
                <template #prefix>
                  <el-icon>
                    <Search />
                  </el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-select v-model="selectedModule" placeholder="选择模块" clearable @change="handleModuleFilter">
                <el-option v-for="module in moduleOptions" :key="module" :label="module" :value="module" />
              </el-select>
            </el-col>
          </el-row>
        </div>

        <!-- 表格列表 -->
        <el-table :data="filteredTables" empty-text="暂无可用的导入配置" v-loading="loading" @row-click="handleRowClick"
          class="table-list">
          <el-table-column label="序号" width="55" type="index" align="center" />
          <el-table-column prop="tableLabel" label="表名称" min-width="200">
            <template #default="{ row }">
              <div class="table-name-cell">
                <el-icon size="20" :color="getTableIconColor(row.moduleName)">
                  <component :is="getTableIcon(row.moduleName)" />
                </el-icon>
                <span class="table-label">{{ row.tableLabel }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="tableName" label="表标识" width="180" />
          <el-table-column prop="moduleName" label="所属模块" width="120">
            <template #default="{ row }">
              <el-tag size="small" :type="getModuleTagType(row.moduleName)">
                {{ row.moduleName }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip /> -->
          <el-table-column prop="fieldCount" label="字段数" width="80" align="center" />
          <el-table-column prop="lastImportTime" label="最近导入" width="150" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click.stop="openImportDialog(row)">
                <el-icon>
                  <Upload />
                </el-icon>
                开始导入
              </el-button>
              <el-button type="text" size="small" @click.stop="viewTableConfig(row)">
                查看配置
              </el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- Excel导入弹窗 -->
    <ExcelAnalyzeModal 
      ref="importModalRef"
      v-model="showImportDialog"
      :table-name="selectedTable.tableName"
      :table-label="selectedTable.tableLabel" 
      :config="selectedTable" 
      @import-success="handleImportSuccess"
      @import-error="handleImportError"
      @refresh-data="handleRefreshData"
    />

    <!-- 表配置详情对话框 -->
    <el-dialog v-model="configDialogVisible" title="表配置详情" width="800px">
      <div v-if="selectedTableConfig" class="config-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="表名称">
            {{ selectedTableConfig.tableLabel }}
          </el-descriptions-item>
          <el-descriptions-item label="表标识">
            {{ selectedTableConfig.tableName }}
          </el-descriptions-item>
          <el-descriptions-item label="所属模块">
            {{ selectedTableConfig.moduleName }}
          </el-descriptions-item>
          <el-descriptions-item label="导入模式">
            {{ selectedTableConfig.importMode }}
          </el-descriptions-item>
          <el-descriptions-item label="字段数量">
            {{ selectedTableConfig.fieldCount }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="selectedTableConfig.status === 1 ? 'success' : 'danger'">
              {{ selectedTableConfig.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">
            {{ selectedTableConfig.description || '无' }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 字段配置列表 -->
        <div class="field-config-section">
          <h4>字段配置</h4>
          <el-table :data="selectedTableConfig.fieldConfigs" max-height="400">
            <el-table-column label="序号" width="55" type="index" align="center" />
            <el-table-column prop="fieldName" label="字段名" width="120" />
            <el-table-column prop="fieldLabel" label="字段标签" width="120" />
            <el-table-column prop="fieldType" label="类型" width="80" />
            <el-table-column prop="isRequired" label="必填" width="60" align="center">
              <template #default="{ row }">
                <el-tag :type="row.isRequired ? 'danger' : 'info'" size="small">
                  {{ row.isRequired ? '是' : '否' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dictType" label="字典类型" width="100" />
            <el-table-column prop="defaultValue" label="默认值" width="100" />
            <el-table-column prop="validationRules" label="验证规则" min-width="150" show-overflow-tooltip />
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Refresh,
  Upload,
  Search,
  User,
  Setting,
  DataBoard,
  Document,
  Coin
} from '@element-plus/icons-vue'
import ExcelAnalyzeModal from '@/components/ExcelAnalyze/ExcelAnalyzeModal.vue'
import { excelAnalyzeApi } from '@/api/excelAnalyze'
import type { ImportConfigVO } from '@/api/excelAnalyze'
// 移除未使用的导入

// 响应式数据
const loading = ref(false)
const showImportDialog = ref(false)
const selectedTable = ref<any>({})
const configDialogVisible = ref(false)
const selectedTableConfig = ref<any>(null)
const importModalRef = ref() // 弹窗组件引用

// 搜索和筛选
const searchKeyword = ref('')
const selectedModule = ref('')

// 移除未使用的远程搜索相关变量

// 表格配置数据
const tableConfigs = ref<ImportConfigVO[]>([])

// 计算属性
const enabledTables = computed(() => {
  // 暂时显示所有表，不进行状态过滤，以便调试
  return tableConfigs.value
  // return tableConfigs.value.filter(table => table.status === 1)
})

const moduleOptions = computed(() => {
  const modules = new Set(enabledTables.value.map(table => table.moduleName))
  return Array.from(modules)
})

const filteredTables = computed(() => {
  let filtered = enabledTables.value

  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(table =>
      table.tableLabel.toLowerCase().includes(keyword) ||
      table.tableName.toLowerCase().includes(keyword) ||
      table.moduleName.toLowerCase().includes(keyword)
    )
  }

  // 模块过滤
  if (selectedModule.value) {
    filtered = filtered.filter(table => table.moduleName === selectedModule.value)
  }

  return filtered
})

// 方法
const getTableIcon = (moduleName: string) => {
  const iconMap: Record<string, any> = {
    '系统管理': User,
    '组织管理': Setting,
    '数据管理': DataBoard,
    '内容管理': Document,
    '财务管理': Coin,
    'zygxx': DataBoard,  // 添加实际的模块名映射
    'system': User,
    'data': DataBoard
  }
  return iconMap[moduleName] || Document
}

const getTableIconColor = (moduleName: string) => {
  const colorMap: Record<string, string> = {
    '系统管理': '#409eff',
    '组织管理': '#67c23a',
    '数据管理': '#e6a23c',
    '内容管理': '#f56c6c',
    '财务管理': '#909399'
  }
  return colorMap[moduleName] || '#409eff'
}

const getStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    'success': 'success',
    'failed': 'danger',
    'processing': 'warning',
    'cancelled': 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'success': '成功',
    'failed': '失败',
    'processing': '处理中',
    'cancelled': '已取消'
  }
  return textMap[status] || status
}

const getModuleTagType = (moduleName: string) => {
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    '系统管理': 'primary',
    '组织管理': 'success',
    '数据管理': 'warning',
    '内容管理': 'danger',
    '财务管理': 'info'
  }
  return typeMap[moduleName] || 'primary'
}

// 移除未使用的远程搜索方法

const loadTableConfigs = async () => {
  try {
    loading.value = true
    const configs = await excelAnalyzeApi.getImportConfigs()
    console.log(configs);

    tableConfigs.value = configs
  } catch (error) {
    console.error('加载表配置失败:', error)
    ElMessage.error('加载表配置失败')
  } finally {
    loading.value = false
  }
}

const refreshTableConfigs = async () => {
  await loadTableConfigs()
  ElMessage.success('表配置已刷新')
}

const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理，这里不需要额外的API调用
}

const handleModuleFilter = () => {
  // 筛选逻辑已在计算属性中处理
}

const handleRowClick = (row: ImportConfigVO) => {
  // 可以在这里添加行点击逻辑，比如显示详情
}

const openImportDialog = (table: ImportConfigVO) => {
  selectedTable.value = table
  
  // 重置弹窗组件状态
  if (importModalRef.value?.resetModal) {
    importModalRef.value.resetModal()
  }
  
  // 打开弹窗
  showImportDialog.value = true
}

const viewTableConfig = async (table: ImportConfigVO) => {
  try {
    // 这里可以调用API获取详细的字段配置信息
    // const fieldConfigs = await excelAnalyzeApi.getFieldConfigs(table.tableName)

    // 模拟字段配置数据
    const mockFieldConfigs = [
      {
        fieldName: 'username',
        fieldLabel: '用户名',
        fieldType: 'VARCHAR',
        isRequired: true,
        dictType: '',
        defaultValue: '',
        validationRules: '{"minLength": 3, "maxLength": 20}'
      },
      {
        fieldName: 'email',
        fieldLabel: '邮箱',
        fieldType: 'VARCHAR',
        isRequired: true,
        dictType: '',
        defaultValue: '',
        validationRules: '{"pattern": "email"}'
      },
      {
        fieldName: 'status',
        fieldLabel: '状态',
        fieldType: 'INT',
        isRequired: false,
        dictType: 'user_status',
        defaultValue: '1',
        validationRules: '{"enum": [0, 1]}'
      }
    ]

    selectedTableConfig.value = {
      ...table,
      fieldConfigs: mockFieldConfigs
    }
    configDialogVisible.value = true
  } catch (error) {
    console.error('获取表配置详情失败:', error)
    ElMessage.error('获取表配置详情失败')
  }
}



const handleImportSuccess = (result: any) => {
  ElMessage.success(`成功导入 ${result.successRows} 条数据`)
  // 可以在这里添加刷新表格数据或其他后续处理
}

const handleImportError = (error: any) => {
  console.error('导入失败:', error)
  ElMessage.error(`导入失败: ${error.message || '未知错误'}`)
}

const handleRefreshData = () => {
  // 刷新表格数据
  loadTableConfigs()
  ElMessage.success('数据列表已刷新')
}

// 生命周期
onMounted(async () => {
  await loadTableConfigs()
})
</script>

<style scoped lang="scss">
.data-import-page {
  padding: 20px;

  .page-header {
    margin-bottom: 30px;
    text-align: center;

    h1 {
      margin: 0 0 10px 0;
      color: #303133;
      font-size: 28px;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: #606266;
      font-size: 16px;
    }
  }

  .table-selection-section {
    margin-bottom: 30px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .filter-section {
    margin-bottom: 20px;
    padding: 20px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .table-list {
    .table-name-cell {
      display: flex;
      align-items: center;
      gap: 10px;

      .table-label {
        font-weight: 500;
        color: #303133;
      }
    }

    .el-table__row {
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }

  .config-detail {
    .field-config-section {
      margin-top: 20px;

      h4 {
        margin: 0 0 15px 0;
        color: #303133;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 1px solid #e4e7ed;
        padding-bottom: 10px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .data-import-page {
    padding: 10px;

    .filter-section {
      .el-row {
        .el-col {
          margin-bottom: 10px;
        }
      }
    }

    .table-list {
      .el-table__column {
        &.is-hidden {
          display: none;
        }
      }
    }
  }
}

// 表格行悬停效果
:deep(.el-table__row:hover > td) {
  background-color: #f5f7fa !important;
}

// 按钮组样式优化
:deep(.el-button-group) {
  .el-button {
    margin-left: 0;

    &:not(:first-child) {
      margin-left: -1px;
    }
  }
}

// 下拉选项样式
:deep(.table-option) {
  .table-name {
    font-weight: 600;
    color: #303133;
    margin-bottom: 4px;
  }

  .table-info {
    display: flex;
    align-items: center;
    font-size: 12px;

    .table-desc {
      color: #909399;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>