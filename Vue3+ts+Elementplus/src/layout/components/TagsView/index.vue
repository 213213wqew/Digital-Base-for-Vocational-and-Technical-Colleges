<template>
  <div class="tags-view-container">
    <el-scrollbar class="tags-view-scrollbar" ref="scrollbarRef">
      <div class="tags-view-wrapper">
        <router-link
          v-for="tag in visitedViews"
          :key="tag.path || ''"
          :to="tag.path || ''"
          class="tags-view-item"
          :class="isActive(tag) ? 'active' : ''"
          @contextmenu.prevent="openMenu($event, tag)"
        >
          <el-icon v-if="tag.meta?.icon" class="tags-icon" :size="14">
            <component :is="tag.meta?.icon" />
          </el-icon>
          <span>{{ getTagTitle(tag) }}</span>
          <el-icon
            v-if="!isAffix(tag)"
            class="close-icon"
            @click.prevent.stop="closeSelectedTag(tag)"
          >
            <component :is="'Close'" />
          </el-icon>
        </router-link>
      </div>
    </el-scrollbar>

    <!-- 右键菜单 -->
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        <el-icon><component :is="'Refresh'" /></el-icon>
        <span>刷新页面</span>
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <el-icon><component :is="'Close'" /></el-icon>
        <span>关闭当前</span>
      </li>
      <li @click="closeOtherTags">
        <el-icon><component :is="'CircleClose'" /></el-icon>
        <span>关闭其他</span>
      </li>
      <li @click="closeAllTags(selectedTag)">
        <el-icon><component :is="'Close'" /></el-icon>
        <span>关闭所有</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from "vue-router";
import { useTagsViewStore } from "@/store/modules/tagsView";
import { useMenuStore } from "@/store/modules/menu";

const route = useRoute();
const router = useRouter();
const tagsViewStore = useTagsViewStore();
const menuStore = useMenuStore();

// 访问过的视图
const visitedViews = computed(() => tagsViewStore.visitedViews);

// 滚动条引用
const scrollbarRef = ref();

// 右键菜单相关
const visible = ref(false);
const top = ref(0);
const left = ref(0);
const selectedTag = ref<RouteLocationNormalizedLoaded>(
  {} as RouteLocationNormalizedLoaded,
);

// 从菜单获取标题
const getTagTitle = (tag: any) => {
  // 首先尝试使用路由meta中的标题
  if (tag.meta?.title) {
    return tag.meta.title;
  }

  // 如果路由meta中没有标题，尝试从菜单中获取
  const menuItem = menuStore.findMenuByPath(tag.path);
  if (menuItem && menuItem.name) {
    return menuItem.name;
  }

  // 最后回退到路径
  return tag.path;
};

// 判断标签是否激活
const isActive = (tag: any) => {
  return tag.path === route.path;
};

// 判断标签是否固定
const isAffix = (tag: any) => {
  return tag.meta?.affix === true;
};

// 添加标签
const addTags = () => {
  const { name } = route;
  if (name) {
    tagsViewStore.addVisitedView(route);
  }
  return false;
};

// 移动到当前标签
const moveToCurrentTag = async () => {
  await nextTick();

  if (!scrollbarRef.value) return;

  const tags = document.querySelectorAll(".tags-view-item");

  for (const tag of tags) {
    if ((tag as HTMLElement).classList.contains("active")) {
      // 计算滚动位置
      const container = scrollbarRef.value.$el.querySelector(
        ".el-scrollbar__wrap",
      );
      const tagOffsetLeft = (tag as HTMLElement).offsetLeft;
      const tagWidth = (tag as HTMLElement).offsetWidth;

      // 如果标签不在可视区域内，则滚动到标签位置
      if (tagOffsetLeft < container.scrollLeft) {
        container.scrollLeft = tagOffsetLeft - 10;
      } else if (
        tagOffsetLeft + tagWidth >
        container.scrollLeft + container.offsetWidth
      ) {
        container.scrollLeft =
          tagOffsetLeft + tagWidth - container.offsetWidth + 15;
      }
      break;
    }
  }
};

// 初始化标签
watch(
  () => route.path,
  () => {
    addTags();
    moveToCurrentTag();
  },
  { immediate: true },
);

// 关闭选中的标签
const closeSelectedTag = (view: any) => {
  tagsViewStore.delVisitedView(view).then(() => {
    if (isActive(view)) {
      toLastView();
    }
  });
};

// 刷新选中的标签
const refreshSelectedTag = (view: any) => {
  tagsViewStore.delCachedView(view).then(() => {
    const { path } = view;
    nextTick(() => {
      router.replace({
        path: "/redirect" + path,
      });
    });
  });
};

// 关闭其他标签
const closeOtherTags = () => {
  tagsViewStore.delOtherViews(selectedTag.value).then(() => {
    moveToCurrentTag();
  });
};

// 关闭所有标签
const closeAllTags = (view: any) => {
  tagsViewStore.delAllViews().then(() => {
    if (isAffix(view)) {
      return;
    }
    toLastView();
  });
};

// 跳转到最后一个标签
const toLastView = () => {
  const latestView = visitedViews.value.slice(-1)[0];
  if (latestView) {
    router.push(latestView.path || "/");
  } else {
    // 如果没有标签，则跳转到首页
    router.push("/");
  }
};

// 打开右键菜单
const openMenu = (e: MouseEvent, tag: any) => {
  const menuMinWidth = 105;
  const offsetLeft = document.body.getBoundingClientRect().left;
  const offsetWidth = document.body.offsetWidth;
  const maxLeft = offsetWidth - menuMinWidth;
  const menuLeft = e.clientX - offsetLeft + 15;

  if (menuLeft > maxLeft) {
    left.value = maxLeft;
  } else {
    left.value = menuLeft;
  }

  top.value = e.clientY;
  visible.value = true;
  selectedTag.value = tag as RouteLocationNormalizedLoaded;
};

// 关闭右键菜单
const closeMenu = () => {
  visible.value = false;
};

// 初始化固定标签
const initTags = () => {
  const routes = router.getRoutes();
  const tags = routes
    .filter((route) => route.meta?.affix)
    .map((route) => {
      return {
        path: route.path,
        name: route.name,
        meta: { ...route.meta },
      };
    });

  for (const tag of tags) {
    if (tag.name) {
      tagsViewStore.addVisitedView(tag as any);
    }
  }
};

// 点击页面时关闭右键菜单
const handleClickOutside = () => {
  closeMenu();
};

onMounted(() => {
  initTags();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
  flex-shrink: 0; /* 防止被压缩 */

  .tags-view-scrollbar {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;

    .tags-view-wrapper {
      padding: 0 4px;
      height: 100%;
      display: flex;
      align-items: center;

      .tags-view-item {
        display: inline-flex;
        align-items: center;
        height: 26px;
        line-height: 26px;
        border: 1px solid var(--el-border-color-light);
        color: var(--el-text-color-regular);
        background: var(--el-bg-color);
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-right: 5px;
        border-radius: 3px;
        text-decoration: none;

        &:first-of-type {
          margin-left: 10px;
        }

        &:last-of-type {
          margin-right: 10px;
        }

        &.active {
          background-color: var(--el-color-primary);
          color: #fff;
          border-color: var(--el-color-primary);

          &::before {
            content: "";
            background: #fff;
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: relative;
            margin-right: 4px;
          }
        }

        .tags-icon {
          margin-right: 4px;
        }

        .close-icon {
          width: 16px;
          height: 16px;
          vertical-align: -3px;
          border-radius: 50%;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          margin-left: 4px;
          transform: scale(0.8);

          &:hover {
            background-color: var(--el-fill-color-dark);
            color: #fff;
          }
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: var(--el-bg-color);
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: var(--el-text-color-primary);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        background: var(--el-fill-color-light);
      }

      .el-icon {
        margin-right: 5px;
      }
    }
  }
}
</style>
