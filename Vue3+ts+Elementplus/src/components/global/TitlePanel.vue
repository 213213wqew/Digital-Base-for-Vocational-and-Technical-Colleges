<template>
  <div class="title-panel">
    <div class="title-panel__header">
      <div class="title-panel__title">
        <slot name="icon">
          <i v-if="icon" :class="icon"></i>
        </slot>
        <span>{{ title }}</span>
      </div>
      <div class="title-panel__extra">
        <slot name="extra"></slot>
      </div>
    </div>
    <div class="title-panel__body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  /** 标题 */
  title: {
    type: String,
    required: true,
  },
  /** 图标类名 */
  icon: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.title-panel {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    border-bottom: 1px solid #ebeef5;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    display: flex;
    align-items: center;

    i {
      margin-right: 8px;
      font-size: 18px;
    }
  }

  &__body {
    padding: 15px;
  }
}
</style>
