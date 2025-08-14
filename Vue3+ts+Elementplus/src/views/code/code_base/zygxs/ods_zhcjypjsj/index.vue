<template>
  <div class="comprehensive-evaluation-management">
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
          <el-form-item label="学生姓名" prop="xsxm">
            <el-input
              v-model="queryParams.xsxm"
              placeholder="请输入学生姓名"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="专业名称" prop="zymc">
            <el-input
              v-model="queryParams.zymc"
              placeholder="请输入专业名称"
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
        </div>
        <div class="header-title"></div>
        <div>综合成绩与评价数据子类表(ODS_ZHCJYPJSJ)</div>
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
          height="100%"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column prop="zjsjwyxbs" label="唯一性标识" min-width="160" show-overflow-tooltip sortable="custom"/>
          <el-table-column prop="xxdm" label="学校代码" min-width="120" show-overflow-tooltip sortable="custom"/>
          <el-table-column prop="xn" label="学年" min-width="100" show-overflow-tooltip sortable="custom"/>
          <el-table-column label="学期" prop="xqm" width="80" sortable="custom">
            <template #default="{ row }">{{ row.xqmText || row.xqm }}</template>
          </el-table-column>
          <el-table-column prop="xh" label="学号" min-width="120" show-overflow-tooltip sortable="custom"/>
          <el-table-column prop="xsxm" label="学生姓名" min-width="100" show-overflow-tooltip sortable="custom"/>
          <el-table-column prop="zyh" label="专业号" min-width="120" show-overflow-tooltip sortable="custom"/>
          <el-table-column prop="zymc" label="专业名称" min-width="150" show-overflow-tooltip sortable="custom"/>
          
          <el-table-column prop="sjcjsj" label="采集时间" min-width="160" align="center" sortable="custom"/>
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
               <el-tag :type="getReportStatusType(row.reportStatus)" size="small">{{ getReportStatusText(row.reportStatus) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enableStatus === '1' ? 'success' : 'danger'" size="small">{{ row.enableStatus === "1" ? "启用" : "禁用" }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button link type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon>查看</el-button>
                <el-button link type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon>编辑</el-button>
                <el-button link type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon>删除</el-button>
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
            @size-change="getList"
            @current-change="getList"
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
      class="comprehensive-dialog"
      destroy-on-close
    >
      <el-form v-if="dialogMode !== 'view'" ref="formRef" :model="form" :rules="rules" label-width="150px">
        <el-row :gutter="20">
          <el-col  style="margin-bottom: 20px;" :span="12"><el-form-item label="唯一性标识" prop="zjsjwyxbs"><el-input v-model="form.zjsjwyxbs" placeholder="可留空, 系统将自动生成" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="学校代码" prop="xxdm"><el-input v-model="form.xxdm" placeholder="系统自动获取" readonly disabled /></el-form-item></el-col>
          <el-col style="margin-bottom: 20px;" :span="12">
            <el-form-item label="学年" prop="xn">
              <el-select v-model="form.xn" placeholder="请选择学年" style="width: 100%;">
                <el-option v-for="item in schoolYearOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"><el-form-item label="学期" prop="xqm"><el-select v-model="form.xqm" placeholder="请选择学期" style="width: 100%;"><el-option v-for="item in semesterOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col style="margin-bottom: 20px;" :span="24">
            <el-form-item label="学生信息" prop="xh">
              <div style="display: flex; align-items: center;width: 100%; gap: 8px;">
                <el-select
                  v-model="form.xh"
                  placeholder="请输入学号或姓名进行搜索"
                  filterable
                  remote
                  :remote-method="searchStudentOptions"
                  :loading="studentOptionsLoading"
                  style="flex: 1;"
                  @change="handleStudentSelect"
                  clearable
                >
                  <el-option
                    v-for="item in studentOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：学生画像数据子类表(ODS_XSHXSJ)
学号、姓名：直接获取
专业号、专业名称：从评价维度及结果JSON字段提取"
                  placement="top"
                  effect="light"
                  :show-after="200"
                >
                  <el-icon style="color: #E6A23C; font-size: 16px; cursor: help; flex-shrink: 0;">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="学号" prop="xh">
            <div style="display: flex; align-items: center; width: 100%">
            <el-input v-model="form.xh" placeholder="学号" readonly />
            <el-tooltip
                    content="学号数据来源于学生信息数据子类表"
                    placement="top"
                  >
                    <el-icon
                      style="margin-left: 8px; cursor: help; color: #e6a23c"
                      ><InfoFilled
                    /></el-icon>
                  </el-tooltip>
            </div></el-form-item></el-col>
          <el-col   :span="12"><el-form-item label="学生姓名" prop="xsxm">
            <div style="display: flex; align-items: center; width: 100%">
            <el-input v-model="form.xsxm" placeholder="学生姓名" readonly />
            <el-tooltip
                    content="学号数据来源于学生信息数据子类表"
                    placement="top"
                  >
                    <el-icon
                      style="margin-left: 8px; cursor: help; color: #e6a23c"
                      ><InfoFilled
                    /></el-icon>
                  </el-tooltip>
            </div></el-form-item></el-col>
          <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="专业号" prop="zyh">
            <div style="display: flex; align-items: center; width: 100%">
            <el-input v-model="form.zyh" placeholder="专业号" readonly />
            <el-tooltip
                    content="学号数据来源于学生信息数据子类表"
                    placement="top"
                  >
                    <el-icon
                      style="margin-left: 8px; cursor: help; color: #e6a23c"
                      ><InfoFilled
                    /></el-icon>
                  </el-tooltip>
            </div></el-form-item></el-col>
          <el-col   :span="12"><el-form-item label="专业名称" prop="zymc">
            <div style="display: flex; align-items: center; width: 100%">
            <el-input v-model="form.zymc" placeholder="专业名称" readonly />
            <el-tooltip
                    content="学号数据来源于学生信息数据子类表"
                    placement="top"
                  >
                    <el-icon
                      style="margin-left: 8px; cursor: help; color: #e6a23c"
                      ><InfoFilled
                    /></el-icon>
                  </el-tooltip>
            </div></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="公基课已获学分" prop="ggjckyhxf"><el-input-number v-model="form.ggjckyhxf" :precision="1" :min="0" placeholder="总学分(1位小数)" style="width: 100%;" /></el-form-item></el-col>
          <el-col  style="margin-bottom: 20px;"   :span="12"><el-form-item label="专基课已获学分" prop="zyjckyhxf"><el-input-number v-model="form.zyjckyhxf" :precision="1" :min="0" placeholder="总学分(1位小数)" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="专核课已获学分" prop="zyhxkyhxf"><el-input-number v-model="form.zyhxkyhxf" :precision="1" :min="0" placeholder="总学分(1位小数)" style="width: 100%;" /></el-form-item></el-col>
          <el-col style="margin-bottom: 20px;"  :span="12"><el-form-item label="专拓课已获学分" prop="zytzkyhxf"><el-input-number v-model="form.zytzkyhxf" :precision="1" :min="0" placeholder="总学分(1位小数)" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="公基课成绩" prop="ggjckcj"><el-input-number v-model="form.ggjckcj" :precision="1" :min="0" placeholder="平均成绩(1位小数)" style="width: 100%;" /></el-form-item></el-col>
          <el-col  style="margin-bottom: 20px;" :span="12"><el-form-item label="专基课成绩" prop="zyjckcj"><el-input-number v-model="form.zyjckcj" :precision="1" :min="0" placeholder="平均成绩(1位小数)" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="专核课成绩" prop="zyhxkcj"><el-input-number v-model="form.zyhxkcj" :precision="1" :min="0" placeholder="平均成绩(1位小数)" style="width: 100%;" /></el-form-item></el-col>
          <el-col style="margin-bottom: 20px;"  :span="12"><el-form-item label="专拓课成绩" prop="zytzkcj"><el-input-number v-model="form.zytzkcj" :precision="1" :min="0" placeholder="平均成绩(1位小数)" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="岗位实习成绩" prop="gwsxcj"><el-input-number v-model="form.gwsxcj" :precision="1" :min="0" placeholder="成绩(1位小数),非必填" style="width: 100%;" /></el-form-item></el-col>
          <el-col style="margin-bottom: 20px;"  :span="12"><el-form-item label="录入日期" prop="lrrq"><el-date-picker v-model="form.lrrq" type="date" placeholder="格式: YYYYMMDD" value-format="YYYYMMDD" format="YYYY-MM-DD" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="启用状态" prop="enableStatus"><el-select v-model="form.enableStatus" placeholder="请选择状态" style="width: 100%;"><el-option label="启用" value="1" /><el-option label="禁用" value="0" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="上报状态" prop="reportStatus"><el-select v-model="form.reportStatus" placeholder="请选择上报状态" style="width: 100%;"><el-option label="未上报" value="0" /><el-option label="已上报" value="1" /><el-option label="上报失败" value="2" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="数据采集时间" prop="sjcjsj"><el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="格式: YYYYMMDD hhmmss" value-format="YYYYMMDD HHmmss" format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" /></el-form-item></el-col>
        </el-row>
      </el-form>
      
      <div v-else class="student-detail">
        <el-descriptions :column="2" size="large" border>
          <el-descriptions-item label="唯一性标识">{{ form.zjsjwyxbs }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{ form.xxdm }}</el-descriptions-item>
          <el-descriptions-item label="学年">{{ form.xn }}</el-descriptions-item>
          <el-descriptions-item label="学期">{{ form.xqmText || form.xqm }}</el-descriptions-item>
          <el-descriptions-item label="专业号">{{ form.zyh }}</el-descriptions-item>
          <el-descriptions-item label="专业名称">{{ form.zymc }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ form.xh }}</el-descriptions-item>
          <el-descriptions-item label="学生姓名">{{ form.xsxm }}</el-descriptions-item>
          <el-descriptions-item label="公共基础课已获学分">{{ form.ggjckyhxf }}</el-descriptions-item>
          <el-descriptions-item label="专业基础课已获学分">{{ form.zyjckyhxf }}</el-descriptions-item>
          <el-descriptions-item label="专业核心课已获学分">{{ form.zyhxkyhxf }}</el-descriptions-item>
          <el-descriptions-item label="专业拓展课已获学分">{{ form.zytzkyhxf }}</el-descriptions-item>
          <el-descriptions-item label="公共基础课成绩">{{ form.ggjckcj }}</el-descriptions-item>
          <el-descriptions-item label="专业基础课成绩">{{ form.zyjckcj }}</el-descriptions-item>
          <el-descriptions-item label="专业核心课成绩">{{ form.zyhxkcj }}</el-descriptions-item>
          <el-descriptions-item label="专业拓展课成绩">{{ form.zytzkcj }}</el-descriptions-item>
          <el-descriptions-item label="岗位实习成绩">{{ form.gwsxcj }}</el-descriptions-item>
          <el-descriptions-item label="录入日期">{{ form.lrrq }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{ form.sjcjsj }}</el-descriptions-item>
           <el-descriptions-item label="启用状态">
            <el-tag :type="form.enableStatus === '1' ? 'success' : 'danger'" size="small">{{ form.enableStatus === "1" ? "启用" : "禁用" }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusType(form.reportStatus)" size="small">{{ getReportStatusText(form.reportStatus) }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogMode !== 'view'" type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  computed,
  toRefs
} from "vue";
import type {
  FormInstance,
  FormRules
} from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
  Warning,
} from "@element-plus/icons-vue";
import {
  ElMessage,
  ElMessageBox
} from "element-plus";
import {
  getOdsZhcjypjsjPage,
  getOdsZhcjypjsjById,
  addOdsZhcjypjsj,
  updateOdsZhcjypjsj,
  deleteOdsZhcjypjsj,
  batchDeleteOdsZhcjypjsj,
  exportOdsZhcjypjsj,
  getDicts,
  getStudentComprehensiveOptions,
} from "@/api-code/code/code_base/zygxs/ods_zhcjypjsj";
import {
  getSystemSchoolCode
} from "@/api-code/code/code_base/zygxx/ods_xxhxtjssj";


// 接口返回数据
interface OdsZhcjypjsjVO {
  id?: number;
  zjsjwyxbs: string;
  xxdm: string;
  xn: string;
  xqm: string;
  zyh: string;
  zymc: string;
  xh: string;
  xsxm: string;
  ggjckyhxf: number;
  zyjckyhxf: number;
  zyhxkyhxf: number;
  zytzkyhxf: number;
  ggjckcj: number;
  zyjckcj: number;
  zyhxkcj: number;
  zytzkcj: number;
  gwsxcj: number | undefined;
  lrrq: string;
  sjcjsj: string;
  reportStatus: string;
  enableStatus: string;
  createTime ? : string;
  updateTime ? : string;
  xqmText?: string;
}

const queryFormRef = ref < FormInstance > ();
const formRef = ref < FormInstance > ();
const loading = ref(false);
const total = ref(0);
const dataList = ref < OdsZhcjypjsjVO[] > ([]);
const selectedRows = ref < OdsZhcjypjsjVO[] > ([]);
const systemSchoolCode = ref("");


const state = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 100,
    zjsjwyxbs: undefined,
    xxdm: undefined,
    xn: undefined,
    zyh: undefined,
    zymc: undefined,
    xh: undefined,
    xsxm: undefined,
  },
  form: {} as OdsZhcjypjsjVO,
  rules: {
    zjsjwyxbs: [
      { pattern: /^[A-Z0-9]{32}$/, message: '唯一标识必须是32位大写字母和数字的组合', trigger: 'blur' }
    ],
    xxdm: [
      { required: true, message: '学校代码不能为空', trigger: 'blur' },
      { max: 10, message: '学校代码长度不能超过10个字符', trigger: 'blur' }
    ],
    xn: [{ required: true, message: '学年不能为空', trigger: 'change' }],
    xqm: [{ required: true, message: '学期码不能为空', trigger: 'change' }],
    zyh: [
      { required: true, message: '专业号不能为空', trigger: 'blur' },
      { max: 64, message: '专业号长度不能超过64个字符', trigger: 'blur' }
    ],
    zymc: [{ max: 60, message: '专业名称长度不能超过60个字符', trigger: 'blur' }],
    xh: [
      { required: true, message: '学号不能为空', trigger: 'blur' },
      { max: 20, message: '学号长度不能超过20个字符', trigger: 'blur' }
    ],
    xsxm: [{ max: 36, message: '学生姓名长度不能超过36个字符', trigger: 'blur' }],
    ggjckyhxf: [{ required: true, message: '公共基础课已获学分不能为空', trigger: 'blur' }],
    zyjckyhxf: [{ required: true, message: '专业基础课已获学分不能为空', trigger: 'blur' }],
    zyhxkyhxf: [{ required: true, message: '专业核心课已获学分不能为空', trigger: 'blur' }],
    zytzkyhxf: [{ required: true, message: '专业拓展课已获学分不能为空', trigger: 'blur' }],
    ggjckcj: [{ required: true, message: '公共基础课成绩不能为空', trigger: 'blur' }],
    zyjckcj: [{ required: true, message: '专业基础课成绩不能为空', trigger: 'blur' }],
    zyhxkcj: [{ required: true, message: '专业核心课成绩不能为空', trigger: 'blur' }],
    zytzkcj: [{ required: true, message: '专业拓展课成绩不能为空', trigger: 'blur' }],
    lrrq: [{ required: true, message: '录入日期不能为空', trigger: 'change' }],
    sjcjsj: [{ required: true, message: '数据采集时间不能为空', trigger: 'change' }],
    enableStatus: [{ required: true, message: '启用状态不能为空', trigger: 'change' }],
  } as FormRules,
  dialogVisible: false,
  dialogMode: 'add' as 'add' | 'edit' | 'view',
});

const {
  queryParams,
  form,
  rules,
  dialogVisible,
  dialogMode
} = toRefs(state);


const semesterOptions = ref<{ label: string; value: string; }[]>([]);

const schoolYearOptions = ref<{ label: string; value: string; }[]>([]);
const generateSchoolYearOptions = () => {
  const currentYear = new Date().getFullYear();
  schoolYearOptions.value = [
    { label: `${currentYear - 1}-${currentYear}`, value: `${currentYear - 1}-${currentYear}` },
    { label: `${currentYear}-${currentYear + 1}`, value: `${currentYear}-${currentYear + 1}` },
  ];
};
generateSchoolYearOptions();


const dialogTitle = computed(() => {
  const titles = {
    add: '新增综合成绩与评价数据',
    edit: '编辑综合成绩与评价数据',
    view: '查看综合成绩与评价数据'
  };
  return titles[dialogMode.value];
});


const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsZhcjypjsjPage(queryParams.value) as any;
    dataList.value = response.data.data.records.map((item: any) => ({
      ...item,
      xqmText: semesterOptions.value.find(o => o.value === item.xqm)?.label
    }));
    total.value = response.data.data.total;
  } finally {
    loading.value = false;
  }
};

const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};


const handleSelectionChange = (selection: OdsZhcjypjsjVO[]) => {
  selectedRows.value = selection;
};

const handleRowDblClick = (row: OdsZhcjypjsjVO) => {
  handleView(row);
};

const resetForm = () => {
  form.value = {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    xn: "",
    xqm: "",
    zyh: "",
    zymc: "",
    xh: "",
    xsxm: "",
    ggjckyhxf: 0,
    zyjckyhxf: 0,
    zyhxkyhxf: 0,
    zytzkyhxf: 0,
    ggjckcj: 0,
    zyjckcj: 0,
    zyhxkcj: 0,
    zytzkcj: 0,
    gwsxcj: undefined,
    lrrq: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  } as OdsZhcjypjsjVO;
  formRef.value?.resetFields();
};


const handleAdd = () => {
  resetForm();
  dialogMode.value = 'add';
  dialogVisible.value = true;
};

const handleEdit = async (row: OdsZhcjypjsjVO) => {
  resetForm();
  const response = await getOdsZhcjypjsjById(row.id as number) as any;
  form.value = response.data.data;
  dialogMode.value = 'edit';
  dialogVisible.value = true;
};

const handleView = async (row: OdsZhcjypjsjVO) => {
  const response = await getOdsZhcjypjsjById(row.id as number) as any;
  form.value = {
    ...response.data.data,
    xqmText: semesterOptions.value.find(o => o.value === response.data.data.xqm)?.label
  };
  dialogMode.value = 'view';
  dialogVisible.value = true;
};


const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const isEdit = dialogMode.value === 'edit';
      try {
        if (isEdit) {
          await updateOdsZhcjypjsj(form.value);
        } else {
          await addOdsZhcjypjsj(form.value);
        }
        ElMessage.success(isEdit ? '修改成功' : '新增成功');
        dialogVisible.value = false;
        getList();
      } catch (err) {
        // Error handling
      }
    }
  });
};


const handleDelete = (row: OdsZhcjypjsjVO) => {
  ElMessageBox.confirm(`确定删除学号为"${row.xh}"的数据吗？`, '警告', {
    type: 'warning'
  }).then(async () => {
    await deleteOdsZhcjypjsj(row.id as number);
    ElMessage.success('删除成功');
    getList();
  });
};


const handleBatchDelete = () => {
  const ids = selectedRows.value.map(item => item.id as number);
  ElMessageBox.confirm(`确定删除选中的${ids.length}条数据吗？`, '警告', {
    type: 'warning'
  }).then(async () => {
    await batchDeleteOdsZhcjypjsj(ids);
    ElMessage.success('删除成功');
    getList();
  });
};


const handleExport = async () => {
  try {
    const response = await exportOdsZhcjypjsj(queryParams.value);
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `综合成绩与评价数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    ElMessage.error('导出失败');
  }
};


const getReportStatusType = (status:string) => {
    if (status === '1') return 'success';
    if (status === '2') return 'danger';
    return 'info';
};

const getReportStatusText = (status:string) => {
    if (status === '1') return '已上报';
    if (status === '2') return '上报失败';
    return '未上报';
};

// 学生综合信息选项
const studentOptions = ref<Array<{
  value: string;  // 学号作为选择值
  label: string;  // 学号 - 姓名
  xh: string;     // 学号
  xsxm: string;   // 学生姓名
  zyh: string;    // 专业号
  zymc: string;   // 专业名称
}>>([]);
const studentOptionsLoading = ref(false);

// 搜索学生综合信息
const searchStudentOptions = async (keyword: string) => {
  // 如果关键字为空或长度小于2，清空选项
 
  
  studentOptionsLoading.value = true;
  try {
    const response = await getStudentComprehensiveOptions(keyword.trim()) as any;
    studentOptions.value = response.data.data || [];
  } catch (error) {
    console.error('搜索学生信息失败:', error);
    studentOptions.value = [];
  } finally {
    studentOptionsLoading.value = false;
  }
};

// 选择学生信息
const handleStudentSelect = (selectedValue: string) => {
  const selectedStudent = studentOptions.value.find(item => item.value === selectedValue);
  console.log("选中的学生信息:", selectedStudent);
  
  if (selectedStudent) {
    form.value.xh = selectedStudent.xh;
    form.value.xsxm = selectedStudent.xsxm;
    form.value.zyh = selectedStudent.zyh;
    form.value.zymc = selectedStudent.zymc;
  }
};

onMounted(async () => {
  try {
    const dictResponse = await getDicts('XQDM') as any;
    semesterOptions.value = dictResponse.data.data;

    const schoolCodeResponse = await getSystemSchoolCode() as any;
    systemSchoolCode.value = schoolCodeResponse.data.data;
    form.value.xxdm = schoolCodeResponse.data.data;
  } catch (e) {
    console.error("初始化页面数据失败", e);
  }
  getList();
});
</script>

<style scoped>
.comprehensive-evaluation-management {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px 10px 20px;
  box-sizing: border-box;
}
.search-card {
  flex-shrink: 0;
  margin-bottom: 10px;
}
.search-card :deep(.el-card__body) {
    padding-bottom: 0;
}
.table-card {
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden; 
}
.table-card :deep(.el-card__body) {
  padding: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fafafa;
  flex-shrink: 0;
}
.table-header .operation-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}
.table-header .header-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  flex: 1;
  text-align: center;
}
.table-header .placeholder {
  width: 100px;
  display: flex;
  justify-content: flex-end;
}
.table-body {
  flex-grow: 1;
  overflow: hidden;
}
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  border-top: 1px solid #e4e7ed;
  background-color: #fafafa;
  flex-shrink: 0;
}
.pagination-wrapper .total-info {
  font-size: 14px;
  color: #606266;
}
.action-buttons {
  display: flex;
  justify-content: center;
}
.comprehensive-dialog :deep(.el-dialog__body) {
  padding: 20px 24px;
  max-height: 65vh;
  overflow-y: auto;
}
.student-detail .el-descriptions {
  margin-top: 20px;
}
.student-detail .el-descriptions__label {
    font-weight: 600;
}
</style>
