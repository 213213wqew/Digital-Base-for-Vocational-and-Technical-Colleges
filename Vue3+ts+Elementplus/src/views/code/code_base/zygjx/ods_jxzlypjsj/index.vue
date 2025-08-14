<template>
  <div class="teaching-quality-evaluation-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="课程名称" prop="kcmc">
            <el-input
              v-model="queryParams.kcmc"
              placeholder="请输入课程名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="课程号" prop="kch">
            <el-input
              v-model="queryParams.kch"
              placeholder="请输入课程号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="学年" prop="xn">
            <el-input
              v-model="queryParams.xn"
              placeholder="请输入学年"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item> -->
          <!-- <el-form-item label="学期" prop="xqm">
            <el-select
              v-model="queryParams.xqm"
              placeholder="请选择学期"
              clearable
              filterable
            >
              <el-option
                v-for="item in semesterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="工号" prop="gh">
            <el-input
              v-model="queryParams.gh"
              placeholder="请输入工号"
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
        <div class="header-title">教学质量与评价数据编码管理</div>
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
            prop="xn"
            label="学年"
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xqmText"
            label="学期"
            min-width="100"
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
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="gh"
            label="工号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="kczlpj"
            label="质量评价"
            min-width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="cpxss"
            label="参评学生数"
            min-width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="pjwcrqDisplay"
            label="评价完成日期"
            min-width="120"
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
                  @click="handleUpdate(row)"
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
      style="height: 590px"
      class="teaching-dialog"
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
                style="text-transform: uppercase"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input
                  v-model="form.xxdm"
                  placeholder="自动获取学校代码"
                  maxlength="10"
                  show-word-limit
                  style="flex: 1"
                  :readonly="dialogMode === 'add'"
                />
                <el-tooltip
                  content="新增时自动获取系统配置的学校代码"
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
            <el-form-item label="学年（度）" prop="xn">
              <el-input
                v-model="form.xn"
                placeholder="请输入学年，如：2023-2024"
                maxlength="9"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学期" prop="xqm">
              <el-select
                v-model="form.xqm"
                placeholder="请选择学期"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in semesterOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程信息" prop="jhkch">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.jhkch"
                  placeholder="请选择课程"
                  clearable
                  filterable
                  remote
                  :remote-method="searchCourseOptions"
                  :loading="courseLoading"
                  @change="handleCourseSelect"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in courseOptions"
                    :key="item.jhkch"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span>{{ item.jhkch }} - {{ item.kcmc }}</span>
                    <span class="option-extra">{{ item.jgh }}</span>
                  </el-option>
                </el-select>
                <el-tooltip content="数据来源于排课数据子类表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程号" prop="kch">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input v-model="form.kch" placeholder="自动填充" disabled />
                <el-tooltip content="数据来源于排课数据子类表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="kcmc">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input v-model="form.kcmc" placeholder="自动填充" disabled />
                <el-tooltip content="数据来源于排课数据子类表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="gh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input v-model="form.gh" placeholder="自动填充" disabled />
                <el-tooltip content="数据来源于排课数据子类表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程质量评价" prop="kczlpj">
              <el-input-number
                v-model="form.kczlpj"
                :min="0"
                :max="100"
                placeholder="请输入质量评价分数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参评学生数" prop="cpxss">
              <el-input-number
                v-model="form.cpxss"
                :min="0"
                placeholder="请输入参评学生数量"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评价完成日期" prop="pjwcrq">
              <el-date-picker
                v-model="form.pjwcrq"
                type="date"
                placeholder="请选择评价完成日期"
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
      <div v-else class="teaching-detail">
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
          <el-descriptions-item label="学年（度）">
            <div class="detail-value">{{ form.xn || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学期">
            <div class="detail-value">
              {{ getSemesterText(form.xqm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="计划课程号">
            <div class="detail-value">{{ form.jhkch || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="课程号">
            <div class="detail-value">{{ form.kch || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="课程名称">
            <div class="detail-value">{{ form.kcmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="工号">
            <div class="detail-value">{{ form.gh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="课程质量评价">
            <div class="detail-value">{{ form.kczlpj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="参评学生数">
            <div class="detail-value">{{ form.cpxss || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="评价完成日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.pjwcrq) || "-" }}
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
          <el-descriptions-item label="备注" :span="2">
            <div class="detail-value">{{ form.bz || "-" }}</div>
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
            @click="handleSubmit"
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
  Warning,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getOdsJxzlypjsjPage,
  getOdsJxzlypjsjById,
  getByUniqueId,
  addOdsJxzlypjsj,
  updateOdsJxzlypjsj,
  deleteOdsJxzlypjsj,
  batchDeleteOdsJxzlypjsj,
  getSystemSchoolCode,
  exportOdsJxzlypjsj,
  getCourseOptions,
  updateSingleReportStatus,
  updateSingleEnableStatus,
  getSemesterOptions,
  type OdsJxzlypjsjInfo,
  type OdsJxzlypjsjQuery,
  type OdsJxzlypjsjForm,
  type DictOption,
} from "@/api-code/code/code_base/zygjx/ods_jxzlypjsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsJxzlypjsjInfo[]>([]);
const total = ref(0);
const selectedRows = ref<OdsJxzlypjsjInfo[]>([]);
const selectedIds = ref<number[]>([]);
const multiple = ref(false);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);

// 表单引用
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 字典选项
const semesterOptions = ref<DictOption[]>([]);
const systemSchoolCode = ref("");

// 课程选项
const courseOptions = ref<any[]>([]);
const courseLoading = ref(false);

// 搜索课程选项
const searchCourseOptions = async (keyword: string) => {
  if (!keyword) {
    courseOptions.value = [];
    return;
  }
  courseLoading.value = true;
  try {
    const response = await getCourseOptions(keyword) as any;
    if (response.data.code === 200) {
      courseOptions.value = response.data.data;
    }
  } catch (error) {
    console.error("获取课程选项失败:", error);
    ElMessage.error("获取课程选项失败");
  } finally {
    courseLoading.value = false;
  }
};

// 处理课程选择
const handleCourseSelect = (value: string) => {
  const course = courseOptions.value.find((item) => item.value === value);
  if (course) {
    form.kch = course.kch || "";
    form.kcmc = course.kcmc || "";
    form.gh = course.jgh || "";
  } else {
    form.kch = "";
    form.kcmc = "";
    form.gh = "";
  }
};

// 计算属性
const dialogTitle = computed(() => {
  const titles = {
    add: "新增教学质量与评价数据",
    edit: "编辑教学质量与评价数据",
    view: "查看教学质量与评价数据",
  };
  return titles[dialogMode.value];
});

// 查询参数
const queryParams = reactive<OdsJxzlypjsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xn: "",
  xqm: "",
  jhkch: "",
  kch: "",
  kcmc: "",
  gh: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 100,
});

// 表单数据
const form = reactive<OdsJxzlypjsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  xn: "",
  xqm: "",
  jhkch: "",
  kch: "",
  kcmc: "",
  gh: "",
  kczlpj: undefined,
  cpxss: undefined,
  pjwcrq: "",
  sjcjsj: "",
  bz: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 获取系统学校代码
const loadSystemSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode() as any;
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      // 设置查询参数的学校代码
      queryParams.xxdm = systemSchoolCode.value;
    } else {
      ElMessage.warning("获取学校代码失败：" + response.data.message);
    }
  } catch (error) {
    console.error("获取学校代码出错：", error);
    ElMessage.error("获取学校代码失败，请稍后重试");
  }
};

// 获取数据列表
const getList = async () => {
  loading.value = true;
  try {
    const { data }: any = await getOdsJxzlypjsjPage(queryParams);
    dataList.value = data.data.records || [];
    total.value = data.data.total || 0;
  } catch (error) {
    console.error("获取数据失败:", error);
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

// 重置查询
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

// 多选变化
const handleSelectionChange = (selection: OdsJxzlypjsjInfo[]) => {
  selectedRows.value = selection;
  selectedIds.value = selection.map((row) => row.id);
  multiple.value = selection.length > 0;
};

// 行点击事件
const handleRowClick = () => {
  // 行点击逻辑
};

// 行双击事件
const handleRowDblClick = (row: OdsJxzlypjsjInfo) => {
  handleView(row);
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: string | undefined) => {
  switch (status) {
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "warning";
  }
};

// 获取上报状态文本
const getReportStatusText = (status: string | undefined) => {
  switch (status) {
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return "未上报";
  }
};

// 获取学期文本
const getSemesterText = (value: string | undefined) => {
  const option = semesterOptions.value.find((item) => item.value === value);
  return option ? option.label : "-";
};

// 格式化显示时间
const formatDisplayTime = (time: string | undefined) => {
  if (!time) return "-";

  // YYYYMMDD 格式（日期）
  if (time.length === 8) {
    return `${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)}`;
  }

  // YYYYMMDD HHmmss 格式（带空格的日期时间）
  if (time.length === 15 && time.includes(" ")) {
    const [datePart, timePart] = time.split(" ");
    if (datePart.length === 8 && timePart.length === 6) {
      const year = datePart.substring(0, 4);
      const month = datePart.substring(4, 6);
      const day = datePart.substring(6, 8);
      const hour = timePart.substring(0, 2);
      const minute = timePart.substring(2, 4);
      const second = timePart.substring(4, 6);
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
  }

  // YYYYMMDDHHmmss 格式（无空格，兼容处理）
  if (time.length === 14) {
    return `${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)} ${time.substring(8, 10)}:${time.substring(10, 12)}:${time.substring(12, 14)}`;
  }

  return time;
};

// 页面大小变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 加载字典数据
const loadDictData = async () => {
  try {
    // 加载学期选项
    const semesterRes = await getSemesterOptions() as any;
    if (semesterRes.data.code === 200) {
      semesterOptions.value = semesterRes.data.data || [];
    }
  } catch (error) {
    console.error("加载字典数据失败:", error);
  }
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  // 重置后设置默认值
  form.xxdm = systemSchoolCode.value;
  form.reportStatus = "0";
  form.enableStatus = "1";
};

// 新增
const handleAdd = () => {
  resetForm(formRef.value);
  dialogMode.value = "add";
  dialogVisible.value = true;
  // 设置学校代码
  form.xxdm = systemSchoolCode.value;
};

// 编辑
const handleUpdate = (row: OdsJxzlypjsjInfo) => {
  resetForm(formRef.value);
  Object.assign(form, row);
  dialogMode.value = "edit";
  dialogVisible.value = true;
};

// 查看
const handleView = (row: OdsJxzlypjsjInfo) => {
  resetForm(formRef.value);
  Object.assign(form, row);
  dialogMode.value = "view";
  dialogVisible.value = true;
};

// 删除
const handleDelete = (row: OdsJxzlypjsjInfo) => {
  ElMessageBox.confirm(`确定要删除"${row.zjsjwyxbs}"这条数据吗？`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await deleteOdsJxzlypjsj(row.id);
      ElMessage.success("删除成功");
      getList();
    } catch (error) {
      ElMessage.error("删除失败");
    }
  });
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请先选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 条数据吗？`,
    "批量删除确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(async () => {
    try {
      const ids = selectedRows.value.map((row) => row.id);
      await batchDeleteOdsJxzlypjsj(ids);
      ElMessage.success("批量删除成功");
      getList();
    } catch (error) {
      ElMessage.error("批量删除失败");
    }
  });
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsJxzlypjsj(queryParams) as any;

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `教学质量与评价数据_${new Date().getTime()}.xlsx`;
    link.click();

    // 清理
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败，请稍后重试");
  }
};

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;

    try {
      if (dialogMode.value === "add") {
        await addOdsJxzlypjsj(form);
        ElMessage.success("新增成功");
      } else {
        await updateOdsJxzlypjsj(form);
        ElMessage.success("修改成功");
      }

      dialogVisible.value = false;
      getList();
    } catch (error) {
      ElMessage.error(`${dialogMode.value === "add" ? "新增" : "修改"}失败`);
    }
  });
};

// 页面加载时获取数据
onMounted(() => {
  loadDictData();
  loadSystemSchoolCode();
  getList();
});
</script>

<style scoped>
/* 主容器样式 */
.teaching-quality-evaluation-management {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 搜索卡片样式 */
.search-card {
  height: 60px;
  flex-shrink: 0;
}

.search-bar {
  margin-top: -5px;
}

/* 表格卡片样式 */
.table-card {
  margin-top: -28px;
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);

  :deep(.el-card__body) {
    padding: 0;
  }
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
.teaching-dialog {
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
.teaching-detail {
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

/* 选项额外信息样式 */
:deep(.el-select-dropdown__item) {
  .option-extra {
    float: right;
    color: #999;
    font-size: 13px;
    margin-left: 12px;
  }
}

/* 卡片样式 */
:deep(.el-card) {
  .el-card__body {
    padding: 20px;
  }
}
</style>
