/**
 * 菜单项接口定义
 */
export interface MenuItem {
  /** 菜单ID */
  id: string;
  /** 菜单名称 */
  name: string;
  /** 菜单路径 */
  path: string;
  /** 菜单图标 */
  icon: string;
  /** 组件路径 */
  component?: string;
  /** 菜单类型：1-目录 2-菜单 3-按钮 */
  type: "catalog" | "menu" | "button" | number;
  /** 排序 */
  sort: number;
  /** 是否可见：0-否 1-是 */
  visible: number;
  /** 状态：0-禁用 1-正常 */
  status: number;
  /** 权限标识 */
  permission: string;
  /** 父级菜单ID */
  parentId?: string;
  /** 是否外链：0-否 1-是 */
  isFrame?: number;
  /** 是否缓存：0-否 1-是 */
  isCache?: number;
  /** 备注 */
  remark?: string;
  /** 子菜单 */
  children?: MenuItem[];
  /** 路由元信息 (前端自定义) */
  meta?: {
    /** 页面标题 */
    title: string;
    /** 是否需要认证 */
    requireAuth: boolean;
    /** 是否缓存 */
    cache?: boolean;
    /** 是否隐藏 */
    hidden?: boolean;
    /** 外链地址 */
    link?: string;
  };
}

/**
 * 菜单树接口定义
 */
export interface MenuTree extends MenuItem {
  children?: MenuTree[];
}

/**
 * 路由菜单接口定义
 */
export interface RouteMenu {
  path: string;
  name: string;
  component?: any;
  redirect?: string;
  meta: {
    title: string;
    icon?: string;
    requireAuth: boolean;
    cache?: boolean;
    hidden?: boolean;
    link?: string;
    permission?: string;
  };
  children?: RouteMenu[];
}

/**
 * 菜单API响应接口
 */
export interface MenuResponse {
  code: number;
  message: string;
  data: MenuItem[];
}

/**
 * 用户菜单权限接口
 */
export interface UserMenuPermissions {
  /** 用户ID */
  userId: string | number;
  /** 用户拥有的权限列表 */
  permissions: string[];
  /** 用户可访问的菜单列表 */
  menuList: MenuItem[];
}

/**
 * 菜单查询参数接口
 */
export interface MenuQueryParams {
  /** 菜单名称 */
  name?: string;
  /** 菜单类型 */
  type?: "catalog" | "menu" | "button" | number;
  /** 状态 */
  status?: number;
  /** 是否可见 */
  visible?: number;
  /** 父级菜单ID */
  parentId?: string;
}
