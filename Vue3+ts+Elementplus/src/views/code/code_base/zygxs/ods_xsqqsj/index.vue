<template>
  <div class="student-direction-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="学号" prop="xh">
            <el-input
              v-model="queryParams.xh"
              placeholder="请输入学号"
              clearable
            />
          </el-form-item>
          <el-form-item label="审批人" prop="spr">
            <el-input
              v-model="queryParams.spr"
              placeholder="请输入审批人"
              clearable
            />
          </el-form-item>
          <el-form-item label="开课学年度" prop="kkxnd">
            <el-select
              v-model="queryParams.kkxnd"
              placeholder="请选择开课学年度"
              clearable
              filterable
              style="width: 200px"
            >
              <el-option
                v-for="item in kkxndOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
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
        <div class="header-title">学生缺勤数据子类表</div>
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
            prop="xh"
            label="学号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="kkxnd"
            label="开课学年度"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getKkxndText(row.kkxnd) }}
            </template>
          </el-table-column>
          <el-table-column
            label="开课学期"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getKkxqmText(row.kkxqm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="qqrq"
            label="缺勤日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            label="缺勤类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getQqlxText(row.qqlx) }}
            </template>
          </el-table-column>
          <el-table-column
            label="考勤类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getKqlxText(row.kqlx) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="qqyy"
            label="缺勤原因"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="spsj"
            label="审批时间"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="spr"
            label="审批人"
            min-width="120"
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
      style="height: 440px"
      class="student-direction-dialog"
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
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select
                v-model="form.xh"
                placeholder="请选择学号/姓名"
                clearable
                filterable
                remote
                :remote-method="getStudentOptionsData"
                   :loading="loading"
                style="width: 100%"
                >
                  <el-option v-for="item in studentOptions"
                  :key="item.xh"
                  :label="item.label"
                  :value="item.xh"
               
                   />
              </el-select>
              <el-tooltip content="数据来源于ODS_XSHXSJ学生画像数据子类表" placement="top">
                <el-icon style="color: #e6a23c"><Warning /></el-icon> 
              </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开课学年度" prop="kkxnd">
            
              <el-select
                v-model="form.kkxnd"
                placeholder="请选择开课学年度"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in kkxndOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
               
         
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开课学期码" prop="kkxqm">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select
                v-model="form.kkxqm"
                placeholder="请选择开课学期码"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in kkxqmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-tooltip content="数据来源 不明确KKXQM	开课学期码	C	1	M	XQDM（学期代码）		ZYGJX050107" placement="top">
                <el-icon style="color: #FF4D4F"><Warning /></el-icon> 
              </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缺勤日期" prop="qqrq">
              <el-date-picker
                v-model="form.qqrq"
                type="date"
                placeholder="请选择缺勤日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缺勤类型" prop="qqlx">
              <el-select
                v-model="form.qqlx"
                placeholder="请选择缺勤类型"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in qqlxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考勤类型" prop="kqlx">
              <el-select
                v-model="form.kqlx"
                placeholder="请选择考勤类型"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in kqlxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="缺勤原因" prop="qqyy">
              <el-input
                v-model="form.qqyy"
                type="textarea"
                :rows="2"
                placeholder="请输入缺勤原因"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批时间" prop="spsj">
              <el-date-picker
                v-model="form.spsj"
                type="date"
                placeholder="请选择审批时间"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批人" prop="spr">
              <el-input
                v-model="form.spr"
                placeholder="请输入审批人"
                maxlength="20"
                show-word-limit
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
      <div v-else class="student-direction-detail">
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
          <el-descriptions-item label="开课学年度">
            <div class="detail-value">{{ getKkxndText(form.kkxnd) || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="开课学期">
            <div class="detail-value">
              {{ getKkxqmText(form.kkxqm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="缺勤日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.qqrq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="缺勤类型">
            <div class="detail-value">
              {{ getQqlxText(form.qqlx) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="考勤类型">
            <div class="detail-value">
              {{ getKqlxText(form.kqlx) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="缺勤原因" :span="2">
            <div class="detail-value">{{ form.qqyy || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="审批时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.spsj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="审批人">
            <div class="detail-value">{{ form.spr || "-" }}</div>
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
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsXsqqsjPage,
  getOdsXsqqsjById,
  addOdsXsqqsj,
  updateOdsXsqqsj,
  deleteOdsXsqqsj,
  getSystemSchoolCode,
  batchDeleteOdsXsqqsj,
  exportOdsXsqqsj,
  getStudentOptions,
  getDictOptions,
  DICT_CODES,
  type StudentOption,
  type OdsXsqqsjInfo,
  type OdsXsqqsjQuery,
  type OdsXsqqsjForm,
} from "@/api-code/code/code_base/zygxs/ods_xsqqsj";

// 字典选项接口类型
interface DictOption {
  label: string;
  value: string;
}

// 搜索条件
const queryParams = reactive<OdsXsqqsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  kkxnd: "",
  kkxqm: "",
  qqlx: "",
  kqlx: "",
  spr: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 100,
});

// 表格数据
const dataList = ref<OdsXsqqsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedRows = ref<OdsXsqqsjInfo[]>([]);
const systemSchoolCode = ref("");
const studentOptions = ref<StudentOption[]>([]);
const kkxndOptions = ref<DictOption[]>([]);
// 表单相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const form = reactive<OdsXsqqsjForm>({
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  xh: "",
  kkxnd: "",
  kkxqm: "",
  qqrq: "",
  qqlx: "",
  kqlx: "",
  qqyy: "",
  spsj: "",
  spr: "",
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();

// 字典选项
const kkxqmOptions = ref<DictOption[]>([]);
const qqlxOptions = ref<DictOption[]>([]);
const kqlxOptions = ref<DictOption[]>([]);

// 计算属性
const dialogTitle = computed(() => {
  if (dialogMode.value === "add") return "新增学生缺勤数据";
  if (dialogMode.value === "edit") return "编辑学生缺勤数据";
  return "查看学生缺勤数据详情";
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { validator: (rule: any, value: string, callback: Function) => {
      if (!value) {
        callback(); // 为空时通过验证
      } else if (!/^[A-Z0-9]{32}$/.test(value)) {
        callback(new Error('必须是32位大写字母和数字组合'));
      } else {
        callback();
      }
    }, trigger: 'blur' }
  ],
  xh: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { max: 20, message: "学号长度不能超过20位", trigger: "blur" },
  ],
  kkxnd: [
    { required: true, message: "请输入开课学年度", trigger: "blur" },
    { max: 9, message: "开课学年度长度不能超过9位", trigger: "blur" },
  ],
  kkxqm: [
    { required: true, message: "请选择开课学期码", trigger: "change" },
  ],
  qqrq: [
    { required: true, message: "请选择缺勤日期", trigger: "change" },
  ],
  qqlx: [
    { required: true, message: "请选择缺勤类型", trigger: "change" },
  ],
  kqlx: [
    { required: true, message: "请选择考勤类型", trigger: "change" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 格式化方法
const getKkxqmText = (code: string | undefined): string => {
  if (!code) return "";
  const option = kkxqmOptions.value.find(item => item.value === code);
  return option ? option.label : code;
};

const getQqlxText = (code: string | undefined): string => {
  if (!code) return "";
  const option = qqlxOptions.value.find(item => item.value === code);
  return option ? option.label : code;
};

const getKqlxText = (code: string | undefined): string => {
  if (!code) return "";
  const option = kqlxOptions.value.find(item => item.value === code);
  return option ? option.label : code;
};

const getKkxndText = (code: string | undefined): string => {
  if (!code) return "";
  const option = kkxndOptions.value.find(item => item.value === code);
  return option ? option.label : code;
};

const getReportStatusTagType = (status: string | undefined): "success" | "danger" | "info" => {
  if (status === "1") return "success";
  if (status === "2") return "danger";
  return "info";
};

const getReportStatusText = (status: string | undefined): string => {
  if (status === "0") return "未上报";
  if (status === "1") return "已上报";
  if (status === "2") return "上报失败";
  return "未知";
};

const formatDisplayTime = (time: string | undefined): string => {
  if (!time) return "";
  if (time.length === 8) {
    // YYYYMMDD 格式
    return `${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)}`;
  }
  if (time.length === 15) {
    // YYYYMMDD HHmmss 格式
    const date = time.substring(0, 8);
    const timeStr = time.substring(9);
    return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)} ${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}:${timeStr.substring(4, 6)}`;
  }
  return time;
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsXsqqsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询学生缺勤数据失败:", error);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};

// 获取学号学生姓名选项列表
const getStudentOptionsData = async (keyword?: string) => {
  const response: any = await getStudentOptions(keyword);
 
  
  if (response.data.code === 200) {
    studentOptions.value = response.data.data;
  }
};

// 获取字典数据
const loadDictOptions = async () => {
  try {
    // 获取学期代码选项
    const kkxqmResponse: any = await getDictOptions(DICT_CODES.XQDM);
    if (kkxqmResponse.data.code === 200) {
      kkxqmOptions.value = kkxqmResponse.data.data;
    }

    // 获取缺勤类型代码选项
    const qqlxResponse: any = await getDictOptions(DICT_CODES.QQLXDM);
    if (qqlxResponse.data.code === 200) {
      qqlxOptions.value = qqlxResponse.data.data;
    }

    // 获取考勤类型代码选项
    const kqlxResponse: any = await getDictOptions(DICT_CODES.KQLXDM);
    if (kqlxResponse.data.code === 200) {
      kqlxOptions.value = kqlxResponse.data.data;
    }
  } catch (error) {
    console.error("获取字典数据失败:", error);
    ElMessage.error("获取字典数据失败");
  }
};

// 生成学年度选项
const generateKkxndOptions = () => {
  const currentYear = new Date().getFullYear();
  const options: DictOption[] = [];
  
  // 添加去年、今年和明年的学年度选项
  for (let i = -1; i <= 1; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 1;
    const value = `${startYear}-${endYear}`;
    options.push({
      value,
      label: value
    });
  }
  
  kkxndOptions.value = options;
  
  // 设置默认值为当前学年度
  if (!form.kkxnd) {
    const currentStartYear = currentYear;
    const currentEndYear = currentStartYear + 1;
    form.kkxnd = `${currentStartYear}-${currentEndYear}`;
  }
};

// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置搜索
const resetQuery = () => {
  if (queryFormRef.value) {
    queryFormRef.value.resetFields();
  }
  queryParams.pageNum = 1;
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleUpdate = async (row: OdsXsqqsjInfo) => {
  try {
    const response: any = await getOdsXsqqsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生缺勤数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsXsqqsjInfo) => {
  try {
    const response: any = await getOdsXsqqsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生缺勤数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsXsqqsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条学生缺勤数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsXsqqsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除学生缺勤数据失败:", error);
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
      `确定要删除选中的 ${selectedRows.value.length} 条学生缺勤数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const ids = selectedRows.value.map(item => item.id);
    const response: any = await batchDeleteOdsXsqqsj(ids);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedRows.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除学生缺勤数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsXsqqsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `学生缺勤数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出学生缺勤数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsXsqqsj(form);
    } else {
      response = await updateOdsXsqqsj(form);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.msg || "操作失败");
    }
  } catch (error) {
    console.error("提交表单失败:", error);
    ElMessage.error("操作失败");
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    xh: "",
    kkxnd: "",
    kkxqm: "",
    qqrq: "",
    qqlx: "",
    kqlx: "",
    qqyy: "",
    spsj: "",
    spr: "",
    sjcjsj: "",
    enableStatus: "1",
  });
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

// 表格选择变化
const handleSelectionChange = (selection: OdsXsqqsjInfo[]) => {
  selectedRows.value = selection;
};

// 行点击
const handleRowClick = (row: OdsXsqqsjInfo) => {
  // 可以添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsXsqqsjInfo) => {
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

// 获取当前系统学校代码
const getSystemSchoolCodeData = async () => {
  const response: any = await getSystemSchoolCode();
  if (response.data.code === 200) {
    systemSchoolCode.value = response.data.data;
  }
};

// 页面加载
onMounted(() => {
  getSystemSchoolCodeData();
  loadDictOptions();
  generateKkxndOptions();
  getList();
});
</script>

<style scoped>
.student-direction-management {
  padding: 0;
}

.search-card {
  margin-top: -10px;
  :deep(.el-card__body) {
    padding: 0;
  }
  :deep(.el-form) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .el-form-item {
      margin: 0 10px 0 0;
      .el-form-item__label {
        height: 28px;
        line-height: 28px;
      }
      .el-form-item__content {
        line-height: 28px;
      }
    }
    .el-input {
      --el-input-height: 28px;
    }
    .el-button {
      --el-button-size: 28px;
      margin-top: -2px;
    }
  }
}

.table-card {
  margin-top: -10px;
}

.search-bar {
  padding: 0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 2px;
}

.operation-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  flex: 1;
  text-align: center;
}

.placeholder {
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top:5px;
  padding: 5px 2px;
}

.total-info {
  color: #606266;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 查看模式样式 */
.student-direction-detail {
  padding: 20px 0;
}

.detail-descriptions {
  margin-top: 20px;
}

.detail-value {
  color: #606266;
  word-break: break-all;
}

/* 弹窗样式 */
.student-direction-dialog :deep(.el-dialog__body) {
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
}

.student-direction-dialog :deep(.el-form-item) {
  margin-bottom: 12px;
}

/* 统一表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 12px !important;
}

:deep(.el-row) {
  margin-bottom: 0 !important;

  .el-form-item {
    margin-bottom: 12px !important;
  }
}
</style>
