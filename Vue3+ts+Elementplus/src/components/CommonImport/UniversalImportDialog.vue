<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.title"
    width="80%"
    :close-on-click-modal="false"
    style="max-height: 90vh; overflow-y: auto;"
    @close="handleClose"
  >
    <el-steps :active="currentStep" finish-status="success" class="import-steps" style="margin-bottom: 24px;">
      <el-step title="选择文件" description="上传Excel文件" />
      <el-step title="字段映射" description="配置字段映射关系" />
      <el-step title="数据预览" description="预览导入数据" />
      <el-step title="执行导入" description="开始导入数据" />
    </el-steps>

    <!-- 步骤1：文件选择 -->
    <div v-if="currentStep === 0">
      <el-card shadow="hover" style="margin-bottom: 24px;">
        <template #header>
          <span style="font-weight: bold; font-size: 16px;">选择Excel文件</span>
        </template>
        <div style="display: flex; gap: 16px; margin-bottom: 16px;">
          <el-button 
            type="primary" 
            :icon="Download" 
            @click="handleDownloadTemplate"
            :loading="templateLoading"
            style="flex-shrink: 0;"
          >
            下载导入模板
          </el-button>
          <div style="color: #909399; font-size: 13px; line-height: 32px;">
            下载标准格式的Excel模板，按照模板格式填写数据后上传
          </div>
        </div>
        <el-upload
          drag
          :action="''"
          :show-file-list="true"
          :auto-upload="false"
          :on-change="handleFileChange"
          :file-list="fileList"
          :limit="1"
          :on-exceed="handleExceed"
          :disabled="loading"
          accept=".xls,.xlsx"
          style="width: 100%;"
        >
          <el-icon style="font-size: 48px; color: #409EFF; margin-bottom: 8px;"><i-ep-upload-filled /></el-icon>
          <div class="el-upload__text" style="font-size: 16px; color: #666;">将Excel文件拖到此处，或<em style="color: #409EFF; cursor: pointer;">点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip" style="color: #999; font-size: 13px; margin-top: 8px;">
              请选择 .xls 或 .xlsx 格式的文件，文件大小不超过 10MB
            </div>
          </template>
          <template #file="{ file }">
            <div style="display: flex; align-items: center; font-size: 16px; font-weight: bold; color: #222; padding: 8px 0;">
              <el-icon style="color: #409EFF; margin-right: 6px;"><i-ep-document /></el-icon>
              <span>{{ file.name }}</span>
            </div>
          </template>
        </el-upload>
      </el-card>
      <div style="margin-top: 16px; text-align: right;">
        <el-button type="primary" size="large" :disabled="!fileisable " @click="nextStep">下一步</el-button>
        <el-button size="large" @click="handleClose">取消</el-button>
      </div>
    </div>

    <!-- 步骤2：字段映射专业分区界面 -->
    <div v-if="currentStep === 1">
      <el-row :gutter="24">
        <!-- 左侧说明与统计 -->
        <el-col :span="6">
          <el-card shadow="never" style="margin-bottom: 16px; height: 600px; overflow-y: auto;">
            <div style="color: #e6a23c; font-size: 15px; margin-bottom: 12px;">
              <el-icon style="margin-right: 4px;"><i-ep-info-filled /></el-icon>
              字段映射说明：
            </div>
            <div style="color: #d9001b; font-size: 13px; margin-bottom: 12px;">
              请为每个Excel列选择对应的系统字段，系统已根据规则自动匹配，支持手动调整。所有带*号为必填字段，必须配置映射或默认值。
            </div>
            <el-divider />
            <div style="font-weight: bold; margin-bottom: 8px;">必填字段映射状态：</div>
            <el-table :data="requiredFieldStatus" size="small" border style="margin-bottom: 8px;">
              <el-table-column label="序号" width="55" type="index" align="center" />
              <el-table-column prop="fieldLabel" label="字段名称" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <div v-if="row.status === '已映射'" style="display: flex; align-items: center; gap: 4px; color: #67c23a;">
                      <el-icon><i-ep-check /></el-icon>
                      <span style="font-size: 12px; font-weight: 500;">已映射</span>
                    </div>
                    <div v-else-if="row.status === '默认值'" style="display: flex; align-items: center; gap: 4px; color: #e6a23c;">
                      <el-icon><i-ep-warning /></el-icon>
                      <span style="font-size: 12px; font-weight: 500;">默认值</span>
                    </div>
                    <div v-else style="display: flex; align-items: center; gap: 4px; color: #f56c6c;">
                      <el-icon><i-ep-close /></el-icon>
                      <span style="font-size: 12px; font-weight: 500;">未映射</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="来源" width="140">
                <template #default="{ row }">
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <el-icon v-if="row.status === '已映射'" style="color: #67c23a; font-size: 14px;"><i-ep-link /></el-icon>
                    <el-icon v-else-if="row.status === '默认值'" style="color: #e6a23c; font-size: 14px;"><i-ep-setting /></el-icon>
                    <el-icon v-else style="color: #f56c6c; font-size: 14px;"><i-ep-info /></el-icon>
                    <span v-if="row.status === '已映射'" style="font-size: 12px; color: #67c23a; font-weight: 500;">{{ row.source }}</span>
                    <span v-else-if="row.status === '默认值'" style="font-size: 12px; color: #e6a23c; font-weight: 500;">{{ row.source }}</span>
                    <span v-else style="font-size: 12px; color: #f56c6c; font-weight: 500;">{{ row.source }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin: 8px 0;">
              <span style="color: #67c23a; font-weight: bold;">已映射 {{ mappedCount }}</span>
              <span v-if="defaultValueCount > 0" style="margin-left: 16px; color: #e6a23c; font-weight: bold;">默认值 {{ defaultValueCount }}</span>
              <span style="margin-left: 16px; color: #409EFF; font-weight: bold;">必填字段 {{ requiredFields.length }}</span>
            </div>
            <div v-if="unmappedRequiredCount > 0" style="color: #f56c6c; font-weight: bold;">未设置必填字段 {{ unmappedRequiredCount }}</div>
            <div v-else style="color: #67c23a; font-weight: bold;">所有必填字段已配置完成</div>
            <el-divider />
            <div style="font-weight: bold; margin-bottom: 8px;">Excel文件信息：</div>
            <div style="color: #409EFF; font-size: 13px; margin-bottom: 4px;">Excel表头数量: {{ headers.length }}</div>
            <div style="color: #409EFF; font-size: 13px; margin-bottom: 8px;">数据行数: {{ dataPreview.length }}</div>
          </el-card>
        </el-col>
        <!-- 右侧详细映射表格 -->
        <el-col :span="18">
          <el-card shadow="hover" style="height: 600px; overflow-y: auto;">
            <template #header>
              <span style="font-weight: bold; font-size: 16px;">Excel列映射</span>
            </template>
                        <el-table 
              :data="excelMappingTable" 
              size="small" 
              border 
              stripe 
              style="margin-bottom: 16px;"
              :max-height="getTableHeight()"
              :scrollbar-always-on="true"
            >
              <el-table-column label="序号" type="index" width="60" />
              <el-table-column label="Excel列名" prop="excelHeader" />
              <el-table-column label="数据预览" prop="preview">
                <template #default="{ row }">
                  <span style="color: #666;">{{ row.preview }}</span>
                </template>
              </el-table-column>
              <el-table-column label="映射到系统字段">
                <template #default="{ row }">
                  <el-select 
                      clearable
                    v-model="fieldMapping[row.excelHeader]" placeholder="请选择系统字段" style="width: 180px;">
                    <el-option
                      v-for="item in getAvailableFields(row.excelHeader)"
                      :key="item.fieldName"
                      :label="item.fieldLabel + (item.isRequired === 1 ? ' *' : '')"
                      :value="item.fieldName"
                    />
                  </el-select>
                  <div v-if="getFieldExample(fieldMapping[row.excelHeader])" style="color: #909399; font-size: 12px; margin-top: 2px;">
                    <el-icon style="font-size: 14px; margin-right: 2px;"><i-ep-lightning /></el-icon>
                    示例: {{ getFieldExample(fieldMapping[row.excelHeader]) }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 未映射字段默认值设置 -->
            <div v-if="unmappedRequiredFields.length > 0" style="margin-top: 16px;">
              <el-divider />
              <div style="font-weight: bold; margin-bottom: 12px; color: #e6a23c;">
                <el-icon style="margin-right: 4px;"><i-ep-setting /></el-icon>
                未映射字段默认值设置
              </div>
              <div style="color: #909399; font-size: 13px; margin-bottom: 12px;">
                以下{{ unmappedFieldsStats.total }}个字段在Excel中未找到对应列，将为导入数据统一设置如下值：
                <span v-if="unmappedFieldsStats.required > 0" style="color: #f56c6c;">（必填字段：{{ unmappedFieldsStats.required }}个）</span>
                <span v-if="unmappedFieldsStats.optional > 0" style="color: #909399;">（可选字段：{{ unmappedFieldsStats.optional }}个）</span>
              </div>
              <el-form :model="defaultValues" label-width="150px" size="small" style="max-height: 300px; overflow-y: auto;">
                <el-row :gutter="16">
                  <el-col :span="12" style="margin-bottom: 10px;" v-for="f in unmappedRequiredFields" :key="f.fieldName">
                    <el-form-item 
                      :label="getFieldLabel(f.fieldName) + (isAutoGeneratedField(f.fieldName) ? '' : (f.isRequired === 1 ? ' *' : ''))" 
                      :required="isAutoGeneratedField(f.fieldName) ? false : f.isRequired === 1"
                    >
                      <!-- 字典类型字段显示下拉选择 -->
                      <el-select 
                        v-if="f.dictType && f.dictType.trim()"
                        v-model="defaultValues[f.fieldName]" 
                        :placeholder="'请选择' + getFieldLabel(f.fieldName)"
                        size="small"
                        clearable
                        style="width: 100%;"
                        :class="{ 'is-required': !isAutoGeneratedField(f.fieldName) && f.isRequired === 1 && !defaultValues[f.fieldName] }"
                      >
                        <el-option
                          v-for="option in dictOptions[f.fieldName] || []"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
                      <!-- 普通字段显示输入框 -->
                      <el-input 
                        v-else
                        v-model="defaultValues[f.fieldName]" 
                        :placeholder="'请输入' + getFieldLabel(f.fieldName)"
                        size="small"
                        :class="{ 'is-required': !isAutoGeneratedField(f.fieldName) && f.isRequired === 1 && !defaultValues[f.fieldName] }"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div style="margin-top: 16px; text-align: right;">
        <el-button size="large" @click="prevStep">上一步</el-button>
        <el-button type="primary" size="large" :disabled="!isMappingValid" @click="nextStep">下一步</el-button>
        <el-button size="large" @click="handleClose">取消</el-button>
      </div>
    </div>

    <!-- 步骤3：数据预览 -->
    <div v-if="currentStep === 2">
      <el-card shadow="hover" style="margin-bottom: 24px;">
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold; font-size: 16px;">数据预览</span>
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="color: #909399; font-size: 13px;">
                预览前 {{ Math.min(dataPreview.length, 5) }} 行数据，共 {{ dataPreview.length }} 行
              </div>
              <el-button 
                type="primary" 
                size="small"
                :icon="Download" 
                @click="handleDownloadTransformedData"
                :loading="downloadLoading"
                :disabled="!mappedDataPreview.length"
              >
                下载转换后数据
              </el-button>
            </div>
          </div>
        </template>
        
        <!-- 映射后的数据预览表格 -->
        <el-table 
          :data="mappedDataPreview" 
          size="small" 
          max-height="300" 
          border 
          stripe
          style="margin-bottom: 16px;"
        >
          <el-table-column 
            v-for="column in previewColumns" 
            :key="column.prop" 
            :prop="column.prop" 
            :label="column.label"
            :width="column.width"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span v-if="row[column.prop] !== undefined && row[column.prop] !== null" 
                    :style="{ color: column.isDefault ? '#e6a23c' : '#333' }">
                {{ row[column.prop] }}
              </span>
              <span v-else style="color: #c0c4cc; font-style: italic;">-</span>
              <!-- 显示默认值标识 -->
              <el-tag v-if="column.isDefault" size="small" type="warning" style="margin-left: 8px;">
                默认值
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 映射统计信息 -->
        <div style="background: #f5f7fa; padding: 12px; border-radius: 4px; margin-top: 16px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #333;">映射统计：</div>
          <el-row :gutter="16">
            <el-col :span="6">
              <div style="text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #67c23a;">{{ mappedFieldsCount }}</div>
                <div style="color: #909399; font-size: 13px;">已映射字段</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div style="text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #e6a23c;">{{ defaultValueFieldsCount }}</div>
                <div style="color: #909399; font-size: 13px;">默认值字段</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div style="text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #409EFF;">{{ totalSystemFieldsCount }}</div>
                <div style="color: #909399; font-size: 13px;">系统字段总数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div style="text-align: center;">
                <div style="font-size: 20px; font-weight: bold; color: #333;">{{ dataPreview.length }}</div>
                <div style="color: #909399; font-size: 13px;">数据行数</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <div style="margin-top: 16px; text-align: right;">
        <el-button size="large" @click="prevStep">上一步</el-button>
        <el-button type="primary" size="large" @click="nextStep">下一步</el-button>
        <el-button size="large" @click="handleClose">取消</el-button>
      </div>
    </div>

    <!-- 步骤4：执行导入 -->
    <div v-if="currentStep === 3">
      <el-card shadow="hover" style="margin-bottom: 24px;">
        <template #header>
          <span style="font-weight: bold; font-size: 16px;">执行导入</span>
        </template>
        <div style="display: flex; align-items: center; flex-direction: column; margin: 32px 0;">
          <el-progress
            :key="'progress-' + progressKey"
            :percentage="importProgress"
            :status="importStatus"
            :stroke-width="24"
            color="#409EFF"
            style="width: 80%; margin-bottom: 16px;"
            :show-text="true"
          >
            <template #format="{ percentage }">
              <span style="font-size: 18px; font-weight: bold; color: #409EFF;">{{ percentage }}%</span>
            </template>
          </el-progress>
          <div style="font-size: 16px; color: #666; margin-bottom: 8px;">{{ importStatusText }}</div>
        </div>
        <div v-if="importResult">
          <el-result
            :icon="importResult.success ? 'success' : 'error'"
            :title="importResult.success ? '导入成功' : '导入失败'"
            :sub-title="importResult.message"
          >
            <template #extra>
              <div style="font-size: 15px; color: #333;">
                <p>总行数：{{ importResult.totalRows }}</p>
                <p>成功行数：{{ importResult.successRows }}</p>
                <p>失败行数：{{ importResult.failedRows }}</p>
                
                <!-- 添加错误详情展示 -->
                <div v-if="importResult.errorDetails && importResult.errorDetails.length > 0" style="margin-top: 16px;">
                  <el-collapse>
                    <el-collapse-item title="查看错误详情" name="errorDetails">
                      <div style="min-height: 120px; max-height: 350px; overflow-y: auto;">
                        <el-alert
                          v-for="(error, index) in importResult.errorDetails"
                          :key="index"
                          type="error"
                          :title="error"
                          :closable="false"
                          style="margin-bottom: 8px; font-size: 13px;"
                          show-icon
                        />
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
            </template>
          </el-result>
        </div>
      </el-card>
      <div style="margin-top: 16px; text-align: right;">
        <el-button size="large" @click="prevStep">上一步</el-button>
        <el-button type="primary" size="large" :loading="loading" @click="handleImport" :disabled="importing">开始导入</el-button>
        <el-button size="large" @click="handleClose">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { CommonImportAPI } from '@/api-data/data/data_base/common/import'
 
 
const fileisable = ref(false)
const props = defineProps({
  tableName: { type: String, required: true },
  title: { type: String, default: '数据导入' },
  advancedConfig: { type: Object, default: () => ({}) }
})

const dialogVisible = ref(false)
const currentStep = ref(0)
const file = ref<File | null>(null)
const fileList = ref<any[]>([])
const headers = ref<string[]>([])
const dataPreview = ref<any[]>([])
const mappingResult = ref<Record<string, any[]>>({})
const fieldMapping = ref<Record<string, string>>({})
const defaultValues = ref<Record<string, string>>({})
const requiredFields = ref<string[]>([])
const systemFields = ref<any[]>([])
const loading = ref(false)
const importProgress = ref(0)
const importStatus = ref<'success' | 'exception' | 'warning'>('success')
const importStatusText = ref('准备导入...')
const importResult = ref<any>(null)
const importing = ref(false)
const templateLoading = ref(false)
const downloadLoading = ref(false)
const dictOptions = ref<Record<string, any[]>>({})
const progressKey = ref(0) // 添加进度条重置key

// 上传文件时只保存file，不解析
const handleFileChange = (fileObj: any, fileListArr: any[]) => {
  // 只保留最新的一个文件
  file.value = fileObj.raw
  fileList.value = [fileObj]
  
  fileisable.value = true
}
const handleExceed = (files: any[], fileListArr: any[]) => {
  // 超过1个时只保留最新
  fileList.value = [files[files.length - 1]]
  file.value =fileList.value[0].raw
  fileisable.value = true

  ElMessage.warning('只能上传一个文件，已自动替换为最新文件')
  
}

// 下载导入模板
const handleDownloadTemplate = async () => {
  templateLoading.value = true
  try {
    await CommonImportAPI.downloadFieldTemplate(props.tableName, props.title || '数据表')
  } catch (e: any) {
    ElMessage.error('模板下载失败：' + (e.message || '未知错误'))
  } finally {
    templateLoading.value = false
  }
}

// 下载转换后的数据
const handleDownloadTransformedData = async () => {
  if (!file.value) {
    ElMessage.warning('没有可下载的转换后数据')
    return
  }
  
  downloadLoading.value = true
  try {
    // 准备下载数据
    const downloadData = {
      tableName: props.tableName,
      tableLabel: props.title || '数据表',
      headers: previewColumns.value.map(col => col.label),
      fieldMapping: fieldMapping.value,
      defaultValues: defaultValues.value
    }
    
    // 调用后端API下载转换后的数据（传递文件，让后端处理完整数据）
    await CommonImportAPI.downloadTransformedData(downloadData, file.value)
    
    ElMessage.success(`转换后数据下载成功`)
  } catch (e: any) {
    ElMessage.error('下载失败：' + (e.message || '未知错误'))
  } finally {
    downloadLoading.value = false
  }
}

const open = async () => {
  // 先重置所有状态
  reset()
  
  // 使用nextTick确保DOM更新后再显示对话框
  await nextTick()
  
  dialogVisible.value = true
  
  // 每次打开对话框时自动获取系统字段配置
  try {
    await fetchSystemFields()
  } catch (e: any) {
    ElMessage.error('获取系统字段配置失败：' + (e.message || '未知错误'))
  }
}
const handleClose = () => {
  dialogVisible.value = false
  reset()
}
const reset = () => {
  currentStep.value = 0
  file.value = null
  fileList.value = []
  headers.value = []
  dataPreview.value = []
  mappingResult.value = {}
  fieldMapping.value = {}
  defaultValues.value = {}
  requiredFields.value = []
  systemFields.value = []
  dictOptions.value = {}
  
  // 强制重置进度条相关状态
  importProgress.value = 0
  importStatus.value = 'success'
  importStatusText.value = '准备导入...'
  importResult.value = null
  importing.value = false
  
  // 强制重新渲染进度条组件
  progressKey.value = Date.now()
  
  // 添加文件上传状态重置
  fileisable.value = false
  
  // 重置下载状态
  downloadLoading.value = false
}

// 点击下一步时才解析Excel
const nextStep = async () => {
  if (currentStep.value === 0) {
    if (!file.value) {
      ElMessage.error('请先选择Excel文件')
      return
    }
    loading.value = true
    try {
      const res = await CommonImportAPI.parseExcelHeaders(props.tableName, file.value) as any
      headers.value = res.headers || []
      dataPreview.value = res.dataPreview || []
      // 解析Excel后自动获取字段映射
      await fetchAutoMapping()
      currentStep.value++
    } catch (e: any) {
      ElMessage.error(e.message || 'Excel解析失败')
    }
    loading.value = false
    return
  }
  currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
}

const fetchSystemFields = async () => {
  const res = await CommonImportAPI.getSystemFieldsWithMatchRules(props.tableName) as any
  systemFields.value = res || []
  // 排除自动生成字段的必填控制
  const autoGeneratedFields = ['ZJSJWYXBS', 'SJCJSJ'] // 主键数据唯一性标识、数据采集时间
  requiredFields.value = systemFields.value
    .filter(f => f.isRequired === 1 && !autoGeneratedFields.includes(f.fieldName))
    .map(f => f.fieldName)
  console.log('系统字段数据:', systemFields.value);
  console.log('字段排序信息:', systemFields.value.map(f => ({ fieldName: f.fieldName, fieldLabel: f.fieldLabel, sortOrder: f.sortOrder })));
  
  // 获取字典类型字段的选项
  await fetchDictOptions()
}

// 获取字典选项
const fetchDictOptions = async () => {
  console.log('系统字段数据:', systemFields.value);
  
  // 使用 dictType（驼峰命名，与后端返回的数据结构一致）
  const dictFields = systemFields.value.filter(f => f.dictType && f.dictType.trim())
  console.log('字典类型字段:', dictFields);
  
  for (const field of dictFields) {
    try {
      const options = await CommonImportAPI.getDictOptions(field.dictType) as any
      console.log("11111111111111111");
      
      console.log(options);
      
      dictOptions.value[field.fieldName] = options || []
      console.log(`字典选项 [${field.dictType}]:`, options)
    } catch (e: any) {
      console.warn(`获取字典选项失败 [${field.dictType}]:`, e.message)
      dictOptions.value[field.fieldName] = []
    }
  }
}
const fetchAutoMapping = async () => {
  if (!headers.value.length) return
  
  loading.value = true
  try {
    // 调用我们创建的智能映射API
    const res = await CommonImportAPI.batchGetMappingSuggestions(props.tableName, headers.value)
    
    if (res && res.data) {
      const mappingResults = res.data.mappingResults || {}
      const autoMappedFields = res.data.autoMappedFields || {}
      
      // 保存完整的映射结果供用户选择
      mappingResult.value = mappingResults
      
      // 自动填入最佳匹配的字段
      headers.value.forEach(header => {
        // 优先使用自动映射的结果
        if (autoMappedFields[header]) {
          fieldMapping.value[header] = autoMappedFields[header].fieldName
        } else if (mappingResults[header] && mappingResults[header].length > 0) {
          // 如果没有自动映射，但有建议，选择置信度最高的
          const bestSuggestion = mappingResults[header][0]
          if (bestSuggestion.confidence >= 70) { // 置信度阈值
            fieldMapping.value[header] = bestSuggestion.fieldName
          }
        }
      })
      
      // 显示映射统计信息
      const mappedCount = Object.keys(fieldMapping.value).filter(key => fieldMapping.value[key]).length
      const matchRate = res.data.matchRate || 0
      
      ElMessage.success(`智能映射完成！成功映射 ${mappedCount}/${headers.value.length} 个字段，匹配率 ${matchRate.toFixed(1)}%`)
      
    }
  } catch (e: any) {
    console.warn('智能自动映射失败：', e.message || '未知错误')
    ElMessage.warning('智能映射失败，请手动配置字段映射')
    // 自动映射失败不影响用户手动映射
  } finally {
    loading.value = false
  }
}
const isMappingValid = computed(() =>
  requiredFields.value.every(f =>
    Object.values(fieldMapping.value).includes(f) || defaultValues.value[f]
  )
)
const handleImport = async () => {
  if (!isMappingValid.value) {
    ElMessage.error('请映射所有必填字段或填写默认值')
    return
  }
  if (!file.value) {
    ElMessage.error('请先上传Excel文件')
    return
  }
  importing.value = true
  importProgress.value = 0
  importStatus.value = 'success'
  importStatusText.value = '开始导入...'
  try {
    // 模拟进度
    const progressTimer = setInterval(() => {
      if (importProgress.value < 90) {
        importProgress.value += 10
        importStatusText.value = `正在导入数据... ${importProgress.value}%`
      }
    }, 200)
    const importConfig = {
      fieldMapping: fieldMapping.value,
      unmappedFieldsDefaults: defaultValues.value || {}
    }
    const res = await CommonImportAPI.importWithMapping(props.tableName, file.value, importConfig)
    clearInterval(progressTimer)
    importProgress.value = 100
    importStatusText.value = '导入完成'
    importResult.value = res
    if (res.success) {
      importStatus.value = 'success'
      ElMessage.success('导入成功：' + res.successRows + '条')
    } else {
      importStatus.value = 'exception'
      ElMessage.error('导入失败：' + (res.message || '未知错误'))
    }
  } catch (e: any) {
    importStatus.value = 'exception'
    importStatusText.value = '导入失败'
    ElMessage.error(e.message || '导入失败')
  }
  importing.value = false
}
defineExpose({ open })

// 字段映射表格数据
const excelMappingTable = computed(() =>
  headers.value.map((h, idx) => ({
    excelHeader: h,
    preview: dataPreview.value[0] ? dataPreview.value[0][h] : ''
  }))
)
// 必填字段状态统计
const requiredFieldStatus = computed(() =>
  requiredFields.value.map(f => {
    const mapped = Object.values(fieldMapping.value).includes(f)
    const mappedFrom = mapped ? getMappedFrom(f) : null
    const hasDefaultValue = defaultValues.value[f]
    
    return {
      fieldLabel: getFieldLabel(f),
      status: mapped ? '已映射' : (hasDefaultValue ? '默认值' : '未映射'),
      source: mapped ? (mappedFrom ? `来自: ${mappedFrom}` : '映射') : (hasDefaultValue ? '默认值' : '未设置')
    }
  })
)
const mappedCount = computed(() =>
  requiredFieldStatus.value.filter(f => f.status === '已映射').length
)
const defaultValueCount = computed(() =>
  requiredFieldStatus.value.filter(f => f.status === '默认值').length
)
const unmappedRequiredCount = computed(() =>
  requiredFieldStatus.value.filter(f => f.status === '未映射').length
)
const unmappedRequiredFields = computed(() =>
  (systemFields.value || []).filter(f => !Object.values(fieldMapping.value).includes(f.fieldName))
)

// 未映射字段统计
const unmappedFieldsStats = computed(() => {
  const unmapped = unmappedRequiredFields.value
  
  // 排除自动生成字段的必填控制
  const autoGeneratedFields = ['ZJSJWYXBS', 'SJCJSJ'] // 主键数据唯一性标识、数据采集时间
  
  const required = unmapped.filter(f => {
    // 自动生成字段不算必填
    if (autoGeneratedFields.includes(f.fieldName)) {
      return false
    }
    return f.isRequired === 1
  })
  
  const optional = unmapped.filter(f => {
    // 自动生成字段算可选
    if (autoGeneratedFields.includes(f.fieldName)) {
      return true
    }
    return f.isRequired !== 1
  })
  
  return {
    total: unmapped.length,
    required: required.length,
    optional: optional.length
  }
})
// 获取字段中文名
function getFieldLabel(fieldName: string) {
  const f = systemFields.value.find(f => f.fieldName === fieldName)
  return f ? f.fieldLabel : fieldName
}
// 获取字段示例
function getFieldExample(fieldName: string) {
  const f = systemFields.value.find(f => f.fieldName === fieldName)
  return f ? f.fieldExample : ''
}

// 判断是否为自动生成字段
function isAutoGeneratedField(fieldName: string) {
  const autoGeneratedFields = ['ZJSJWYXBS', 'SJCJSJ'] // 主键数据唯一性标识、数据采集时间
  return autoGeneratedFields.includes(fieldName)
}

// 获取可用的系统字段（排除已选择的字段）
function getAvailableFields(currentExcelHeader: string) {
  const selectedFields = Object.values(fieldMapping.value).filter(field => field && field !== fieldMapping.value[currentExcelHeader])
  return systemFields.value.filter(field => !selectedFields.includes(field.fieldName))
}

// 获取字段映射来源（哪个Excel列映射到了这个系统字段）
function getMappedFrom(systemFieldName: string) {
  for (const [excelHeader, mappedField] of Object.entries(fieldMapping.value)) {
    if (mappedField === systemFieldName) {
      return excelHeader
    }
  }
  return null
}

// 动态计算表格高度
function getTableHeight() {
  const baseHeight = 150 // 基础高度（表头+边距）
  const rowHeight = 45 // 每行高度（包含边框）
  const maxHeight = 400 // 最大高度（为默认值设置留出空间）
  const minHeight = 120 // 最小高度
  
  // 根据数据行数动态调整高度
  const rowCount = excelMappingTable.value.length
  const calculatedHeight = baseHeight + (rowCount * rowHeight)
  
  // 限制在最小和最大高度之间
  return Math.min(Math.max(calculatedHeight, minHeight), maxHeight)
}
// 数据预览相关计算属性
// 映射后的数据预览（前5行）
const mappedDataPreview = computed(() => {
  const previewData = dataPreview.value.slice(0, 5)
  
  return previewData.map(row => {
    const mappedRow: Record<string, any> = {}
    
    // 直接遍历systemFields（后端已按sort_order排序）
    systemFields.value.forEach(field => {
      const systemField = field.fieldName
      
      // 检查是否已映射
      const mappedFrom = Object.keys(fieldMapping.value).find(key => fieldMapping.value[key] === systemField)
      if (mappedFrom) {
        // 已映射，从Excel数据中获取
        mappedRow[systemField] = row[mappedFrom]
      } else if (defaultValues.value[systemField]) {
        // 未映射但有默认值
        mappedRow[systemField] = defaultValues.value[systemField]
      } else if (isAutoGeneratedField(systemField)) {
        // 自动生成字段，显示提示信息
        if (systemField === 'ZJSJWYXBS') {
          mappedRow[systemField] = '[自动生成唯一编码]'
        } else if (systemField === 'SJCJSJ') {
          mappedRow[systemField] = '[自动生成采集时间]'
        }
      }
    })
    
    return mappedRow
  })
})

// 预览表格的列配置
const previewColumns = computed(() => {
  const columns: Array<{
    prop: string
    label: string
    width?: string
    isDefault: boolean
  }> = []
  
  // 直接遍历systemFields（后端已按sort_order排序）
  systemFields.value.forEach(field => {
    const systemField = field.fieldName
    
    // 检查是否已映射或有默认值
    const isMapped = Object.values(fieldMapping.value).includes(systemField)
    const hasDefaultValue = Boolean(defaultValues.value[systemField])
    const isAutoGenerated = isAutoGeneratedField(systemField)
    
    // 显示所有字段，包括自动生成字段
    if (isMapped || hasDefaultValue || isAutoGenerated) {
      columns.push({
        prop: systemField,
        label: field.fieldLabel,
        isDefault: hasDefaultValue && !isMapped
      })
    }
  })
  
  return columns
})

// 映射统计
const mappedFieldsCount = computed(() => {
  return Object.values(fieldMapping.value).filter(field => field).length
})

const defaultValueFieldsCount = computed(() => {
  return Object.keys(defaultValues.value).filter(key => defaultValues.value[key]).length
})

const totalSystemFieldsCount = computed(() => {
  return systemFields.value.length
})

onMounted(() => {
 
})
// 只展示前3条数据
const simplePreviewTable = computed(() => dataPreview.value.slice(0, 3))
</script>

<style lang="scss" scoped>
.import-container {
  .import-steps {
    margin-bottom: 30px;
  }
  
  .step-content {
    min-height: 400px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .file-upload-card {
    .el-upload {
      width: 100%;
    }
  }
  
  .mapping-card {
    .header-actions {
      display: flex;
      gap: 10px;
    }
    
    .mapping-content {
      .mapping-table {
        margin-bottom: 20px;
      }
      
      .unmapped-fields {
        border-top: 1px solid #ebeef5;
        padding-top: 20px;
        
        h4 {
          margin-bottom: 15px;
          color: #606266;
        }
      }
    }
  }
  
  .preview-card {
    .preview-info {
      color: #909399;
      font-size: 14px;
    }
  }
  
  .import-card {
    .import-progress {
      text-align: center;
      margin-bottom: 30px;
      
      .progress-text {
        margin-top: 10px;
        color: #606266;
      }
    }
    
    .import-result {
      .result-details {
        text-align: left;
        
        p {
          margin: 5px 0;
          color: #606266;
        }
      }
    }
  }
}

.dialog-footer {
  text-align: right;
}

// 必填字段样式优化
:deep(.el-form-item.is-required .el-form-item__label::before) {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

:deep(.is-required) {
  .el-input__inner {
    border-color: #f56c6c;
  }
}

:deep(.el-form-item.is-required .el-form-item__label) {
  color: #f56c6c;
  font-weight: 500;
}

// 非必填字段样式
:deep(.el-form-item:not(.is-required) .el-form-item__label) {
  color: #606266;
  font-weight: normal;
}
</style> 