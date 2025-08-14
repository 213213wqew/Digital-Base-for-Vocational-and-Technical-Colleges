<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, View, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsZzfbsjPage,
  getOdsZzfbsjById,
  addOdsZzfbsj,
  updateOdsZzfbsj,
  deleteOdsZzfbsj,
  batchDeleteOdsZzfbsj,
  exportOdsZzfbsj,
  getSystemSchoolCode, // 假设API文件中会添加
  type OdsZzfbsjInfo,
  type OdsZzfbsjQuery,
  type OdsZzfbsjForm,
} from "@/api/meta/meta_base/zygky/ods_zzfbsj";

const loading = ref(false);
const dataList = ref<OdsZzfbsjInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const selectedIds = ref<number[]>([]);
const submitLoading = ref(false);
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();
const systemSchoolCode = ref("");

const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add": return "新增专著发表数据";
    case "edit": return "编辑专著发表数据";
    case "view": return "查看专著发表数据";
    default: return "专著发表数据";
  }
});

const queryParams = reactive<OdsZzfbsjQuery>({
  zzbh: "",
  zzzwmc: "",
  dywcrgh: "",
  pageNum: 1,
  pageSize: 20,
});

const form = reactive<OdsZzfbsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  zzbh: "",
  zzzwmc: "",
  zzjj: "",
  cbrq: "",
  dywcrgh: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

const formRules = reactive({
  zjsjwyxbs: [ { validator: (rule: any, value: string, callback: Function) => {
      if (!value) { callback(); }
      else if (value.length !== 32) { callback(new Error('唯一编码必须是32位')); }
      else if (!/^[A-Z0-9]+$/.test(value)) { callback(new Error('只能包含大写字母和数字')); }
      else { callback(); }
    }, trigger: 'blur' }
  ],
  xxdm: [{ required: true, message: "学校代码是必填项", trigger: "blur" }],
  zzbh: [{ required: true, message: "专著编号是必填项", trigger: "blur" }, { max: 100, message: "长度不超过100个字符", trigger: "blur" }],
  zzzwmc: [{ required: true, message: "专著中文名称是必填项", trigger: "blur" }, { max: 200, message: "长度不超过200个字符", trigger: "blur" }],
  cbrq: [{ required: true, message: "出版日期是必填项", trigger: "change" }],
  dywcrgh: [{ required: true, message: "第一完成人工号是必填项", trigger: "blur" }, { max: 20, message: "长度不超过20个字符", trigger: "blur" }],
  sjcjsj: [{ required: true, message: "数据采集时间是必填项", trigger: "change" }],
});

const getReportStatusText = (status: string) => {
  if (status === "0") return "未上报";
  if (status === "1") return "已上报";
  if (status === "2") return "上报失败";
  return "未知";
};

const getReportStatusTagType = (status: string) => {
  if (status === "0") return "info";
  if (status === "1") return "success";
  if (status === "2") return "danger";
  return "warning";
};

const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsZzfbsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    }
  } finally {
    loading.value = false;
  }
};

const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

const resetQuery = () => {
  queryFormRef.value?.resetFields();
  getList();
};

const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    zzbh: "",
    zzzwmc: "",
    zzjj: "",
    cbrq: "",
    dywcrgh: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

const handleEdit = async (row: OdsZzfbsjInfo) => {
  resetForm();
  const response = await getOdsZzfbsjById(row.id);
  Object.assign(form, response.data.data);
  dialogMode.value = "edit";
  dialogVisible.value = true;
};

const handleView = async (row: OdsZzfbsjInfo) => {
  resetForm();
  const response = await getOdsZzfbsjById(row.id);
  Object.assign(form, response.data.data);
  dialogMode.value = "view";
  dialogVisible.value = true;
};

const handleDelete = async (row: OdsZzfbsjInfo) => {
  await ElMessageBox.confirm("确定要删除这条数据吗？", "提示", { type: "warning" });
  await deleteOdsZzfbsj(row.id);
  ElMessage.success("删除成功");
  getList();
};

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) return;
  await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, "提示", { type: "warning" });
  await batchDeleteOdsZzfbsj(selectedIds.value);
  ElMessage.success("删除成功");
  getList();
};

const handleExport = async () => {
  const response = await exportOdsZzfbsj(queryParams);
  const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `专著发表数据_${new Date().getTime()}.xlsx`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const handleStatusChange = async (row: OdsZzfbsjInfo) => {
  try {
    const response = await updateOdsZzfbsj({ id: row.id, enableStatus: row.enableStatus });
    if (response.code === 200) {
      ElMessage.success("状态修改成功");
    } else {
      ElMessage.error("状态修改失败");
      row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    }
  } catch {
    ElMessage.error("状态修改失败");
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
  }
};

const handleFormSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate();
  submitLoading.value = true;
  try {
    if (dialogMode.value === "add") {
      await addOdsZzfbsj(form);
      ElMessage.success("新增成功");
    } else {
      await updateOdsZzfbsj(form);
      ElMessage.success("修改成功");
    }
    dialogVisible.value = false;
    getList();
  } finally {
    submitLoading.value = false;
  }
};

const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

const handleSelectionChange = (selection: OdsZzfbsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

const getSystemSchoolCodeData = async () => {
  const response = await getSystemSchoolCode();
  if (response.data.code === 200) {
    systemSchoolCode.value = response.data.data;
    form.xxdm = response.data.data;
  }
};

onMounted(() => {
  getSystemSchoolCodeData();
  getList();
});
</script>

<template>
  <div class="monograph-publication-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
          <el-form-item label="专著编号" prop="zzbh">
            <el-input
              v-model="queryParams.zzbh"
              placeholder="请输入专著编号"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="专著名称" prop="zzzwmc">
            <el-input
              v-model="queryParams.zzzwmc"
              placeholder="请输入专著名称"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="第一完成人" prop="dywcrgh">
            <el-input
              v-model="queryParams.dywcrgh"
              placeholder="请输入第一完成人工号"
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
        </div>
        <div class="header-title">专著发表数据管理</div>
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
          @row-dblclick="handleView"
          :height="'calc(75vh - 160px)'"
          stripe
          size="default"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column prop="zjsjwyxbs" label="唯一性标识" min-width="180" show-overflow-tooltip />
          <el-table-column prop="xxdm" label="学校代码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="zzbh" label="专著编号" min-width="150" show-overflow-tooltip />
          <el-table-column prop="zzzwmc" label="专著中文名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="cbrq" label="出版日期" min-width="120" />
          <el-table-column prop="dywcrgh" label="第一完成人工号" min-width="140" show-overflow-tooltip />
          <el-table-column prop="sjcjsj" label="数据采集时间" min-width="160" />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getReportStatusTagType(row.reportStatus)">{{ getReportStatusText(row.reportStatus) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.enableStatus" active-value="1" inactive-value="0" @change="handleStatusChange(row)" />
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="160" />
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" :close-on-click-modal="false" class="data-form-dialog" destroy-on-close @close="handleFormClose">
      <el-form v-if="dialogMode !== 'view'" ref="formRef" :model="form" :rules="formRules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input v-model="form.zjsjwyxbs" placeholder="可不填，后端自动生成32位唯一编码" maxlength="32" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input v-model="form.xxdm" placeholder="系统自动获取学校代码" maxlength="10" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="专著编号" prop="zzbh">
              <el-input v-model="form.zzbh" placeholder="请输入专著编号" maxlength="100" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="出版日期" prop="cbrq">
              <el-date-picker v-model="form.cbrq" type="date" placeholder="请选择出版日期" format="YYYYMMDD" value-format="YYYYMMDD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px;">
            <el-form-item label="专著中文名称" prop="zzzwmc">
              <el-input v-model="form.zzzwmc" placeholder="请输入专著中文名称" maxlength="200" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="第一完成人工号" prop="dywcrgh">
              <el-input v-model="form.dywcrgh" placeholder="请输入第一完成人工号" maxlength="20" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="请选择数据采集时间" format="YYYYMMDD HHmmss" value-format="YYYYMMDD HHmmss" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px;">
            <el-form-item label="专著简介" prop="zzjj">
              <el-input v-model="form.zzjj" type="textarea" :rows="4" placeholder="请输入专著简介" maxlength="2000" show-word-limit />
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

      <div v-else class="detail-view">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="唯一性标识">{{ form.zjsjwyxbs }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{ form.xxdm }}</el-descriptions-item>
          <el-descriptions-item label="专著编号">{{ form.zzbh }}</el-descriptions-item>
          <el-descriptions-item label="专著中文名称" :span="2">{{ form.zzzwmc }}</el-descriptions-item>
          <el-descriptions-item label="出版日期">{{ form.cbrq }}</el-descriptions-item>
          <el-descriptions-item label="第一完成人工号">{{ form.dywcrgh }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{ form.sjcjsj }}</el-descriptions-item>
          <el-descriptions-item label="专著简介" :span="2">{{ form.zzjj || '无' }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(form.reportStatus)">{{ getReportStatusText(form.reportStatus) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag :type="form.enableStatus === '1' ? 'success' : 'danger'">{{ form.enableStatus === "1" ? "启用" : "禁用" }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ form.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ form.updateTime }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogMode !== 'view'" type="primary" :loading="submitLoading" @click="handleFormSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.monograph-publication-management {
  padding: 20px;
}
.search-card {
  margin-bottom: 8px;
}
.search-bar {
  padding: 8px;
}
.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.search-buttons {
  margin-bottom: 0;
  margin-right: 0;
}
:deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 8px;
}
:deep(.el-button) {
  height: 32px;
  padding: 8px 15px;
}
.table-card {
  margin-top: -10px;
}
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 2px;
}
.operation-buttons {
  display: flex;
  gap: 10px;
}
.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.action-buttons {
  display: flex;
  gap: 2px;
}
:deep(.action-buttons .el-button) {
  padding: 2px 4px;
  font-size: 12px;
}
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  padding: 2px 2px;
}
.total-info {
  color: #606266;
  font-size: 14px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.data-form-dialog {
  border-radius: 8px;
}
.detail-view {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px 0;
}
:deep(.data-form-dialog .el-dialog__header) {
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 15px 20px;
}
:deep(.data-form-dialog .el-dialog__title) {
  color: white;
  font-weight: 600;
}
:deep(.data-form-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
}
:deep(.data-form-dialog .el-dialog__body) {
  padding: 20px 24px;
  max-height: 60vh;
  overflow-y: auto;
}
:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa !important;
  box-shadow: 0 0 0 1px #e4e7ed inset !important;
}

:deep(.el-input.is-disabled .el-input__inner) {
  background-color: transparent !important;
  color: #606266 !important;
}
</style>
