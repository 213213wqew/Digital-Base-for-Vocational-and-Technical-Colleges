<template>
  <div class="psychological-consultation-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryRef" :inline="true">
          <el-form-item label="咨询日期" prop="zxrqRange">
            <el-date-picker
              v-model="zxrqRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              clearable
            />
          </el-form-item>
          <el-form-item label="咨询人次" prop="zxrcRange">
            <el-input
              v-model.number="queryParams.zxrcMin"
              placeholder="最小值"
              style="width: 100px"
              type="number"
              clearable
            />
            <span style="margin: 0 10px">~</span>
            <el-input
              v-model.number="queryParams.zxrcMax"
              placeholder="最大值"
              style="width: 100px"
              type="number"
              clearable
            />
          </el-form-item>
          <el-form-item label="关键词" prop="gjc">
            <el-input
              v-model="queryParams.gjc"
              placeholder="请输入关键词"
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
            :disabled="selections.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">心理咨询记录数据管理</div>
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
            prop="zxrq"
            label="咨询日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="zxrc"
            label="咨询人次"
            min-width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="gjc"
            label="关键词"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="yyrc"
            label="预约人次"
            min-width="100"
            align="center"
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
      v-model="dialog.visible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 560px"
      class="consultation-dialog"
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
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可不填，系统自动生成32位唯一编码，如需手动填写必须是32位大写字母和数字组合"
                :readonly="isViewMode"
                maxlength="32"
                show-word-limit
                @input="handleZjsjwyxbsInput"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="请输入10位数字码"
                disabled
                maxlength="10"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="咨询日期" prop="zxrq">
              <el-date-picker
                v-model="form.zxrq"
                type="date"
                placeholder="请选择咨询日期"
                :readonly="isViewMode"
                value-format="YYYYMMDD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="咨询人次" prop="zxrc">
              <el-input-number
                v-model="form.zxrc"
                :min="0"
                :max="99999999"
                placeholder="请输入咨询人次（最多8位数字）"
                :readonly="isViewMode"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关键词" prop="gjc">
              <el-input
                v-model="form.gjc"
                type="textarea"
                placeholder="请输入关键词，最多2000个字符"
                :readonly="isViewMode"
                maxlength="2000"
                show-word-limit
                :rows="4"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预约人次" prop="yyrc">
              <el-input-number
                v-model="form.yyrc"
                :min="0"
                :max="99999999"
                placeholder="请输入预约人次（最多8位数字，选填）"
                :readonly="isViewMode"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间"
                :readonly="isViewMode"
                value-format="YYYYMMDD HHmmss"
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
      <div v-else class="consultation-detail">
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
          <el-descriptions-item label="咨询日期">
            <div class="detail-value">{{ formatDisplayDate(form.zxrq) || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="咨询人次">
            <div class="detail-value">{{ form.zxrc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="关键词" :span="2">
            <div class="detail-value">{{ form.gjc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="预约人次">
            <div class="detail-value">{{ form.yyrc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayDateTime(form.sjcjsj) || "-" }}
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
          <el-button @click="dialog.visible = false">取消</el-button>
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
import { ref, reactive, onMounted, watch, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  View,
  Edit,
} from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import {
  getOdsXlzxjlsjPage,
  getOdsXlzxjlsjById,
  addOdsXlzxjlsj,
  updateOdsXlzxjlsj,
  deleteOdsXlzxjlsj,
  batchDeleteOdsXlzxjlsj,
  getSchoolCode,
  exportOdsXlzxjlsj,
  type OdsXlzxjlsjForm,
  type OdsXlzxjlsjInfo,
  type OdsXlzxjlsjQuery,
} from "@/api-data/data/data_base/zygxs/ods_xlzxjlsj";
const schoolCode = ref("");
// 响应式数据
const loading = ref(false);
const dataList = ref<OdsXlzxjlsjInfo[]>([]);
const total = ref(0);
const selections = ref<OdsXlzxjlsjInfo[]>([]);
const zxrqRange = ref<[string, string]>(["", ""]);
const dialogMode = ref<"add" | "edit" | "view">("add");

// 查询参数
const queryParams = reactive<OdsXlzxjlsjQuery>({
  zjsjwyxbs: "",
  xxdm:schoolCode.value,
  zxrqStart: "",
  zxrqEnd: "",
  zxrcMin: undefined,
  zxrcMax: undefined,
  gjc: "",
  yyrcMin: undefined,
  yyrcMax: undefined,
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 100,
});

// 表单相关
const formRef = ref<FormInstance>();
const queryRef = ref<FormInstance>();

const dialog = reactive({
  visible: false,
  title: "",
  type: "",
});

const form = reactive<OdsXlzxjlsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm:schoolCode.value,
  zxrq: "",
  zxrc: undefined,
  gjc: "",
  yyrc: undefined,
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 计算属性
const isViewMode = computed(() => dialogMode.value === 'view');

const dialogTitle = computed(() => {
  const titles = {
    add: "新增心理咨询记录数据",
    edit: "编辑心理咨询记录数据", 
    view: "查看心理咨询记录数据详情",
  };
  return titles[dialogMode.value];
});

// 表单验证规则
const rules: FormRules = {
  zjsjwyxbs: [
    { required: false, message: "主键数据唯一性标识可以为空", trigger: "blur" },
    { pattern: /^[A-Z0-9]{32}$/, message: "唯一编码必须是32位大写字母和数字的组合", trigger: "blur" }
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10个字符", trigger: "blur" }
  ],
  zxrq: [
    { required: true, message: "咨询日期不能为空", trigger: "change" },
    { pattern: /^\d{8}$/, message: "咨询日期格式必须为YYYYMMDD", trigger: "change" }
  ],
  zxrc: [
    { required: true, message: "咨询人次不能为空", trigger: "blur" },
    { type: "number", message: "咨询人次必须为数字", trigger: "blur" },
    { pattern: /^\d{1,8}$/, message: "咨询人次不能超过8位数字", trigger: "blur" }
  ],
  gjc: [
    { required: true, message: "关键词不能为空", trigger: "blur" },
    { max: 2000, message: "关键词长度不能超过2000个字符", trigger: "blur" }
  ],
  yyrc: [
    { type: "number", message: "预约人次必须为数字", trigger: "blur" },
    { pattern: /^\d{1,8}$/, message: "预约人次不能超过8位数字", trigger: "blur" }
  ],
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "blur" },
    { pattern: /^\d{8} \d{6}$/, message: "数据采集时间格式必须为YYYYMMDD hhmmss", trigger: "blur" }
  ]
};

// 监听日期范围变化
watch(
  () => zxrqRange.value,
  (newVal) => {
    if (newVal && newVal.length === 2) {
      queryParams.zxrqStart = newVal[0];
      queryParams.zxrqEnd = newVal[1];
    } else {
      queryParams.zxrqStart = "";
      queryParams.zxrqEnd = "";
    }
  },
  { deep: true },
);

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsXlzxjlsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records || [];
      total.value = response.data.data.total || 0;
    }
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

// 重置搜索
const resetQuery = () => {
  if (queryRef.value) {
    queryRef.value.resetFields();
  }
  zxrqRange.value = ["", ""];
  queryParams.pageNum = 1;
  getList();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm:schoolCode.value,
    zxrq: "",
    zxrc: undefined,
    gjc: "",
    yyrc: undefined,
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialog.visible = true;
};

// 编辑
const handleUpdate = async (row: OdsXlzxjlsjInfo) => {
  try {
    const response: any = await getOdsXlzxjlsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "edit";
      dialog.visible = true;
    }
  } catch (error) {
    console.error("获取数据详情失败:", error);
    ElMessage.error("获取数据详情失败");
  }
};

// 查看
const handleView = async (row: OdsXlzxjlsjInfo) => {
  try {
    const response: any = await getOdsXlzxjlsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "view";
      dialog.visible = true;
    }
  } catch (error) {
    console.error("获取数据详情失败:", error);
    ElMessage.error("获取数据详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsXlzxjlsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条记录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsXlzxjlsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selections.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selections.value.length} 条数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const ids = selections.value.map((item) => item.id);
    const response: any = await batchDeleteOdsXlzxjlsj(ids);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selections.value = [];
      getList();
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出数据，请稍候...");
    const response: any = await exportOdsXlzxjlsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `心理咨询记录数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表格相关事件
const handleSelectionChange = (selection: OdsXlzxjlsjInfo[]) => {
  selections.value = selection;
};

const handleRowClick = (row: OdsXlzxjlsjInfo) => {
  // 可以在这里添加行点击逻辑
};

const handleRowDblClick = (row: OdsXlzxjlsjInfo) => {
  handleView(row);
};

// 分页事件
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    
    let response: any;
    if (dialogMode.value === "add") {
      // 如果是新增且唯一编码为空，后端会自动生成
      response = await addOdsXlzxjlsj(form);
      if (response.data.code === 200) {
        ElMessage.success("新增成功");
      }
    } else if (dialogMode.value === "edit") {
      // 编辑时需要验证唯一编码格式
      if (!form.zjsjwyxbs) {
        ElMessage.error("编辑时唯一编码不能为空");
        return;
      }
      response = await updateOdsXlzxjlsj(form);
      if (response.data.code === 200) {
        ElMessage.success("更新成功");
      }
    }

    dialog.visible = false;
    getList();
  } catch (error) {
    console.error("保存失败:", error);
    ElMessage.error("保存失败");
  }
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    "0": "未上报",
    "1": "已上报", 
    "2": "上报失败",
  };
  return statusMap[status] || "未知";
};

// 获取上报状态标签类型
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

// 格式化日期显示
const formatDisplayDate = (date?: string) => {
  if (!date) return "";
  if (date.length === 8) {
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  }
  return date;
};

// 格式化日期时间显示
const formatDisplayDateTime = (dateTime?: string) => {
  if (!dateTime) return "";
  if (dateTime.length === 15) {
    return `${dateTime.slice(0, 4)}-${dateTime.slice(4, 6)}-${dateTime.slice(6, 8)} ${dateTime.slice(8, 10)}:${dateTime.slice(10, 12)}:${dateTime.slice(12, 14)}`;
  }
  return dateTime;
};

// 添加输入处理函数
const handleZjsjwyxbsInput = (value: string) => {
  if (value) {
    // 自动转换为大写
    form.zjsjwyxbs = value.toUpperCase();
  }
};

const getSchoolCodeData = async () => {
  const response: any = await getSchoolCode();
  if (response.data.code === 200) {
    schoolCode.value = response.data.data;
  }
};

// 初始化
onMounted(() => {
  getSchoolCodeData();
  getList();
});
</script>

<style scoped lang="scss">
.psychological-consultation-management {
  background: #f5f5f5;
  min-height: calc(75vh - 100px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .search-card {
    margin-top: -20px !important;
    margin-bottom: 0;
    border-radius: 8px;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .search-bar {
      .el-form {
        .el-form-item {
          margin-bottom: 0;
          margin-right: 16px;

          .el-input,
          .el-select,
          .el-date-picker {
            width: 200px;
          }
        }

        .el-button {
          margin-left: 8px;
        }
      }
    }
  }

  .table-card {
  margin-top: -20px !important;
    flex: 1;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0 12px 0;
      border-bottom: 1px solid #e8e8e8;

      .operation-buttons {
        display: flex;
        align-items: center;
        gap: 8px;

        .el-button {
          border-radius: 6px;
          font-weight: 500;
        }

        .el-divider {
          margin: 0 8px;
        }
      }

      .header-title {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        flex: 1;
        text-align: center;
      }

      .placeholder {
        width: 120px;
        display: flex;
        justify-content: flex-end;
      }
    }

    .table-body {
      flex: 1;
      overflow: hidden;
      
      .el-table {
        height: 100%;
        border-radius: 6px;
        overflow: hidden;

        .el-table__header {
          th {
            background: #f8fafc;
            color: #374151;
            font-weight: 600;
            border-bottom: 1px solid #e5e7eb;
          }
        }

        .el-table__body {
          tr {
            &:hover {
              background: #f8fafc;
            }

            td {
              border-bottom: 1px solid #f3f4f6;
            }
          }
        }

        .action-buttons {
          display: flex;
          gap: 4px;
          justify-content: center;

          .el-button {
            padding: 4px 8px;
            font-size: 12px;
            border-radius: 4px;
          }
        }

        :deep(.el-table__body-wrapper) {
          height: calc(65vh - 180px) !important;
          overflow-y: auto;
        }
      }
    }

    .pagination-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 0;
      margin-top: 2px;
      border-top: 1px solid #e8e8e8;

      .total-info {
        color: #6b7280;
        font-size: 14px;
      }

      .pagination-controls {
        .el-pagination {
          --el-pagination-font-size: 13px;
          --el-pagination-button-width: 24px;
          --el-pagination-button-height: 24px;
          
          :deep(.el-pager li),
          :deep(.btn-prev),
          :deep(.btn-next) {
            min-width: 24px;
            height: 24px;
            line-height: 24px;
          }
          
          :deep(.el-pagination__sizes) {
            .el-input__inner {
              height: 24px;
              line-height: 24px;
            }
          }
        }
      }
    }
  }
}

.consultation-dialog {
  .el-dialog__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    margin: 0;
    padding: 20px 24px;
    border-radius: 8px 8px 0 0;

    .el-dialog__title {
      color: white;
      font-weight: 600;
      font-size: 16px;
    }

    .el-dialog__headerbtn {
      .el-dialog__close {
        color: white;
        font-size: 18px;
      }
    }
  }

  .el-dialog__body {
    padding: 24px;
    max-height: 70vh;
    overflow-y: auto;

    .el-form {
      .el-form-item {
        margin-bottom: 16px;

        .el-form-item__label {
          color: #374151;
          font-weight: 500;
          line-height: 32px;
        }

        .el-input,
        .el-select,
        .el-date-picker {
          .el-input__inner,
          .el-input__wrapper {
            border-radius: 6px;
            border: 1px solid #d1d5db;
            transition: all 0.3s ease;

            &:hover {
              border-color: #9ca3af;
            }

            &:focus {
              border-color: #667eea;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
          }
        }

        .el-textarea {
          .el-textarea__inner {
            border-radius: 6px;
            border: 1px solid #d1d5db;
            resize: vertical;
            min-height: 80px;
          }
        }
      }
    }

    .consultation-detail {
      .detail-descriptions {
        .el-descriptions__header {
          margin-bottom: 16px;

          .el-descriptions__title {
            color: #1f2937;
            font-weight: 600;
            font-size: 16px;
          }
        }

        .el-descriptions__body {
          .el-descriptions__table {
            .el-descriptions__cell {
              padding: 12px 16px;
              border: 1px solid #e5e7eb;

              &.is-label {
                background: #f8fafc;
                color: #374151;
                font-weight: 500;
                width: 120px;
              }

              .detail-value {
                color: #1f2937;
                word-break: break-all;
              }
            }
          }
        }
      }
    }
  }

  .el-dialog__footer {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    background: #f8fafc;
    border-radius: 0 0 8px 8px;

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;

      .el-button {
        padding: 8px 20px;
        border-radius: 6px;
        font-weight: 500;
        min-width: 80px;
      }
    }
  }
}

// 统一表单项间距
:deep(.el-form-item) {
  margin-bottom: 22px !important;
}

:deep(.el-row) {
  margin-bottom: 0 !important;

  .el-form-item {
    margin-bottom: 22px !important;
  }
}

// 对话框样式
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

// 详情样式
.consultation-detail {
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

// 按钮间距
:deep(.el-button + .el-button) {
  margin-left: 8px;
}

// 卡片样式
:deep(.el-card) {
  .el-card__body {
    padding: 20px;
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .psychological-consultation-management {
    .search-card {
      .search-bar {
        .el-form {
          .el-form-item {
            .el-input,
            .el-select,
            .el-date-picker {
              width: 160px;
            }
          }
        }
      }
    }

    .table-card {
      .table-header {
        .header-title {
          font-size: 14px;
        }
      }
    }
  }

  .consultation-dialog {
    width: 90% !important;
  }
}

@media (max-width: 768px) {
  .psychological-consultation-management {
    min-height: calc(100vh - 80px);
    padding: 8px;

    .search-card {
      .search-bar {
        .el-form {
          .el-form-item {
            margin-right: 8px;
            margin-bottom: 8px;

            .el-input,
            .el-select,
            .el-date-picker {
              width: 140px;
            }
          }
        }
      }
    }

    .table-card {
      .table-header {
        flex-direction: column;
        gap: 12px;
        text-align: center;

        .operation-buttons {
          order: 2;
          flex-wrap: wrap;
          justify-content: center;
        }

        .header-title {
          order: 1;
        }

        .placeholder {
          order: 3;
          width: auto;
          justify-content: center;
        }
      }

      .pagination-wrapper {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }
    }
  }

  .consultation-dialog {
    width: 95% !important;
    margin: 5vh auto !important;

    .el-dialog__body {
      padding: 16px;

      .el-form {
        .el-row {
          .el-col {
            &[span="12"] {
              flex: 0 0 100%;
              max-width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
