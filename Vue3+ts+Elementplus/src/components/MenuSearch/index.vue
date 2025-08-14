<template>
  <div class="menu-search">
    <el-tooltip content="菜单搜索" placement="bottom">
      <el-button
        class="search-btn"
        :icon="Search"
        circle
        text
        @click="openSearch"
      />
    </el-tooltip>

    <!-- 搜索对话框 -->
    <el-dialog
      v-model="searchVisible"
      title="菜单搜索"
      width="600px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      @close="closeSearch"
      class="menu-search-dialog"
    >
      <div class="search-container">
        <el-input
          ref="searchInputRef"
          v-model="searchKeyword"
          placeholder="请输入菜单名称或路径进行搜索..."
          size="large"
          clearable
          @input="handleSearch"
          @keydown.enter="handleEnter"
          @keydown.up.prevent="handleArrowUp"
          @keydown.down.prevent="handleArrowDown"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <!-- 搜索结果 -->
        <div class="search-results" v-if="searchResults.length > 0">
          <div class="results-header">
            <span>搜索结果 ({{ searchResults.length }})</span>
            <span class="tip">使用 ↑↓ 键选择，Enter 键跳转</span>
          </div>
          <div class="results-list">
            <div
              v-for="(item, index) in searchResults"
              :key="item.id"
              class="result-item"
              :class="{ active: selectedIndex === index }"
              @click="navigateToMenu(item)"
              @mouseenter="selectedIndex = index"
            >
              <div class="item-icon">
                <el-icon><component :is="item.icon || 'Document'" /></el-icon>
              </div>
              <div class="item-content">
                <div
                  class="item-title"
                  v-html="highlightKeyword(item.name)"
                ></div>
                <div class="item-path">{{ item.path }}</div>
                <div class="item-breadcrumb" v-if="item.breadcrumb">
                  {{ item.breadcrumb }}
                </div>
              </div>
              <div class="item-type">
                <el-tag
                  :type="item.type === 'menu' ? 'primary' : 'info'"
                  size="small"
                >
                  {{ item.type === "menu" ? "菜单" : "目录" }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 无结果提示 -->
        <div
          class="no-results"
          v-else-if="searchKeyword && searchResults.length === 0"
        >
          <el-empty description="未找到相关菜单" :image-size="80">
            <template #image>
              <el-icon size="80" color="#c0c4cc"><Search /></el-icon>
            </template>
          </el-empty>
        </div>

        <!-- 搜索提示 -->
        <div class="search-tips" v-else>
          <div class="tips-content">
            <h4>搜索提示</h4>
            <ul>
              <li>输入菜单名称或路径进行搜索</li>
              <li>支持模糊匹配，不区分大小写</li>
              <li>使用方向键选择结果，回车键快速跳转</li>
              <li>按 ESC 键关闭搜索框</li>
            </ul>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeSearch">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useMenuStore } from "@/store/modules/menu";
import { Search } from "@element-plus/icons-vue";
import type { MenuItem } from "@/types/menu";

const router = useRouter();
const menuStore = useMenuStore();

// 响应式数据
const searchVisible = ref(false);
const searchKeyword = ref("");
const selectedIndex = ref(0);
const searchInputRef = ref();

// 搜索结果接口
interface SearchResult extends MenuItem {
  breadcrumb?: string;
}

// 计算搜索结果
const searchResults = computed<SearchResult[]>(() => {
  if (!searchKeyword.value.trim()) {
    return [];
  }

  const keyword = searchKeyword.value.toLowerCase().trim();
  const results: SearchResult[] = [];

  // 递归搜索菜单
  const searchInMenus = (menus: MenuItem[], parentBreadcrumb = "") => {
    menus.forEach((menu) => {
      const menuName = menu.name?.toLowerCase() || "";
      const menuPath = menu.path?.toLowerCase() || "";

      // 检查是否匹配
      if (menuName.includes(keyword) || menuPath.includes(keyword)) {
        results.push({
          ...menu,
          breadcrumb: parentBreadcrumb,
        });
      }

      // 递归搜索子菜单
      if (menu.children && menu.children.length > 0) {
        const currentBreadcrumb = parentBreadcrumb
          ? `${parentBreadcrumb} > ${menu.name}`
          : menu.name;
        searchInMenus(menu.children, currentBreadcrumb);
      }
    });
  };

  searchInMenus(menuStore.menuList);

  // 按匹配度排序（名称完全匹配优先）
  return results.sort((a, b) => {
    const aNameMatch = a.name?.toLowerCase().indexOf(keyword) === 0;
    const bNameMatch = b.name?.toLowerCase().indexOf(keyword) === 0;

    if (aNameMatch && !bNameMatch) return -1;
    if (!aNameMatch && bNameMatch) return 1;

    return a.name?.localeCompare(b.name || "") || 0;
  });
});

// 打开搜索
const openSearch = async () => {
  searchVisible.value = true;
  await nextTick();
  searchInputRef.value?.focus();
};

// 关闭搜索
const closeSearch = () => {
  searchVisible.value = false;
  searchKeyword.value = "";
  selectedIndex.value = 0;
};

// 处理搜索
const handleSearch = () => {
  selectedIndex.value = 0;
};

// 处理回车键
const handleEnter = () => {
  if (searchResults.value.length > 0 && selectedIndex.value >= 0) {
    navigateToMenu(searchResults.value[selectedIndex.value]);
  }
};

// 处理上箭头键
const handleArrowUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  } else {
    selectedIndex.value = searchResults.value.length - 1;
  }
};

// 处理下箭头键
const handleArrowDown = () => {
  if (selectedIndex.value < searchResults.value.length - 1) {
    selectedIndex.value++;
  } else {
    selectedIndex.value = 0;
  }
};

// 跳转到菜单
const navigateToMenu = (menu: SearchResult) => {
  if (menu.path) {
    router.push(menu.path);
    closeSearch();
  }
};

// 高亮关键词
const highlightKeyword = (text: string) => {
  if (!searchKeyword.value.trim()) {
    return text;
  }

  const keyword = searchKeyword.value.trim();
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
};

// 键盘快捷键
const handleKeydown = (event: KeyboardEvent) => {
  // Ctrl/Cmd + K 打开搜索
  if ((event.ctrlKey || event.metaKey) && event.key === "k") {
    event.preventDefault();
    openSearch();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style lang="scss" scoped>
.menu-search {
  .search-btn {
    font-size: 18px;
    color: var(--el-text-color-regular);

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-fill-color-light);
    }
  }
}

:deep(.menu-search-dialog) {
  .el-dialog__header {
    padding: 20px 20px 10px;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .el-dialog__body {
    padding: 20px;
    max-height: 60vh;
    overflow: hidden;
  }

  .el-dialog__footer {
    padding: 10px 20px 20px;
    border-top: 1px solid var(--el-border-color-light);
  }
}

.search-container {
  .el-input {
    margin-bottom: 20px;

    :deep(.el-input__wrapper) {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

.search-results {
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .tip {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .results-list {
    max-height: 400px;
    overflow-y: auto;

    .result-item {
      display: flex;
      align-items: center;
      padding: 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;

      &:hover,
      &.active {
        background-color: var(--el-fill-color-light);
        border-color: var(--el-color-primary-light-7);
      }

      &.active {
        background-color: var(--el-color-primary-light-9);
      }

      .item-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--el-fill-color-lighter);
        border-radius: 6px;
        margin-right: 12px;

        .el-icon {
          font-size: 16px;
          color: var(--el-color-primary);
        }
      }

      .item-content {
        flex: 1;
        min-width: 0;

        .item-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;

          :deep(mark) {
            background-color: var(--el-color-warning-light-7);
            color: var(--el-color-warning-dark-2);
            padding: 1px 2px;
            border-radius: 2px;
          }
        }

        .item-path {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          margin-bottom: 2px;
        }

        .item-breadcrumb {
          font-size: 11px;
          color: var(--el-text-color-placeholder);
        }
      }

      .item-type {
        margin-left: 12px;
      }
    }
  }
}

.no-results {
  text-align: center;
  padding: 40px 20px;
}

.search-tips {
  padding: 20px;
  background-color: var(--el-fill-color-extra-light);
  border-radius: 8px;

  .tips-content {
    h4 {
      margin: 0 0 12px 0;
      color: var(--el-text-color-primary);
      font-size: 14px;
    }

    ul {
      margin: 0;
      padding-left: 20px;

      li {
        margin-bottom: 6px;
        font-size: 13px;
        color: var(--el-text-color-regular);
        line-height: 1.4;
      }
    }
  }
}

.dialog-footer {
  text-align: right;
}
</style>
