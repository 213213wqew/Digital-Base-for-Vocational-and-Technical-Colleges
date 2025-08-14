<template>
  <div class="professional-development-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="项目编号" prop="sxxmbh">
            <el-input
              v-model="queryParams.sxxmbh"
              placeholder="请输入实训项目编号"
              clearable
            />
          </el-form-item>
          <el-form-item label="项目名称" prop="sxxmmc">
            <el-input
              v-model="queryParams.sxxmmc"
              placeholder="请输入实训项目名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="归口专业" prop="gkzymc">
            <el-input
              v-model="queryParams.gkzymc"
              placeholder="请输入归口专业名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="学年" prop="xn">
            <el-select
              v-model="queryParams.xn"
              placeholder="请选择学年"
              clearable
              style="width: 120px"
            >
              <el-option
                v-for="item in xnOptions"
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
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">实训项目数据数据清洗</div>
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
            width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sxxmbh"
            label="项目编号"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sxxmmc"
            label="项目名称"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="gkzymc"
            label="归口专业"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sfxnfzsxxmText"
            label="虚拟仿真"
            width="100"
            align="center"
          />
          <el-table-column
            prop="mksl"
            label="模块数量"
            width="100"
            align="center"
          />
          <el-table-column
            prop="xssxkss"
            label="实训课时"
            width="100"
            align="center"
          />
          <el-table-column
            prop="xqText"
            label="学期"
            width="100"
            align="center"
          />
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
                :type="getReportStatusTagType(row.reportStatus)"
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

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      class="professional-dialog"
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
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训项目编号" prop="sxxmbh">
              <el-input
                v-model="form.sxxmbh"
                placeholder="请输入实训项目编号"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训项目名称" prop="sxxmmc">
              <el-input
                v-model="form.sxxmmc"
                placeholder="请输入实训项目名称"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否虚拟仿真实训项目" prop="sfxnfzsxxm">
              <el-select
                v-model="form.sfxnfzsxxm"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in sfbzdmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归口专业号" prop="gkzyh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.gkzyh"
                  placeholder="请选择归口专业"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="handleZySearch"
                  :loading="zyLoading"
                  style="flex: 1"
                  @change="handleZyChange"
                >
                  <el-option
                    v-for="item in zyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：专业设置数据子类表(ODS_ZYSZSJ)"
                  placement="top"
                >
                  <el-icon color="#E6A23C" style="cursor: help">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归口专业名称" prop="gkzymc">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.gkzymc"
                  placeholder="请选择归口专业名称"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="handleZymcSearch"
                  :loading="zyLoading"
                  style="flex: 1"
                  @change="handleZymcChange"
                >
                  <el-option
                    v-for="item in zyOptions"
                    :key="item.zymc"
                    :label="item.zymc"
                    :value="item.zymc"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：专业设置数据子类表(ODS_ZYSZSJ)"
                  placement="top"
                >
                  <el-icon color="#E6A23C" style="cursor: help">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属计划课程号" prop="ssjhkch">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.ssjhkch"
                  placeholder="请选择所属计划课程号"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="handleJhkchSearch"
                  :loading="jhkchLoading"
                  style="flex: 1"
                  @change="handleJhkchChange"
                >
                  <el-option
                    v-for="item in jhkchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：排课数据子类表(ODS_PKSJ)"
                  placement="top"
                >
                  <el-icon color="#E6A23C" style="cursor: help">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模块数量" prop="mksl">
              <el-input-number
                v-model="form.mksl"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生实训课时数" prop="xssxkss">
              <el-input-number
                v-model="form.xssxkss"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否对外服务" prop="sfdwfw">
              <el-select
                v-model="form.sfdwfw"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in sfbzdmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学年（度）" prop="xn">
              <el-select
                v-model="form.xn"
                placeholder="请选择学年"
                style="width: 100%"
              >
                <el-option
                  v-for="item in xnOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学期码" prop="xq">
              <el-select
                v-model="form.xq"
                placeholder="请选择学期"
                style="width: 100%"
              >
                <el-option
                  v-for="item in xqdmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他实训地点" prop="qtsxdd">
              <el-input
                v-model="form.qtsxdd"
                placeholder="请输入其他实训地点"
                maxlength="180"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="校内实训室号" prop="xnsxsh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.xnsxsh"
                  placeholder="请选择校内实训室号"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="handleSxshSearch"
                  :loading="sxshLoading"
                  style="flex: 1"
                  @change="handleSxshChange"
                  clearable
                >
                  <el-option
                    v-for="item in sxshOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：实训室基本数据子类表(ODS_SXSJBSJ)"
                  placement="top"
                >
                  <el-icon color="#E6A23C" style="cursor: help">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
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
          <el-col :span="24">
            <el-form-item label="配套实训资源名称" prop="ptsxzymc">
              <el-input
                v-model="form.ptsxzymc"
                type="textarea"
                :rows="2"
                placeholder="请输入配套实训资源名称"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="典型任务名称" prop="dxrwmc">
              <el-input
                v-model="form.dxrwmc"
                type="textarea"
                :rows="2"
                placeholder="请输入典型任务名称"
                maxlength="128"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="技能要求" prop="jnyq">
              <el-input
                v-model="form.jnyq"
                type="textarea"
                :rows="2"
                placeholder="请输入技能要求"
                maxlength="999"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="考核方式" prop="khfs">
              <el-input
                v-model="form.khfs"
                placeholder="请输入考核方式"
                maxlength="180"
                show-word-limit
              />
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
          <el-descriptions-item label="主键数据唯一性标识">
            <div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ form.xxdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实训项目编号">
            <div class="detail-value">{{ form.sxxmbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实训项目名称">
            <div class="detail-value">{{ form.sxxmmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="是否虚拟仿真实训项目">
            <div class="detail-value">
              {{ form.sfxnfzsxxm === "1" ? "是" : "否" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="归口专业号">
            <div class="detail-value">{{ form.gkzyh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="归口专业名称">
            <div class="detail-value">{{ form.gkzymc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="所属计划课程号">
            <div class="detail-value">{{ form.ssjhkch || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="模块数量">
            <div class="detail-value">{{ form.mksl || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学生实训课时数">
            <div class="detail-value">{{ form.xssxkss || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="是否对外服务">
            <div class="detail-value">
              {{ form.sfdwfw === "1" ? "是" : "否" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="学年（度）">
            <div class="detail-value">{{ form.xn || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学期码">
            <div class="detail-value">{{ form.xq || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="其他实训地点">
            <div class="detail-value">{{ form.qtsxdd || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="校内实训室号">
            <div class="detail-value">{{ form.xnsxsh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjcjsj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusTagType(form.reportStatus)"
              size="small"
            >
              {{ getReportStatusText(form.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="form.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="配套实训资源名称" :span="2">
            <div class="detail-value">{{ form.ptsxzymc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="典型任务名称" :span="2">
            <div class="detail-value">{{ form.dxrwmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="技能要求" :span="2">
            <div class="detail-value">{{ form.jnyq || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="考核方式" :span="2">
            <div class="detail-value">{{ form.khfs || "-" }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            @click="handleSubmit"
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

// Element Plus组件和图标
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
  getOdsSxxmsjPage,
  getOdsSxxmsjById,
  addOdsSxxmsj,
  updateOdsSxxmsj,
  deleteOdsSxxmsj,
  batchDeleteOdsSxxmsj,
  exportOdsSxxmsj,
  updateSingleReportStatus,
  updateSingleEnableStatus,
  getSystemSchoolCode,
  getSfbzdmOptions,
  getXqdmOptions,
  getZyOptions,
  getJhkchOptions,
  getSxshOptions,
  type OdsSxxmsjInfo,
  type OdsSxxmsjQuery,
  type OdsSxxmsjForm,
  type DictOption,
  type ZyOption,
  type JhkchOption,
} from "@/api-data/data/data_base/zygjx/ods_sxxmsj";

// 表格数据
const loading = ref(false);
const dataList = ref<OdsSxxmsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);

// 查询表单
const queryForm = ref<FormInstance>();
const queryParams = reactive<OdsSxxmsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  sxxmbh: "",
  sxxmmc: "",
  sfxnfzsxxm: "",
  gkzyh: "",
  gkzymc: "",
  ssjhkch: "",
  xn: "",
  xq: "",
  xnsxsh: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

const form = reactive<OdsSxxmsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  sxxmbh: "",
  sxxmmc: "",
  sfxnfzsxxm: "",
  gkzyh: "",
  gkzymc: "",
  ssjhkch: "",
  ptsxzymc: "",
  dxrwmc: "",
  jnyq: "",
  khfs: "",
  mksl: undefined,
  xssxkss: undefined,
  sfdwfw: "",
  xn: "",
  xq: "",
  qtsxdd: "",
  xnsxsh: "",
  sjcjsj: "",
  reportStatus: "",
  enableStatus: "",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    {
      required: false,
      message: "主键数据唯一性标识可选填，不填将自动生成",
      trigger: "blur",
    },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (!value || value.trim() === "") {
          callback();
          return;
        }
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
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
    {
      pattern: /^\d{10}$/,
      message: "学校代码必须为10位数字码",
      trigger: "blur",
    },
  ],
  sxxmbh: [
    { required: true, message: "请输入实训项目编号", trigger: "blur" },
    { max: 60, message: "实训项目编号长度不能超过60位", trigger: "blur" },
  ],
  sxxmmc: [
    { required: true, message: "请输入实训项目名称", trigger: "blur" },
    { max: 150, message: "实训项目名称长度不能超过150位", trigger: "blur" },
  ],
  sfxnfzsxxm: [
    {
      required: true,
      message: "请选择是否虚拟仿真实训项目",
      trigger: "change",
    },
  ],
  gkzyh: [
    { required: true, message: "请输入归口专业号", trigger: "blur" },
    { max: 64, message: "归口专业号长度不能超过64位", trigger: "blur" },
  ],
  gkzymc: [
    { required: true, message: "请输入归口专业名称", trigger: "blur" },
    { max: 60, message: "归口专业名称长度不能超过60位", trigger: "blur" },
  ],
  ssjhkch: [
    { max: 50, message: "所属计划课程号长度不能超过50位", trigger: "blur" },
  ],
  ptsxzymc: [
    { max: 500, message: "配套实训资源名称长度不能超过500位", trigger: "blur" },
  ],
  dxrwmc: [
    { max: 128, message: "典型任务名称长度不能超过128位", trigger: "blur" },
  ],
  jnyq: [{ max: 999, message: "技能要求长度不能超过999位", trigger: "blur" }],
  khfs: [{ max: 180, message: "考核方式长度不能超过180位", trigger: "blur" }],
  mksl: [
    {
      validator: (rule: any, value: any) => {
        if (
          value !== undefined &&
          value !== null &&
          (value < 0 || value > 99999)
        ) {
          return new Error("模块数量必须在0-99999之间");
        }
        return true;
      },
      trigger: "change",
    },
  ],
  xssxkss: [
    { required: true, message: "请输入学生实训课时数", trigger: "change" },
    {
      validator: (rule: any, value: any) => {
        if (
          value !== undefined &&
          value !== null &&
          (value < 0 || value > 99999)
        ) {
          return new Error("学生实训课时数必须在0-99999之间");
        }
        return true;
      },
      trigger: "change",
    },
  ],
  xn: [
    { required: true, message: "请选择学年", trigger: "change" },
    {
      pattern: /^\d{4}-\d{4}$/,
      message: "学年格式：YYYY-YYYY，如：2023-2024",
      trigger: "blur",
    },
  ],
  xq: [{ required: true, message: "请选择学期", trigger: "change" }],
  qtsxdd: [
    { max: 180, message: "其他实训地点长度不能超过180位", trigger: "blur" },
  ],
  xnsxsh: [
    { max: 64, message: "校内实训室号长度不能超过64位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 详情查看
const viewDialogVisible = ref(false);
const currentRecord = ref<OdsSxxmsjInfo | null>(null);

// 下拉选项
// 自动生成学年选项
const generateXnOptions = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JavaScript月份从0开始

  // 如果当前是9月或之后，则当前学年为当前年份到下一年份
  // 如果当前是8月或之前，则当前学年为上一年份到当前年份
  let startYear = currentMonth >= 9 ? currentYear : currentYear - 1;

  const options = [];
  // 生成当前学年及未来4年的学年选项
  for (let i = 0; i < 5; i++) {
    const year1 = startYear + i;
    const year2 = year1 + 1;
    const label = `${year1}-${year2}`;
    options.push({ label, value: label });
  }

  return options;
};

const xnOptions = ref(generateXnOptions());

// 字典数据选项
const sfbzdmOptions = ref<DictOption[]>([]); // 是否标志代码选项
const xqdmOptions = ref<DictOption[]>([]); // 学期代码选项
const zyOptions = ref<ZyOption[]>([]); // 专业下拉选项
const zyLoading = ref(false); // 专业选项加载状态
const jhkchOptions = ref<JhkchOption[]>([]); // 计划课程号下拉选项
const jhkchLoading = ref(false); // 计划课程号选项加载状态
const sxshOptions = ref<Array<{ value: string; label: string; sxsmc: string }>>(
  [],
); // 实训室号下拉选项
const sxshLoading = ref(false); // 实训室号选项加载状态

// 计算属性
const dialogTitle = computed(() => {
  const titleMap = {
    add: "新增实训项目数据",
    edit: "编辑实训项目数据",
    view: "查看实训项目数据",
  };
  return titleMap[dialogMode.value];
});

// 初始化
onMounted(() => {
  getList();
  loadSystemSchoolCode();
  loadDictOptions();
  loadSxshOptions();
});

// 获取系统学校代码
const loadSystemSchoolCode = async () => {
  try {
    const response = (await getSystemSchoolCode()) as any;
    if (response.data.code === 200) {
      // 将学校代码设置为默认值
      form.xxdm = response.data.data;
    }
  } catch (error) {
    console.error("获取学校代码失败：", error);
  }
};

// 加载字典数据
const loadDictOptions = async () => {
  try {
    // 获取是否标志代码字典 (用于SFXNFZSXXM和SFDWFW)
    const sfbzdmResponse = (await getSfbzdmOptions()) as any;
    if (sfbzdmResponse.data.code === 200) {
      sfbzdmOptions.value = sfbzdmResponse.data.data || [];
    }

    // 获取学期代码字典 (用于XQ)
    const xqdmResponse = (await getXqdmOptions()) as any;
    if (xqdmResponse.data.code === 200) {
      xqdmOptions.value = xqdmResponse.data.data || [];
    }

    // 获取专业下拉选项
    await loadZyOptions();

    // 获取计划课程号下拉选项
    await loadJhkchOptions();
  } catch (error) {
    console.error("获取字典数据失败：", error);
  }
};

// 加载专业下拉选项
const loadZyOptions = async (keyword?: string) => {
  try {
    const response = (await getZyOptions(keyword)) as any;
    if (response.data.code === 200) {
      zyOptions.value = response.data.data || [];
    }
  } catch (error) {
    console.error("获取专业下拉选项失败：", error);
  }
};

// 专业搜索方法
const handleZySearch = async (query: string) => {
  if (query) {
    zyLoading.value = true;
    await loadZyOptions(query);
    zyLoading.value = false;
  } else {
    await loadZyOptions();
  }
};

// 专业选择变化
const handleZyChange = (value: string) => {
  if (value) {
    const selectedZy = zyOptions.value.find((item) => item.value === value);
    if (selectedZy) {
      form.gkzymc = selectedZy.zymc;
    }
  } else {
    form.gkzymc = "";
  }
};

// 专业名称搜索方法
const handleZymcSearch = async (query: string) => {
  if (query) {
    zyLoading.value = true;
    await loadZyOptions(query);
    zyLoading.value = false;
  } else {
    await loadZyOptions();
  }
};

// 专业名称选择变化
const handleZymcChange = (value: string) => {
  if (value) {
    const selectedZy = zyOptions.value.find((item) => item.zymc === value);
    if (selectedZy) {
      form.gkzyh = selectedZy.zyh;
    }
  } else {
    form.gkzyh = "";
  }
};

// 加载计划课程号下拉选项
const loadJhkchOptions = async (keyword?: string) => {
  try {
    const response = (await getJhkchOptions(keyword)) as any;
    if (response.data.code === 200) {
      jhkchOptions.value = response.data.data || [];
    }
  } catch (error) {
    console.error("获取计划课程号下拉选项失败：", error);
  }
};

// 计划课程号搜索方法
const handleJhkchSearch = async (query: string) => {
  if (query) {
    jhkchLoading.value = true;
    await loadJhkchOptions(query);
    jhkchLoading.value = false;
  } else {
    await loadJhkchOptions();
  }
};

// 计划课程号选择变化
const handleJhkchChange = (value: string) => {
  // 可以在这里添加选择后的逻辑
  console.log("选择的计划课程号：", value);
};

// 加载实训室号下拉选项
const loadSxshOptions = async (keyword?: string) => {
  try {
    const response = (await getSxshOptions(keyword)) as any;
    if (response.data.code === 200) {
      sxshOptions.value = response.data.data || [];
    }
  } catch (error) {
    console.error("获取实训室号下拉选项失败：", error);
  }
};

// 实训室号搜索方法
const handleSxshSearch = async (query: string) => {
  if (query) {
    sxshLoading.value = true;
    await loadSxshOptions(query);
    sxshLoading.value = false;
  } else {
    await loadSxshOptions();
  }
};

// 实训室号选择变化
const handleSxshChange = (value: string) => {
  console.log("选择的实训室号：", value);
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = (await getOdsSxxmsjPage(queryParams)) as any;
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.message || "查询失败");
    }
  } catch (error) {
    console.error("查询实训项目数据失败：", error);
    ElMessage.error("查询失败");
  }
  loading.value = false;
};

// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置搜索
const resetQuery = () => {
  queryForm.value?.resetFields();
  handleQuery();
};

// 分页变化
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

// 选择变化
const handleSelectionChange = (selection: OdsSxxmsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 新增
const handleAdd = async () => {
  resetForm();
  // 自动获取学校代码
  await loadSystemSchoolCode();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsSxxmsjInfo) => {
  try {
    const response: any = await getOdsSxxmsjById(row.id);
    if (response.data.code === 200) {
      const data = response.data.data;
      Object.assign(form, data);
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取实训项目数据详情失败：", error);
    ElMessage.error("获取数据失败");
  }
};

// 查看详情
const handleView = async (row: OdsSxxmsjInfo) => {
  try {
    const response: any = await getOdsSxxmsjById(row.id);
    if (response.data.code === 200) {
      const data = response.data.data;
      Object.assign(form, data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取实训项目数据详情失败：", error);
    ElMessage.error("获取数据失败");
  }
};

// 删除
const handleDelete = async (row: OdsSxxmsjInfo) => {
  ElMessageBox.confirm(`确定要删除实训项目"${row.sxxmmc}"吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const response: any = await deleteOdsSxxmsj(row.id);
        if (response.data.code === 200) {
          ElMessage.success("删除成功");
          getList();
        } else {
          ElMessage.error(response.data.message || "删除失败");
        }
      } catch (error) {
        console.error("删除实训项目数据失败：", error);
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedIds.value.length} 条数据吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      try {
        const response: any = await batchDeleteOdsSxxmsj(selectedIds.value);
        if (response.data.code === 200) {
          ElMessage.success("删除成功");
          getList();
        } else {
          ElMessage.error(response.data.message || "删除失败");
        }
      } catch (error) {
        console.error("批量删除实训项目数据失败：", error);
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

// 导出
const handleExport = async () => {
  try {
    const response = (await exportOdsSxxmsj(queryParams)) as any;
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `实训项目数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出实训项目数据失败：", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  submitLoading.value = true;
  try {
    const response: any =
      dialogMode.value === "add"
        ? await addOdsSxxmsj(form)
        : await updateOdsSxxmsj(form);

    if (response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.message || "操作失败");
    }
  } catch (error) {
    console.error("保存实训项目数据失败：", error);
    ElMessage.error("操作失败");
  }
  submitLoading.value = false;
};

// 重置表单
const resetForm = () => {
  const currentXnOptions = generateXnOptions();

  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    sxxmbh: "",
    sxxmmc: "",
    sfxnfzsxxm: "",
    gkzyh: "",
    gkzymc: "",
    ssjhkch: "",
    ptsxzymc: "",
    dxrwmc: "",
    jnyq: "",
    khfs: "",
    mksl: undefined,
    xssxkss: undefined,
    sfdwfw: "",
    xn: currentXnOptions[0]?.value || "", // 默认选择当前学年
    xq: "",
    qtsxdd: "",
    xnsxsh: "",
    sjcjsj: "",
    reportStatus: "0", // 默认未上报
    enableStatus: "1", // 默认启用
  });

  // 清空选项
  zyOptions.value = [];
  jhkchOptions.value = [];
  sxshOptions.value = [];
  formRef.value?.clearValidate();
};

// 上报状态处理
const handleReportStatusClick = async (row: OdsSxxmsjInfo) => {
  const statusMap = {
    "0": "1",
    "1": "2",
    "2": "0",
  };
  const statusText = {
    "0": "已上报",
    "1": "上报失败",
    "2": "未上报",
  };

  const newStatus = statusMap[row.reportStatus as keyof typeof statusMap];
  const actionText = statusText[newStatus as keyof typeof statusText];

  ElMessageBox.confirm(`确定要将状态更改为"${actionText}"吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(async () => {
      try {
        const response: any = await updateSingleReportStatus(row.id, newStatus);
        if (response.data.code === 200) {
          ElMessage.success("状态更新成功");
          getList();
        } else {
          ElMessage.error(response.data.message || "状态更新失败");
        }
      } catch (error) {
        console.error("更新上报状态失败：", error);
        ElMessage.error("状态更新失败");
      }
    })
    .catch(() => {});
};

// 启用状态变化
const handleEnableStatusChange = async (row: OdsSxxmsjInfo) => {
  row.statusLoading = true;
  try {
    const response: any = await updateSingleEnableStatus(
      row.id,
      row.enableStatus,
    );
    if (response.data.code === 200) {
      ElMessage.success("状态更新成功");
    } else {
      ElMessage.error(response.data.message || "状态更新失败");
      // 恢复原状态
      row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    }
  } catch (error) {
    console.error("更新启用状态失败：", error);
    ElMessage.error("状态更新失败");
    // 恢复原状态
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
  }
  row.statusLoading = false;
};

// 工具函数
const getReportStatusTagType = (
  status: string | undefined,
): "info" | "success" | "danger" => {
  if (!status) return "info";
  const typeMap: Record<string, "info" | "success" | "danger"> = {
    "0": "info",
    "1": "success",
    "2": "danger",
  };
  return typeMap[status] || "info";
};

const getReportStatusText = (status: string | undefined): string => {
  if (!status) return "未知";
  const textMap: Record<string, string> = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败",
  };
  return textMap[status] || status;
};

const formatDisplayTime = (timeStr: string | undefined) => {
  if (!timeStr) return "-";
  // 如果是14位的时间格式 YYYYMMDD HHmmss
  if (timeStr.length === 15 && timeStr.includes(" ")) {
    const [datePart, timePart] = timeStr.split(" ");
    if (datePart.length === 8 && timePart.length === 6) {
      return `${datePart.slice(0, 4)}-${datePart.slice(4, 6)}-${datePart.slice(6, 8)} ${timePart.slice(0, 2)}:${timePart.slice(2, 4)}:${timePart.slice(4, 6)}`;
    }
  }
  // 如果是8位的日期格式 YYYYMMDD
  if (timeStr.length === 8) {
    return `${timeStr.slice(0, 4)}-${timeStr.slice(4, 6)}-${timeStr.slice(6, 8)}`;
  }
  // 如果是14位连续的时间格式 YYYYMMDDHHMMSS
  if (timeStr.length === 14) {
    return `${timeStr.slice(0, 4)}-${timeStr.slice(4, 6)}-${timeStr.slice(6, 8)} ${timeStr.slice(8, 10)}:${timeStr.slice(10, 12)}:${timeStr.slice(12, 14)}`;
  }
  return timeStr;
};

const handleRowDblClick = (row: OdsSxxmsjInfo) => {
  handleView(row);
};
</script>

<style scoped>
.professional-development-management {
}

.search-card {
  height: 60px;
}

.search-bar {
  :deep(.el-form) {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .el-form-item {
      margin-bottom: 8px !important;
      margin-right: 0;

      .el-form-item__label {
        font-weight: 500;
        color: #606266;
      }

      .el-input {
        width: 200px;
      }

      .el-select {
        width: 200px;
      }
    }
  }
}

.table-card {
  margin-top: -10px;
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
