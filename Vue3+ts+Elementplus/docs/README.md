# 数字基座项目设计规范使用说明

本文档为数字基座项目设计规范的使用说明，旨在帮助开发团队理解并正确使用规范，保持项目的一致性和可维护性。

## 目录

- [设计规范文档](#设计规范文档)
- [样式变量使用](#样式变量使用)
- [组件样式覆盖](#组件样式覆盖)
- [常见问题](#常见问题)

## 设计规范文档

项目的完整设计规范文档位于 `/docs/DESIGN_SPECIFICATION.md`，包含以下内容：

- 颜色系统
- 布局规范
- 组件样式规范
- 字体规范
- 图标规范
- 接口规范
- 最佳实践

开发前请务必阅读设计规范文档，确保对项目的设计标准有全面的了解。

## 样式变量使用

### 导入方式

项目中的样式变量定义在 `/src/styles/variables.scss` 文件中，有两种使用方式：

1. **在 SCSS 文件中导入**:

```scss
@import '@/styles/variables.scss';

.my-component {
  color: $primary-color;
  padding: $spacing-base;
  border-radius: $border-radius-base;
}
```

2. **使用 CSS 变量**:

```css
.my-component {
  color: var(--primary-color);
  padding: var(--spacing-base);
  border-radius: var(--border-radius-base);
}
```

### 变量分类

#### 颜色变量

```scss
// 主色调
$primary-color: #5E77FB;
$primary-color-light: #6D74F2;
$primary-color-lighter: #9088F3;
$primary-color-dark: #4169E1;

// 功能色
$success-color: #67C23A;
$warning-color: #E6A23C;
$danger-color: #F56C6C;
$info-color: #909399;

// 文本色
$text-primary: #303133;
$text-regular: #606266;
$text-secondary: #909399;
$text-placeholder: #C0C4CC;

// 边框色
$border-base: #DCDFE6;
$border-light: #E4E7ED;
```

#### 间距变量

```scss
$spacing-mini: 4px;
$spacing-small: 8px;
$spacing-base: 16px;
$spacing-medium: 24px;
$spacing-large: 32px;
$spacing-xl: 40px;
$spacing-xxl: 48px;
```

#### 字体变量

```scss
$font-size-base: 14px;
$font-size-small: 13px;
$font-size-mini: 12px;
$font-size-medium: 16px;
$font-size-large: 18px;
$font-size-xl: 20px;
```

#### 边框圆角

```scss
$border-radius-small: 4px;
$border-radius-base: 8px;
$border-radius-medium: 12px;
$border-radius-large: 16px;
$border-radius-round: 50%;
```

## 组件样式覆盖

### Element Plus 组件样式覆盖

项目使用 Element Plus 组件库，需要保持统一的样式风格。自定义组件样式有两种方式：

1. **全局样式覆盖**:

在 `/src/styles/element-overrides.scss` 文件中覆盖 Element Plus 的默认样式：

```scss
// 按钮样式覆盖
.el-button--primary {
  height: 40px;
  border-radius: $border-radius-base;
  font-size: $font-size-base;
  font-weight: 500;
  background-color: $primary-color;
  border: none;
}

// 表单样式覆盖
.el-input {
  .el-input__wrapper {
    border-radius: $border-radius-base;
    box-shadow: $box-shadow-light;
  }
}
```

2. **局部样式覆盖**:

在组件中使用 `:deep()` 选择器覆盖 Element Plus 样式：

```vue
<template>
  <div class="custom-form">
    <el-form>
      <!-- ... -->
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.custom-form {
  :deep(.el-form-item) {
    margin-bottom: $spacing-medium;
  }
  
  :deep(.el-input__wrapper) {
    border-radius: $border-radius-medium;
  }
}
</style>
```

### 自定义组件样式指南

创建自定义组件时，请遵循以下样式指南：

1. **使用变量而非硬编码值**:

```scss
// 不推荐
.my-component {
  color: #5E77FB;
  margin: 16px;
  border-radius: 8px;
}

// 推荐
.my-component {
  color: $primary-color;
  margin: $spacing-base;
  border-radius: $border-radius-base;
}
```

2. **使用 scoped 样式避免污染**:

```vue
<style lang="scss" scoped>
/* 组件样式 */
</style>
```

3. **遵循 BEM 命名规范**:

```scss
.my-component {
  &__header {
    // 组件子元素
  }
  
  &__content {
    // 组件子元素
  }
  
  &--active {
    // 组件状态修饰符
  }
}
```

## 响应式设计指南

项目支持响应式设计，使用以下断点变量：

```scss
$xs: 0;          // 超小屏幕
$sm: 768px;      // 小屏幕
$md: 992px;      // 中等屏幕
$lg: 1200px;     // 大屏幕
$xl: 1920px;     // 超大屏幕
```

响应式样式示例：

```scss
.responsive-component {
  padding: $spacing-base;
  
  @media (max-width: $sm) {
    padding: $spacing-small;
    font-size: $font-size-small;
  }
  
  @media (min-width: $md) and (max-width: $lg) {
    padding: $spacing-medium;
  }
  
  @media (min-width: $lg) {
    padding: $spacing-large;
  }
}
```

## 常见问题

### 1. 如何添加新的颜色变量？

如需添加新的颜色变量，请按照以下步骤操作：

1. 在 `/src/styles/variables.scss` 文件中添加新变量
2. 在 `:root` 中添加对应的 CSS 变量
3. 更新设计规范文档，说明新变量的用途和使用场景

### 2. 如何处理特殊页面的样式？

对于特殊页面（如登录页、错误页等），如果样式与全局规范有较大差异，可以：

1. 在页面组件中使用独立样式，但尽量复用颜色和间距变量
2. 记录特殊页面的样式规范，并在设计规范文档中注明

### 3. 样式变量找不到或不生效？

如果样式变量不生效，请检查：

1. 是否正确导入了变量文件
2. 是否在 vite.config.ts 中配置了 SCSS 变量自动导入
3. 检查控制台是否有相关错误信息

## 规范更新流程

随着项目的发展，设计规范可能需要更新。规范更新流程如下：

1. 提出规范变更建议
2. 团队讨论并确认变更
3. 更新设计规范文档和样式变量文件
4. 通知团队成员了解变更内容

设计规范的维护是一个持续的过程，目标是保持项目的一致性和可维护性，提高开发效率。 