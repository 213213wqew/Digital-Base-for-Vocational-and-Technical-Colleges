<template>
  <div class="party-cadre-study-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryForm" ref="queryFormRef" :inline="true" class="search-form">
          <el-form-item label="设备编码" prop="sbbm">
            <el-select
              v-model="queryForm.sbbm"
              placeholder="请选择设备编码"
              clearable
              filterable
              remote
              :remote-method="handleDeviceCodeSearch"
              :loading="deviceCodeLoading"
              style="width: 220px;"
            >
              <el-option
                v-for="item in deviceCodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称" prop="sbmc">
            <el-input
              v-model="queryForm.sbmc"
              placeholder="请输入设备名称"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="教室号" prop="jsh">
            <el-select
              v-model="queryForm.jsh"
              placeholder="请选择教室号"
              clearable
              style="width: 220px;"
            >
              <el-option
                v-for="item in classroomNumberOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="search-buttons">
            <el-button type="primary" @click="handleQuery" style="margin-left: 8px;">
              <el-icon><Search /></el-icon>搜索
            </el-button>
            <el-button @click="resetQuery" style="margin-left: 8px;">
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
            :disabled="multipleSelection.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">智慧教室设备运行数据管理</div>
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
          :height="'calc(75vh - 160px)'"
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
            min-width="280"
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
            prop="sbbm"
            label="设备编码"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sbmc"
            label="设备名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="jsh"
            label="教室号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="ksyxsj"
            label="开始运行时间"
            min-width="160"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.ksyxsj) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="jsyxsj"
            label="结束运行时间"
            min-width="160"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.jsyxsj) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="xtjlsj"
            label="系统记录时间"
            min-width="160"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.xtjlsj) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sjcjsj"
            label="数据采集时间"
            min-width="160"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.sjcjsj) }}
            </template>
          </el-table-column>
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
            prop="updateTime"
            label="更新时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
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
            v-model:current-page="queryForm.pageNum"
            v-model:page-size="queryForm.pageSize"
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 420px"
      class="party-cadre-study-dialog"
      destroy-on-close
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="160px"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="formData.zjsjwyxbs"
                placeholder="可不填，后端自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="formData.xxdm"
                placeholder="系统自动获取学校代码"
                maxlength="10"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="设备编码" prop="sbbm">
              <div style="display: flex; align-items: center; gap: 8px"> 
              <el-select
                v-model="formData.sbbm"
                placeholder="请选择设备编码"
                style="width: 100%"
                filterable
                remote
              @change="getDeviceNameOptionsData"
                :remote-method="getDeviceCodeOptionsData"
                :loading="deviceCodeLoading"
              >
                <el-option
                  v-for="item in deviceCodeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-tooltip content="数据来源于仪器设备基本数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="设备名称" prop="sbmc">
              <div style="display: flex; align-items: center; gap: 8px"> 
              <el-input
                v-model="formData.sbmc"
                placeholder="请输入设备名称"
                maxlength="60"
                show-word-limit
              />
              <el-tooltip content="数据来源于仪器设备基本数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="教室号" prop="jsh">
              <div style="display: flex; align-items: center; gap: 8px"> 
              <el-select
                v-model="formData.jsh"
                :remote-method="getClassroomNumberOptionsData"
                :loading="classroomNumberLoading"
                filterable
                remote
                placeholder="请选择教室号"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in classroomNumberOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-tooltip content="数据来源于教室基本数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="开始运行时间" prop="ksyxsj">
              <el-date-picker
                v-model="formData.ksyxsj"
                type="datetime"
                placeholder="请选择开始运行时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="结束运行时间" prop="jsyxsj">
              <el-date-picker
                v-model="formData.jsyxsj"
                type="datetime"
                placeholder="请选择结束运行时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="系统记录时间" prop="xtjlsj">
              <el-date-picker
                v-model="formData.xtjlsj"
                type="datetime"
                placeholder="请选择系统记录时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="formData.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select
                v-model="formData.enableStatus"
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

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleSubmit"
          >
            {{ dialogType === "add" ? "新增" : "保存" }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="智慧教室设备运行数据详情"
      width="1000px"
      center
      class="party-cadre-study-dialog"
    >
      <div v-if="detailData" class="party-cadre-study-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="唯一性标识">
            <div class="detail-value">{{ detailData.zjsjwyxbs }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ detailData.xxdm }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="设备编码">
            <div class="detail-value">{{ detailData.sbbm }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="设备名称">
            <div class="detail-value">{{ detailData.sbmc }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教室号">
            <div class="detail-value">{{ detailData.jsh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="开始运行时间">
            <div class="detail-value">{{ formatDateTime(detailData.ksyxsj) }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="结束运行时间">
            <div class="detail-value">{{ formatDateTime(detailData.jsyxsj) }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="系统记录时间">
            <div class="detail-value">{{ formatDateTime(detailData.xtjlsj) }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">{{ formatDateTime(detailData.sjcjsj) }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(detailData.reportStatus)">
              {{ getReportStatusText(detailData.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag :type="detailData.enableStatus === '1' ? 'success' : 'danger'">
              {{ detailData.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <div class="detail-value">{{ detailData.createTime }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <div class="detail-value">{{ detailData.updateTime }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, TableInstance } from "element-plus";
import {
  getSmartClassroomDeviceRunningDataPage,
  getSmartClassroomDeviceRunningDataById,
  addSmartClassroomDeviceRunningData,
  updateSmartClassroomDeviceRunningData,
  deleteSmartClassroomDeviceRunningData,
  batchDeleteSmartClassroomDeviceRunningData,
  exportSmartClassroomDeviceRunningData,
  getDeviceCodeOptions,
  getSystemSchoolCode,
  getClassroomNumberOptions,
  type OdsZhjssbyxsjQuery,
  type OdsZhjssbyxsjForm,
  type OdsZhjssbyxsjInfo,
  type DictOption,
} from "@/api/meta/meta_base/zygzc/ods_zhjssbyxsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsZhjssbyxsjInfo[]>([]);
const total = ref(0);
const multipleSelection = ref<OdsZhjssbyxsjInfo[]>([]);

// 查询表单
const queryFormRef = ref<FormInstance>();
const queryForm = reactive<OdsZhjssbyxsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  sbbm: "",
  sbmc: "",
  jsh: "",
  ksyxsjStart: "",
  ksyxsjEnd: "",
  jsyxsjStart: "",
  jsyxsjEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 时间范围选择器
const ksyxsjRange = ref<[string, string] | null>(null);
const jsyxsjRange = ref<[string, string] | null>(null);
const sjcjsjRange = ref<[string, string] | null>(null);
const systemSchoolCode = ref<string>("");
// 对话框相关
const dialogVisible = ref(false);
const dialogTitle = ref("");
const activeTab = ref("basic");
const formRef = ref<FormInstance>();

// 表单数据
const formData = reactive<OdsZhjssbyxsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  sbbm: "",
  sbmc: "",
  jsh: "",
  ksyxsj: "",
  jsyxsj: "",
  xtjlsj: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = {
  zjsjwyxbs: [
    { 
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback(); // 为空时通过验证，后端会自动生成
        } else if (value.length !== 32) {
          callback(new Error('唯一编码必须是32位'));
        } else if (!/^[A-Z0-9]+$/.test(value)) {
          callback(new Error('只能包含大写字母和数字'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "必须是10位数字", trigger: "blur" }
  ],
  sbbm: [
    { required: true, message: "请选择设备编码", trigger: "change" },
    { max: 64, message: "设备编码长度不能超过64个字符", trigger: "blur" }
  ],
  sbmc: [
    { required: true, message: "请输入设备名称", trigger: "blur" },
    { max: 60, message: "设备名称长度不能超过60个字符", trigger: "blur" }
  ],
  jsh: [
    { max: 80, message: "教室号长度不能超过80个字符", trigger: "blur" }
  ],
  ksyxsj: [
    { required: true, message: "请选择开始运行时间", trigger: "change" },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback();
        } else if (!/^\d{8} \d{6}$/.test(value)) {
          callback(new Error('时间格式必须为YYYYMMDD HHMMSS'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  jsyxsj: [
    { required: true, message: "请选择结束运行时间", trigger: "change" },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback();
        } else if (!/^\d{8} \d{6}$/.test(value)) {
          callback(new Error('时间格式必须为YYYYMMDD HHMMSS'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  xtjlsj: [
    { required: true, message: "请选择系统记录时间", trigger: "change" },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback();
        } else if (!/^\d{8} \d{6}$/.test(value)) {
          callback(new Error('时间格式必须为YYYYMMDD HHMMSS'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback();
        } else if (!/^\d{8} \d{6}$/.test(value)) {
          callback(new Error('时间格式必须为YYYYMMDD HHMMSS'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  enableStatus: [
    { required: true, message: "请选择启用状态", trigger: "change" }
  ]
};

// 格式化日期时间
const formatDateTime = (timestamp: string) => {
  if (!timestamp) return "";
  // 输入格式为 YYYYMMDD HHMMSS
  const year = timestamp.substring(0, 4);
  const month = timestamp.substring(4, 6);
  const day = timestamp.substring(6, 8);
  const hour = timestamp.substring(9, 11);
  const minute = timestamp.substring(11, 13);
  const second = timestamp.substring(13, 15);
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "info";
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

// 详情对话框
const detailDialogVisible = ref(false);
const detailData = ref<OdsZhjssbyxsjInfo>({} as OdsZhjssbyxsjInfo);

// 字典数据
const deviceCodeOptions = ref<DictOption[]>([]);
const classroomNumberOptions = ref<DictOption[]>([]);

// 表格引用
const tableRef = ref<TableInstance>();

// 时间范围变化处理
const handleKsyxsjRangeChange = (value: [string, string] | null) => {
  if (value) {
    queryForm.ksyxsjStart = value[0];
    queryForm.ksyxsjEnd = value[1];
  } else {
    queryForm.ksyxsjStart = "";
    queryForm.ksyxsjEnd = "";
  }
};

const handleJsyxsjRangeChange = (value: [string, string] | null) => {
  if (value) {
    queryForm.jsyxsjStart = value[0];
    queryForm.jsyxsjEnd = value[1];
  } else {
    queryForm.jsyxsjStart = "";
    queryForm.jsyxsjEnd = "";
  }
};

const handleSjcjsjRangeChange = (value: [string, string] | null) => {
  if (value) {
    queryForm.sjcjsjStart = value[0];
    queryForm.sjcjsjEnd = value[1];
  } else {
    queryForm.sjcjsjStart = "";
    queryForm.sjcjsjEnd = "";
  }
};

// 查询数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await getSmartClassroomDeviceRunningDataPage(queryForm);
    if (response.data?.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data?.message || "查询失败");
    }
  } catch (error) {
    console.error("查询智慧教室设备运行数据失败：", error);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};

// 查询按钮
const handleQuery = () => {
  queryForm.pageNum = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  ksyxsjRange.value = null;
  jsyxsjRange.value = null;
  sjcjsjRange.value = null;
  queryForm.ksyxsjStart = "";
  queryForm.ksyxsjEnd = "";
  queryForm.jsyxsjStart = "";
  queryForm.jsyxsjEnd = "";
  queryForm.sjcjsjStart = "";
  queryForm.sjcjsjEnd = "";
  handleQuery();
};

// 分页处理
const handleSizeChange = (val: number) => {
  queryForm.pageSize = val;
  getList();
};

const handleCurrentChange = (val: number) => {
  queryForm.pageNum = val;
  getList();
};

// 多选处理
const handleSelectionChange = (selection: OdsZhjssbyxsjInfo[]) => {
  multipleSelection.value = selection;
};

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    sbbm: "",
    sbmc: "",
    jsh: "",
    ksyxsj: "",
    jsyxsj: "",
    xtjlsj: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogTitle.value = "新增智慧教室设备运行数据";
  dialogVisible.value = true;
  activeTab.value = "basic";
};

// 编辑
const handleEdit = async (row: OdsZhjssbyxsjInfo) => {
  try {
    const response = await getSmartClassroomDeviceRunningDataById(row.id);
    if (response.data?.code === 200) {
      Object.assign(formData, response.data.data);
      dialogTitle.value = "编辑智慧教室设备运行数据";
      dialogVisible.value = true;
      activeTab.value = "basic";
    } else {
      ElMessage.error(response.data?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取智慧教室设备运行数据详情失败：", error);
    ElMessage.error("获取数据失败");
  }
};

// 查看详情
const handleView = async (row: OdsZhjssbyxsjInfo) => {
  try {
    const response = await getSmartClassroomDeviceRunningDataById(row.id);
    if (response.data?.code === 200) {
      detailData.value = response.data.data;
      detailDialogVisible.value = true;
    } else {
      ElMessage.error(response.data?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取智慧教室设备运行数据详情失败：", error);
    ElMessage.error("获取数据失败");
  }
};

// 删除
const handleDelete = async (row: OdsZhjssbyxsjInfo) => {
  try {
    await ElMessageBox.confirm(
      "确定要删除这条智慧教室设备运行数据吗？",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await deleteSmartClassroomDeviceRunningData(row.id);
    if (response.data?.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data?.message || "删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除智慧教室设备运行数据失败：", error);
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (!multipleSelection.value.length) {
    ElMessage.warning("请先选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${multipleSelection.value.length} 条智慧教室设备运行数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const ids = multipleSelection.value.map((item) => item.id);
    const response = await batchDeleteSmartClassroomDeviceRunningData(ids);
    if (response.data?.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
    } else {
      ElMessage.error(response.data?.message || "批量删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除智慧教室设备运行数据失败：", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportSmartClassroomDeviceRunningData(queryForm);
    const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
    const downloadElement = document.createElement('a');
    const href = window.URL.createObjectURL(blob);
    downloadElement.href = href;
    downloadElement.download = `智慧教室设备运行数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(href);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出智慧教室设备运行数据失败：", error);
    ElMessage.error("导出失败");
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    // 验证表单
    await formRef.value.validate();
    
    if (formData.id) {
      // 编辑
      const response = await updateSmartClassroomDeviceRunningData(formData);
      if (response.data?.code === 200) {
        ElMessage.success("修改成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(response.data?.message || "修改失败");
      }
    } else {
      // 新增
      const response = await addSmartClassroomDeviceRunningData(formData);
      if (response.data?.code === 200) {
        ElMessage.success("新增成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(response.data?.message || "新增失败");
      }
    }
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message);
    } else {
      console.error("提交智慧教室设备运行数据失败：", error);
      ElMessage.error("提交失败");
    }
  }
};

// 关闭对话框
const handleDialogClose = () => {
  dialogVisible.value = false;
  resetForm();
  formRef.value?.clearValidate();
  activeTab.value = "basic";
};

// 加载字典数据
 const  getDeviceCodeOptionsData =  async (keyword: string) => {
    // 加载设备编码字典
    const deviceCodeResponse = await getDeviceCodeOptions(keyword);
    if (deviceCodeResponse.data?.code === 200) {
      deviceCodeOptions.value = deviceCodeResponse.data.data;
    }
  };
  // 加载设备名称字典
  const getDeviceNameOptionsData = async (value: string) => {
     
    formData.sbmc = deviceCodeOptions.value.find(item => item.value === value)?.name || '';
   
   
  };

    // 加载教室号字典
    const getClassroomNumberOptionsData = async (keyword: string) => {
      const classroomResponse = await getClassroomNumberOptions(keyword,50);
      if (classroomResponse.data?.code === 200) {
        classroomNumberOptions.value = classroomResponse.data.data;
    }
  };
 
/**
 * 获取系统学校代码
 */
const getSystemSchoolCodeData = async () => {
  const response = await getSystemSchoolCode();
  if (response.data?.code === 200) {
    systemSchoolCode.value = response.data.data;
  }
};

// 设备编码搜索相关
const deviceCodeLoading = ref(false);

// 处理设备编码搜索
const handleDeviceCodeSearch = async (query: string) => {
  if (query) {
    deviceCodeLoading.value = true;
    try {
      const response = await getDeviceCodeOptions(query);
      if (response.data?.code === 200) {
        deviceCodeOptions.value = response.data.data;
      }
    } catch (error) {
      console.error("搜索设备编码失败：", error);
    } finally {
      deviceCodeLoading.value = false;
    }
  } else {
    deviceCodeOptions.value = [];
  }
};
// 初始化
onMounted(() => {
  getSystemSchoolCodeData();
  getList();
 
});
</script>

<style scoped>
.party-cadre-study-management {
  padding: 0;
}

.search-card {
  margin-bottom: 8px;
}

.search-bar {
  padding: 8px;
}

.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.search-buttons {
  margin-bottom: 0;
  margin-right: 0;
}

:deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 8px;
}

:deep(.el-form-item__content) {
  display: flex;
  align-items: center;
}

:deep(.el-button) {
  height: 32px;
  padding: 8px 15px;
}

.table-card {
  margin-top: -10px;
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
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.action-buttons {
  display: flex;
  gap: 2px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  padding: 2px 2px;
}

.total-info {
  color: #606266;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 新增样式 */
.party-cadre-study-dialog {
  border-radius: 8px;
}

.party-cadre-study-detail {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px 0;
}

.detail-descriptions {
  margin-bottom: 20px;
}

.detail-value {
  color: #303133;
  font-weight: 500;
  word-break: break-all;
}

.detail-value:empty::before {
  content: "-";
  color: #909399;
}

/* 表格行样式调整 */
:deep(.el-table .el-table__body-wrapper .el-table__row) {
  transition: background-color 0.2s ease;
}

:deep(.el-table .el-table__body-wrapper .el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 对话框样式调整 */
:deep(.party-cadre-study-dialog .el-dialog__header) {
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 15px 20px;
}

:deep(.party-cadre-study-dialog .el-dialog__title) {
  color: white;
  font-weight: 600;
}

:deep(.party-cadre-study-dialog .el-dialog__headerbtn) {
  top: 50%;
  transform: translateY(-50%);
}

:deep(.party-cadre-study-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 18px;
}

:deep(.party-cadre-study-dialog .el-dialog__body) {
  padding: 20px 24px;
  max-height: 60vh;
  overflow-y: auto;
}

/* 表单样式调整 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
}

/* 按钮样式调整 */
:deep(.operation-buttons .el-button) {
  border-radius: 6px;
  font-weight: 500;
}

:deep(.action-buttons .el-button) {
  padding: 2px 4px;
  font-size: 12px;
}

/* Tag样式调整 */
:deep(.el-tag) {
  border-radius: 4px;
  font-weight: 500;
}

/* 禁用状态的输入框样式 */
:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa !important;
  box-shadow: 0 0 0 1px #e4e7ed inset !important;
}

:deep(.el-input.is-disabled .el-input__inner) {
  background-color: transparent !important;
  color: #606266 !important;
}
</style>