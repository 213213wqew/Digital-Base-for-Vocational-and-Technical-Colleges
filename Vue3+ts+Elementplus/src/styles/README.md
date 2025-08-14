# 样式文件管理说明

## 概述

本项目采用模块化的样式管理方式，将样式文件从Vue组件中分离出来，统一存放在 `src/styles` 目录下，便于维护和复用。

## 文件结构

```
src/styles/
├── data-manage.scss          # 数据管理模块统一样式
├── element-overrides.scss    # Element Plus 组件样式覆盖
├── element-plus.scss         # Element Plus 基础样式
├── components.scss           # 通用组件样式
├── dark-theme.scss          # 深色主题样式
├── _variables.scss          # 样式变量定义
├── _mixins.scss             # 样式混入
├── layout.scss              # 布局样式
├── reset.scss               # 样式重置
└── index.scss               # 样式入口文件
```

## 新增文件说明

### data-manage.scss

**位置**: `src/styles/data-manage.scss`

**用途**: 数据管理模块的统一样式文件，包含信息化系统建设数据页面的所有样式

**特点**:
- 采用 SCSS 语法，支持嵌套和变量
- 包含完整的响应式设计
- 使用 `:deep()` 选择器处理 Element Plus 组件样式
- 模块化的样式组织，便于维护

**主要样式模块**:
- `.system-building-management` - 主容器样式
- `.search-card` - 搜索区域样式
- `.table-card` - 表格区域样式
- `.pagination-wrapper` - 分页组件样式
- `.system-building-dialog` - 对话框样式
- `.system-building-form` - 表单样式
- `.system-building-detail` - 详情样式

## 使用方式

### 在Vue组件中引入样式

```vue
<script setup lang="ts">
// 引入统一样式
import "@/styles/data-manage.scss";

// 其他代码...
</script>

<style scoped>
/* 样式已迁移到外部文件中 */
</style>
```

### 样式优先级

1. 外部样式文件（`data-manage.scss`）
2. 组件内联样式（`<style scoped>`）
3. Element Plus 默认样式

## 样式规范

### 命名规范
- 使用 BEM 命名法
- 类名使用 kebab-case
- 组件样式使用组件名作为前缀

### 响应式设计
- 大屏幕 (max-width: 1400px)
- 中等屏幕 (max-width: 1200px)
- 小屏幕 (max-width: 768px)

### 颜色规范
- 主色调: `#409eff`
- 成功色: `#67c23a`
- 警告色: `#e6a23c`
- 危险色: `#f56c6c`
- 信息色: `#909399`

## 维护说明

### 添加新样式
1. 在对应的样式文件中添加新样式
2. 遵循现有的命名规范
3. 添加必要的注释说明

### 修改现有样式
1. 直接修改对应的样式文件
2. 注意保持向后兼容性
3. 测试不同屏幕尺寸下的显示效果

### 样式复用
1. 将通用样式提取到 `_mixins.scss`
2. 将颜色、字体等变量定义在 `_variables.scss`
3. 在需要的地方引入混入和变量

## 注意事项

1. **样式隔离**: 使用 `scoped` 属性确保样式不会影响其他组件
2. **深度选择器**: 使用 `:deep()` 选择器修改 Element Plus 组件样式
3. **性能优化**: 避免过度嵌套，合理使用选择器
4. **浏览器兼容**: 考虑不同浏览器的兼容性问题

## 迁移记录

### 2024年样式重构
- 将 `index.vue` 中的内联样式迁移到 `data-manage.scss`
- 保持原有样式效果不变
- 优化样式组织结构
- 增强代码可维护性

## 相关文件

- `src/views/data/data_manage/zygxx/ods_xxhxtjssj/index.vue` - 信息化系统建设数据页面
- `src/styles/data-manage.scss` - 数据管理模块统一样式 