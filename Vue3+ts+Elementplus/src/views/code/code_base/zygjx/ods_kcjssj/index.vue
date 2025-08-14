<template>
  <div class="course-construction-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="课程名称" prop="kcmc">
            <div style="display: flex; align-items: center">
              <el-input
                v-model="queryParams.kcmc"
                placeholder="请输入课程名称"
                clearable
                style="margin-right: 5px"
              />
            </div>
          </el-form-item>
          <el-form-item label="课程号" prop="kch">
            <div style="display: flex; align-items: center">
              <el-input
                v-model="queryParams.kch"
                placeholder="请输入课程号"
                clearable
                style="margin-right: 5px"
              />
            </div>
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
            :disabled="!multipleSelection.length"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">课程建设数据编码管理</div>
        <div class="placeholder">
          <el-tooltip content="导入Excel数据" placement="top">
            <el-button class="import-button" @click="handleImport">
              <el-icon><Upload /></el-icon>导入
            </el-button>
          </el-tooltip>
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
          :height="'calc(75vh - 130px)'"
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
            prop="kch"
            show-overflow-tooltip
            label="课程号"
            min-width="150"
            sortable="custom"
          />
          <el-table-column
            prop="kcmc"
            show-overflow-tooltip
            label="课程名称"
            min-width="180"
            sortable="custom"
          />
          <el-table-column
            prop="fzrh"
            show-overflow-tooltip
            label="负责人号"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="lxnd"
            show-overflow-tooltip
            label="立项年度"
            min-width="100"
            sortable="custom"
            align="center"
          />
          <el-table-column
            prop="kcjslbmText"
            show-overflow-tooltip
            label="建设类别"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="lxjf"
            show-overflow-tooltip
            label="立项经费"
            min-width="120"
            sortable="custom"
            align="right"
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
              {{ formatDisplayTime(row.sjcjsj) }}
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      class="course-construction-dialog"
      destroy-on-close
    >
      <!-- 查看模式 - 描述列表 -->
      <div v-if="dialogType === 'view'" class="course-construction-detail">
        <el-descriptions class="detail-descriptions" :column="2" border>
          <el-descriptions-item
            label="主键数据唯一性标识"
            label-class-name="label-title"
          >
            <span class="detail-value">{{ form.zjsjwyxbs || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <span class="detail-value">{{ form.xxdm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="课程名称">
            <span class="detail-value">{{ form.kcmc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="课程号">
            <span class="detail-value">{{ form.kch || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="负责人号">
            <span class="detail-value">{{ form.fzrh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="立项年度">
            <span class="detail-value">{{ form.lxnd || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="申请日期">
            <span class="detail-value">{{ formatDate(form.sqrq || "") }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="验收日期">
            <span class="detail-value">{{ formatDate(form.ysrq || "") }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="经费来源">
            <span class="detail-value">{{
              getFundSourceText(form.jflym || "")
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="立项经费">
            <span class="detail-value">{{
              form.lxjf ? `${form.lxjf}元` : "-"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="课程建设类别">
            <span class="detail-value">{{
              getCourseConstructionTypeText(form.kcjslbm || "")
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="所属单位名称">
            <span class="detail-value">{{ form.ssdwmc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间" :span="2">
            <span class="detail-value">{{
              formatDisplayTime(form.sjcjsj || "")
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="getEnableStatusType(form.enableStatus || '1')"
              size="small"
            >
              {{ getEnableStatusText(form.enableStatus || "1") }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusType(form.reportStatus || '0')"
              size="small"
            >
              {{ getReportStatusText(form.reportStatus || "0") }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 编辑/新增模式 - 表单 -->
      <div v-else class="course-construction-form">
        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="120px"
          class="form-container dialog-form"
        >
          <!-- 基本信息区域 -->
          <div class="form-section">
            <div class="section-title">基本信息</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                  <div class="input-with-icon">
                    <el-input
                      v-model="form.zjsjwyxbs"
                      placeholder="可不填，后端自动生成32位唯一标识"
                      maxlength="32"
                      show-word-limit
                      style="text-transform: uppercase"
                      @input="handleZjsjwyxbsInput"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学校代码" prop="xxdm">
                  <div class="input-with-icon">
                    <el-input
                      v-model="form.xxdm"
                      placeholder="系统自动获取（10位数字码）"
                      maxlength="10"
                      readonly
                      disabled
                    />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="课程名称" prop="kcmc">
                  <div class="input-with-warning">
                    <el-select
                      v-model="form.kcmc"
                      placeholder="请输入课程名称进行搜索"
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="searchCoursesMethod"
                      :loading="courseSearchLoading"
                      @change="handleCourseNameChange"
                    >
                      <el-option
                        v-for="course in courseOptions"
                        :key="course.id"
                        :label="course.kcmc"
                        :value="course.kcmc"
                      >
                        <div
                          style="display: flex; justify-content: space-between"
                        >
                          <span>{{ course.kcmc }}</span>
                          <span style="color: #8492a6; font-size: 13px">{{
                            course.kch
                          }}</span>
                        </div>
                      </el-option>
                    </el-select>
                    <el-icon
                      class="warning-icon"
                      @mouseenter="
                        showTooltip($event, '从课程基本数据子类表中获取数据')
                      "
                      @mouseleave="hideTooltip"
                    >
                      <Warning />
                    </el-icon>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="课程号" prop="kch">
                  <div class="input-with-warning">
                    <el-select
                      v-model="form.kch"
                      placeholder="请输入课程号进行搜索"
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="searchCoursesMethod"
                      :loading="courseSearchLoading"
                      @change="handleCourseCodeChange"
                    >
                      <el-option
                        v-for="course in courseOptions"
                        :key="course.id"
                        :label="course.kch"
                        :value="course.kch"
                      >
                        <div
                          style="display: flex; justify-content: space-between"
                        >
                          <span>{{ course.kch }}</span>
                          <span style="color: #8492a6; font-size: 13px">{{
                            course.kcmc
                          }}</span>
                        </div>
                      </el-option>
                    </el-select>
                    <el-icon
                      class="warning-icon"
                      @mouseenter="
                        showTooltip($event, '从课程基本数据子类表中获取数据')
                      "
                      @mouseleave="hideTooltip"
                    >
                      <Warning />
                    </el-icon>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="负责人号" prop="fzrh">
                  <el-input
                    v-model="form.fzrh"
                    placeholder="请输入负责人号"
                    maxlength="20"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="立项年度" prop="lxnd">
                  <el-input
                    v-model="form.lxnd"
                    placeholder="请输入4位年份，如: 2025"
                    maxlength="4"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 详细信息区域 -->
          <div class="form-section">
            <div class="section-title">详细信息</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="申请日期" prop="sqrq">
                  <el-date-picker
                    v-model="form.sqrq"
                    type="date"
                    placeholder="请选择申请日期"
                    value-format="YYYYMMDD"
                    format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="验收日期" prop="ysrq">
                  <el-date-picker
                    v-model="form.ysrq"
                    type="date"
                    placeholder="请选择验收日期"
                    value-format="YYYYMMDD"
                    format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="经费来源" prop="jflym">
                  <el-select
                    v-model="form.jflym"
                    placeholder="请选择经费来源"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in fundSourceOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="立项经费" prop="lxjf">
                  <el-input-number
                    v-model="form.lxjf"
                    :min="0"
                    :precision="2"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="课程建设类别" prop="kcjslbm">
                  <el-select
                    v-model="form.kcjslbm"
                    placeholder="请选择课程建设类别"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in courseConstructionTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属单位名称" prop="ssdwmc">
                  <el-input
                    v-model="form.ssdwmc"
                    placeholder="请输入所属单位名称"
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
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
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
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
              <el-col :span="12">
                <!-- 预留空位 -->
              </el-col>
            </el-row>
            <!-- 查看模式下显示创建时间和更新时间 -->
            <el-row v-if="dialogType === 'view'" :gutter="20">
              <el-col :span="12">
                <el-form-item label="创建时间">
                  <el-input
                    :value="formatDateTime(currentRecord?.createTime)"
                    readonly
                    disabled
                    style="background-color: #f5f7fa"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新时间">
                  <el-input
                    :value="formatDateTime(currentRecord?.updateTime)"
                    readonly
                    disabled
                    style="background-color: #f5f7fa"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose">{{
            dialogType === "view" ? "关闭" : "取消"
          }}</el-button>
          <el-button
            v-if="dialogType !== 'view'"
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入课程建设数据"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        drag
        accept=".xls,.xlsx"
        :limit="1"
        :auto-upload="true"
        :before-upload="beforeUpload"
        :http-request="customHttpRequest"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            <span>支持上传.xls、.xlsx格式文件，最大10MB</span>
            <el-tooltip :content="importTipContent" placement="top">
              <el-icon class="import-tip-icon"><Warning /></el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed, onUnmounted } from "vue";
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
  Upload,
  UploadFilled,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getCourseConstructionDataPage,
  getCourseConstructionDataById,
  addCourseConstructionData,
  updateCourseConstructionData,
  deleteCourseConstructionData,
  batchDeleteCourseConstructionData,
  exportCourseConstructionData,
  importCourseConstructionData,
  getFundSourceOptions,
  getCourseConstructionTypeOptions,
  searchCourses,
  getSystemSchoolCode,
  type OdsKcjssjInfo,
  type OdsKcjssjQuery,
  type OdsKcjssjForm,
  type CourseBasicInfo,
} from "@/api-code/code/code_base/zygjx/ods_kcjssj";

// 查询参数
const queryParams = reactive<OdsKcjssjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  kcmc: "",
  kch: "",
  pageNum: 1,
  pageSize: 100,
});

// 表格数据
const dataList = ref<OdsKcjssjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const multipleSelection = ref<OdsKcjssjInfo[]>([]);

// 查询表单引用
const queryFormRef = ref<FormInstance>();

// 表单数据
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const formRef = ref<FormInstance>();
const currentRecord = ref<OdsKcjssjInfo | null>(null);

// 导入相关
const importDialogVisible = ref(false);
const uploadRef = ref();

// 计算属性 - 对话框标题
const dialogTitle = computed(() => {
  const titles = {
    add: "新增课程建设数据",
    edit: "编辑课程建设数据",
    view: "查看课程建设数据",
  };
  return titles[dialogType.value];
});

// 表单数据
const form = reactive<OdsKcjssjForm>({
  id: undefined,
  zjsjwyxbs: "", // 主键数据唯一性标识 - 32位大写字母+数字组合
  xxdm: "", // 学校代码 - 10位数字码
  kcmc: "", // 课程名称 - 最大60字符
  kch: "", // 课程号 - 最大50字符
  fzrh: "", // 负责人号 - 最大20字符，必填
  sqrq: "", // 申请日期 - 8位YYYYMMDD格式，可选
  lxnd: "", // 立项年度 - 4位YYYY格式，必填
  ysrq: "", // 验收日期 - 8位YYYYMMDD格式，可选
  jflym: "", // 经费来源码 - 2位字符，可选
  lxjf: 0, // 立项经费 - 数值，可选
  ssdwmc: "", // 所属单位名称 - 最大200字符，可选
  kcjslbm: "", // 课程建设类别码 - 2位字符，可选
  sjcjsj: "", // 数据采集时间 - 15位YYYYMMDDhhmmss格式，必填
  reportStatus: "0", // 上报状态
  enableStatus: "1", // 启用状态
});

// 表单验证规则
const formRules = reactive<FormRules>({
  zjsjwyxbs: [
    {
      required: false,
      message: "主键数据唯一性标识可不填，后端自动生成",
      trigger: "blur",
    },
    { len: 32, message: "主键数据唯一性标识必须为32位", trigger: "blur" },
    {
      pattern: /^[A-Z0-9]{32}$/,
      message: "主键数据唯一性标识必须为32位大写字母和数字组合",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码为必填项", trigger: "blur" },
    { len: 10, message: "学校代码必须为10位数字码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须为10位数字", trigger: "blur" },
  ],
  kcmc: [
    { required: true, message: "请输入课程名称", trigger: "blur" },
    { max: 60, message: "课程名称长度不能超过60个字符", trigger: "blur" },
  ],
  kch: [
    { required: true, message: "请输入课程号", trigger: "blur" },
    { max: 50, message: "课程号长度不能超过50个字符", trigger: "blur" },
  ],
  fzrh: [
    { required: true, message: "请输入负责人号", trigger: "blur" },
    { max: 20, message: "负责人号长度不能超过20个字符", trigger: "blur" },
  ],
  lxnd: [
    { required: true, message: "请输入立项年度", trigger: "blur" },
    { len: 4, message: "立项年度必须为4位数字", trigger: "blur" },
    {
      pattern: /^\d{4}$/,
      message: "立项年度格式错误，应为YYYY格式",
      trigger: "blur",
    },
  ],
  sqrq: [
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value && !/^\d{8}$/.test(value)) {
          callback(new Error("申请日期格式错误，应为YYYYMMDD格式"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  ysrq: [
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value && !/^\d{8}$/.test(value)) {
          callback(new Error("验收日期格式错误，应为YYYYMMDD格式"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  jflym: [
    { max: 2, message: "经费来源码长度不能超过2个字符", trigger: "change" },
  ],
  lxjf: [
    { type: "number", min: 0, message: "立项经费不能为负数", trigger: "blur" },
  ],
  ssdwmc: [
    { max: 200, message: "所属单位名称长度不能超过200个字符", trigger: "blur" },
  ],
  kcjslbm: [
    { max: 2, message: "课程建设类别码长度不能超过2个字符", trigger: "change" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 字典数据
const fundSourceOptions = ref<Array<{ label: string; value: string }>>([]);
const courseConstructionTypeOptions = ref<
  Array<{ label: string; value: string }>
>([]);

// 课程搜索相关
const courseOptions = ref<CourseBasicInfo[]>([]);
const courseSearchLoading = ref(false);

// 提示框相关
const tooltipDiv = ref<HTMLDivElement | null>(null);

// 显示提示框
const showTooltip = (event: MouseEvent, content: string) => {
  if (!tooltipDiv.value) {
    tooltipDiv.value = document.createElement("div");
    tooltipDiv.value.style.position = "fixed";
    tooltipDiv.value.style.padding = "8px 12px";
    tooltipDiv.value.style.backgroundColor = "#fff";
    tooltipDiv.value.style.border = "1px solid #e4e7ed";
    tooltipDiv.value.style.borderRadius = "4px";
    tooltipDiv.value.style.fontSize = "12px";
    tooltipDiv.value.style.color = "#606266";
    tooltipDiv.value.style.zIndex = "9999";
    tooltipDiv.value.style.boxShadow = "0 2px 12px 0 rgba(0,0,0,.1)";
    document.body.appendChild(tooltipDiv.value);
  }

  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();

  if (tooltipDiv.value) {
    tooltipDiv.value.textContent = content;
    tooltipDiv.value.style.left = rect.left + "px";
    tooltipDiv.value.style.top = rect.top - 30 + "px";
    tooltipDiv.value.style.display = "block";
  }
};

// 隐藏提示框
const hideTooltip = () => {
  if (tooltipDiv.value) {
    tooltipDiv.value.style.display = "none";
  }
};

// 组件卸载时清理
onUnmounted(() => {
  if (tooltipDiv.value && document.body.contains(tooltipDiv.value)) {
    document.body.removeChild(tooltipDiv.value);
  }
});

// 初始化
onMounted(() => {
  getList();
  loadDictData();
  getSchoolCode();
});

// 加载字典数据
const loadDictData = async () => {
  try {
    const [fundSource, courseConstructionType] = await Promise.all([
      getFundSourceOptions(),
      getCourseConstructionTypeOptions(),
    ]);
    fundSourceOptions.value = (fundSource as any)?.data?.data || [];
    courseConstructionTypeOptions.value =
      (courseConstructionType as any)?.data?.data || [];
  } catch (error) {
    console.error("加载字典数据失败:", error);
  }
};

// 获取系统学校代码
const getSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const apiResponse = response as unknown as {
      data: { code: number; data: string; message?: string };
    };
    if (apiResponse?.data?.code === 200 && apiResponse.data.data) {
      form.xxdm = apiResponse.data.data;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取学校代码失败");
    }
  } catch (error: any) {
    console.error("获取学校代码失败:", error);
    ElMessage.error(error.message || "获取学校代码失败");
  }
};

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await getCourseConstructionDataPage(queryParams);
    // 使用类型断言处理API响应格式
    const responseData = (response as any)?.data?.data || {};
    dataList.value = responseData.records || [];
    total.value = responseData.total || 0;
  } catch (error) {
    ElMessage.error("查询数据失败");
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
  Object.keys(queryParams).forEach((key) => {
    if (key !== "pageNum" && key !== "pageSize") {
      (queryParams as any)[key] = "";
    }
  });
  queryParams.pageNum = 1;
  queryFormRef.value?.resetFields();
  getList();
};

// 表格选择事件
const handleSelectionChange = (selection: OdsKcjssjInfo[]) => {
  multipleSelection.value = selection;
};

// 分页大小变更
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

// 分页页码变更
const handleCurrentChange = (current: number) => {
  queryParams.pageNum = current;
  getList();
};

// 新增
const handleAdd = async () => {
  dialogType.value = "add";
  await resetForm();
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsKcjssjInfo) => {
  dialogType.value = "edit";
  resetFormSync();
  try {
    const response = await getCourseConstructionDataById(row.id);
    // 使用类型断言处理API响应格式
    const data = (response as any)?.data?.data || {};
    Object.assign(form, data);
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

// 查看
const handleView = async (row: OdsKcjssjInfo) => {
  dialogType.value = "view";
  resetFormSync();
  try {
    const response = await getCourseConstructionDataById(row.id);
    // 使用类型断言处理API响应格式
    const data = (response as any)?.data?.data || {};
    currentRecord.value = data;
    Object.assign(form, data);
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

// 删除
const handleDelete = (row: OdsKcjssjInfo) => {
  ElMessageBox.confirm(`确认删除课程建设数据"${row.kcmc}"吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await deleteCourseConstructionData(row.id);
        ElMessage.success("删除成功");
        getList();
      } catch (error) {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

// 批量删除
const handleBatchDelete = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确认批量删除选中的${multipleSelection.value.length}条课程建设数据吗？`,
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      try {
        await batchDeleteCourseConstructionData(
          multipleSelection.value.map((item) => item.id),
        );
        ElMessage.success("批量删除成功");
        getList();
      } catch (error) {
        ElMessage.error("批量删除失败");
      }
    })
    .catch(() => {});
};

// 导出
const handleExport = () => {
  ElMessageBox.confirm("确认导出课程建设数据吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(async () => {
      try {
        await exportCourseConstructionData(queryParams);
        ElMessage.success("导出成功");
      } catch (error: any) {
        console.error("导出失败:", error);
        ElMessage.error(error.message || "导出失败");
      }
    })
    .catch(() => {});
};

// 导入操作
const handleImport = () => {
  importDialogVisible.value = true;
};

// 导入提示内容
const importTipContent = `导入说明：\n1. 第一行为字段中文名称，第二行为字段英文名称\n2. 从第三行开始录入数据\n3. 如果唯一标识为空，系统将自动生成\n4. 采集时间将统一设置为当前时间\n5. 支持.xls和.xlsx格式文件，大小不超过10MB`;

// 上传前校验
const beforeUpload = (rawFile: any) => {
  const isExcel =
    rawFile.type === "application/vnd.ms-excel" ||
    rawFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isExcel) {
    ElMessage.error("请上传.xls或.xlsx格式的Excel文件");
    return false;
  }
  const isLt10M = rawFile.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error("文件大小不能超过10MB");
    return false;
  }
  return true;
};

// 自定义上传实现
const customHttpRequest = async (options: any) => {
  const { file, onSuccess, onError } = options;
  try {
    const response = (await importCourseConstructionData(file)) as any;
    if (response && response.data && response.data.code === 200) {
      ElMessage.success("导入成功");
      importDialogVisible.value = false;
      getList();
      onSuccess(response.data);
    } else {
      ElMessage.error(response?.data?.message || "导入失败");
      onError(new Error("导入失败"));
    }
  } catch (error: any) {
    ElMessage.error(error.message || "导入失败");
    onError(error);
  } finally {
    uploadRef.value?.clearFiles();
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    submitLoading.value = true;
    try {
      if (dialogType.value === "add") {
        await addCourseConstructionData(form);
        ElMessage.success("新增成功");
      } else {
        await updateCourseConstructionData(form);
        ElMessage.success("修改成功");
      }
      dialogVisible.value = false;
      getList();
    } catch (error) {
      ElMessage.error(dialogType.value === "add" ? "新增失败" : "修改失败");
    } finally {
      submitLoading.value = false;
    }
  });
};

// 重置表单
const resetForm = async () => {
  Object.keys(form).forEach((key) => {
    (form as any)[key] = undefined;
  });

  // 设置一些必要的默认值
  if (dialogType.value === "add") {
    await getSchoolCode(); // 获取并设置学校代码
    form.enableStatus = "1"; // 设置默认启用状态
    form.reportStatus = "0"; // 设置默认上报状态
    // 设置当前时间为默认数据采集时间（15位格式：YYYYMMDDhhmmss）
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const second = now.getSeconds().toString().padStart(2, "0");
    form.sjcjsj = `${year}${month}${day}${hour}${minute}${second}`;
  }

  nextTick(() => {
    formRef.value?.resetFields();
  });
};

// 重置表单（不包含异步操作）
const resetFormSync = () => {
  Object.keys(form).forEach((key) => {
    (form as any)[key] = undefined;
  });

  nextTick(() => {
    formRef.value?.resetFields();
  });
};

// 关闭表单
const handleFormClose = () => {
  dialogVisible.value = false;
  resetFormSync();
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败",
  };
  return statusMap[status] || status;
};

// 获取上报状态标签类型
const getReportStatusType = (status: string) => {
  switch (status) {
    case "0":
      return "warning";
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "info";
  }
};

// 获取启用状态文本
const getEnableStatusText = (status: string) => {
  return status === "1" ? "启用" : "禁用";
};

// 获取启用状态类型
const getEnableStatusType = (status: string) => {
  return status === "1" ? "success" : "danger";
};

// 获取格式化的时间
const formatDisplayTime = (timestamp: string) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// 格式化日期（YYYYMMDD -> YYYY-MM-DD）
const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr.length !== 8) return "-";
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}-${month}-${day}`;
};

// 格式化日期时间（用于创建时间和更新时间）
const formatDateTime = (dateTime: string | null | undefined) => {
  if (!dateTime) return "-";
  try {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return "-";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return "-";
  }
};

// 获取经费来源文本
const getFundSourceText = (value: string) => {
  if (!value) return "-";
  const option = fundSourceOptions.value.find((item) => item.value === value);
  return option ? option.label : value;
};

// 获取课程建设类别文本
const getCourseConstructionTypeText = (value: string) => {
  if (!value) return "-";
  const option = courseConstructionTypeOptions.value.find(
    (item) => item.value === value,
  );
  return option ? option.label : value;
};

// 处理主键数据唯一性标识输入
const handleZjsjwyxbsInput = (value: string) => {
  form.zjsjwyxbs = value.toUpperCase();
};

// 搜索课程信息
const searchCoursesMethod = async (keyword: string) => {
  if (!keyword || keyword.trim() === "") {
    courseOptions.value = [];
    return;
  }

  courseSearchLoading.value = true;
  try {
    const response = await searchCourses(keyword.trim(), 20);
    courseOptions.value = (response as any)?.data?.data || [];
  } catch (error) {
    console.error("搜索课程信息失败:", error);
    ElMessage.error("搜索课程信息失败");
    courseOptions.value = [];
  } finally {
    courseSearchLoading.value = false;
  }
};

// 处理课程名称选择
const handleCourseNameChange = (kcmc: string) => {
  const selectedCourse = courseOptions.value.find(
    (course) => course.kcmc === kcmc,
  );
  if (selectedCourse) {
    form.kch = selectedCourse.kch;
    form.kcmc = selectedCourse.kcmc;
  }
};

// 处理课程号选择
const handleCourseCodeChange = (kch: string) => {
  const selectedCourse = courseOptions.value.find(
    (course) => course.kch === kch,
  );
  if (selectedCourse) {
    form.kch = selectedCourse.kch;
    form.kcmc = selectedCourse.kcmc;
  }
};
</script>

<style scoped>
/* 页面整体布局 */
.course-construction-management {
  .search-card {
    height: 60px;
  }

  .search-bar {
    margin-top: -8px;
    :deep(.el-form) {
      margin-bottom: 0;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }
    }

    :deep(.el-form-item__label) {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
    }

    :deep(.el-input) {
      width: 200px;
    }

    :deep(.el-select) {
      width: 200px;
    }
  }

  .table-card {
    margin-top: -12px;
    :deep(.el-card__body) {
      padding: 5px;
    }
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .operation-buttons {
      display: flex;
      align-items: center;

      .el-button {
        margin-right: 10px;
        font-size: 14px;

        &:last-child {
          margin-right: 0;
        }
      }

      .el-divider--vertical {
        margin: 0 15px;
        height: 18px;
      }
    }

    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .placeholder {
      display: flex;
      align-items: center;
    }
  }

  .table-body {
    :deep(.el-table) {
      border-radius: 4px;
      overflow: hidden;

      .el-table__header {
        th {
          background-color: #fafafa;
          color: #606266;
          font-weight: 600;
          font-size: 14px;
          border-bottom: 1px solid #ebeef5;
        }
      }

      .el-table__body {
        tr {
          &:hover {
            background-color: #f5f7fa;
          }
        }

        td {
          font-size: 14px;
          color: #606266;
          border-bottom: 1px solid #ebeef5;
        }
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;

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

      .el-select .el-input {
        width: 100px;
      }
    }
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

  .course-construction-dialog {
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
}

/* 详情查看样式 */
.course-construction-detail {
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

/* 弹窗表单样式 */
:deep(.dialog-form) {
  .el-form-item {
    margin-bottom: 18px;
  }

  .el-form-item__label {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
  }

  .el-input__wrapper {
    height: 32px;
    border-radius: 4px;
  }

  .el-select .el-input__wrapper {
    height: 32px;
  }

  .el-input-number {
    width: 100%;

    .el-input__wrapper {
      height: 32px;
    }
  }

  .el-date-editor {
    width: 100%;

    .el-input__wrapper {
      height: 32px;
    }
  }
}

/* 表单样式 */
.course-construction-form {
  .form-container {
    max-height: 65vh;
    overflow-y: auto;
    padding: 0 20px;
  }

  .form-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e4e7ed;
    }

    :deep(.el-form-item) {
      margin-bottom: 18px;

      .el-form-item__content {
        flex: 1;
        width: 0; /* 确保flex布局正常工作 */
      }
    }

    :deep(.el-input),
    :deep(.el-select),
    :deep(.el-date-editor),
    :deep(.el-input-number) {
      width: 100%;
    }

    .input-with-warning {
      display: flex;
      align-items: center;
      width: 100%;

      :deep(.el-select),
      :deep(.el-input),
      :deep(.el-date-editor),
      :deep(.el-input-number) {
        flex: 1;
      }

      .warning-icon {
        color: #e6a23c;
        margin-left: 8px;
        font-size: 16px;
        cursor: pointer;
        flex-shrink: 0;
      }
    }
  }
}

:deep(.el-form-item__label) {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  width: 120px !important; /* 确保所有标签宽度一致 */
  text-align: right;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  height: 32px;
  border-radius: 4px;
}

/* 导入按钮样式 */
.import-button {
  background-color: #ffffff !important;
  border-color: #dcdfe6 !important;
  color: #606266 !important;
}

/* 导入提示图标 */
:deep(.import-tip-icon) {
  margin-left: 4px;
  color: #e6a23c;
  cursor: pointer;
}
</style>
