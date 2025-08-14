<template>
  <div class="portrait-evaluation-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="学号" prop="xh">
            <el-input
              v-model="queryParams.xh"
              placeholder="请输入学号"
              clearable
            />
          </el-form-item>
          <el-form-item label="" prop="pjwdywmc">
            <el-input
              v-model="queryParams.pjwdywmc"
              placeholder="请输入评价维度英文名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="一级指标中文名称" prop="pjwdyjzbzwmc">
            <el-input
              v-model="queryParams.pjwdyjzbzwmc"
              placeholder="请输入一级指标中文名称"
              clearable
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
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">学生画像评价维度描述数据子类表</div>
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
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="pjwdyjzbywmc"
            label="一级指标英文名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="pjwdyjzbzwmc"
            label="一级指标中文名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="pjwdywmc"
            label="维度英文名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="pjwdzwms"
            label="维度中文描述"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="pjwdjgms"
            label="维度结果描述"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sjcjsj"
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
      width="900px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 600px"
      class="portrait-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="160px"
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
              <el-input
                v-model="form.xxdm"
                placeholder="系统自动获取学校代码"
                maxlength="10"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号" prop="xh">
              <div style="display: flex; align-items: center; width: 100%">
              <el-select
                v-model="form.xh"
                filterable
                remote
                :remote-method="remoteMethodXh"
                :loading="studentLoading"
                placeholder="请输入学号搜索"
                @change="handleXhChange"
                clearable
              >
                <el-option
                  v-for="item in studentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-tooltip
                    content="学号数据来源于学生信息数据子类表"
                    placement="top"
                  >
                    <el-icon
                      style="margin-left: 8px; cursor: help; color: #e6a23c"
                      ><InfoFilled
                    /></el-icon>
                  </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="一级指标英文名称" prop="pjwdyjzbywmc">
              <el-input
                v-model="form.pjwdyjzbywmc"
                placeholder="请输入评价维度一级指标英文名称"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一级指标中文名称" prop="pjwdyjzbzwmc">
              <el-input
                v-model="form.pjwdyjzbzwmc"
                placeholder="请输入评价维度一级指标中文名称"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维度英文名称" prop="pjwdywmc">
              <el-input
                v-model="form.pjwdywmc"
                placeholder="请输入评价维度英文名称"
                maxlength="150"
                show-word-limit
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
          
          <el-col :span="24">
            <el-form-item label="维度中文描述" prop="pjwdzwms">
              <el-input
                v-model="form.pjwdzwms"
                type="textarea"
                :rows="3"
                placeholder="请输入评价维度中文描述（必填，最多300字符）"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="维度结果描述" prop="pjwdjgms">
              <el-input
                v-model="form.pjwdjgms"
                type="textarea"
                :rows="3"
                placeholder="请输入评价维度结果描述（必填，最多300字符）"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="portrait-detail">
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
          <el-descriptions-item label="学号">
            <div class="detail-value">{{ form.xh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjcjsj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="一级指标英文名称">
            <div class="detail-value">{{ form.pjwdyjzbywmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="一级指标中文名称">
            <div class="detail-value">{{ form.pjwdyjzbzwmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="维度英文名称">
            <div class="detail-value">{{ form.pjwdywmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="form.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="维度中文描述" :span="2">
            <div class="detail-value">{{ form.pjwdzwms || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="维度结果描述" :span="2">
            <div class="detail-value">{{ form.pjwdjgms || "-" }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose">取消</el-button>
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
import { ref, reactive, onMounted, computed, nextTick } from "vue";
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
  getOdsXxhxpjwdmssjPage,
  getOdsXxhxpjwdmssjById,
  addOdsXxhxpjwdmssj,
  updateOdsXxhxpjwdmssj,
  deleteOdsXxhxpjwdmssj,
  batchDeleteOdsXxhxpjwdmssj,
  exportOdsXxhxpjwdmssj,
  getSystemSchoolCode,
  getStudentOptions,
  type OdsXxhxpjwdmssjInfo,
  type OdsXxhxpjwdmssjQuery,
  type OdsXxhxpjwdmssjForm,
} from "@/api-data/data/data_base/zygxs/ods_xxhxpjwdmssj";

// 搜索条件
const queryParams = reactive<OdsXxhxpjwdmssjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  pjwdyjzbywmc: "",
  pjwdyjzbzwmc: "",
  pjwdywmc: "",
  pjwdzwms: "",
  pjwdjgms: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 表格数据
const dataList = ref<OdsXxhxpjwdmssjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedRows = ref<number[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const form = reactive<OdsXxhxpjwdmssjForm & { enableStatus?: string }>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  pjwdyjzbywmc: "",
  pjwdyjzbzwmc: "",
  pjwdywmc: "",
  pjwdzwms: "",
  pjwdjgms: "",
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增学生画像评价维度描述数据";
    case "edit":
      return "编辑学生画像评价维度描述数据";
    case "view":
      return "学生画像评价维度描述数据详情";
    default:
      return "";
  }
});

// 详情对话框
const currentRecord = ref<OdsXxhxpjwdmssjInfo | null>(null);

// 学校代码相关
const systemSchoolCode = ref<string>("");

// 学号选项相关
const studentOptions = ref<Array<{ value: string; label: string }>>([]);
const studentLoading = ref(false);

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { 
      validator: (_rule: any, value: string, callback: Function) => {
        if (!value) {
          callback();  // 允许为空，后端会自动生成
          return;
        }
        // 验证32位大写字母+数字组合
        const regex = /^[A-Z0-9]{32}$/;
        if (!regex.test(value)) {
          callback(new Error("唯一性标识必须是32位大写字母和数字组合"));
          return;
        }
        callback();
      },
      trigger: "blur"
    }
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须是10位数字", trigger: "blur" }
  ],
  xh: [
    { required: true, message: "请选择学号", trigger: "change" },
    { max: 20, message: "学号长度不能超过20位", trigger: "blur" }
  ],
  pjwdyjzbywmc: [
    { required: true, message: "请输入评价维度一级指标英文名称", trigger: "blur" },
    { max: 150, message: "评价维度一级指标英文名称长度不能超过150字符", trigger: "blur" }
  ],
  pjwdyjzbzwmc: [
    { required: true, message: "请输入评价维度一级指标中文名称", trigger: "blur" },
    { max: 150, message: "评价维度一级指标中文名称长度不能超过150字符", trigger: "blur" }
  ],
  pjwdywmc: [
    { required: true, message: "请输入评价维度英文名称", trigger: "blur" },
    { max: 150, message: "评价维度英文名称长度不能超过150字符", trigger: "blur" }
  ],
  pjwdzwms: [
    { required: true, message: "请输入评价维度中文描述", trigger: "blur" },
    { max: 300, message: "评价维度中文描述长度不能超过300字符", trigger: "blur" }
  ],
  pjwdjgms: [
    { required: true, message: "请输入评价维度结果描述", trigger: "blur" },
    { max: 300, message: "评价维度结果描述长度不能超过300字符", trigger: "blur" }
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" }
  ]
});

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsXxhxpjwdmssjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询学生画像评价维度描述数据失败:", error);
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
    xh: "",
    pjwdyjzbywmc: "",
    pjwdyjzbzwmc: "",
    pjwdywmc: "",
    pjwdzwms: "",
    pjwdjgms: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 工具函数
const formatDisplayTime = (timeStr: string | undefined) => {
  if (!timeStr) return "";
  // 如果是YYYYMMDD格式，转换为YYYY-MM-DD
  if (timeStr.length === 8) {
    return `${timeStr.substring(0, 4)}-${timeStr.substring(4, 6)}-${timeStr.substring(6, 8)}`;
  }
  // 如果是YYYYMMDD HHmmss格式，转换为YYYY-MM-DD HH:mm:ss
  if (timeStr.length === 15) {
    return `${timeStr.substring(0, 4)}-${timeStr.substring(4, 6)}-${timeStr.substring(6, 8)} ${timeStr.substring(9, 11)}:${timeStr.substring(11, 13)}:${timeStr.substring(13, 15)}`;
  }
  return timeStr;
};

const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "0":
      return "info";
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "warning";
  }
};

const getReportStatusText = (status: string) => {
  switch (status) {
    case "0":
      return "未上报";
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return "未知";
  }
};

// 重置表单
const resetForm = () => {
  // 使用reactive重新创建一个新的表单对象
  const newForm = {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    xh: "",
    pjwdyjzbywmc: "",
    pjwdyjzbzwmc: "",
    pjwdywmc: "",
    pjwdzwms: "",
    pjwdjgms: "",
    sjcjsj: "",
    enableStatus: "1",
  };
  
  // 使用Object.keys确保所有属性都被重置
  Object.keys(form).forEach(key => {
    // @ts-ignore
    form[key] = newForm[key];
  });
  
  nextTick(() => {
    formRef.value?.clearValidate();
  });
};

// 获取并设置学校代码
const fetchAndSetSchoolCode = async () => {
  try {
    const response: any = await getSystemSchoolCode();
    if (response.data.code === 200 && response.data.data) {
      form.xxdm = response.data.data;
      systemSchoolCode.value = response.data.data;
    } else {
      console.warn("获取学校代码失败:", response.data.msg);
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
  }
};

// 获取学号选项
const fetchStudentOptions = async (keyword?: string) => {
  try {
    studentLoading.value = true;
    const response: any = await getStudentOptions(keyword);
    if (response.data.code === 200 && response.data.data) {
      // 转换数据格式
      studentOptions.value = response.data.data.map((item: any) => ({
        value: item.xh,
        label: `${item.xh} - ${item.xsxm}`
      }));
    } else {
      console.warn("获取学号选项失败:", response.data.msg);
    }
  } catch (error) {
    console.error("获取学号选项失败:", error);
  } finally {
    studentLoading.value = false;
  }
};

// 学号远程搜索
const remoteMethodXh = (query: string) => {
  if (query) {
    fetchStudentOptions(query);
  } else {
    studentOptions.value = [];
  }
};

// 学号选择变化
const handleXhChange = (value: string) => {
  console.log("学号选择变化:", value);
  nextTick(() => {
    if (form) {
      form.xh = value || '';
      console.log("设置后的form.xh:", form.xh);
    }
  });
};

// 新增
const handleAdd = async () => {
  resetForm();
  // 自动获取并设置学校代码
  await fetchAndSetSchoolCode();
  // 初始化学号选项
  await fetchStudentOptions();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleUpdate = async (row: OdsXxhxpjwdmssjInfo) => {
  try {
    const response: any = await getOdsXxhxpjwdmssjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      // 确保学校代码是最新的
      await fetchAndSetSchoolCode();
      // 初始化学号选项
      await fetchStudentOptions();
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生画像评价维度描述数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 行点击事件
const handleRowClick = (_row: OdsXxhxpjwdmssjInfo) => {
  // 可以在这里添加行点击逻辑，暂时留空
};

// 查看详情
const handleView = async (row: OdsXxhxpjwdmssjInfo) => {
  try {
    const response: any = await getOdsXxhxpjwdmssjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      currentRecord.value = response.data.data;
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生画像评价维度描述数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsXxhxpjwdmssjInfo) => {
  try {
    await ElMessageBox.confirm(
      "确定要删除这条学生画像评价维度描述数据吗？",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await deleteOdsXxhxpjwdmssj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除学生画像评价维度描述数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条学生画像评价维度描述数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsXxhxpjwdmssj(selectedRows.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedRows.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除学生画像评价维度描述数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsXxhxpjwdmssj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `学生画像评价维度描述数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出学生画像评价维度描述数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表格选择变化
const handleSelectionChange = (selection: OdsXxhxpjwdmssjInfo[]) => {
  selectedRows.value = selection.map((item) => item.id);
};

// 行双击
const handleRowDblClick = (row: OdsXxhxpjwdmssjInfo) => {
  handleView(row);
};

// 分页大小变化
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

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsXxhxpjwdmssj(form);
    } else {
      response = await updateOdsXxhxpjwdmssj(form);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(
        response.data.msg ||
          (dialogMode.value === "add" ? "新增失败" : "修改失败"),
      );
    }
  } catch (error) {
    console.error("提交表单失败:", error);
    ElMessage.error("提交失败");
  } finally {
    submitLoading.value = false;
  }
};

// 关闭表单对话框
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 页面加载
onMounted(() => {
  getList();
  // 预加载学校代码
  fetchAndSetSchoolCode();
  // 预加载学号选项（不传参数，获取默认列表）
  fetchStudentOptions();
});
</script>

<style scoped>
/* 主容器样式 */
.portrait-evaluation-management {
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
.portrait-dialog {
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
.portrait-detail {
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
