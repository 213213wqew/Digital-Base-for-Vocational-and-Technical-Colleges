<template>
  <div class="redirect-page">
    <el-result
      icon="info"
      title="页面重定向中..."
      sub-title="正在跳转到目标页面，请稍候..."
    >
      <template #extra>
        <el-button type="primary" @click="goHome">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const goHome = () => {
  router.push("/");
};

onMounted(() => {
  // 获取重定向路径
  const redirect = route.query.redirect as string;

  if (redirect) {
    // 延迟跳转，避免页面闪烁
    setTimeout(() => {
      router.replace(redirect);
    }, 100);
  } else {
    // 如果没有重定向路径，跳转到首页
    router.replace("/");
  }
});
</script>

<style scoped>
.redirect-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}
</style>
