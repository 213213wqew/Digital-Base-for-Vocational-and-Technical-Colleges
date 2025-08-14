<template>
  <div class="meta-table-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" size="small">
          <div class="form-row">
            <el-form-item label="数据子集编码" prop="subsetCode">
              <el-input
                v-model="queryParams.subsetCode"
                placeholder="请输入编码"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="数据子集名称" prop="subsetName">
              <el-input
                v-model="queryParams.subsetName"
                placeholder="请输入名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="上报频率" prop="tableReportFrequency">
              <el-select
                v-model="queryParams.tableReportFrequency"
                placeholder="请选择上报频率"
                clearable
                style="width: 100%"
              >
                <el-option label="年" value="年" />
                <el-option label="学期" value="学期" />
                <el-option label="月" value="月" />
                <el-option label="天" value="天" />
                <el-option label="本学年秋季学期" value="本学年秋季学期" />
                <el-option
                  label="根据学校信息化系统建设情况自行判定"
                  value="根据学校信息化系统建设情况自行判定"
                />
                <el-option
                  label="根据特色信息化系统应用运行情况自行判定"
                  value="根据特色信息化系统应用运行情况自行判定"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="数据子类编码" prop="subcatalogCode">
              <el-input
                v-model="queryParams.subcatalogCode"
                placeholder="请输入编码"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="数据子类名称" prop="subcatalogName">
              <el-input
                v-model="queryParams.subcatalogName"
                placeholder="请输入名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="请选择状态"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <div class="button-container">
              <el-button type="primary" @click="handleQuery" size="small">
                <el-icon><Search /></el-icon>搜索
              </el-button>
              <el-button @click="resetQuery" size="small">
                <el-icon><Refresh /></el-icon>重置
              </el-button>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="left-actions">
          <el-button type="primary" size="small" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增
          </el-button>
          <el-button
            type="danger"
            size="small"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
        </div>
        <div class="table-title">元数据表定义列表</div>
        <div class="right-actions">
          <el-tooltip content="刷新" placement="top">
            <el-button circle size="small" @click="getList">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <div class="table-body">
        <el-table
          v-loading="loading"
          :data="tableList"
          @selection-change="handleSelectionChange"
          border
          style="width: 100%"
          :default-sort="{ prop: 'subsetCode', order: 'ascending' }"
          :header-cell-style="{
            color: '#333',
            background: '#3b83e1',
            height: '45px',
            fontWeight: 'bold',
            textAlign: 'center',
          }"
          :span-method="objectSpanMethod"
          highlight-current-row
          @row-dblclick="handleRowDblClick"
          @sort-change="handleSortChange"
          size="small"
          height="calc(75vh - 90px)"
          :max-height="tableMaxHeight"
        >
          <el-table-column type="selection" width="45" align="center" fixed />
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
            fixed
          />
          <el-table-column
            label="数据子集"
            prop="subsetCode"
            min-width="120"
            align="center"
            fixed
          >
            <template #default="scope">
              <div class="cell-content">
                <div class="main-value">{{ scope.row.subsetCode }}</div>
                <div class="sub-value">{{ scope.row.subsetName }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="数据类"
            prop="catalogCode"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <div class="cell-content">
                <div class="main-value">{{ scope.row.catalogCode }}</div>
                <div class="sub-value">{{ scope.row.catalogName }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="数据子类"
            prop="subcatalogCode"
            min-width="150"
            align="center"
          >
            <template #default="scope">
              <div class="cell-content">
                <div class="main-value">{{ scope.row.subcatalogCode }}</div>
                <div class="sub-value">{{ scope.row.subcatalogName }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="序号"
            prop="tableVersion"
            width="120"
            align="center"
            :sort-method="sortByNumber"
            sortable
          >
            <template #default="scope">
              {{ scope.row.tableVersion }}
            </template>
          </el-table-column>
          <el-table-column
            label="表英文名称"
            prop="tableEnglishName"
            min-width="150"
            align="center"
          />
          <el-table-column
            label="表中文名称"
            prop="tableChineseName"
            min-width="150"
            align="center"
          >
            <template #default="scope">
              <el-link type="primary" @click="handleShowHeaders(scope.row)">{{
                scope.row.tableChineseName
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="主要来源"
            prop="tableMainSource"
            min-width="100"
            align="center"
          />
          <el-table-column
            label="上报频率"
            prop="tableReportFrequency"
            min-width="100"
            align="center"
            sortable
          />
          <el-table-column
            label="上报范围"
            prop="tableReportScope"
            min-width="100"
            align="center"
            sortable
          />
          <el-table-column
            label="表头状态"
            prop="hasHeaders"
            min-width="80"
            align="center"
            sortable
          >
            <template #default="scope">
              <el-tag
                :type="scope.row.hasHeaders ? 'success' : 'danger'"
                effect="light"
                size="small"
              >
                {{ scope.row.hasHeaders ? "已配置" : "未配置" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop="status"
            min-width="80"
            align="center"
            sortable
          >
            <template #default="scope">
              <el-tag
                :type="getStatusTagType(scope.row.status)"
                effect="light"
                size="small"
              >
                {{ getStatusLabel(scope.row.status) }}
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

      <!-- 分页区域 -->
      <div class="pagination-wrapper">
        <span class="total-info">共 {{ total }} 条</span>
        <div class="pagination-controls">
          <el-pagination
            v-model:current-page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[200, 500, 700, 100]"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            small
          />
        </div>
      </div>
    </el-card>

    <!-- 表单对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      class="meta-table-dialog draggable-dialog"
      ref="metaTableDialogRef"
    >
      <div style="padding: 5px 0">
        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="120px"
          class="meta-table-form"
          style="margin-top: 5px"
        >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-divider content-position="left"
                ><span class="divider-title">基本信息</span></el-divider
              >
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="数据子集编码" prop="subsetCode">
                <el-input
                  v-model="form.subsetCode"
                  placeholder="请输入数据子集编码"
                  show-overflow-tooltip
                  :disabled="dialog.type === 'view'"
                  style="height: 36px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="数据子集名称" prop="subsetName">
                <el-input
                  v-model="form.subsetName"
                  placeholder="请输入数据子集名称"
                  show-overflow-tooltip
                  :disabled="dialog.type === 'view'"
                  style="height: 36px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="数据类编码" prop="catalogCode">
                <el-input
                  v-model="form.catalogCode"
                  placeholder="请输入数据类编码"
                  show-overflow-tooltip
                  :disabled="dialog.type === 'view'"
                  style="height: 36px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="数据类名称" prop="catalogName">
                <el-input
                  v-model="form.catalogName"
                  placeholder="请输入数据类名称"
                  show-overflow-tooltip
                  :disabled="dialog.type === 'view'"
                  style="height: 36px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="数据子类编码" prop="subcatalogCode">
                <el-input
                  v-model="form.subcatalogCode"
                  placeholder="请输入数据子类编码"
                  show-overflow-tooltip
                  :disabled="dialog.type === 'view'"
                  style="height: 36px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="数据子类名称" prop="subcatalogName">
                <el-input
                  v-model="form.subcatalogName"
                  placeholder="请输入数据子类名称"
                  show-overflow-tooltip
                  :disabled="dialog.type === 'view'"
                  style="height: 36px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="数据表英文名" prop="tableEnglishName">
                <el-input
                  v-model="form.tableEnglishName"
                  placeholder="请输入数据表英文名"
                  show-overflow-tooltip
                  :disabled="dialog.type === 'view'"
                  style="height: 36px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="数据表中文名" prop="tableChineseName">
                <el-input
                  v-model="form.tableChineseName"
                  placeholder="请输入数据表中文名"
                  show-overflow-tooltip
                  :disabled="dialog.type === 'view'"
                  style="height: 36px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="数据表版本" prop="tableVersion">
                <el-input
                  v-model="form.tableVersion"
                  placeholder="请输入数据表版本"
                  show-overflow-tooltip
                  :disabled="dialog.type === 'view'"
                  style="height: 36px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="是否标准表" prop="isStandard">
                <el-switch
                  v-model="form.isStandard"
                  :disabled="dialog.type === 'view'"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="form.status"
                  placeholder="请选择状态"
                  style="width: 100%; height: 36px"
                  :disabled="dialog.type === 'view'"
                >
                  <el-option
                    v-for="dict in statusOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left"
                ><span class="divider-title">详细信息</span></el-divider
              >
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="主要来源" prop="tableMainSource">
                <el-input
                  v-model="form.tableMainSource"
                  placeholder="请输入主要来源"
                  :disabled="dialog.type === 'view'"
                  style="height: 36px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="上报频率" prop="tableReportFrequency">
                <el-input
                  v-model="form.tableReportFrequency"
                  placeholder="请输入上报频率"
                  :disabled="dialog.type === 'view'"
                  style="height: 36px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="上报范围" prop="tableReportScope">
                <el-input
                  v-model="form.tableReportScope"
                  placeholder="请输入上报范围"
                  :disabled="dialog.type === 'view'"
                  style="height: 36px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-bottom: 10px">
              <el-form-item label="上报周期单位" prop="tableReportPeriod">
                <el-select
                  v-model="form.tableReportPeriod"
                  placeholder="请选择上报周期单位"
                  style="width: 100%; height: 36px"
                  :disabled="dialog.type === 'view'"
                >
                  <el-option label="天" value="天" />
                  <el-option label="周" value="周" />
                  <el-option label="月" value="月" />
                  <el-option label="季度" value="季度" />
                  <el-option label="年" value="年" />
                  <el-option label="学期" value="学期" />
                  
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="margin-bottom: 10px">
              <el-form-item label="表描述" prop="description">
                <el-input
                  v-model="form.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入表描述"
                  :disabled="dialog.type === 'view'"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <div
          class="dialog-footer"
          style="
            padding-top: 10px;
            margin-top: 5px;
            border-top: 1px solid #f0f0f0;
          "
        >
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitForm"
            v-if="dialog.type !== 'view'"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- 表头定义对话框 -->
    <el-dialog
      :title="headerDialog.title"
      v-model="headerDialog.visible"
      width="1150px"
      append-to-body
      :close-on-click-modal="false"
      class="meta-header-dialog"
    >
      <div v-loading="headerDialog.loading">
        <div v-if="headerList.length > 0">
          <el-table
            :data="headerList"
            border
            style="width: 100%"
            :header-cell-style="{
              color: '#333',
              background: '#3b83e1',
              height: '45px',
              fontWeight: 'bold',
              textAlign: 'center',
            }"
            size="small"
            max-height="500px"
          >
            <el-table-column
              type="index"
              label="序号"
              show-overflow-tooltip
              width="60"
              align="center"
            />
            <el-table-column
              label="编号"
              prop="headerCode"
              show-overflow-tooltip
              min-width="120"
              align="center"
            />
            <el-table-column
              label="数据项名"
              prop="headerName"
              show-overflow-tooltip
              min-width="120"
              align="center"
            />
            <el-table-column
              label="中文简称"
              prop="headerChineseName"
              show-overflow-tooltip
              min-width="120"
              align="center"
            />
            <el-table-column
              label="数据类型"
              prop="headerType"
              show-overflow-tooltip
              min-width="80"
              align="center"
            />
            <el-table-column
              label="数据长度"
              prop="headerLength"
              show-overflow-tooltip
              min-width="80"
              align="center"
            />
            <el-table-column
              label="约束"
              prop="headerConstraint"
              show-overflow-tooltip
              min-width="80"
              align="center"
            />
            <el-table-column
              label="值空间"
              prop="headerConstraintValue"
              show-overflow-tooltip
              min-width="120"
              align="center"
            />
            <el-table-column
              label="解释举例"
              prop="headerExemplify"
              show-overflow-tooltip
              min-width="150"
              align="center"
            />
            <el-table-column
              label="引用编号"
              prop="headerNumber"
              show-overflow-tooltip
              min-width="120"
              align="center"
            />
          </el-table>
        </div>
        <div v-else-if="!headerDialog.loading" class="empty-data">
          <el-empty description="暂无表头定义数据" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
} from "@element-plus/icons-vue";
import {
  MetaTableQuery,
  MetaTableInfo,
  MetaTableForm,
  listMetaTable,
  getMetaTable,
  addMetaTable,
  updateMetaTable,
  deleteMetaTable,
  batchDeleteMetaTable,
  getStatusOptions,
  getTableHeaders,
} from "@/api/meta/tableDefinition";

// 查询参数
const queryParams = reactive<MetaTableQuery>({
  subsetCode: "",
  subsetName: "",
  subcatalogCode: "",
  subcatalogName: "",
  tableChineseName: "",
  tableReportFrequency: "",
  status: "",
  pageNum: 1,
  pageSize: 200,
});

// 总数据条数
const total = ref(0);
// 元数据表定义列表
const tableList = ref<MetaTableInfo[]>([]);
// 选中的ID列表
const selectedIds = ref<number[]>([]);
// 表单ref
const formRef = ref<FormInstance>();
// 查询表单ref
const queryFormRef = ref<FormInstance>();
// 加载状态
const loading = ref(false);
// 当前激活的Tab页
const activeTab = ref("basic");

// 表单校验规则
const formRules = reactive<FormRules>({
  subsetCode: [
    { required: true, message: "数据子集编码不能为空", trigger: "blur" },
    { max: 100, message: "数据子集编码长度不能超过100个字符", trigger: "blur" },
  ],
  subsetName: [
    { required: true, message: "数据子集名称不能为空", trigger: "blur" },
    { max: 200, message: "数据子集名称长度不能超过200个字符", trigger: "blur" },
  ],
  catalogCode: [
    { required: true, message: "数据类编码不能为空", trigger: "blur" },
    { max: 100, message: "数据类编码长度不能超过100个字符", trigger: "blur" },
  ],
  catalogName: [
    { required: true, message: "数据类名称不能为空", trigger: "blur" },
    { max: 200, message: "数据类名称长度不能超过200个字符", trigger: "blur" },
  ],
  subcatalogCode: [
    { required: true, message: "数据子类编码不能为空", trigger: "blur" },
    { max: 100, message: "数据子类编码长度不能超过100个字符", trigger: "blur" },
  ],
  subcatalogName: [
    { required: true, message: "数据子类名称不能为空", trigger: "blur" },
    { max: 200, message: "数据子类名称长度不能超过200个字符", trigger: "blur" },
  ],
  status: [{ required: true, message: "状态不能为空", trigger: "change" }],
});

// 状态选项
const statusOptions = ref(getStatusOptions());

// 弹窗相关参数
const dialog = reactive({
  visible: false,
  title: "",
  type: "",
});

// 表单参数
const form = reactive<Partial<MetaTableForm>>({
  id: undefined,
  subsetCode: "",
  subsetName: "",
  catalogCode: "",
  catalogName: "",
  subcatalogCode: "",
  subcatalogName: "",
  tableVersion: "1.0",
  tableEnglishName: "",
  tableChineseName: "",
  tableMainSource: "",
  tableReportFrequency: "",
  tableReportScope: "",
  tableReportPeriod: "",
  description: "",
  isStandard: false,
  status: "DRAFT",
});

// 表格最大高度
const tableMaxHeight = ref("calc(75vh - 90px)");

// 表头定义对话框参数
const headerDialog = reactive({
  visible: false,
  title: "",
  loading: false,
  tableId: null as number | null,
  tableName: "",
});

// 表头定义数据
const headerList = ref<any[]>([]);

// 获取元数据表定义列表
const getList = async () => {
  try {
    loading.value = true;
    const response: any = await listMetaTable(queryParams);

    // 处理返回的数据
    const records = response.data.data.records || [];
    total.value = response.data.data.total || 0;

    // 对数据进行排序，先按数据子集编码排序，再按数据类编码排序
    records.sort((a: any, b: any) => {
      // 先按数据子集编码排序
      if (a.subsetCode !== b.subsetCode) {
        return a.subsetCode.localeCompare(b.subsetCode);
      }
      // 再按数据类编码排序
      if (a.catalogCode !== b.catalogCode) {
        return a.catalogCode.localeCompare(b.catalogCode);
      }
      // 最后按数据子类编码排序
      return a.subcatalogCode.localeCompare(b.subcatalogCode);
    });

    tableList.value = records;
  } catch (error: any) {
    console.error("获取元数据表定义列表失败:", error);
    ElMessage.error(error.message || "获取元数据表定义列表失败");
    tableList.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 处理表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 查询操作
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置查询操作
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    subsetCode: "",
    subsetName: "",
    catalogCode: "",
    catalogName: "",
    subcatalogCode: "",
    subcatalogName: "",
    tableVersion: "1.0",
    tableEnglishName: "",
    tableChineseName: "",
    tableMainSource: "",
    tableReportFrequency: "",
    tableReportScope: "",
    tableReportPeriod: "",
    description: "",
    isStandard: false,
    status: "DRAFT",
  });
  activeTab.value = "basic";
};

// 新增操作
const handleAdd = () => {
  resetForm();
  dialog.visible = true;
  dialog.title = "添加元数据表定义";
  dialog.type = "add";
};

// 编辑操作
const handleUpdate = async (row: any) => {
  resetForm();
  dialog.visible = true;
  dialog.title = "修改元数据表定义";
  dialog.type = "edit";

  try {
    loading.value = true;
    const response: any = await getMetaTable(row.id);
    Object.assign(form, response.data.data);
  } catch (error: any) {
    console.error("获取元数据表定义详情失败:", error);
    ElMessage.error(error.message || "获取元数据表定义详情失败");
  } finally {
    loading.value = false;
  }
};

// 查看操作
const handleView = async (row: any) => {
  resetForm();
  dialog.visible = true;
  dialog.title = "查看元数据表定义";
  dialog.type = "view";

  try {
    loading.value = true;
    const response: any = await getMetaTable(row.id);
    Object.assign(form, response.data.data);
  } catch (error: any) {
    console.error("获取元数据表定义详情失败:", error);
    ElMessage.error(error.message || "获取元数据表定义详情失败");
  } finally {
    loading.value = false;
  }
};

// 删除操作
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确认删除数据子类编码为"${row.subcatalogCode}"的元数据表定义吗？`,
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
        const response: any = await deleteMetaTable(row.id);
        if (response.data.code === 200) {
          ElMessage.success("删除成功");
          getList();
        } else {
          ElMessage.error(response.data.message || "删除失败");
        }
      } catch (error: any) {
        console.error("删除元数据表定义失败:", error);
        ElMessage.error(error.message || "删除失败");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 批量删除操作
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请至少选择一条记录");
    return;
  }

  ElMessageBox.confirm(
    `确认删除选中的${selectedIds.value.length}条数据吗？`,
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
        const response: any = await batchDeleteMetaTable(selectedIds.value);
        if (response.data.code === 200) {
          ElMessage.success("批量删除成功");
          getList();
        } else {
          ElMessage.error(response.data.message || "批量删除失败");
        }
      } catch (error: any) {
        console.error("批量删除元数据表定义失败:", error);
        ElMessage.error(error.message || "批量删除失败");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 提交表单
const submitForm = async () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;

        const response: any = form.id
          ? await updateMetaTable(form.id, form as MetaTableForm)
          : await addMetaTable(form as MetaTableForm);

        if (response.data.code === 200) {
          ElMessage.success(form.id ? "修改成功" : "新增成功");
          dialog.visible = false;
          getList();
        } else {
          ElMessage.error(
            response.data.message || (form.id ? "修改失败" : "新增失败"),
          );
        }
      } catch (error: any) {
        console.error(
          form.id ? "修改元数据表定义失败:" : "新增元数据表定义失败:",
          error,
        );
        ElMessage.error(error.message || (form.id ? "修改失败" : "新增失败"));
      } finally {
        loading.value = false;
      }
    }
  });
};

// 获取状态标签类型
const getStatusTagType = (
  status: string,
): "success" | "warning" | "info" | "danger" | "primary" => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "DRAFT":
      return "info";
    case "INACTIVE":
      return "danger";
    default:
      return "info";
  }
};

// 获取状态标签文本
const getStatusLabel = (status: string) => {
  const option = statusOptions.value.find((item) => item.value === status);
  return option ? option.label : status;
};

// 每页数量变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

// 页码变化
const handleCurrentChange = (current: number) => {
  queryParams.pageNum = current;
  getList();
};

// 单元格合并方法
const objectSpanMethod = ({ rowIndex, columnIndex }: any) => {
  // 数据子集列合并
  if (columnIndex === 2) {
    if (
      rowIndex > 0 &&
      tableList.value[rowIndex].subsetCode ===
        tableList.value[rowIndex - 1].subsetCode
    ) {
      return {
        rowspan: 0,
        colspan: 0,
      };
    } else {
      // 计算当前数据子集的行数
      let count = 1;
      for (let i = rowIndex + 1; i < tableList.value.length; i++) {
        if (
          tableList.value[i].subsetCode === tableList.value[rowIndex].subsetCode
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

  // 数据类列合并
  if (columnIndex === 3) {
    if (
      rowIndex > 0 &&
      tableList.value[rowIndex].catalogCode ===
        tableList.value[rowIndex - 1].catalogCode &&
      tableList.value[rowIndex].subsetCode ===
        tableList.value[rowIndex - 1].subsetCode
    ) {
      return {
        rowspan: 0,
        colspan: 0,
      };
    } else {
      // 计算当前数据类的行数
      let count = 1;
      for (let i = rowIndex + 1; i < tableList.value.length; i++) {
        if (
          tableList.value[i].catalogCode ===
            tableList.value[rowIndex].catalogCode &&
          tableList.value[i].subsetCode === tableList.value[rowIndex].subsetCode
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
};

// 处理显示表头定义数据
const handleShowHeaders = async (row: any) => {
  headerDialog.visible = true;
  headerDialog.title = `${row.tableChineseName} - 表头定义数据`;
  headerDialog.tableId = row.id;
  headerDialog.tableName = row.tableChineseName;
  headerDialog.loading = true;
  headerList.value = [];

  try {
    const response: any = await getTableHeaders(row.id);
    if (response.data.code === 200) {
      headerList.value = response.data.data || [];
    } else {
      ElMessage.error(response.data.message || "获取表头定义数据失败");
    }
  } catch (error: any) {
    console.error("获取表头定义数据失败:", error);
    ElMessage.error(error.message || "获取表头定义数据失败");
  } finally {
    headerDialog.loading = false;
  }
};

// 行双击操作
const handleRowDblClick = (row: any) => {
  // 双击查看详情
  handleView(row);
};

// 调整表格高度
const resizeTable = () => {
  nextTick(() => {
    tableMaxHeight.value = `calc(75vh - 90px)`;
  });
};

// 监听窗口大小变化
const handleResize = () => {
  resizeTable();
};

// 处理排序变化
const handleSortChange = (column: { prop: string; order: string | null }) => {
  // 仅用于客户端排序，不需要向后端发送请求
  console.log("排序变化:", column);
};

// 数字排序方法
const sortByNumber = (a: any, b: any) => {
  // 提取数字部分
  const numA = parseFloat(a.tableVersion.replace(/[^\d.]/g, "")) || 0;
  const numB = parseFloat(b.tableVersion.replace(/[^\d.]/g, "")) || 0;
  return numA - numB;
};

onMounted(() => {
  getList();
  resizeTable();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped lang="scss">
.meta-table-management {
  padding: 0px;

  .search-card {
    margin-bottom: 1px;

    :deep(.el-card__body) {
      padding: 2px 7px;
    }

    .search-bar {
      .form-row {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 5px;

        &:last-child {
          margin-bottom: 0;
        }

        .button-container {
          display: flex;
          align-items: flex-end;
          margin-bottom: 5px;
          padding-left: 15px;

          .el-button {
            margin-right: 10px;

            &:last-child {
              margin-right: 0;
            }
          }

          @media screen and (max-width: 1400px) {
            padding-left: 0;
            margin-left: 15px;
          }

          @media screen and (max-width: 1100px) {
            width: 100%;
            justify-content: flex-start;
            margin-left: 0;
            padding-left: 0;
          }
        }
      }

      :deep(.el-form-item) {
        margin-bottom: 5px;
        margin-right: 15px;
        width: calc(25% - 15px);

        @media screen and (max-width: 1400px) {
          width: calc(33.33% - 15px);
        }

        @media screen and (max-width: 1100px) {
          width: calc(50% - 15px);
        }

        .el-input__wrapper,
        .el-select {
          width: 100%;
        }
      }
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 100%;
      font-size: 13px;
    }

    :deep(.el-button) {
      font-size: 13px;
      padding: 6px 10px;
    }
  }

  .table-card {
    margin-top: 1px;
    margin-bottom: 5px;
    :deep(.el-card__body) {
      padding: 5px 15px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
      position: relative;

      .left-actions {
        display: flex;
        align-items: center;

        .el-button {
          margin-right: 10px;
        }
      }

      .table-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
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

  .meta-header-dialog {
    :deep(.el-dialog__body) {
      padding: 10px 20px;
    }

    .empty-data {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }
  }
}

:deep(.meta-table-dialog) {
  .divider-title {
    font-size: 15px;
    font-weight: 600;
  }
  .el-divider {
    margin: 0 0 15px 0;
  }

  :deep(.el-form-item) {
    margin-bottom: 10px;
  }

  :deep(.el-form-item__label) {
    padding-right: 8px;
    line-height: 32px;
  }

  :deep(.el-form-item__content) {
    line-height: 32px;
  }
}
</style>
