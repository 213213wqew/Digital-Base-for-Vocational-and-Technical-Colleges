<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path">
        <router-link
          v-if="item.path && item.path !== currentPath"
          :to="item.path"
        >
          {{ item.name }}
        </router-link>
        <span v-else>{{ item.name }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useMenuStore } from "@/store/modules/menu";

const route = useRoute();
const menuStore = useMenuStore();

// 当前路径
const currentPath = computed(() => route.path);

// 面包屑导航
const breadcrumbItems = computed(() => {
  // 构建面包屑
  const breadcrumb = menuStore.buildBreadcrumb(currentPath.value);

  // 如果没有找到对应的菜单项，使用路由信息构建
  if (breadcrumb.length === 0) {
    const items = [];

    // 添加首页
    items.push({ name: "首页", path: "/dashboard" });

    // 添加当前页面
    if (route.meta?.title) {
      items.push({ name: route.meta.title as string, path: currentPath.value });
    }

    return items;
  }

  return breadcrumb;
});
</script>

<style lang="scss" scoped>
.breadcrumb-container {
  background: white;
  padding: 8px 16px;
  border-bottom: 1px solid #ebeef5;

  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      color: #606266;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    &:last-child .el-breadcrumb__inner {
      color: #303133;
      font-weight: 500;
    }
  }
}
</style>
