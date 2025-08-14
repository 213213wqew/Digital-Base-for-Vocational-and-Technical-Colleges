<template>
  <div class="field-matching-step">
    <div class="matching-header">
      <h3>字段匹配</h3>
      <p class="matching-description">
        系统已自动匹配Excel表头与数据库字段，请确认或调整匹配关系，请上传相对应的表的excel，必须按规则，要不识别失败  
      </p>
    </div>

    <!-- 匹配状态栏 -->
    <div class="matching-status-bar">
      <div class="status-left">
        <el-text type="info">
          严格匹配模式：按字段配置顺序一一对应
        </el-text>
      </div>
      <div class="status-right">
        <el-text type="info">
          已匹配: {{ matchedCount }}/{{ totalHeaders }} 个字段
        </el-text>
      </div>
    </div>

    <!-- 错误信息显示 -->
    <div v-if="matchingError" class="matching-error">
      <ErrorRecovery :error="matchingError" :recovery-actions="matchingRecoveryActions"
        @action-complete="handleRecoveryAction" @error-reported="handleErrorReport" />
    </div>

    <!-- 匹配表格 -->
    <div class="matching-table">
      <el-table :data="matchingData" border stripe height="400">
        <el-table-column label="序号" width="55" type="index" align="center" />
        <el-table-column prop="excelHeader" label="Excel表头" width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="excel-header-cell">
              <el-tag size="small" type="info">
                {{ row.columnIndex }}
              </el-tag>
              <span class="header-text">{{ row.excelHeader.replace(/\*/g, '') }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="matchedField" label="匹配字段" width="250">
          <template #default="{ row }">
            <div class="matched-field-display">
              <div v-if="row.isMatched" class="matched-field">
                <el-icon class="match-icon success"><Check /></el-icon>
                <span class="field-label">{{ row.suggestedFieldLabel }}</span>
                <span class="field-name">({{ row.suggestedFieldName }})</span>
                <el-tag v-if="row.isRequired" size="small" type="danger" class="required-tag">
                  必填
                </el-tag>
              </div>
              <div v-else class="unmatched-field">
                <el-icon class="match-icon error"><Close /></el-icon>
                <span class="field-label">{{ row.suggestedFieldLabel }}</span>
                <span class="field-name">({{ row.suggestedFieldName }})</span>
                <el-tag v-if="row.isRequired" size="small" type="danger" class="required-tag">
                  必填
                </el-tag>
                <div class="mismatch-reason">
                  <el-tag size="small" type="warning">期望: {{ row.suggestedFieldLabel }}</el-tag>
                  <el-tag size="small" type="info">实际: {{ row.excelHeader.replace(/\*/g, '') }}</el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="matchScore" label="匹配状态" width="100" align="center">
          <template #default="{ row }">
            <div v-if="row.isMatched" class="match-status success">
              <el-icon><Check /></el-icon>
              <span>匹配成功</span>
            </div>
            <div v-else class="match-status error">
              <el-icon><Close /></el-icon>
              <span>匹配失败</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="fieldInfo" label="字段信息" min-width="200">
          <template #default="{ row }">
            <div v-if="row.fieldInfo" class="field-info">
              <div class="field-type">
                <el-tag size="small" :type="getFieldTypeColor(row.fieldInfo.fieldType) as any">
                  {{ row.fieldInfo.fieldType }}
                </el-tag>
                <span v-if="row.fieldInfo.fieldLength" class="field-length">
                  ({{ row.fieldInfo.fieldLength }})
                </span>
                <el-button 
                  v-if="row.fieldInfo.fieldType === 'select' || row.fieldInfo.fieldType === 'dict'"
                  size="small" 
                  type="primary" 
                  text
                  @click="viewDictData(row)"
                >
                  查看字典
                </el-button>
              </div>
              <div class="field-desc">{{ row.fieldInfo.fieldComment }}</div>
            </div>
          </template>
        </el-table-column>


      </el-table>
    </div>



    <!-- 操作按钮 -->
    <div class="step-actions">
      <el-button @click="handlePrev">
        上一步
      </el-button>
      <el-tooltip 
        :content="getNextButtonTooltip()" 
        placement="top" 
        :disabled="canNext"
      >
        <div style="display: inline-block;">
          <el-button type="primary" @click="handleNext" :disabled="!canNext">
            下一步：数据预览
          </el-button>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Download, Upload, Check, Close } from '@element-plus/icons-vue'
import { ExcelAnalyzeErrorHandler } from '@/utils/excelAnalyzeErrorHandler'
import ErrorRecovery from '../ErrorRecovery.vue'
import type { ExcelAnalyzeError, RecoveryAction } from '@/utils/excelAnalyzeErrorHandler'
import { excelAnalyzeApi } from '@/api/excelAnalyze'
import type { HeaderMatchingResponse, FieldMatchResult, FieldMapping } from '@/api/excelAnalyze'

// 组件属性
interface Props {
  sessionId: string
  tableName: string
  excelHeaders: any[]
}

// 组件事件
interface Emits {
  (e: 'matching-complete', mappings: any[]): void
  (e: 'next-step'): void
  (e: 'prev-step'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 字段信息类型
interface FieldInfo {
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  fieldLength?: number;
  fieldComment?: string;
  required?: boolean;
}
// 匹配数据类型
interface MatchingRow {
  excelHeader: string;
  columnIndex: number;
  matchedField: string;
  fieldInfo?: FieldInfo;
  matchScore: number;
  isMatched: boolean;
  suggestedFieldName: string;
  suggestedFieldLabel: string;
  isRequired: boolean;
}

// 响应式数据
const loading = ref(false)
const matchingData = ref<MatchingRow[]>([])
const matchingError = ref<ExcelAnalyzeError | null>(null)

// 计算属性
const totalHeaders = computed(() => matchingData.value.length)

const matchedCount = computed(() => {
  return matchingData.value.filter(item => item.isMatched).length
})

const canNext = computed(() => {
  // 检查是否有任何字段匹配失败
  const unmatchedFields = matchingData.value.filter(item => !item.isMatched)
  
  // 如果有任何字段匹配失败，不允许进入下一步
  if (unmatchedFields.length > 0) {
    return false
  }
  
  return true
})

const matchingRecoveryActions = computed((): RecoveryAction[] => {
  if (!matchingError.value) return []

  return ExcelAnalyzeErrorHandler.createRecoveryActions({
    onRetry: () => handleRetryMatching(),
    onReset: () => handleResetMatching()
  })
})

// 方法
const getScoreColor = (score: number) => {
  if (score >= 0.8) return '#67c23a'
  if (score >= 0.6) return '#e6a23c'
  return '#f56c6c'
}

const getFieldTypeColor = (type: string) => {
  const typeColors: Record<string, string> = {
    'VARCHAR': 'primary',
    'INT': 'success',
    'DECIMAL': 'warning',
    'DATE': 'info',
    'DATETIME': 'info',
    'TEXT': 'primary'
  }
  return typeColors[type] || 'info'
}

const loadMatchingResults = async () => {
  try {
    loading.value = true
    matchingError.value = null

    // 构建表头数据
    const headers = props.excelHeaders.map((header, index) => {
      // 如果header是对象，直接使用；如果是字符串，构建对象
      if (typeof header === 'object' && header !== null) {
        return {
          headerName: header.headerName || '',
          headerIndex: header.headerIndex !== undefined ? header.headerIndex : index,
          columnLetter: header.columnLetter || String.fromCharCode(65 + index),
          dataType: header.dataType || 'STRING',
          sampleData: header.sampleData || ''
        }
      } else {
        return {
          headerName: header || '',
          headerIndex: index,
          columnLetter: String.fromCharCode(65 + index),
          dataType: 'STRING',
          sampleData: ''
        }
      }
    })

    // 使用API获取表头匹配结果
    const response = await excelAnalyzeApi.matchHeaders({
      sessionId: props.sessionId,
      tableName: props.tableName,
      headers: headers
    })

    // 转换API响应数据为组件需要的格式
    matchingData.value = response.matchResults.map((result: FieldMatchResult) => ({
      excelHeader: result.headerName,
      columnIndex: result.headerIndex,
      matchedField: result.isMatched ? result.suggestedFieldName || '' : '',
      fieldInfo: result.isMatched && result.suggestedFieldName ? {
        fieldName: result.suggestedFieldName,
        fieldLabel: result.suggestedFieldLabel || result.suggestedFieldName,
        fieldType: result.dictType || 'VARCHAR',
        required: result.isRequired,
        fieldComment: result.suggestedFieldLabel || ''
      } : undefined,
      matchScore: result.matchScore,
      isMatched: result.isMatched,
      suggestedFieldName: result.suggestedFieldName || '',
      suggestedFieldLabel: result.suggestedFieldLabel || '',
      isRequired: result.isRequired || false
    }))


  } catch (error: any) {
    console.error('加载匹配结果失败:', error)
    matchingError.value = ExcelAnalyzeErrorHandler.handleFieldMatchingError(error)
    ExcelAnalyzeErrorHandler.showError(matchingError.value)
  } finally {
    loading.value = false
  }
}

const handlePrev = () => {
  emit('prev-step')
}

const handleNext = async () => {
  if (!canNext.value) {
    const unmatchedFields = matchingData.value.filter(item => !item.isMatched)
    ElMessage.warning(`检测到 ${unmatchedFields.length} 个字段匹配失败，请先解决字段匹配问题`)
    return
  }

  try {
    // 保存匹配结果
    const mappings: FieldMapping[] = matchingData.value
      .filter(item => item.matchedField)
      .map(item => ({
        headerName: item.excelHeader,
        headerIndex: item.columnIndex,
        fieldName: item.matchedField,
        matchedField: item.matchedField, // 用于DataPreviewStep中的表格列prop
        fieldLabel: item.fieldInfo?.fieldLabel || '',
        isRequired: item.fieldInfo?.required || false,
        dictType: item.fieldInfo?.fieldType,
        fieldInfo: {
          fieldLabel: item.fieldInfo?.fieldLabel || '',
          fieldType: item.fieldInfo?.fieldType || 'VARCHAR'
        }
      }))

    const success = await excelAnalyzeApi.saveFieldMapping({
      sessionId: props.sessionId,
      mappings,
      customRules: {} // 可以在这里添加自定义规则
    })

    if (success) {
      emit('matching-complete', mappings)
      emit('next-step')
      ElMessage.success('字段匹配保存成功')
    } else {
      throw new Error('保存匹配结果失败')
    }
  } catch (error: any) {
    console.error('保存匹配结果失败:', error)
    matchingError.value = ExcelAnalyzeErrorHandler.handleFieldMatchingError(error)
    ExcelAnalyzeErrorHandler.showError(matchingError.value)
  }
}

// 错误处理和恢复操作方法
const handleRetryMatching = async () => {
  matchingError.value = null
  await loadMatchingResults()
}

const handleResetMatching = async () => {
  matchingError.value = null
  matchingData.value = []
  await loadMatchingResults()
}

const handleDownloadFieldTemplate = async () => {
  try {
    const response = await fetch(`/api/excel-analyze/field-template/${props.sessionId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `字段匹配模板.json`
      link.click()
      URL.revokeObjectURL(url)
      ElMessage.success('字段模板下载成功')
    } else {
      throw new Error('下载失败')
    }
  } catch (error) {
    console.error('下载字段模板失败:', error)
    ElMessage.error('字段模板下载失败')
  }
}

const handleRecoveryAction = (actionLabel: string) => {
  console.log(`恢复操作完成: ${actionLabel}`)
}

const handleErrorReport = (error: ExcelAnalyzeError) => {
  console.log('用户反馈错误:', error)
}

// 获取下一步按钮的提示信息
const getNextButtonTooltip = () => {
  const unmatchedFields = matchingData.value.filter(item => !item.isMatched)
  
  if (unmatchedFields.length > 0) {
    return `检测到 ${unmatchedFields.length} 个字段匹配失败，请先解决字段匹配问题`
  }
  
  return ''
}

// 查看字典数据
const viewDictData = async (row: MatchingRow) => {
  try {
    const response = await fetch(`/api/excel-analyze/dict-data?tableName=${props.tableName}&fieldName=${row.suggestedFieldName}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        // 显示字典数据弹窗
        showDictDataDialog(result.data)
      } else {
        ElMessage.error(result.message || '获取字典数据失败')
      }
    } else {
      ElMessage.error('获取字典数据失败')
    }
  } catch (error) {
    console.error('获取字典数据失败:', error)
    ElMessage.error('获取字典数据失败')
  }
}

// 显示字典数据弹窗
const showDictDataDialog = (data: any) => {
  // 这里可以创建一个字典数据查看弹窗
  ElMessageBox.alert(
    `<div>
      <h3>字典数据查看</h3>
      <p><strong>表名:</strong> ${data.tableName}</p>
      <p><strong>字段名:</strong> ${data.fieldName}</p>
      <p><strong>字段中文名:</strong> ${data.fieldLabel}</p>
      <p><strong>字典类型:</strong> ${data.dictType}</p>
      <h4>字典数据列表:</h4>
      <div style="max-height: 300px; overflow-y: auto;">
        ${data.dictDataList && data.dictDataList.length > 0 
          ? data.dictDataList.map((item: any) => 
              `<div style="border: 1px solid #ddd; padding: 8px; margin: 4px 0; border-radius: 4px;">
                <strong>源代码:</strong> ${item.sourceCode}<br>
                <strong>数据源名称:</strong> ${item.sourceName}<br>
                <strong>数据源类型:</strong> ${item.sourceType}<br>
                <strong>配置信息:</strong> ${item.config}<br>
                <strong>描述:</strong> ${item.description}<br>
                <strong>状态:</strong> ${item.status}
              </div>`
            ).join('')
          : '<p>暂无数据</p>'
        }
      </div>
    </div>`,
    '字典数据查看',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭',
      customClass: 'dict-data-dialog'
    }
  )
}

// 生命周期
onMounted(async () => {
  await loadMatchingResults()
})
</script>

<style scoped lang="scss">
.field-matching-step {
  .matching-header {
    text-align: center;
    margin-bottom: 20px;

    h3 {
      margin: 0 0 10px 0;
      color: #303133;
      font-size: 18px;
      font-weight: 600;
    }

    .matching-description {
      margin: 0;
      color: #12b1f0;
      font-size: 14px;
    }
  }

  .matching-status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 6px;

    .status-left {
      display: flex;
      align-items: center;
    }

    .status-right {
      font-size: 14px;
    }
  }

  .matching-table {
    margin-bottom: 20px;

    .excel-header-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      .header-text {
        font-weight: 500;
      }
    }

    .matched-field-display {
      .matched-field, .unmatched-field {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-radius: 4px;
      }

      .matched-field {
        background: #f0f9ff;
        border: 1px solid #b3d8ff;
      }

      .unmatched-field {
        background: #fef0f0;
        border: 1px solid #fbc4c4;
      }

      .match-icon {
        font-size: 16px;

        &.success {
          color: #67c23a;
        }

        &.error {
          color: #f56c6c;
        }
      }

      .field-label {
        font-weight: 500;
      }

      .field-name {
        color: #909399;
        font-size: 12px;
      }

      .required-tag {
        margin-left: auto;
      }

      .mismatch-reason {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 4px;
        padding-top: 4px;
        border-top: 1px solid #e4e7ed;
      }
    }

    .match-status {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;

      &.success {
        color: #67c23a;
      }

      &.error {
        color: #f56c6c;
      }
    }

    .field-info {
      .field-type {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 4px;

        .field-length {
          color: #909399;
          font-size: 12px;
        }
      }

      .field-desc {
        color: #606266;
        font-size: 12px;
      }
    }

    .no-match {
      color: #c0c4cc;
      font-size: 12px;
    }
  }

  .suggestions-list {
    .suggestion-item {
      padding: 12px;
      border: 1px solid #e4e7ed;
      border-radius: 6px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
        background-color: #f0f9ff;
      }

      .suggestion-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .field-name {
          font-weight: 500;
          color: #303133;
        }
      }

      .suggestion-detail {
        display: flex;
        align-items: center;
        gap: 8px;

        .match-reason {
          color: #606266;
          font-size: 12px;
        }
      }
    }
  }

  .no-suggestions {
    text-align: center;
    padding: 40px 0;
  }

  .step-actions {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;

    .el-button+.el-button {
      margin-left: 10px;
    }
  }
}
</style>