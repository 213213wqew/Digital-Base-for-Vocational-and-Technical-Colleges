<template>
  <div class="award-textbook-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="获奖项目" prop="hjxm">
            <el-input
              v-model="queryParams.hjxm"
              placeholder="请输入获奖项目"
              clearable
            />
          </el-form-item>
          <el-form-item label="奖励名称" prop="jlmc">
            <el-input
              v-model="queryParams.jlmc"
              placeholder="请输入奖励名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="颁奖单位" prop="bjdw">
            <el-input
              v-model="queryParams.bjdw"
              placeholder="请输入颁奖单位"
              clearable
            />
          </el-form-item>
          <el-form-item >
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
        <div class="header-title">获奖教材数据数据清洗</div>
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
            prop="hjjcbh"
            label="获奖教材编号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hjxm"
            label="获奖项目"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="jlmc"
            label="奖励名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="奖励级别"
            min-width="120"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getJljbmText(row.jljbm) }}
            </template>
          </el-table-column>
          <el-table-column
            label="奖励等级"
            min-width="120"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getJldjmText(row.jldjm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="hjrq"
            label="获奖日期"
            min-width="120"
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
        :rules="formRules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可不填，后端自动生成32位大写字母和数字组合的唯一编码"
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
               
                placeholder="系统自动获取学校代码，10位数字"
                maxlength="10"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖教材编号" prop="hjjcbh">
              <div class="input-with-tooltip">
                <el-select
                  v-model="form.hjjcbh"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词搜索教材"
                  :remote-method="remoteSearchJc"
                  :loading="jcLoading"
                  @change="handleJcSelect"
                  clearable
                >
                  <el-option
                    v-for="item in jcOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip
                  class="box-item"
                  effect="light"
                  content="数据来源于教材基本数据子类表"
                  placement="top"
                >
                  <el-icon class="warning-icon"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖项目" prop="hjxm">
              <el-input
                v-model="form.hjxm"
                placeholder="请输入获奖项目，最多60位"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖届次" prop="hjjc">
              <el-input
                v-model="form.hjjc"
                placeholder="请输入获奖届次，最多20位"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖日期" prop="hjrq">
              <el-date-picker
                v-model="form.hjrq"
                type="date"
                placeholder="请选择获奖日期，格式：YYYY-MM-DD"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="奖励名称" prop="jlmc">
              <el-input
                v-model="form.jlmc"
                placeholder="请输入奖励名称，最多60位"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="奖励级别码" prop="jljbm">
              <el-select
                v-model="form.jljbm"
                placeholder="请选择奖励级别，2位代码"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="option in jljbmOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="奖励等级码" prop="jldjm">
              <el-select
                v-model="form.jldjm"
                placeholder="请选择奖励等级，1位代码"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="option in jldjmOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颁奖单位" prop="bjdw">
              <el-input
                v-model="form.bjdw"
                placeholder="请输入颁奖单位，最多60位"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版号" prop="cbh">
              <div class="input-with-tooltip">
                <el-input
                  v-model="form.cbh"
                  placeholder="自动获取出版号"
                  readonly
                />
                <el-tooltip
                  class="box-item"
                  effect="light"
                  content="数据来源于教材基本数据子类表，不可修改"
                  placement="top"
                >
                  <el-icon class="warning-icon"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间，格式：YYYY-MM-DD HH:mm:ss"
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
      <div v-else class="award-detail">
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
          <el-descriptions-item label="获奖教材编号">
            <div class="detail-value">{{ form.hjjcbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="获奖项目">
            <div class="detail-value">{{ form.hjxm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="获奖届次">
            <div class="detail-value">{{ form.hjjc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="获奖日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.hjrq ?? "") || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="奖励名称">
            <div class="detail-value">{{ form.jlmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="奖励级别">
            <div class="detail-value">
              {{ getJljbmText(form.jljbm ?? "") || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="奖励等级">
            <div class="detail-value">
              {{ getJldjmText(form.jldjm ?? "") || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="颁奖单位">
            <div class="detail-value">{{ form.bjdw ?? "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="出版号">
            <div class="detail-value">{{ form.cbh ?? "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjcjsj ?? "") || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="(form.enableStatus || '0') === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ (form.enableStatus || '0') === "1" ? "启用" : "禁用" }}
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
  Warning,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsHjjcsjPage,
  getOdsHjjcsjById,
  addOdsHjjcsj,
  updateOdsHjjcsj,
  deleteOdsHjjcsj,
  batchDeleteOdsHjjcsj,
  exportOdsHjjcsj,
  getSystemSchoolCode,
  getJljbmOptions,
  getJldjmOptions,
  type OdsHjjcsjQuery,
  type OdsHjjcsjForm,
  type OdsHjjcsjInfo,
  type DictOption,
} from "@/api-data/data/data_base/zygjx/ods_hjjcsj";
import { getOdsJcjbsjOptions } from "@/api-data/data/data_base/zygjx/ods_jcjbsj";

// 搜索条件
const queryParams = reactive<OdsHjjcsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  hjjcbh: "",
  hjxm: "",
  jlmc: "",
  jljbm: "",
  jldjm: "",
  bjdw: "",
  hjrqStart: "",
  hjrqEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 100,
});

// 表格数据
const dataList = ref<OdsHjjcsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedRows = ref<OdsHjjcsjInfo[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const dialogTitle = computed(() => {
  if (dialogMode.value === "add") return "新增获奖教材数据";
  if (dialogMode.value === "edit") return "编辑获奖教材数据";
  return "查看获奖教材数据详情";
});

const form = reactive<OdsHjjcsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  hjjcbh: "",
  hjxm: "",
  hjjc: "",
  hjrq: "",
  jlmc: "",
  jljbm: "",
  jldjm: "",
  bjdw: "",
  cbh: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const queryFormRef = ref<FormInstance>();

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { min: 32, max: 32, message: "主键数据唯一性标识必须为32位大写字母和数字组合", trigger: "blur" },
    { 
      validator: (rule: any, value: any, callback: any) => {
        if (value && value.trim()) {
          if (!/^[A-Z0-9]{32}$/.test(value.trim())) {
            callback(new Error('主键数据唯一性标识必须为32位大写字母和数字组合'));
          }
        }
        callback();
      }, 
      trigger: "blur" 
    },
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { min: 10, max: 10, message: "学校代码必须为10位", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须为10位数字", trigger: "blur" },
  ],
  hjjcbh: [
    { required: true, message: "获奖教材编号不能为空", trigger: "blur" },
    { max: 60, message: "获奖教材编号长度不能超过60位", trigger: "blur" },
  ],
  hjxm: [
    { required: true, message: "获奖项目不能为空", trigger: "blur" },
    { max: 60, message: "获奖项目长度不能超过60位", trigger: "blur" },
  ],
  hjjc: [
    { max: 20, message: "获奖届次长度不能超过20位", trigger: "blur" },
  ],
  hjrq: [
    { required: true, message: "请选择获奖日期", trigger: "blur" },
    { pattern: /^\d{8}$/, message: "获奖日期格式必须为YYYYMMDD", trigger: "blur" },
  ],
  jlmc: [
    { required: true, message: "奖励名称不能为空", trigger: "blur" },
    { max: 60, message: "奖励名称长度不能超过60位", trigger: "blur" },
  ],
  jljbm: [
    { required: true, message: "请选择奖励级别", trigger: "change" },
    { max: 2, message: "奖励级别码长度不能超过2位", trigger: "blur" },
  ],
  jldjm: [
    { required: true, message: "请选择奖励等级", trigger: "change" },
    { max: 1, message: "奖励等级码长度不能超过1位", trigger: "blur" },
  ],
  bjdw: [
    { required: true, message: "颁奖单位不能为空", trigger: "blur" },
    { max: 60, message: "颁奖单位长度不能超过60位", trigger: "blur" },
  ],
  cbh: [
    { required: true, message: "出版号不能为空", trigger: "blur" },
    { max: 30, message: "出版号长度不能超过30位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "blur" },
    { pattern: /^\d{8} \d{6}$/, message: "数据采集时间格式必须为YYYYMMDD hhmmss", trigger: "blur" },
  ],
});

// 字典数据
const jljbmOptions = ref<DictOption[]>([]);
const jldjmOptions = ref<DictOption[]>([]);

// 教材选项列表
const jcOptions = ref<Array<{ value: string; label: string; cbh: string }>>([]);
// 教材搜索关键字
const jcKeyword = ref("");
// 是否正在加载教材选项
const jcLoading = ref(false);

// 获取字典数据
const loadDictData = async () => {
  try {
    const [jljbmRes, jldjmRes] = await Promise.all([
      getJljbmOptions(),
      getJldjmOptions(),
    ]) as any;
    
    jljbmOptions.value = jljbmRes.data.data || [];
    jldjmOptions.value = jldjmRes.data.data || [];
  } catch (error) {
    console.error("获取字典数据失败:", error);
    ElMessage.error("获取字典数据失败");
  }
};

// 获取系统学校代码
const loadSystemSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode() as any;
    if (response.data.code === 200 ) {
      form.xxdm = response.data.data;
    } else {
      ElMessage.error("获取学校代码失败，请检查系统配置");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.error("获取学校代码失败");
  }
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsHjjcsjPage(queryParams) as any ;
    dataList.value = response.data.data.records;
    total.value = response.data.data.total;
  } catch (error) {
    console.error("查询获奖教材数据失败:", error);
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
    hjjcbh: "",
    hjxm: "",
    jlmc: "",
    jljbm: "",
    jldjm: "",
    bjdw: "",
    hjrqStart: "",
    hjrqEnd: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    reportStatus: "",
    enableStatus: "",
    pageNum: 1,
    pageSize: 100,
  });
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleUpdate = async (row: OdsHjjcsjInfo) => {
  try {
    const response = await getOdsHjjcsjById(row.id) as any;
    Object.assign(form, response.data.data);
    dialogMode.value = "edit";
    dialogVisible.value = true;
  } catch (error) {
    console.error("获取获奖教材数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsHjjcsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条获奖教材数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await deleteOdsHjjcsj(row.id);
    ElMessage.success("删除成功");
    getList();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除获奖教材数据失败:", error);
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
      `确定要删除选中的 ${selectedRows.value.length} 条获奖教材数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const ids = selectedRows.value.map(row => row.id);
    await batchDeleteOdsHjjcsj(ids);
    ElMessage.success("批量删除成功");
    selectedRows.value = [];
    getList();
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除获奖教材数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsHjjcsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `获奖教材数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出获奖教材数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 查看详情
const handleView = async (row: OdsHjjcsjInfo) => {
  try {
    const response = await getOdsHjjcsjById(row.id)  ;
    Object.assign(form, response);
    dialogMode.value = "view";
    dialogVisible.value = true;
  } catch (error) {
    console.error("获取获奖教材数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 表格选择
const handleSelectionChange = (selection: OdsHjjcsjInfo[]) => {
  selectedRows.value = selection;
};

// 行点击
const handleRowClick = (row: OdsHjjcsjInfo) => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsHjjcsjInfo) => {
  handleView(row);
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

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    hjjcbh: "",
    hjxm: "",
    hjjc: "",
    hjrq: "",
    jlmc: "",
    jljbm: "",
    jldjm: "",
    bjdw: "",
    cbh: "",
    sjcjsj: "",
  });
  formRef.value?.clearValidate();
  // 重置表单后重新获取学校代码
  loadSystemSchoolCode();
};

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response;
    if (dialogMode.value === "add") {
      response = await addOdsHjjcsj(form);
    } else {
      response = await updateOdsHjjcsj(form);
    }

    if (response) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(dialogMode.value === "add" ? "新增失败" : "修改失败");
    }
  } catch (error) {
    console.error("提交表单失败:", error);
    ElMessage.error(dialogMode.value === "add" ? "新增失败" : "修改失败");
  } finally {
    submitLoading.value = false;
  }
};

// 获取奖励级别文本
const getJljbmText = (jljbm: string) => {
  const option = jljbmOptions.value.find(opt => opt.value === jljbm);
  return option ? option.label : jljbm;
};

// 获取奖励等级文本
const getJldjmText = (jldjm: string) => {
  const option = jldjmOptions.value.find(opt => opt.value === jldjm);
  return option ? option.label : jldjm;
};

// 获取上报状态文本
const getReportStatusText = (reportStatus: string) => {
  const options = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败"
  };
  return options[reportStatus as keyof typeof options] || reportStatus;
};

// 获取上报状态标签类型
const getReportStatusTagType = (reportStatus: string): 'success' | 'warning' | 'info' | 'danger' => {
  const options: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
    "0": "info",
    "1": "success", 
    "2": "danger"
  };
  return options[reportStatus] || "info";
};

// 格式化显示时间
const formatDisplayTime = (time: string) => {
  if (!time) return "";
  if (time.length === 8) {
    // YYYYMMDD格式
    return `${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)}`;
  } else if (time.length === 15) {
    // YYYYMMDD HHmmss格式  
    return `${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)} ${time.substring(9, 11)}:${time.substring(11, 13)}:${time.substring(13, 15)}`;
  }
  return time;
};

// 远程搜索教材
const remoteSearchJc = async (query: string) => {
  if (query) {
    jcLoading.value = true;
    try {
      const res = await getOdsJcjbsjOptions(query) as any;
      if (res.data.code === 200) {
        jcOptions.value = res.data.data;
      } else {
        ElMessage.error("获取教材列表失败");
      }
    } catch (error) {
      console.error("获取教材列表失败:", error);
      ElMessage.error("获取教材列表失败");
    } finally {
      jcLoading.value = false;
    }
  } else {
    jcOptions.value = [];
  }
};

// 选择教材时自动填充出版号
const handleJcSelect = (value: string) => {
  const selected = jcOptions.value.find(item => item.value === value);
  if (selected) {
    form.cbh = selected.cbh;
  }
};

// 页面加载
onMounted(() => {
  loadDictData();
  loadSystemSchoolCode();
  getList();
});
</script>

<style scoped lang="scss">
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
.award-textbook-management {

}

/* 搜索区域样式 */
.search-card {
  height: 60px;
}

.search-bar {
 height: 60px;
}

/* 表格卡片样式 */
.table-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: -10px;

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
.award-detail {
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

.input-with-tooltip {
  display: flex;
  align-items: center;
  gap: 8px;
}

.warning-icon {
  color: #E6A23C;
  font-size: 16px;
  cursor: help;
}
</style>
