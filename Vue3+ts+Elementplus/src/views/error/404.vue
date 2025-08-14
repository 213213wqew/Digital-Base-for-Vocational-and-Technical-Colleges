<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">404</div>
      <div class="error-message">页面不存在</div>
      <div class="error-description">抱歉，您访问的页面不存在或已被删除</div>
      <el-button type="primary" @click="goHome"> 返回首页 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped>
.error-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.error-content {
  text-align: center;

  .error-code {
    font-size: 120px;
    font-weight: bold;
    color: var(--el-color-primary);
    line-height: 1;
    margin-bottom: 20px;
  }

  .error-message {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }

  .error-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 30px;
  }
}
</style>
