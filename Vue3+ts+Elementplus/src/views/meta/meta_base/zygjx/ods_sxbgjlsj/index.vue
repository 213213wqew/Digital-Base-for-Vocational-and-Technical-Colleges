<template>
  <div class="entity-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
           
          <el-form-item label="学号" prop="xh">
            <el-input
              v-model="queryParams.xh"
              placeholder="请输入学号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="学生姓名" prop="xsxm">
            <el-input
              v-model="queryParams.xsxm"
              placeholder="请输入学生姓名"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="实习企业" prop="sxqymc">
            <el-input
              v-model="queryParams.sxqymc"
              placeholder="请输入实习企业名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
           
          <el-form-item label="启用状态" prop="enableStatus">
            <el-select
              v-model="queryParams.enableStatus"
              placeholder="请选择启用状态"
              clearable
              style="width: 120px"
            >
              <el-option label="禁用" value="0" />
              <el-option label="启用" value="1" />
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
        <div class="header-title">实习报告记录数据管理</div>
        <div class="placeholder">
                <el-button type="success" @click="handleImport">
            <el-icon><Upload /></el-icon>导入
          </el-button>
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
            prop="xh"
            label="学号"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xsxm"
            label="学生姓名"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sxqymc"
            label="实习企业"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sxgwmc"
            label="实习岗位"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sxzdjs"
            label="指导教师"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sxbglbmText"
            label="报告类别"
            width="120"
            align="center"
          />
          <el-table-column
            prop="sxbgtjrqDisplay"
            label="提交日期"
            width="120"
            align="center"
          />
          <el-table-column
            prop="jspyztmText"
            label="批阅状态"
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
                :type="getReportStatusTagType(row.reportStatus as string)"
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
            prop="createTime"
            label="创建时间"
            width="160"
            align="center"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="160"
            align="center"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.updateTime) }}
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
      :title="
        dialogType === 'add' ? '新增实习报告记录数据' : '编辑实习报告记录数据'
      "
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleFormClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="160px"
      >
        <!-- 基本信息区域 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <el-row :gutter="35">
            <el-col :span="12" style="margin-bottom: 18px;">
              <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                <el-input
                  v-model="form.zjsjwyxbs"
                  placeholder="请输入主键数据唯一性标识"
                  maxlength="32"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 18px;">
              <el-form-item label="学校代码" prop="xxdm">
                <el-input
                  v-model="form.xxdm"
                  placeholder="请输入学校代码"
                  maxlength="10"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 18px;">
              <el-form-item label="学号" prop="xh">
                <el-input
                  v-model="form.xh"
                  placeholder="请输入学号"
                  maxlength="20"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 18px;">
              <el-form-item label="学生姓名" prop="xsxm">
                <el-input
                  v-model="form.xsxm"
                  placeholder="请输入学生姓名"
                  maxlength="36"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" style="margin-bottom: 18px;">
              <el-form-item label="实习企业名称" prop="sxqymc">
                <el-input
                  v-model="form.sxqymc"
                  placeholder="请输入实习企业名称"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 18px;">
              <el-form-item label="实习岗位名称" prop="sxgwmc">
                <el-input
                  v-model="form.sxgwmc"
                  placeholder="请输入实习岗位名称"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 18px;">
              <el-form-item label="实习指导教师" prop="sxzdjs">
                <el-input
                  v-model="form.sxzdjs"
                  placeholder="请输入实习指导教师"
                  maxlength="36"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 报告信息区域 -->
        <div class="form-section">
          <div class="section-title">报告信息</div>
          <el-row :gutter="35">
            <el-col :span="12" style="margin-bottom: 18px;">
              <el-form-item label="实习报告类别码" prop="sxbglbm">
                <el-select
                  v-model="form.sxbglbm"
                  placeholder="请选择实习报告类别"
                  filterable
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in reportTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 18px;">
              <el-form-item label="实习报告提交日期" prop="sxbgtjrq">
                <el-date-picker
                  v-model="form.sxbgtjrq"
                  type="date"
                  placeholder="请选择实习报告提交日期"
                  value-format="YYYYMMDD"
                  format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 18px;">
              <el-form-item label="教师批阅状态码" prop="jspyztm">
                <el-select
                  v-model="form.jspyztm"
                  placeholder="请选择教师批阅状态"
                  filterable
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in teacherReviewStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 18px;">
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
            <el-col :span="12" style="margin-bottom: 18px;">
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
            <el-col :span="12" style="margin-bottom: 18px;">
              <el-form-item label="启用状态" prop="enableStatus">
                <el-select
                  v-model="form.enableStatus"
                  placeholder="请选择启用状态"
                  style="width: 100%"
                >
                  <el-option label="启用" value="1" />
                  <el-option label="禁用" value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="margin-bottom: 18px;">
              <el-form-item label="实习报告内容摘要" prop="sxbgnrzy">
                <el-input
                  v-model="form.sxbgnrzy"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入实习报告内容摘要"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" style="margin-bottom: 18px;">
              <el-form-item label="实习报告内容" prop="sxbgnr">
                <el-input
                  v-model="form.sxbgnr"
                  type="textarea"
                  :rows="6"
                  placeholder="请输入实习报告内容"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
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
      title="实习报告记录数据详情"
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
          <el-descriptions-item label="学号">{{
            currentRecord.xh || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学生姓名">{{
            currentRecord.xsxm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习企业名称" :span="2">{{
            currentRecord.sxqymc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习岗位名称">{{
            currentRecord.sxgwmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习指导教师">{{
            currentRecord.sxzdjs || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习报告类别">{{
            currentRecord.sxbglbmText || currentRecord.sxbglbm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习报告提交日期">{{
            currentRecord.sxbgtjrqDisplay || currentRecord.sxbgtjrq || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="教师批阅状态">{{
            currentRecord.jspyztmText || currentRecord.jspyztm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{
            currentRecord.sjcjsjDisplay || currentRecord.sjcjsj || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(currentRecord.reportStatus as string)">
              {{ getReportStatusText(currentRecord.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag :type="currentRecord.enableStatus === '1' ? 'success' : 'danger'">
              {{ currentRecord.enableStatus === '1' ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="实习报告内容摘要" :span="2">{{
            currentRecord.sxbgnrzy || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习报告内容" :span="2">
            <div style="max-height: 150px; overflow-y: auto">
              {{ currentRecord.sxbgnr || "-" }}
            </div>
          </el-descriptions-item>
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

    <!-- 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入实习报告记录数据"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleImportClose"
    >
      <div class="import-content">
        <el-alert
          title="导入说明"
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 20px"
        >
          <template #default>
            <div>
              <p>1. 请使用标准的Excel模板进行数据导入</p>
              <p>2. 必填字段：学校代码、学号、学生姓名、数据采集时间</p>
              <p>3. 支持新增和更新数据，系统会根据学号自动判断</p>
              <p>4. 单次最多支持导入1000条数据</p>
            </div>
          </template>
        </el-alert>

        <el-upload
          ref="uploadRef"
          class="upload-demo"
          drag
          :auto-upload="false"
          :limit="1"
          accept=".xlsx,.xls"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传 xlsx/xls 文件，且不超过 10MB
            </div>
          </template>
        </el-upload>

        <div v-if="importResult" class="import-result" style="margin-top: 20px">
          <el-alert
            :title="`导入完成：总数 ${importResult.total}，成功 ${importResult.success}，新增 ${importResult.insert}，更新 ${importResult.update}，失败 ${importResult.fail}`"
            :type="importResult.fail > 0 ? 'warning' : 'success'"
            :closable="false"
            show-icon
          >
            <template #default>
              <div v-if="importResult.errors && importResult.errors.length > 0">
                <p style="margin: 10px 0 5px 0; font-weight: bold">错误详情：</p>
                <div style="max-height: 200px; overflow-y: auto">
                  <p v-for="(error, index) in importResult.errors" :key="index" style="margin: 2px 0; color: #f56c6c">
                    {{ error }}
                  </p>
                </div>
              </div>
            </template>
          </el-alert>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleImportClose">取消</el-button>
          <el-button
            type="primary"
            :loading="importLoading"
            :disabled="!selectedFile"
            @click="handleImportSubmit"
          >
            确认导入
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
  Upload,
  UploadFilled,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  pageOdsSxbgjlsj,
  getOdsSxbgjlsjById,
  addOdsSxbgjlsj,
  updateOdsSxbgjlsj,
  deleteOdsSxbgjlsj,
  batchDeleteOdsSxbgjlsj,
  exportOdsSxbgjlsj,
  importOdsSxbgjlsj,
  updateOdsSxbgjlsjReportStatus,
  updateOdsSxbgjlsjEnableStatus,
  getReportTypeOptions,
  getTeacherReviewStatusOptions,
  type OdsSxbgjlsjInfo,
  type OdsSxbgjlsjQuery,
  type OdsSxbgjlsjForm,
  type DictOption,
} from "@/api/meta/meta_base/zygjx/ods_sxbgjlsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsSxbgjlsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const importDialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const currentRecord = ref<OdsSxbgjlsjInfo | null>(null);
const submitLoading = ref(false);
const importLoading = ref(false);
const selectedFile = ref<File | null>(null);
const fileList = ref<any[]>([]);
const importResult = ref<any>(null);

// 字典选项
const reportTypeOptions = ref<DictOption[]>([]);
const teacherReviewStatusOptions = ref<DictOption[]>([]);

// 表单引用
const queryForm = ref<FormInstance>();
const formRef = ref<FormInstance>();
const uploadRef = ref<any>();

// 查询参数
const queryParams = reactive<OdsSxbgjlsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xsxm: "",
  sxqymc: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单数据
const form = reactive<OdsSxbgjlsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xsxm: "",
  sxqymc: "",
  sxgwmc: "",
  sxzdjs: "",
  sxbglbm: "",
  sxbgnrzy: "",
  sxbgnr: "",
  sxbgtjrq: "",
  jspyztm: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { required: true, message: "请输入主键数据唯一性标识", trigger: "blur" },
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
  ],
  xh: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { max: 20, message: "学号长度不能超过20位", trigger: "blur" },
  ],
  xsxm: [
    { required: true, message: "请输入学生姓名", trigger: "blur" },
    { max: 36, message: "学生姓名长度不能超过36位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 获取字典数据
const loadDictOptions = async () => {
  try {
    const [reportTypeRes, teacherReviewRes] = await Promise.all([
      getReportTypeOptions() as any,
      getTeacherReviewStatusOptions() as any,
    ]);

    if (reportTypeRes.data.code === 200) {
      reportTypeOptions.value = reportTypeRes.data.data || [];
    }

    if (teacherReviewRes.data.code === 200) {
      teacherReviewStatusOptions.value = teacherReviewRes.data.data || [];
    }
  } catch (error) {
    console.error("加载字典数据失败:", error);
  }
};

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await pageOdsSxbgjlsj(queryParams) as any;
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.message || "查询失败");
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error("获取数据失败");
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
  queryForm.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
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

// 表格选择变化
const handleSelectionChange = (selection: OdsSxbgjlsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 状态相关方法
const getReportStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败",
  };
  return statusMap[status] || "未知";
};

const getReportStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    "0": "info",
    "1": "success",
    "2": "danger",
  };
  return typeMap[status] || "info";
};

// 日期时间格式化
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleString("zh-CN");
};

// 操作方法
const handleAdd = () => {
  resetForm();
  dialogType.value = "add";
  dialogVisible.value = true;
};

const handleEdit = async (row: OdsSxbgjlsjInfo) => {
  try {
    const response = await getOdsSxbgjlsjById(row.id) as any;
    if (response.data.code === 200) {
      const data = response.data.data;
      Object.assign(form, data);
      dialogType.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

const handleView = async (row: OdsSxbgjlsjInfo) => {
  try {
    const response = await getOdsSxbgjlsjById(row.id) as any;
    if (response.data.code === 200) {
      currentRecord.value = response.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(response.data.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

const handleDelete = async (row: OdsSxbgjlsjInfo) => {
  try {
    await ElMessageBox.confirm(
      "此操作将永久删除该实习报告记录数据，是否继续？",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await deleteOdsSxbgjlsj(row.id) as any;
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `此操作将永久删除选中的${selectedIds.value.length}条实习报告记录数据，是否继续？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await batchDeleteOdsSxbgjlsj(selectedIds.value) as any;
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

const handleExport = async () => {
  try {
    const response = await exportOdsSxbgjlsj(queryParams) as any  ;

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `实习报告记录数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
  }
};

// 导入相关方法
const handleImport = () => {
  importDialogVisible.value = true;
  importResult.value = null;
  selectedFile.value = null;
  fileList.value = [];
};

const handleFileChange = (file: any) => {
  selectedFile.value = file.raw;
  fileList.value = [file];
};

const handleExceed = () => {
  ElMessage.warning("只能选择一个文件进行导入");
};

const handleImportSubmit = async () => {
  if (!selectedFile.value) {
    ElMessage.warning("请选择要导入的文件");
    return;
  }

  // 文件大小检查（10MB）
  if (selectedFile.value.size > 10 * 1024 * 1024) {
    ElMessage.error("文件大小不能超过10MB");
    return;
  }

  // 文件类型检查
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  if (!allowedTypes.includes(selectedFile.value.type)) {
    ElMessage.error("只支持Excel文件格式（.xlsx, .xls）");
    return;
  }

  try {
    importLoading.value = true;
    
    const response = await importOdsSxbgjlsj(selectedFile.value) as any;
    
    if (response.data.code === 200) {
      importResult.value = response.data.data;
      ElMessage.success("导入完成");
      
      // 导入成功后关闭弹窗并刷新数据
      handleImportClose();
      getList();
    } else {
      ElMessage.error(response.data.message || "导入失败");
    }
  } catch (error) {
    console.error("导入失败:", error);
    ElMessage.error("导入失败");
  } finally {
    importLoading.value = false;
  }
};

const handleImportClose = () => {
  importDialogVisible.value = false;
  importResult.value = null;
  selectedFile.value = null;
  fileList.value = [];
  uploadRef.value?.clearFiles();
};

// 状态变更
const handleReportStatusClick = async (row: OdsSxbgjlsjInfo) => {
  const statusOptions = [
    { label: "未上报", value: "0" },
    { label: "已上报", value: "1" },
    { label: "上报失败", value: "2" },
  ];

  try {
    const { value } = await ElMessageBox.prompt(
      "请选择上报状态",
      "修改上报状态",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "select",
        inputOptions: statusOptions,
      },
    );

    const response = await updateOdsSxbgjlsjReportStatus(row.id, value) as any;
    if (response.data.code === 200) {
      ElMessage.success("修改成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "修改失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("修改上报状态失败:", error);
      ElMessage.error("修改失败");
    }
  }
};

const handleEnableStatusChange = async (row: OdsSxbgjlsjInfo) => {
  const originalStatus = row.enableStatus;
  row.statusLoading = true;

  try {
    const response = await updateOdsSxbgjlsjEnableStatus(
      row.id,
      row.enableStatus,
    ) as any;
    if (response.data.code === 200) {
      ElMessage.success("修改成功");
    } else {
      row.enableStatus = originalStatus;
      ElMessage.error(response.data.message || "修改失败");
    }
  } catch (error) {
    row.enableStatus = originalStatus;
    console.error("修改启用状态失败:", error);
    ElMessage.error("修改失败");
  } finally {
    row.statusLoading = false;
  }
};

// 表单相关方法
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    xh: "",
    xsxm: "",
    sxqymc: "",
    sxgwmc: "",
    sxzdjs: "",
    sxbglbm: "",
    sxbgnrzy: "",
    sxbgnr: "",
    sxbgtjrq: "",
    jspyztm: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

const handleFormSubmit = async () => {
  try {
    await formRef.value?.validate();

    submitLoading.value = true;
    let response;

    if (dialogType.value === "add") {
        response = await addOdsSxbgjlsj(form) as any;
    } else {
      response = await updateOdsSxbgjlsj(form) as any;
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogType.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.message || "操作失败");
    }
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("操作失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

const handleDetailClose = () => {
  viewDialogVisible.value = false;
  currentRecord.value = null;
};

// 表格行点击
const handleRowClick = (row: OdsSxbgjlsjInfo) => {
  // 可以添加行点击逻辑
};

const handleRowDblClick = (row: OdsSxbgjlsjInfo) => {
  handleView(row);
};

// 组件挂载
onMounted(() => {
  loadDictOptions();
  getList();
});
</script>

<style scoped lang="scss">
.entity-management {
  padding: 20px;

  .search-card {
    margin-bottom: 20px;

    .search-bar {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .table-card {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .operation-buttons {
        display: flex;
        gap: 10px;
      }

      .header-title {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
      }
    }

    .table-body {
      .action-buttons {
        display: flex;
        gap: 5px;
        justify-content: center;
      }
    }

    .pagination-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;

      .total-info {
        font-size: 14px;
        color: #606266;
      }
    }
  }

  .dialog-footer {
    text-align: right;
  }

  // 表单分组样式
  .form-section {
    margin-bottom: 30px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e4e7ed;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, #409eff, #66b1ff);
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
