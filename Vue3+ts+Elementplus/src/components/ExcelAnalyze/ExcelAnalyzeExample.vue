<template>
  <div class="excel-analyze-example">
    <div class="example-header">
      <h2>Excel导入功能示例</h2>
      <p>演示Excel解析和错误处理功能</p>
    </div>

    <!-- 表格选择 -->
    <div class="table-selection">
      <el-card shadow="never">
        <template #header>
          <span>选择目标表</span>
        </template>
        
        <el-table 
          :data="tableConfigs" 
          @row-click="handleTableSelect"
          highlight-current-row
        >
          <el-table-column prop="tableLabel" label="表名称" width="200" />
          <el-table-column prop="moduleName" label="模块" width="150" />
          <el-table-column prop="importModes" label="导入模式" width="150" />
          <el-table-column prop="enableStatus" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.enableStatus === 1 ? 'success' : 'danger'" size="small">
                {{ row.enableStatus === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                size="small"
                @click.stop="openExcelAnalyze(row)"
                :disabled="row.enableStatus !== 1"
              >
                导入Excel
              </el-button>
              <el-button 
                type="info" 
                size="small"
                @click.stop="showTableInfo(row)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 错误处理演示 -->
    <div class="error-demo">
      <el-card shadow="never">
        <template #header>
          <span>错误处理演示</span>
        </template>
        
        <div class="demo-buttons">
          <el-button @click="simulateFileUploadError">
            模拟文件上传错误
          </el-button>
          <el-button @click="simulateFieldMatchingError">
            模拟字段匹配错误
          </el-button>
          <el-button @click="simulateDataValidationError">
            模拟数据验证错误
          </el-button>
          <el-button @click="simulateImportError">
            模拟导入错误
          </el-button>
          <el-button @click="simulateNetworkError">
            模拟网络错误
          </el-button>
          <el-button @click="showErrorStats">
            查看错误统计
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 导入历史 -->
    <div class="import-history">
      <el-card shadow="never">
        <template #header>
          <div class="history-header">
            <span>导入历史</span>
            <el-button size="small" @click="refreshHistory">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </template>
        
        <el-table :data="importHistory" empty-text="暂无导入记录">
          <el-table-column prop="fileName" label="文件名" width="200" />
          <el-table-column prop="tableName" label="目标表" width="150" />
          <el-table-column prop="totalRows" label="总行数" width="100" />
          <el-table-column prop="successRows" label="成功行数" width="100" />
          <el-table-column prop="errorRows" label="错误行数" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag 
                :type="getStatusTagType(row.status)" 
                size="small"
              >
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="导入时间" width="180" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button 
                type="text" 
                size="small"
                @click="viewImportDetail(row)"
              >
                查看详情
              </el-button>
              <el-button 
                v-if="row.errorRows > 0"
                type="text" 
                size="small"
                @click="downloadErrorReport(row)"
              >
                下载错误报告
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- Excel解析弹窗 -->
    <ExcelAnalyzeModal 
      v-model="showModal"
      :table-name="selectedTable.tableName"
      :table-label="selectedTable.tableLabel"
      @success="handleImportSuccess"
      @cancel="handleImportCancel"
      @import-error="handleImportError"
    />

    <!-- 表信息对话框 -->
    <el-dialog
      v-model="tableInfoVisible"
      title="表信息详情"
      width="600px"
    >
      <div v-if="selectedTableInfo">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="表名称">
            {{ selectedTableInfo.tableLabel }}
          </el-descriptions-item>
          <el-descriptions-item label="表代码">
            {{ selectedTableInfo.tableName }}
          </el-descriptions-item>
          <el-descriptions-item label="所属模块">
            {{ selectedTableInfo.moduleName }}
          </el-descriptions-item>
          <el-descriptions-item label="导入模式">
            {{ selectedTableInfo.importModes }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="selectedTableInfo.enableStatus === 1 ? 'success' : 'danger'" size="small">
              {{ selectedTableInfo.enableStatus === 1 ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ selectedTableInfo.createTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 错误统计对话框 -->
    <el-dialog
      v-model="errorStatsVisible"
      title="错误统计信息"
      width="700px"
    >
      <div class="error-stats">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-statistic
              title="总错误数"
              :value="errorStats.total"
              :precision="0"
            />
          </el-col>
          <el-col :span="8">
            <el-statistic
              title="文件上传错误"
              :value="errorStats.byType.FILE_UPLOAD_FAILED || 0"
              :precision="0"
            />
          </el-col>
          <el-col :span="8">
            <el-statistic
              title="数据验证错误"
              :value="errorStats.byType.DATA_VALIDATION_ERROR || 0"
              :precision="0"
            />
          </el-col>
        </el-row>

        <el-divider>最近错误</el-divider>
        
        <div class="recent-errors">
          <div 
            v-for="(error, index) in errorStats.recent"
            :key="index"
            class="error-item"
          >
            <el-alert
              :title="error.message"
              :type="getErrorAlertType(error.code)"
              :description="`错误代码: ${error.code}`"
              show-icon
              :closable="false"
            />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import ExcelAnalyzeModal from './ExcelAnalyzeModal.vue'
import { useExcelAnalyzeError } from '@/composables/useExcelAnalyzeError'
import { ERROR_CODES } from '@/utils/excelAnalyzeErrorHandler'

// 使用错误处理组合式函数
const {
  handleFileUploadError,
  handleFieldMatchingError,
  handleDataValidationError,
  handleImportError,
  handleError,
  getErrorStats,
  clearErrorHistory
} = useExcelAnalyzeError()

// 响应式数据
const showModal = ref(false)
const selectedTable = ref<any>({})
const tableInfoVisible = ref(false)
const selectedTableInfo = ref<any>(null)
const errorStatsVisible = ref(false)
const errorStats = ref<any>({ total: 0, byType: {}, recent: [] })

// 表格配置数据
const tableConfigs = ref([
  {
    tableName: 'sys_user',
    tableLabel: '系统用户',
    moduleName: '系统管理',
    importModes: '插入,更新',
    enableStatus: 1,
    createTime: '2024-01-01 10:00:00'
  },
  {
    tableName: 'sys_role',
    tableLabel: '系统角色',
    moduleName: '系统管理',
    importModes: '插入',
    enableStatus: 1,
    createTime: '2024-01-01 10:00:00'
  },
  {
    tableName: 'sys_dept',
    tableLabel: '部门信息',
    moduleName: '组织管理',
    importModes: '插入,更新,删除',
    enableStatus: 0,
    createTime: '2024-01-01 10:00:00'
  }
])

// 导入历史数据
const importHistory = ref([
  {
    fileName: '用户数据.xlsx',
    tableName: 'sys_user',
    totalRows: 100,
    successRows: 95,
    errorRows: 5,
    status: 'success',
    createTime: '2024-01-15 14:30:00'
  },
  {
    fileName: '角色数据.xlsx',
    tableName: 'sys_role',
    totalRows: 20,
    successRows: 20,
    errorRows: 0,
    status: 'success',
    createTime: '2024-01-15 15:00:00'
  },
  {
    fileName: '部门数据.xlsx',
    tableName: 'sys_dept',
    totalRows: 50,
    successRows: 0,
    errorRows: 50,
    status: 'failed',
    createTime: '2024-01-15 15:30:00'
  }
])

// 方法
const handleTableSelect = (row: any) => {
  selectedTable.value = row
}

const openExcelAnalyze = (tableConfig: any) => {
  selectedTable.value = tableConfig
  showModal.value = true
}

const showTableInfo = (tableConfig: any) => {
  selectedTableInfo.value = tableConfig
  tableInfoVisible.value = true
}

const handleImportSuccess = (result: any) => {
  ElMessage.success(`成功导入 ${result.successRows} 条数据`)
  
  // 添加到导入历史
  importHistory.value.unshift({
    fileName: result.fileName || '未知文件',
    tableName: selectedTable.value.tableName,
    totalRows: result.totalRows || 0,
    successRows: result.successRows || 0,
    errorRows: result.errorRows || 0,
    status: 'success',
    createTime: new Date().toLocaleString()
  })
  
  refreshHistory()
}

const handleImportCancel = () => {
  ElMessage.info('已取消导入')
}

const handleImportError = (error: any) => {
  console.error('导入失败:', error)
  
  // 添加到导入历史
  importHistory.value.unshift({
    fileName: error.fileName || '未知文件',
    tableName: selectedTable.value.tableName,
    totalRows: error.totalRows || 0,
    successRows: error.successRows || 0,
    errorRows: error.errorRows || 0,
    status: 'failed',
    createTime: new Date().toLocaleString()
  })
}

const refreshHistory = () => {
  // 模拟刷新历史数据
  ElMessage.success('历史记录已刷新')
}

const viewImportDetail = (record: any) => {
  ElMessageBox.alert(
    `文件: ${record.fileName}\n总行数: ${record.totalRows}\n成功: ${record.successRows}\n失败: ${record.errorRows}`,
    '导入详情',
    { confirmButtonText: '确定' }
  )
}

const downloadErrorReport = (record: any) => {
  ElMessage.success('错误报告下载功能待实现')
}

const getStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    'success': 'success',
    'failed': 'danger',
    'processing': 'warning'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'success': '成功',
    'failed': '失败',
    'processing': '处理中'
  }
  return textMap[status] || status
}

const getErrorAlertType = (errorCode: string) => {
  if (errorCode.includes('FILE')) return 'warning'
  if (errorCode.includes('DATA')) return 'error'
  if (errorCode.includes('NETWORK')) return 'info'
  return 'error'
}

// 错误演示方法
const simulateFileUploadError = () => {
  const mockFile = new File([''], 'test.txt', { type: 'text/plain' })
  const error = new Error('文件格式不支持')
  handleFileUploadError(error, mockFile)
}

const simulateFieldMatchingError = () => {
  const error = new Error('必填字段缺失')
  handleFieldMatchingError(error, {
    missingFields: ['姓名', '手机号码'],
    duplicateHeaders: ['性别']
  })
}

const simulateDataValidationError = () => {
  const error = new Error('数据验证失败')
  handleDataValidationError(error, {
    errorRows: [1, 3, 5, 7],
    errorFields: ['手机号码', '邮箱地址']
  })
}

const simulateImportError = () => {
  const error = new Error('导入权限不足')
  handleImportError(error, {
    processedRows: 50,
    totalRows: 100
  })
}

const simulateNetworkError = () => {
  const error = new Error('网络连接超时')
  error.name = 'NetworkError'
  handleError(error, 'network_simulation', {
    showMessage: true,
    showNotification: true
  })
}

const showErrorStats = () => {
  errorStats.value = getErrorStats()
  errorStatsVisible.value = true
}

// 生命周期
onMounted(() => {
  // 初始化数据
  console.log('Excel分析示例页面已加载')
})
</script>

<style scoped lang="scss">
.excel-analyze-example {
  padding: 20px;
  
  .example-header {
    margin-bottom: 20px;
    text-align: center;
    
    h2 {
      margin: 0 0 10px 0;
      color: #303133;
    }
    
    p {
      margin: 0;
      color: #606266;
    }
  }
  
  .table-selection,
  .error-demo,
  .import-history {
    margin-bottom: 20px;
  }
  
  .demo-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    .el-button {
      margin: 0;
    }
  }
  
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .error-stats {
    .recent-errors {
      .error-item {
        margin-bottom: 10px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .excel-analyze-example {
    padding: 10px;
    
    .demo-buttons {
      flex-direction: column;
      
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>