<template>
  <div class="online-users-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>在线用户监控</h2>
        <p>实时监控系统在线用户状态</p>
      </div>
      <div class="header-right">
        <el-button :icon="Refresh" @click="refreshData"> 刷新数据 </el-button>
        <el-button :icon="Download" @click="handleExport"> 导出数据 </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon online">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <h3>在线用户</h3>
          <div class="stat-number">{{ onlineStats.total }}</div>
          <div class="stat-desc">当前在线人数</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon active">
          <el-icon><Operation /></el-icon>
        </div>
        <div class="stat-content">
          <h3>活跃用户</h3>
          <div class="stat-number">{{ onlineStats.active }}</div>
          <div class="stat-desc">5分钟内有操作</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon peak">
          <el-icon><TrendCharts /></el-icon>
        </div>
        <div class="stat-content">
          <h3>今日峰值</h3>
          <div class="stat-number">{{ onlineStats.peak }}</div>
          <div class="stat-desc">今日最高在线数</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon session">
          <el-icon><Timer /></el-icon>
        </div>
        <div class="stat-content">
          <h3>平均会话</h3>
          <div class="stat-number">{{ onlineStats.avgSession }}</div>
          <div class="stat-desc">平均会话时长(分钟)</div>
        </div>
      </div>
    </div>

    <!-- 在线用户图表 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>在线用户趋势</span>
          <el-radio-group v-model="chartPeriod" size="small">
            <el-radio-button label="1h">1小时</el-radio-button>
            <el-radio-button label="6h">6小时</el-radio-button>
            <el-radio-button label="24h">24小时</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div class="chart-container">
        <div class="chart-placeholder">
          <el-icon size="48"><TrendCharts /></el-icon>
          <p>在线用户趋势图表</p>
        </div>
      </div>
    </el-card>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form ref="searchFormRef" :model="searchForm" :inline="true">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input
            v-model="searchForm.ip"
            placeholder="请输入IP地址"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="登录地点" prop="location">
          <el-input
            v-model="searchForm.location"
            placeholder="请输入登录地点"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 在线用户列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <span>在线用户列表</span>
          <div class="table-actions">
            <el-button
              type="danger"
              :icon="SwitchButton"
              :disabled="!multipleSelection.length"
              @click="handleBatchKickOut"
            >
              批量强退
            </el-button>
            <el-button :icon="Refresh" @click="getList"> 刷新 </el-button>
          </div>
        </div>
      </template>

      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="tableData"
        row-key="sessionId"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="avatar" label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="32">
              {{ row.realName?.charAt(0) || row.username.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="realName"
          label="真实姓名"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ip"
          label="IP地址"
          width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="location"
          label="登录地点"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="browser"
          label="浏览器"
          width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-tag size="small">{{ row.browser }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="os"
          label="操作系统"
          width="120"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-tag size="small" type="success">{{ row.os }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="loginTime" label="登录时间" width="160">
          <template #default="{ row }">
            {{ formatDate(new Date(row.loginTime), "YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column prop="lastActiveTime" label="最后活动" width="160">
          <template #default="{ row }">
            <div class="activity-info">
              <span>{{
                formatDate(new Date(row.lastActiveTime), "HH:mm:ss")
              }}</span>
              <div
                class="activity-status"
                :class="getActivityStatus(row.lastActiveTime)"
              >
                <span class="status-dot"></span>
                {{ getActivityStatusText(row.lastActiveTime) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sessionDuration"
          label="会话时长"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            {{ formatDuration(row.sessionDuration) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="currentPage"
          label="当前页面"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              :icon="View"
              @click="handleViewDetail(row)"
            >
              详情
            </el-button>
            <el-button
              type="warning"
              size="small"
              :icon="Message"
              @click="handleSendMessage(row)"
            >
              发消息
            </el-button>
            <el-button
              type="danger"
              size="small"
              :icon="SwitchButton"
              @click="handleKickOut(row)"
            >
              强退
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="用户会话详情"
      width="800px"
      :before-close="handleCloseDetail"
    >
      <div v-if="currentUser" class="user-session-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名">
            {{ currentUser.username }}
          </el-descriptions-item>
          <el-descriptions-item label="真实姓名">
            {{ currentUser.realName }}
          </el-descriptions-item>
          <el-descriptions-item label="会话ID">
            {{ currentUser.sessionId }}
          </el-descriptions-item>
          <el-descriptions-item label="IP地址">
            {{ currentUser.ip }}
          </el-descriptions-item>
          <el-descriptions-item label="登录地点">
            {{ currentUser.location }}
          </el-descriptions-item>
          <el-descriptions-item label="浏览器">
            {{ currentUser.browser }}
          </el-descriptions-item>
          <el-descriptions-item label="操作系统">
            {{ currentUser.os }}
          </el-descriptions-item>
          <el-descriptions-item label="设备类型">
            {{ currentUser.deviceType }}
          </el-descriptions-item>
          <el-descriptions-item label="登录时间">
            {{
              formatDate(new Date(currentUser.loginTime), "YYYY-MM-DD HH:mm:ss")
            }}
          </el-descriptions-item>
          <el-descriptions-item label="最后活动">
            {{
              formatDate(
                new Date(currentUser.lastActiveTime),
                "YYYY-MM-DD HH:mm:ss",
              )
            }}
          </el-descriptions-item>
          <el-descriptions-item label="会话时长">
            {{ formatDuration(currentUser.sessionDuration) }}
          </el-descriptions-item>
          <el-descriptions-item label="当前页面">
            {{ currentUser.currentPage }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="session-activities" style="margin-top: 20px">
          <h4>最近活动记录</h4>
          <el-timeline>
            <el-timeline-item
              v-for="activity in currentUser.activities"
              :key="activity.id"
              :timestamp="formatDate(new Date(activity.time), 'HH:mm:ss')"
              placement="top"
            >
              <div class="activity-item">
                <span class="activity-action">{{ activity.action }}</span>
                <span class="activity-page">{{ activity.page }}</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>

    <!-- 发送消息弹窗 -->
    <el-dialog
      v-model="messageVisible"
      title="发送消息"
      width="500px"
      :before-close="handleCloseMessage"
    >
      <el-form
        ref="messageFormRef"
        :model="messageForm"
        :rules="messageRules"
        label-width="80px"
      >
        <el-form-item label="接收用户">
          <span>{{ messageForm.username }} ({{ messageForm.realName }})</span>
        </el-form-item>
        <el-form-item label="消息类型" prop="type">
          <el-radio-group v-model="messageForm.type">
            <el-radio value="info">普通消息</el-radio>
            <el-radio value="warning">警告消息</el-radio>
            <el-radio value="notice">系统通知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消息内容" prop="content">
          <el-input
            v-model="messageForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入消息内容"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleCloseMessage">取消</el-button>
        <el-button
          type="primary"
          @click="handleSendMessageConfirm"
          :loading="sendingMessage"
        >
          发送
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  Refresh,
  Download,
  Search,
  User,
  Operation,
  TrendCharts,
  Timer,
  View,
  Message,
  SwitchButton,
} from "@element-plus/icons-vue";
import { formatDate } from "@/utils/date";
import type { FormInstance, TableInstance } from "element-plus";

// 响应式数据
const loading = ref(false);
const sendingMessage = ref(false);
const detailVisible = ref(false);
const messageVisible = ref(false);
const tableRef = ref<TableInstance>();
const searchFormRef = ref<FormInstance>();
const messageFormRef = ref<FormInstance>();

// 在线统计数据
const onlineStats = ref({
  total: 156,
  active: 89,
  peak: 234,
  avgSession: 45,
});

// 图表周期
const chartPeriod = ref("6h");

// 表格数据
const tableData = ref([
  {
    sessionId: "session_001",
    username: "admin",
    realName: "系统管理员",
    avatar: "",
    ip: "192.168.1.100",
    location: "北京市朝阳区",
    browser: "Chrome 120",
    os: "Windows 10",
    deviceType: "桌面端",
    loginTime: "2024-01-15 09:00:00",
    lastActiveTime: new Date().toISOString(),
    sessionDuration: 185, // 分钟
    currentPage: "/dashboard",
    activities: [
      {
        id: 1,
        action: "访问页面",
        page: "/dashboard",
        time: new Date().toISOString(),
      },
      {
        id: 2,
        action: "查看用户",
        page: "/user/list",
        time: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: 3,
        action: "编辑角色",
        page: "/role/list",
        time: new Date(Date.now() - 600000).toISOString(),
      },
    ],
  },
  {
    sessionId: "session_002",
    username: "zhangsan",
    realName: "张三",
    avatar: "",
    ip: "192.168.1.101",
    location: "上海市浦东新区",
    browser: "Firefox 121",
    os: "macOS 14",
    deviceType: "桌面端",
    loginTime: "2024-01-15 09:15:00",
    lastActiveTime: new Date(Date.now() - 120000).toISOString(),
    sessionDuration: 170,
    currentPage: "/user/list",
    activities: [
      {
        id: 1,
        action: "登录系统",
        page: "/login",
        time: new Date(Date.now() - 600000).toISOString(),
      },
      {
        id: 2,
        action: "查看仪表盘",
        page: "/dashboard",
        time: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: 3,
        action: "管理用户",
        page: "/user/list",
        time: new Date(Date.now() - 120000).toISOString(),
      },
    ],
  },
  {
    sessionId: "session_003",
    username: "lisi",
    realName: "李四",
    avatar: "",
    ip: "192.168.1.102",
    location: "广州市天河区",
    browser: "Safari 17",
    os: "iOS 17",
    deviceType: "移动端",
    loginTime: "2024-01-15 09:30:00",
    lastActiveTime: new Date(Date.now() - 600000).toISOString(),
    sessionDuration: 155,
    currentPage: "/monitor/online",
    activities: [
      {
        id: 1,
        action: "移动端登录",
        page: "/login",
        time: new Date(Date.now() - 900000).toISOString(),
      },
      {
        id: 2,
        action: "查看监控",
        page: "/monitor/online",
        time: new Date(Date.now() - 600000).toISOString(),
      },
    ],
  },
]);

// 搜索表单
const searchForm = ref({
  username: "",
  ip: "",
  location: "",
});

// 分页
const pagination = ref({
  page: 1,
  size: 10,
  total: 3,
});

// 多选
const multipleSelection = ref([]);

// 当前用户
const currentUser = ref(null);

// 消息表单
const messageForm = ref({
  sessionId: "",
  username: "",
  realName: "",
  type: "info",
  content: "",
});

// 消息表单验证规则
const messageRules = {
  type: [{ required: true, message: "请选择消息类型", trigger: "change" }],
  content: [
    { required: true, message: "请输入消息内容", trigger: "blur" },
    {
      min: 1,
      max: 200,
      message: "消息内容长度在 1 到 200 个字符",
      trigger: "blur",
    },
  ],
};

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // 更新最后活动时间（模拟实时数据）
    tableData.value.forEach((user) => {
      if (Math.random() > 0.7) {
        user.lastActiveTime = new Date().toISOString();
      }
    });
    ElMessage.success("数据刷新成功");
  } catch (error) {
    ElMessage.error("数据加载失败");
  } finally {
    loading.value = false;
  }
};

// 刷新数据
const refreshData = () => {
  getList();
  // 更新统计数据
  onlineStats.value = {
    total: Math.floor(Math.random() * 100) + 100,
    active: Math.floor(Math.random() * 50) + 50,
    peak: Math.floor(Math.random() * 100) + 200,
    avgSession: Math.floor(Math.random() * 30) + 30,
  };
};

// 搜索
const handleSearch = () => {
  pagination.value.page = 1;
  getList();
};

// 重置搜索
const handleReset = () => {
  searchFormRef.value?.resetFields();
  getList();
};

// 导出数据
const handleExport = () => {
  ElMessage.info("导出功能开发中...");
};

// 查看详情
const handleViewDetail = (row: any) => {
  currentUser.value = row;
  detailVisible.value = true;
};

// 发送消息
const handleSendMessage = (row: any) => {
  messageForm.value = {
    sessionId: row.sessionId,
    username: row.username,
    realName: row.realName,
    type: "info",
    content: "",
  };
  messageVisible.value = true;
};

// 强退用户
const handleKickOut = (row: any) => {
  ElMessageBox.confirm(
    `确定要强制退出用户 "${row.realName || row.username}" 吗？`,
    "强退确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(() => {
    const index = tableData.value.findIndex(
      (item) => item.sessionId === row.sessionId,
    );
    if (index > -1) {
      tableData.value.splice(index, 1);
      pagination.value.total--;
    }
    ElMessage.success("用户已强制退出");
  });
};

// 批量强退
const handleBatchKickOut = () => {
  ElMessageBox.confirm(
    `确定要强制退出选中的 ${multipleSelection.value.length} 个用户吗？`,
    "批量强退确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(() => {
    const sessionIds = multipleSelection.value.map(
      (item: any) => item.sessionId,
    );
    tableData.value = tableData.value.filter(
      (item) => !sessionIds.includes(item.sessionId),
    );
    pagination.value.total -= multipleSelection.value.length;
    multipleSelection.value = [];
    ElMessage.success("批量强退成功");
  });
};

// 表格选择变化
const handleSelectionChange = (selection: any[]) => {
  multipleSelection.value = selection;
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.value.size = size;
  getList();
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  pagination.value.page = page;
  getList();
};

// 发送消息确认
const handleSendMessageConfirm = async () => {
  if (!messageFormRef.value) return;

  try {
    await messageFormRef.value.validate();
    sendingMessage.value = true;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    ElMessage.success("消息发送成功");
    messageVisible.value = false;
  } catch (error) {
    console.error("发送消息失败:", error);
  } finally {
    sendingMessage.value = false;
  }
};

// 关闭详情弹窗
const handleCloseDetail = () => {
  detailVisible.value = false;
  currentUser.value = null;
};

// 关闭消息弹窗
const handleCloseMessage = () => {
  messageVisible.value = false;
  messageFormRef.value?.resetFields();
};

// 获取活动状态
const getActivityStatus = (lastActiveTime: string) => {
  const diff = Date.now() - new Date(lastActiveTime).getTime();
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 5) return "active";
  if (minutes < 15) return "idle";
  return "inactive";
};

// 获取活动状态文本
const getActivityStatusText = (lastActiveTime: string) => {
  const diff = Date.now() - new Date(lastActiveTime).getTime();
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "刚刚活动";
  if (minutes < 5) return "活跃中";
  if (minutes < 15) return "空闲中";
  return "不活跃";
};

// 格式化时长
const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}小时${mins}分钟`;
  }
  return `${mins}分钟`;
};

// 自动刷新数据
let refreshTimer: NodeJS.Timeout | null = null;

// 初始化数据
onMounted(() => {
  getList();

  // 每30秒自动刷新一次
  refreshTimer = setInterval(() => {
    refreshData();
  }, 30000);
});

// 清理定时器
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
});
</script>

<style lang="scss" scoped>
.online-users-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .header-left {
    h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }

  .header-right {
    display: flex;
    gap: 12px;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;

    &.online {
      background: var(--el-color-primary-light-8);
      color: var(--el-color-primary);
    }

    &.active {
      background: var(--el-color-success-light-8);
      color: var(--el-color-success);
    }

    &.peak {
      background: var(--el-color-warning-light-8);
      color: var(--el-color-warning);
    }

    &.session {
      background: var(--el-color-info-light-8);
      color: var(--el-color-info);
    }
  }

  .stat-content {
    h3 {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .stat-number {
      font-size: 28px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    .stat-desc {
      font-size: 12px;
      color: #999;
    }
  }
}

.chart-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }

  .chart-container {
    height: 300px;

    .chart-placeholder {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;

      p {
        margin-top: 12px;
        font-size: 14px;
      }
    }
  }
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;

    .table-actions {
      display: flex;
      gap: 12px;
    }
  }
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .activity-status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &.active {
      color: var(--el-color-success);

      .status-dot {
        background: var(--el-color-success);
      }
    }

    &.idle {
      color: var(--el-color-warning);

      .status-dot {
        background: var(--el-color-warning);
      }
    }

    &.inactive {
      color: var(--el-color-info);

      .status-dot {
        background: var(--el-color-info);
      }
    }
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.user-session-detail {
  .session-activities {
    h4 {
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: 600;
    }

    .activity-item {
      display: flex;
      gap: 12px;

      .activity-action {
        font-weight: 500;
      }

      .activity-page {
        color: #666;
        font-size: 13px;
      }
    }
  }
}

@media (max-width: 768px) {
  .online-users-container {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;

    .header-right {
      justify-content: center;
    }
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  :deep(.el-form--inline .el-form-item) {
    display: block;
    margin-right: 0;
    margin-bottom: 16px;
  }

  :deep(.el-table) {
    font-size: 12px;
  }
}
</style>
