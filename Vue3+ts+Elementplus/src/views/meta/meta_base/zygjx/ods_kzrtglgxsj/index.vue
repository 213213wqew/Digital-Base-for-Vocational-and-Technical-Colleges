<template>
  <div class="course-certificate-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="课程名称" prop="kcmc">
            <el-input
              v-model="queryParams.kcmc"
              placeholder="请输入课程名称"
              clearable
              @keyup.enter="handleQuery"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="课程号" prop="kch">
            <el-input
              v-model="queryParams.kch"
              placeholder="请输入课程号"
              clearable
              @keyup.enter="handleQuery"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="证书号" prop="zsh">
            <el-input
              v-model="queryParams.zsh"
              placeholder="请输入证书号"
              clearable
              @keyup.enter="handleQuery"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="证书名称" prop="zsmc">
            <el-input
              v-model="queryParams.zsmc"
              placeholder="请输入证书名称"
              clearable
              @keyup.enter="handleQuery"
              style="width: 180px"
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
        <div class="header-title">课证融通关联关系数据子类表</div>
        <div class="placeholder">
          <!-- <el-button type="warning" @click="handleImport">
            <el-icon><Upload /></el-icon>导入Excel
          </el-button> -->
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
          :height="'calc(75vh - 100px)'"
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
            sortable="custom"
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="kcmc"
            label="课程名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="kch"
            label="课程号"
            width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zsh"
            label="证书号"
            width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zsmc"
            label="证书名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="数据采集时间"
            width="160"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDisplayTime(row.sjcjsj) }}
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
                :type="getEnableStatusTagType(row.enableStatus)"
                size="small"
              >
                {{ getEnableStatusText(row.enableStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="160"
            show-overflow-tooltip
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
      class="course-certificate-dialog"
      destroy-on-close
    >
      <!-- 查看模式 - 描述列表 -->
      <div v-if="dialogType === 'view'" class="course-certificate-detail">
        <el-descriptions class="detail-descriptions" :column="2" border>
          <el-descriptions-item label="主键数据唯一性标识">
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
          <el-descriptions-item label="证书号">
            <span class="detail-value">{{ form.zsh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="证书名称">
            <span class="detail-value">{{ form.zsmc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间" :span="2">
            <span class="detail-value">{{
              formatDisplayTime(form.sjcjsj || "")
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="getEnableStatusTagType(form.enableStatus || '1')"
              size="small"
            >
              {{ getEnableStatusText(form.enableStatus || "1") }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusTagType(form.reportStatus || '0')"
              size="small"
            >
              {{ getReportStatusText(form.reportStatus || "0") }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <span class="detail-value">{{ formatDateTime(currentRecord?.createTime) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <span class="detail-value">{{ formatDateTime(currentRecord?.updateTime) }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 新增/编辑模式 - 表单 -->
      <div v-else class="course-certificate-form">
        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="140px"
          class="form-container"
        >
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">基本信息</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                  <el-input
                    v-model="form.zjsjwyxbs"
                    placeholder="可选填，不填将自动生成32位唯一编码（大写字母和数字组合）"
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
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="课程名称" prop="kcmc">
                  <div class="input-with-warning">
                    <el-select
                      v-model="form.kcmc"
                      placeholder="请搜索并选择课程名称"
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="searchCoursesMethod"
                      :loading="courseSearchLoading"
                      @change="handleCourseNameChange"
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="course in courseOptions"
                        :key="course.id"
                        :label="course.kcmc"
                        :value="course.kcmc"
                        :disabled="false"
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
                      placeholder="请搜索并选择课程号"
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="searchCoursesMethod"
                      :loading="courseSearchLoading"
                      @change="handleCourseCodeChange"
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="course in courseOptions"
                        :key="course.id"
                        :label="course.kch"
                        :value="course.kch"
                        :disabled="false"
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
          </div>

          <!-- 证书信息 -->
          <div class="form-section">
            <div class="section-title">证书信息</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="证书号" prop="zsh">
                  <div class="input-with-warning">
                    <el-select
                      v-model="form.zsh"
                      placeholder="请选择证书号"
                      filterable
                      @change="handleCertificateNumberChange"
                      @focus="loadCertificateOptions"
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="certificate in certificateOptions"
                        :key="certificate.id"
                        :label="certificate.zsh"
                        :value="certificate.zsh"
                        :disabled="false"
                      >
                        <div
                          style="display: flex; justify-content: space-between"
                        >
                          <span>{{ certificate.zsh }}</span>
                          <span style="color: #8492a6; font-size: 13px">{{
                            certificate.zsmc
                          }}</span>
                        </div>
                      </el-option>
                    </el-select>
                    <el-icon
                      class="warning-icon"
                      @mouseenter="
                        showTooltip($event, '从1+X证书数据子类表中获取数据')
                      "
                      @mouseleave="hideTooltip"
                    >
                      <Warning />
                    </el-icon>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="证书名称" prop="zsmc">
                  <div class="input-with-warning">
                    <el-select
                      v-model="form.zsmc"
                      placeholder="请选择证书名称"
                      filterable
                      @change="handleCertificateNameChange"
                      @focus="loadCertificateOptions"
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="certificate in certificateOptions"
                        :key="certificate.id"
                        :label="certificate.zsmc"
                        :value="certificate.zsmc"
                        :disabled="false"
                      >
                        <div
                          style="display: flex; justify-content: space-between"
                        >
                          <span>{{ certificate.zsmc }}</span>
                          <span style="color: #8492a6; font-size: 13px">{{
                            certificate.zsh
                          }}</span>
                        </div>
                      </el-option>
                    </el-select>
                    <el-icon
                      class="warning-icon"
                      @mouseenter="
                        showTooltip($event, '从1+X证书数据子类表中获取数据')
                      "
                      @mouseleave="hideTooltip"
                    >
                      <Warning />
                    </el-icon>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 其他信息 -->
          <div class="form-section">
            <div class="section-title">其他信息</div>
            <el-row :gutter="20">
              <el-col :span="24">
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
                    <el-option label="启用" value="1" />
                    <el-option label="禁用" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogType !== 'view'"
            type="primary"
            :loading="submitLoading"
            @click="handleSubmit"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入课证融通关联关系数据"
      width="600px"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
    >
      <div class="import-content">
        <div class="upload-area" style="margin-top: 20px">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            drag
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-change="handleUploadChange"
            :limit="1"
            accept=".xlsx,.xls"
            :file-list="[]"
          >
            <el-icon class="el-icon--upload"><Upload /></el-icon>
            <div class="el-upload__text">
              将Excel文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 Excel 文件，且不超过 10MB
              </div>
            </template>
          </el-upload>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="importDialogVisible = false"
            :disabled="importLoading"
            >取消</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
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
  Warning,
} from "@element-plus/icons-vue";
import {
  getOdsKzrtglgxsjPage,
  getOdsKzrtglgxsjById,
  addOdsKzrtglgxsj,
  updateOdsKzrtglgxsj,
  deleteOdsKzrtglgxsj,
  exportOdsKzrtglgxsj,
  importOdsKzrtglgxsj,
  type OdsKzrtglgxsjVO,
  type OdsKzrtglgxsjQuery,
  type OdsKzrtglgxsjDTO,
} from "@/api/meta/meta_base/zygjx/ods_kzrtglgxsj";
import { getSystemSchoolCode } from "@/api/meta/meta_base/zygjx/ods_gjptzydjsj";
import {
  searchCourses,
  type CourseBasicInfo,
} from "@/api/meta/meta_base/zygjx/ods_kcjssj";
import {
  searchCertificates,
  type CertificateBasicInfo,
} from "@/api/meta/meta_base/zygjx/ods_kzrtglgxsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsKzrtglgxsjVO[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const currentRecord = ref<OdsKzrtglgxsjVO | null>(null);

// 课程相关数据
const courseOptions = ref<CourseBasicInfo[]>([]);
const courseSearchLoading = ref(false);

// 证书相关数据
const certificateOptions = ref<CertificateBasicInfo[]>([]);
const certificateSearchLoading = ref(false);

// 提示框相关
const tooltipDiv = ref<HTMLDivElement | null>(null);

// 导入相关数据
const importDialogVisible = ref(false);
const importLoading = ref(false);
const uploadRef = ref<any>(null);

// 表单引用
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<OdsKzrtglgxsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  kcmc: "",
  kch: "",
  zsh: "",
  zsmc: "",
  pageNum: 1,
  pageSize: 100,
});

// 计算属性 - 对话框标题
const dialogTitle = computed(() => {
  const titles = {
    add: "新增课证融通关联关系数据",
    edit: "编辑课证融通关联关系数据",
    view: "查看课证融通关联关系数据",
  };
  return titles[dialogType.value];
});

// 表单数据
const form = reactive<OdsKzrtglgxsjDTO>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  kcmc: "",
  kch: "",
  zsh: "",
  zsmc: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = computed(() => ({
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
          callback(new Error("如果填写，必须是32位字符"));
          return;
        }
        if (!/^[A-Z0-9]{32}$/.test(value)) {
          callback(new Error("只能包含大写字母和数字"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码系统自动获取", trigger: "blur" },
    { len: 10, message: "学校代码必须是10位数字码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码只能是数字", trigger: "blur" },
  ],
  kcmc: [
    { required: true, message: "请输入课程名称", trigger: "blur" },
    { max: 60, message: "课程名称长度不能超过60个字符", trigger: "blur" },
  ],
  kch: [
    { required: true, message: "请输入课程号", trigger: "blur" },
    { max: 50, message: "课程号长度不能超过50个字符", trigger: "blur" },
  ],
  zsh: [{ max: 50, message: "证书号长度不能超过50个字符", trigger: "blur" }],
  zsmc: [
    { max: 100, message: "证书名称长度不能超过100个字符", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
}));

// 方法实现
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsKzrtglgxsjPage(queryParams);
    const data = response.data.data || response.data;
    dataList.value = data.records || [];
    total.value = data.total || 0;
  } catch (error) {
    ElMessage.error("查询数据失败");
  } finally {
    loading.value = false;
  }
};

const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

const resetQuery = () => {
  queryFormRef.value?.resetFields();
  Object.assign(queryParams, { pageNum: 1, pageSize: 20 });
  getList();
};

const handleSelectionChange = (selection: OdsKzrtglgxsjVO[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

const handleAdd = async () => {
  dialogType.value = "add";
  resetForm();
  // 获取学校代码
  await getSchoolCode();
  dialogVisible.value = true;
};

const handleEdit = async (row: OdsKzrtglgxsjVO) => {
  await openDialog("edit", row);
};

const handleView = async (row: OdsKzrtglgxsjVO) => {
  await openDialog("view", row);
};

const openDialog = async (type: "edit" | "view", row: OdsKzrtglgxsjVO) => {
  dialogType.value = type;
  try {
    const response = await getOdsKzrtglgxsjById(row.id);
    const data =
      (response as any)?.data?.data || (response as any)?.data || response;
    currentRecord.value = data;
    Object.assign(form, data);
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

const handleDelete = async (row: OdsKzrtglgxsjVO) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除课证融通关联关系数据"${row.kcmc}"吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );
    await deleteOdsKzrtglgxsj(row.id.toString());
    ElMessage.success("删除成功");
    getList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的${selectedIds.value.length}条记录吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );
    await deleteOdsKzrtglgxsj(selectedIds.value.join(","));
    ElMessage.success("批量删除成功");
    getList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("批量删除失败");
    }
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    if (dialogType.value === "add") {
      await addOdsKzrtglgxsj(form);
      ElMessage.success("新增成功");
    } else {
      await updateOdsKzrtglgxsj(form);
      ElMessage.success("修改成功");
    }

    dialogVisible.value = false;
    getList();
  } catch (error) {
    ElMessage.error(dialogType.value === "add" ? "新增失败" : "修改失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleExport = async () => {
  try {
    const response = await exportOdsKzrtglgxsj(queryParams);

    // ArrayBuffer类型的响应数据在response.data中
    const arrayBuffer = (response as any).data || response;

    // 创建下载链接
    const blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `课证融通关联关系数据_${new Date().getTime()}.xlsx`;
    link.click();

    // 清理
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败，请稍后重试");
  }
};

const handleImport = () => {
  importDialogVisible.value = true;
};

const handleUploadChange = async (file: any) => {
  if (!file) return;

  // 验证文件类型
  const fileName = file.name;
  if (
    !fileName.toLowerCase().endsWith(".xlsx") &&
    !fileName.toLowerCase().endsWith(".xls")
  ) {
    ElMessage.error("只支持 Excel 文件格式 (.xlsx, .xls)");
    return;
  }

  // 验证文件大小 (10MB)
  const fileSize = file.size || file.raw?.size;
  if (fileSize > 10 * 1024 * 1024) {
    ElMessage.error("文件大小不能超过 10MB");
    return;
  }

  try {
    importLoading.value = true;

    const fileToUpload = file.raw || file;
    const response = await importOdsKzrtglgxsj(fileToUpload);

    // 处理响应数据
    const apiResponse = response as unknown as {
      data: { code: number; data: string; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      ElMessage.success(apiResponse.data.message || "导入成功");
      importDialogVisible.value = false;
      // 重新加载数据
      getList();
    } else {
      ElMessage.error(apiResponse?.data?.message || "导入失败");
    }
  } catch (error: any) {
    console.error("导入失败:", error);
    ElMessage.error(error.message || "导入失败，请稍后重试");
  } finally {
    importLoading.value = false;
    // 清除文件
    if (uploadRef.value) {
      uploadRef.value.clearFiles();
    }
  }
};

const beforeUpload = () => {
  // 返回false阻止自动上传
  return false;
};

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "", // 新增时为空，由后端自动生成
    xxdm: "",
    kcmc: "",
    kch: "",
    zsh: "",
    zsmc: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  // 清空课程选项
  courseOptions.value = [];
  // 清空证书选项
  certificateOptions.value = [];
  formRef.value?.clearValidate();
};

// 时间格式化方法 - 修改为原样输出，不进行格式化
const formatDisplayTime = (timeStr: string) => {
  if (!timeStr) return "-";
  // 直接返回原始时间字符串，不进行任何格式化
  return timeStr;
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
  } catch (error) {
    return "-";
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

// 加载证书选项数据
const loadCertificateOptions = async () => {
  // 如果已经加载过数据，则不重复加载
  if (certificateOptions.value.length > 0) {
    return;
  }

  certificateSearchLoading.value = true;
  try {
    // 加载所有证书数据（不传关键词，使用后端默认的200条限制）
    const response = await searchCertificates();
    certificateOptions.value = (response as any)?.data?.data || [];
  } catch (error) {
    console.error("加载证书信息失败:", error);
    ElMessage.error("加载证书信息失败");
    certificateOptions.value = [];
  } finally {
    certificateSearchLoading.value = false;
  }
};

// 处理证书名称选择
const handleCertificateNameChange = (zsmc: string) => {
  const selectedCertificate = certificateOptions.value.find(
    (certificate) => certificate.zsmc === zsmc,
  );
  if (selectedCertificate) {
    form.zsh = selectedCertificate.zsh;
    form.zsmc = selectedCertificate.zsmc;
  }
};

// 处理证书号选择
const handleCertificateNumberChange = (zsh: string) => {
  const selectedCertificate = certificateOptions.value.find(
    (certificate) => certificate.zsh === zsh,
  );
  if (selectedCertificate) {
    form.zsh = selectedCertificate.zsh;
    form.zsmc = selectedCertificate.zsmc;
  }
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

const getReportStatusTagType = (
  status: string,
): "success" | "info" | "warning" | "danger" => {
  const typeMap: Record<string, "success" | "info" | "warning" | "danger"> = {
    "0": "info",
    "1": "success",
    "2": "danger",
  };
  return typeMap[status] || "info";
};

const getEnableStatusText = (status: string) => {
  return status === "1" ? "启用" : "禁用";
};

const getEnableStatusTagType = (status: string): "success" | "danger" => {
  return status === "1" ? "success" : "danger";
};

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

// 组件挂载
onMounted(() => {
  getList();
  getSchoolCode();
});

// 组件卸载时清理
onUnmounted(() => {
  if (tooltipDiv.value && document.body.contains(tooltipDiv.value)) {
    document.body.removeChild(tooltipDiv.value);
  }
});
</script>

<style scoped lang="scss">
.course-certificate-management {
  .search-card {
    margin-bottom: 8px;

    :deep(.el-card__body) {
      padding: 10px;
    }
  }

  .search-bar {
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
      width: 90px;
      text-align: right;
      padding-right: 4px;
      font-size: 14px;
    }

    :deep(.el-input__wrapper) {
      font-size: 14px;
    }

    :deep(.el-button) {
      font-size: 14px;
    }

    :deep(.el-form-item:last-child) {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .table-card {
    margin-top: 0;

    :deep(.el-card__body) {
      padding: 10px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      position: relative;
    }
  }

  .table-body {
    margin-bottom: 0;

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
  }

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
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .placeholder {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-top: 0;

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

  .course-certificate-dialog {
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

/* 表单样式 */
.course-certificate-form {
  .form-container {
    max-height: 450px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 8px;
    padding-bottom: 3px;
  }

  .form-section {
    margin-bottom: 15px;

    .section-title {
      font-size: 13px;
      font-weight: 500;
      color: #606266;
      margin-bottom: 10px;
      padding-bottom: 3px;
      border-bottom: 1px solid #dcdfe6;
      position: relative;
    }
  }

  :deep(.el-row) {
    margin-bottom: 3px;
  }

  :deep(.el-form-item) {
    margin-bottom: 12px;
  }

  :deep(.el-form-item__label) {
    font-size: 13px;
    color: #606266;
    font-weight: 500;
    line-height: 26px;
  }

  :deep(.el-input__wrapper) {
    font-size: 13px;
    height: 32px;
    border-radius: 3px;
  }

  :deep(.el-select) {
    font-size: 13px;

    .el-input__wrapper {
      height: 32px;
      border-radius: 3px;
    }
  }

  :deep(.el-date-editor) {
    width: 100%;

    .el-input__wrapper {
      height: 32px;
    }
  }
}

/* 详情样式 */
.course-certificate-detail {
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

/* 带警告图标的输入框样式 */
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

.dialog-footer {
  text-align: right;
}
</style>
