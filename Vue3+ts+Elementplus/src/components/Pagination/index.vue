<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page="currentPage"
      :page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  total: number;
  page?: number;
  limit?: number;
  pageSizes?: number[];
  layout?: string;
  background?: boolean;
  autoScroll?: boolean;
  hidden?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  limit: 20,
  pageSizes: () => [10, 20, 30, 50],
  layout: "total, sizes, prev, pager, next, jumper",
  background: true,
  autoScroll: true,
  hidden: false,
});

const emit = defineEmits<{
  pagination: [data: { page: number; limit: number }];
  "update:page": [page: number];
  "update:limit": [limit: number];
}>();

const currentPage = computed({
  get() {
    return props.page;
  },
  set(val: number) {
    emit("update:page", val);
  },
});

const pageSize = computed({
  get() {
    return props.limit;
  },
  set(val: number) {
    emit("update:limit", val);
  },
});

function handleSizeChange(val: number) {
  emit("pagination", { page: currentPage.value, limit: val });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
}

function handleCurrentChange(val: number) {
  emit("pagination", { page: val, limit: pageSize.value });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
}

function scrollTo(element: number, duration: number) {
  if (typeof window === "undefined") return;
  if (!duration) {
    window.scrollTo(0, element);
    return;
  }
  const cosParameter = (window.pageYOffset - element) / 2;
  let scrollCount = 0;
  let oldTimestamp: number | null = null;
  function step(newTimestamp: number) {
    if (oldTimestamp !== null) {
      scrollCount += (Math.PI * (newTimestamp - oldTimestamp)) / duration;
      if (scrollCount >= Math.PI) {
        window.scrollTo(0, element);
        return;
      }
      window.scrollTo(
        0,
        Math.round(
          cosParameter + cosParameter * Math.cos(scrollCount) + element,
        ),
      );
    }
    oldTimestamp = newTimestamp;
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
