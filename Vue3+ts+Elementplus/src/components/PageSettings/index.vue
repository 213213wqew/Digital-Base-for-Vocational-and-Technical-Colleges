<template>
  <div class="page-settings">
    <el-drawer
      :model-value="visible"
      @update:model-value="emit('update:visible', $event)"
      title="页面设置"
      size="300px"
      :with-header="true"
      direction="rtl"
      :before-close="onClose"
    >
      <div class="settings-content">
        <div class="settings-section">
          <h3 class="settings-title">主题模式</h3>
          <div class="theme-mode-switch">
            <div
              class="theme-mode-item"
              :class="{ active: !themeStore.settings.isDark }"
              @click="setThemeMode(false)"
            >
              <el-icon><Sunny /></el-icon>
              <span>亮色模式</span>
            </div>
            <div
              class="theme-mode-item"
              :class="{ active: themeStore.settings.isDark }"
              @click="setThemeMode(true)"
            >
              <el-icon><Moon /></el-icon>
              <span>暗色模式</span>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="settings-section">
          <h3 class="settings-title">主题色</h3>
          <div class="theme-colors">
            <div
              v-for="color in themeColors"
              :key="color.value"
              class="color-item"
              :style="{ backgroundColor: color.value }"
              :class="{
                active: themeStore.settings.primaryColor === color.value,
              }"
              @click="setPrimaryColor(color.value)"
            ></div>
          </div>
        </div>

        <el-divider />

        <div class="settings-section">
          <h3 class="settings-title">界面设置</h3>
          <div class="interface-settings">
            <div class="setting-item">
              <span>显示标签页</span>
              <el-switch
                :model-value="appStore.showTags"
                @update:model-value="
                  (value) => {
                    appStore.showTags = value as boolean;
                  }
                "
              />
            </div>
            <div class="setting-item">
              <span>固定头部</span>
              <el-switch
                :model-value="appStore.fixedHeader"
                @update:model-value="
                  (value) => {
                    appStore.fixedHeader = value as boolean;
                  }
                "
              />
            </div>
            <div class="setting-item">
              <span>显示面包屑</span>
              <el-switch
                :model-value="appStore.showBreadcrumb"
                @update:model-value="
                  (value) => {
                    appStore.showBreadcrumb = value as boolean;
                  }
                "
              />
            </div>
            <div class="setting-item">
              <span>页面动画</span>
              <el-switch
                :model-value="appStore.pageTransition"
                @update:model-value="
                  (value) => {
                    appStore.pageTransition = value as boolean;
                  }
                "
              />
            </div>
            <div class="setting-item">
              <span>菜单折叠</span>
              <el-switch
                :model-value="!appStore.sidebarOpened"
                @update:model-value="toggleSidebar"
              />
            </div>
            <div class="setting-item">
              <span>菜单搜索</span>
              <el-switch
                :model-value="appStore.showMenuSearch"
                @update:model-value="
                  (value) => {
                    appStore.showMenuSearch = value as boolean;
                  }
                "
              />
            </div>
          </div>
        </div>

        <el-divider />

        <div class="settings-section">
          <h3 class="settings-title">系统功能</h3>
          <div class="system-settings">
            <div class="setting-item">
              <span>跟随系统主题</span>
              <el-switch
                :model-value="themeStore.settings.followSystem"
                @update:model-value="toggleFollowSystem"
              />
            </div>
            <div class="setting-item">
              <span>页面缓存</span>
              <el-switch
                :model-value="appStore.enableCache"
                @update:model-value="
                  (value) => {
                    appStore.enableCache = value as boolean;
                  }
                "
              />
            </div>
          </div>
        </div>

        <div class="settings-footer">
          <el-button type="primary" @click="saveSettings">保存配置</el-button>
          <el-button @click="resetSettings">恢复默认</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useThemeStore } from "@/store/modules/theme";
import { useAppStore } from "@/store/modules/app";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

interface Props {
  visible: boolean;
}

withDefaults(defineProps<Props>(), {
  visible: false,
});

const emit = defineEmits(["impl:visible", "close"]);

const themeStore = useThemeStore();
const appStore = useAppStore();

const themeColors = reactive([
  { name: "拂晓蓝", value: "#1890ff" },
  { name: "薄暮红", value: "#f5222d" },
  { name: "火山橙", value: "#fa541c" },
  { name: "日暮黄", value: "#faad14" },
  { name: "极光绿", value: "#52c41a" },
  { name: "明青色", value: "#13c2c2" },
  { name: "酱紫色", value: "#722ed1" },
]);

// 设置主题模式（亮色/暗色）
const setThemeMode = (isDark: boolean) => {
  themeStore.setDarkMode(isDark);
};

// 设置主题色
const setPrimaryColor = (color: string) => {
  themeStore.setPrimaryColor(color);
  // 更新CSS变量
  document.documentElement.style.setProperty("--el-color-primary", color);
};

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar();
};

// 切换跟随系统主题
const toggleFollowSystem = () => {
  themeStore.toggleFollowSystem();
};

// 保存设置
const saveSettings = () => {
  themeStore.saveThemeSettings();
  appStore.saveAppSettings();
  ElMessage.success("设置已保存");
};

// 重置设置
const resetSettings = () => {
  themeStore.resetTheme();
  appStore.resetSettings();
  ElMessage.success("已恢复默认设置");
};

// 关闭抽屉
const onClose = () => {
  emit("update:visible", false);
  emit("close");
};
</script>

<style lang="scss" scoped>
.page-settings {
  .settings-content {
    padding: 0 20px;
    height: 100%;
    overflow-y: auto;
  }

  .settings-section {
    margin-bottom: 20px;
  }

  .settings-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: var(--el-text-color-primary);
  }

  .theme-mode-switch {
    display: flex;
    gap: 12px;

    .theme-mode-item {
      flex: 1;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid var(--el-border-color-light);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: var(--el-color-primary-light-5);
      }

      &.active {
        background-color: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
      }

      .el-icon {
        font-size: 24px;
      }

      span {
        font-size: 14px;
      }
    }
  }

  .theme-colors {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .color-item {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.1);
      }

      &.active::after {
        content: "";
        position: absolute;
        width: 32px;
        height: 32px;
        border: 2px solid var(--el-color-primary);
        border-radius: 50%;
        top: -4px;
        left: -4px;
      }
    }
  }

  .interface-settings,
  .system-settings {
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      span {
        font-size: 14px;
        color: var(--el-text-color-regular);
      }
    }
  }

  .settings-footer {
    margin-top: 40px;
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
