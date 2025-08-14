<template>
  <div class="operation-log">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <div class="search-item">
          <span class="label">操作人员</span>
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名或姓名"
            clearable
            style="width: 180px"
          />
        </div>
        <div class="search-item">
          <span class="label">操作模块</span>
          <el-select
            v-model="searchForm.operationModule"
            placeholder="请选择模块"
            clearable
            style="width: 150px"
          >
            <el-option label="用户管理" value="用户管理" />
            <el-option label="角色管理" value="角色管理" />
            <el-option label="菜单管理" value="菜单管理" />
            <el-option label="系统监控" value="系统监控" />
          </el-select>
        </div>
        <div class="search-item">
          <span class="label">操作类型</span>
          <el-select
            v-model="searchForm.operationType"
            placeholder="请选择类型"
            clearable
            style="width: 120px"
          >
            <el-option label="新增" value="新增" />
            <el-option label="修改" value="修改" />
            <el-option label="删除" value="删除" />
            <el-option label="查询" value="查询" />
          </el-select>
        </div>
        <div class="search-item">
          <span class="label">操作结果</span>
          <el-select
            v-model="searchForm.operationResult"
            placeholder="请选择结果"
            clearable
            style="width: 120px"
          >
            <el-option label="成功" :value="1" />
            <el-option label="失败" :value="0" />
          </el-select>
        </div>
        <div class="search-item">
          <span class="label">操作时间</span>
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 350px"
          />
        </div>
        <div class="search-buttons">
          <el-button type="primary" @click="handleSearch" :icon="Search"
            >搜索</el-button
          >
          <el-button @click="handleReset" :icon="Refresh">重置</el-button>
          <el-button type="danger" @click="handleCleanLogs" :icon="Delete"
            >清理日志</el-button
          >
        </div>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" style="height: 68vh" shadow="never">
      <div class="table-header">
        <div class="header-title">操作日志</div>
      </div>

      <div class="table-body">
        <el-table
          :data="tableData"
          :loading="loading"
          :height="'calc(68vh - 120px)'"
          stripe
          border
          style="width: 100%"
        >
          <!-- 序号列 -->
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
            :index="getRowIndex"
          />
          <el-table-column
            prop="realName"
            label="操作人员"
            width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="operationModule"
            label="操作模块"
            width="100"
          />
          <el-table-column
            prop="operationType"
            label="操作类型"
            width="80"
            align="center"
          >
            <template #default="{ row }">
              <el-tag
                :type="getOperationTypeTag(row.operationType) as any"
                size="small"
              >
                {{ row.operationType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="operationDesc"
            label="操作内容"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="operationTime"
            label="操作时间"
            width="160"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ formatDate(row.operationTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="executionTime"
            label="耗时(ms)"
            width="80"
            align="center"
          />
          <el-table-column
            prop="ipAddress"
            label="IP地址"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="operationResult"
            label="操作结果"
            width="80"
            align="center"
          >
            <template #default="{ row }">
              <el-tag
                :type="row.operationResult === 1 ? 'success' : 'danger'"
                size="small"
              >
                {{ row.operationResult === 1 ? "成功" : "失败" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center" fixed="right">
            <template #default="{ row }">
              <el-button
                size="small"
                type="primary"
                link
                @click="showDetail(row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[20, 50, 100, 200]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="操作日志详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="detail-content" v-if="currentLog">
        <el-descriptions :column="2" border>
          <el-descriptions-item width="20px" label="操作人员">
            {{ currentLog.realName }}（{{ currentLog.username }}）
          </el-descriptions-item>
          <el-descriptions-item width="80px" label="操作模块">
            {{ currentLog.operationModule }}
          </el-descriptions-item>
          <el-descriptions-item label="操作类型">
            <el-tag
              :type="getOperationTypeTag(currentLog.operationType) as any"
              size="small"
            >
              {{ currentLog.operationType }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="操作结果">
            <el-tag
              :type="currentLog.operationResult === 1 ? 'success' : 'danger'"
              size="small"
            >
              {{ currentLog.operationResult === 1 ? "成功" : "失败" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="操作时间">
            {{ formatDate(currentLog.operationTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="执行耗时">
            {{ currentLog.executionTime }}ms
          </el-descriptions-item>
          <el-descriptions-item label="客户端IP">
            {{ currentLog.ipAddress }}
          </el-descriptions-item>
          <el-descriptions-item label="用户代理" :span="2">
            <div class="user-agent">{{ currentLog.userAgent }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="操作描述" :span="2">
            {{ currentLog.operationDesc }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 请求参数 -->
        <div class="detail-section" v-if="currentLog.requestParams">
          <h4>请求参数</h4>
          <el-input
            type="textarea"
            :rows="6"
            :value="formatJson(currentLog.requestParams)"
            readonly
          />
        </div>

        <!-- 响应结果 -->
        <div class="detail-section" v-if="currentLog.responseResult">
          <h4>响应结果</h4>
          <el-input
            type="textarea"
            :rows="6"
            :value="formatJson(currentLog.responseResult)"
            readonly
          />
        </div>

        <!-- 错误信息 -->
        <div class="detail-section" v-if="currentLog.errorMsg">
          <h4>错误信息</h4>
          <el-alert
            :title="currentLog.errorMsg"
            type="error"
            :closable="false"
            show-icon
          />
        </div>
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 清理日志弹窗 -->
    <el-dialog
      v-model="cleanVisible"
      title="清理历史日志"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="clean-content">
        <el-alert
          title="注意：此操作将永久删除历史日志，请谨慎操作！"
          type="warning"
          :closable="false"
          show-icon
        />
        <div style="margin-top: 20px">
          <span>保留最近</span>
          <el-input-number
            v-model="cleanDays"
            :min="1"
            :max="365"
            style="margin: 0 10px; width: 120px"
          />
          <span>天的日志</span>
        </div>
      </div>

      <template #footer>
        <el-button @click="cleanVisible = false">取消</el-button>
        <el-button
          type="danger"
          @click="confirmCleanLogs"
          :loading="cleanLoading"
        >
          确定清理
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh, Delete } from "@element-plus/icons-vue";
import { operationLogApi } from "@/api/operation-log";

// 响应式数据
const loading = ref(false);
const cleanLoading = ref(false);
const detailVisible = ref(false);
const cleanVisible = ref(false);
const tableData = ref<any[]>([]);
const currentLog = ref<any>(null);
const dateRange = ref<string[]>([]);
const cleanDays = ref(30);

// 搜索表单
const searchForm = reactive({
  username: "",
  operationModule: "",
  operationType: "",
  operationResult: undefined as number | undefined,
});

// 分页信息
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0,
});

// 工具方法
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return dateString.replace("T", " ");
};

const formatJson = (jsonString: string) => {
  try {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return jsonString;
  }
};

const getOperationTypeTag = (
  type: string,
): "success" | "warning" | "danger" | "info" | "primary" => {
  const typeMap: Record<
    string,
    "success" | "warning" | "danger" | "info" | "primary"
  > = {
    新增: "success",
    修改: "warning",
    删除: "danger",
    查询: "info",
  };
  return typeMap[type] || "primary";
};

// 获取序号
const getRowIndex = (index: number) => {
  return (pagination.current - 1) * pagination.size + index + 1;
};

// API方法
const loadLogList = async () => {
  loading.value = true;
  try {
    const params = {
      current: pagination.current,
      size: pagination.size,
      username: searchForm.username,
      operationModule: searchForm.operationModule,
      operationType: searchForm.operationType,
      operationResult: searchForm.operationResult,
      startTime:
        dateRange.value && dateRange.value.length > 0 ? dateRange.value[0] : "",
      endTime:
        dateRange.value && dateRange.value.length > 1 ? dateRange.value[1] : "",
    };

    const result = await operationLogApi.getLogPage(params);
    tableData.value = result.records;
    pagination.total = result.total;
  } catch (error) {
    ElMessage.error("获取操作日志失败");
  } finally {
    loading.value = false;
  }
};

// 事件处理方法
const handleSearch = () => {
  pagination.current = 1;
  loadLogList();
};

const handleReset = () => {
  Object.assign(searchForm, {
    username: "",
    operationModule: "",
    operationType: "",
    operationResult: undefined,
  });
  dateRange.value = [];
  pagination.current = 1;
  loadLogList();
};

const handleSizeChange = (size: number) => {
  pagination.size = size;
  loadLogList();
};

const handleCurrentChange = (current: number) => {
  pagination.current = current;
  loadLogList();
};

const showDetail = (row: any) => {
  currentLog.value = row;
  detailVisible.value = true;
};

const handleCleanLogs = () => {
  cleanVisible.value = true;
};

const confirmCleanLogs = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要清理${cleanDays.value}天前的操作日志吗？此操作不可恢复！`,
      "确认清理",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    cleanLoading.value = true;
    const result = await operationLogApi.cleanOldLogs(cleanDays.value);
    ElMessage.success(`成功清理${result}条历史日志`);
    cleanVisible.value = false;
    loadLogList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("清理日志失败");
    }
  } finally {
    cleanLoading.value = false;
  }
};

// 生命周期
onMounted(() => {
  loadLogList();
});
</script>

<style scoped lang="scss">
.operation-log {
  padding: 0px;
  color: var(--el-text-color-primary);

  .search-card,
  .table-card {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    background-color: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);

    :deep(.el-card__body) {
      background-color: var(--el-bg-color);
    }
  }

  .table-card {
    :deep(.el-card__body) {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 15px;
      background-color: var(--el-bg-color);
    }
  }

  .table-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 0 16px 0;
    border-bottom: 1px solid var(--el-border-color-light);
    margin-bottom: 16px;
  }

  .header-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .table-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: auto;
    min-height: 0;

    :deep(.el-table) {
      height: 100%;
      background-color: var(--el-table-bg-color);

      .el-table__header-wrapper {
        th.el-table__cell {
          background-color: var(--el-table-header-bg-color) !important;
          color: var(--el-table-header-text-color) !important;
          .cell {
            text-align: center !important;
            font-weight: 600;
          }
        }
      }

      .el-table__row {
        background-color: var(--el-table-tr-bg-color);

        td.el-table__cell {
          background-color: var(--el-table-tr-bg-color);
          color: var(--el-text-color-regular);
          border-bottom: 1px solid var(--el-border-color-lighter);
        }

        &:hover td {
          background-color: var(--el-table-row-hover-bg-color) !important;
        }
      }
    }
  }

  .search-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .search-item {
    display: flex;
    align-items: center;

    .label {
      margin-right: 8px;
      white-space: nowrap;
      font-size: 14px;
      color: var(--el-text-color-regular);
    }
  }

  .search-buttons {
    display: flex;
    gap: 10px;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    background-color: var(--el-bg-color);
  }

  .detail-content {
    .user-agent {
      word-break: break-all;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    .detail-section {
      margin-top: 20px;

      h4 {
        margin: 0 0 10px 0;
        color: var(--el-text-color-primary);
        font-size: 14px;
        font-weight: 600;
      }
    }
  }

  .clean-content {
    text-align: center;

    .el-alert {
      margin-bottom: 20px;
    }
  }
}
</style>
