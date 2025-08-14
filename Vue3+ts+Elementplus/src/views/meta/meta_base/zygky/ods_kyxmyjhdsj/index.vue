<template>
  <div class="research-activity-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
          <el-form-item label="项目编号" prop="kyxmbh">
            <el-input
              v-model="queryParams.kyxmbh"
              placeholder="请输入科研项目编号"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="项目名称" prop="kyxmmc">
            <el-input
              v-model="queryParams.kyxmmc"
              placeholder="请输入科研项目名称"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
           <el-form-item label="活动主题" prop="kyxmyjhdzt">
            <el-input
              v-model="queryParams.kyxmyjhdzt"
              placeholder="请输入研究活动主题"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item class="search-buttons">
            <el-button type="primary" @click="handleQuery" style="margin-left: 8px;">
              <el-icon><Search /></el-icon>搜索
            </el-button>
            <el-button @click="resetQuery" style="margin-left: 8px;">
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
        <div class="header-title">科研项目研究活动数据管理</div>
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
          :height="'calc(75vh - 160px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column prop="kyxmbh" label="项目编号" min-width="150" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="kyxmmc" label="项目名称" min-width="200" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="kyxmyjhdzt" label="研究活动主题" min-width="180" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="kyxmyjhdrq" label="活动日期" min-width="120" align="center" sortable="custom" />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getReportStatusTagType(row.reportStatus)" size="small">
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enableStatus === '1' ? 'success' : 'danger'" size="small">
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="160" align="center" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button link type="primary" size="small" @click="handleView(row)">
                  <el-icon><View /></el-icon>查看
                </el-button>
                <el-button link type="primary" size="small" @click="handleEdit(row)">
                  <el-icon><Edit /></el-icon>编辑
                </el-button>
                <el-button link type="danger" size="small" @click="handleDelete(row)">
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
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 600px"
      class="research-activity-dialog"
      destroy-on-close
      @close="handleFormClose"
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="160px"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input v-model="form.zjsjwyxbs" placeholder="可不填，后端自动生成" maxlength="32" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input v-model="form.xxdm" placeholder="系统自动获取学校代码" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px;">
            <el-form-item label="科研项目" prop="kyxmbh">
              <div style="display: flex; align-items: center; gap: 8px"> 
              <el-select
                v-model="form.kyxmbh"
                placeholder="请输入项目编号或名称进行搜索"
                filterable
                remote
                :remote-method="searchKyxmjb"
                :loading="projectSearchLoading"
                style="width: 100%;"
                @change="handleProjectSelect"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="`${item.kyxmbh} - ${item.kyxmmc}`"
                  :value="item.kyxmbh"
                />
              </el-select>
              <el-tooltip content="数据来源于科研项目表" placement="top">
                <el-icon style="color: #e6a23c"><Warning /></el-icon>
              </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="科研项目名称" prop="kyxmmc">
              <div style="display: flex; align-items: center; gap: 8px"> 
                <el-input v-model="form.kyxmmc" placeholder="选择科研项目后自动填充" :disabled="true" />
                <el-tooltip content="数据来源于科研项目表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="研究活动主题" prop="kyxmyjhdzt">
              <el-input v-model="form.kyxmyjhdzt" placeholder="请输入研究活动主题" maxlength="200" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px;">
            <el-form-item label="活动内容简介" prop="kyxmyjhdnrjj">
              <el-input v-model="form.kyxmyjhdnrjj" type="textarea" :rows="4" placeholder="请输入活动内容简介" maxlength="2000" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="研究活动日期" prop="kyxmyjhdrq">
              <el-date-picker v-model="form.kyxmyjhdrq" type="date" placeholder="请选择活动日期" format="YYYYMMDD" value-format="YYYYMMDD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="请选择数据采集时间" format="YYYYMMDD HHmmss" value-format="YYYYMMDD HHmmss" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select v-model="form.enableStatus" placeholder="请选择启用状态" style="width: 100%">
                <el-option label="禁用" value="0" />
                <el-option label="启用" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="research-activity-detail">
        <el-descriptions class="detail-descriptions" :column="2" size="large" border>
          <el-descriptions-item label="唯一性标识"><div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="学校代码"><div class="detail-value">{{ form.xxdm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="科研项目编号"><div class="detail-value">{{ form.kyxmbh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="科研项目名称"><div class="detail-value">{{ form.kyxmmc || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="研究活动主题" :span="2"><div class="detail-value">{{ form.kyxmyjhdzt || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="活动内容简介" :span="2"><div class="detail-value">{{ form.kyxmyjhdnrjj || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="研究活动日期"><div class="detail-value">{{ form.kyxmyjhdrq || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="数据采集时间"><div class="detail-value">{{ form.sjcjsj || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag :type="form.enableStatus === '1' ? 'success' : 'danger'" size="small">
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(form.reportStatus)" size="small">
              {{ getReportStatusText(form.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间"><div class="detail-value">{{ form.createTime || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="更新时间"><div class="detail-value">{{ form.updateTime || "-" }}</div></el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, View, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsKyxmyjhdsjPage,
  getOdsKyxmyjhdsjById,
  addOdsKyxmyjhdsj,
  updateOdsKyxmyjhdsj,
  deleteOdsKyxmyjhdsj,
  batchDeleteOdsKyxmyjhdsj,
  exportOdsKyxmyjhdsj,
  getSystemSchoolCode,
  searchOdsKyxmjbsj,
  type OdsKyxmyjhdsjInfo,
  type OdsKyxmyjhdsjQuery,
  type OdsKyxmyjhdsjForm,
} from "@/api/meta/meta_base/zygky/ods_kyxmyjhdsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsKyxmyjhdsjInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const selectedIds = ref<number[]>([]);

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add": return "新增科研项目研究活动数据";
    case "edit": return "编辑科研项目研究活动数据";
    case "view": return "查看科研项目研究活动数据";
    default: return "科研项目研究活动数据";
  }
});

// 搜索条件
const queryParams = reactive<OdsKyxmyjhdsjQuery>({
  kyxmbh: "",
  kyxmmc: "",
  kyxmyjhdzt: "",
  pageNum: 1,
  pageSize: 20,
});
const queryFormRef = ref<FormInstance>();

// 表单相关
const form = reactive<OdsKyxmyjhdsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  kyxmbh: "",
  kyxmmc: "",
  kyxmyjhdzt: "",
  kyxmyjhdnrjj: "",
  kyxmyjhdrq: "",
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const systemSchoolCode = ref("");

// --- 科研项目远程搜索 ---
const projectSearchLoading = ref(false);
const projectList = ref<OdsKyxmyjhdsjInfo[]>([]);

const searchKyxmjb = async (keyword: string) => {
  if (keyword) {
    projectSearchLoading.value = true;
    try {
      const response: any = await searchOdsKyxmjbsj(keyword);
      if (response.data.code === 200) {
        projectList.value = response.data.data;
      } else {
        projectList.value = [];
      }
    } finally {
      projectSearchLoading.value = false;
    }
  } else {
    projectList.value = [];
  }
};

const handleProjectSelect = (kyxmbh: string) => {
  const selectedProject = projectList.value.find(p => p.kyxmbh === kyxmbh);
  if (selectedProject) {
    form.kyxmmc = selectedProject.kyxmmc;
  }
};
// -----------------------

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { 
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback(); // 为空时通过验证
        } else if (value.length !== 32) {
          callback(new Error('唯一编码必须是32位'));
        } else if (!/^[A-Z0-9]+$/.test(value)) {
          callback(new Error('只能包含大写字母和数字'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  xxdm: [ { required: true, message: "学校代码不能为空", trigger: "blur" } ],
  kyxmbh: [ { required: true, message: "科研项目编号不能为空", trigger: "blur" } ],
  kyxmmc: [ { required: true, message: "科研项目名称不能为空", trigger: "blur" } ],
  kyxmyjhdzt: [ { required: true, message: "科研项目研究活动主题不能为空", trigger: "blur" } ],
  kyxmyjhdrq: [ { required: true, message: "科研项目研究活动日期不能为空", trigger: "change" } ],
  sjcjsj: [ { required: true, message: "数据采集时间不能为空", trigger: "change" } ],
});

// 状态文本和标签类型
const getReportStatusText = (status: string) => ({ "0": "未上报", "1": "已上报", "2": "上报失败" }[status] || "未知");
const getReportStatusTagType = (status: string) => ({ "0": "info", "1": "success", "2": "danger" }[status] || "warning");

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsKyxmyjhdsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    }
  } finally {
    loading.value = false;
  }
};

const handleQuery = () => { queryParams.pageNum = 1; getList(); };
const resetQuery = () => { queryFormRef.value?.resetFields(); handleQuery(); };

const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    kyxmbh: "",
    kyxmmc: "",
    kyxmyjhdzt: "",
    kyxmyjhdnrjj: "",
    kyxmyjhdrq: "",
    sjcjsj: "",
    enableStatus: "1",
  });
  projectList.value = [];
  formRef.value?.clearValidate();
};

const handleAdd = () => { resetForm(); dialogMode.value = "add"; dialogVisible.value = true; };

const handleEdit = async (row: OdsKyxmyjhdsjInfo) => {
  const response: any = await getOdsKyxmyjhdsjById(row.id);
  if (response.data.code === 200) {
    Object.assign(form, response.data.data);
    // 回显远程搜索的下拉框
    projectList.value = [{
        id: response.data.data.id,
        kyxmbh: response.data.data.kyxmbh,
        kyxmmc: response.data.data.kyxmmc,
    }] as OdsKyxmyjhdsjInfo[];

    dialogMode.value = "edit";
    dialogVisible.value = true;
  }
};

const handleView = async (row: OdsKyxmyjhdsjInfo) => {
  const response: any = await getOdsKyxmyjhdsjById(row.id);
  if (response.data.code === 200) {
    Object.assign(form, response.data.data);
    dialogMode.value = "view";
    dialogVisible.value = true;
  }
};

const handleDelete = async (row: OdsKyxmyjhdsjInfo) => {
  await ElMessageBox.confirm("确定要删除这条数据吗？", "提示", { type: "warning" });
  await deleteOdsKyxmyjhdsj(row.id);
  ElMessage.success("删除成功");
  getList();
};

const handleBatchDelete = async () => {
  await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, "提示", { type: "warning" });
  await batchDeleteOdsKyxmyjhdsj(selectedIds.value);
  ElMessage.success("批量删除成功");
  getList();
};

const handleExport = async () => {
  const response = await exportOdsKyxmyjhdsj(queryParams);
  const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `科研活动数据_${Date.now()}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(link.href);
  ElMessage.success("导出成功");
};

const handleFormSubmit = async () => {
  await formRef.value?.validate();
  submitLoading.value = true;
  try {
    const api = dialogMode.value === 'add' ? addOdsKyxmyjhdsj : updateOdsKyxmyjhdsj;
    await api(form);
    ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '修改成功');
    dialogVisible.value = false;
    getList();
  } finally {
    submitLoading.value = false;
  }
};

const handleFormClose = () => { dialogVisible.value = false; resetForm(); };
const handleSelectionChange = (selection: OdsKyxmyjhdsjInfo[]) => { selectedIds.value = selection.map(item => item.id); };
const handleRowDblClick = (row: OdsKyxmyjhdsjInfo) => handleView(row);
const handleRowClick = () => {};
const handleSizeChange = (size: number) => { queryParams.pageSize = size; getList(); };
const handleCurrentChange = (page: number) => { queryParams.pageNum = page; getList(); };

onMounted(async () => {
  try {
    const response: any = await getSystemSchoolCode();
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      form.xxdm = response.data.data;
    }
  } catch(e) { console.error("获取学校代码失败", e); }
  getList();
});
</script>

<style scoped lang="scss">
.research-activity-management { padding: 0px; }
.search-card { margin-bottom: 8px; }
.search-bar { padding: 8px; }
.search-form { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.search-buttons { margin-bottom: 0; margin-right: 0; }
:deep(.el-form-item) { margin-bottom: 0; margin-right: 8px; }
:deep(.el-form-item__content) { display: flex; align-items: center; }
:deep(.el-button) { height: 32px; padding: 8px 15px; }
.table-card { margin-top: -10px; }
.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 2px; }
.operation-buttons { display: flex; gap: 10px; }
.header-title { font-size: 16px; font-weight: bold; color: #303133; }
.action-buttons { display: flex; gap: 2px; }
.pagination-wrapper { display: flex; justify-content: space-between; align-items: center; margin-top: 5px; padding: 2px 2px; }
.total-info { color: #606266; font-size: 14px; }
.dialog-footer { display: flex; justify-content: flex-end; gap: 10px; }
.research-activity-dialog { border-radius: 8px; }
.research-activity-detail { max-height: 60vh; overflow-y: auto; padding: 10px 0; }
.detail-descriptions { margin-bottom: 20px; }
.detail-value { color: #303133; font-weight: 500; word-break: break-all; }
.detail-value:empty::before { content: "-"; color: #909399; }
:deep(.el-table .el-table__body-wrapper .el-table__row) { transition: background-color 0.2s ease; }
:deep(.el-table .el-table__body-wrapper .el-table__row:hover) { background-color: #f5f7fa; }
:deep(.research-activity-dialog .el-dialog__header) { background: linear-gradient(90deg, #409eff 0%, #67c23a 100%); color: white; border-radius: 8px 8px 0 0; padding: 15px 20px; }
:deep(.research-activity-dialog .el-dialog__title) { color: white; font-weight: 600; }
:deep(.research-activity-dialog .el-dialog__headerbtn) { top: 50%; transform: translateY(-50%); }
:deep(.research-activity-dialog .el-dialog__headerbtn .el-dialog__close) { color: white; font-size: 18px; }
:deep(.research-activity-dialog .el-dialog__body) { padding: 20px 24px; max-height: calc(600px - 55px - 69px); overflow-y: auto; }
:deep(.el-form-item__label) { font-weight: 500; color: #303133; }
:deep(.el-input__wrapper), :deep(.el-select .el-input__wrapper) { border-radius: 6px; }
:deep(.operation-buttons .el-button) { border-radius: 6px; font-weight: 500; }
:deep(.action-buttons .el-button) { padding: 2px 4px; font-size: 12px; }
:deep(.el-tag) { border-radius: 4px; font-weight: 500; }
:deep(.el-input.is-disabled .el-input__wrapper) { background-color: #f5f7fa !important; box-shadow: 0 0 0 1px #e4e7ed inset !important; }
:deep(.el-input.is-disabled .el-input__inner) { background-color: transparent !important; color: #606266 !important; }
</style>
