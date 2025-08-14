<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="对外服务编号" prop="dwfwbh">
            <el-input
              v-model="queryParams.dwfwbh"
              placeholder="请输入对外服务编号"
              clearable
            />
          </el-form-item>
          <el-form-item label="服务类型" prop="dwfwlxm">
            <el-select
              v-model="queryParams.dwfwlxm"
              placeholder="请选择对外服务类型"
              clearable
              style="width: 200px"
            >
              <el-option label="虚拟仿真实训" value="1" />
              <el-option label="技能培训" value="2" />
              <el-option label="科研服务" value="3" />
              <el-option label="技术咨询" value="4" />
              <el-option label="其他服务" value="5" />
            </el-select>
          </el-form-item>
          <el-form-item label="服务单位" prop="fwdwmc">
            <el-input
              v-model="queryParams.fwdwmc"
              placeholder="请输入服务单位名称"
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
        <div class="header-title">虚拟仿真基地对外服务数据数据清洗</div>
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
          @row-dblclick="handleRowDblClick"
          :height="'calc(75vh - 100px)'"
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
            width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dwfwbh"
            label="服务编号"
            width="130"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dwfwlxm"
            label="服务类型"
            width="120"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ getDwfwlxmText(row.dwfwlxm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="xnfzsxxmbh"
            label="项目编号"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dwfwrc"
            label="服务人次"
            width="100"
            align="center"
          />
          <el-table-column
            prop="dwfwdx"
            label="服务对象"
            width="120"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ getDwfwdxText(row.dwfwdx) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="fwkss"
            label="服务课时"
            width="100"
            align="center"
          />
          <el-table-column
            prop="fwrq"
            label="服务日期"
            width="110"
            align="center"
          >
            <template #default="{ row }">
              {{ formatDate(row.fwrq) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="fwdwmc"
            label="服务单位"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sjcjsj"
            label="采集时间"
            width="160"
            align="center"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.sjcjsj) }}
            </template>
          </el-table-column>
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

    <!-- 虚拟仿真基地对外服务数据弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      class="professional-dialog"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="150px"
        class="service-form"
      >
        <el-row :gutter="24">
          <!-- 第一行：唯一性标识 -->
          <el-col :span="24">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可选填，如不填写后端将自动生成32位全局唯一编码"
                maxlength="32"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 第二行：学校代码 -->
          <el-col :span="24">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="系统自动获取学校代码"
                :disabled="true"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 第三行：对外服务编号 -->
          <el-col :span="24">
            <el-form-item
              label="对外服务编号"
              prop="dwfwbh"
              class="required-label"
            >
              <el-input
                v-model="form.dwfwbh"
                placeholder="请输入对外服务编号"
                maxlength="10"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 第四行：对外服务类型和对外服务对象 -->
          <el-col :span="12">
            <el-form-item
              label="对外服务类型"
              prop="dwfwlxm"
              class="required-label"
            >
              <el-select
                v-model="form.dwfwlxm"
                placeholder="请选择对外服务类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in dwfwlxmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="对外服务对象"
              prop="dwfwdx"
              class="required-label"
            >
              <el-select
                v-model="form.dwfwdx"
                placeholder="请选择对外服务对象"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in dwfwdxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 第五行：虚拟仿真实训项目编号 -->
          <el-col :span="24">
            <el-form-item label="虚拟仿真实训项目编号" prop="xnfzsxxmbh">
              <el-select
                v-model="form.xnfzsxxmbh"
                placeholder="请选择实训项目"
                filterable
                remote
                clearable
                style="width: 100%"
                :remote-method="searchSxxmOptions"
                :loading="sxxmLoading"
              >
                <el-option
                  v-for="item in sxxmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 第六行：对外服务人次和服务课时数 -->
          <el-col :span="12">
            <el-form-item
              label="对外服务人次"
              prop="dwfwrc"
              class="required-label"
            >
              <div style="display: flex; align-items: center; gap: 8px">
                <el-button size="small" @click="decreaseServiceCount"
                  >−</el-button
                >
                <el-input-number
                  v-model="form.dwfwrc"
                  :min="0"
                  :max="99999"
                  controls-position="right"
                  style="flex: 1"
                  placeholder="请输入对外服务人次"
                />
                <el-button size="small" @click="increaseServiceCount"
                  >+</el-button
                >
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="服务课时数"
              prop="fwkss"
              class="required-label"
            >
              <div style="display: flex; align-items: center; gap: 8px">
                <el-button size="small" @click="decreaseServiceHours"
                  >−</el-button
                >
                <el-input-number
                  v-model="form.fwkss"
                  :min="0"
                  :max="99999"
                  controls-position="right"
                  style="flex: 1"
                  placeholder="请输入服务课时数"
                />
                <el-button size="small" @click="increaseServiceHours"
                  >+</el-button
                >
              </div>
            </el-form-item>
          </el-col>

          <!-- 第七行：服务日期 -->
          <el-col :span="24">
            <el-form-item label="服务日期" prop="fwrq" class="required-label">
              <el-date-picker
                v-model="form.fwrq"
                type="date"
                placeholder="请选择服务日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 第八行：服务单位名称 -->
          <el-col :span="24">
            <el-form-item label="服务单位名称" prop="fwdwmc">
              <el-input
                v-model="form.fwdwmc"
                placeholder="请输入服务单位名称"
                maxlength="100"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 第九行：数据采集时间 -->
          <el-col :span="24">
            <el-form-item
              label="数据采集时间"
              prop="sjcjsj"
              class="required-label"
            >
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

          <!-- 第十行：上报状态和启用状态 -->
          <el-col :span="12">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select
                v-model="form.reportStatus"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option label="未上报" value="0" />
                <el-option label="已上报" value="1" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select
                v-model="form.enableStatus"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
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
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="查看虚拟仿真基地对外服务数据详情"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      class="professional-dialog"
    >
      <div v-if="currentRecord" class="view-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主键数据唯一性标识">
            {{ currentRecord.zjsjwyxbs || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            {{ currentRecord.xxdm || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="对外服务编号">
            {{ currentRecord.dwfwbh || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="对外服务类型">
            {{ getDwfwlxmText(currentRecord.dwfwlxm) }}
          </el-descriptions-item>
          <el-descriptions-item label="虚拟仿真实训项目编号">
            {{ currentRecord.xnfzsxxmbh || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="对外服务人次">
            {{ currentRecord.dwfwrc || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="对外服务对象">
            {{ getDwfwdxText(currentRecord.dwfwdx) }}
          </el-descriptions-item>
          <el-descriptions-item label="服务课时数">
            {{ currentRecord.fwkss || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="服务日期">
            {{ formatDate(currentRecord.fwrq) }}
          </el-descriptions-item>
          <el-descriptions-item label="服务单位名称">
            {{ currentRecord.fwdwmc || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            {{ formatDateTime(currentRecord.sjcjsj) }}
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(currentRecord.reportStatus)">
              {{ getReportStatusText(currentRecord.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="currentRecord.enableStatus === '1' ? 'success' : 'danger'"
            >
              {{ currentRecord.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{
              currentRecord.createTime
                ? new Date(currentRecord.createTime).toLocaleString()
                : "-"
            }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance, FormItemRule } from "element-plus";
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
  getOdsXnfzjddwfwsjPage,
  getOdsXnfzjddwfwsjById,
  addOdsXnfzjddwfwsj,
  updateOdsXnfzjddwfwsj,
  deleteOdsXnfzjddwfwsj,
  batchDeleteOdsXnfzjddwfwsj,
  exportOdsXnfzjddwfwsj,
  updateSingleReportStatus,
  updateSingleEnableStatus,
  getSystemSchoolCode,
  getDictXnfzjddwfwlxOptions,
  getDictXnfzjddwfwdxOptions,
  getSxxmOptions,
  type OdsXnfzjddwfwsjInfo,
  type OdsXnfzjddwfwsjQuery,
  type DictOption,
  type SxxmOption,
} from "@/api-data/data/data_base/zygjx/ods_xnfzjddwfwsj";

// API响应类型定义
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 基础数据
const loading = ref(false);
const dataList = ref<OdsXnfzjddwfwsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);

// 查询表单
const queryParams = reactive<OdsXnfzjddwfwsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  dwfwbh: "",
  dwfwlxm: "",
  xnfzsxxmbh: "",
  dwfwdx: "",
  fwrq: "",
  fwdwmc: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单相关
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const formRef = ref<FormInstance>();
const queryForm = ref<FormInstance>();
const activeTab = ref("basic");
const currentRecord = ref<OdsXnfzjddwfwsjInfo>();

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增虚拟仿真基地对外服务数据";
    case "edit":
      return "编辑虚拟仿真基地对外服务数据";
    case "view":
      return "查看虚拟仿真基地对外服务数据";
    default:
      return "";
  }
});

// 表单数据
const form = ref<any>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  dwfwbh: "",
  dwfwlxm: "",
  xnfzsxxmbh: "",
  dwfwrc: undefined,
  dwfwdx: "",
  fwkss: undefined,
  fwrq: "",
  fwdwmc: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = reactive<Record<string, FormItemRule[]>>({
  zjsjwyxbs: [
    // 唯一编码字段改为可选，如果填写则需要符合格式
    {
      pattern: /^[A-Z0-9]{32}$/,
      message: "请输入32位大写字母和数字组合",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "请输入10位数字码", trigger: "blur" },
  ],
  dwfwbh: [
    { required: true, message: "请输入对外服务编号", trigger: "blur" },
    { max: 10, message: "长度不能超过10个字符", trigger: "blur" },
  ],
  dwfwlxm: [
    { required: true, message: "请选择对外服务类型", trigger: "change" },
  ],
  xnfzsxxmbh: [{ max: 60, message: "长度不能超过60个字符", trigger: "blur" }],
  dwfwrc: [
    { required: true, message: "请输入对外服务人次", trigger: "blur" },
    { type: "number", message: "请输入数字", trigger: "blur" },
    {
      validator: (_rule, value, callback) => {
        if (value < 0 || value > 99999) {
          callback(new Error("请输入0-99999之间的数字"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  dwfwdx: [
    { required: true, message: "请选择对外服务对象", trigger: "change" },
  ],
  fwkss: [
    { required: true, message: "请输入服务课时数", trigger: "blur" },
    { type: "number", message: "请输入数字", trigger: "blur" },
    {
      validator: (_rule, value, callback) => {
        if (value < 0 || value > 99999) {
          callback(new Error("请输入0-99999之间的数字"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  fwrq: [{ required: true, message: "请选择服务日期", trigger: "change" }],
  fwdwmc: [{ max: 100, message: "长度不能超过100个字符", trigger: "blur" }],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
    { max: 15, message: "数据采集时间长度不能超过15位", trigger: "blur" },
  ],
});

// 下拉选项
const dwfwlxmOptions = ref<DictOption[]>([
  { value: "1", label: "是" },
  { value: "0", label: "否" },
]);

const dwfwdxOptions = ref<DictOption[]>([
  { value: "1", label: "在校学生" },
  { value: "2", label: "企业员工" },
  { value: "3", label: "社会人员" },
  { value: "4", label: "其他院校学生" },
  { value: "5", label: "政府机构" },
]);

// 实训项目选项
const sxxmOptions = ref<SxxmOption[]>([]);
const sxxmLoading = ref(false);

// 获取数据列表
async function getList() {
  loading.value = true;
  try {
    const response = (await getOdsXnfzjddwfwsjPage(queryParams)) as any;
    if (response.data.code === 200 && response.data.data) {
      dataList.value = response.data.data.records || [];
      total.value = response.data.data.total || 0;
    } else {
      ElMessage.error(response.data.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取列表数据失败：", error);
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
}

// 搜索
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

// 重置搜索
function resetQuery() {
  queryForm.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
}

// 获取学校代码
async function getSchoolCode() {
  try {
    const response = (await getSystemSchoolCode()) as any;
    // 根据您的截图，数据结构应该是 response.data.data
    if (response.data && response.data.code === 200 && response.data.data) {
      form.value.xxdm = response.data.data;
      console.log("学校代码设置成功：", response.data.data);
    } else {
      console.log("学校代码响应结构异常：", response);
      ElMessage.warning(
        response.data?.message || "获取学校代码失败，请手动输入",
      );
    }
  } catch (error) {
    console.error("获取学校代码失败：", error);
    ElMessage.warning("获取学校代码失败，请手动输入");
  }
}

// 新增
async function handleAdd() {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
  activeTab.value = "basic";
  // 自动获取学校代码
  await getSchoolCode();
}

// 编辑
async function handleEdit(row: OdsXnfzjddwfwsjInfo) {
  try {
    const response = (await getOdsXnfzjddwfwsjById(row.id)) as any;
    if (response.data.code === 200 && response.data.data) {
      const data = response.data.data;
      form.value = {
        id: data.id,
        zjsjwyxbs: data.zjsjwyxbs,
        xxdm: data.xxdm,
        dwfwbh: data.dwfwbh,
        dwfwlxm: data.dwfwlxm,
        xnfzsxxmbh: data.xnfzsxxmbh,
        dwfwrc: data.dwfwrc,
        dwfwdx: data.dwfwdx,
        fwkss: data.fwkss,
        fwrq: data.fwrq,
        fwdwmc: data.fwdwmc,
        sjcjsj: data.sjcjsj,
        reportStatus: data.reportStatus,
        enableStatus: data.enableStatus,
      };
      dialogMode.value = "edit";
      dialogVisible.value = true;
      activeTab.value = "basic";
    } else {
      ElMessage.error(response.data.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取详情失败：", error);
    ElMessage.error("获取详情失败");
  }
}

// 查看详情
async function handleView(row: OdsXnfzjddwfwsjInfo) {
  try {
    const response = (await getOdsXnfzjddwfwsjById(row.id)) as any;
    if (response.data.code === 200 && response.data.data) {
      currentRecord.value = response.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(response.data.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取详情失败：", error);
    ElMessage.error("获取详情失败");
  }
}

// 删除
function handleDelete(row: OdsXnfzjddwfwsjInfo) {
  ElMessageBox.confirm(
    `确定要删除虚拟仿真基地对外服务数据"${row.dwfwbh}"吗？`,
    "删除确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(async () => {
    try {
      const response = (await deleteOdsXnfzjddwfwsj(row.id)) as any;
      if (response.data.code === 200) {
        ElMessage.success("删除成功");
        await getList();
      } else {
        ElMessage.error(response.data.message || "删除失败");
      }
    } catch (error) {
      console.error("删除失败：", error);
      ElMessage.error("删除失败");
    }
  });
}

// 批量删除
function handleBatchDelete() {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedIds.value.length} 条虚拟仿真基地对外服务数据吗？`,
    "批量删除确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(async () => {
    try {
      const response = (await batchDeleteOdsXnfzjddwfwsj(
        selectedIds.value,
      )) as any;
      if (response.data.data.success) {
        ElMessage.success("批量删除成功");
        selectedIds.value = [];
        await getList();
      } else {
        ElMessage.error(response.data.message || "批量删除失败");
      }
    } catch (error) {
      console.error("批量删除失败：", error);
      ElMessage.error("批量删除失败");
    }
  });
}

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    try {
      // 处理表单数据
      const formData = { ...form.value };

      // 如果唯一编码为空或者只有空格，删除该字段让后端自动生成
      if (!formData.zjsjwyxbs || formData.zjsjwyxbs.trim() === "") {
        console.log(
          "唯一编码为空，后端将使用唯一编码工具类自动生成32位全局唯一编码",
        );
        delete formData.zjsjwyxbs;
      } else {
        console.log("使用用户输入的唯一编码：", formData.zjsjwyxbs);
      }

      let response: ApiResponse;
      if (dialogMode.value === "add") {
        response = await addOdsXnfzjddwfwsj(formData);
        if (response.code === 200) {
          ElMessage.success("添加成功");
          dialogVisible.value = false;
          getList();
        } else {
          ElMessage.error(response.message || "添加失败");
        }
      } else if (dialogMode.value === "edit") {
        response = await updateOdsXnfzjddwfwsj(formData);
        if (response.data.code === 200) {
          ElMessage.success("修改成功");
          dialogVisible.value = false;
          getList();
        } else {
          ElMessage.error(response.message || "修改失败");
        }
      }
    } catch (error) {
      console.error("提交失败:", error);
      ElMessage.error("操作失败，请重试");
    } finally {
      submitLoading.value = false;
    }
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 表单关闭
const handleFormClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
};

// 重置表单
function resetForm() {
  form.value = {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    dwfwbh: "",
    dwfwlxm: "",
    xnfzsxxmbh: "",
    dwfwrc: undefined,
    dwfwdx: "",
    fwkss: undefined,
    fwrq: "",
    fwdwmc: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  };
}

// 增减对外服务人次
function increaseServiceCount() {
  if (form.value.dwfwrc < 99999) {
    form.value.dwfwrc++;
  }
}

function decreaseServiceCount() {
  if (form.value.dwfwrc > 0) {
    form.value.dwfwrc--;
  }
}

// 增减服务课时数
function increaseServiceHours() {
  if (form.value.fwkss < 99999) {
    form.value.fwkss++;
  }
}

function decreaseServiceHours() {
  if (form.value.fwkss > 0) {
    form.value.fwkss--;
  }
}

// 搜索实训项目选项
async function searchSxxmOptions(keyword: string) {
  if (!keyword) {
    return;
  }
  sxxmLoading.value = true;
  try {
    const response = (await getSxxmOptions(keyword)) as any;
    if (
      response &&
      response.data &&
      response.data.code === 200 &&
      response.data.data
    ) {
      sxxmOptions.value = response.data.data;
    }
  } catch (error) {
    console.error("搜索实训项目失败：", error);
  } finally {
    sxxmLoading.value = false;
  }
}

// 表格选择变化
function handleSelectionChange(selection: OdsXnfzjddwfwsjInfo[]) {
  selectedIds.value = selection.map((item) => item.id);
}

// 分页大小变化
function handleSizeChange(newSize: number) {
  queryParams.pageSize = newSize;
  queryParams.pageNum = 1;
  getList();
}

// 当前页变化
function handleCurrentChange(newPage: number) {
  queryParams.pageNum = newPage;
  getList();
}

// 行点击
function handleRowDblClick(row: OdsXnfzjddwfwsjInfo) {
  handleView(row);
}

// 导出
async function handleExport() {
  try {
    ElMessage.info("正在导出数据，请稍候...");
    const response = await exportOdsXnfzjddwfwsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `虚拟仿真基地对外服务数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败：", error);
    ElMessage.error("导出失败");
  }
}

// 上报状态点击
function handleReportStatusClick(row: OdsXnfzjddwfwsjInfo) {
  const statusMap: Record<string, string> = {
    "0": "1", // 未上报 -> 已上报
    "1": "2", // 已上报 -> 上报失败
    "2": "0", // 上报失败 -> 未上报
  };

  const newStatus = statusMap[row.reportStatus] || "0";
  updateReportStatus(row, newStatus);
}

// 更新上报状态
async function updateReportStatus(row: OdsXnfzjddwfwsjInfo, status: string) {
  try {
    const response = (await updateSingleReportStatus(row.id, status)) as any;
    if (response.data.data.success) {
      row.reportStatus = status;
      ElMessage.success("状态更新成功");
    } else {
      ElMessage.error(response.data.message || "状态更新失败");
    }
  } catch (error) {
    console.error("状态更新失败：", error);
    ElMessage.error("状态更新失败");
  }
}

// 启用状态变化
async function handleEnableStatusChange(row: OdsXnfzjddwfwsjInfo) {
  row.statusLoading = true;
  try {
    const response = (await updateSingleEnableStatus(
      row.id,
      row.enableStatus,
    )) as any;
    if (response.data.data.success) {
      ElMessage.success("状态更新成功");
    } else {
      ElMessage.error(response.data.message || "状态更新失败");
      // 恢复原状态
      row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    }
  } catch (error) {
    console.error("状态更新失败：", error);
    ElMessage.error("状态更新失败");
    // 恢复原状态
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
  } finally {
    row.statusLoading = false;
  }
}

// 获取上报状态标签类型
function getReportStatusTagType(
  status: string,
): "success" | "primary" | "warning" | "info" | "danger" {
  const typeMap: Record<
    string,
    "success" | "primary" | "warning" | "info" | "danger"
  > = {
    "0": "info", // 未上报
    "1": "success", // 已上报
    "2": "danger", // 上报失败
  };
  return typeMap[status] || "info";
}

// 获取上报状态文本
function getReportStatusText(status: string) {
  const textMap: Record<string, string> = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败",
  };
  return textMap[status] || "未上报";
}

// 格式化日期（8位YYYYMMDD转为YYYY-MM-DD）
function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  if (value.length === 8) {
    return `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`;
  }
  return value;
}

// 格式化日期时间（14位YYYYMMDDHHmmss转为YYYY-MM-DD HH:mm:ss）
function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  if (value.length === 14) {
    return `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)} ${value.substring(8, 10)}:${value.substring(10, 12)}:${value.substring(12, 14)}`;
  }
  return value;
}

// 获取对外服务类型文本
function getDwfwlxmText(value: string | undefined): string {
  if (!value) return "-";
  const option = dwfwlxmOptions.value.find((item: any) => item.value === value);
  return option ? option.label : value;
}

// 获取对外服务对象文本
function getDwfwdxText(value: string | undefined): string {
  if (!value) return "-";
  const option = dwfwdxOptions.value.find((item: any) => item.value === value);
  return option ? option.label : value;
}

// 获取字典数据
async function getDictData() {
  try {
    // 获取对外服务类型字典数据
    const dwfwlxResponse = (await getDictXnfzjddwfwlxOptions()) as any;
    console.log("对外服务类型字典响应：", dwfwlxResponse);
    // 根据您的截图，数据结构是 response.data.data，并且code为200
    if (
      dwfwlxResponse &&
      dwfwlxResponse.data &&
      dwfwlxResponse.data.code === 200 &&
      dwfwlxResponse.data.data
    ) {
      dwfwlxmOptions.value = dwfwlxResponse.data.data;
      console.log("对外服务类型字典数据设置成功：", dwfwlxResponse.data.data);
    }

    // 获取对外服务对象字典数据
    const dwfwdxResponse = (await getDictXnfzjddwfwdxOptions()) as any;
    console.log("对外服务对象字典响应：", dwfwdxResponse);
    if (
      dwfwdxResponse &&
      dwfwdxResponse.data &&
      dwfwdxResponse.data.code === 200 &&
      dwfwdxResponse.data.data
    ) {
      dwfwdxOptions.value = dwfwdxResponse.data.data;
      console.log("对外服务对象字典数据设置成功：", dwfwdxResponse.data.data);
    }

    // 获取实训项目选项数据
    const sxxmResponse = (await getSxxmOptions()) as any;
    console.log("实训项目选项响应：", sxxmResponse);
    if (
      sxxmResponse &&
      sxxmResponse.data &&
      sxxmResponse.data.code === 200 &&
      sxxmResponse.data.data
    ) {
      sxxmOptions.value = sxxmResponse.data.data;
      console.log("实训项目选项数据设置成功：", sxxmResponse.data.data);
    }
  } catch (error) {
    console.error("获取字典数据失败：", error);
    // 保持默认选项
  }
}

// 页面初始化
onMounted(() => {
  getList();
  getDictData();
});
</script>

<style lang="scss" scoped>
.app-container {
}

.search-card {
  height: 60px;
}

.search-bar {
  :deep(.el-form) {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .el-form-item {
      margin-bottom: 8px !important;
      margin-right: 0;

      .el-form-item__label {
        font-weight: 500;
        color: #606266;
      }

      .el-input {
        width: 200px;
      }

      .el-select {
        width: 200px;
      }
    }
  }
}

.table-card {
  margin-top: -10px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 2px;
}

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
  width: 80px;
  display: flex;
  justify-content: flex-end;
}

.table-body {
  :deep(.el-table) {
    .el-table__header-wrapper {
      .el-table__header {
        .el-table__cell {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #303133;
          border-bottom: 1px solid #e4e7ed;
        }
      }
    }

    .el-table__body-wrapper {
      .el-table__body {
        .el-table__row {
          &:hover {
            background-color: #f5f7fa;
          }

          .el-table__cell {
            border-bottom: 1px solid #f0f0f0;
          }
        }
      }
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 0 2px;
}

.total-info {
  color: #909399;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
}

.professional-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
    overflow: hidden;

    .el-dialog__header {
      background-color: #f8f9fa;
      padding: 16px 24px;
      border-bottom: 1px solid #e4e7ed;
      margin: 0;

      .el-dialog__title {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
      }
    }

    .el-dialog__body {
      padding: 24px;

      .el-form {
        .el-form-item {
          margin-bottom: 18px;

          .el-form-item__label {
            font-weight: normal;
            color: #606266;
            padding-right: 12px;
            line-height: 32px;
          }

          .el-form-item__content {
            line-height: 32px;

            .el-input,
            .el-select,
            .el-date-picker {
              width: 100%;

              .el-input__wrapper {
                background-color: #fff;
                box-shadow: 0 0 0 1px #dcdfe6 inset;

                &:hover {
                  box-shadow: 0 0 0 1px #c0c4cc inset;
                }

                &.is-focus {
                  box-shadow: 0 0 0 1px #409eff inset;
                }
              }
            }

            .el-input-number {
              width: 100%;

              .el-input__wrapper {
                padding-right: 30px;
              }

              .el-input-number__decrease,
              .el-input-number__increase {
                background-color: #f5f7fa;
                border-color: #dcdfe6;

                &:hover {
                  color: #409eff;
                }
              }
            }

            .limit-count {
              color: #909399;
              font-size: 12px;
              margin-left: 8px;
            }
          }
        }
      }
    }

    .el-dialog__footer {
      padding: 16px 24px;
      border-top: 1px solid #e4e7ed;
      background-color: #f8f9fa;

      .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
    }
  }
}

.required-label {
  &::before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
}

.helper-text {
  color: #909399;
  font-size: 12px;
  margin-top: 4px;
}

.service-form {
  .el-form-item {
    margin-bottom: 20px;

    &.required-label {
      .el-form-item__label::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }
    }

    .el-form-item__label {
      font-weight: 500;
      color: #303133;
      line-height: 32px;
      padding-right: 12px;
    }

    .el-form-item__content {
      line-height: 32px;

      .el-input,
      .el-select,
      .el-date-picker,
      .el-input-number {
        .el-input__wrapper {
          background-color: #fff;
          box-shadow: 0 0 0 1px #dcdfe6 inset;
          transition: all 0.3s;

          &:hover {
            box-shadow: 0 0 0 1px #c0c4cc inset;
          }

          &.is-focus {
            box-shadow: 0 0 0 1px #409eff inset;
          }
        }
      }

      .el-textarea {
        .el-textarea__inner {
          box-shadow: 0 0 0 1px #dcdfe6 inset;

          &:hover {
            box-shadow: 0 0 0 1px #c0c4cc inset;
          }

          &:focus {
            box-shadow: 0 0 0 1px #409eff inset;
          }
        }
      }

      .helper-text {
        margin-top: 6px;
        line-height: 1.4;
      }
    }
  }
}

.required-label {
  &::before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
