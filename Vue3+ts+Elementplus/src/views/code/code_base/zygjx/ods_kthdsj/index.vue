<template>
  <div>
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="排课号" prop="pkh">
            <el-input
              v-model="queryParams.pkh"
              placeholder="请输入排课号"
              clearable
            />
          </el-form-item>
          <el-form-item label="课程名称" prop="kcmc">
            <el-input
              v-model="queryParams.kcmc"
              placeholder="请输入课程名称"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <div style="margin-top: -25px">
              <el-button type="primary" @click="handleQuery">
                <el-icon><Search /></el-icon>搜索
              </el-button>
              <el-button @click="resetQuery">
                <el-icon><Refresh /></el-icon>重置
              </el-button>
            </div>
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
            :disabled="!multipleSelection.length"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
        </div>
        <div class="header-title">课堂互动数据编码管理</div>
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
          :height="'calc(75vh - 110px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="zjsjwyxbs"
            show-overflow-tooltip
            label="主键数据唯一性标识"
            min-width="180"
            sortable="custom"
          />
          <el-table-column
            prop="xxdm"
            show-overflow-tooltip
            label="学校代码"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="pkh"
            show-overflow-tooltip
            label="排课号"
            min-width="140"
            sortable="custom"
          />
          <el-table-column
            prop="kch"
            show-overflow-tooltip
            label="课程号"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="kcmc"
            show-overflow-tooltip
            label="课程名称"
            min-width="150"
            sortable="custom"
          />
          <el-table-column
            prop="zc"
            show-overflow-tooltip
            label="周次"
            min-width="80"
            sortable="custom"
          />
          <el-table-column
            prop="xqj"
            show-overflow-tooltip
            label="星期几"
            min-width="80"
            sortable="custom"
          >
            <template #default="{ row }">
              {{
                weekDayMap[row.xqj as keyof typeof weekDayMap] || row.xqj || "-"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="skjc"
            show-overflow-tooltip
            label="上课节次"
            min-width="100"
            sortable="custom"
          />
          <el-table-column
            prop="skrq"
            label="上课日期"
            width="120"
            align="center"
          >
            <template #default="{ row }">
              {{ row.skrqDisplay || row.skrq || "-" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sksj"
            label="上课时间"
            width="120"
            align="center"
          >
            <template #default="{ row }">
              {{ row.sksjDisplay || row.sksj || "-" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="kthdfqzcs"
            label="课堂互动发起总次数"
            width="140"
            align="center"
          >
            <template #default="{ row }">
              <el-tag type="info" size="small">{{ row.kthdfqzcs || 0 }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="xscyzcs"
            label="学生参与总次数"
            width="130"
            align="center"
          >
            <template #default="{ row }">
              <el-tag type="success" size="small">{{
                row.xscyzcs || 0
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="xscyl"
            label="学生参与率"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag type="warning" size="small">{{ row.xscyl || 0 }}%</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="cql" label="出勤率" width="100" align="center">
            <template #default="{ row }">
              <el-tag type="primary" size="small">{{ row.cql || 0 }}%</el-tag>
            </template>
          </el-table-column>
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
                :type="getEnableStatusType(row.enableStatus)"
                size="small"
              >
                {{ getEnableStatusText(row.enableStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="数据采集时间"
            min-width="160"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ row.sjcjsjDisplay || row.sjcjsj }}
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            show-overflow-tooltip
            label="更新时间"
            min-width="160"
            sortable="custom"
          />
          <el-table-column
            label="操作"
            width="200"
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
                <el-dropdown
                  trigger="click"
                  @command="(command: string) => handleRowCommand(command, row)"
                >
                  <el-button link type="info" size="small">
                    更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="updateReport"
                        >修改上报状态</el-dropdown-item
                      >
                      <el-dropdown-item command="updateEnable"
                        >修改启用状态</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 585px"
      class="online-learning-record-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="formData.zjsjwyxbs"
                placeholder="可不填，后端自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="formData.xxdm"
                placeholder="系统自动获取学校代码"
                maxlength="10"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px">
            <el-form-item label="课程信息" prop="pkh">
              <el-select
                v-model="formData.pkh"
                filterable
                remote
                reserve-keyword
                placeholder="请输入排课号/课程号/课程名称搜索"
                :remote-method="handleSearchCourse"
                :loading="courseLoading"
                @change="handleCourseSelect"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in courseOptions"
                  :key="item.pkh"
                  :label="item.jhkch + ' - ' + item.kch + ' - ' + item.kcmc"
                  :value="item.pkh"
                >
                  <span style="float: left">{{ item.pkh }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ item.kch }} - {{ item.kcmc }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="课程号" prop="kch">
              <el-input
                v-model="formData.kch"
                placeholder="自动填充"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="课程名称" prop="kcmc">
              <el-input
                v-model="formData.kcmc"
                placeholder="自动填充"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="周次" prop="zc">
              <el-input
                v-model="formData.zc"
                placeholder="请输入周次"
                maxlength="2"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="星期几" prop="xqj">
              <el-select
                v-model="formData.xqj"
                placeholder="请选择星期几"
                style="width: 100%"
              >
                <el-option label="星期一" value="1" />
                <el-option label="星期二" value="2" />
                <el-option label="星期三" value="3" />
                <el-option label="星期四" value="4" />
                <el-option label="星期五" value="5" />
                <el-option label="星期六" value="6" />
                <el-option label="星期日" value="7" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="上课节次" prop="skjc">
              <el-input
                v-model="formData.skjc"
                placeholder="请输入上课节次"
                maxlength="10"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="上课日期" prop="skrq">
              <el-date-picker
                v-model="formData.skrq"
                type="date"
                placeholder="请选择上课日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="上课时间" prop="sksj">
              <el-time-picker
                v-model="formData.sksj"
                format="HH:mm"
                value-format="HHmm"
                placeholder="请选择上课时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="课堂互动发起总次数" prop="kthdfqzcs">
              <el-input-number
                v-model="formData.kthdfqzcs"
                :min="0"
                :max="999999"
                :precision="0"
                style="width: 100%"
                placeholder="请输入课堂互动发起总次数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="学生参与总次数" prop="xscyzcs">
              <el-input-number
                v-model="formData.xscyzcs"
                :min="0"
                :max="999999"
                :precision="0"
                style="width: 100%"
                placeholder="请输入学生参与总次数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="学生参与率" prop="xscyl">
              <el-input-number
                v-model="formData.xscyl"
                :min="0"
                :max="100"
                :precision="2"
                style="width: 100%"
                placeholder="请输入学生参与率"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="出勤率" prop="cql">
              <el-input-number
                v-model="formData.cql"
                :min="0"
                :max="100"
                :precision="2"
                style="width: 100%"
                placeholder="请输入出勤率"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="sjcjsjDateTime"
                type="datetime"
                placeholder="请选择数据采集时间"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
                @change="handleSjcjsjChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select
                v-model="formData.reportStatus"
                placeholder="请选择上报状态"
                style="width: 100%"
              >
                <el-option label="未上报" value="0" />
                <el-option label="已上报" value="1" />
                <el-option label="上报失败" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
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

      <!-- 查看模式 -->
      <div v-else class="online-learning-record-detail">
        <el-descriptions
          class="detail-descriptions"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item label="主键数据唯一性标识">
            <div class="detail-value">{{ formData.zjsjwyxbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ formData.xxdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="排课号">
            <div class="detail-value">{{ formData.pkh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="课程号">
            <div class="detail-value">{{ formData.kch || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="课程名称">
            <div class="detail-value">{{ formData.kcmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="周次">
            <div class="detail-value">{{ formData.zc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="星期几">
            <div class="detail-value">
              {{
                weekDayMap[formData.xqj as keyof typeof weekDayMap] ||
                formData.xqj ||
                "-"
              }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="上课节次">
            <div class="detail-value">{{ formData.skjc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上课日期">
            <div class="detail-value">
              {{ formatDisplayDate(formData.skrq || "") || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="上课时间">
            <div class="detail-value">
              {{ formatDisplayTime(formData.sksj || "") || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="课堂互动发起总次数">
            <div class="detail-value">{{ formData.kthdfqzcs || 0 }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学生参与总次数">
            <div class="detail-value">{{ formData.xscyzcs || 0 }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学生参与率">
            <div class="detail-value">{{ formData.xscyl || 0 }}%</div>
          </el-descriptions-item>
          <el-descriptions-item label="出勤率">
            <div class="detail-value">{{ formData.cql || 0 }}%</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayDateTime(formData.sjcjsj || "") || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusType(formData.reportStatus || '')"
              size="small"
            >
              {{ getReportStatusText(formData.reportStatus || "") }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="getEnableStatusType(formData.enableStatus || '')"
              size="small"
            >
              {{ getEnableStatusText(formData.enableStatus || "") }}
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
            @click="handleSave"
            :loading="saveLoading"
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
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormRules } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  View,
  Edit,
  ArrowDown,
} from "@element-plus/icons-vue";
import {
  getOdsKthdsjPage,
  getOdsKthdsjById,
  addOdsKthdsj,
  updateOdsKthdsj,
  deleteOdsKthdsj,
  batchDeleteOdsKthdsj,
  exportOdsKthdsj,
  updateSingleReportStatus,
  updateSingleEnableStatus,
  getSystemSchoolCode,
  type OdsKthdsjForm,
  type OdsKthdsjInfo,
} from "@/api-code/code/code_base/zygjx/ods_kthdsj";
import {
  getJhkchOptions,
  type CourseOption,
} from "@/api-code/code/code_base/zygjx/ods_pksj";

// 定义星期几的映射关系
const weekDayMap = {
  "1": "星期一",
  "2": "星期二",
  "3": "星期三",
  "4": "星期四",
  "5": "星期五",
  "6": "星期六",
  "7": "星期日",
} as const;

// 响应式数据
const loading = ref(false);
const saveLoading = ref(false);
const dataList = ref<OdsKthdsjInfo[]>([]);
const total = ref(0);
const multipleSelection = ref<OdsKthdsjInfo[]>([]);

// 查询参数类型
interface QueryParams {
  zjsjwyxbs?: string;
  xxdm?: string;
  pkh?: string;
  kch?: string;
  kcmc?: string;
  zc?: string;
  xqj?: string;
  skrq?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 查询参数
const queryParams = reactive<QueryParams>({
  zjsjwyxbs: "",
  xxdm: "",
  pkh: "",
  kch: "",
  kcmc: "",
  zc: "",
  xqj: "",
  skrq: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 100,
});

// 对话框相关
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogMode = ref<"add" | "edit" | "view">("add");

// 表单数据
const formData = reactive<OdsKthdsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  pkh: "",
  kch: "",
  kcmc: "",
  zc: "",
  xqj: "",
  skjc: "",
  skrq: "",
  sksj: "",
  kthdfqzcs: 0,
  xscyzcs: 0,
  xscyl: 0,
  cql: 0,
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 日期时间相关
const sjcjsjDateTime = ref<string>("");

// 表单验证规则
const formRules = reactive<FormRules>({
  zjsjwyxbs: [
    {
      validator: (_: any, value: string, callback: Function) => {
        if (!value) {
          callback(); // 允许为空，后端会自动生成
        } else if (value.length !== 32) {
          callback(new Error("唯一编码必须是32位"));
        } else if (!/^[A-Z0-9]{32}$/.test(value)) {
          callback(new Error("唯一编码必须是32位大写字母和数字的组合"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须是10位数字", trigger: "blur" },
  ],
  pkh: [
    { required: true, message: "排课号不能为空", trigger: "blur" },
    { max: 60, message: "排课号长度不能超过60个字符", trigger: "blur" },
  ],
  kch: [
    { required: true, message: "课程号不能为空", trigger: "blur" },
    { max: 60, message: "课程号长度不能超过60个字符", trigger: "blur" },
  ],
  kcmc: [
    { required: true, message: "课程名称不能为空", trigger: "blur" },
    { max: 60, message: "课程名称长度不能超过60个字符", trigger: "blur" },
  ],
  zc: [
    { required: true, message: "周次不能为空", trigger: "blur" },
    { pattern: /^\d{1,2}$/, message: "周次必须是1-2位数字", trigger: "blur" },
  ],
  xqj: [{ required: true, message: "星期几不能为空", trigger: "change" }],
  skjc: [
    { required: true, message: "上课节次不能为空", trigger: "blur" },
    { max: 10, message: "上课节次长度不能超过10个字符", trigger: "blur" },
  ],
  skrq: [{ required: true, message: "上课日期不能为空", trigger: "change" }],
  sksj: [{ required: true, message: "上课时间不能为空", trigger: "change" }],
  kthdfqzcs: [
    { required: true, message: "课堂互动发起总次数不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 999999,
      message: "课堂互动发起总次数必须是不超过6位的数字",
      trigger: "blur",
    },
  ],
  xscyzcs: [
    { required: true, message: "学生参与总次数不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 999999,
      message: "学生参与总次数必须是不超过6位的数字",
      trigger: "blur",
    },
  ],
  xscyl: [
    { required: true, message: "学生参与率不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 100,
      message: "学生参与率必须是0-100之间的数字",
      trigger: "blur",
    },
  ],
  cql: [
    { required: true, message: "出勤率不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 100,
      message: "出勤率必须是0-100之间的数字",
      trigger: "blur",
    },
  ],
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "change" },
  ],
  reportStatus: [
    { required: true, message: "上报状态不能为空", trigger: "change" },
  ],
  enableStatus: [
    { required: true, message: "启用状态不能为空", trigger: "change" },
  ],
});

// 表单引用
const queryFormRef = ref();
const formRef = ref();

// 添加课程选项相关的响应式数据
const courseOptions = ref<CourseOption[]>([]);
const courseLoading = ref(false);

// 页面加载
onMounted(() => {
  getList();
});

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = (await getOdsKthdsjPage(queryParams)) as any;
    if (response.data && response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data?.message || "查询失败");
    }
  } catch (error) {
    console.error("获取列表失败:", error);
    ElMessage.error("获取列表失败");
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
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

// 分页处理
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 选择处理
const handleSelectionChange = (selection: OdsKthdsjInfo[]) => {
  multipleSelection.value = selection;
};

// 新增
const handleAdd = () => {
  dialogMode.value = "add";
  dialogTitle.value = "新课堂互动数据子类表数据";
  resetForm();
  getSchoolCode();
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsKthdsjInfo) => {
  dialogMode.value = "edit";
  dialogTitle.value = "编辑课堂互动数据子类表数据";
  try {
    const response = (await getOdsKthdsjById(row.id)) as any;
    if (response.data.code === 200) {
      const data = response.data.data;
      Object.assign(formData, data);
      // 处理日期时间格式
      if (data.sjcjsj) {
        sjcjsjDateTime.value = data.sjcjsj;
      }
      dialogVisible.value = true;
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 查看详情
const handleView = async (row: OdsKthdsjInfo) => {
  dialogMode.value = "view";
  dialogTitle.value = "查看课堂互动数据子类表数据";
  try {
    const response = (await getOdsKthdsjById(row.id)) as any;
    if (response.data && response.data.code === 200) {
      Object.assign(formData, response.data.data);
    }
  } catch (error) {
    ElMessage.error("获取数据失败");
  }
  dialogVisible.value = true;
};

// 获取学校代码
const getSchoolCode = async () => {
  try {
    const response = (await getSystemSchoolCode()) as any;
    if (response.data.code === 200 && response.data.data) {
      formData.xxdm = response.data.data;
    } else {
      ElMessage.error(response.message || "获取学校代码失败");
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
    ElMessage.error("获取学校代码失败");
  }
};

// 删除
const handleDelete = async (row: OdsKthdsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条记录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = (await deleteOdsKthdsj(row.id)) as any;
    if (response.data && response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data?.message || "删除失败");
    }
  } catch (error) {
    if (error === "cancel") return;
    console.error("删除失败:", error);
    ElMessage.error("删除失败");
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning("请选择要删除的记录");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${multipleSelection.value.length} 条记录吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const ids = multipleSelection.value.map((item) => item.id);
    const response = (await batchDeleteOdsKthdsj(ids)) as any;
    if (response.data && response.data.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
    } else {
      ElMessage.error(response.data?.message || "批量删除失败");
    }
  } catch (error) {
    if (error === "cancel") return;
    console.error("批量删除失败:", error);
    ElMessage.error("批量删除失败");
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = (await exportOdsKthdsj(queryParams)) as any;

    // 创建下载链接
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `网络课程在线学习记录数据_${new Date().getTime()}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
};

// 行操作命令处理
const handleRowCommand = async (command: string, row: OdsKthdsjInfo) => {
  try {
    let response: any;
    switch (command) {
      case "updateReport":
        const reportStatus = row.reportStatus === "1" ? "0" : "1";
        response = await updateSingleReportStatus(row.id, reportStatus);
        break;
      case "updateEnable":
        const enableStatus = row.enableStatus === "1" ? "0" : "1";
        response = await updateSingleEnableStatus(row.id, enableStatus);
        break;
    }

    if (response?.data.code === 200) {
      ElMessage.success("操作成功");
      getList();
    } else {
      ElMessage.error("操作失败");
    }
  } catch (error) {
    ElMessage.error("操作失败");
  }
};

// 日期时间变更处理
const handleSjcjsjChange = (val: string) => {
  formData.sjcjsj = val;
};

// 保存
const handleSave = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    // 处理日期时间格式
    if (sjcjsjDateTime.value) {
      formData.sjcjsj = sjcjsjDateTime.value;
    }

    saveLoading.value = true;
    const response = (await (formData.id
      ? updateOdsKthdsj(formData)
      : addOdsKthdsj(formData))) as any;

    if (response.data.code === 200) {
      ElMessage.success(formData.id ? "修改成功" : "新增成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(
        response.data.message || (formData.id ? "修改失败" : "新增失败"),
      );
    }
  } catch (error) {
    console.error("保存失败:", error);
    ElMessage.error("表单验证失败，请检查必填项");
  } finally {
    saveLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formData.id = undefined;
  formData.zjsjwyxbs = "";
  formData.xxdm = "";
  formData.pkh = "";
  formData.kch = "";
  formData.kcmc = "";
  formData.zc = "";
  formData.xqj = "";
  formData.skjc = "";
  formData.skrq = "";
  formData.sksj = "";
  formData.kthdfqzcs = 0;
  formData.xscyzcs = 0;
  formData.xscyl = 0;
  formData.cql = 0;
  formData.sjcjsj = "";
  formData.reportStatus = "0";
  formData.enableStatus = "1";

  sjcjsjDateTime.value = "";
  courseOptions.value = [];

  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 状态相关方法
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

const getEnableStatusType = (status: string) => {
  return status === "1" ? "success" : "danger";
};

const getEnableStatusText = (status: string) => {
  return status === "1" ? "启用" : "禁用";
};

const formatDisplayDate = (date: string) => {
  if (!date) return "-";
  // YYYYMMDD -> YYYY-MM-DD
  if (date.length === 8) {
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  }
  return date;
};

const formatDisplayTime = (time: string) => {
  if (!time) return "-";
  // HHmm -> HH:mm
  if (time.length === 4) {
    return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
  }
  return time;
};

const formatDisplayDateTime = (datetime: string) => {
  if (!datetime) return "-";
  // YYYYMMDDHHmmss -> YYYY-MM-DD HH:mm:ss
  if (datetime.includes(" ")) {
    return datetime; // 已经是格式化的
  }
  if (datetime.length === 15) {
    const date = datetime.slice(0, 8);
    const time = datetime.slice(9);
    return `${formatDisplayDate(date)} ${formatDisplayTime(time.slice(0, 4))}`;
  }
  return datetime;
};

// 搜索课程信息
const handleSearchCourse = async (query: string) => {
  if (query !== "") {
    courseLoading.value = true;
    try {
      const response = (await getJhkchOptions(query)) as any;
      if (response.data.code === 200) {
        courseOptions.value = response.data.data;
      }
    } catch (error) {
      console.error("搜索课程信息失败:", error);
    } finally {
      courseLoading.value = false;
    }
  } else {
    courseOptions.value = [];
  }
};

// 选择课程
const handleCourseSelect = (pkh: string) => {
  if (!pkh) {
    formData.pkh = "";
    formData.kch = "";
    formData.kcmc = "";
    return;
  }
  const selected = courseOptions.value.find((item) => item.pkh === pkh);
  if (selected) {
    formData.pkh = selected.pkh;
    formData.kch = selected.kch;
    formData.kcmc = selected.kcmc;
  }
};
</script>

<style scoped>
.search-card {
  height: 60px;
}

.search-bar {
  padding: 0px;
}
.table-card {
  margin-top: -10px;
}
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.operation-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.table-body {
  margin-bottom: 20px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-info {
  color: #606266;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dialog-footer {
  text-align: right;
}

.demo-tabs .el-tab-pane {
  padding: 20px 0;
}

.online-learning-record-detail {
  padding: 20px;
}

.detail-descriptions {
  width: 100%;
}

.detail-value {
  font-weight: 500;
}
</style>
