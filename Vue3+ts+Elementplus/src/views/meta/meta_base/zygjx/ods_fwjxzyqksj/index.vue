<template>
  <div class="teaching-resource-access-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="访问人员姓名" prop="fwryxm">
            <el-input
              v-model="queryParams.fwryxm"
              placeholder="请输入访问人员姓名"
              clearable
            />
          </el-form-item>
          <el-form-item label="教学资源名称" prop="jxzymc">
            <el-input
              v-model="queryParams.jxzymc"
              placeholder="请输入教学资源名称"
              clearable
            />
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
        <div class="header-title">访问教学资源情况数据子类表</div>
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
            prop="fwrybh"
            label="访问人员编号"
            min-width="140"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="fwryxm"
            label="访问人员姓名"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="jxzybh"
            label="教学资源编号"
            min-width="140"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="jxzymc"
            label="教学资源名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="fwjxzyksskjDisplay"
            label="访问开始时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="fwjxzyjsskjDisplay"
            label="访问结束时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sjcjsjDisplay"
            label="采集时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
                @click="handleReportStatusClick(row)"
                style="cursor: pointer"
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
      style="height: 390px"
      class="teaching-resource-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可选填，为空时后端自动生成32位全局唯一编码"
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
                placeholder="学校（机构）标识码，10位数字码"
                maxlength="10"
                show-word-limit
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="访问人员编号" prop="fwrybh">
              <el-input
                v-model="form.fwrybh"
                placeholder="请输入访问人员编号"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="访问人员姓名" prop="fwryxm">
              <el-input
                v-model="form.fwryxm"
                placeholder="请输入访问人员姓名"
                maxlength="36"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教学资源编号" prop="jxzybh">
              <el-select
                v-model="form.jxzybh"
                placeholder="请选择教学资源"
                filterable
                remote
                reserve-keyword
                :remote-method="fetchResourceOptions"
                :loading="resourceLoading"
                clearable
                style="width: 100%"
                @change="handleResourceChange"
              >
                <el-option
                  v-for="item in resourceOptions"
                  :key="item.value"
                  :label="`${item.zybh} - ${item.zymc}`"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教学资源名称" prop="jxzymc">
              <el-input
                v-model="form.jxzymc"
                placeholder="由资源编号选择后自动填充"
                readonly
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="访问开始时间" prop="fwjxzykssj">
              <el-date-picker
                v-model="form.fwjxzykssj"
                type="datetime"
                placeholder="格式：YYYYMMDD hhmmss"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="访问结束时间" prop="fwjxzyjssj">
              <el-date-picker
                v-model="form.fwjxzyjssj"
                type="datetime"
                placeholder="格式：YYYYMMDD hhmmss"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
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

      <!-- 查看模式 -->
      <div v-else class="teaching-resource-detail">
        <el-descriptions
          class="detail-descriptions"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item label="主键数据唯一性标识">
            <div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ form.xxdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="访问人员编号">
            <div class="detail-value">{{ form.fwrybh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="访问人员姓名">
            <div class="detail-value">{{ form.fwryxm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教学资源编号">
            <div class="detail-value">{{ form.jxzybh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教学资源名称">
            <div class="detail-value">{{ form.jxzymc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="访问开始时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.fwjxzykssj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="访问结束时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.fwjxzyjssj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjcjsj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="form.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
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
  getOdsFwjxzyqksjPage,
  getOdsFwjxzyqksjById,
  addOdsFwjxzyqksj,
  updateOdsFwjxzyqksj,
  deleteOdsFwjxzyqksj,
  batchDeleteOdsFwjxzyqksj,
  exportOdsFwjxzyqksj,
  updateSingleReportStatus,
  getSystemSchoolCode,
  getResourceOptions,
  type OdsFwjxzyqksjInfo,
  type OdsFwjxzyqksjQuery,
  type OdsFwjxzyqksjForm,
  type ResourceOption,
} from "@/api/meta/meta_base/zygjx/ods_fwjxzyqksj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsFwjxzyqksjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);

// 表单引用
const queryForm = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 资源选项数据
const resourceOptions = ref<ResourceOption[]>([]);
const resourceLoading = ref(false);

// 查询参数
const queryParams = reactive<OdsFwjxzyqksjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  fwrybh: "",
  fwryxm: "",
  jxzybh: "",
  jxzymc: "",
  fwjxzyksskjStart: "",
  fwjxzyksskjEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 100,
});

// 表单数据
const form = reactive<OdsFwjxzyqksjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  fwrybh: "",
  fwryxm: "",
  jxzybh: "",
  jxzymc: "",
  fwjxzykssj: "",
  fwjxzyjssj: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
    {
      pattern: /^[A-Z0-9]{32}$/,
      message: "格式错误，需32位大写字母+数字组合",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须为10位数字", trigger: "blur" },
  ],
  fwrybh: [
    { required: true, message: "访问人员编号不能为空", trigger: "blur" },
    { max: 100, message: "访问人员编号长度不能超过100位", trigger: "blur" },
  ],
  fwryxm: [
    { required: true, message: "访问人员姓名不能为空", trigger: "blur" },
    { max: 36, message: "访问人员姓名长度不能超过36位", trigger: "blur" },
  ],
  jxzybh: [
    { required: true, message: "教学资源编号不能为空", trigger: "blur" },
    { max: 64, message: "教学资源编号长度不能超过64位", trigger: "blur" },
  ],
  jxzymc: [
    { required: true, message: "教学资源名称不能为空", trigger: "blur" },
    { max: 300, message: "教学资源名称长度不能超过300位", trigger: "blur" },
  ],
  fwjxzykssj: [
    {
      required: true,
      message: "请选择访问教学资源开始时间",
      trigger: "change",
    },
  ],
  fwjxzyjssj: [
    {
      required: true,
      message: "请选择访问教学资源结束时间",
      trigger: "change",
    },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增访问教学资源情况数据";
    case "edit":
      return "编辑访问教学资源情况数据";
    case "view":
      return "查看访问教学资源情况数据详情";
    default:
      return "";
  }
});

// 获取资源选项列表
const fetchResourceOptions = async (keyword?: string) => {
  try {
    resourceLoading.value = true;
    const response = (await getResourceOptions(keyword)) as any;
    if (response.data?.code === 200) {
      resourceOptions.value = response.data.data || [];
    } else {
      console.warn("获取资源选项失败:", response.data?.message);
    }
  } catch (error) {
    console.error("获取资源选项失败:", error);
  } finally {
    resourceLoading.value = false;
  }
};

// 资源选择变化处理
const handleResourceChange = (value: string) => {
  const selectedResource = resourceOptions.value.find(
    (item) => item.value === value,
  );
  if (selectedResource) {
    form.jxzybh = selectedResource.zybh;
    form.jxzymc = selectedResource.zymc;
  }
};

// 格式化显示时间
const formatDisplayTime = (timeStr?: string) => {
  if (!timeStr) return "";

  // 支持15位格式：YYYYMMDD HHmmss（有空格）
  if (timeStr.length === 15 && timeStr.charAt(8) === " ") {
    const year = timeStr.substring(0, 4);
    const month = timeStr.substring(4, 6);
    const day = timeStr.substring(6, 8);
    const hour = timeStr.substring(9, 11);
    const minute = timeStr.substring(11, 13);
    const second = timeStr.substring(13, 15);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  // 兼容14位格式：YYYYMMDDHHMMSS（无空格）
  if (timeStr.length === 14) {
    const year = timeStr.substring(0, 4);
    const month = timeStr.substring(4, 6);
    const day = timeStr.substring(6, 8);
    const hour = timeStr.substring(8, 10);
    const minute = timeStr.substring(10, 12);
    const second = timeStr.substring(12, 14);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  return timeStr;
};

// 查询列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = (await getOdsFwjxzyqksjPage(queryParams)) as any;
    if (response.data?.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data?.message || "查询失败");
    }
  } catch (error) {
    console.error("查询访问教学资源情况数据失败:", error);
    ElMessage.error("查询失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryForm.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

// 新增
const handleAdd = async () => {
  resetForm();
  dialogMode.value = "add";

  // 自动获取并填入学校代码
  try {
    const response = (await getSystemSchoolCode()) as any;
    if (response.data?.code === 200) {
      form.xxdm = response.data.data || "";
    }
  } catch (error) {
    console.warn("获取学校代码失败:", error);
  }

  // 初始化资源选项列表
  await fetchResourceOptions();

  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsFwjxzyqksjInfo) => {
  resetForm();
  dialogMode.value = "edit";

  // 初始化资源选项列表
  await fetchResourceOptions();

  try {
    const response = (await getOdsFwjxzyqksjById(row.id)) as any;
    if (response.data?.code === 200) {
      Object.assign(form, response.data.data);
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取访问教学资源情况数据详情失败:", error);
    ElMessage.error("获取数据失败，请重试");
  }
};

// 查看详情
const handleView = async (row: OdsFwjxzyqksjInfo) => {
  resetForm();
  dialogMode.value = "view";

  try {
    const response = (await getOdsFwjxzyqksjById(row.id)) as any;
    if (response.data?.code === 200) {
      Object.assign(form, response.data.data);
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取访问教学资源情况数据详情失败:", error);
    ElMessage.error("获取数据失败，请重试");
  }
};

// 删除
const handleDelete = (row: OdsFwjxzyqksjInfo) => {
  ElMessageBox.confirm(
    `确定要删除访问教学资源情况数据"${row.zjsjwyxbs}"吗？`,
    "删除确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(async () => {
    try {
      const response = (await deleteOdsFwjxzyqksj(row.id)) as any;
      if (response.data?.code === 200) {
        ElMessage.success("删除成功");
        getList();
      } else {
        ElMessage.error(response.data?.message || "删除失败");
      }
    } catch (error) {
      console.error("删除访问教学资源情况数据失败:", error);
      ElMessage.error("删除失败，请重试");
    }
  });
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确定要批量删除选中的 ${selectedIds.value.length} 条访问教学资源情况数据吗？`,
    "批量删除确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(async () => {
    try {
      const response = (await batchDeleteOdsFwjxzyqksj(
        selectedIds.value,
      )) as any;
      if (response.data?.code === 200) {
        ElMessage.success("批量删除成功");
        selectedIds.value = [];
        getList();
      } else {
        ElMessage.error(response.data?.message || "批量删除失败");
      }
    } catch (error) {
      console.error("批量删除访问教学资源情况数据失败:", error);
      ElMessage.error("批量删除失败，请重试");
    }
  });
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = (await exportOdsFwjxzyqksj(queryParams)) as any;

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `访问教学资源情况数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出访问教学资源情况数据失败:", error);
    ElMessage.error("导出失败，请重试");
  }
};

// 表单提交
const handleFormSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        let response;
        if (dialogMode.value === "add") {
          response = (await addOdsFwjxzyqksj(form)) as any;
        } else {
          response = (await updateOdsFwjxzyqksj(form)) as any;
        }

        if (response.data && response.data.code === 200) {
          ElMessage.success(
            dialogMode.value === "add" ? "新增成功" : "修改成功",
          );
          dialogVisible.value = false;
          getList();
        } else {
          ElMessage.error(response.data?.message || "操作失败");
        }
      } catch (error) {
        console.error("提交表单失败:", error);
        ElMessage.error("操作失败，请重试");
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 重置表单
const resetForm = () => {
  form.id = undefined;
  form.zjsjwyxbs = "";
  form.xxdm = "";
  form.fwrybh = "";
  form.fwryxm = "";
  form.jxzybh = "";
  form.jxzymc = "";
  form.fwjxzykssj = "";
  form.fwjxzyjssj = "";
  form.sjcjsj = "";
  form.reportStatus = "0";
  form.enableStatus = "1";
  formRef.value?.clearValidate();
};

// 选择变化
const handleSelectionChange = (selection: OdsFwjxzyqksjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (_row: OdsFwjxzyqksjInfo) => {
  // 行点击逻辑
};
// 行双击
const handleRowDblClick = (row: OdsFwjxzyqksjInfo) => {
  handleView(row);
};
// 分页大小变化
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  queryParams.pageNum = 1;
  getList();
};
// 当前页变化
const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};
// 上报状态点击
const handleReportStatusClick = (row: OdsFwjxzyqksjInfo) => {
  const statusMap = { "0": "1", "1": "2", "2": "0" };
  const newStatus =
    statusMap[row.reportStatus as keyof typeof statusMap] || "0";
  updateReportStatus(row.id, newStatus);
};
// 更新上报状态
const updateReportStatus = async (id: number, status: string) => {
  try {
    const response = (await updateSingleReportStatus(id, status)) as any;
    if (response.data && response.data.code === 200) {
      ElMessage.success("状态更新成功");
      getList();
    } else {
      ElMessage.error(response.data?.message || "状态更新失败");
      getList(); // 刷新以恢复原状态
    }
  } catch (error) {
    console.error("更新上报状态失败:", error);
    ElMessage.error("状态更新失败，请重试");
    getList();
  }
};

// 获取上报状态标签类型
const getReportStatusTagType = (
  status: string,
): "success" | "warning" | "danger" | "primary" | "info" => {
  const typeMap: Record<
    string,
    "success" | "warning" | "danger" | "primary" | "info"
  > = {
    "0": "primary",
    "1": "success",
    "2": "danger",
  };
  return typeMap[status] || "";
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  const textMap = { "0": "未上报", "1": "已上报", "2": "上报失败" };
  return textMap[status as keyof typeof textMap] || "未知";
};
// 组件挂载后获取数据
onMounted(() => {
  getList();
});
</script>

<style scoped>
.teaching-resource-access-management {
  padding: 0px;
}

.search-card {
  height: 60px;
  margin-bottom: 0px;
}

.search-bar {
}

.table-card {
  margin-top: -10px;
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
  padding: 0 20px;

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
.teaching-resource-dialog {
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
  margin-bottom: 18px !important;
}

:deep(.el-row) {
  margin-bottom: 0 !important;

  .el-form-item {
    margin-bottom: 18px !important;
  }
}

/* 对话框样式 */
:deep(.el-dialog) {
  .el-dialog__header {
    padding: 20px 24px 12px;
    border-bottom: 1px solid #e4e7ed;
  }

  .el-dialog__body {
    padding: 20px 24px 24px;
    max-height: 65vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .el-dialog__footer {
    padding: 16px 24px 20px;
    border-top: 1px solid #e4e7ed;
  }
}

.dialog-footer {
  text-align: right;
}

/* 详情样式 */
.teaching-resource-detail {
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
