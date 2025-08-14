<template>
  <div class="dashboard">
    <!-- 欢迎信息卡片 -->
    <el-card class="welcome-card" shadow="never">
      <div class="welcome-info">
        <div class="welcome-avatar">
          <el-avatar :size="64" :src="userStore.avatarUrl" />
        </div>
        <div class="welcome-content">
          <h2>欢迎回来，{{ userStore.displayName }}</h2>
          <p>{{ getGreeting() }}</p>
          <div class="last-login">
            <span>上次登录时间：{{ formatTime(new Date()) }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 统计数据卡片 -->
    <div class="stat-cards">
      <el-row :gutter="20">
        <el-col
          :xs="24"
          :sm="12"
          :md="6"
          v-for="(item, index) in statData"
          :key="index"
        >
          <el-card shadow="hover" class="stat-card">
            <div class="stat-card-content">
              <div class="stat-icon" :style="{ backgroundColor: item.color }">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ item.value }}</div>
                <div class="stat-title">{{ item.title }}</div>
              </div>
            </div>
            <div class="stat-footer">
              <span
                >{{ item.change > 0 ? "↑" : "↓" }}
                {{ Math.abs(item.change) }}%</span
              >
              <span>较上周</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 主要内容区域 -->
    <el-row :gutter="20" class="dashboard-main">
      <!-- 左侧内容：最近活动 -->
      <el-col :xs="24" :md="16">
        <TitlePanel title="最近活动" icon="el-icon-date">
          <div class="activity-list">
            <div
              class="activity-item"
              v-for="(activity, index) in recentActivities"
              :key="index"
            >
              <div class="activity-time">{{ activity.time }}</div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-desc">{{ activity.description }}</div>
              </div>
            </div>
            <el-empty
              v-if="recentActivities.length === 0"
              description="暂无活动记录"
            />
          </div>
        </TitlePanel>
      </el-col>

      <!-- 右侧内容：系统公告 -->
      <el-col :xs="24" :md="8">
        <TitlePanel title="系统公告" icon="el-icon-bell">
          <div class="notice-list">
            <div
              class="notice-item"
              v-for="(notice, index) in systemNotices"
              :key="index"
            >
              <div class="notice-title">{{ notice.title }}</div>
              <div class="notice-time">{{ notice.time }}</div>
            </div>
            <el-empty
              v-if="systemNotices.length === 0"
              description="暂无系统公告"
            />
          </div>
        </TitlePanel>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/modules/user";
import { User, Goods, Management, DataAnalysis } from "@element-plus/icons-vue";
import { formatDateTime } from "@/utils/date";

const userStore = useUserStore();

// 获取问候语
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) {
    return "深夜了，注意休息哦！";
  } else if (hour < 9) {
    return "早上好，祝您有个愉快的一天！";
  } else if (hour < 12) {
    return "上午好，工作顺利！";
  } else if (hour < 14) {
    return "中午好，适当休息一下吧！";
  } else if (hour < 18) {
    return "下午好，继续努力！";
  } else if (hour < 22) {
    return "晚上好，工作辛苦了！";
  } else {
    return "夜深了，注意休息哦！";
  }
};

// 格式化时间
const formatTime = (date: Date) => {
  return formatDateTime(date);
};

// 统计数据
const statData = ref([
  {
    title: "总用户数",
    value: "1,286",
    icon: User,
    color: "#409EFF",
    change: 12.5,
  },
  {
    title: "总订单数",
    value: "8,653",
    icon: Goods,
    color: "#67C23A",
    change: 5.2,
  },
  {
    title: "总收入",
    value: "¥ 25,648",
    icon: Management,
    color: "#E6A23C",
    change: -2.8,
  },
  {
    title: "访问量",
    value: "132,856",
    icon: DataAnalysis,
    color: "#F56C6C",
    change: 15.6,
  },
]);

// 最近活动
const recentActivities = ref([
  {
    time: "2023-11-23 14:32",
    title: "系统更新",
    description: "系统已更新到最新版本 v2.3.0，新增了多项功能和优化",
  },
  {
    time: "2023-11-22 09:15",
    title: "用户管理",
    description: "管理员修改了用户权限设置",
  },
  {
    time: "2023-11-21 16:48",
    title: "数据备份",
    description: "系统自动备份数据完成",
  },
]);

// 系统公告
const systemNotices = ref([
  {
    title: "关于系统维护的通知",
    time: "2023-11-24",
  },
  {
    title: "元旦假期安排",
    time: "2023-11-20",
  },
  {
    title: "新功能上线公告",
    time: "2023-11-15",
  },
]);

// 模拟加载数据
onMounted(() => {
  console.log("Dashboard 页面已加载");
});
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 16px;

  .welcome-card {
    margin-bottom: 20px;

    .welcome-info {
      display: flex;
      align-items: center;

      .welcome-avatar {
        margin-right: 20px;
      }

      .welcome-content {
        h2 {
          margin: 0 0 8px 0;
          font-size: 20px;
        }

        p {
          margin: 0 0 8px 0;
          color: #606266;
        }

        .last-login {
          font-size: 13px;
          color: #909399;
        }
      }
    }
  }

  .stat-cards {
    margin-bottom: 20px;

    .stat-card {
      height: 100%;

      .stat-card-content {
        display: flex;
        align-items: center;

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;

          .el-icon {
            font-size: 24px;
            color: #fff;
          }
        }

        .stat-info {
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 4px;
          }

          .stat-title {
            font-size: 14px;
            color: #909399;
          }
        }
      }

      .stat-footer {
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid #f0f2f5;
        font-size: 13px;
        color: #909399;
      }
    }
  }

  .dashboard-main {
    .activity-list {
      .activity-item {
        display: flex;
        padding: 12px 0;
        border-bottom: 1px solid #f0f2f5;

        &:last-child {
          border-bottom: none;
        }

        .activity-time {
          width: 120px;
          flex-shrink: 0;
          color: #909399;
          font-size: 13px;
        }

        .activity-content {
          flex: 1;

          .activity-title {
            font-weight: bold;
            margin-bottom: 4px;
          }

          .activity-desc {
            color: #606266;
            font-size: 13px;
          }
        }
      }
    }

    .notice-list {
      .notice-item {
        padding: 12px 0;
        border-bottom: 1px solid #f0f2f5;

        &:last-child {
          border-bottom: none;
        }

        .notice-title {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .notice-time {
          color: #909399;
          font-size: 13px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .stat-cards {
    .el-col {
      margin-bottom: 16px;
    }
  }

  .dashboard-main {
    .el-col {
      margin-bottom: 16px;
    }
  }
}
</style>
