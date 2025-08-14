<template>
  <div class="professional-development-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
     
          <el-form-item label="教工号" prop="jgh">
            <el-input
              v-model="queryParams.jgh"
              placeholder="请输入教工号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="教师姓名" prop="jzgxm">
            <el-input
              v-model="queryParams.jzgxm"
              placeholder="请输入教师姓名"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="考核类别" prop="jzgkhlbm">
            <el-select
              style="width: 100px"
              v-model="queryParams.jzgkhlbm"
              placeholder="请选择教职工考核类别"
              clearable
            >
              <el-option
                v-for="item in assessmentTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="考核单位" prop="khdwmc">
            <el-input
              v-model="queryParams.khdwmc"
                style="width: 100px"
              placeholder="请输入考核单位名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item> -->
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
        </div>
        <div class="header-title">教师考核数据管理</div>
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
          :height="'calc(75vh - 90px)'"
          stripe
          size="default"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="zjsjwyxbs"
            label="唯一性标识"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jgh"
            label="教工号"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jzgxm"
            label="教师姓名"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jzgkhlbmText"
            label="考核类别"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jzgkhrq"
            label="考核日期"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jzgkhdwh"
            label="考核单位号"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="khdwmc"
            label="考核单位"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dwkhjgmText"
            label="单位考核结果"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dwkhfzrh"
            label="负责人号"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="fzrxm"
            label="负责人姓名"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xxkhjgmText"
            label="学校考核结果"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusType(row.reportStatus)"
                size="small"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-switch
                v-model="row.enableStatus"
                active-value="1"
                inactive-value="0"
                @change="handleEnableStatusChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            min-width="160"
            show-overflow-tooltip
          />
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
                  @click="handleEdit(row)"
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
            :page-sizes="[20, 50, 100, 200, 500]"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="getList"
            @current-change="getList"
            small
          />
        </div>
      </div>
    </el-card>

    <!-- 新的统一对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900px"
      :close-on-click-modal="false"
      append-to-body
      class="professional-dialog"
      destroy-on-close
    >
      <!-- 查看模式 -->
      <div v-if="dialogMode === 'view'">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="唯一性标识">{{ form.zjsjwyxbs }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{ form.xxdm }}</el-descriptions-item>
          <el-descriptions-item label="教工号">{{ form.jgh }}</el-descriptions-item>
          <el-descriptions-item label="教师姓名">{{ form.jzgxm }}</el-descriptions-item>
          <el-descriptions-item label="考核类别">{{ getAssessmentTypeText(form.jzgkhlbm) }}</el-descriptions-item>
          <el-descriptions-item label="考核日期">{{ form.jzgkhrq }}</el-descriptions-item>
          <el-descriptions-item label="考核单位号">{{ form.jzgkhdwh }}</el-descriptions-item>
          <el-descriptions-item label="考核单位名称">{{ form.khdwmc }}</el-descriptions-item>
          <el-descriptions-item label="单位考核结果">{{ getAssessmentResultText(form.dwkhjgm) }}</el-descriptions-item>
          <el-descriptions-item label="单位负责人号">{{ form.dwkhfzrh }}</el-descriptions-item>
          <el-descriptions-item label="负责人姓名">{{ form.fzrxm }}</el-descriptions-item>
          <el-descriptions-item label="学校考核结果">{{ getAssessmentResultText(form.xxkhjgm) }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{ form.sjcjsj }}</el-descriptions-item>
        </el-descriptions>
      </div>
       <!-- 新增/编辑模式 -->
      <el-form
        v-else
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input v-model="form.zjsjwyxbs" placeholder="留空则自动生成" maxlength="32" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input v-model="form.xxdm" placeholder="系统自动获取" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教工号" prop="jgh">
              <el-select
                v-model="form.jgh"
                filterable
                remote
                reserve-keyword
                placeholder="请输入教师姓名或工号"
                :remote-method="searchTeacher"
                :loading="teacherLoading"
                @change="handleTeacherSelect"
                style="width: 100%"
              >
                <el-option
                  v-for="item in teacherOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教师姓名" prop="jzgxm">
              <el-input v-model="form.jzgxm" placeholder="选择教工号后自动填充" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核类别" prop="jzgkhlbm">
              <el-select v-model="form.jzgkhlbm" placeholder="请选择考核类别" style="width: 100%">
                <el-option
                  v-for="item in assessmentTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核日期" prop="jzgkhrq">
              <el-date-picker
                v-model="form.jzgkhrq"
                type="date"
                placeholder="选择考核日期"
                style="width: 100%"
                value-format="YYYYMMDD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="考核内容" prop="jzgkhnr">
              <el-input
                v-model="form.jzgkhnr"
                type="textarea"
                :rows="3"
                placeholder="请输入教职工考核内容"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核单位号" prop="jzgkhdwh">
              <el-input v-model="form.jzgkhdwh" placeholder="请输入考核单位号" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核单位名称" prop="khdwmc">
              <el-input v-model="form.khdwmc" placeholder="请输入考核单位名称" maxlength="60" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单位考核结果" prop="dwkhjgm">
              <el-select v-model="form.dwkhjgm" placeholder="请选择单位考核结果" style="width: 100%">
                <el-option
                  v-for="item in assessmentResultOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位负责人号" prop="dwkhfzrh">
              <el-select
                v-model="form.dwkhfzrh"
                filterable
                remote
                reserve-keyword
                placeholder="请输入负责人姓名或工号"
                :remote-method="searchDirector"
                :loading="directorLoading"
                @change="handleDirectorSelect"
                style="width: 100%"
              >
                <el-option
                  v-for="item in directorOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人姓名" prop="fzrxm">
              <el-input v-model="form.fzrxm" placeholder="选择负责人后自动填充" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校考核结果" prop="xxkhjgm">
              <el-select v-model="form.xxkhjgm" placeholder="请选择学校考核结果" style="width: 100%">
                <el-option
                  v-for="item in assessmentResultOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="24">
            <el-form-item label="数据采集时间" prop="sjcjsj">
               <el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="请选择数据采集时间" value-format="YYYYMMDD HHmmss" format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogMode !== 'view'" type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, toRefs } from "vue";
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
} from "@element-plus/icons-vue";
import {
  getOdsJskhsjPage,
  getOdsJskhsjById,
  addOdsJskhsj,
  updateOdsJskhsj,
  deleteOdsJskhsj,
  batchDeleteOdsJskhsj,
  exportOdsJskhsj,
  getAssessmentTypeOptions,
  getAssessmentResultOptions,
  OdsJskhsjInfo,
  OdsJskhsjQuery,
  OdsJskhsjForm,
  DictOption,
} from "@/api-code/code/code_base/zygjg/ods_jskhsj";

import {
  getSystemSchoolCode,
  getTeacherOptions,
  TeacherOption,
} from "@/api-code/code/code_base/zygjg/ods_xxjxsj";

defineOptions({
  name: "OdsJskhsj",
});

const loading = ref(false);
const dataList = ref<OdsJskhsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const dialogTitle = computed(() => {
  if (dialogMode.value === "add") return "新增教师考核数据";
  if (dialogMode.value === "edit") return "编辑教师考核数据";
  return "查看教师考核数据";
});

const teacherLoading = ref(false);
const teacherOptions = ref<TeacherOption[]>([]);

const directorLoading = ref(false);
const directorOptions = ref<TeacherOption[]>([]);

const state = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 20,
  } as OdsJskhsjQuery,
  form: {} as OdsJskhsjForm,
});

const { queryParams, form } = toRefs(state);

const rules = reactive<FormRules>({
  jgh: [{ required: true, message: "教工号不能为空", trigger: "change" }],
  jzgxm: [{ required: true, message: "教师姓名不能为空", trigger: "blur" }],
  jzgkhlbm: [{ required: true, message: "考核类别不能为空", trigger: "change" }],
  jzgkhrq: [{ required: true, message: "考核日期不能为空", trigger: "change" }],
  sjcjsj: [{ required: true, message: "数据采集时间不能为空", trigger: "change" }],
});

const assessmentTypeOptions = ref<DictOption[]>([]);
const assessmentResultOptions = ref<DictOption[]>([]);

const getAssessmentTypeText = (code: string | undefined) => {
  if (!code) return "";
  return assessmentTypeOptions.value.find(o => o.value === code)?.label || code;
}

const getAssessmentResultText = (code: string | undefined) => {
  if (!code) return "";
  return assessmentResultOptions.value.find(o => o.value === code)?.label || code;
}

const getReportStatusText = (status: string) => {
  if (status === "1") return "已上报";
  if (status === "2") return "上报失败";
  return "未上报";
};

const getReportStatusType = (status: string) => {
  if (status === "1") return "success";
  if (status === "2") return "danger";
  return "info";
};

async function getList() {
  loading.value = true;
  try {
    const response = await getOdsJskhsjPage(queryParams.value) as any;
    dataList.value = response.data.data.records;
    total.value = response.data.data.total;
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.value = {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    jgh: "",
    jzgxm: "",
    jzgkhlbm: "",
    jzgkhrq: "",
    jzgkhnr: "",
    jzgkhdwh: "",
    khdwmc: "",
    dwkhjgm: "",
    dwkhfzrh: "",
    fzrxm: "",
    xxkhjgm: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  };
  formRef.value?.resetFields();
}

async function handleAdd() {
  resetForm();
  dialogMode.value = "add";
  try {
    const res = await getSystemSchoolCode() as any;
    if (res.data.code === 200) {
      form.value.xxdm = res.data.data;
    }
  } catch (e) {
    console.error("获取学校代码失败", e);
  }
  dialogVisible.value = true;
}

async function handleEdit(row: OdsJskhsjInfo) {
  resetForm();
  dialogMode.value = "edit";
  try {
    const response = await getOdsJskhsjById(row.id) as any;
    form.value = response.data.data;
    dialogVisible.value = true;
  } catch (e) {
    ElMessage.error("获取数据失败");
  }
}

async function handleView(row: OdsJskhsjInfo) {
  resetForm();
  dialogMode.value = "view";
  try {
    const response = await getOdsJskhsjById(row.id) as any;
    form.value = response.data.data;
    dialogVisible.value = true;
  } catch (e) {
    ElMessage.error("获取数据失败");
  }
}

async function handleSubmit() {
  if (!formRef.value) return;
  await formRef.value.validate();
  
  const action = dialogMode.value === 'add' ? addOdsJskhsj : updateOdsJskhsj;
  const message = dialogMode.value === 'add' ? '新增成功' : '修改成功';

  try {
    await action(form.value);
    ElMessage.success(message);
    dialogVisible.value = false;
    getList();
  } catch(e) {
    console.error('操作失败', e);
  }
}

async function searchTeacher(query: string) {
  if (query) {
    teacherLoading.value = true;
    try {
      const response = await getTeacherOptions(query) as any;
      if (response.data.code === 200) {
        teacherOptions.value = response.data.data;
      }
    } finally {
      teacherLoading.value = false;
    }
  } else {
    teacherOptions.value = [];
  }
}

function handleTeacherSelect(jgh: string) {
  const selectedTeacher = teacherOptions.value.find((t: TeacherOption) => t.value === jgh);
  if (selectedTeacher) {
    form.value.jgh = selectedTeacher.value;
    const parts = selectedTeacher.label.split(' - ');
    form.value.jzgxm = parts.length > 1 ? parts[1].trim() : selectedTeacher.label;
  }
}

async function searchDirector(query: string) {
  if (query) {
    directorLoading.value = true;
    try {
      const response = await getTeacherOptions(query) as any;
      if (response.data.code === 200) {
        directorOptions.value = response.data.data;
      }
    } finally {
      directorLoading.value = false;
    }
  } else {
    directorOptions.value = [];
  }
}

function handleDirectorSelect(jgh: string) {
  const selectedDirector = directorOptions.value.find((t: TeacherOption) => t.value === jgh);
  if (selectedDirector) {
    form.value.dwkhfzrh = selectedDirector.value;
    const parts = selectedDirector.label.split(' - ');
    form.value.fzrxm = parts.length > 1 ? parts[1].trim() : selectedDirector.label;
  }
}

function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function resetQuery() {
  queryFormRef.value?.resetFields();
  handleQuery();
}

function handleSelectionChange(selection: OdsJskhsjInfo[]) {
  selectedIds.value = selection.map((item) => item.id);
}

function handleDelete(row: OdsJskhsjInfo) {
  ElMessageBox.confirm(`是否确认删除教师【${row.jzgxm}】的考核数据？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    await deleteOdsJskhsj(row.id);
    ElMessage.success("删除成功");
    getList();
  });
}

function handleBatchDelete() {
  ElMessageBox.confirm("是否确认删除选中的数据项？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    await batchDeleteOdsJskhsj(selectedIds.value);
    ElMessage.success("删除成功");
    getList();
  });
}

async function handleExport() {
  try {
    const response = await exportOdsJskhsj(queryParams.value);
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `教师考核数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    ElMessage.error('导出失败');
  }
}

async function handleEnableStatusChange(row: OdsJskhsjInfo) {
  try {
    const dataToUpdate = JSON.parse(JSON.stringify(row));
    await updateOdsJskhsj(dataToUpdate);
    ElMessage.success("状态更新成功");
  } catch (error) {
    ElMessage.error("状态更新失败");
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
  }
}

onMounted(() => {
  getList();
  loadDictOptions();
});

async function loadDictOptions() {
  try {
    const [typeRes, resultRes] = await Promise.all([
      getAssessmentTypeOptions() as any,
      getAssessmentResultOptions() as any,
    ]);
    if (typeRes.data.code === 200) {
      assessmentTypeOptions.value = typeRes.data.data;
    }
    if (resultRes.data.code === 200) {
      assessmentResultOptions.value = resultRes.data.data;
    }
  } catch (error) {
    console.error("加载字典失败", error);
    ElMessage.error("加载考核选项失败");
  }
}
</script>

<style lang="scss" scoped>
.professional-development-management {
 

  .search-card {
    margin-bottom: 10px;
    :deep(.el-card__body) {
      padding: 16px 20px 0;
    }
  }

  .search-bar {
    .el-form-item {
      margin-bottom: 16px;
    }
  }

  .table-card {
    margin-top: -10px;
    margin-bottom: 16px;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .operation-buttons,
  .placeholder {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .header-title {
    font-size: 16px;
    font-weight: 500;
  }

  .table-body {
    //
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
  }

  .total-info {
    color: #606266;
    font-size: 14px;
  }
}

.professional-dialog {
  .el-dialog__body {
    padding: 20px;
  }
  .el-form-item {
    margin-bottom: 18px;
  }
}
</style>
