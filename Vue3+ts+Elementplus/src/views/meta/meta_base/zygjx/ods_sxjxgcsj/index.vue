<template>
  <div class="internship-teaching-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="实训项目编号" prop="sxxmbh">
            <el-input
              v-model="queryParams.sxxmbh"
              placeholder="请输入实训项目编号"
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
          <el-form-item label="学生姓名" prop="xsxm">
            <el-input
              v-model="queryParams.xsxm"
              placeholder="请输入学生姓名"
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
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">实习教学过程数据子类表</div>
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
            prop="sxxmbh"
            label="实训项目编号"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sszyh"
            label="所属专业号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xh"
            label="学号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xsxm"
            label="学生姓名"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xssxkss"
            label="实训课时"
            width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sxksrqDisplay"
            label="开始日期"
            width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sxjsrqDisplay"
            label="结束日期"
            width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sxjgzhpjText"
            label="综合评价"
            width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sjcjsjDisplay"
            label="采集时间"
            width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
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
      style="height: 520px"
      class="internship-dialog"
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
                placeholder="可不填，后端自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="系统自动获取学校代码"
                maxlength="10"
                :disabled="true"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训项目编号" prop="sxxmbh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.sxxmbh"
                  placeholder="请选择实训项目编号"
                  filterable
                  remote
                  :remote-method="searchSxxmbh"
                  :loading="sxxmbhLoading"
                  style="flex: 1"
                  clearable
                  @change="handleSxxmbhChange"
                >
                  <el-option
                    v-for="item in sxxmbhOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :data-gkzyh="item.gkzyh"
                  >
                    <span>{{ item.label }}</span>
                  </el-option>
                </el-select>
                <el-tooltip
                  content="数据来源：实训项目数据子类表(ODS_SXXMSJ)"
                  placement="top"
                >
                  <el-button
                    circle
                    size="small"
                    style="min-width: 24px; height: 24px"
                  >
                    <el-icon size="12"><InfoFilled /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属专业号" prop="sszyh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input
                  v-model="form.sszyh"
                  placeholder="选择实训项目编号后自动填充"
                  maxlength="64"
                  show-word-limit
                  style="flex: 1"
                  readonly
                />
                <el-tooltip
                  content="数据来源：实训项目数据子类表(ODS_SXXMSJ)的归口专业号字段"
                  placement="top"
                >
                  <el-button
                    circle
                    size="small"
                    style="min-width: 24px; height: 24px"
                  >
                    <el-icon size="12"><InfoFilled /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号" prop="xh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.xh"
                  placeholder="请选择学号"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="searchStudent"
                  :loading="studentLoading"
                  style="flex: 1"
                  clearable
                  @change="handleStudentChange"
                >
                  <el-option
                    v-for="item in studentOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：学生画像数据子类表(ODS_XSHXSJ)"
                  placement="top"
                >
                  <el-button
                    circle
                    size="small"
                    style="min-width: 24px; height: 24px"
                  >
                    <el-icon size="12"><InfoFilled /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="xsxm">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input
                  v-model="form.xsxm"
                  placeholder="选择学号后自动填充"
                  maxlength="36"
                  show-word-limit
                  style="flex: 1"
                  readonly
                />
                <el-tooltip
                  content="数据来源：学生画像数据子类表(ODS_XSHXSJ)的学生姓名字段"
                  placement="top"
                >
                  <el-button
                    circle
                    size="small"
                    style="min-width: 24px; height: 24px"
                  >
                    <el-icon size="12"><InfoFilled /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生实训课时数" prop="xssxkss">
              <el-input-number
                v-model="form.xssxkss"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训结果综合评价" prop="sxjgzhpj">
              <el-input-number
                v-model="form.sxjgzhpj"
                placeholder="请输入实训结果综合评价（数字标识：平均值）"
                :min="0"
                :max="100"
                :precision="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训开始日期" prop="sxksrq">
              <el-date-picker
                v-model="form.sxksrq"
                type="date"
                placeholder="请选择实训开始日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训结束日期" prop="sxjsrq">
              <el-date-picker
                v-model="form.sxjsrq"
                type="date"
                placeholder="请选择实训结束日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
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
          <el-col :span="12">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select
                v-model="form.reportStatus"
                placeholder="请选择上报状态"
                style="width: 100%"
              >
                <el-option label="未上报" value="0" />
                <el-option label="已上报" value="1" />
                <el-option label="上报失败" value="2" />
              </el-select>
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
      <div v-else class="internship-detail">
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
          <el-descriptions-item label="实训项目编号">
            <div class="detail-value">{{ form.sxxmbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="所属专业号">
            <div class="detail-value">{{ form.sszyh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学号">
            <div class="detail-value">{{ form.xh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学生姓名">
            <div class="detail-value">{{ form.xsxm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学生实训课时数">
            <div class="detail-value">{{ form.xssxkss || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实训结果综合评价">
            <div class="detail-value">{{ form.sxjgzhpj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实训开始日期">
            <div class="detail-value">
              {{ formatDisplayDate(form.sxksrq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="实训结束日期">
            <div class="detail-value">
              {{ formatDisplayDate(form.sxjsrq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayDateTime(form.sjcjsj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusTagType(form.reportStatus || '0')"
              size="small"
            >
              {{ getReportStatusText(form.reportStatus || "0") }}
            </el-tag>
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
          <el-button @click="handleFormClose">{{
            dialogMode === "view" ? "关闭" : "取消"
          }}</el-button>
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
  InfoFilled,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getOdsSxjxgcsjPage,
  getOdsSxjxgcsjById,
  addOdsSxjxgcsj,
  updateOdsSxjxgcsj,
  deleteOdsSxjxgcsj,
  batchDeleteOdsSxjxgcsj,
  exportOdsSxjxgcsj,
  getSystemSchoolCode,
  getSxxmbhOptions,
  getStudentOptions,
  type OdsSxjxgcsjInfo,
  type OdsSxjxgcsjQuery,
  type OdsSxjxgcsjForm,
} from "@/api/meta/meta_base/zygjx/ods_sxjxgcsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsSxjxgcsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);

const dialogMode = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);

const activeTab = ref("basic");

// 实训项目编号下拉选择相关
const sxxmbhOptions = ref<
  Array<{ value: string; label: string; gkzyh: string }>
>([]);
const sxxmbhLoading = ref(false);

// 学生选择相关
const studentOptions = ref<
  Array<{ value: string; label: string; xsxm: string }>
>([]);
const studentLoading = ref(false);

// 表单引用
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<OdsSxjxgcsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  sxxmbh: "",
  sszyh: "",
  xh: "",
  xsxm: "",
  sxksrq: "",
  sxjsrq: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 100,
});

// 表单数据
const form = reactive<OdsSxjxgcsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  sxxmbh: "",
  sszyh: "",
  xh: "",
  xsxm: "",
  xssxkss: undefined,
  sxksrq: "",
  sxjsrq: "",
  sxjgzhpj: undefined,
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { required: false, message: "请输入主键数据唯一性标识", trigger: "blur" },
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
  ],
  xxdm: [{ max: 10, message: "学校代码长度不能超过10位", trigger: "blur" }],
  sxxmbh: [
    { required: true, message: "请输入实训项目编号", trigger: "blur" },
    { max: 60, message: "实训项目编号长度不能超过60位", trigger: "blur" },
  ],
  sszyh: [
    { required: true, message: "请输入所属专业号", trigger: "blur" },
    { max: 64, message: "所属专业号长度不能超过64位", trigger: "blur" },
  ],
  xh: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { max: 20, message: "学号长度不能超过20位", trigger: "blur" },
  ],
  xsxm: [
    {
      required: true,
      message: "请选择学号后自动填充学生姓名",
      trigger: "blur",
    },
    { max: 36, message: "学生姓名长度不能超过36位", trigger: "blur" },
  ],
  xssxkss: [
    { required: true, message: "请输入学生实训课时数", trigger: "blur" },
  ],
  sxksrq: [
    { required: true, message: "请选择实训开始日期", trigger: "change" },
  ],
  sxjsrq: [
    { required: true, message: "请选择实训结束日期", trigger: "change" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 计算属性
const dialogTitle = computed(() => {
  const titleMap = {
    add: "新增实习教学过程数据",
    edit: "编辑实习教学过程数据",
    view: "查看实习教学过程数据",
  };
  return titleMap[dialogMode.value];
});

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsSxjxgcsjPage(queryParams);
    console.log("API响应数据:", response);

    // 根据实际响应结构解析数据
    if (response.data && response.data.code === 200 && response.data.data) {
      dataList.value = response.data.data.records || [];
      total.value = response.data.data.total || 0;
      console.log("解析后的数据列表:", dataList.value);
      console.log("数据总数:", total.value);
    } else {
      ElMessage.error(response.data?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取实训教学过程数据列表失败:", error);
    ElMessage.error("获取数据失败");
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
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

// 分页大小改变
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

// 当前页改变
const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 选择改变
const handleSelectionChange = (selection: OdsSxjxgcsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (row: OdsSxjxgcsjInfo) => {
  console.log("行点击:", row);
};

// 行双击
const handleRowDblClick = (row: OdsSxjxgcsjInfo) => {
  handleView(row);
};

// 新增
const handleAdd = async () => {
  resetForm();
  dialogMode.value = "add";

  // 自动获取学校代码
  try {
    const response: any = await getSystemSchoolCode();
    if (response.data && response.data.code === 200 && response.data.data) {
      form.xxdm = response.data.data;
      console.log("自动获取学校代码成功:", form.xxdm);
    } else {
      console.warn("获取学校代码失败:", response.data?.message);
      ElMessage.warning("获取学校代码失败，请手动填写");
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
    ElMessage.warning("获取学校代码失败，请手动填写");
  }

  dialogVisible.value = true;
  activeTab.value = "basic";
};

// 编辑
const handleEdit = async (row: OdsSxjxgcsjInfo) => {
  try {
    const response: any = await getOdsSxjxgcsjById(row.id);
    console.log("编辑详情响应:", response);

    if (response.data && response.data.code === 200 && response.data.data) {
      const data = response.data.data;
      Object.assign(form, {
        id: data.id,
        zjsjwyxbs: data.zjsjwyxbs,
        xxdm: data.xxdm,
        sxxmbh: data.sxxmbh,
        sszyh: data.sszyh,
        xh: data.xh,
        xsxm: data.xsxm,
        xssxkss: data.xssxkss,
        sxksrq: data.sxksrq,
        sxjsrq: data.sxjsrq,
        sxjgzhpj: data.sxjgzhpj,
        sjcjsj: data.sjcjsj,
        reportStatus: data.reportStatus,
        enableStatus: data.enableStatus,
      });

      // 如果学校代码为空，自动获取
      if (!form.xxdm) {
        try {
          const schoolCodeResponse: any = await getSystemSchoolCode();
          if (
            schoolCodeResponse.data &&
            schoolCodeResponse.data.code === 200 &&
            schoolCodeResponse.data.data
          ) {
            form.xxdm = schoolCodeResponse.data.data;
            console.log("编辑时自动获取学校代码成功:", form.xxdm);
          }
        } catch (error) {
          console.warn("编辑时获取学校代码失败:", error);
        }
      }

      dialogMode.value = "edit";
      dialogVisible.value = true;
      activeTab.value = "basic";
    } else {
      ElMessage.error(response.data?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取实训教学过程数据详情失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 查看详情
const handleView = async (row: OdsSxjxgcsjInfo) => {
  try {
    const response: any = await getOdsSxjxgcsjById(row.id!);
    console.log("查看详情响应:", response);

    if (response.data && response.data.code === 200 && response.data.data) {
      const data = response.data.data;
      Object.assign(form, {
        id: data.id,
        zjsjwyxbs: data.zjsjwyxbs,
        xxdm: data.xxdm,
        sxxmbh: data.sxxmbh,
        sszyh: data.sszyh,
        xh: data.xh,
        xsxm: data.xsxm,
        xssxkss: data.xssxkss,
        sxjgzhpj: data.sxjgzhpj,
        sxksrq: data.sxksrq,
        sxjsrq: data.sxjsrq,
        sjcjsj: data.sjcjsj,
        reportStatus: data.reportStatus,
        enableStatus: data.enableStatus,
      });
      dialogMode.value = "view";
      dialogVisible.value = true;
    }
  } catch (error) {
    console.error("获取详情失败：", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsSxjxgcsjInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除实训教学过程数据"${row.xsxm}"吗？`,
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await deleteOdsSxjxgcsj(row.id);
    if (response.data && response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data?.message || "删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除实训教学过程数据失败:", error);
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
      `确定要删除选中的 ${selectedIds.value.length} 条实训教学过程数据吗？`,
      "批量删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsSxjxgcsj(selectedIds.value);
    if (response.data && response.data.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
    } else {
      ElMessage.error(response.data?.message || "批量删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除实训教学过程数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response: any = await exportOdsSxjxgcsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `实训教学过程数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出实训教学过程数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    const formData = { ...form };

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsSxjxgcsj(formData);
    } else {
      response = await updateOdsSxjxgcsj(formData);
    }

    console.log("表单提交响应:", response);

    if (response.data && response.data.code === 200) {
      ElMessage.success(`${dialogMode.value === "add" ? "新增" : "修改"}成功`);
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(
        response.data?.message ||
          `${dialogMode.value === "add" ? "新增" : "修改"}失败`,
      );
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

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    sxxmbh: "",
    sszyh: "",
    xh: "",
    xsxm: "",
    xssxkss: undefined,
    sxksrq: "",
    sxjsrq: "",
    sxjgzhpj: undefined,
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  // 清空选项
  sxxmbhOptions.value = [];
  studentOptions.value = [];
  formRef.value?.clearValidate();
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "0":
      return "info"; // 未上报
    case "1":
      return "success"; // 已上报
    case "2":
      return "danger"; // 上报失败
    default:
      return "info";
  }
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  switch (status) {
    case "0":
      return "未上报";
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return status;
  }
};

// 格式化显示日期
const formatDisplayDate = (dateStr: string | undefined) => {
  if (!dateStr) return "";
  return (
    dateStr.substring(0, 4) +
    "-" +
    dateStr.substring(4, 6) +
    "-" +
    dateStr.substring(6, 8)
  );
};

// 格式化显示日期时间
const formatDisplayDateTime = (dateTimeStr: string | undefined) => {
  if (!dateTimeStr) return "";
  return (
    dateTimeStr.substring(0, 4) +
    "-" +
    dateTimeStr.substring(4, 6) +
    "-" +
    dateTimeStr.substring(6, 8) +
    " " +
    dateTimeStr.substring(8, 10) +
    ":" +
    dateTimeStr.substring(10, 12) +
    ":" +
    dateTimeStr.substring(12, 14)
  );
};

// 搜索实训项目编号
const searchSxxmbh = async (query: string) => {
  if (sxxmbhLoading.value) return;

  sxxmbhLoading.value = true;
  try {
    const response: any = await getSxxmbhOptions(query);
    if (response.data && response.data.code === 200 && response.data.data) {
      sxxmbhOptions.value = response.data.data;
    } else {
      sxxmbhOptions.value = [];
    }
  } catch (error) {
    console.error("搜索实训项目编号失败:", error);
    sxxmbhOptions.value = [];
  } finally {
    sxxmbhLoading.value = false;
  }
};

// 初始化实训项目编号选项
const initSxxmbhOptions = async () => {
  await searchSxxmbh("");
};

// 处理实训项目编号变化，自动填充所属专业号
const handleSxxmbhChange = (value: string) => {
  if (value) {
    const selectedOption = sxxmbhOptions.value.find(
      (option) => option.value === value,
    );
    if (selectedOption && selectedOption.gkzyh) {
      form.sszyh = selectedOption.gkzyh;
    }
  } else {
    // 清空时也清空所属专业号
    form.sszyh = "";
  }
};

// 搜索学生
const searchStudent = async (query: string) => {
  if (studentLoading.value) return;

  studentLoading.value = true;
  try {
    const response: any = await getStudentOptions(query);
    if (response.data && response.data.code === 200 && response.data.data) {
      studentOptions.value = response.data.data;
    } else {
      studentOptions.value = [];
    }
  } catch (error) {
    console.error("搜索学生失败:", error);
    studentOptions.value = [];
  } finally {
    studentLoading.value = false;
  }
};

// 初始化学生选项
const initStudentOptions = async () => {
  await searchStudent("");
};

// 处理学号变化，自动填充学生姓名
const handleStudentChange = (value: string) => {
  if (value) {
    const selectedOption = studentOptions.value.find(
      (option) => option.value === value,
    );
    if (selectedOption && selectedOption.xsxm) {
      form.xsxm = selectedOption.xsxm;
    }
  } else {
    // 清空时也清空学生姓名
    form.xsxm = "";
  }
};

// 组件挂载
onMounted(() => {
  getList();
  initSxxmbhOptions();
  initStudentOptions();
});
</script>

<style scoped>
/* 页面容器样式 */
.internship-teaching-management {
  padding: 0;
  margin: 0;
}

/* 搜索卡片样式 */
.search-card {
  margin-bottom: 0px;
  border-radius: 0px;
}

/* 搜索卡片特殊样式 */
.search-card :deep(.el-card__body) {
  padding: 16px 20px;
}

.search-bar {
  .el-form {
    margin: 0;

    .el-form-item {
      margin-bottom: 0;
      margin-right: 20px;

      .el-form-item__label {
        font-weight: 500;
        color: #606266;
      }

      .el-input {
        width: 200px;
      }
    }
  }
}

/* 表格卡片样式 */
.table-card {
  margin-top: -10px;
  border-radius: 8px;
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
.internship-dialog {
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
.internship-detail {
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
    padding: 16px;
  }
}
</style>
