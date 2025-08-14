<template>
  <div class="entity-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="计划年级" prop="jhnj">
            <el-input
              v-model="queryParams.jhnj"
              placeholder="请输入计划年级"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="专业号" prop="zyh">
            <el-select
              v-model="queryParams.zyh"
              filterable
              remote
              reserve-keyword
              placeholder="请输入专业号或专业名称搜索"
              :remote-method="handleMajorSearch"
              :loading="majorLoading"
              clearable
            >
              <el-option
                v-for="item in majorOptions"
                :key="item.zyh"
                :label="item.label"
                :value="item.zyh"
              >
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  <span>{{ item.zymc }}</span>
                  <span style="color: #8492a6; font-size: 13px">
                    {{ item.zysysxbmc }} | {{ item.zyh }}
                  </span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建立年月" prop="jlny">
            <el-date-picker
              v-model="queryParams.jlny"
              type="month"
              placeholder="请选择建立年月"
              format="YYYYMM"
              value-format="YYYYMM"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item style="margin-top: -23px">
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
          <el-button type="warning" @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>
        <div class="header-title">培养方案数据编码管理</div>
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
          :height="'calc(75vh - 90px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column
            prop="zjsjwyxbs"
            label="唯一性标识"
            width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jhnj"
            label="计划年级"
            width="120"
            align="center"
          />
          <el-table-column
            prop="zyh"
            label="专业号"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="zxfyq"
            label="总学分要求"
            width="120"
            align="center"
          />
          <el-table-column
            prop="zxsyq"
            label="总学时要求"
            width="120"
            align="center"
          />
          <el-table-column
            prop="jlny"
            label="建立年月"
            width="120"
            align="center"
          />
          <el-table-column
            prop="bxxf"
            label="必修学分"
            width="120"
            align="center"
          />
          <el-table-column
            prop="bxxs"
            label="必修学时"
            width="120"
            align="center"
          />
          <el-table-column
            prop="reportStatus"
            label="上报状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
                style="cursor: pointer"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="enableStatus"
            label="启用状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-switch
                v-model="row.enableStatus"
                active-value="1"
                inactive-value="0"
                @change="handleEnableStatusChange(row)"
                :loading="row.statusLoading"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="160"
            align="center"
          >
            <template #default="{ row }">
              <span>{{ formatDateTime(row.createTime) }}</span>
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增培养方案数据' : '编辑培养方案数据'"
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleFormClose"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="留空则自动生成，手动输入需要32位大写字母和数字组合"
                @input="handleUniqueIdInput"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="系统自动获取学校代码"
                maxlength="10"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="计划年级" prop="jhnj">
              <el-input
                v-model="form.jhnj"
                placeholder="请输入4位年份，例：2022"
                maxlength="4"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业号" prop="zyh">
              <div class="flex-container">
                <el-select
                  v-model="form.zyh"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入专业号或专业名称搜索"
                  :remote-method="handleMajorSearch"
                  :loading="majorLoading"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in majorOptions"
                    :key="item.zyh"
                    :label="item.label"
                    :value="item.zyh"
                  >
                    <div
                      style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      "
                    >
                      <span>{{ item.zymc }}</span>
                      <span style="color: #8492a6; font-size: 13px">
                        {{ item.zysysxbmc }} | {{ item.zyh }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
                <el-tooltip
                  content="数据来源：专业建设情况数据子类表"
                  placement="top"
                >
                  <el-icon class="info-icon">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="总学分要求" prop="zxfyq">
              <el-input-number
                v-model="form.zxfyq"
                :precision="1"
                :step="0.5"
                :min="0"
                controls-position="right"
                placeholder="总学分要求必须为数字"
                class="custom-input-number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总学时要求" prop="zxsyq">
              <el-input-number
                v-model="form.zxsyq"
                placeholder="请输入总学时要求"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="建立年月" prop="jlny">
              <el-date-picker
                v-model="form.jlny"
                type="month"
                placeholder="请选择建立年月"
                format="YYYYMM"
                value-format="YYYYMM"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="格式：YYYYMMDD hhmmss"
                format="YYYYMMDD HHmmss"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="必修学分" prop="bxxf">
              <el-input-number
                v-model="form.bxxf"
                :precision="1"
                :step="0.5"
                :min="0"
                controls-position="right"
                placeholder="必修学分必须为数字"
                class="custom-input-number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="必修学时" prop="bxxs">
              <el-input-number
                v-model="form.bxxs"
                placeholder="请输入必修学时"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="限选学分" prop="xxxf">
              <el-input-number
                v-model="form.xxxf"
                :precision="1"
                :step="0.5"
                :min="0"
                controls-position="right"
                placeholder="限选学分必须为数字"
                class="custom-input-number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="限选学时" prop="xxxs">
              <el-input-number
                v-model="form.xxxs"
                placeholder="请输入限选学时"
                :min="0"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="培养目标" prop="pymb">
              <el-input
                v-model="form.pymb"
                type="textarea"
                placeholder="请输入培养目标，最多2000字"
                :rows="4"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="应取得证书名称" prop="yqdzsmc">
              <el-input
                v-model="form.yqdzsmc"
                type="textarea"
                placeholder="请输入应取得证书名称，多个证书使用逗号隔开，最多2000字"
                :rows="3"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

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

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="培养方案数据详情"
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleDetailClose"
    >
      <div v-if="currentRecord" class="detail-container">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="唯一性标识">{{
            currentRecord.zjsjwyxbs
          }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{
            currentRecord.xxdm
          }}</el-descriptions-item>
          <el-descriptions-item label="计划年级">{{
            currentRecord.jhnj
          }}</el-descriptions-item>
          <el-descriptions-item label="专业号">{{
            currentRecord.zyh
          }}</el-descriptions-item>
          <el-descriptions-item label="总学分要求">{{
            currentRecord.zxfyq
          }}</el-descriptions-item>
          <el-descriptions-item label="总学时要求">{{
            currentRecord.zxsyq
          }}</el-descriptions-item>
          <el-descriptions-item label="建立年月">{{
            currentRecord.jlny
          }}</el-descriptions-item>
          <el-descriptions-item label="必修学分">{{
            currentRecord.bxxf
          }}</el-descriptions-item>
          <el-descriptions-item label="必修学时">{{
            currentRecord.bxxs
          }}</el-descriptions-item>
          <el-descriptions-item label="限选学分">{{
            currentRecord.xxxf
          }}</el-descriptions-item>
          <el-descriptions-item label="限选学时">{{
            currentRecord.xxxs
          }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{
            currentRecord.sjcjsj
          }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(currentRecord.reportStatus)">
              {{ getReportStatusText(currentRecord.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="currentRecord.enableStatus === '1' ? 'success' : 'danger'"
            >
              {{ currentRecord.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">{{
            formatDateTime(currentRecord.createTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">{{
            formatDateTime(currentRecord.updateTime)
          }}</el-descriptions-item>
        </el-descriptions>

        <div class="detail-section">
          <h4>培养目标</h4>
          <div class="detail-content">{{ currentRecord.pymb || "暂无" }}</div>
        </div>

        <div class="detail-section">
          <h4>应取得证书名称</h4>
          <div class="detail-content">
            {{ currentRecord.yqdzsmc || "暂无" }}
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleDetailClose">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
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
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/api";

// API导入
import {
  getOdsPyfasjPage,
  getOdsPyfasjById,
  addOdsPyfasj,
  updateOdsPyfasj,
  deleteOdsPyfasj,
  batchDeleteOdsPyfasj,
  exportOdsPyfasj,
  getSystemSchoolCode,
  getMajorList,
  type OdsPyfasjInfo,
  type OdsPyfasjQuery,
  type OdsPyfasjForm,
  type ZyOption,
} from "@/api-code/code/code_base/zygjx/ods_pyfasj";

import { formatDateTime } from "@/utils/date";

// 搜索条件
const queryParams = reactive<OdsPyfasjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  jhnj: "",
  zyh: "",
  jlny: "",
  reportStatus: "",
  enableStatus: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 表格数据
const dataList = ref<OdsPyfasjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const form = reactive<OdsPyfasjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  jhnj: "",
  zyh: "",
  zxfyq: 0,
  zxsyq: undefined,
  jlny: "",
  pymb: "",
  yqdzsmc: "",
  bxxf: 0,
  bxxs: undefined,
  xxxf: 0,
  xxxs: undefined,
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 详情对话框
const viewDialogVisible = ref(false);
const currentRecord = ref<OdsPyfasjInfo | null>(null);

// 表单验证规则
const validateUniqueId = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(); // 允许为空
    return;
  }

  // 检查长度是否为32位
  if (value.length !== 32) {
    callback(new Error("唯一编码必须为32位"));
    return;
  }

  // 检查是否只包含大写字母和数字
  if (!/^[A-Z0-9]{32}$/.test(value)) {
    callback(new Error("唯一编码只能包含大写字母和数字"));
    return;
  }

  callback();
};

const rules = reactive<FormRules>({
  zjsjwyxbs: [
    { validator: validateUniqueId, trigger: "blur" },
    { max: 32, message: "唯一编码长度不能超过32位", trigger: "blur" },
  ],
  xxdm: [{ required: true, message: "请输入学校代码", trigger: "blur" }],
  jhnj: [
    { required: true, message: "请输入计划年级", trigger: "blur" },
    {
      pattern: /^\d{4}$/,
      message: "计划年级格式必须为4位数字(如：2022)",
      trigger: "blur",
    },
  ],
  zyh: [{ required: true, message: "请选择专业号", trigger: "change" }],
  zxfyq: [
    {
      required: true,
      message: "请输入总学分要求",
      trigger: "blur",
      type: "number",
    },
  ],
  zxsyq: [
    { required: true, message: "请输入总学时要求", trigger: "blur" },
    { type: "integer", message: "总学时要求必须为整数", trigger: "blur" },
  ],
  jlny: [
    { required: true, message: "请输入建立年月", trigger: "blur" },
    {
      pattern: /^\d{6}$/,
      message: "建立年月格式必须为YYYYMM",
      trigger: "blur",
    },
  ],
  pymb: [
    { required: true, message: "请输入培养目标", trigger: "blur" },
    { max: 2000, message: "培养目标长度不能超过2000字", trigger: "blur" },
  ],
  yqdzsmc: [
    { max: 2000, message: "应取得证书名称长度不能超过2000字", trigger: "blur" },
  ],
  bxxf: [
    {
      required: true,
      message: "请输入必修学分",
      trigger: "blur",
      type: "number",
    },
  ],
  bxxs: [{ type: "integer", message: "必修学时必须为整数", trigger: "blur" }],
  xxxf: [
    {
      required: true,
      message: "请输入限选学分",
      trigger: "blur",
      type: "number",
    },
  ],
  xxxs: [{ type: "integer", message: "限选学时必须为整数", trigger: "blur" }],
  sjcjsj: [
    { required: true, message: "请输入数据采集时间", trigger: "blur" },
    {
      pattern: /^\d{8}\s\d{6}$/,
      message: "数据采集时间格式必须为YYYYMMDD hhmmss",
      trigger: "blur",
    },
  ],
});

// 专业号选择相关
const majorOptions = ref<ZyOption[]>([]);
const majorLoading = ref(false);
const majorKeyword = ref("");

// 获取专业号列表
const handleMajorSearch = async (query: string) => {
  if (query) {
    majorLoading.value = true;
    try {
      const response = (await getMajorList(query)) as any;
      if (response.data.code === 200) {
        majorOptions.value = response.data.data;
      } else {
        ElMessage.error(response.message || "获取专业列表失败");
      }
    } catch (error) {
      console.error("获取专业列表失败:", error);
      ElMessage.error("获取专业列表失败");
    } finally {
      majorLoading.value = false;
    }
  } else {
    majorOptions.value = [];
  }
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = (await getOdsPyfasjPage(queryParams)) as any;
    if (response?.data?.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response?.data?.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询培养方案数据失败:", error);
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
    jhnj: "",
    zyh: "",
    jlny: "",
    reportStatus: "",
    enableStatus: "",
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
  dialogVisible.value = true;

  try {
    const response = (await getSystemSchoolCode()) as any;
    if (response.data.code === 200) {
      form.xxdm = response.data.data;
    } else {
      ElMessage.error(response.message || "获取学校代码失败");
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
    ElMessage.error("获取学校代码失败");
  }
};

// 编辑
const handleEdit = async (row: OdsPyfasjInfo) => {
  try {
    const response = (await getOdsPyfasjById(row.id)) as any;
    if (response?.data?.code === 200) {
      Object.assign(form, response.data.data);
      dialogType.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response?.data?.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取培养方案数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsPyfasjInfo) => {
  try {
    const response = (await getOdsPyfasjById(row.id)) as any;
    if (response?.data?.code === 200) {
      currentRecord.value = response.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(response?.data?.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取培养方案数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsPyfasjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条培养方案数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = (await deleteOdsPyfasj(row.id)) as any;
    if (response?.data?.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response?.data?.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除培养方案数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的记录");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 条记录吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = (await batchDeleteOdsPyfasj(selectedIds.value)) as any;
    if (response?.data?.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response?.data?.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除培养方案数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsPyfasj(queryParams);

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `培养方案数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出培养方案数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response: any;
    if (dialogType.value === "add") {
      response = await addOdsPyfasj(form);
    } else {
      response = await updateOdsPyfasj(form);
    }

    if (response?.data?.code === 200) {
      ElMessage.success(dialogType.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(
        response?.data?.msg ||
          `${dialogType.value === "add" ? "新增" : "修改"}失败`,
      );
    }
  } catch (error) {
    console.error(
      `${dialogType.value === "add" ? "新增" : "修改"}培养方案数据失败:`,
      error,
    );
    ElMessage.error(`${dialogType.value === "add" ? "新增" : "修改"}失败`);
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
    jhnj: "",
    zyh: "",
    zxfyq: 0,
    zxsyq: undefined,
    jlny: "",
    pymb: "",
    yqdzsmc: "",
    bxxf: 0,
    bxxs: undefined,
    xxxf: 0,
    xxxs: undefined,
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

// 关闭表单对话框
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 关闭详情对话框
const handleDetailClose = () => {
  viewDialogVisible.value = false;
  currentRecord.value = null;
};

// 选择变化
const handleSelectionChange = (selection: OdsPyfasjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 分页变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 行双击
const handleRowDblClick = (row: OdsPyfasjInfo) => {
  handleView(row);
};

// 启用状态变化
const handleEnableStatusChange = async (row: OdsPyfasjInfo) => {
  try {
    row.statusLoading = true;
    // 这里可以调用状态更新API
    ElMessage.success("状态更新成功");
  } catch (error) {
    console.error("更新状态失败:", error);
    ElMessage.error("状态更新失败");
    // 恢复原状态
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
  } finally {
    row.statusLoading = false;
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
      return "info";
  }
};

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

// 输入处理
const handleUniqueIdInput = (value: string) => {
  if (value) {
    // 自动转换为大写
    form.zjsjwyxbs = value.toUpperCase();
  }
};

// 页面加载
onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
.entity-management {
  .search-card {
    height: 60px;
  }

  .table-card {
    margin-top: -10px;

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 0 2px;

      .operation-buttons {
        display: flex;
        gap: 10px;
      }

      .header-title {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
      }
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .pagination-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding: 10px 2px;

      .total-info {
        color: #606266;
        font-size: 14px;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .detail-container {
    .detail-section {
      margin-top: 20px;

      h4 {
        margin-bottom: 10px;
        color: #303133;
        font-weight: bold;
      }

      .detail-content {
        padding: 10px;
        background-color: #f5f7fa;
        border-radius: 4px;
        white-space: pre-wrap;
        word-break: break-word;
        min-height: 60px;
      }
    }
  }
}

.flex-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  :deep(.el-select) {
    width: calc(100% - 24px);
  }
}

.info-icon {
  color: #e6a23c;
  cursor: help;
  font-size: 16px;
  flex-shrink: 0;
}

.el-input-number {
  width: 100%;
}

:deep(.el-input-number) {
  width: 100%;
  .el-input__wrapper {
    width: 100%;
  }
}
</style>
