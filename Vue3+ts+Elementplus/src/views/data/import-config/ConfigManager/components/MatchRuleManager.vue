<template>
  <div class="match-rule-manager">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-button type="primary" @click="openDialog()" :disabled="!tableName">
            <el-icon><Plus /></el-icon>
            新增匹配规则
          </el-button>
          <span class="header-title">匹配规则管理</span>
          <div class="table-info" v-if="tableName">
            <el-tag type="info">当前表：{{ tableName }}</el-tag>
          </div>
        </div>
      </template>

      <div v-if="!tableName" class="no-table-selected">
        <el-empty description="请先在导入配置页面选择一个表进行匹配规则配置" />
      </div>

      <div v-else>
        <!-- 查询表单 -->
        <el-form :inline="true" :model="query" class="query-form">
          <el-form-item label="字段名">
            <el-input v-model="query.fieldName" placeholder="请输入字段名" clearable />
          </el-form-item>
          <el-form-item label="匹配策略">
            <el-select v-model="query.matchStrategy" placeholder="全部" clearable>
              <el-option label="精确匹配" value="exact" />
              <el-option label="模糊匹配" value="fuzzy" />
              <el-option label="拼音匹配" value="pinyin" />
              <el-option label="语义匹配" value="semantic" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="query.enableStatus" placeholder="全部" clearable>
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 数据表格 -->
        <el-table :data="list" border stripe v-loading="loading">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="fieldName" label="系统字段" min-width="120" />
          <el-table-column prop="fieldLabel" label="字段中文名" min-width="150" />
          <el-table-column prop="matchPatterns" label="匹配模式" min-width="200">
            <template #default="{ row }">
              <div class="match-patterns">
                <el-tag
                  v-for="(pattern, index) in parseMatchPatterns(row.matchPatterns)"
                  :key="index"
                  size="small"
                  type="primary"
                  style="margin-right: 4px; margin-bottom: 4px;"
                >
                  {{ pattern }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="matchPriority" label="优先级" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="getPriorityType(row.matchPriority)" size="small">
                {{ row.matchPriority }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="exactMatch" label="精确匹配" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.exactMatch ? 'success' : 'warning'" size="small">
                {{ row.exactMatch ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="matchStrategy" label="匹配策略" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStrategyType(row.matchStrategy)" size="small">
                {{ getStrategyLabel(row.matchStrategy) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="confidenceThreshold" label="置信度" width="100" align="center">
            <template #default="{ row }">
              <el-progress
                :percentage="row.confidenceThreshold"
                :color="getConfidenceColor(row.confidenceThreshold)"
                :stroke-width="6"
                text-inside
              />
            </template>
          </el-table-column>
          <el-table-column prop="enableStatus" label="状态" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enableStatus === 1 ? 'success' : 'info'">
                {{ row.enableStatus === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="openDialog(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pageNum"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[20, 50, 100, 200]"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editData ? '编辑匹配规则' : '新增匹配规则'"
      width="600px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="系统字段" prop="fieldName">
          <el-select v-model="form.fieldName" placeholder="请选择系统字段" :disabled="!!editData">
            <el-option
              v-for="field in systemFields"
              :key="field.fieldName"
              :label="field.fieldLabel"
              :value="field.fieldName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="匹配模式" prop="matchPatterns">
          <div class="match-patterns-input">
            <el-tag
              v-for="(pattern, index) in form.matchPatternsList"
              :key="index"
              closable
              @close="removePattern(index)"
              style="margin-right: 8px; margin-bottom: 8px;"
            >
              {{ pattern }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="inputRef"
              v-model="inputValue"
              size="small"
              style="width: 120px;"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else size="small" @click="showInput">+ 添加模式</el-button>
          </div>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="匹配优先级" prop="matchPriority">
              <el-input-number v-model="form.matchPriority" :min="1" :max="10" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="置信度阈值" prop="confidenceThreshold">
              <el-input-number v-model="form.confidenceThreshold" :min="0" :max="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="精确匹配">
              <el-switch v-model="form.exactMatch" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="匹配策略" prop="matchStrategy">
              <el-select v-model="form.matchStrategy" placeholder="请选择匹配策略">
                <el-option label="精确匹配" value="exact" />
                <el-option label="模糊匹配" value="fuzzy" />
                <el-option label="拼音匹配" value="pinyin" />
                <el-option label="语义匹配" value="semantic" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态">
          <el-switch v-model="form.enableStatus" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

// Props定义
interface Props {
  tableName: string
}

const props = defineProps<Props>()

// 匹配规则VO接口
interface MatchRuleVO {
  id?: number
  tableName: string
  fieldName: string
  fieldLabel: string
  matchPatterns: string
  matchPriority: number
  exactMatch: number
  matchStrategy: string
  confidenceThreshold: number
  enableStatus: number
}

// 系统字段接口
interface SystemField {
  fieldName: string
  fieldLabel: string
}

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const editData = ref<MatchRuleVO | null>(null)
const formRef = ref<FormInstance>()
const inputRef = ref()
const inputVisible = ref(false)
const inputValue = ref('')

const query = reactive({
  fieldName: '',
  matchStrategy: '',
  enableStatus: undefined as number | undefined
})

const list = ref<MatchRuleVO[]>([])
const systemFields = ref<SystemField[]>([])
const pageNum = ref(1)
const pageSize = ref(20)
const total = ref(0)

const form = ref<Partial<MatchRuleVO & { matchPatternsList: string[] }>>({
  tableName: '',
  fieldName: '',
  matchPatterns: '',
  matchPatternsList: [],
  matchPriority: 1,
  exactMatch: 1,
  matchStrategy: 'exact',
  confidenceThreshold: 80,
  enableStatus: 1
})

// 表单验证规则
const rules = {
  fieldName: [{ required: true, message: '请选择系统字段', trigger: 'change' }],
  matchPatterns: [{ required: true, message: '请添加匹配模式', trigger: 'blur' }],
  matchPriority: [{ required: true, message: '请输入匹配优先级', trigger: 'blur' }],
  matchStrategy: [{ required: true, message: '请选择匹配策略', trigger: 'change' }],
  confidenceThreshold: [{ required: true, message: '请输入置信度阈值', trigger: 'blur' }]
}

// 监听tableName变化
watch(() => props.tableName, (newTableName) => {
  if (newTableName) {
    resetQuery()
    fetchSystemFields()
  }
}, { immediate: true })

// 获取系统字段列表
const fetchSystemFields = async () => {
  if (!props.tableName) return
  
  try {
    // TODO: 调用获取系统字段API
    // const res = await getSystemFields(props.tableName)
    // systemFields.value = res.data || []
    
    // 临时模拟数据
    systemFields.value = [
      { fieldName: 'schoolCode', fieldLabel: '学校代码' },
      { fieldName: 'schoolName', fieldLabel: '学校名称' },
      { fieldName: 'schoolType', fieldLabel: '学校类型' },
      { fieldName: 'provinceCode', fieldLabel: '省份代码' },
      { fieldName: 'provinceName', fieldLabel: '省份名称' }
    ]
  } catch (error) {
    ElMessage.error('获取系统字段失败')
  }
}

// 解析匹配模式
const parseMatchPatterns = (patterns: string): string[] => {
  try {
    return JSON.parse(patterns) || []
  } catch {
    return []
  }
}

// 获取优先级类型
const getPriorityType = (priority: number) => {
  if (priority === 1) return 'danger'
  if (priority <= 3) return 'warning'
  return 'info'
}

// 获取策略类型
const getStrategyType = (strategy: string) => {
  const typeMap: Record<string, string> = {
    exact: 'success',
    fuzzy: 'warning',
    pinyin: 'info',
    semantic: 'danger'
  }
  return typeMap[strategy] || 'info'
}

// 获取策略标签
const getStrategyLabel = (strategy: string) => {
  const labelMap: Record<string, string> = {
    exact: '精确',
    fuzzy: '模糊',
    pinyin: '拼音',
    semantic: '语义'
  }
  return labelMap[strategy] || strategy
}

// 获取置信度颜色
const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return '#67c23a'
  if (confidence >= 70) return '#e6a23c'
  return '#f56c6c'
}

// 获取列表数据
const getList = async () => {
  if (!props.tableName) return
  
  loading.value = true
  try {
    // TODO: 调用匹配规则API
    // const res = await pageMatchRule({
    //   pageNum: pageNum.value,
    //   pageSize: pageSize.value,
    //   tableName: props.tableName,
    //   fieldName: query.fieldName,
    //   matchStrategy: query.matchStrategy,
    //   enableStatus: query.enableStatus
    // })
    // list.value = res.data.records
    // total.value = res.data.total
    
    // 临时模拟数据
    list.value = []
    total.value = 0
    ElMessage.info('匹配规则API待实现')
  } catch (error) {
    ElMessage.error('获取匹配规则失败')
  } finally {
    loading.value = false
  }
}

// 重置查询
const resetQuery = () => {
  query.fieldName = ''
  query.matchStrategy = ''
  query.enableStatus = undefined
  pageNum.value = 1
  getList()
}

// 打开对话框
const openDialog = (row?: MatchRuleVO) => {
  if (row) {
    editData.value = { ...row }
    form.value = { 
      ...row,
      matchPatternsList: parseMatchPatterns(row.matchPatterns)
    }
  } else {
    editData.value = null
    form.value = {
      tableName: props.tableName,
      fieldName: '',
      matchPatterns: '',
      matchPatternsList: [],
      matchPriority: 1,
      exactMatch: 1,
      matchStrategy: 'exact',
      confidenceThreshold: 80,
      enableStatus: 1
    }
  }
  dialogVisible.value = true
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  inputVisible.value = false
  inputValue.value = ''
}

// 显示输入框
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 添加匹配模式
const handleInputConfirm = () => {
  if (inputValue.value && !form.value.matchPatternsList?.includes(inputValue.value)) {
    form.value.matchPatternsList?.push(inputValue.value)
    form.value.matchPatterns = JSON.stringify(form.value.matchPatternsList)
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 移除匹配模式
const removePattern = (index: number) => {
  form.value.matchPatternsList?.splice(index, 1)
  form.value.matchPatterns = JSON.stringify(form.value.matchPatternsList)
}

// 提交表单
const handleSubmit = () => {
  if (!form.value.matchPatternsList || form.value.matchPatternsList.length === 0) {
    ElMessage.warning('请至少添加一个匹配模式')
    return
  }
  
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    
    loading.value = true
    try {
      // 更新匹配模式JSON
      form.value.matchPatterns = JSON.stringify(form.value.matchPatternsList)
      
      // TODO: 调用新增/编辑API
      // if (editData.value?.id) {
      //   await updateMatchRule(form.value)
      //   ElMessage.success('编辑成功')
      // } else {
      //   await addMatchRule(form.value)
      //   ElMessage.success('新增成功')
      // }
      
      ElMessage.info('匹配规则API待实现')
      dialogVisible.value = false
      getList()
    } catch (error) {
      ElMessage.error('保存失败')
    } finally {
      loading.value = false
    }
  })
}

// 删除匹配规则
const handleDelete = async (row: MatchRuleVO) => {
  try {
    await ElMessageBox.confirm(`确定要删除字段"${row.fieldLabel}"的匹配规则吗？`, '提示', { type: 'warning' })
    
    // TODO: 调用删除API
    // await deleteMatchRule(row.id!)
    ElMessage.info('匹配规则API待实现')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 分页处理
const handlePageChange = (val: number) => {
  pageNum.value = val
  getList()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  pageNum.value = 1
  getList()
}
</script>

<style lang="scss" scoped>
.match-rule-manager {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
    
    .table-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  
  .no-table-selected {
    padding: 40px 0;
  }
  
  .query-form {
    margin-bottom: 16px;
  }
  
  .match-patterns {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
  
  .match-patterns-input {
    min-height: 32px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 8px;
    
    .el-tag {
      margin-right: 8px;
      margin-bottom: 8px;
    }
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>