<template>
  <div class="coming-soon-container">
    <div class="coming-soon-content">
      <el-icon class="coming-soon-icon"><Clock /></el-icon>
      <h1 class="coming-soon-title">功能开发中</h1>
      <p class="coming-soon-desc">该功能正在紧急开发中，即将上线，敬请期待！</p>
      <el-button type="primary" @click="goBack">返回上一页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 返回上一页
const goBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
.coming-soon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 500px;
  padding: 20px;

  .coming-soon-content {
    text-align: center;
    padding: 40px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
  }

  .coming-soon-icon {
    font-size: 80px;
    color: #409eff;
    margin-bottom: 20px;
  }

  .coming-soon-title {
    font-size: 28px;
    color: #303133;
    margin-bottom: 16px;
  }

  .coming-soon-desc {
    font-size: 16px;
    color: #606266;
    margin-bottom: 30px;
    line-height: 1.6;
  }
}

@media (max-width: 768px) {
  .coming-soon-container {
    padding: 15px;

    .coming-soon-content {
      padding: 30px 20px;
    }

    .coming-soon-icon {
      font-size: 60px;
    }

    .coming-soon-title {
      font-size: 24px;
    }
  }
}
</style>
