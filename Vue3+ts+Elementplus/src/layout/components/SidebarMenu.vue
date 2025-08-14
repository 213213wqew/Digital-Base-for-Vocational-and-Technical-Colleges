<template>
  <template v-for="menu in menuList" :key="menu.id">
    <!-- 单级菜单 -->
    <el-tooltip
      v-if="menu.type === 'menu'"
      :content="menu.name || '未命名菜单'"
      :disabled="!needTooltip(menu.name)"
      placement="right"
      :show-after="500"
      effect="dark"
    >
      <el-menu-item :index="menu.path" class="custom-menu-item">
        <el-icon><component :is="menu.icon || 'Document'" /></el-icon>
        <template #title>
          <span class="menu-title" :title="menu.name || '未命名菜单'">
            {{ menu.name || "未命名菜单" }}
          </span>
        </template>
      </el-menu-item>
    </el-tooltip>

    <!-- 多级菜单 -->
    <el-sub-menu
      v-else-if="menu.type === 'catalog' && menu.children?.length"
      :index="String(menu.id)"
      popper-class="sidebar-submenu"
      :teleported="isFirstLevel"
      :show-timeout="0"
      :hide-timeout="0"
      class="custom-submenu"
    >
      <template #title>
        <el-icon><component :is="menu.icon || 'Folder'" /></el-icon>
        <el-tooltip
          :content="menu.name || '未命名目录'"
          :disabled="!needTooltip(menu.name)"
          placement="right"
          :show-after="500"
          effect="dark"
        >
          <span class="menu-title" :title="menu.name || '未命名目录'">
            {{ menu.name || "未命名目录" }}
          </span>
        </el-tooltip>
      </template>

      <!-- 递归渲染子菜单 -->
      <sidebar-menu :menu-list="menu.children" :is-first-level="false" />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";

const appStore = useAppStore();

// 菜单项接口定义
interface MenuItem {
  id: string | number;
  name: string;
  path: string;
  type: "menu" | "catalog" | string;
  icon?: string;
  children?: MenuItem[];
  status?: number | string;
  visible?: number | string;
  permission?: string;
}

// 定义props
const props = defineProps({
  menuList: {
    type: Array as () => MenuItem[],
    required: true,
  },
  isFirstLevel: {
    type: Boolean,
    default: true,
  },
});

// 判断是否需要显示tooltip（文字过长时）
const needTooltip = (text: string) => {
  if (!text) return false;

  // 如果侧边栏折叠，总是显示tooltip
  if (!appStore.sidebarOpened) return true;

  // 根据菜单层级和文字长度判断
  // 一级菜单：超过8个字符显示tooltip
  // 二级及以下菜单：超过6个字符显示tooltip
  const maxLength = props.isFirstLevel ? 8 : 6;
  return text.length > maxLength;
};

// 使用 defineOptions 定义组件名，用于递归引用
defineOptions({
  name: "SidebarMenu",
});
</script>

<style lang="scss" scoped>
.custom-menu-item,
.custom-submenu {
  .menu-title {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.2;
    vertical-align: middle;
  }
}

:deep(.el-sub-menu) {
  &.is-opened {
    > .el-sub-menu__title {
      color: #f4f4f5 !important;
    }
  }
}

:deep(.el-sub-menu__title) {
  &:hover {
    background-color: #263445 !important;
  }

  // 确保标题文字不会被截断
  .menu-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

:deep(.el-menu-item) {
  &:hover {
    background-color: #263445 !important;
  }

  &.is-active {
    background-color: #409eff !important;
    color: #ffffff !important;
  }

  // 调整菜单项的内边距，为更长的文字提供更多空间
  padding: 0 20px !important;

  .menu-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

// 折叠菜单时的悬浮样式
:deep(.el-menu--vertical) {
  .el-menu--popup {
    background-color: #1f2d3d !important;

    .el-menu-item {
      background-color: #1f2d3d;

      &:hover {
        background-color: #001528 !important;
      }

      &.is-active {
        background-color: #409eff !important;
      }
    }
  }
}

// 多层级菜单的缩进优化
:deep(.el-sub-menu .el-sub-menu) {
  .el-sub-menu__title {
    padding-left: 40px !important;

    .menu-title {
      font-size: 13px; // 子级菜单稍微小一点
    }
  }

  .el-menu-item {
    padding-left: 60px !important;
    font-size: 13px; // 子级菜单稍微小一点
  }
}

// 三层及更深的菜单
:deep(.el-sub-menu .el-sub-menu .el-sub-menu) {
  .el-sub-menu__title {
    padding-left: 60px !important;

    .menu-title {
      font-size: 12px; // 更深层级更小字体
    }
  }

  .el-menu-item {
    padding-left: 80px !important;
    font-size: 12px; // 更深层级更小字体
  }
}
</style>
