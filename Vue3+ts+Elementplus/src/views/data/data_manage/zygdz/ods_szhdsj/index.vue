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

// 日期格式化函数
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
};

const formatDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return '';
  if (dateTimeStr.length === 14) {
    return `${dateTimeStr.substring(0, 4)}-${dateTimeStr.substring(4, 6)}-${dateTimeStr.substring(6, 8)} ${dateTimeStr.substring(8, 10)}:${dateTimeStr.substring(10, 12)}:${dateTimeStr.substring(12, 14)}`;
  }
  return dateTimeStr;
};

// API导入
import {
  getOdsSzhdsjPage,
  getOdsSzhdsjById,
  addOdsSzhdsj,
  updateOdsSzhdsj,
  deleteOdsSzhdsj,
  batchDeleteOdsSzhdsj,
  exportOdsSzhdsj,
  getActivityTypeOptions,
  getOrganizerLevelOptions,
  getSystemSchoolCode,
  type OdsSzhdsjInfo,
  type OdsSzhdsjQuery,
  type OdsSzhdsjForm,
  type DictOption,
} from "@/api-data/data/data_base/zygdz/ods_szhdsj";

// 搜索条件
const queryParams = reactive<OdsSzhdsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  hdbh: "",
  hdmc: "",
  sszt: "",
  hdbk: "",
  hdzt: "",
  hdlxm: "",
  zbdw: "",
  zbdwjbm: "",
  xxfzr: "",
  hdksrqStart: "",
  hdksrqEnd: "",
  hdjsrqStart: "",
  hdjsrqEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 表格数据
const dataList = ref<OdsSzhdsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const form = reactive<OdsSzhdsjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  hdbh: "",
  hdmc: "",
  sszt: "",
  hdbk: "",
  hdzt: "",
  hdlxm: "",
  hdnr: "",
  zbdw: "",
  zbdwjbm: "",
  hdksrq: "",
  hdjsrq: "",
  xxfzr: "",
  fzrlxfs: "",
  bxjscyrs: undefined,
  wxjscyrs: undefined,
  bxxscyrs: undefined,
  xwxscyrs: undefined,
  sjcjsj: "",
  reportStatus: "0",  // 默认未上报
  enableStatus: "1",  // 默认启用
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 状态选项
const reportStatusOptions = [
  { label: "未上报", value: "0" },
  { label: "已上报", value: "1" },
  { label: "上报失败", value: "2" },
];

const enableStatusOptions = [
  { label: "启用", value: "1" },
  { label: "禁用", value: "0" },
];

// 详情对话框
const viewDialogVisible = ref(false);
const currentRecord = ref<OdsSzhdsjInfo | null>(null);

// 字典选项
const activityTypeOptions = ref<DictOption[]>([]);
const organizerLevelOptions = ref<DictOption[]>([]);

// 系统学校代码
const systemSchoolCode = ref("");

// 获取系统学校代码
const getSystemSchoolCodeData = async () => {
  try {
    const response: any = await getSystemSchoolCode();
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      // 设置查询参数和表单的学校代码
      queryParams.xxdm = response.data.data;
      form.xxdm = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "获取学校代码失败");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.error("获取学校代码失败");
  }
};

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
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "必须是10位数字", trigger: "blur" }
  ],
  hdbh: [
    { required: true, message: "请输入活动编号", trigger: "blur" },
    { max: 32, message: "活动编号长度不能超过32位", trigger: "blur" }
  ],
  hdmc: [
    { required: true, message: "请输入活动名称", trigger: "blur" },
    { max: 150, message: "活动名称长度不能超过150位", trigger: "blur" }
  ],
  sszt: [
    { max: 100, message: "所属专题长度不能超过100位", trigger: "blur" }
  ],
  hdbk: [
    { max: 100, message: "活动板块长度不能超过100位", trigger: "blur" }
  ],
  hdzt: [
    { max: 200, message: "活动主题长度不能超过200位", trigger: "blur" }
  ],
  hdlxm: [
    { required: true, message: "请选择活动类型码", trigger: "change" },
     
  ],
  hdnr: [
    { max: 2000, message: "活动内容长度不能超过2000位", trigger: "blur" }
  ],
  zbdw: [
    { max: 60, message: "主办单位长度不能超过60位", trigger: "blur" }
  ],
  zbdwjbm: [
    { required: true, message: "请选择主办单位级别码", trigger: "change" },
     
  ],
  hdksrq: [
    { required: true, message: "请选择活动开始日期", trigger: "change" },
    { pattern: /^\d{8}$/, message: "日期格式：YYYYMMDD", trigger: "blur" }
  ],
  hdjsrq: [
    { required: true, message: "请选择活动结束日期", trigger: "change" },
    { pattern: /^\d{8}$/, message: "日期格式：YYYYMMDD", trigger: "blur" }
  ],
  xxfzr: [
    { max: 36, message: "学校负责人长度不能超过36位", trigger: "blur" }
  ],
  fzrlxfs: [
    { max: 30, message: "负责人联系方式长度不能超过30位", trigger: "blur" }
  ],
  bxjscyrs: [
    { required: true, message: "请输入本校教师参与人数", trigger: "blur" },
    { type: "number", min: 0, max: 99999999, message: "范围：0-99999999", trigger: "blur" }
  ],
  wxjscyrs: [
    { required: true, message: "请输入外校教师参与人数", trigger: "blur" },
    { type: "number", min: 0, max: 99999999, message: "范围：0-99999999", trigger: "blur" }
  ],
  bxxscyrs: [
    { required: true, message: "请输入本校学生参与人数", trigger: "blur" },
    { type: "number", min: 0, max: 99999999, message: "范围：0-99999999", trigger: "blur" }
  ],
  xwxscyrs: [
    { required: true, message: "请输入校外学生参与人数", trigger: "blur" },
    { type: "number", min: 0, max: 99999999, message: "范围：0-99999999", trigger: "blur" }
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
    { pattern: /^\d{14}$/, message: "时间格式：YYYYMMDDHHmmss", trigger: "blur" }
  ],
  reportStatus: [
    { required: true, message: "请选择上报状态", trigger: "change" }
  ],
  enableStatus: [
    { required: true, message: "请选择启用状态", trigger: "change" }
  ]
});

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsSzhdsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询思政活动数据失败:", error);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
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
    hdbh: "",
    hdmc: "",
    sszt: "",
    hdbk: "",
    hdzt: "",
    hdlxm: "",
    zbdw: "",
    zbdwjbm: "",
    xxfzr: "",
    hdksrqStart: "",
    hdksrqEnd: "",
    hdjsrqStart: "",
    hdjsrqEnd: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    hdbh: "",
    hdmc: "",
    sszt: "",
    hdbk: "",
    hdzt: "",
    hdlxm: "",
    hdnr: "",
    zbdw: "",
    zbdwjbm: "",
    hdksrq: "",
    hdjsrq: "",
    xxfzr: "",
    fzrlxfs: "",
    bxjscyrs: undefined,
    wxjscyrs: undefined,
    bxxscyrs: undefined,
    xwxscyrs: undefined,
    sjcjsj: "",
    reportStatus: "0",  // 默认未上报
    enableStatus: "1",  // 默认启用
  });
  formRef.value?.clearValidate();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogType.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsSzhdsjInfo) => {
  try {
    const response: any = await getOdsSzhdsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogType.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取思政活动数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsSzhdsjInfo) => {
  try {
    const response: any = await getOdsSzhdsjById(row.id);
    if (response.data.code === 200) {
      currentRecord.value = response.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取思政活动数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsSzhdsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条思政活动数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = (await deleteOdsSzhdsj(row.id)) as any;
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除思政活动数据失败:", error);
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
      `确定要删除选中的 ${selectedIds.value.length} 条思政活动数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = (await batchDeleteOdsSzhdsj(selectedIds.value)) as any;
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
      selectedIds.value = [];
    } else {
      ElMessage.error(response.data.message || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除思政活动数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsSzhdsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `思政活动数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出思政活动数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response: any;
    if (dialogType.value === "add") {
      response = await addOdsSzhdsj(form);
    } else {
      response = await updateOdsSzhdsj(form);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogType.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(
        response.data.message ||
          (dialogType.value === "add" ? "新增失败" : "修改失败"),
      );
    }
  } catch (error) {
    console.error(
      `${dialogType.value === "add" ? "新增" : "修改"}思政活动数据失败:`,
      error,
    );
    ElMessage.error(dialogType.value === "add" ? "新增失败" : "修改失败");
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

// 表格选择
const handleSelectionChange = (selection: OdsSzhdsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (row: OdsSzhdsjInfo) => {
  // 可以添加行点击逻辑
  console.log("点击行:", row);
};

// 行双击
const handleRowDblClick = (row: OdsSzhdsjInfo) => {
  handleView(row);
};

// 分页
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 获取字典数据
const loadDictData = async () => {
  try {
    const [activityTypeRes, organizerLevelRes] = (await Promise.all([
      getActivityTypeOptions(),
      getOrganizerLevelOptions(),
    ])) as any[];

    if (activityTypeRes.data.code === 200) {
      activityTypeOptions.value = activityTypeRes.data.data;
    }

    if (organizerLevelRes.data.code === 200) {
      organizerLevelOptions.value = organizerLevelRes.data.data;
    }
  } catch (error) {
    console.error("获取字典数据失败:", error);
  }
};

// 页面加载时获取系统学校代码和字典数据
onMounted(() => {
  getSystemSchoolCodeData();
  getList();
  loadDictData();
});
</script>

<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
           
          <el-form-item label="活动编号" prop="hdbh">
            <el-input
              v-model="queryParams.hdbh"
              placeholder="请输入活动编号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="活动名称" prop="hdmc">
            <el-input
              v-model="queryParams.hdmc"
              placeholder="请输入活动名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="所属专题" prop="sszt">
            <el-input
              v-model="queryParams.sszt"
              placeholder="请输入所属专题"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item style="width: 200px;" label="活动类型"  prop="hdlxm">
            <el-select
              v-model="queryParams.hdlxm"
              placeholder="请选择活动类型"
              clearable
            >
              <el-option
                v-for="option in activityTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="width: 200px;" label="主办单位" prop="zbdw">
            <el-input
              style="width: 200px;"
              v-model="queryParams.zbdw"
              placeholder="请输入主办单位"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="学校负责人" prop="xxfzr">
            <el-input
              v-model="queryParams.xxfzr"
              placeholder="请输入学校负责人"
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
          <el-button type="warning" @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>
        <div class="header-title">思政活动数据数据清洗</div>
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
          :height="'calc(75vh - 90px)'"
          stripe
          size="default"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column
            prop="zjsjwyxbs"
            label="唯一性标识"
            width="280"
            show-overflow-tooltip
          />
          <el-table-column prop="xxdm" label="学校代码" width="100" />
          <el-table-column
            prop="hdbh"
            label="活动编号"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="hdmc"
            label="活动名称"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sszt"
            label="所属专题"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="hdbk"
            label="活动板块"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="hdzt"
            label="活动主题"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column prop="hdlxmText" label="活动类型" width="100" />
          <el-table-column
            prop="zbdw"
            label="主办单位"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="zbdwjbm"
            label="主办单位级别"
            width="120"
          />
          <el-table-column prop="hdksrq" label="开始日期" width="100">
            <template #default="{ row }">
              {{ row.hdksrq ? formatDate(row.hdksrq) : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="hdjsrq" label="结束日期" width="100">
            <template #default="{ row }">
              {{ row.hdjsrq ? formatDate(row.hdjsrq) : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="xxfzr" label="学校负责人" width="120" />
          <el-table-column
            prop="fzrlxfs"
            label="负责人联系方式"
            width="140"
            show-overflow-tooltip
          />
          <el-table-column
            prop="bxjscyrs"
            label="本校教师人数"
            width="120"
            align="right"
          />
          <el-table-column
            prop="wxjscyrs"
            label="外校教师人数"
            width="120"
            align="right"
          />
          <el-table-column
            prop="bxxscyrs"
            label="本校学生人数"
            width="120"
            align="right"
          />
          <el-table-column
            prop="xwxscyrs"
            label="校外学生人数"
            width="120"
            align="right"
          />
          <el-table-column prop="sjcjsj" label="数据采集时间" width="140">
            <template #default="{ row }">
              {{ row.sjcjsj ? formatDateTime(row.sjcjsj) : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="160">
            <template #default="{ row }">
              {{ row.updateTime ? formatDateTime(row.updateTime) : '' }}
            </template>
          </el-table-column>
          <el-table-column
            label="上报状态"
            prop="reportStatus"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag
                :type="row.reportStatus === '1' ? 'success' : row.reportStatus === '2' ? 'danger' : 'warning'"
              >
                {{ row.reportStatus === '1' ? '已上报' : row.reportStatus === '2' ? '上报失败' : '未上报' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="启用状态"
            prop="enableStatus"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag
                :type="row.enableStatus === '1' ? 'success' : 'info'"
              >
                {{ row.enableStatus === '1' ? '启用' : '禁用' }}
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            small
          />
        </div>
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增思政活动数据' : '编辑思政活动数据'"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      destroy-on-close
      class="form-dialog"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
        class="dialog-form"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可不填，后端自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="系统自动获取学校代码"
                maxlength="10"
                :disabled="true"
                style="background-color: #f5f7fa;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动编号" prop="hdbh">
              <el-input
                v-model="form.hdbh"
                placeholder="请输入活动编号"
                maxlength="32"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动名称" prop="hdmc">
              <el-input
                v-model="form.hdmc"
                placeholder="请输入活动名称"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="所属专题" prop="sszt">
              <el-input
                v-model="form.sszt"
                placeholder="请输入所属专题"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动板块" prop="hdbk">
              <el-input
                v-model="form.hdbk"
                placeholder="请输入活动板块"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动主题" prop="hdzt">
              <el-input
                v-model="form.hdzt"
                placeholder="请输入活动主题"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动类型" prop="hdlxm">
              <el-select
                v-model="form.hdlxm"
                placeholder="请选择活动类型"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="option in activityTypeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px;">
            <el-form-item label="活动内容" prop="hdnr">
              <el-input
                v-model="form.hdnr"
                type="textarea"
                :rows="4"
                placeholder="请输入活动内容"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="主办单位" prop="zbdw">
              <el-input
                v-model="form.zbdw"
                placeholder="请输入主办单位"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="主办单位级别" prop="zbdwjbm">
              <el-select
                v-model="form.zbdwjbm"
                placeholder="请选择主办单位级别"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="option in organizerLevelOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动开始日期" prop="hdksrq">
              <el-date-picker
                v-model="form.hdksrq"
                type="date"
                placeholder="请选择活动开始日期"
                style="width: 100%"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动结束日期" prop="hdjsrq">
              <el-date-picker
                v-model="form.hdjsrq"
                type="date"
                placeholder="请选择活动结束日期"
                style="width: 100%"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="学校负责人" prop="xxfzr">
              <el-input
                v-model="form.xxfzr"
                placeholder="请输入学校负责人"
                maxlength="36"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="负责人联系方式" prop="fzrlxfs">
              <el-input
                v-model="form.fzrlxfs"
                placeholder="请输入负责人联系方式"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="本校教师参与人数" prop="bxjscyrs">
              <el-input-number
                v-model="form.bxjscyrs"
                :min="0"
                :max="99999999"
                placeholder="请输入本校教师参与人数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="外校教师参与人数" prop="wxjscyrs">
              <el-input-number
                v-model="form.wxjscyrs"
                :min="0"
                :max="99999999"
                placeholder="请输入外校教师参与人数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="本校学生参与人数" prop="bxxscyrs">
              <el-input-number
                v-model="form.bxxscyrs"
                :min="0"
                :max="99999999"
                placeholder="请输入本校学生参与人数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="校外学生参与人数" prop="xwxscyrs">
              <el-input-number
                v-model="form.xwxscyrs"
                :min="0"
                :max="99999999"
                placeholder="请输入校外学生参与人数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间"
                style="width: 100%"
                value-format="YYYYMMDDHHmmss"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select
                v-model="form.reportStatus"
                placeholder="请选择上报状态"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="option in reportStatusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select
                v-model="form.enableStatus"
                placeholder="请选择启用状态"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="option in enableStatusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
          >
            {{ dialogType === "add" ? "新增" : "保存" }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情查看对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="思政活动数据详情"
      width="1000px"
      center
      class="detail-dialog"
    >
      <div v-if="currentRecord" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="唯一性标识">
            {{ currentRecord.zjsjwyxbs }}
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            {{ currentRecord.xxdm }}
          </el-descriptions-item>
          <el-descriptions-item label="活动编号">
            {{ currentRecord.hdbh }}
          </el-descriptions-item>
          <el-descriptions-item label="活动名称">
            {{ currentRecord.hdmc }}
          </el-descriptions-item>
          <el-descriptions-item label="所属专题">
            {{ currentRecord.sszt }}
          </el-descriptions-item>
          <el-descriptions-item label="活动板块">
            {{ currentRecord.hdbk }}
          </el-descriptions-item>
          <el-descriptions-item label="活动主题">
            {{ currentRecord.hdzt }}
          </el-descriptions-item>
          <el-descriptions-item label="活动类型">
            {{ currentRecord.hdlxmText }}
          </el-descriptions-item>
          <el-descriptions-item label="主办单位">
            {{ currentRecord.zbdw }}
          </el-descriptions-item>
          <el-descriptions-item label="主办单位级别">
            {{ currentRecord.zbdwjbmText }}
          </el-descriptions-item>
          <el-descriptions-item label="活动开始日期">
            {{ currentRecord.hdksrq }}
          </el-descriptions-item>
          <el-descriptions-item label="活动结束日期">
            {{ currentRecord.hdjsrq }}
          </el-descriptions-item>
          <el-descriptions-item label="学校负责人">
            {{ currentRecord.xxfzr }}
          </el-descriptions-item>
          <el-descriptions-item label="负责人联系方式">
            {{ currentRecord.fzrlxfs }}
          </el-descriptions-item>
          <el-descriptions-item label="本校教师参与人数">
            {{ currentRecord.bxjscyrs }}
          </el-descriptions-item>
          <el-descriptions-item label="外校教师参与人数">
            {{ currentRecord.wxjscyrs }}
          </el-descriptions-item>
          <el-descriptions-item label="本校学生参与人数">
            {{ currentRecord.bxxscyrs }}
          </el-descriptions-item>
          <el-descriptions-item label="校外学生参与人数">
            {{ currentRecord.xwxscyrs }}
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            {{ currentRecord.sjcjsj }}
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="currentRecord.reportStatus === '1' ? 'success' : currentRecord.reportStatus === '2' ? 'danger' : 'warning'"
            >
              {{ currentRecord.reportStatus === '1' ? '已上报' : currentRecord.reportStatus === '2' ? '上报失败' : '未上报' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="currentRecord.enableStatus === '1' ? 'success' : 'info'"
            >
              {{ currentRecord.enableStatus === '1' ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ currentRecord.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ currentRecord.updateTime }}
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="currentRecord.hdnr" class="content-section">
          <h4>活动内容</h4>
          <div class="content-text">{{ currentRecord.hdnr }}</div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleDetailClose">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  padding: 0;

  .search-card {
    margin-bottom: 8px;

    :deep(.el-card__body) {
      padding: 8px;
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

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 8px;
    }

    :deep(.el-form-item__content) {
      display: flex;
      align-items: center;
    }

    :deep(.el-button) {
      height: 32px;
      padding: 8px 15px;
    }
  }

  .table-card {
    margin-top: -10px;

    :deep(.el-card__body) {
      padding: 10px 15px 0;
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
  }

  /* 表格样式调整 */
  :deep(.el-table) {
    .el-table__header th {
      background-color: #f5f7fa;
      color: #303133;
      font-weight: 500;
      height: 40px;
      padding: 4px 0;
    }

    .el-table__row {
      height: 42px;
    }

    .el-table__cell {
      padding: 2px;
    }
  }
}

/* 对话框样式 */
.form-dialog {
  :deep(.el-dialog__header) {
    background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
    color: white;
    border-radius: 8px 8px 0 0;
    padding: 15px 20px;
  }

  :deep(.el-dialog__title) {
    color: white;
    font-weight: 600;
  }

  :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: white;
  }

  :deep(.el-dialog__body) {
    padding: 20px 24px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .form-section {
    padding: 10px 0;

    :deep(.el-form-item__label) {
      font-weight: 500;
      color: #303133;
    }

    :deep(.el-input__wrapper) {
      border-radius: 6px;
    }

    :deep(.el-select .el-input__wrapper) {
      border-radius: 6px;
    }
  }
}

/* 详情对话框样式 */
.detail-dialog {
  :deep(.el-dialog__header) {
    background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
    color: white;
    border-radius: 8px 8px 0 0;
    padding: 15px 20px;
  }

  :deep(.el-dialog__title) {
    color: white;
    font-weight: 600;
  }

  :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: white;
  }

  :deep(.el-dialog__body) {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .detail-content {
    :deep(.el-descriptions) {
      margin-bottom: 20px;
    }

    :deep(.el-descriptions__label) {
      font-weight: 500;
      width: 140px;
    }

    .content-section {
      margin-top: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 4px;

      h4 {
        margin: 0 0 10px 0;
        font-size: 16px;
        font-weight: 500;
        color: #303133;
      }

      .content-text {
        line-height: 1.6;
        color: #606266;
        word-break: break-word;
      }
    }
  }
}

/* 禁用状态的输入框样式 */
:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa !important;
  box-shadow: 0 0 0 1px #e4e7ed inset !important;
}

:deep(.el-input.is-disabled .el-input__inner) {
  background-color: transparent !important;
  color: #606266 !important;
}

/* 按钮样式调整 */
:deep(.operation-buttons .el-button) {
  border-radius: 6px;
  font-weight: 500;
}

:deep(.action-buttons .el-button) {
  padding: 2px 4px;
  font-size: 12px;
}

/* Tag样式调整 */
:deep(.el-tag) {
  border-radius: 4px;
  font-weight: 500;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
