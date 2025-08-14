<template>
  <div class="club-activity-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="社团活动名称" prop="sthdmc">
            <el-input
              v-model="queryParams.sthdmc"
              placeholder="请输入社团活动名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="社团名称" prop="stmc">
            <el-input
              v-model="queryParams.stmc"
              placeholder="请输入社团名称"
              clearable
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
        <div class="header-title">举办社团活动数据编码管理</div>
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
            prop="stbh"
            label="社团编号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="stmc"
            label="社团名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hdfbsj"
            label="活动发布时间"
            min-width="140"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="hdkssj"
            label="活动开始时间"
            min-width="140"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="hdjssj"
            label="活动结束时间"
            min-width="140"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="hdlqfsm"
            label="活动录取方式码"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hdzdjsgh"
            label="活动指导教师工号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hdzdjsxm"
            label="活动指导教师姓名"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hdlxm"
            label="活动类型码"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hdjbm"
            label="活动级别码"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zdbmrs"
            label="最大报名人数"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="hdbmrs"
            label="活动报名人数"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="hdcyfsm"
            label="活动参与方式码"
            min-width="120"
            show-overflow-tooltip
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
                :type="getReportStatusType(row.reportStatus)"
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

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 610px"
      class="club-activity-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
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
            <el-form-item label="社团活动编号" prop="sthdbh">
              <el-input
                v-model="form.sthdbh"
                placeholder="请输入社团活动编号"
                maxlength="32"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社团活动名称" prop="sthdmc">
              <el-input
                v-model="form.sthdmc"
                placeholder="请输入社团活动名称"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社团编号" prop="stbh">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select
                v-model="form.stbh"
                placeholder="请选择社团编号"
                :remote-method="getStxhjbsjOptionsData"
                filterable
                remote
                reserve-keyword
                :loading="loading"
                clearable
                @change="handleStbhChange"
                style="width: 100%"
              >
                <el-option
                  v-for="item in stxhjbsjOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-tooltip content="数据来源于社团（协会）数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
            </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社团名称" prop="stmc">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-input
                v-model="form.stmc"
                placeholder="请输入社团名称"
                maxlength="150"
                show-word-limit
              />
              <el-tooltip content="数据来源于社团（协会）数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
            </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动发布时间" prop="hdfbsj">
              <el-date-picker
                v-model="form.hdfbsj"
                type="datetime"
                placeholder="请选择活动发布时间"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动开始时间" prop="hdkssj">
              <el-date-picker
                v-model="form.hdkssj"
                type="datetime"
                placeholder="请选择活动开始时间"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动结束时间" prop="hdjssj">
              <el-date-picker
                v-model="form.hdjssj"
                type="datetime"
                placeholder="请选择活动结束时间"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动录取方式码" prop="hdlqfsm">
              <el-input
                v-model="form.hdlqfsm"
                placeholder="请输入活动录取方式码（2位）"
                maxlength="2"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动指导教师工号" prop="hdzdjsgh">
              <div style="display: flex; align-items: center; gap: 8px"> 
              <el-input
              disabled
                v-model="form.hdzdjsgh"
                placeholder="请输入活动指导教师工号"
                maxlength="150"
                show-word-limit
              />
              <el-tooltip content="数据来源于社团（协会）数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
            </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动指导教师姓名" prop="hdzdjsxm">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-input
              disabled
                v-model="form.hdzdjsxm"
                placeholder="请输入活动指导教师姓名"
                maxlength="36"
                show-word-limit
              />
              <el-tooltip content="数据来源于社团（协会）数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
            </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动类型码" prop="hdlxm" >
              <div style="display: flex; align-items: center; gap: 8px;width: 100%;">
                <el-select
                  v-model="form.hdlxm"
                  placeholder="请选择活动类型"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in hdlxmOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip content="数据来源于数据字典STHDLXDM" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动级别码" prop="hdjbm">
              <div style="display: flex; align-items: center; gap: 8px;width: 100%;">
                <el-select
                  v-model="form.hdjbm"
                  placeholder="请选择活动级别"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in hdjbmOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip content="数据来源于数据字典STHDJBDM" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大报名人数" prop="zdbmrs">
              <el-input-number
                v-model="form.zdbmrs"
                placeholder="请输入最大报名人数"
                :min="0"
                :max="99999"
                style="width: 100%"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动报名人数" prop="hdbmrs">
              <el-input-number
                v-model="form.hdbmrs"
                placeholder="请输入活动报名人数"
                :min="0"
                :max="99999"
                style="width: 100%"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动参与方式码" prop="hdcyfsm">
              <div style="display: flex; align-items: center; gap: 8px;width: 100%;">
                <el-select
                  v-model="form.hdcyfsm"
                  placeholder="请选择活动参与方式"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in hdcyfsmOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip content="数据来源于数据字典STHDCYFSDM" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="格式：YYYYMMDD hhmmss"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报状态" prop="sbcz">
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
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="club-activity-detail">
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
          <el-descriptions-item label="社团活动编号">
            <div class="detail-value">{{ form.sthdbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="社团活动名称">
            <div class="detail-value">{{ form.sthdmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="社团编号">
            <div class="detail-value">{{ form.stbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="社团名称">
            <div class="detail-value">{{ form.stmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动发布时间">
            <div class="detail-value">{{ form.hdfbsj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动开始时间">
            <div class="detail-value">{{ form.hdkssj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动结束时间">
            <div class="detail-value">{{ form.hdjssj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动录取方式码">
            <div class="detail-value">{{ form.hdlqfsm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动指导教师工号">
            <div class="detail-value">{{ form.hdzdjsgh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动指导教师姓名">
            <div class="detail-value">{{ form.hdzdjsxm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动类型码">
            <div class="detail-value">{{ form.hdlxm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动级别码">
            <div class="detail-value">{{ form.hdjbm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="最大报名人数">
            <div class="detail-value">{{ form.zdbmrs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动报名人数">
            <div class="detail-value">{{ form.hdbmrs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="活动参与方式码">
            <div class="detail-value">{{ form.hdcyfsm || "-" }}</div>
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
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
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
import type { FormInstance, FormRules } from "element-plus";
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
 
import {
  getOdsJbsthdsjPage,
  getOdsJbsthdsjById,
  addOdsJbsthdsj,
  updateOdsJbsthdsj,
  type OdsJbsthdsjForm,
  deleteOdsJbsthdsj,
  batchDeleteOdsJbsthdsj,
  getSchoolCode,
  getStxhjbsjOptions,
  exportOdsJbsthdsj,
  updateSingleEnableStatus,
  type OdsStxhjbsjOption,
  type OdsJbsthdsjInfo,
  type OdsJbsthdsjQuery,
  getSthdlxdmOptions,
  getSthdjbdmOptions,
  getSthdcyfsdmOptions,
} from "@/api-code/code/code_base/zygxs/ods_jbsthdsj";

const dialogTitle = ref("");
const dialogMode = ref("");
// 搜索条件
const queryParams = reactive<OdsJbsthdsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  sthdbh: "",
  sthdmc: "",
  stbh: "",
  stmc: "",
  hdfbsjStart: "",
  hdfbsjEnd: "",
  hdkssjStart: "",
  hdkssjEnd: "",
  hdjssjStart: "",
  hdjssjEnd: "",
  hdlqfsm: "",
  hdzdjsgh: "",
  hdzdjsxm: "",
  hdlxm: "",
  hdjbm: "",
  hdcyfsm: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 表格数据
const dataList = ref<OdsJbsthdsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const form = reactive<OdsJbsthdsjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  sthdbh: "",
  sthdmc: "",
  stbh: "",
  stmc: "",
  hdfbsj: "",
  hdkssj: "",
  hdjssj: "",
  hdlqfsm: "",
  hdzdjsgh: "",
  hdzdjsxm: "",
  hdlxm: "",
  hdjbm: "",
  zdbmrs: undefined,
  hdbmrs: undefined,
  hdcyfsm: "",
  sjcjsj: "",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const activeTab = ref("basic");

// 详情对话框
const viewDialogVisible = ref(false);
const currentRecord = ref<OdsJbsthdsjInfo | null>(null);

// 表单验证规则
const formRules = reactive<FormRules>({
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识长度不能超过32个字符", trigger: "blur" }
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10个字符", trigger: "blur" }
  ],
  sthdbh: [
    { required: true, message: "请输入社团活动编号", trigger: "blur" },
    { max: 32, message: "社团活动编号长度不能超过32位", trigger: "blur" },
  ],
  sthdmc: [
    { required: true, message: "请输入社团活动名称", trigger: "blur" },
    { max: 150, message: "社团活动名称长度不能超过150位", trigger: "blur" },
  ],
  stbh: [
    { required: true, message: "请输入社团编号", trigger: "blur" },
    { max: 20, message: "社团编号长度不能超过20位", trigger: "blur" },
  ],
  stmc: [
    { required: true, message: "请输入社团名称", trigger: "blur" },
    { max: 150, message: "社团名称长度不能超过150位", trigger: "blur" },
  ],
  hdfbsj: [
    { required: true, message: "请选择活动发布时间", trigger: "blur" },
  ],
  hdkssj: [
    { required: true, message: "请选择活动开始时间", trigger: "blur" },
  ],
  hdjssj: [
    { required: true, message: "请选择活动结束时间", trigger: "blur" },
  ],
  hdlqfsm: [
    { max: 2, message: "活动录取方式码长度不能超过2位", trigger: "blur" },
  ],
  hdzdjsgh: [
    { required: true, message: "请输入活动指导教师工号", trigger: "blur" },
    { max: 150, message: "活动指导教师工号长度不能超过150位", trigger: "blur" },
  ],
  hdzdjsxm: [
    { required: true, message: "请输入活动指导教师姓名", trigger: "blur" },
    { max: 36, message: "活动指导教师姓名长度不能超过36位", trigger: "blur" },
  ],
  hdlxm: [
    { required: true, message: "请输入活动类型码", trigger: "blur" },
    { max: 2, message: "活动类型码必须为2位", trigger: "blur" },
  ],
  hdjbm: [
    { required: true, message: "请输入活动级别码", trigger: "blur" },
    { max: 2, message: "活动级别码必须为2位", trigger: "blur" },
  ],
  zdbmrs: [
    { required: true, message: "请输入最大报名人数", trigger: "blur" },
    { type: "number" as const, min: 0, max: 99999, message: "最大报名人数必须在0-99999之间", trigger: "blur" },
  ],
  hdbmrs: [
    { required: true, message: "请输入活动报名人数", trigger: "blur" },
    { type: "number" as const, min: 0, max: 99999, message: "活动报名人数必须在0-99999之间", trigger: "blur" },
  ],
  hdcyfsm: [
    { required: true, message: "请输入活动参与方式码", trigger: "blur" },
    { max: 2, message: "活动参与方式码必须为2位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "blur" },
  ],
});

const stxhjbsjOptions = ref<OdsStxhjbsjOption[]>([]);
const getStxhjbsjOptionsData = async (keyword: string) => {
  const response = await getStxhjbsjOptions(keyword) as any;
  if (response.data.code === 200) {
    stxhjbsjOptions.value = response.data.data;
  }
};
const handleStbhChange = (value: string) => {
  form.stbh = value;
  form.stmc = stxhjbsjOptions.value.find(item => item.value === value)?.stmc || "";
  form.hdzdjsgh = stxhjbsjOptions.value.find(item => item.value === value)?.zdjsh || "";
  form.hdzdjsxm = stxhjbsjOptions.value.find(item => item.value === value)?.zdjsxm || "";
};
// 状态文本和类型映射
const getReportStatusText = (status: string): string => {
  switch (status) {
    case "0":
      return "未上报";
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return "未上报";
  }
};

const getReportStatusType = (status: string) => {
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

const getEnableStatusText = (status: string): string => {
  switch (status) {
    case "0":
      return "禁用";
    case "1":
      return "启用";
    default:
      return "启用";
  }
};

const getEnableStatusType = (status: string) => {
  switch (status) {
    case "0":
      return "danger";
    case "1":
      return "success";
    default:
      return "success";
  }
};
const schoolCode = ref("");
// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsJbsthdsjPage(queryParams) as any;
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询举办社团活动数据失败:", error);
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
    xxdm: schoolCode.value,
    sthdbh: "",
    sthdmc: "",
    stbh: "",
    stmc: "",
    hdfbsjStart: "",
    hdfbsjEnd: "",
    hdkssjStart: "",
    hdkssjEnd: "",
    hdjssjStart: "",
    hdjssjEnd: "",
    hdlqfsm: "",
    hdzdjsgh: "",
    hdzdjsxm: "",
    hdlxm: "",
    hdjbm: "",
    hdcyfsm: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogType.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsJbsthdsjInfo) => {
  try {
    const response = await getOdsJbsthdsjById(row.id) as any;
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogType.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取举办社团活动数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsJbsthdsjInfo) => {
  try {
    const response = await getOdsJbsthdsjById(row.id) as any;
    if (response.data.code === 200) {
      currentRecord.value = response.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取举办社团活动数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsJbsthdsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条举办社团活动数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = await deleteOdsJbsthdsj(row.id) as any;
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除举办社团活动数据失败:", error);
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
      `确定要删除选中的 ${selectedIds.value.length} 条数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await batchDeleteOdsJbsthdsj(selectedIds.value) as any;
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除举办社团活动数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsJbsthdsj(queryParams) as any;
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `举办社团活动数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出举办社团活动数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 启用状态改变
const handleEnableStatusChange = async (row: OdsJbsthdsjInfo) => {
  try {
    const response = await updateSingleEnableStatus(row.id, row.enableStatus) as any;
    if (response.data.code === 200) {
      ElMessage.success("状态修改成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "状态修改失败");
      // 恢复原来的状态
      row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    }
  } catch (error) {
    console.error("修改启用状态失败:", error);
    ElMessage.error("状态修改失败");
    // 恢复原来的状态
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
  }
};

// 表格选择改变
const handleSelectionChange = (selection: OdsJbsthdsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (row: OdsJbsthdsjInfo) => {
  // 行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsJbsthdsjInfo) => {
  handleView(row);
};

// 分页相关
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

    if (dialogType.value === "add") {
      const response = await addOdsJbsthdsj(form) as any;
      if (response.data.code === 200) {
        ElMessage.success("新增成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(response.data.msg || "新增失败");
      }
    } else {
      const response = await updateOdsJbsthdsj(form) as any;
      if (response.data.code === 200) {
        ElMessage.success("修改成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(response.data.msg || "修改失败");
      }
    }
  } catch (error) {
    console.error("表单提交失败:", error);
    ElMessage.error("操作失败");
  } finally {
    submitLoading.value = false;
  }
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
    zjsjwyxbs: "",
    xxdm: schoolCode.value,
    sthdbh: "",
    sthdmc: "",
    stbh: "",
    stmc: "",
    hdfbsj: "",
    hdkssj: "",
    hdjssj: "",
    hdlqfsm: "",
    hdzdjsgh: "",
    hdzdjsxm: "",
    hdlxm: "",
    hdjbm: "",
    zdbmrs: undefined,
    hdbmrs: undefined,
    hdcyfsm: "",
    sjcjsj: "",
    enableStatus: "1",
    reportStatus: "0",
  });
  formRef.value?.clearValidate();
};
const getSchoolCodeData = async () => {
  const response = await getSchoolCode() as any;
  if (response.data.code === 200) {
    form.xxdm = response.data.data;
    schoolCode.value = response.data.data;
  }
};

// 数据字典选项
const hdlxmOptions = ref<{ label: string; value: string }[]>([]);
const hdjbmOptions = ref<{ label: string; value: string }[]>([]);
const hdcyfsmOptions = ref<{ label: string; value: string }[]>([]);

// 获取数据字典选项
const loadDictionaryOptions = async () => {
  try {
    const [hdlxmRes, hdjbmRes, hdcyfsmRes] = await Promise.all([
      getSthdlxdmOptions(),
      getSthdjbdmOptions(),
      getSthdcyfsdmOptions()
    ]);

    hdlxmOptions.value = (hdlxmRes as any)?.data?.data || [];
    hdjbmOptions.value = (hdjbmRes as any)?.data?.data || [];
    hdcyfsmOptions.value = (hdcyfsmRes as any)?.data?.data || [];
  } catch (error) {
    console.error("加载数据字典选项失败:", error);
    ElMessage.error("加载数据字典选项失败");
  }
};

// 页面加载
onMounted(() => {
  getSchoolCodeData();
  getList();
  loadDictionaryOptions();
});
</script>

<style scoped lang="scss">
.app-container {
  padding: 0px;
}

.search-card {
  margin-bottom: 20px;
}

.search-bar {
  padding: 0;
}

.table-card {
  margin-top: -10px;
  min-height: calc(100vh - 200px);
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
  gap: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 2px;
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

.club-activity-dialog {
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

.club-activity-detail {
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

/* 统一表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 8px !important;
}

:deep(.el-row) {
  margin-bottom: 0 !important;

  .el-form-item {
    margin-bottom: 20px !important;
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

/* 表格样式 */
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

/* 卡片样式 */
:deep(.el-card) {
  .el-card__body {
    padding: 20px;
  }
}
</style>
