<template>
  <div class="virtual-simulation-resource-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="资源编号" prop="zybh">
            <el-input
              v-model="queryParams.zybh"
              placeholder="请输入资源编号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="资源名称" prop="zymc">
            <el-input
              v-model="queryParams.zymc"
              placeholder="请输入资源名称"
              clearable
              @keyup.enter="handleQuery"
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
        <div class="header-title">虚拟仿真数字资源基本数据数据清洗</div>
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
            prop="zybh"
            label="资源编号"
            min-width="140"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zymc"
            label="资源名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sszyh"
            label="所属专业号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zyfzrh"
            label="资源负责人号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zyjbmText"
            label="资源级别"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zylxmText"
            label="虚拟仿真资源类型"
            min-width="140"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sssxjdbh"
            label="所属实训基地编号"
            min-width="140"
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
      style="height: 540px"
      class="virtual-simulation-dialog"
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
                clearable
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
          <el-col :span="24">
            <el-form-item label="选择资源" prop="zybh">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  width: 100%;
                "
              >
                <el-select
                  v-model="selectedResource"
                  placeholder="请输入资源编号或名称进行搜索"
                  filterable
                  remote
                  clearable
                  :remote-method="remoteMethod"
                  :loading="resourceLoading"
                  @change="handleResourceChange"
                  style="width: 100%"
                  value-key="ZYBH"
                >
                  <el-option
                    v-for="item in resourceOptions"
                    :key="item.ZYBH"
                    :label="`${item.ZYMC} (${item.ZYBH})`"
                    :value="item"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源 数字资源基本数据列表"
                  placement="top"
                  effect="dark"
                >
                  <el-icon color="#E6A23C" size="16">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源编号" prop="zybh">
              <el-input
                v-model="form.zybh"
                placeholder="选择资源后自动填充"
                maxlength="64"
                show-word-limit
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源名称" prop="zymc">
              <el-input
                v-model="form.zymc"
                placeholder="选择资源后自动填充"
                maxlength="300"
                show-word-limit
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属专业号" prop="sszyh">
              <el-input
                v-model="form.sszyh"
                placeholder="选择资源后自动填充"
                maxlength="64"
                show-word-limit
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源负责人号" prop="zyfzrh">
              <el-input
                v-model="form.zyfzrh"
                placeholder="选择资源后自动填充"
                maxlength="50"
                show-word-limit
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源级别码" prop="zyjbm">
              <el-select
                v-model="form.zyjbm"
                placeholder="请选择资源级别"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in resourceLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="虚拟仿真资源类型码" prop="zylxm">
              <el-select
                v-model="form.zylxm"
                placeholder="请选择虚拟仿真资源类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in virtualSimulationResourceTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="所属实训基地编号"
              prop="sssxjdbh"
            >
              <el-input
                v-model="form.sssxjdbh"
                placeholder="请输入所属实训基地编号"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源创建时间" prop="zycjsj">
              <el-date-picker
                v-model="form.zycjsj"
                type="datetime"
                placeholder="格式：YYYYMMDD hhmmss，如：20240101 120000"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源更新时间" prop="zygxsj">
              <el-date-picker
                v-model="form.zygxsj"
                type="datetime"
                placeholder="格式：YYYYMMDD hhmmss，如：20240101 120000"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联课程号" prop="glkch">
              <el-input
                v-model="form.glkch"
                placeholder="请输入关联课程号"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="格式：YYYYMMDD hhmmss，如：20240101 120000"
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
      <div v-else class="virtual-simulation-detail">
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
          <el-descriptions-item label="资源编号">
            <div class="detail-value">{{ form.zybh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="资源名称">
            <div class="detail-value">{{ form.zymc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="所属专业号">
            <div class="detail-value">{{ form.sszyh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="资源负责人号">
            <div class="detail-value">{{ form.zyfzrh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="资源级别">
            <div class="detail-value">
              {{ getResourceLevelText(form.zyjbm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="虚拟仿真资源类型">
            <div class="detail-value">
              {{ getVirtualSimulationResourceTypeText(form.zylxm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="所属实训基地编号">
            <div class="detail-value">{{ form.sssxjdbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="资源创建时间">
            <div class="detail-value">{{ form.zycjsj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="资源更新时间">
            <div class="detail-value">{{ form.zygxsj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="关联课程号">
            <div class="detail-value">{{ form.glkch || "-" }}</div>
          </el-descriptions-item>

          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">{{ form.sjcjsj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <div class="detail-value">
              <el-tag
                :type="form.enableStatus === '1' ? 'success' : 'danger'"
                size="small"
              >
                {{ form.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">{{
            dialogMode === "view" ? "关闭" : "取消"
          }}</el-button>
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
import { ref, reactive, computed, onMounted, nextTick } from "vue";
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
  getOdsXnfzszzyjbsjPage,
  getOdsXnfzszzyjbsjById,
  addOdsXnfzszzyjbsj,
  updateOdsXnfzszzyjbsj,
  deleteOdsXnfzszzyjbsj,
  batchDeleteOdsXnfzszzyjbsj,
  exportOdsXnfzszzyjbsj,
  getResourceLevelOptions,
  getVirtualSimulationResourceTypeOptions,
  getSystemSchoolCode,
  getResourceOptions,
  type MetaBaseZygjxOdsXnfzszzyjbsjInfo,
  type MetaBaseZygjxOdsXnfzszzyjbsjQuery,
  type MetaBaseZygjxOdsXnfzszzyjbsjForm,
  type DictOption,
} from "@/api-data/data/data_base/zygjx/ods_xnfzszzyjbsj";

// 状态定义
const loading = ref(false);
const dataList = ref<MetaBaseZygjxOdsXnfzszzyjbsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const queryParams = reactive<MetaBaseZygjxOdsXnfzszzyjbsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  zybh: "",
  zymc: "",
  sszyh: "",
  zyfzrh: "",
  zyjbm: "",
  zylxm: "",
  glkch: "",
  sssxjdbh: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 100,
});

// 表单相关
const currentRecord = ref<MetaBaseZygjxOdsXnfzszzyjbsjInfo | null>(null);

// 对话框状态
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增虚拟仿真数字资源基本数据";
    case "edit":
      return "编辑虚拟仿真数字资源基本数据";
    case "view":
      return "查看虚拟仿真数字资源基本数据详情";
    default:
      return "";
  }
});

// 组件引用
const queryForm = ref<FormInstance>();

// 字典选项
const resourceLevelOptions = ref<DictOption[]>([]);
const virtualSimulationResourceTypeOptions = ref<DictOption[]>([]);

// 远程搜索相关
const resourceOptions = ref<any[]>([]);
const resourceLoading = ref(false);
const selectedResource = ref<any>(null);

const remoteMethod = (query: string) => {
  if (query) {
    resourceLoading.value = true;
    getResourceOptions(query)
      .then((response) => {
        const apiResponse = response as unknown as {
          data: { code: number; data: any[]; message?: string };
        };
        if (apiResponse?.data?.code === 200) {
          resourceOptions.value = apiResponse.data.data;
        } else {
          resourceOptions.value = [];
        }
      })
      .finally(() => {
        resourceLoading.value = false;
      });
  } else {
    resourceOptions.value = [];
  }
};

const handleResourceChange = (selectedObj: any) => {
  if (selectedObj) {
    form.zybh = selectedObj.ZYBH;
    form.zymc = selectedObj.ZYMC;
    form.sszyh = selectedObj.SSZYH;
    form.zyfzrh = selectedObj.ZYFZRH;
  } else {
    // 清空操作
    form.zybh = "";
    form.zymc = "";
    form.sszyh = "";
    form.zyfzrh = "";
  }
};

// 表单相关
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const form = reactive<MetaBaseZygjxOdsXnfzszzyjbsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  zybh: "",
  zymc: "",
  sszyh: "",
  zyfzrh: "",
  zyjbm: "",
  zylxm: "",
  zycjsj: "",
  zygxsj: "",
  glkch: "",
  sssxjdbh: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
  ],
  xxdm: [{ max: 10, message: "学校代码长度不能超过10位", trigger: "blur" }],
  zybh: [
    { required: true, message: "请输入资源编号", trigger: "blur" },
    { max: 64, message: "资源编号长度不能超过64位", trigger: "blur" },
  ],
  zymc: [
    { required: true, message: "请输入资源名称", trigger: "blur" },
    { max: 300, message: "资源名称长度不能超过300位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 获取系统学校代码
const getSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const apiResponse = response as unknown as {
      data: { code: number; data: string; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      return apiResponse.data.data || "";
    } else {
      console.warn("获取学校代码失败:", apiResponse?.data?.message);
      return "";
    }
  } catch (error: any) {
    console.error("获取学校代码失败:", error);
    return "";
  }
};

// 获取列表数据
const getList = async () => {
  try {
    loading.value = true;
    const response = await getOdsXnfzszzyjbsjPage(queryParams);
    // 显式断言响应类型
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      dataList.value = (apiResponse.data.data.records || []).map(
        (item: any) => ({
          ...item,
          statusLoading: false,
          zyjbmText: getZyjbmText(item.zyjbm),
          zylxmText: getZylxmText(item.zylxm),
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
  queryParams.zybh = "";
  queryParams.zymc = "";
  queryParams.sszyh = "";
  queryParams.zyfzrh = "";
  queryParams.zyjbm = "";
  queryParams.zylxm = "";
  queryParams.glkch = "";
  queryParams.sssxjdbh = "";
  queryParams.sjcjsjStart = "";
  queryParams.sjcjsjEnd = "";
  queryParams.pageNum = 1;
  getList();
};

// 表格选择和分页
const handleSelectionChange = (
  selection: MetaBaseZygjxOdsXnfzszzyjbsjInfo[],
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
const handleRowClick = (row: MetaBaseZygjxOdsXnfzszzyjbsjInfo) => {
  console.log("行点击:", row);
};

const handleRowDblClick = (row: MetaBaseZygjxOdsXnfzszzyjbsjInfo) => {
  handleView(row);
};

// 重置表单
const resetForm = () => {
  currentRecord.value = null;
  selectedResource.value = null; // 重置选中对象
  resourceOptions.value = []; // 清空选项列表
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    zybh: "",
    zymc: "",
    sszyh: "",
    zyfzrh: "",
    zyjbm: "",
    zylxm: "",
    gjzhjxptzylxm: "",
    zycjsj: "",
    zygxsj: "",
    glkch: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  nextTick(() => {
    formRef.value?.clearValidate();
  });
};

// CRUD操作
const handleAdd = async () => {
  resetForm();
  dialogMode.value = "add";

  // 自动获取学校代码
  const schoolCode = await getSchoolCode();
  if (schoolCode) {
    form.xxdm = schoolCode;
  }

  dialogVisible.value = true;
};

const handleUpdate = async (row: MetaBaseZygjxOdsXnfzszzyjbsjInfo) => {
  resetForm();
  try {
    loading.value = true;
    const response = await getOdsXnfzszzyjbsjById(row.id as number);
    // 显式断言响应类型
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      currentRecord.value = apiResponse.data.data;
      Object.assign(form, apiResponse.data.data);
      // 初始化select的选中对象
      if (form.zybh) {
        selectedResource.value = {
          ZYBH: form.zybh,
          ZYMC: form.zymc,
          SSZYH: form.sszyh,
          ZYFZRH: form.zyfzrh,
        };
        // 将当前项加入到options中，以便回显
        resourceOptions.value = [selectedResource.value];
      }
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取详情失败");
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取详情失败");
  } finally {
    loading.value = false;
  }
};

const handleView = async (row: MetaBaseZygjxOdsXnfzszzyjbsjInfo) => {
  try {
    loading.value = true;
    const response = await getOdsXnfzszzyjbsjById(row.id as number);
    // 显式断言响应类型
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      currentRecord.value = apiResponse.data.data;
      Object.assign(form, apiResponse.data.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取详情失败");
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取详情失败");
  } finally {
    loading.value = false;
  }
};

// 添加处理表单提交的方法
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        submitLoading.value = true;
        if (dialogMode.value === "add") {
          await addOdsXnfzszzyjbsj(form);
          ElMessage.success("新增成功");
        } else {
          await updateOdsXnfzszzyjbsj(form);
          ElMessage.success("更新成功");
        }
        dialogVisible.value = false;
        getList();
      } catch (error: any) {
        ElMessage.error(error.message || "操作失败");
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 添加字典文本获取方法
const getResourceLevelText = (code: string | undefined) => {
  if (!code) return "-";
  const option = resourceLevelOptions.value.find((item) => item.value === code);
  return option?.label || code;
};

const getVirtualSimulationResourceTypeText = (code: string | undefined) => {
  if (!code) return "-";
  const option = virtualSimulationResourceTypeOptions.value.find(
    (item) => item.value === code,
  );
  return option?.label || code;
};

const handleDelete = (row: MetaBaseZygjxOdsXnfzszzyjbsjInfo) => {
  // 构建详细的删除提示信息
  const resourceName = row.zymc || row.zybh || "未知资源";
  const confirmMessage = `确定要删除以下虚拟仿真数字资源吗？

资源名称：${resourceName}
资源编号：${row.zybh || "无"}
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
        const response = await deleteOdsXnfzszzyjbsj(row.id as number);
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
      const resourceName = record.zymc || record.zybh || "未知资源";
      return `• ${resourceName}`;
    })
    .join("\n");

  const moreText =
    selectedRecords.length > 3
      ? `\n... 等共 ${selectedRecords.length} 条记录`
      : "";

  const confirmMessage = `确定要批量删除以下虚拟仿真数字资源吗？

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
        const response = await batchDeleteOdsXnfzszzyjbsj(selectedIds.value);
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

    const response = await exportOdsXnfzszzyjbsj(queryParams);

    // 获取blob数据
    let blob: Blob;
    if (response.data instanceof Blob) {
      blob = response.data;
    } else if (response instanceof Blob) {
      blob = response;
    } else {
      console.error("响应不是blob格式:", response);
      throw new Error("服务器返回了错误的响应格式");
    }

    // 检查blob大小
    if (blob.size === 0) {
      throw new Error("导出的文件为空，请检查数据或联系管理员");
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
    link.download = `虚拟仿真数字资源基本数据_${dateStr}_${timeStr}.xlsx`;

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

// 表单相关函数
const handleFormClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
};

const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    submitLoading.value = true;

    if (dialogMode.value === "add") {
      const response = await addOdsXnfzszzyjbsj(form);
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
      const response = await updateOdsXnfzszzyjbsj(form);
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
  dialogVisible.value = false;
};

// 获取字典文本
const getZyjbmText = (zyjbm: string): string => {
  const option = resourceLevelOptions.value.find(
    (item) => item.value === zyjbm,
  );
  return option ? option.label : zyjbm || "-";
};

const getZylxmText = (zylxm: string): string => {
  const option = virtualSimulationResourceTypeOptions.value.find(
    (item) => item.value === zylxm,
  );
  return option ? option.label : zylxm || "-";
};

// 格式化函数
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
  row: MetaBaseZygjxOdsXnfzszzyjbsjInfo,
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
      // 这里需要API支持
      ElMessage.success("上报状态修改成功");
      row.reportStatus = value;
    }
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "修改上报状态失败");
    }
  }
};

// 启用状态切换
const handleEnableStatusChange = async (
  row: MetaBaseZygjxOdsXnfzszzyjbsjInfo & { statusLoading?: boolean },
) => {
  try {
    (row as any).statusLoading = true;
    // 这里需要API支持
    ElMessage.success("启用状态修改成功");
  } catch (error: any) {
    ElMessage.error(error.message || "修改启用状态失败");
    // 恢复原状态
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
  } finally {
    (row as any).statusLoading = false;
  }
};

// 加载字典数据
const loadDictData = async () => {
  try {
    // 获取资源级别选项
    const resourceLevelResponse = await getResourceLevelOptions();
    const apiResponse1 = resourceLevelResponse as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse1?.data?.code === 200) {
      resourceLevelOptions.value = apiResponse1.data.data || [];
    }

    // 获取虚拟仿真资源类型选项
    const virtualSimulationResponse =
      await getVirtualSimulationResourceTypeOptions();
    const apiResponse2 = virtualSimulationResponse as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse2?.data?.code === 200) {
      virtualSimulationResourceTypeOptions.value = apiResponse2.data.data || [];
    }
  } catch (error) {
    console.error("加载字典数据失败:", error);
  }
};

// 初始化
onMounted(() => {
  loadDictData();
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

  .search-card {
    height: 60px;
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
}

/* 弹窗样式 */
.virtual-simulation-dialog {
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
.virtual-simulation-detail {
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
</style>
