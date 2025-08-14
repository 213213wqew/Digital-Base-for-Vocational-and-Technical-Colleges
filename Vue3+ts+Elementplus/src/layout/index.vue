<template>
  <div class="layout-container">
    <div class="layout-header" :class="{ fixed: appStore.fixedHeader }">
      <div class="header-left">
        <el-button :icon="Fold" @click="toggleSidebar" circle text />
        <h1>Vue3数字基座管理系统</h1>
      </div>

      <div class="header-right">
        <!-- 角色选择 -->
        <el-dropdown @command="handleRoleChange" trigger="click">
          <div class="role-selector">
            <span class="role-name">{{
              userStore.currentRole?.roleName || "默认角色"
            }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="role in userStore.userInfo.roles"
                :key="role.id"
                :command="role.id"
                :class="{
                  'is-active':
                    userStore.currentRole &&
                    userStore.currentRole.id === role.id,
                }"
              >
                {{ role.roleName }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-dropdown @command="handleCommand">
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item divided command="logout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
          <div class="user-info">
            <el-avatar :src="userStore.avatarUrl" />
            <div class="user-details">
              <div class="user-name">{{ userStore.displayName }}</div>
              <div v-if="userStore.userInfo.deptName" class="dept-info">
                {{ userStore.userInfo.deptName }}
              </div>
            </div>
            <el-icon><ArrowDown /></el-icon>
          </div>
        </el-dropdown>
        <!-- 菜单搜索 -->
        <MenuSearch v-if="appStore.showMenuSearch" />

        <el-button
          class="setting-btn"
          :icon="Setting"
          circle
          text
          @click="openSettings"
        />
      </div>
    </div>

    <div class="layout-sidebar" :class="{ collapsed: !appStore.sidebarOpened }">
      <Sidebar />
    </div>

    <div
      class="layout-main"
      :class="{
        collapsed: !appStore.sidebarOpened,
        'fixed-header': appStore.fixedHeader,
        'show-tags': appStore.showTags,
        'no-breadcrumb': !appStore.showBreadcrumb,
      }"
    >
      <!-- 面包屑导航 -->
      <div v-if="appStore.showBreadcrumb" class="breadcrumb-container">
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

      <!-- 标签页 -->
      <tags-view v-if="appStore.showTags" />

      <!-- 主内容区 -->
      <app-main
        :class="{
          'no-tags': !appStore.showTags,
          'no-breadcrumb': !appStore.showBreadcrumb,
        }"
      />
    </div>
    <PageSettings v-model:visible="settingsVisible" @close="closeSettings" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import { Fold, ArrowDown, Setting } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { useAppStore } from "@/store/modules/app";
import { useMenuStore } from "@/store/modules/menu";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import Sidebar from "./components/Sidebar.vue";
import TagsView from "./components/TagsView/index.vue";
import AppMain from "./components/AppMain/index.vue";
import PageSettings from "@/components/PageSettings/index.vue";
import MenuSearch from "@/components/MenuSearch/index.vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();
const menuStore = useMenuStore();
const settingsVisible = ref(false);

// 如果用户有角色但没有选择当前角色，设置第一个角色为当前角色
if (userStore.userInfo.roles.length > 0 && !userStore.currentRoleId) {
  userStore.currentRoleId = userStore.userInfo.roles[0].id;
}

// 当前路径
const currentPath = computed(() => {
  return route.path;
});

// 面包屑导航
const breadcrumbItems = computed(() => {
  if (!appStore.showBreadcrumb) return [];

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

const toggleSidebar = () => {
  appStore.toggleSidebar();
};

const openSettings = () => {
  settingsVisible.value = true;
};

const closeSettings = () => {
  settingsVisible.value = false;
};

const handleCommand = (command: string) => {
  switch (command) {
    case "profile":
      router.push("/profile");
      break;
    case "logout":
      ElMessageBox.confirm("确定要退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          userStore.logout();
        })
        .catch(() => {
          // 用户取消操作，不做任何处理
        });
      break;
  }
};

const handleRoleChange = (roleId: string) => {
  // 如果是当前角色，无需切换
  if (userStore.currentRoleId === roleId) return;

  const role = userStore.userInfo.roles.find((r) => r.id === roleId);
  if (role) {
    // 弹出确认对话框
    ElMessageBox.confirm(
      `确定要切换到角色"${role.roleName}"吗？这将清空当前所有标签页并回到首页。`,
      "切换角色",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    )
      .then(async () => {
        try {
          // 显示加载中
          const loadingInstance = ElLoading.service({
            lock: true,
            text: "正在切换角色...",
            background: "rgba(0, 0, 0, 0.7)",
          });

          // 1. 切换角色
          userStore.switchRole(roleId);

          // 2. 获取TagsView的store，清空所有标签（保留首页）
          const { useTagsViewStore } = await import("@/store/modules/tagsView");
          const tagsViewStore = useTagsViewStore();
          tagsViewStore.delAllViews(true); // true表示保留固定标签（如首页）

          // 3. 重置菜单状态
          menuStore.resetMenuState();

          // 4. 重新获取角色对应的菜单权限
          await menuStore.getUserMenuPermissions(userStore.userInfo.id, roleId);

          // 5. 预注册菜单路由
          preRegisterMenuRoutes(menuStore.menuList);

          // 6. 关闭加载提示
          loadingInstance.close();

          // 7. 切换成功提示
          ElMessage.success(`已切换到角色: ${role.roleName}`);

          // 8. 重定向到首页
          if (route.path !== "/dashboard") {
            router.push("/dashboard");
          } else {
            // 如果当前就在首页，强制刷新页面
            window.location.reload();
          }
        } catch (error) {
          console.error("角色切换失败:", error);
          ElMessage.error("角色切换失败，请刷新页面重试");
        }
      })
      .catch(() => {
        // 用户取消操作
      });
  }
};

// 预注册菜单路由函数
const preRegisterMenuRoutes = (menuList: any[]) => {
  console.log("预注册菜单路由...");

  // 递归处理菜单
  const processMenus = (menus: any[]) => {
    menus.forEach((menu) => {
      // 只处理菜单类型，不处理按钮
      if (menu.type !== "button" && menu.path && menu.component) {
        // 预注册路由，传递菜单名称作为路由标题
        import("@/router").then(({ addDynamicRoute }) => {
          addDynamicRoute(menu.path, menu.component, menu.name);
        });
      }

      // 递归处理子菜单
      if (menu.children && menu.children.length > 0) {
        processMenus(menu.children);
      }
    });
  };

  // 处理菜单
  processMenus(menuList);
  console.log("菜单路由预注册完成");
};

// 组件挂载
onMounted(() => {
  // 组件挂载时的处理
});

// 组件销毁前
onBeforeUnmount(() => {
  // 组件销毁前的清理
});

// 组件销毁
onUnmounted(() => {
  // 组件销毁时的清理
});
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止整体容器出现滚动条 */
}

.layout-header {
  height: 60px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 1000;

  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    h1 {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin: 0;
    }

    .el-button {
      color: var(--el-text-color-regular);

      &:hover {
        color: var(--el-color-primary);
        background-color: var(--el-fill-color-light);
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .role-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 6px;
      transition: background-color 0.3s;
      border: 1px solid var(--el-border-color-light);

      &:hover {
        background-color: var(--el-fill-color-light);
      }

      .role-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }

      .el-icon {
        color: var(--el-text-color-secondary);
      }
    }

    :deep(.el-dropdown-menu__item.is-active) {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--el-fill-color-light);
      }

      .user-details {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .user-name {
          font-size: 14px;
          color: var(--el-text-color-primary);
          line-height: 1.2;
          margin-bottom: 2px;
        }

        .dept-info {
          font-size: 11px;
          color: var(--el-text-color-secondary);
          line-height: 1.2;
        }
      }

      .el-icon {
        color: var(--el-text-color-secondary);
      }
    }

    .setting-btn {
      font-size: 18px;
      color: var(--el-text-color-regular);

      &:hover {
        color: var(--el-color-primary);
        background-color: var(--el-fill-color-light);
      }
    }
  }
}

.layout-sidebar {
  width: var(--sidebar-width);
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  transition: width 0.3s ease;
  z-index: 100;
  background-color: var(--el-menu-bg-color);
  border-right: 1px solid var(--el-border-color-light);

  &.collapsed {
    width: var(--sidebar-collapsed-width);
  }
}

.layout-main {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color-page);
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  overflow: hidden;

  &.fixed-header {
    margin-top: 60px;
  }

  &.collapsed {
    margin-left: var(--sidebar-collapsed-width);
  }

  .breadcrumb-container {
    background: var(--el-bg-color);
    padding: 12px 20px;
    border-bottom: 1px solid var(--el-border-color-light);
    flex-shrink: 0;

    :deep(.el-breadcrumb__item) {
      .el-breadcrumb__inner {
        color: var(--el-text-color-secondary);

        &:hover {
          color: var(--el-color-primary);
        }
      }

      &:last-child .el-breadcrumb__inner {
        color: var(--el-text-color-primary);
        font-weight: 500;
      }
    }

    :deep(.el-breadcrumb__separator) {
      color: var(--el-text-color-placeholder);
    }
  }
}

@media (max-width: 768px) {
  .layout-sidebar {
    transform: translateX(-100%);

    &:not(.collapsed) {
      transform: translateX(0);
    }
  }

  .layout-main {
    margin-left: 0;

    &.collapsed {
      margin-left: 0;
    }
  }
}
</style>
