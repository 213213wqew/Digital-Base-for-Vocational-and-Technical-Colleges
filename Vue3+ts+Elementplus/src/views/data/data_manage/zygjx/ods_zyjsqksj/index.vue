<template>
  <div class="system-building-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="课程名称" prop="zyh">
            <el-input
              v-model="queryParams.zyh"
              placeholder="请输入课程名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="课程号" prop="zdzyjbm">
            <el-input
              v-model="queryParams.zdzyjbm"
              placeholder="请输入课程号"
              clearable
            />
          </el-form-item>
          <el-form-item label="采集时间范围" prop="sjcjsjRange">
            <el-date-picker
              v-model="sjcjsjRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYYMMDD HHmmss"
              
              @change="handleSjcjsjRangeChange"
            />
          </el-form-item>
          <el-form-item label="上报状态" prop="reportStatus">
            <el-select
              v-model="queryParams.reportStatus"
              placeholder="请选择上报状态"
              clearable
            >
              <el-option label="未上报" value="0" />
              <el-option label="已上报" value="1" />
              <el-option label="上报失败" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item class="search-buttons">
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
        <div class="header-title">专业建设情况数据表数据清洗</div>
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
            prop="zyh"
            label="专业号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="重点专业级别"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getZdzyjbmText(row.zdzyjbm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="zdzylxm"
            label="重点专业类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getZdzylxmText(row.zdzylxm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="syrq"
            label="授予日期"
            min-width="120"
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
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 440px"
      class="professional-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 16px;">
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
          <el-col :span="12"style="margin-bottom: 16px;">
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
          <el-col :span="12"style="margin-bottom: 16px;">
            <el-form-item label="专业号" prop="zyh">
              <el-input
                v-model="form.zyh"
                placeholder="请输入专业号（学校自编）"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12"style="margin-bottom: 16px;">
            <el-form-item label="重点专业级别码" prop="zdzyjbm">
              <el-select
                v-model="form.zdzyjbm"
                placeholder="请选择重点专业级别码"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in zdzyjbmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"style="margin-bottom: 16px;">
            <el-form-item label="重点专业类型码" prop="zdzylxm">
              <el-select
                v-model="form.zdzylxm"
                placeholder="请选择重点专业类型码"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in zdzylxmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"style="margin-bottom: 16px;">
            <el-form-item label="授予日期" prop="syrq">
              <el-date-picker
                v-model="form.syrq"
                type="date"
                placeholder="请选择授予日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12"style="margin-bottom: 16px;">
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
          <el-col :span="12"style="margin-bottom: 16px;">
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
          <el-col :span="24"style="margin-bottom: 16px;">
            <el-form-item label="备注" prop="bz">
              <el-input
                v-model="form.bz"
                type="textarea"
                :rows="3"
                placeholder="请输入备注信息（可选，最多2000字符）"
                maxlength="2000"
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
          <el-descriptions-item label="重点专业级别">
            <div class="detail-value">
              {{ getZdzyjbmText(form.zdzyjbm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="重点专业类型">
            <div class="detail-value">
              {{ getZdzylxmText(form.zdzylxm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="授予日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.syrq) || "-" }}
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
import {
  getOdsZyjsqksjPage,
  addOdsZyjsqksj,
  updateOdsZyjsqksj,
  deleteOdsZyjsqksj,
  batchDeleteOdsZyjsqksj,
  exportOdsZyjsqksj,
  type OdsZyjsqksjDTO,
  type OdsZyjsqksjQuery,
  type OdsZyjsqksjVO,
} from "@/api-data/data/data_base/zygjx/ods_zyjsqksj";
import { getDictOptions } from "@/api-data/data/data_base/zygxx/ods_xxjbsj";
import { getSystemSchoolCode } from "@/api-data/data/data_base/zygxx/ods_xxhxtjssj";

// 字典选项接口类型
interface DictOption {
  label: string;
  value: string;
}

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsZyjsqksjVO[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const multiple = ref(false);
const selectedRows = ref<OdsZyjsqksjVO[]>([]);

// 字典选项数据
const zdzyjbmOptions = ref<DictOption[]>([]); // 重点专业级别码选项
const zdzylxmOptions = ref<DictOption[]>([]); // 重点专业类型码选项

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 采集时间范围
const sjcjsjRange = ref<[string, string] | undefined>(undefined);

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增专业建设情况数据";
    case "edit":
      return "编辑专业建设情况数据";
    case "view":
      return "查看专业建设情况数据";
    default:
      return "专业建设情况数据";
  }
});

// 查询参数
const queryParams = reactive<OdsZyjsqksjQuery>({
  pageNum: 1,
  pageSize: 100,
  zjsjwyxbs: "",
  xxdm: "",
  zyh: "",
  zdzyjbm: "",
  reportStatus: "",
  enableStatus: "",
});

// 表单数据
const form = reactive<OdsZyjsqksjDTO>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  zyh: "",
  zdzyjbm: "",
  zdzylxm: "",
  syrq: "",
  bz: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 日期时间格式验证
const validateDateTime = (_: any, value: string, callback: any) => {
  if (!value) {
    callback();
    return;
  }

  let year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number;

  // 支持新格式 YYYYMMDD HHmmss（带空格）
  if (value.length === 15 && value.includes(" ")) {
    const [datePart, timePart] = value.split(" ");
    if (datePart.length === 8 && timePart.length === 6) {
      year = parseInt(datePart.substring(0, 4));
      month = parseInt(datePart.substring(4, 6));
      day = parseInt(datePart.substring(6, 8));
      hour = parseInt(timePart.substring(0, 2));
      minute = parseInt(timePart.substring(2, 4));
      second = parseInt(timePart.substring(4, 6));
    } else {
      callback(new Error("日期时间格式不正确"));
      return;
    }
  }
  // 兼容旧格式 YYYYMMDDHHmmss（无空格）
  else if (value.length === 14) {
    year = parseInt(value.substring(0, 4));
    month = parseInt(value.substring(4, 6));
    day = parseInt(value.substring(6, 8));
    hour = parseInt(value.substring(8, 10));
    minute = parseInt(value.substring(10, 12));
    second = parseInt(value.substring(12, 14));
  } else {
    callback(new Error("日期时间格式不正确"));
    return;
  }

  const date = new Date(year, month - 1, day, hour, minute, second);

  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getSeconds() !== second
  ) {
    callback(new Error("日期时间格式不合法"));
    return;
  }

  if (date > new Date()) {
    callback(new Error("日期时间不能超过当前时间"));
    return;
  }

  callback();
};

// 表单验证规则
const rules = {
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
    {
      min: 10,
      max: 10,
      message: "学校代码长度不能超过10个字符",
      trigger: "blur",
    },
    { pattern: /^\d{10}$/, message: "学校代码必须为10位数字", trigger: "blur" },
  ],
  zyh: [
    { required: true, message: "专业号不能为空", trigger: "blur" },
    { max: 64, message: "专业号不能超过64个字符", trigger: "blur" },
  ],
  zdzyjbm: [
    { required: true, message: "重点专业级别码不能为空", trigger: "change" },
  ],
  zdzylxm: [
    { required: true, message: "重点专业类型码不能为空", trigger: "change" },
  ],
  syrq: [{ required: true, message: "授予日期不能为空", trigger: "change" }],
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "change" },
    {
      pattern: /^\d{8} \d{6}$/,
      message: "数据采集时间格式必须为YYYYMMDD HHmmss",
      trigger: "blur",
    },
    { validator: validateDateTime, trigger: "blur" },
  ],
};

// 引用
const queryFormRef = ref();
const formRef = ref();

// 获取字典数据
const loadDictData = async () => {
  // 获取重点专业级别码字典
  const zdzyjbmRes: any = await getDictOptions("ZDZYJBDM");
  if (zdzyjbmRes.data.data) {
    zdzyjbmOptions.value = zdzyjbmRes.data.data;
  }

  // 获取重点专业类型码字典
  const zdzylxmRes: any = await getDictOptions("ZDZYLXDM");
  if (zdzylxmRes.data.data) {
    zdzylxmOptions.value = zdzylxmRes.data.data;
  }
};

// 获取系统学校代码
const loadSystemSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const result = response.data as any;
    if (result?.code === 200 && result?.data) {
      systemSchoolCode.value = result.data;
      console.log("获取系统学校代码成功:", systemSchoolCode.value);
    } else {
      console.warn("获取系统学校代码失败:", result?.message || "未知错误");
      ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
  }
};

// 获取数据列表
const getList = async () => {
  loading.value = true;
  try {
    const { data }: any = await getOdsZyjsqksjPage(queryParams);
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

/** 处理采集时间范围变化 */
const handleSjcjsjRangeChange = (value: [string, string] | undefined) => {
  if (value && value.length === 2) {
    queryParams.sjcjsjStart = value[0];
    queryParams.sjcjsjEnd = value[1];
  } else {
    queryParams.sjcjsjStart = "";
    queryParams.sjcjsjEnd = "";
  }
};

// 重置查询
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.zjsjwyxbs = "";
  queryParams.xxdm = "";
  queryParams.zyh = "";
  queryParams.zdzyjbm = "";
  queryParams.reportStatus = ""; // 重置上报状态
  queryParams.sjcjsjStart = ""; // 重置采集时间开始
  queryParams.sjcjsjEnd = ""; // 重置采集时间结束
  sjcjsjRange.value = undefined; // 重置采集时间范围
  queryParams.pageNum = 1;
  getList();
};

// 多选变化
const handleSelectionChange = (selection: OdsZyjsqksjVO[]) => {
  selectedRows.value = selection;
  multiple.value = selection.length > 0;
};

// 行点击事件
const handleRowClick = () => {
  // 行点击逻辑
};

// 行双击事件
const handleRowDblClick = (row: OdsZyjsqksjVO) => {
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

// 获取重点专业级别文本
const getZdzyjbmText = (value: string | undefined) => {
  const option = zdzyjbmOptions.value.find((item) => item.value === value);
  return option ? option.label : "-";
};

// 获取重点专业类型文本
const getZdzylxmText = (value: string | undefined) => {
  const option = zdzylxmOptions.value.find((item) => item.value === value);
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

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value || "", // 自动设置学校代码
    zyh: "",
    zdzyjbm: "",
    zdzylxm: "",
    syrq: "",
    bz: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.resetFields();
};

// 新增
const handleAdd = () => {
  resetForm();
  // 自动设置学校代码
  if (systemSchoolCode.value) {
    form.xxdm = systemSchoolCode.value;
  }
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleUpdate = (row: OdsZyjsqksjVO) => {
  resetForm();
  Object.assign(form, row);
  dialogMode.value = "edit";
  dialogVisible.value = true;
};

// 查看
const handleView = (row: OdsZyjsqksjVO) => {
  resetForm();
  Object.assign(form, row);
  dialogMode.value = "view";
  dialogVisible.value = true;
};

// 删除
const handleDelete = (row: OdsZyjsqksjVO) => {
  ElMessageBox.confirm(`确定要删除"${row.zjsjwyxbs}"这条数据吗？`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await deleteOdsZyjsqksj(row.id);
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
      await batchDeleteOdsZyjsqksj(ids);
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
    const response = await exportOdsZyjsqksj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `专业建设情况数据_${new Date().getTime()}.xlsx`;
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
        await addOdsZyjsqksj(form);
        ElMessage.success("新增成功");
      } else {
        await updateOdsZyjsqksj(form);
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

<style scoped lang="scss">
.system-building-management {
  padding: 0px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  height: calc(100vh - 130px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .search-card {
    margin-bottom: 12px;
    border-radius: 12px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    flex-shrink: 0;

    :deep(.el-card__body) {
      padding: 8px 12px;
    }

    :deep(.el-form) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      justify-content: flex-start;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 0;
      flex: 0 0 auto;
    }

    :deep(.el-form-item__label) {
      width: 120px;
      text-align: right;
      padding-right: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;
      white-space: nowrap;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 200px;
      font-size: 14px;
      border-radius: 8px;
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
      }
      
      &.is-focus {
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }

    :deep(.el-date-editor) {
      width: 320px !important;
    }

    :deep(.search-buttons) {
      display: flex;
      gap: 12px;
      margin-left: auto;
      flex-shrink: 0;
    }

    :deep(.el-button) {
      font-size: 14px;
      border-radius: 8px;
      padding: 8px 20px;
      font-weight: 500;
      transition: all 0.3s ease;
      white-space: nowrap;
      
      &.el-button--primary {
        background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        }
      }
      
      &:not(.el-button--primary) {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: 1px solid #e4e7ed;
        
        &:hover {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
          border-color: #c0c4cc;
          transform: translateY(-1px);
        }
      }
    }

    :deep(.el-form-item:last-child) {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .table-card {
    margin-bottom: 0;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0; // 重要：允许flex子元素收缩

    :deep(.el-card__body) {
      padding: 8px 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0; // 重要：允许flex子元素收缩
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      position: relative;
      padding: 6px 0;
      border-bottom: 2px solid #f0f2f5;
      flex-shrink: 0;

      .header-title {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        
        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }
    }
  }

  .table-body {
    margin-bottom: 0;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0; // 重要：允许flex子元素收缩
    height: calc(100% - 50px); // 为分页组件预留空间

    :deep(.el-table) {
      font-size: 14px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      flex: 1;
      height: calc(100% - 60px) !important; // 为分页组件预留空间
    }

    :deep(.el-table__header th) {
      padding: 4px 4px;
      height: 32px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      font-size: 12px;
      font-weight: 600;
      color: #2c3e50;
      border-bottom: 2px solid #e4e7ed;
    }

    :deep(.el-table__row td) {
      padding: 2px 4px;
      font-size: 12px;
      border-bottom: 1px solid #f0f2f5;
      transition: background-color 0.2s ease;
    }

    :deep(.el-table__row:hover td) {
      background-color: #f8f9fa;
    }

    :deep(.el-table__row:nth-child(even)) {
      background-color: #fafbfc;
    }

    :deep(.el-table__fixed),
    :deep(.el-table__fixed-right) {
      box-shadow: none;
      z-index: 10;
      background: #fff;
    }

    :deep(.el-table__fixed-right::before),
    :deep(.el-table__fixed::before) {
      display: none;
    }

    :deep(.el-table__fixed-body-wrapper),
    :deep(.el-table__fixed-right-body-wrapper) {
      overflow: hidden;
    }

    :deep(.el-table__body-wrapper) {
      overflow-x: auto;
      overflow-y: auto;
      flex: 1;
    }

    :deep(.el-table__fixed-header-wrapper),
    :deep(.el-table__fixed-body-wrapper),
    :deep(.el-table__fixed-right-header-wrapper),
    :deep(.el-table__fixed-right-body-wrapper) {
      background: #fff;
      z-index: 10;
    }

    :deep(.el-table__fixed-header-wrapper .el-table__header),
    :deep(.el-table__fixed-body-wrapper .el-table__body),
    :deep(.el-table__fixed-right-header-wrapper .el-table__header),
    :deep(.el-table__fixed-right-body-wrapper .el-table__body) {
      width: 100% !important;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    margin-top: 0;
    flex-shrink: 0;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-top: 1px solid #e4e7ed;
    border-radius: 0 0 12px 12px;

    .total-info {
      color: #606266;
      font-weight: 500;
      padding: 8px 12px;
      border-radius: 20px;
      border: 1px solid #e4e7ed;

      backdrop-filter: blur(10px);
    }

    :deep(.el-pagination) {
      font-size: 12px;
      background: rgba(255, 255, 255, 0.8);
      padding: 4px 8px;
      border-radius: 20px;
      border: 1px solid #e4e7ed;
      backdrop-filter: blur(10px);

      .btn-prev,
      .btn-next,
      .el-pager li {
        min-width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 6px;
        margin: 0 2px;
        transition: all 0.3s ease;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: 1px solid #e4e7ed;

        &:hover {
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          color: white;
          border-color: #409eff;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        }

        &.active {
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          color: white;
          border-color: #409eff;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        }
      }

      .el-pagination__total {
        color: #606266;
        font-weight: 500;
      }

      .el-pagination__jump {
        color: #606266;
        font-weight: 500;
      }
    }
  }

  .operation-buttons {
    display: flex;
    align-items: center;
    gap: 12px;

    .el-button {
      margin-right: 0;
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 500;
      transition: all 0.3s ease;
      white-space: nowrap;
      
      &.el-button--primary {
        background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        }
      }
      
      &.el-button--danger {
        background: linear-gradient(135deg, #f56c6c 0%, #e74c3c 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
        }
      }
      
      &.el-button--success {
        background: linear-gradient(135deg, #67c23a 0%, #5cb85c 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
        }
      }
    }
  }

  .header-title {
    font-size: 20px;
    font-weight: 700;
    color: #2c3e50;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
  }

  .right-buttons {
    display: flex;
    align-items: center;
    gap: 12px;

    .el-button {
      margin: 0;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      padding: 0;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px) rotate(180deg);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;

    .el-button {
      margin: 0;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 6px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .system-building-dialog {
    :deep(.el-dialog) {
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      overflow: hidden;
    }

    :deep(.el-dialog__header) {
      background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
      color: white;
      padding: 20px 24px;
      
      .el-dialog__title {
        color: white;
        font-weight: 600;
      }
      
      .el-dialog__headerbtn .el-dialog__close {
        color: white;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    :deep(.el-dialog__body) {
      padding: 24px;
      max-height: 65vh;
      overflow-y: auto;
      overflow-x: hidden;
      background: #fafbfc;
    }

    :deep(.el-dialog__footer) {
      padding: 20px 24px;
      border-top: 1px solid #e4e7ed;
      background: white;
      
      .el-button {
        border-radius: 8px;
        padding: 8px 20px;
        font-weight: 500;
        transition: all 0.3s ease;
        
        &.el-button--primary {
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          border: none;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
          }
        }
      }
    }
  }

  .detail-dialog {
    :deep(.el-dialog) {
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      overflow: hidden;
    }

    :deep(.el-dialog__header) {
      background: linear-gradient(135deg, #67c23a 0%, #5cb85c 100%);
      color: white;
      padding: 20px 24px;
      
      .el-dialog__title {
        color: white;
        font-weight: 600;
      }
      
      .el-dialog__headerbtn .el-dialog__close {
        color: white;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    :deep(.el-dialog__body) {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
      overflow-x: hidden;
      background: #fafbfc;
    }
  }
}

/* 弹窗表单错误提示样式 */
:deep(.dialog-form) {
  .el-form-item {
    position: relative;
    margin-bottom: 16px;

    .el-form-item__error {
      position: absolute;
      top: 50%;
      left: calc(100% + 8px);
      transform: translateY(-50%);
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 4px 8px;
      margin: 0;
      line-height: 1.2;
      font-size: 11px;
      z-index: 1000;
      background: #fef0f0;
      border: 1px solid #fbc4c4;
      border-radius: 4px;
      color: #f56c6c;

      &:before {
        content: "!";
        display: inline-block;
        width: 14px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        border-radius: 50%;
        background-color: #f56c6c;
        color: white;
        font-size: 10px;
        margin-right: 4px;
        font-weight: bold;
      }
    }
  }

  .el-col:not(:last-child) {
    padding-right: 20px;
  }
}

/* 表单样式 */
.system-building-form {
  .form-container {
    max-height: 460px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 10px;
    padding-bottom: 5px;
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    font-size: 14px;
    color: #2c3e50;
    font-weight: 600;
    line-height: 32px;
  }

  :deep(.el-input__wrapper) {
    font-size: 14px;
    height: 32px;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
    }
    
    &.is-focus {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }

  :deep(.el-select) {
    font-size: 14px;

    .el-input__wrapper {
      height: 32px;
      border-radius: 6px;
    }
  }

  :deep(.el-textarea__inner) {
    font-size: 14px;
    border-radius: 6px;
    line-height: 1.4;
    padding: 8px 12px;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
    }
    
    &:focus {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }

  :deep(.el-date-editor) {
    font-size: 14px;

    .el-input__wrapper {
      height: 32px;
      border-radius: 6px;
    }
  }

  :deep(.el-row) {
    margin-bottom: 0;
  }
}

/* 详情样式 */
.system-building-detail {
  .detail-descriptions {
    :deep(.el-descriptions__label) {
      font-weight: 700;
      color: #2c3e50;
      width: 160px;
      font-size: 14px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    :deep(.el-descriptions__content) {
      color: #606266;
      font-size: 14px;
      padding: 12px 16px;
    }
  }

  .detail-value {
    color: #2c3e50;
    font-size: 14px;
    font-weight: 500;
  }

  .detail-link {
    font-size: 14px;
    word-break: break-all;
    color: #409eff;
    text-decoration: none;
    
    &:hover {
      color: #36a3f7;
      text-decoration: underline;
    }
  }

  .detail-description {
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e4e7ed;
  }
}

/* 导入提示图标样式 */
:deep(.import-tip-icon) {
  margin-left: 5px;
  color: #e6a23c;
  cursor: pointer;
  font-size: 14px;
  vertical-align: middle;
  transition: all 0.3s ease;
  
  &:hover {
    color: #f39c12;
    transform: scale(1.1);
  }
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

/* 导入按钮白色背景样式 */
.import-button {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
  border: 1px solid #dcdfe6 !important;
  color: #606266 !important;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%) !important;
    border-color: #c0c4cc !important;
    color: #409eff !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
    border-color: #409eff !important;
    color: #409eff !important;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }

  &:active {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%) !important;
    border-color: #409eff !important;
    color: #409eff !important;
  }
}

/* 标签样式美化 */
:deep(.el-tag) {
  border-radius: 6px;
  font-weight: 500;
  padding: 4px 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}

/* 链接样式美化 */
:deep(.el-link) {
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    text-shadow: 0 1px 2px rgba(64, 158, 255, 0.3);
  }
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .system-building-management {
    padding: 12px;
    
    .search-card {
      margin-bottom: 10px;
      
      :deep(.el-form) {
        flex-wrap: wrap;
        gap: 10px;
      }
      
      :deep(.el-input__wrapper),
      :deep(.el-select) {
        width: 180px;
      }
      
      :deep(.el-date-editor) {
        width: 280px !important;
      }
    }
    
    .table-card {
      :deep(.el-card__body) {
        padding: 12px 16px;
      }
      
      .table-header {
        margin-bottom: 12px;
        padding: 10px 0;
      }
    }
    
    .pagination-wrapper {
      padding: 12px 16px;
    }
  }
}

@media (max-width: 1200px) {
  .system-building-management {
    padding: 8px;
    
    .search-card {
      margin-bottom: 8px;
      
      :deep(.el-card__body) {
        padding: 12px 16px;
      }
      
      :deep(.el-form) {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }
      
      :deep(.el-input__wrapper),
      :deep(.el-select),
      :deep(.el-date-editor) {
        width: 100% !important;
      }
      
      :deep(.el-form-item) {
        margin-bottom: 8px;
      }
      
      :deep(.search-buttons) {
        margin-left: 0;
        justify-content: center;
      }
    }
    
    .table-card {
      :deep(.el-card__body) {
        padding: 8px 12px;
      }
      
      .table-header {
        flex-direction: column;
        gap: 12px;
        margin-bottom: 10px;
        padding: 8px 0;
        
        .header-title {
          position: static;
          transform: none;
          text-align: center;
        }
      }
    }
    
    .pagination-wrapper {
      padding: 8px 12px;
      flex-direction: column;
      gap: 8px;
      
      .total-info {
        text-align: center;
      }
    }
  }
}

@media (max-width: 768px) {
  .system-building-management {
    padding: 4px;
    
    .search-card {
      margin-bottom: 6px;
      
      :deep(.el-card__body) {
        padding: 8px 12px;
      }
      
      :deep(.el-form-item__label) {
        width: 100px;
        font-size: 13px;
      }
      
      :deep(.el-button) {
        padding: 6px 16px;
        font-size: 13px;
      }
    }
    
    .table-card {
      :deep(.el-card__body) {
        padding: 6px 8px;
      }
      
      .table-header {
        margin-bottom: 8px;
        padding: 6px 0;
        
        .operation-buttons {
          gap: 8px;
          
          .el-button {
            padding: 6px 12px;
            font-size: 13px;
          }
        }
        
        .header-title {
          font-size: 16px;
        }
      }
    }
    
    .table-body {
      :deep(.el-table__header th) {
        padding: 6px 6px;
        height: 36px;
        font-size: 13px;
      }
      
      :deep(.el-table__row td) {
        padding: 4px 6px;
        font-size: 13px;
      }
    }
    
    .pagination-wrapper {
      padding: 6px 8px;
      
      .total-info {
        font-size: 13px;
        padding: 6px 10px;
      }
      
      :deep(.el-pagination) {
        font-size: 13px;
        padding: 6px 12px;
        
        .btn-prev,
        .btn-next,
        .el-pager li {
          min-width: 28px;
          height: 28px;
          line-height: 28px;
        }
      }
    }
  }
}
</style>