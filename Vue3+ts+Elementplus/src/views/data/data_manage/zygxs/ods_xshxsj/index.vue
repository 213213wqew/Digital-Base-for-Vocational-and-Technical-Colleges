<template>
  <div class="student-portrait-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="唯一性标识" prop="zjsjwyxbs">
            <el-input
              v-model="queryParams.zjsjwyxbs"
              placeholder="请输入主键数据唯一性标识"
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
          <el-form-item label="学生姓名" prop="xsxm">
            <el-input
              v-model="queryParams.xsxm"
              placeholder="请输入学生姓名"
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
        <div class="header-title"> 学生画像表数据清洗</div>
 
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
            prop="xh"
            label="学号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xsxm"
            label="学生姓名"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sjkbfwcs"
            label="访问次数"
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sjscrq"
            label="数据生成日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sjkbzxfwrq"
            label="最新访问日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sjcjsj"
            label="数据采集时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusType(row.reportStatus)"
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
      style="height: 660px"
      class="student-dialog"
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
                placeholder="可留空，系统自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              >
                <template #suffix>
                  <el-tooltip 
                    content="新增时可留空，系统将自动生成32位大写字母+数字的唯一编码" 
                    placement="top"
                  >
                    <el-icon style="color: #909399; cursor: help;">
                      <InfoFilled />
                    </el-icon>
                  </el-tooltip>
                </template>
              </el-input>
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
              <el-input
                v-model="form.xh"
                placeholder="请输入学号"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="xsxm">
              <el-input
                v-model="form.xsxm"
                placeholder="请输入学生姓名"
                maxlength="36"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="访问次数" prop="sjkbfwcs">
              <el-input-number
                v-model="form.sjkbfwcs"
                placeholder="请输入数据看板访问次数"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据生成日期" prop="sjscrq">
              <el-date-picker
                v-model="form.sjscrq"
                type="date"
                placeholder="请选择数据生成日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最新访问日期" prop="sjkbzxfwrq">
              <el-date-picker
                v-model="form.sjkbzxfwrq"
                type="date"
                placeholder="请选择数据看板最新访问日期"
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
                <el-option label="上报失败" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评价维度及结果" prop="pjwdjjg">
               <el-input
                v-model="form.pjwdjjg"
                type="textarea"
                :rows="8"
                placeholder="可直接编辑或通过下方按钮进行操作"
              />
              <div class="button-toolbar">
                  <el-button type="primary" @click="evaluationDialogVisible = true">
                      <el-icon><Edit /></el-icon>
                      结构化编辑
                  </el-button>
                  <el-button type="info" @click="jsonViewerVisible = true">
                      <el-icon><View /></el-icon>
                      查看JSON
                  </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="student-detail">
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
          <el-descriptions-item label="学号">
            <div class="detail-value">{{ form.xh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学生姓名">
            <div class="detail-value">{{ form.xsxm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="访问次数">
            <div class="detail-value">{{ form.sjkbfwcs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据生成日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjscrq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="最新访问日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjkbzxfwrq) || "-" }}
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
        </el-descriptions>

        <!-- 评价维度及结果的独立展示区域 -->
        <div class="evaluation-container">
          <div class="evaluation-header">评价维度及结果</div>
          <div class="evaluation-body">
            <div v-if="evaluationDetailsForView && Object.keys(evaluationDetailsForView).length" class="evaluation-details-view">
              <div v-for="(fields, category) in evaluationDetailsForView" :key="category" class="category-block">
                <strong class="category-title">{{ category }}</strong>
                <ul class="field-list">
                  <li v-for="(value, field) in fields" :key="field">
                    <span>{{ field }}:</span> {{ value }}
                  </li>
                </ul>
              </div>
            </div>
            <div v-else class="detail-value no-data">-</div>
          </div>
        </div>
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

    <!-- 评价维度及结果 - 子组件弹窗 -->
    <EvaluationDialog
      v-model="evaluationDialogVisible"
      :json-data="form.pjwdjjg || ''"
      :student-id="form.xh"
      :student-name="form.xsxm"
      @update:json-data="newValue => form.pjwdjjg = newValue"
      @update-student-info="handleUpdateStudentInfo"
    />

    <!-- JSON 查看器 -->
    <el-dialog
      v-model="jsonViewerVisible"
      title="查看JSON数据"
      width="600px"
      append-to-body
    >
      <div class="json-viewer">
        <pre><code>{{ formattedJson }}</code></pre>
      </div>
      <template #footer>
        <el-button type="primary" @click="jsonViewerVisible = false">关闭</el-button>
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
  InfoFilled,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import EvaluationDialog from './components/EvaluationDialog.vue'; // 引入子组件

// API导入
import {
  getOdsXshxsjPage,
  addOdsXshxsj,
  updateOdsXshxsj,
  deleteOdsXshxsj,
  batchDeleteOdsXshxsj,
  exportOdsXshxsj,
} from "@/api-data/data/data_base/zygxs/ods_xshxsj";
import { getSystemSchoolCode } from "@/api-data/data/data_base/zygxx/ods_xxhxtjssj";

// 接口类型定义
interface OdsXshxsjInfo {
  id: number;
  zjsjwyxbs: string;
  xxdm: string;
  xh: string;
  xsxm: string;
  sjkbfwcs: number;
  pjwdjjg: string;
  sjscrq: string;
  sjkbzxfwrq: string;
  sjcjsj: string;
  reportStatus: string;
  enableStatus: string;
  createTime: string;
  updateTime: string;
}

interface QueryParams {
  pageNum: number;
  pageSize: number;
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xsxm?: string;
}

// 响应式数据
const loading = ref(false);
const total = ref(0);
const dataList = ref<OdsXshxsjInfo[]>([]);
const selectedRows = ref<OdsXshxsjInfo[]>([]);
const multiple = ref(false);
const dialogVisible = ref(false);
const dialogMode = ref<'add' | 'edit' | 'view'>('add');
const systemSchoolCode = ref<string>('');
const evaluationDialogVisible = ref(false);
const jsonViewerVisible = ref(false); // 新增JSON查看器可见状态

// 查询参数
const queryParams = reactive<QueryParams>({
  pageNum: 1,
  pageSize: 100,
  zjsjwyxbs: '',
  xxdm: '',
  xh: '',
  xsxm: '',
});

// 表单数据
const form = reactive<Partial<OdsXshxsjInfo>>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xsxm: "",
  sjkbfwcs: 0,
  pjwdjjg: "",
  sjscrq: "",
  sjkbzxfwrq: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case 'add':
      return '新增学生画像数据';
    case 'edit':
      return '编辑学生画像数据';
    case 'view':
      return '查看学生画像数据';
    default:
      return '';
  }
});

const formattedJson = computed(() => {
  try {
    const jsonObj = JSON.parse(form.pjwdjjg || '{}');
    return JSON.stringify(jsonObj, null, 2);
  } catch (e) {
    return "无效的JSON格式或内容为空";
  }
});

// 表单验证规则
const rules = reactive({
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识不能超过32个字符", trigger: "blur" },
    { 
      pattern: /^[A-Z0-9]*$/, 
      message: "主键数据唯一性标识只能包含大写字母和数字", 
      trigger: "blur" 
    },
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { max: 10, message: "学校代码不能超过10个字符", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须为10位数字", trigger: "blur" },
  ],
  xh: [
    { required: true, message: "学号不能为空", trigger: "blur" },
    { max: 20, message: "学号不能超过20个字符", trigger: "blur" },
  ],
  xsxm: [
    { max: 36, message: "学生姓名不能超过36个字符", trigger: "blur" },
  ],
  sjkbfwcs: [
    { 
      validator: (_rule: any, value: any, callback: any) => {
        if (value !== null && value !== undefined && value !== '') {
          if (!Number.isInteger(value) || value < 0) {
            callback(new Error('数据看板访问次数必须为非负整数'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }, 
      trigger: 'blur' 
    },
  ],
  pjwdjjg: [
    { required: true, message: "评价维度及结果不能为空", trigger: "blur" },
    { max: 2000, message: "评价维度及结果不能超过2000个字符", trigger: "blur" },
  ],
  sjscrq: [
    { required: true, message: "数据生成日期不能为空", trigger: "change" },
    { pattern: /^\d{8}$/, message: "数据生成日期格式必须为YYYYMMDD", trigger: "blur" },
  ],
  sjkbzxfwrq: [
    { required: true, message: "数据看板最新访问日期不能为空", trigger: "change" },
    { pattern: /^\d{8}$/, message: "数据看板最新访问日期格式必须为YYYYMMDD", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "change" },
    { pattern: /^\d{8} \d{6}$/, message: "数据采集时间格式必须为YYYYMMDD hhmmss", trigger: "blur" },
  ],
});

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

// 获取数据列表
const getList = async () => {
  loading.value = true;
  try {
    const { data }: any = await getOdsXshxsjPage(queryParams);
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
const handleSelectionChange = (selection: OdsXshxsjInfo[]) => {
  selectedRows.value = selection;
  multiple.value = selection.length > 0;
};

// 行点击事件
const handleRowClick = () => {
  // 行点击逻辑
};

// 行双击事件
const handleRowDblClick = (row: OdsXshxsjInfo) => {
  handleView(row);
};

// 获取上报状态类型
const getReportStatusType = (status: string) => {
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
const getReportStatusText = (status: string) => {
  switch (status) {
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return "未上报";
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
    xh: "",
    xsxm: "",
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
const handleUpdate = (row: OdsXshxsjInfo) => {
  resetForm();
  Object.assign(form, row);
  dialogMode.value = "edit";
  dialogVisible.value = true;
};

// 查看
const handleView = (row: OdsXshxsjInfo) => {
  resetForm();
  Object.assign(form, row);
  dialogMode.value = "view";
  dialogVisible.value = true;
};

// 删除
const handleDelete = (row: OdsXshxsjInfo) => {
  ElMessageBox.confirm(`确定要删除"${row.zjsjwyxbs}"这条数据吗？`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await deleteOdsXshxsj(row.id);
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
      await batchDeleteOdsXshxsj(ids);
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
    const response = await exportOdsXshxsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `学生画像数据_${new Date().getTime()}.xlsx`;
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
        await addOdsXshxsj(form);
        ElMessage.success("新增成功");
      } else {
        await updateOdsXshxsj(form);
        ElMessage.success("修改成功");
      }

      dialogVisible.value = false;
      getList();
    } catch (error) {
      ElMessage.error(`${dialogMode.value === "add" ? "新增" : "修改"}失败`);
    }
  });
};

// 新增方法，用于处理子组件返回的学生信息更新
const handleUpdateStudentInfo = (info: { studentId: string; studentName: string; }) => {
  form.xh = info.studentId;
  form.xsxm = info.studentName;
};

// 评价维度及结果相关
const evaluationDetailsForView = computed(() => {
  if (!form.pjwdjjg) return null;
  try {
    const parsedData = JSON.parse(form.pjwdjjg);
    const result: { [key: string]: { [key: string]: string } } = {};

    for (const category in parsedData) {
      if (Object.prototype.hasOwnProperty.call(parsedData, category)) {
        const categoryData = parsedData[category];
        const filteredCategory: { [key: string]: string } = {};
        let hasContent = false;
        for (const field in categoryData) {
          if (Object.prototype.hasOwnProperty.call(categoryData, field)) {
            const value = categoryData[field];
            if (value !== null && value !== undefined && value !== '') {
              filteredCategory[field] = value;
              hasContent = true;
            }
          }
        }
        if (hasContent) {
          result[category] = filteredCategory;
        }
      }
    }
    return Object.keys(result).length > 0 ? result : null;
  } catch (e) {
    return null;
  }
});

// 页面加载时获取数据
onMounted(() => {
  loadSystemSchoolCode();
  getList();
});
</script>

<style scoped>
/* 主容器样式 */
.student-portrait-management {
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
.student-dialog {
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
.student-detail {
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

.evaluation-container {
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 4px 4px;
  margin-top: -1px;
}

.evaluation-header {
  background-color: #fafafa;
  padding: 12px 16px;
  font-weight: 600;
  color: #303133;
  font-size: 14px;
  border-bottom: 1px solid #e0e0e0;
}

.evaluation-body {
  padding: 10px 16px;
  font-size: 14px;
  color: #606266;
  max-height: 240px;
  overflow-y: auto;
}

.evaluation-body .no-data {
  padding: 10px 0;
  text-align: center;
  color: #909399;
}

.evaluation-details-view {
  padding: 10px;
  background-color: #fdfdfd;
  border-radius: 4px;
}
.category-block {
  margin-bottom: 15px;
}
.category-block:last-child {
  margin-bottom: 0;
}
.category-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 8px;
  display: block;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}
.field-list {
  list-style-type: none;
  padding-left: 10px;
  font-size: 13px;
  color: #606266;
}
.field-list li {
  margin-bottom: 5px;
}
.field-list li span {
  font-weight: 500;
  color: #484848;
}

.button-toolbar {
  margin-top: 8px;
  display: flex;
  gap: 10px;
}

.json-viewer {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  max-height: 60vh;
  overflow: auto;
}

.json-viewer pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #333;
}
</style>
