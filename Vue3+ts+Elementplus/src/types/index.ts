// 通用类型定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 分页参数
export interface PageParams {
  current: number;
  size: number;
  [key: string]: any;
}

// 分页响应
export interface PageResult<T = any> {
  records: T[];
  total: number;
  current: number;
  size: number;
  pages: number;
}

// 部门信息
export interface DeptInfo {
  id: number | string;
  name: string;
  deptName?: string; // 后端兼容字段
  parentId?: number | string;
  isMain?: number; // 是否主部门（0-否，1-是）
  children?: DeptInfo[];
}

// 用户信息
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  phone?: string;
  sex?: number; // 性别（0:未知，1:男，2:女）
  status: number;
  mainDeptId?: string; // 主部门ID
  deptName?: string; // 部门名称
  depts?: DeptInfo[]; // 用户所属的多个部门
  roles: Role[];
  permissions: string[];
  createBy?: string; // 创建者
  createTime: string;
  updateBy?: string; // 更新者
  updateTime?: string; // 更新时间
}

// 角色信息
export interface Role {
  id: string;
  roleName: string;
  roleCode: string;
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
  type: "menu" | "button" | "api";
  parentId?: string;
  path?: string;
  component?: string;
  icon?: string;
  sort: number;
  status: number;
  children?: Permission[];
  createTime: string;
}

// 菜单项
export interface MenuItem {
  id: string;
  name: string;
  path: string;
  component?: string;
  icon?: string;
  hidden?: boolean;
  redirect?: string;
  meta?: MenuMeta;
  children?: MenuItem[];
}

// 菜单元信息
export interface MenuMeta {
  title: string;
  icon?: string;
  hidden?: boolean;
  keepAlive?: boolean;
  requireAuth?: boolean;
  permissions?: string[];
}

// 登录参数
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  rememberMe?: boolean;
}

// 登录响应
export interface LoginResult {
  token: string;
  refreshToken?: string;
  userInfo: UserInfo;
  // 以下字段用于处理嵌套响应
  data?: {
    token: string;
    refreshToken?: string;
    userInfo: UserInfo;
  };
}

// 系统设置
export interface SystemSettings {
  siteName: string;
  logo: string;
  favicon: string;
  description: string;
  keywords: string;
  icp: string;
  copyrightInfo: string;
  followSystem?: boolean;
}

// 表格列定义
export interface TableColumn {
  prop: string;
  label: string;
  width?: number | string;
  minWidth?: number | string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  fixed?: boolean | "left" | "right";
  type?: "selection" | "index" | "expand";
  formatter?: (row: any, column: any, cellValue: any, index: number) => string;
  showOverflowTooltip?: boolean;
}

// 表单项定义
export interface FormItem {
  prop: string;
  label: string;
  type:
    | "input"
    | "select"
    | "date"
    | "textarea"
    | "number"
    | "switch"
    | "radio"
    | "checkbox";
  rules?: any[];
  options?: { label: string; value: any }[];
  placeholder?: string;
  span?: number;
  [key: string]: any;
}

// 主题设置
export interface ThemeSettings {
  primaryColor: string;
  isDark: boolean;
  darkMode: boolean;
  layout: "vertical" | "horizontal" | "mix";
  sidebarCollapsed: boolean;
  showTabs: boolean;
  showBreadcrumb: boolean;
  fixedHeader: boolean;
  showFooter: boolean;
  followSystem: boolean;
}

// 操作日志
export interface OperationLog {
  id: string;
  userId: string;
  username: string;
  module: string;
  operation: string;
  method: string;
  params?: string;
  result?: string;
  ip: string;
  location: string;
  userAgent: string;
  status: number;
  errorMsg?: string;
  createTime: string;
}
