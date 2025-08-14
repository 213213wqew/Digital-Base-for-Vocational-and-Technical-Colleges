<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-bind="$attrs"
  />
  <svg v-else class="svg-icon" aria-hidden="true" v-bind="$attrs">
    <use :href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  /** 图标名称或外部链接 */
  icon: string;
  /** 图标颜色 */
  color?: string;
  /** 图标大小 */
  size?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  color: "",
  size: 16,
});

/** 是否外部图标 */
const isExternal = computed(() => /^(https?:|mailto:|tel:)/.test(props.icon));

/** 外部图标样式 */
const styleExternalIcon = computed(() => ({
  mask: `url(${props.icon}) no-repeat 50% 50%`,
  "-webkit-mask": `url(${props.icon}) no-repeat 50% 50%`,
  "mask-size": `${props.size}px`,
  "-webkit-mask-size": `${props.size}px`,
  "background-color": props.color || "currentColor",
  display: "inline-block",
  width: `${props.size}px`,
  height: `${props.size}px`,
}));

/** 内部图标名称 */
const iconName = computed(() => `#icon-${props.icon}`);
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: -0.15em;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
