<template>
  <div class="report-statistics">
    <!-- 筛选条件 -->
    <el-card class="filter-card" shadow="never">
      <el-form :model="queryParams" inline>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleDateRangeChange"
          />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="queryParams.deptIds" multiple placeholder="选择部门" clearable>
            <el-option
              v-for="dept in deptOptions"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据子集">
          <el-select v-model="queryParams.subsetCodes" multiple placeholder="选择数据子集" clearable>
            <el-option
              v-for="subset in subsetOptions"
              :key="subset.code"
              :label="subset.name"
              :value="subset.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadStatistics">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计概览 -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-number">{{ statistics.overview?.totalTables || 0 }}</div>
            <div class="stat-label">总表数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-number success">{{ statistics.overview?.reportedTables || 0 }}</div>
            <div class="stat-label">已上报表数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-number warning">{{ statistics.overview?.unreportedTables || 0 }}</div>
            <div class="stat-label">未上报表数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-number primary">{{ statistics.overview?.reportRate || 0 }}%</div>
            <div class="stat-label">上报率</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 统计标签页 -->
    <el-card class="mt-4">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="用户统计" name="user">
          <el-table :data="statistics.userStats" border>
            <el-table-column label="序号" width="55" type="index" align="center" />
            <el-table-column prop="username" label="用户姓名" width="120" />
            <el-table-column prop="deptName" label="所属部门" width="150" />
            <el-table-column prop="totalAssigned" label="分配表数" width="100" />
            <el-table-column prop="reportedCount" label="已上报数" width="100" />
            <el-table-column prop="reportRate" label="上报率" width="100">
              <template #default="{ row }">
                <el-progress :percentage="row.reportRate" />
              </template>
            </el-table-column>
            <el-table-column prop="lastReportTime" label="最后上报时间" width="180" />
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="部门统计" name="dept">
          <el-table :data="statistics.deptStats" border>
            <el-table-column label="序号" width="55" type="index" align="center" />
            <el-table-column prop="deptName" label="部门名称" width="150" />
            <el-table-column prop="totalTables" label="总表数" width="100" />
            <el-table-column prop="reportedTables" label="已上报表数" width="120" />
            <el-table-column prop="reportRate" label="上报率" width="100">
              <template #default="{ row }">
                <el-progress :percentage="row.reportRate" />
              </template>
            </el-table-column>
            <el-table-column prop="userCount" label="用户数" width="100" />
            <el-table-column prop="activeUserCount" label="活跃用户数" width="120" />
            <el-table-column prop="todayReported" label="今日上报" width="100" />
            <el-table-column prop="weekReported" label="本周上报" width="100" />
            <el-table-column prop="monthReported" label="本月上报" width="100" />
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="分类统计" name="category">
          <el-row :gutter="20">
            <el-col :span="12">
              <h4>数据子集统计</h4>
              <el-table :data="statistics.categoryStats?.subsetStats" border>
                <el-table-column label="序号" width="55" type="index" align="center" />
                <el-table-column prop="subsetName" label="数据子集" />
                <el-table-column prop="totalTables" label="总表数" width="100" />
                <el-table-column prop="reportedTables" label="已上报表数" width="120" />
                <el-table-column prop="reportRate" label="上报率" width="100">
                  <template #default="{ row }">
                    <el-progress :percentage="row.reportRate" />
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12">
              <h4>数据类统计</h4>
              <el-table :data="statistics.categoryStats?.catalogStats" border>
                <el-table-column label="序号" width="55" type="index" align="center" />
                <el-table-column prop="catalogName" label="数据类" />
                <el-table-column prop="totalTables" label="总表数" width="100" />
                <el-table-column prop="reportedTables" label="已上报表数" width="120" />
                <el-table-column prop="reportRate" label="上报率" width="100">
                  <template #default="{ row }">
                    <el-progress :percentage="row.reportRate" />
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="时间统计" name="time">
          <el-row :gutter="20">
            <el-col :span="12">
              <h4>日报统计</h4>
              <el-table :data="statistics.timeStats?.dailyStats" border>
                <el-table-column label="序号" width="55" type="index" align="center" />
                <el-table-column prop="date" label="日期" width="120" />
                <el-table-column prop="totalTables" label="总表数" width="100" />
                <el-table-column prop="reportedTables" label="已上报表数" width="120" />
                <el-table-column prop="reportRate" label="上报率" width="100">
                  <template #default="{ row }">
                    <el-progress :percentage="row.reportRate" />
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12">
              <h4>月报统计</h4>
              <el-table :data="statistics.timeStats?.monthlyStats" border>
                <el-table-column label="序号" width="55" type="index" align="center" />
                <el-table-column prop="month" label="月份" width="120" />
                <el-table-column prop="totalTables" label="总表数" width="100" />
                <el-table-column prop="reportedTables" label="已上报表数" width="120" />
                <el-table-column prop="reportRate" label="上报率" width="100">
                  <template #default="{ row }">
                    <el-progress :percentage="row.reportRate" />
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import {
  reportRecordApi,
  type ReportStatisticsQuery,
  type ReportStatisticsVO,
} from "@/api-data/data/report/reportRecord";

// 查询参数
const queryParams = reactive<ReportStatisticsQuery>({
  startDate: "",
  endDate: "",
  deptIds: [],
  userIds: [],
  subsetCodes: [],
  catalogCodes: [],
  subcatalogCodes: [],
  reportFrequencies: [],
  reportStatuses: [],
});

// 日期范围
const dateRange = ref<[string, string]>();

// 响应式数据
const loading = ref(false);
const activeTab = ref("user");
const statistics = ref<ReportStatisticsVO>({
  overview: {
    totalTables: 0,
    reportedTables: 0,
    unreportedTables: 0,
    reportRate: 0,
    todayReported: 0,
    weekReported: 0,
    monthReported: 0,
  },
  userStats: [],
  deptStats: [],
  categoryStats: {
    subsetStats: [],
    catalogStats: [],
    subcatalogStats: [],
  },
  timeStats: {
    dailyStats: [],
    weeklyStats: [],
    monthlyStats: [],
  },
});

// 选项数据
const deptOptions = ref<Array<{ id: number; name: string }>>([]);
const subsetOptions = ref<Array<{ code: string; name: string }>>([]);

// 监听日期范围变化
const handleDateRangeChange = () => {
  if (dateRange.value) {
    queryParams.startDate = dateRange.value[0];
    queryParams.endDate = dateRange.value[1];
  } else {
    queryParams.startDate = "";
    queryParams.endDate = "";
  }
};

// 加载统计数据
const loadStatistics = async () => {
  loading.value = true;
  try {
    const response = await reportRecordApi.getReportStatistics(queryParams);
    if (response.data.code === 200) {
      statistics.value = response.data.data;
    } else {
      ElMessage.error(response.data.message || "获取统计数据失败");
    }
  } catch (error) {
    console.error("获取统计数据失败:", error);
    ElMessage.error("获取统计数据失败");
  } finally {
    loading.value = false;
  }
};

// 重置查询
const resetQuery = () => {
  Object.assign(queryParams, {
    startDate: "",
    endDate: "",
    deptIds: [],
    userIds: [],
    subsetCodes: [],
    catalogCodes: [],
    subcatalogCodes: [],
    reportFrequencies: [],
    reportStatuses: [],
  });
  dateRange.value = undefined;
  loadStatistics();
};

// 标签页切换
const handleTabClick = () => {
  // 可以在这里添加标签页切换逻辑
};

// 页面加载时获取数据
onMounted(() => {
  loadStatistics();
});
</script>

<style scoped>
.report-statistics {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-number.success {
  color: #67c23a;
}

.stat-number.warning {
  color: #e6a23c;
}

.stat-number.primary {
  color: #409eff;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.mt-4 {
  margin-top: 20px;
}

h4 {
  margin-bottom: 16px;
  color: #303133;
  font-weight: 600;
}

:deep(.el-tabs__content) {
  padding: 20px 0;
}

:deep(.el-table) {
  margin-bottom: 20px;
}

:deep(.el-progress) {
  margin: 0;
}

:deep(.el-progress__text) {
  font-size: 12px;
}
</style> 