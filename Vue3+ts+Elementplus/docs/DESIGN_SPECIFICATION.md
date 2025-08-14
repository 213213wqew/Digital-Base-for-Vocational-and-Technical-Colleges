# 数字基座项目设计规范文档

## 目录
- [1. 颜色系统](#1-颜色系统)
  - [1.1 主色调](#11-主色调)
  - [1.2 辅助色](#12-辅助色)
  - [1.3 功能色](#13-功能色)
  - [1.4 中性色](#14-中性色)
- [2. 布局规范](#2-布局规范)
  - [2.1 基础布局](#21-基础布局)
  - [2.2 响应式断点](#22-响应式断点)
  - [2.3 间距规范](#23-间距规范)
- [3. 组件样式规范](#3-组件样式规范)
  - [3.1 按钮](#31-按钮)
  - [3.2 表单元素](#32-表单元素)
  - [3.3 卡片](#33-卡片)
  - [3.4 表格](#34-表格)
  - [3.5 导航组件](#35-导航组件)
- [4. 字体规范](#4-字体规范)
  - [4.1 字体家族](#41-字体家族)
  - [4.2 字号规范](#42-字号规范)
  - [4.3 行高规范](#43-行高规范)
- [5. 图标规范](#5-图标规范)
- [6. 接口规范](#6-接口规范)
- [7. 最佳实践](#7-最佳实践)

## 1. 颜色系统

### 1.1 主色调

数字基座项目采用蓝紫色渐变作为主色调，以下是主色的具体定义：

```scss
// src/styles/variables.scss
$primary-gradient: linear-gradient(125deg, #5E77FB 0%, #6D74F2 45%, #9088F3 75%, #A86FEC 100%);
$primary-color: #5E77FB;
$primary-color-light: #6D74F2;
$primary-color-lighter: #9088F3;
$primary-color-dark: #4169E1;
```

**使用场景**：
- 主色调主要用于：主按钮、导航栏背景、强调元素、选中状态等。
- 渐变色用于：登录页面背景、核心功能按钮、特殊卡片背景等需要突出的位置。

### 1.2 辅助色

```scss
$success-color: #67C23A;
$warning-color: #E6A23C;
$danger-color: #F56C6C;
$info-color: #909399;
```

**使用场景**：
- 成功状态：操作成功、完成状态等
- 警告状态：需要注意的操作、警告提示等
- 危险状态：错误、删除操作等
- 信息状态：普通提示、辅助信息等

### 1.3 功能色

```scss
$link-color: #5E77FB;
$link-hover-color: #9088F3;
$active-color: #4169E1;
$disabled-color: #C0C4CC;
```

**使用场景**：
- 链接文本
- 悬停状态
- 激活状态
- 禁用状态

### 1.4 中性色

```scss
$text-primary: #303133;
$text-regular: #606266;
$text-secondary: #909399;
$text-placeholder: #C0C4CC;

$border-base: #DCDFE6;
$border-light: #E4E7ED;
$border-lighter: #EBEEF5;
$border-extra-light: #F2F6FC;

$background-base: #F5F7FA;
$background-light: #FAFAFA;
$background-lighter: #FFFFFF;
```

**使用场景**：
- 文本颜色：主要、常规、次要和占位符文本
- 边框颜色：从深到浅的边框样式
- 背景颜色：不同层级的背景色

## 2. 布局规范

### 2.1 基础布局

项目使用 Element Plus 的栅格系统进行布局，默认为 24 列栅格。布局分为以下几种类型：

1. **基础布局**：
   - 左侧菜单 + 顶部导航 + 主内容区
   - 顶部导航 + 主内容区
   - 左侧菜单 + 主内容区

2. **布局配置参数**：

```typescript
// src/store/modules/app.ts
interface AppState {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
  layout: 'vertical' | 'horizontal' | 'mix';
  showSettings: boolean;
  showTagsView: boolean;
  fixedHeader: boolean;
  showBreadcrumb: boolean;
  showLogo: boolean;
  pageTransition: boolean;
  cachedViews: string[];
}
```

3. **布局组件**：
   - `Layout/index.vue`: 整体布局组件
   - `Layout/components/Sidebar/index.vue`: 侧边栏组件
   - `Layout/components/Navbar/index.vue`: 顶部导航组件
   - `Layout/components/AppMain.vue`: 主内容区组件
   - `Layout/components/TagsView/index.vue`: 标签页导航组件
   - `Layout/components/Breadcrumb/index.vue`: 面包屑导航组件

### 2.2 响应式断点

遵循 Element Plus 的响应式断点设计：

```scss
// 响应式断点变量
$xs: 0;          // 超小屏幕
$sm: 768px;      // 小屏幕
$md: 992px;      // 中等屏幕
$lg: 1200px;     // 大屏幕
$xl: 1920px;     // 超大屏幕
```

**媒体查询使用示例**：

```scss
@media (max-width: $sm) {
  // 小屏幕样式
}

@media (min-width: $md) and (max-width: $lg) {
  // 中等屏幕样式
}
```

### 2.3 间距规范

系统采用 8px 倍数的间距规范：

```scss
// 间距变量
$spacing-mini: 4px;
$spacing-small: 8px;
$spacing-base: 16px;
$spacing-medium: 24px;
$spacing-large: 32px;
$spacing-xl: 40px;
$spacing-xxl: 48px;
```

**使用场景**：
- 内边距 (padding)
- 外边距 (margin)
- 元素间距
- 栅格间隔

## 3. 组件样式规范

### 3.1 按钮

按钮样式基于 Element Plus 的按钮组件，自定义样式如下：

```scss
// 主按钮样式
.el-button--primary {
  height: 40px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background: $primary-color;
  border: none;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(65, 105, 225, 0.3);
    background: $primary-color-light;
  }
}

// 登录按钮特殊样式
.login-form .el-button--primary {
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #4169E1 0%, #6495ED 100%);
  border: none;
}
```

**按钮类型**：
- 主要按钮：用于页面主操作
- 普通按钮：用于次要操作
- 文本按钮：用于辅助操作
- 图标按钮：常用于工具栏

### 3.2 表单元素

```scss
// 输入框样式
.el-input {
  .el-input__wrapper {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;

    &:hover,
    &.is-focus {
      box-shadow: 0 4px 12px rgba(65, 105, 225, 0.2);
    }
  }

  .el-input__inner {
    height: 40px;
    font-size: 14px;
  }
}

// 登录页面表单样式
.login-form {
  .el-form-item {
    margin-bottom: 24px;

    .el-input {
      height: 48px;
      border-radius: 12px;

      .el-input__wrapper {
        border-radius: 12px;
      }

      .el-input__inner {
        height: 46px;
        font-size: 15px;
      }
    }
  }
}
```

### 3.3 卡片

```scss
// 基础卡片样式
.base-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: $spacing-medium;
  margin-bottom: $spacing-medium;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .card-header {
    margin-bottom: $spacing-base;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 18px;
      font-weight: 600;
      color: $text-primary;
    }
  }
}
```

### 3.4 表格

```scss
// 表格样式
.el-table {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: $spacing-medium;

  th.el-table__cell {
    background-color: $background-base;
    color: $text-regular;
    font-weight: 600;
  }

  .el-table__row {
    transition: all 0.2s;

    &:hover {
      background-color: rgba($primary-color, 0.05);
    }
  }
}
```

### 3.5 导航组件

```scss
// 菜单样式
.el-menu {
  border-right: none;

  .el-menu-item {
    height: 50px;
    line-height: 50px;
    
    &.is-active {
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background-color: $primary-color;
      }
    }
  }
}

// 标签导航样式
.tags-view-container {
  height: 40px;
  background: #fff;
  border-bottom: 1px solid $border-light;

  .tags-view-item {
    display: inline-block;
    height: 28px;
    line-height: 28px;
    padding: 0 12px;
    font-size: 13px;
    margin: 6px 4px;
    border-radius: 4px;
    cursor: pointer;
    
    &.active {
      background-color: $primary-color;
      color: #fff;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background-color: $primary-color;
      }
    }
  }
}
```

## 4. 字体规范

### 4.1 字体家族

```scss
// 字体系列
$font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
```

### 4.2 字号规范

```scss
// 字体大小
$font-size-base: 14px;
$font-size-small: 13px;
$font-size-mini: 12px;
$font-size-medium: 16px;
$font-size-large: 18px;
$font-size-xl: 20px;
$font-size-xxl: 24px;
$font-size-xxxl: 28px;
```

**使用场景**：
- 页面标题：`$font-size-xxl`, `$font-size-xxxl`
- 卡片标题：`$font-size-large`, `$font-size-xl`
- 正文内容：`$font-size-base`
- 辅助文字：`$font-size-small`, `$font-size-mini`
- 表单标签：`$font-size-base`

### 4.3 行高规范

```scss
// 行高
$line-height-tight: 1.2;    // 紧凑
$line-height-base: 1.5;     // 基础
$line-height-loose: 1.8;    // 宽松
```

**使用场景**：
- 标题：`$line-height-tight`
- 正文：`$line-height-base`
- 段落文本：`$line-height-loose`

## 5. 图标规范

项目采用 Element Plus 图标库作为基础图标库，确保全局一致性：

```typescript
// 引入方式
import { User, Lock, Menu, Setting } from '@element-plus/icons-vue'
```

**图标规范**：
- 菜单图标：统一使用 24px 大小
- 表单图标：统一使用 18px 大小
- 按钮图标：根据按钮大小自适应，一般为 16px
- 表格操作图标：统一使用 16px 大小

## 6. 接口规范

### 数据传输对象规范

所有接口请求和响应应遵循以下规范：

```typescript
// src/types/index.ts

// 基础响应格式
export interface ApiResponse<T> {
  code: number;         // 状态码，200表示成功
  message: string;      // 提示信息
  data: T;              // 业务数据
}

// 分页请求参数
export interface PageParams {
  pageNum: number;      // 当前页码
  pageSize: number;     // 每页大小
  [key: string]: any;   // 其他查询参数
}

// 分页响应格式
export interface PageResult<T> {
  total: number;        // 总记录数
  list: T[];            // 当前页数据列表
  pageNum: number;      // 当前页码
  pageSize: number;     // 每页大小
  totalPages: number;   // 总页数
}

// 登录参数
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  rememberMe?: boolean;
}

// 用户信息
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  phone?: string;
  status: number;
  roles: Role[];
  permissions: string[];
  lastLoginTime?: string;
  createTime: string;
}

// 角色信息
export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: number;
  permissions: Permission[];
  createTime: string;
}

// 权限信息
export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
}
```

### API 调用规范

```typescript
// src/api/base.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    const res = response.data;
    
    // 如果状态码不是200，认为请求错误
    if (res.code !== 200) {
      ElMessage.error(res.message || '系统错误');
      
      // 401: 未登录或token过期
      if (res.code === 401) {
        // 处理登出逻辑
      }
      
      return Promise.reject(new Error(res.message || '系统错误'));
    } else {
      return res.data;
    }
  },
  (error) => {
    ElMessage.error(error.message || '请求失败');
    return Promise.reject(error);
  }
);

// 封装GET请求
export function get<T>(url: string, params?: any): Promise<T> {
  return service.get(url, { params });
}

// 封装POST请求
export function post<T>(url: string, data?: any): Promise<T> {
  return service.post(url, data);
}

// 封装PUT请求
export function put<T>(url: string, data?: any): Promise<T> {
  return service.put(url, data);
}

// 封装DELETE请求
export function del<T>(url: string, params?: any): Promise<T> {
  return service.delete(url, { params });
}
```

### 业务模块 API 示例

```typescript
// src/api/user.ts
import { get, post, put, del } from './base';
import { UserInfo, PageParams, PageResult } from '@/types';

export const userApi = {
  // 获取用户列表
  getUserList(params: PageParams) {
    return get<PageResult<UserInfo>>('/system/user/list', params);
  },
  
  // 获取用户详情
  getUserDetail(id: string) {
    return get<UserInfo>(`/system/user/${id}`);
  },
  
  // 添加用户
  addUser(data: Partial<UserInfo>) {
    return post<UserInfo>('/system/user', data);
  },
  
  // 更新用户
  updateUser(data: Partial<UserInfo>) {
    return put<UserInfo>(`/system/user/${data.id}`, data);
  },
  
  // 删除用户
  deleteUser(id: string) {
    return del<boolean>(`/system/user/${id}`);
  }
};
```

## 7. 最佳实践

### 7.1 组件封装规范

1. **组件命名**：
   - 使用 PascalCase 命名自定义组件
   - 使用 kebab-case 命名组件文件

2. **组件结构**：
   ```vue
   <template>
     <!-- 组件模板，保持结构清晰 -->
   </template>
   
   <script setup lang="ts">
   // 1. 引入依赖
   import { ref, reactive, computed, onMounted } from 'vue';
   import type { PropType } from 'vue';
   
   // 2. 定义Props
   const props = defineProps({
     title: {
       type: String,
       required: true
     },
     data: {
       type: Array as PropType<any[]>,
       default: () => []
     }
   });
   
   // 3. 定义Emits
   const emit = defineEmits(['change', 'update']);
   
   // 4. 响应式数据
   const loading = ref(false);
   const formData = reactive({
     // 表单数据
   });
   
   // 5. 计算属性
   const computedValue = computed(() => {
     // 计算逻辑
     return result;
   });
   
   // 6. 方法定义
   const handleSubmit = () => {
     // 处理逻辑
     emit('update', formData);
   };
   
   // 7. 生命周期钩子
   onMounted(() => {
     // 初始化逻辑
   });
   </script>
   
   <style lang="scss" scoped>
   /* 组件样式，使用scoped避免样式污染 */
   </style>
   ```

### 7.2 样式编写规范

1. **使用预处理器**：
   - 使用 SCSS 作为样式预处理器
   - 使用嵌套语法组织样式结构
   - 避免过深的嵌套（不超过4层）

2. **CSS 变量使用**：
   ```scss
   // src/styles/variables.scss 中定义变量
   :root {
     --primary-color: #{$primary-color};
     --text-color: #{$text-primary};
     --border-radius: 8px;
   }
   
   // 在组件中使用
   .my-component {
     color: var(--primary-color);
     border-radius: var(--border-radius);
   }
   ```

3. **响应式设计**：
   - 优先使用 flex 或 grid 布局
   - 使用媒体查询适配不同屏幕尺寸
   - 关键尺寸使用相对单位 (rem, %, vh/vw)

### 7.3 状态管理规范

使用 Pinia 进行状态管理，遵循以下规范：

```typescript
// src/store/modules/user.ts
import { defineStore } from 'pinia';
import { UserInfo } from '@/types';

// 定义状态接口
interface UserState {
  token: string;
  userInfo: UserInfo | null;
}

// 创建 store
export const useUserStore = defineStore('user', {
  // 初始状态
  state: (): UserState => ({
    token: getToken() || '',
    userInfo: null
  }),
  
  // getters
  getters: {
    hasLogin: (state) => !!state.token && !!state.userInfo,
    userRoles: (state) => state.userInfo?.roles || []
  },
  
  // actions
  actions: {
    // 异步 action
    async login(loginParams) {
      try {
        const data = await authApi.login(loginParams);
        this.token = data.token;
        this.userInfo = data.userInfo;
        setToken(data.token);
        return data;
      } catch (error) {
        console.error('登录失败:', error);
        throw error;
      }
    },
    
    // 同步 action
    logout() {
      this.token = '';
      this.userInfo = null;
      removeToken();
    }
  }
});
```

### 7.4 路由配置规范

```typescript
// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 路由元信息定义
interface RouteMeta {
  title?: string;           // 页面标题
  icon?: string;            // 菜单图标
  hidden?: boolean;         // 是否在菜单中隐藏
  alwaysShow?: boolean;     // 是否总是显示
  roles?: string[];         // 可访问角色
  keepAlive?: boolean;      // 是否缓存组件
  breadcrumb?: boolean;     // 是否显示在面包屑
  activeMenu?: string;      // 激活的菜单
}

// 路由配置示例
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/system/auth/Login.vue'),
    meta: { 
      hidden: true,
      title: '登录' 
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { 
          title: '首页', 
          icon: 'Dashboard',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: { 
      title: '系统管理', 
      icon: 'Setting',
      roles: ['admin'] 
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue'),
        meta: { 
          title: '用户管理', 
          icon: 'User',
          keepAlive: true
        }
      }
    ]
  }
];
```

### 7.5 表单验证规范

使用 Element Plus 的表单验证：

```typescript
// 表单验证规则示例
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ]
};
```

---

以上规范旨在统一项目的开发标准，确保各团队成员在开发过程中保持一致的代码风格和设计风格。随着项目的发展，本规范也将不断更新完善。 