<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true" class="search-form">
          <el-form-item label="教工号" prop="jgh">
            <el-input
              v-model="queryParams.jgh"
              placeholder="请输入教工号"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="教师姓名" prop="jsxm">
            <el-input
              v-model="queryParams.jsxm"
              placeholder="请输入教师姓名"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="人员类型" prop="rylxm">
            <el-select
              v-model="queryParams.rylxm"
              placeholder="请选择人员类型"
              clearable
              style="width: 220px;"
            >
              <el-option
                v-for="option in personTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
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
        <div class="header-title">思政教职工数据数据清洗</div>
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
            prop="jgh"
            label="教工号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="jsxm"
            label="教师姓名"
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="rylxmText"
            label="人员类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="jl"
            label="教龄"
            min-width="80"
            align="right"
            sortable="custom"
          />
          <el-table-column
            prop="zksxzymc"
            label="专科专业"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="bksxzymc"
            label="本科专业"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sssxzymc"
            label="硕士专业"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="bssxzymc"
            label="博士专业"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="bzrfdynxszknx"
            label="班主任/思政年限"
            min-width="140"
            align="right"
            sortable="custom"
          />
          <el-table-column
            prop="sfxljkkjs"
            label="心理健康课教师"
            width="120"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="row.sfxljkkjs === '1' ? 'success' : 'info'">
                {{ row.sfxljkkjs === "1" ? "是" : "否" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="sfxlzxs"
            label="心理咨询师"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="row.sfxlzxs === '1' ? 'success' : 'info'">
                {{ row.sfxlzxs === "1" ? "是" : "否" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="sfcyxlzxszgzs"
            label="持有资格证书"
            width="120"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="row.sfcyxlzxszgzs === '1' ? 'success' : 'info'">
                {{ row.sfcyxlzxszgzs === "1" ? "是" : "否" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="xlzxszgzsbh"
            label="资格证书编号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增思政教职工数据' : '编辑思政教职工数据'"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 570px"
      class="form-dialog"
      destroy-on-close
      @close="handleFormClose"
    >
      <el-form
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

                  <el-form-item label="教工号" prop="jgh">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select
              el-select
                      v-model="form.jgh"
                filterable
                remote
                reserve-keyword
                placeholder="请输入教师姓名或工号"
                :remote-method="getJsOptionsData"
                :loading="Loading"
                @change="handleJsChange"
                style="width: 100%"
              >
                <el-option
                  v-for="option in jsOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <el-tooltip content="数据来源于教师画像数据表" placement="top">
                <el-icon style="color: #e6a23c"><Warning /></el-icon>
            </el-tooltip>
            </div>
              
                  </el-form-item>
                </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
                  <el-form-item label="教师姓名" prop="jsxm">
              <div style="display: flex; align-items: center; gap: 8px">
                    <el-input
                      v-model="form.jsxm"
                      placeholder="请输入教师姓名"
                      maxlength="36"
                show-word-limit
                    />
              <el-tooltip content="数据来源于教师画像数据表" placement="top">
                <el-icon style="color: #e6a23c"><Warning /></el-icon>
            </el-tooltip>
            </div>  
                  </el-form-item>
                </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="人员类型码" prop="rylxm">
                    <el-select
                      v-model="form.rylxm"
                      placeholder="请选择人员类型"
                      style="width: 100%"
                      clearable
                      multiple
                      collapse-tags
                      collapse-tags-tooltip
                    >
                      <el-option
                        v-for="option in personTypeOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
                  <el-form-item label="教龄" prop="jl">
                    <el-input-number
                      v-model="form.jl"
                      :min="0"
                      :max="100"
                :precision="1"
                      placeholder="请输入教龄"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
                  <el-form-item label="专科专业" prop="zksxzymc">
                    <el-input
                      v-model="form.zksxzymc"
                placeholder="请输入专科专业名称"
                      maxlength="60"
                show-word-limit
                    />
                  </el-form-item>
                </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
                  <el-form-item label="本科专业" prop="bksxzymc">
                    <el-input
                      v-model="form.bksxzymc"
                placeholder="请输入本科专业名称"
                      maxlength="60"
                show-word-limit
                    />
                  </el-form-item>
                </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
                  <el-form-item label="硕士专业" prop="sssxzymc">
                    <el-input
                      v-model="form.sssxzymc"
                placeholder="请输入硕士专业名称"
                      maxlength="60"
                show-word-limit
                    />
                  </el-form-item>
                </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
                  <el-form-item label="博士专业" prop="bssxzymc">
                    <el-input
                      v-model="form.bssxzymc"
                placeholder="请输入博士专业名称"
                      maxlength="60"
                show-word-limit
                    />
                  </el-form-item>
                </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
                  <el-form-item label="班主任/思政年限" prop="bzrfdynxszknx">
                    <el-input-number
                      v-model="form.bzrfdynxszknx"
                      :min="0"
                      :max="100"
                :precision="1"
                :step="0.1"
                placeholder="请输入年限"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
                  <el-form-item label="心理健康课教师" prop="sfxljkkjs">
                    <el-select
                      v-model="form.sfxljkkjs"
                      placeholder="请选择是否心理健康课教师"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="option in yesNoOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
                  <el-form-item label="心理咨询师" prop="sfxlzxs">
                    <el-select
                      v-model="form.sfxlzxs"
                      placeholder="请选择是否心理咨询师"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="option in yesNoOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
                  <el-form-item label="持有资格证书" prop="sfcyxlzxszgzs">
                    <el-select
                      v-model="form.sfcyxlzxszgzs"
                placeholder="请选择是否持有资格证书"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="option in yesNoOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
                  <el-form-item label="资格证书编号" prop="xlzxszgzsbh">
                    <el-input
                      v-model="form.xlzxszgzsbh"
                placeholder="请输入资格证书编号"
                      maxlength="60"
                show-word-limit
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
                value-format="YYYYMM DDHHmmss"
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

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
          >
            {{ dialogType === "add" ? "新增" : "保存" }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情查看对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="思政教职工数据详情"
      width="1000px"
      center
      class="detail-dialog"
    >
      <div v-if="currentRecord" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="唯一性标识">
            {{ currentRecord.zjsjwyxbs }}
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            {{ currentRecord.xxdm }}
          </el-descriptions-item>
          <el-descriptions-item label="教工号">
            {{ currentRecord.jgh }}
          </el-descriptions-item>
          <el-descriptions-item label="教师姓名">
            {{ currentRecord.jsxm }}
          </el-descriptions-item>
          <el-descriptions-item label="人员类型">
            {{ currentRecord.rylxmText }}
          </el-descriptions-item>
          <el-descriptions-item label="教龄">
            {{ currentRecord.jl }}年
          </el-descriptions-item>
          <el-descriptions-item label="专科专业" :span="2">
            {{ currentRecord.zksxzymc || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="本科专业" :span="2">
            {{ currentRecord.bksxzymc || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="硕士专业" :span="2">
            {{ currentRecord.sssxzymc || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="博士专业" :span="2">
            {{ currentRecord.bssxzymc || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="班主任/思政年限">
            {{ currentRecord.bzrfdynxszknx }}年
          </el-descriptions-item>
          <el-descriptions-item label="心理健康课教师">
            {{ currentRecord.sfxljkkjs === "1" ? "是" : "否" }}
          </el-descriptions-item>
          <el-descriptions-item label="心理咨询师">
            {{ currentRecord.sfxlzxs === "1" ? "是" : "否" }}
          </el-descriptions-item>
          <el-descriptions-item label="持有资格证书">
            {{ currentRecord.sfcyxlzxszgzs === "1" ? "是" : "否" }}
          </el-descriptions-item>
          <el-descriptions-item label="资格证书编号" :span="2">
            {{ currentRecord.xlzxszgzsbh || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            {{ currentRecord.sjcjsj }}
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            {{
              currentRecord.reportStatus === "1"
                ? "已上报"
                : currentRecord.reportStatus === "2"
                  ? "上报失败"
                  : "未上报"
            }}
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            {{ currentRecord.enableStatus === "1" ? "启用" : "禁用" }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ currentRecord.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ currentRecord.updateTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleDetailClose">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
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

// API导入
import {
  getOdsSzjzgsjPage,
  getOdsSzjzgsjById,
  addOdsSzjzgsj,
  updateOdsSzjzgsj,
  deleteOdsSzjzgsj,
  getSystemSchoolCode,
  getJsOptions,
  batchDeleteOdsSzjzgsj,
  exportOdsSzjzgsj,
  getPersonTypeOptions,
  getYesNoOptions,
  type OdsSzjzgsjInfo,
  type OdsSzjzgsjQuery,
  type OdsSzjzgsjForm,
  type DictOption,
  type JsOption,
} from "@/api-data/data/data_base/zygdz/ods_szjzgsj";

 
// 搜索条件
const queryParams = reactive<OdsSzjzgsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  jgh: "",
  jsxm: "",
  rylxm: "",
  sfxljkkjs: "",
  sfxlzxs: "",
  sfcyxlzxszgzs: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 表格数据
const dataList = ref<OdsSzjzgsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);
const systemSchoolCode = ref("");
// 表单相关
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const form = reactive<OdsSzjzgsjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  jgh: "",
  jsxm: "",
  rylxm: "",
  jl: undefined,
  zksxzymc: "",
  bksxzymc: "",
  sssxzymc: "",
  bssxzymc: "",
  bzrfdynxszknx: undefined,
  sfxljkkjs: "",
  sfxlzxs: "",
  sfcyxlzxszgzs: "",
  xlzxszgzsbh: "",
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const activeTab = ref("basic");
//教师获取
const jsOptions = ref<JsOption[]>([]);
// 详情对话框
const viewDialogVisible = ref(false);
const currentRecord = ref<OdsSzjzgsjInfo | null>(null);

// 字典选项
const personTypeOptions = ref<DictOption[]>([]);
const yesNoOptions = ref<DictOption[]>([]);

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
  jgh: [
    { required: true, message: "请输入教工号", trigger: "blur" },
    { max: 20, message: "教工号长度不能超过20位", trigger: "blur" }
  ],
  jsxm: [
    { max: 36, message: "教师姓名长度不能超过36位", trigger: "blur" }
  ],
  rylxm: [
    { required: true, message: "请选择人员类型码", trigger: "change" },
    
  ],
  jl: [
    { required: true, message: "请输入教龄", trigger: "blur" },
    { 
      validator: (rule: any, value: any, callback: Function) => {
        if (value === undefined || value === null || value === '') {
          callback();
        } else if (typeof value !== 'number') {
          callback(new Error('教龄必须为数字'));
        } else if (value < 0) {
          callback(new Error('教龄不能小于0'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  zksxzymc: [
    { max: 60, message: "专科专业名称长度不能超过60位", trigger: "blur" }
  ],
  bksxzymc: [
    { max: 60, message: "本科专业名称长度不能超过60位", trigger: "blur" }
  ],
  sssxzymc: [
    { max: 60, message: "硕士专业名称长度不能超过60位", trigger: "blur" }
  ],
  bssxzymc: [
    { max: 60, message: "博士专业名称长度不能超过60位", trigger: "blur" }
  ],
  bzrfdynxszknx: [
    { required: true, message: "请输入班主任辅导员年限/思政课年限", trigger: "blur" },
    { type: 'number', message: "年限必须为数字", trigger: "blur" }
  ],
  sfxljkkjs: [
    { required: true, message: "请选择是否心理健康课教师", trigger: "change" }
  ],
  sfxlzxs: [
    { required: true, message: "请选择是否心理咨询师", trigger: "change" }
  ],
  sfcyxlzxszgzs: [
    { required: true, message: "请选择是否持有心理咨询师资格证书", trigger: "change" }
  ],
  xlzxszgzsbh: [
    { max: 60, message: "资格证书编号长度不能超过60位", trigger: "blur" }
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" }
  ],
  enableStatus: [
    { required: true, message: "请选择启用状态", trigger: "change" }
  ]
});

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsSzjzgsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.message || "查询失败");
    }
  } catch (error) {
    console.error("查询思政教职工数据失败:", error);
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
    jgh: "",
    jsxm: "",
    rylxm: "",
    sfxljkkjs: "",
    sfxlzxs: "",
    sfcyxlzxszgzs: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,  // 使用系统学校代码
    jgh: "",
    jsxm: "",
    rylxm: "",
    jl: undefined,
    zksxzymc: "",
    bksxzymc: "",
    sssxzymc: "",
    bssxzymc: "",
    bzrfdynxszknx: undefined,
    sfxljkkjs: "",
    sfxlzxs: "",
    sfcyxlzxszgzs: "",
    xlzxszgzsbh: "",
    sjcjsj: "",
    enableStatus: "1",
  });
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

// 新增
const handleAdd = () => {
  dialogType.value = "add";
  nextTick(() => {
    resetForm();
    dialogVisible.value = true;
  });
};

// 编辑
const handleEdit = async (row: OdsSzjzgsjInfo) => {
  try {
    dialogType.value = "edit";
    const response: any = await getOdsSzjzgsjById(row.id);
    if (response.data.code === 200) {
      nextTick(() => {
        const data = response.data.data;
        // 处理人员类型码的多选值
        if (data.rylxm) {
          data.rylxm = data.rylxm.split(',');
        }
        Object.assign(form, data);
        dialogVisible.value = true;
      });
    } else {
      ElMessage.error(response.data.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取思政教职工数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsSzjzgsjInfo) => {
  try {
    const response: any = await getOdsSzjzgsjById(row.id);
    if (response.data.code === 200) {
      currentRecord.value = response.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(response.data.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取思政教职工数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsSzjzgsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条思政教职工数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsSzjzgsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除思政教职工数据失败:", error);
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
      `确定要删除选中的 ${selectedIds.value.length} 条思政教职工数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsSzjzgsj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
      selectedIds.value = [];
    } else {
      ElMessage.error(response.data.message || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除思政教职工数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsSzjzgsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `思政教职工数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出思政教职工数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    // 处理表单数据
    const submitData = { ...form };
    if (Array.isArray(submitData.rylxm)) {
      submitData.rylxm = submitData.rylxm.join(',');
    }

    let response: any;
    if (dialogType.value === "add") {
      response = await addOdsSzjzgsj(submitData);
    } else {
      response = await updateOdsSzjzgsj(submitData);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogType.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(
        response.data.message ||
          (dialogType.value === "add" ? "新增失败" : "修改失败"),
      );
    }
  } catch (error) {
    console.error(
      `${dialogType.value === "add" ? "新增" : "修改"}思政教职工数据失败:`,
      error,
    );
    ElMessage.error(dialogType.value === "add" ? "新增失败" : "修改失败");
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

// 表格选择
const handleSelectionChange = (selection: OdsSzjzgsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (row: OdsSzjzgsjInfo) => {
  // 可以添加行点击逻辑
  console.log("点击行:", row);
};

// 行双击
const handleRowDblClick = (row: OdsSzjzgsjInfo) => {
  handleView(row);
};

// 分页
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};
//教师获取
const getJsOptionsData = async () => {
  const res = await getJsOptions();
  jsOptions.value = res.data.data;
};
//教师获取
const handleJsChange = (value: string) => { 
  console.log(value);
  const selectedTeacher = jsOptions.value.find((t: TeacherOption) => t.jgh === value);
  if (selectedTeacher) {
    form.jgh = selectedTeacher.jgh;
    form.jsxm = selectedTeacher.jsxm;
     
 
  }
  
}
// 获取字典数据
const loadDictData = async () => {
  try {
    // 获取人员类型码字典
    const personTypeRes: any = await getPersonTypeOptions();
    if (personTypeRes.data.code === 200) {
      personTypeOptions.value = personTypeRes.data.data;
    }

    // 获取是否标志代码字典
    const yesNoRes: any = await getYesNoOptions();
    if (yesNoRes.data.code === 200) {
      yesNoOptions.value = yesNoRes.data.data;
    }
  } catch (error) {
    console.error("获取字典数据失败:", error);
    ElMessage.error("获取字典数据失败");
  }
};

// 格式化日期时间
const formatDateTime = (timestamp: string) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: string) => {
  if (status === "1") {
    return "success";
  } else if (status === "2") {
    return "danger";
  } else {
    return "warning";
  }
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  if (status === "1") {
    return "已上报";
  } else if (status === "2") {
    return "上报失败";
  } else {
    return "未上报";
  }
};
//获取系统学校代码
const getSystemSchoolCodeData = async () => {
  const res = await getSystemSchoolCode();
  systemSchoolCode.value = res.data.data;
};

// 页面加载
onMounted(() => {
  getSystemSchoolCodeData();
  getList();
  loadDictData();
});
</script>
<style scoped lang="scss">
.app-container {
  padding: 0;
}

  .search-card {
  margin-bottom: 8px;

    :deep(.el-card__body) {
      padding: 8px 15px;
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
  }

  .table-card {
  margin-top: -10px;

    :deep(.el-card__body) {
      padding: 10px 15px 0;
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
      }

.dialog-footer {
        display: flex;
        justify-content: flex-end;
  gap: 10px;
}

/* 新增样式 */
.form-dialog {
  border-radius: 8px;

  :deep(.el-dialog__header) {
    background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
    color: white;
    border-radius: 8px 8px 0 0;
    padding: 15px 20px;
  }

  :deep(.el-dialog__title) {
    color: white;
    font-weight: 600;
  }

  :deep(.el-dialog__headerbtn) {
    top: 50%;
    transform: translateY(-50%);
  }

  :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: white;
    font-size: 18px;
  }

  :deep(.el-dialog__body) {
    padding: 20px 24px;
    max-height: 60vh;
    overflow-y: auto;
  }
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

/* 表格样式调整 */
:deep(.el-table) {
  font-size: 14px;

  .el-table__header th {
    padding: 4px 0;
    height: 40px;
    background-color: #f5f7fa;
    font-size: 14px;
  }

  .el-table__row td {
    padding: 4px 0;
    font-size: 14px;
  }
}

/* 分页样式调整 */
:deep(.el-pagination) {
  .el-pagination__total {
    display: none;
  }
}
</style>
