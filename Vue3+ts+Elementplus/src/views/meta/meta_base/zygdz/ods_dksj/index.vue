<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="唯一性标识" prop="zjsjwyxbs">
            <el-input
              v-model="queryParams.zjsjwyxbs"
              placeholder="请输入主键数据唯一性标识"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="学校代码" prop="xxdm">
            <el-input
              v-model="queryParams.xxdm"
              placeholder="请输入学校代码"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="党组织名称" prop="dzzmc">
            <el-input
              v-model="queryParams.dzzmc"
              placeholder="请输入党组织名称"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="党课主讲人" prop="dkzjr">
            <el-input
              v-model="queryParams.dkzjr"
              placeholder="请输入党课主讲人"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
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
          <el-button type="primary" @click="handleAdd" :icon="Plus"
            >新增</el-button
          >
          <el-button
            type="danger"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
            :icon="Delete"
          >
            批量删除
          </el-button>
          <el-button type="warning" @click="handleExport" :icon="Download"
            >导出</el-button
          >
        </div>
        <div class="header-title">党课数据子类表</div>
        <div class="placeholder">
          <el-tooltip content="刷新" placement="top">
            <el-button circle @click="getList" :icon="Refresh" />
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
            prop="dzzmc"
            label="党组织名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="dzzbh"
            label="党组织编号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hdxsm"
            label="活动形式"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="dkzjr"
            label="党课主讲人"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hdnr"
            label="活动内容"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hdksrq"
            label="活动开始日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="hdjsrq"
            label="活动结束日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="cyxss"
            label="参与学生数"
            min-width="100"
            align="right"
            sortable="custom"
          />
          <el-table-column
            prop="cyjss"
            label="参与教师数"
            min-width="100"
            align="right"
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增党课数据' : '编辑党课数据'"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleFormClose"
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="160px"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
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
                v-model="form.xxdm"
                placeholder="系统自动获取学校代码"
                maxlength="10"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="党组织" prop="dzzmc">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.dzzmc"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入党组织名称搜索"
                  :remote-method="handleOrgSearch"
                  :loading="orgSearchLoading"
                  @change="handleOrgSelect"
                  @clear="handleOrgClear"
                  style="width: 100%"
                  clearable
                  value-key="label"
                >
                  <el-option
                    v-for="item in orgOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  >
                    <div class="org-option-content">
                      <span class="org-name">{{ item.label }}</span>
                      <span class="org-code">({{ item.value }})</span>
                    </div>
                  </el-option>
                </el-select>
                <el-tooltip content="数据来源于党组织情况基础数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="党组织编号" prop="dzzbh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input
                  v-model="form.dzzbh"
                  placeholder="选择党组织后自动填充"
                  :disabled="true"
                  style="background-color: #f5f7fa;"
                />
                <el-tooltip content="数据来源于党组织情况基础数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动形式码" prop="hdxsm">
              <el-select
                v-model="form.hdxsm"
                placeholder="请选择活动形式码"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in dictData.hdxsmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="党课主讲人" prop="dkzjr">
              <el-input
                v-model="form.dkzjr"
                placeholder="请输入党课主讲人"
                maxlength="36"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px;">
            <el-form-item label="活动内容" prop="hdnr">
              <el-input
                v-model="form.hdnr"
                type="textarea"
                :rows="4"
                placeholder="请输入活动内容"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动开始日期" prop="hdksrq">
              <el-date-picker
                v-model="form.hdksrq"
                type="date"
                placeholder="请选择活动开始日期"
                format="YYYY-MM-DD"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="活动结束日期" prop="hdjsrq">
              <el-date-picker
                v-model="form.hdjsrq"
                type="date"
                placeholder="请选择活动结束日期"
                format="YYYY-MM-DD"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="参与学生数" prop="cyxss">
              <el-input-number
                v-model="form.cyxss"
                :min="0"
                :max="99999"
                placeholder="请输入参与学生数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="参与教师数" prop="cyjss">
              <el-input-number
                v-model="form.cyjss"
                :min="0"
                :max="99999"
                placeholder="请输入参与教师数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
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
      <div v-else class="party-development-detail">
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
          <el-descriptions-item label="党组织名称">
            <div class="detail-value">{{ form.dzzmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="党组织编号">
            <div class="detail-value">{{ form.dzzbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动形式">
            <div class="detail-value">{{ form.hdxsmText || form.hdxsm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="党课主讲人">
            <div class="detail-value">{{ form.dkzjr || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动内容" :span="2">
            <div class="detail-value">{{ form.hdnr || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动开始日期">
            <div class="detail-value">{{ form.hdksrq || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动结束日期">
            <div class="detail-value">{{ form.hdjsrq || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="参与学生数">
            <div class="detail-value">{{ form.cyxss || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="参与教师数">
            <div class="detail-value">{{ form.cyjss || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">{{ form.sjcjsj || "-" }}</div>
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
          <el-descriptions-item label="创建时间">
            <div class="detail-value">{{ form.createTime || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <div class="detail-value">{{ form.updateTime || "-" }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose">取消</el-button>
          <el-button
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
import { ref, reactive, onMounted } from "vue";
import type { FormInstance } from "element-plus";
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
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsDksjPage,
  getOdsDksjById,
  searchOrgInfo,
  getSystemSchoolCode,
  getDictOptions,
  type OrgOption,
  addOdsDksj,
  updateOdsDksj,
  deleteOdsDksj,
  batchDeleteOdsDksj,
  exportOdsDksj,
  type OdsDksjInfo,
  type OdsDksjQuery,
  type OdsDksjForm,
} from "@/api/meta/meta_base/zygdz/ods_dksj";

// 搜索条件
const queryParams = reactive<OdsDksjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  dzzmc: "",
  dzzbh: "",
  hdxsm: "",
  dkzjr: "",
  hdksrqStart: "",
  hdksrqEnd: "",
  hdjsrqStart: "",
  hdjsrqEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsDksjInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const selectedIds = ref<number[]>([]);
const submitLoading = ref(false);
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();
// 系统学校代码
const systemSchoolCode = ref("");
// 党组织搜索相关
const orgSearchLoading = ref(false);
const orgOptions = ref<OrgOption[]>([]);

// 字典数据
const dictData = reactive({
  hdxsmOptions: [], // 活动形式码选项
});

// 表单对象
const form = reactive<OdsDksjForm>({
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  dzzmc: "",
  dzzbh: "",
  hdxsm: "",
  dkzjr: "",
  hdnr: "",
  hdksrq: "",
  hdjsrq: "",
  cyxss: undefined,
  cyjss: undefined,
  sjcjsj: "",
  enableStatus: "1",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { 
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback(); // 为空时通过验证
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
  dzzmc: [
    { required: true, message: "请选择党组织", trigger: "change" },
    { max: 150, message: "党组织名称长度不能超过150位", trigger: "blur" }
  ],
  dzzbh: [
    { max: 60, message: "党组织编号长度不能超过60位", trigger: "blur" }
  ],
  hdxsm: [
    { required: false, message: "请选择活动形式码", trigger: "change" },
    { pattern: /^[A-Z0-9]{2}$/, message: "必须是2位字母或数字", trigger: "blur" }
  ],
  dkzjr: [
    { required: false, message: "请输入党课主讲人", trigger: "blur" },
    { max: 36, message: "党课主讲人长度不能超过36位", trigger: "blur" }
  ],
  hdnr: [
    { required: false, message: "请输入活动内容", trigger: "blur" },
    { max: 2000, message: "活动内容长度不能超过2000位", trigger: "blur" }
  ],
  hdksrq: [
    { required: true, message: "请选择活动开始日期", trigger: "change" }
  ],
  hdjsrq: [
    { required: true, message: "请选择活动结束日期", trigger: "change" }
  ],
  cyxss: [
    { required: true, message: "请输入参与学生数", trigger: "blur" },
    { type: "number", message: "必须为数字", trigger: "blur" }
  ],
  cyjss: [
    { required: true, message: "请输入参与教师数", trigger: "blur" },
    { type: "number", message: "必须为数字", trigger: "blur" }
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" }
  ],
  enableStatus: [
    { required: true, message: "请选择启用状态", trigger: "change" }
  ]
});

// 获取上报状态文本
const getReportStatusText = (status: string) => {
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

// 获取上报状态标签类型
const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "0":
      return "info";
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "warning";
  }
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    dzzmc: "",
    dzzbh: "",
    hdxsm: "",
    dkzjr: "",
    hdnr: "",
    hdksrq: "",
    hdjsrq: "",
    cyxss: undefined,
    cyjss: undefined,
    sjcjsj: "",
    enableStatus: "1",
  });
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

// 关闭表单对话框
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsDksj(form);
    } else {
      response = await updateOdsDksj(form);
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
  } finally {
    submitLoading.value = false;
  }
};

// 党组织搜索相关方法
const handleOrgSearch = async (query: string) => {
  if (query !== '') {
    orgSearchLoading.value = true;
    try {
      const res = await searchOrgInfo(query);
      if (res.data.code === 200) {
        orgOptions.value = res.data.data;
      } else {
        ElMessage.error(res.data.msg || '查询党组织信息失败');
      }
    } catch (error) {
      console.error('查询党组织信息失败:', error);
      ElMessage.error('查询党组织信息失败');
    } finally {
      orgSearchLoading.value = false;
    }
  } else {
    orgOptions.value = [];
  }
};

// 选择党组织
const handleOrgSelect = (selectedLabel: string) => {
  const selectedOrg = orgOptions.value.find(item => item.label === selectedLabel);
  if (selectedOrg) {
    form.dzzbh = selectedOrg.value;
    form.dzzmc = selectedOrg.label;
  }
};

// 清除党组织选择
const handleOrgClear = () => {
  form.dzzbh = "";
  form.dzzmc = "";
  orgOptions.value = [];
};

// 获取字典数据
const loadDictData = async () => {
  try {
    const hdxsmRes = await getDictOptions('DJHDZYTJHZTDM'); // 党建活动主要途径和载体代码
    if (hdxsmRes.data.code === 200) {
      dictData.hdxsmOptions = hdxsmRes.data.data || [];
    }
  } catch (error) {
    console.error("获取字典数据失败:", error);
    ElMessage.error("获取字典数据失败");
  }
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsDksjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.message || "查询失败");
    }
  } catch (error) {
    console.error("查询党课数据失败:", error);
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
    xxdm: systemSchoolCode.value,
    dzzmc: "",
    dzzbh: "",
    hdxsm: "",
    dkzjr: "",
    hdksrqStart: "",
    hdksrqEnd: "",
    hdjsrqStart: "",
    hdjsrqEnd: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 分页变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 表格选择
const handleSelectionChange = (selection: OdsDksjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (row: OdsDksjInfo) => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsDksjInfo) => {
  handleView(row);
};

// 编辑
const handleEdit = async (row: OdsDksjInfo) => {
  try {
    const response = await getOdsDksjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      // 设置活动形式码的显示文本
      const hdxsmOption = dictData.hdxsmOptions.find(opt => opt.value === form.hdxsm);
      if (hdxsmOption) {
        form.hdxsmText = hdxsmOption.label;
      }
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取数据失败");
    }
  } catch (error) {
    console.error("获取党课数据失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 查看详情
const handleView = async (row: OdsDksjInfo) => {
  try {
    const response = await getOdsDksjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      // 设置活动形式码的显示文本
      const hdxsmOption = dictData.hdxsmOptions.find(opt => opt.value === form.hdxsm);
      if (hdxsmOption) {
        form.hdxsmText = hdxsmOption.label;
      }
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取数据失败");
    }
  } catch (error) {
    console.error("获取党课数据失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 删除
const handleDelete = async (row: OdsDksjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条党课数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = await deleteOdsDksj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除党课数据失败:", error);
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
      `确定要删除选中的 ${selectedIds.value.length} 条党课数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await batchDeleteOdsDksj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
      selectedIds.value = [];
    } else {
      ElMessage.error(response.data.message || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除党课数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("开始导出，请稍候...");
    const response = await exportOdsDksj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `党课数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出党课数据失败:", error);
    ElMessage.error("导出失败");
  }
};
// 获取系统学校代码
const getSystemSchoolCodeDksj = async () => {
  const response = await getSystemSchoolCode();
  if (response.data.code === 200) {
    systemSchoolCode.value = response.data.data;
  }
};

// 页面加载时获取字典数据
onMounted(() => {
  loadDictData();
  getList();
  getSystemSchoolCodeDksj();
});
</script>

<style scoped>
.app-container {
  padding: 20px;
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

.party-development-dialog {
  border-radius: 8px;
}

.party-development-detail {
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

:deep(.el-table .el-table__body-wrapper .el-table__row) {
  transition: background-color 0.2s ease;
}

:deep(.el-table .el-table__body-wrapper .el-table__row:hover) {
  background-color: #f5f7fa;
}

:deep(.party-development-dialog .el-dialog__header) {
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 15px 20px;
}

:deep(.party-development-dialog .el-dialog__title) {
  color: white;
  font-weight: 600;
}

:deep(.party-development-dialog .el-dialog__headerbtn) {
  top: 50%;
  transform: translateY(-50%);
}

:deep(.party-development-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 18px;
}

:deep(.party-development-dialog .el-dialog__body) {
  padding: 20px 24px;
  max-height: 60vh;
  overflow-y: auto;
}

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

:deep(.operation-buttons .el-button) {
  border-radius: 6px;
  font-weight: 500;
}

:deep(.action-buttons .el-button) {
  padding: 2px 4px;
  font-size: 12px;
}

:deep(.el-tag) {
  border-radius: 4px;
  font-weight: 500;
}

.org-option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.org-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.org-code {
  color: #8492a6;
  font-size: 12px;
  margin-left: 8px;
  flex-shrink: 0;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa !important;
  box-shadow: 0 0 0 1px #e4e7ed inset !important;
}

:deep(.el-input.is-disabled .el-input__inner) {
  background-color: transparent !important;
  color: #606266 !important;
}
</style>
