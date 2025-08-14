<template>
  <div class="professional-development-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="基地编号" prop="sxjdbh">
            <el-input
              v-model="queryParams.sxjdbh"
              placeholder="请输入实训基地编号"
              clearable
            />
          </el-form-item>
          <el-form-item label="基地名称" prop="sxjdmc">
            <el-input
              v-model="queryParams.sxjdmc"
              placeholder="请输入实训基地名称"
              clearable
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
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">实习基地数据表编码管理</div>
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
            prop="sxjdbh"
            label="基地编号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sxjdmc"
            label="基地名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="ssgldwmc"
            label="管理单位"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="ytdw"
            label="依托单位"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sxjdlbm"
            label="基地类别"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getSxjdlbmText(row.sxjdlbm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sxjdjlrq"
            label="建立日期"
            min-width="120"
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
                :type="
                  getReportStatusTagType(row.reportStatus) as
                    | 'success'
                    | 'primary'
                    | 'warning'
                    | 'info'
                    | 'danger'
                "
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增实习基地数据' : '编辑实习基地数据'"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleFormClose"
    >
      <!-- 字段说明 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="留空则系统自动生成32位唯一标识"
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
                style="background-color: #f5f7fa"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训基地编号" prop="sxjdbh">
              <el-input
                v-model="form.sxjdbh"
                placeholder="请输入实训基地编号"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训基地名称" prop="sxjdmc">
              <el-input
                v-model="form.sxjdmc"
                placeholder="请输入实训基地名称"
                maxlength="110"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属管理单位名称" prop="ssgldwmc">
              <el-input
                v-model="form.ssgldwmc"
                placeholder="请输入所属管理单位名称"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训基地建立日期" prop="sxjdjlrq">
              <el-date-picker
                v-model="form.sxjdjlrq"
                type="date"
                placeholder="请选择建立日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="依托单位" prop="ytdw">
              <el-input
                v-model="form.ytdw"
                placeholder="请输入依托单位"
                maxlength="120"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训基地类别码" prop="sxjdlbm">
              <el-select
                v-model="form.sxjdlbm"
                placeholder="请选择实训基地类别"
                style="width: 100%"
                filterable
                clearable
              >
                <el-option
                  v-for="item in sxjdlbmOptions"
                  :key="item.value"
                  :label="`${item.value} - ${item.label}`"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="适应专业名称" prop="syzymc">
              <el-input
                v-model="form.syzymc"
                type="textarea"
                :rows="3"
                placeholder="请输入适应专业名称，多个专业使用逗号隔开"
                maxlength="180"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="基地合作企业" prop="jdhzqy">
              <el-input
                v-model="form.jdhzqy"
                type="textarea"
                :rows="3"
                placeholder="请输入基地合作企业"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间（格式：YYYYMMDD HHmmss）"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
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
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-switch
                v-model="form.enableStatus"
                active-value="1"
                inactive-value="0"
                active-text="启用"
                inactive-text="禁用"
                :loading="statusLoading"
                @change="handleFormEnableStatusChange"
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
      title="实训基地数据详情"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleDetailClose"
    >
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主键数据唯一性标识">{{
            currentRecord.zjsjwyxbs || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{
            currentRecord.xxdm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实训基地编号">{{
            currentRecord.sxjdbh || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实训基地名称">{{
            currentRecord.sxjdmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="所属管理单位名称">{{
            currentRecord.ssgldwmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实训基地建立日期">{{
            currentRecord.sxjdjlrq || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="依托单位">{{
            currentRecord.ytdw || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实训基地类别码">{{
            currentRecord.sxjdlbm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="适应专业名称" :span="2">{{
            currentRecord.syzymc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="基地合作企业" :span="2">{{
            currentRecord.jdhzqy || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{
            formatDisplayDateTime(currentRecord.sjcjsj)
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDateTime(currentRecord.createTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            formatDateTime(currentRecord.updateTime)
          }}</el-descriptions-item>
        </el-descriptions>
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

import {
  getOdsSxjdsjPage,
  getOdsSxjdsjById,
  addOdsSxjdsj,
  updateOdsSxjdsj,
  deleteOdsSxjdsj,
  batchDeleteOdsSxjdsj,
  exportOdsSxjdsj,
  getSystemSchoolCode,
  type OdsSxjdsjInfo,
  type OdsSxjdsjQuery,
  type OdsSxjdsjForm,
  type DictOption,
} from "@/api-code/code/code_base/zygjx/ods_sxjdsj";
import { getDictOptions } from "@/api-code/code/code_base/zygxx/ods_xxjbsj";

// 响应式变量
const loading = ref(false);
const submitLoading = ref(false);
const statusLoading = ref(false);
const total = ref(0);
const dataList = ref<OdsSxjdsjInfo[]>([]);
const selectedIds = ref<number[]>([]);

// 对话框控制
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");

// 当前记录
const currentRecord = ref<OdsSxjdsjInfo | null>(null);

// 表单引用
const queryForm = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 字典选项
const sxjdlbmOptions = ref<DictOption[]>([]);

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 查询参数
const queryParams = reactive<OdsSxjdsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  sxjdbh: "",
  sxjdmc: "",
  ssgldwmc: "",
  ytdw: "",
  syzymc: "",
  sxjdlbm: "",
  sxjdjlrqStart: "",
  sxjdjlrqEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单数据
const form = reactive<OdsSxjdsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  sxjdbh: "",
  sxjdmc: "",
  ssgldwmc: "",
  sxjdjlrq: "",
  ytdw: "",
  syzymc: "",
  jdhzqy: "",
  sxjdlbm: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = reactive({
  // 主键数据唯一性标识 - 可选，如果为空则由后端自动生成，32位全局唯一编码字符串（大写字母+数字组合）
  zjsjwyxbs: [
    {
      validator: (_rule: any, value: string, callback: Function) => {
        // 如果值为空，允许通过（后端会自动生成）
        if (!value || value.trim() === "") {
          callback();
          return;
        }
        // 如果有值，则验证格式
        if (value.length !== 32) {
          callback(new Error("主键数据唯一性标识必须是32位字符"));
          return;
        }
        if (!/^[A-Z0-9]{32}$/.test(value)) {
          callback(new Error("主键数据唯一性标识只能包含大写字母和数字"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
  // 学校代码 - 必填，学校（机构）标识码，10位数字码
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { min: 10, max: 10, message: "学校代码必须是10位数字", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码只能是10位数字", trigger: "blur" },
  ],
  // 实训基地编号 - 必填，学校自编，最大64位
  sxjdbh: [
    { required: true, message: "请输入实训基地编号", trigger: "blur" },
    { max: 64, message: "实训基地编号长度不能超过64位", trigger: "blur" },
  ],
  // 实训基地名称 - 必填，最大110位
  sxjdmc: [
    { required: true, message: "请输入实训基地名称", trigger: "blur" },
    { max: 110, message: "实训基地名称长度不能超过110位", trigger: "blur" },
  ],
  // 所属管理单位名称 - 可选，最大50位
  ssgldwmc: [
    { max: 50, message: "所属管理单位名称长度不能超过50位", trigger: "blur" },
  ],
  // 实训基地建立日期 - 必填，格式：YYYYMMDD
  sxjdjlrq: [
    { required: true, message: "请选择实训基地建立日期", trigger: "change" },
  ],
  // 依托单位 - 必填，依托单位名称，最大120位
  ytdw: [
    { required: true, message: "请输入依托单位", trigger: "blur" },
    { max: 120, message: "依托单位名称长度不能超过120位", trigger: "blur" },
  ],
  // 适应专业名称 - 可选，多个专业使用逗号隔开，最大180位
  syzymc: [
    { max: 180, message: "适应专业名称长度不能超过180位", trigger: "blur" },
  ],
  // 基地合作企业 - 可选，最大200位
  jdhzqy: [
    { max: 200, message: "基地合作企业长度不能超过200位", trigger: "blur" },
  ],
  // 实训基地类别码 - 必填，从字典SXJDLBDM获取，最大10位
  sxjdlbm: [
    { required: true, message: "请选择实训基地类别", trigger: "change" },
    { max: 10, message: "实训基地类别码长度不能超过10位", trigger: "blur" },
  ],
  // 数据采集时间 - 必填，格式：YYYYMMDD hhmmss
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsSxjdsjPage(queryParams);
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      dataList.value = (apiResponse.data.data.records || []).map(
        (item: any) => ({
          ...item,
          statusLoading: false,
          sjcjsjDisplay: formatDisplayDateTime(item.sjcjsj),
        }),
      );
      total.value = apiResponse.data.data.total || 0;
    } else {
      ElMessage.error(apiResponse?.data?.message || "查询失败");
    }
  } catch (error: any) {
    console.error("查询失败:", error);
    ElMessage.error(error.message || "查询失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

// 格式化日期时间显示
const formatDateTime = (dateTimeStr: string | undefined): string => {
  if (!dateTimeStr) return "-";

  try {
    // 如果是ISO格式的日期字符串
    if (dateTimeStr.includes("T")) {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return dateTimeStr;
      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    // 如果是YYYYMMDDHHmmss格式
    if (dateTimeStr.length === 14) {
      const year = dateTimeStr.substring(0, 4);
      const month = dateTimeStr.substring(4, 6);
      const day = dateTimeStr.substring(6, 8);
      const hour = dateTimeStr.substring(8, 10);
      const minute = dateTimeStr.substring(10, 12);
      const second = dateTimeStr.substring(12, 14);
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    return dateTimeStr;
  } catch (error) {
    console.error("日期格式化失败:", error);
    return dateTimeStr || "-";
  }
};

// 格式化采集时间显示
const formatDisplayDateTime = (dateTimeStr: string | undefined): string => {
  return formatDateTime(dateTimeStr);
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: string): string => {
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
const getReportStatusText = (status: string): string => {
  switch (status) {
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return "未上报";
  }
};

// 获取实训基地类别码文本
const getSxjdlbmText = (code: string): string => {
  const option = sxjdlbmOptions.value.find((item) => item.value === code);
  return option ? option.label : code || "-";
};

// 加载字典数据
const loadDictOptions = async () => {
  try {
    // 获取实训基地类别码字典
    const sxjdlbmRes: any = await getDictOptions("SXJDLBDM");
    console.log("字典API响应:", sxjdlbmRes);
    if (sxjdlbmRes.data && sxjdlbmRes.data.code === 200) {
      sxjdlbmOptions.value = sxjdlbmRes.data.data || [];
      console.log("实训基地类别码字典加载成功:", sxjdlbmOptions.value);
    } else {
      console.warn("字典数据加载失败:", sxjdlbmRes.data?.message || "未知错误");
      ElMessage.error("字典数据加载失败，请检查字典配置");
    }
  } catch (error) {
    console.error("加载字典数据失败:", error);
    ElMessage.error("加载字典数据失败");
  }
};

// 获取系统学校代码
const loadSystemSchoolCode = async () => {
  try {
    console.log("开始获取系统学校代码...");
    const response = await getSystemSchoolCode();
    console.log("学校代码API响应:", response);
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

// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置搜索
const resetQuery = () => {
  queryForm.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

// 分页处理
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  queryParams.pageNum = 1;
  getList();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

// 选择变化
const handleSelectionChange = (selection: OdsSxjdsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (row: OdsSxjdsjInfo) => {
  console.log("行点击:", row);
};

// 行双击
const handleRowDblClick = (row: OdsSxjdsjInfo) => {
  handleView(row);
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogType.value = "add";
  // 自动设置学校代码和当前时间
  form.xxdm = systemSchoolCode.value;
  form.sjcjsj = new Date()
    .toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(/[^\d]/g, "")
    .replace(/(\d{8})(\d{6})/, "$1 $2");
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsSxjdsjInfo) => {
  try {
    const response = await getOdsSxjdsjById(row.id);
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      Object.assign(form, apiResponse.data.data);
      // 确保学校代码使用系统学校代码
      if (systemSchoolCode.value) {
        form.xxdm = systemSchoolCode.value;
      }
      dialogType.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取数据失败");
    }
  } catch (error: any) {
    console.error("获取数据失败:", error);
    ElMessage.error(error.message || "获取数据失败");
  }
};

// 查看
const handleView = async (row: OdsSxjdsjInfo) => {
  try {
    const response = await getOdsSxjdsjById(row.id);
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      currentRecord.value = apiResponse.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取数据失败");
    }
  } catch (error: any) {
    console.error("获取数据失败:", error);
    ElMessage.error(error.message || "获取数据失败");
  }
};

// 删除
const handleDelete = async (row: OdsSxjdsjInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除实训基地"${row.sxjdmc}"吗？`,
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await deleteOdsSxjdsj(row.id);
    const apiResponse = response as unknown as {
      data: { code: number; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(apiResponse?.data?.message || "删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error(error.message || "删除失败");
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
      "批量删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await batchDeleteOdsSxjdsj(selectedIds.value);
    const apiResponse = response as unknown as {
      data: { code: number; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(apiResponse?.data?.message || "批量删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error(error.message || "批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    loading.value = true;
    ElMessage.info("正在导出数据，请稍候...");

    const response = await exportOdsSxjdsj(queryParams);

    let blob: Blob;
    if (response.data instanceof Blob) {
      blob = response.data;
    } else if (response instanceof Blob) {
      blob = response;
    } else {
      throw new Error("服务器返回了错误的响应格式");
    }

    if (blob.size === 0) {
      throw new Error("导出的文件为空，请检查数据或联系管理员");
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;

    const now = new Date();
    const dateStr = now.toLocaleDateString("zh-CN").replace(/\//g, "-");
    const timeStr = now.getTime();
    link.download = `实训基地数据_${dateStr}_${timeStr}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error: any) {
    console.error("导出失败:", error);
    ElMessage.error(error.message || "导出失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 表单启用状态变化
const handleFormEnableStatusChange = async (
  value: string | number | boolean,
) => {
  statusLoading.value = true;
  try {
    // 在表单中直接修改，保存时一起提交
    form.enableStatus = String(value);
    ElMessage.success("状态已修改，保存后生效");
  } catch (error: any) {
    console.error("状态修改失败:", error);
    ElMessage.error(error.message || "状态修改失败");
    // 恢复原状态
    form.enableStatus = String(value) === "1" ? "0" : "1";
  } finally {
    statusLoading.value = false;
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    // 准备提交的数据
    const submitData = { ...form };

    // 如果是新增且唯一标识为空，则删除该字段让后端自动生成
    if (
      dialogType.value === "add" &&
      (!submitData.zjsjwyxbs || submitData.zjsjwyxbs.trim() === "")
    ) {
      delete submitData.zjsjwyxbs;
      console.log("数据唯一性标识为空，将由后端自动生成");
    }

    let response;
    if (dialogType.value === "add") {
      response = await addOdsSxjdsj(submitData);
    } else {
      response = await updateOdsSxjdsj(submitData);
    }

    const apiResponse = response as unknown as {
      data: { code: number; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      ElMessage.success(dialogType.value === "add" ? "新增成功" : "修改成功");
      handleFormClose();
      getList();
    } else {
      ElMessage.error(
        apiResponse?.data?.message ||
          (dialogType.value === "add" ? "新增失败" : "修改失败"),
      );
    }
  } catch (error: any) {
    console.error("操作失败:", error);
    ElMessage.error(error.message || "操作失败");
  } finally {
    submitLoading.value = false;
  }
};

// 关闭表单对话框
const handleFormClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
  resetForm();
};

// 关闭详情对话框
const handleDetailClose = () => {
  viewDialogVisible.value = false;
  currentRecord.value = null;
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    sxjdbh: "",
    sxjdmc: "",
    ssgldwmc: "",
    sxjdjlrq: "",
    ytdw: "",
    syzymc: "",
    jdhzqy: "",
    sxjdlbm: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
};

// 页面初始化
onMounted(() => {
  getList();
  loadDictOptions();
  loadSystemSchoolCode();
});
</script>

<style scoped lang="scss">
.professional-development-management {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-card {
  height: 60px;
  flex-shrink: 0;
}

.search-bar {
  margin-top: -5px;
}

.table-card {
  height: calc(100vh - 620px);
  margin-top: -30px;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
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
  flex: 1;
  overflow: hidden;

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

// 表格样式
:deep(.el-table) {
  flex: 1;
  font-size: 12px;

  .cell {
    padding: 0 8px;
  }

  .el-table__header-wrapper {
    .el-table__header {
      th {
        background-color: #fafafa;
        color: #606266;
        font-weight: 600;
      }
    }
  }
}

// 分页样式
.pagination-wrapper {
  :deep(.el-pagination) {
    justify-content: flex-end;
    font-size: 14px;

    .el-pagination__total {
      display: none;
    }

    .el-pagination__sizes {
      margin-right: 15px;
    }

    .btn-prev,
    .btn-next,
    .el-pager li {
      min-width: 24px;
      height: 24px;
      line-height: 24px;
    }

    .el-select .el-input {
      width: 100px;
    }
  }
}
</style>
