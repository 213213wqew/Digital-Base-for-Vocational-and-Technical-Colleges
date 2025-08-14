<template>
  <div
    id="app"
    :class="{ 'dark-mode': themeStore.settings.darkMode }"
    :data-theme="themeStore.themeMode"
  >
    <!-- 使用更安全的路由视图方式 -->
    <div class="router-container">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, watch, onMounted } from "vue";
import { useThemeStore } from "@/store/modules/theme";
import { useUserStore } from "@/store/modules/user";
import { useAppStore } from "@/store/modules/app";
import { useMenuStore } from "@/store/modules/menu";

// 主题管理
const themeStore = useThemeStore();
const userStore = useUserStore();
const appStore = useAppStore();
const menuStore = useMenuStore();

// 初始化主题
themeStore.initTheme();

// 初始化应用
appStore.initApp();

// 应用启动时尝试恢复用户登录状态
userStore.restoreLoginState();

// 确保主题立即应用
onMounted(() => {
  // 强制重新应用主题以确保所有组件都能正确应用主题变量
  themeStore.applyTheme();
});

console.log("App.vue初始化 - 菜单将在Sidebar组件中加载");

// 监听用户登录状态变化
watch(
  () => userStore.isLoggedIn,
  (isLoggedIn) => {
    if (!isLoggedIn) {
      // 用户登出时，重置菜单状态
      menuStore.resetMenuState();
    }
  },
);

// 监听系统主题变化
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const handleThemeChange = (e: MediaQueryListEvent) => {
  if (themeStore.settings.followSystem) {
    themeStore.setDarkMode(e.matches);
  }
};

mediaQuery.addEventListener("change", handleThemeChange);

onUnmounted(() => {
  mediaQuery.removeEventListener("change", handleThemeChange);
  appStore.destroyApp();
});
</script>

<style lang="scss">
// 全局样式
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family:
    "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", Arial, sans-serif;
}

#app {
  height: 100%;
}

// 路由视图容器
.router-container {
  height: 100vh;
}

// 消除浮动
.clearfix:after {
  content: "";
  display: table;
  clear: both;
}

// 暗黑模式
.dark-mode {
  background-color: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
}
</style>
