<template>
  <div class="top-right-btn" :style="style">
    <el-row>
      <el-col :span="24">
        <el-tooltip
          class="item"
          effect="dark"
          :content="showSearch ? '隐藏搜索' : '显示搜索'"
          placement="top"
          v-if="search"
        >
          <el-button size="small" circle icon="Search" @click="toggleSearch" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="small" circle icon="Refresh" @click="refresh" />
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="显示/隐藏"
          placement="top"
          v-if="columns"
        >
          <el-button size="small" circle icon="Menu" @click="showColumn" />
        </el-tooltip>
      </el-col>
    </el-row>
    <el-drawer v-model="open" title="显示/隐藏" append-to-body size="200px">
      <el-transfer
        :titles="['显示', '隐藏']"
        v-model="value"
        :data="columns"
        @change="dataChange"
      ></el-transfer>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  showSearch?: boolean;
  columns?: any[];
  search?: boolean;
  gutter?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showSearch: true,
  columns: () => [],
  search: true,
  gutter: 10,
});

const emit = defineEmits<{
  "update:showSearch": [value: boolean];
  queryTable: [];
}>();

const open = ref(false);
const value = ref<any[]>([]);

const style = computed(() => {
  const ret: any = {};
  if (props.gutter) {
    ret.marginRight = props.gutter / 2 + "px";
  }
  return ret;
});

function toggleSearch() {
  emit("update:showSearch", !props.showSearch);
}

function refresh() {
  emit("queryTable");
}

function showColumn() {
  open.value = true;
}

function dataChange() {
  // 处理列显示/隐藏变化
}
</script>

<style lang="scss" scoped>
.top-right-btn {
  position: relative;
  float: right;
  margin-left: 10px;
}
</style>
