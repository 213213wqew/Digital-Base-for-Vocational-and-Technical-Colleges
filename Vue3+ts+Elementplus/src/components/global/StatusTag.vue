<template>
  <el-tag
    :type="getStatusType(status)"
    :effect="effect"
    :size="size"
    :class="className"
  >
    {{ getStatusText(status) }}
  </el-tag>
</template>

<script setup lang="ts">
// 使用Element Plus支持的标签类型
type TagType =
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "primary"
  | undefined;

interface Props {
  /** 状态值，接受boolean或者number类型 */
  status: boolean | number;
  /** 状态文本映射，格式为 {值: '文本'} */
  textMap?: Record<string | number, string>;
  /** 状态类型映射，格式为 {值: 'success'|'info'|'warning'|'danger'} */
  typeMap?: Record<string | number, TagType>;
  /** 标签效果 */
  effect?: "light" | "dark" | "plain";
  /** 标签大小 */
  size?: "large" | "default" | "small";
  /** 自定义类名 */
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  textMap: () => ({
    true: "启用",
    false: "禁用",
    1: "启用",
    0: "禁用",
  }),
  typeMap: () =>
    ({
      true: "success",
      false: "info",
      1: "success",
      0: "info",
    }) as Record<string | number, TagType>,
  effect: "light",
  size: "default",
  className: "",
});

/**
 * 获取状态显示文本
 */
const getStatusText = (status: boolean | number): string => {
  const key = String(status);
  return props.textMap[key] || "未知";
};

/**
 * 获取状态显示类型
 */
const getStatusType = (status: boolean | number): TagType => {
  const key = String(status);
  return props.typeMap[key] || "info";
};
</script>
