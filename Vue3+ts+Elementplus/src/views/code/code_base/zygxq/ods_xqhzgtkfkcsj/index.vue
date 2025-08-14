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
          <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon>导出Excel</el-button>
        </div>
        <div class.bind="header-title">校企合作共同开发课程编码管理</div>
        <div class="placeholder">
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
import { Search, Refresh, Plus, Edit, Delete, View, Download, Warning } from "@element-plus/icons-vue";
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
  searchCxhzCompanies,
  type OdsCxhzCompanyInfo,
  type OdsXqhzgtkfkcsjInfo,
  type OdsXqhzgtkfkcsjQuery,
  type OdsXqhzgtkfkcsjForm,
} from "@/api-code/code/code_base/zygxq/ods_xqhzgtkfkcsj";
import { getSystemSchoolCode } from "@/api-code/code/code_base/zygxx/ods_xxtsxxhxtyysj";

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
</style>
