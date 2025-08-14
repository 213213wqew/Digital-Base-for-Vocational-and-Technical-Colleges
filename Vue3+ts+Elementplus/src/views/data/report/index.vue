<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-container">
        <div class="search-header">
          <div class="search-title">
            <el-icon class="search-icon"><Search /></el-icon>
            <span>搜索条件</span>
          </div>
          <div class="search-actions">
            <el-button type="primary" @click="handleQuery" size="default">
              <el-icon><Search /></el-icon>搜索
            </el-button>
            <el-button @click="resetQuery" size="default">
              <el-icon><Refresh /></el-icon>重置
            </el-button>
          </div>
        </div>
        <div class="search-form">
          <el-form :model="queryParams" ref="queryForm" :inline="true" class="search-form-content">
            <div class="form-row">
              <el-form-item label="表编码" prop="tableCode">
                <el-input
                  v-model="queryParams.tableCode"
                  placeholder="请输入表编码"
                  clearable
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
              <el-form-item label="表中文名" prop="tableName">
                <el-input
                  v-model="queryParams.tableName"
                  placeholder="请输入表中文名"
                  clearable
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
              <el-form-item label="部门名称" prop="deptName">
                <el-input
                  v-model="queryParams.deptName"
                  placeholder="请输入部门名称"
                  clearable
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="上报用户" prop="username">
                <el-input
                  v-model="queryParams.username"
                  placeholder="请输入上报用户"
                  clearable
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
              <el-form-item label="上报状态" prop="reportStatus">
                <el-select
                  v-model="queryParams.reportStatus"
                  placeholder="请选择上报状态"
                  clearable
                >
                  <el-option label="已上报" :value="1" />
                  <el-option label="未上报" :value="0" />
                </el-select>
              </el-form-item>
              <el-form-item label="采集日期" prop="reportDateRange">
                <el-date-picker
                  v-model="reportDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="table-title">
          <el-icon class="title-icon"><Document /></el-icon>
          <span>上报记录管理</span>
        </div>
        <div class="table-actions">
          <div class="operation-buttons">
            <el-button type="warning" @click="handleExport" :icon="Download" size="default">导出</el-button>
            <el-button type="success" @click="handleStatistics" :icon="DataAnalysis" size="default">统计</el-button>
          </div>
          <div class="refresh-button">
            <el-tooltip content="刷新数据" placement="top">
              <el-button circle @click="getList" :icon="Refresh" size="default" />
            </el-tooltip>
          </div>
        </div>
      </div>

      <div class="table-body">
        <el-table
          v-loading="loading"
          :data="dataList"
          border
          style="width: 100%"
          highlight-current-row
          @row-click="handleRowClick"
          @row-dblclick="handleRowDblClick"
          :height="'calc(75vh - 280px)'"
          stripe
          size="default"
          :row-style="{ height: '48px' }"
          :cell-style="{ padding: '8px 12px' }"
          class="custom-table"
        >
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="tableCode"
            label="表编码"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="tableName"
            label="表中文名"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="deptName"
            label="部门名称"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="username"
            label="上报用户"
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="subsetName"
            label="数据子集"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="catalogName"
            label="数据类"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="subcatalogName"
            label="数据子类"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="reportFrequency"
            label="上报频率"
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="reportDate"
            label="采集日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="reportTime"
            label="上报时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
                size="small"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column
            label="操作"
            width="200"
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
                  class="action-btn"
                >
                  <el-icon><View /></el-icon>查看
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页组件 -->
      <div class="pagination-wrapper">
        <div class="pagination-info">
          <span class="total-info">共 {{ total }} 条记录</span>
          <span class="page-info">第 {{ queryParams.pageNum }} 页，每页 {{ queryParams.pageSize }} 条</span>
        </div>
        <div class="pagination-controls">
          <el-pagination
            v-model:current-page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[20, 50, 100, 200, 500]"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            class="custom-pagination"
          />
        </div>
      </div>
    </el-card>

    <!-- 查看对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="查看上报记录"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleFormClose"
    >
      <!-- 查看模式 -->
      <div class="report-record-detail">
        <el-descriptions
          class="detail-descriptions"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item label="数据表ID">
            <div class="detail-value">{{ form.tableId || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="表编码">
            <div class="detail-value">{{ form.tableCode || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="表中文名">
            <div class="detail-value">{{ form.tableName || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="部门ID">
            <div class="detail-value">{{ form.deptId || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="部门名称">
            <div class="detail-value">{{ form.deptName || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上报用户ID">
            <div class="detail-value">{{ form.userId || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="用户姓名">
            <div class="detail-value">{{ form.username || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据子集编码">
            <div class="detail-value">{{ form.subsetCode || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据子集名称">
            <div class="detail-value">{{ form.subsetName || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据类编码">
            <div class="detail-value">{{ form.catalogCode || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据类名称">
            <div class="detail-value">{{ form.catalogName || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据子类编码">
            <div class="detail-value">{{ form.subcatalogCode || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据子类名称">
            <div class="detail-value">{{ form.subcatalogName || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上报频率">
            <div class="detail-value">{{ form.reportFrequency || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="采集日期">
            <div class="detail-value">{{ form.reportDate || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上报时间">
            <div class="detail-value">{{ form.reportTime || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusTagType(form.reportStatus)"
              size="small"
            >
              {{ getReportStatusText(form.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            <div class="detail-value">{{ form.remark || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <div class="detail-value">{{ form.createTime || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <div class="detail-value">{{ form.updateTime || "-" }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 统计对话框 -->
    <el-dialog
      v-model="statisticsDialogVisible"
      title="上报统计"
      width="1200px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
    >
      <ReportStatistics />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance } from "element-plus";
import {
  Search,
  Refresh,
  View,
  Download,
  DataAnalysis,
  Document,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  reportRecordApi,
  type ReportRecordInfo,
  type ReportRecordQuery,
  type ReportRecordForm,
} from "@/api-data/data/report/reportRecord";

// 导入统计组件
import ReportStatistics from "./components/ReportStatistics.vue";

// 搜索条件
const queryParams = reactive<ReportRecordQuery>({
  tableCode: "",
  tableName: "",
  deptId: undefined,
  deptName: "",
  userId: "",
  username: "",
  subsetCode: "",
  subsetName: "",
  catalogCode: "",
  catalogName: "",
  subcatalogCode: "",
  subcatalogName: "",
  reportFrequency: "",
  reportStatus: undefined,
  reportDateStart: "",
  reportDateEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 采集日期范围
const reportDateRange = ref<[string, string] | null>(null);

// 响应式数据
const loading = ref(false);
const dataList = ref<ReportRecordInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();
const statisticsDialogVisible = ref(false);

// 表单对象
const form = reactive<ReportRecordForm>({
  tableId: 0,
  tableCode: "",
  tableName: "",
  deptId: 0,
  deptName: "",
  userId: "",
  username: "",
  subsetCode: "",
  subsetName: "",
  catalogCode: "",
  catalogName: "",
  subcatalogCode: "",
  subcatalogName: "",
  reportFrequency: "",
  reportDate: "",
  reportTime: "",
  reportStatus: 1,
  remark: "",
});



// 监听采集日期范围变化
const handleReportDateRangeChange = () => {
  if (reportDateRange.value) {
    queryParams.reportDateStart = reportDateRange.value[0];
    queryParams.reportDateEnd = reportDateRange.value[1];
  } else {
    queryParams.reportDateStart = "";
    queryParams.reportDateEnd = "";
  }
};

// 获取上报状态文本
const getReportStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "未上报";
    case 1:
      return "已上报";
    case 2:
      return "上报失败";
    default:
      return "未知";
  }
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: number) => {
  switch (status) {
    case 0:
      return "info";
    case 1:
      return "success";
    case 2:
      return "danger";
    default:
      return "warning";
  }
};

// 关闭表单对话框
const handleFormClose = () => {
  dialogVisible.value = false;
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await reportRecordApi.getReportRecordPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.message || "查询失败");
    }
  } catch (error) {
    console.error("查询上报记录失败:", error);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleQuery = () => {
  handleReportDateRangeChange();
  queryParams.pageNum = 1;
  getList();
};

// 重置搜索
const resetQuery = () => {
  Object.assign(queryParams, {
    tableCode: "",
    tableName: "",
    deptId: undefined,
    deptName: "",
    userId: "",
    username: "",
    subsetCode: "",
    subsetName: "",
    catalogCode: "",
    catalogName: "",
    subcatalogCode: "",
    subcatalogName: "",
    reportFrequency: "",
    reportStatus: undefined,
    reportDateStart: "",
    reportDateEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  reportDateRange.value = null;
  getList();
};

// 分页变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 行点击
const handleRowClick = (row: ReportRecordInfo) => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: ReportRecordInfo) => {
  handleView(row);
};

// 查看详情
const handleView = async (row: ReportRecordInfo) => {
  try {
    const response = await reportRecordApi.getReportRecordById(row.id!);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取上报记录失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("开始导出，请稍候...");
    // TODO: 实现导出功能
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出上报记录失败:", error);
    ElMessage.error("导出失败");
  }
};

// 统计
const handleStatistics = () => {
  statisticsDialogVisible.value = true;
};

// 页面加载时获取数据
onMounted(() => {
  getList();
});
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.search-card {
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.search-container {
  padding: 20px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.search-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.search-icon {
  margin-right: 8px;
  color: #409eff;
  font-size: 18px;
}

.search-actions {
  display: flex;
  gap: 12px;
}

.search-form {
  padding: 0;
}

.search-form-content {
  margin: 0;
}

.form-row {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.form-row:last-child {
  margin-bottom: 0;
}

:deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 0;
  flex: 1;
  min-width: 200px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  padding-right: 12px;
}

:deep(.el-form-item__content) {
  display: flex;
  align-items: center;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-date-editor .el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-button) {
  height: 36px;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.table-card {
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: visible;
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 20px 0;
}

.table-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.title-icon {
  margin-right: 8px;
  color: #409eff;
  font-size: 20px;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.operation-buttons {
  display: flex;
  gap: 12px;
}

.refresh-button {
  margin-left: 8px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

:deep(.action-btn) {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

:deep(.action-btn:hover) {
  background-color: #f5f7fa;
  transform: translateY(-1px);
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  background-color: #fafafa;
  border-top: 1px solid #f0f0f0;
  border-radius: 0 0 8px 8px;
  min-height: 80px;
  box-sizing: border-box;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.total-info {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

.page-info {
  color: #909399;
  font-size: 12px;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

:deep(.custom-pagination) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.custom-pagination .el-pagination__sizes) {
  margin-right: 16px;
  min-width: 120px;
}

:deep(.custom-pagination .el-pagination__total) {
  margin-right: 16px;
}

:deep(.custom-pagination .el-pager) {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.custom-pagination .el-pager li) {
  border-radius: 4px;
  margin: 0 2px;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
}

:deep(.custom-pagination .el-pager li.is-active) {
  background-color: #409eff;
  color: white;
}

:deep(.custom-pagination .el-pagination__jump) {
  margin-left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.custom-pagination .el-pagination__jump .el-input) {
  width: 60px;
  margin: 0 8px;
}

:deep(.custom-pagination .el-pagination__jump .el-input__wrapper) {
  padding: 0 8px;
}

:deep(.custom-table .el-table__header) {
  background-color: #fafafa;
}

:deep(.custom-table .el-table__header th) {
  background-color: #fafafa;
  color: #303133;
  font-weight: 600;
  border-bottom: 1px solid #ebeef5;
}

:deep(.custom-table .el-table__body tr:hover > td) {
  background-color: #f5f7fa !important;
}

:deep(.custom-table .el-table__body td) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.custom-table .el-table__row) {
  transition: all 0.3s ease;
}

:deep(.custom-table .el-table__row:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.report-record-detail {
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
  
  :deep(.el-form-item) {
    min-width: 100%;
  }
  
  .search-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .table-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .operation-buttons {
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .app-container {
    padding: 12px;
  }
  
  .search-container {
    padding: 16px;
  }
  
  .table-header {
    padding: 16px 16px 0;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    padding: 6px;
    min-height: 50px;
  }
  
  .pagination-controls {
    width: 100%;
    justify-content: center;
  }
  
  :deep(.custom-pagination) {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  :deep(.custom-pagination .el-pagination__sizes) {
    margin-right: 8px;
    min-width: 100px;
  }
  
  :deep(.custom-pagination .el-pagination__jump) {
    margin-left: 8px;
  }
  
  :deep(.custom-pagination .el-pagination__jump .el-input) {
    width: 50px;
    margin: 0 4px;
  }
}

/* 动画效果 */
.search-card,
.table-card {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载状态优化 */
:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
}

:deep(.el-loading-spinner) {
  color: #409eff;
}
</style> 