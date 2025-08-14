<template>
  <div class="professional-development-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="学号" prop="xh">
            <el-input v-model="queryParams.xh" placeholder="请输入学号" clearable />
          </el-form-item>
          <el-form-item label="测试项目" prop="csxmmc">
            <el-input v-model="queryParams.csxmmc" placeholder="请输入测试项目名称" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>搜索</el-button>
            <el-button @click="resetQuery"><el-icon><Refresh /></el-icon>重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="operation-buttons">
          <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增</el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete"><el-icon><Delete /></el-icon>批量删除</el-button>
          <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon>导出Excel</el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">体质测试成绩数据管理</div>
        <div class="placeholder">
          <el-tooltip content="刷新" placement="top">
            <el-button circle @click="getList"><el-icon><Refresh /></el-icon></el-button>
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
          <el-table-column label="唯一标识" prop="zjsjwyxbs" min-width="160" show-overflow-tooltip sortable="custom" />
          <el-table-column label="学校代码" prop="xxdm" min-width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column label="学号" prop="xh" min-width="150" show-overflow-tooltip sortable="custom" />
          <el-table-column label="测试项目名称" prop="csxmmc" min-width="200" show-overflow-tooltip sortable="custom" />
          <el-table-column label="测试日期" prop="csrq" min-width="120" align="center" sortable="custom" />
          <el-table-column label="测试成绩" prop="cscj" min-width="120" align="center" sortable="custom" />
          <el-table-column label="测试等级" prop="csdj" min-width="120" align="center" sortable="custom">
            <template #default="{ row }">
              <span>{{ getCsdjText(row.csdj) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数据采集时间" prop="sjcjsj" min-width="150" align="center" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button link type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon>查看</el-button>
                <el-button link type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon>编辑</el-button>
                <el-button link type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon>删除</el-button>
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
            :page-sizes="[20, 50, 100, 200, 500]"
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
      :title="dialogTitle" 
      v-model="dialogVisible" 
      width="800px" 
      :close-on-click-modal="false"
      append-to-body
      style="height: 440px"
      class="professional-dialog"
      destroy-on-close
    >
      <el-form 
        v-if="dialogType !== 'view'"
        ref="formRef" 
        :model="form" 
        :rules="formRules" 
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input v-model="form.zjsjwyxbs" placeholder="后端自动生成" :disabled="dialogType !== 'add'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input v-model="form.xxdm" placeholder="系统自动获取" :disabled="true"  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号" prop="xh">
              <div style="display: flex; align-items: center; width: 100%">
              
                <el-select v-model="form.xh" 
                filterable
                remote
                :remote-method="remoteMethodXh"
                :loading="studentLoading"
                @change="handleXhChange"
                clearable
                placeholder="请选择学号或姓名" style="width:100%">
                  <el-option v-for="item in studentOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-tooltip
                    content="学号数据来源于学生信息数据子类表"
                    placement="top"
                  >
                    <el-icon
                      style="margin-left: 8px; cursor: help; color: #e6a23c"
                      ><InfoFilled
                    /></el-icon>
                  </el-tooltip>
                </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试项目名称" prop="csxmmc">
              <el-input v-model="form.csxmmc" placeholder="请输入测试项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试日期" prop="csrq">
              <el-date-picker 
                v-model="form.csrq" 
                type="date" 
                placeholder="选择日期" 
                style="width:100%" 
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试成绩" prop="cscj">
              <el-input-number
                v-model="form.cscj"
                :precision="1"
                :step="0.1"
                placeholder="请输入测试成绩"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试等级" prop="csdj">
              <el-select v-model="form.csdj" placeholder="请选择测试等级" style="width:100%">
                <el-option v-for="item in csdjOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="格式：YYYYMMDD hhmmss"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
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
      <div v-else class="professional-detail">
        <el-descriptions
          class="detail-descriptions"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item label="唯一性标识"><div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="学校代码"><div class="detail-value">{{ form.xxdm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="学号"><div class="detail-value">{{ form.xh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="测试项目名称"><div class="detail-value">{{ form.csxmmc || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="测试日期"><div class="detail-value">{{ form.csrq || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="测试成绩"><div class="detail-value">{{ form.cscj || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="测试等级"><div class="detail-value">{{ getCsdjText(form.csdj || '') || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="数据采集时间"><div class="detail-value">{{ form.sjcjsj || "-" }}</div></el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm" v-if="dialogType !== 'view'">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { Search, Refresh, Plus, Delete, Edit, View, Download } from '@element-plus/icons-vue';
import {
  getOdsTzcscjsjPage,
  addOdsTzcscjsj,
  updateOdsTzcscjsj,
  deleteOdsTzcscjsj,
  batchDeleteOdsTzcscjsj,
  getStudentOptions,
  getSystemSchoolCode,
  exportOdsTzcscjsj,
  OdsTzcscjsjQuery,
  OdsTzcscjsjInfo,
  OdsTzcscjsjForm
} from '@/api/meta/meta_base/zygxs/ods_tzcscjsj';


// =======================> 数据定义 <=======================
const loading = ref(false);
const selectedIds = ref<number[]>([]);
const dataList = ref<OdsTzcscjsjInfo[]>([]);
const total = ref(0);
const queryFormRef = ref<FormInstance>();
const studentOptions = ref<Array<{ value: string; label: string; xsxm: string }>>([]);
   const studentLoading = ref(false);
const queryParams = reactive<OdsTzcscjsjQuery>({
  pageNum: 1,
  pageSize: 20,
  zjsjwyxbs: undefined,
  xxdm: undefined,
  xh: undefined,
  csxmmc: undefined,
  csrq: undefined,
  cscj: undefined,
  csdj: undefined,
  sjcjsjStart: undefined,
  sjcjsjEnd: undefined
});
const systemSchoolCode = ref<string>('');
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogType = ref<'add' | 'edit' | 'view'>('add');

const formRef = ref<FormInstance>();
const form = ref<OdsTzcscjsjForm>({
  id: undefined,
  zjsjwyxbs: '',
  xxdm: '',
  xh: '',
  csxmmc: '',
  csrq: '',
  cscj: undefined,
  csdj: '',
  sjcjsj: '',
  enableStatus: '1',
});
const remoteMethodXh = (query: string) => {
  if (query) {
    fetchStudentOptions(query);
  } else {
    studentOptions.value = [];
  }
};
// 获取学号选项
const fetchStudentOptions = async (keyword?: string) => {
  try {
    studentLoading.value = true;
    const response: any = await getStudentOptions(keyword);
    if (response.data.code === 200 && response.data.data) {
      // 转换数据格式
      studentOptions.value = response.data.data.map((item: any) => ({
        value: item.xh,
        label: `${item.xh} - ${item.xsxm}`
      }));
    } else {
      console.warn("获取学号选项失败:", response.data.msg);
    }
  } catch (error) {
    console.error("获取学号选项失败:", error);
  } finally {
    studentLoading.value = false;
  }
};

const handleXhChange = (value: string) => {
  console.log("学号选择变化:", value);
  nextTick(() => {
    if (form) {
      form.value.xh = value || '';
     
    }
  });
};

// 日期时间格式验证
const validateDateTime = (_: any, value: string, callback: any) => {
  if (!value) {
    callback();
    return;
  }
  // YYYYMMDD HHmmss
  if (!/^\d{8} \d{6}$/.test(value)) {
    callback(new Error("日期时间格式必须为 YYYYMMDD HHmmss"));
    return;
  }

  const year = parseInt(value.substring(0, 4), 10);
  const month = parseInt(value.substring(4, 6), 10);
  const day = parseInt(value.substring(6, 8), 10);
  const hour = parseInt(value.substring(9, 11), 10);
  const minute = parseInt(value.substring(11, 13), 10);
  const second = parseInt(value.substring(13, 15), 10);

  const date = new Date(year, month - 1, day, hour, minute, second);

  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getSeconds() !== second
  ) {
    callback(new Error("日期时间格式不合法"));
    return;
  }

  if (date > new Date()) {
    callback(new Error("日期时间不能超过当前时间"));
    return;
  }

  callback();
};

const formRules = reactive({
  zjsjwyxbs: [
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (value && value.length > 0) {
          if (value.length !== 32) {
            callback(new Error("必须为32位字符"));
          } else if (!/^[A-Z0-9]{32}$/.test(value)) {
            callback(new Error("只能包含大写字母和数字"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  xxdm: [{ required: true, message: "学校代码不能为空", trigger: "blur" }],
  xh: [{ required: true, message: "学号不能为空", trigger: "blur" }],
  csxmmc: [
    { required: true, message: "测试项目名称不能为空", trigger: "blur" },
  ],
  csrq: [{ required: true, message: "测试日期不能为空", trigger: "change" }],
  cscj: [{ required: true, message: "测试成绩不能为空", trigger: "blur" }],
  csdj: [{ required: true, message: "测试等级不能为空", trigger: "change" }],
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "change" },
    { validator: validateDateTime, trigger: "blur" },
  ],
});

const csdjOptions = ref([
  { value: '1', label: '优秀' },
  { value: '2', label: '良好' },
  { value: '3', label: '及格' },
  { value: '4', label: '不及格' },
]);

// =======================> 函数定义 <=======================
const getCsdjText = (csdj: string) => {
  if (!csdj) return '';
  const option = csdjOptions.value.find(item => item.value === csdj);
  return option ? option.label : csdj;
};

function getList() {
  loading.value = true;
  getOdsTzcscjsjPage(queryParams).then((response: any) => {
    dataList.value = response.data.data.records;
    total.value = response.data.data.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

function resetQuery() {
  queryFormRef.value?.resetFields();
  handleQuery();
}

function handleSelectionChange(selection: any[]) {
  selectedIds.value = selection.map(item => item.id);
}

function resetForm() {
    form.value = {
    id: undefined,
    zjsjwyxbs: '',
    xxdm: systemSchoolCode.value,
    xh: '',
    csxmmc: '',
    csrq: '',
    cscj: undefined,
    csdj: '',
    sjcjsj: '',
    enableStatus: '1',
  };
  formRef.value?.clearValidate();
}

function handleAdd() {
  resetForm();
  dialogType.value = 'add';
  dialogTitle.value = '新增体质测试成绩';
  dialogVisible.value = true;
}

function handleView(row: OdsTzcscjsjInfo) {
  resetForm();
  dialogType.value = 'view';
  dialogTitle.value = '查看体质测试成绩';
  Object.assign(form.value, row);
  dialogVisible.value = true;
}

function handleEdit(row: OdsTzcscjsjInfo) {
  resetForm();
  dialogType.value = 'edit';
  dialogTitle.value = '编辑体质测试成绩';
  Object.assign(form.value, row);
  dialogVisible.value = true;
}

async function submitForm() {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    const action = dialogType.value === 'add' ? addOdsTzcscjsj(form.value) : updateOdsTzcscjsj(form.value);
    await action;
    ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功');
    dialogVisible.value = false;
    getList();
  } catch (error) {
    console.log('表单校验失败', error);
  }
}

function cancel() {
  dialogVisible.value = false;
}

function handleDelete(row: OdsTzcscjsjInfo) {
  ElMessageBox.confirm(`是否确认删除学号为【${row.xh}】的数据项?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    return deleteOdsTzcscjsj(row.id);
  }).then(() => {
    ElMessage.success('删除成功');
    getList();
  });
}

function handleBatchDelete() {
    ElMessageBox.confirm(`是否确认删除选中的【${selectedIds.value.length}】项数据?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    return batchDeleteOdsTzcscjsj(selectedIds.value);
  }).then(() => {
    ElMessage.success('删除成功');
    getList();
  });
}

function handleExport() {
  exportOdsTzcscjsj(queryParams).then((response: any) => {
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '体质测试成绩数据.xlsx';
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

// 行点击事件
const handleRowClick = (row: any) => {
  // 可以在这里添加行点击逻辑
};

// 行双击事件
const handleRowDblClick = (row: any) => {
  handleView(row);
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

// 当前页码变化
const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};
// 获取并设置学校代码
const fetchAndSetSchoolCode = async () => {
  try {
    const response: any = await getSystemSchoolCode();
    if (response.data.code === 200 && response.data.data) {
  
      
      form.value.xxdm = response.data.data;
      console.log(form.value.xxdm);
      systemSchoolCode.value = response.data.data;
    } else {
      console.warn("获取学校代码失败:", response.data.msg);
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
  }
};
onMounted(async () => {
  await fetchStudentOptions();
  await fetchAndSetSchoolCode();
  getList();
});
</script>

<style lang="scss" scoped>
/* 主容器样式 */
.professional-development-management {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 搜索卡片样式 */
.search-card {
  height: 60px;
  flex-shrink: 0;
}

.search-bar {
  margin-top: -5px;
}

/* 表格卡片样式 */
.table-card {
  margin-top: -28px;
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);

  :deep(.el-card__body) {
    padding: 0;
  }
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fafafa;

  .operation-buttons {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-button {
      font-size: 14px;
      height: 32px;
      padding: 0 15px;
    }

    .el-divider--vertical {
      height: 20px;
      margin: 0 12px;
    }
  }

  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    flex: 1;
    text-align: center;
  }

  .placeholder {
    width: 100px;
    display: flex;
    justify-content: flex-end;
  }
}

.table-body {
  :deep(.el-table) {
    border-radius: 0;

    .el-table__header-wrapper {
      th {
        background-color: #f8f9fa;
        color: #606266;
        font-weight: 600;
        border-bottom: 1px solid #e4e7ed;
      }
    }

    .el-table__body-wrapper {
      tr:hover > td {
        background-color: #f5f7fa !important;
      }
    }
  }
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  border-top: 1px solid #e4e7ed;
  background-color: #fafafa;

  .total-info {
    font-size: 14px;
    color: #606266;
  }

  .pagination-controls {
    :deep(.el-pagination) {
      .el-pagination__total,
      .el-pagination__jump {
        color: #606266;
        font-size: 13px;
      }

      .el-pagination__sizes .el-select .el-input__wrapper {
        height: 28px;
      }

      .el-pager li {
        font-size: 13px;
        min-width: 28px;
        height: 28px;
        line-height: 28px;
      }

      .el-pagination__jump .el-input__wrapper {
        height: 28px;
      }
    }
  }
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  justify-content: center;

  .el-button {
    margin: 0 3px;
    padding: 0 5px;
    font-size: 14px;
  }
}

/* 弹窗样式 */
.professional-dialog {
  :deep(.el-dialog__body) {
    padding: 20px 24px;
    max-height: 65vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  :deep(.el-dialog__footer) {
    padding: 15px 24px 20px;
    border-top: 1px solid #e4e7ed;
  }
}

/* 统一表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 22px !important;
}

:deep(.el-row) {
  margin-bottom: 0 !important;

  .el-form-item {
    margin-bottom: 22px !important;
  }
}

/* 对话框样式 */
:deep(.el-dialog) {
  .el-dialog__header {
    padding: 24px 24px 16px;
    border-bottom: 1px solid #e4e7ed;
  }

  .el-dialog__body {
    padding: 24px 24px 32px;
    max-height: 65vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .el-dialog__footer {
    padding: 20px 24px 24px;
    border-top: 1px solid #e4e7ed;
  }
}

.dialog-footer {
  text-align: right;
}

/* 详情样式 */
.professional-detail {
  .detail-descriptions {
    :deep(.el-descriptions__label) {
      font-weight: 600;
      color: #303133;
      width: 160px;
      font-size: 14px;
      background-color: #fafafa;
    }

    :deep(.el-descriptions__content) {
      color: #606266;
      font-size: 14px;
      padding: 12px 16px;
    }
  }

  .detail-value {
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
}

/* 按钮间距 */
:deep(.el-button + .el-button) {
  margin-left: 8px;
}

/* 卡片样式 */
:deep(.el-card) {
  .el-card__body {
    padding: 20px;
  }
}
</style>
