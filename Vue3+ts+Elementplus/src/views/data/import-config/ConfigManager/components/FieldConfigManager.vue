<template>
  <div class="field-config-manager">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-button type="primary" @click="openDialog()" :disabled="!tableName">
            <el-icon><Plus /></el-icon>
            新增字段配置
          </el-button>
          <span class="header-title">字段配置管理</span>
          <div class="table-info" v-if="tableName">
            <el-tag type="info">当前表：{{ tableName }}</el-tag>
          </div>
        </div>
      </template>

      <div v-if="!tableName" class="no-table-selected">
        <el-empty description="请先在导入配置页面选择一个表进行字段配置" />
      </div>

      <div v-else>
        <!-- 查询表单 -->
        <el-form :inline="true" :model="query" class="query-form">
          <el-form-item label="字段名">
            <el-input v-model="query.fieldName" placeholder="请输入字段名" clearable />
          </el-form-item>
          <el-form-item label="字段类型">
            <el-select v-model="query.fieldType" placeholder="全部" clearable>
              <el-option label="字符串" value="string" />
              <el-option label="数字" value="number" />
              <el-option label="日期" value="date" />
              <el-option label="日期时间" value="datetime" />
              <el-option label="选择" value="select" />
              <el-option label="文本" value="text" />
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
          <el-table-column prop="fieldName" label="字段名" min-width="120" />
          <el-table-column prop="fieldLabel" label="字段中文名" min-width="150" />
          <el-table-column prop="fieldType" label="字段类型" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getFieldTypeColor(row.fieldType)">{{ getFieldTypeLabel(row.fieldType) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isRequired" label="必填" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.isRequired ? 'danger' : 'info'" size="small">
                {{ row.isRequired ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isDefault" label="默认值" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.isDefault ? 'warning' : 'info'" size="small">
                {{ row.isDefault ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="maxLength" label="最大长度" width="100" align="center" />
          <el-table-column prop="fieldExample" label="字段示例" min-width="120" />
          <el-table-column prop="sortOrder" label="排序" width="80" align="center" />
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
      :title="editData ? '编辑字段配置' : '新增字段配置'"
      width="600px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="字段名" prop="fieldName">
          <el-input v-model="form.fieldName" placeholder="请输入字段名" :disabled="!!editData" />
        </el-form-item>
        <el-form-item label="字段中文名" prop="fieldLabel">
          <el-input v-model="form.fieldLabel" placeholder="请输入字段中文名" />
        </el-form-item>
        <el-form-item label="字段类型" prop="fieldType">
          <el-select v-model="form.fieldType" placeholder="请选择字段类型">
            <el-option label="字符串" value="string" />
            <el-option label="数字" value="number" />
            <el-option label="日期" value="date" />
            <el-option label="日期时间" value="datetime" />
            <el-option label="选择" value="select" />
            <el-option label="文本" value="text" />
          </el-select>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="是否必填">
              <el-switch v-model="form.isRequired" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否默认值">
              <el-switch v-model="form.isDefault" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="最大长度">
          <el-input-number v-model="form.maxLength" :min="0" :max="10000" />
        </el-form-item>
        <el-form-item label="字段示例">
          <el-input v-model="form.fieldExample" placeholder="请输入字段示例" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="999" />
        </el-form-item>
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
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

// Props定义
interface Props {
  tableName: string
}

const props = defineProps<Props>()

// 字段配置VO接口
interface FieldConfigVO {
  id?: number
  tableName: string
  fieldName: string
  fieldLabel: string
  fieldType: string
  isRequired: number
  isDefault: number
  maxLength?: number
  fieldExample?: string
  sortOrder: number
  enableStatus: number
}

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const editData = ref<FieldConfigVO | null>(null)
const formRef = ref<FormInstance>()

const query = reactive({
  fieldName: '',
  fieldType: '',
  enableStatus: undefined as number | undefined
})

const list = ref<FieldConfigVO[]>([])
const pageNum = ref(1)
const pageSize = ref(20)
const total = ref(0)

const form = ref<Partial<FieldConfigVO>>({
  tableName: '',
  fieldName: '',
  fieldLabel: '',
  fieldType: 'string',
  isRequired: 0,
  isDefault: 0,
  maxLength: undefined,
  fieldExample: '',
  sortOrder: 0,
  enableStatus: 1
})

// 表单验证规则
const rules = {
  fieldName: [{ required: true, message: '请输入字段名', trigger: 'blur' }],
  fieldLabel: [{ required: true, message: '请输入字段中文名', trigger: 'blur' }],
  fieldType: [{ required: true, message: '请选择字段类型', trigger: 'change' }]
}

// 监听tableName变化
watch(() => props.tableName, (newTableName) => {
  if (newTableName) {
    resetQuery()
  }
}, { immediate: true })

// 获取字段类型颜色
const getFieldTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    string: 'primary',
    number: 'success',
    date: 'warning',
    datetime: 'warning',
    select: 'info',
    text: 'danger'
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
    text: '文本'
  }
  return labelMap[type] || type
}

// 获取列表数据
const getList = async () => {
  if (!props.tableName) return
  
  loading.value = true
  try {
    // TODO: 调用字段配置API
    // const res = await pageFieldConfig({
    //   pageNum: pageNum.value,
    //   pageSize: pageSize.value,
    //   tableName: props.tableName,
    //   fieldName: query.fieldName,
    //   fieldType: query.fieldType,
    //   enableStatus: query.enableStatus
    // })
    // list.value = res.data.records
    // total.value = res.data.total
    
    // 临时模拟数据
    list.value = []
    total.value = 0
    ElMessage.info('字段配置API待实现')
  } catch (error) {
    ElMessage.error('获取字段配置失败')
  } finally {
    loading.value = false
  }
}

// 重置查询
const resetQuery = () => {
  query.fieldName = ''
  query.fieldType = ''
  query.enableStatus = undefined
  pageNum.value = 1
  getList()
}

// 打开对话框
const openDialog = (row?: FieldConfigVO) => {
  if (row) {
    editData.value = { ...row }
    form.value = { ...row }
  } else {
    editData.value = null
    form.value = {
      tableName: props.tableName,
      fieldName: '',
      fieldLabel: '',
      fieldType: 'string',
      isRequired: 0,
      isDefault: 0,
      maxLength: undefined,
      fieldExample: '',
      sortOrder: 0,
      enableStatus: 1
    }
  }
  dialogVisible.value = true
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    
    loading.value = true
    try {
      // TODO: 调用新增/编辑API
      // if (editData.value?.id) {
      //   await updateFieldConfig(form.value)
      //   ElMessage.success('编辑成功')
      // } else {
      //   await addFieldConfig(form.value)
      //   ElMessage.success('新增成功')
      // }
      
      ElMessage.info('字段配置API待实现')
      dialogVisible.value = false
      getList()
    } catch (error) {
      ElMessage.error('保存失败')
    } finally {
      loading.value = false
    }
  })
}

// 删除字段配置
const handleDelete = async (row: FieldConfigVO) => {
  try {
    await ElMessageBox.confirm(`确定要删除字段"${row.fieldLabel}"吗？`, '提示', { type: 'warning' })
    
    // TODO: 调用删除API
    // await deleteFieldConfig(row.id!)
    ElMessage.info('字段配置API待实现')
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
.field-config-manager {
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
  
  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>