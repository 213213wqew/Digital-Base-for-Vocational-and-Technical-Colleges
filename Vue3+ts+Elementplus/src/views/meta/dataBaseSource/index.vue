<template>
  <div class="data-base-source-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true" class="search-form">
          <div class="search-row">
            <el-form-item label="数据源代码" prop="sourceCode">
              <el-input
                v-model="queryParams.sourceCode"
                placeholder="请输入数据源代码"
                clearable
                size="default"
              />
            </el-form-item>
            <el-form-item label="数据源名称" prop="sourceName">
              <el-input
                v-model="queryParams.sourceName"
                placeholder="请输入数据源名称"
                clearable
                size="default"
              />
            </el-form-item>
            <el-form-item label="基础代码名称" prop="config">
              <el-input
                v-model="queryParams.config"
                placeholder="请输入基础代码名称"
                clearable
                size="default"
              />
            </el-form-item>
          </div>
          <div class="search-row">
            <el-form-item label="别名" prop="aliases">
              <el-input
                v-model="queryParams.aliases"
                placeholder="请输入别名"
                clearable
                size="default"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="请选择状态"
                clearable
                size="default"
              >
                <el-option label="启用" value="ACTIVE" />
                <el-option label="禁用" value="INACTIVE" />
              </el-select>
            </el-form-item>
            <el-form-item class="search-buttons">
              <el-button type="primary" @click="handleQuery" size="default">
                <el-icon><Search /></el-icon>搜索
              </el-button>
              <el-button @click="resetQuery" size="default">
                <el-icon><Refresh /></el-icon>重置
              </el-button>
            </el-form-item>
          </div>
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
          <el-button type="success" @click="handleImport">
            <el-icon><Upload /></el-icon>导入Excel
          </el-button>
        </div>
        <div class="header-title">基础数据源列表</div>
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
          :span-method="objectSpanMethod"
          highlight-current-row
          @row-click="handleRowClick"
          @row-dblclick="handleRowDblClick"
          :height="'calc(75vh - 185px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="sourceCode"
            show-overflow-tooltip
            label="数据源代码"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="sourceName"
            show-overflow-tooltip
            label="数据源名称"
            min-width="150"
            sortable="custom"
          />
          <el-table-column
            prop="sourceType"
            show-overflow-tooltip
            label="基础代码"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="config"
            show-overflow-tooltip
            label="基础代码名称"
            min-width="150"
            sortable="custom"
          />
          <el-table-column
            prop="aliases"
            show-overflow-tooltip
            label="别名"
            min-width="150"
            sortable="custom"
          >
            <template #default="scope">
              <div v-if="scope.row.aliases">
                <el-tag
                  v-for="alias in scope.row.aliases.split(',')"
                  :key="alias"
                  size="small"
                  class="alias-tag"
                >
                  {{ alias.trim() }}
                </el-tag>
              </div>
              <span v-else class="no-aliases">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag
                :type="scope.row.status === 'ACTIVE' ? 'success' : 'info'"
              >
                {{ scope.row.status === "ACTIVE" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="160"
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      append-to-body
      class="data-base-source-dialog draggable-dialog"
    >
      <el-form :model="form" ref="formRef" :rules="rules" label-width="120px">
        <el-form-item label="数据源代码" prop="sourceCode">
          <el-input v-model="form.sourceCode" placeholder="请输入数据源代码" />
        </el-form-item>
        <el-form-item label="数据源名称" prop="sourceName">
          <el-input v-model="form.sourceName" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="基础代码" prop="sourceType">
          <el-input v-model="form.sourceType" placeholder="请输入基础代码" />
        </el-form-item>
        <el-form-item label="基础代码名称" prop="config">
          <el-input v-model="form.config" placeholder="请输入基础代码名称" />
        </el-form-item>
        <el-form-item label="别名" prop="aliases">
          <el-input
            v-model="form.aliases"
            placeholder="请输入别名，多个别名用逗号分隔"
            type="textarea"
            :rows="2"
          />
          <div style="color: red; font-size: 12px; margin-top: 4px">
            多个使用英文逗号分隔，中文逗号需要使用英文逗号代替
          </div>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入描述"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="ACTIVE">启用</el-radio>
            <el-radio label="INACTIVE">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      title="基础数据源详情"
      v-model="viewDialogVisible"
      width="600px"
      append-to-body
      class="detail-dialog draggable-dialog"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="数据源代码">{{
          detail.sourceCode
        }}</el-descriptions-item>
        <el-descriptions-item label="数据源名称">{{
          detail.sourceName
        }}</el-descriptions-item>
        <el-descriptions-item label="基础代码">{{
          detail.sourceType
        }}</el-descriptions-item>
        <el-descriptions-item label="基础代码名称">{{
          detail.config
        }}</el-descriptions-item>
        <el-descriptions-item label="别名">
          <div v-if="detail.aliases">
            <el-tag
              v-for="alias in detail.aliases.split(',')"
              :key="alias"
              size="small"
              class="alias-tag"
            >
              {{ alias.trim() }}
            </el-tag>
          </div>
          <span v-else class="no-aliases">-</span>
        </el-descriptions-item>
        <el-descriptions-item label="描述">{{
          detail.description
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detail.status === 'ACTIVE' ? 'success' : 'info'">
            {{ detail.status === "ACTIVE" ? "启用" : "禁用" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          detail.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          detail.updateTime
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 导入Excel对话框 -->
    <el-dialog
      title="导入基础数据源"
      v-model="importDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
      class="import-dialog draggable-dialog"
    >
      <div class="import-container">
        <el-upload
          class="upload-excel"
          action="#"
          :auto-upload="false"
          :show-file-list="true"
          :limit="1"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          :file-list="fileList"
          accept=".xlsx, .xls"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip">
              请上传Excel文件，文件格式为.xlsx或.xls，第一行为数据源代码，第二行为数据源名称，第四行开始第一列为基础代码，第二列为基础代码名称，第三列为别名（可选）
            </div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="importDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitImport"
            :loading="importLoading"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Upload,
  View,
  Edit,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  listDataBaseSource,
  getDataBaseSource,
  addDataBaseSource,
  updateDataBaseSource,
  deleteDataBaseSource,
  batchDeleteDataBaseSource,
  importDataBaseSource,
  type DataBaseSourceInfo,
  type DataBaseSourceForm,
  type DataBaseSourceQuery,
} from "@/api/meta/dataBaseSource";

// 状态定义
const loading = ref(false);
const dataList = ref<DataBaseSourceInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const queryParams = reactive<DataBaseSourceQuery>({
  pageNum: 1,
  pageSize: 100,
});

// 表单相关
const formRef = ref<FormInstance>();
const form = reactive<DataBaseSourceForm>({
  sourceCode: "",
  sourceName: "",
  sourceType: "",
  config: "",
  description: "",
  status: "ACTIVE",
  aliases: "",
});

// 表单校验规则
const rules = reactive<FormRules>({
  sourceCode: [
    { required: true, message: "请输入数据源代码", trigger: "blur" },
    { max: 50, message: "长度不能超过50个字符", trigger: "blur" },
  ],
  sourceName: [
    { required: true, message: "请输入数据源名称", trigger: "blur" },
    { max: 100, message: "长度不能超过100个字符", trigger: "blur" },
  ],
  sourceType: [
    { required: true, message: "请输入基础代码", trigger: "blur" },
    { max: 20, message: "长度不能超过20个字符", trigger: "blur" },
  ],
  config: [{ max: 100, message: "长度不能超过100个字符", trigger: "blur" }],
  aliases: [{ max: 255, message: "别名长度不能超过255个字符", trigger: "blur" }],
});

// 对话框状态
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogTitle = ref("");
const detail = ref<DataBaseSourceInfo>({} as DataBaseSourceInfo);

// 导入Excel相关
const importDialogVisible = ref(false);
const importLoading = ref(false);
const fileList = ref<any[]>([]);

// 获取列表数据
const getList = async () => {
  try {
    loading.value = true;
    const res = await listDataBaseSource(queryParams);
    const responseData = res.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      dataList.value = responseData.data.records || [];
      total.value = responseData.data.total;
    } else {
      const msg = responseData?.message || "获取列表失败";
      ElMessage.error(msg);
    }
  } catch (error: any) {
    console.error("获取列表失败:", error);
    ElMessage.error(error.message || "获取列表失败");
  } finally {
    loading.value = false;
  }
};

// 查询与重置
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

const resetQuery = () => {
  queryParams.sourceCode = "";
  queryParams.sourceName = "";
  queryParams.config = "";
  queryParams.status = "";
  queryParams.aliases = "";
  queryParams.pageNum = 1;
  getList();
};

// 表格选择和分页
const handleSelectionChange = (selection: DataBaseSourceInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (current: number) => {
  queryParams.pageNum = current;
  getList();
};

// 表格单元格合并方法
const objectSpanMethod = ({ rowIndex, columnIndex }: any) => {
  // 数据源代码列(索引2)和数据源名称列(索引3)需要合并
  if (columnIndex === 2 || columnIndex === 3) {
    if (
      rowIndex > 0 &&
      dataList.value[rowIndex].sourceCode ===
        dataList.value[rowIndex - 1].sourceCode
    ) {
      return {
        rowspan: 0,
        colspan: 0,
      };
    } else {
      // 计算当前分组的行数
      let count = 1;
      for (let i = rowIndex + 1; i < dataList.value.length; i++) {
        if (
          dataList.value[i].sourceCode === dataList.value[rowIndex].sourceCode
        ) {
          count++;
        } else {
          break;
        }
      }
      return {
        rowspan: count,
        colspan: 1,
      };
    }
  }
  // 对于其他列，不进行合并
  return undefined;
};

// 行点击和双击
const handleRowClick = (row: DataBaseSourceInfo) => {
  console.log("行点击:", row);
};

const handleRowDblClick = (row: DataBaseSourceInfo) => {
  handleView(row);
};

// 表单操作
const resetForm = () => {
  form.id = undefined;
  form.sourceCode = "";
  form.sourceName = "";
  form.sourceType = "";
  form.config = "";
  form.description = "";
  form.status = "ACTIVE";
  form.aliases = "";

  nextTick(() => {
    formRef.value?.clearValidate();
  });
};

// CRUD操作
const handleAdd = () => {
  resetForm();
  dialogTitle.value = "新增基础数据源";
  dialogVisible.value = true;
};

const handleEdit = async (row: DataBaseSourceInfo) => {
  resetForm();
  try {
    loading.value = true;
    const res = await getDataBaseSource(row.id);
    const responseData = res.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      const data = responseData.data;
      form.id = data.id;
      form.sourceCode = data.sourceCode;
      form.sourceName = data.sourceName;
      form.sourceType = data.sourceType;
      form.config = data.config;
      form.description = data.description;
      form.status = data.status;
      form.aliases = data.aliases || "";

      dialogTitle.value = "编辑基础数据源";
      dialogVisible.value = true;
    } else {
      const msg = responseData?.message || "获取详情失败";
      ElMessage.error(msg);
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取详情失败");
  } finally {
    loading.value = false;
  }
};

const handleView = async (row: DataBaseSourceInfo) => {
  try {
    loading.value = true;
    const res = await getDataBaseSource(row.id);
    const responseData = res.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      detail.value = responseData.data;
      viewDialogVisible.value = true;
    } else {
      const msg = responseData?.message || "获取详情失败";
      ElMessage.error(msg);
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取详情失败");
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        let res;

        if (form.id) {
          res = await updateDataBaseSource(form);
        } else {
          res = await addDataBaseSource(form);
        }

        const responseData = res.data as any;
        if (responseData && responseData.code === 200) {
          ElMessage.success(form.id ? "修改成功" : "新增成功");
          dialogVisible.value = false;
          getList();
        } else {
          const msg =
            responseData?.message || (form.id ? "修改失败" : "新增失败");
          ElMessage.error(msg);
        }
      } catch (error: any) {
        ElMessage.error(error.message || (form.id ? "修改失败" : "新增失败"));
      } finally {
        loading.value = false;
      }
    }
  });
};

const handleDelete = (row: DataBaseSourceInfo) => {
  ElMessageBox.confirm("确定要删除该基础数据源吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        loading.value = true;
        const res = await deleteDataBaseSource(row.id);
        const responseData = res.data as any;
        if (responseData && responseData.code === 200) {
          ElMessage.success("删除成功");
          getList();
        } else {
          const msg = responseData?.message || "删除失败";
          ElMessage.error(msg);
        }
      } catch (error: any) {
        ElMessage.error(error.message || "删除失败");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedIds.value.length} 条数据吗?`,
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      try {
        loading.value = true;
        const res = await batchDeleteDataBaseSource(selectedIds.value);
        const responseData = res.data as any;
        if (responseData && responseData.code === 200) {
          ElMessage.success("批量删除成功");
          getList();
        } else {
          const msg = responseData?.message || "批量删除失败";
          ElMessage.error(msg);
        }
      } catch (error: any) {
        ElMessage.error(error.message || "批量删除失败");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 导入Excel相关方法
const handleImport = () => {
  fileList.value = [];
  importDialogVisible.value = true;
};

const handleFileChange = (file: any) => {
  fileList.value = [file];
};

const handleExceed = () => {
  ElMessage.warning("只能上传一个文件");
};

const submitImport = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning("请选择要上传的Excel文件");
    return;
  }

  const file = fileList.value[0].raw;
  if (!file) {
    ElMessage.warning("文件不存在");
    return;
  }

  // 创建FormData对象
  const formData = new FormData();
  formData.append("file", file);

  try {
    importLoading.value = true;
    const res = await importDataBaseSource(formData);
    const responseData = res.data as any;

    if (responseData && responseData.code === 200) {
      ElMessage.success("导入成功");
      importDialogVisible.value = false;
      getList();
    } else {
      const msg = responseData?.message || "导入失败";
      ElMessage.error(msg);
    }
  } catch (error: any) {
    console.error("导入失败:", error);
    ElMessage.error(error.message || "导入失败");
  } finally {
    importLoading.value = false;
  }
};

// 初始化
onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
.data-base-source-management {
  padding: 0px;

  .search-card {
    margin-bottom: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    :deep(.el-card__body) {
      padding: 20px;
    }

    .search-form {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .search-row {
        display: flex;
        gap: 20px;
        align-items: flex-end;
        flex-wrap: wrap;

        .el-form-item {
          margin-bottom: 0;
          flex: 1;
          min-width: 200px;
        }

        .search-buttons {
          flex: none;
          display: flex;
          gap: 12px;
          align-items: flex-end;
          margin-left: auto;

          .el-button {
            padding: 8px 20px;
            border-radius: 6px;
            font-weight: 500;
          }
        }
      }
    }

    :deep(.el-form-item__label) {
      font-weight: 500;
      color: #303133;
      margin-bottom: 6px;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      border-radius: 6px;
      box-shadow: 0 0 0 1px #dcdfe6 inset;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 0 0 1px #c0c4cc inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px #409eff inset;
      }
    }

    :deep(.el-button) {
      font-size: 14px;
      transition: all 0.3s ease;
    }
  }

  .table-card {
    margin-bottom: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    :deep(.el-card__body) {
      padding: 20px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      position: relative;
      padding: 0 4px;

      .operation-buttons {
        display: flex;
        align-items: center;
        gap: 12px;

        .el-button {
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
      }

      .header-title {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .placeholder {
        flex: 1;
        display: flex;
        justify-content: flex-end;

        .el-button {
          border-radius: 50%;
          transition: all 0.3s ease;
        }
      }
    }
  }

  .table-body {
    margin-bottom: 8px;

    :deep(.el-table) {
      font-size: 14px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      .el-table__header th {
        padding: 12px 8px;
        height: 48px;
        background-color: #f8f9fa;
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        border-bottom: 1px solid #ebeef5;
      }

      .el-table__row td {
        padding: 12px 8px;
        font-size: 14px;
        border-bottom: 1px solid #f0f0f0;
      }

      .el-table__row:hover > td {
        background-color: #f5f7fa;
      }

      .el-table__row--striped td {
        background-color: #fafafa;
      }
    }
  }

  .operation-buttons {
    display: flex;
    align-items: center;

    .el-button {
      margin-right: 10px;
    }
  }

  .header-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .placeholder {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    margin-top: 16px;
    border-top: 1px solid #f0f0f0;

    .total-info {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
    }

    :deep(.el-pagination) {
      justify-content: flex-end;
      font-size: 14px;

      .el-pagination__total {
        display: none;
      }

      .el-pagination__sizes {
        margin-right: 16px;
      }

      .btn-prev,
      .btn-next,
      .el-pager li {
        min-width: 32px;
        height: 32px;
        line-height: 32px;
        border-radius: 6px;
        margin: 0 2px;
        transition: all 0.3s ease;
      }

      .el-select .el-input {
        width: 120px;
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 2px;

    .el-button {
      margin: 0 1px;
      padding: 2px 6px;
      font-size: 12px;
      min-width: auto;
      height: 24px;
      line-height: 1;
    }
  }

  .alias-tag {
    margin-right: 6px;
    margin-bottom: 4px;
    background-color: #e6f7ff;
    color: #1890ff;
    border-color: #91d5ff;
    border-radius: 4px;
    font-size: 12px;
    padding: 2px 8px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #bae7ff;
      border-color: #69c0ff;
    }
  }

  .no-aliases {
    color: #c0c4cc;
    font-style: italic;
    font-size: 12px;
  }

  .detail-dialog {
    :deep(.el-descriptions__label) {
      width: 120px;
      font-weight: bold;
    }
  }

  .import-dialog {
    .import-container {
      padding: 10px 0;

      .upload-excel {
        display: flex;
        flex-direction: column;
        align-items: center;

        :deep(.el-upload__tip) {
          margin-top: 10px;
          color: #909399;
          font-size: 12px;
          line-height: 1.5;
        }
      }
    }
  }

  .dialog-footer {
    padding-top: 10px;
    margin-top: 8px;
    border-top: 1px solid #f0f0f0;
    text-align: right;
  }
}
</style>
