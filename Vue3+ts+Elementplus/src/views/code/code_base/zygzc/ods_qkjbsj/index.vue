<template>
  <div class="periodical-data-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
          <el-form-item label="期刊编号" prop="qkbh">
            <el-input
              v-model="queryParams.qkbh"
              placeholder="请输入期刊编号"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="期刊中文名称" prop="qkzwmc">
            <el-input
              v-model="queryParams.qkzwmc"
              placeholder="请输入期刊中文名称"
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
        <div class="header-title">期刊基本数据管理</div>
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
          <el-table-column prop="qkbh" label="期刊编号" min-width="150" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="qkzwmc" label="期刊中文名称" min-width="200" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="qkywmc" label="期刊英文名称" min-width="200" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="qkcbh" label="期刊出版号" min-width="150" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="bjb" label="编辑部" min-width="150" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="zb" label="主编" min-width="120" show-overflow-tooltip sortable="custom" />
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
      width="900px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 700px"
      class="periodical-data-dialog"
      destroy-on-close
      @close="handleFormClose"
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
            <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="唯一性标识" prop="zjsjwyxbs"><el-input v-model="form.zjsjwyxbs" placeholder="可不填，后端自动生成" maxlength="32" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="学校代码" prop="xxdm"><el-input v-model="form.xxdm" placeholder="系统自动获取" :disabled="true" /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="期刊编号" prop="qkbh"><el-input v-model="form.qkbh" placeholder="请输入期刊编号" maxlength="20" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="期刊条形码" prop="qktxm"><el-input v-model="form.qktxm" placeholder="请输入期刊条形码" maxlength="14" show-word-limit /></el-form-item></el-col>
          <el-col :span="24" style="margin-bottom: 18px;"><el-form-item label="期刊中文名称" prop="qkzwmc"><el-input v-model="form.qkzwmc" placeholder="请输入期刊中文名称" maxlength="200" show-word-limit /></el-form-item></el-col>
          <el-col :span="24" style="margin-bottom: 18px;"><el-form-item label="期刊英文名称" prop="qkywmc"><el-input v-model="form.qkywmc" placeholder="请输入期刊英文名称" maxlength="180" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="期刊出版号" prop="qkcbh"><el-input v-model="form.qkcbh" placeholder="请输入期刊出版号" maxlength="30" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="编辑部" prop="bjb"><el-input v-model="form.bjb" placeholder="请输入编辑部" maxlength="60" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="主编" prop="zb"><el-input v-model="form.zb" placeholder="请输入主编" maxlength="36" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="每期单价" prop="mqdj"><el-input-number v-model="form.mqdj" :precision="1" :step="0.1" :min="0" placeholder="请输入每期单价" style="width:100%"/></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="创刊年月" prop="ckny"><el-date-picker v-model="form.ckny" type="month" placeholder="请选择创刊年月" format="YYYYMM" value-format="YYYYMM" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="年号" prop="nh"><el-date-picker v-model="form.nh" type="year" placeholder="请选择年号" format="YYYY" value-format="YYYY" style="width:100%" /></el-form-item></el-col>
          <el-col :span="8" style="margin-bottom: 18px;"><el-form-item label="卷号" prop="jh"><el-input v-model="form.jh" placeholder="请输入卷号" maxlength="40" show-word-limit /></el-form-item></el-col>
          <el-col :span="8" style="margin-bottom: 18px;"><el-form-item label="期号" prop="qh"><el-input v-model="form.qh" placeholder="请输入期号" maxlength="10" show-word-limit /></el-form-item></el-col>
          <el-col :span="8" style="margin-bottom: 18px;"><el-form-item label="总期号" prop="zqh"><el-input v-model="form.zqh" placeholder="请输入总期号" maxlength="32" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="分类号" prop="flh"><el-input v-model="form.flh" placeholder="请输入分类号" maxlength="35" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="中国语种码" prop="zgyzm"><el-select v-model="form.zgyzm" placeholder="请选择中国语种码" style="width:100%" clearable><el-option v-for="item in dictData.zgyzmOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="数据采集时间" prop="sjcjsj"><el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="请选择数据采集时间" format="YYYYMMDD HHmmss" value-format="YYYYMMDD HHmmss" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="启用状态" prop="enableStatus"><el-select v-model="form.enableStatus" placeholder="请选择启用状态" style="width:100%"><el-option label="禁用" value="0" /><el-option label="启用" value="1" /></el-select></el-form-item></el-col>
            </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="periodical-data-detail">
        <el-descriptions class="detail-descriptions" :column="2" size="large" border>
          <el-descriptions-item label="唯一性标识"><div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="学校代码"><div class="detail-value">{{ form.xxdm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="期刊编号"><div class="detail-value">{{ form.qkbh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="期刊条形码"><div class="detail-value">{{ form.qktxm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="期刊中文名称" :span="2"><div class="detail-value">{{ form.qkzwmc || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="期刊英文名称" :span="2"><div class="detail-value">{{ form.qkywmc || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="期刊出版号"><div class="detail-value">{{ form.qkcbh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="编辑部"><div class="detail-value">{{ form.bjb || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="主编"><div class="detail-value">{{ form.zb || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="每期单价"><div class="detail-value">{{ form.mqdj || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="创刊年月"><div class="detail-value">{{ form.ckny || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="年号"><div class="detail-value">{{ form.nh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="卷号"><div class="detail-value">{{ form.jh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="期号"><div class="detail-value">{{ form.qh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="总期号"><div class="detail-value">{{ form.zqh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="分类号"><div class="detail-value">{{ form.flh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="中国语种码"><div class="detail-value">{{ zgyzmText || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="数据采集时间"><div class="detail-value">{{ form.sjcjsj || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="启用状态"><el-tag :type="form.enableStatus === '1' ? 'success' : 'danger'" size="small">{{ form.enableStatus === "1" ? "启用" : "禁用" }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="上报状态"><el-tag :type="getReportStatusTagType(form.reportStatus)" size="small">{{ getReportStatusText(form.reportStatus) }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="创建时间"><div class="detail-value">{{ form.createTime || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="更新时间"><div class="detail-value">{{ form.updateTime || "-" }}</div></el-descriptions-item>
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

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, View, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getOdsQkjbsjPage,
  getOdsQkjbsjById,
  addOdsQkjbsj,
  updateOdsQkjbsj,
  deleteOdsQkjbsj,
  batchDeleteOdsQkjbsj,
  exportOdsQkjbsj,
  getSystemSchoolCode,
  getDictOptions, // Make sure getDictOptions is imported
  type OdsQkjbsjInfo,
  type OdsQkjbsjQuery,
  type OdsQkjbsjForm,
  type DictOption,
} from "@/api-code/code/code_base/zygzc/ods_qkjbsj";

// Reactive data
const loading = ref(false);
const dataList = ref<OdsQkjbsjInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const selectedIds = ref<number[]>([]);

const dialogTitle = computed(() => {
  const titles = { add: "新增期刊数据", edit: "编辑期刊数据", view: "查看期刊数据" };
  return titles[dialogMode.value] || "期刊数据";
});

const queryParams = reactive<OdsQkjbsjQuery>({
  qkbh: "",
  qkzwmc: "",
  pageNum: 1,
  pageSize: 20,
});
const queryFormRef = ref<FormInstance>();

const form = reactive<OdsQkjbsjForm>({
  id: undefined,
  zjsjwyxbs: "", xxdm: "", qkbh: "", qktxm: "", qkzwmc: "", qkywmc: "", qkcbh: "",
  bjb: "", zb: "", mqdj: undefined, ckny: "", nh: "", jh: "", qh: "", zqh: "", flh: "",
  zgyzm: "", sjcjsj: "", enableStatus: "1",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const systemSchoolCode = ref("");

const dictData = reactive({
  zgyzmOptions: [] as DictOption[],
});

const zgyzmText = computed(() => {
    return dictData.zgyzmOptions.find(o => o.value === form.zgyzm)?.label || form.zgyzm;
});

const formRules = reactive({
  zjsjwyxbs: [{ validator: (rule, value, callback) => {
      if (value && !/^[A-Z0-9]{32}$/.test(value)) {
        callback(new Error('唯一编码必须是32位大写字母和数字组合'));
      } else {
        callback();
      }
    }, trigger: 'blur'
  }],
  xxdm: [{ required: true, message: "学校代码不能为空", trigger: "blur" }],
  qkbh: [{ required: true, message: "期刊编号不能为空", trigger: "blur" }],
  qkzwmc: [{ required: true, message: "期刊中文名称不能为空", trigger: "blur" }],
  qkcbh: [{ required: true, message: "期刊出版号不能为空", trigger: "blur" }],
  sjcjsj: [{ required: true, message: "数据采集时间不能为空", trigger: "change" }],
});

const getReportStatusText = (status: string) => ({ "0": "未上报", "1": "已上报", "2": "上报失败" }[status] || "未知");
const getReportStatusTagType = (status: string) => ({ "0": "info", "1": "success", "2": "danger" }[status] || "warning");

const loadDictData = async () => {
  try {
    const res = await getDictOptions('ZGYZDM');
    if (res.data.code === 200) {
      dictData.zgyzmOptions = res.data.data || [];
    }
  } catch (error) {
    console.error("获取字典数据失败:", error);
  }
};

const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsQkjbsjPage(queryParams);
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
  handleQuery();
};

const resetForm = () => {
  Object.assign(form, {
    id: undefined, zjsjwyxbs: "", xxdm: systemSchoolCode.value, qkbh: "", qktxm: "", qkzwmc: "", qkywmc: "",
    qkcbh: "", bjb: "", zb: "", mqdj: undefined, ckny: "", nh: "", jh: "", qh: "", zqh: "", flh: "",
    zgyzm: "", sjcjsj: "", enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

const handleEdit = async (row: OdsQkjbsjInfo) => {
  const response: any = await getOdsQkjbsjById(row.id);
  if (response.data.code === 200) {
    Object.assign(form, response.data.data);
    dialogMode.value = "edit";
      dialogVisible.value = true;
  }
};

const handleView = async (row: OdsQkjbsjInfo) => {
  const response: any = await getOdsQkjbsjById(row.id);
  if (response.data.code === 200) {
    Object.assign(form, response.data.data);
    dialogMode.value = "view";
    dialogVisible.value = true;
  }
};

const handleDelete = async (row: OdsQkjbsjInfo) => {
  await ElMessageBox.confirm("确定要删除这条数据吗？", "提示", { type: "warning" });
  await deleteOdsQkjbsj(row.id);
      ElMessage.success("删除成功");
      getList();
};

const handleBatchDelete = async () => {
  await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, "提示", { type: "warning" });
  await batchDeleteOdsQkjbsj(selectedIds.value);
      ElMessage.success("批量删除成功");
      getList();
};

const handleExport = async () => {
    const response = await exportOdsQkjbsj(queryParams);
  const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `期刊基本数据_${Date.now()}.xlsx`;
    link.click();
  window.URL.revokeObjectURL(link.href);
    ElMessage.success("导出成功");
};

const handleFormSubmit = async () => {
  await formRef.value?.validate();
  submitLoading.value = true;
  try {
    const api = dialogMode.value === 'add' ? addOdsQkjbsj : updateOdsQkjbsj;
    await api(form);
    ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '修改成功');
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

const handleSelectionChange = (selection: OdsQkjbsjInfo[]) => {
  selectedIds.value = selection.map(item => item.id);
};

const handleRowDblClick = (row: OdsQkjbsjInfo) => handleView(row);
const handleRowClick = () => {};
const handleSizeChange = (size: number) => { queryParams.pageSize = size; getList(); };
const handleCurrentChange = (page: number) => { queryParams.pageNum = page; getList(); };

onMounted(async () => {
  try {
    const response: any = await getSystemSchoolCode();
    systemSchoolCode.value = response.data.data;
    form.xxdm = response.data.data;
  } catch(e) {
    console.error("Failed to get school data", e);
  }
  loadDictData();
  getList();
});
</script>

<style scoped>
.periodical-data-management { padding: 0px; }
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
.periodical-data-dialog { border-radius: 8px; }
.periodical-data-detail { max-height: 60vh; overflow-y: auto; padding: 10px 0; }
.detail-descriptions { margin-bottom: 20px; }
.detail-value { color: #303133; font-weight: 500; word-break: break-all; }
.detail-value:empty::before { content: "-"; color: #909399; }
:deep(.el-table .el-table__body-wrapper .el-table__row) { transition: background-color 0.2s ease; }
:deep(.el-table .el-table__body-wrapper .el-table__row:hover) { background-color: #f5f7fa; }
:deep(.periodical-data-dialog .el-dialog__header) { background: linear-gradient(90deg, #409eff 0%, #67c23a 100%); color: white; border-radius: 8px 8px 0 0; padding: 15px 20px; }
:deep(.periodical-data-dialog .el-dialog__title) { color: white; font-weight: 600; }
:deep(.periodical-data-dialog .el-dialog__headerbtn) { top: 50%; transform: translateY(-50%); }
:deep(.periodical-data-dialog .el-dialog__headerbtn .el-dialog__close) { color: white; font-size: 18px; }
:deep(.periodical-data-dialog .el-dialog__body) { padding: 20px 24px; max-height: calc(700px - 55px - 69px); overflow-y: auto; }
:deep(.el-form-item__label) { font-weight: 500; color: #303133; }
:deep(.el-input__wrapper), :deep(.el-select .el-input__wrapper) { border-radius: 6px; }
:deep(.operation-buttons .el-button) { border-radius: 6px; font-weight: 500; }
:deep(.action-buttons .el-button) { padding: 2px 4px; font-size: 12px; }
:deep(.el-tag) { border-radius: 4px; font-weight: 500; }
:deep(.el-input.is-disabled .el-input__wrapper) { background-color: #f5f7fa !important; box-shadow: 0 0 0 1px #e4e7ed inset !important; }
:deep(.el-input.is-disabled .el-input__inner) { background-color: transparent !important; color: #606266 !important; }
</style>
