# 菜单系统说明文档

## 概述

本项目实现了一个完整的动态菜单系统，支持权限控制、多级菜单、图标显示等功能。菜单数据采用JSON结构存储，可以轻松扩展和维护。

## 菜单数据结构

### JSON 数据源
- 文件位置：`src/data/menu.json`
- 包含 13 个主要功能模块
- 总计 55+ 个菜单项

### 菜单分类

1. **仪表盘** - `/dashboard`
   - 系统概览和数据统计

2. **用户管理** - `/user`
   - 用户列表 - `/user/list`
   - 用户资料 - `/user/profile`
   - 用户设置 - `/user/settings`

3. **角色管理** - `/role`
   - 角色列表 - `/role/list`
   - 角色权限 - `/role/permissions`
   - 角色分配 - `/role/assignment`

4. **权限管理** - `/permission`
   - 权限列表 - `/permission/list`
   - 菜单权限 - `/permission/menu`
   - 按钮权限 - `/permission/button`
   - 数据权限 - `/permission/data`

5. **组织架构** - `/organization`
   - 部门管理 - `/organization/department`
   - 职位管理 - `/organization/position`
   - 组织结构 - `/organization/structure`

6. **系统监控** - `/monitor`
   - 在线用户 - `/monitor/online`
   - 系统日志 - `/monitor/logs`
   - 性能监控 - `/monitor/performance`
   - 服务器监控 - `/monitor/server`
   - 应用监控 - `/monitor/application`

7. **系统工具** - `/tools`
   - 代码生成 - `/tools/generator`
   - 接口文档 - `/tools/swagger`
   - 构建工具 - `/tools/build`
   - 缓存管理 - `/tools/cache`
   - 数据库管理 - `/tools/database`
   - 定时任务 - `/tools/schedule`

8. **数据管理** - `/data`
   - 数据备份 - `/data/backup`
   - 数据导入 - `/data/import`
   - 数据导出 - `/data/export`
   - 数据统计 - `/data/statistics`
   - 数据清理 - `/data/cleanup`

9. **消息中心** - `/message`
   - 系统通知 - `/message/notice`
   - 系统公告 - `/message/announcement`
   - 站内信 - `/message/mail`
   - 消息模板 - `/message/template`

10. **系统设置** - `/system`
    - 系统配置 - `/system/config`
    - 字典管理 - `/system/dict`
    - 参数设置 - `/system/params`
    - 主题设置 - `/system/theme`
    - 操作日志 - `/system/log`

11. **财务管理** - `/finance`
    - 费用管理 - `/finance/expense`
    - 收入管理 - `/finance/income`
    - 财务报表 - `/finance/report`

12. **内容管理** - `/content`
    - 文章管理 - `/content/article`
    - 分类管理 - `/content/category`
    - 标签管理 - `/content/tags`
    - 媒体库 - `/content/media`

13. **帮助中心** - `/help`
    - 使用文档 - `/help/docs`
    - 常见问题 - `/help/faq`
    - 联系我们 - `/help/contact`
    - 关于系统 - `/help/about`
    - 版本更新 - `/help/changelog`

## 技术实现

### 核心文件

1. **类型定义** - `src/types/menu.ts`
   - MenuItem 接口定义
   - MenuTree 树形结构
   - RouteMenu 路由配置
   - 查询参数接口

2. **工具函数** - `src/utils/menu.ts`
   - MenuUtils 工具类
   - 权限过滤功能
   - 菜单树构建
   - 面包屑导航
   - 路由配置转换

3. **状态管理** - `src/store/modules/menu.ts`
   - Pinia store
   - 菜单数据管理
   - 权限控制
   - 缓存机制

4. **API 接口** - `src/api/menu.ts`
   - 菜单 CRUD 操作
   - 权限获取
   - 模拟数据接口

5. **组件实现** - `src/layout/components/Sidebar.vue`
   - 动态菜单渲染
   - 图标组件集成
   - 响应式展开/收起

### 特性功能

#### 1. 权限控制
- 基于权限标识的菜单过滤
- 支持多级权限验证
- 动态权限分配

#### 2. 动态菜单
- JSON 数据驱动
- 支持多级菜单嵌套
- 图标动态加载

#### 3. 路由集成
- 自动路由配置生成
- 通配符路由处理
- 占位页面显示

#### 4. 用户体验
- 菜单状态持久化
- 默认展开当前路径
- 响应式设计

#### 5. 开发友好
- TypeScript 类型支持
- 完整的工具函数
- 模块化设计
## 使用说明
### 1. 菜单数据配置
```json
{
  "id": 1,
  "name": "菜单名称",
  "path": "/menu/path",
  "icon": "ElementPlusIcon",
  "component": "views/component/path",
  "type": "menu", // menu | catalog | button
  "sort": 1,
  "visible": true,
  "status": 1,
  "permissions": ["permission:data"],
  "meta": {
    "title": "页面标题",
    "requireAuth": true,
    "cache": false
  },
  "children": [] // 子菜单
}
```

### 2. 权限配置
```typescript
// 在组件中设置用户权限
const userPermissions = [
  'dashboard:view',
  'user:view',
  'user:list',
  // ... 更多权限
]
menuStore.setUserPermissions(userPermissions)
```

### 3. 菜单工具函数
```typescript
import { MenuUtils } from '@/utils/menu'

// 权限过滤
const filteredMenus = MenuUtils.filterMenuByPermissions(menuList, permissions)
// 构建面包屑
const breadcrumb = MenuUtils.buildBreadcrumb(menuList, currentPath)
// 查找菜单
const menu = MenuUtils.findMenu(menuList, menu => menu.path === '/user/list')
```
### 4. Store 使用
```typescript
import { useMenuStore } from '@/store/modules/menu'

const menuStore = useMenuStore()

// 初始化菜单
await menuStore.initMenuData()

// 设置权限
menuStore.setUserPermissions(permissions)

// 获取过滤后的菜单
const menuList = menuStore.filteredMenuList
```

## 扩展开发

### 添加新菜单
1. 在 `menu.json` 中添加菜单配置
2. 创建对应的 Vue 组件
3. 在路由中配置路径（可选）
4. 配置相应权限

### 自定义图标
- 支持 Element Plus 内置图标
- 可扩展自定义图标组件
- 动态图标加载

### 权限扩展
- 支持角色权限
- 支持数据权限
- 可集成后端权限系统

## 开发状态

目前所有菜单项都配置了对应的路由，未实现的页面会显示"功能开发中"的占位页面，包含：
- 当前页面信息
- 功能模块介绍
- 开发进度显示
- 相关功能推荐
- 联系信息

## 注意事项

1. **图标引用**：确保使用的图标名称在 Element Plus 中存在
2. **权限命名**：建议使用 `模块:操作` 的命名规范
3. **路由配置**：菜单路径需要与 Vue Router 路由配置保持一致
4. **组件路径**：component 字段指向的组件文件必须存在
5. **数据更新**：菜单数据变更后需要清除浏览器缓存或重新登录

## 演示账号

- 用户名：admin
- 密码：123456
- 权限：超级管理员（所有菜单权限）

---

*此文档会随着功能的完善持续更新*