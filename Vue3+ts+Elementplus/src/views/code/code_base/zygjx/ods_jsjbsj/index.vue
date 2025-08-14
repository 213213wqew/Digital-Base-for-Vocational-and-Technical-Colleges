<template>
  <div class="teacher-basic-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="教室号" prop="jsh">
            <el-input
              v-model="queryParams.jsh"
              placeholder="请输入教室号"
              clearable
            />
          </el-form-item>
          <el-form-item label="教室名称" prop="jsmc">
            <el-input
              v-model="queryParams.jsmc"
              placeholder="请输入教室名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="教室类型" prop="jslxm">
            <el-select
              v-model="queryParams.jslxm"
              placeholder="请选择教室类型"
              clearable
            >
              <el-option label="普通教室" value="01" />
              <el-option label="实验室" value="02" />
              <el-option label="机房" value="03" />
              <el-option label="多媒体教室" value="04" />
            </el-select>
          </el-form-item>
          <el-form-item style="margin-top: -23px">
            <el-button type="primary" @click="handleQuery">
              <el-icon><Search /></el-icon>搜索
            </el-button>
            <el-button @click="resetQuery">
              <el-icon><Refresh /></el-icon>重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="operation-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增
          </el-button>
          <el-button
            type="danger"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">教室基本数据编码管理</div>
        <div class="placeholder">
          <el-tooltip content="刷新" placement="top">
            <el-button circle @click="getList">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <div class="table-body">
        <el-table
          v-loading="loading"
          :data="dataList"
          @selection-change="handleSelectionChange"
          border
          style="width: 100%"
          highlight-current-row
          @row-click="handleRowClick"
          @row-dblclick="handleRowDblClick"
          :height="'calc(75vh - 135px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="zjsjwyxbs"
            label="唯一性标识"
            min-width="160"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="jsh"
            label="教室号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="jsmc"
            label="教室名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zws"
            label="座位数"
            min-width="80"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="jslxmText"
            label="教室类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getJslxText(row.jslxm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="jsms"
            label="教室描述"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sjcjsj"
            label="采集时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
                size="small"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="row.enableStatus === '1' ? 'success' : 'danger'"
                size="small"
              >
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180"
            fixed="right"
            align="center"
          >
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleView(row)"
                >
                  <el-icon><View /></el-icon>查看
                </el-button>
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleUpdate(row)"
                >
                  <el-icon><Edit /></el-icon>编辑
                </el-button>
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handleDelete(row)"
                >
                  <el-icon><Delete /></el-icon>删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页组件 -->
      <div class="pagination-wrapper">
        <span class="total-info">共 {{ total }} 条</span>
        <div class="pagination-controls">
          <el-pagination
            v-model:current-page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[100, 200, 500, 1000]"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            small
          />
        </div>
      </div>
    </el-card>

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 480px"
      class="teacher-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
      >
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="12">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可不填，后端自动生成32位唯一编码（大写字母+数字组合）"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="系统自动获取学校代码（10位数字码）"
                maxlength="10"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="12">
            <el-form-item label="教室号" prop="jsh">
              <el-input
                v-model="form.jsh"
                placeholder="请输入教室号（学校自编，不超过80个字符）"
                maxlength="80"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教室名称" prop="jsmc">
              <el-input
                v-model="form.jsmc"
                placeholder="请输入教室名称（不超过100个字符）"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="12">
            <el-form-item label="座位数" prop="zws">
              <el-input-number
                v-model="form.zws"
                :min="0"
                :max="99999999"
                placeholder="请输入座位数（0-99999999）"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教室类型" prop="jslxm">
              <el-select
                v-model="form.jslxm"
                placeholder="请选择教室类型（授课地点类别代码）"
                style="width: 100%"
              >
                <el-option
                  v-for="option in jslxOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px;">
          <el-col :span="24">
            <el-form-item label="教室描述" prop="jsms">
              <el-input
                v-model="form.jsms"
                type="textarea"
                placeholder="请输入教室描述（教室主要功能等，如有哪些用途、功能，不超过2000个字符）"
                maxlength="2000"
                show-word-limit
                :rows="3"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间（格式：YYYYMMDD hhmmss）"
                style="width: 100%"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select
                v-model="form.reportStatus"
                placeholder="请选择上报状态"
                style="width: 100%"
              >
                <el-option label="未上报" value="0" />
                <el-option label="已上报" value="1" />
                <el-option label="上报失败" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="12">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select
                v-model="form.enableStatus"
                placeholder="请选择启用状态"
                style="width: 100%"
              >
                <el-option label="禁用" value="0" />
                <el-option label="启用" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-descriptions
        v-else
        :column="2"
        border
        style="margin-top: 20px"
      >
        <el-descriptions-item label="主键ID">{{
          currentRecord?.id
        }}</el-descriptions-item>
        <el-descriptions-item label="唯一性标识">{{
          currentRecord?.zjsjwyxbs
        }}</el-descriptions-item>
        <el-descriptions-item label="学校代码">{{
          currentRecord?.xxdm
        }}</el-descriptions-item>
        <el-descriptions-item label="教室号">{{
          currentRecord?.jsh
        }}</el-descriptions-item>
        <el-descriptions-item label="教室名称">{{
          currentRecord?.jsmc
        }}</el-descriptions-item>
        <el-descriptions-item label="座位数">{{
          currentRecord?.zws
        }}</el-descriptions-item>
        <el-descriptions-item label="教室类型">{{
          currentRecord?.jslxmText || currentRecord?.jslxm
        }}</el-descriptions-item>
        <el-descriptions-item label="数据采集时间">{{
          currentRecord?.sjcjsj
        }}</el-descriptions-item>
        <el-descriptions-item label="上报状态">
          <el-tag
            :type="getReportStatusTagType(currentRecord?.reportStatus || '')"
            size="small"
          >
            {{ getReportStatusText(currentRecord?.reportStatus || '') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="启用状态">
          <el-tag
            :type="currentRecord?.enableStatus === '1' ? 'success' : 'danger'"
            size="small"
          >
            {{ currentRecord?.enableStatus === "1" ? "启用" : "禁用" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          currentRecord?.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          currentRecord?.updateTime
        }}</el-descriptions-item>
        <el-descriptions-item label="教室描述" :span="2">{{
          currentRecord?.jsms || "无"
        }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            @click="submitForm"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, defineExpose } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getOdsJsjbsjPage as getOdsJsjbsjList,
  getOdsJsjbsjById as getOdsJsjbsjInfo,
  addOdsJsjbsj,
  updateOdsJsjbsj,
  deleteOdsJsjbsj,
  exportOdsJsjbsj,
  getSystemSchoolCode,
  getJslxOptions,
  type OdsJsjbsjForm,
  type OdsJsjbsjInfo,
  type OdsJsjbsjQuery,
  type OdsJsjbsjPageResult
} from '@/api-code/code/code_base/zygjx/ods_jsjbsj'
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
} from "@element-plus/icons-vue"

// 查询参数
const queryParams = reactive<OdsJsjbsjQuery>({
  pageNum: 1,
  pageSize: 100,
  jsh: '',
  jsmc: '',
  jslxm: ''
})

// 表格数据
const loading = ref(false)
const dataList = ref<OdsJsjbsjInfo[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogMode = ref<'add' | 'edit' | 'view'>('add')
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive<OdsJsjbsjForm>({
  id: undefined,
  zjsjwyxbs: '',
  xxdm: '',
  jsh: '',
  jsmc: '',
  zws: undefined,
  jslxm: '',
  jsms: '',
  sjcjsj: '',
  reportStatus: '0',
  enableStatus: '1'
})

// 当前记录
const currentRecord = ref<OdsJsjbsjInfo | null>(null)

// 表单校验规则
const rules = reactive<FormRules>({
  zjsjwyxbs: [
    { pattern: /^[A-Z0-9]{32}$/, message: '唯一编码必须为32位大写字母和数字组合', trigger: 'blur' }
  ],
  xxdm: [
    { required: true, message: '请输入学校代码', trigger: 'blur' },
    { pattern: /^\d{10}$/, message: '学校代码必须为10位数字', trigger: 'blur' }
  ],
  jsh: [
    { required: true, message: '请输入教室号', trigger: 'blur' },
    { max: 80, message: '教室号不能超过80个字符', trigger: 'blur' }
  ],
  jsmc: [
    { required: true, message: '请输入教室名称', trigger: 'blur' },
    { max: 100, message: '教室名称不能超过100个字符', trigger: 'blur' }
  ],
  zws: [
    { required: true, message: '请输入座位数', trigger: 'blur' },
    { type: 'number', message: '座位数必须为数字', trigger: 'blur' },
   
  ],
  jslxm: [
    { required: true, message: '请选择教室类型', trigger: 'change' },
    // { pattern: /^\d{2}$/, message: '教室类型码必须为2位数字', trigger: 'blur' }
  ],
  jsms: [
    { max: 2000, message: '教室描述不能超过2000个字符', trigger: 'blur' }
  ],
  sjcjsj: [
    { required: true, message: '请选择数据采集时间', trigger: 'change' },
    { pattern: /^\d{8} \d{6}$/, message: '数据采集时间格式必须为YYYYMMDD hhmmss', trigger: 'blur' }
  ]
})

// 教室类型选项
const jslxOptions = ref<Array<{ label: string; value: string }>>([])

// 获取教室类型选项
const getJslxOptionsList = async () => {
  try {
    const { data } = await getJslxOptions()  as any
    if (data) {
      jslxOptions.value = data.data
    }
  } catch (error) {
    console.error('获取教室类型选项失败:', error)
    ElMessage.error('获取教室类型选项失败')
  }
}

// 获取教室类型文本
const getJslxText = (value: string) => {
  const option = jslxOptions.value.find(item => item.value === value)
  return option ? option.label : value
}

// 获取列表数据
const getList = async () => {
  try {
    loading.value = true
    const { data } = await getOdsJsjbsjList(queryParams) as any
    if (data) {
      dataList.value = data.data.records
      total.value = data.data.total
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

// 查询操作
const handleQuery = () => {
  queryParams.pageNum = 1
  getList()
}

// 重置查询
const resetQuery = () => {
  queryParams.jsh = ''
  queryParams.jsmc = ''
  queryParams.jslxm = ''
  handleQuery()
}

// 选择行变化
const handleSelectionChange = (selection: OdsJsjbsjInfo[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增操作
const handleAdd = async () => {
  dialogMode.value = 'add'
  dialogTitle.value = '新增教室基本数据'
  dialogVisible.value = true
  
  // 重置表单
  form.id = undefined
  form.zjsjwyxbs = ''
  form.jsh = ''
  form.jsmc = ''
  form.zws = undefined
  form.jslxm = ''
  form.jsms = ''
  form.sjcjsj = ''
  form.reportStatus = '0'
  form.enableStatus = '1'
  
  // 获取学校代码
  try {
    const { data } = await getSystemSchoolCode() as any
    if (data) {
      form.xxdm = data.data
    }
  } catch (error) {
    console.error('获取学校代码失败:', error)
  }
}

// 修改操作
const handleUpdate = async (row: OdsJsjbsjInfo) => {
  try {
    const { data } = await getOdsJsjbsjInfo(row.id) as any
    if (data) {
      Object.assign(form, data.data)
      dialogMode.value = 'edit'
      dialogTitle.value = '修改教室基本数据'
      dialogVisible.value = true
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败')
  }
}

// 查看操作
const handleView = async (row: OdsJsjbsjInfo) => {
  try {
    const { data } = await getOdsJsjbsjInfo(row.id)
    if (data) {
      currentRecord.value = data
      dialogMode.value = 'view'
      dialogTitle.value = '查看教室基本数据'
      dialogVisible.value = true
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败')
  }
}

// 删除操作
const handleDelete = (row: OdsJsjbsjInfo) => {
  ElMessageBox.confirm('确认要删除该教室基本数据吗？', '警告', {
    type: 'warning'
  }).then(async () => {
    try {
      const { data } = await deleteOdsJsjbsj(row.id)
      if (data) {
        ElMessage.success('删除成功')
        getList()
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }
  ElMessageBox.confirm(
    `确认要删除选中的 ${selectedIds.value.length} 条数据吗？`,
    '警告',
    {
      type: 'warning'
    }
  ).then(async () => {
    try {
      const results = await Promise.all(
        selectedIds.value.map(id => deleteOdsJsjbsj(id))
      )
      if (results.every(({ data }) => data)) {
        ElMessage.success('批量删除成功')
        getList()
      } else {
        ElMessage.error('部分数据删除失败')
      }
    } catch (error) {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  })
}

// 导出数据
const handleExport = async () => {
  try {
    ElMessage.info('正在导出，请稍候...')
    
    // 调用导出接口
    const response = await exportOdsJsjbsj(queryParams) as any
    
    // 检查响应数据
    console.log('Export response:', response)
    
    // 获取文件名
    const fileName = `教室基本数据_${new Date().getTime()}.xlsx`
    
    let blob
    // 判断响应数据类型
    if (response instanceof Blob) {
      blob = response
    } else if (response.data instanceof Blob) {
      blob = response.data
    } else if (response.data instanceof ArrayBuffer) {
      blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    } else {
      // 如果是其他格式，尝试直接使用
      blob = new Blob([response.data || response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    
    // 添加到DOM并触发下载
    document.body.appendChild(link)
    link.click()
    
    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('导出成功')
    
  } catch (error: any) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败: ' + (error.message || '未知错误'))
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async valid => {
    if (valid) {
      try {
        const submitFunc = dialogMode.value === 'add' ? addOdsJsjbsj : updateOdsJsjbsj
        const { data } = await submitFunc(form)
        if (data) {
          ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '修改成功')
          dialogVisible.value = false
          getList()
        }
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败')
      }
    }
  })
}

// 获取上报状态标签类型
const getReportStatusTagType = (status: string) => {
  switch (status) {
    case '1':
      return 'success'
    case '2':
      return 'danger'
    default:
      return 'warning'
  }
}

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  switch (status) {
    case '1':
      return '已上报'
    case '2':
      return '上报失败'
    default:
      return '未上报'
  }
}

// 行点击事件
const handleRowClick = (row: OdsJsjbsjInfo) => {
  console.log('Row clicked:', row)
}

// 行双击事件
const handleRowDblClick = (row: OdsJsjbsjInfo) => {
  handleView(row)
}

// 分页大小变化
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  getList()
}

// 页码变化
const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val
  getList()
}

// 初始化
onMounted(() => {
  getList()
  getJslxOptionsList()
})

// 暴露组件方法和数据
defineExpose({
  getJslxText,
  jslxOptions
})
</script>

<style lang="scss" scoped>
.teacher-basic-management {
  .search-card {
    margin-bottom: 10px;
  }

  .table-card {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .operation-buttons {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .header-title {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;

    .total-info {
      color: #606266;
      font-size: 13px;
    }
  }

  .teacher-dialog {
    :deep(.el-dialog__body) {
      padding: 20px;
      max-height: calc(90vh - 150px);
      overflow-y: auto;
    }

    .dialog-footer {
      text-align: right;
      padding-top: 20px;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
}
</style>
