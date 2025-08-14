<template>
  <div class="classroom-video-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
           
           
          <el-form-item label="教室号" prop="jsh">
            <el-input
              v-model="queryParams.jsh"
              placeholder="请输入教室号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="视频设备ID" prop="spsbid">
            <el-input
              v-model="queryParams.spsbid"
              placeholder="请输入视频设备ID"
              clearable
              @keyup.enter="handleQuery"
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
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">教室视频流数据管理</div>
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
          :height="'calc(75vh - 110px)'"
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
            min-width="160"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="jsh"
            label="教室号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="spsbid"
            label="视频设备ID"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="spsbdwmc"
            label="设备点位名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="spldz"
            label="视频流地址"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sjcjsj"
            label="采集时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus) as any "
                size="small"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="row.enableStatus === '1' ? 'success' : 'danger'"
                size="small"
              >
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
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
                  @click="handleUpdate(row)"
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

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 500px"
      class="classroom-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="32位大写字母+数字组合，留空系统自动生成"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
                @input="handleUniqueIdInput"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="学校代码" prop="xxdm">
              <div style="display: flex; align-items: center; gap: 8px;">
                <el-input
                  v-model="form.xxdm"
                  placeholder="系统自动获取学校代码"
                  maxlength="10"
                  show-word-limit
                  readonly
                  disabled
                  style="flex: 1"
                />
                 
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="教室号" prop="jsh">
              <div style="display: flex; align-items: center; gap: 8px;">
                <el-select
                  v-model="form.jsh"
                  placeholder="请选择教室"
                  filterable
                  remote
                  :remote-method="handleJsSearch"
                  :loading="jsLoading"
                  clearable
                  style="flex: 1"
                  @change="handleJsChange"
                >
                  <el-option
                    v-for="option in jsOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <el-tooltip content="数据来源：教室基本数据(ODS_JSJBSJ)" placement="top">
                  <el-icon color="#E6A23C" size="16">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="视频设备ID" prop="spsbid">
              <el-input
                v-model="form.spsbid"
                placeholder="请输入视频设备ID"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px">
            <el-form-item label="设备点位名称" prop="spsbdwmc">
              <el-input
                v-model="form.spsbdwmc"
                placeholder="请输入视频设备点位名称"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px">
            <el-form-item label="视频流地址" prop="spldz">
              <el-input
                v-model="form.spldz"
                type="textarea"
                :rows="3"
                placeholder="请输入视频流地址，支持m3u8视频流格式"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
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
          <el-col :span="12" style="margin-bottom: 20px"  >
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
      <div v-else class="classroom-detail">
        <el-descriptions
          class="detail-descriptions"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item label="主键数据唯一性标识">
            <div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ form.xxdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教室号">
            <div class="detail-value">{{ form.jsh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="视频设备ID">
            <div class="detail-value">{{ form.spsbid || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="设备点位名称" :span="2">
            <div class="detail-value">{{ form.spsbdwmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="视频流地址" :span="2">
            <div class="detail-value">{{ form.spldz || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjcjsj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="form.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
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
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  View,
  Edit,
  Warning,
} from "@element-plus/icons-vue";
import {
  getOdsJssplsjPage,
  addOdsJssplsj,
  updateOdsJssplsj,
  deleteOdsJssplsj,
  batchDeleteOdsJssplsj,
  exportOdsJssplsj,
  getSystemSchoolCode,
  getJsOptions,
  type OdsJssplsjQuery,
  type OdsJssplsjInfo,
  type JsOption,
} from "@/api/meta/meta_base/zygjx/ods_jssplsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsJssplsjInfo[]>([]);
const total = ref(0);
const selectedRows = ref<OdsJssplsjInfo[]>([]);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const queryFormRef = ref();
const formRef = ref();
const jsOptions = ref<JsOption[]>([]);
const jsLoading = ref(false);

// 对话框标题
const dialogTitle = computed(() => {
  const titles = {
    add: "新增教室视频流数据",
    edit: "编辑教室视频流数据",
    view: "查看教室视频流数据详情",
  };
  return titles[dialogMode.value];
});

// 查询参数
const queryParams = reactive<OdsJssplsjQuery>({
  pageNum: 1,
  pageSize: 100,
  zjsjwyxbs: "",
  xxdm: "",
  jsh: "",
  spsbid: "",
  spsbdwmc: "",
  reportStatus: "",
  enableStatus: "",
});

// 表单数据
const form = reactive({
  id: undefined as number | undefined,
  zjsjwyxbs: "",
  xxdm: "",
  jsh: "",
  spsbid: "",
  spsbdwmc: "",
  spldz: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const rules = {
  zjsjwyxbs: [
    { 
      validator: (rule: any, value: string, callback: any) => {
        if (value && !/^[A-Z0-9]{32}$/.test(value)) {
          callback(new Error("主键数据唯一性标识必须是32位大写字母+数字组合"));
        } else {
          callback();
        }
      }, 
      trigger: "blur" 
    }
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" }
  ],
  jsh: [
    { required: true, message: "教室号不能为空", trigger: "blur" },
    { 
      max: 80, 
      message: "教室号长度不能超过80位", 
      trigger: "blur" 
    }
  ],
  spsbid: [
    { required: true, message: "视频设备ID不能为空", trigger: "blur" },
    { 
      max: 64, 
      message: "视频设备ID长度不能超过64位", 
      trigger: "blur" 
    }
  ],
  spsbdwmc: [
    { required: true, message: "设备点位名称不能为空", trigger: "blur" },
    { 
      max: 60, 
      message: "设备点位名称长度不能超过60位", 
      trigger: "blur" 
    }
  ],
  spldz: [
    { required: true, message: "视频流地址不能为空", trigger: "blur" },
    { 
      max: 300, 
      message: "视频流地址长度不能超过300位", 
      trigger: "blur" 
    }
  ],
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "change" }
  ],
  enableStatus: [
    { required: true, message: "启用状态不能为空", trigger: "change" },
  ],
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: string) => {
  const types: { [key: string]: string } = {
    "0": "warning",
    "1": "success",
    "2": "danger",
  };
  return types[status] || "info";
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  const texts: { [key: string]: string } = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败",
  };
  return texts[status] || "未知";
};

// 格式化显示时间
const formatDisplayTime = (timeStr: string) => {
  if (!timeStr) return "";
  
  // 如果是 YYYYMMDD hhmmss 格式
  if (timeStr.length === 15 && timeStr.includes(' ')) {
    const [datePart, timePart] = timeStr.split(' ');
    if (datePart.length === 8 && timePart.length === 6) {
      const year = datePart.substring(0, 4);
      const month = datePart.substring(4, 6);
      const day = datePart.substring(6, 8);
      const hour = timePart.substring(0, 2);
      const minute = timePart.substring(2, 4);
      const second = timePart.substring(4, 6);
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
  }
  
  return timeStr;
};



// 处理主键唯一标识输入，转换为大写并只保留字母和数字
const handleUniqueIdInput = (value: string) => {
  form.zjsjwyxbs = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
};

// 获取系统学校代码
const fetchSystemSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode() as any;
    if (response.data.code === 200) {
      form.xxdm = response.data.data;
    } else {
      console.warn("获取学校代码失败:", response.data.msg);
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
  }
};

// 搜索教室选项
const handleJsSearch = async (keyword: string) => {
  jsLoading.value = true;
  try {
    const response = await getJsOptions(keyword) as any;
    if (response.data.code === 200) {
      jsOptions.value = response.data.data || [];
    } else {
      console.warn("获取教室选项失败:", response.data.msg);
    }
  } catch (error) {
    console.error("获取教室选项失败:", error);
  } finally {
    jsLoading.value = false;
  }
};

// 教室选择变化
const handleJsChange = (jsh: string) => {
  if (jsh) {
    const selectedJs = jsOptions.value.find(item => item.value === jsh);
    if (selectedJs) {
      // 自动填充相关字段
      form.xxdm = selectedJs.xxdm;
      // 可以添加更多字段的自动填充逻辑
    }
  }
};

// 获取列表数据
const getList = async () => { 
  loading.value = true;
  try {
    const response = await getOdsJssplsjPage(queryParams) as any;
    if (response.data.code === 200) {
      dataList.value = response.data.data.records || [];
      total.value = response.data.data.total || 0;
    }
  } catch (error) {
    console.error("获取教室视频流数据失败:", error);
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
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

// 新增
const handleAdd = async () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
  // 获取系统学校代码
  await fetchSystemSchoolCode();
  // 初始化教室选项
  await handleJsSearch("");
};

// 查看
const handleView = (row: OdsJssplsjInfo) => {
  resetForm();
  Object.assign(form, row);
  dialogMode.value = "view";
  dialogVisible.value = true;
};

// 编辑
const handleUpdate = (row: OdsJssplsjInfo) => {
  resetForm();
  Object.assign(form, row);
  dialogMode.value = "edit";
  dialogVisible.value = true;
};

// 删除
const handleDelete = async (row: OdsJssplsjInfo) => {
  try {
    await ElMessageBox.confirm(
      `是否确认删除该教室视频流数据？`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const response = await deleteOdsJssplsj(row.id) as any;
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除教室视频流数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `是否确认删除选中的 ${selectedRows.value.length} 条数据？`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const ids = selectedRows.value.map((row) => row.id);
    const response = await batchDeleteOdsJssplsj(ids) as any;
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedRows.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除教室视频流数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsJssplsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `教室视频流数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出教室视频流数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
 

    let response;
    if (dialogMode.value === "add") {
      response = await addOdsJssplsj(form) as any;
    } else {
      response = await updateOdsJssplsj(form) as any;
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
    ElMessage.error("操作失败");
  } finally {
   
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    jsh: "",
    spsbid: "",
    spsbdwmc: "",
    spldz: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

// 关闭表单对话框

// 关闭详情对话框

// 表格选择变化

// 行点击
const handleRowClick = (row: OdsJssplsjInfo) => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsJssplsjInfo) => {
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
// 表格选择
const handleSelectionChange = (selection: OdsJssplsjInfo[]) => {
  selectedRows.value = selection;
};

// 页面加载
onMounted(async () => {
  getList();
  // 预加载学校代码
  await fetchSystemSchoolCode();
});
</script>

<style scoped>
.app-container {
  padding: 0px;
}

.search-card {
  margin-bottom:  0px;
}

.search-bar {
  padding: 4px 0;
}

.search-card :deep(.el-card__body) {
  padding: 8px 16px;
}

.search-card :deep(.el-form-item) {
  margin-bottom: 8px;
}

.search-card :deep(.el-form-item__label) {
  height: 28px;
  line-height: 28px;
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
  gap: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
 
 
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
</style>
