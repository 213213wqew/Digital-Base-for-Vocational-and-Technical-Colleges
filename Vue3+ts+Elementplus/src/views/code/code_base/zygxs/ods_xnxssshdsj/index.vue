<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true" class="compact-form">
           
          <el-form-item label="赛事活动编号" prop="sshdbh">
            <el-input
              v-model="queryParams.sshdbh"
              placeholder="请输入赛事活动编号"
              clearable
              
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="赛事活动名称" prop="sshdmc">
            <el-input
              v-model="queryParams.sshdmc"
              placeholder="请输入赛事活动名称"
              clearable
              size="small"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="handleQuery">
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
          <el-button type="warning" @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>
        <div class="header-title">校内学生赛事活动数据管理</div>
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
            label="主键数据唯一性标识"
            prop="zjsjwyxbs"
            min-width="160"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column 
            label="学校代码" 
            prop="xxdm" 
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="赛事活动编号"
            prop="sshdbh"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="赛事活动名称"
            prop="sshdmc"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="赛事活动类型"
            prop="sshdlxmText"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column 
            label="活动开始日期" 
            prop="hdksrq" 
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column 
            label="活动结束日期" 
            prop="hdjsrq" 
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            label="参与教师数"
            prop="cyjss"
            min-width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            label="参与学生数"
            prop="cyxss"
            min-width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column 
            label="数据采集时间" 
            prop="sjcjsj" 
            min-width="130"
            align="center"
            sortable="custom"
          />
          <el-table-column
            label="上报状态"
            prop="reportStatus"
            min-width="100"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.reportStatus)">
                {{ getStatusText(row.reportStatus) }}
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
              <el-button
                type="primary"
                link
                icon="Edit"
                @click="handleUpdate(row)"
                v-hasPermi="['meta:ods_xnxssshdsj:edit']"
              >
                修改
              </el-button>
              <el-button
                type="primary"
                link
                icon="View"
                @click="handleView(row)"
                v-hasPermi="['meta:ods_xnxssshdsj:query']"
              >
                查看
              </el-button>
              <el-button
                type="primary"
                link
                icon="Delete"
                @click="handleDelete(row)"
                v-hasPermi="['meta:ods_xnxssshdsj:remove']"
              >
                删除
              </el-button>
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

    <!-- 添加/修改对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增学生赛事活动数据' : '修改学生赛事活动数据'"
      v-model="dialogVisible"
      width="780px"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="160px"
        class="dialog-form"
      >
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="12">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="请输入主键数据唯一性标识"
                maxlength="32"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="请输入学校代码"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="12">
            <el-form-item label="赛事活动编号" prop="sshdbh">
              <el-input
                v-model="form.sshdbh"
                placeholder="请输入赛事活动编号"
                maxlength="32"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赛事活动名称" prop="sshdmc">
              <el-input
                v-model="form.sshdmc"
                placeholder="请输入赛事活动名称"
                maxlength="200"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="12">
            <el-form-item label="赛事活动类型码" prop="sshdlxm">
              <el-select v-model="form.sshdlxm" placeholder="请选择赛事活动类型码">
                <el-option v-for="item in sshdlxmOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动开始日期" prop="hdksrq">
              <el-date-picker
                v-model="form.hdksrq"
                type="date"
                placeholder="请选择活动开始日期"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="12">
            <el-form-item label="活动结束日期" prop="hdjsrq">
              <el-date-picker
                v-model="form.hdjsrq"
                type="date"
                placeholder="请选择活动结束日期"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参与教师数" prop="cyjss">
              <el-input-number
                v-model="form.cyjss"
                :min="0"
                :max="99999"
                placeholder="请输入参与教师数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-bottom: 18px;" >
          <el-col :span="12">
            <el-form-item label="参与学生数" prop="cyxss">
              <el-input-number
                v-model="form.cyxss"
                :min="0"
                :max="99999"
                placeholder="请输入参与学生数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间"
                value-format="YYYYMMDD hhmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" :loading="submitLoading">
            确 定
          </el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看对话框 -->
    <el-dialog
      title="查看学生赛事活动数据"
      v-model="viewDialogVisible"
      width="780px"
      append-to-body
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="主键数据唯一性标识">
          {{ currentRecord?.zjsjwyxbs }}
        </el-descriptions-item>
        <el-descriptions-item label="学校代码">
          {{ currentRecord?.xxdm }}
        </el-descriptions-item>
        <el-descriptions-item label="赛事活动编号">
          {{ currentRecord?.sshdbh }}
        </el-descriptions-item>
        <el-descriptions-item label="赛事活动名称">
          {{ currentRecord?.sshdmc }}
        </el-descriptions-item>
        <el-descriptions-item label="赛事活动类型">
          {{ currentRecord?.sshdlxmText }}
        </el-descriptions-item>
        <el-descriptions-item label="活动开始日期">
          {{ currentRecord?.hdksrq }}
        </el-descriptions-item>
        <el-descriptions-item label="活动结束日期">
          {{ currentRecord?.hdjsrq }}
        </el-descriptions-item>
        <el-descriptions-item label="参与教师数">
          {{ currentRecord?.cyjss }}
        </el-descriptions-item>
        <el-descriptions-item label="参与学生数">
          {{ currentRecord?.cyxss }}
        </el-descriptions-item>
        <el-descriptions-item label="数据采集时间">
          {{ currentRecord?.sjcjsj }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getOdsXnxssshdsjPage,
  addOdsXnxssshdsj,
  updateOdsXnxssshdsj,
  deleteOdsXnxssshdsj,
  getSshdlxmOptions,
  getSystemSchoolCode,
  batchDeleteOdsXnxssshdsj,
  exportOdsXnxssshdsj,
  type DictOption
} from "@/api-code/code/code_base/zygxs/ods_xnxssshdsj";
import type { OdsXnxssshdsjInfo, OdsXnxssshdsjForm, OdsXnxssshdsjQuery, OdsXnxssshdsjPageResult } from "@/api-code/code/code_base/zygxs/ods_xnxssshdsj";
 

// 状态处理函数
const getStatusType = (status: string): "success" | "info" | "warning" | "danger" => {
  if (!status && status !== "0") {
    return "info";
  }
  switch (String(status)) {
    case "0":
      return "info";
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "info";
  }
};

const getStatusText = (status: string): string => {
  if (!status && status !== "0") {
    return "未上报";
  }
  switch (String(status)) {
    case "0":
      return "未上报";
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return "未知";
  }
};

// 查询参数
const queryParams = ref<OdsXnxssshdsjQuery>({
  zjsjwyxbs: "",
  xxdm:  "",
  sshdbh: "",
  sshdmc: "",
  sshdlxm: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 表格数据
const dataList = ref<OdsXnxssshdsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const schoolCode = ref("");
// 弹窗数据
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const form = ref<OdsXnxssshdsjForm>({});
const formRef = ref();
const submitLoading = ref(false);
const sshdlxmOptions = ref<DictOption[]>([]);
// 查看弹窗数据
const viewDialogVisible = ref(false);
const currentRecord = ref<OdsXnxssshdsjInfo | undefined>();

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsXnxssshdsjPage(queryParams.value);
    const result = response.data  as any;
    if (result.code === 200 && result.data) {
      dataList.value = result.data.records;
      total.value = result.data.total;
    } else {
      ElMessage.error(result.message || "查询失败");
    }
  } catch (error) {
    console.error("查询校内学生赛事活动数据失败:", error);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

// 重置搜索
const resetQuery = () => {
  queryParams.value = {
    zjsjwyxbs: "",
    xxdm: schoolCode.value,
    sshdbh: "",
    sshdmc: "",
    sshdlxm: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 20,
  };
  getList();
};

// 表单校验规则
const formRules = ref({
  zjsjwyxbs: [
    { 
      validator: (rule: any, value: string, callback: Function) => {
        if (!value || value.trim() === '') {
          callback(); // 允许为空
          return;
        }
        // 32位大写字母和数字组合的正则表达式
        const pattern = /^[A-Z0-9]{32}$/;
        if (!pattern.test(value)) {
          callback(new Error('请输入32位大写字母和数字组合的字符串'));
          return;
        }
        callback();
      },
      trigger: ['blur', 'change']
    }
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" }
  ],
  sshdbh: [
    { required: true, message: "赛事活动编号不能为空", trigger: "blur" },
    { max: 32, message: "长度不能超过32个字符", trigger: "blur" },
  ],
  sshdmc: [
    { required: true, message: "赛事活动名称不能为空", trigger: "blur" },
    { max: 200, message: "长度不能超过200个字符", trigger: "blur" },
  ],
  sshdlxm: [
    { required: true, message: "赛事活动类型码不能为空", trigger: "blur" },
    { max: 2, message: "长度不能超过2个字符", trigger: "blur" },
  ],
  hdksrq: [{ required: true, message: "活动开始日期不能为空", trigger: "blur" }],
  hdjsrq: [{ required: true, message: "活动结束日期不能为空", trigger: "blur" }],
  cyjss: [{ required: true, message: "参与教师数不能为空", trigger: "blur" }],
  cyxss: [{ required: true, message: "参与学生数不能为空", trigger: "blur" }],
  sjcjsj: [{ required: true, message: "数据采集时间不能为空", trigger: "blur" }],
});

// 新增
const handleAdd = () => {
  reset();
  form.value.xxdm = schoolCode.value;
  dialogVisible.value = true;
  dialogType.value = "add";
};

// 编辑
const handleUpdate = (row: OdsXnxssshdsjInfo) => {
  reset();
  form.value = { ...row };
  form.value.xxdm = schoolCode.value;
  dialogVisible.value = true;
  dialogType.value = "edit";
};

// 查看
const handleView = (row: OdsXnxssshdsjInfo) => {
  currentRecord.value = row;
  viewDialogVisible.value = true;
};

// 删除
const handleDelete = async (row: OdsXnxssshdsjInfo) => {
  try {
    await ElMessageBox.confirm("确认要删除该条数据吗？", "提示", {
      type: "warning",
    });
    const response = await deleteOdsXnxssshdsj(row.id);
    const result = response.data as any;
    if (result.data.code === 200 && result.data) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(result.message || "删除失败");
    }
  } catch (error) {
    console.error("删除校内学生赛事活动数据失败:", error);
  }
};

// 重置表单
const reset = () => {
  form.value = {};
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 取消
const cancel = () => {
  reset();
  dialogVisible.value = false;
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    submitLoading.value = true;
    
    // 克隆表单数据
    const formData = { ...form.value };
    
    // 如果唯一编码为空，设置为undefined，让后端自动生成
    if (!formData.zjsjwyxbs || formData.zjsjwyxbs.trim() === '') {
      formData.zjsjwyxbs = undefined;
    }
    
    if (dialogType.value === "add") {
      const response = await addOdsXnxssshdsj(formData);
      const result = response.data as any;
      if (result.code === 200) {
        ElMessage.success("新增成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(result.message || "新增失败");
      }
    } else {
      const response = await updateOdsXnxssshdsj(formData);
      const result = response.data as any;
      if (result.code === 200) {
        ElMessage.success("修改成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(result.message || "修改失败");
      }
    }
  } catch (error: any) {
    console.error("表单提交失败:", error);
    if (error.message) {
      ElMessage.error(error.message);
    } else {
      ElMessage.error("表单提交失败");
    }
  } finally {
    submitLoading.value = false;
  }
};

// 表格选择
const selectedRows = ref<OdsXnxssshdsjInfo[]>([]);
const handleSelectionChange = (selection: OdsXnxssshdsjInfo[]) => {
  selectedRows.value = selection;
};

// 双击行
const handleRowDblClick = (row: OdsXnxssshdsjInfo) => {
  handleView(row);
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条校内学生赛事活动数据吗？`,
      "提示",
      {
        type: "warning",
      },
    );

    const response = await batchDeleteOdsXnxssshdsj(selectedRows.value.map((item) => item.id));
    const result = response.data as any;
    if (result.data.code === 200 && result.data) {
      ElMessage.success("批量删除成功");
      selectedRows.value = [];
      getList();
    } else {
      ElMessage.error(result.message || "批量删除失败");
    }
  } catch (error) {
    console.error("批量删除校内学生赛事活动数据失败:", error);
    ElMessage.error("批量删除失败");
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsXnxssshdsj(queryParams.value);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `校内学生赛事活动数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出校内学生赛事活动数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  queryParams.value.pageSize = size;
  queryParams.value.pageNum = 1;
  getList();
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  queryParams.value.pageNum = page;
  getList();
};
// 获取当前系统学校代码
const getSystemSchoolCodeData = async () => {
  const response = await getSystemSchoolCode() as any;
  console.log(response.data.data);
  schoolCode.value = response.data.data;
  queryParams.value.xxdm = response.data.data;
};
// 获取字典选项
const initDictOptions = async () => {
  try {
    const [
      sshdlxmResponse,
    ] = await Promise.all([ 
      getSshdlxmOptions() as any,
    ]);
    sshdlxmOptions.value = sshdlxmResponse.data.data || [];
  } catch (error) {
    console.error("获取字典选项失败:", error);
  }
};
onMounted(() => {
  getList();
  getSystemSchoolCodeData();
  initDictOptions();
});
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  background: transparent;
}

.search-card {
  margin-bottom: 12px;
  :deep(.el-card__body) {
    padding: 4px;
  }
}

.search-bar {
  .compact-form {
    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 12px;
      
      .el-form-item__label {
        padding: 0 8px 0 0;
        height: 24px;
        line-height: 24px;
      }
      
      .el-form-item__content {
        line-height: 24px;
      }
    }
    
    :deep(.el-input) {
      width: 180px;
      
      .el-input__wrapper {
        padding: 0 8px;
        --el-input-height: 24px;
      }
    }
    
    :deep(.el-button) {
      padding: 2px 12px;
      height: 24px;
      
      .el-icon {
        margin-right: 4px;
      }
    }
  }
}

.table-card {
  margin-top: -10px;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.operation-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin: 0 16px;
  flex: 2;
  text-align: center;
}

.placeholder {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.table-body {
  background: white;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 2px;
  justify-content: center;
}

.action-buttons .el-button {
  padding: 2px 4px;
  font-size: 12px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #ebeef5;
}

.total-info {
  color: #606266;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 8px;
}

:deep(.el-dialog__header) {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  margin-right: 0;
}

:deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0 10px;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 4px;
}

:deep(.el-table th) {
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  font-weight: 500;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-table td) {
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: var(--el-fill-color-lighter);
}

:deep(.el-table__row:hover td) {
  background-color: var(--el-fill-color) !important;
}

/* 状态标签样式 */
:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 8px;
}

/* 表单样式 */
:deep(.el-form-item__label) {
  font-weight: normal;
  color: var(--el-text-color-regular);
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  border-radius: 4px;
}

:deep(.el-input__inner:focus),
:deep(.el-textarea__inner:focus) {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 1px var(--el-color-primary-light-8);
}

/* 描述列表样式 */
:deep(.el-descriptions) {
  border-radius: 4px;
}

:deep(.el-descriptions__header) {
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-descriptions__title) {
  font-size: 16px;
  color: var(--el-text-color-primary);
}

:deep(.el-descriptions__body) {
  background: var(--el-bg-color);
}

:deep(.el-descriptions-item__label) {
  color: var(--el-text-color-regular);
}

:deep(.el-descriptions-item__content) {
  color: var(--el-text-color-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-container {
    padding: 8px;
  }
  
  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .operation-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .header-title {
    text-align: center;
    margin: 8px 0;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
}

/* 动画效果 */
.el-dialog {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 滚动条样式 */
:deep(.el-table__body-wrapper)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep(.el-table__body-wrapper)::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 3px;
}

:deep(.el-table__body-wrapper)::-webkit-scrollbar-thumb:hover {
  background: var(--el-border-color-darker);
}

:deep(.el-table__body-wrapper)::-webkit-scrollbar-track {
  background: var(--el-fill-color-lighter);
  border-radius: 3px;
}
</style>
