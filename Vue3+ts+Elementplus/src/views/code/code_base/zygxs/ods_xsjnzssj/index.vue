<template>
  <div class="certificate-management">
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
          <el-form-item label="学生姓名" prop="xsxm">
            <el-input
              v-model="queryParams.xsxm"
              placeholder="请输入学生姓名"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="证书号" prop="zsh">
            <el-input
              v-model="queryParams.zsh"
              placeholder="请输入证书号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="证书名称" prop="zsmc">
            <el-input
              v-model="queryParams.zsmc"
              placeholder="请输入证书名称"
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
        <div class="header-title">学生技能证书数据子类表</div>
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
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zsh"
            label="证书号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zsmc"
            label="证书名称"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zsdj"
            label="证书等级"
            min-width="100"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getCertificateLevelText(row.zsdj) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="fzrq"
            label="发证日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sfzcdzzs"
            label="支持电子证书"
            min-width="120"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getElectronicSupportText(row.sfzcdzzs) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="xzdycs"
            label="下载/打印次数"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="fzjgbm"
            label="发证机构编码"
            min-width="150"
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
            :page-sizes="[20, 50, 100, 200, 500]"
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
      class="certificate-dialog"
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
              <div style="display: flex; align-items: center; width: 100%;">
                <el-select
                  v-model="form.xh"
                  filterable
                  remote
                  :remote-method="remoteStudentSearch"
                  :loading="studentLoading"
                  placeholder="请输入学号或姓名进行搜索"
                  @change="handleStudentSelect"
                  style="flex-grow: 1;"
                >
                
 
                  <el-option
                    v-for="item in studentOptions as any"
                    :key="item.xh"
                    :label="item.label"
                    :value="item.xh"
                  />
                </el-select>
                <el-tooltip content="数据来源于学生画像模块" placement="top">
                  <el-icon style="color: #E6A23C; margin-left: 8px; cursor: pointer;">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          
            <el-form-item label="学生姓名" prop="xsxm">
              <div style="display: flex; align-items: center; width: 100%">
              <el-input
                disabled
                v-model="form.xsxm"
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
          <el-col :span="12">
            <el-form-item label="证书号" prop="zsh">
              <el-input
                v-model="form.zsh"
                placeholder="请输入证书号"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书名称" prop="zsmc">
              <el-input
                v-model="form.zsmc"
                placeholder="请输入证书名称"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书等级" prop="zsdj">
              <el-select
                v-model="form.zsdj"
                placeholder="请选择证书等级"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in certificateLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发证日期" prop="fzrq">
              <el-date-picker
                v-model="form.fzrq"
                type="date"
                placeholder="请选择发证日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支持电子证书" prop="sfzcdzzs">
              <el-select
                v-model="form.sfzcdzzs"
                placeholder="请选择是否支持电子证书"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in electronicSupportOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下载/打印次数" prop="xzdycs">
              <el-input-number
                v-model="form.xzdycs"
                :min="0"
                placeholder="请输入下载/打印次数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发证机构编码" prop="fzjgbm">
              <el-input
                v-model="form.fzjgbm"
                placeholder="请输入发证机构编码"
                maxlength="60"
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
      <div v-else class="certificate-detail">
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
          <el-descriptions-item label="证书号">
            <div class="detail-value">{{ form.zsh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="证书名称">
            <div class="detail-value">{{ form.zsmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="证书等级">
            <div class="detail-value">{{ getCertificateLevelText(form.zsdj || '') || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="发证日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.fzrq || '') || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="支持电子证书">
            <div class="detail-value">{{ getElectronicSupportText(form.sfzcdzzs || '') || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="下载/打印次数">
            <div class="detail-value">{{ form.xzdycs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="发证机构编码">
            <div class="detail-value">{{ form.fzjgbm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjcjsj || '') || "-" }}
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
  InfoFilled,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsXsjnzssjPage,
  getOdsXsjnzssjById,
  addOdsXsjnzssj,
  updateOdsXsjnzssj,
  deleteOdsXsjnzssj,
  batchDeleteOdsXsjnzssj,
  exportOdsXsjnzssj,
  getSystemSchoolCode,
  getStudentOptions,
  getDictOptions,
  type OdsXsjnzssjInfo,
  type OdsXsjnzssjQuery,
  type OdsXsjnzssjForm,
} from "@/api-code/code/code_base/zygxs/ods_xsjnzssj";

// 搜索条件
const queryParams = reactive<OdsXsjnzssjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xsxm: "",
  zsh: "",
  zsmc: "",
  zsdj: "",
  sfzcdzzs: "",
  fzrqStart: "",
  fzrqEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 表格数据
const dataList = ref<OdsXsjnzssjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const dialogMode = ref<"add" | "edit" | "view">("add");
const form = reactive<OdsXsjnzssjForm & { enableStatus?: string }>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xsxm: "",
  fzjgbm: "",
  zsdj: "",
  zsh: "",
  zsmc: "",
  fzrq: "",
  sfzcdzzs: "",
  xzdycs: 0,
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const activeTab = ref("basic");

// 学生选择相关
const studentOptions = ref<Array<{ xh: string; label: string; xsxm: string }>>([]);
const studentLoading = ref(false);

// 字典选项
const certificateLevelOptions = ref<{ value: string; label: string }[]>([]);
const electronicSupportOptions = ref<{ value: string; label: string }[]>([]);

// 表单验证规则
const formRules = reactive({
  // 主键数据唯一性标识
  zjsjwyxbs: [
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value) {
          if (!/^[A-Z0-9]{32}$/.test(value)) {
            callback(new Error("必须为32位大写字母和数字组合"));
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
  // 学校代码（必填，10位数字）
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { len: 10, message: "学校代码必须为10位", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须为10位数字", trigger: "blur" }
  ],
  // 学号（必填）
  xh: [
    { required: true, message: "学号不能为空", trigger: "blur" },
    { max: 20, message: "学号长度不能超过20位", trigger: "blur" }
  ],
  // 学生姓名（可选）
  xsxm: [
    { max: 36, message: "学生姓名长度不能超过36位", trigger: "blur" }
  ],
  // 发证机构编码（必填）
  fzjgbm: [
    { required: true, message: "发证机构编码不能为空", trigger: "blur" },
    { max: 60, message: "发证机构编码长度不能超过60位", trigger: "blur" }
  ],
  // 证书等级（可选）
  zsdj: [
    { max: 1, message: "证书等级长度不能超过1位", trigger: "blur" }
  ],
  // 证书号（必填）
  zsh: [
    { required: true, message: "证书号不能为空", trigger: "blur" },
    { max: 50, message: "证书号长度不能超过50位", trigger: "blur" }
  ],
  // 证书名称（必填）
  zsmc: [
    { required: true, message: "证书名称不能为空", trigger: "blur" },
    { max: 100, message: "证书名称长度不能超过100位", trigger: "blur" }
  ],
  // 发证日期（可选，YYYYMMDD格式）
  fzrq: [
    { pattern: /^\d{8}$/, message: "发证日期格式必须为YYYYMMDD", trigger: "blur" }
  ],
  // 是否支持电子证书（必填，0或1）
  sfzcdzzs: [
    { required: true, message: "是否支持电子证书不能为空", trigger: "blur" },
    { pattern: /^[01]$/, message: "是否支持电子证书只能为0或1", trigger: "blur" }
  ],
  // 下载/打印次数（必填，非负整数）
  xzdycs: [
    { required: true, message: "下载/打印次数不能为空", trigger: "blur" },
    { 
      validator: (_rule: any, value: any, callback: any) => {
        if (value !== undefined && value !== null && value !== '') {
          if (!Number.isInteger(Number(value)) || Number(value) < 0) {
            callback(new Error('下载/打印次数必须为非负整数'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }, 
      trigger: "blur" 
    }
  ],
  // 数据采集时间（必填，YYYYMMDD hhmmss格式）
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "blur" },
    { pattern: /^\d{8} \d{6}$/, message: "数据采集时间格式必须为YYYYMMDD hhmmss", trigger: "blur" }
  ]
});

// 计算属性
const dialogTitle = computed(() => {
  if (dialogMode.value === "add") return "新增学生技能证书数据";
  if (dialogMode.value === "edit") return "编辑学生技能证书数据";
  return "查看学生技能证书数据详情";
});

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsXsjnzssjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询学生技能证书数据失败:", error);
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
    zsh: "",
    zsmc: "",
    zsdj: "",
    sfzcdzzs: "",
    fzrqStart: "",
    fzrqEnd: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 新增
const handleAdd = async () => {
  resetForm();
  dialogType.value = "add";
  dialogMode.value = "add";
  dialogVisible.value = true;

  try {
    const response: any = await getSystemSchoolCode();
    if (response.data.code === 200) {
      form.xxdm = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "获取学校代码失败");
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
    ElMessage.error("获取学校代码失败，请检查接口或网络");
  }
};

// 编辑
const handleEdit = async (row: OdsXsjnzssjInfo) => {
  try {
    const response: any = await getOdsXsjnzssjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      // 确保下拉框能正确显示初始值
      if (form.xh && form.xsxm) {
        studentOptions.value = [{ 
          xh: form.xh, 
          label: `${form.xh} - ${form.xsxm}`, 
          xsxm: form.xsxm 
        }];
      } else {
        studentOptions.value = [];
      }
      dialogType.value = "edit";
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生技能证书数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsXsjnzssjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条学生技能证书数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsXsjnzssj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除学生技能证书数据失败:", error);
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
      `确定要删除选中的 ${selectedIds.value.length} 条学生技能证书数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsXsjnzssj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除学生技能证书数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsXsjnzssj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `学生技能证书数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出学生技能证书数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 查看详情
const handleView = async (row: OdsXsjnzssjInfo) => {
  try {
    const response: any = await getOdsXsjnzssjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生技能证书数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 表格选择变化
const handleSelectionChange = (selection: OdsXsjnzssjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (_row: OdsXsjnzssjInfo) => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsXsjnzssjInfo) => {
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

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    xh: "",
    xsxm: "",
    fzjgbm: "",
    zsdj: "",
    zsh: "",
    zsmc: "",
    fzrq: "",
    sfzcdzzs: "",
    xzdycs: 0,
    sjcjsj: "",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
  studentOptions.value = [];
  activeTab.value = "basic";
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response: any;
    if (dialogType.value === "add") {
      response = await addOdsXsjnzssj(form);
    } else {
      response = await updateOdsXsjnzssj(form);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogType.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(
        response.data.msg ||
          (dialogType.value === "add" ? "新增失败" : "修改失败"),
      );
    }
  } catch (error) {
    console.error("提交学生技能证书数据失败:", error);
    ElMessage.error("提交失败");
  } finally {
    submitLoading.value = false;
  }
};

// 证书等级文本转换
const getCertificateLevelText = (level: string) => {
  const levelMap: Record<string, string> = {
    "1": "初级",
    "2": "中级", 
    "3": "高级"
  };
  return levelMap[level] || level;
};

// 电子证书支持文本转换
const getElectronicSupportText = (support: string) => {
  const supportMap: Record<string, string> = {
    "1": "是",
    "0": "否"
  };
  return supportMap[support] || support;
};

// 上报状态标签类型
const getReportStatusTagType = (status: string): "success" | "primary" | "warning" | "info" | "danger" => {
  const statusMap: Record<string, "success" | "primary" | "warning" | "info" | "danger"> = {
    "0": "info",
    "1": "success",
    "2": "danger"
  };
  return statusMap[status] || "warning";
};

// 上报状态文本
const getReportStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败"
  };
  return statusMap[status] || "未知";
};

// 格式化显示时间
const formatDisplayTime = (time: string) => {
  if (!time) return "";
  
  // 如果是8位日期格式 YYYYMMDD
  if (time.length === 8) {
    return `${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)}`;
  }
  
  // 如果是15位时间格式 YYYYMMDD HHmmss
  if (time.length === 15) {
    const datePart = time.substring(0, 8);
    const timePart = time.substring(9);
    return `${datePart.substring(0, 4)}-${datePart.substring(4, 6)}-${datePart.substring(6, 8)} ${timePart.substring(0, 2)}:${timePart.substring(2, 4)}:${timePart.substring(4, 6)}`;
  }
  
  return time;
};

// 远程搜索学生
const remoteStudentSearch = async (query: string) => {
  if (query) {
    studentLoading.value = true;
    try {
      const response: any = await getStudentOptions(query);
      if (response.data.code === 200) {
        studentOptions.value = response.data.data;
      } else {
        studentOptions.value = [];
        ElMessage.error(response.data.msg || "获取学生列表失败");
      }
    } catch (error) {
      studentOptions.value = [];
      console.error("搜索学生列表失败:", error);
      ElMessage.error("搜索学生列表失败");
    } finally {
      studentLoading.value = false;
    }
  } else {
    studentOptions.value = [];
  }
};


// 选择学生后的处理
const handleStudentSelect = (value: string) => {
  console.log("11111111111111111");
  
  console.log(value);
 
  if (!value) {
    form.xh = "";
    form.xsxm = "";
    return;
  }

  const selectedStudent = studentOptions.value.find(
    (option) => option.xh === value
  );

  if (selectedStudent) {
    form.xh = selectedStudent.xh;  // 学号
    form.xsxm = selectedStudent.xsxm;  // 学生姓名
  }
};

// 加载字典数据
const loadDictOptions = async () => {
  try {
    const levelRes: any = await getDictOptions("ZSDJDM");
    if (levelRes.data.code === 200) {
      certificateLevelOptions.value = levelRes.data.data;
    } else {
      ElMessage.error("加载证书等级字典失败");
    }

    const supportRes: any = await getDictOptions("SFBZDM");
    if (supportRes.data.code === 200) {
      electronicSupportOptions.value = supportRes.data.data;
    } else {
      ElMessage.error("加载是否支持电子证书字典失败");
    }
  } catch (error) {
    console.error("加载字典失败:", error);
    ElMessage.error("加载字典数据失败");
  }
};

// 页面加载
onMounted(() => {
  getList();
  loadDictOptions();
});
</script>

<style scoped>
.certificate-management {
  padding: 0px;
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.search-card {
 

  :deep(.el-card__body) {
    padding: 15px 20px 0;
  }
}

.search-bar {
  padding: 0;
}

.table-card {
  margin-top: -30px;
  min-height: calc(75vh - 100px);
  flex: 1;

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
.certificate-dialog {
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

/* 统一弹窗内表单项间距 */
.certificate-dialog :deep(.el-form-item) {
  margin-bottom: 22px !important;
}

/* 搜索栏表单项间距 */
.search-bar :deep(.el-form-item) {
  margin-bottom: 15px;
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
.certificate-detail {
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
