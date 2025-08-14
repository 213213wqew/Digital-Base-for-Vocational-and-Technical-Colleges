<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <div class="excel-analyze-container">
      <!-- 表名信息区域 -->
      <div class="table-info-header">
        <el-card shadow="never" class="table-info-card">
          <div class="table-info-content">
            <div class="table-info-left">
              <el-icon size="24" color="#409eff">
                <Document />
              </el-icon>
              <div class="table-info-text">
                <div class="table-name">{{ props.tableLabel || props.tableName }}</div>
                <div class="table-identifier">表标识：{{ props.tableName }}</div>
              </div>
            </div>
            <div class="table-info-right">
              <el-tag type="primary" size="large">
                当前步骤：{{ getCurrentStepText() }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 步骤导航 -->
      <el-steps
        :active="currentStep"
        finish-status="success"
        align-center
        class="steps-container"
      >
        <el-step title="文件上传" description="上传Excel文件" />
        <el-step title="字段匹配" description="智能匹配字段" />
        <el-step title="数据预览" description="预览转换结果" />
        <el-step title="确认导入" description="确认并导入数据" />
      </el-steps>

      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 文件上传步骤 -->
        <FileUploadStep
          ref="fileUploadStepRef"
          v-if="currentStep === 0"
          :table-name="tableName"
          :table-label="tableLabel"
          @upload-success="handleUploadSuccess"
          @next-step="nextStep"
        />

        <!-- 字段匹配步骤 -->
        <FieldMatchingStep
          ref="fieldMatchingStepRef"
          v-if="currentStep === 1"
          :session-id="sessionId"
          :table-name="tableName"
          :excel-headers="excelHeaders"
          @matching-complete="handleMatchingComplete"
          @next-step="nextStep"
          @prev-step="prevStep"
        />

        <!-- 数据预览步骤 -->
        <DataPreviewStep
          ref="dataPreviewStepRef"
          v-if="currentStep === 2"
          :session-id="sessionId"
          :field-mappings="fieldMappings"
          :table-name="tableName"
          @preview-complete="handlePreviewComplete"
          @next-step="nextStep"
          @prev-step="prevStep"
        />

        <!-- 确认导入步骤 -->
        <ImportConfirmStep
          ref="importConfirmStepRef"
          v-if="currentStep === 3"
          :session-id="sessionId"
          :import-summary="importSummary"
          :table-name="tableName"
          :table-label="tableLabel"
          :subset-code="subsetCode"
          @import-complete="handleImportComplete"
          @prev-step="prevStep"
          @view-imported-data="handleViewImportedData"
          @go-to-target-page="handleGoToTargetPage"
        />
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <div class="footer-left">
          <el-button
            type="info"
            text
            @click="showUserGuide = true"
          >
            <el-icon><QuestionFilled /></el-icon>
            使用帮助
          </el-button>
        </div>
        <div class="footer-right">
          <el-button @click="handleClose">取消</el-button>
          <el-button
            v-if="currentStep > 0"
            @click="prevStep"
            :disabled="processing"
          >
            上一步
          </el-button>
          <el-button
            v-if="currentStep < 3"
            type="primary"
            @click="nextStep"
            :disabled="!canNextStep || processing"
            :loading="processing"
          >
            下一步
          </el-button>
          <el-button
            v-if="currentStep === 3"
            type="success"
            @click="handleConfirmImport"
            :disabled="!canConfirmImport || processing"
            :loading="processing"
          >
            确认导入
          </el-button>
        </div>
      </div>
    </template>

    <!-- 用户指南对话框 -->
    <el-dialog
      v-model="showUserGuide"
      title="Excel导入使用指南"
      width="900px"
      :append-to-body="true"
    >
      <UserGuide />
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { QuestionFilled, Document } from '@element-plus/icons-vue'
import { useMenuStore } from '@/store/modules/menu'
import FileUploadStep from './steps/FileUploadStep.vue'
import FieldMatchingStep from './steps/FieldMatchingStep.vue'
import DataPreviewStep from './steps/DataPreviewStep.vue'
import ImportConfirmStep from './steps/ImportConfirmStep.vue'
import UserGuide from './UserGuide.vue'
import { ExcelAnalyzeErrorHandler } from '@/utils/excelAnalyzeErrorHandler'
import type { ExcelAnalyzeError } from '@/utils/excelAnalyzeErrorHandler'
import { excelAnalyzeApi } from '@/api/excelAnalyze'

// 组件属性
interface Props {
  modelValue: boolean
  tableName: string
  tableLabel?: string
}

// 组件事件
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'import-success', data: any): void
  (e: 'import-error', error: any): void
  (e: 'refresh-data'): void
}

const props = withDefaults(defineProps<Props>(), {
  tableLabel: ''
})

const emit = defineEmits<Emits>()
const router = useRouter()
const menuStore = useMenuStore()

// 响应式数据
const visible = ref(false)
const currentStep = ref(0)
const processing = ref(false)
const globalError = ref<ExcelAnalyzeError | null>(null)
const showUserGuide = ref(false)

// 子组件引用
const fileUploadStepRef = ref()
const fieldMatchingStepRef = ref()
const dataPreviewStepRef = ref()
const importConfirmStepRef = ref()

// 步骤数据类型声明
interface FieldMapping {
  matchedField: string;
  fieldInfo?: {
    fieldLabel?: string;
    fieldType?: string;
  };
}
interface ImportSummary {
  statistics?: {
    totalRows: number;
    validRows: number;
    errorRows: number;
    warningRows: number;
  };
  [key: string]: any;
}

// 步骤数据
const sessionId = ref<string>('')
const excelHeaders = ref<any[]>([])
const fieldMappings = ref<FieldMapping[]>([])
const importSummary = ref<ImportSummary>({})
const subsetCode = ref<string>('')

// 步骤状态
const stepStates = ref({
  uploadComplete: false,
  matchingComplete: false,
  previewComplete: false,
  importComplete: false
})

// 计算属性
const dialogTitle = computed(() => {
  const stepTitles = ['上传Excel文件', '字段匹配', '数据预览', '确认导入']
  return `Excel导入 - ${stepTitles[currentStep.value]} (${props.tableLabel || props.tableName})`
})

// 获取当前步骤文本
const getCurrentStepText = () => {
  const stepTitles = ['文件上传', '字段匹配', '数据预览', '确认导入']
  return stepTitles[currentStep.value] || '未知步骤'
}

const canNextStep = computed(() => {
  switch (currentStep.value) {
    case 0:
      return stepStates.value.uploadComplete
    case 1:
      return stepStates.value.matchingComplete
    case 2:
      return stepStates.value.previewComplete
    default:
      return false
  }
})

const canConfirmImport = computed(() => {
  return stepStates.value.previewComplete && !processing.value
})

// 监听器
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    resetModal()
  }
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

// 方法
const resetModal = () => {
  currentStep.value = 0
  processing.value = false
  sessionId.value = ''
  excelHeaders.value = []
  fieldMappings.value = []
  importSummary.value = {}
  stepStates.value = {
    uploadComplete: false,
    matchingComplete: false,
    previewComplete: false,
    importComplete: false
  }
  
  // 重置子组件状态（只重置有重置方法的组件）
  fileUploadStepRef.value?.resetUpload?.()
}

const nextStep = () => {
  if (currentStep.value < 3 && canNextStep.value) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleClose = () => {
  if (processing.value) {
    ElMessage.warning('正在处理中，请稍候...')
    return
  }
  
  visible.value = false
  resetModal()
}

// 步骤事件处理
const handleUploadSuccess = async (data: any) => {
  sessionId.value = data.sessionId
  excelHeaders.value = data.headers || []
  // 保存文件信息
  importSummary.value = {
    fileName: data.fileName,
    filePath: data.filePath,
    fileSize: data.fileSize,
    totalRows: data.totalRows,
    totalColumns: data.totalColumns,
    uploadTime: data.uploadTime
  }
  stepStates.value.uploadComplete = true
  ElMessage.success('文件上传成功')
  
  // 获取子集代码
  await getSubsetCode()
}

const handleMatchingComplete = (mappings: any[]) => {
  fieldMappings.value = mappings
  stepStates.value.matchingComplete = true
  ElMessage.success('字段匹配完成')
}

const handlePreviewComplete = (summary: any) => {
  // 保留原有的文件信息，添加预览信息
  importSummary.value = {
    ...importSummary.value, // 保留文件信息
    ...summary, // 添加预览信息
    previewComplete: true
  }
  stepStates.value.previewComplete = true
  ElMessage.success('数据预览完成')
}

const handleConfirmImport = async () => {
  try {
    processing.value = true
    // 这里会在ImportConfirmStep组件中处理实际的导入逻辑
    // 当前只是触发子组件的导入方法
  } catch (error) {
    console.error('导入确认失败:', error)
    ElMessage.error('导入确认失败')
  } finally {
    processing.value = false
  }
}

// 获取子集代码
const getSubsetCode = async () => {
  // 从会话中获取子集代码
  if (sessionId.value) {
    try {
      const sessionInfo = await excelAnalyzeApi.getSessionInfo(sessionId.value)
      subsetCode.value = sessionInfo.subsetCode || ''
    } catch (error) {
      console.warn('获取会话信息失败:', error)
      subsetCode.value = ''
    }
  } else {
    subsetCode.value = ''
  }
}

const handleImportComplete = (result: any) => {
  stepStates.value.importComplete = true
  processing.value = false
  
  if (result.success) {
    ElMessage.success(`导入完成！成功导入 ${result.successCount} 条数据`)
    emit('import-success', result)
    
    // 检查是否需要刷新数据
    if (result.refreshData) {
      // 触发刷新数据事件
      emit('refresh-data')
    }
    
    // 检查是否需要关闭弹窗
    if (result.closeModal || result.action === 'continue_import') {
      visible.value = false
      resetModal()
    }
  } else {
    // 使用错误处理器处理导入失败
    const importError = ExcelAnalyzeErrorHandler.handleImportError(
      new Error(result.message || '导入失败'),
      {
        processedRows: result.processedRows,
        totalRows: result.totalRows
      }
    )
    
    ExcelAnalyzeErrorHandler.showError(importError)
    emit('import-error', result)
  }
}

// 查看导入的数据
const handleViewImportedData = (data: any) => {
  const { tableName, sessionId, importResult } = data
  
  // 构建路由地址：/data/data_manage/+子集+/+表名（以/开头，不包含/index）
  const targetPath = buildTargetPath(tableName)
  
  ElMessage.info(`即将跳转到 ${targetPath}`)
  
  // 确保菜单状态同步
  ensureMenuSync(targetPath)
  
  // 延迟执行路由跳转，确保菜单状态更新
  setTimeout(() => {
    router.push(targetPath).then(() => {
      console.log('✅ 路由跳转成功:', targetPath)
    }).catch((error) => {
      console.error('❌ 路由跳转失败:', error)
      ElMessage.error('页面跳转失败，请手动导航')
    })
  }, 100)
  
  // 关闭弹窗
  visible.value = false
  resetModal()
}

// 跳转到目标页面
const handleGoToTargetPage = (data: any) => {
  const { tableName, sessionId, importResult } = data
  
  // 构建路由地址：/data/data_manage/+子集+/+表名（以/开头，不包含/index）
  const targetPath = buildTargetPath(tableName)
  
  ElMessage.success(`正在跳转到 ${targetPath}`)
  
  // 确保菜单状态同步
  ensureMenuSync(targetPath)
  
  // 延迟执行路由跳转，确保菜单状态更新
  setTimeout(() => {
    router.push(targetPath).then(() => {
      console.log('✅ 路由跳转成功:', targetPath)
    }).catch((error) => {
      console.error('❌ 路由跳转失败:', error)
      ElMessage.error('页面跳转失败，请手动导航')
    })
  }, 100)
  
  // 关闭弹窗
  visible.value = false
  resetModal()
}

// 确保菜单状态同步
const ensureMenuSync = (path: string) => {
  try {
    // 查找对应的菜单项
    const menuItem = menuStore.findMenuByPath(path)
    
    if (menuItem) {
      console.log('找到对应菜单项:', menuItem.name, '路径:', path)
      
      // 菜单项存在，路由跳转后会自动激活
      // 不需要手动设置，因为 activeMenu 计算属性会自动更新
    } else {
      console.warn('未找到对应的菜单项，路径:', path)
      
      // 尝试查找相似的菜单项
      const similarMenus = menuStore.flatMenuList.filter(menu => 
        menu.path.includes(path.split('/').pop() || '') || 
        path.includes(menu.path.split('/').pop() || '')
      )
      
      if (similarMenus.length > 0) {
        console.log('找到相似的菜单项:', similarMenus.map(m => ({ name: m.name, path: m.path })))
      }
    }
  } catch (error) {
    console.error('菜单状态同步失败:', error)
  }
}

// 构建目标路径
const buildTargetPath = (tableName: string) => {
  // 从表名中提取子集代码和表名
  // 例如：data_base_zygxx_ods_xxjbsj -> 子集: zygxx, 表名: ods_xxjbsj
  const parts = tableName.split('_')
  
  if (parts.length >= 4 && parts[0] === 'data' && parts[1] === 'base') {
    // 格式：data_base_子集_表名
    const subsetCode = parts[2] // 子集代码
    const actualTableName = parts.slice(3).join('_') // 表名（可能包含下划线）
    
    // 构建正确的路由地址格式（以/开头，不包含/index）
    const targetPath = `/data/data_manage/${subsetCode}/${actualTableName}`
    console.log('构建的路由地址:', targetPath)
    
    // 验证路径是否在菜单中存在
    const menuItem = menuStore.findMenuByPath(targetPath)
    if (menuItem) {
      console.log('✅ 路由地址在菜单中找到:', menuItem.name)
      return targetPath
    } else {
      console.warn('⚠️ 路由地址在菜单中未找到，尝试其他格式')
      
      // 尝试其他可能的路径格式
      const alternativePaths = [
        `/data/data_manage/${subsetCode}/${actualTableName}/index`, // 带index的格式
        `/data/data_manage/${subsetCode}`, // 只到子集
        `/data/data_manage/${actualTableName}`, // 只到表名
        `/data/${subsetCode}/${actualTableName}`, // 简化路径
        `/data/${actualTableName}` // 最简化路径
      ]
      
      for (const altPath of alternativePaths) {
        const altMenuItem = menuStore.findMenuByPath(altPath)
        if (altMenuItem) {
          console.log('✅ 找到替代路由地址:', altPath, altMenuItem.name)
          return altPath
        }
      }
      
      // 如果都找不到，返回原始路径
      console.warn('❌ 未找到匹配的菜单路径，使用原始路径')
      return targetPath
    }
  } else {
    // 如果不是标准格式，直接使用表名
    const targetPath = `/data/data_manage/${tableName}`
    console.log('构建的路由地址（非标准格式）:', targetPath)
    return targetPath
  }
}

// 全局错误处理方法
const handleGlobalError = (error: ExcelAnalyzeError, context?: string) => {
  globalError.value = error
  console.error(`Excel解析错误 [${context}]:`, error)
  
  // 根据错误类型决定是否显示错误对话框
  if (error.code === 'SESSION_EXPIRED' || error.code === 'IMPORT_PERMISSION_DENIED') {
    ExcelAnalyzeErrorHandler.showErrorDialog(error, [
      {
        label: '重新开始',
        action: () => {
          resetModal()
          currentStep.value = 0
        },
        type: 'primary'
      }
    ])
  } else {
    ExcelAnalyzeErrorHandler.showError(error)
  }
}

// 暴露方法给父组件
defineExpose({
  resetModal,
  nextStep,
  prevStep
})
</script>

<style scoped lang="scss">
.excel-analyze-container {
  min-height: 500px;
  
  .table-info-header {
    margin-bottom: 20px;
    
    .table-info-card {
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      
      .table-info-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        
        .table-info-left {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .table-info-text {
            .table-name {
              font-size: 18px;
              font-weight: 600;
              color: #303133;
              margin-bottom: 4px;
            }
            
            .table-identifier {
              font-size: 14px;
              color: #606266;
            }
          }
        }
        
        .table-info-right {
          .el-tag {
            font-weight: 500;
          }
        }
      }
    }
  }
  
  .steps-container {
    margin-bottom: 30px;
    padding: 0 20px;
  }
  
  .step-content {
    min-height: 400px;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 6px;
    border: 1px solid #e4e7ed;
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .footer-left {
    flex: 1;
  }
  
  .footer-right {
    display: flex;
    gap: 10px;
  }
}

:deep(.el-dialog) {
  border-radius: 8px;
}

:deep(.el-dialog__header) {
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  border-radius: 8px 8px 0 0;
}

:deep(.el-steps) {
  .el-step__title {
    font-size: 14px;
    font-weight: 500;
  }
  
  .el-step__description {
    font-size: 12px;
    color: #909399;
  }
}
</style>