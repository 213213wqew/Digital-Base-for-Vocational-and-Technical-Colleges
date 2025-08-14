<template>
  <div class="data-preview-step">
    <!-- 页面标题 -->
    <div class="preview-header">
      <h3>数据预览</h3>
      <p class="description">
        {{ showOriginalData ? '预览原始Excel数据，检查数据内容' : '预览转换后的数据，检查转换效果' }}
      </p>
    </div>

    <!-- 紧凑的统计信息卡片 -->
    <div class="statistics-cards">
      <el-card class="stat-card" shadow="never">
        <div class="stat-item">
          <el-icon class="stat-icon"><Document /></el-icon>
          <div class="stat-content">
            <div class="stat-value">{{ totalRows }}</div>
            <div class="stat-label">总行数</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card" shadow="never">
        <div class="stat-item">
          <el-icon class="stat-icon"><View /></el-icon>
          <div class="stat-content">
            <div class="stat-value">{{ previewData.length }}</div>
            <div class="stat-label">显示行数</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card" shadow="never">
        <div class="stat-item">
          <el-icon class="stat-icon"><Grid /></el-icon>
          <div class="stat-content">
            <div class="stat-value">{{ totalColumns }}</div>
            <div class="stat-label">总列数</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card" shadow="never">
        <div class="stat-item">
          <el-icon class="stat-icon"><DataLine /></el-icon>
          <div class="stat-content">
            <div class="stat-value">{{ getDataStatusText() }}</div>
            <div class="stat-label">数据状态</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 工具栏 -->
    <div class="preview-toolbar">
      <div class="toolbar-left">
        <el-select v-model="dataLimit" @change="handleDataLimitChange" size="small">
          <el-option label="显示200条" :value="200" />
          <el-option label="显示500条" :value="500" />
          <el-option label="显示1000条" :value="1000" />
          <el-option label="显示全部" :value="-1" />
        </el-select>
        
        <el-button 
          @click="toggleDataMode" 
          :type="showOriginalData ? 'warning' : 'success'"
          size="small"
          :disabled="!hasTransformedData && !showOriginalData"
        >
          <el-icon><Refresh /></el-icon>
          {{ showOriginalData ? '显示转换后数据' : '显示原始数据' }}
        </el-button>
      </div>
      
      <div class="toolbar-right">
        <el-button @click="handleRefreshPreview" :loading="loading" size="small">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button 
          type="primary" 
          @click="handleTransformData" 
          :loading="transforming" 
          size="small"
          :title="hasTransformedData ? '重新配置转换规则' : '配置数据转换规则'"
        >
          <el-icon><MagicStick /></el-icon>
          {{ hasTransformedData ? '※重新转换' : '※数据转换' }}
        </el-button>
        <el-button 
          v-if="hasTransformedData && !showOriginalData" 
          type="success" 
          @click="handleDownloadTransformed" 
          :loading="downloading" 
          size="small"
        >
          <el-icon><Download /></el-icon>
          下载转换后Excel
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="data-table-container">
      <!-- 数据状态提示 -->
      <div class="data-status-tip">
        <el-alert
          :title="showOriginalData ? '当前显示：原始Excel数据' : '当前显示：转换后的数据'"
          :type="showOriginalData ? 'info' : 'success'"
          :closable="false"
          show-icon
          size="small"
        >
          <template #default>
            <span v-if="showOriginalData">
              这是从Excel文件中读取的原始数据，尚未进行任何转换处理。
              <el-button 
                type="primary" 
                size="small" 
                @click="handleTransformData"
                style="margin-left: 10px;"
              >
                开始转换
              </el-button>
            </span>
            <span v-else>
              这是经过转换规则处理后的数据，已应用了您配置的转换规则。
            </span>
          </template>
        </el-alert>
      </div>
      
      <!-- 替换el-table为vxe-table，支持虚拟滚动 -->
      <vxe-table
        :data="previewData"
        height="400"
        border
        stripe
        size="small"
        :scroll-y="{enabled: true}"
        class="preview-table"
      >
        <vxe-column
          v-for="(headerDisplay, index) in tableHeaderDisplays"
          :key="index"
          :field="headerDisplay.headerName"
          :title="headerDisplay.displayText"
          :min-width="120"
          show-overflow
        >
          <template #header>
            <div class="header-content">
              <span :class="{ 'dict-header': headerDisplay.isDict }">
                {{ headerDisplay.headerName }}
              </span>
              <el-button
                v-if="headerDisplay.isDict"
                type="primary"
                size="small"
                circle
                @click="handleViewDict(headerDisplay)"
                class="dict-view-btn"
                title="查看字典"
              >
                <el-icon><View /></el-icon>
              </el-button>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <!-- 分页器 -->
    <div class="pagination-container" v-if="totalRows > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[50, 100, 200, 500]"
        :total="totalRows"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        size="small"
      />
    </div>

    <!-- 数据转换弹窗 -->
    <el-dialog
      v-model="transformDialogVisible"
      title="数据转换设置"
      width="800px"
      :close-on-click-modal="false"
      :draggable="true"
      class="transform-dialog"
    >
      <div class="transform-dialog-content">
        <div class="transform-description">
          <el-alert
            title="数据转换说明"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <p>您可以对Excel中的每一列数据设置转换规则，支持以下转换方式：</p>
              <ul>
                <li><strong>字典转换：</strong>将特定值转换为对应的字典值</li>
                <li><strong>格式转换：</strong>日期、数字等格式转换</li>
                <li><strong>自定义规则：</strong>使用JavaScript表达式进行复杂转换</li>
              </ul>
            </template>
          </el-alert>
        </div>

        <div class="transform-rules">
          <div class="rules-header">
            <h4>转换规则设置</h4>
            <div class="rules-info">
              <span class="rules-count">
                已添加 {{ transformRules.length }}/{{ tableHeaders.length }} 个规则
              </span>
              <el-button 
                type="primary" 
                size="small" 
                @click="addTransformRule"
                :disabled="transformRules.length >= tableHeaders.length"
                :title="transformRules.length >= tableHeaders.length ? `已达到最大规则数量（${tableHeaders.length}列）` : '添加转换规则'"
              >
                <el-icon><Plus /></el-icon>
                添加规则
              </el-button>
            </div>
          </div>

          <el-table :data="transformRules" border stripe size="small">
            <el-table-column label="序号" width="55" type="index" align="center" />
            <el-table-column prop="columnName" label="Excel列名" width="150">
              <template #default="{ row }">
                <el-select v-model="row.columnName" size="small" placeholder="选择列名">
                  <el-option
                    v-for="col in getAvailableColumns(row)"
                    :key="col.value"
                    :label="col.isDict ? `${col.label}（字典）` : col.label"
                    :value="col.value"
                  >
                    <span :class="{ 'dict-option': col.isDict }">
                      {{ col.label }}
                      <el-tag v-if="col.isDict" type="success" size="small" style="margin-left: 4px;">
                        字典
                      </el-tag>
                    </span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="transformType" label="转换类型" width="120">
              <template #default="{ row }">
                <el-select v-model="row.transformType" size="small">
                  <el-option 
                    label="字典转换" 
                    value="dict" 
                    :disabled="!isColumnDict(row.columnName)"
                    :title="!isColumnDict(row.columnName) ? '该字段不是字典类型，无法使用字典转换' : ''"
                  />
                  <el-option label="格式转换" value="format" />
                  <el-option label="自定义规则" value="custom" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="transformRule" label="转换规则" min-width="200">
              <template #default="{ row }">
                <div v-if="row.transformType === 'dict'">
                  <div class="dict-config">
                    <el-select v-model="row.transformMode" size="small" placeholder="选择转换模式" style="margin-bottom: 8px;">
                      <el-option label="默认模式" value="DEFAULT" />
                      <el-option label="手动输入" value="MANUAL" />
                    </el-select>
                    
                    <!-- 默认模式：显示说明 -->
                    <div v-if="row.transformMode === 'DEFAULT'" class="default-mode-info">
                      <el-tag type="info" size="small">自动匹配字典别名</el-tag>
                    </div>
                    
                    <!-- 手动模式：显示映射输入 -->
                    <div v-else-if="row.transformMode === 'MANUAL'" class="manual-mode-input">
                      <el-input 
                        v-model="row.manualMapping" 
                        size="small" 
                        placeholder="输入映射关系，格式：原值=目标值,原值2=目标值2"
                        style="margin-bottom: 8px;"
                      />
                      <el-tag type="warning" size="small">手动映射模式</el-tag>
                    </div>
                  </div>
                </div>
                <div v-else-if="row.transformType === 'format'">
                  <el-select v-model="row.formatType" size="small" placeholder="选择格式">
                    <el-option label="日期格式" value="date" />
                    <el-option label="数字格式" value="number" />
                    <el-option label="文本格式" value="text" />
                  </el-select>
                  <div v-if="row.formatType === 'date'" class="date-format-settings">
                    <div class="date-format-row">
                      <span class="format-label">日期格式：</span>
                      <el-input
                        v-model="row.dateFormat"
                        size="small"
                        placeholder="日期格式，如：yyyy-MM-dd"
                        style="width: 150px;"
                      />
                    </div>
                    <div class="date-format-row">
                      <span class="format-label">固定日期值：</span>
                      <el-input
                        v-model="row.dateValue"
                        size="small"
                        placeholder="固定日期值，如：2025-01-01"
                        style="width: 150px;"
                      />
                    </div>
                    <div class="date-format-preview" v-if="row.dateFormat || row.dateValue">
                      <el-tag size="small" type="info">
                        {{ row.dateValue ? '固定值：' + row.dateValue : '格式：' + row.dateFormat }}
                      </el-tag>
                    </div>
                  </div>
                  <div v-else-if="row.formatType === 'number'" class="number-format-settings">
                    <div class="number-range-row">
                      <span class="range-label">最小值：</span>
                      <el-input
                        v-model="row.minValue"
                        size="small"
                        placeholder="最小值"
                        style="width: 120px;"
                        type="number"
                        step="any"
                      />
                    </div>
                    <div class="number-range-row">
                      <span class="range-label">最大值：</span>
                      <el-input
                        v-model="row.maxValue"
                        size="small"
                        placeholder="最大值"
                        style="width: 120px;"
                        type="number"
                        step="any"
                      />
                    </div>
                    <div class="number-range-row">
                      <span class="range-label">小数位数：</span>
                      <el-input
                        v-model="row.decimalPlaces"
                        size="small"
                        placeholder="0"
                        style="width: 120px;"
                        type="number"
                        :min="0"
                        :max="10"
                      />
                    </div>
                    <div class="number-preview" v-if="row.minValue && row.maxValue">
                      <el-tag size="small" type="info">
                        范围：{{ row.minValue }} - {{ row.maxValue }} ({{ row.decimalPlaces > 0 ? row.decimalPlaces + '位小数' : '整数' }})
                      </el-tag>
                    </div>
                  </div>
                  <div v-else-if="row.formatType === 'text'" class="text-format-settings">
                    <div class="text-replace-row">
                      <span class="replace-label">修改前：</span>
                      <el-input
                        v-model="row.textBefore"
                        size="small"
                        placeholder="输入要替换的文本"
                        style="width: 120px;"
                      />
                    </div>
                    <div class="text-replace-row">
                      <span class="replace-label">修改后：</span>
                      <el-input
                        v-model="row.textAfter"
                        size="small"
                        placeholder="输入替换后的文本"
                        style="width: 120px;"
                      />
                    </div>
                    <div class="text-options">
                      <el-checkbox v-model="row.caseSensitive" size="small">区分大小写</el-checkbox>
                      <el-checkbox v-model="row.replaceAll" size="small">替换所有匹配</el-checkbox>
                    </div>
                  </div>
                </div>
                <div v-else-if="row.transformType === 'custom'">
                  <el-input
                    v-model="row.customRule"
                    size="small"
                    placeholder="JavaScript表达式，如：value.toUpperCase()"
                    type="textarea"
                    :rows="2"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="enabled" label="启用" width="80">
              <template #default="{ row }">
                <el-switch v-model="row.enabled" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ $index }">
                <el-button type="danger" size="small" @click="removeTransformRule($index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="transformDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="applyTransformRules" :loading="applyingRules">
            应用转换规则
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 字典查看弹窗 -->
    <el-dialog
      v-model="dictDialogVisible"
      title="字典数据查看"
      width="900px"
      :close-on-click-modal="false"
      :draggable="true"
      class="dict-dialog"
    >
      <div class="dict-dialog-content">
        <div class="dict-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="表名">{{ dictInfo.tableName }}</el-descriptions-item>
            <el-descriptions-item label="字段名">{{ dictInfo.fieldName }}</el-descriptions-item>
            <el-descriptions-item label="字段中文名">{{ dictInfo.fieldLabel }}</el-descriptions-item>
            <el-descriptions-item label="字典类型">{{ dictInfo.dictType }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="dict-data-table">
          <div class="table-header">
            <h4>字典数据列表</h4>
            <span class="data-count">共 {{ dictDataList.length }} 条数据</span>
          </div>
          
          <el-table 
            :data="dictDataList" 
            border 
            stripe 
            size="small"
            height="400"
            style="width: 100%"
          >
            <el-table-column label="序号" width="55" type="index" align="center" />
            <el-table-column prop="sourceCode" label="源代码" width="120" />
            <el-table-column prop="sourceName" label="数据源名称" min-width="150" />
            <el-table-column prop="sourceType" label="数据源类型" width="120" />
            <el-table-column prop="config" label="配置信息" min-width="150" />
            <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'" size="small">
                  {{ row.status === 'ACTIVE' ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reservedField1" label="预留字段1" width="120" show-overflow-tooltip />
          </el-table>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dictDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Document,
  Check,
  Close,
  Warning,
  Refresh,
  Download,
  Setting,
  View,
  Grid,
  DataAnalysis,
  DataLine,
  MagicStick,
  Plus
} from '@element-plus/icons-vue'
import 'vxe-table/lib/style.css'
import { VxeTable, VxeColumn } from 'vxe-table'
import { ExcelAnalyzeErrorHandler } from '@/utils/excelAnalyzeErrorHandler'
import ErrorRecovery from '../ErrorRecovery.vue'
import type { ExcelAnalyzeError, RecoveryAction } from '@/utils/excelAnalyzeErrorHandler'
import { excelAnalyzeApi } from '@/api/excelAnalyze'
import type { DataPreviewResponse, DataTransformResponse, TransformResult } from '@/api/excelAnalyze'

// 组件属性
interface Props {
  sessionId: string
  fieldMappings: FieldMapping[]
  tableName?: string
}

// 组件事件
interface Emits {
  (e: 'preview-complete', summary: any): void
  (e: 'next-step'): void
  (e: 'prev-step'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 字段映射类型
interface FieldMapping {
  headerName?: string;
  headerIndex?: number;
  fieldName?: string;
  matchedField: string;
  isRequired?: boolean;
  dictType?: string;
  validationRules?: string;
  transformRules?: string;
  fieldInfo?: {
    fieldLabel?: string;
    fieldType?: string;
  };
}

// 统计信息类型
interface PreviewStatistics {
  totalRows: number;
  validRows: number;
  errorRows: number;
  warningRows: number;
}

// 响应式数据
const loading = ref(false)
const transforming = ref(false)
const downloading = ref(false)
const previewData = ref<Record<string, any>[]>([])
const currentPage = ref(1)
const pageSize = ref(50)
const dataLimit = ref(200)
const totalRows = ref(0)
const totalColumns = ref(0)

// 计算属性
const tableHeaders = computed(() => {
  // 优先使用字段映射中的表头顺序（按数据库字段顺序）
  if (props.fieldMappings && props.fieldMappings.length > 0) {
    // 直接使用字段映射的顺序，因为后端已经按数据库字段顺序返回
    return props.fieldMappings
      .map(mapping => mapping.headerName)
      .filter(Boolean) as string[]
  }
  
  // 如果没有字段映射，从数据中提取
  if (previewData.value.length > 0) {
    return Object.keys(previewData.value[0])
  }
  return []
})

// 生成带有字典标识的表头显示信息
const tableHeaderDisplays = computed(() => {
  if (props.fieldMappings && props.fieldMappings.length > 0) {
    console.log('111111111111111111111111111')
    console.log(props.fieldMappings)
    return props.fieldMappings
      .filter(mapping => mapping.headerName)
      .map(mapping => {
        // 定义非字典类型列表，这些类型不应该显示为字典
        const nonDictTypes = ['VARCHAR', 'string', 'INT', 'DECIMAL', 'DATE', 'DATETIME', 'TEXT', 'number', 'date', 'datetime', 'text']
        
        // 判断是否为字典：dictType存在且不为空，且不在非字典类型列表中
        const isDict = !!mapping.dictType && 
                      mapping.dictType.trim() !== '' && 
                      !nonDictTypes.includes(mapping.dictType.toUpperCase())
        
        return {
          headerName: mapping.headerName!,
          fieldName: mapping.fieldName || mapping.matchedField,
          dictType: mapping.dictType,
          isDict: isDict,
          displayText: isDict 
            ? `${mapping.headerName}（字典）` 
            : mapping.headerName!
        }
      })
  }
  
  // 如果没有字段映射，从数据中提取
  if (previewData.value.length > 0) {
    return Object.keys(previewData.value[0]).map(headerName => ({
      headerName,
      fieldName: headerName,
      dictType: '',
      isDict: false,
      displayText: headerName
    }))
  }
  return []
})

// 行详情
const rowDetailVisible = ref(false)
const selectedRow = ref<Record<string, any> | null>(null)
const selectedRowIndex = ref(0)

// 转换设置
const showTransformSettings = ref(false)
const transformSettings = ref({
  nullHandling: 'keep',
  strictValidation: false,
  enableDictTransform: true
})

// 统计信息
const statistics = ref<PreviewStatistics>({
  totalRows: 0,
  validRows: 0,
  errorRows: 0,
  warningRows: 0
})
const previewError = ref<ExcelAnalyzeError | null>(null)

// 数据转换弹窗
const transformDialogVisible = ref(false)
const transformRules = ref<any[]>([])
const applyingRules = ref(false)

// 字典查看弹窗
const dictDialogVisible = ref(false)
const dictInfo = ref({
  tableName: '',
  fieldName: '',
  fieldLabel: '',
  dictType: ''
})
const dictDataList = ref<any[]>([])

// 方法
const getDataStatusText = () => {
  if (dataLimit.value === -1) {
    return '显示全部'
  }
  return `前${dataLimit.value}条`
}

// 获取当前时间的方法
const getCurrentTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const handleDataLimitChange = async () => {
  await loadPreviewData()
}

const handleRefreshPreview = async () => {
  await loadPreviewData()
}

const handleTransformData = async () => {
  // 打开数据转换设置弹窗
  transformDialogVisible.value = true
  
  // 初始化一些示例转换规则
  if (transformRules.value.length === 0) {
    const availableColumns = getAvailableColumns()
    if (availableColumns.length > 0) {
      // 添加一个示例格式转换规则
      transformRules.value.push({
        columnName: availableColumns[0].value,
        transformType: 'format',
        enabled: true,
        // 格式转换相关字段
        formatType: 'text',
        // 文本格式字段
        textBefore: '',
        textAfter: '',
        caseSensitive: false,
        replaceAll: true,
        // 日期格式字段
        dateFormat: '',
        dateValue: '',
        // 数字格式字段
        minValue: 0,
        maxValue: 100,
        decimalPlaces: 0,
        // 字典转换字段
        dictMappings: {},
        // 自定义规则字段
        customRule: '',
        // 新增手动映射字段
        manualMapping: ''
      })
    }
  }
}

// 添加切换显示模式的方法
const showOriginalData = ref(true) // 默认显示原始数据
const hasTransformedData = ref(false) // 是否有转换后的数据

const toggleDataMode = async () => {
  // 如果没有转换后的数据，先执行转换
  if (!hasTransformedData.value && !showOriginalData.value) {
    ElMessage.warning('请先执行数据转换')
    return
  }
  
  showOriginalData.value = !showOriginalData.value
  await loadPreviewData()
}

// 加载预览数据
const loadPreviewData = async () => {
  try {
    loading.value = true
    
    const response = await excelAnalyzeApi.previewData(
      props.sessionId,
      {
        page: currentPage.value,
        size: pageSize.value,
        includeOriginal: showOriginalData.value
      }
    )
    
    if (response) {
      previewData.value = response.previewData || []
      totalRows.value = response.totalRows || 0
      totalColumns.value = response.totalColumns || 0
      
      // 将API返回的统计信息映射到PreviewStatistics类型
      if (response.statistics) {
        statistics.value = {
          totalRows: response.totalRows || 0,
          validRows: response.statistics.successRows || 0,
          errorRows: response.statistics.errorRows || 0,
          warningRows: response.statistics.warningRows || 0
        }
      } else {
        statistics.value = {
          totalRows: response.totalRows || 0,
          validRows: response.totalRows || 0,
          errorRows: 0,
          warningRows: 0
        }
      }
      
      // 数据加载完成后，自动触发preview-complete事件
      if (totalRows.value > 0) {
        const summary = {
          statistics: statistics.value,
          transformSettings: transformSettings.value,
          previewComplete: true
        }
        emit('preview-complete', summary)
      }
    } else {
      ElMessage.error('加载预览数据失败')
    }
  } catch (error: any) {
    console.error('加载预览数据失败:', error)
    ElMessage.error('加载预览数据失败: ' + (error?.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

// 错误处理和恢复操作方法
const handleRetryPreview = async () => {
  previewError.value = null
  await loadPreviewData()
}

const handleResetPreview = async () => {
  previewError.value = null
  previewData.value = []
  statistics.value = {
    totalRows: 0,
    validRows: 0,
    errorRows: 0,
    warningRows: 0
  }
  await loadPreviewData()
}

const handleSkipErrors = async () => {
  previewError.value = null
  ElMessage.success('已跳过错误')
}

const handleRecoveryAction = (actionLabel: string) => {
  console.log(`恢复操作完成: ${actionLabel}`)
}

const handleErrorReport = (error: ExcelAnalyzeError) => {
  console.log('用户反馈错误:', error)
}

const handleApplyTransformSettings = async () => {
  showTransformSettings.value = false
  ElMessage.success('转换设置已保存')
}

const handleRowClick = (row: Record<string, any>, column: any, event: Event) => {
  selectedRow.value = row
  selectedRowIndex.value = previewData.value.indexOf(row)
  rowDetailVisible.value = true
}

const getRowFieldData = (row: Record<string, any>) => {
  return props.fieldMappings.map(mapping => ({
    fieldName: mapping.matchedField,
    fieldLabel: mapping.fieldInfo?.fieldLabel || mapping.matchedField,
    value: row[mapping.headerName || mapping.matchedField] || ''
  }))
}

const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  loadPreviewData()
}

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage
  loadPreviewData()
}

const handlePrev = () => {
  emit('prev-step')
}

const handleNext = () => {
  if (totalRows.value > 0) {
    const summary = {
      statistics: statistics.value,
      transformSettings: transformSettings.value,
      previewComplete: true
    }
    emit('preview-complete', summary)
    emit('next-step')
  }
}

// 数据转换弹窗方法
const addTransformRule = () => {
  const availableColumns = getAvailableColumns()
  if (availableColumns.length === 0) {
    ElMessage.warning('没有可用的列')
    return
  }

  // 优先选择字典类型的字段，如果没有则选择第一个可用字段
  const selectedColumn = availableColumns.find(col => col.isDict) || availableColumns[0]
  const defaultTransformType = selectedColumn.isDict ? 'dict' : 'format'

  transformRules.value.push({
    columnName: selectedColumn.value,
    transformType: defaultTransformType,
    enabled: true,
    transformMode: 'DEFAULT', // 默认使用默认模式
    manualMapping: '', // 手动映射字段
    // 其他转换类型的字段保持不变
    formatType: 'text',
    textBefore: '',
    textAfter: '',
    caseSensitive: false,
    replaceAll: true,
    dateFormat: '',
    dateValue: '',
    minValue: 0,
    maxValue: 100,
    decimalPlaces: 0,
    customRule: ''
  })
}

// 获取可用的列名选项（过滤掉已选择的列名）
const getAvailableColumns = (currentRow?: any) => {
  // 使用与tableHeaders相同的逻辑，保持列顺序一致
  const headers = tableHeaders.value
  
  // 获取所有已选择的列名（除了当前行）
  const selectedColumns = transformRules.value
    .filter((rule: any, index: number) => {
      // 如果是当前行，不排除它自己
      if (currentRow && rule === currentRow) {
        return false
      }
      return rule.columnName && rule.columnName.trim() !== ''
    })
    .map((rule: any) => rule.columnName)
  
  // 定义非字典类型列表
  const nonDictTypes = ['VARCHAR', 'string', 'INT', 'DECIMAL', 'DATE', 'DATETIME', 'TEXT', 'number', 'date', 'datetime', 'text']
  
  return headers
    .filter(col => !selectedColumns.includes(col)) // 过滤掉已选择的列名
    .map(col => {
      // 查找对应的字段映射信息
      const fieldMapping = props.fieldMappings.find(mapping => mapping.headerName === col)
      const dictType = fieldMapping?.dictType || ''
      
      // 判断是否为字典类型
      const isDict = !!dictType && 
                    dictType.trim() !== '' && 
                    !nonDictTypes.includes(dictType.toUpperCase())
      
      return {
        label: col,
        value: col,
        isDict: isDict,
        dictType: dictType,
        fieldMapping: fieldMapping
      }
    })
}

// 判断指定列名是否为字典类型
const isColumnDict = (columnName: string) => {
  if (!columnName) return false
  
  const fieldMapping = props.fieldMappings.find(mapping => mapping.headerName === columnName)
  if (!fieldMapping) return false
  
  const dictType = fieldMapping.dictType || ''
  const nonDictTypes = ['VARCHAR', 'string', 'INT', 'DECIMAL', 'DATE', 'DATETIME', 'TEXT', 'number', 'date', 'datetime', 'text']
  
  return !!dictType && 
         dictType.trim() !== '' && 
         !nonDictTypes.includes(dictType.toUpperCase())
}

const removeTransformRule = (index: number) => {
  transformRules.value.splice(index, 1)
}

const showDictMapping = (rule: any) => {
  // 移除不需要的字典映射弹窗相关的响应式数据和方法
}

// 加载字典数据
const loadDictData = async (dictType: string) => {
  try {
    // 这里应该调用后端API获取字典数据
    // 暂时使用模拟数据
    // dictDataList.value = [
    //   {
    //     sourceCode: dictType,
    //     sourceName: '示例数据源1',
    //     sourceType: 'CODE001',
    //     config: '示例代码1',
    //     aliases: '别名1,别名A,示例1'
    //   },
    //   {
    //     sourceCode: dictType,
    //     sourceName: '示例数据源2',
    //     sourceType: 'CODE002',
    //     config: '示例代码2',
    //     aliases: '别名2,别名B,示例2'
    //   }
    // ]
  } catch (error) {
    console.error('加载字典数据失败:', error)
    ElMessage.error('加载字典数据失败')
  }
}

const addDictMapping = () => {
  // 移除不需要的字典映射弹窗相关的响应式数据和方法
}

const removeDictMapping = (index: number) => {
  // 移除不需要的字典映射弹窗相关的响应式数据和方法
}

const saveDictMapping = () => {
  // 移除不需要的字典映射弹窗相关的响应式数据和方法
}

// 下载转换后的Excel文件
const handleDownloadTransformed = async () => {
  try {
    downloading.value = true
    
    // 调用后端API下载转换后的Excel文件
    const blob = await excelAnalyzeApi.downloadResult(props.sessionId, {
      fileName: `转换后数据_${new Date().toISOString().slice(0, 10)}.xlsx`,
      includeOriginal: false
    })
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `转换后数据_${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('Excel文件下载成功')
  } catch (error: any) {
    console.error('下载Excel文件失败:', error)
    ElMessage.error('下载Excel文件失败: ' + (error?.message || '未知错误'))
  } finally {
    downloading.value = false
  }
}

const applyTransformRules = async () => {
  if (transformRules.value.length === 0) {
    ElMessage.warning('请至少添加一条转换规则')
    return
  }

  try {
    applyingRules.value = true
    
    // 只处理启用的转换规则
    const enabledRules = transformRules.value.filter(rule => rule.enabled)
    
    // 构建转换规则JSON - 保持原始规则格式，让后端进行分类处理
    const processedRules = enabledRules.map(rule => {
      let finalRule = { ...rule }
      
      // 确保数字格式转换的字段正确
      if (rule.transformType === 'format' && rule.formatType === 'number') {
        finalRule = {
          ...rule,
          minValue: rule.minValue || 0,
          maxValue: rule.maxValue || 100,
          decimalPlaces: rule.decimalPlaces || 0
        }
      }
      
      // 确保文本格式转换的字段正确处理空值
      if (rule.transformType === 'format' && rule.formatType === 'text') {
        finalRule = {
          ...rule,
          textBefore: rule.textBefore || '', // 确保空值被处理为空字符串而不是null
          textAfter: rule.textAfter || '',   // 确保空值被处理为空字符串而不是null
          caseSensitive: rule.caseSensitive || false,
          replaceAll: rule.replaceAll !== false // 默认为true
        }
      }
      
      return finalRule
    })
    
    // 按转换类型分类处理规则
    const fieldMappingsWithRules = props.fieldMappings.map(mapping => {
      // 查找是否有对应的转换规则
      const rules = enabledRules.filter(r => r.columnName === mapping.headerName)
      
      if (rules.length === 0) {
        return {
          excelHeader: mapping.headerName || '',
          headerIndex: mapping.headerIndex || 0,
          targetField: mapping.fieldName || mapping.matchedField,
          fieldType: mapping.fieldInfo?.fieldType || 'VARCHAR',
          isRequired: mapping.isRequired || false,
          dictType: mapping.dictType,
          validationRules: mapping.validationRules,
          transformRules: '',
          skip: true
        }
      }
      
      // 处理字典转换规则
      const processedRules = rules.map(rule => {
        if (rule.transformType === 'dict') {
          const processedRule = { ...rule }
          
          // 如果是手动模式且有手动映射，解析映射字符串
          if (rule.transformMode === 'MANUAL' && rule.manualMapping) {
            const mappings: Record<string, string> = {}
            const mappingPairs = rule.manualMapping.split(',')
            mappingPairs.forEach((pair: string) => {
              const [key, value] = pair.split('=')
              if (key && value) {
                mappings[key.trim()] = value.trim()
              }
            })
            processedRule.dictMappings = mappings
          }
          
          return processedRule
        }
        return rule
      })
      
      // 直接传递处理后的规则数组，让后端进行层次化分类处理
      const transformRulesJson = JSON.stringify(processedRules)
      
      return {
        excelHeader: mapping.headerName || '',
        headerIndex: mapping.headerIndex || 0,
        targetField: mapping.fieldName || mapping.matchedField,
        fieldType: mapping.fieldInfo?.fieldType || 'string',
        isRequired: mapping.isRequired || false,
        dictType: mapping.dictType,
        validationRules: mapping.validationRules,
        // 传递分类后的转换规则
        transformRules: transformRulesJson,
        skip: false
      }
    }).filter(mapping => !mapping.skip) // 过滤掉没有转换规则的字段
    
    // 调用后端API，只传递有转换规则的字段
    const response = await excelAnalyzeApi.transformData({
      sessionId: props.sessionId,
      fieldMappings: fieldMappingsWithRules,
      validateOnly: false
    })
    
    ElMessage.success('转换规则已应用')
    
    // 关闭转换弹窗
    transformDialogVisible.value = false
    
    // 切换到转换后的数据模式
    showOriginalData.value = false
    hasTransformedData.value = true // 标记已转换
    
    // 刷新数据以显示转换后的结果
    await loadPreviewData()
  } catch (error: any) {
    ElMessage.error('应用转换规则失败: ' + (error?.message || '未知错误'))
  } finally {
    applyingRules.value = false
  }
}

// 查看字典方法
const handleViewDict = async (headerDisplay: any) => {
  try {
    // 优先使用props中的tableName，如果没有则从sessionId中提取
    let tableName = props.tableName || ''
    if (!tableName && props.sessionId && props.sessionId.includes('_')) {
      tableName = props.sessionId.split('_')[0]
    }
    
    if (!tableName) {
      ElMessage.error('无法获取表名信息')
      return
    }
    
    console.log('调用字典API，表名:', tableName, '字段名:', headerDisplay.fieldName)
    
    // 调用API获取字典数据
    const result = await excelAnalyzeApi.getDictData(
      tableName,
      headerDisplay.fieldName
    )
    
    // 更新字典信息
    dictInfo.value = {
      tableName: result.tableName,
      fieldName: result.fieldName,
      fieldLabel: result.fieldLabel,
      dictType: result.dictType
    }
    
    // 更新字典数据列表
    dictDataList.value = result.dictDataList || []
    
    // 显示弹窗
    dictDialogVisible.value = true
    
  } catch (error: any) {
    console.error('获取字典数据失败:', error)
    ElMessage.error('获取字典数据失败: ' + (error?.message || '未知错误'))
  }
}

// 生命周期
onMounted(() => {
  loadPreviewData()
})

// 监听props变化
watch(() => props.sessionId, (newSessionId) => {
  if (newSessionId) {
    loadPreviewData()
  }
})
</script>

<style scoped>
.data-preview-step {
  padding: 20px;
}

.preview-header {
  text-align: center;
  margin-bottom: 24px;

  h3 {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: #303133;
  }

  .description {
    margin: 0;
    color: #909399;
    font-size: 14px;
  }
}

.statistics-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  .stat-card {
    border: none;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;

      .stat-icon {
        font-size: 24px;
        color: #409eff;
        flex-shrink: 0;
      }

      .stat-content {
        flex: 1;
        text-align: center;

        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 12px;
          color: #909399;
          margin-top: 4px;
        }
      }
    }
  }
}

.preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.data-table-container {
  margin-top: 20px;
  
  .data-status-tip {
    margin-bottom: 15px;
    
    :deep(.el-alert) {
      border-radius: 6px;
    }
    
    :deep(.el-alert__title) {
      font-weight: 600;
    }
  }
  
  .preview-table {
    .cell-content {
      font-size: 13px;
      color: #606266;
      word-break: break-all;
    }
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

/* 数据转换弹窗样式 */
.transform-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    
    .el-dialog__header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px 8px 0 0;
      padding: 20px;
      cursor: move;
      user-select: none;
      
      .el-dialog__title {
        color: white;
        font-weight: 600;
        font-size: 16px;
      }
      
      .el-dialog__headerbtn {
        .el-dialog__close {
          color: white;
          font-size: 18px;
          
          &:hover {
            color: #f0f0f0;
          }
        }
      }
    }
    
    .el-dialog__body {
      padding: 20px;
      max-height: 70vh;
      overflow-y: auto;
    }
    
    .el-dialog__footer {
      border-top: 1px solid #e4e7ed;
      padding: 15px 20px;
      background-color: #f8f9fa;
      border-radius: 0 0 8px 8px;
    }
  }
}

.transform-dialog-content {
  .transform-description {
    margin-bottom: 20px;
  }

  .transform-rules {
    .rules-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      h4 {
        margin: 0;
        font-size: 16px;
        color: #303133;
      }
      
      .rules-info {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .rules-count {
          font-size: 14px;
          color: #606266;
          font-weight: 500;
          
          &:before {
            content: '📊 ';
            margin-right: 4px;
          }
        }
      }
    }

    .dict-preview {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .dict-item {
        background-color: #ecf5ff;
        color: #409eff;
        border-color: #d9ecff;
      }
    }

    .text-format-settings {
      margin-top: 10px;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 6px;
      border-left: 3px solid #409eff;

      .text-replace-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .replace-label {
          font-size: 13px;
          color: #606266;
          margin-right: 8px;
          min-width: 60px;
          font-weight: 500;
        }
      }

      .text-options {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid #e4e7ed;
        
        .el-checkbox {
          margin-right: 0;
        }
      }
    }
  }
}

/* 数字格式设置样式 */
.number-format-settings {
  margin-top: 10px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 6px;
  border-left: 3px solid #409eff;

  .number-range-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    .range-label {
      font-size: 13px;
      color: #606266;
      margin-right: 8px;
      min-width: 60px;
      font-weight: 500;
    }
  }

  .number-options {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e4e7ed;
    
    .el-radio-group {
      margin-right: 0;
    }
  }

  .number-preview {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e4e7ed;
  }
}

/* 文本格式设置样式 */
.text-format-settings {
  margin-top: 10px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #409eff;

  .text-replace-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    .replace-label {
      font-size: 13px;
      color: #606266;
      margin-right: 8px;
      min-width: 60px;
      font-weight: 500;
    }
  }

  .text-options {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e4e7ed;
    
    .el-checkbox {
      margin-right: 0;
    }
  }
}

/* 日期格式设置样式 */
.date-format-settings {
  margin-top: 8px;
  
  .date-format-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    
    .format-label {
      font-size: 13px;
      color: #606266;
      margin-right: 8px;
      min-width: 80px;
      font-weight: 500;
    }
  }
  
  .date-format-preview {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e4e7ed;
  }
}

/* 转换说明样式 */
.transform-description {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #409eff;
  margin-bottom: 16px;
}

/* 表头样式 */
.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
  width: 100%;
}

.dict-header {
  color: #409eff;
  font-weight: 600;
}

.dict-view-btn {
  margin-left: 4px;
  padding: 2px;
  min-width: 20px;
  height: 20px;
  
  .el-icon {
    font-size: 12px;
  }
}

/* 字典映射弹窗样式 */
.dict-mapping-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    
    .el-dialog__header {
      background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
      color: white;
      border-radius: 8px 8px 0 0;
      padding: 20px;
      cursor: move;
      user-select: none;
      
      .el-dialog__title {
        color: white;
        font-weight: 600;
        font-size: 16px;
      }
      
      .el-dialog__headerbtn {
        .el-dialog__close {
          color: white;
          font-size: 18px;
          
          &:hover {
            color: #f0f0f0;
          }
        }
      }
    }
    
    .el-dialog__body {
      padding: 20px;
      max-height: 60vh;
      overflow-y: auto;
    }
    
    .el-dialog__footer {
      border-top: 1px solid #e4e7ed;
      padding: 15px 20px;
      background-color: #f8f9fa;
      border-radius: 0 0 8px 8px;
    }
  }
}

.dict-mapping-content {
  .mapping-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    span {
      font-size: 15px;
      color: #303133;
    }
  }

  .mode-selector {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .default-mode, .manual-mode {
    margin-top: 15px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 6px;
    border-left: 3px solid #409eff;

    .dict-data-preview, .manual-mappings {
      margin-top: 15px;
    }

    h4 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #303133;
    }

    .dict-data-preview {
      .el-table {
        .el-table__header-wrapper th {
          background-color: #f0f9eb;
          color: #67c23a;
        }
        .el-table__body-wrapper .el-table__row {
          background-color: #f0f9eb;
        }
      }
    }

    .manual-mappings {
      .mappings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        span {
          font-size: 14px;
          color: #303133;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dict-config {
  .default-mode-info, .manual-mode-input {
    margin-top: 8px;
  }
  
  .manual-mode-input {
    .el-input {
      width: 100%;
    }
  }
}

/* 字典表头样式 */
.dict-header {
  color: #409eff !important;
  font-weight: 600;
  
  &::after {
    content: "（字典）";
    color: #67c23a;
    font-size: 12px;
    font-weight: normal;
    margin-left: 4px;
  }
}

/* 字典选项样式 */
.dict-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* 字典查看弹窗样式 */
.dict-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    
    .el-dialog__header {
      background: linear-gradient(135deg, #67c23a 0%, #409eff 100%);
      color: white;
      border-radius: 8px 8px 0 0;
      padding: 20px;
      cursor: move;
      user-select: none;
      
      .el-dialog__title {
        color: white;
        font-weight: 600;
        font-size: 16px;
      }
      
      .el-dialog__headerbtn {
        .el-dialog__close {
          color: white;
          font-size: 18px;
          
          &:hover {
            color: #f0f0f0;
          }
        }
      }
    }
    
    .el-dialog__body {
      padding: 20px;
      max-height: 70vh;
      overflow-y: auto;
    }
    
    .el-dialog__footer {
      border-top: 1px solid #e4e7ed;
      padding: 15px 20px;
      background-color: #f8f9fa;
      border-radius: 0 0 8px 8px;
    }
  }
}

.dict-dialog-content {
  .dict-info {
    margin-bottom: 20px;
    
    :deep(.el-descriptions) {
      .el-descriptions__label {
        font-weight: 600;
        color: #303133;
      }
      
      .el-descriptions__content {
        color: #606266;
      }
    }
  }

  .dict-data-table {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      h4 {
        margin: 0;
        font-size: 16px;
        color: #303133;
      }
      
      .data-count {
        font-size: 14px;
        color: #909399;
        font-weight: 500;
        
        &:before {
          content: '📊 ';
          margin-right: 4px;
        }
      }
    }
  }
}
</style>