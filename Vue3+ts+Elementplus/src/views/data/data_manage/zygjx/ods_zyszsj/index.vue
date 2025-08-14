<template>
  <div class="system-building-management">
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
          <el-form-item label="采集时间范围" prop="sjcjsjRange">
            <el-date-picker
              v-model="sjcjsjRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYYMMDD HHmmss"
              @change="handleSjcjsjRangeChange"
            />
          </el-form-item>
          <el-form-item label="上报状态" prop="reportStatus">
            <el-select
              v-model="queryParams.reportStatus"
              placeholder="请选择上报状态"
              clearable
            >
              <el-option label="未上报" value="0" />
              <el-option label="已上报" value="1" />
              <el-option label="上报失败" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item class="search-buttons">
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
            :disabled="!selectedIds.length"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
        </div>
        <div class="header-title">
          <h3>专业设置数据表数据清洗</h3>
        </div>
        <div class="right-buttons">
          <el-tooltip content="刷新数据" placement="top">
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
          stripe
          size="default"
          :row-style="{ height: '32px' }"
          :cell-style="{ padding: '12px 6px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
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
                :type="getReportStatusType(row.reportStatus) as 'success' | 'primary' | 'warning' | 'info' | 'danger'"
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
              <el-tag
                :type="getEnableStatusType(row.enableStatus) as 'success' | 'primary' | 'warning' | 'info' | 'danger'"
              >
                {{ getEnableStatusText(row.enableStatus) }}
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
            <el-col :span="12" style="margin-bottom: 16px;">
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
              <el-form-item label="专业名称" prop="zymc">
                <el-input
                  v-model="form.zymc"
                  placeholder="请输入专业名称"
                  maxlength="60"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 16px;">
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
            <el-col :span="12" style="margin-bottom: 16px;">
              <el-form-item label="专业所属院系部名称" prop="zyssyxbmc">
                <el-input
                  v-model="form.zyssyxbmc"
                  placeholder="请输入专业所属院系部名称"
                  maxlength="60"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 16px;">
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
            <el-col :span="12" style="margin-bottom: 16px;">
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
            <el-col :span="12" style="margin-bottom: 16px;">
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
            <el-col :span="12" style="margin-bottom: 16px;">
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
            <el-col :span="12" style="margin-bottom: 16px;">
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
            <el-col :span="12" style="margin-bottom: 16px;">
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
          </el-row>

          <div class="section-title">其他信息</div>
          <el-row :gutter="20">
            <el-col :span="12" style="margin-bottom: 16px;">
              <el-form-item label="所属专业群名称" prop="sszyqmc">
                <el-input
                  v-model="form.sszyqmc"
                  placeholder="请输入所属专业群名称"
                  maxlength="60"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 16px;">
              <el-form-item label="所属专业群号" prop="sszyqh">
                <el-input
                  v-model="form.sszyqh"
                  placeholder="请输入所属专业群号"
                  maxlength="20"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 16px;">
              <el-form-item label="批准设置年月" prop="pzszny">
                <el-input
                  v-model="form.pzszny"
                  placeholder="请输入批准设置年月(YYYYMM)"
                  maxlength="6"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 16px;">
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
            <el-col :span="12" style="margin-bottom: 16px;">
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
} from "@/api-data/data/data_base/zygjx/ods_zyszsj";
import { getSystemSchoolCode } from "@/api-data/data/data_base/zygxx/ods_xxhxtjssj";

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

// 采集时间范围
const sjcjsjRange = ref<[string, string] | undefined>(undefined);

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

// 处理采集时间范围变化
const handleSjcjsjRangeChange = (value: [string, string] | undefined) => {
  if (value && value.length === 2) {
    queryParams.sjcjsjStart = value[0];
    queryParams.sjcjsjEnd = value[1];
  } else {
    queryParams.sjcjsjStart = "";
    queryParams.sjcjsjEnd = "";
  }
};

// 重置查询
const resetQuery = () => {
  Object.assign(queryParams, {
    zjsjwyxbs: "",
    xxdm: "",
    zymc: "",
    zyh: "",
    zyccm: "",
    reportStatus: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  sjcjsjRange.value = undefined; // 重置采集时间范围
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

const getReportStatusType = (status: string) => {
  const typeMap = {
    "0": "info",
    "1": "success",
    "2": "danger",
  };
  return typeMap[status as keyof typeof typeMap] || "info";
};

const getEnableStatusType = (status: string) => {
  const typeMap = {
    "0": "danger",
    "1": "success",
  };
  return typeMap[status as keyof typeof typeMap] || "info";
};

const getEnableStatusText = (status: string) => {
  const textMap = {
    "0": "禁用",
    "1": "启用",
  };
  return textMap[status as keyof typeof textMap] || "未知";
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

<style scoped lang="scss">
.system-building-management {
  padding: 0px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  height: calc(100vh - 130px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .search-card {
    margin-bottom: 12px;
    border-radius: 12px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    flex-shrink: 0;

    :deep(.el-card__body) {
      padding: 8px 12px;
    }

    :deep(.el-form) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      justify-content: flex-start;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 0;
      flex: 0 0 auto;
    }

    :deep(.el-form-item__label) {
      width: 120px;
      text-align: right;
      padding-right: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;
      white-space: nowrap;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 200px;
      font-size: 14px;
      border-radius: 8px;
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
      }
      
      &.is-focus {
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }

    :deep(.el-date-editor) {
      width: 320px !important;
    }

    :deep(.search-buttons) {
      display: flex;
      gap: 12px;
      margin-left: auto;
      flex-shrink: 0;
    }

    :deep(.el-button) {
      font-size: 14px;
      border-radius: 8px;
      padding: 8px 20px;
      font-weight: 500;
      transition: all 0.3s ease;
      white-space: nowrap;
      
      &.el-button--primary {
        background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        }
      }
      
      &:not(.el-button--primary) {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: 1px solid #e4e7ed;
        
        &:hover {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
          border-color: #c0c4cc;
          transform: translateY(-1px);
        }
      }
    }

    :deep(.el-form-item:last-child) {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .table-card {
    margin-bottom: 0;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0; // 重要：允许flex子元素收缩

    :deep(.el-card__body) {
      padding: 8px 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0; // 重要：允许flex子元素收缩
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      position: relative;
      padding: 6px 0;
      border-bottom: 2px solid #f0f2f5;
      flex-shrink: 0;

      .header-title {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        
        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }
    }
  }

  .table-body {
    margin-bottom: 0;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0; // 重要：允许flex子元素收缩
    height: calc(100% - 50px); // 为分页组件预留空间

    :deep(.el-table) {
      font-size: 14px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      flex: 1;
      height: calc(100% - 60px) !important; // 为分页组件预留空间
    }

    :deep(.el-table__header th) {
      padding: 4px 4px;
      height: 32px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      font-size: 12px;
      font-weight: 600;
      color: #2c3e50;
      border-bottom: 2px solid #e4e7ed;
    }

    :deep(.el-table__row td) {
      padding: 2px 4px;
      font-size: 12px;
      border-bottom: 1px solid #f0f2f5;
      transition: background-color 0.2s ease;
    }

    :deep(.el-table__row:hover td) {
      background-color: #f8f9fa;
    }

    :deep(.el-table__row:nth-child(even)) {
      background-color: #fafbfc;
    }

    :deep(.el-table__fixed),
    :deep(.el-table__fixed-right) {
      box-shadow: none;
      z-index: 10;
      background: #fff;
    }

    :deep(.el-table__fixed-right::before),
    :deep(.el-table__fixed::before) {
      display: none;
    }

    :deep(.el-table__fixed-body-wrapper),
    :deep(.el-table__fixed-right-body-wrapper) {
      overflow: hidden;
    }

    :deep(.el-table__body-wrapper) {
      overflow-x: auto;
      overflow-y: auto;
      flex: 1;
    }

    :deep(.el-table__fixed-header-wrapper),
    :deep(.el-table__fixed-body-wrapper),
    :deep(.el-table__fixed-right-header-wrapper),
    :deep(.el-table__fixed-right-body-wrapper) {
      background: #fff;
      z-index: 10;
    }

    :deep(.el-table__fixed-header-wrapper .el-table__header),
    :deep(.el-table__fixed-body-wrapper .el-table__body),
    :deep(.el-table__fixed-right-header-wrapper .el-table__header),
    :deep(.el-table__fixed-right-body-wrapper .el-table__body) {
      width: 100% !important;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    margin-top: 0;
    flex-shrink: 0;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-top: 1px solid #e4e7ed;
    border-radius: 0 0 12px 12px;

    .total-info {
      color: #606266;
      font-weight: 500;
      padding: 8px 12px;
      border-radius: 20px;
      border: 1px solid #e4e7ed;

      backdrop-filter: blur(10px);
    }

    :deep(.el-pagination) {
      font-size: 12px;
      background: rgba(255, 255, 255, 0.8);
      padding: 4px 8px;
      border-radius: 20px;
      border: 1px solid #e4e7ed;
      backdrop-filter: blur(10px);

      .btn-prev,
      .btn-next,
      .el-pager li {
        min-width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 6px;
        margin: 0 2px;
        transition: all 0.3s ease;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: 1px solid #e4e7ed;

        &:hover {
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          color: white;
          border-color: #409eff;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        }

        &.active {
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          color: white;
          border-color: #409eff;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        }
      }

      .el-pagination__total {
        color: #606266;
        font-weight: 500;
      }

      .el-pagination__jump {
        color: #606266;
        font-weight: 500;
      }
    }
  }

  .operation-buttons {
    display: flex;
    align-items: center;
    gap: 12px;

    .el-button {
      margin-right: 0;
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 500;
      transition: all 0.3s ease;
      white-space: nowrap;
      
      &.el-button--primary {
        background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        }
      }
      
      &.el-button--danger {
        background: linear-gradient(135deg, #f56c6c 0%, #e74c3c 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
        }
      }
      
      &.el-button--success {
        background: linear-gradient(135deg, #67c23a 0%, #5cb85c 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
        }
      }
    }
  }

  .header-title {
    font-size: 20px;
    font-weight: 700;
    color: #2c3e50;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
  }

  .right-buttons {
    display: flex;
    align-items: center;
    gap: 12px;

    .el-button {
      margin: 0;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      padding: 0;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px) rotate(180deg);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;

    .el-button {
      margin: 0;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 6px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .system-building-dialog {
    :deep(.el-dialog) {
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      overflow: hidden;
    }

    :deep(.el-dialog__header) {
      background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
      color: white;
      padding: 20px 24px;
      
      .el-dialog__title {
        color: white;
        font-weight: 600;
      }
      
      .el-dialog__headerbtn .el-dialog__close {
        color: white;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    :deep(.el-dialog__body) {
      padding: 24px;
      max-height: 65vh;
      overflow-y: auto;
      overflow-x: hidden;
      background: #fafbfc;
    }

    :deep(.el-dialog__footer) {
      padding: 20px 24px;
      border-top: 1px solid #e4e7ed;
      background: white;
      
      .el-button {
        border-radius: 8px;
        padding: 8px 20px;
        font-weight: 500;
        transition: all 0.3s ease;
        
        &.el-button--primary {
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          border: none;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
          }
        }
      }
    }
  }

  .detail-dialog {
    :deep(.el-dialog) {
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      overflow: hidden;
    }

    :deep(.el-dialog__header) {
      background: linear-gradient(135deg, #67c23a 0%, #5cb85c 100%);
      color: white;
      padding: 20px 24px;
      
      .el-dialog__title {
        color: white;
        font-weight: 600;
      }
      
      .el-dialog__headerbtn .el-dialog__close {
        color: white;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    :deep(.el-dialog__body) {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
      overflow-x: hidden;
      background: #fafbfc;
    }
  }
}

/* 弹窗表单错误提示样式 */
:deep(.dialog-form) {
  .el-form-item {
    position: relative;
    margin-bottom: 16px;

    .el-form-item__error {
      position: absolute;
      top: 50%;
      left: calc(100% + 8px);
      transform: translateY(-50%);
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 4px 8px;
      margin: 0;
      line-height: 1.2;
      font-size: 11px;
      z-index: 1000;
      background: #fef0f0;
      border: 1px solid #fbc4c4;
      border-radius: 4px;
      color: #f56c6c;

      &:before {
        content: "!";
        display: inline-block;
        width: 14px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        border-radius: 50%;
        background-color: #f56c6c;
        color: white;
        font-size: 10px;
        margin-right: 4px;
        font-weight: bold;
      }
    }
  }

  .el-col:not(:last-child) {
    padding-right: 20px;
  }
}

/* 表单样式 */
.system-building-form {
  .form-container {
    max-height: 460px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 10px;
    padding-bottom: 5px;
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    font-size: 14px;
    color: #2c3e50;
    font-weight: 600;
    line-height: 32px;
  }

  :deep(.el-input__wrapper) {
    font-size: 14px;
    height: 32px;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
    }
    
    &.is-focus {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }

  :deep(.el-select) {
    font-size: 14px;

    .el-input__wrapper {
      height: 32px;
      border-radius: 6px;
    }
  }

  :deep(.el-textarea__inner) {
    font-size: 14px;
    border-radius: 6px;
    line-height: 1.4;
    padding: 8px 12px;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
    }
    
    &:focus {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }

  :deep(.el-date-editor) {
    font-size: 14px;

    .el-input__wrapper {
      height: 32px;
      border-radius: 6px;
    }
  }

  :deep(.el-row) {
    margin-bottom: 0;
  }
}

/* 详情样式 */
.system-building-detail {
  .detail-descriptions {
    :deep(.el-descriptions__label) {
      font-weight: 700;
      color: #2c3e50;
      width: 160px;
      font-size: 14px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    :deep(.el-descriptions__content) {
      color: #606266;
      font-size: 14px;
      padding: 12px 16px;
    }
  }

  .detail-value {
    color: #2c3e50;
    font-size: 14px;
    font-weight: 500;
  }

  .detail-link {
    font-size: 14px;
    word-break: break-all;
    color: #409eff;
    text-decoration: none;
    
    &:hover {
      color: #36a3f7;
      text-decoration: underline;
    }
  }

  .detail-description {
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e4e7ed;
  }
}

/* 导入提示图标样式 */
:deep(.import-tip-icon) {
  margin-left: 5px;
  color: #e6a23c;
  cursor: pointer;
  font-size: 14px;
  vertical-align: middle;
  transition: all 0.3s ease;
  
  &:hover {
    color: #f39c12;
    transform: scale(1.1);
  }
}

/* 上传成功提示样式 */
:deep(.el-upload__tip) {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 导入按钮白色背景样式 */
.import-button {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
  border: 1px solid #dcdfe6 !important;
  color: #606266 !important;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%) !important;
    border-color: #c0c4cc !important;
    color: #409eff !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
    border-color: #409eff !important;
    color: #409eff !important;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }

  &:active {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%) !important;
    border-color: #409eff !important;
    color: #409eff !important;
  }
}

/* 标签样式美化 */
:deep(.el-tag) {
  border-radius: 6px;
  font-weight: 500;
  padding: 4px 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}

/* 链接样式美化 */
:deep(.el-link) {
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    text-shadow: 0 1px 2px rgba(64, 158, 255, 0.3);
  }
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .system-building-management {
    padding: 12px;
    
    .search-card {
      margin-bottom: 10px;
      
      :deep(.el-form) {
        flex-wrap: wrap;
        gap: 10px;
      }
      
      :deep(.el-input__wrapper),
      :deep(.el-select) {
        width: 180px;
      }
      
      :deep(.el-date-editor) {
        width: 280px !important;
      }
    }
    
    .table-card {
      :deep(.el-card__body) {
        padding: 12px 16px;
      }
      
      .table-header {
        margin-bottom: 12px;
        padding: 10px 0;
      }
    }
    
    .pagination-wrapper {
      padding: 12px 16px;
    }
  }
}

@media (max-width: 1200px) {
  .system-building-management {
    padding: 8px;
    
    .search-card {
      margin-bottom: 8px;
      
      :deep(.el-card__body) {
        padding: 12px 16px;
      }
      
      :deep(.el-form) {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }
      
      :deep(.el-input__wrapper),
      :deep(.el-select),
      :deep(.el-date-editor) {
        width: 100% !important;
      }
      
      :deep(.el-form-item) {
        margin-bottom: 8px;
      }
      
      :deep(.search-buttons) {
        margin-left: 0;
        justify-content: center;
      }
    }
    
    .table-card {
      :deep(.el-card__body) {
        padding: 8px 12px;
      }
      
      .table-header {
        flex-direction: column;
        gap: 12px;
        margin-bottom: 10px;
        padding: 8px 0;
        
        .header-title {
          position: static;
          transform: none;
          text-align: center;
        }
      }
    }
    
    .pagination-wrapper {
      padding: 8px 12px;
      flex-direction: column;
      gap: 8px;
      
      .total-info {
        text-align: center;
      }
    }
  }
}

@media (max-width: 768px) {
  .system-building-management {
    padding: 4px;
    
    .search-card {
      margin-bottom: 6px;
      
      :deep(.el-card__body) {
        padding: 8px 12px;
      }
      
      :deep(.el-form-item__label) {
        width: 100px;
        font-size: 13px;
      }
      
      :deep(.el-button) {
        padding: 6px 16px;
        font-size: 13px;
      }
    }
    
    .table-card {
      :deep(.el-card__body) {
        padding: 6px 8px;
      }
      
      .table-header {
        margin-bottom: 8px;
        padding: 6px 0;
        
        .operation-buttons {
          gap: 8px;
          
          .el-button {
            padding: 6px 12px;
            font-size: 13px;
          }
        }
        
        .header-title {
          font-size: 16px;
        }
      }
    }
    
    .table-body {
      :deep(.el-table__header th) {
        padding: 6px 6px;
        height: 36px;
        font-size: 13px;
      }
      
      :deep(.el-table__row td) {
        padding: 4px 6px;
        font-size: 13px;
      }
    }
    
    .pagination-wrapper {
      padding: 6px 8px;
      
      .total-info {
        font-size: 13px;
        padding: 6px 10px;
      }
      
      :deep(.el-pagination) {
        font-size: 13px;
        padding: 6px 12px;
        
        .btn-prev,
        .btn-next,
        .el-pager li {
          min-width: 28px;
          height: 28px;
          line-height: 28px;
        }
      }
    }
  }
}
</style>
