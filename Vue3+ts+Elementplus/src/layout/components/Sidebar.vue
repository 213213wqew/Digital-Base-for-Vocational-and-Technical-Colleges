<template>
  <div
    class="sidebar-container"
    :class="{
      'mobile-hidden': !appStore.sidebarOpened && isMobile,
      collapsed: !appStore.sidebarOpened,
    }"
  >
    <!-- Logo区域 -->
    <div class="logo-container">
      <div class="logo">
        <el-icon size="32" color="#409EFF">
          <Management />
        </el-icon>
        <span v-if="appStore.sidebarOpened" class="logo-text"
          >数字基座管理系统</span
        >
      </div>
    </div>

    <!-- 菜单区域 -->
    <el-scrollbar class="menu-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :default-openeds="openedMenuKeys"
        :collapse="!appStore.sidebarOpened"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        @select="handleMenuSelect"
      >
        <!-- 调试信息 -->
        <div v-if="debugMode" class="debug-info">
          <p>菜单总数: {{ menuStore.menuList.length }}</p>
          <p>过滤后菜单数: {{ menuStore.filteredMenuList.length }}</p>
        </div>

        <!-- 加载中状态 -->
        <div v-if="menuStore.loading" class="menu-loading">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载菜单中...</span>
        </div>

        <!-- 菜单项渲染 -->
        <template v-else>
          <sidebar-menu :menu-list="menuStore.filteredMenuList as any[]" />

          <!-- 无菜单时的提示 -->
          <div
            v-if="menuStore.filteredMenuList.length === 0"
            class="menu-empty"
          >
            <el-icon><Warning /></el-icon>
            <span>暂无可用菜单</span>
          </div>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { Management, Loading, Warning } from "@element-plus/icons-vue";
import { useAppStore } from "@/store/modules/app";
import { useMenuStore } from "@/store/modules/menu";
import { useUserStore } from "@/store/modules/user";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import SidebarMenu from "./SidebarMenu.vue";
import { MenuUtils } from "@/utils/menu";

const appStore = useAppStore();
const menuStore = useMenuStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// 调试模式
const debugMode = ref(false);

// 是否为移动设备
const isMobile = ref(window.innerWidth < 768);

// 菜单展开状态 - 使用ref管理，不会因路由变化而重置
const openedMenuKeys = ref<string[]>([]);

// 监听窗口大小变化
window.addEventListener("resize", () => {
  isMobile.value = window.innerWidth < 768;
});

// 初始化菜单数据
const initMenu = async () => {
  try {
    if (userStore.isLoggedIn) {
      console.log("Sidebar组件初始化菜单加载 - 开始加载");

      if (!userStore.userInfo.id) {
        // 如果没有用户信息，先获取用户信息
        await userStore.getUserInfo();
      }

      if (userStore.userInfo.id) {
        // 获取当前角色ID，如果没有则使用第一个角色
        const currentRoleId =
          userStore.currentRoleId || userStore.userInfo.roles[0]?.id;

        console.log("Sidebar菜单加载 - 使用角色:", {
          userId: userStore.userInfo.id,
          roleId: currentRoleId,
        });

        // 加载菜单
        await menuStore.getUserMenuPermissions(
          userStore.userInfo.id,
          currentRoleId,
        );

        // 预注册菜单路由
        preRegisterMenuRoutes(menuStore.menuList);

        // 初始化菜单展开状态
        updateOpenedMenus();
      }
    } else {
      console.log("Sidebar组件初始化 - 用户未登录，跳过菜单加载");
    }
  } catch (error) {
    console.error("加载菜单失败:", error);
    ElMessage.error("加载菜单失败，请刷新页面重试");
  }
};

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path;
});

// 更新菜单展开状态 - 合并而不是替换
const updateOpenedMenus = () => {
  if (menuStore.menuList.length > 0) {
    // 获取当前路径应该展开的菜单
    const currentOpenKeys = menuStore.getDefaultOpenKeys(route.path);

    // 合并现有展开状态和新的展开状态
    const mergedKeys = [
      ...new Set([...openedMenuKeys.value, ...currentOpenKeys]),
    ];
    openedMenuKeys.value = mergedKeys;

    console.log("更新菜单展开状态:", {
      currentPath: route.path,
      currentOpenKeys,
      existingKeys: openedMenuKeys.value,
      mergedKeys,
    });
  }
};

// 监听路由变化，合并展开状态
watch(
  () => route.path,
  (newPath, oldPath) => {
    console.log(`路由变化: ${oldPath} -> ${newPath}`);
    updateOpenedMenus();
  },
  { immediate: false },
);

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

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  // 如果不是路由路径，则不进行跳转
  if (!index.startsWith("/")) return;

  // 查找当前点击的菜单项
  const menuItem = MenuUtils.findMenu(
    menuStore.menuList,
    (menu) => menu.path === index,
  );

  if (menuItem) {
    // 首先尝试通过path进行跳转（推荐方式）
    // 找到路由并临时设置标题
    const matchedRoute = router
      .getRoutes()
      .find((route) => route.path === menuItem.path);
    if (matchedRoute && menuItem.name) {
      // 确保meta对象存在
      if (!matchedRoute.meta) matchedRoute.meta = {};
      // 设置标题为菜单名称
      matchedRoute.meta.title = menuItem.name;
    }

    router.push(menuItem.path).catch(() => {
      // 尝试查看是否有组件路径
      if (menuItem.component) {
        // 先尝试使用组件路径直接跳转
        router.push(menuItem.component).catch(() => {
          // 如果组件路径跳转也失败，尝试动态添加路由
          import("@/router").then(({ addDynamicRoute }) => {
            // 添加路由时确保组件路径是字符串
            const componentStr = String(menuItem.component);
            // 重要：传递菜单名称，确保标签页显示正确的标题
            const added = addDynamicRoute(
              menuItem.path,
              componentStr,
              menuItem.name,
            );

            if (added) {
              // 路由添加成功，重新尝试跳转
              router.push(menuItem.path).catch(() => {
                ElMessage.warning("该功能正在开发中...");
              });
            } else {
              ElMessage.warning("该功能正在开发中...");
            }
          });
        });
      } else if (menuItem.children && menuItem.children.length > 0) {
        // 没有组件路径时，可能是目录，查找第一个子菜单进行跳转
        const firstChild = menuItem.children[0];
        router.push(firstChild.path).catch(() => {
          ElMessage.warning("该功能正在开发中...");
        });
      } else {
        ElMessage.warning("该功能正在开发中...");
      }
    });
  } else {
    ElMessage.warning("菜单路径不存在");
  }
};

// 组件挂载时初始化菜单
onMounted(() => {
  initMenu();
});
</script>

<style lang="scss" scoped>
.sidebar-container {
  height: 100%;
  background-color: #304156;
  border-right: 1px solid var(--el-border-color-light);
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  // 正常状态宽度
  width: var(--sidebar-width);

  &.mobile-hidden {
    transform: translateX(-100%);
  }

  // 折叠状态宽度
  &.collapsed {
    width: var(--sidebar-collapsed-width);

    .logo-container .logo .logo-text {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }
  }
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #263445;
  padding: 0 15px;
  flex-shrink: 0;

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      white-space: nowrap;
      opacity: 1;
      transition: opacity 0.3s ease;
    }
  }
}

.menu-scrollbar {
  flex: 1;

  :deep(.el-scrollbar__view) {
    height: 100%;
  }

  :deep(.el-menu) {
    border: none;
    height: 100%;
    overflow: visible;

    // 优化菜单项的间距和排版
    .el-menu-item,
    .el-sub-menu__title {
      height: 48px;
      line-height: 48px;
      transition: all 0.3s ease;

      // 确保文字有足够的显示空间
      .menu-title {
        max-width: calc(100% - 60px); // 预留图标和箭头的空间
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    // 子菜单的特殊处理
    .el-sub-menu {
      .el-menu {
        background-color: #263445;
      }

      // 二级菜单
      .el-sub-menu {
        .el-sub-menu__title {
          font-size: 13px;
          padding-left: 40px !important;
          background-color: #263445;
        }

        .el-menu-item {
          font-size: 13px;
          padding-left: 60px !important;
          background-color: #263445;
        }

        // 三级菜单
        .el-sub-menu {
          .el-sub-menu__title {
            font-size: 12px;
            padding-left: 60px !important;
            background-color: #1f2d3d;
          }

          .el-menu-item {
            font-size: 12px;
            padding-left: 80px !important;
            background-color: #1f2d3d;
          }
        }
      }
    }
  }
}

.debug-info {
  padding: 10px;
  background-color: #409eff;
  color: white;
  font-size: 12px;
  margin: 10px;
  border-radius: 4px;

  p {
    margin: 2px 0;
  }
}

.menu-loading,
.menu-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: #bfcbd9;
  font-size: 14px;

  .el-icon {
    font-size: 18px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1001;
    height: 100vh;
    min-width: 260px; // 移动端稍微窄一些，但也要能显示完整菜单
    max-width: 280px;
  }
}
</style>
