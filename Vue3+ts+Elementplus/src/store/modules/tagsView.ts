import { defineStore } from "pinia";
import { ref } from "vue";
import type { RouteLocationNormalizedLoaded } from "vue-router";

export interface TagView extends Partial<RouteLocationNormalizedLoaded> {
  title?: string;
  affix?: boolean;
  noCache?: boolean;
}

export const useTagsViewStore = defineStore(
  "tagsView",
  () => {
    // 访问过的视图
    const visitedViews = ref<TagView[]>([]);

    // 缓存的视图
    const cachedViews = ref<string[]>([]);

    // 固定的视图
    const affixTags = ref<TagView[]>([]);

    /**
     * 添加访问视图 s
     * @param view 视图路由
     */
    const addVisitedView = (view: RouteLocationNormalizedLoaded) => {
      // 如果已存在相同路径的标签，则检查是否需要更新
      for (let i = 0; i < visitedViews.value.length; i++) {
        if (visitedViews.value[i].path === view.path) {
          // 如果当前路由有标题，并且与现有标题不同，则更新
          if (
            view.meta?.title &&
            visitedViews.value[i].meta?.title !== view.meta.title
          ) {
            // 创建新对象替换，避免直接修改
            const updatedView = { ...visitedViews.value[i] };
            updatedView.meta = { ...updatedView.meta, title: view.meta.title };
            visitedViews.value[i] = updatedView;
          }
          return;
        }
      }

      // 添加到访问视图
      visitedViews.value.push(
        Object.assign({}, view, {
          title: view.meta?.title || "no-name",
        }) as TagView,
      );

      // 如果需要缓存
      if (view.name && !view.meta?.noCache) {
        addCachedView(view);
      }
    };

    /**
     * 添加缓存视图
     * @param view 视图路由
     */
    const addCachedView = (view: RouteLocationNormalizedLoaded) => {
      if (!view.name) return;
      if (cachedViews.value.includes(view.name as string)) return;
      if (!view.meta?.noCache) {
        cachedViews.value.push(view.name as string);
      }
    };

    /**
     * 删除访问视图
     * @param view 视图路由
     */
    const delVisitedView = (view: RouteLocationNormalizedLoaded) => {
      return new Promise<void>((resolve) => {
        for (const [i, v] of visitedViews.value.entries()) {
          if (v.path === view.path) {
            visitedViews.value.splice(i, 1);
            break;
          }
        }
        resolve();
      });
    };

    /**
     * 删除缓存视图
     * @param view 视图路由
     */
    const delCachedView = (view: RouteLocationNormalizedLoaded) => {
      return new Promise<void>((resolve) => {
        if (!view.name) return resolve();
        const index = cachedViews.value.indexOf(view.name as string);
        if (index > -1) {
          cachedViews.value.splice(index, 1);
        }
        resolve();
      });
    };

    /**
     * 删除其他视图
     * @param view 视图路由
     */
    const delOtherViews = (view: RouteLocationNormalizedLoaded) => {
      return new Promise<void>((resolve) => {
        // 保留当前视图和固定视图
        visitedViews.value = visitedViews.value.filter((v) => {
          return v.meta?.affix || v.path === view.path;
        });

        // 保留当前缓存视图
        if (view.name) {
          const index = cachedViews.value.indexOf(view.name as string);
          if (index > -1) {
            cachedViews.value = cachedViews.value.slice(index, index + 1);
          } else {
            cachedViews.value = [];
          }
        }

        resolve();
      });
    };

    /**
     * 删除所有视图
     * @param keepAffix 是否保留固定标签，默认为true
     */
    const delAllViews = (keepAffix: boolean = true) => {
      return new Promise<void>((resolve) => {
        // 根据参数决定是否保留固定视图
        visitedViews.value = keepAffix
          ? visitedViews.value.filter((tag) => tag.meta?.affix)
          : [];
        cachedViews.value = [];
        resolve();
      });
    };

    /**
     * 更新访问视图
     * @param view 视图路由
     */
    const updateVisitedView = (view: RouteLocationNormalizedLoaded) => {
      for (let v of visitedViews.value) {
        if (v.path === view.path) {
          v = Object.assign(v, view);
          break;
        }
      }
    };

    /**
     * 设置固定标签
     * @param tags 标签列表
     */
    const setAffixTags = (tags: TagView[]) => {
      affixTags.value = tags;
    };

    return {
      visitedViews,
      cachedViews,
      affixTags,
      addVisitedView,
      addCachedView,
      delVisitedView,
      delCachedView,
      delOtherViews,
      delAllViews,
      updateVisitedView,
      setAffixTags,
    };
  },
  {
    persist: {
      key: "tagsView",
      paths: ["visitedViews"],
    },
  },
);
