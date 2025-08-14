<template>
  <div class="table-header-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="表定义" prop="tableId">
            <el-select
              v-model="queryParams.tableId"
              placeholder="请选择表定义"
              clearable
              filterable
            >
              <el-option
                v-for="item in tableOptions"
                :key="item.id"
                :label="item.tableChineseName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="编号" prop="headerCode">
            <el-input
              v-model="queryParams.headerCode"
              placeholder="请输入编号"
              clearable
            />
          </el-form-item>
          <el-form-item label="数据项名" prop="headerName">
            <el-input
              v-model="queryParams.headerName"
              placeholder="请输入数据项名"
              clearable
            />
          </el-form-item>
          <el-form-item label="状态" prop="isEnable">
            <el-select
              v-model="queryParams.isEnable"
              placeholder="请选择状态"
              clearable
            >
              <el-option label="启用" :value="true" />
              <el-option label="禁用" :value="false" />
            </el-select>
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
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="exportToExcel">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-button type="primary" @click="handleImport">
            <el-icon><Upload /></el-icon>导入Excel
          </el-button>
        </div>
        <div class="header-title">表头定义列表</div>
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
          :height="'calc(75vh - 90px)'"
          border
          style="width: 100%"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
          highlight-current-row
          @row-click="handleRowClick"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="tableName"
            show-overflow-tooltip
            label="表定义"
            min-width="100"
            sortable="custom"
          >
            <template #default="{ row }">
              <el-link type="primary" @click="showAllTables(row)">{{ row.tableName }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="headerCode"
            show-overflow-tooltip
            label="编号"
            min-width="100"
            sortable="custom"
          />
          <el-table-column
            prop="headerName"
            show-overflow-tooltip
            label="数据项名"
            min-width="100"
            sortable="custom"
          />
          <el-table-column
            prop="headerChineseName"
            show-overflow-tooltip
            label="中文简称"
            min-width="100"
            sortable="custom"
          />
          <el-table-column
            prop="headerType"
            show-overflow-tooltip
            label="数据类型"
            min-width="70"
            sortable="custom"
          />
          <el-table-column
            prop="headerLength"
            show-overflow-tooltip
            label="数据长度"
            width="70"
            sortable="custom"
          />
          <el-table-column
            prop="headerExemplify"
            show-overflow-tooltip
            label="解释/举例"
            min-width="120"
          />
          <el-table-column
            prop="headerConstraintValue"
            show-overflow-tooltip
            label="值空间"
            min-width="80"
          />
          <el-table-column
            prop="headerNumber"
            show-overflow-tooltip
            label="引用编号"
            min-width="90"
          />
          <el-table-column
            prop="headerConstraint"
            show-overflow-tooltip
            label="约束值"
            min-width="70"
          />
          <el-table-column
            prop="displayOrder"
            show-overflow-tooltip
            label="显示顺序"
            width="70"
            sortable="custom"
          />
          <el-table-column
            prop="isEnable"
            show-overflow-tooltip
            label="是否启用"
            width="80"
            sortable="custom"
          >
            <template #default="{ row }">
              <el-tag :type="row.isEnable ? 'success' : 'info'">{{
                row.isEnable ? "是" : "否"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="colspan"
            label="列宽"
            width="80"
            sortable="custom"
          />
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
      width="650px"
      :close-on-click-modal="false"
      append-to-body
      class="header-dialog draggable-dialog"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="基座表" prop="tableId">
          <div class="table-select-container">
            <el-select
              v-model="form.tableId"
              placeholder="请选择表定义"
              style="width: 100%"
              filterable
              remote
              :remote-method="searchTables"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
              <el-option
                v-for="item in tableOptions"
                :key="item.id"
                :label="item.tableChineseName"
                :value="item.id"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="编号" prop="headerCode">
          <el-input v-model="form.headerCode" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="数据项名" prop="headerName">
          <el-input v-model="form.headerName" placeholder="请输入数据项名" />
        </el-form-item>
        <el-form-item label="中文简称" prop="headerChineseName">
          <el-input
            v-model="form.headerChineseName"
            placeholder="请输入中文简称"
          />
        </el-form-item>
        <el-form-item label="数据类型" prop="headerType">
          <el-input v-model="form.headerType" placeholder="请输入数据类型" />
        </el-form-item>
        <el-form-item label="数据长度" prop="headerLength">
          <el-input-number v-model="form.headerLength" :min="0" />
        </el-form-item>
        <el-form-item label="约束值" prop="headerConstraint">
          <el-input
            v-model="form.headerConstraint"
            placeholder="请输入约束值"
          />
        </el-form-item>
        <el-form-item label="值空间" prop="headerConstraintValue">
          <el-input
            v-model="form.headerConstraintValue"
            placeholder="请输入值空间"
          />
        </el-form-item>
        <el-form-item label="解释举例" prop="headerExemplify">
          <el-input
            v-model="form.headerExemplify"
            type="textarea"
            :rows="2"
            placeholder="请输入解释举例"
          />
        </el-form-item>
        <el-form-item label="引用编号" prop="headerNumber">
          <el-input v-model="form.headerNumber" placeholder="请输入引用编号" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="displayOrder">
          <el-input-number v-model="form.displayOrder" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="列宽" prop="colspan">
          <el-input-number v-model="form.colspan" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnable">
          <el-switch v-model="form.isEnable" />
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
      title="表头详情"
      v-model="viewDialogVisible"
      width="680px"
      append-to-body
      class="detail-dialog draggable-dialog"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="表定义">{{
          detailData.tableName
        }}</el-descriptions-item>
        <el-descriptions-item label="编号">{{
          detailData.headerCode
        }}</el-descriptions-item>
        <el-descriptions-item label="数据项名">{{
          detailData.headerName
        }}</el-descriptions-item>
        <el-descriptions-item label="中文简称">{{
          detailData.headerChineseName
        }}</el-descriptions-item>
        <el-descriptions-item label="数据类型">{{
          detailData.headerType
        }}</el-descriptions-item>
        <el-descriptions-item label="数据长度">{{
          detailData.headerLength
        }}</el-descriptions-item>
        <el-descriptions-item label="约束值">{{
          detailData.headerConstraint
        }}</el-descriptions-item>
        <el-descriptions-item label="值空间">{{
          detailData.headerConstraintValue
        }}</el-descriptions-item>
        <el-descriptions-item label="解释举例">{{
          detailData.headerExemplify
        }}</el-descriptions-item>
        <el-descriptions-item label="引用编号">{{
          detailData.headerNumber
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detailData.isEnable ? 'success' : 'info'">{{
            detailData.isEnable ? "启用" : "禁用"
          }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="显示顺序">{{
          detailData.displayOrder
        }}</el-descriptions-item>
        <el-descriptions-item label="列宽">{{
          detailData.colspan
        }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          detailData.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          detailData.updateTime
        }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入Excel对话框 -->
    <el-dialog
      title="导入表头定义"
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
              请上传Excel文件，文件格式为.xlsx或.xls，第一行为表名，第二行为表头定义，第三行开始为数据
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

    <!-- 全部表定义对话框 -->
    <el-dialog
      v-model="allTablesDialogVisible"
      :title="allTablesName"
      width="1200px"
    >
      <el-table :data="allTablesDataList" border>
        <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="tableName"
            show-overflow-tooltip
            label="表定义"
            min-width="100"
            sortable="custom"
          />
          <el-table-column
            prop="headerCode"
            show-overflow-tooltip
            label="编号"
            min-width="100"
            sortable="custom"
          />
          <el-table-column
            prop="headerName"
            show-overflow-tooltip
            label="数据项名"
            min-width="100"
            sortable="custom"
          />
          <el-table-column
            prop="headerChineseName"
            show-overflow-tooltip
            label="中文简称"
            min-width="100"
            sortable="custom"
          />
          <el-table-column
            prop="headerType"
            show-overflow-tooltip
            label="数据类型"
            min-width="70"
            sortable="custom"
          />
          <el-table-column
            prop="headerLength"
            show-overflow-tooltip
            label="数据长度"
            width="70"
            sortable="custom"
          />
          <el-table-column
            prop="headerExemplify"
            show-overflow-tooltip
            label="解释/举例"
            min-width="120"
          />
          <el-table-column
            prop="headerConstraintValue"
            show-overflow-tooltip
            label="值空间"
            min-width="80"
          />
          <el-table-column
            prop="headerNumber"
            show-overflow-tooltip
            label="引用编号"
            min-width="90"
          />
          <el-table-column
            prop="headerConstraint"
            show-overflow-tooltip
            label="约束值"
            min-width="70"
          />
          <el-table-column
            prop="displayOrder"
            show-overflow-tooltip
            label="显示顺序"
            width="70"
            sortable="custom"
          />
          <el-table-column
            prop="isEnable"
            show-overflow-tooltip
            label="是否启用"
            width="80"
            sortable="custom"
          >
            <template #default="{ row }">
              <el-tag :type="row.isEnable ? 'success' : 'info'">{{
                row.isEnable ? "是" : "否"
              }}</el-tag>
            </template>
          </el-table-column>
           
        <!-- 可根据tableOptions结构增加更多字段 -->
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  View,
  Edit,
  Download,
  Upload,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  listTableHeaders,
  getTableHeader,
  addTableHeader,
  updateTableHeader,
  deleteTableHeader,
  batchDeleteTableHeaders,
  checkTableHeaderCodeExists,
  exportTableHeaderToExcel,
  importTableHeaderFromExcel,
  type TableHeaderInfo,
  type TableHeaderForm,
  type TableHeaderQuery,
} from "@/api/meta/tableHeader";
import { listMetaTable } from "@/api/meta/tableDefinition";

// 状态定义
const loading = ref(false);
const dataList = ref<TableHeaderInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const queryParams = reactive<TableHeaderQuery>({
  pageNum: 1,
  pageSize: 100,
  orderByColumn: "", // 排序字段
  isAsc: "asc", // 排序方式
});

// 表单相关
const formRef = ref<FormInstance>();
const form = reactive<TableHeaderForm>({
  tableId: 0,
  tableName: "",
  headerCode: "",
  headerName: "",
  headerChineseName: "",
  headerType: "",
  headerLength: 0,
  headerConstraint: "",
  headerConstraintValue: "",
  headerExemplify: "",
  headerNumber: "",
  headerConstraintTable: "",
  headerConstraintTableId: "",
  headerConstraintTableValue: "",
  headerConstraintTableValueDescription: "",
  displayOrder: 0,
  colspan: 1,
  isEnable: true,
  reservedField1: "",
  reservedField2: "",
  reservedField3: "",
  reservedField4: "",
  reservedField5: "",
});

// 表单校验规则
const rules = reactive<FormRules>({
  tableId: [{ required: true, message: "请选择表定义", trigger: "change" }],
  tableName: [{ required: true, message: "请输入表名", trigger: "blur" }],
  headerCode: [
    { required: true, message: "请输入编号", trigger: "blur" },
    { max: 50, message: "编号长度不能超过50个字符", trigger: "blur" },
  ],
  headerName: [
    { required: true, message: "请输入数据项名", trigger: "blur" },
    { max: 100, message: "数据项名长度不能超过100个字符", trigger: "blur" },
  ],
  headerChineseName: [
    { required: true, message: "请输入中文简称", trigger: "blur" },
    { max: 100, message: "中文简称长度不能超过100个字符", trigger: "blur" },
  ],
  headerType: [
    { required: true, message: "请输入数据类型", trigger: "blur" },
    { max: 50, message: "数据类型长度不能超过50个字符", trigger: "blur" },
  ],
  headerLength: [
    { required: true, message: "请输入数据长度", trigger: "blur" },
  ],
  headerConstraint: [
    { required: true, message: "请输入约束值", trigger: "blur" },
    { max: 50, message: "约束值长度不能超过50个字符", trigger: "blur" },
  ],
  // 以下字段可以为空，仅设置长度校验
  headerConstraintValue: [
    { max: 50, message: "值空间长度不能超过50个字符", trigger: "blur" },
  ],
  headerExemplify: [
    { max: 200, message: "解释举例长度不能超过200个字符", trigger: "blur" },
  ],
  headerNumber: [
    { max: 200, message: "引用编号长度不能超过200个字符", trigger: "blur" },
  ],
  headerConstraintTable: [
    { max: 50, message: "约束表长度不能超过50个字符", trigger: "blur" },
  ],
  headerConstraintTableValue: [
    { max: 50, message: "约束表值长度不能超过50个字符", trigger: "blur" },
  ],
  displayOrder: [
    { required: true, message: "请输入显示顺序", trigger: "blur" },
  ],
});

// 对话框状态
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogTitle = ref("");
const detailData = ref<TableHeaderInfo>({} as TableHeaderInfo);
const allTablesName = ref("");
// 下拉选项
const tableOptions = ref<any[]>([]);

// 导入Excel相关
const importDialogVisible = ref(false);
const importLoading = ref(false);
const fileList = ref<any[]>([]);

// 全部表定义对话框状态
const allTablesDialogVisible = ref(false)
const allTablesDataList = ref<any[]>([]);
// 获取表定义下拉选项
const getTableOptions = async () => {
  try {
    const response: any = await listMetaTable({ pageNum: 1, pageSize: 100 });
    tableOptions.value = response.data.data.records || [];
  } catch (error) {
    console.error("获取表定义列表失败:", error);
  }
};

// 搜索表定义
const searchTables = async (query: string) => {
  if (query) {
    try {
      const response: any = await listMetaTable({
        pageNum: 1,
        pageSize: 100,
        tableChineseName: query,
      });
      tableOptions.value = response.data.data.records || [];
    } catch (error) {
      console.error("搜索表定义失败:", error);
    }
  } else {
    getTableOptions();
  }
};

// 获取列表数据
const getList = async () => {
  try {
    loading.value = true;
    const response: any = await listTableHeaders(queryParams);
    dataList.value = response.data.data.records || [];
    total.value = response.data.data.total;
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
  queryParams.tableId = undefined;
  queryParams.headerCode = undefined;
  queryParams.headerName = undefined;
  queryParams.headerConstraintValue = undefined;
  queryParams.headerNumber = undefined;
  queryParams.isEnable = undefined;
  queryParams.pageNum = 1;
  handleQuery();
};

// 表格选择和分页
const handleSelectionChange = (selection: TableHeaderInfo[]) => {
  selectedIds.value = selection.map((item) => item.id as number);
};

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (current: number) => {
  queryParams.pageNum = current;
  getList();
};

// 行点击
const handleRowClick = (_row: TableHeaderInfo) => {
  // 可以实现行选中等功能
};

// 表单操作
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }

  form.id = undefined;
  form.tableId = 0;
  form.tableName = "";
  form.headerCode = "";
  form.headerName = "";
  form.headerChineseName = "";
  form.headerType = "";
  form.headerLength = 0;
  form.headerConstraint = "";
  form.headerConstraintValue = "";
  form.headerExemplify = "";
  form.headerNumber = "";
  form.headerConstraintTable = "";
  form.headerConstraintTableId = "";
  form.headerConstraintTableValue = "";
  form.headerConstraintTableValueDescription = "";
  form.displayOrder = 0;
  form.colspan = 1;
  form.isEnable = true;
  form.reservedField1 = "";
  form.reservedField2 = "";
  form.reservedField3 = "";
  form.reservedField4 = "";
  form.reservedField5 = "";
};

// CRUD操作
const handleAdd = () => {
  resetForm();
  dialogTitle.value = "新增表头定义";
  dialogVisible.value = true;
};

const handleEdit = async (row: TableHeaderInfo) => {
  resetForm();
  try {
    loading.value = true;
    const response: any = await getTableHeader(row.id as number);
    const data = response.data.data;

    // 复制数据到表单
    Object.assign(form, data);

    dialogTitle.value = "编辑表头定义";
    dialogVisible.value = true;
  } catch (error: any) {
    ElMessage.error(error.message || "获取表头详情失败");
  } finally {
    loading.value = false;
  }
};

const handleView = async (row: TableHeaderInfo) => {
  try {
    loading.value = true;
    const response: any = await getTableHeader(row.id as number);
    detailData.value = response.data.data;
    viewDialogVisible.value = true;
  } catch (error: any) {
    ElMessage.error(error.message || "获取表头详情失败");
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

        // 检查表头编码是否存在
        const checkResponse: any = await checkTableHeaderCodeExists(
          form.tableId,
          form.headerCode,
          form.id,
        );

        if (checkResponse.data.data) {
          ElMessage.error("表头编码已存在");
          return;
        }

        const response: any = form.id
          ? await updateTableHeader(form.id, form)
          : await addTableHeader(form);

        if (response.data.code === 200) {
          ElMessage.success(form.id ? "修改成功" : "新增成功");
          dialogVisible.value = false;
          getList();
        } else {
          ElMessage.error(
            response.data.message || (form.id ? "修改失败" : "新增失败"),
          );
        }
      } catch (error: any) {
        ElMessage.error(error.message || (form.id ? "修改失败" : "新增失败"));
      } finally {
        loading.value = false;
      }
    }
  });
};

const handleDelete = (row: TableHeaderInfo) => {
  ElMessageBox.confirm("确定要删除该表头定义吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        loading.value = true;
        const response: any = await deleteTableHeader(row.id as number);
        if (response.data.code === 200) {
          ElMessage.success("删除成功");
          getList();
        } else {
          ElMessage.error(response.data.message || "删除失败");
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
        const response: any = await batchDeleteTableHeaders(selectedIds.value);
        if (response.data.code === 200) {
          ElMessage.success("批量删除成功");
          getList();
        } else {
          ElMessage.error(response.data.message || "批量删除失败");
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

// 导出Excel
const exportToExcel = () => {
  if (!queryParams.tableId) {
    ElMessage.warning("请先选择一个表定义");
    return;
  }

  try {
    loading.value = true;
    exportTableHeaderToExcel(queryParams.tableId)
      .then((response) => {
        // 检查响应数据结构
        if (!response || !response.data) {
          ElMessage.error("导出失败，响应数据为空");
          return;
        }

        // 获取base64数据
        const responseData = response.data as any;
        let base64Data = "";

        if (typeof responseData === "string") {
          // 直接是字符串
          base64Data = responseData;
        } else if (responseData.data !== undefined) {
          // 是对象，包含data字段
          base64Data = responseData.data;
        } else if (
          responseData.result !== undefined &&
          responseData.data !== undefined
        ) {
          // ApiResponse格式
          base64Data = responseData.data;
        }

        if (!base64Data) {
          ElMessage.error("导出失败，未获取到有效的数据");
          return;
        }

        try {
          // 创建Blob对象
          const byteCharacters = atob(base64Data);
          const byteArrays = [];
          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
          const blob = new Blob(byteArrays, {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          // 创建下载链接
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `表头定义_${new Date().toISOString().split("T")[0]}.xlsx`;
          document.body.appendChild(link);
          link.click();

          // 清理
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
          ElMessage.success("导出成功");
        } catch (error) {
          console.error(
            "解析Base64数据失败:",
            error,
            "数据:",
            base64Data.substring(0, 100) + "...",
          );
          ElMessage.error("解析Excel数据失败，可能是数据格式不正确");
        }
      })
      .catch((error) => {
        console.error("导出Excel失败:", error);
        ElMessage.error(error.message || "导出Excel失败");
      })
      .finally(() => {
        loading.value = false;
      });
  } catch (error: any) {
    console.error("导出Excel失败:", error);
    ElMessage.error(error.message || "导出Excel失败");
    loading.value = false;
  }
};

// 导入Excel
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
    const response: any = await importTableHeaderFromExcel(formData);

    if (response.data.code === 200) {
      ElMessage.success("导入成功");
      importDialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.message || "导入失败");
    }
  } catch (error: any) {
    console.error("导入失败:", error);
    ElMessage.error(error.message || "导入失败");
  } finally {
    importLoading.value = false;
  }
};

// 排序变化处理
const handleSortChange = (column: { prop: string; order: string | null }) => {
  // 设置排序参数
  queryParams.orderByColumn = column.prop;
  queryParams.isAsc = column.order === "ascending" ? "asc" : "desc";

  // 如果没有排序，重置排序参数
  if (!column.order) {
    queryParams.orderByColumn = "";
    queryParams.isAsc = "asc";
  }

  // 重新获取数据
  getList();
};

// 显示全部表定义
const showAllTables = async (row) => {
  queryParams.tableId = row.tableId;
  allTablesName.value = row.tableName;
  queryParams.pageNum = 1;
  queryParams.pageSize = 100;
  const response: any = await listTableHeaders(queryParams);
  allTablesDataList.value = response.data.data.records;
  allTablesDialogVisible.value = true
}

// 初始化
onMounted(() => {
  getTableOptions();
  getList();
});
</script>

<style scoped lang="scss">
.table-header-management {
  padding: 0px;

  .search-card {
    margin-bottom: 2px;

    :deep(.el-card__body) {
      padding: 8px 15px;
    }

    :deep(.el-form) {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 10px;
    }

    :deep(.el-form-item__label) {
      width: 50px;
      text-align: right;
      padding-right: 4px;
      font-size: 14px;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 210px;
      font-size: 14px;
    }

    :deep(.el-button) {
      font-size: 14px;
    }

    :deep(.el-form-item:last-child) {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .table-select-container {
    display: flex;
    align-items: center;
    width: 100%;

    .el-select {
      flex: 1;
    }
  }

  .table-card {
    margin-bottom: 10px;

    :deep(.el-card__body) {
      padding: 10px 15px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      position: relative;

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
    }
  }

  .table-body {
    margin-bottom: 8px;

    :deep(.el-table) {
      font-size: 14px;
    }

    :deep(.el-table__header th) {
      padding: 4px 0;
      height: 40px;
      background-color: #f5f7fa;
      font-size: 14px;
    }

    :deep(.el-table__row td) {
      padding: 4px 0;
      font-size: 14px;
    }

    .action-buttons {
      display: flex;
      justify-content: center;

      .el-button {
        margin: 0 3px;
        padding: 0 5px;
        font-size: 14px;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    margin-top: 10px;

    .total-info {
      font-size: 14px;
      color: #606266;
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
        margin-right: 15px;
      }

      .btn-prev,
      .btn-next,
      .el-pager li {
        min-width: 24px;
        height: 24px;
        line-height: 24px;
      }

      .el-select .el-input {
        width: 100px;
      }
    }
  }

  .header-dialog {
    :deep(.el-dialog__body) {
      padding: 10px 15px;
    }
  }

  .detail-dialog {
    :deep(.el-descriptions__label) {
      width: 120px;
      font-weight: bold;
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
      font-family: Consolas, Monaco, monospace;
      font-size: 13px;
      background-color: #f5f7fa;
      padding: 8px;
      border-radius: 4px;
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

