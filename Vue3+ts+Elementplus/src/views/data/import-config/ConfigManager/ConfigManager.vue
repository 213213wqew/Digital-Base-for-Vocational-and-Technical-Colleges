<template>
  <div class="import-config-manager">
        <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <el-button type="primary" @click="openDialog()">新增配置</el-button>
          <span class="header-title">导入配置管理</span>
        </div>
      </template>
      <el-form :inline="true" :model="query" class="query-form" @submit.prevent>
        <el-form-item label="表名/表中文名称">
          <el-input v-model="query.tableName" placeholder="请输入表名或表中文名称" clearable />
        </el-form-item>
        <el-form-item label="模块名">
          <el-input v-model="query.moduleName" placeholder="请输入模块名" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.enableStatus" placeholder="全部" clearable style="width: 120px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table height="calc(75vh - 140px)" :data="list" border stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="tableName" label="表名" min-width="120" />
        <el-table-column prop="tableLabel" label="表中文名称" min-width="120" />
        <el-table-column prop="moduleName" label="模块名" min-width="100" />
        <el-table-column prop="subsetCode" label="数据子集" min-width="100" />
        <el-table-column prop="apiBasePath" label="API路径" min-width="180" />
        <el-table-column prop="importModes" label="导入模式" min-width="100" />
        <el-table-column prop="urlAddress" label="URL地址" min-width="150" show-overflow-tooltip />
        <el-table-column prop="jsonType" label="源JSON" min-width="120" show-overflow-tooltip />
        <el-table-column prop="jsonField" label="目标JSON" min-width="120" show-overflow-tooltip />
        <el-table-column prop="jsonTargetField" label="目标字段" min-width="120" show-overflow-tooltip />
        <el-table-column prop="enableStatus" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.enableStatus === 1 ? 'success' : 'info'">{{ row.enableStatus === 1 ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="420" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button size="small" type="success" @click="testUrlConnection(row)" v-if="row.urlAddress">测试URL</el-button>
            <el-button size="small" type="warning" @click="validateJsonConfig(row)" v-if="row.jsonType && row.jsonField">验证JSON</el-button>
            <el-button size="small" type="info" @click="fetchData(row)" v-if="row.urlAddress && row.jsonType && row.jsonField">自动获取</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
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
        </el-card>

    <!-- 主配置编辑对话框 -->
    <el-dialog :model-value="dialogVisible" @update:model-value="val => dialogVisible = val" :title="editData ? '编辑配置' : '新增配置'" width="600px" :close-on-click-modal="false" @close="handleClose">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="110px">
        <el-form-item label="表名" prop="tableName">
          <el-input v-model="form.tableName" placeholder="请输入表名" :disabled="!!editData" />
        </el-form-item>
        <el-form-item label="表中文名称" prop="tableLabel">
          <el-input v-model="form.tableLabel" placeholder="请输入表中文名称" />
        </el-form-item>
        <el-form-item label="模块名" prop="moduleName">
          <el-input v-model="form.moduleName" placeholder="请输入模块名" />
        </el-form-item>
        <el-form-item label="数据子集" prop="subsetCode">
          <el-input v-model="form.subsetCode" placeholder="请输入数据子集代码" />
        </el-form-item>
        <el-form-item label="API路径" prop="apiBasePath">
          <el-input v-model="form.apiBasePath" placeholder="请输入API路径" />
        </el-form-item>
        <el-form-item label="导入模式" prop="importModes">
          <el-input v-model="form.importModes" placeholder='如 ["insert","upsert"]' />
        </el-form-item>
        <el-form-item label="模板排除字段" prop="templateExcludeFields">
          <el-input v-model="form.templateExcludeFields" placeholder='如 ["zjsjwyxbs","xxdm"]' />
        </el-form-item>
        <el-form-item label="默认值配置" prop="defaultValues">
          <el-input v-model="form.defaultValues" placeholder='如 {"xxdm":"systemSchoolCode"}' />
        </el-form-item>
        <el-form-item label="URL地址" prop="urlAddress">
          <el-input v-model="form.urlAddress" placeholder="请输入自动获取数据的URL地址" />
        </el-form-item>
        <el-form-item label="源JSON" prop="jsonType">
          <el-input v-model="form.jsonType" type="textarea" :rows="3" placeholder='如 {"type": "array", "dataPath": "data", "itemType": "object"}' />
        </el-form-item>
        <el-form-item label="目标JSON" prop="jsonField">
          <el-input v-model="form.jsonField" type="textarea" :rows="3" placeholder='如 {"schoolCode": "code", "schoolName": "name"}' />
        </el-form-item>
        <el-form-item label="目标字段" prop="jsonTargetField">
          <el-input v-model="form.jsonTargetField" placeholder="请输入目标字段字符串" />
        </el-form-item>
        <el-form-item label="状态" prop="enableStatus">
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
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  pageImportConfig,
  addImportConfig,
  updateImportConfig,
  deleteImportConfig,
  testUrlConnection as testUrlConnectionApi,
  validateJsonConfig as validateJsonConfigApi,
  fetchDataByTableName as fetchDataByTableNameApi,
  type ImportConfigVO
} from '@/api-data/data/data_base/common/import-config'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import FieldConfigManager from './components/FieldConfigManager.vue'
import MatchRuleManager from './components/MatchRuleManager.vue'
import SmartMappingTest from './components/SmartMappingTest.vue'

const query = reactive<{ tableName: string; moduleName: string; enableStatus: number | undefined }>({
  tableName: '',
  moduleName: '',
  enableStatus: undefined
})
const list = ref<ImportConfigVO[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const editData = ref<ImportConfigVO | null>(null)
const formRef = ref<FormInstance>()
const form = ref<Partial<ImportConfigVO>>({
  tableName: '',
  tableLabel: '',
  moduleName: '',
  subsetCode: '',
  apiBasePath: '',
  importModes: '',
  templateExcludeFields: '',
  defaultValues: '',
  urlAddress: '',
  jsonType: '',
  jsonField: '',
  jsonTargetField: '',
  enableStatus: 1
})

const pageNum = ref(1)
const pageSize = ref(20)
const total = ref(0)

// Tab相关数据
const activeTab = ref('main')
const selectedTableName = ref('')

// 计算属性：获取当前选中的表名
const currentTableName = computed(() => {
  if (activeTab.value === 'main') {
    return ''
  }
  return selectedTableName.value
})

const rules = {
  tableName: [{ required: true, message: '请输入表名', trigger: 'blur' }],
  tableLabel: [{ required: true, message: '请输入表中文名称', trigger: 'blur' }],
  moduleName: [{ required: true, message: '请输入模块名', trigger: 'blur' }],
  apiBasePath: [{ required: true, message: '请输入API路径', trigger: 'blur' }],
  importModes: [{ required: true, message: '请输入导入模式', trigger: 'blur' }],
  enableStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const getList = async () => {
  loading.value = true
  try {
    const res = await pageImportConfig({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      tableName: query.tableName,
      moduleName: query.moduleName,
      enableStatus: query.enableStatus
    }) as any
    list.value = res.data.data.records
    total.value = res.data.data.total
  } catch (e) {
    ElMessage.error('获取配置列表失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  query.tableName = ''
  query.moduleName = ''
  query.enableStatus = undefined
  getList()
}

const openDialog = (row?: ImportConfigVO) => {
  if (row) {
    editData.value = { ...row }
    form.value = { ...row }
  } else {
    editData.value = null
    form.value = {
      tableName: '',
      tableLabel: '',
      moduleName: '',
      subsetCode: '',
      apiBasePath: '',
      importModes: '',
      templateExcludeFields: '',
      defaultValues: '',
      urlAddress: '',
      jsonType: '',
      jsonField: '',
      jsonTargetField: '',
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
        await updateImportConfig(form.value)
        ElMessage.success('编辑成功')
      } else {
        await addImportConfig(form.value)
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

const handleDelete = async (row: ImportConfigVO) => {
  try {
    await ElMessageBox.confirm(`确定要删除该配置吗？`, '提示', { type: 'warning' })
    await deleteImportConfig(row.id!)
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

// 测试URL连接
const testUrlConnection = async (row: ImportConfigVO) => {
  try {
    const res = await testUrlConnectionApi(row.urlAddress!)
    if (res.data.success) {
      ElMessage.success('URL连接测试成功')
    } else {
      ElMessage.error('URL连接测试失败')
    }
  } catch (e) {
    ElMessage.error('URL连接测试失败')
  }
}

// 验证JSON配置
const validateJsonConfig = async (row: ImportConfigVO) => {
  try {
    const res = await validateJsonConfigApi(row.jsonType!, row.jsonField!)
    if (res.data.valid) {
      ElMessage.success('JSON配置验证成功')
    } else {
      ElMessage.error('JSON配置验证失败')
    }
  } catch (e) {
    ElMessage.error('JSON配置验证失败')
  }
}

// 自动获取数据
const fetchData = async (row: ImportConfigVO) => {
  try {
    const res = await fetchDataByTableNameApi(row.tableName!)
    if (res.data.success) {
      ElMessage.success(`成功获取 ${res.data.dataCount} 条数据`)
    } else {
      ElMessage.error('自动获取数据失败')
    }
  } catch (e) {
    ElMessage.error('自动获取数据失败')
  }
}

// 处理选择表进行字段配置
const handleSelectTable = (row: ImportConfigVO) => {
  selectedTableName.value = row.tableName
  activeTab.value = 'fields'
  ElMessage.success(`已选择表：${row.tableLabel}`)
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
.import-config-manager {
  .config-card {
    margin-bottom: 20px;
    .card-header {
      display: flex;
      align-items: center;
      position: relative;
      min-height: 48px;
    }
    .header-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0 auto;
      position: absolute;
      left: 0; right: 0;
      text-align: center;
      pointer-events: none;
    }
    .card-header > .el-button {
      z-index: 1;
    }
    .query-form {
      margin-bottom: 20px;
    }
  }
}
</style> 