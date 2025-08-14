<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card>
        <div class="flex items-center">
          <el-date-picker
            v-model="queryParams.queryDate"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 220px; margin-right: 10px"
            @change="handleDateChange"
          />
          <!-- <el-select
            v-model="queryParams.deptId"
            placeholder="选择部门"
            clearable
            style="width: 220px; margin-right: 10px"
            @change="handleDeptChange"
          >
            <el-option
              v-for="dept in deptOptions"
              :key="dept.id"
              :label="dept.deptName"
              :value="dept.id"
            />
          </el-select> -->
          <el-button type="primary" @click="loadDailyReportTables">
            <el-icon><Search /></el-icon>查询
          </el-button>
        </div>
      </el-card>
    </div>

    <el-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold">{{ currentDate }} 需上报数据表</span>
          <div>
            <el-button type="success" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>刷新
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
        height="calc(85vh - 200px)"
        row-key="tableId"
      >
        <el-table-column type="index" label="#" width="50" />
      
        <el-table-column
          prop="deptName"
          label="所属部门"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="subsetCode"
          label="表编码"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="subsetName"
          label="数据子集"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="tableName"
          label="数据表英文名"
          min-width="150"
          show-overflow-tooltip
        />
     
   
         
        <el-table-column
          prop="subcatalogName"
          label="数据子类"
          min-width="150"
          show-overflow-tooltip
        />
      
        <el-table-column
          prop="tableReportFrequency"
          label="上报频率"
          width="100"
          align="center"
        />
        <el-table-column
          prop="reportDate"
          label="采集日期"
          width="120"
          align="center"
        />
        <el-table-column label="上报状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.reportStatus === 1 ? 'success' : 'danger'">
              {{ row.reportStatus === 1 ? "已上报" : "未上报" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button
                type="primary"
                link
                size="small"
                @click="handleEdit(row)"
                class="action-btn"
              >
                {{ row.reportStatus === 1 ? "查看" : "上报" }}
              </el-button>
              <el-divider direction="vertical" />
              <el-button
                type="success"
                link
                size="small"
                @click="handleEditData(row)"
                class="action-btn"
              >
                编辑
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Search, Refresh } from "@element-plus/icons-vue";
import { workingDayApi, type WorkingDayVO } from "@/api/working/workingDay";
import { useRouter } from "vue-router";

// 响应式数据
const loading = ref(false);
const tableData = ref<WorkingDayVO[]>([]);
const router = useRouter();

// 查询参数
const queryParams = reactive({
  queryDate: new Date().toISOString().split("T")[0], // 当前日期，格式：YYYY-MM-DD
  deptId: undefined as number | undefined,
});

// 计算属性
const currentDate = computed(() => {
  return formatDate(
    queryParams.queryDate || new Date().toISOString().split("T")[0],
  );
});

// 方法
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function handleDateChange() {
  loadDailyReportTables();
}



function handleRefresh() {
  loadDailyReportTables();
}

function handleEdit(row: WorkingDayVO) {
  // 调用上报接口，传递表编码和数据表英文名
  submitReport(row);
}

function handleEditData(row: WorkingDayVO) {
  // 跳转到数据管理页面
  const path = `/data/data_manage/${row.subsetCode.toLowerCase()}/${row.tableName.toLowerCase()}`;
  router.push(path);
}

async function submitReport(row: WorkingDayVO) {
  try {
    const res = await workingDayApi.submitReport({
      tableId: row.tableId,
      tableName: row.tableName,
      subsetCode: row.subsetCode,
      deptId: row.deptId,
      reportDate: queryParams.queryDate
    });
    
    if (res.data && res.data.code === 200) {
      ElMessage.success("数据迁移成功");
      // 跳转到Report页面
      router.push({
        name: "WorkingDayReport",
        query: {
          tableId: row.tableId.toString(),
          tableName: row.tableName,
          deptName: row.deptName,
          subsetName: row.subsetName,
          tableReportFrequency: row.tableReportFrequency,
          reportStatus: row.reportStatus,
          catalogName: row.catalogName,
          subcatalogName: row.subcatalogName,
          subsetCode: row.subsetCode,
          deptId: row.deptId.toString(),
          reportDate: queryParams.queryDate
        },
      });
    } else {
      ElMessage.error((res.data && res.data.message) || "上报失败");
    }
  } catch (error: any) {
    ElMessage.error(error.message || "上报失败");
  }
}

async function loadDailyReportTables() {
  loading.value = true;
  try {
    const res = await workingDayApi.getUserDailyReportTables(queryParams);
    if (res.data && res.data.code === 200) {
      tableData.value = res.data.data || [];
      if (tableData.value.length === 0) {
        ElMessage.info("当前没有需要上报的数据表");
      }
    } else {
      ElMessage.error((res.data && res.data.message) || "获取数据失败");
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取数据失败");
  } finally {
    loading.value = false;
  }
}


// 生命周期钩子
onMounted(() => {
  loadDailyReportTables();
});
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.mt-4 {
  margin-top: 16px;
}

.text-lg {
  font-size: 18px;
}

.font-bold {
  font-weight: bold;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: rgba(64, 158, 255, 0.1);
  transform: translateY(-1px);
}

.action-btn.el-button--success:hover {
  background-color: rgba(103, 194, 58, 0.1);
}

/* 分隔线样式 */
:deep(.el-divider--vertical) {
  margin: 0 4px;
  height: 16px;
  background-color: #dcdfe6;
}
</style>
