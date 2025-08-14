<template>
  <div class="course-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="课程名称" prop="kcmc">
            <el-input
              v-model="queryParams.kcmc"
              placeholder="请输入课程名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="课程号" prop="kch">
            <el-input
              v-model="queryParams.kch"
              placeholder="请输入课程号"
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
        <div class="header-title">课程基本数据编码管理</div>
        <div class="right-buttons">
          <!-- 导入按钮 -->
          <el-tooltip content="导入Excel数据" placement="top">
            <el-button class="import-button" @click="handleImport">
              <el-icon><Upload /></el-icon>导入
            </el-button>
          </el-tooltip>
          <!-- 刷新按钮 -->
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
          :height="'calc(75vh - 140px)'"
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
            prop="kclxmText"
            show-overflow-tooltip
            label="课程类型"
            min-width="120"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getZdzyjbmText(row.kclxm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="kcsxmText"
            show-overflow-tooltip
            label="课程属性"
            min-width="120"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getkcsxmText(row.kcsxm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="jxjhgdkss"
            show-overflow-tooltip
            label="规定课时数"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="sjjxkss"
            show-overflow-tooltip
            label="实践课时数"
            min-width="120"
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

        <!-- 分页 -->
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
      </div>
    </el-card>

    <!-- 表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="
        dialogType === 'add'
          ? '新增课程基本数据'
          : dialogType === 'edit'
            ? '编辑课程基本数据'
            : '查看课程基本数据'
      "
      width="800px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
        :disabled="dialogType === 'view'"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可不填，后端自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
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
            <el-form-item label="课程名称" prop="kcmc">
              <el-input
                v-model="form.kcmc"
                placeholder="请输入课程名称"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程号" prop="kch">
              <el-input
                v-model="form.kch"
                placeholder="请输入课程号"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程类型" prop="kclxm">
              <el-select
                v-model="form.kclxm"
                placeholder="请选择课程类型"
                style="width: 100%"
              >
                <el-option
                  v-for="item in courseTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程属性" prop="kcsxm">
              <el-select
                v-model="form.kcsxm"
                placeholder="请选择课程属性"
                style="width: 100%"
              >
                <el-option
                  v-for="item in coursePropertyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程性质" prop="kcxzm">
              <el-select
                v-model="form.kcxzm"
                placeholder="请选择课程性质"
                style="width: 100%"
              >
                <el-option
                  v-for="item in courseNatureOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规定课时数" prop="jxjhgdkss">
              <el-input-number
                v-model="form.jxjhgdkss"
                placeholder="请输入教学计划规定课时数"
                :min="0"
                :max="99999"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实践课时数" prop="sjjxkss">
              <el-input-number
                v-model="form.sjjxkss"
                placeholder="请输入实践教学课时数"
                :min="0"
                :max="99999"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公共课类别" prop="ggklbm">
              <el-select
                v-model="form.ggklbm"
                placeholder="请选择公共课类别"
                style="width: 100%"
              >
                <el-option
                  v-for="item in publicCourseCategoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="精品课程级别" prop="jpkcjbm">
              <el-select
                v-model="form.jpkcjbm"
                placeholder="请选择精品课程级别"
                style="width: 100%"
              >
                <el-option
                  v-for="item in qualityCourseLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="虚拟仿真实训课时数" prop="xnfzsxkss">
              <el-input-number
                v-model="form.xnfzsxkss"
                placeholder="请输入虚拟仿真实训课时数"
                :min="0"
                :max="99999"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否课证融通课程" prop="sfkzrtkc">
              <el-select
                v-model="form.sfkzrtkc"
                placeholder="请选择是否课证融通课程"
                style="width: 100%"
              >
                <el-option
                  v-for="item in yesNoOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="相关竞赛名称" prop="xgjsmc">
              <el-input
                v-model="form.xgjsmc"
                placeholder="请输入相关竞赛名称（多个用逗号隔开）"
                maxlength="128"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否校企合作开发课程" prop="sfxqhzkfkc">
              <el-select
                v-model="form.sfxqhzkfkc"
                placeholder="请选择是否校企合作开发课程"
                style="width: 100%"
              >
                <el-option
                  v-for="item in yesNoOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有线上课程" prop="sfyxskc">
              <el-select
                v-model="form.sfyxskc"
                placeholder="请选择是否有线上课程"
                style="width: 100%"
              >
                <el-option
                  v-for="item in yesNoOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="线上课程网址" prop="xskcwz">
              <el-input
                v-model="form.xskcwz"
                placeholder="请输入线上课程网址"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否课程思政示范课程" prop="sfkcszsfkc">
              <el-select
                v-model="form.sfkcszsfkc"
                placeholder="请选择是否课程思政示范课程"
                style="width: 100%"
              >
                <el-option
                  v-for="item in yesNoOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="课堂教学设计主要选用课程资源码"
              prop="ktjxsjzyxykczym"
            >
              <el-select
                v-model="form.ktjxsjzyxykczym"
                placeholder="请选择课堂教学设计主要选用课程资源码"
                style="width: 100%"
              >
                <el-option
                  v-for="item in courseResourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
          <!-- 查看模式下显示创建时间和更新时间 -->
          <el-col v-if="dialogType === 'view'" :span="12">
            <el-form-item label="创建时间">
              <el-input
                :value="formatDateTime(currentRecord?.createTime)"
                readonly
                disabled
                style="background-color: #f5f7fa"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="dialogType === 'view'" :span="12">
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
      </el-form>
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
      title="导入课程基本数据"
      v-model="importDialogVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        :http-request="customHttpRequest"
        :before-upload="beforeUpload"
        :limit="1"
        :auto-upload="true"
        drag
        accept=".xls,.xlsx"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将Excel文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请上传.xls或.xlsx格式的文件，文件大小不能超过10MB
            <el-tooltip
              effect="dark"
              placement="top"
              :content="importTipContent"
            >
              <el-icon class="import-tip-icon">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  Upload,
  UploadFilled,
  Warning,
  View,
  Edit,
} from "@element-plus/icons-vue";
import {
  getCourseDataPage,
  getCourseDataById,
  addCourseData,
  updateCourseData,
  deleteCourseData,
  batchDeleteCourseData,
  exportCourseData,
  importCourseData,
  getCourseTypeOptions,
  getCoursePropertyOptions,
  getCourseNatureOptions,
  getPublicCourseCategoryOptions,
  getQualityCourseLevelOptions,
  getYesNoOptions,
  getCourseResourceOptions,
  type OdsKcjbsInfo,
  type OdsKcjbsQuery,
  type OdsKcjbsForm,
  type DictOption,
} from "@/api-code/code/code_base/zygjx/ods_kcjbs";
import { getSystemSchoolCode } from "@/api-code/code/code_base/zygxx/ods_xxhxtjssj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsKcjbsInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const importDialogVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const currentRecord = ref<OdsKcjbsInfo | null>(null);

// 导入相关状态
const uploadRef = ref();

// 字典数据
const courseTypeOptions = ref<DictOption[]>([]);
const coursePropertyOptions = ref<DictOption[]>([]);
const courseNatureOptions = ref<DictOption[]>([]);
const publicCourseCategoryOptions = ref<DictOption[]>([]);
const qualityCourseLevelOptions = ref<DictOption[]>([]);
const yesNoOptions = ref<DictOption[]>([]);
const courseResourceOptions = ref<DictOption[]>([]);

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 表单引用
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<OdsKcjbsQuery>({
  pageNum: 1,
  pageSize: 20,
});

// 表单数据
const form = reactive<OdsKcjbsForm>({
  zjsjwyxbs: "",
  xxdm: "",
  kcmc: "",
  kch: "",
  sjcjsj: "",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    {
      required: false,
      message: "主键数据唯一性标识可不填，后端自动生成",
      trigger: "blur",
    },
    {
      max: 32,
      message: "主键数据唯一性标识长度不能超过32个字符",
      trigger: "blur",
    },
    {
      pattern: /^[A-Z0-9]{32}$/,
      message: "主键数据唯一性标识必须为32位大写字母和数字组合",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码系统自动获取", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10个字符", trigger: "blur" },
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
  kclxm: [{ required: true, message: "请选择课程类型", trigger: "change" }],
  kcsxm: [{ required: true, message: "请选择课程属性", trigger: "change" }],
  kcxzm: [{ required: true, message: "请选择课程性质", trigger: "change" }],
  jxjhgdkss: [
    { required: true, message: "请输入教学计划规定课时数", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 99999,
      message: "教学计划规定课时数必须为0-99999之间的数字",
      trigger: "blur",
    },
  ],
  sjjxkss: [
    { required: true, message: "请输入实践教学课时数", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 99999,
      message: "实践教学课时数必须为0-99999之间的数字",
      trigger: "blur",
    },
  ],
  xnfzsxkss: [
    { required: true, message: "请输入虚拟仿真实训课时数", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 99999,
      message: "虚拟仿真实训课时数必须为0-99999之间的数字",
      trigger: "blur",
    },
  ],
  sfkzrtkc: [
    { required: true, message: "请选择是否课证融通课程", trigger: "change" },
  ],
  xgjsmc: [
    { max: 128, message: "相关竞赛名称长度不能超过128个字符", trigger: "blur" },
  ],
  sfxqhzkfkc: [
    {
      required: true,
      message: "请选择是否校企合作开发课程",
      trigger: "change",
    },
  ],
  sfyxskc: [
    { required: true, message: "请选择是否有线上课程", trigger: "change" },
  ],
  xskcwz: [
    { max: 500, message: "线上课程网址长度不能超过500个字符", trigger: "blur" },
  ],
  sfkcszsfkc: [
    {
      required: true,
      message: "请选择是否课程思政示范课程",
      trigger: "change",
    },
  ],
  ktjxsjzyxykczym: [
    {
      max: 10,
      message: "课堂教学设计主要选用课程资源码长度不能超过10个字符",
      trigger: "blur",
    },
  ],
});

// 状态格式化函数
const getReportStatusType = (status: string) => {
  switch (status) {
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
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return "未上报";
  }
};

const getEnableStatusType = (status: string) => {
  switch (status) {
    case "1":
      return "success";
    case "0":
      return "danger";
    default:
      return "info";
  }
};

const getEnableStatusText = (status: string) => {
  switch (status) {
    case "1":
      return "启用";
    case "0":
      return "禁用";
    default:
      return "未知";
  }
};

const formatDisplayTime = (timeStr: string) => {
  if (!timeStr) return "-";
  if (timeStr.length === 14) {
    return `${timeStr.slice(0, 4)}-${timeStr.slice(4, 6)}-${timeStr.slice(6, 8)} ${timeStr.slice(8, 10)}:${timeStr.slice(10, 12)}:${timeStr.slice(12, 14)}`;
  }
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
  } catch {
    return "-";
  }
};

// 加载字典数据
const loadDictData = async () => {
  try {
    const [
      courseType,
      courseProperty,
      courseNature,
      publicCourseCategory,
      qualityCourseLevel,
      yesNo,
      courseResource,
    ] = await Promise.all([
      getCourseTypeOptions(),
      getCoursePropertyOptions(),
      getCourseNatureOptions(),
      getPublicCourseCategoryOptions(),
      getQualityCourseLevelOptions(),
      getYesNoOptions(),
      getCourseResourceOptions(),
    ]);
    courseTypeOptions.value = courseType.data
      ? courseType.data.data || courseType.data
      : [];
    coursePropertyOptions.value = courseProperty.data
      ? courseProperty.data.data || courseProperty.data
      : [];
    courseNatureOptions.value = courseNature.data
      ? courseNature.data.data || courseNature.data
      : [];
    publicCourseCategoryOptions.value = publicCourseCategory.data
      ? publicCourseCategory.data.data || publicCourseCategory.data
      : [];
    qualityCourseLevelOptions.value = qualityCourseLevel.data
      ? qualityCourseLevel.data.data || qualityCourseLevel.data
      : [];
    yesNoOptions.value = yesNo.data ? yesNo.data.data || yesNo.data : [];
    courseResourceOptions.value = courseResource.data
      ? courseResource.data.data || courseResource.data
      : [];
  } catch (error) {
    ElMessage.error("加载字典数据失败");
  }
};

/** 获取系统学校代码 */
const loadSystemSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
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

// 方法实现
const getList = async () => {
  loading.value = true;
  try {
    const response = (await getCourseDataPage(queryParams)) as any;
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

const handleSelectionChange = (selection: OdsKcjbsInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

const handleAdd = () => {
  dialogType.value = "add";
  resetForm();
  // 自动设置学校代码
  if (systemSchoolCode.value) {
    form.xxdm = systemSchoolCode.value;
  }
  dialogVisible.value = true;
};

const handleEdit = async (row: OdsKcjbsInfo) => {
  dialogType.value = "edit";
  try {
    const response = (await getCourseDataById(row.id)) as any;
    const data = response.data.data || response.data;
    Object.assign(form, data);
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

const handleView = async (row: OdsKcjbsInfo) => {
  dialogType.value = "view";
  try {
    const response = (await getCourseDataById(row.id)) as any;
    const data = response.data.data || response.data;
    currentRecord.value = data;
    Object.assign(form, data);
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

const handleDelete = async (row: OdsKcjbsInfo) => {
  try {
    await ElMessageBox.confirm(`确定要删除课程"${row.kcmc}"吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await deleteCourseData(row.id);
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
    await batchDeleteCourseData(selectedIds.value);
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
      await addCourseData(form);
      ElMessage.success("新增成功");
    } else {
      await updateCourseData(form);
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
    const response = await exportCourseData(queryParams);
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `课程基本数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
};

// 导入操作
const handleImport = () => {
  importDialogVisible.value = true;
};

// 导入提示内容
const importTipContent = `导入说明：
1. 第一行为字段中文名称，第二行为字段英文名称
2. 从第三行开始录入数据
3. 如果唯一标识为空，系统将自动生成
4. 采集时间将统一设置为当前时间
5. 支持.xls和.xlsx格式文件`;

// 文件上传前校验
const beforeUpload = (rawFile: any) => {
  const isExcel =
    rawFile.type === "application/vnd.ms-excel" ||
    rawFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isExcel) {
    ElMessage.error("请上传.xls或.xlsx格式的Excel文件!");
    return false;
  }
  const isLt10M = rawFile.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error("文件大小不能超过10MB!");
    return false;
  }
  return true;
};

// 自定义文件上传处理
const customHttpRequest = async (options: any) => {
  const { file, onSuccess, onError } = options;

  try {
    console.log("开始上传文件:", file.name);

    // 使用API模块中的导入函数
    const response = (await importCourseData(file)) as any;

    console.log("导入响应:", response);

    if (response && response.data && response.data.code === 200) {
      ElMessage.success("数据导入成功");
      importDialogVisible.value = false;
      getList(); // 刷新列表
      onSuccess(response.data);
    } else {
      const errorMsg = response?.data?.message || "导入失败，请检查文件格式";
      ElMessage.error(`导入失败: ${errorMsg}`);
      onError(new Error(errorMsg));
    }
  } catch (error: any) {
    console.error("导入失败:", error);

    let errorMessage = "导入失败";
    if (error?.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        errorMessage = "登录已过期，请重新登录";
      } else if (status === 403) {
        errorMessage = "没有权限进行此操作";
      } else if (status === 413) {
        errorMessage = "文件太大，请检查文件大小";
      } else if (status === 415) {
        errorMessage = "不支持的文件格式";
      } else if (data && data.message) {
        errorMessage = data.message;
      } else {
        errorMessage = `服务器错误 (${status})`;
      }
    } else if (error?.message) {
      if (error.message.includes("Network Error")) {
        errorMessage = "网络连接失败，请检查网络连接";
      } else if (error.message.includes("timeout")) {
        errorMessage = "请求超时，请重试";
      } else {
        errorMessage = error.message;
      }
    }

    ElMessage.error(errorMessage);
    onError(error);
  } finally {
    uploadRef.value?.clearFiles();
  }
};

// 获取重点专业级别文本
const getZdzyjbmText = (value: string | undefined) => {
  const option = courseTypeOptions.value.find((item: any) => item.value === value);
  return option ? option.label : "-";
};

// 获取课程属性文本
const getkcsxmText = (value: string | undefined) => {
  const option = coursePropertyOptions.value.find(
    (item: any) => item.value === value,
  );
  return option ? option.label : "-";
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
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value || "", // 自动设置学校代码
    kcmc: "",
    kch: "",
    kclxm: "",
    kcsxm: "",
    kcxzm: "",
    ggklbm: "",
    jpkcjbm: "",
    jxjhgdkss: undefined,
    sjjxkss: undefined,
    xnfzsxkss: undefined,
    sfkzrtkc: "",
    xgjsmc: "",
    sfxqhzkfkc: "",
    sfyxskc: "",
    xskcwz: "",
    sfkcszsfkc: "",
    ktjxsjzyxykczym: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

// 组件挂载
onMounted(() => {
  loadDictData();
  loadSystemSchoolCode();
  getList();
});
</script>

<style scoped lang="scss">
.course-management {
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
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 8px;
}

.operation-buttons {
  display: flex;
  align-items: center;
  gap: 3px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  flex: 1;
  text-align: center;
}

.right-buttons {
  display: flex;
  align-items: center;
  gap: 10px;

  .el-button {
    margin: 0;
  }
}

.table-body {
  flex: 1;
  overflow: hidden;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #e4e7ed;
  margin-top: 16px;
}

.total-info {
  color: #606266;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
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

.dialog-footer {
  text-align: right;
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

// 按钮间距
:deep(.el-button + .el-button) {
  margin-left: 8px;
}

// 对话框样式
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

// 卡片样式
:deep(.el-card) {
  .el-card__body {
    padding: 20px;
  }
}

/* 导入按钮白色背景样式 */
.import-button {
  background-color: #ffffff !important;
  border-color: #dcdfe6 !important;
  color: #606266 !important;

  &:hover {
    background-color: #f5f7fa !important;
    border-color: #c0c4cc !important;
    color: #409eff !important;
  }

  &:focus {
    background-color: #ffffff !important;
    border-color: #409eff !important;
    color: #409eff !important;
  }

  &:active {
    background-color: #f5f7fa !important;
    border-color: #409eff !important;
    color: #409eff !important;
  }
}

/* 导入提示图标样式 */
:deep(.import-tip-icon) {
  margin-left: 5px;
  color: #e6a23c;
  cursor: pointer;
  font-size: 14px;
  vertical-align: middle;
}
</style>
