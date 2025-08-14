<template>
  <div class="professional-development-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="唯一性标识" prop="zjsjwyxbs">
            <el-input
              v-model="queryParams.zjsjwyxbs"
              placeholder="请输入主键数据唯一性标识"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="学校代码" prop="xxdm">
            <el-input
              v-model="queryParams.xxdm"
              placeholder="请输入学校代码"
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
          <el-form-item label="资助等级" prop="zzdj">
            <el-input
              v-model="queryParams.zzdj"
              placeholder="请输入资助等级"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="认定状态" prop="rdzt">
            <el-input
              v-model="queryParams.rdzt"
              placeholder="请输入认定状态"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="认定日期" prop="rdrq">
            <el-input
              v-model="queryParams.rdrq"
              placeholder="请输入认定日期"
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
        <div class="header-title">贫困生认定数据管理</div>
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
          :height="'calc(75vh - 135px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            label="唯一性标识"
            prop="zjsjwyxbs"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            label="学校代码"
            prop="xxdm"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            label="学号"
            prop="xh"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            label="资助等级"
            prop="zzdj"
            min-width="120"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{ getZzdjText(row.zzdj) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="认定状态"
            prop="rdzt"
            min-width="120"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{ getRdztText(row.rdzt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="认定日期"
            prop="rdrq"
            min-width="120"
            align="center"
          />
          <el-table-column
            label="数据采集时间"
            prop="sjcjsj"
            min-width="160"
            align="center"
          />
          <el-table-column
            label="上报状态"
            prop="reportStatus"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="getReportStatusTagType(row.reportStatus)">
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="启用状态"
            prop="enableStatus"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="row.enableStatus === '1' ? 'success' : 'danger'">
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
                placeholder="请输入学号关键字搜索"
                clearable
                filterable
                remote
                :remote-method="searchStudent"
                :loading="studentLoading"
                style="width: 100%"
              >
                <el-option
                  v-for="item in studentOptions"
                  :key="item.xh"
                  :label="item.label"
                  :value="item.xh"
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
            <el-form-item label="资助等级" prop="zzdj">
              <el-select
                v-model="form.zzdj"
                placeholder="请选择资助等级"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in zzdjOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="认定状态" prop="rdzt">
              <el-select
                v-model="form.rdzt"
                placeholder="请选择认定状态"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in rdztOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="认定日期" prop="rdrq">
              <el-date-picker
                v-model="form.rdrq"
                type="date"
                placeholder="请选择认定日期"
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
      <div v-else class="professional-detail">
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
          <el-descriptions-item label="学号">
            <div class="detail-value">{{ form.xh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="资助等级">
            <div class="detail-value">{{ getZzdjText(form.zzdj) }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="认定状态">
            <div class="detail-value">{{ getRdztText(form.rdzt) }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="认定日期">
            <div class="detail-value">{{ form.rdrq || "-" }}</div>
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
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            @click="handleSubmit"
            :loading="submitLoading"
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

// API导入
import {
  getOdsPksrdsjPage,
  getOdsPksrdsjById,
  addOdsPksrdsj,
  updateOdsPksrdsj,
  deleteOdsPksrdsj,
  batchDeleteOdsPksrdsj,
  exportOdsPksrdsj,
  getStudentOptions,
  type OdsPksrdsjInfo,
  type OdsPksrdsjQuery,
  type OdsPksrdsjForm,
} from "@/api-code/code/code_base/zygxs/ods_pksrdsj";
import {
  getDictOptions,
} from "@/api-code/code/code_base/zygxx/ods_xxjbsj";
import { getSystemSchoolCode } from "@/api-code/code/code_base/zygxx/ods_xxhxtjssj";

// 字典选项
interface DictOption {
  label: string;
  value: string;
}

// 学生选项
interface StudentOption {
  xh: string; // xh
  label: string; // xh - xsxm
  xsxm: string;
}

// 本地实现的 getDictLabel
const getDictLabel = (
  options: DictOption[],
  value: string | undefined,
): string => {
  if (value === undefined || value === null) return "";
  const option = options.find((item) => item.value === value);
  return option ? option.label : value;
};

// 搜索条件
const queryParams = reactive<OdsPksrdsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  zzdj: "",
  rdzt: "",
  rdrq: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 100,
});

// 表格数据
const dataList = ref<OdsPksrdsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);

// 弹窗相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);

const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增贫困生认定数据";
    case "edit":
      return "编辑贫困生认定数据";
    case "view":
      return "查看贫困生认定数据";
    default:
      return "贫困生认定数据";
  }
});

// 表单相关
const formRef = ref<FormInstance>();
const form = reactive<OdsPksrdsjForm & { enableStatus?: string }>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  zzdj: "",
  rdzt: "",
  rdrq: "",
  sjcjsj: "",
  enableStatus: "1",
});

const formRules = reactive({
  zjsjwyxbs: [
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
    {
      min: 10,
      max: 10,
      message: "学校代码长度必须为10个字符",
      trigger: "blur",
    },
  ],  
  rdzt: [ { required: true, message: "认定状态不能为空", trigger: "blur" }],
  rdrq: [ { required: true, message: "认定日期不能为空", trigger: "blur" }],
  sjcjsj: [ { required: true, message: "数据采集时间不能为空", trigger: "blur" }],
  csxmmc: [ { required: true, message: "测试项目名称不能为空", trigger: "blur" }],
  xh: [ { required: true, max: 20, message: "学号长度不能超过20位", trigger: "blur" }],
  zzdj: [{ required: true, message: "请选择资助等级", trigger: "change" }],
});

// 字典数据
const zzdjOptions = ref<DictOption[]>([]);
const rdztOptions = ref<DictOption[]>([]);
const reportStatusOptions = ref<any[]>([]);
const studentOptions = ref<StudentOption[]>([]);
const studentLoading = ref(false);

const loadDictData = async () => {
  const zzdjRes: any = await getDictOptions("ZZDJDM");
  zzdjOptions.value = zzdjRes.data.data;
  const rdztRes: any = await getDictOptions("RDZTDM");
  rdztOptions.value = rdztRes.data.data;
  const reportStatusRes: any = await getDictOptions("REPORT_STATUS");
  reportStatusOptions.value = reportStatusRes.data.data;
};

// 远程搜索学生
const searchStudent = async (keyword: string) => {
  if (keyword) {
    studentLoading.value = true;
    try {
      const res: any = await getStudentOptions(keyword);
      
      if (res.data.code === 200) {
 
        
        studentOptions.value = res.data.data;
      } else {
        studentOptions.value = [];
      }
    } catch (error) {
      studentOptions.value = [];
    } finally {
      studentLoading.value = false;
    }
  } else {
    studentOptions.value = [];
  }
};

const getZzdjText = (value: string | undefined) => {
  return getDictLabel(zzdjOptions.value, value);
};

const getRdztText = (value: string | undefined) => {
  return getDictLabel(rdztOptions.value, value);
};

const getReportStatusText = (status: string | undefined) => {
  return getDictLabel(reportStatusOptions.value, status) || "未知";
};

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

// 系统学校代码
const systemSchoolCode = ref<string>("");

const loadSystemSchoolCode = async () => {
  try {
    const response = (await getSystemSchoolCode()) as any;
    if (response.data?.code === 200 && response.data?.data) {
      systemSchoolCode.value = response.data.data;
    } else {
      ElMessage.warning("获取系统学校代码失败");
    }
  } catch (error) {
    ElMessage.error("获取系统学校代码异常");
  }
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsPksrdsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询贫困生认定数据失败:", error);
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
    zzdj: "",
    rdzt: "",
    rdrq: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 100,
  });
  getList();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value || "",
    xh: "",
    zzdj: "",
    rdzt: "",
    rdrq: "",
    sjcjsj: "",
    enableStatus: "1",
  });
  formRef.value?.resetFields();
  studentOptions.value = [];
};

// 新增
const handleAdd = () => {
  resetForm();
  form.xxdm = systemSchoolCode.value;
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsPksrdsjInfo) => {
  resetForm();
  dialogMode.value = "edit";
  try {
    const response: any = await getOdsPksrdsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      // 手动设置初始的学生选项，以便回显
      if (form.xh) {
        studentOptions.value = [
          {
            xh: form.xh,
            label: `${form.xh} - ${(response.data.data as any).xsxm || ""}`,
            xsxm: (response.data.data as any).xsxm || "",
          },
        ];
      }
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取贫困生认定数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看
const handleView = async (row: OdsPksrdsjInfo) => {
  resetForm();
  dialogMode.value = "view";
  try {
    const response: any = await getOdsPksrdsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取贫困生认定数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsPksrdsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条贫困生认定数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsPksrdsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除贫困生认定数据失败:", error);
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
      `确定要删除选中的 ${selectedIds.value.length} 条贫困生认定数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsPksrdsj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除贫困生认定数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsPksrdsj(queryParams);
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `贫困生认定数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出贫困生认定数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表格选择变化
const handleSelectionChange = (selection: OdsPksrdsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行双击
const handleRowDblClick = (row: OdsPksrdsjInfo) => {
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
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsPksrdsj(form);
    } else {
      response = await updateOdsPksrdsj(form);
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
    //
  } finally {
    submitLoading.value = false;
  }
};

// 页面加载
onMounted(() => {
  loadSystemSchoolCode();
  loadDictData();
  getList();
});
</script>

<style lang="scss" scoped>
/* 主容器样式 */
.professional-development-management {
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
