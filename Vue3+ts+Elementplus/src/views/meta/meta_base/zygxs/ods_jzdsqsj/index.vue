<template>
  <div class="professional-development-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
           
          <el-form-item label="学号" prop="xh">
            <el-input
              v-model="queryParams.xh"
              placeholder="请输入学号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
    
          <el-form-item label="奖助项目名称" prop="jzxmmc">
            <el-input
              v-model="queryParams.jzxmmc"
              placeholder="请输入奖助项目名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="奖助项目种类" prop="jzxmzlm">
            <el-select
            style="width: 100px;"
              v-model="queryParams.jzxmzlm"
              placeholder="请选择奖助项目种类"
              clearable
            >
              <el-option label="奖学金" value="01" />
              <el-option label="助学金" value="02" />
              <el-option label="助学贷款" value="03" />
              <el-option label="勤工助学" value="04" />
              <el-option label="其他" value="99" />
            </el-select>
          </el-form-item>
           
           
          <!-- <el-form-item label="申请日期" prop="sqrqRange">
            <el-date-picker
              v-model="sqrqRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYYMMDD"
              @change="handleSqrqRangeChange"
            />
          </el-form-item> -->
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
        <div class="header-title">奖助贷申请数据子表</div>
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
          :height="'calc(75vh - 100px)'"
          stripe
          size="small"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column
            prop="zjsjwyxbs"
            label="唯一性标识"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column prop="xxdm" label="学校代码" width="100" />
          <el-table-column prop="xh" label="学号" width="120" />
          <el-table-column prop="xsxm" label="学生姓名" width="120" />
          <el-table-column
            prop="jzxmmc"
            label="奖助项目名称"
            width="160"
            show-overflow-tooltip
          />
          <el-table-column prop="jzxmzlmText" label="项目种类" width="100" />
          <el-table-column
            prop="jzbz"
            label="奖助标准"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="zzdwgr"
            label="资助单位/个人"
            width="140"
            show-overflow-tooltip
          />
          <el-table-column prop="zjlymText" label="资金来源" width="100" />
          <el-table-column prop="sqrq" label="申请日期" width="100" />
          <el-table-column prop="spsj" label="审批时间" width="120" />
          <el-table-column prop="spztmText" label="审批状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.spztm)">
                {{ row.spztmText || "未知" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sjcjsj" label="数据采集时间" width="130" />
          <el-table-column prop="reportStatus" label="上报状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getReportStatusTagType(row.reportStatus)">
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="enableStatus" label="启用状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.enableStatus === '1' ? 'success' : 'danger'">
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="160" />
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
      @close="handleFormClose"
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
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可不填，后端将自动生成"
                maxlength="32"
                show-word-limit
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
              <div style="display: flex; align-items: center; width: 100%;">
                <el-select
                  v-model="form.xh"
                  placeholder="请输入学号关键字搜索"
                  clearable
                  filterable
                  :remote="true"
                  :remote-method="searchStudent"
                  :loading="studentLoading"
                  @change="handleStudentChange"
                  style="width: 100%; flex-grow: 1;"
                >
                  <el-option
                    v-for="item in studentOptions"
                    :key="item.xh"
                    :label="item.label"
                    :value="item.xh"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源 学号数据来源于学生信息数据子类表"
                  placement="top"
                >
                  <el-icon style="margin-left: 8px; color: #E6A23C; cursor: pointer;">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
        
            <el-form-item label="学生姓名" prop="xsxm">
              <div style="display: flex; align-items: center; width: 100%"> 
              <el-input
                v-model="form.xsxm"
                readonly
                placeholder="请输入学生姓名"
                maxlength="36"
                show-word-limit
              />
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
          <el-col :span="24">
            <el-form-item label="奖助项目名称" prop="jzxmmc">
              <el-input
                v-model="form.jzxmmc"
                placeholder="请输入奖助项目名称"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="奖助项目种类" prop="jzxmzlm">
              <el-select
                v-model="form.jzxmzlm"
                placeholder="请选择奖助项目种类"
                style="width: 100%"
              >
                <el-option
                  v-for="item in jzxmzlmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资金来源" prop="zjlym">
              <el-select
                v-model="form.zjlym"
                placeholder="请选择资金来源"
                style="width: 100%"
              >
                <el-option
                  v-for="item in zjlymOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="奖助标准" prop="jzbz">
              <el-input
                v-model="form.jzbz"
                type="textarea"
                :rows="3"
                placeholder="请输入奖助标准"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资助单位/个人" prop="zzdwgr">
              <el-input
                v-model="form.zzdwgr"
                placeholder="请输入资助单位/个人"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请日期" prop="sqrq">
              <el-date-picker
                v-model="form.sqrq"
                type="date"
                placeholder="请选择申请日期"
                format="YYYY-MM-DD"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批时间" prop="spsj">
              <el-date-picker
                v-model="form.spsj"
                type="datetime"
                placeholder="格式：YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYYMMDDHHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批状态" prop="spztm">
              <el-select
                v-model="form.spztm"
                placeholder="请选择审批状态"
                style="width: 100%"
              >
                <el-option
                  v-for="item in spztmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="格式：YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYYMMDDHHmmss"
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
          <el-descriptions-item label="学生姓名">
            <div class="detail-value">{{ form.xsxm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="奖助项目名称" :span="2">
            <div class="detail-value">{{ form.jzxmmc || "-" }}</div>
          </el-descriptions-item>
           <el-descriptions-item label="项目种类">
            <div class="detail-value">{{ getDictLabel(jzxmzlmOptions, form.jzxmzlm) }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="资金来源">
            <div class="detail-value">{{ getDictLabel(zjlymOptions, form.zjlym) }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="奖助标准" :span="2">
            <div class="detail-value" style="max-height: 100px; overflow-y: auto">
              {{ form.jzbz || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="资助单位/个人" :span="2">
            <div class="detail-value">{{ form.zzdwgr || "-" }}</div>
          </el-descriptions-item>
           <el-descriptions-item label="申请日期">
            <div class="detail-value">{{ form.sqrq || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="审批时间">
            <div class="detail-value">{{ form.spsj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="审批状态">
             <el-tag :type="getStatusTagType(form.spztm || '')">
              {{ getDictLabel(spztmOptions, form.spztm) || "未知" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">{{ form.sjcjsj || "-" }}</div>
          </el-descriptions-item>
           <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(form.reportStatus)">
              {{ getReportStatusText(form.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="form.enableStatus === '1' ? 'success' : 'danger'"
            >
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>


      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose">取消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
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
  QuestionFilled,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsJzdsqsjPage,
  getOdsJzdsqsjById,
  addOdsJzdsqsj,
  updateOdsJzdsqsj,
  deleteOdsJzdsqsj,
  batchDeleteOdsJzdsqsj,
  exportOdsJzdsqsj,
  getSystemSchoolCode,
  getStudentOptions,
  getDictOptions,
  type OdsJzdsqsjInfo,
  type OdsJzdsqsjQuery,
  type OdsJzdsqsjForm,
 
} from "@/api/meta/meta_base/zygxs/ods_jzdsqsj";
const systemSchoolCode = ref<string>("");
// 搜索条件
const queryParams = reactive<OdsJzdsqsjQuery>({
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  xh: "",
  xsxm: "",
  jzxmmc: "",
  jzxmzlm: "",
  zjlym: "",
  spztm: "",
  sqrqStart: "",
  sqrqEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 100,
});

// 表格数据
const dataList = ref<OdsJzdsqsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);

const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增奖助贷申请数据";
    case "edit":
      return "编辑奖助贷申请数据";
    case "view":
      return "查看奖助贷申请数据";
    default:
      return "奖助贷申请数据";
  }
});

const form = reactive<OdsJzdsqsjForm & { reportStatus?: string, enableStatus?: string }>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xsxm: "",
  jzxmmc: "",
  jzxmzlm: "",
  jzbz: "",
  zzdwgr: "",
  zjlym: "",
  sqrq: "",
  spsj: "",
  spztm: "",
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();

// 学校代码与学号相关

const studentOptions = ref<{xh: string, label: string, xsxm: string}[]>([]);
const studentLoading = ref(false);

// 日期范围
const sqrqRange = ref<string[]>([]);

// 状态相关方法
const getStatusTagType = (status: string) => {
  switch (status) {
    case "0":
      return "warning"; // 待审批
    case "1":
      return "success"; // 已通过
    case "2":
      return "danger"; // 已拒绝
    default:
      return "info";
  }
};

const getReportStatusTagType = (status: string | undefined) => {
  if (!status) return "info";
  switch (status) {
    case "0":
      return "info"; // 未上报
    case "1":
      return "success"; // 已上报
    case "2":
      return "danger"; // 上报失败
    default:
      return "info";
  }
};

const getReportStatusText = (status: string | undefined) => {
  if (!status) return "未知";
  switch (status) {
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

// 字典选项
const jzxmzlmOptions = ref<{ label: string; value: string }[]>([]);
const zjlymOptions = ref<{ label: string; value: string }[]>([]);
const spztmOptions = ref<{ label: string; value: string }[]>([]);

const getDictLabel = (options: {label: string, value: string}[], value: string | undefined) => {
  if (value === undefined || value === null) return "";
  const option = options.find(item => item.value === value);
  return option ? option.label : value;
}

// 加载字典选项
const loadDicts = async () => {
  try {
    const jzxmzlmRes: any = await getDictOptions("JZXMZLDM");
    if (jzxmzlmRes.data.code === 200) {
      jzxmzlmOptions.value = jzxmzlmRes.data.data;
    }

    const zjlymRes: any = await getDictOptions("JLZZZJLYDM");
    if (zjlymRes.data.code === 200) {
      zjlymOptions.value = zjlymRes.data.data;
    }

    const spztmRes: any = await getDictOptions("SPZTDM");
    if (spztmRes.data.code === 200) {
      spztmOptions.value = spztmRes.data.data;
    }
  } catch (error) {
    ElMessage.error("加载字典数据失败");
    console.error("加载字典数据失败:", error);
  }
};

// 获取系统学校代码
const loadSystemSchoolCode = async () => {
  try {
    const response = (await getSystemSchoolCode()) as any;
    if (response.data?.code === 200 && response.data?.data) {
      systemSchoolCode.value = response.data.data;
      if (dialogMode.value === 'add') {
        form.xxdm = systemSchoolCode.value;
        systemSchoolCode.value = response.data.data;
      }
    } else {
      ElMessage.warning("获取系统学校代码失败");
    }
  } catch (error) {
    ElMessage.error("获取系统学校代码异常");
  }
};

// 远程搜索学生
const searchStudent = async (keyword: string) => {
  if (keyword) {
    studentLoading.value = true;
    try {
      const res: any = await getStudentOptions(keyword);
      if (res.data.code === 200) {
        studentOptions.value = res.data.data.map((s: any) => ({
          xh: s.xh,
          label: `${s.xh} - ${s.xsxm}`,
          xsxm: s.xsxm,
        }));
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

// 申请日期范围变化处理
const handleSqrqRangeChange = (dates: string[]) => {
  if (dates && dates.length === 2) {
    queryParams.sqrqStart = dates[0];
    queryParams.sqrqEnd = dates[1];
  } else {
    queryParams.sqrqStart = "";
    queryParams.sqrqEnd = "";
  }
};

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { max: 32, message: "唯一性标识长度不能超过32位", trigger: "blur" },
    {
      pattern: /^[A-Z0-9]*$/,
      message: "唯一性标识必须由大写字母和数字组成",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
  ],
  xh: [
    { required: true, message: "请选择学号", trigger: "change" },
    { max: 20, message: "学号长度不能超过20位", trigger: "change" },
  ],
  xsxm: [
    { required: true, message: "请输入学生姓名", trigger: "blur" },
    { max: 36, message: "学生姓名长度不能超过36位", trigger: "blur" },
  ],
  jzxmmc: [
    { required: true, message: "请输入奖助项目名称", trigger: "blur" },
    { max: 60, message: "奖助项目名称长度不能超过60位", trigger: "blur" },
  ],
  jzxmzlm: [{ required: true, message: "请选择奖助项目种类", trigger: "change" }],
  jzbz: [
    { required: true, message: "请输入奖助标准", trigger: "blur" },
    { max: 2000, message: "奖助标准长度不能超过2000个字符", trigger: "blur" },
  ],
  zzdwgr: [
    { required: true, message: "请输入资助单位/个人", trigger: "blur" },
    { max: 60, message: "资助单位/个人长度不能超过60位", trigger: "blur" },
  ],
  zjlym: [{ required: true, message: "请选择资金来源", trigger: "change" }],
  sqrq: [{ required: true, message: "请选择申请日期", trigger: "change" }],
  spsj: [{ required: true, message: "请选择审批时间", trigger: "change" }],
  spztm: [{ required: true, message: "请选择审批状态", trigger: "change" }],
  sjcjsj: [{ required: true, message: "请选择数据采集时间", trigger: "change" }],
});

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsJzdsqsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询奖助贷申请数据失败:", error);
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
    xsxm: "",
    jzxmmc: "",
    jzxmzlm: "",
    zjlym: "",
    spztm: "",
    sqrqStart: "",
    sqrqEnd: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 100,
  });
  sqrqRange.value = [];
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  form.xxdm = systemSchoolCode.value;
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsJzdsqsjInfo) => {
  resetForm();
  dialogMode.value = "edit";
  try {
    const response: any = await getOdsJzdsqsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      if (form.xh) {
        studentOptions.value = [{
          xh: form.xh,
          label: `${form.xh} - ${form.xsxm || ''}`,
          xsxm: form.xsxm || '',
        }];
      }
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取奖助贷申请数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsJzdsqsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条奖助贷申请数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsJzdsqsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除奖助贷申请数据失败:", error);
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
      `确定要删除选中的 ${selectedIds.value.length} 条奖助贷申请数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsJzdsqsj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除奖助贷申请数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 学号选择变化处理
const handleStudentChange = (value: string) => {
  if (value) {
    const selectedOption = studentOptions.value.find(opt => opt.xh === value);
    if (selectedOption) {
      form.xsxm = selectedOption.xsxm;
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsJzdsqsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `奖助贷申请数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error: any) {
    console.error("导出奖助贷申请数据失败:", error);
    ElMessage.error(error.message || "导出失败");
  }
};

// 查看详情
const handleView = async (row: OdsJzdsqsjInfo) => {
  resetForm();
  dialogMode.value = "view";
  try {
    const response: any = await getOdsJzdsqsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      if (form.xh) {
        studentOptions.value = [{
          xh: form.xh,
          label: `${form.xh} - ${form.xsxm || ''}`,
          xsxm: form.xsxm || '',
        }];
      }
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取奖助贷申请数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 行双击
const handleRowDblClick = (row: OdsJzdsqsjInfo) => {
  handleView(row);
};

// 表格选择
const handleSelectionChange = (selection: OdsJzdsqsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 分页
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
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    submitLoading.value = true;

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsJzdsqsj(form);
    } else {
      response = await updateOdsJzdsqsj(form);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.msg || "操作失败");
    }
  } catch (error) {
    // ElMessage.error("请检查表单项是否填写完整");
  } finally {
    submitLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    xh: "",
    xsxm: "",
    jzxmmc: "",
    jzxmzlm: "",
    jzbz: "",
    zzdwgr: "",
    zjlym: "",
    sqrq: "",
    spsj: "",
    spztm: "",
    sjcjsj: "",
    enableStatus: "1",
    reportStatus: undefined,
  });
  formRef.value?.clearValidate();
  studentOptions.value = [];
};

// 关闭表单对话框
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 页面加载
onMounted(() => {
  loadSystemSchoolCode();
  loadDicts();
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
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.search-bar {
  /* No specific styles needed here */
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
  padding: 8px 10px;
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
