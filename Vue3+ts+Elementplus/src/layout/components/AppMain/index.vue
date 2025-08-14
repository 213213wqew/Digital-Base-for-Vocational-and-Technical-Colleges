<template>
  <div class="app-main">
    <router-view v-slot="{ Component }">
      <transition
        name="fade-transform"
        mode="out-in"
        v-if="appStore.pageTransition"
      >
        <keep-alive
          :include="tagsViewStore.cachedViews"
          v-if="appStore.enableCache"
        >
          <component :is="Component" :key="key" />
        </keep-alive>
        <component v-else :is="Component" :key="key" />
      </transition>
      <keep-alive
        :include="tagsViewStore.cachedViews"
        v-else-if="appStore.enableCache"
      >
        <component :is="Component" :key="key" />
      </keep-alive>
      <component v-else :is="Component" :key="key" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useTagsViewStore } from "@/store/modules/tagsView";
import { useAppStore } from "@/store/modules/app";

const route = useRoute();
const tagsViewStore = useTagsViewStore();
const appStore = useAppStore();

// 根据路由生成key，用于强制刷新组件
const key = computed(() => {
  return route.path;
});
</script>

<style lang="scss" scoped>
.app-main {
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: var(--el-bg-color-page);
  flex: 1;
  position: relative; /* 确保定位正确 */

  // 默认为不显示面包屑
  &.no-tags {
    height: calc(100vh - 60px); // 只有头部
  }

  &:not(.no-tags) {
    height: calc(100vh - 60px - 34px); // 头部 + 标签页
  }

  // 如果显示面包屑，则调整高度
  &.no-tags:not(.no-breadcrumb) {
    height: calc(100vh - 60px - 48px); // 头部 + 面包屑
  }

  &:not(.no-tags):not(.no-breadcrumb) {
    height: calc(100vh - 60px - 48px - 34px); // 头部 + 面包屑 + 标签页
  }

  :deep(.el-card) {
    margin-bottom: 20px;
    background-color: var(--el-card-bg-color);
    border-color: var(--el-card-border-color);
  }

  :deep(.app-container) {
    background-color: var(--el-bg-color);
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
  }
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.app-container {
  background-color: var(--el-bg-color);
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 100%;
  color: var(--el-text-color-primary);
}
</style>
