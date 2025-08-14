<template>
  <div class="ods-zyszsj-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
           
           
        
          <el-form-item label="专业名称" prop="zymc">
            <el-input
              v-model="queryParams.zymc"
              placeholder="请输入专业名称"
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
          <el-form-item label="专业层次" prop="zyccm">
            <el-select
              v-model="queryParams.zyccm"
              placeholder="请选择专业层次"
              clearable
            >
              <el-option
                v-for="item in zyccmOptions"
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
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="warning" @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>
        <div class="header-title">专业设置数据表编码管理</div>
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
          size="default"
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
            prop="zyh"
            label="专业号"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="zymc"
            label="专业名称"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="zyssyxbmc"
            label="所属院系部"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column label="专业层次" width="100" show-overflow-tooltip>
            <template #default="{ row }">
              {{ getZyccmText(row.zyccm) }}
            </template>
          </el-table-column>
          <el-table-column label="学制" width="80" align="center">
            <template #default="{ row }">
              {{ getXzmText(row.xzm) }}
            </template>
          </el-table-column>
          <el-table-column label="重点专业" width="100" align="center">
            <template #default="{ row }">
              {{ getSfzdzyText(row.sfzdzy) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sjcjsjDisplay"
            label="采集时间"
            width="160"
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
                :type="
                  getReportStatusTagType(row.reportStatus) as
                    | 'success'
                    | 'primary'
                    | 'warning'
                    | 'info'
                    | 'danger'
                "
                @click="handleReportStatusClick(row)"
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
      :title="dialogType === 'add' ? '新增专业设置数据' : '编辑专业设置数据'"
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleFormClose"
      class="custom-dialog"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
        class="custom-form"
      >
        <div class="form-container">
          <div class="section-title">基本信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                <el-input
                  v-model="form.zjsjwyxbs"
                  :placeholder="
                    dialogType === 'add'
                      ? '新增时可为空，系统将自动生成'
                      : '请输入主键数据唯一性标识'
                  "
                  maxlength="32"
                  show-word-limit
                >
                  <template #append v-if="dialogType === 'add'">
                    <el-tooltip
                      content="新增时可不填写，系统会自动生成32位唯一标识"
                      placement="top"
                    >
                      <el-icon><InfoFilled /></el-icon>
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
              <el-form-item label="专业名称" prop="zymc">
                <el-input
                  v-model="form.zymc"
                  placeholder="请输入专业名称"
                  maxlength="60"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="专业号" prop="zyh">
                <div style="display: flex; align-items: center; width: 100%">
                  <el-select
                    v-model="form.zyh"
                    placeholder="请输入专业号搜索"
                    filterable
                    remote
                    :remote-method="handleZyhSearch"
                    :loading="zyhLoading"
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in zyhOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-tooltip
                    content="专业号数据来源于专业建设情况数据子类表"
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
              <el-form-item label="专业所属院系部名称" prop="zyssyxbmc">
                <el-input
                  v-model="form.zyssyxbmc"
                  placeholder="请输入专业所属院系部名称"
                  maxlength="60"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="专业层次码" prop="zyccm">
                <el-select
                  v-model="form.zyccm"
                  placeholder="请选择专业层次"
                  filterable
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in zyccmOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="section-title">详细信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="学制码" prop="xzm">
                <el-select
                  v-model="form.xzm"
                  placeholder="请选择学制"
                  filterable
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in xzmOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="授予学位类别码" prop="syxwlbm">
                <el-select
                  v-model="form.syxwlbm"
                  placeholder="请选择授予学位类别"
                  filterable
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in syxwlbmOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否重点专业" prop="sfzdzy">
                <el-select
                  v-model="form.sfzdzy"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in sfzdzyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重点专业级别码" prop="zdzyjbm">
                <el-select
                  v-model="form.zdzyjbm"
                  placeholder="请选择重点专业级别"
                  filterable
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in zdzyjbmOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重点专业类型码" prop="zdzylxm">
                <el-select
                  v-model="form.zdzylxm"
                  placeholder="请选择重点专业类型"
                  filterable
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in zdzylxmOptions"
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
                  placeholder="请选择数据采集时间"
                  value-format="YYYYMMDD HHmmss"
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <div class="section-title">其他信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="所属专业群名称" prop="sszyqmc">
                <el-input
                  v-model="form.sszyqmc"
                  placeholder="请输入所属专业群名称"
                  maxlength="60"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属专业群号" prop="sszyqh">
                <el-input
                  v-model="form.sszyqh"
                  placeholder="请输入所属专业群号"
                  maxlength="20"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="批准设置年月" prop="pzszny">
                <el-input
                  v-model="form.pzszny"
                  placeholder="请输入批准设置年月(YYYYMM)"
                  maxlength="6"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="首次招生年月" prop="sczsny">
                <el-input
                  v-model="form.sczsny"
                  placeholder="请输入首次招生年月(YYYYMM)"
                  maxlength="6"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <div class="section-title">状态信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="上报状态" prop="reportStatus">
                <el-select
                  v-model="form.reportStatus"
                  placeholder="请选择上报状态"
                  style="width: 100%"
                >
                  <el-option label="未上报" value="0" />
                  <el-option label="已上报" value="1" />
                  <el-option label="上报失败" value="2" />
                </el-select>
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
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose">取 消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="专业设置数据详情"
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
          <el-descriptions-item label="专业名称">{{
            currentRecord.zymc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="专业号">{{
            currentRecord.zyh || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="专业所属院系部名称">{{
            currentRecord.zyssyxbmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="专业层次">{{
            getZyccmText(currentRecord.zyccm)
          }}</el-descriptions-item>
          <el-descriptions-item label="学制">{{
            getXzmText(currentRecord.xzm)
          }}</el-descriptions-item>
          <el-descriptions-item label="授予学位类别">{{
            getSyxwlbmText(currentRecord.syxwlbm)
          }}</el-descriptions-item>
          <el-descriptions-item label="是否重点专业">{{
            getSfzdzyText(currentRecord.sfzdzy)
          }}</el-descriptions-item>
          <el-descriptions-item label="重点专业级别">{{
            getZdzyjbmText(currentRecord.zdzyjbm)
          }}</el-descriptions-item>
          <el-descriptions-item label="重点专业类型">{{
            getZdzylxmText(currentRecord.zdzylxm)
          }}</el-descriptions-item>
          <el-descriptions-item label="所属专业群名称">{{
            currentRecord.sszyqmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="所属专业群号">{{
            currentRecord.sszyqh || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="批准设置年月">{{
            currentRecord.pzszny || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="首次招生年月">{{
            currentRecord.sczsny || "-"
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
  InfoFilled,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 年月格式验证
const validateYearMonth = (_: any, value: string, callback: any) => {
  if (!value) {
    callback();
    return;
  }
  const year = parseInt(value.substring(0, 4));
  const month = parseInt(value.substring(4, 6));

  if (year < 1900 || year > new Date().getFullYear()) {
    callback(new Error("年份不合法"));
    return;
  }

  if (month < 1 || month > 12) {
    callback(new Error("月份不合法"));
    return;
  }

  callback();
};

// 日期时间格式验证
const validateDateTime = (_: any, value: string, callback: any) => {
  if (!value) {
    callback();
    return;
  }

  let year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number;

  // 支持新格式 YYYYMMDD HHmmss（带空格）
  if (value.length === 15 && value.includes(" ")) {
    const [datePart, timePart] = value.split(" ");
    if (datePart.length === 8 && timePart.length === 6) {
      year = parseInt(datePart.substring(0, 4));
      month = parseInt(datePart.substring(4, 6));
      day = parseInt(datePart.substring(6, 8));
      hour = parseInt(timePart.substring(0, 2));
      minute = parseInt(timePart.substring(2, 4));
      second = parseInt(timePart.substring(4, 6));
    } else {
      callback(new Error("日期时间格式不正确"));
      return;
    }
  }
  // 兼容旧格式 YYYYMMDDHHmmss（无空格）
  else if (value.length === 14) {
    year = parseInt(value.substring(0, 4));
    month = parseInt(value.substring(4, 6));
    day = parseInt(value.substring(6, 8));
    hour = parseInt(value.substring(8, 10));
    minute = parseInt(value.substring(10, 12));
    second = parseInt(value.substring(12, 14));
  } else {
    callback(new Error("日期时间格式不正确"));
    return;
  }

  const date = new Date(year, month - 1, day, hour, minute, second);

  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getSeconds() !== second
  ) {
    callback(new Error("日期时间格式不合法"));
    return;
  }

  if (date > new Date()) {
    callback(new Error("日期时间不能超过当前时间"));
    return;
  }

  callback();
};

// API导入
import {
  getOdsZyszszjPage,
  getOdsZyszszjById,
  addOdsZyszsj,
  updateOdsZyszsj,
  deleteOdsZyszsj,
  batchDeleteOdsZyszsj,
  exportOdsZyszsj,
  updateSingleReportStatus,
  updateSingleEnableStatus,
  getZyccmOptions,
  getXzmOptions,
  getSyxwlbmOptions,
  getSfzdzyOptions,
  getZdzyjbmOptions,
  getZdzylxmOptions,
  getZyhOptions, // Added getZyhOptions
  type OdsZyszszjInfo,
  type OdsZyszszjQuery,
  type OdsZyszszjForm,
  type DictOption,
} from "@/api-code/code/code_base/zygjx/ods_zyszsj";
import { getSystemSchoolCode } from "@/api-code/code/code_base/zygxx/ods_xxhxtjssj";

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 获取系统学校代码
const loadSystemSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const result = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (result?.data?.code === 200 && result?.data?.data) {
      systemSchoolCode.value = result.data.data;
      console.log("获取系统学校代码成功:", systemSchoolCode.value);
      // 如果当前是新增表单，自动设置学校代码
      if (dialogVisible.value && dialogType.value === "add") {
        form.xxdm = systemSchoolCode.value;
      }
    } else {
      console.warn(
        "获取系统学校代码失败:",
        result?.data?.message || "未知错误",
      );
      ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
  }
};

// 页面状态
const loading = ref(false);
const total = ref(0);
const dataList = ref<OdsZyszszjInfo[]>([]);
const selectedIds = ref<number[]>([]);

// 查询参数
const queryParams = reactive<OdsZyszszjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  zymc: "",
  zyh: "",
  zyccm: "",
  pageNum: 1,
  pageSize: 20,
});

// 对话框状态
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const submitLoading = ref(false);

// 当前记录
const currentRecord = ref<OdsZyszszjInfo | null>(null);

// 表单
const formRef = ref<FormInstance>();
const form = reactive<OdsZyszszjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  zymc: "",
  zyh: "",
  zyssyxbmc: "",
  zyccm: "",
  xzm: "",
  syxwlbm: "",
  sfzdzy: "",
  zdzyjbm: "",
  zdzylxm: "",
  sszyqmc: "",
  sszyqh: "",
  pzszny: "",
  sczsny: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 字典选项
const zyccmOptions = ref<DictOption[]>([]);
const xzmOptions = ref<DictOption[]>([]);
const syxwlbmOptions = ref<DictOption[]>([]);
const sfzdzyOptions = ref<DictOption[]>([]);
const zdzyjbmOptions = ref<DictOption[]>([]);
const zdzylxmOptions = ref<DictOption[]>([]);

// 专业号搜索相关
const zyhLoading = ref(false);
const zyhOptions = ref<DictOption[]>([]);
const zyhSearchTimeout = ref<number | null>(null);

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    {
      required: false,
      validator: (_: any, value: string, callback: any) => {
        if (dialogType.value === "edit" && !value) {
          callback(new Error("请输入主键数据唯一性标识"));
        } else if (value && !/^[A-Z0-9]{32}$/.test(value)) {
          callback(
            new Error("主键数据唯一性标识必须是32位大写字母和数字的组合"),
          );
        } else if (value && value.length > 32) {
          callback(new Error("主键数据唯一性标识长度不能超过32位"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须是10位数字", trigger: "blur" },
  ],
  zyssyxbmc: [
    { max: 60, message: "专业所属院系部名称长度不能超过60位", trigger: "blur" },
  ],
  zymc: [
    { required: true, message: "请输入专业名称", trigger: "blur" },
    { max: 60, message: "专业名称长度不能超过60位", trigger: "blur" },
  ],
  zyh: [
    { required: true, message: "请输入专业号", trigger: "blur" },
    { max: 64, message: "专业号长度不能超过64位", trigger: "blur" },
  ],
  sszyqmc: [
    { max: 60, message: "所属专业群名称长度不能超过60位", trigger: "blur" },
  ],
  sszyqh: [
    { max: 20, message: "所属专业群号长度不能超过20位", trigger: "blur" },
  ],
  pzszny: [
    { required: true, message: "请输入批准设置年月", trigger: "blur" },
    {
      pattern: /^\d{6}$/,
      message: "批准设置年月格式必须为YYYYMM",
      trigger: "blur",
    },
    { validator: validateYearMonth, trigger: "blur" },
  ],
  sczsny: [
    { required: true, message: "请输入首次招生年月", trigger: "blur" },
    {
      pattern: /^\d{6}$/,
      message: "首次招生年月格式必须为YYYYMM",
      trigger: "blur",
    },
    { validator: validateYearMonth, trigger: "blur" },
  ],
  zyccm: [
    { required: true, message: "请选择专业层次", trigger: "change" },
    { max: 2, message: "专业层次码长度不能超过2位", trigger: "blur" },
  ],
  xzm: [
    { required: true, message: "请选择学制", trigger: "change" },
    { max: 2, message: "学制码长度不能超过2位", trigger: "blur" },
  ],
  syxwlbm: [
    { max: 2, message: "授予学位类别码长度不能超过2位", trigger: "blur" },
  ],
  sfzdzy: [
    { required: true, message: "请选择是否重点专业", trigger: "change" },
    { pattern: /^[01]$/, message: "是否重点专业必须是0或1", trigger: "blur" },
  ],
  zdzyjbm: [
    { max: 2, message: "重点专业级别码长度不能超过2位", trigger: "blur" },
  ],
  zdzylxm: [
    { max: 2, message: "重点专业类型码长度不能超过2位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
    {
      pattern: /^\d{8} \d{6}$/,
      message: "数据采集时间格式必须为YYYYMMDD HHmmss",
      trigger: "blur",
    },
    { validator: validateDateTime, trigger: "blur" },
  ],
});

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsZyszszjPage(queryParams);
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

// 查询
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  Object.assign(queryParams, {
    zjsjwyxbs: "",
    xxdm: "",
    zymc: "",
    zyh: "",
    zyccm: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 选择变化
const handleSelectionChange = (selection: OdsZyszszjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (row: OdsZyszszjInfo) => {
  console.log("行点击:", row);
};

// 行双击
const handleRowDblClick = (row: OdsZyszszjInfo) => {
  handleView(row);
};

// 新增
const handleAdd = () => {
  resetForm();
  // 自动设置学校代码
  if (systemSchoolCode.value) {
    form.xxdm = systemSchoolCode.value;
  }
  dialogType.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsZyszszjInfo) => {
  try {
    const response = await getOdsZyszszjById(row.id);
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      const data = apiResponse.data.data;
      Object.assign(form, {
        id: data.id,
        zjsjwyxbs: data.zjsjwyxbs,
        xxdm: data.xxdm,
        zymc: data.zymc,
        zyh: data.zyh,
        zyssyxbmc: data.zyssyxbmc,
        zyccm: data.zyccm,
        xzm: data.xzm,
        syxwlbm: data.syxwlbm,
        sfzdzy: data.sfzdzy,
        zdzyjbm: data.zdzyjbm,
        zdzylxm: data.zdzylxm,
        sszyqmc: data.sszyqmc,
        sszyqh: data.sszyqh,
        pzszny: data.pzszny,
        sczsny: data.sczsny,
        sjcjsj: data.sjcjsj,
        reportStatus: data.reportStatus,
        enableStatus: data.enableStatus,
      });
      dialogType.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取数据失败");
    }
  } catch (error: any) {
    console.error("获取数据失败:", error);
    ElMessage.error(error.message || "获取数据失败，请稍后重试");
  }
};

// 查看详情
const handleView = async (row: OdsZyszszjInfo) => {
  try {
    const response = await getOdsZyszszjById(row.id);
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      currentRecord.value = apiResponse.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取详情失败");
    }
  } catch (error: any) {
    console.error("获取详情失败:", error);
    ElMessage.error(error.message || "获取详情失败，请稍后重试");
  }
};

// 删除
const handleDelete = async (row: OdsZyszszjInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除专业设置数据"${row.zymc}"吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await deleteOdsZyszsj(row.id);
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
      ElMessage.error(error.message || "删除失败，请稍后重试");
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
      `确定要删除选中的 ${selectedIds.value.length} 条专业设置数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await batchDeleteOdsZyszsj(selectedIds.value);
    const apiResponse = response as unknown as {
      data: { code: number; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
    } else {
      ElMessage.error(apiResponse?.data?.message || "批量删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error(error.message || "批量删除失败，请稍后重试");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsZyszsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `专业设置数据_${new Date().getTime()}.xlsx`;
    link.click();

    // 清理
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败，请稍后重试");
  }
};

// 上报状态点击
const handleReportStatusClick = async (row: OdsZyszszjInfo) => {
  const statusMap = {
    "0": { next: "1", text: "上报" },
    "1": { next: "0", text: "取消上报" },
    "2": { next: "1", text: "重新上报" },
  };

  const action = statusMap[row.reportStatus as keyof typeof statusMap];
  if (!action) return;

  try {
    await ElMessageBox.confirm(`确定要${action.text}吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = await updateSingleReportStatus(row.id, action.next);
    const apiResponse = response as unknown as {
      data: { code: number; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      ElMessage.success(`${action.text}成功`);
      getList();
    } else {
      ElMessage.error(apiResponse?.data?.message || `${action.text}失败`);
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error(`${action.text}失败:`, error);
      ElMessage.error(error.message || `${action.text}失败，请稍后重试`);
    }
  }
};

// 启用状态变化
const handleEnableStatusChange = async (
  row: OdsZyszszjInfo & { statusLoading?: boolean },
) => {
  const originalStatus = row.enableStatus === "1" ? "0" : "1";

  try {
    (row as any).statusLoading = true;
    const response = await updateSingleEnableStatus(row.id, row.enableStatus);
    const apiResponse = response as unknown as {
      data: { code: number; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      ElMessage.success("状态修改成功");
    } else {
      // 恢复原状态
      row.enableStatus = originalStatus;
      ElMessage.error(apiResponse?.data?.message || "状态修改失败");
    }
  } catch (error: any) {
    // 恢复原状态
    row.enableStatus = originalStatus;
    console.error("状态修改失败:", error);
    ElMessage.error(error.message || "状态修改失败，请稍后重试");
  } finally {
    (row as any).statusLoading = false;
  }
};

// 表单提交
const handleFormSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return;

    submitLoading.value = true;
    try {
      if (dialogType.value === "add") {
        const response = await addOdsZyszsj(form);
        const apiResponse = response as unknown as {
          data: { code: number; message?: string };
        };
        if (apiResponse?.data?.code === 200) {
          ElMessage.success("新增成功");
          dialogVisible.value = false;
          getList();
        } else {
          ElMessage.error(apiResponse?.data?.message || "新增失败");
        }
      } else {
        const response = await updateOdsZyszsj(form);
        const apiResponse = response as unknown as {
          data: { code: number; message?: string };
        };
        if (apiResponse?.data?.code === 200) {
          ElMessage.success("修改成功");
          dialogVisible.value = false;
          getList();
        } else {
          ElMessage.error(apiResponse?.data?.message || "修改失败");
        }
      }
    } catch (error: any) {
      console.error("提交失败:", error);
      ElMessage.error(error.message || "提交失败，请稍后重试");
    } finally {
      submitLoading.value = false;
    }
  });
};

// 表单关闭
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 详情关闭
const handleDetailClose = () => {
  viewDialogVisible.value = false;
  currentRecord.value = null;
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "", // 新增时可以为空
    xxdm: systemSchoolCode.value || "", // 自动设置学校代码
    zymc: "",
    zyh: "",
    zyssyxbmc: "",
    zyccm: "",
    xzm: "",
    syxwlbm: "",
    sfzdzy: "",
    zdzyjbm: "",
    zdzylxm: "",
    sszyqmc: "",
    sszyqh: "",
    pzszny: "",
    sczsny: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

// 工具方法
const getReportStatusText = (status: string) => {
  const statusMap = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败",
  };
  return statusMap[status as keyof typeof statusMap] || "未知";
};

const getReportStatusTagType = (status: string) => {
  const typeMap = {
    "0": "info",
    "1": "success",
    "2": "danger",
  };
  return typeMap[status as keyof typeof typeMap] || "info";
};

const formatDateTime = (dateTimeStr: string | undefined): string => {
  if (!dateTimeStr) return "-";
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) {
      return dateTimeStr;
    }
    return date.toLocaleString("zh-CN");
  } catch (error) {
    return dateTimeStr;
  }
};

const formatDisplayDateTime = (timeStr: string | undefined): string => {
  if (!timeStr) return "-";
  // 如果是YYYYMMDD HHmmss格式（带空格），需要转换
  if (timeStr.length === 15 && timeStr.includes(" ")) {
    const [datePart, timePart] = timeStr.split(" ");
    if (datePart.length === 8 && timePart.length === 6) {
      const year = datePart.substr(0, 4);
      const month = datePart.substr(4, 2);
      const day = datePart.substr(6, 2);
      const hour = timePart.substr(0, 2);
      const minute = timePart.substr(2, 2);
      const second = timePart.substr(4, 2);
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
  }
  // 兼容旧的YYYYMMDDHHmmss格式（无空格）
  if (timeStr.length === 14) {
    const year = timeStr.substr(0, 4);
    const month = timeStr.substr(4, 2);
    const day = timeStr.substr(6, 2);
    const hour = timeStr.substr(8, 2);
    const minute = timeStr.substr(10, 2);
    const second = timeStr.substr(12, 2);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  return timeStr;
};

// 专业号搜索方法
const handleZyhSearch = async (query: string) => {
  if (zyhSearchTimeout.value) {
    window.clearTimeout(zyhSearchTimeout.value);
  }

  if (!query) {
    zyhOptions.value = [];
    return;
  }

  zyhSearchTimeout.value = window.setTimeout(async () => {
    zyhLoading.value = true;
    try {
      const response = await getZyhOptions(query);
      const apiResponse = response as unknown as {
        data: { code: number; data: any; message?: string };
      };
      if (apiResponse?.data?.code === 200) {
        zyhOptions.value = apiResponse.data.data || [];
      } else {
        ElMessage.warning(
          `获取专业号列表失败: ${apiResponse?.data?.message || "未知错误"}`,
        );
        console.error("获取专业号列表失败:", apiResponse);
      }
    } catch (error: any) {
      console.error("获取专业号列表失败:", error);
      ElMessage.error(`获取专业号列表失败: ${error.message || "未知错误"}`);
      zyhOptions.value = [];
    } finally {
      zyhLoading.value = false;
    }
  }, 300); // 300ms防抖
};

// 分页变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

const handleCurrentChange = (current: number) => {
  queryParams.pageNum = current;
  getList();
};

// 加载字典数据
const loadDictOptions = async () => {
  try {
    const [zyccmRes, xzmRes, syxwlbmRes, sfzdzyRes, zdzyjbmRes, zdzylxmRes] =
      await Promise.all([
        getZyccmOptions(),
        getXzmOptions(),
        getSyxwlbmOptions(),
        getSfzdzyOptions(),
        getZdzyjbmOptions(),
        getZdzylxmOptions(),
      ]);

    const zyccmApiResponse = zyccmRes as unknown as {
      data: { code: number; data: any; message?: string };
    };
    const xzmApiResponse = xzmRes as unknown as {
      data: { code: number; data: any; message?: string };
    };
    const syxwlbmApiResponse = syxwlbmRes as unknown as {
      data: { code: number; data: any; message?: string };
    };
    const sfzdzyApiResponse = sfzdzyRes as unknown as {
      data: { code: number; data: any; message?: string };
    };
    const zdzyjbmApiResponse = zdzyjbmRes as unknown as {
      data: { code: number; data: any; message?: string };
    };
    const zdzylxmApiResponse = zdzylxmRes as unknown as {
      data: { code: number; data: any; message?: string };
    };

    if (zyccmApiResponse?.data?.code === 200)
      zyccmOptions.value = zyccmApiResponse.data.data || [];
    if (xzmApiResponse?.data?.code === 200)
      xzmOptions.value = xzmApiResponse.data.data || [];
    if (syxwlbmApiResponse?.data?.code === 200)
      syxwlbmOptions.value = syxwlbmApiResponse.data.data || [];
    if (sfzdzyApiResponse?.data?.code === 200)
      sfzdzyOptions.value = sfzdzyApiResponse.data.data || [];
    if (zdzyjbmApiResponse?.data?.code === 200)
      zdzyjbmOptions.value = zdzyjbmApiResponse.data.data || [];
    if (zdzylxmApiResponse?.data?.code === 200)
      zdzylxmOptions.value = zdzylxmApiResponse.data.data || [];
  } catch (error: any) {
    console.error("加载字典数据失败:", error);
  }
};

// 页面初始化
onMounted(() => {
  loadSystemSchoolCode();
  getList();
  loadDictOptions();
});

// 获取专业层次文本
const getZyccmText = (value: string | undefined) => {
  const option = zyccmOptions.value.find((item) => item.value === value);
  return option ? option.label : "-";
};

// 获取学制文本
const getXzmText = (value: string | undefined) => {
  const option = xzmOptions.value.find((item) => item.value === value);
  return option ? option.label : "-";
};

// 获取授予学位类别文本
const getSyxwlbmText = (value: string | undefined) => {
  const option = syxwlbmOptions.value.find((item) => item.value === value);
  return option ? option.label : "-";
};

// 获取是否重点专业文本
const getSfzdzyText = (value: string | undefined) => {
  const option = sfzdzyOptions.value.find((item) => item.value === value);
  return option ? option.label : "-";
};

// 获取重点专业级别文本
const getZdzyjbmText = (value: string | undefined) => {
  const option = zdzyjbmOptions.value.find((item) => item.value === value);
  return option ? option.label : "-";
};

// 获取重点专业类型文本
const getZdzylxmText = (value: string | undefined) => {
  const option = zdzylxmOptions.value.find((item) => item.value === value);
  return option ? option.label : "-";
};
</script>

<style lang="scss" scoped>
.ods-zyszsj-management {
  padding: 0px;

  .search-card {
    margin-bottom: 2px;

    :deep(.el-card__body) {
      padding: 8px 15px;
    }

    :deep(.el-form) {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 10px;
    }

    :deep(.el-form-item__label) {
      width: 70px;
      text-align: right;
      padding-right: 4px;
      font-size: 14px;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 160px;
      font-size: 14px;
    }

    :deep(.el-button) {
      font-size: 14px;
    }
  }

  .table-card {
    margin-bottom: 10px;

    :deep(.el-card__body) {
      padding: 10px 15px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .operation-buttons {
        display: flex;
        align-items: center;

        .el-button {
          margin-right: 10px;
        }
      }

      .header-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }

  .table-body {
    margin-bottom: 8px;

    :deep(.el-table) {
      font-size: 14px;
    }

    :deep(.el-table__header th) {
      padding: 4px 0;
      height: 40px;
      background-color: #f5f7fa;
      font-size: 14px;
    }

    :deep(.el-table__row td) {
      padding: 4px 0;
      font-size: 14px;
    }

    .action-buttons {
      display: flex;
      justify-content: center;

      .el-button {
        margin: 0 3px;
        padding: 0 5px;
        font-size: 14px;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    margin-top: 10px;

    .total-info {
      font-size: 14px;
      color: #606266;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
    }

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
    }
  }

  :deep(.el-dialog) {
    .el-dialog__body {
      padding: 10px 15px;
    }
  }

  .dialog-footer {
    padding-top: 10px;
    margin-top: 8px;
    border-top: 1px solid #f0f0f0;
    text-align: right;
  }

  .custom-dialog {
    :deep(.el-dialog__body) {
      padding: 20px;
    }
  }

  .custom-form {
    :deep(.el-form-item__label) {
      width: 140px;
      text-align: right;
      padding-right: 4px;
      font-size: 14px;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 160px;
      font-size: 14px;
    }

    :deep(.el-button) {
      font-size: 14px;
    }
  }

  .form-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;

    .form-section {
      flex: 1;
      min-width: 300px;
      padding: 10px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      background-color: #f9f9f9;

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 10px;
        padding-left: 5px;
        border-left: 3px solid #409eff;
      }

      .el-row {
        margin-bottom: 0;
      }

      .el-form-item {
        margin-bottom: 15px;
      }
    }
  }
}

.custom-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }

  .custom-form {
    .form-container {
      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 15px 0;
        padding-left: 10px;
        border-left: 3px solid var(--el-color-primary);

        &:first-child {
          margin-top: 0;
        }
      }

      .el-row {
        margin-bottom: 0;
      }

      .el-form-item {
        margin-bottom: 18px;
      }

      :deep(.el-form-item__label) {
        font-weight: 500;
      }

      :deep(.el-input__wrapper),
      :deep(.el-select),
      :deep(.el-date-picker) {
        width: 100%;
      }
    }
  }
}

.dialog-footer {
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 15px;
  text-align: right;

  .el-button {
    padding: 8px 20px;
    min-width: 100px;
  }
}
</style>
