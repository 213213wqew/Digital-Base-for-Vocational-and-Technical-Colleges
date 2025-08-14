<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="社团编号" prop="stbh">
          <el-input
            v-model="queryParams.stbh"
            placeholder="请输入社团编号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="社团名称" prop="stmc">
          <el-input
            v-model="queryParams.stmc"
            placeholder="请输入社团名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="学号" prop="xh">
          <el-input
            v-model="queryParams.xh"
            placeholder="请输入学号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
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
          <el-button type="warning" @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>
        <div class="header-title">学生参与社团数据管理</div>
        <div class="placeholder">
          <el-tooltip content="刷新" placement="top">
            <el-button circle @click="getList">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        @selection-change="handleSelectionChange"
        border
        style="width: 100%"
        highlight-current-row
        @row-click="handleRowClick"
        @row-dblclick="handleRowDblClick"
        height="calc(75vh - 100px)"
        stripe
        size="default"
        :row-style="{ height: '42px' }"
        :cell-style="{ padding: '2px' }"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column type="index" label="序号" width="60" fixed="left" />
        <el-table-column
          prop="zjsjwyxbs"
          show-overflow-tooltip
          label="唯一性标识"
          min-width="150"
        />
        <el-table-column
          prop="xxdm"
          show-overflow-tooltip
          label="学校代码"
          min-width="100"
        />
        <el-table-column
          prop="stbh"
          show-overflow-tooltip
          label="社团编号"
          min-width="120"
        />
        <el-table-column
          prop="stmc"
          show-overflow-tooltip
          label="社团名称"
          min-width="150"
        />
        <el-table-column
          prop="xh"
          show-overflow-tooltip
          label="学号"
          min-width="120"
        />
        <el-table-column
          prop="xsxm"
          show-overflow-tooltip
          label="学生姓名"
          min-width="120"
        />
        <el-table-column
          prop="cjrq"
          show-overflow-tooltip
          label="参加日期"
          min-width="100"
        />
        <el-table-column
          prop="tcrq"
          show-overflow-tooltip
          label="退出日期"
          min-width="100"
        />
        <el-table-column
          prop="stzw"
          show-overflow-tooltip
          label="社团职务"
          min-width="120"
        />
        <el-table-column
          prop="sjcjsj"
          show-overflow-tooltip
          label="数据采集时间"
          min-width="140"
        />
        <el-table-column label="上报状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getReportStatusType(row.reportStatus)" size="small">
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
          show-overflow-tooltip
          label="更新时间"
          min-width="160"
        />
        <el-table-column label="操作" width="180" fixed="right" align="center">
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

      <!-- 分页组件 -->
      <div class="pagination-wrapper">
        <span class="total-info">共 {{ total }} 条</span>
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
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="
        dialogType === 'add' ? '新增学生参与社团数据' : '编辑学生参与社团数据'
      "
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleFormClose"
      class="custom-dialog"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
        class="custom-form"
      >
        <div class="form-container">
          <div class="section-title">基本信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="唯一性标识" prop="zjsjwyxbs">
                <el-input
                  v-model="form.zjsjwyxbs"
                  placeholder="留空可自动生成32位唯一编码"
                  maxlength="32"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学校代码" prop="xxdm">
                <el-input
                  readonly
                  disabled
                  v-model="form.xxdm"
                  placeholder="系统自动获取"
                  maxlength="10"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="section-title">社团与学生信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="社团编号" prop="stbh">
                <div style="display: flex; align-items: center; gap: 8px"> 
                <el-select
                  v-model="form.stbh"
                  placeholder="请选择社团编号"
                  filterable
                  remote
                  :remote-method="getStxhjbsjOptionsData"
                  @change="handleStxhjbsjChange"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in stxhjbsjOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip content="数据源：ODS_STXHJBSJ 社团（协会）基本数据子类表" placement="top"> 
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="社团名称" prop="stmc">
                <div style="display: flex; align-items: center; gap: 8px"> 
                <el-input
                  v-model="form.stmc"
                  placeholder="根据社团编号自动填充"
                  maxlength="60"
                  show-word-limit
                  disabled
                />
                <el-tooltip content="数据源：ODS_STXHJBSJ 社团（协会）基本数据子类表" placement="top"> 
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学号" prop="xh">
                <div style="display: flex; align-items: center; gap: 8px">
                <el-select v-model="form.xh" filterable remote :remote-method="getStudentOptionsData" @change="getStudentName" placeholder="请选择学号">
                  <el-option v-for="item in studentOptions" :key="item.xh" :label="item.label" :value="item.xh" />
                </el-select>
                <el-tooltip content="数据源：学生信息表" placement="top"> 
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
                </div>
                 
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学生姓名" prop="xsxm">
                <div style="display: flex; align-items: center; gap: 8px"> 
                <el-input
                  disabled
                  v-model="form.xsxm"
                  placeholder="请输入学生姓名"
                  maxlength="36"
                  show-word-limit
                />
                <el-tooltip content="数据源：学生信息表" placement="top"> 
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="section-title">参与信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参加日期" prop="cjrq">
                <el-date-picker
                  v-model="form.cjrq"
                  type="date"
                  placeholder="请选择参加日期"
                  value-format="YYYYMMDD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="退出日期" prop="tcrq">
                <el-date-picker
                  v-model="form.tcrq"
                  type="date"
                  placeholder="请选择退出日期"
                  value-format="YYYYMMDD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="社团职务" prop="stzw">
                <el-input
                  v-model="form.stzw"
                  placeholder="请输入社团职务"
                  maxlength="60"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="section-title">采集信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="数据采集时间" prop="sjcjsj">
                <el-date-picker
                  v-model="form.sjcjsj"
                  type="datetime"
                  placeholder="请选择数据采集时间"
                  value-format="YYYYMMDD HHmmss"
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="学生参与社团数据详情"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleDetailClose"
    >
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="唯一性标识">{{
            currentRecord.zjsjwyxbs
          }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{
            currentRecord.xxdm
          }}</el-descriptions-item>
          <el-descriptions-item label="社团编号">{{
            currentRecord.stbh
          }}</el-descriptions-item>
          <el-descriptions-item label="社团名称">{{
            currentRecord.stmc
          }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{
            currentRecord.xh
          }}</el-descriptions-item>
          <el-descriptions-item label="学生姓名">{{
            currentRecord.xsxm
          }}</el-descriptions-item>
          <el-descriptions-item label="参加日期">{{
            currentRecord.cjrq
          }}</el-descriptions-item>
          <el-descriptions-item label="退出日期">{{
            currentRecord.tcrq
          }}</el-descriptions-item>
          <el-descriptions-item label="社团职务">{{
            currentRecord.stzw
          }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{
            currentRecord.sjcjsj
          }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusType(currentRecord.reportStatus)"
              size="small"
            >
              {{ getReportStatusText(currentRecord.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="getEnableStatusType(currentRecord.enableStatus)"
              size="small"
            >
              {{ getEnableStatusText(currentRecord.enableStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            currentRecord.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            currentRecord.updateTime
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleDetailClose">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormInstance } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsXscystsjPage,
  getOdsXscystsjById,
  addOdsXscystsj,
  updateOdsXscystsj,
  deleteOdsXscystsj,
  getSystemSchoolCode,
  batchDeleteOdsXscystsj,
  exportOdsXscystsj,
  updateSingleEnableStatus,
  getStudentOptions,
  getStxhjbsjOptions, type OdsStxhjbsjOption ,
  type OdsXscystsjInfo,
  type OdsXscystsjQuery,
  type OdsXscystsjForm,
} from "@/api/meta/meta_base/zygxs/ods_xscystsj";
 

// 搜索条件
const queryParams = reactive<OdsXscystsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  stbh: "",
  stmc: "",
  xh: "",
  xsxm: "",
  cjrqStart: "",
  cjrqEnd: "",
  tcrqStart: "",
  tcrqEnd: "",
  stzw: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});
  const studentOptions = ref<Array<{ xh: string; xsxm: string; label: string }>>([]);
const stxhjbsjOptions = ref<OdsStxhjbsjOption[]>([]);
// 表格数据
const dataList = ref<OdsXscystsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);
const systemSchoolCode = ref("");
// 表单相关
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const form = reactive<OdsXscystsjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  stbh: "",
  stmc: "",
  xh: "",
  xsxm: "",
  cjrq: "",
  tcrq: "",
  stzw: "",
  sjcjsj: "",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 详情对话框
const viewDialogVisible = ref(false);
const currentRecord = ref<OdsXscystsjInfo | null>(null);

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    {
      pattern: /^[A-Z0-9]{32}$/,
      message: "必须是32位大写字母和数字组合",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须是10位数字", trigger: "blur" },
  ],
  stbh: [
    { required: true, message: "请输入社团编号", trigger: "blur" },
    { max: 20, message: "长度不能超过20位", trigger: "blur" },
  ],
  stmc: [
    { required: true, message: "请输入社团名称", trigger: "blur" },
    { max: 60, message: "长度不能超过60位", trigger: "blur" },
  ],
  xh: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { max: 20, message: "长度不能超过20位", trigger: "blur" },
  ],
  xsxm: [
    { required: true, message: "请输入学生姓名", trigger: "blur" },
    { max: 36, message: "长度不能超过36位", trigger: "blur" },
  ],
  cjrq: [{ required: true, message: "请选择参加日期", trigger: "change" }],
  stzw: [{ max: 60, message: "社团职务长度不能超过60位", trigger: "blur" }],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 状态文本和类型映射
const getReportStatusText = (status: string): string => {
  switch (status) {
    case "0":
      return "未上报";
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return "未上报";
  }
};

const getReportStatusType = (status: string) => {
  switch (status) {
    case "0":
      return "info";
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "info";
  }
};

const getEnableStatusText = (status: string): string => {
  switch (status) {
    case "0":
      return "禁用";
    case "1":
      return "启用";
    default:
      return "启用";
  }
};

const getEnableStatusType = (status: string) => {
  switch (status) {
    case "0":
      return "danger";
    case "1":
      return "success";
    default:
      return "success";
  }
};
 
// 获取学生选项数据
const getStudentOptionsData = async (keyword?: string) => {
  const response: any = await getStudentOptions(keyword);
  if (response.data.code === 200) {
    studentOptions.value = response.data.data;
  }
};

const getStudentName = (value: string) => {
  const student = studentOptions.value.find((item) => item.xh === value);
  if (student) {
    form.xsxm = student.xsxm;
  }
};

// 获取社团选项数据
const getStxhjbsjOptionsData = async (keyword?: string) => {
  try {
    const res = await getStxhjbsjOptions(keyword) as any;
    if (res.data.code === 200) {
      stxhjbsjOptions.value = res.data.data;
    }
  } catch (error) {
    console.error("获取社团选项失败", error);
  }
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsXscystsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询学生参与社团数据失败:", error);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};
// 获取当前系统学校代码
const getSystemSchoolCodeData = async () => {
  const response: any = await getSystemSchoolCode();
  if (response.data.code === 200) {
    queryParams.xxdm = response.data.data;
    systemSchoolCode.value = response.data.data;
  }
};
// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置搜索
const resetQuery = () => {
  Object.assign(queryParams, {
    zjsjwyxbs: "",
    xxdm: "",
    stbh: "",
    stmc: "",
    xh: "",
    xsxm: "",
    cjrqStart: "",
    cjrqEnd: "",
    tcrqStart: "",
    tcrqEnd: "",
    stzw: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  form.xxdm = systemSchoolCode.value;
  dialogType.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsXscystsjInfo) => {
  try {
    const response: any = await getOdsXscystsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogType.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生参与社团数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsXscystsjInfo) => {
  try {
    const response: any = await getOdsXscystsjById(row.id);
    if (response.data.code === 200) {
      currentRecord.value = response.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生参与社团数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsXscystsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条学生参与社团数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsXscystsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除学生参与社团数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 条数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsXscystsj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除学生参与社团数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsXscystsj(queryParams);
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `学生参与社团数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出学生参与社团数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 启用状态改变
const handleEnableStatusChange = async (row: OdsXscystsjInfo) => {
  try {
    const response: any = await updateSingleEnableStatus(row.id, row.enableStatus);
    if (response.data.code === 200) {
      ElMessage.success("状态修改成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "状态修改失败");
      // 恢复原来的状态
      row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    }
  } catch (error) {
    console.error("修改启用状态失败:", error);
    ElMessage.error("状态修改失败");
    // 恢复原来的状态
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
  }
};

// 表格选择改变
const handleSelectionChange = (selection: OdsXscystsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (row: OdsXscystsjInfo) => {
  // 行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsXscystsjInfo) => {
  handleView(row);
};

// 分页相关
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    if (dialogType.value === "add") {
      const response: any = await addOdsXscystsj(form);
      if (response.data.code === 200) {
        ElMessage.success("新增成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(response.data.msg || "新增失败");
      }
    } else {
      const response: any = await updateOdsXscystsj(form);
      if (response.data.code === 200) {
        ElMessage.success("修改成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(response.data.msg || "修改失败");
      }
    }
  } catch (error) {
    console.error("表单提交失败:", error);
    ElMessage.error("操作失败");
  } finally {
    submitLoading.value = false;
  }
};

// 表单关闭
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 详情关闭
const handleDetailClose = () => {
  viewDialogVisible.value = false;
  currentRecord.value = null;
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    stbh: "",
    stmc: "",
    xh: "",
    xsxm: "",
    cjrq: "",
    tcrq: "",
    stzw: "",
    sjcjsj: "",
  });
  formRef.value?.clearValidate();
};

// 处理社团选择
const handleStxhjbsjChange = (value: string) => {
  const selectedOption = stxhjbsjOptions.value.find(option => option.value === value);
  if (selectedOption) {
    form.stbh = selectedOption.stbh;
    form.stmc = selectedOption.stmc;
  }
};

// 页面加载
onMounted(() => {
  getSystemSchoolCodeData();
  getList();
  getStxhjbsjOptionsData();
});
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0px;
  
  }

  .search-card {
    margin-bottom: 10px;

    :deep(.el-card__body) {
      padding: 8px 15px;
    }

    :deep(.el-form) {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 10px;
    }

    :deep(.el-form-item__label) {
      width: 70px;
      text-align: right;
      padding-right: 4px;
      font-size: 14px;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 160px;
      font-size: 14px;
    }

    :deep(.el-button) {
      font-size: 14px;
    }
  }

  .table-card {
    margin-bottom: 10px;

    :deep(.el-card__body) {
      padding: 10px 15px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .operation-buttons {
        display: flex;
        align-items: center;

        .el-button {
          margin-right: 10px;
        }
      }

      .header-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }

  .table-body {
    margin-bottom: 8px;

    :deep(.el-table) {
      font-size: 14px;
    }

    :deep(.el-table__header th) {
      padding: 4px 0;
      height: 40px;
      background-color: #f5f7fa;
      font-size: 14px;
    }

    :deep(.el-table__row td) {
      padding: 4px 0;
      font-size: 14px;
    }

    .action-buttons {
      display: flex;
      justify-content: center;

      .el-button {
        margin: 0 3px;
        padding: 0 5px;
        font-size: 14px;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    margin-top: 10px;

    .total-info {
      font-size: 14px;
      color: #606266;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
    }

    :deep(.el-pagination) {
      justify-content: flex-end;
      font-size: 14px;

      .el-pagination__total {
        display: none;
      }

      .el-pagination__sizes {
        margin-right: 15px;
      }

      .btn-prev,
      .btn-next,
      .el-pager li {
        min-width: 24px;
        height: 24px;
        line-height: 24px;
      }
    }
  }


.custom-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }

  .custom-form {
    .form-container {
      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 15px 0;
        padding-left: 10px;
        border-left: 3px solid var(--el-color-primary);

        &:first-child {
          margin-top: 0;
        }
      }

      .el-row {
        margin-bottom: 0;
      }

      .el-form-item {
        margin-bottom: 18px;
      }

      :deep(.el-form-item__label) {
        font-weight: 500;
      }

      :deep(.el-input__wrapper),
      :deep(.el-select),
      :deep(.el-date-picker) {
        width: 100%;
      }
    }
  }
}

.dialog-footer {
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 15px;
  text-align: right;

  .el-button {
    padding: 8px 20px;
    min-width: 100px;
  }
}
</style>
