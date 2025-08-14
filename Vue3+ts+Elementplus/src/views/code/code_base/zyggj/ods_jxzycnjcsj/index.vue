<template>
  <div class="teaching-resource-adoption-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
        <el-form-item label="资源名称" prop="cyjxzymc">
          <el-input v-model="queryParams.cyjxzymc" placeholder="请输入采用教学资源名称" clearable style="width: 240px;" />
        </el-form-item>
        <el-form-item label="国家名称" prop="cygjmc">
          <el-input v-model="queryParams.cygjmc" placeholder="请输入采用国家名称" clearable style="width: 220px;" />
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
        <div class="header-title">教学资源采纳基础唯一标识管理</div>
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
        <el-table-column prop="cyjxzymc" label="采用教学资源名称" min-width="250" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="cyjxzylxText" label="资源类型" width="120" align="center" />
        <el-table-column prop="cygjmc" label="采用国家" width="150" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="cysj" label="采用时间" width="120" align="center" sortable="custom" />
        <el-table-column prop="cylxText" label="采用类型" width="120" align="center" />
        <el-table-column prop="sjwfxss" label="涉及外方学生数" width="140" align="center" sortable="custom" />
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="1100px" :close-on-click-modal="false" append-to-body class="resource-adoption-dialog" destroy-on-close>
      <el-form v-if="dialogMode !== 'view'" ref="formRef" :model="form" :rules="formRules" label-width="150px">
        
        <el-divider content-position="left">核心信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="主键唯一标识" prop="zjsjwyxbs"><el-input v-model="form.zjsjwyxbs" placeholder="可不填，后端自动生成" maxlength="32" show-word-limit /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="学校代码" prop="xxdm"><el-input v-model="form.xxdm" :disabled="true" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="采用教学资源类型" prop="cyjxzylx"><el-select v-model="form.cyjxzylx" placeholder="请选择资源类型" style="width: 100%;"><el-option v-for="item in dictData.CYJXZYLXDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="采用教学资源编号" prop="cyjxzybh"><el-input v-model="form.cyjxzybh" placeholder="请输入资源编号" maxlength="64" show-word-limit /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24"><el-form-item label="采用教学资源名称" prop="cyjxzymc"><el-input v-model="form.cyjxzymc" placeholder="请输入资源名称" maxlength="300" show-word-limit /></el-form-item></el-col>
        </el-row>

        <el-divider content-position="left">国家信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="采用国家代码" prop="cygjdm"><el-input v-model="form.cygjdm" placeholder="请输入国家代码" maxlength="6" show-word-limit /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="采用国家名称" prop="cygjmc"><el-input v-model="form.cygjmc" placeholder="请输入国家名称" maxlength="60" show-word-limit /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="采用国家所属大洲" prop="cygjssdz"><el-input v-model="form.cygjssdz" placeholder="请输入所属大洲" maxlength="20" show-word-limit /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="一带一路" prop="sfydyl"><el-select v-model="form.sfydyl" style="width: 100%;"><el-option v-for="item in dictData.SFBZDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="中亚五国" prop="sfzywg"><el-select v-model="form.sfzywg" style="width: 100%;"><el-option v-for="item in dictData.SFBZDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="东盟十国" prop="sfdmsg"><el-select v-model="form.sfdmsg" style="width: 100%;"><el-option v-for="item in dictData.SFBZDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="上合组织" prop="sfshzz"><el-select v-model="form.sfshzz" style="width: 100%;"><el-option v-for="item in dictData.SFBZDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="金砖国家" prop="sfjzgj"><el-select v-model="form.sfjzgj" style="width: 100%;"><el-option v-for="item in dictData.SFBZDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
        </el-row>
        
        <el-divider content-position="left">采用信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="采用时间" prop="cysj"><el-date-picker v-model="form.cysj" type="month" placeholder="请选择采用年月" format="YYYYMM" value-format="YYYYMM" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="采用院校(机构)" prop="cyyxjg"><el-input v-model="form.cyyxjg" placeholder="请输入采用院校或机构" maxlength="160" show-word-limit /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="采用类型" prop="cylx"><el-select v-model="form.cylx" placeholder="请选择采用类型" style="width: 100%;"><el-option v-for="item in dictData.CYLXDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="涉及外方学生数" prop="sjwfxss"><el-input-number v-model="form.sjwfxss" :min="0" controls-position="right" style="width: 100%;" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="数据采集时间" prop="sjcjsj"><el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="请选择数据采集时间" format="YYYYMMDD HHmmss" value-format="YYYYMMDD HHmmss" style="width: 100%;" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <div v-else class="resource-adoption-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主键唯一标识">{{ form.zjsjwyxbs }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{ form.xxdm }}</el-descriptions-item>
          <el-descriptions-item label="资源类型">{{ getDictLabel(dictData.CYJXZYLXDM, form.cyjxzylx) }}</el-descriptions-item>
          <el-descriptions-item label="资源编号">{{ form.cyjxzybh }}</el-descriptions-item>
          <el-descriptions-item label="资源名称" :span="2">{{ form.cyjxzymc }}</el-descriptions-item>
          <el-descriptions-item label="国家代码">{{ form.cygjdm }}</el-descriptions-item>
          <el-descriptions-item label="国家名称">{{ form.cygjmc }}</el-descriptions-item>
          <el-descriptions-item label="所属大洲">{{ form.cygjssdz }}</el-descriptions-item>
          <el-descriptions-item label="一带一路">{{ getDictLabel(dictData.SFBZDM, form.sfydyl) }}</el-descriptions-item>
          <el-descriptions-item label="中亚五国">{{ getDictLabel(dictData.SFBZDM, form.sfzywg) }}</el-descriptions-item>
          <el-descriptions-item label="东盟十国">{{ getDictLabel(dictData.SFBZDM, form.sfdmsg) }}</el-descriptions-item>
          <el-descriptions-item label="上合组织">{{ getDictLabel(dictData.SFBZDM, form.sfshzz) }}</el-descriptions-item>
          <el-descriptions-item label="金砖国家">{{ getDictLabel(dictData.SFBZDM, form.sfjzgj) }}</el-descriptions-item>
          <el-descriptions-item label="采用时间">{{ form.cysj }}</el-descriptions-item>
          <el-descriptions-item label="采用院校(机构)">{{ form.cyyxjg }}</el-descriptions-item>
          <el-descriptions-item label="采用类型">{{ getDictLabel(dictData.CYLXDM, form.cylx) }}</el-descriptions-item>
          <el-descriptions-item label="涉及外方学生数">{{ form.sjwfxss }}</el-descriptions-item>
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
import { Search, Refresh, Plus, Edit, Delete, View, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getOdsJxzycnjcsjPage,
  getOdsJxzycnjcsjById,
  addOdsJxzycnjcsj,
  updateOdsJxzycnjcsj,
  deleteOdsJxzycnjcsj,
  batchDeleteOdsJxzycnjcsj,
  exportOdsJxzycnjcsj,
  getDictOptions,
  getSystemSchoolCode,
  type OdsJxzycnjcsjInfo,
  type OdsJxzycnjcsjQuery,
  type OdsJxzycnjcsjForm,
} from "@/api-code/code/code_base/zyggj/ods_jxzycnjcsj";

type DictOption = { label: string; value: any;[key: string]: any; };

const loading = ref(false);
const dataList = ref<OdsJxzycnjcsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();
const systemSchoolCode = ref("");

const queryParams = reactive<OdsJxzycnjcsjQuery>({
  cyjxzymc: "",
  cygjmc: "",
  pageNum: 1,
  pageSize: 20,
});

const initialState: OdsJxzycnjcsjForm = {
    zjsjwyxbs: "", xxdm: "", cyjxzylx: "", cyjxzybh: "", cyjxzymc: "",
    cygjdm: "", cygjmc: "", cygjssdz: "", sfydyl: "", sfzywg: "",
    sfdmsg: "", sfshzz: "", sfjzgj: "", cysj: "", cyyxjg: "",
    cylx: "", sjwfxss: undefined, sjcjsj: "",
};

const form = ref<OdsJxzycnjcsjForm>({ ...initialState });

const formRules = reactive<FormRules>({
  zjsjwyxbs: [{ validator: (rule: any, value: string, cb: Function) => {
    if (value && (!/^[A-Z0-9]+$/.test(value) || value.length !== 32)) {
      cb(new Error('主键唯一标识必须是32位大写字母和数字组合'));
    } else { cb(); }
  }, trigger: 'blur' }],
  xxdm: [{ required: true, message: "学校代码为必填项", trigger: "blur" }],
  cyjxzylx: [{ required: true, message: "请选择采用教学资源类型", trigger: "change" }],
  cyjxzybh: [{ required: true, message: "请输入采用教学资源编号", trigger: "blur" }, {max: 64, message: '长度不能超过64位'}],
  cyjxzymc: [{ required: true, message: "请输入采用教学资源名称", trigger: "blur" }, {max: 300, message: '长度不能超过300位'}],
  cygjdm: [{ required: true, message: "请输入采用国家代码", trigger: "blur" }, {max: 6, message: '长度不能超过6位'}],
  cygjmc: [{ required: true, message: "请输入采用国家名称", trigger: "blur" }, {max: 60, message: '长度不能超过60位'}],
  cygjssdz: [{ required: true, message: "请输入采用国家所属大洲", trigger: "blur" }, {max: 20, message: '长度不能超过20位'}],
  sfydyl: [{ required: true, message: "请选择是否一带一路国家", trigger: "change" }],
  sfzywg: [{ required: true, message: "请选择是否中亚五国国家", trigger: "change" }],
  sfdmsg: [{ required: true, message: "请选择是否东盟十国国家", trigger: "change" }],
  sfshzz: [{ required: true, message: "请选择是否上合组织国家", trigger: "change" }],
  sfjzgj: [{ required: true, message: "请选择是否金砖国家", trigger: "change" }],
  cysj: [{ required: true, message: "请选择采用时间", trigger: "change" }],
  cyyxjg: [{ required: true, message: "请输入采用院校(机构)", trigger: "blur" }, {max: 160, message: '长度不能超过160位'}],
  cylx: [{ required: true, message: "请选择采用类型", trigger: "change" }],
  sjwfxss: [{ required: true, message: "请输入涉及外方学生数", trigger: "blur" }],
  sjcjsj: [{ required: true, message: "请选择数据采集时间", trigger: "change" }],
});

const dictData = reactive<{
  CYJXZYLXDM: DictOption[],
  SFBZDM: DictOption[],
  CYLXDM: DictOption[],
}>({
  CYJXZYLXDM: [],
  SFBZDM: [],
  CYLXDM: [],
});

const dialogTitle = computed(() => {
  if (dialogMode.value === 'add') return "新增教学资源采纳数据";
  if (dialogMode.value === 'edit') return "编辑教学资源采纳数据";
  return "查看教学资源采纳数据";
});

const getDictLabel = (options: DictOption[], value: any) => {
  const option = options.find(item => item.value == value);
  return option ? option.label : value;
};

const fetchDictData = async () => {
  try {
    const [res1, res2, res3] = await Promise.all([
      getDictOptions("CYJXZYLXDM"),
      getDictOptions("SFBZDM"),
      getDictOptions("CYLXDM"),
    ]);
    if (res1.data.code === 200) dictData.CYJXZYLXDM = res1.data.data;
    if (res2.data.code === 200) dictData.SFBZDM = res2.data.data;
    if (res3.data.code === 200) dictData.CYLXDM = res3.data.data;
  } catch (error) {
    console.error("获取字典数据失败:", error);
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

const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsJxzycnjcsjPage(queryParams);
    if(response.data.code === 200) {
        const transformedData = response.data.data.records.map(item => ({
            ...item,
            cyjxzylxText: getDictLabel(dictData.CYJXZYLXDM, item.cyjxzylx),
            cylxText: getDictLabel(dictData.CYLXDM, item.cylx)
        }));
        dataList.value = transformedData;
        total.value = response.data.data.total;
    }
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

const handleEdit = async (row: OdsJxzycnjcsjInfo) => {
  resetForm();
  try {
    const response = await getOdsJxzycnjcsjById(row.id);
    form.value = response.data.data;
    dialogMode.value = "edit";
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取详情失败");
  }
};

const handleView = async (row: OdsJxzycnjcsjInfo) => {
  resetForm();
  try {
    const response = await getOdsJxzycnjcsjById(row.id);
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
          await addOdsJxzycnjcsj(form.value);
          ElMessage.success("新增成功");
        } else {
          await updateOdsJxzycnjcsj(form.value);
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

const handleDelete = async (row: OdsJxzycnjcsjInfo) => {
  await ElMessageBox.confirm("确定删除吗?", "提示", { type: "warning" });
  await deleteOdsJxzycnjcsj(row.id);
  ElMessage.success("删除成功");
  getList();
};

const handleBatchDelete = async () => {
  await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 条数据吗?`, "提示", { type: "warning" });
  await batchDeleteOdsJxzycnjcsj(selectedIds.value);
  ElMessage.success("批量删除成功");
  getList();
};

const handleExport = async () => {
  ElMessage.info("正在导出，请稍候...");
  try {
    const response = await exportOdsJxzycnjcsj(queryParams);
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `教学资源采纳数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (e) {
    ElMessage.error("导出失败");
  }
};

const handleSelectionChange = (selection: OdsJxzycnjcsjInfo[]) => {
  selectedIds.value = selection.map(item => item.id);
};

const handleRowDblClick = (row: OdsJxzycnjcsjInfo) => handleView(row);
const handleSizeChange = (size: number) => { queryParams.pageSize = size; getList(); };
const handleCurrentChange = (page: number) => { queryParams.pageNum = page; getList(); };

onMounted(async () => {
  await getSystemSchoolCodeData();
  await fetchDictData();
  getList();
});
</script>

<style scoped>
.teaching-resource-adoption-management { padding: 0; }
.search-card { margin-bottom: 8px; }
.search-form { display: flex; flex-wrap: wrap; gap: 8px; }
.table-card { margin-top: -10px; }
.table-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e4e7ed; background-color: #fafafa; }
.operation-buttons { display: flex; align-items: center; gap: 8px; }
.header-title { font-size: 16px; font-weight: 600; color: #303133; flex: 1; text-align: center; }
.placeholder { width: 100px; display: flex; justify-content: flex-end; }
.pagination-wrapper { display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; border-top: 1px solid #e4e7ed; background-color: #fafafa; }
.total-info { font-size: 14px; color: #606266; }
:deep(.resource-adoption-dialog .el-dialog__body) { padding: 20px 24px; max-height: 70vh; overflow-y: auto; }
:deep(.resource-adoption-dialog .el-form-item) { margin-bottom: 18px; }
.resource-adoption-detail .el-descriptions { margin-bottom: 16px; }
.dialog-footer { text-align: right; }
:deep(.el-col) { margin-bottom: 18px; }
</style>
