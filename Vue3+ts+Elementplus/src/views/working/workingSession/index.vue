<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card>
        <div class="flex items-center">
          <el-select
            v-model="queryParams.academicYear"
            placeholder="选择学年"
            style="width: 150px; margin-right: 10px"
            @change="handleYearChange"
          >
            <el-option
              v-for="year in academicYearOptions"
              :key="year"
              :label="`${year}-${year + 1}学年`"
              :value="year"
            />
          </el-select>
          <el-select
            v-model="queryParams.session"
            placeholder="选择学期"
            style="width: 120px; margin-right: 10px"
            @change="handleSessionChange"
          >
            <el-option
              v-for="item in sessionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
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
          </el-select>
          <el-button type="primary" @click="loadSessionReportTables">
            <el-icon><Search /></el-icon>查询
          </el-button>
        </div>
      </el-card>
    </div>

    <el-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold">{{ sessionText }} 需上报数据表</span>
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
          label="数据子集编码"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="subsetName"
          label="数据子集名称"
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
          prop="tableChineseName"
          label="数据表中文名"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="catalogName"
          label="数据类"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="subcatalogName"
          label="数据子类"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="subcatalogCode"
          label="表编码"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column label="上报学期" width="160" align="center">
          <template #default="{ row }">
            {{
              `${row.academicYear}-${row.academicYear + 1}学年 ${row.session === 1 ? "春季" : "秋季"}学期`
            }}
          </template>
        </el-table-column>
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
import {
  workingSessionApi,
  type WorkingSessionVO,
} from "@/api/working/workingSession";
import { useRouter } from "vue-router";

// 响应式数据
const loading = ref(false);
const tableData = ref<WorkingSessionVO[]>([]);
const deptOptions = ref<any[]>([]); // 实际项目中应该定义正确的类型
const router = useRouter();

// 获取当前年份，用于生成学年选项
const currentYear = new Date().getFullYear();
const academicYearOptions = ref<number[]>([
  currentYear - 2,
  currentYear - 1,
  currentYear,
]);

// 学期选项
const sessionOptions = [
  { label: "春季学期", value: 1 },
  { label: "秋季学期", value: 2 },
];

// 查询参数
const queryParams = reactive({
  queryDate: new Date().toISOString().split("T")[0], // 当前日期，格式：YYYY-MM-DD
  deptId: undefined as number | undefined,
  academicYear: currentYear, // 默认当前年份
  session: determineCurrentSession(), // 根据当前月份确定学期
});

// 根据当前月份确定学期 (3-8月为春季学期, 9-次年2月为秋季学期)
function determineCurrentSession(): number {
  const currentMonth = new Date().getMonth() + 1; // 月份是从0开始的，所以需要+1
  return currentMonth >= 3 && currentMonth <= 8 ? 1 : 2;
}

// 计算属性
const sessionText = computed(() => {
  if (!tableData.value.length) return "当前学期";

  const firstRow = tableData.value[0];
  if (firstRow.academicYear && firstRow.session) {
    return `${firstRow.academicYear}-${firstRow.academicYear + 1}学年 ${firstRow.session === 1 ? "春季" : "秋季"}学期`;
  }

  return "当前学期";
});

// 方法
function handleYearChange() {
  loadSessionReportTables();
}

function handleSessionChange() {
  loadSessionReportTables();
}

function handleDeptChange() {
  loadSessionReportTables();
}

function handleRefresh() {
  loadSessionReportTables();
}

function handleEdit(row: WorkingSessionVO) {
  // 调用上报接口，传递表编码和数据表英文名
  submitReport(row);
}

function handleEditData(row: WorkingSessionVO) {
  // 跳转到数据管理页面
  const path = `/data/data_manage/${row.subsetCode.toLowerCase()}/${row.tableName.toLowerCase()}`;
  router.push(path);
}

async function submitReport(row: WorkingSessionVO) {
  try {
    const res = await workingSessionApi.submitReport({
      tableId: row.tableId,
      tableName: row.tableName,
      subsetCode: row.subsetCode,
      deptId: row.deptId,
      reportDate: queryParams.queryDate,
      metaBaseTableName: `meta_base_${row.subsetCode}_${row.tableName}`
    });
    
    if (res.data && res.data.code === 200) {
      ElMessage.success("数据迁移成功");
      // 跳转到Report页面
      router.push({
        name: "WorkingSessionReport", // 使用统一的Report页面
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

async function loadSessionReportTables() {
  loading.value = true;
  try {
    const res = await workingSessionApi.getUserSessionReportTables(queryParams);
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

async function loadUserDepts() {
  // 实际项目中应该调用获取用户部门的API
  // 这里简化处理，假设用户有两个部门
  deptOptions.value = [
    { id: 1, deptName: "教务处" },
    { id: 2, deptName: "学生处" },
  ];
}

// 生命周期钩子
onMounted(() => {
  loadUserDepts();
  loadSessionReportTables();
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
