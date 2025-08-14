<template>
  <div class="teacher-portrait-management">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
        class="search-bar"
        size="small"
      >
        <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
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
          <el-form-item label="教工号" prop="jgh">
            <el-input
              v-model="queryParams.jgh"
              placeholder="请输入教工号"
              clearable
            @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="教师姓名" prop="jsxm">
            <el-input
              v-model="queryParams.jsxm"
              placeholder="请输入教师姓名"
              clearable
            @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">
            搜索
            </el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <div class="table-header">
        <div class="operation-buttons">
          <el-button type="primary" :icon="Plus" @click="handleAdd">
            新增
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="multipleSelection.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
          <el-button type="success" :icon="Download" @click="handleExport">
            导出
          </el-button>
        </div>
        <div class="header-title">教师画像数据编码管理</div>
        
      </div>

      <div class="table-body">
        <el-table
          height="calc(75vh-100px)"
          v-loading="loading"
          :data="dataList"
          @selection-change="handleSelectionChange"
          border
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column type="index" label="序号" width="55" align="center" />
          <el-table-column
            prop="zjsjwyxbs"
            label="主键数据唯一性标识"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jgh"
            label="教工号"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jsxm"
            label="教师姓名"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sjkbfwcs"
            label="数据看板访问次数"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="pjwdjjg"
            label="评价维度及结果"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sjscrq"
            label="数据生成日期"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sjkbzxfwrq"
            label="数据看板最新访问日期"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sjcjsj"
            label="数据采集时间"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="reportStatus"
            label="上报状态"
            align="center"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="getReportStatusType(row.reportStatus)">
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="enableStatus"
            label="启用状态"
            align="center"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="getEnableStatusType(row.enableStatus)">
                {{ getEnableStatusText(row.enableStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button
                  type="primary"
                  link
                  :icon="View"
                  @click="handleView(row)"
                >
                  查看
                </el-button>
                <el-button
                  type="primary"
                  link
                  :icon="Edit"
                  @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  link
                  :icon="Delete"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-wrapper">
        <div class="total-info">
          共 {{ total }} 条
        </div>
        <div class="pagination-controls">
          <el-pagination
            v-model:current-page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>

    <!-- 新增/编辑/查看对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 600px"
      class="teacher-portrait-dialog draggable-dialog"
      destroy-on-close
    >
      <!-- 表单模式 -->
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="dynamicRules"
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
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="请输入学校代码"
                maxlength="10"
                show-word-limit
                clearable
                :disabled="true"
              >
                <template #append>
                  <el-tooltip
                    content="系统自动获取学校代码"
                    placement="top"
                    effect="light"
                  >
                    <el-icon><Warning /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="教工号" prop="jgh">
              <el-input
                v-model="form.jgh"
                placeholder="请输入教工号"
                maxlength="20"
                show-word-limit
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教师姓名" prop="jsxm">
              <el-input
                v-model="form.jsxm"
                placeholder="请输入教师姓名"
                maxlength="36"
                show-word-limit
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="数据看板访问次数" prop="sjkbfwcs">
              <el-input-number
                v-model="form.sjkbfwcs"
                :min="0"
                :max="9999999999"
                placeholder="请输入数据看板访问次数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="评价维度及结果" prop="pjwdjjg">
              <div style="display: flex; width: 100%; flex-direction: column;">
                <el-input
                  v-model="form.pjwdjjg"
                  type="textarea"
                  :rows="4"
                  placeholder="可直接输入，或点击下方按钮进行结构化填写"
                  maxlength="2000"
                  show-word-limit
                  clearable
                />
                <div style="margin-top: 8px;">
                  <el-button
                    type="primary"
                    @click="handleOpenEvaluationForm"
                  >
                    <el-icon style="margin-right: 4px;"><Edit /></el-icon>
                    详细填写
                  </el-button>
                  <el-button
                    type="info"
                    @click="handleViewJson"
                    style="margin-left: 8px;"
                  >
                    <el-icon style="margin-right: 4px;"><View /></el-icon>
                    查看JSON
                  </el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="数据生成日期" prop="sjscrq">
              <el-date-picker
                v-model="form.sjscrq"
                type="date"
                placeholder="请选择数据生成日期"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据看板最新访问日期" prop="sjkbzxfwrq">
              <el-date-picker
                v-model="form.sjkbzxfwrq"
                type="date"
                placeholder="请选择数据看板最新访问日期"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
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
        </el-row>

        <el-row :gutter="20">
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
      <div v-else class="teacher-portrait-detail">
        <el-descriptions
          :column="2"
          border
          class="detail-descriptions"
        >
          <el-descriptions-item label="主键数据唯一性标识">
            <div class="detail-value">{{ form.zjsjwyxbs }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ form.xxdm }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教工号">
            <div class="detail-value">{{ form.jgh }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教师姓名">
            <div class="detail-value">{{ form.jsxm }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据看板访问次数">
            <div class="detail-value">{{ form.sjkbfwcs }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="评价维度及结果">
            <div class="detail-value">{{ form.pjwdjjg }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据生成日期">
            <div class="detail-value">{{ form.sjscrq }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据看板最新访问日期">
            <div class="detail-value">{{ form.sjkbzxfwrq }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">{{ form.sjcjsj }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <div class="detail-value">
              <el-tag :type="getReportStatusType(form.reportStatus)">
                {{ getReportStatusText(form.reportStatus) }}
              </el-tag>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <div class="detail-value">
              <el-tag :type="getEnableStatusType(form.enableStatus)">
                {{ getEnableStatusText(form.enableStatus) }}
              </el-tag>
            </div>
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

    <!-- JSON 查看器弹窗 -->
    <el-dialog
      v-model="jsonViewerVisible"
      title="查看JSON内容"
      width="600px"
      append-to-body
    >
      <div class="json-viewer">
        <pre>{{ formattedJson }}</pre>
      </div>
      <template #footer>
        <el-button @click="jsonViewerVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 评价维度表单弹窗 -->
    <EvaluationForm
      v-if="evaluationFormVisible"
      v-model="evaluationFormVisible"
      :initial-value="form.pjwdjjg"
      :jgh="form.jgh"
      :jsxm="form.jsxm"
      @submit="handleEvaluationSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  View,
  Edit,
  Warning
} from "@element-plus/icons-vue";
import {
  getOdsJshxsjPage,
  deleteOdsJshxsj,
  batchDeleteOdsJshxsj,
  exportOdsJshxsj,
  getOdsJshxsjById,
  addOdsJshxsj,
  updateOdsJshxsj,
} from "@/api-code/code/code_base/zygjg/ods_jshxsj";
import type {
  OdsJshxsjInfo,
  OdsJshxsjQuery,
  OdsJshxsjForm,
} from "@/api-code/code/code_base/zygjg/ods_jshxsj";
import { getSystemSchoolCode } from "@/api-code/code/code_base/zygxx/ods_xxhxtjssj";
import EvaluationForm from "./components/EvaluationForm.vue";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsJshxsjInfo[]>([]);
const total = ref(0);
const multipleSelection = ref<OdsJshxsjInfo[]>([]);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const systemSchoolCode = ref<string>("");
const evaluationFormVisible = ref(false);
const jsonViewerVisible = ref(false);

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增教师画像数据";
    case "edit":
      return "编辑教师画像数据";
    case "view":
      return "查看教师画像数据";
    default:
      return "教师画像数据";
  }
});

const formattedJson = computed(() => {
  if (!form.pjwdjjg) {
    return "无内容";
  }
  try {
    const obj = JSON.parse(form.pjwdjjg);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return form.pjwdjjg; // 如果不是有效的JSON，则按原样显示
  }
});

const dynamicRules = computed<FormRules>(() => {
  const rules: FormRules = {
    xxdm: [
      { required: true, message: "学校代码系统自动获取", trigger: "blur" },
      { min: 10, max: 10, message: "学校代码长度不能超过10个字符", trigger: "blur" },
      { pattern: /^\d{10}$/, message: "学校代码必须为10位数字", trigger: "blur" },
    ],
    jgh: [
      { required: true, message: "教工号不能为空", trigger: "blur" },
      { max: 20, message: "教工号不能超过20个字符", trigger: "blur" },
    ],
    jsxm: [
      { required: true, message: "教师姓名不能为空", trigger: "blur" },
      { max: 36, message: "教师姓名不能超过36个字符", trigger: "blur" },
    ],
    sjkbfwcs: [
        { required: true, message: "数据看板访问次数不能为空", trigger: "blur" },
        {
            type: "number",
            min: 0,
            max: 9999999999,
            message: "数据看板访问次数必须在0-9999999999之间",
            trigger: "blur",
        },
    ],
    pjwdjjg: [
      { required: true, message: "评价维度及结果不能为空", trigger: "blur" },
      { max: 2000, message: "评价维度及结果不能超过2000个字符", trigger: "blur" },
    ],
    sjscrq: [{ required: true, message: "数据生成日期不能为空", trigger: "change" }],
    sjkbzxfwrq: [
        {
            required: true,
            message: "数据看板最新访问日期不能为空",
            trigger: "change",
        },
    ],
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

  if (dialogMode.value === 'edit') {
    rules.zjsjwyxbs = [
      { required: true, message: "主键数据唯一性标识不能为空", trigger: "blur" },
      { min: 32, max: 32, message: "必须为32位字符", trigger: "blur" },
      { pattern: /^[A-Z0-9]{32}$/, message: "只能包含大写字母和数字", trigger: "blur" }
    ];
  } else {
    rules.zjsjwyxbs = [
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
    ]
  }

  return rules;
});

// 查询参数
const queryParams = reactive<OdsJshxsjQuery>({
  pageNum: 1,
  pageSize: 100,
  zjsjwyxbs: "",
  xxdm: "",
  jgh: "",
  jsxm: "",
});

// 表单数据
const form = reactive<OdsJshxsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  jgh: "",
  jsxm: "",
  sjkbfwcs: 0,
  pjwdjjg: "",
  sjscrq: "",
  sjkbzxfwrq: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 打开评价维度表单
const handleOpenEvaluationForm = () => {
  evaluationFormVisible.value = true;
};

// 处理评价维度表单提交
const handleEvaluationSubmit = (payload: { jsonString: string; jgh: string; jsxm: string; }) => {
  form.pjwdjjg = payload.jsonString;
  if (payload.jgh) {
    form.jgh = payload.jgh;
  }
  if (payload.jsxm) {
    form.jsxm = payload.jsxm;
  }
  evaluationFormVisible.value = false;
};

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

// 引用
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

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

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value || "",
    jgh: "",
    jsxm: "",
    sjkbfwcs: 0,
    pjwdjjg: "",
    sjscrq: "",
    sjkbzxfwrq: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.resetFields();
};

// 新增按钮操作
const handleAdd = () => {
  resetForm();
  // 自动设置学校代码
  if (systemSchoolCode.value) {
    form.xxdm = systemSchoolCode.value;
  }
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 修改按钮操作
const handleEdit = async (row: OdsJshxsjInfo) => {
  try {
    const response = await getOdsJshxsjById(row.id);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      resetForm();
      Object.assign(form, responseData.data);
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(responseData?.message || "获取数据失败");
    }
  } catch (error: any) {
    console.error("获取数据失败:", error);
    ElMessage.error(error.message || "获取数据失败");
  }
};

// 查看按钮操作
const handleView = async (row: OdsJshxsjInfo) => {
  try {
    const response = await getOdsJshxsjById(row.id);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      resetForm();
      Object.assign(form, responseData.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(responseData?.message || "获取数据失败");
    }
  } catch (error: any) {
    console.error("获取数据失败:", error);
    ElMessage.error(error.message || "获取数据失败");
  }
};

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;

    try {
      if (dialogMode.value === "add") {
        await addOdsJshxsj(form);
        ElMessage.success("新增成功");
      } else {
        await updateOdsJshxsj(form);
        ElMessage.success("修改成功");
      }

      dialogVisible.value = false;
      getList();
    } catch (error: any) {
      ElMessage.error(`${dialogMode.value === "add" ? "新增" : "修改"}失败`);
    }
  });
};

// 获取上报状态标签类型
const getReportStatusType = (status: string | undefined) => {
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

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsJshxsjPage(queryParams);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      dataList.value = responseData.data.records || [];
      total.value = responseData.data.total;
    } else {
      const msg = responseData?.message || "获取列表失败";
      ElMessage.error(msg);
    }
  } catch (error: any) {
    console.error("获取列表失败:", error);
    ElMessage.error(error.message || "获取列表失败");
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.zjsjwyxbs = "";
  queryParams.xxdm = "";
  queryParams.jgh = "";
  queryParams.jsxm = "";
  queryParams.pageNum = 1;
  queryFormRef.value?.resetFields();
  getList();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: OdsJshxsjInfo[]) => {
  multipleSelection.value = selection;
};

/** 删除按钮操作 */
const handleDelete = async (row: OdsJshxsjInfo) => {
  try {
    await ElMessageBox.confirm("是否确认删除该教师画像数据？", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = await deleteOdsJshxsj(row.id);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(responseData?.message || "删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error(error.message || "删除失败");
    }
  }
};

/** 批量删除按钮操作 */
const handleBatchDelete = async () => {
  const ids = multipleSelection.value.map((item) => item.id);
  try {
    await ElMessageBox.confirm(
      `是否确认删除选中的${ids.length}条教师画像数据？`,
      "警告",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await batchDeleteOdsJshxsj(ids);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
    } else {
      ElMessage.error(responseData?.message || "批量删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error(error.message || "批量删除失败");
    }
  }
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    const response = await exportOdsJshxsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `教师画像数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error: any) {
    console.error("导出失败:", error);
    ElMessage.error(error.message || "导出失败");
  }
};

/** 分页大小改变 */
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};

/** 当前页改变 */
const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

// 获取启用状态标签类型
const getEnableStatusType = (status: string | undefined) => {
  if (!status && status !== "0") {
    return "success"; // 默认为success
  }
  switch (String(status)) {
    case "0":
      return "danger";
    case "1":
      return "success";
    default:
      return "info";
  }
};

// 获取启用状态文本
const getEnableStatusText = (status: string | undefined) => {
  if (!status && status !== "0") {
    return "启用"; // 默认为启用
  }
  switch (String(status)) {
    case "0":
      return "禁用";
    case "1":
      return "启用";
    default:
      return "未知";
  }
};

// 获取查看JSON按钮操作
const handleViewJson = () => {
  jsonViewerVisible.value = true;
};

// 页面加载时获取数据
onMounted(() => {
  loadSystemSchoolCode();
  getList();
});
</script>

<style scoped>
/* 主容器样式 */
.teacher-portrait-management {
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
  height: calc(75vh - 120px) !important;
  :deep(.el-table) {
    border-radius: 0;
    height: calc(75vh - 180px) !important;
    overflow-y: auto;

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
  position: sticky;
  bottom: 0;
  z-index: 1;

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
    padding: 0 2px;
    font-size: 13px;
  }
}

/* 弹窗样式 */
.teacher-portrait-dialog {
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
.teacher-portrait-detail {
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
.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
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

.json-viewer {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  max-height: 50vh;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
