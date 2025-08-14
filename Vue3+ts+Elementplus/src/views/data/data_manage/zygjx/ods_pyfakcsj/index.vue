<template>
  <div class="pyfakcsj-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="课程号" prop="kch">
            <el-input v-model="queryParams.kch" placeholder="请输入课程号" clearable />
          </el-form-item>
          <el-form-item label="计划课程号" prop="jhkch">
            <el-input v-model="queryParams.jhkch" placeholder="请输入计划课程号" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="operation-buttons">
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
          <el-button type="danger" :icon="Delete" :disabled="!selectedRows.length"
            @click="handleBatchDelete">批量删除</el-button>
          <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
        </div>
        <div class="header-title">培养方案课程数据数据清洗</div>
        <div class="placeholder">
          <el-tooltip content="刷新" placement="top">
            <el-button circle @click="getList">
              <el-icon>
                <Refresh />
              </el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-body">
        <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" border
          style="width: 100%" highlight-current-row @row-click="handleRowClick"
          @row-dblclick="(row) => handleRowDblClick(row, 'view')" :height="'calc(75vh - 135px)'" stripe size="default"
          :row-style="{ height: '42px' }" :cell-style="{ padding: '2px' }">
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column prop="zjsjwyxbs" label="唯一性标识" min-width="160" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="xxdm" label="学校代码" min-width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="kch" label="课程号" min-width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="jhkch" label="计划课程号" min-width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="kkxnd" label="开课学年度" min-width="100" show-overflow-tooltip sortable="custom" />
          <el-table-column label="开课学期" min-width="100" show-overflow-tooltip sortable="custom">
            <template #default="{ row }">{{
              getKkxqmText(row.kkxqm)
            }}</template>
          </el-table-column>
          <el-table-column label="考试形式" min-width="100" show-overflow-tooltip sortable="custom">
            <template #default="{ row }">{{
              getKsxsmText(row.ksxsm)
            }}</template>
          </el-table-column>
          <el-table-column label="是否专业核心课程" min-width="120" show-overflow-tooltip sortable="custom">
            <template #default="{ row }">
              <el-tag :type="row.sfzyhxkc === '1' ? 'success' : 'info'">{{
                row.sfzyhxkc === "1" ? "是" : "否"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ktjxsjzyskfsm" label="课堂教学设计主要授课方式" min-width="180" show-overflow-tooltip
            sortable="custom">
            <template #default="{ row }">{{
              getKtjxsjzyskfsmText(row.ktjxsjzyskfsm)
            }}</template>
          </el-table-column>
          <el-table-column prop="zjjsgh" label="主讲教师工号" min-width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="sjcjsj" label="数据采集时间" min-width="140" show-overflow-tooltip sortable="custom" />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getReportStatusType(row.reportStatus)" size="small">{{
                getReportStatusText(row.reportStatus) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button link type="primary" size="small" @click="handleRowDblClick(row, 'view')"><el-icon>
                    <View />
                  </el-icon>查看</el-button>
                <el-button link type="primary" size="small" @click="handleRowDblClick(row, 'edit')"><el-icon>
                    <Edit />
                  </el-icon>编辑</el-button>
                <el-button link type="danger" size="small" @click="handleDelete(row)"><el-icon>
                    <Delete />
                  </el-icon>删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区域 -->
      <div class="pagination-wrapper">
        <span class="total-info">共 {{ total }} 条</span>
        <div class="pagination-controls">
          <el-pagination v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
            :page-sizes="[10, 20, 30, 50]" :total="total" layout="sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" small />
        </div>
      </div>
    </el-card>

    <!-- 表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" append-to-body destroy-on-close
      class="pyfakcsj-dialog" :style="{ height: '500px' }">
      <!-- 编辑/新增表单 -->
      <el-form v-if="dialogMode !== 'view'" ref="formRef" :model="form" :rules="rules" label-width="140px"
        class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主键标识" prop="zjsjwyxbs">
              <el-input v-model="form.zjsjwyxbs" placeholder="32位全局唯一编码(可选，留空系统自动生成)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input v-model="form.xxdm" placeholder="10位数字码（系统自动获取）" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划课程号" prop="jhkch">
              <el-select v-model="form.jhkch" placeholder="请选择计划课程号（自动关联课程号和教师工号）" style="width: 100%" filterable remote
                reserve-keyword clearable :remote-method="searchJhkchOptions" :loading="jhkchLoading"
                @change="handleJhkchChange">
                <template #suffix>
                  <el-tooltip content="数据来源：排课数据子类表" placement="top">
                    <el-icon class="warning-icon">
                      <Warning />
                    </el-icon>
                  </el-tooltip>
                </template>
                <el-option v-for="option in jhkchOptions" :key="option.value" :label="option.label"
                  :value="option.value">
                  <span style="float: left">{{ option.jhkch }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ option.kcmc }} - {{ option.jgh }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程号" prop="kch">
              <el-input v-model="form.kch" placeholder="选择计划课程号后自动填充" readonly>
                <template #append>
                  <el-tooltip content="数据来源：排课数据子类表" placement="top">
                    <el-icon class="warning-icon">
                      <Warning />
                    </el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开课学年度" prop="kkxnd">
              <el-input v-model="form.kkxnd" placeholder="格式：YYYY-YYYY，如：2001-2002">
                <template #append>
                  <el-tooltip content="数据来源：排课数据子类表" placement="top">
                    <el-icon class="warning-icon">
                      <Warning />
                    </el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开课学期" prop="kkxqm">
              <el-select v-model="form.kkxqm" placeholder="请选择开课学期" style="width: 100%" clearable filterable>
                <template #suffix>
                  <el-tooltip content="数据来源：排课数据子类表" placement="top">
                    <el-icon class="warning-icon">
                      <Warning />
                    </el-icon>
                  </el-tooltip>
                </template>
                <el-option v-for="option in semesterOptions" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考试形式" prop="ksxsm">
              <el-select v-model="form.ksxsm" placeholder="请选择考试形式" style="width: 100%" clearable filterable>
                <el-option v-for="option in examTypeOptions" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业核心课程" prop="sfzyhxkc">
              <el-select v-model="form.sfzyhxkc" placeholder="请选择是否专业核心课程" style="width: 100%" clearable>
                <el-option v-for="option in isCoreOptions" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授课方式" prop="ktjxsjzyskfsm">
              <el-select v-model="form.ktjxsjzyskfsm" placeholder="请选择授课方式" style="width: 100%" clearable filterable>
                <el-option v-for="option in teachingModeOptions" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主讲教师工号" prop="zjjsgh">
              <el-input v-model="form.zjjsgh" placeholder="选择计划课程号后自动填充" readonly>
                <template #append>
                  <el-tooltip content="数据来源：排课数据子类表" placement="top">
                    <el-icon class="warning-icon">
                      <Warning />
                    </el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="请选择数据采集时间" format="YYYYMMDD HHmmss"
                value-format="YYYYMMDD HHmmss" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select v-model="form.reportStatus" placeholder="请选择上报状态" style="width: 100%">
                <el-option label="未上报" value="0" />
                <el-option label="已上报" value="1" />
                <el-option label="上报失败" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select v-model="form.enableStatus" placeholder="请选择启用状态" style="width: 100%">
                <el-option label="禁用" value="0" />
                <el-option label="启用" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看详情 -->
      <div v-else class="pyfakcsj-detail">
        <el-descriptions :column="2" size="large" border>
          <el-descriptions-item label="唯一性标识">{{
            form.zjsjwyxbs || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{
            form.xxdm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="课程号">{{
            form.kch || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="计划课程号">{{
            form.jhkch || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="开课学年度">{{
            form.kkxnd || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="开课学期">{{
            getKkxqmText(form.kkxqm) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="考试形式">{{
            getKsxsmText(form.ksxsm) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="是否专业核心课程">
            <el-tag :type="form.sfzyhxkc === '1' ? 'success' : 'info'">{{
              form.sfzyhxkc === "1" ? "是" : "否"
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="授课方式">{{
            getKtjxsjzyskfsmText(form.ktjxsjzyskfsm) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="主讲教师工号">{{
            form.zjjsgh || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{
            form.sjcjsj || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusType(form.reportStatus)" size="small">{{
              getReportStatusText(form.reportStatus)
              }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag :type="form.enableStatus === '1' ? 'success' : 'info'">{{
              form.enableStatus === "1" ? "启用" : "禁用"
            }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-if="dialogMode !== 'view'" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  Warning,
  View,
  Edit,
} from "@element-plus/icons-vue";
import type {
  OdsPyfakcsjForm,
  OdsPyfakcsjInfo,
  OdsPyfakcsjQuery,
  DictOption,
  JhkchOption,
} from "@/api-data/data/data_base/zygjx/ods_pyfakcsj";
import {
  getOdsPyfakcsjPage,
  getOdsPyfakcsjById,
  addOdsPyfakcsj,
  updateOdsPyfakcsj,
  deleteOdsPyfakcsj,
  batchDeleteOdsPyfakcsj,
  exportOdsPyfakcsj,
  getSemesterOptions,
  getExamTypeOptions,
  getIsCoreOptions,
  getTeachingModeOptions,
  getSystemSchoolCode,
  getJhkchOptions,
} from "@/api-data/data/data_base/zygjx/ods_pyfakcsj";

// 查询参数
const queryParams = reactive<OdsPyfakcsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  kch: "",
  jhkch: "",
  kkxnd: "",
  kkxqm: "",
  ksxsm: "",
  sfzyhxkc: "",
  ktjxsjzyskfsm: "",
  zjjsgh: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 10,
});

const queryFormRef = ref<FormInstance>();

// 表格数据
const loading = ref(false);
const dataList = ref<OdsPyfakcsjInfo[]>([]);
const total = ref(0);
const selectedRows = ref<OdsPyfakcsjInfo[]>([]);

// 对话框相关
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogMode = ref<"add" | "edit" | "view">("add");
const formRef = ref<FormInstance>();
const form = reactive<OdsPyfakcsjForm>({});

// 表单校验规则
const rules = reactive({
  zjsjwyxbs: [
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value && !/^[A-Z0-9]{32}$/.test(value)) {
          callback(
            new Error("主键数据唯一性标识必须是32位大写字母和数字的组合"),
          );
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须是10位数字", trigger: "blur" },
  ],
  kch: [
    { required: true, message: "课程号不能为空", trigger: "blur" },
    { max: 50, message: "课程号长度不能超过50个字符", trigger: "blur" },
  ],
  jhkch: [
    { required: true, message: "计划课程号不能为空", trigger: "blur" },
    { max: 50, message: "计划课程号长度不能超过50个字符", trigger: "blur" },
  ],
  kkxnd: [
    { required: true, message: "开课学年度不能为空", trigger: "blur" },
    {
      pattern: /^\d{4}-\d{4}$/,
      message: "开课学年度格式必须为YYYY-YYYY，如：2001-2002",
      trigger: "blur",
    },
  ],
  kkxqm: [{ required: true, message: "开课学期码不能为空", trigger: "blur" }],
  sfzyhxkc: [
    { required: true, message: "是否专业核心课程不能为空", trigger: "blur" },
  ],
  zjjsgh: [
    { required: true, message: "主讲教师工号不能为空", trigger: "blur" },
    { max: 20, message: "主讲教师工号长度不能超过20个字符", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "blur" },
    {
      pattern: /^\d{8} \d{6}$/,
      message: "数据采集时间格式必须为YYYYMMDD hhmmss",
      trigger: "blur",
    },
  ],
});

// 数据字典选项
const semesterOptions = ref<DictOption[]>([]);
const examTypeOptions = ref<DictOption[]>([]);
const isCoreOptions = ref<DictOption[]>([]);
const teachingModeOptions = ref<DictOption[]>([]);

// 计划课程号选项（来自排课数据）
const jhkchOptions = ref<JhkchOption[]>([]);
const jhkchLoading = ref(false);

// 获取开课学期文本
const getKkxqmText = (kkxqm: string | undefined) => {
  if (!kkxqm) return kkxqm;
  const option = semesterOptions.value.find(item => item.value === kkxqm);
  return option ? option.label : kkxqm;
};

// 获取考试形式文本
const getKsxsmText = (ksxsm: string | undefined) => {
  if (!ksxsm) return ksxsm;
  const option = examTypeOptions.value.find(item => item.value === ksxsm);
  return option ? option.label : ksxsm;
};

// 获取课堂教学设计主要授课方式文本
const getKtjxsjzyskfsmText = (ktjxsjzyskfsm: string | undefined) => {
  if (!ktjxsjzyskfsm) return ktjxsjzyskfsm;
  const option = teachingModeOptions.value.find(item => item.value === ktjxsjzyskfsm);
  return option ? option.label : ktjxsjzyskfsm;
};

// 获取上报状态类型
const getReportStatusType = (status: string | undefined) => {
  if (!status) return "warning";
  const map: { [key: string]: string } = {
    "0": "info",
    "1": "success",
    "2": "danger",
  };
  return (map[status] || "warning") as
    | "success"
    | "info"
    | "warning"
    | "danger";
};

// 获取上报状态文本
const getReportStatusText = (status: string | undefined) => {
  if (!status) return "未知";
  const map: { [key: string]: string } = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败",
  };
  return map[status] || "未知";
};

// 查询数据
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const res = (await getOdsPyfakcsjPage(queryParams)) as any;
    dataList.value = res.data.data.records;
    total.value = res.data.data.total;
  } catch (error) {
    console.error("获取培养方案课程数据列表失败:", error);
  }
  loading.value = false;
};

// 表格选择变化
const handleSelectionChange = (selection: OdsPyfakcsjInfo[]) => {
  selectedRows.value = selection;
};

// 每页条数变化
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};

// 当前页变化
const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

// 行点击事件
const handleRowClick = (row: OdsPyfakcsjInfo) => {
  // 可以根据需要添加逻辑
};

// 行双击事件/操作按钮点击
const handleRowDblClick = async (
  row: OdsPyfakcsjInfo,
  mode: "view" | "edit",
) => {
  dialogMode.value = mode;
  dialogTitle.value =
    mode === "edit" ? "修改培养方案课程数据" : "查看培养方案课程数据";
  dialogVisible.value = true;

  try {
    const res = (await getOdsPyfakcsjById(row.id as number)) as any;
    Object.assign(form, res.data.data);
  } catch (error) {
    console.error("获取培养方案课程数据详情失败:", error);
  }
};

// 新增按钮点击
const handleAdd = async () => {
  dialogMode.value = "add";
  dialogTitle.value = "新增培养方案课程数据";
  dialogVisible.value = true;

  // 重置表单
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    kch: "",
    jhkch: "",
    kkxnd: "",
    kkxqm: "",
    ksxsm: "",
    sfzyhxkc: "",
    ktjxsjzyskfsm: "",
    zjjsgh: "",
    sjcjsj: "",
    reportStatus: "",
    enableStatus: "",
  });
  formRef.value?.resetFields();

  // 清空计划课程号选项
  jhkchOptions.value = [];

  // 自动获取学校代码
  try {
    const res = (await getSystemSchoolCode()) as any;
    if (res.data.data) {
      form.xxdm = res.data.data;
      console.log("自动获取学校代码成功:", form.xxdm);
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
    ElMessage.warning("获取学校代码失败，请手动输入");
  }
};

// 删除按钮点击
const handleDelete = (row: OdsPyfakcsjInfo) => {
  ElMessageBox.confirm("确认要删除选中的数据吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await deleteOdsPyfakcsj(row.id as number);
      ElMessage.success("删除成功");
      getList();
    } catch (e) {
      console.error(e);
    }
  });
};

// 批量删除按钮点击
const handleBatchDelete = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }
  ElMessageBox.confirm("确认要删除选中的数据吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const ids = selectedRows.value.map((row) => row.id as number);
        await batchDeleteOdsPyfakcsj(ids);
        ElMessage.success("删除成功");
        getList();
      } catch (error) {
        console.error("批量删除失败:", error);
      }
    })
    .catch(() => { });
};

// 导出按钮点击
const handleExport = async () => {
  try {
    ElMessage.info("正在导出数据，请稍候...");
    const response = await exportOdsPyfakcsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // 生成文件名
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[-:]/g, "").replace("T", "_");
    link.download = `培养方案课程数据_${timestamp}.xlsx`;

    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
    console.error("导出失败:", error);
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (form.id) {
          await updateOdsPyfakcsj(form);
          ElMessage.success("修改成功");
        } else {
          await addOdsPyfakcsj(form);
          ElMessage.success("新增成功");
        }
        dialogVisible.value = false;
        getList();
      } catch (error) {
        console.error("保存失败:", error);
      }
    }
  });
};

// 搜索计划课程号选项
const searchJhkchOptions = async (keyword: string) => {
  if (jhkchLoading.value) return;

  jhkchLoading.value = true;
  try {
    const res = (await getJhkchOptions(keyword)) as any;
    jhkchOptions.value = res.data.data || [];
    console.log("搜索计划课程号选项成功", jhkchOptions.value.length);
  } catch (error) {
    console.error("搜索计划课程号选项失败:", error);
    ElMessage.warning("搜索计划课程号选项失败");
  } finally {
    jhkchLoading.value = false;
  }
};

// 计划课程号选择后更新课程号、教师工号、开课学年度和开课学期码
const handleJhkchChange = (value: string) => {
  const selectedOption = jhkchOptions.value.find(option => option.value === value);
  if (selectedOption) {
    form.jhkch = selectedOption.jhkch;
    form.kch = selectedOption.kch;
    form.zjjsgh = selectedOption.jgh;
    form.kkxnd = selectedOption.kkxnd;
    form.kkxqm = selectedOption.kkxqm;
    console.log("选择计划课程号后自动填充:", {
      jhkch: form.jhkch,
      kch: form.kch,
      zjjsgh: form.zjjsgh,
      kkxnd: form.kkxnd,
      kkxqm: form.kkxqm
    });
  }
};

// 加载数据字典选项
const loadDictOptions = async () => {
  try {
    const [semesterRes, examTypeRes, isCoreRes, teachingModeRes] = await Promise.all([
      getSemesterOptions(),
      getExamTypeOptions(),
      getIsCoreOptions(),
      getTeachingModeOptions(),
    ]);

    semesterOptions.value = (semesterRes as any).data.data || [];
    examTypeOptions.value = (examTypeRes as any).data.data || [];
    isCoreOptions.value = (isCoreRes as any).data.data || [];
    teachingModeOptions.value = (teachingModeRes as any).data.data || [];

    console.log("数据字典选项加载成功", {
      semester: semesterOptions.value.length,
      examType: examTypeOptions.value.length,
      isCore: isCoreOptions.value.length,
      teachingMode: teachingModeOptions.value.length,
    });
  } catch (error) {
    console.error("加载数据字典选项失败:", error);
    ElMessage.warning("加载数据字典选项失败，将使用默认选项");

    // 设置默认选项，确保用户界面可用
    semesterOptions.value = [
      { value: "1", label: "第一学期" },
      { value: "2", label: "第二学期" },
      { value: "3", label: "第三学期" },
    ];
    examTypeOptions.value = [
      { value: "1", label: "笔试" },
      { value: "2", label: "口试" },
      { value: "3", label: "论文" },
      { value: "4", label: "考查" },
      { value: "5", label: "其他" },
    ];
    isCoreOptions.value = [
      { value: "1", label: "是" },
      { value: "0", label: "否" },
    ];
    teachingModeOptions.value = [
      { value: "1", label: "讲授" },
      { value: "2", label: "研讨" },
      { value: "3", label: "实验" },
      { value: "4", label: "实践" },
      { value: "5", label: "其他" },
    ];
  }
};

// 页面加载时获取数据
onMounted(() => {
  // 先加载数据字典选项，再获取列表数据
  loadDictOptions().then(() => {
    getList();
  });
});
</script>

<style lang="scss" scoped>
.pyfakcsj-management {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;

  .search-card {
    .search-bar .el-form {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;

      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .table-card {
    border-radius: 8px;
    border: none;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);

    :deep(.el-card__body) {
      padding: 0;
      overflow: visible;
      /* 确保内容不会被裁剪 */
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

    .table-body .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
  }
}

.pyfakcsj-dialog {
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

.dialog-form {
  .el-form-item {
    margin-bottom: 22px !important;
  }
}

.pyfakcsj-detail {
  .el-descriptions {
    :deep(.el-descriptions__label) {
      font-weight: 600;
      color: #303133;
      width: 160px;
      background-color: #fafafa;
    }

    :deep(.el-descriptions__content) {
      color: #606266;
      font-size: 14px;
      padding: 12px 16px;
    }
  }
}

.dialog-footer {
  text-align: right;
}

.warning-icon {
  color: #e6a23c;
  cursor: help;
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  border-top: 1px solid #e4e7ed;
  background-color: #fafafa;
  min-height: 40px;
  /* 确保有足够的空间显示 */

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
</style>
