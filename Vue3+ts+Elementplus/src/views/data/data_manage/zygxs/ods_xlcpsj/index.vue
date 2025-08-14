<template>
  <div class="professional-development-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
           
          <el-form-item label="专业号" prop="zyh">
            <el-input
              v-model="queryParams.zyh"
              placeholder="请输入专业号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="测评日期" prop="cprq">
            <el-date-picker
              v-model="cprqRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYYMMDD"
              @change="handleCprqRangeChange"
            />
          </el-form-item>
          <el-form-item label="量表编号" prop="lbbh">
            <el-input
              v-model="queryParams.lbbh"
              placeholder="请输入量表编号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="量表名称" prop="lbmc">
            <el-input
              v-model="queryParams.lbmc"
              placeholder="请输入量表名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="测评类型" prop="cplx">
            <el-select
              v-model="queryParams.cplx"
              placeholder="请选择测评类型"
              clearable
              style="width: 100px"
            >
              <el-option label="全部" value="" />
              <el-option label="类型1" value="1" />
              <el-option label="类型2" value="2" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="上报状态" prop="reportStatus">
            <el-select
              v-model="queryParams.reportStatus"
              placeholder="请选择上报状态"
              clearable
            >
              <el-option label="全部" value="" />
              <el-option label="未上报" value="0" />
              <el-option label="已上报" value="1" />
              <el-option label="上报失败" value="2" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="启用状态" prop="enableStatus">
            <el-select
              v-model="queryParams.enableStatus"
              placeholder="请选择启用状态"
              clearable
            >
              <el-option label="全部" value="" />
              <el-option label="禁用" value="0" />
              <el-option label="启用" value="1" />
            </el-select>
          </el-form-item> -->
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
        <div class="header-title">心理测评数据子类表</div>
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
          :height="'calc(65vh - 135px)'"
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
            prop="zyh"
            label="专业号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column prop="cprq" label="测评日期" min-width="120" align="center" sortable="custom" />
          <el-table-column
            prop="lbbh"
            label="量表编号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="lbmc"
            label="量表名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sysj"
            label="所用时间"
            min-width="100"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ row.sysj ? row.sysj + "分钟" : "-" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cplx"
            label="测评类型"
            min-width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="zdjy"
            label="指导建议"
            min-width="150"
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
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 500px"
      class="professional-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="rules"
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
            <el-form-item label="专业号" prop="zyh">
                <div style="display: flex; align-items: center; width: 100%">
                  <el-select
                    v-model="form.zyh"
                    placeholder="请输入专业号搜索"
                    filterable
                    remote
                    :remote-method="getZyhOptionsList"
                    :loading="loading"
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in zyhOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-tooltip
                    content="专业号数据来源于专业建设情况数据子类表"
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
            <el-form-item label="测评日期" prop="cprq">
              <el-date-picker
                v-model="form.cprq"
                type="date"
                placeholder="请选择测评日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="量表编号" prop="lbbh">
              <el-input
                v-model="form.lbbh"
                placeholder="请输入量表编号"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="量表名称" prop="lbmc">
              <el-input
                v-model="form.lbmc"
                placeholder="请输入量表名称"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所用时间(分钟)" prop="sysj">
              <el-input-number
                v-model="form.sysj"
                placeholder="请输入所用时间"
                :min="0"
                :max="9999"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测评类型" prop="cplx">
              <el-select
                v-model="form.cplx"
                placeholder="请选择测评类型"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in cplxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
            <el-form-item label="指导建议" prop="zdjy">
              <el-input
                v-model="form.zdjy"
                type="textarea"
                :rows="3"
                placeholder="请输入指导建议（可选，最多1000字符）"
                maxlength="1000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="professional-detail">
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
          <el-descriptions-item label="专业号">
            <div class="detail-value">{{ form.zyh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="测评日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.cprq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="量表编号">
            <div class="detail-value">{{ form.lbbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="量表名称">
            <div class="detail-value">{{ form.lbmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="所用时间">
            <div class="detail-value">
              {{ form.sysj ? form.sysj + "分钟" : "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="测评类型">
            <div class="detail-value">{{ form.cplx || "-" }}</div>
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
          <el-descriptions-item label="指导建议" :span="2">
            <div class="detail-value">{{ form.zdjy || "-" }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
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
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
const zyhOptions = ref<DictOption[]>([]);
// API导入
import {
  getOdsXlcpsjPage,
  getOdsXlcpsjById,
  addOdsXlcpsj,
  updateOdsXlcpsj,
  deleteOdsXlcpsj,
  batchDeleteOdsXlcpsj,
  exportOdsXlcpsj,
  getSystemSchoolCode,
  getZyhOptions,  
  getCplxOptions,
  type DictOption,
  type OdsXlcpsjForm,
  type OdsXlcpsjQuery,
  type OdsXlcpsjInfo,
} from "@/api-data/data/data_base/zygxs/ods_xlcpsj";
const schoolCode = ref("");
// 响应式数据
const queryParams = reactive<OdsXlcpsjQuery>({
  pageNum: 1,
  pageSize: 100,
  zjsjwyxbs: "",
  xxdm: schoolCode.value,
  zyh: "",
  cprqStart: "",
  cprqEnd: "",
  lbbh: "",
  lbmc: "",
  sysjMin: undefined,
  sysjMax: undefined,
  cplx: "",
  zdjy: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
});

const queryFormRef = ref<FormInstance>();
const dataList = ref<OdsXlcpsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedRows = ref<number[]>([]);
const cplxOptions = ref<DictOption[]>([]);
// 表单相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const form = reactive<OdsXlcpsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: schoolCode.value,
  zyh: "",
  cprq: "",
  lbbh: "",
  lbmc: "",
  sysj: undefined,
  cplx: "",
  zdjy: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 详情对话框
const viewDialogVisible = ref(false);
const currentRecord = ref<OdsXlcpsjInfo | null>(null);

// 日期范围
const cprqRange = ref<[string, string] | undefined>(undefined);

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增心理测评数据";
    case "edit":
      return "编辑心理测评数据";
    case "view":
      return "查看心理测评数据";
    default:
      return "心理测评数据";
  }
});

// 工具方法
const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "info";
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
      return "-";
  }
};

const formatDisplayTime = (timeStr: string | undefined) => {
  if (!timeStr) return "";
  
  // 处理日期格式 YYYYMMDD
  if (timeStr.length === 8) {
    const year = timeStr.substring(0, 4);
    const month = timeStr.substring(4, 6);
    const day = timeStr.substring(6, 8);
    return `${year}-${month}-${day}`;
  }
  
  // 处理日期时间格式 YYYYMMDD HHmmss
  if (timeStr.length === 15 && timeStr.includes(" ")) {
    const [datePart, timePart] = timeStr.split(" ");
    const year = datePart.substring(0, 4);
    const month = datePart.substring(4, 6);
    const day = datePart.substring(6, 8);
    const hour = timePart.substring(0, 2);
    const minute = timePart.substring(2, 4);
    const second = timePart.substring(4, 6);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  
  return timeStr;
};

// 表单验证规则
const rules = reactive({
  zjsjwyxbs: [
    {
      required: false,
      message: "主键数据唯一性标识可不填，后端自动生成",
      trigger: "blur",
    },
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (value && value.length > 0) {
          if (value.length !== 32) {
            callback(new Error("必须为32位字符"));
          } else if (!/^[A-Z0-9]{32}$/.test(value)) {
            callback(new Error("只能包含大写字母和数字"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码系统自动获取", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
  ],
  zyh: [
    { required: true, message: "请输入专业号", trigger: "blur" },
    { max: 64, message: "专业号长度不能超过64位", trigger: "blur" },
  ],
  cprq: [
    { required: true, message: "请选择测评日期", trigger: "change" },
  ],
  lbbh: [
    { required: true, message: "请输入量表编号", trigger: "blur" },
    { max: 50, message: "量表编号长度不能超过50位", trigger: "blur" },
  ],
  lbmc: [
    { required: true, message: "请输入量表名称", trigger: "blur" },
    { max: 150, message: "量表名称长度不能超过150位", trigger: "blur" },
  ],
  sysj: [
    { required: false, message: "请输入所用时间", trigger: "blur" },
  ],
  cplx: [
    { required: true, message: "请选择测评类型", trigger: "change" },
  ],
  zdjy: [
    { required: false, message: "请输入指导建议", trigger: "blur" },
    { max: 1000, message: "指导建议长度不能超过1000位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
  enableStatus: [
    { required: true, message: "请选择启用状态", trigger: "change" },
  ],
});

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsXlcpsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.message || "查询失败");
    }
  } catch (error: any) {
    console.error("查询心理测评数据失败:", error);
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
    xxdm: schoolCode.value,
    zyh: "",
    cprqStart: "",
    cprqEnd: "",
    lbbh: "",
    lbmc: "",
    sysjMin: undefined,
    sysjMax: undefined,
    cplx: "",
    zdjy: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    reportStatus: "",
    enableStatus: "",
    pageNum: 1,
    pageSize: 20,
  });
  cprqRange.value = undefined;
  getList();
};

// 处理测评日期范围变化
const handleCprqRangeChange = (value: [string, string] | null) => {
  if (value) {
    queryParams.cprqStart = value[0];
    queryParams.cprqEnd = value[1];
  } else {
    queryParams.cprqStart = "";
    queryParams.cprqEnd = "";
  }
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleUpdate = async (row: OdsXlcpsjInfo) => {
  try {
    const response: any = await getOdsXlcpsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.message || "获取详情失败");
    }
  } catch (error: any) {
    console.error("获取心理测评数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsXlcpsjInfo) => {
  try {
    const response: any = await getOdsXlcpsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.message || "获取详情失败");
    }
  } catch (error: any) {
    console.error("获取心理测评数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsXlcpsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条心理测评数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsXlcpsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除心理测评数据失败:", error);
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
      `确定要删除选中的 ${selectedRows.value.length} 条心理测评数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsXlcpsj(selectedRows.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedRows.value = [];
      getList();
    } else {
      ElMessage.error(response.data.message || "批量删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除心理测评数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsXlcpsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `心理测评数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error: any) {
    console.error("导出心理测评数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表格选择变化
const handleSelectionChange = (selection: OdsXlcpsjInfo[]) => {
  selectedRows.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = () => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsXlcpsjInfo) => {
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

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: schoolCode.value,
    zyh: "",
    cprq: "",
    lbbh: "",
    lbmc: "",
    sysj: undefined,
    cplx: "",
    zdjy: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsXlcpsj(form);
    } else {
      response = await updateOdsXlcpsj(form);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(
        response.data.message ||
          (dialogMode.value === "add" ? "新增失败" : "修改失败"),
      );
    }
  } catch (error: any) {
    console.error("提交心理测评数据失败:", error);
    ElMessage.error(dialogMode.value === "add" ? "新增失败" : "修改失败");
  } finally {
    submitLoading.value = false;
  }
};
// 获取专业号选项列表
const getZyhOptionsList = async (query: string) => {
 console.log(query);
 
  const response: any = await getZyhOptions(query);
  if (response.data.code === 200) {
    zyhOptions.value = response.data.data;
  }
};
// 获取学校代码
const getSchoolCode = async () => {
  const response: any = await getSystemSchoolCode();
  if (response.data.code === 200) {
    schoolCode.value = response.data.data;
  }
};
// 获取测评类型选项列表
const getCplxOptionsList = async () => {
  const response: any = await getCplxOptions();
  if (response.data.code === 200) {
    cplxOptions.value = response.data.data;
  }
};
// 页面加载
onMounted(() => {
  getList();
  getSchoolCode();
  getCplxOptionsList();
});
</script>

<style scoped>
/* 主容器样式 */
.professional-development-management {
  background-color: #f5f5f5;
}

/* 搜索卡片样式 */
.search-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.search-bar {
  :deep(.el-form) {
    .el-form-item {
      margin-bottom: 16px;
      margin-right: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .el-form-item__label {
      font-weight: 500;
      color: #303133;
    }

    .el-input,
    .el-select,
    .el-date-picker {
      width: 200px;
    }
  }
}

/* 表格卡片样式 */
.table-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 0;
  }
}

/* 表格头部样式 */
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
.professional-dialog {
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
.professional-detail {
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
