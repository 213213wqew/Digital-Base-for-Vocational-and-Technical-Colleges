<template>
  <div class="club-activity-management">
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
          <el-form-item label="学生姓名" prop="xsxm">
            <el-input
              v-model="queryParams.xsxm"
              placeholder="请输入学生姓名"
              clearable
            />
          </el-form-item>
          <el-form-item label="社团活动名称" prop="sthdmc">
            <el-input
              v-model="queryParams.sthdmc"
              placeholder="请输入社团活动名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="活动类型" prop="sthdlxm">
            <el-select
              v-model="queryParams.sthdlxm"
              placeholder="请选择社团活动类型"
              clearable
            >
              <el-option
                v-for="item in activityTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
        <div class="header-title">参加社团活动数据管理</div>
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
            prop="sthdbh"
            label="社团活动编号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sthdmc"
            label="社团活动名称"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="活动类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getActivityTypeText(row.sthdlxm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cjsthdsj"
            label="参加时间"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            label="获奖级别"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getAwardLevelText(row.hjjbm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="hjrq"
            label="获奖日期"
            min-width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="zdjsxm"
            label="指导教师"
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
      style="height: 560px"
      class="activity-dialog"
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
                  :remote-method="getActivityStudentJoinDatalist"
                  placeholder="请选择学号"
                  filterable
                  remote
                  reserve-keyword
                  :loading="loading"
                  @change="handleChange"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                     v-for="item in activityStudentJoinData"
                    :key="item.xh"
                    :label="item.xh+item.xsxm"
                    :value="item.xh"
                   />
                
                </el-select>
                   <el-tooltip content="数据来源于学生参与社团数据子类表和社团活动数据子类表" placement="top">
                      <el-icon style="color: #e6a23c"><Warning /></el-icon>
                   </el-tooltip>
              </div>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="xsxm">
              <div style="display: flex; align-items: center; gap: 8px"> 
              <el-select
                v-model="form.xsxm"
                :remote-method="getActivityStudentJoinDatalist"
                @change="handleChange"
                filterable
                remote
                reserve-keyword
                :loading="loading"
                style="width: 100%"
              > 
              <el-option
                  v-for="item in activityStudentJoinData"
                  :key="item.xh"
                  :label="item.xsxm"
                  :value="item.xh"
                />
              </el-select>
              <el-tooltip content="数据来源于学生参与社团数据子类表和社团活动数据子类表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社团活动编号" prop="sthdbh">
              <div style="display: flex; align-items: center; gap: 8px"> 
              <el-input
                v-model="form.sthdbh"
                placeholder="请输入社团活动编号"
                maxlength="32"
                show-word-limit
              />
              <el-tooltip content="数据来源于社团活动数据子类表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社团活动名称" prop="sthdmc">
              <div style="display: flex; align-items: center; gap: 8px"> 
              <el-input
                v-model="form.sthdmc"
                placeholder="请输入社团活动名称"
                maxlength="150"
                show-word-limit
              />
              <el-tooltip content="数据来源于社团活动数据子类表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社团活动类型" prop="sthdlxm">
              <div style="display: flex; align-items: center; gap: 8px"> 
                <el-select
                  v-model="form.sthdlxm"
                  placeholder="请选择社团活动类型"
                  filterable
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in activityTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参加活动时间" prop="cjsthdsj">
              <el-date-picker
                v-model="form.cjsthdsj"
                type="datetime"
                placeholder="请选择参加活动时间"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖级别" prop="hjjbm">
              <el-select
                v-model="form.hjjbm"
                placeholder="请选择获奖级别"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in awardLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖日期" prop="hjrq">
              <el-date-picker
                v-model="form.hjrq"
                type="date"
                placeholder="请选择获奖日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颁奖单位" prop="bjdw">
              <el-input
                v-model="form.bjdw"
                placeholder="请输入颁奖单位"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指导教师姓名" prop="zdjsxm">
              <el-input
                v-model="form.zdjsxm"
                placeholder="请输入指导教师姓名"
                maxlength="150"
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
      <div v-else class="activity-detail">
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
          <el-descriptions-item label="社团活动编号">
            <div class="detail-value">{{ form.sthdbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="社团活动名称">
            <div class="detail-value">{{ form.sthdmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="社团活动类型">
            <div class="detail-value">
              {{ getActivityTypeText(form.sthdlxm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="参加活动时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.cjsthdsj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="获奖级别">
            <div class="detail-value">
              {{ getAwardLevelText(form.hjjbm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="获奖日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.hjrq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="颁奖单位">
            <div class="detail-value">{{ form.bjdw || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="指导教师姓名">
            <div class="detail-value">{{ form.zdjsxm || "-" }}</div>
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
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  View,
  Edit,
  Warning,
} from "@element-plus/icons-vue";
import {
  getOdsCjsthdsjPage,
  addOdsCjsthdsj,
  updateOdsCjsthdsj,
  deleteOdsCjsthdsj,
  getSchoolCode,
  getActivityStudentJoinData,
  batchDeleteOdsCjsthdsj,
  exportOdsCjsthdsj,  
  getOdsCjsthdsjById,
  getActivityTypeOptions,
  getAwardLevelOptions,
  type ActivityStudentJoinInfo,
  type OdsCjsthdsjForm,
  type OdsCjsthdsjQuery,
  type OdsCjsthdsjInfo,
} from "@/api/meta/meta_base/zygxs/ods_cjsthdsj";

// 字典选项接口类型
interface DictOption {
  label: string;
  value: string;
}

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsCjsthdsjInfo[]>([]);
const total = ref(0);
const selectedRows = ref<OdsCjsthdsjInfo[]>([]);
const schoolCode = ref("");
 
// 查询参数
const queryParams = reactive<OdsCjsthdsjQuery>({
  pageNum: 1,
  pageSize: 100,
  zjsjwyxbs: "",
  xxdm: schoolCode.value || "",
  xh: "",
  xsxm: "",
  sthdbh: "",
  sthdmc: "",
  sthdlxm: "",
  hjjbm: "",
  bjdw: "",
  zdjsxm: "",
});

// 表单数据
const form = reactive<OdsCjsthdsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: schoolCode.value,
  xh: "",
  xsxm: "",
  sthdbh: "",
  sthdmc: "",
  sthdlxm: "",
  cjsthdsj: "",
  hjjbm: "",
  hjrq: "",
  bjdw: "",
  zdjsxm: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 对话框相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const formRef = ref();
const queryFormRef = ref();

// 字典选项
const activityTypeOptions = ref<DictOption[]>([]);
const awardLevelOptions = ref<DictOption[]>([]);
const getActivityTypeOptionsData = async () => {
  const res = await getActivityTypeOptions() as any;
  activityTypeOptions.value = res.data.data;
};
const getAwardLevelOptionsData = async () => {
  const res = await getAwardLevelOptions() as any;
  awardLevelOptions.value = res.data.data;
};
// 计算属性
const dialogTitle = computed(() => {
  const titles = {
    add: "新增参加社团活动数据",
    edit: "编辑参加社团活动数据",
    view: "查看参加社团活动数据详情",
  };
  return titles[dialogMode.value];
});

// 表单验证规则
const rules = reactive({
  zjsjwyxbs: [
    { required: false, message: '主键数据唯一性标识可以为空', trigger: 'blur' },
    { max: 32, message: '主键数据唯一性标识长度不能超过32个字符', trigger: 'blur' }
  ],
  xxdm: [
    { required: true, message: '学校代码不能为空', trigger: 'blur' },
    { max: 10, message: '学校代码长度不能超过10个字符', trigger: 'blur' }
  ],
  xh: [
    { required: true, message: '学号不能为空', trigger: 'blur' },
    { max: 20, message: '学号长度不能超过20个字符', trigger: 'blur' }
  ],
  xsxm: [
    { max: 36, message: '学生姓名长度不能超过36个字符', trigger: 'blur' }
  ],
  sthdbh: [
    { required: true, message: '社团活动编号不能为空', trigger: 'blur' },
    { max: 32, message: '社团活动编号长度不能超过32个字符', trigger: 'blur' }
  ],
  sthdmc: [
    { required: true, message: '社团活动名称不能为空', trigger: 'blur' },
    { max: 150, message: '社团活动名称长度不能超过150个字符', trigger: 'blur' }
  ],
  sthdlxm: [
    { required: true, message: '社团活动类型码不能为空', trigger: 'change' },
    { max: 2, message: '社团活动类型码长度不能超过2个字符', trigger: 'blur' }
  ],
  cjsthdsj: [
    { required: true, message: '参加社团活动时间不能为空', trigger: 'blur' },
    { 
      pattern: /^\d{8}\s\d{6}$/, 
      message: '参加社团活动时间格式必须为YYYYMMDD HHMMSS', 
      trigger: 'blur' 
    }
  ],
  hjjbm: [
    { max: 2, message: '获奖级别码长度不能超过2个字符', trigger: 'blur' }
  ],
  hjrq: [
    { 
      required: true,
      pattern: /^\d{8}$/, 
      message: '获奖日期格式必须为YYYYMMDD', 
      trigger: 'blur' 
    }
  ],
  bjdw: [
    { max: 60, message: '颁奖单位长度不能超过60个字符', trigger: 'blur' }
  ],
  zdjsxm: [
    { max: 150, message: '指导教师姓名长度不能超过150个字符', trigger: 'blur' }
  ],
  sjcjsj: [
    { required: true, message: '数据采集时间不能为空', trigger: 'blur' },
    { 
      pattern: /^\d{8}\s\d{6}$/, 
      message: '数据采集时间格式必须为YYYYMMDD HHMMSS', 
      trigger: 'blur' 
    }
  ]
});
// 获取学号列表
const activityStudentJoinData = ref<ActivityStudentJoinInfo[]>([]);
const getActivityStudentJoinDatalist = async (query: string) => {
  const res = await getActivityStudentJoinData(query) as any;
  if (res.data.code === 200) {
    activityStudentJoinData.value = res.data.data;
  }
};
const handleChange = (value: string) => {
  form.xh = activityStudentJoinData.value.find(item => item.xh === value)?.xh || "";
  form.xsxm = activityStudentJoinData.value.find(item => item.xh === value)?.xsxm || "";
  form.sthdmc = activityStudentJoinData.value.find(item => item.xh === value)?.sthdmc || "";
  form.sthdbh = activityStudentJoinData.value.find(item => item.xh === value)?.sthdbh || "";
  form.sthdlxm = activityStudentJoinData.value.find(item => item.xh === value)?.sthdlxm || "";
};
 
// 获取活动类型文本
const getActivityTypeText = (code?: string) => {
  if (!code) return "";
  const option = activityTypeOptions.value.find(item => item.value === code);
  return option ? option.label : code;
};

// 获取获奖级别文本
const getAwardLevelText = (code?: string) => {
  if (!code) return "";
  const option = awardLevelOptions.value.find(item => item.value === code);
  return option ? option.label : code;
};

// 获取上报状态标签类型
const getReportStatusTagType = (status?: string): "success" | "danger" | "warning" | "info" | "primary" => {
  if (!status) return "info";
  const typeMap: Record<string, "success" | "danger" | "warning" | "info" | "primary"> = {
    "0": "info",
    "1": "success",
    "2": "danger",
  };
  return typeMap[status] || "info";
};

// 获取上报状态文本
const getReportStatusText = (status?: string) => {
  if (!status) return "未知";
  const textMap: Record<string, string> = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败",
  };
  return textMap[status] || "未知";
};

// 格式化显示时间
const formatDisplayTime = (timeStr?: string) => {
  if (!timeStr) return "";
  if (timeStr.length === 8) {
    return `${timeStr.slice(0, 4)}-${timeStr.slice(4, 6)}-${timeStr.slice(6, 8)}`;
  }
  if (timeStr.length === 15) {
    return `${timeStr.slice(0, 4)}-${timeStr.slice(4, 6)}-${timeStr.slice(6, 8)} ${timeStr.slice(8, 10)}:${timeStr.slice(10, 12)}:${timeStr.slice(12, 14)}`;
  }
  return timeStr;
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsCjsthdsjPage(queryParams) as any;
    dataList.value = response.data.data.records || [];
    total.value = response.data.data.total || 0;
  } catch (error) {
    console.error("查询参加社团活动数据失败:", error);
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
  if (queryFormRef.value) {
    queryFormRef.value.resetFields();
  }
  queryParams.pageNum = 1;
  getList();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: schoolCode.value || "",
    xh: "",
    xsxm: "",
    sthdbh: "",
    sthdmc: "",
    sthdlxm: "",
    cjsthdsj: "",
    hjjbm: "",
    hjrq: "",
    bjdw: "",
    zdjsxm: "",
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
  dialogVisible.value = true;
};

// 编辑
const handleUpdate = async (row: OdsCjsthdsjInfo) => {
  try {
    const response = await getOdsCjsthdsjById(row.id) as any;
    Object.assign(form, response.data.data);
    dialogMode.value = "edit";
    dialogVisible.value = true;
  } catch (error) {
    console.error("获取参加社团活动数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看
const handleView = async (row: OdsCjsthdsjInfo) => {
  try {
    const response = await getOdsCjsthdsjById(row.id) as any;
    Object.assign(form, response.data.data);
    dialogMode.value = "view";
    dialogVisible.value = true;
  } catch (error) {
    console.error("获取参加社团活动数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsCjsthdsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条参加社团活动数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await deleteOdsCjsthdsj(row.id);
    ElMessage.success("删除成功");
    getList();
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除参加社团活动数据失败:", error);
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
      `确定要删除选中的 ${selectedRows.value.length} 条数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const ids = selectedRows.value.map((item) => item.id);
    await batchDeleteOdsCjsthdsj(ids);
    ElMessage.success("批量删除成功");
    selectedRows.value = [];
    getList();
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除参加社团活动数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出数据，请稍候...");
    const response = await exportOdsCjsthdsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `参加社团活动数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出参加社团活动数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表格相关事件
const handleSelectionChange = (selection: OdsCjsthdsjInfo[]) => {
  selectedRows.value = selection;
};

const handleRowClick = (row: OdsCjsthdsjInfo) => {
  // 可以在这里添加行点击逻辑
};

const handleRowDblClick = (row: OdsCjsthdsjInfo) => {
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
    
    if (dialogMode.value === "add") {
      await addOdsCjsthdsj(form);
      ElMessage.success("新增成功");
    } else if (dialogMode.value === "edit") {
      await updateOdsCjsthdsj(form);
      ElMessage.success("更新成功");
    }

    dialogVisible.value = false;
    getList();
  } catch (error) {
    console.error("保存参加社团活动数据失败:", error);
    ElMessage.error("保存失败");
  }
};

// 初始化
const init = async () => {
  // 这里可以初始化字典数据
  // await loadDictOptions();
  await getList();
};
const getSchoolCodeData = async () => {
  const res = await getSchoolCode() as any;
  if (res.data.code === 200) {
    schoolCode.value = res.data.data;
  }
};

// 组件挂载
onMounted(() => {
  getActivityTypeOptionsData();
  getAwardLevelOptionsData();
  getSchoolCodeData();
  init();
});
</script>

<style scoped lang="scss">
.club-activity-management {
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
          .el-select {
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

.activity-dialog {
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

    .activity-detail {
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

// 响应式适配
@media (max-width: 1200px) {
  .club-activity-management {
    .search-card {
      .search-bar {
        .el-form {
          .el-form-item {
            .el-input,
            .el-select {
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

  .activity-dialog {
    width: 90% !important;
  }
}

@media (max-width: 768px) {
  .club-activity-management {
    min-height: calc(100vh - 80px);
    padding: 8px;

    .search-card {
      .search-bar {
        .el-form {
          .el-form-item {
            margin-right: 8px;
            margin-bottom: 8px;

            .el-input,
            .el-select {
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

  .activity-dialog {
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
