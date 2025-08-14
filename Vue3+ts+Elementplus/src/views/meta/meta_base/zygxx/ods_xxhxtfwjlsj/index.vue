<template>
  <div class="entity-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="系统编号" prop="xxhxtbh">
            <div class="input-with-button">
              <el-input
                v-model="queryParams.xxhxtbh"
                placeholder="请输入信息化系统编号"
                clearable
                @keyup.enter="handleQuery"
              />
              <el-button type="primary" @click="handleQuery" class="search-btn">
                <el-icon><Search /></el-icon>搜索
              </el-button>
            </div>
          </el-form-item>
          <el-form-item label="系统全称" prop="xxhxtqc">
            <el-input
              v-model="queryParams.xxhxtqc"
              placeholder="请输入信息化系统全称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
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
        <div class="header-title">信息化系统访问记录数据子类表</div>
        <div class="right-buttons">
          <!-- 导入按钮 -->
          <!-- <el-tooltip content="导入Excel数据" placement="top">
            <el-button class="import-button" @click="handleImport">
              <el-icon><Upload /></el-icon>导入
            </el-button>
          </el-tooltip> -->
          <!-- 刷新按钮 -->
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
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
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
            prop="xxhxtbh"
            label="系统编号"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xxhxtqc"
            label="系统全称"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="fwfsmText"
            label="访问方式"
            width="120"
            align="center"
          />
          <el-table-column
            prop="jsfwcs"
            label="教师访问次数"
            width="120"
            align="center"
          />
          <el-table-column
            prop="xsfwcs"
            label="学生访问次数"
            width="120"
            align="center"
          />
          <el-table-column
            prop="xxhxtfwrqDisplay"
            label="访问日期"
            width="120"
            align="center"
          />
          <el-table-column
            prop="sjcjsjDisplay"
            label="采集时间"
            width="160"
            align="center"
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="
        dialogType === 'add'
          ? '新增信息化系统访问记录数据'
          : '编辑信息化系统访问记录数据'
      "
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleFormClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
      >
        <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
          <el-input
            v-model="form.zjsjwyxbs"
            placeholder="可选填，留空将自动生成32位唯一标识"
            maxlength="32"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="学校代码" prop="xxdm">
          <el-input
            v-model="form.xxdm"
            placeholder="系统自动获取学校代码"
            maxlength="10"
            readonly
            disabled
            style="background-color: #f5f7fa"
          />
        </el-form-item>
        <el-form-item label="信息化系统编号" prop="xxhxtbh">
          <el-select
            v-model="form.xxhxtbh"
            placeholder="请选择信息化系统编号"
            filterable
            clearable
            @change="handleSystemChange"
            style="width: 100%"
          >
            <el-option
              v-for="item in systemOptions"
              :key="item.xxhxtbh"
              :label="`${item.xxhxtbh} - ${item.xxhxtqc}`"
              :value="item.xxhxtbh"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="信息化系统全称" prop="xxhxtqc">
          <el-input
            v-model="form.xxhxtqc"
            placeholder="系统全称将自动填入"
            readonly
            style="background-color: #f5f7fa"
          />
        </el-form-item>
        <el-form-item label="访问方式" prop="fwfsm">
          <el-select
            v-model="form.fwfsm"
            placeholder="请选择访问方式"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in accessMethodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="访问日期" prop="xxhxtfwrq">
          <el-date-picker
            v-model="form.xxhxtfwrq"
            type="date"
            placeholder="请选择访问日期"
            value-format="YYYYMMDD"
            format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="教师访问次数" prop="jsfwcs">
          <el-input-number
            v-model="form.jsfwcs"
            :min="0"
            :max="9999999"
            placeholder="请输入教师访问次数"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="学生访问次数" prop="xsfwcs">
          <el-input-number
            v-model="form.xsfwcs"
            :min="0"
            :max="9999999"
            placeholder="请输入学生访问次数"
            style="width: 100%"
          />
        </el-form-item>
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
        <el-form-item label="上报状态" prop="reportStatus">
          <el-select
            v-model="form.reportStatus"
            placeholder="请选择上报状态"
            clearable
            style="width: 100%"
          >
            <el-option label="未上报" value="0" />
            <el-option label="已上报" value="1" />
            <el-option label="上报失败" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="enableStatus">
          <el-select
            v-model="form.enableStatus"
            placeholder="请选择启用状态"
            clearable
            style="width: 100%"
          >
            <el-option label="禁用" value="0" />
            <el-option label="启用" value="1" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose">取消</el-button>
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
      title="信息化系统访问记录数据详情"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleDetailClose"
    >
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主键数据唯一性标识">{{
            currentRecord.zjsjwyxbs || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{
            currentRecord.xxdm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="信息化系统编号">{{
            currentRecord.xxhxtbh || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="信息化系统全称">{{
            currentRecord.xxhxtqc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="访问方式">{{
            currentRecord.fwfsmText || currentRecord.fwfsm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="访问日期">{{
            formatDisplayDate(currentRecord.xxhxtfwrq)
          }}</el-descriptions-item>
          <el-descriptions-item label="教师访问次数">{{
            formatNumber(currentRecord.jsfwcs)
          }}</el-descriptions-item>
          <el-descriptions-item label="学生访问次数">{{
            formatNumber(currentRecord.xsfwcs)
          }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间" :span="2">{{
            formatDisplayDateTime(currentRecord.sjcjsj)
          }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(currentRecord.reportStatus)">
              {{ getReportStatusText(currentRecord.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag :type="currentRecord.enableStatus === '1' ? 'success' : 'danger'">
              {{ currentRecord.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDateTime(currentRecord.createTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            formatDateTime(currentRecord.updateTime)
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleDetailClose">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      title="导入信息化系统访问记录数据"
      v-model="importVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        :http-request="customHttpRequest"
        :before-upload="beforeUpload"
        :limit="1"
        :auto-upload="true"
        drag
        accept=".xls,.xlsx"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将Excel文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请上传.xls或.xlsx格式的文件，文件大小不能超过10MB
            <el-tooltip
              effect="dark"
              placement="top"
              :content="importTipContent"
            >
              <el-icon class="import-tip-icon">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import type { FormInstance } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
  Upload,
  UploadFilled,
  Warning,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  listAccessRecord,
  getAccessRecord,
  addAccessRecord,
  updateAccessRecord,
  deleteAccessRecord,
  batchDeleteAccessRecord,
  exportAccessRecord,
  importAccessRecord,
  getDictOptions,
  getSystemBuildingOptions,
  updateSingleReportStatus,
  updateSingleEnableStatus,
  getSystemSchoolCode,
  type MetaBaseZygxxOdsXxhxtfwjlsjInfo,
  type MetaBaseZygxxOdsXxhxtfwjlsjQuery,
  type MetaBaseZygxxOdsXxhxtfwjlsjForm,
  type DictOption,
  type SystemBuildingOption,
} from "@/api/meta/meta_base/zygxx/ods_xxhxtfwjlsj";

// 状态定义
const loading = ref(false);
const dataList = ref<MetaBaseZygxxOdsXxhxtfwjlsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const queryParams = reactive<MetaBaseZygxxOdsXxhxtfwjlsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xxhxtbh: "",
  xxhxtqc: "",
  fwfsm: "",
  xxhxtfwrqStart: "",
  xxhxtfwrqEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单相关
const currentRecord = ref<MetaBaseZygxxOdsXxhxtfwjlsjInfo | null>(null);
const dateRange = ref<string[]>([]);

// 对话框状态
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");

// 导入相关
const importVisible = ref(false);
const uploadRef = ref();

// 组件引用
const queryForm = ref<FormInstance>();

// 字典选项
const accessMethodOptions = ref<DictOption[]>([]);
const systemOptions = ref<SystemBuildingOption[]>([]);

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 表单相关
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const form = reactive<MetaBaseZygxxOdsXxhxtfwjlsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  xxhxtbh: "",
  xxhxtqc: "",
  fwfsm: "",
  jsfwcs: 0,
  xsfwcs: 0,
  xxhxtfwrq: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { required: false, message: "请输入主键数据唯一性标识", trigger: "blur" },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (!value || value.trim() === "") {
          // 如果为空，则通过验证（由后端自动生成）
          callback();
        } else if (value.length !== 32) {
          // 如果有值但不是32位，则报错
          callback(new Error("主键数据唯一性标识必须是32位"));
        } else if (!/^[A-Z0-9]+$/.test(value)) {
          // 检查是否为大写字母和数字组合
          callback(new Error("主键数据唯一性标识必须是大写字母和数字组合"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
  ],
  xxhxtbh: [
    { required: true, message: "请选择信息化系统编号", trigger: "change" },
  ],
  xxhxtqc: [
    { required: true, message: "信息化系统全称不能为空", trigger: "blur" },
  ],
  fwfsm: [{ required: true, message: "请选择访问方式", trigger: "change" }],
  jsfwcs: [
    { required: true, message: "请输入教师访问次数", trigger: "blur" },
    {
      type: "number",
      min: 0,
      message: "教师访问次数不能小于0",
      trigger: "blur",
    },
  ] as any,
  xsfwcs: [
    { required: true, message: "请输入学生访问次数", trigger: "blur" },
    {
      type: "number",
      min: 0,
      message: "学生访问次数不能小于0",
      trigger: "blur",
    },
  ] as any,
  xxhxtfwrq: [{ required: true, message: "请选择访问日期", trigger: "change" }],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
  reportStatus: [
    { required: false, message: "请选择上报状态", trigger: "change" },
  ],
  enableStatus: [
    { required: false, message: "请选择启用状态", trigger: "change" },
  ],
});

// 获取列表数据
const getList = async () => {
  try {
    loading.value = true;
    const response = await listAccessRecord(queryParams);
    // 显式断言响应类型
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      dataList.value = (apiResponse.data.data.records || []).map(
        (item: any) => ({
          ...item,
          statusLoading: false,
          fwfsmText: getFwfsmText(item.fwfsm),
          xxhxtfwrqDisplay: formatDisplayDate(item.xxhxtfwrq),
          sjcjsjDisplay: formatDisplayDateTime(item.sjcjsj),
        }),
      );
      total.value = apiResponse.data.data.total || 0;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取数据失败");
    }
  } catch (error: any) {
    console.error("获取列表失败:", error);
    ElMessage.error(error.message || "获取列表失败");
  } finally {
    loading.value = false;
  }
};

// 查询与重置
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

const resetQuery = () => {
  queryParams.zjsjwyxbs = "";
  queryParams.xxdm = "";
  queryParams.xxhxtbh = "";
  queryParams.xxhxtqc = "";
  queryParams.fwfsm = "";
  queryParams.xxhxtfwrqStart = "";
  queryParams.xxhxtfwrqEnd = "";
  queryParams.reportStatus = "";
  queryParams.enableStatus = "";
  dateRange.value = [];
  queryParams.pageNum = 1;
  getList();
};

// 表格选择和分页
const handleSelectionChange = (
  selection: MetaBaseZygxxOdsXxhxtfwjlsjInfo[],
) => {
  selectedIds.value = selection.map((item) => item.id as number);
};

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (current: number) => {
  queryParams.pageNum = current;
  getList();
};

// 行点击和双击
const handleRowClick = (row: MetaBaseZygxxOdsXxhxtfwjlsjInfo) => {
  console.log("行点击:", row);
};

const handleRowDblClick = (row: MetaBaseZygxxOdsXxhxtfwjlsjInfo) => {
  handleView(row);
};

// 重置表单数据
const resetFormData = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    xxhxtbh: "",
    xxhxtqc: "",
    fwfsm: "",
    jsfwcs: 0,
    xsfwcs: 0,
    xxhxtfwrq: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
};

// 重置表单
const resetForm = () => {
  currentRecord.value = null;
  // 先清除表单验证
  formRef.value?.clearValidate();
  // 重置表单数据到初始状态
  resetFormData();
  // 在下一个tick中重置表单字段
  nextTick(() => {
    formRef.value?.resetFields();
  });
};

// CRUD操作
const handleAdd = () => {
  // 强制重置表单数据
  resetFormData();
  currentRecord.value = null;
  // 自动设置学校代码
  if (systemSchoolCode.value) {
    form.xxdm = systemSchoolCode.value;
  }
  dialogType.value = "add";

  // 确保表单完全重置后再显示对话框
  nextTick(() => {
    formRef.value?.clearValidate();
    formRef.value?.resetFields();
    dialogVisible.value = true;
  });
};

const handleEdit = async (row: MetaBaseZygxxOdsXxhxtfwjlsjInfo) => {
  // 先重置表单
  resetFormData();
  formRef.value?.clearValidate();

  try {
    loading.value = true;
    const response = await getAccessRecord(row.id as number);
    // 显式断言响应类型
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      currentRecord.value = apiResponse.data.data;
      // 将获取到的数据填充到表单中
      Object.assign(form, apiResponse.data.data);
      dialogType.value = "edit";

      // 确保数据填充完成后再显示对话框
      nextTick(() => {
        dialogVisible.value = true;
      });
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取详情失败");
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取详情失败");
  } finally {
    loading.value = false;
  }
};

const handleView = async (row: MetaBaseZygxxOdsXxhxtfwjlsjInfo) => {
  try {
    loading.value = true;
    const response = await getAccessRecord(row.id as number);
    // 显式断言响应类型
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      currentRecord.value = apiResponse.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取详情失败");
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取详情失败");
  } finally {
    loading.value = false;
  }
};

const handleDelete = (row: MetaBaseZygxxOdsXxhxtfwjlsjInfo) => {
  // 构建详细的删除提示信息
  const systemInfo = row.xxhxtqc || row.xxhxtbh || "未知系统";
  const accessDate = formatDisplayDate(row.xxhxtfwrq) || "未知日期";
  const confirmMessage = `确定要删除以下访问记录吗？

系统名称：${systemInfo}
访问日期：${accessDate}
唯一标识：${row.zjsjwyxbs || "无"}

删除后将无法恢复！`;

  ElMessageBox.confirm(confirmMessage, "删除确认", {
    confirmButtonText: "确定删除",
    cancelButtonText: "取消",
    type: "warning",
    customClass: "delete-confirm-dialog",
  })
    .then(async () => {
      try {
        loading.value = true;
        const response = await deleteAccessRecord(row.id as number);
        // 显式断言响应类型
        const apiResponse = response as unknown as {
          data: { code: number; message?: string };
        };
        if (apiResponse?.data?.code === 200) {
          ElMessage.success("删除成功");
          getList();
        } else {
          ElMessage.error(apiResponse?.data?.message || "删除失败");
        }
      } catch (error: any) {
        ElMessage.error(error.message || "删除失败");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  // 获取选中数据的详细信息
  const selectedRecords = dataList.value.filter((item) =>
    selectedIds.value.includes(item.id as number),
  );
  const recordsInfo = selectedRecords
    .slice(0, 3)
    .map((record) => {
      const systemName = record.xxhxtqc || record.xxhxtbh || "未知系统";
      const accessDate = formatDisplayDate(record.xxhxtfwrq) || "未知日期";
      return `• ${systemName} (${accessDate})`;
    })
    .join("\n");

  const moreText =
    selectedRecords.length > 3
      ? `\n... 等共 ${selectedRecords.length} 条记录`
      : "";

  const confirmMessage = `确定要批量删除以下访问记录吗？

${recordsInfo}${moreText}

删除后将无法恢复！`;

  ElMessageBox.confirm(confirmMessage, "批量删除确认", {
    confirmButtonText: "确定删除",
    cancelButtonText: "取消",
    type: "warning",
    customClass: "delete-confirm-dialog",
  })
    .then(async () => {
      try {
        loading.value = true;
        const response = await batchDeleteAccessRecord(selectedIds.value);
        // 显式断言响应类型
        const apiResponse = response as unknown as {
          data: { code: number; message?: string };
        };
        if (apiResponse?.data?.code === 200) {
          ElMessage.success("批量删除成功");
          getList();
        } else {
          ElMessage.error(apiResponse?.data?.message || "批量删除失败");
        }
      } catch (error: any) {
        ElMessage.error(error.message || "批量删除失败");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 导出Excel
const handleExport = async () => {
  try {
    loading.value = true;
    ElMessage.info("正在导出数据，请稍候...");

    const response = await exportAccessRecord(queryParams);

    // 检查响应数据
    console.log("导出响应:", response);
    console.log("响应类型:", typeof response);
    console.log("响应data类型:", typeof response.data);
    console.log("是否为Blob:", response.data instanceof Blob);

    // 获取blob数据
    let blob: Blob;
    if (response.data instanceof Blob) {
      blob = response.data;
    } else if (response instanceof Blob) {
      blob = response;
    } else {
      // 如果响应不是blob，说明可能是错误信息，尝试解析
      console.error("响应不是blob格式:", response);
      throw new Error("服务器返回了错误的响应格式");
    }

    // 检查blob大小
    if (blob.size === 0) {
      throw new Error("导出的文件为空，请检查数据或联系管理员");
    }

    // 检查blob类型，如果是text类型可能是错误信息
    if (blob.type.includes("text") || blob.type.includes("json")) {
      const text = await blob.text();
      console.error("服务器返回错误信息:", text);
      throw new Error("导出失败，服务器返回错误信息");
    }

    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;

    // 生成文件名
    const now = new Date();
    const dateStr = now.toLocaleDateString("zh-CN").replace(/\//g, "-");
    const timeStr = now.getTime();
    link.download = `信息化系统访问记录数据_${dateStr}_${timeStr}.xlsx`;

    // 执行下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error: any) {
    console.error("导出失败:", error);
    ElMessage.error(error.message || "导出失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 导入操作
const handleImport = () => {
  importVisible.value = true;
};

// 导入提示内容
const importTipContent = `导入说明：
1. 第一行为字段中文名称，第二行为字段英文名称
2. 从第三行开始录入数据
3. 如果唯一标识为空，系统将自动生成
4. 采集时间将统一设置为当前时间
5. 支持.xls和.xlsx格式文件`;

// 文件上传前校验
const beforeUpload = (rawFile: any) => {
  const isExcel =
    rawFile.type === "application/vnd.ms-excel" ||
    rawFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isExcel) {
    ElMessage.error("请上传.xls或.xlsx格式的Excel文件!");
    return false;
  }
  const isLt10M = rawFile.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error("文件大小不能超过10MB!");
    return false;
  }
  return true;
};

// 自定义文件上传处理
const customHttpRequest = async (options: any) => {
  const { file, onSuccess, onError } = options;

  try {
    // 创建FormData
    const formData = new FormData();
    formData.append("file", file);

    console.log("开始上传文件:", file.name);

    // 使用API模块中的导入函数
    const response = (await importAccessRecord(formData)) as any;

    console.log("导入响应:", response);

    if (response && response.data && response.data.code === 200) {
      ElMessage.success("数据导入成功");
      importVisible.value = false;
      getList(); // 刷新列表
      onSuccess(response.data);
    } else {
      const errorMsg = response?.data?.message || "导入失败，请检查文件格式";
      ElMessage.error(`导入失败: ${errorMsg}`);
      onError(new Error(errorMsg));
    }
  } catch (error: any) {
    console.error("导入失败:", error);

    let errorMessage = "导入失败";
    if (error?.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        errorMessage = "登录已过期，请重新登录";
      } else if (status === 403) {
        errorMessage = "没有权限进行此操作";
      } else if (status === 413) {
        errorMessage = "文件太大，请检查文件大小";
      } else if (status === 415) {
        errorMessage = "不支持的文件格式";
      } else if (data && data.message) {
        errorMessage = data.message;
      } else {
        errorMessage = `服务器错误 (${status})`;
      }
    } else if (error?.message) {
      if (error.message.includes("Network Error")) {
        errorMessage = "网络连接失败，请检查网络连接";
      } else if (error.message.includes("timeout")) {
        errorMessage = "请求超时，请重试";
      } else {
        errorMessage = error.message;
      }
    }

    ElMessage.error(errorMessage);
    onError(error);
  } finally {
    uploadRef.value?.clearFiles();
  }
};

// 表单相关函数
const handleSystemChange = (value: string) => {
  if (value) {
    const selectedSystem = systemOptions.value.find(
      (item) => item.xxhxtbh === value,
    );
    if (selectedSystem) {
      form.xxhxtqc = selectedSystem.xxhxtqc;
    }
  } else {
    form.xxhxtqc = "";
  }
};

const handleFormClose = () => {
  dialogVisible.value = false;
  // 延迟重置表单，避免关闭时的闪烁
  nextTick(() => {
    resetForm();
  });
};

const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    submitLoading.value = true;

    if (dialogType.value === "add") {
      const response = await addAccessRecord(form);
      const apiResponse = response as unknown as {
        data: { code: number; message?: string };
      };
      if (apiResponse?.data?.code === 200) {
        ElMessage.success("新增成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(apiResponse?.data?.message || "新增失败");
      }
    } else {
      const response = await updateAccessRecord(form);
      const apiResponse = response as unknown as {
        data: { code: number; message?: string };
      };
      if (apiResponse?.data?.code === 200) {
        ElMessage.success("修改成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(apiResponse?.data?.message || "修改失败");
      }
    }
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("操作失败");
  } finally {
    submitLoading.value = false;
  }
};

// 详情对话框函数
const handleDetailClose = () => {
  viewDialogVisible.value = false;
};

// 获取访问方式文本
const getFwfsmText = (fwfsm: string): string => {
  const option = accessMethodOptions.value.find((item) => item.value === fwfsm);
  return option ? option.label : fwfsm || "-";
};

// 格式化函数
const formatNumber = (value: number | undefined): string => {
  if (value === undefined || value === null) {
    return "-";
  }
  return value.toLocaleString();
};

const formatDisplayDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "-";

  if (dateStr.length === 8) {
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
  }
  return dateStr;
};

const formatDisplayDateTime = (dateTimeStr: string | undefined): string => {
  if (!dateTimeStr) return "-";

  if (dateTimeStr.length === 14) {
    return `${dateTimeStr.substring(0, 4)}-${dateTimeStr.substring(4, 6)}-${dateTimeStr.substring(6, 8)} ${dateTimeStr.substring(8, 10)}:${dateTimeStr.substring(10, 12)}:${dateTimeStr.substring(12, 14)}`;
  }
  return dateTimeStr;
};

const formatDateTime = (dateTimeStr: string | undefined): string => {
  if (!dateTimeStr) return "-";

  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) {
      return dateTimeStr;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return dateTimeStr;
  }
};

// 加载系统选项数据
const loadSystemOptions = async () => {
  try {
    const response = await getSystemBuildingOptions();
    const apiResponse = response as unknown as {
      data: { code: number; data: any };
    };
    if (apiResponse?.data?.code === 200) {
      systemOptions.value = apiResponse.data.data || [];
    }
  } catch (error) {
    console.error("加载系统选项数据失败:", error);
  }
};

// 状态处理函数
// 获取上报状态标签类型
const getReportStatusTagType = (status: string | number) => {
  switch (String(status)) {
    case "0":
      return "info"; // 未上报 - 灰色
    case "1":
      return "success"; // 已上报 - 绿色
    case "2":
      return "danger"; // 上报失败 - 红色
    default:
      return "info";
  }
};

// 获取上报状态文本
const getReportStatusText = (status: string | number): string => {
  switch (String(status)) {
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

// 点击上报状态标签
const handleReportStatusClick = async (
  row: MetaBaseZygxxOdsXxhxtfwjlsjInfo,
) => {
  try {
    const { value } = await ElMessageBox.prompt(
      "请输入新的上报状态 (0-未上报, 1-已上报, 2-上报失败)",
      "修改上报状态",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-2]$/,
        inputErrorMessage: "请输入有效的状态值 (0, 1, 2)",
      },
    );

    if (value !== null) {
      const response = await updateSingleReportStatus(row.id as number, value);
      const apiResponse = response as unknown as {
        data: { code: number; message?: string };
      };
      if (apiResponse?.data?.code === 200) {
        ElMessage.success("上报状态修改成功");
        row.reportStatus = value;
      } else {
        ElMessage.error(apiResponse?.data?.message || "修改失败");
      }
    }
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "修改上报状态失败");
    }
  }
};

// 启用状态切换
const handleEnableStatusChange = async (
  row: MetaBaseZygxxOdsXxhxtfwjlsjInfo & { statusLoading?: boolean },
) => {
  try {
    (row as any).statusLoading = true;
    const response = await updateSingleEnableStatus(
      row.id as number,
      row.enableStatus,
    );
    const apiResponse = response as unknown as {
      data: { code: number; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      ElMessage.success("启用状态修改成功");
    } else {
      ElMessage.error(apiResponse?.data?.message || "修改失败");
      // 恢复原状态
      row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    }
  } catch (error: any) {
    ElMessage.error(error.message || "修改启用状态失败");
    // 恢复原状态
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
  } finally {
    (row as any).statusLoading = false;
  }
};

// 加载访问方式字典数据
const loadAccessMethodOptions = async () => {
  try {
    const response = await getDictOptions("FWFSDM");
    // 显式断言响应类型
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    accessMethodOptions.value = apiResponse.data.data || [];

    console.log("1111111111111111");
    console.log(accessMethodOptions.value);
  } catch (error) {
    console.error("加载访问方式字典数据失败:", error);
  }
};

/** 获取系统学校代码 */
const loadSystemSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const result = response as unknown as {
      data: { code: number; data: string; message?: string };
    };
    if (result?.data?.code === 200 && result?.data?.data) {
      systemSchoolCode.value = result.data.data;
      console.log("获取系统学校代码成功:", systemSchoolCode.value);
    } else {
      console.warn(
        "获取系统学校代码失败:",
        result?.data?.message || "未知错误",
      );
      ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
  }
};

// 初始化
onMounted(() => {
  loadAccessMethodOptions();
  loadSystemOptions();
  loadSystemSchoolCode();
  getList();
});
</script>

<style scoped lang="scss">
.entity-management {
  padding: 0px;

  .search-card {
    margin-bottom: 2px;

    :deep(.el-card__body) {
      padding: 8px 15px;
    }

    :deep(.el-form) {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 10px;
    }

    :deep(.el-form-item__label) {
      width: 70px;
      text-align: right;
      padding-right: 4px;
      font-size: 14px;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 160px;
      font-size: 14px;
    }

    :deep(.el-button) {
      font-size: 14px;
    }

    :deep(.el-form-item:last-child) {
      margin-left: auto;
      margin-right: 0;
    }
  }

  .table-card {
    margin-bottom: 10px;

    :deep(.el-card__body) {
      padding: 10px 15px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      position: relative;
    }
  }

  .table-body {
    margin-bottom: 8px;

    :deep(.el-table) {
      font-size: 14px;
    }

    :deep(.el-table__header th) {
      padding: 4px 0;
      height: 40px;
      background-color: #f5f7fa;
      font-size: 14px;
    }

    :deep(.el-table__row td) {
      padding: 4px 0;
      font-size: 14px;
    }
  }

  .operation-buttons {
    display: flex;
    align-items: center;

    .el-button {
      margin-right: 10px;
    }
  }

  .header-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .right-buttons {
    display: flex;
    align-items: center;
    gap: 10px;

    .el-button {
      margin: 0;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    margin-top: 10px;

    .total-info {
      font-size: 14px;
      color: #606266;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
    }

    :deep(.el-pagination) {
      justify-content: flex-end;
      font-size: 14px;

      .el-pagination__total {
        display: none;
      }

      .el-pagination__sizes {
        margin-right: 15px;
      }

      .btn-prev,
      .btn-next,
      .el-pager li {
        min-width: 24px;
        height: 24px;
        line-height: 24px;
      }

      .el-select .el-input {
        width: 100px;
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;

    .el-button {
      margin: 0 3px;
      padding: 0 5px;
      font-size: 14px;
    }
  }
}

.dialog-footer {
  padding-top: 10px;
  margin-top: 8px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}

/* 详情对话框样式 - 统一简洁布局 */
:deep(.el-descriptions__label) {
  width: 140px;
  font-weight: bold;
}

/* 弹窗拖拽效果 */
:deep(.el-dialog) {
  .el-dialog__header {
    cursor: move;
    user-select: none;
    transition: background-color 0.2s ease;
    border-radius: 6px 6px 0 0;

    &:hover {
      background-color: #f0f2f5;
    }

    &:active {
      background-color: #e8ebf0;
    }
  }

  .el-dialog__title {
    cursor: move;
    font-size: 16px;
    color: #409eff;

    &::before {
      content: "📋 ";
      margin-right: 4px;
    }
  }

  .el-dialog__headerbtn {
    cursor: pointer;

    &:hover {
      background-color: #f56c6c;
      border-radius: 50%;
    }
  }
}

/* 删除确认对话框样式 */
:deep(.delete-confirm-dialog) {
  .el-message-box__header {
    .el-message-box__title {
      color: #f56c6c;
      font-weight: 600;

      &::before {
        content: "⚠️ ";
        margin-right: 4px;
      }
    }
  }

  .el-message-box__content {
    .el-message-box__message {
      color: #606266;
      line-height: 1.6;
      white-space: pre-line;
      word-break: break-word;
    }
  }

  .el-message-box__btns {
    .el-button--primary {
      background-color: #f56c6c;
      border-color: #f56c6c;

      &:hover {
        background-color: #f78989;
        border-color: #f78989;
      }
    }
  }
}

/* 导入按钮白色背景样式 */
.import-button {
  background-color: #ffffff !important;
  border-color: #dcdfe6 !important;
  color: #606266 !important;

  &:hover {
    background-color: #f5f7fa !important;
    border-color: #c0c4cc !important;
    color: #409eff !important;
  }

  &:focus {
    background-color: #ffffff !important;
    border-color: #409eff !important;
    color: #409eff !important;
  }

  &:active {
    background-color: #f5f7fa !important;
    border-color: #409eff !important;
    color: #409eff !important;
  }
}

/* 导入提示图标样式 */
:deep(.import-tip-icon) {
  margin-left: 5px;
  color: #e6a23c;
  cursor: pointer;
  font-size: 14px;
  vertical-align: middle;
}

/* 上传成功提示样式 */
:deep(.el-upload__tip) {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 输入框与按钮组合样式 */
.input-with-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-btn {
  margin-left: 0;
  height: 32px;
  border-radius: 4px;
  padding: 0 12px;
  font-size: 14px;
}

/* 调整输入框样式 */
:deep(.input-with-button .el-input__wrapper) {
  width: 160px;
}
</style>
