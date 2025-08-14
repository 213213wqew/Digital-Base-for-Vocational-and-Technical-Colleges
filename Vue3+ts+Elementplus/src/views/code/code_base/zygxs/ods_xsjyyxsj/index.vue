<template>
  <div class="student-employment-intention-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="学号" prop="xh">
            <el-input
              v-model="queryParams.xh"
              placeholder="请输入学号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="专业号" prop="zyh">
            <el-input
              v-model="queryParams.zyh"
              placeholder="请输入专业号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="意向单位" prop="yxdw">
            <el-input
              v-model="queryParams.yxdw"
              placeholder="请输入意向单位名称"
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
        <div class="header-title">学生就业意向数据管理</div>
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
          :height="'calc(75vh - 90px)'"
          stripe
          size="small"
          :row-style="{ height: '32px' }"
          :cell-style="{ padding: '0' }"
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
            prop="zyh"
            label="专业号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="就业意向"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getJyyxmText(row.jyyxm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="jyyxsm"
            label="就业意向说明"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="yxsjgmc"
            label="意向省机构"
            min-width="140"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="yxshjgmc"
            label="意向市机构"
            min-width="140"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="意向行业"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getJydwhymText(row.jydwhym) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="yxdw"
            label="意向单位"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="yxlrsj"
            label="录入时间"
            min-width="140"
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
      width="900px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 670px"
      class="employment-intention-dialog"
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
          <el-col :span="12" style="margin-bottom: 16px;">
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
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="学号" prop="xh" >
              <div style="display: flex; align-items: center; gap: 8px;width: 100%;">
                <el-select
                  v-model="form.xh"
                  placeholder="请输入学号关键字搜索"
                  clearable
                  filterable
                  remote
                  :remote-method="getStudentOptionsData"
                  :loading="loading"
                  @change="changeStudentOptions"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in studentOptions"
                    :key="item.xh"
                    :label="item.label"
                    :value="item.xh"
                  />
                </el-select>
                <el-tooltip content="数据来源于学生画像数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="专业号" prop="zyh">
              <div style="display: flex; align-items: center; gap: 8px;width: 100%;"> 
              <el-input
                v-model="form.zyh"
                placeholder="请输入专业号"
                maxlength="64"
                show-word-limit
              />
              <el-tooltip content="数据来源于专业信息数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="就业意向码" prop="jyyxm">
              <el-select
                v-model="form.jyyxm"
                placeholder="请选择就业意向"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in jyyxmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;" >
            <el-form-item label="意向机构行业码" prop="jydwhym">
              <el-select
                v-model="form.jydwhym"
                placeholder="请选择意向机构行业"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in jydwhymOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 16px;">
            <el-form-item label="就业意向说明" prop="jyyxsm">
              <el-input
                v-model="form.jyyxsm"
                type="textarea"
                :rows="3"
                placeholder="请输入就业意向说明（必填，最多500字符）"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="意向省机构编码" prop="yxsjgbm">
              <el-input
                v-model="form.yxsjgbm"
                placeholder="请输入意向省机构编码"
                maxlength="6"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="意向省机构名称" prop="yxsjgmc">
              <el-input
                v-model="form.yxsjgmc"
                placeholder="请输入意向省机构名称"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="意向市机构编码" prop="yxshjgbm">
              <el-input
                v-model="form.yxshjgbm"
                placeholder="请输入意向市机构编码"
                maxlength="6"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="意向市机构名称" prop="yxshjgmc">
              <el-input
                v-model="form.yxshjgmc"
                placeholder="请输入意向市机构名称"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="意向单位名称" prop="yxdw">
              <el-input
                v-model="form.yxdw"
                placeholder="请输入意向单位名称"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
            <el-form-item label="意向录入时间" prop="yxlrsj">
              <el-date-picker
                v-model="form.yxlrsj"
                type="datetime"
                placeholder="请选择意向录入时间"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 16px;">
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
          <el-col :span="12" style="margin-bottom: 16px;">
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
      <div v-else class="employment-intention-detail">
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
          <el-descriptions-item label="专业号">
            <div class="detail-value">{{ form.zyh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="就业意向">
            <div class="detail-value">
              {{ getJyyxmText(form.jyyxm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="意向机构行业">
            <div class="detail-value">
              {{ getJydwhymText(form.jydwhym) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="意向省机构编码">
            <div class="detail-value">{{ form.yxsjgbm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="意向省机构名称">
            <div class="detail-value">{{ form.yxsjgmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="意向市机构编码">
            <div class="detail-value">{{ form.yxshjgbm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="意向市机构名称">
            <div class="detail-value">{{ form.yxshjgmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="意向单位名称">
            <div class="detail-value">{{ form.yxdw || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="意向录入时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.yxlrsj) || "-" }}
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
          <el-descriptions-item label="就业意向说明" :span="2">
            <div class="detail-value">{{ form.jyyxsm || "-" }}</div>
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
  getOdsXsjyyxsjPage,
  getOdsXsjyyxsjById,
  addOdsXsjyyxsj,
  updateOdsXsjyyxsj,
  deleteOdsXsjyyxsj,
  getSystemSchoolCode,
  getStudentOptions,
  batchDeleteOdsXsjyyxsj,
  exportOdsXsjyyxsj,
  type OdsXsjyyxsjInfo,
  type OdsXsjyyxsjQuery,
  type OdsXsjyyxsjForm,
  type StudentOption,
 
} from "@/api-code/code/code_base/zygxs/ods_xsjyyxsj";

// 字典选项接口类型
interface DictOption {
  label: string;
  value: string;
}

// 搜索条件
const queryParams = reactive<OdsXsjyyxsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  zyh: "",
  jyyxm: "",
  yxdw: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 100,
});

// 表格数据
const dataList = ref<OdsXsjyyxsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedRows = ref<OdsXsjyyxsjInfo[]>([]);
const schoolCode = ref("");
const studentOptions =  ref<StudentOption[]>([]);
// 表单相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const form = reactive<OdsXsjyyxsjForm>({
  zjsjwyxbs: "",
  xxdm: schoolCode.value,
  xh: "",
  zyh: "",
  jyyxm: "",
  jyyxsm: "",
  yxsjgbm: "",
  yxsjgmc: "",
  yxshjgbm: "",
  yxshjgmc: "",
  jydwhym: "",
  yxdw: "",
  yxlrsj: "",
  sjcjsj: "",
  enableStatus: "1",
  bz: "",
});
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();
const submitLoading = ref(false);

// 字典选项
const jyyxmOptions = ref<DictOption[]>([]);
const jydwhymOptions = ref<DictOption[]>([]);

// 计算属性
const dialogTitle = computed(() => {
  if (dialogMode.value === "add") return "新增学生就业意向数据";
  if (dialogMode.value === "edit") return "编辑学生就业意向数据";
  return "查看学生就业意向数据详情";
});

// 表单验证规则
const rules = reactive({
  zjsjwyxbs: [
    { 
      pattern: /^[A-Z0-9]{32}$/, 
      message: "主键数据唯一性标识必须是32位大写字母+数字组合", 
      trigger: "blur" 
    },
  ],
  xh: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { max: 20, message: "学号长度不能超过20位", trigger: "blur" },
  ],
  zyh: [
    { max: 64, message: "专业号长度不能超过64位", trigger: "blur" },
  ],
  jyyxm: [
    { required: true, message: "请选择就业意向", trigger: "change" },
  ],
  jyyxsm: [
    { required: true, message: "请输入就业意向说明", trigger: "blur" },
    { max: 500, message: "就业意向说明长度不能超过500字符", trigger: "blur" },
  ],
  yxsjgbm: [
    { required: true, message: "请输入意向省机构编码", trigger: "blur" },
    { max: 6, message: "意向省机构编码长度不能超过6位", trigger: "blur" },
  ],
  yxsjgmc: [
    { required: true, message: "请输入意向省机构名称", trigger: "blur" },
    { max: 60, message: "意向省机构名称长度不能超过60字符", trigger: "blur" },
  ],
  yxshjgbm: [
    { required: true, message: "请输入意向市机构编码", trigger: "blur" },
    { max: 6, message: "意向市机构编码长度不能超过6位", trigger: "blur" },
  ],
  yxshjgmc: [
    { required: true, message: "请输入意向市机构名称", trigger: "blur" },
    { max: 60, message: "意向市机构名称长度不能超过60字符", trigger: "blur" },
  ],
  jydwhym: [
    { required: true, message: "请选择意向机构行业", trigger: "change" },
  ],
  yxlrsj: [
    { required: true, message: "请选择意向录入时间", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "blur" },
  ],
});

// 获取字典数据
const loadDictData = async () => {
  try {
    // 这里应该调用实际的字典接口，暂时使用模拟数据
    jyyxmOptions.value = [
      { label: "就业", value: "1" },
      { label: "升学", value: "2" },
      { label: "创业", value: "3" },
      { label: "其他", value: "9" },
    ];
    
    jydwhymOptions.value = [
      { label: "制造业", value: "C" },
      { label: "信息传输、软件和信息技术服务业", value: "I" },
      { label: "教育", value: "P" },
      { label: "其他", value: "Z" },
    ];
  } catch (error) {
    console.error("加载字典数据失败:", error);
  }
};

// 获取字典项文本
const getJyyxmText = (value?: string): string => {
  if (!value) return "";
  const option = jyyxmOptions.value.find(item => item.value === value);
  return option ? option.label : value || "";
};

const getJydwhymText = (value?: string): string => {
  if (!value) return "";
  const option = jydwhymOptions.value.find(item => item.value === value);
  return option ? option.label : value || "";
};

// 获取上报状态文本和标签类型
const getReportStatusText = (status?: string): string => {
  switch (status) {
    case "0": return "未上报";
    case "1": return "已上报";
    case "2": return "上报失败";
    default: return "未知";
  }
};

const getReportStatusTagType = (status?: string): "info" | "success" | "danger" | "warning" => {
  switch (status) {
    case "0": return "info";
    case "1": return "success";
    case "2": return "danger";
    default: return "warning";
  }
};

// 格式化显示时间
const formatDisplayTime = (time?: string): string => {
  if (!time) return "";
  if (time.length === 8) {
    // YYYYMMDD
    return time.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  } else if (time.length === 15) {
    // YYYYMMDD HHmmss
    return time.replace(/(\d{4})(\d{2})(\d{2}) (\d{2})(\d{2})(\d{2})/, "$1-$2-$3 $4:$5:$6");
  }
  return time;
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsXsjyyxsjPage(queryParams);
    const data = response.data.data || response.data;
    dataList.value = data.records || [];
    total.value = data.total || 0;
  } catch (error) {
    console.error("查询学生就业意向数据失败:", error);
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
  queryFormRef.value?.resetFields();
  Object.assign(queryParams, {
    zjsjwyxbs: "",
    xxdm: schoolCode.value,
    xh: "",
    zyh: "",
    jyyxm: "",
    yxdw: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
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
const handleUpdate = async (row: OdsXsjyyxsjInfo) => {
  try {
    const response: any = await getOdsXsjyyxsjById(row.id);
    const data = response.data.data || response.data;
    Object.assign(form, {
      id: data.id,
      zjsjwyxbs: data.zjsjwyxbs,
      xxdm: data.xxdm,
      xh: data.xh,
      zyh: data.zyh,
      jyyxm: data.jyyxm,
      jyyxsm: data.jyyxsm,
      yxsjgbm: data.yxsjgbm,
      yxsjgmc: data.yxsjgmc,
      yxshjgbm: data.yxshjgbm,
      yxshjgmc: data.yxshjgmc,
      jydwhym: data.jydwhym,
      yxdw: data.yxdw,
      yxlrsj: data.yxlrsj,
      sjcjsj: data.sjcjsj,
      enableStatus: data.enableStatus,
      bz: data.bz,
    });
    dialogMode.value = "edit";
    dialogVisible.value = true;
  } catch (error) {
    console.error("获取学生就业意向数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsXsjyyxsjInfo) => {
  try {
    const response: any = await getOdsXsjyyxsjById(row.id);
    const data = response.data.data || response.data;
    Object.assign(form, data);
    dialogMode.value = "view";
    dialogVisible.value = true;
  } catch (error) {
    console.error("获取学生就业意向数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsXsjyyxsjInfo) => {
  ElMessageBox.confirm("确定要删除这条学生就业意向数据吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const response: any = await deleteOdsXsjyyxsj(row.id);
        if (response.data.code === 200) {
          ElMessage.success("删除成功");
          getList();
        } else {
          ElMessage.error(response.data.msg || "删除失败");
        }
      } catch (error) {
        console.error("删除学生就业意向数据失败:", error);
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {
      // 用户取消删除
    });
};
//获取学生综合信息选项列表（包含专业信息）
const getStudentOptionsData = async (keyword?: string) => {
  const response: any = await getStudentOptions(keyword);
  studentOptions.value = response.data.data;
};
// 选择学生综合信息选项列表（包含专业信息）
const changeStudentOptions = (value: string) => {
  form.xh = value;
  form.zyh = studentOptions.value.find((item: StudentOption) => item.xh === value)?.zyh || "";
};
// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 条学生就业意向数据吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      try {
        const ids = selectedRows.value.map(item => item.id);
        const response: any = await batchDeleteOdsXsjyyxsj(ids);
        if (response.data.code === 200) {
          ElMessage.success("批量删除成功");
          selectedRows.value = [];
          getList();
        } else {
          ElMessage.error(response.data.msg || "批量删除失败");
        }
      } catch (error) {
        console.error("批量删除学生就业意向数据失败:", error);
        ElMessage.error("批量删除失败");
      }
    })
    .catch(() => {
      // 用户取消删除
    });
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出数据，请稍候...");
    const response = await exportOdsXsjyyxsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.ms-excel",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const filename = `学生就业意向数据子类表_${timestamp}.xlsx`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error: any) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败: " + (error.message || "未知错误"));
  }
};

// 表格选择
const handleSelectionChange = (selection: OdsXsjyyxsjInfo[]) => {
  selectedRows.value = selection;
};

// 行点击
const handleRowClick = (row: OdsXsjyyxsjInfo) => {
  // 单击行选中
};

// 行双击
const handleRowDblClick = (row: OdsXsjyyxsjInfo) => {
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
      xxdm: schoolCode.value,
      xh: "",
      zyh: "",
      jyyxm: "",
      jyyxsm: "",
      yxsjgbm: "",
      yxsjgmc: "",
      yxshjgbm: "",
      yxshjgmc: "",
      jydwhym: "",
      yxdw: "",
      yxlrsj: "",
      sjcjsj: "",
      enableStatus: "1",
      bz: "",
    });
    formRef.value?.clearValidate();
  };

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsXsjyyxsj(form);
    } else {
      response = await updateOdsXsjyyxsj(form);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.msg || "操作失败");
    }
  } catch (error) {
    console.error("表单提交失败:", error);
    ElMessage.error("操作失败");
  } finally {
    submitLoading.value = false;
  }
};

const getSystemSchoolCodeData = async () => {
  const response: any = await getSystemSchoolCode();
  schoolCode.value = response.data.data;
};

// 页面加载
onMounted(() => {
  getSystemSchoolCodeData();
  loadDictData();
  getList();
});
</script>

<style scoped>
.student-employment-intention-management {
  padding: 0;
  margin: 0;
}

.search-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.search-card .search-bar {
  padding: 8px 12px 0;
}

.search-card .el-form--inline .el-form-item {
  margin-right: 12px;
  margin-bottom: 8px;
}

.search-card :deep(.el-form-item__content) {
  line-height: 28px;
}

.search-card :deep(.el-input__wrapper) {
  padding: 0 8px;
}

.search-card :deep(.el-input__inner) {
  height: 28px;
}

.search-card :deep(.el-button) {
  padding: 6px 12px;
  height: 28px;
}

.table-card {
  margin-top: -10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.operation-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.operation-buttons .el-divider--vertical {
  height: 16px;
  margin: 0 4px;
}

.operation-buttons :deep(.el-button) {
  padding: 6px 12px;
  height: 28px;
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  flex: 1;
  text-align: center;
}

.placeholder {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-body {
  padding: 0;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.action-buttons .el-button + .el-button {
  margin-left: 4px;
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  background-color: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.total-info {
  color: #606266;
  font-size: 12px;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.pagination-controls :deep(.el-pagination) {
  height: 28px;
  line-height: 28px;
}

.pagination-controls :deep(.el-pagination .el-pagination__total) {
  font-size: 12px;
}

.pagination-controls :deep(.el-pagination .el-pagination__sizes) {
  margin: 0 8px;
}

.pagination-controls :deep(.el-pagination .el-select .el-input) {
  width: 80px;
}

.pagination-controls :deep(.el-pagination button) {
  height: 24px;
  min-width: 24px;
}

.employment-intention-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  margin: 0;
}

.employment-intention-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
}

.employment-intention-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 18px;
}

.employment-intention-dialog :deep(.el-dialog__body) {
  padding: 24px;
  max-height: 580px;
  overflow-y: auto;
}



.employment-intention-dialog :deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

.employment-intention-detail {
  padding: 16px 0;
}

.detail-descriptions :deep(.el-descriptions__label) {
  font-weight: 600;
  color: #303133;
  background-color: #f8f9fa;
}

.detail-descriptions :deep(.el-descriptions__content) {
  background-color: #ffffff;
}

.detail-value {
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 20px;
}

.el-table :deep(.el-table__header-wrapper) {
  background-color: #f8f9fa;
}

.el-table :deep(.el-table__header th) {
  background-color: #f8f9fa;
  color: #303133;
  font-weight: 600;
}

.el-table :deep(.el-table__body tr:hover) {
  background-color: #f0f9ff;
}

.el-table :deep(.el-table__body tr.hover-row td) {
  background-color: #f0f9ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .operation-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .header-title {
    text-align: center;
    order: -1;
  }
  
  .placeholder {
    justify-content: center;
  }
}
</style>
