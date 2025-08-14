<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, View, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getOdsXxhxtjcqksjPage,
  getOdsXxhxtjcqksjById,
  addOdsXxhxtjcqksj,
  updateOdsXxhxtjcqksj,
  deleteOdsXxhxtjcqksj,
  searchSystemInfo,
  batchDeleteOdsXxhxtjcqksj,
  exportOdsXxhxtjcqksj,
  getDictOptions,
  getSystemSchoolCode,
  type OdsXxhxtjcqksjInfo,
  type OdsXxhxtjcqksjQuery,
  type OdsXxhxtjcqksjForm,
} from "@/api-data/data/data_base/zygfw/ods_xxhxtjcqksj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsXxhxtjcqksjInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const selectedIds = ref<number[]>([]);

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add": return "新增集成情况";
    case "edit": return "编辑集成情况";
    case "view": return "查看集成情况";
    default: return "集成情况";
  }
});

// 搜索条件
const queryParams = reactive<OdsXxhxtjcqksjQuery>({
  xxhxtjc: "",
  xxhxtqc: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单相关
const form = reactive<OdsXxhxtjcqksjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  xxhxtbh: "",
  xxhxtjc: "",
  xxhxtqc: "",
  jcfxm: "",
  jcbb: "",
  jcfsm: "",
  jkxym: "",
  jkbb: "",
  rzfsm: "",
  jcwcrq: "",
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();
const submitLoading = ref(false);
const systemSchoolCode = ref("");

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [{ validator: (rule: any, value: string, callback: Function) => {
      if (!value) callback();
      else if (value.length !== 32) callback(new Error('唯一编码必须是32位'));
      else if (!/^[A-Z0-9]+$/.test(value)) callback(new Error('只能包含大写字母和数字'));
      else callback();
    }, trigger: 'blur' }],
  xxdm: [{ required: true, message: "学校代码不能为空", trigger: "blur" }],
  xxhxtbh: [{ required: true, message: "系统编号不能为空", trigger: "blur" }, { max: 60, message: "长度不能超过60位", trigger: "blur" }],
  xxhxtjc: [{ required: true, message: "系统简称不能为空", trigger: "blur" }, { max: 64, message: "长度不能超过64位", trigger: "blur" }],
  xxhxtqc: [{ required: true, message: "系统全称不能为空", trigger: "blur" }, { max: 200, message: "长度不能超过200位", trigger: "blur" }],
  jcfxm: [{ required: true, message: "请选择集成方向码", trigger: "change" }],
  jcfsm: [{ required: true, message: "请选择集成方式码", trigger: "change" }],
  jkxym: [{ required: true, message: "请选择接口协议码", trigger: "change" }],
  rzfsm: [{ required: true, message: "请选择认证方式码", trigger: "change" }],
  jcwcrq: [{ required: true, message: "请选择集成完成日期", trigger: "change" }],
  sjcjsj: [{ required: true, message: "请选择数据采集时间", trigger: "change" }],
});

// 字典数据
const dictData = reactive({
  jcfxmOptions: [], // 系统集成方向代码
  jcfsmOptions: [], // 系统集成方式代码
  jkxymOptions: [], // 接口协议代码
  rzfsmOptions: [], // 系统认证方式代码
});
// 信息化系统选项
const systemOptions = ref<any[]>([]);

// 加载字典数据
const loadDictData = async () => {
  try {
    const [jcfxmRes, jcfsmRes, jkxymRes, rzfsmRes] = await Promise.all([
      getDictOptions('XTJCFXDM'),
      getDictOptions('XTJCFSDM'),
      getDictOptions('JKXYDM'),
      getDictOptions('XTRZFSDM'),
    ]);
    if (jcfxmRes.data.code === 200) dictData.jcfxmOptions = jcfxmRes.data.data || [];
    if (jcfsmRes.data.code === 200) dictData.jcfsmOptions = jcfsmRes.data.data || [];
    if (jkxymRes.data.code === 200) dictData.jkxymOptions = jkxymRes.data.data || [];
    if (rzfsmRes.data.code === 200) dictData.rzfsmOptions = rzfsmRes.data.data || [];
  } catch (error) {
    console.error("获取字典数据失败:", error);
    ElMessage.error("获取字典数据失败");
  }
};

// 获取信息化系统选项
const handleSystemSearch = async (query: string) => {
  if (query) {
    loading.value = true;
    try {
      const response: any = await searchSystemInfo(query);
      if (response.data.code === 200) {
        systemOptions.value = response.data.data || [];
      } else {
        systemOptions.value = [];
      }
    } catch (e) {
      systemOptions.value = [];
    } finally {
      loading.value = false;
    }
  } else {
    systemOptions.value = [];
  }
};
//
// 信息化系统选项
const handleSystemChange = (value: string) => {
  form.xxhxtqc = systemOptions.value.find(item => item.value === value)?.label || '';
  form.xxhxtjc = systemOptions.value.find(item => item.value === value)?.xxhxtjc || '';
  
};

// 获取上报状态文本和标签
const getReportStatusText = (status: string) => ({ "0": "未上报", "1": "已上报", "2": "上报失败" }[status] || "未知");
const getReportStatusTagType = (status: string) => ({ "0": "info", "1": "success", "2": "danger" }[status] || "warning");

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsXxhxtjcqksjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询数据失败:", error);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};

// 搜索与重置
const handleQuery = () => { queryParams.pageNum = 1; getList(); };
const resetQuery = () => { queryFormRef.value?.resetFields(); queryParams.pageNum = 1; getList(); };

// 新增、编辑、查看
const handleAdd = () => { resetForm(); dialogMode.value = "add"; dialogVisible.value = true; };
const handleEdit = async (row: OdsXxhxtjcqksjInfo) => {
  try {
    const response: any = await getOdsXxhxtjcqksjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "edit"; dialogVisible.value = true;
    } else { ElMessage.error(response.data.msg || "获取详情失败"); }
  } catch (error) { console.error("获取详情失败:", error); ElMessage.error("获取详情失败"); }
};
const handleView = async (row: OdsXxhxtjcqksjInfo) => {
  try {
    const response: any = await getOdsXxhxtjcqksjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "view"; dialogVisible.value = true;
    } else { ElMessage.error(response.data.msg || "获取详情失败"); }
  } catch (error) { console.error("获取详情失败:", error); ElMessage.error("获取详情失败"); }
};

// 删除
const handleDelete = async (row: OdsXxhxtjcqksjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条数据吗？", "提示", { type: "warning" });
    const response: any = await deleteOdsXxhxtjcqksj(row.id);
    if (response.data.code === 200) { ElMessage.success("删除成功"); getList(); }
    else { ElMessage.error(response.data.msg || "删除失败"); }
  } catch (error) { if (error !== "cancel") { console.error("删除失败:", error); ElMessage.error("删除失败"); } }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) { ElMessage.warning("请选择要删除的数据"); return; }
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, "提示", { type: "warning" });
    const response: any = await batchDeleteOdsXxhxtjcqksj(selectedIds.value);
    if (response.data.code === 200) { ElMessage.success("批量删除成功"); selectedIds.value = []; getList(); }
    else { ElMessage.error(response.data.msg || "批量删除失败"); }
  } catch (error) { if (error !== "cancel") { console.error("批量删除失败:", error); ElMessage.error("批量删除失败"); } }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsXxhxtjcqksj(queryParams);
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `信息化系统集成情况数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) { console.error("导出失败:", error); ElMessage.error("导出失败"); }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    submitLoading.value = true;
    const response: any = dialogMode.value === "add" ? await addOdsXxhxtjcqksj(form) : await updateOdsXxhxtjcqksj(form);
    if (response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false; getList();
    } else { ElMessage.error(response.data.msg || "操作失败"); }
  } catch (error) { console.error("提交表单失败:", error); } 
  finally { submitLoading.value = false; }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined, zjsjwyxbs: "", xxdm: systemSchoolCode.value, xxhxtbh: "", xxhxtjc: "",
    xxhxtqc: "", jcfxm: "", jcbb: "", jcfsm: "", jkxym: "", jkbb: "", rzfsm: "", jcwcrq: "",
    sjcjsj: "", enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

// 关闭对话框
const handleFormClose = () => { dialogVisible.value = false; resetForm(); };

// 表格交互
const handleRowClick = () => {};
const handleSelectionChange = (selection: OdsXxhxtjcqksjInfo[]) => { selectedIds.value = selection.map((item) => item.id); };
const handleRowDblClick = (row: OdsXxhxtjcqksjInfo) => { handleView(row); };

// 分页
const handleSizeChange = (size: number) => { queryParams.pageSize = size; queryParams.pageNum = 1; getList(); };
const handleCurrentChange = (page: number) => { queryParams.pageNum = page; getList(); };

// 获取系统学校代码
const getSystemSchoolCodeData = async () => {
  try {
    const response: any = await getSystemSchoolCode();
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      form.xxdm = response.data.data;
    } else { ElMessage.error(response.data.msg || "获取学校代码失败"); }
  } catch (error) { console.error("获取学校代码失败:", error); ElMessage.error("获取学校代码失败"); }
};

onMounted(() => {
  getSystemSchoolCodeData();
  loadDictData();
  getList();
});
</script>

<template>
  <div class="integration-status-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
          <el-form-item label="系统简称" prop="xxhxtjc">
            <el-input
              v-model="queryParams.xxhxtjc"
              placeholder="请输入信息化系统简称"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="系统全称" prop="xxhxtqc">
            <el-input
              v-model="queryParams.xxhxtqc"
              placeholder="请输入信息化系统全称"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
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
        </div>
        <div class="header-title">信息化系统集成情况数据数据清洗</div>
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
          <el-table-column prop="zjsjwyxbs" label="唯一性标识" min-width="220" show-overflow-tooltip />
          <el-table-column prop="xxdm" label="学校代码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="xxhxtbh" label="系统编号" min-width="150" show-overflow-tooltip />
          <el-table-column prop="xxhxtjc" label="系统简称" min-width="180" show-overflow-tooltip />
          <el-table-column prop="xxhxtqc" label="系统全称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="jcfxmText" label="集成方向" min-width="120" show-overflow-tooltip />
          <el-table-column prop="jcfsmText" label="集成方式" min-width="120" show-overflow-tooltip />
          <el-table-column prop="jkxymText" label="接口协议" min-width="120" show-overflow-tooltip />
          <el-table-column prop="rzfsmText" label="认证方式" min-width="120" show-overflow-tooltip />
          <el-table-column prop="jcwcrq" label="集成完成日期" min-width="130" align="center" />
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enableStatus === '1' ? 'success' : 'danger'" size="small">
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="160" align="center" />
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button link type="primary" size="small" @click="handleView(row)">
                  <el-icon><View /></el-icon>查看
                </el-button>
                <el-button link type="primary" size="small" @click="handleEdit(row)">
                  <el-icon><Edit /></el-icon>编辑
                </el-button>
                <el-button link type="danger" size="small" @click="handleDelete(row)">
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
      width="900px"
      :close-on-click-modal="false"
      append-to-body
      class="integration-status-dialog"
      destroy-on-close
      @close="handleFormClose"
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input v-model="form.zjsjwyxbs" placeholder="可不填，后端自动生成32位唯一编码" maxlength="32" show-word-limit style="text-transform: uppercase" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input v-model="form.xxdm" placeholder="系统自动获取学校代码" maxlength="10" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="系统编号" prop="xxhxtbh">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select
                  v-model="form.xxhxtbh"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入信息化系统编号搜索"
                  :remote-method="handleSystemSearch"
                  :loading="loading"
                  @change="handleSystemChange"
                  style="width: 100%"
                  clearable
                  value-key="value"
                >
                  <el-option
                    v-for="item in systemOptions"
                    :key="item.value"
                    :label="item.value + '(' + item.label + ')'"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip content="数据来源于信息化系统建设数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
                </div>
              <!-- <el-input v-model="form.xxhxtbh" placeholder="请输入信息化系统编号" maxlength="60" show-word-limit /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="系统简称" prop="xxhxtjc">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-input v-model="form.xxhxtjc" placeholder="请输入信息化系统简称" maxlength="64" show-word-limit />
              <el-tooltip content="数据来源于信息化系统建设数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px;">
            <el-form-item label="系统全称" prop="xxhxtqc">
              <el-input v-model="form.xxhxtqc" placeholder="请输入信息化系统全称" maxlength="200" show-word-limit type="textarea" :rows="2"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="集成方向码" prop="jcfxm">
              <el-select v-model="form.jcfxm" placeholder="请选择集成方向码" style="width: 100%;">
                <el-option v-for="item in dictData.jcfxmOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="集成版本" prop="jcbb">
              <el-input v-model="form.jcbb" placeholder="请输入集成版本" maxlength="10" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="集成方式码" prop="jcfsm">
              <el-select v-model="form.jcfsm" placeholder="请选择集成方式码" style="width: 100%;">
                <el-option v-for="item in dictData.jcfsmOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="接口协议码" prop="jkxym">
              <el-select v-model="form.jkxym" placeholder="请选择接口协议码" style="width: 100%;">
                <el-option v-for="item in dictData.jkxymOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="接口版本" prop="jkbb">
              <el-input v-model="form.jkbb" placeholder="请输入接口版本" maxlength="10" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="认证方式码" prop="rzfsm">
              <el-select v-model="form.rzfsm" placeholder="请选择认证方式码" style="width: 100%;">
                <el-option v-for="item in dictData.rzfsmOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="集成完成日期" prop="jcwcrq">
              <el-date-picker v-model="form.jcwcrq" type="date" placeholder="请选择集成完成日期" format="YYYYMMDD" value-format="YYYYMMDD" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="请选择数据采集时间" format="YYYYMMDD HHmmss" value-format="YYYYMMDD HHmmss" style="width: 100%;" />
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

      <!-- 查看模式 -->
      <div v-else class="integration-status-detail">
        <el-descriptions class="detail-descriptions" :column="2" size="large" border>
          <el-descriptions-item label="唯一性标识"><div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="学校代码"><div class="detail-value">{{ form.xxdm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="系统编号"><div class="detail-value">{{ form.xxhxtbh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="系统简称"><div class="detail-value">{{ form.xxhxtjc || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="系统全称" :span="2"><div class="detail-value">{{ form.xxhxtqc || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="集成方向"><div class="detail-value">{{ form.jcfxmText || form.jcfxm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="集成版本"><div class="detail-value">{{ form.jcbb || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="集成方式"><div class="detail-value">{{ form.jcfsmText || form.jcfsm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="接口协议"><div class="detail-value">{{ form.jkxymText || form.jkxym || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="接口版本"><div class="detail-value">{{ form.jkbb || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="认证方式"><div class="detail-value">{{ form.rzfsmText || form.rzfsm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="集成完成日期"><div class="detail-value">{{ form.jcwcrq || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="数据采集时间"><div class="detail-value">{{ form.sjcjsj || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag :type="form.enableStatus === '1' ? 'success' : 'danger'" size="small">
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(form.reportStatus)" size="small">
              {{ getReportStatusText(form.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间"><div class="detail-value">{{ form.createTime || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="更新时间"><div class="detail-value">{{ form.updateTime || "-" }}</div></el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogMode !== 'view'" type="primary" :loading="submitLoading" @click="handleFormSubmit">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.integration-status-management { padding: 0px; }
.search-card { margin-bottom: 8px; }
.search-bar { padding: 8px; }
.search-form { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.search-buttons, :deep(.el-form-item) { margin-bottom: 0; margin-right: 8px; }
:deep(.el-form-item__content) { display: flex; align-items: center; }
:deep(.el-button) { height: 32px; padding: 8px 15px; }
.table-card { margin-top: -10px; }
.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 2px; }
.operation-buttons { display: flex; gap: 10px; }
.header-title { font-size: 16px; font-weight: bold; color: #303133; }
.action-buttons { display: flex; gap: 2px; }
.pagination-wrapper { display: flex; justify-content: space-between; align-items: center; margin-top: 5px; padding: 2px 2px; }
.total-info { color: #606266; font-size: 14px; }
.dialog-footer { display: flex; justify-content: flex-end; gap: 10px; }
.integration-status-dialog { border-radius: 8px; }
.integration-status-detail { max-height: 60vh; overflow-y: auto; padding: 10px 0; }
.detail-descriptions { margin-bottom: 20px; }
.detail-value { color: #303133; font-weight: 500; word-break: break-all; }
.detail-value:empty::before { content: "-"; color: #909399; }
:deep(.el-table .el-table__body-wrapper .el-table__row) { transition: background-color 0.2s ease; }
:deep(.el-table .el-table__body-wrapper .el-table__row:hover) { background-color: #f5f7fa; }
:deep(.integration-status-dialog .el-dialog__header) { background: linear-gradient(90deg, #409eff 0%, #67c23a 100%); color: white; border-radius: 8px 8px 0 0; padding: 15px 20px; }
:deep(.integration-status-dialog .el-dialog__title) { color: white; font-weight: 600; }
:deep(.integration-status-dialog .el-dialog__headerbtn) { top: 50%; transform: translateY(-50%); }
:deep(.integration-status-dialog .el-dialog__headerbtn .el-dialog__close) { color: white; font-size: 18px; }
:deep(.integration-status-dialog .el-dialog__body) { padding: 20px 24px; max-height: 60vh; overflow-y: auto; }
:deep(.el-form-item__label) { font-weight: 500; color: #303133; }
:deep(.el-input__wrapper), :deep(.el-select .el-input__wrapper) { border-radius: 6px; }
:deep(.operation-buttons .el-button) { border-radius: 6px; font-weight: 500; }
:deep(.action-buttons .el-button) { padding: 2px 4px; font-size: 12px; }
:deep(.el-tag) { border-radius: 4px; font-weight: 500; }
:deep(.el-input.is-disabled .el-input__wrapper) { background-color: #f5f7fa !important; box-shadow: 0 0 0 1px #e4e7ed inset !important; }
:deep(.el-input.is-disabled .el-input__inner) { background-color: transparent !important; color: #606266 !important; }
</style>
