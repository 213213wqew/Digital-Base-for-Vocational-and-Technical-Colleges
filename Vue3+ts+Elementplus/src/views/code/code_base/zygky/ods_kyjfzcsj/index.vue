<template>
  <div class="research-funding-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
          <el-form-item label="唯一性标识" prop="zjsjwyxbs">
            <el-input
              v-model="queryParams.zjsjwyxbs"
              placeholder="请输入唯一性标识"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="学校代码" prop="xxdm">
            <el-input
              v-model="queryParams.xxdm"
              placeholder="请输入学校代码"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="科研项目编号" prop="kyxmbh">
            <el-input
              v-model="queryParams.kyxmbh"
              placeholder="请输入科研项目编号"
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
        <div class="header-title">科研经费支出数据管理</div>
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
          @row-dblclick="handleView"
          :height="'calc(75vh - 160px)'"
          stripe
          size="default"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="zjsjwyxbs"
            label="唯一性标识"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="kyxmbh"
            label="科研项目编号"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jfzckyxmmc"
            label="经费支出科研项目名称"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jfzckyxmlbm"
            label="项目类别码"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            label="支出金额"
            prop="zcje"
            min-width="120"
            align="right"
          >
            <template #default="{ row }">
              <span>{{
                row.zcje ? Number(row.zcje).toLocaleString() : ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支出时间" prop="zcsj" min-width="160" />
          <el-table-column
            label="支出用途"
            prop="zcyt"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column label="数据采集时间" prop="sjcjsj" min-width="160" />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getReportStatusTagType(row.reportStatus)">
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
                    @change="handleStatusChange(row)"
                  />
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="160" />
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

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      class="data-form-dialog"
      destroy-on-close
      @close="handleFormClose"
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="170px"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可不填，后端自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
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
            <el-form-item label="科研项目编号" prop="kyxmbh">
              <div style="display: flex; align-items: center; gap: 8px"> 
              <el-select
                v-model="form.kyxmbh"
                filterable
                remote
                reserve-keyword
                placeholder="请输入科研项目编号搜索"
                :remote-method="handleProjectSearch"
                :loading="submitLoading"
               
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in kyxmjbsjList"
                  :key="item.kyxmbh"
                  :label="item.kyxmbh + ' - ' + item.kyxmmc"
                  :value="item.kyxmbh"
                />
              </el-select>
              <el-tooltip content="数据来源于科研项目表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="经费支出科研项目名称" prop="jfzckyxmmc">
              <el-input
                v-model="form.jfzckyxmmc"
                placeholder="请输入经费支出科研项目名称"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="经费支出科研项目类别码" prop="jfzckyxmlbm">
               <el-select
                v-model="form.jfzckyxmlbm"
                placeholder="请选择项目类别码"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in dictData.kyhdlxdmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="支出金额" prop="zcje">
              <el-input-number
                v-model="form.zcje"
                placeholder="请输入支出金额"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="支出时间" prop="zcsj">
              <el-date-picker
                v-model="form.zcsj"
                type="datetime"
                placeholder="请选择支出时间"
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
           <el-col :span="24" style="margin-bottom: 18px;">
            <el-form-item label="支出用途" prop="zcyt">
              <el-input
                v-model="form.zcyt"
                type="textarea"
                :rows="3"
                placeholder="请输入支出用途"
                 maxlength="2000"
                 show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
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
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="detail-view">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="唯一性标识">{{ form.zjsjwyxbs }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{ form.xxdm }}</el-descriptions-item>
          <el-descriptions-item label="科研项目编号">{{ form.kyxmbh }}</el-descriptions-item>
          <el-descriptions-item label="经费支出科研项目名称">{{ form.jfzckyxmmc }}</el-descriptions-item>
          <el-descriptions-item label="经费支出科研项目类别码">{{ form.jfzckyxmlbm }}</el-descriptions-item>
          <el-descriptions-item label="支出金额">{{ form.zcje ? Number(form.zcje).toLocaleString() : "" }}</el-descriptions-item>
          <el-descriptions-item label="支出时间">{{ form.zcsj }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{ form.sjcjsj }}</el-descriptions-item>
          <el-descriptions-item label="支出用途" :span="2">{{ form.zcyt }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(form.reportStatus)">
              {{ getReportStatusText(form.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag :type="form.enableStatus === '1' ? 'success' : 'danger'">
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ form.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ form.updateTime }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
          >
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
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsKyjfzcsjPage,
  getOdsKyjfzcsjById,
  addOdsKyjfzcsj,
  updateOdsKyjfzcsj,
  deleteOdsKyjfzcsj,
  batchDeleteOdsKyjfzcsj,
  searchOdsKyxmjbsj,
  exportOdsKyjfzcsj,
  getDictOptions,
  getSystemSchoolCode,
  type OdsKyxmyjhdsjInfo,
  type OdsKyjfzcsjInfo,
  type OdsKyjfzcsjQuery,
  type OdsKyjfzcsjForm,
} from "@/api-code/code/code_base/zygky/ods_kyjfzcsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsKyjfzcsjInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const selectedIds = ref<number[]>([]);
const submitLoading = ref(false);
const kyxmjbsjList = ref<OdsKyxmyjhdsjInfo[]>([]);
// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增科研经费支出数据";
    case "edit":
      return "编辑科研经费支出数据";
    case "view":
      return "查看科研经费支出数据";
    default:
      return "科研经费支出数据";
  }
});

// 搜索条件
const queryParams = reactive<OdsKyjfzcsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  kyxmbh: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单相关
const form = reactive<OdsKyjfzcsjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  kyxmbh: "",
  jfzckyxmmc: "",
  jfzckyxmlbm: "",
  zcje: undefined,
  zcsj: "",
  zcyt: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();

// 系统学校代码
const systemSchoolCode = ref("");

const handleProjectSearch = async (query: string) => {
  if (query) {
    submitLoading.value = true;
    try {
      const response = await searchOdsKyxmjbsj(query);
      if (response.data.code === 200) {
        kyxmjbsjList.value = response.data.data || [];
      } else {
        kyxmjbsjList.value = [];
      }
    } catch (error) {
      console.error("搜索科研项目失败:", error);
      kyxmjbsjList.value = [];
    } finally {
      submitLoading.value = false;
    }
  } else {
    kyxmjbsjList.value = [];
  }
};

 


// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
     {
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback();
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
  xxdm: [{ required: true, message: "请输入学校代码", trigger: "blur" }],
  kyxmbh: [
    { required: true, message: "请输入科研项目编号", trigger: "blur" },
    { max: 32, message: "科研项目编号长度不能超过32位", trigger: "blur" },
  ],
  jfzckyxmmc: [
    { required: true, message: "请输入经费支出科研项目名称", trigger: "blur" },
    { max: 150, message: "长度不能超过150位", trigger: "blur" },
  ],
  jfzckyxmlbm: [
    { required: true, message: "请选择经费支出科研项目类别码", trigger: "change" },
  ],
  zcje: [{ required: true, message: "请输入支出金额", trigger: "blur" }],
  zcsj: [{ required: true, message: "请输入支出时间", trigger: "blur" }],
  zcyt: [{ required: true, message: "请输入支出用途", trigger: "blur" }],
  sjcjsj: [{ required: true, message: "请输入数据采集时间", trigger: "blur" }],
});

// 字典数据
const dictData = reactive({
  kyhdlxdmOptions: [],
});

// 获取字典数据
const loadDictData = async () => {
  try {
    const res = await getDictOptions('KYHDLXDM');
    if (res.data.code === 200) {
      dictData.kyhdlxdmOptions = res.data.data || [];
    }
  } catch (error) {
    console.error("获取字典数据失败:", error);
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
    const response = await getOdsKyjfzcsjPage(queryParams);
    if (response.code === 200) {
      dataList.value = response.data.records;
      total.value = response.data.total;
    }
  } catch (error) {
    console.error(error);
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
  getList();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    kyxmbh: "",
    jfzckyxmmc: "",
    jfzckyxmlbm: "",
    zcje: undefined,
    zcsj: "",
    zcyt: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsKyjfzcsjInfo) => {
  resetForm();
  try {
    const response = await getOdsKyjfzcsjById(row.id);
    if (response.code === 200) {
      Object.assign(form, response.data);
      dialogMode.value = "edit";
      dialogVisible.value = true;
    }
  } catch (error) {
    console.error(error);
  }
};

// 查看详情
const handleView = async (row: OdsKyjfzcsjInfo) => {
  resetForm();
  try {
    const response = await getOdsKyjfzcsjById(row.id);
    if (response.code === 200) {
      Object.assign(form, response.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    }
  } catch (error) {
    console.error(error);
  }
};

// 删除
const handleDelete = async (row: OdsKyjfzcsjInfo) => {
  await ElMessageBox.confirm("确定要删除这条数据吗？", "提示", { type: "warning" });
  try {
    await deleteOdsKyjfzcsj(row.id);
    ElMessage.success("删除成功");
    getList();
  } catch (error) {
    console.error(error);
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) return;
  await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, "提示", { type: "warning" });
  try {
    await batchDeleteOdsKyjfzcsj(selectedIds.value);
    ElMessage.success("删除成功");
    getList();
  } catch (error) {
    console.error(error);
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsKyjfzcsj(queryParams);
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `科研经费支出数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出科研经费支出数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 状态修改
const handleStatusChange = async (row: OdsKyjfzcsjInfo) => {
  try {
    const response = await updateOdsKyjfzcsj({ id: row.id, enableStatus: row.enableStatus });
    if (response.code === 200) {
      ElMessage.success("状态修改成功");
    } else {
      ElMessage.error("状态修改失败");
      row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    }
  } catch (error) {
    ElMessage.error("状态修改失败");
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    console.error(error);
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate();
  submitLoading.value = true;
  try {
    if (dialogMode.value === "add") {
      await addOdsKyjfzcsj(form);
      ElMessage.success("新增成功");
    } else {
      await updateOdsKyjfzcsj(form);
      ElMessage.success("修改成功");
    }
    dialogVisible.value = false;
    getList();
  } catch (error) {
    console.error(error);
  } finally {
    submitLoading.value = false;
  }
};

// 关闭表单对话框
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 表格选择改变
const handleSelectionChange = (selection: OdsKyjfzcsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 分页大小改变
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

// 当前页改变
const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 获取系统学校代码
const getSystemSchoolCodeData = async () => {
  try {
    const response = await getSystemSchoolCode();
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      form.xxdm = response.data.data;
    }
  } catch (error) {
    console.error(error);
  }
};

// 页面加载
onMounted(() => {
  getSystemSchoolCodeData();
  loadDictData();
  getList();
});
</script>

<style scoped>
.research-funding-management {
  padding: 20px;
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

:deep(.action-buttons .el-button) {
  padding: 2px 4px;
  font-size: 12px;
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
.data-form-dialog {
  border-radius: 8px;
}
.detail-view {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px 0;
}
:deep(.data-form-dialog .el-dialog__header) {
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 15px 20px;
}
:deep(.data-form-dialog .el-dialog__title) {
  color: white;
  font-weight: 600;
}
:deep(.data-form-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
}
:deep(.data-form-dialog .el-dialog__body) {
  padding: 20px 24px;
  max-height: 60vh;
  overflow-y: auto;
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
