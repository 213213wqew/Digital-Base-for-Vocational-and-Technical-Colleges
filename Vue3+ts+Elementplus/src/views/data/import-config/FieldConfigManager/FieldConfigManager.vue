<template>
<div>
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
         
          <el-button type="primary" @click="openDialog()">新增字段</el-button>
          <el-button type="warning" @click="handleUpdateFields">更新字段</el-button>
          <el-button type="success" @click="handleUpdateValidationFields">更新验证字段</el-button>
          <span style="margin-left: 35%; font-size: 18px; font-weight: 600; color: #303133;">字段配置管理1</span>
        </div>
      </template>
      <el-form :inline="true" :model="query" class="query-form" @submit.prevent>
        <el-form-item label="表名">
          <el-input v-model="query.tableName" placeholder="请输入表名" clearable />
        </el-form-item>
        <el-form-item label="表中文名">
          <el-input v-model="query.tableChineseName" placeholder="请输入表中文名" clearable />
        </el-form-item>
        <el-form-item label="字段名">
          <el-input v-model="query.fieldName" placeholder="请输入字段名" clearable />
        </el-form-item>
        <!-- <el-form-item label="验证字段">
          <el-input v-model="query.validationField" placeholder="请输入验证字段名" clearable />
        </el-form-item>
        <el-form-item label="验证数据库">
          <el-input v-model="query.validationDatabase" placeholder="请输入验证数据库名" clearable />
        </el-form-item> -->
        <el-form-item label="状态">
          <el-select v-model="query.enableStatus" placeholder="全部" clearable style="width: 120px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-top: -20px;">
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table height="calc(75vh - 140px)" 
      :data="list" border 
      stripe style="width: 100%"
       v-loading="loading" @sort-change="handleSortChange"
       :default-sort="{ prop: 'sortOrder', order: 'ascending' }"
       >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="tableName" label="表名" min-width="140" sortable="custom" />
        <el-table-column prop="tableChineseName" label="表中文名" min-width="160" sortable="custom" />
        <el-table-column prop="fieldName" label="字段名" min-width="120" sortable="custom" />
        <el-table-column prop="fieldLabel" label="字段中文名" min-width="120" sortable="custom" />
        <el-table-column prop="fieldType" label="字段类型" min-width="100" sortable="custom">
          <template #default="{ row }">
            <el-tag :type="getFieldTypeColor(row.fieldType)">{{ getFieldTypeLabel(row.fieldType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isRequired" label="必填" width="70" align="center" sortable="custom">
          <template #default="{ row }">
            <el-tag :type="row.isRequired === 1 ? 'danger' : 'info'">{{ row.isRequired === 1 ? '是' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isDefault" label="默认值字段" width="100" align="center" sortable="custom">
          <template #default="{ row }">
            <el-tag :type="row.isDefault === 1 ? 'success' : 'info'">{{ row.isDefault === 1 ? '是' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isIdentifier" label="标识字段" width="100" align="center" sortable="custom">
          <template #default="{ row }">
            <el-tag :type="row.isIdentifier === 1 ? 'warning' : 'info'">{{ row.isIdentifier === 1 ? '是' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="idTemplate" label="模板字段" width="100" align="center" sortable="custom">
          <template #default="{ row }">
            <el-tag :type="row.idTemplate === 1 ? 'success' : 'info'">{{ row.idTemplate === 1 ? '是' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="maxLength" label="最大长度" width="90" align="center" sortable="custom" />
        <el-table-column prop="dictType" label="字典类型" min-width="100" sortable="custom" />
        <el-table-column prop="fieldExample" label="字段示例" min-width="120" sortable="custom" />
        <el-table-column prop="validationRules" label="验证规则" min-width="150" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="validationField" label="数据库验证字段" min-width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="validationDatabase" label="验证数据库" min-width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="fieldProcessor" label="字段处理器" min-width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="transformRules" label="数据转换规则" min-width="150" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="80" align="center" sortable="custom" />
        <el-table-column prop="enableStatus" label="状态" width="80" align="center" sortable="custom">
          <template #default="{ row }">
            <el-tag :type="row.enableStatus === 1 ? 'success' : 'info'">{{ row.enableStatus === 1 ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150" align="center" sortable="custom" />
        <el-table-column prop="updateTime" label="更新时间" min-width="150" align="center" sortable="custom" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[50, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
    <el-dialog :model-value="dialogVisible" @update:model-value="val => dialogVisible = val" :title="editData ? '编辑字段' : '新增字段'" width="600px" :close-on-click-modal="false" @close="handleClose">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="110px">
        <el-row :gutter="16">
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="表名" prop="tableName">
              <el-input v-model="form.tableName" placeholder="请输入表名"  />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="表中文名" prop="tableChineseName">
              <el-input v-model="form.tableChineseName" placeholder="请输入表中文名"  />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="字段名" prop="fieldName">
              <el-input v-model="form.fieldName" placeholder="请输入字段名"  />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="字段中文名" prop="fieldLabel">
              <el-input v-model="form.fieldLabel" placeholder="请输入字段中文名" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="字段类型" prop="fieldType">
              <el-select v-model="form.fieldType" placeholder="请选择字段类型">
                <el-option label="字符串" value="string" />
                <el-option label="数字" value="number" />
                <el-option label="日期" value="date" />
                <el-option label="日期时间" value="datetime" />
                <el-option label="选择" value="select" />
                <el-option label="长文本" value="text" />
                <el-option label="布尔值" value="boolean" />
                <el-option label="超长文本" value="longtext" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="必填" prop="isRequired">
              <el-switch v-model="form.isRequired" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="默认值字段" prop="isDefault">
              <el-switch v-model="form.isDefault" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="标识字段" prop="isIdentifier">
              <el-switch v-model="form.isIdentifier" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="模板字段" prop="idTemplate">
              <el-switch v-model="form.idTemplate" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="最大长度" prop="maxLength">
              <el-input-number v-model="form.maxLength" :min="0" :max="1000" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="字典类型" prop="dictType">
              <el-input v-model="form.dictType" placeholder="请输入字典类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="字段示例" prop="fieldExample">
              <el-input v-model="form.fieldExample" placeholder="请输入字段示例" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="验证规则" prop="validationRules">
              <el-input v-model="form.validationRules" placeholder='如 {"type":"regex","pattern":"^1[3-9]\\d{9}$"}' />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="验证字段" prop="validationField">
              <el-input v-model="form.validationField" placeholder="请输入验证字段名" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="验证数据库" prop="validationDatabase">
              <el-input v-model="form.validationDatabase" placeholder="请输入验证数据库名" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="字段处理器" prop="fieldProcessor">
              <el-input v-model="form.fieldProcessor" placeholder="请输入字段处理器类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="数据转换规则" prop="transformRules">
              <el-input v-model="form.transformRules" placeholder='如 {"dateFormats":["yyyy-MM-dd"]}' />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="排序" prop="sortOrder">
              <el-input-number v-model="form.sortOrder" :min="0" :max="1000" />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 16px;">
            <el-form-item label="状态" prop="enableStatus">
              <el-switch v-model="form.enableStatus" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用" />
            </el-form-item>
          </el-col>
        </el-row>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  pageFieldConfig,
  addFieldConfig,
  updateFieldConfig,
  deleteFieldConfig,
  updateByTableChineseName,
  updateValidationFields,
  type FieldConfigVO
} from '@/api-data/data/data_base/common/field-config'
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const query = reactive({ 
  tableName: '', 
  tableChineseName: '', 
  fieldName: '', 
  validationField: '',
  validationDatabase: '',
  enableStatus: undefined as number | undefined 
})

// 添加排序相关参数
const sortParams = reactive({
  sortField: '',
  sortOrder: ''
})

const list = ref<FieldConfigVO[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const editData = ref<FieldConfigVO | null>(null)
const formRef = ref<FormInstance>()
const form = ref<Partial<FieldConfigVO>>({
  tableName: '',
  tableChineseName: '',
  fieldName: '',
  fieldLabel: '',
  fieldType: '',
  isRequired: 0,
  isDefault: 0,
  isIdentifier: 0,
  idTemplate: 0,
  maxLength: undefined,
  dictType: '',
  fieldExample: '',
  validationRules: '',
  validationField: '',
  validationDatabase: '',
  fieldProcessor: '',
  transformRules: '',
  sortOrder: 0,
  enableStatus: 1
})

const pageNum = ref(1)
const pageSize = ref(50)
const total = ref(0)

const rules = {
  tableName: [{ required: true, message: '请输入表名', trigger: 'blur' }],
  fieldName: [{ required: true, message: '请输入字段名', trigger: 'blur' }],
  fieldLabel: [{ required: true, message: '请输入字段中文名', trigger: 'blur' }],
  fieldType: [{ required: true, message: '请选择字段类型', trigger: 'change' }],
  isRequired: [{ required: true, message: '请选择是否必填', trigger: 'change' }],
  enableStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const getList = async () => {
  loading.value = true
  try {
    const res = await pageFieldConfig({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      tableName: query.tableName,
      tableChineseName: query.tableChineseName,
      fieldName: query.fieldName,
      validationField: query.validationField,
      validationDatabase: query.validationDatabase,
      enableStatus: query.enableStatus,
      // 添加排序参数
      sortField: sortParams.sortField,
      sortOrder: sortParams.sortOrder
    }) as any
    list.value = res.data.data.records
    total.value = res.data.data.total
  } catch (e) {
    ElMessage.error('获取字段配置列表失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  query.tableName = ''
  query.tableChineseName = ''
  query.fieldName = ''
  query.validationField = ''
  query.validationDatabase = ''
  query.enableStatus = undefined
  // 重置排序参数
  sortParams.sortField = ''
  sortParams.sortOrder = ''
  getList()
}

const openDialog = (row?: FieldConfigVO) => {
  if (row) {
    editData.value = { ...row }
    form.value = { ...row }
  } else {
    editData.value = null
    form.value = {
      tableName: '',
      tableChineseName: '',
      fieldName: '',
      fieldLabel: '',
      fieldType: '',
      isRequired: 0,
      isDefault: 0,
      idTemplate: 0,
      maxLength: undefined,
      dictType: '',
      fieldExample: '',
      validationRules: '',
      validationField: '',
      validationDatabase: '',
      fieldProcessor: '',
      transformRules: '',
      sortOrder: 0,
      enableStatus: 1
    }
  }
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      if (editData.value && editData.value.id) {
        await updateFieldConfig(form.value)
        ElMessage.success('编辑成功')
      } else {
        await addFieldConfig(form.value)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      getList()
    } catch (e) {
      ElMessage.error('保存失败')
    } finally {
      loading.value = false
    }
  })
}

const handleDelete = async (row: FieldConfigVO) => {
  try {
    await ElMessageBox.confirm(`确定要删除该字段吗？`, '提示', { type: 'warning' })
    await deleteFieldConfig(row.id!)
    ElMessage.success('删除成功')
    getList()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

const handlePageChange = (val: number) => {
  pageNum.value = val
  getList()
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  pageNum.value = 1
  getList()
}

const handleSortChange = (sort: { prop: string; order: string }) => {
  sortParams.sortField = sort.prop
  sortParams.sortOrder = sort.order
  getList()
}

// 获取字段类型颜色
const getFieldTypeColor = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const colorMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    string: 'primary',
    number: 'success',
    date: 'warning',
    datetime: 'warning',
    select: 'info',
    text: 'danger',
    boolean: 'success',
    longtext: 'danger'
  }
  return colorMap[type] || 'primary'
}

// 获取字段类型标签
const getFieldTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    string: '字符串',
    number: '数字',
    date: '日期',
    datetime: '日期时间',
    select: '选择',
    text: '长文本',
    boolean: '布尔值',
    longtext: '超长文本'
  }
  return labelMap[type] || type
}

const handleUpdateFields = async () => {
  try {
    if (!query.tableChineseName) {
      ElMessage.error('请输入表中文名，输入不可更新')
      return
    }
    
    await ElMessageBox.confirm('确定要更新字段配置吗？这将根据元数据表重新生成字段配置。', '提示', { 
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    
    loading.value = true
    await updateByTableChineseName(query.tableChineseName)
    ElMessage.success('字段更新成功')
    getList() // 刷新列表
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error('字段更新失败：' + (e.message || '未知错误'))
    }
  } finally {
    loading.value = false
  }
}

const handleUpdateValidationFields = async () => {
  try {
    if (!query.tableChineseName) {
      ElMessage.error('请输入表中文名，输入不可更新')
      return
    }
    
    await ElMessageBox.confirm('确定要更新验证字段配置吗？这将根据元数据表重新生成验证字段配置。', '提示', { 
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    
    loading.value = true
    await updateValidationFields(query.tableChineseName)
    ElMessage.success('验证字段更新成功')
    getList() // 刷新列表
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error('验证字段更新失败：' + (e.message || '未知错误'))
    }
  } finally {
    loading.value = false
  }
}

const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    getList()
  }
)

onMounted(getList)
</script>

<style lang="scss" scoped>
.field-config-manager {
  .config-card {
    margin-bottom: 20px;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
    .query-form {
      margin-bottom: 20px;
    }
  }
}
</style>