<template>
  <div class="user-auth-log-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
          <el-form-item label="登录账号" prop="dlzh">
            <el-input
              v-model="queryParams.dlzh"
              placeholder="请输入登录账号"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="角色" prop="js">
            <el-input
              v-model="queryParams.js"
              placeholder="请输入角色"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
           <el-form-item label="所在部门" prop="szbmmc">
            <el-input
              v-model="queryParams.szbmmc"
              placeholder="请输入所在部门"
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
        <div class="header-title">统一用户认证登录数据数据清洗</div>
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
          <el-table-column prop="dlzh" label="登录账号" min-width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="js" label="角色" min-width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="szbmmc" label="所在部门名称" min-width="150" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="dlsj" label="登录时间" min-width="160" align="center" sortable="custom" />
          <el-table-column prop="dlip" label="登录IP" min-width="130" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="zhztmText" label="账号状态" min-width="100" align="center" sortable="custom" />
          <el-table-column prop="sjcjsj" label="数据采集时间" min-width="160" align="center" sortable="custom" />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getReportStatusTagType(row.reportStatus)" size="small">
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enableStatus === '1' ? 'success' : 'danger'" size="small">
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="160" align="center" sortable="custom" />
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
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 500px"
      class="user-auth-log-dialog"
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
            <el-form-item label="登录账号" prop="dlzh">
              <el-input v-model="form.dlzh" placeholder="请输入登录账号" maxlength="30" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="角色" prop="js">
              <el-input v-model="form.js" placeholder="多个角色用逗号隔开" maxlength="60" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="所在部门名称" prop="szbmmc">
              <el-input v-model="form.szbmmc" placeholder="请输入所在部门名称" maxlength="200" show-word-limit />
            </el-form-item>
          </el-col>
           <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="登录IP" prop="dlip">
              <el-input v-model="form.dlip" placeholder="请输入登录IP" maxlength="128" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="登录时间" prop="dlsj">
              <el-date-picker
                v-model="form.dlsj"
                type="datetime"
                placeholder="请选择登录时间"
                format="YYYYMMDD HHmmss"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间"
                format="YYYYMMDD HHmmss"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
           <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="账号状态码" prop="zhztm">
              <el-select v-model="form.zhztm" placeholder="请选择账号状态" style="width: 100%" clearable>
                <el-option
                  v-for="item in dictData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select v-model="form.enableStatus" placeholder="请选择启用状态" style="width: 100%">
                <el-option label="禁用" value="0" />
                <el-option label="启用" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="user-auth-log-detail">
        <el-descriptions class="detail-descriptions" :column="2" size="large" border>
          <el-descriptions-item label="唯一性标识"><div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="学校代码"><div class="detail-value">{{ form.xxdm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="登录账号"><div class="detail-value">{{ form.dlzh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="角色"><div class="detail-value">{{ form.js || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="所在部门名称"><div class="detail-value">{{ form.szbmmc || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="登录时间"><div class="detail-value">{{ form.dlsj || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="登录IP"><div class="detail-value">{{ form.dlip || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="账号状态"><div class="detail-value">{{ form.zhztmText || "-" }}</div></el-descriptions-item>
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

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, View, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsTyyhrzdlsjPage,
  getOdsTyyhrzdlsjById,
  addOdsTyyhrzdlsj,
  updateOdsTyyhrzdlsj,
  deleteOdsTyyhrzdlsj,
  batchDeleteOdsTyyhrzdlsj,
  exportOdsTyyhrzdlsj,
  getSystemSchoolCode,
  getDictOptions,
  type DictOption,
  type OdsTyyhrzdlsjInfo,
  type OdsTyyhrzdlsjQuery,
  type OdsTyyhrzdlsjForm,
  
} from "@/api-data/data/data_base/zygfw/ods_tyyhrzdlsj";

 

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsTyyhrzdlsjInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const selectedIds = ref<number[]>([]);

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add": return "新增统一用户认证登录数据";
    case "edit": return "编辑统一用户认证登录数据";
    case "view": return "查看统一用户认证登录数据";
    default: return "统一用户认证登录数据";
  }
});

// 搜索条件
const queryParams = reactive<OdsTyyhrzdlsjQuery>({
  dlzh: "",
  js: "",
  szbmmc: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单相关
const form = reactive<OdsTyyhrzdlsjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  dlzh: "",
  js: "",
  szbmmc: "",
  dlsj: "",
  dlip: "",
  zhztm: "",
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();
const submitLoading = ref(false);
const systemSchoolCode = ref("");

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [ {
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) { callback(); } 
        else if (value.length !== 32) { callback(new Error('唯一编码必须是32位')); } 
        else if (!/^[A-Z0-9]+$/.test(value)) { callback(new Error('只能包含大写字母和数字')); }
        else { callback(); }
      },
      trigger: 'blur'
    }
  ],
  xxdm: [ { required: true, message: "请输入学校代码", trigger: "blur" }, { pattern: /^\d{10}$/, message: "必须是10位数字", trigger: "blur" } ],
  dlzh: [ { required: true, message: "请输入登录账号", trigger: "blur" }, { max: 30, message: "长度不能超过30位", trigger: "blur" } ],
  js: [ { max: 60, message: "长度不能超过60位", trigger: "blur" } ],
  szbmmc: [ { max: 200, message: "长度不能超过200位", trigger: "blur" } ],
  dlsj: [ { required: true, message: "请选择登录时间", trigger: "change" } ],
  dlip: [ { max: 128, message: "长度不能超过128位", trigger: "blur" } ],
  zhztm: [ { required: true, message: "请选择账号状态码", trigger: "change" } ],
  sjcjsj: [ { required: true, message: "请选择数据采集时间", trigger: "change" } ]
});

// 字典数据
const dictData = ref<DictOption[]>([]);

// 获取字典数据
const loadDictData = async () => {
  try {
    const res = await getDictOptions('ZHZTDM') as any;
    if (res.data.code === 200) {
      dictData.value = res.data.data || [];
    }
  } catch (error) {
    console.error("获取字典数据失败:", error);
    ElMessage.error("获取字典数据失败");
  }
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  switch (status) {
    case "0": return "未上报";
    case "1": return "已上报";
    case "2": return "上报失败";
    default: return "未知";
  }
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "0": return "info";
    case "1": return "success";
    case "2": return "danger";
    default: return "warning";
  }
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsTyyhrzdlsjPage(queryParams);
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

// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置搜索
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsTyyhrzdlsjInfo) => {
  try {
    const response: any = await getOdsTyyhrzdlsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsTyyhrzdlsjInfo) => {
  try {
    const response: any = await getOdsTyyhrzdlsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsTyyhrzdlsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsTyyhrzdlsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除数据失败:", error);
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
      `确定要删除选中的 ${selectedIds.value.length} 条数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsTyyhrzdlsj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsTyyhrzdlsj(queryParams);
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `统一用户认证登录数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;
    const formData = { ...form };

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsTyyhrzdlsj(formData);
    } else {
      response = await updateOdsTyyhrzdlsj(formData);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.msg || "操作失败");
    }
  } catch (error) {
    console.error("提交表单失败:", error);
  } finally {
    submitLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    dlzh: "",
    js: "",
    szbmmc: "",
    dlsj: "",
    dlip: "",
    zhztm: "",
    sjcjsj: "",
    enableStatus: "1",
  });
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

// 关闭表单对话框
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 行点击事件
const handleRowClick = () => {};

// 表格选择变化
const handleSelectionChange = (selection: OdsTyyhrzdlsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行双击
const handleRowDblClick = (row: OdsTyyhrzdlsjInfo) => {
  handleView(row);
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 获取系统学校代码
const getSystemSchoolCodeData = async () => {
  try {
    const response: any = await getSystemSchoolCode();
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      form.xxdm = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "获取学校代码失败");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.error("获取学校代码失败");
  }
};

onMounted(() => {
  getSystemSchoolCodeData();
  loadDictData();
  getList();
});
</script>

<style scoped>
.user-auth-log-management {
  padding: 0px;
}
.search-card {
  margin-bottom: 8px;
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
.table-card {
  margin-top: -10px;
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.user-auth-log-dialog {
  border-radius: 8px;
}
.user-auth-log-detail {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px 0;
}
.detail-descriptions {
  margin-bottom: 20px;
}
.detail-value {
  color: #303133;
  font-weight: 500;
  word-break: break-all;
}
.detail-value:empty::before {
  content: "-";
  color: #909399;
}
:deep(.el-table .el-table__body-wrapper .el-table__row) {
  transition: background-color 0.2s ease;
}
:deep(.el-table .el-table__body-wrapper .el-table__row:hover) {
  background-color: #f5f7fa;
}
:deep(.user-auth-log-dialog .el-dialog__header) {
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 15px 20px;
}
:deep(.user-auth-log-dialog .el-dialog__title) {
  color: white;
  font-weight: 600;
}
:deep(.user-auth-log-dialog .el-dialog__headerbtn) {
  top: 50%;
  transform: translateY(-50%);
}
:deep(.user-auth-log-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 18px;
}
:deep(.user-auth-log-dialog .el-dialog__body) {
  padding: 20px 24px;
  max-height: 60vh;
  overflow-y: auto;
}
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
:deep(.operation-buttons .el-button) {
  border-radius: 6px;
  font-weight: 500;
}
:deep(.action-buttons .el-button) {
  padding: 2px 4px;
  font-size: 12px;
}
:deep(.el-tag) {
  border-radius: 4px;
  font-weight: 500;
}
:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa !important;
  box-shadow: 0 0 0 1px #e4e7ed inset !important;
}
:deep(.el-input.is-disabled .el-input__inner) {
  background-color: transparent !important;
  color: #606266 !important;
}
</style>
