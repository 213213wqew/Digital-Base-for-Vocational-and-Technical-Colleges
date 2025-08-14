import type { MenuItem, MenuTree, RouteMenu } from "@/types/menu";

/**
 * 菜单工具类
 */
export class MenuUtils {
  /**
   * 将菜单列表转换为路由配置
   * @param menuList 菜单列表
   * @returns 路由配置列表
   */
  static menuToRoutes(menuList: MenuItem[]): RouteMenu[] {
    return menuList.map((menu) => {
      const route: RouteMenu = {
        path: menu.path,
        name: this.pathToName(menu.path),
        meta: {
          title: menu.name,
          icon: menu.icon,
          requireAuth: true,
          cache: menu.isCache === 1,
          hidden: menu.visible === 0,
          permission: menu.permission,
        },
      };

      // 如果有组件路径，动态导入组件
      if (menu.component) {
        if (menu.component === "Layout") {
          route.component = () => import("@/layout/index.vue");
        } else {
          route.component = () => import(`@/views/${menu.component}.vue`);
        }
      }

      // 处理子路由
      if (menu.children && menu.children.length > 0) {
        route.children = this.menuToRoutes(menu.children);

        // 如果是目录类型且没有设置重定向，设置默认重定向到第一个子路由
        if (menu.type === "catalog" && menu.children[0]) {
          route.redirect = menu.children[0].path;
        }
      }

      return route;
    });
  }

  /**
   * 路径转换为路由名称
   * @param path 路径
   * @returns 路由名称
   */
  static pathToName(path: string): string {
    return path
      .split("/")
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join("");
  }

  /**
   * 构建面包屑导航
   * @param menuList 菜单列表
   * @param currentPath 当前路径
   * @returns 面包屑数组
   */
  static buildBreadcrumb(
    menuList: MenuItem[],
    currentPath: string,
  ): MenuItem[] {
    const breadcrumb: MenuItem[] = [];

    const findPath = (
      menus: MenuItem[],
      path: string,
      parents: MenuItem[] = [],
    ): boolean => {
      for (const menu of menus) {
        const currentParents = [...parents, menu];

        if (menu.path === path) {
          breadcrumb.push(...currentParents);
          return true;
        }

        if (menu.children && menu.children.length > 0) {
          if (findPath(menu.children, path, currentParents)) {
            return true;
          }
        }
      }
      return false;
    };

    findPath(menuList, currentPath);
    return breadcrumb;
  }

  /**
   * 获取菜单树形结构
   * @param menuList 菜单列表
   * @returns 树形菜单
   */
  static buildMenuTree(menuList: MenuItem[]): MenuTree[] {
    if (!menuList || menuList.length === 0) {
      return [];
    }

    // 创建菜单映射 (ID -> 菜单项)
    const menuMap = new Map<string | number, MenuItem>();

    // 第一步：复制菜单项，初始化映射
    const clonedMenus: MenuItem[] = menuList.map((item) => {
      // 深拷贝避免修改原始数据
      const clonedItem = { ...item };
      // 确保每个菜单项都有children属性
      if (!clonedItem.children) {
        clonedItem.children = [];
      }
      // 添加到映射
      menuMap.set(clonedItem.id, clonedItem);
      return clonedItem;
    });

    // 第二步：构建树结构
    const result: MenuTree[] = [];

    for (const menu of clonedMenus) {
      // 顶级菜单
      if (!menu.parentId || menu.parentId === "0") {
        result.push(menu as MenuTree);
      } else {
        // 子菜单，添加到父菜单的children中
        const parent = menuMap.get(menu.parentId);
        if (parent) {
          // 添加到父菜单的children中
          parent.children!.push(menu);
        }
      }
    }

    // 第三步：按sort字段排序
    const sortChildren = (items: MenuItem[]) => {
      // 按sort字段排序
      items.sort((a, b) => {
        const sortA = typeof a.sort === "number" ? a.sort : 0;
        const sortB = typeof b.sort === "number" ? b.sort : 0;
        return sortA - sortB;
      });

      // 递归处理子菜单
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          sortChildren(item.children);
        }
      });
    };

    // 排序所有菜单
    sortChildren(result);

    // 第四步：清理空的children数组
    const cleanupEmptyChildren = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.children && item.children.length === 0) {
          delete item.children;
        } else if (item.children && item.children.length > 0) {
          cleanupEmptyChildren(item.children);
        }
      });
    };

    cleanupEmptyChildren(result);

    return result;
  }

  /**
   * 查找菜单项
   * @param menuList 菜单列表
   * @param predicate 查找条件
   * @returns 找到的菜单项
   */
  static findMenu(
    menuList: MenuItem[],
    predicate: (menu: MenuItem) => boolean,
  ): MenuItem | null {
    for (const menu of menuList) {
      if (predicate(menu)) {
        return menu;
      }

      if (menu.children && menu.children.length > 0) {
        const found = this.findMenu(menu.children, predicate);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * 获取所有菜单的扁平列表
   * @param menuList 菜单列表
   * @returns 扁平化的菜单列表
   */
  static flattenMenus(menuList: MenuItem[]): MenuItem[] {
    const result: MenuItem[] = [];

    const flatten = (menus: MenuItem[]) => {
      menus.forEach((menu) => {
        result.push(menu);
        if (menu.children && menu.children.length > 0) {
          flatten(menu.children);
        }
      });
    };

    flatten(menuList);
    return result;
  }

  /**
   * 获取默认展开的菜单keys
   * @param menuList 菜单列表
   * @param currentPath 当前路径
   * @returns 需要展开的菜单keys
   */
  static getDefaultOpenKeys(
    menuList: MenuItem[],
    currentPath: string,
  ): string[] {
    const openKeys: string[] = [];

    const findParents = (
      menus: MenuItem[],
      path: string,
      parents: string[] = [],
    ): boolean => {
      for (const menu of menus) {
        const currentParents = [...parents];

        if (menu.type === "catalog") {
          currentParents.push(String(menu.id));
        }

        if (menu.path === path) {
          openKeys.push(...currentParents);
          return true;
        }

        if (menu.children && menu.children.length > 0) {
          if (findParents(menu.children, path, currentParents)) {
            return true;
          }
        }
      }
      return false;
    };

    findParents(menuList, currentPath);
    return openKeys;
  }
}
