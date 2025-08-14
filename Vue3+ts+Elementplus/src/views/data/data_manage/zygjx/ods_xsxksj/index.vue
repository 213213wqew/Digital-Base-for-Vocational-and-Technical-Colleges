<template>
  <div class="student-course-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="学号" prop="xh">
            <el-input
              v-model="queryParams.xh"
              placeholder="请输入学号"
              clearable
            />
          </el-form-item>
          <el-form-item label="课程名称" prop="kcmc">
            <el-input
              v-model="queryParams.kcmc"
              placeholder="请输入课程名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="开课学年度" prop="kkxnd">
            <el-input
              v-model="queryParams.kkxnd"
              placeholder="请输入开课学年度"
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
        <div class="header-title">学生选课数据数据清洗</div>
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
            prop="xh"
            label="学号"
            min-width="140"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="kch"
            label="课程号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="kcmc"
            label="课程名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="kkxnd"
            label="开课学年度"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="kkxqmText"
            label="开课学期"
            width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="xksjDisplay"
            label="选课时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="xkxzmText"
            label="选课性质"
            width="100"
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
          <el-table-column
            prop="reportStatus"
            label="上报状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
                @click="handleReportStatusClick(row)"
                style="cursor: pointer"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="enableStatus"
            label="启用状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-switch
                v-model="row.enableStatus"
                active-value="1"
                inactive-value="0"
                @change="handleEnableStatusChange(row)"
                :loading="row.statusLoading"
              />
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
      :title="dialogType === 'add' ? '新增学生选课数据' : '编辑学生选课数据'"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 500px"
      class="student-course-dialog"
      destroy-on-close
    >
      <el-form
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
                placeholder="可选填，为空时系统自动生成32位全局唯一编码"
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
            <el-form-item label="学号" prop="xh">
              <el-input
                v-model="form.xh"
                placeholder="请输入学号"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划课程号" prop="jhkch">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.jhkch"
                  placeholder="学校自编"
                  style="flex: 1"
                  filterable
                  remote
                  :remote-method="handleJhkchSearch"
                  :loading="jhkchLoading"
                  clearable
                  @change="handleJhkchChange"
                >
                  <el-option
                    v-for="option in jhkchOptions"
                    :key="option.value"
                    :label="`${option.jhkch} - ${option.kcmc}`"
                    :value="option.jhkch"
                  />
                </el-select>
                <el-tooltip content="DS_PKSJ 排课数据子类表" placement="top">
                  <el-icon style="color: #e6a23c; cursor: help">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程号" prop="kch">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.kch"
                  placeholder="学校自编"
                  style="flex: 1"
                  filterable
                  remote
                  :remote-method="handleCourseSearch"
                  :loading="courseLoading"
                  clearable
                  @change="handleCourseChange"
                >
                  <el-option
                    v-for="option in courseOptions"
                    :key="option.id"
                    :label="`${option.kch} - ${option.kcmc}`"
                    :value="option.kch"
                  />
                </el-select>
                <el-tooltip
                  content="ZYGJX0101 课程基本数据子类"
                  placement="top"
                >
                  <el-icon style="color: #e6a23c; cursor: help">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="kcmc">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.kcmc"
                  placeholder="课程名称"
                  style="flex: 1"
                  filterable
                  remote
                  :remote-method="handleCourseNameSearch"
                  :loading="courseLoading"
                  clearable
                  @change="handleCourseNameChange"
                >
                  <el-option
                    v-for="option in courseOptions"
                    :key="option.id"
                    :label="`${option.kcmc} - ${option.kch}`"
                    :value="option.kcmc"
                  />
                </el-select>
                <el-tooltip
                  content="ZYGJX0101 课程基本数据子类"
                  placement="top"
                >
                  <el-icon style="color: #e6a23c; cursor: help">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开课学年度" prop="kkxnd">
              <el-input
                v-model="form.kkxnd"
                placeholder="格式：YYYY-YYYY，如：2001-2002"
                maxlength="9"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开课学期" prop="kkxqm">
              <el-select
                v-model="form.kkxqm"
                placeholder="请选择开课学期"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="option in xqOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选课时间" prop="xksj">
              <el-date-picker
                v-model="form.xksj"
                type="datetime"
                placeholder="格式：YYYYMMDD hhmmss"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选课性质" prop="xkxzm">
              <el-select
                v-model="form.xkxzm"
                placeholder="请选择选课性质"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="option in kcxzOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
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

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
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
      title="查看学生选课数据"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
    >
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主键数据唯一性标识">{{
            currentRecord.zjsjwyxbs || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{
            currentRecord.xxdm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{
            currentRecord.xh || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="计划课程号">{{
            currentRecord.jhkch || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="课程号">{{
            currentRecord.kch || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="课程名称">{{
            currentRecord.kcmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="开课学年度">{{
            currentRecord.kkxnd || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="开课学期">{{
            getKkxqmText(currentRecord.kkxqm) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="选课时间">{{
            formatDisplayTime(currentRecord.xksj) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="选课性质">{{
            getXkxzmText(currentRecord.xkxzm) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{
            formatDisplayTime(currentRecord.sjcjsj) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusTagType(currentRecord.reportStatus)"
              size="small"
            >
              {{ getReportStatusText(currentRecord.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="currentRecord.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ currentRecord.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDateTime(currentRecord.createTime) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            formatDateTime(currentRecord.updateTime) || "-"
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="viewDialogVisible = false"
            >取消</el-button
          >
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
  InfoFilled,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsXsxksjPage,
  getOdsXsxksjById,
  addOdsXsxksj,
  updateOdsXsxksj,
  deleteOdsXsxksj,
  batchDeleteOdsXsxksj,
  exportOdsXsxksj,
  updateSingleReportStatus,
  updateSingleEnableStatus,
  getDictKcxzOptions,
  getDictXqOptions,
  getSystemSchoolCode,
  searchCourseOptions,
  getJhkchOptions,
  type OdsXsxksjInfo,
  type OdsXsxksjQuery,
  type OdsXsxksjForm,
  type DictOption,
  type CourseOption,
  type JhkchOption,
} from "@/api-data/data/data_base/zygjx/ods_xsxksj";

// 响应式数据
const loading = ref(false);
const total = ref(0);
const dataList = ref<OdsXsxksjInfo[]>([]);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const submitLoading = ref(false);
const activeTab = ref("basic");
const currentRecord = ref<OdsXsxksjInfo | null>(null);
// 字典数据
const kcxzOptions = ref<DictOption[]>([]);
const xqOptions = ref<DictOption[]>([]);
// 课程选项数据
const courseOptions = ref<CourseOption[]>([]);
const courseLoading = ref(false);
// 计划课程号选项数据
const jhkchOptions = ref<JhkchOption[]>([]);
const jhkchLoading = ref(false);

// 表单引用
const queryForm = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<OdsXsxksjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  kcmc: "",
  kkxnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单数据
const form = reactive<OdsXsxksjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  jhkch: "",
  kch: "",
  kcmc: "",
  kkxnd: "",
  kkxqm: "",
  xksj: "",
  xkxzm: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { len: 32, message: "主键数据唯一性标识必须为32位", trigger: "blur" },
    {
      pattern: /^[A-Z0-9]{32}$/,
      message: "格式错误，需32位大写字母+数字组合",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码必填", trigger: "blur" },
    { len: 10, message: "学校代码必须为10位数字", trigger: "blur" },
    {
      pattern: /^\d{10}$/,
      message: "学校代码格式错误，需10位数字",
      trigger: "blur",
    },
  ],
  xh: [
    { required: true, message: "学号必填", trigger: "blur" },
    { max: 20, message: "学号长度不能超过20位", trigger: "blur" },
  ],
  jhkch: [
    { required: true, message: "计划课程号必填", trigger: "blur" },
    { max: 50, message: "计划课程号长度不能超过50位", trigger: "blur" },
  ],
  kch: [
    { required: true, message: "课程号必填", trigger: "blur" },
    { max: 50, message: "课程号长度不能超过50位", trigger: "blur" },
  ],
  kcmc: [
    { required: true, message: "课程名称必填", trigger: "blur" },
    { max: 60, message: "课程名称长度不能超过60位", trigger: "blur" },
  ],
  kkxnd: [
    { required: true, message: "开课学年度必填", trigger: "blur" },
    { len: 9, message: "开课学年度必须为9位", trigger: "blur" },
    {
      pattern: /^\d{4}-\d{4}$/,
      message: "格式错误，如：2023-2024",
      trigger: "blur",
    },
  ],
  kkxqm: [{ required: true, message: "开课学期码必填", trigger: "change" }],
  xksj: [
    { required: true, message: "选课时间必填", trigger: "change" },
    { len: 15, message: "选课时间格式：YYYYMMDD hhmmss", trigger: "change" },
    {
      pattern: /^\d{8} \d{6}$/,
      message: "格式错误，如：20240412 141503",
      trigger: "change",
    },
  ],
  xkxzm: [
    { required: true, message: "选课性质码必填", trigger: "change" },
    { len: 1, message: "选课性质码必须为1位", trigger: "change" },
  ],
  sjcjsj: [
    { required: true, message: "数据采集时间必填", trigger: "change" },
    {
      len: 15,
      message: "数据采集时间格式：YYYYMMDD hhmmss",
      trigger: "change",
    },
    {
      pattern: /^\d{8} \d{6}$/,
      message: "格式错误，如：20240412 141503",
      trigger: "change",
    },
  ],
});

// 页面加载时获取数据
onMounted(() => {
  getList();
  getDictData();
});

// 获取字典数据
const getDictData = async () => {
  try {
    const [kcxzResponse, xqResponse, schoolCodeResponse] = (await Promise.all([
      getDictKcxzOptions(),
      getDictXqOptions(),
      getSystemSchoolCode(),
    ])) as any;

    if (kcxzResponse.data?.code === 200) {
      kcxzOptions.value = kcxzResponse.data.data || [];
    }

    if (xqResponse.data?.code === 200) {
      xqOptions.value = xqResponse.data.data || [];
    }

    // 获取学校代码并设置到表单中
    if (schoolCodeResponse.data?.code === 200) {
      form.xxdm = schoolCodeResponse.data.data || "";
    }
  } catch (error) {
    console.error("获取字典数据失败:", error);
  }
};

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = (await getOdsXsxksjPage(queryParams)) as any;
    if (response.data?.code === 200) {
      dataList.value = response.data.data.records || [];
      total.value = response.data.data.total || 0;
    } else {
      ElMessage.error(response.data?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取学生选课数据失败:", error);
    ElMessage.error("获取数据失败，请重试");
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
  queryForm.value?.resetFields();
  queryParams.pageNum = 1;
  queryParams.pageSize = 20;
  getList();
};

// 新增
const handleAdd = async () => {
  resetForm();
  dialogType.value = "add";
  dialogVisible.value = true;
  activeTab.value = "basic";

  // 自动获取并填入学校代码
  try {
    const response = (await getSystemSchoolCode()) as any;
    if (response.data?.code === 200) {
      form.xxdm = response.data.data || "";
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
  }
};

// 编辑
const handleEdit = async (row: OdsXsxksjInfo) => {
  try {
    const response = (await getOdsXsxksjById(row.id)) as any;
    if (response.data?.code === 200) {
      Object.assign(form, response.data.data);
      dialogType.value = "edit";
      dialogVisible.value = true;
      activeTab.value = "basic";
    } else {
      ElMessage.error(response.data?.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生选课数据详情失败:", error);
    ElMessage.error("获取详情失败，请重试");
  }
};

// 查看详情
const handleView = async (row: OdsXsxksjInfo) => {
  try {
    const response = (await getOdsXsxksjById(row.id)) as any;
    if (response.data?.code === 200) {
      currentRecord.value = response.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(response.data?.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生选课数据详情失败:", error);
    ElMessage.error("获取详情失败，请重试");
  }
};

// 删除
const handleDelete = (row: OdsXsxksjInfo) => {
  ElMessageBox.confirm(
    `确定要删除学生选课数据"${row.kcmc || row.xh}"吗？`,
    "确认删除",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(async () => {
    try {
      const response = (await deleteOdsXsxksj(row.id)) as any;
      if (response.data?.code === 200) {
        ElMessage.success("删除成功");
        getList();
      } else {
        ElMessage.error(response.data?.message || "删除失败");
      }
    } catch (error) {
      console.error("删除学生选课数据失败:", error);
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
    `确定要删除选中的 ${selectedIds.value.length} 条学生选课数据吗？`,
    "确认批量删除",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(async () => {
    try {
      const response = (await batchDeleteOdsXsxksj(selectedIds.value)) as any;
      if (response.data?.code === 200) {
        ElMessage.success("批量删除成功");
        selectedIds.value = [];
        getList();
      } else {
        ElMessage.error(response.data?.message || "批量删除失败");
      }
    } catch (error) {
      console.error("批量删除学生选课数据失败:", error);
      ElMessage.error("批量删除失败，请重试");
    }
  });
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = (await exportOdsXsxksj(queryParams)) as any;

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `学生选课数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出学生选课数据失败:", error);
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
        if (dialogType.value === "add") {
          response = (await addOdsXsxksj(form)) as any;
        } else {
          response = (await updateOdsXsxksj(form)) as any;
        }

        if (response.data?.code === 200) {
          ElMessage.success(
            dialogType.value === "add" ? "新增成功" : "修改成功",
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
  form.xh = "";
  form.jhkch = "";
  form.kch = "";
  form.kcmc = "";
  form.kkxnd = "";
  form.kkxqm = "";
  form.xksj = "";
  form.xkxzm = "";
  form.sjcjsj = "";
  form.reportStatus = "0";
  form.enableStatus = "1";
  formRef.value?.clearValidate();
};

// 选择变化
const handleSelectionChange = (selection: OdsXsxksjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (_row: OdsXsxksjInfo) => {
  // 行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsXsxksjInfo) => {
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
const handleReportStatusClick = (row: OdsXsxksjInfo) => {
  const statusMap = { "0": "1", "1": "2", "2": "0" };
  const newStatus =
    statusMap[row.reportStatus as keyof typeof statusMap] || "0";
  updateReportStatus(row.id, newStatus);
};

// 启用状态变化
const handleEnableStatusChange = (row: OdsXsxksjInfo) => {
  updateEnableStatus(row.id, row.enableStatus);
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

// 更新启用状态
const updateEnableStatus = async (id: number, status: string) => {
  try {
    const response = (await updateSingleEnableStatus(id, status)) as any;
    if (response.data && response.data.code === 200) {
      ElMessage.success("状态更新成功");
    } else {
      ElMessage.error(response.data?.message || "状态更新失败");
      getList(); // 刷新以恢复原状态
    }
  } catch (error) {
    console.error("更新启用状态失败:", error);
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
    "0": "info",
    "1": "success",
    "2": "danger",
  };
  return typeMap[status] || "info";
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  const textMap = { "0": "未上报", "1": "已上报", "2": "上报失败" };
  return textMap[status as keyof typeof textMap] || "未知";
};

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// 格式化显示时间（用于选课时间和数据采集时间）
const formatDisplayTime = (timeStr: string) => {
  if (!timeStr || timeStr.length < 14) return timeStr || "-";

  // 处理格式 YYYYMMDD HHmmss 或 YYYYMMDDHHmmss
  let cleanTime = timeStr.replace(/\s+/g, ""); // 移除空格
  if (cleanTime.length >= 14) {
    const year = cleanTime.substring(0, 4);
    const month = cleanTime.substring(4, 6);
    const day = cleanTime.substring(6, 8);
    const hour = cleanTime.substring(8, 10);
    const minute = cleanTime.substring(10, 12);
    const second = cleanTime.substring(12, 14);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  return timeStr;
};

// 获取开课学期文本
const getKkxqmText = (kkxqm: string) => {
  const option = xqOptions.value.find((item) => item.value === kkxqm);
  return option?.label || kkxqm || "-";
};

// 获取选课性质文本
const getXkxzmText = (xkxzm: string) => {
  const option = kcxzOptions.value.find((item) => item.value === xkxzm);
  return option?.label || xkxzm || "-";
};

// 课程搜索处理
const handleCourseSearch = async (query: string) => {
  if (!query || query.length < 1) {
    courseOptions.value = [];
    return;
  }

  courseLoading.value = true;
  try {
    const response = (await searchCourseOptions(query, 50)) as any;
    if (response.data?.code === 200 && response.data?.data) {
      courseOptions.value = response.data.data;
    } else {
      courseOptions.value = [];
    }
  } catch (error) {
    console.error("搜索课程失败:", error);
    courseOptions.value = [];
  } finally {
    courseLoading.value = false;
  }
};

// 课程选择变化处理
const handleCourseChange = (value: string) => {
  if (value) {
    const selectedCourse = courseOptions.value.find(
      (item) => item.kch === value,
    );
    if (selectedCourse) {
      form.kcmc = selectedCourse.kcmc;
    }
  } else {
    form.kcmc = "";
  }
};

// 课程名称搜索处理
const handleCourseNameSearch = async (query: string) => {
  if (!query || query.length < 1) {
    courseOptions.value = [];
    return;
  }

  courseLoading.value = true;
  try {
    const response = (await searchCourseOptions(query, 50)) as any;
    if (response.data?.code === 200 && response.data?.data) {
      courseOptions.value = response.data.data;
    } else {
      courseOptions.value = [];
    }
  } catch (error) {
    console.error("搜索课程失败:", error);
    courseOptions.value = [];
  } finally {
    courseLoading.value = false;
  }
};

// 课程名称选择变化处理
const handleCourseNameChange = (value: string) => {
  if (value) {
    const selectedCourse = courseOptions.value.find(
      (item) => item.kcmc === value,
    );
    if (selectedCourse) {
      form.kch = selectedCourse.kch;
    }
  } else {
    form.kch = "";
  }
};

// 计划课程号搜索处理
const handleJhkchSearch = async (query: string) => {
  if (!query || query.length < 1) {
    jhkchOptions.value = [];
    return;
  }

  jhkchLoading.value = true;
  try {
    const response = (await getJhkchOptions(query)) as any;
    if (response.data?.code === 200 && response.data?.data) {
      jhkchOptions.value = response.data.data;
    } else {
      jhkchOptions.value = [];
    }
  } catch (error) {
    console.error("搜索计划课程号失败:", error);
    jhkchOptions.value = [];
  } finally {
    jhkchLoading.value = false;
  }
};

// 计划课程号选择变化处理
const handleJhkchChange = (value: string) => {
  if (value) {
    const selectedJhkch = jhkchOptions.value.find(
      (item) => item.jhkch === value,
    );
    if (selectedJhkch) {
      // 如果课程名称为空，自动填入
      if (!form.kcmc) {
        form.kcmc = selectedJhkch.kcmc;
      }
    }
  }
};
</script>

<style scoped>
.student-course-management {
  padding: 0px;
}

.search-card {
  height: 60px;
  margin-bottom: 0px;
}

.search-bar {
  .el-form-item {
    margin-bottom: 0px;
  }
}

.table-card {
  margin-top: -10px;
  margin-bottom: 20px;
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
.student-course-dialog {
  :deep(.el-dialog__body) {
    padding: 16px 20px;
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 20px 16px;
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
.student-course-detail {
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
      padding: 8px 12px;
    }

    :deep(.el-descriptions__table) {
      margin-bottom: 0;
    }

    :deep(.el-descriptions-item__cell) {
      padding: 6px 0;
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
