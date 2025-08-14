<template>
  <div class="digital-library-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <!--   -->

          <el-form-item label="访问日期" prop="fwrqRange">
            <el-date-picker
              v-model="fwrqRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYYMMDD"
              format="YYYY-MM-DD"
              @change="handleDateRangeChange"
            />
          </el-form-item>
          <el-form-item style="margin-top: -23px">
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
        <div class="header-title">访问数字图书馆资源数据编码管理</div>
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
          :height="'calc(75vh - 135px)'"
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
            prop="dzqkfwcs"
            label="电子期刊访问次数"
            min-width="140"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="dztsfwcs"
            label="电子图书访问次数"
            min-width="140"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="totalFwcs"
            label="总访问次数"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="fwrqDisplay"
            label="访问日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sjcjsjDisplay"
            label="采集时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus) as any"
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
      style="height: 440px"
      class="digital-library-dialog"
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
          <el-col style="margin-top: 20px" :span="12">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可不填，系统自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              />
            </el-form-item>
          </el-col>
          <el-col style="margin-top: 20px" :span="12">
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
          <el-col style="margin-top: 20px" :span="12">
            <el-form-item label="电子期刊访问次数" prop="dzqkfwcs">
              <el-input-number
                v-model="form.dzqkfwcs"
                :min="0"
                style="width: 100%"
                placeholder="请输入电子期刊访问次数"
              />
            </el-form-item>
          </el-col>
          <el-col style="margin-top: 20px" :span="12">
            <el-form-item label="电子图书访问次数" prop="dztsfwcs">
              <el-input-number
                v-model="form.dztsfwcs"
                :min="0"
                style="width: 100%"
                placeholder="请输入电子图书访问次数"
              />
            </el-form-item>
          </el-col>
          <el-col style="margin-top: 20px" :span="12">
            <el-form-item label="访问日期" prop="fwrq">
              <el-date-picker
                v-model="form.fwrq"
                type="date"
                placeholder="请选择访问日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col style="margin-top: 20px" :span="12">
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
          <el-col style="margin-top: 20px" :span="12">
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
      <div v-else class="digital-library-detail">
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
          <el-descriptions-item label="电子期刊访问次数">
            <div class="detail-value">{{ form.dzqkfwcs || 0 }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="电子图书访问次数">
            <div class="detail-value">{{ form.dztsfwcs || 0 }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="总访问次数">
            <div class="detail-value">
              {{ (form.dzqkfwcs || 0) + (form.dztsfwcs || 0) }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="访问日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.fwrq || "") || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjcjsj || "") || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <div class="detail-value">
              <el-tag
                :type="getReportStatusTagType(form.reportStatus || '0') as any"
                size="small"
              >
                {{ getReportStatusText(form.reportStatus || "0") }}
              </el-tag>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <div class="detail-value">
              <el-tag
                :type="
                  (form.enableStatus === '1' ? 'success' : 'danger') as any
                "
                size="small"
              >
                {{ form.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <div class="detail-value">
              {{ formatDateTime(currentRecord?.createTime || "") || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <div class="detail-value">
              {{ formatDateTime(currentRecord?.updateTime || "") || "-" }}
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleDialogClose">{{
            dialogMode === "view" ? "关闭" : "取消"
          }}</el-button>
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
import { ref, reactive, onMounted } from "vue";
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
import {
  getOdsFwsztsgzysjPage,
  getOdsFwsztsgzysjById,
  addOdsFwsztsgzysj,
  updateOdsFwsztsgzysj,
  deleteOdsFwsztsgzysj,
  batchDeleteOdsFwsztsgzysj,
  exportOdsFwsztsgzysj,
  type OdsFwsztsgzysjInfo,
  type OdsFwsztsgzysjQuery,
  type OdsFwsztsgzysjForm,
} from "@/api-code/code/code_base/zygjx/ods_fwsztsgzysj";
import { getSystemSchoolCode } from "@/api-code/code/code_base/zygxx/ods_xxtsxxhxtyysj";

// 页面状态
const loading = ref(false);
const total = ref(0);
const dataList = ref<OdsFwsztsgzysjInfo[]>([]);
const selectedRows = ref<OdsFwsztsgzysjInfo[]>([]);
const fwrqRange = ref<string[]>([]);

// 查询参数
const queryParams = reactive<OdsFwsztsgzysjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  fwrqStart: "",
  fwrqEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 对话框状态
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const dialogTitle = ref("新增访问数字图书馆资源数据");

// 当前记录
const currentRecord = ref<OdsFwsztsgzysjInfo | null>(null);

// 表单
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();
const form = reactive<OdsFwsztsgzysjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  dzqkfwcs: 0,
  dztsfwcs: 0,
  fwrq: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const rules = reactive({
  zjsjwyxbs: [
    {
      required: false,
      message: "主键数据唯一性标识可不填，后端自动生成",
      trigger: "blur",
    },
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (value && value.length > 0) {
          if (value.length !== 32) {
            callback(new Error("必须为32位字符"));
          } else if (!/^[A-Z0-9]{32}$/.test(value)) {
            callback(new Error("只能包含大写字母和数字"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码系统自动获取", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10个字符", trigger: "blur" },
  ],
  dzqkfwcs: [
    { required: true, message: "电子期刊访问次数不能为空", trigger: "blur" },
  ],
  dztsfwcs: [
    { required: true, message: "电子图书访问次数不能为空", trigger: "blur" },
  ],
  fwrq: [{ required: true, message: "请选择访问日期", trigger: "change" }],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const { data }: any = await getOdsFwsztsgzysjPage(queryParams);
    dataList.value = data.data.records || [];
    total.value = data.data.total || 0;
  } catch (error) {
    console.error("获取数据失败:", error);
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
  fwrqRange.value = [];
  queryParams.fwrqStart = "";
  queryParams.fwrqEnd = "";
  queryParams.pageNum = 1;
  getList();
};

// 处理日期范围变化
const handleDateRangeChange = (dates: string[]) => {
  if (dates && dates.length === 2) {
    queryParams.fwrqStart = dates[0];
    queryParams.fwrqEnd = dates[1];
  } else {
    queryParams.fwrqStart = "";
    queryParams.fwrqEnd = "";
  }
};

// 分页处理
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 选择处理
const handleSelectionChange = (selection: OdsFwsztsgzysjInfo[]) => {
  selectedRows.value = selection;
};

// 行点击
const handleRowClick = (row: OdsFwsztsgzysjInfo) => {
  currentRecord.value = row;
};

// 行双击
const handleRowDblClick = (row: OdsFwsztsgzysjInfo) => {
  handleView(row);
};

// 获取学校代码
const getSchoolCode = async () => {
  try {
    const response = (await getSystemSchoolCode()) as any;
    if (response.data?.code === 200) {
      form.xxdm = response.data.data || "";
    } else {
      console.warn("获取学校代码失败:", response.data?.message);
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
  }
};

// 新增
const handleAdd = async () => {
  dialogMode.value = "add";
  dialogTitle.value = "新增访问数字图书馆资源数据";
  resetForm();
  await getSchoolCode(); // 自动获取学校代码
  dialogVisible.value = true;
};

// 编辑
const handleUpdate = async (row: OdsFwsztsgzysjInfo) => {
  dialogMode.value = "edit";
  dialogTitle.value = "编辑访问数字图书馆资源数据";

  try {
    const { data }: any = await getOdsFwsztsgzysjById(row.id);
    if (data?.code === 200) {
      const responseData = data.data;
      Object.assign(form, {
        id: responseData.id,
        zjsjwyxbs: responseData.zjsjwyxbs,
        xxdm: responseData.xxdm,
        dzqkfwcs: responseData.dzqkfwcs,
        dztsfwcs: responseData.dztsfwcs,
        fwrq: responseData.fwrq,
        sjcjsj: responseData.sjcjsj,
        reportStatus: responseData.reportStatus,
        enableStatus: responseData.enableStatus,
      });
      dialogVisible.value = true;
    } else {
      ElMessage.error(data?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取访问数字图书馆资源数据详情失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 查看详情
const handleView = async (row: OdsFwsztsgzysjInfo) => {
  dialogMode.value = "view";
  dialogTitle.value = "查看访问数字图书馆资源数据详情";

  try {
    const { data }: any = await getOdsFwsztsgzysjById(row.id);
    if (data?.code === 200) {
      currentRecord.value = data.data;
      Object.assign(form, data.data);
      dialogVisible.value = true;
    } else {
      ElMessage.error(data?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取访问数字图书馆资源数据详情失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 删除
const handleDelete = (row: OdsFwsztsgzysjInfo) => {
  ElMessageBox.confirm(
    `确定要删除访问数字图书馆资源数据"${row.zjsjwyxbs}"吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(async () => {
    try {
      const { data }: any = await deleteOdsFwsztsgzysj(row.id);
      if (data?.code === 200) {
        ElMessage.success("删除成功");
        await getList();
      } else {
        ElMessage.error(data?.message || "删除失败");
      }
    } catch (error) {
      console.error("删除访问数字图书馆资源数据失败:", error);
      ElMessage.error("删除失败");
    }
  });
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 条访问数字图书馆资源数据吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(async () => {
    try {
      const ids = selectedRows.value.map((row: OdsFwsztsgzysjInfo) => row.id);
      const { data }: any = await batchDeleteOdsFwsztsgzysj(ids);
      if (data?.code === 200) {
        ElMessage.success("批量删除成功");
        selectedRows.value = [];
        await getList();
      } else {
        ElMessage.error(data?.message || "批量删除失败");
      }
    } catch (error) {
      console.error("批量删除访问数字图书馆资源数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  });
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsFwsztsgzysj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `访问数字图书馆资源数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出访问数字图书馆资源数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    const isEdit = dialogMode.value === "edit";
    const { data }: any = isEdit
      ? await updateOdsFwsztsgzysj(form)
      : await addOdsFwsztsgzysj(form);

    if (data?.code === 200) {
      ElMessage.success(isEdit ? "修改成功" : "新增成功");
      dialogVisible.value = false;
      await getList();
    } else {
      ElMessage.error(data?.message || (isEdit ? "修改失败" : "新增失败"));
    }
  } catch (error) {
    console.error("提交访问数字图书馆资源数据失败:", error);
    ElMessage.error("提交失败");
  } finally {
    submitLoading.value = false;
  }
};

// 表单关闭
const handleDialogClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    dzqkfwcs: 0,
    dztsfwcs: 0,
    fwrq: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.resetFields();
};

// 状态处理
const getReportStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败",
  };
  return statusMap[status] || "未知";
};

const getReportStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    "0": "info",
    "1": "success",
    "2": "danger",
  };
  return typeMap[status] || "info";
};

// 格式化日期时间
const formatDateTime = (dateTime?: string) => {
  if (!dateTime) return "-";
  return dateTime;
};

const formatDisplayTime = (dateTime?: string) => {
  if (!dateTime) return "-";
  return dateTime.split(" ")[0];
};

// 初始化
onMounted(() => {
  getList();
});
</script>

<style scoped>
.digital-library-management {
  padding: 0px;
}

.search-card {
  height: 60px;
  margin-bottom: 0px;
}

.search-bar {
  margin-bottom: 0;
}

.table-card {
  margin-top: -10px;
  margin-bottom: 0px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
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
  gap: 8px;
  justify-content: center;
}

.dialog-footer {
  text-align: right;
}

.digital-library-dialog {
  height: 440px;
}

.digital-library-detail {
  padding: 20px;
}

.detail-descriptions {
  width: 100%;
}

.detail-value {
  margin-left: 20px;
}
</style>
