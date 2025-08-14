<template>
  <div class="party-activity-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
          <el-form-item label="党组织名称" prop="dzzmc">
            <el-input
              v-model="queryParams.dzzmc"
              placeholder="请输入党组织名称"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="活动地点" prop="hddd">
            <el-input
              v-model="queryParams.hddd"
              placeholder="请输入活动地点"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="活动形式" prop="hdxs">
            <el-select
              v-model="queryParams.hdxs"
              placeholder="请选择活动形式"
              clearable
              style="width: 220px;"
            >
              <el-option
                v-for="item in dictData.hdxsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
        <div class="header-title">党员活动数据管理</div>
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
            prop="dzzmc"
            label="党组织名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="dzzbh"
            label="党组织编号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hdxs"
            label="活动形式"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hddd"
            label="活动地点"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hdnr"
            label="活动内容"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hdksrq"
            label="开始日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="hdjsrq"
            label="结束日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="cyxss"
            label="参与学生数"
            min-width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="cyjss"
            label="参与教师数"
            min-width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sjcjsj"
            label="数据采集时间"
            min-width="160"
            align="center"
            sortable="custom"
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
      style="height: 560px"
      class="party-activity-dialog"
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
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="党组织" prop="dzzmc">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.dzzmc"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入党组织名称搜索"
                  :remote-method="handleOrgSearch"
                  :loading="orgSearchLoading"
                  @change="handleOrgSelect"
                  @clear="handleOrgClear"
                  style="width: 100%"
                  clearable
                  value-key="label"
                >
                  <el-option
                    v-for="item in orgOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  >
                    <div class="org-option-content">
                      <span class="org-name">{{ item.label }}</span>
                      <span class="org-code">({{ item.value }})</span>
                    </div>
                  </el-option>
                </el-select>
                <el-tooltip content="数据来源于党组织情况基础数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="党组织编号" prop="dzzbh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input
                  v-model="form.dzzbh"
                  placeholder="选择党组织后自动填充"
                  :disabled="true"
                  style="background-color: #f5f7fa;"
                />
                <el-tooltip content="数据来源于教师画像数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动形式" prop="hdxs">
              <el-select
                v-model="form.hdxs"
                placeholder="请选择活动形式"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in dictData.hdxsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动地点" prop="hddd">
              <el-input
                v-model="form.hddd"
                placeholder="请输入活动地点"
                maxlength="180"
                show-word-limit
              />
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
            <el-form-item label="活动开始日期" prop="hdksrq">
              <el-date-picker
                v-model="form.hdksrq"
                type="date"
                placeholder="请选择活动开始日期"
                format="YYYYMMDD"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动结束日期" prop="hdjsrq">
              <el-date-picker
                v-model="form.hdjsrq"
                type="date"
                placeholder="请选择活动结束日期"
                format="YYYYMMDD"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="参与学生数" prop="cyxss">
              <el-input-number
                v-model="form.cyxss"
                :min="0"
                :max="99999"
                placeholder="请输入参与学生数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="参与教师数" prop="cyjss">
              <el-input-number
                v-model="form.cyjss"
                :min="0"
                :max="99999"
                placeholder="请输入参与教师数"
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
                format="YYYYMMDD HHmmss"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
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
      <div v-else class="party-activity-detail">
        <el-descriptions
          class="detail-descriptions"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item label="唯一性标识">
            <div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ form.xxdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="党组织名称">
            <div class="detail-value">{{ form.dzzmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="党组织编号">
            <div class="detail-value">{{ form.dzzbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动形式">
            <div class="detail-value">{{ form.hdxsText || form.hdxs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动地点">
            <div class="detail-value">{{ form.hddd || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动内容" :span="2">
            <div class="detail-value">{{ form.hdnr || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动开始日期">
            <div class="detail-value">{{ form.hdksrq || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动结束日期">
            <div class="detail-value">{{ form.hdjsrq || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="参与学生数">
            <div class="detail-value">{{ form.cyxss || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="参与教师数">
            <div class="detail-value">{{ form.cyjss || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">{{ form.sjcjsj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="form.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusType(form.reportStatus)"
              size="small"
            >
              {{ getReportStatusText(form.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <div class="detail-value">{{ form.createTime || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <div class="detail-value">{{ form.updateTime || "-" }}</div>
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
// 导入依赖
import { ref, onMounted, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import {
  Search,
  Plus,
  Edit,
  Delete,
  View,
  Refresh,
  Download,
  Warning,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getOdsDyhdsjPage,
  getOdsDyhdsjById,
  addOdsDyhdsj,
  updateOdsDyhdsj,
  deleteOdsDyhdsj,
  batchDeleteOdsDyhdsj,
  exportOdsDyhdsj,
  searchOrgInfo,
  getSystemSchoolCode,
  getDictOptions,
  type OrgOption,
  type OdsDyhdsjInfo,
  type OdsDyhdsjQuery,
  type OdsDyhdsjForm,
  type DictOption,
} from "@/api/meta/meta_base/zygdz/ods_dyhdsj";
import type { ApiResponse } from "@/utils/request";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsDyhdsjInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const selectedIds = ref<number[]>([]);
const submitLoading = ref(false);
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();
// 系统学校代码
const systemSchoolCode = ref("");
// 党组织搜索相关
const orgSearchLoading = ref(false);
const orgOptions = ref<OrgOption[]>([]);

// 查询参数
const queryParams = ref<OdsDyhdsjQuery>({
  pageNum: 1,
  pageSize: 20,
  dzzmc: "",
  hddd: "",
  hdxs: "",
});

// 表单数据
const form = ref<OdsDyhdsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  dzzmc: "",
  dzzbh: "",
  hdxs: "",
  hdxsText: "",
  hddd: "",
  hdnr: "",
  hdksrq: "",
  hdjsrq: "",
  cyxss: 0,
  cyjss: 0,
  sjcjsj: "",
  enableStatus: "1",
  reportStatus: "0",
  createTime: "",
  updateTime: "",
});

// 字典数据
const dictData = ref<{ hdxsOptions: DictOption[] }>({
  hdxsOptions: [],
});

// 计算属性
const dialogTitle = computed(() => {
  const titles = {
    add: "新增党员活动数据",
    edit: "编辑党员活动数据",
    view: "党员活动数据详情",
  };
  return titles[dialogMode.value];
});

// 表单校验规则
const formRules: FormRules = {
  zjsjwyxbs: [
    { pattern: /^[A-Z0-9]{32}$/, message: "32位大写字母和数字组合", trigger: "blur" },
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "10位数字", trigger: "blur" },
  ],
  dzzmc: [
    { required: true, message: "党组织名称不能为空", trigger: "blur" },
    { max: 150, message: "长度不能超过150个字符", trigger: "blur" },
  ],
  dzzbh: [
    { max: 60, message: "长度不能超过60个字符", trigger: "blur" },
  ],
  hdxs: [
    { required: true, message: "活动形式不能为空", trigger: "change" },
    { pattern: /^[A-Z0-9]$/, message: "1位大写字母或数字", trigger: "blur" },
  ],
  hddd: [
    { max: 180, message: "长度不能超过180个字符", trigger: "blur" },
  ],
  hdnr: [
    { max: 2000, message: "长度不能超过2000个字符", trigger: "blur" },
  ],
  hdksrq: [
    { required: true, message: "活动开始日期不能为空", trigger: "blur" },
    { pattern: /^\d{8}$/, message: "日期格式：YYYYMMDD", trigger: "blur" },
  ],
  hdjsrq: [
    { required: true, message: "活动结束日期不能为空", trigger: "blur" },
    { pattern: /^\d{8}$/, message: "日期格式：YYYYMMDD", trigger: "blur" },
  ],
  cyxss: [
    { required: true, message: "参与学生数不能为空", trigger: "blur" },
    { type: "number", min: 0, max: 99999, message: "范围：0-99999", trigger: "blur" },
  ],
  cyjss: [
    { required: true, message: "参与教师数不能为空", trigger: "blur" },
    { type: "number", min: 0, max: 99999, message: "范围：0-99999", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "blur" }
     
  ],
};

// 生命周期钩子
onMounted(async () => {
  await Promise.all([
    getSystemSchoolCode().then((response) => {
      systemSchoolCode.value = response.data.data;
    }),
    getDictOptions("DYHDXSDM").then((response) => {
      dictData.value.hdxsOptions = response.data.data;
    }),
  ]);
  getList();
});

// 获取列表数据
const getList = async () => {
  try {
    loading.value = true;
    const response = await getOdsDyhdsjPage(queryParams.value);
    const result = response.data;
    dataList.value = result.data.records;
    total.value = result.data.total;
  } catch (error) {
    console.error("获取党员活动数据失败:", error);
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

// 重置
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

// 新增
const handleAdd = () => {
  form.value = {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    dzzmc: "",
    dzzbh: "",
    hdxs: "",
    hdxsText: "",
    hddd: "",
    hdnr: "",
    hdksrq: "",
    hdjsrq: "",
    cyxss: 0,
    cyjss: 0,
    sjcjsj: "",
    enableStatus: "1",
    reportStatus: "0",
  };
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsDyhdsjInfo) => {
  try {
    const response = await getOdsDyhdsjById(row.id);
    const result = response.data;
    form.value = {
      ...result.data,
      hdxsText: result.data.hdxsText || "",
      enableStatus: result.data.enableStatus || "1",
      reportStatus: result.data.reportStatus || "0",
    };
    dialogMode.value = "edit";
    dialogVisible.value = true;
  } catch (error) {
    console.error("获取党员活动数据失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 查看详情
const handleView = async (row: OdsDyhdsjInfo) => {
  try {
    const response = await getOdsDyhdsjById(row.id);
    const result = response.data;
    form.value = {
      ...result.data,
      hdxsText: result.data.hdxsText || "",
      enableStatus: result.data.enableStatus || "1",
      reportStatus: result.data.reportStatus || "0",
    };
    dialogMode.value = "view";
    dialogVisible.value = true;
  } catch (error) {
    console.error("获取党员活动数据失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 删除
const handleDelete = (row: OdsDyhdsjInfo) => {
  ElMessageBox.confirm("确定要删除该条数据吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const response = await deleteOdsDyhdsj(row.id);
        if (response.data.code === 200) {
          ElMessage.success("删除成功");
          getList();
        } else {
          ElMessage.error("删除失败");
        }
      } catch (error) {
        console.error("删除党员活动数据失败:", error);
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const response = await batchDeleteOdsDyhdsj(selectedIds.value);
        if (response.data.code === 200) {
          ElMessage.success("批量删除成功");
          getList();
        } else {
          ElMessage.error("批量删除失败");
        }
      } catch (error) {
        console.error("批量删除党员活动数据失败:", error);
        ElMessage.error("批量删除失败");
      }
    })
    .catch(() => {});
};

// 导出数据
const handleExport = async () => {
  try {
    const response = await exportOdsDyhdsj(queryParams.value);
    // 创建 Blob 对象
    const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
    // 创建下载链接
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '党员活动数据.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // 释放 URL 对象
    URL.revokeObjectURL(downloadUrl);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        submitLoading.value = true;
        const submitForm = { ...form.value };
        const response = await (dialogMode.value === "add"
          ? addOdsDyhdsj(submitForm)
          : updateOdsDyhdsj(submitForm));
        
        if (response.data.code === 200) {
          ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
          dialogVisible.value = false;
          getList();
        } else {
          ElMessage.error(dialogMode.value === "add" ? "新增失败" : "修改失败");
        }
      } catch (error) {
        console.error(dialogMode.value === "add" ? "新增党员活动数据失败:" : "修改党员活动数据失败:", error);
        ElMessage.error(dialogMode.value === "add" ? "新增失败" : "修改失败");
      } finally {
        submitLoading.value = false;
      }
    } else {
      console.error("表单校验失败:", fields);
    }
  });
};

// 表单关闭
const handleFormClose = () => {
  formRef.value?.resetFields();
  dialogVisible.value = false;
};

// 多选框选中数据
const handleSelectionChange = (selection: OdsDyhdsjInfo[]) => {
  selectedIds.value = selection.map(item => item.id);
};

// 行点击事件
const handleRowClick = (row: OdsDyhdsjInfo) => {
  // 可以添加行点击的处理逻辑
};

// 行双击事件
const handleRowDblClick = (row: OdsDyhdsjInfo) => {
  handleView(row);
};

// 分页大小改变
const handleSizeChange = (val: number) => {
  queryParams.value.pageSize = val;
  getList();
};

// 分页页码改变
const handleCurrentChange = (val: number) => {
  queryParams.value.pageNum = val;
  getList();
};

// 党组织搜索
const handleOrgSearch = async (query: string) => {
  if (query) {
    try {
      orgSearchLoading.value = true;
      const response = await searchOrgInfo(query);
      const result = response.data;
      orgOptions.value = result.data;
    } catch (error) {
      console.error("搜索党组织失败:", error);
      ElMessage.error("搜索党组织失败");
    } finally {
      orgSearchLoading.value = false;
    }
  } else {
    orgOptions.value = [];
  }
};

// 党组织选择
const handleOrgSelect = (value: string) => {
  const selectedOrg = orgOptions.value.find(opt => opt.label === value);
  if (selectedOrg) {
    form.value.dzzbh = selectedOrg.value;
  }
};

// 党组织清空
const handleOrgClear = () => {
  form.value.dzzbh = "";
};

// 获取上报状态类型
const getReportStatusType = (status: string): string => {
  const statusTypes: { [key: string]: string } = {
    "0": "info",
    "1": "warning",
    "2": "success",
    "3": "danger",
  };
  return statusTypes[status] || "info";
};

// 获取上报状态文本
const getReportStatusText = (status: string): string => {
  const statusTexts: { [key: string]: string } = {
    "0": "未上报",
    "1": "待审核",
    "2": "已通过",
    "3": "已驳回",
  };
  return statusTexts[status] || "未上报";
};
</script>

<style scoped>
.party-activity-management {
  padding: 0;
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

:deep(.el-form-item__content) {
  display: flex;
  align-items: center;
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

/* 新增样式 */
.party-activity-dialog {
  border-radius: 8px;
}

.party-activity-detail {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px 0;
}

.detail-descriptions {
  margin-bottom: 20px;
}

.detail-value {
  color: #303133;
  font-weight: 500;
  word-break: break-all;
}

.detail-value:empty::before {
  content: "-";
  color: #909399;
}

/* 表格行样式调整 */
:deep(.el-table .el-table__body-wrapper .el-table__row) {
  transition: background-color 0.2s ease;
}

:deep(.el-table .el-table__body-wrapper .el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 对话框样式调整 */
:deep(.party-activity-dialog .el-dialog__header) {
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 15px 20px;
}

:deep(.party-activity-dialog .el-dialog__title) {
  color: white;
  font-weight: 600;
}

:deep(.party-activity-dialog .el-dialog__headerbtn) {
  top: 50%;
  transform: translateY(-50%);
}

:deep(.party-activity-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 18px;
}

:deep(.party-activity-dialog .el-dialog__body) {
  padding: 20px 24px;
  max-height: 60vh;
  overflow-y: auto;
}

/* 表单样式调整 */
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

.org-option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.org-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.org-code {
  color: #8492a6;
  font-size: 12px;
  margin-left: 8px;
  flex-shrink: 0;
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
</style>
