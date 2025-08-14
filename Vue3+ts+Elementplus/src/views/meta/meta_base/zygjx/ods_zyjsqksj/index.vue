<template>
  <div class="professional-development-management">
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
          <el-form-item label="上报状态" prop="reportStatus">
            <el-select
              v-model="queryParams.reportStatus"
              placeholder="请选择上报状态"
              clearable
              style="width: 120px"
            >
              <el-option label="未上报" value="0" />
              <el-option label="已上报" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态" prop="enableStatus">
            <el-select
              v-model="queryParams.enableStatus"
              placeholder="请选择启用状态"
              clearable
              style="width: 120px"
            >
              <el-option label="禁用" value="0" />
              <el-option label="启用" value="1" />
            </el-select>
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
        <div class="header-title">专业建设情况数据子类表</div>
        <div class="placeholder">
          <el-button type="warning" @click="handleImport">
            <el-icon><Upload /></el-icon>导入
          </el-button>
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
      style="height: 490px"
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
              <el-input
                v-model="form.zyh"
                placeholder="请输入专业号（学校自编）"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          <el-col :span="12">
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
          <el-col :span="12">
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
          <el-col :span="12">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select
                v-model="form.reportStatus"
                placeholder="请选择上报状态"
                style="width: 100%"
              >
                <el-option label="未上报" value="0" />
                <el-option label="已上报" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
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
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusTagType(form.reportStatus)"
              size="small"
            >
              {{ getReportStatusText(form.reportStatus) }}
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

    <!-- 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入专业建设情况数据"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleImportClose"
    >
      <div class="import-content">
        <el-alert
          title="导入说明"
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 20px"
        >
          <template #default>
            <div>
              <p>1. 请使用标准的Excel模板进行数据导入</p>
              <p>2. 必填字段：专业号、重点专业级别码、重点专业类型码、授予日期</p>
              <p>3. 支持新增和更新数据，系统会根据专业号自动判断</p>
              <p>4. 单次最多支持导入1000条数据</p>
              <p>5. 学校代码将自动设置为当前系统学校代码</p>
              <div style="margin-top: 10px;">
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="handleDownloadTemplate"
                  :loading="templateDownloading"
                >
                  <el-icon><Download /></el-icon>
                  下载导入模板
                </el-button>
              </div>
            </div>
          </template>
        </el-alert>

        <el-upload
          ref="uploadRef"
          class="upload-demo"
          drag
          :auto-upload="false"
          :limit="1"
          accept=".xlsx,.xls"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传 xlsx/xls 文件，且不超过 10MB
            </div>
          </template>
        </el-upload>

        <div v-if="importResult" class="import-result" style="margin-top: 20px">
          <el-alert
            :title="`导入完成：总数 ${importResult.total}，成功 ${importResult.success}，新增 ${importResult.insert}，更新 ${importResult.update}，失败 ${importResult.fail}`"
            :type="importResult.fail > 0 ? 'warning' : 'success'"
            :closable="false"
            show-icon
          >
            <template #default>
              <div v-if="importResult.errors && importResult.errors.length > 0">
                <p style="margin: 10px 0 5px 0; font-weight: bold">错误详情：</p>
                <div style="max-height: 200px; overflow-y: auto; border: 1px solid #e4e7ed; border-radius: 4px; padding: 8px; background-color: #fafafa;">
                  <p v-for="(error, index) in importResult.errors" :key="index" style="margin: 2px 0; color: #f56c6c; font-size: 12px;">
                    {{ error }}
                  </p>
                </div>
              </div>
              <div v-if="importResult.fail === 0 && importResult.success > 0" style="margin-top: 10px; color: #67c23a; font-weight: bold;">
                🎉 所有数据导入成功！弹窗将在2秒后自动关闭
              </div>
            </template>
          </el-alert>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleImportClose">取消</el-button>
          <el-button
            type="primary"
            :loading="importLoading"
            :disabled="!selectedFile"
            @click="handleImportSubmit"
          >
            确认导入
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import * as XLSX from "xlsx";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  Upload,
  UploadFilled,
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
  importOdsZyjsqksj,
  type OdsZyjsqksjDTO,
  type OdsZyjsqksjQuery,
  type OdsZyjsqksjVO,
} from "@/api/meta/meta_base/zygjx/ods_zyjsqksj";
import { getDictOptions } from "@/api/meta/meta_base/zygxx/ods_xxjbsj";
import { getSystemSchoolCode } from "@/api/meta/meta_base/zygxx/ods_xxhxtjssj";

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

// 导入相关数据
const importDialogVisible = ref(false);
const importLoading = ref(false);
const templateDownloading = ref(false);
const selectedFile = ref<File | null>(null);
const fileList = ref<any[]>([]);
const importResult = ref<any>(null);
const uploadRef = ref();

// 字典选项数据
const zdzyjbmOptions = ref<DictOption[]>([]); // 重点专业级别码选项
const zdzylxmOptions = ref<DictOption[]>([]); // 重点专业类型码选项

// 系统学校代码
const systemSchoolCode = ref<string>("");

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

// 重置查询
const resetQuery = () => {
  queryFormRef.value?.resetFields();
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

// // 获取上报状态标签类型
// const getReportStatusTagType = (status: string | undefined) => {
//   switch (status) {
//     case "1":
//       return "success";
//     case "2":
//       return "danger";
//     default:
//       return "warning";
//   }
// };

// // 获取上报状态文本
// const getReportStatusText = (status: string | undefined) => {
//   switch (status) {
//     case "1":
//       return "已上报";
//     case "2":
//       return "上报失败";
//     default:
//       return "未上报";
//   }
// };

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

// 导入相关方法
const handleImport = () => {
  importDialogVisible.value = true;
  importResult.value = null;
  selectedFile.value = null;
  fileList.value = [];
};

// 下载导入模板
const handleDownloadTemplate = async () => {
  try {
    templateDownloading.value = true;
    
    // 创建模板数据
    const templateData = [
      {
        '专业号': 'ZY001',
        '重点专业级别码': '1',
        '重点专业类型码': '1', 
        '授予日期': '20240101',
        '数据采集时间': '20240101 120000',
        '启用状态': '1',
        '上报状态': '0',
        '备注': '示例数据，请删除此行后填入真实数据'
      }
    ];

    // 创建工作簿
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "专业建设情况数据");

    // 设置列宽
    const colWidths = [
      { wch: 15 }, // 专业号
      { wch: 18 }, // 重点专业级别码
      { wch: 18 }, // 重点专业类型码
      { wch: 12 }, // 授予日期
      { wch: 20 }, // 数据采集时间
      { wch: 10 }, // 启用状态
      { wch: 10 }, // 上报状态
      { wch: 30 }  // 备注
    ];
    ws['!cols'] = colWidths;

    // 导出文件
    XLSX.writeFile(wb, `专业建设情况数据导入模板_${new Date().getTime()}.xlsx`);
    
    ElMessage.success("模板下载成功");
  } catch (error) {
    console.error("模板下载失败:", error);
    ElMessage.error("模板下载失败，请稍后重试");
  } finally {
    templateDownloading.value = false;
  }
};

const handleFileChange = (file: any) => {
  selectedFile.value = file.raw;
  fileList.value = [file];
  // 清除之前的导入结果
  importResult.value = null;
};

const handleExceed = () => {
  ElMessage.warning("只能选择一个文件进行导入");
};

const handleImportSubmit = async () => {
  if (!selectedFile.value) {
    ElMessage.warning("请选择要导入的文件");
    return;
  }

  // 文件大小检查（10MB）
  if (selectedFile.value.size > 10 * 1024 * 1024) {
    ElMessage.error("文件大小不能超过10MB");
    return;
  }

  // 文件类型检查
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  if (!allowedTypes.includes(selectedFile.value.type)) {
    ElMessage.error("只支持Excel文件格式（.xlsx, .xls）");
    return;
  }

  try {
    importLoading.value = true;
    
    const response = await importOdsZyjsqksj(selectedFile.value) as any;
    
    if (response.data.code === 200) {
      importResult.value = response.data.data;
      ElMessage.success("导入完成");
      
      // 如果导入完全成功（没有失败记录），自动关闭弹窗并刷新数据
      if (importResult.value.fail === 0) {
        setTimeout(() => {
          handleImportClose();
          getList();
        }, 2000); // 2秒后自动关闭
      } else {
        // 有失败记录时刷新数据但保持弹窗打开，让用户查看错误信息
        getList();
      }
    } else {
      ElMessage.error(response.data.message || "导入失败");
    }
  } catch (error) {
    console.error("导入失败:", error);
    ElMessage.error("导入失败，请检查文件格式和网络连接");
  } finally {
    importLoading.value = false;
  }
};

const handleImportClose = () => {
  importDialogVisible.value = false;
  importResult.value = null;
  selectedFile.value = null;
  fileList.value = [];
  uploadRef.value?.clearFiles();
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

// 获取上报状态文本
const getReportStatusText = (status: string | undefined) => {
  switch (status) {
    case "0":
      return "未上报";
    case "1":
      return "已上报";
    default:
      return "未知";
  }
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: string | undefined) => {
  switch (status) {
    case "0":
      return "warning";
    case "1":
      return "success";
    default:
      return "info";
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadDictData();
  loadSystemSchoolCode();
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
