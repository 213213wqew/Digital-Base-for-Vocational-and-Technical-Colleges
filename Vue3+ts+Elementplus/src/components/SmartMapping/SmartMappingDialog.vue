<template>
  <el-dialog
    v-model="dialogVisible"
    title="智能字段映射"
    width="80%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="smart-mapping-container">
      <!-- 映射配置区域 -->
      <el-card class="config-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>映射配置</span>
            <div class="header-actions">
              <el-button size="small" @click="performAutoMapping">
                <el-icon><MagicStick /></el-icon>
                智能映射
              </el-button>
              <el-button size="small" @click="clearAllMapping">
                <el-icon><Delete /></el-icon>
                清空映射
              </el-button>
            </div>
          </div>
        </template>
        
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="匹配阈值">
              <el-slider
                v-model="matchConfig.matchThreshold"
                :min="60"
                :max="100"
                :step="5"
                show-stops
                show-tooltip
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="匹配策略">
              <el-checkbox-group v-model="matchConfig.matchStrategies">
                <el-checkbox label="exact">精确匹配</el-checkbox>
                <el-checkbox label="fuzzy">模糊匹配</el-checkbox>
                <el-checkbox label="pinyin">拼音匹配</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="自动映射">
              <el-switch v-model="matchConfig.autoMapping" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 映射结果区域 -->
      <el-card class="mapping-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>字段映射 ({{ mappingData.length }}个字段)</span>
            <div class="mapping-stats">
              <el-tag type="success" size="small">
                已映射: {{ mappedCount }}
              </el-tag>
              <el-tag type="warning" size="small">
                未映射: {{ unmappedCount }}
              </el-tag>
              <el-tag type="info" size="small">
                匹配率: {{ matchRate }}%
              </el-tag>
            </div>
          </div>
        </template>

        <el-table
          :data="mappingData"
          border
          stripe
          height="400"
          v-loading="loading"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          
          <el-table-column prop="excelHeader" label="Excel列名" min-width="150">
            <template #default="{ row }">
              <div class="excel-header">
                <span>{{ row.excelHeader }}</span>
                <el-tag v-if="row.isRequired" type="danger" size="small">必填</el-tag>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="数据预览" min-width="120">
            <template #default="{ row }">
              <span class="data-preview">{{ row.dataPreview || '-' }}</span>
            </template>
          </el-table-column>
          
          <el-table-column label="映射到系统字段" min-width="250">
            <template #default="{ row }">
              <el-select
                v-model="row.mappedField"
                placeholder="请选择系统字段"
                clearable
                filterable
                @change="handleFieldChange(row)"
              >
                <el-option
                  v-for="suggestion in row.suggestions"
                  :key="suggestion.fieldName"
                  :label="suggestion.fieldLabel"
                  :value="suggestion.fieldName"
                >
                  <div class="suggestion-option">
                    <span>{{ suggestion.fieldLabel }}</span>
                    <el-tag
                      :type="getConfidenceType(suggestion.confidence)"
                      size="small"
                    >
                      {{ suggestion.confidence }}%
                    </el-tag>
                  </div>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          
          <el-table-column label="匹配置信度" width="120" align="center">
            <template #default="{ row }">
              <el-progress
                v-if="row.confidence > 0"
                :percentage="row.confidence"
                :color="getProgressColor(row.confidence)"
                :stroke-width="8"
                text-inside
              />
              <span v-else class="no-match">未匹配</span>
            </template>
          </el-table-column>
          
          <el-table-column label="字段信息" min-width="150">
            <template #default="{ row }">
              <div v-if="row.selectedSuggestion" class="field-info">
                <div>类型: {{ row.selectedSuggestion.fieldType }}</div>
                <div v-if="row.selectedSuggestion.fieldExample">
                  示例: {{ row.selectedSuggestion.fieldExample }}
                </div>
                <div class="field-tags">
                  <el-tag v-if="row.selectedSuggestion.isRequired" type="danger" size="small">
                    必填
                  </el-tag>
                  <el-tag v-if="row.selectedSuggestion.isDefault" type="info" size="small">
                    默认值
                  </el-tag>
                  <el-tag v-if="row.selectedSuggestion.isIdentifier" type="success" size="small">
                    标识字段
                  </el-tag>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :disabled="unmappedCount > 0">
          确认映射
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { MagicStick, Delete } from '@element-plus/icons-vue'
import {
  batchGetMappingSuggestions,
  performAdvancedMatching,
  type MatchingSuggestion,
  type AutoMappingResult,
  type AdvancedMatchRequest
} from '@/api-data/data/data_base/common/smart-mapping'

// Props定义
interface Props {
  tableName: string
  excelHeaders: string[]
  visible: boolean
}

const props = defineProps<Props>()

// Emits定义
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'confirm': [mappingResult: MappingResult]
}>()

// 映射结果接口
interface MappingResult {
  [excelHeader: string]: {
    systemField: string
    fieldLabel: string
    fieldType: string
    confidence: number
  }
}

// 映射数据接口
interface MappingData {
  excelHeader: string
  dataPreview: string
  isRequired: boolean
  mappedField: string
  confidence: number
  suggestions: MatchingSuggestion[]
  selectedSuggestion: MatchingSuggestion | null
}

// 响应式数据
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const loading = ref(false)
const mappingData = ref<MappingData[]>([])

// 匹配配置
const matchConfig = reactive<AdvancedMatchRequest>({
  headers: [],
  matchThreshold: 80,
  matchStrategies: ['exact', 'fuzzy'],
  autoMapping: true,
  enableFuzzyMatch: true,
  enablePinyinMatch: false,
  enableSemanticMatch: false
})

// 计算属性
const mappedCount = computed(() => 
  mappingData.value.filter(item => item.mappedField).length
)

const unmappedCount = computed(() => 
  mappingData.value.filter(item => !item.mappedField).length
)

const matchRate = computed(() => 
  mappingData.value.length > 0 
    ? Math.round((mappedCount.value / mappingData.value.length) * 100)
    : 0
)

// 监听props变化
watch(() => props.excelHeaders, (newHeaders) => {
  if (newHeaders && newHeaders.length > 0) {
    initializeMappingData(newHeaders)
    performAutoMapping()
  }
}, { immediate: true })

// 初始化映射数据
const initializeMappingData = (headers: string[]) => {
  mappingData.value = headers.map(header => ({
    excelHeader: header,
    dataPreview: '',
    isRequired: header.includes('*'),
    mappedField: '',
    confidence: 0,
    suggestions: [],
    selectedSuggestion: null
  }))
  matchConfig.headers = headers
}

// 执行自动映射
const performAutoMapping = async () => {
  if (!props.tableName || mappingData.value.length === 0) {
    return
  }

  loading.value = true
  try {
    const result = await performAdvancedMatching(props.tableName, matchConfig)
    
    // 更新映射数据
    mappingData.value.forEach(item => {
      const suggestions = result.data.mappingResults[item.excelHeader] || []
      const autoMapped = result.data.autoMappedFields[item.excelHeader]
      
      item.suggestions = suggestions
      
      if (autoMapped) {
        item.mappedField = autoMapped.fieldName
        item.confidence = autoMapped.confidence
        item.selectedSuggestion = autoMapped
      }
    })
    
    ElMessage.success(`智能映射完成，匹配率: ${result.data.matchRate.toFixed(1)}%`)
  } catch (error) {
    ElMessage.error('智能映射失败')
    console.error('智能映射失败:', error)
  } finally {
    loading.value = false
  }
}

// 清空所有映射
const clearAllMapping = () => {
  mappingData.value.forEach(item => {
    item.mappedField = ''
    item.confidence = 0
    item.selectedSuggestion = null
  })
  ElMessage.info('已清空所有映射')
}

// 处理字段选择变化
const handleFieldChange = (row: MappingData) => {
  if (row.mappedField) {
    const suggestion = row.suggestions.find(s => s.fieldName === row.mappedField)
    if (suggestion) {
      row.selectedSuggestion = suggestion
      row.confidence = suggestion.confidence
    }
  } else {
    row.selectedSuggestion = null
    row.confidence = 0
  }
}

// 获取置信度类型
const getConfidenceType = (confidence: number) => {
  if (confidence >= 90) return 'success'
  if (confidence >= 70) return 'warning'
  return 'danger'
}

// 获取进度条颜色
const getProgressColor = (confidence: number) => {
  if (confidence >= 90) return '#67c23a'
  if (confidence >= 70) return '#e6a23c'
  return '#f56c6c'
}

// 处理关闭
const handleClose = () => {
  dialogVisible.value = false
}

// 处理确认
const handleConfirm = () => {
  const mappingResult: MappingResult = {}
  
  mappingData.value.forEach(item => {
    if (item.mappedField && item.selectedSuggestion) {
      mappingResult[item.excelHeader] = {
        systemField: item.mappedField,
        fieldLabel: item.selectedSuggestion.fieldLabel,
        fieldType: item.selectedSuggestion.fieldType,
        confidence: item.confidence
      }
    }
  })
  
  emit('confirm', mappingResult)
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.smart-mapping-container {
  .config-card, .mapping-card {
    margin-bottom: 16px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-actions {
        display: flex;
        gap: 8px;
      }
      
      .mapping-stats {
        display: flex;
        gap: 8px;
      }
    }
  }
  
  .excel-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .data-preview {
    color: #909399;
    font-size: 12px;
  }
  
  .suggestion-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .field-info {
    font-size: 12px;
    color: #606266;
    
    .field-tags {
      margin-top: 4px;
      display: flex;
      gap: 4px;
    }
  }
  
  .no-match {
    color: #c0c4cc;
    font-size: 12px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>