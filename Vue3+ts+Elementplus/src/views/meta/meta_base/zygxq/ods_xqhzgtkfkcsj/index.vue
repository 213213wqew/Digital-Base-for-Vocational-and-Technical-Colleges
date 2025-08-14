<template>
  <div class="co-dev-course-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
        <el-form-item label="课程名称" prop="kcmc">
          <el-input v-model="queryParams.kcmc" placeholder="请输入课程名称" clearable style="width: 220px;" />
        </el-form-item>
        <el-form-item label="合作企业" prop="hzqymc">
          <el-input v-model="queryParams.hzqymc" placeholder="请输入企业名称" clearable style="width: 220px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>搜索</el-button>
          <el-button @click="resetQuery"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="operation-buttons">
          <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增</el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete"><el-icon><Delete /></el-icon>批量删除</el-button>
          <el-dropdown @command="handleBatchStatusCommand" :disabled="selectedIds.length === 0">
            <el-button type="info">
              批量状态<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="enable">批量启用</el-dropdown-item>
                <el-dropdown-item command="disable">批量禁用</el-dropdown-item>
                <el-dropdown-item divided command="report">批量上报</el-dropdown-item>
                <el-dropdown-item command="unreport">批量取消上报</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon>导出Excel</el-button>
        </div>
        <div class="header-title">校企合作共同开发课程数据管理</div>
        <div class="placeholder">
          <el-dropdown @command="handleImportCommand" style="margin-right: 8px;">
            <el-button type="warning">
              <el-icon><Upload /></el-icon>导入数据<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="template">下载导入模板</el-dropdown-item>
                <el-dropdown-item command="import">导入Excel数据</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-tooltip content="刷新" placement="top">
            <el-button circle @click="getList"><el-icon><Refresh /></el-icon></el-button>
          </el-tooltip>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="dataList"
        @selection-change="handleSelectionChange"
        border
        style="width: 100%"
        highlight-current-row
        @row-dblclick="handleRowDblClick"
        :height="'calc(75vh - 160px)'"
        stripe
        size="default"
      >
        <el-table-column type="selection" width="45" fixed="left" />
        <el-table-column type="index" label="序号" width="50" fixed="left" />
        <el-table-column prop="kcmc" label="课程名称" min-width="180" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="hzqymc" label="合作企业名称" min-width="200" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="kckfkssj" label="开始日期" width="120" align="center" sortable="custom" />
        <el-table-column prop="kckfjssj" label="结束日期" width="120" align="center" sortable="custom" />
        <el-table-column prop="xxfzr" label="学校负责人" width="120" align="center" sortable="custom" />
        <el-table-column prop="qyfzr" label="企业负责人" width="120" align="center" sortable="custom" />
        <el-table-column label="上报状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getReportStatusType(row.reportStatus)" size="small">
              {{ getReportStatusText(row.reportStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" width="100" align="center">
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
        <el-table-column prop="updateTime" label="更新时间" width="160" align="center" sortable="custom" />
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon>查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon>编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <span class="total-info">共 {{ total }} 条</span>
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[20, 50, 100, 200]"
          layout="sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          small
        />
      </div>
    </el-card>

    <!-- 导入数据对话框 -->
    <el-dialog v-model="importDialogVisible" title="导入校企合作共同开发课程数据" width="600px" :close-on-click-modal="false" append-to-body>
      <div class="import-dialog-content">
        <el-alert
          title="导入说明"
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 20px;"
        >
          <template #default>
            <div>
              <p>1. 请先下载导入模板，按照模板格式填写数据</p>
              <p>2. 支持 .xlsx 和 .xls 格式的Excel文件</p>
              <p>3. 文件大小不能超过 10MB</p>
              <p>4. 主键唯一标识和数据采集时间可为空，系统将自动生成</p>
            </div>
          </template>
        </el-alert>

        <div class="import-actions">
          <el-button type="primary" @click="handleDownloadTemplate" style="margin-bottom: 20px;">
            <el-icon><Download /></el-icon>下载导入模板
          </el-button>
        </div>

        <div class="import-mode-selection" style="margin-bottom: 20px;">
          <el-alert
            title="导入模式选择"
            type="warning"
            :closable="false"
            show-icon
            style="margin-bottom: 15px;"
          >
            <template #default>
              <div>
                <p><strong>普通导入</strong>：将新数据追加到现有数据中</p>
                <p><strong>清空已上报数据后导入</strong>：先清空数据库中已上报状态的数据，然后导入新数据</p>
              </div>
            </template>
          </el-alert>
          
          <el-radio-group v-model="importMode" style="width: 100%;">
            <el-radio value="normal" style="margin-bottom: 10px;">
              <span style="font-weight: 500;">普通导入</span>
              <span style="color: #909399; margin-left: 10px;">（追加模式）</span>
            </el-radio>
            <el-radio value="clear" style="margin-bottom: 10px;">
              <span style="font-weight: 500; color: #E6A23C;">清空已上报数据后导入</span>
              <span style="color: #F56C6C; margin-left: 10px;">（只清空已上报状态的数据）</span>
            </el-radio>
          </el-radio-group>
        </div>

        <el-upload
          ref="uploadRef"
          class="upload-demo"
          drag
          :auto-upload="false"
          :limit="1"
          :accept="'.xlsx,.xls'"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将Excel文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传 .xlsx/.xls 文件，且不超过 10MB
            </div>
          </template>
        </el-upload>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="importLoading" :disabled="fileList.length === 0" @click="handleConfirmImport">
            确认导入
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="1000px" :close-on-click-modal="false" append-to-body class="co-dev-course-dialog" destroy-on-close>
      <el-form v-if="dialogMode !== 'view'" ref="formRef" :model="form" :rules="formRules" label-width="140px">
        <el-divider content-position="left">核心信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="主键唯一标识" prop="zjsjwyxbs"><el-input v-model="form.zjsjwyxbs" placeholder="可不填，后端自动生成" maxlength="32" show-word-limit /></el-form-item></el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="学校代码" prop="xxdm"><el-input v-model="form.xxdm" :disabled="true" /></el-form-item></el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="课程号" prop="kch">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select v-model="form.kch" 
              placeholder="请选择课程号" 
              filterable 
              remote 
              reserve-keyword 
              :loading="courseSearchLoading" 
              :remote-method="querySearchCourse"
              @change="handleCourseSelect"
              style="width: 100%;">
                <el-option
                  v-for="item in onlineCoursesCache"
                  :key="item.kch"
                  :label="item.kch + ' - ' + item.kcmc"
                  :value="item.kch"
                />
              </el-select>
              <el-tooltip content="数据来源于课程基本数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
          </el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="课程名称" prop="kcmc">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-input v-model="form.kcmc" placeholder="请输入课程名称" maxlength="60" show-word-limit />
              <el-tooltip content="数据来源于课程基本数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24"><el-form-item label="课程简介" prop="kcjj"><el-input v-model="form.kcjj" type="textarea" :rows="3" placeholder="请输入课程简介" maxlength="600" show-word-limit /></el-form-item></el-col>
        </el-row>

        <el-divider content-position="left">合作企业信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            
            <el-form-item label="合作企业名称" prop="hzqymc">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select
                v-model="form.hzqymc"
                filterable
                remote
                reserve-keyword
                placeholder="请输入企业名称关键字"
                :remote-method="remoteMethod"
                :loading="companySearchLoading"
                @change="handleCompanySelect"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in companyOptions"
                  :key="item.hzqytyshxydm"
                  :label="item.hzqymc"
                  :value="item"
                />
              </el-select>
              <el-tooltip content="数据来源于产学合作企业表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业统一信用代码" prop="qyshxydm">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-input v-model="form.qyshxydm" placeholder="请输入企业统一信用代码" maxlength="200" show-word-limit />
              <el-tooltip content="数据来源于产学合作企业表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">开发周期与负责人</el-divider>
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="开始日期" prop="kckfkssj"><el-date-picker v-model="form.kckfkssj" type="date" placeholder="请选择开始日期" format="YYYYMMDD" value-format="YYYYMMDD" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="结束日期" prop="kckfjssj"><el-date-picker v-model="form.kckfjssj" type="date" placeholder="请选择结束日期" format="YYYYMMDD" value-format="YYYYMMDD" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="学校负责人工号" prop="xxfzrgh"><el-input v-model="form.xxfzrgh" placeholder="请输入学校负责人工号" maxlength="20" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="学校负责人" prop="xxfzr"><el-input v-model="form.xxfzr" placeholder="请输入学校负责人姓名" maxlength="36" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="企业负责人" prop="qyfzr"><el-input v-model="form.qyfzr" placeholder="请输入企业负责人姓名" maxlength="36" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker v-model="form.sjcjsj" 
              type="datetime" placeholder="请选择数据采集时间" 
              format="YYYYMMDD HHmmss" value-format="YYYYMMDD HHmmss" style="width: 100%;" /></el-form-item></el-col>
        </el-row>

        <el-divider content-position="left">状态信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select v-model="form.reportStatus" placeholder="请选择上报状态" style="width: 100%;">
                <el-option label="未上报" value="0" />
                <el-option label="已上报" value="1" />
                <el-option label="上报失败" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select v-model="form.enableStatus" placeholder="请选择启用状态" style="width: 100%;">
                <el-option label="禁用" value="0" />
                <el-option label="启用" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-else class="co-dev-course-detail">
        <el-descriptions :column="2" border>
            <el-descriptions-item label="主键唯一标识">{{ form.zjsjwyxbs }}</el-descriptions-item>
            <el-descriptions-item label="学校代码">{{ form.xxdm }}</el-descriptions-item>
            <el-descriptions-item label="课程号">{{ form.kch }}</el-descriptions-item>
            <el-descriptions-item label="课程名称">{{ form.kcmc }}</el-descriptions-item>
            <el-descriptions-item label="课程简介" :span="2">{{ form.kcjj }}</el-descriptions-item>
            <el-descriptions-item label="企业统一信用代码">{{ form.qyshxydm }}</el-descriptions-item>
            <el-descriptions-item label="合作企业名称">{{ form.hzqymc }}</el-descriptions-item>
            <el-descriptions-item label="开始日期">{{ form.kckfkssj }}</el-descriptions-item>
            <el-descriptions-item label="结束日期">{{ form.kckfjssj }}</el-descriptions-item>
            <el-descriptions-item label="学校负责人工号">{{ form.xxfzrgh }}</el-descriptions-item>
            <el-descriptions-item label="学校负责人">{{ form.xxfzr }}</el-descriptions-item>
            <el-descriptions-item label="企业负责人">{{ form.qyfzr }}</el-descriptions-item>
            <el-descriptions-item label="数据采集时间">{{ form.sjcjsj }}</el-descriptions-item>
            <el-descriptions-item label="上报状态">{{ getReportStatusText(form.reportStatus) }}</el-descriptions-item>
            <el-descriptions-item label="启用状态">{{ form.enableStatus === '1' ? '启用' : '禁用' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogMode !== 'view'" type="primary" :loading="submitLoading" @click="handleFormSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, View, Download, Warning, Upload, ArrowDown, UploadFilled } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getOdsXqhzgtkfkcsjPage,
  getOdsXqhzgtkfkcsjById,
  addOdsXqhzgtkfkcsj,
  updateOdsXqhzgtkfkcsj,
  searchOnlineCourses,
  type CourseBasicInfo,
  deleteOdsXqhzgtkfkcsj,
  batchDeleteOdsXqhzgtkfkcsj,
  exportOdsXqhzgtkfkcsj,
  downloadImportTemplate,
  importOdsXqhzgtkfkcsj,
  importOdsXqhzgtkfkcsjWithClear,
  updateReportStatus,
  updateEnableStatus,
  batchUpdateReportStatus,
  batchUpdateEnableStatus,
  searchCxhzCompanies,
  type OdsCxhzCompanyInfo,
  type OdsXqhzgtkfkcsjInfo,
  type OdsXqhzgtkfkcsjQuery,
  type OdsXqhzgtkfkcsjForm,
} from "@/api/meta/meta_base/zygxq/ods_xqhzgtkfkcsj";
import { getSystemSchoolCode } from "@/api/meta/meta_base/zygxx/ods_xxtsxxhxtyysj";

const loading = ref(false);
const dataList = ref<OdsXqhzgtkfkcsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const companyOptions = ref<OdsCxhzCompanyInfo[]>([]);
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();
const systemSchoolCode = ref("");
const companySearchLoading = ref(false);

// 导入相关变量
const importDialogVisible = ref(false);
const importLoading = ref(false);
const fileList = ref<any[]>([]);
const uploadRef = ref();
const importMode = ref('normal'); // 导入模式：normal-普通导入，clear-清空后导入

const queryParams = reactive<OdsXqhzgtkfkcsjQuery>({
  kcmc: "",
  hzqymc: "",
  pageNum: 1,
  pageSize: 20,
});

const initialState: OdsXqhzgtkfkcsjForm = {
    zjsjwyxbs: "",
    xxdm: "",
    kch: "",
    kcmc: "",
    kcjj: "",
    qyshxydm: "",
    hzqymc: "",
    kckfkssj: "",
    kckfjssj: "",
    xxfzrgh: "",
    xxfzr: "",
    qyfzr: "",
    sjcjsj: "",
    reportStatus: "0", // 默认未上报
    enableStatus: "1", // 默认启用
};
const form = ref<OdsXqhzgtkfkcsjForm>({ ...initialState });
// 课程选项缓存
const onlineCoursesCache = ref<CourseBasicInfo[]>([]);
const formRules = reactive<FormRules>({
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
  xxdm: [{ required: true, message: "学校代码为必填项", trigger: "blur" }],
  kch: [
    { required: true, message: "课程号为必填项", trigger: "blur" },
    { max: 50, message: "课程号长度不能超过50位", trigger: "blur" }
  ],
  kcmc: [
    { required: true, message: "课程名称为必填项", trigger: "blur" },
    { max: 60, message: "课程名称长度不能超过60位", trigger: "blur" }
  ],
  kcjj: [
    { required: true, message: "课程简介为必填项", trigger: "blur" },
    { max: 600, message: "课程简介长度不能超过600位", trigger: "blur" }
  ],
  qyshxydm: [
    { required: true, message: "企业统一信用代码为必填项", trigger: "blur" },
    { max: 18, message: "企业统一信用代码长度不能超过18位", trigger: "blur" }
  ],
  hzqymc: [
    { required: true, message: "合作企业名称为必填项", trigger: "blur" },
    { max: 200, message: "合作企业名称长度不能超过200位", trigger: "blur" }
  ],
  kckfkssj: [{ required: true, message: "开始日期为必填项", trigger: "change" }],
  kckfjssj: [{ required: true, message: "结束日期为必填项", trigger: "change" }],
  xxfzrgh: [
    { required: true, message: "学校负责人工号为必填项", trigger: "blur" },
    { max: 20, message: "学校负责人工号长度不能超过20位", trigger: "blur" }
  ],
  xxfzr: [
    { required: true, message: "学校负责人为必填项", trigger: "blur" },
    { max: 36, message: "学校负责人长度不能超过36位", trigger: "blur" }
  ],
  qyfzr: [
    { required: true, message: "企业负责人为必填项", trigger: "blur" },
    { max: 36, message: "企业负责人长度不能超过36位", trigger: "blur" }
  ],
  sjcjsj: [{ required: true, message: "数据采集时间为必填项", trigger: "change" }],
});

const dialogTitle = computed(() => {
  if (dialogMode.value === 'add') return "新增校企合作共同开发课程数据";
  if (dialogMode.value === 'edit') return "编辑校企合作共同开发课程数据";
  return "查看校企合作共同开发课程数据";
});
// 课程搜索加载状态
const courseSearchLoading = ref(false);

// 远程搜索企业方法
const remoteMethod = async (query: string) => {
  if (query) {
    companySearchLoading.value = true;
    try {
      const res = await searchCxhzCompanies(query);
      if (res.data.code === 200) {
        companyOptions.value = res.data.data;
      } else {
        companyOptions.value = [];
      }
    } catch (error) {
      companyOptions.value = [];
      console.error("搜索企业失败:", error);
    } finally {
      companySearchLoading.value = false;
    }
  } else {
    companyOptions.value = [];
  }
};
const getSystemSchoolCodeData = async () => {
  try {
    const response = await getSystemSchoolCode();
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      initialState.xxdm = response.data.data;
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
  }
};
/** 课程编号自动完成查询 */
const querySearchCourse = async (query: string) => {
  if (query) {
    courseSearchLoading.value = true;
    try {
      const response = await searchOnlineCourses(query, 20);
      if (response.data.code === 200) {
        onlineCoursesCache.value = response.data.data || [];
      } else {
        onlineCoursesCache.value = [];
      }
    } catch (error) {
      console.error("搜索线上课程失败:", error);
      onlineCoursesCache.value = [];
    } finally {
      courseSearchLoading.value = false;
    }
  } else {
    onlineCoursesCache.value = [];
  }
};
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsXqhzgtkfkcsjPage(queryParams);
    dataList.value = response.data.data.records;
    total.value = response.data.data.total;
  } finally {
    loading.value = false;
  }
};
// 选择课程后，自动填充课程名称
const handleCourseSelect = (selectedCourse: string) => {
  if (selectedCourse) {
 
    form.value.kcmc = onlineCoursesCache.value.find(item => item.kch === selectedCourse)?.kcmc || "";
  }
};

const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

const resetForm = () => {
  form.value = { ...initialState, xxdm: systemSchoolCode.value };
  formRef.value?.resetFields();
};

const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};
// 选择企业后，自动填充信用代码
const handleCompanySelect = (selectedCompany: OdsCxhzCompanyInfo) => {
  if (selectedCompany) {
    form.value.qyshxydm = selectedCompany.hzqytyshxydm;
    form.value.hzqymc = selectedCompany.hzqymc;
  }
};
const handleEdit = async (row: OdsXqhzgtkfkcsjInfo) => {
  resetForm();
  try {
    const response = await getOdsXqhzgtkfkcsjById(row.id);
    form.value = response.data.data;
    dialogMode.value = "edit";
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取详情失败");
  }
};

const handleView = async (row: OdsXqhzgtkfkcsjInfo) => {
  resetForm();
  try {
    const response = await getOdsXqhzgtkfkcsjById(row.id);
    form.value = response.data.data;
    dialogMode.value = "view";
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取详情失败");
  }
};

const handleFormSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        if (dialogMode.value === "add") {
          await addOdsXqhzgtkfkcsj(form.value);
          ElMessage.success("新增成功");
        } else {
          await updateOdsXqhzgtkfkcsj(form.value);
          ElMessage.success("修改成功");
        }
        dialogVisible.value = false;
        getList();
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

const handleDelete = async (row: OdsXqhzgtkfkcsjInfo) => {
  await ElMessageBox.confirm("确定删除吗?", "提示", { type: "warning" });
  await deleteOdsXqhzgtkfkcsj(row.id);
  ElMessage.success("删除成功");
  getList();
};

const handleBatchDelete = async () => {
  await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 条数据吗?`, "提示", { type: "warning" });
  await batchDeleteOdsXqhzgtkfkcsj(selectedIds.value);
  ElMessage.success("批量删除成功");
  getList();
};

const handleExport = async () => {
  ElMessage.info("正在导出，请稍候...");
  try {
    const response = await exportOdsXqhzgtkfkcsj(queryParams);
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `校企合作课程数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch(e) {
    ElMessage.error("导出失败");
  }
};

const handleSelectionChange = (selection: OdsXqhzgtkfkcsjInfo[]) => {
  selectedIds.value = selection.map(item => item.id);
};

const handleImportCommand = (command: string) => {
  if (command === 'template') {
    handleDownloadTemplate();
  } else if (command === 'import') {
    handleImportData();
  }
};

const handleDownloadTemplate = async () => {
  ElMessage.info("正在生成导入模板，请稍候...");
  try {
    const response = await downloadImportTemplate({
      kcmc: queryParams.kcmc,
      hzqymc: queryParams.hzqymc
    });
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `校企合作共同开发课程数据导入模板_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("模板下载成功");
  } catch (e) {
    ElMessage.error("模板下载失败");
  }
};

const handleImportData = () => {
  // 重置导入状态
  fileList.value = [];
  importLoading.value = false;
  importMode.value = 'normal';
  // 打开导入弹窗
  importDialogVisible.value = true;
};

// 文件选择变化处理
const handleFileChange = (file: any) => {
  // 验证文件类型
  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    ElMessage.error('请选择Excel文件（.xlsx或.xls格式）');
    uploadRef.value?.clearFiles();
    return false;
  }

  // 验证文件大小（限制为10MB）
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过10MB');
    uploadRef.value?.clearFiles();
    return false;
  }

  fileList.value = [file];
  return true;
};

// 文件数量超出限制处理
const handleExceed = () => {
  ElMessage.warning('只能选择一个文件进行导入');
};

// 确认导入处理
const handleConfirmImport = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择要导入的Excel文件');
    return;
  }

  const file = fileList.value[0].raw || fileList.value[0];
  
  // 如果是清空后导入，需要二次确认
  if (importMode.value === 'clear') {
    try {
      await ElMessageBox.confirm(
        '清空已上报数据后导入将删除数据库中所有已上报状态的数据，此操作不可恢复！确定要继续吗？',
        '危险操作确认',
        {
          confirmButtonText: '确定清空已上报数据并导入',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'el-button--warning'
        }
      );
    } catch {
      return; // 用户取消操作
    }
  }
  
  try {
    importLoading.value = true;
    
    let response;
    if (importMode.value === 'clear') {
      ElMessage.info("正在清空数据库并导入新数据，请稍候...");
      response = await importOdsXqhzgtkfkcsjWithClear(file);
    } else {
      ElMessage.info("正在导入数据，请稍候...");
      response = await importOdsXqhzgtkfkcsj(file);
    }
    
    if (response.data.code === 200) {
      const successMessage = importMode.value === 'clear' ? "清空已上报数据后导入成功" : "数据导入成功";
      ElMessage.success(successMessage);
      importDialogVisible.value = false;
      getList(); // 刷新列表
    } else {
      ElMessage.error(response.data.message || "导入失败");
    }
  } catch (error: any) {
    console.error("导入失败:", error);
    const errorMessage = error.response?.data?.message || error.message || "导入失败";
    ElMessage.error(errorMessage);
  } finally {
    importLoading.value = false;
  }
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  switch (status) {
    case '0': return '未上报';
    case '1': return '已上报';
    case '2': return '上报失败';
    default: return '未知';
  }
};

// 获取上报状态标签类型
const getReportStatusType = (status: string) => {
  switch (status) {
    case '0': return 'info';
    case '1': return 'success';
    case '2': return 'danger';
    default: return 'info';
  }
};

// 处理启用状态变更
const handleEnableStatusChange = async (row: OdsXqhzgtkfkcsjInfo) => {
  try {
    // 设置加载状态
    row.statusLoading = true;
    
    const response = await updateEnableStatus(row.id, row.enableStatus);
    if (response.data.code === 200) {
      ElMessage.success(`${row.enableStatus === '1' ? '启用' : '禁用'}成功`);
      getList(); // 刷新列表
    } else {
      // 如果失败，恢复原状态
      row.enableStatus = row.enableStatus === '1' ? '0' : '1';
      ElMessage.error(response.data.message || '状态修改失败');
    }
  } catch (error: any) {
    // 如果失败，恢复原状态
    row.enableStatus = row.enableStatus === '1' ? '0' : '1';
    console.error('修改启用状态失败:', error);
    ElMessage.error('状态修改失败');
  } finally {
    row.statusLoading = false;
  }
};

// 处理批量状态修改命令
const handleBatchStatusCommand = async (command: string) => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要操作的数据');
    return;
  }

  let confirmMessage = '';
  let successMessage = '';
  let apiCall: any = null;

  switch (command) {
    case 'enable':
      confirmMessage = `确定要批量启用选中的 ${selectedIds.value.length} 条数据吗？`;
      successMessage = '批量启用成功';
      apiCall = () => batchUpdateEnableStatus(selectedIds.value, '1');
      break;
    case 'disable':
      confirmMessage = `确定要批量禁用选中的 ${selectedIds.value.length} 条数据吗？`;
      successMessage = '批量禁用成功';
      apiCall = () => batchUpdateEnableStatus(selectedIds.value, '0');
      break;
    case 'report':
      confirmMessage = `确定要批量上报选中的 ${selectedIds.value.length} 条数据吗？`;
      successMessage = '批量上报成功';
      apiCall = () => batchUpdateReportStatus(selectedIds.value, '1');
      break;
    case 'unreport':
      confirmMessage = `确定要批量取消上报选中的 ${selectedIds.value.length} 条数据吗？`;
      successMessage = '批量取消上报成功';
      apiCall = () => batchUpdateReportStatus(selectedIds.value, '0');
      break;
    default:
      return;
  }

  try {
    await ElMessageBox.confirm(confirmMessage, '提示', { type: 'warning' });
    
    const response = await apiCall();
    if (response.data.code === 200) {
      ElMessage.success(successMessage);
      getList(); // 刷新列表
    } else {
      ElMessage.error(response.data.message || '操作失败');
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('批量状态修改失败:', error);
      ElMessage.error('操作失败');
    }
  }
};

const handleRowDblClick = (row: OdsXqhzgtkfkcsjInfo) => handleView(row);
const handleSizeChange = (size: number) => { queryParams.pageSize = size; getList(); };
const handleCurrentChange = (page: number) => { queryParams.pageNum = page; getList(); };

onMounted(async () => {
  await getSystemSchoolCodeData();
  getList();
});
</script>

<style scoped>
.co-dev-course-management { padding: 0; }
.search-card { margin-bottom: 8px; }
.search-form { display: flex; flex-wrap: wrap; gap: 8px; }
.table-card { margin-top: -10px; }
.table-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e4e7ed; background-color: #fafafa; }
.operation-buttons { display: flex; align-items: center; gap: 8px; }
.header-title { font-size: 16px; font-weight: 600; color: #303133; flex: 1; text-align: center; }
.placeholder { width: 100px; display: flex; justify-content: flex-end; }
.pagination-wrapper { display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; border-top: 1px solid #e4e7ed; background-color: #fafafa; }
.total-info { font-size: 14px; color: #606266; }
:deep(.co-dev-course-dialog .el-dialog__body) { padding: 20px 24px; max-height: 70vh; overflow-y: auto; }
:deep(.co-dev-course-dialog .el-form-item) { margin-bottom: 18px; }
.co-dev-course-detail .el-descriptions { margin-bottom: 16px; }
.dialog-footer { text-align: right; }

/* 导入弹窗样式 */
.import-dialog-content {
  padding: 0;
}

.import-actions {
  text-align: center;
}

.upload-demo {
  margin-top: 10px;
}

:deep(.upload-demo .el-upload-dragger) {
  width: 100%;
  height: 180px;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

:deep(.upload-demo .el-upload-dragger:hover) {
  border-color: #409eff;
}

:deep(.upload-demo .el-icon--upload) {
  font-size: 67px;
  color: #c0c4cc;
  margin: 40px 0 16px;
  line-height: 50px;
}

:deep(.upload-demo .el-upload__text) {
  color: #606266;
  font-size: 14px;
  text-align: center;
}

:deep(.upload-demo .el-upload__text em) {
  color: #409eff;
  font-style: normal;
}

:deep(.upload-demo .el-upload__tip) {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
  text-align: center;
}
</style>
