import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { useUserStore } from "@/store/modules/user";
import { useMenuStore } from "@/store/modules/menu";

// 配置 NProgress
NProgress.configure({ showSpinner: false });

// 基础路由
const routes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: () => import("@/layout/index.vue"),
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
        meta: { hidden: true },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/system/auth/Login.vue"),
    meta: {
      title: "登录",
      requireAuth: false,
      hidden: true,
    },
  },
  {
    path: "/",
    name: "Layout",
    component: () => import("@/layout/index.vue"),
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: {
          title: "首页",
          icon: "HomeFilled",
          requireAuth: true,
          affix: true,
        },
      },
      {
        path: "cockpit",
        name: "CockpitView",
        component: () => import("@/views/cockpit_view/index.vue"),
        meta: {
          title: "领导驾驶舱",
          icon: "DataBoard",
          requireAuth: true,
          cache: false,
        },
      },
      // 通用未找到页面路由 - 将捕获任何未匹配的路径
      {
        path: ":pathMatch(.*)*",
        name: "NotFoundInLayout",
        component: () => {
          // 获取当前路径（支持hash模式）
          const currentPath = window.location.hash.slice(1) || window.location.pathname;

          // 尝试从路径推断组件路径
          const pathSegments = currentPath.split("/").filter(Boolean);
          if (pathSegments.length === 0) {
            return import("../views/common/Coming.vue");
          }

          // 获取路径最后一段作为可能的页面标题
          const possibleTitle = pathSegments[pathSegments.length - 1];

          // 尝试构建可能的组件路径
          try {
            // 可能的组件路径格式
            const possiblePaths = [
              // 1. 直接使用完整路径
              pathSegments.join("/"),
              // 2. 最后一级可能是index
              [...pathSegments, "index"].join("/"),
              // 3. 只使用最后一级
              pathSegments[pathSegments.length - 1],
              // 4. 最后一级可能是index
              `${pathSegments[pathSegments.length - 1]}/index`,
            ];

            // 尝试找到第一个可用的组件
            return new Promise((resolve) => {
              // 依次尝试加载可能的组件路径
              const tryLoadComponent = (index: number) => {
                if (index >= possiblePaths.length) {
                  // 所有路径都尝试失败，使用默认占位组件
                  console.warn("未找到匹配的组件，路径：", currentPath);
                  resolve(import("../views/common/Coming.vue"));
                  return;
                }

                const componentPath = `../views/${possiblePaths[index]}.vue`;
                console.log("尝试加载组件：", componentPath);

                // 使用 glob 模式动态导入
                const modules = import.meta.glob('../views/**/*.vue');
                
                // 尝试从 glob 导入中找到匹配的组件
                const moduleKey = Object.keys(modules).find(key => {
                  // 标准化路径进行比较
                  const normalizedKey = key.replace('../', '').replace(/\\/g, '/');
                  const normalizedComponentPath = componentPath.replace('../views/', '').replace(/\\/g, '/');
                  return normalizedKey === `views/${normalizedComponentPath}`;
                });

                if (moduleKey && modules[moduleKey]) {
                  console.log(`通用路由找到组件: ${moduleKey} -> ${componentPath}`);
                  modules[moduleKey]()
                    .then((component) => {
                      // 成功加载组件后，动态设置路由的meta.title
                      router.currentRoute.value.meta.title =
                        possibleTitle || "功能开发中";
                      resolve(component);
                    })
                    .catch((err) => {
                      // 尝试下一个路径
                      console.warn("组件加载失败，尝试下一个路径", err);
                      tryLoadComponent(index + 1);
                    });
                } else {
                  // 当前路径没有找到匹配的组件，尝试下一个路径
                  console.warn(`未找到组件: ${componentPath}，尝试下一个路径`);
                  tryLoadComponent(index + 1);
                }
              };

              // 开始尝试第一个路径
              tryLoadComponent(0);
            });
          } catch (error) {
            console.error("动态加载组件失败:", error);
            return import("../views/common/Coming.vue");
          }
        },
        meta: {
          title: "功能开发中",
          requireAuth: true,
        },
      },
    ],
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
    meta: {
      title: "页面不存在",
      requireAuth: false,
      hidden: true,
    },
  },
  {
    path: "/working",
    component: () => import("@/layout/index.vue"),
    redirect: "/working/day",
    meta: {
      title: "工作日报",
      icon: "Calendar",
      roles: ["ADMIN", "USER"],
    },
    children: [
      {
        path: "day",
        name: "WorkingDay",
        component: () => import("@/views/working/workingDay/index.vue"),
        meta: {
          title: "每日上报",
          icon: "Document",
        },
      },
      {
        path: "day/report",
        name: "WorkingDayReport",
        component: () => import("@/views/working/workingDay/Report.vue"),
        meta: {
          title: "数据上报",
          icon: "Edit",
          hidden: true,
        },
      },
      {
        path: "week",
        name: "WorkingWeek",
        component: () => import("@/views/working/workingWeek/index.vue"),
        meta: {
          title: "每周上报",
          icon: "Calendar",
        },
      },
      {
        path: "week/report",
        name: "WorkingWeekReport",
        component: () => import("@/views/working/workingDay/Report.vue"),
        meta: {
          title: "周报上报",
          icon: "Edit",
          hidden: true,
        },
      },
      {
        path: "month",
        name: "WorkingMonth",
        component: () => import("@/views/working/workingMonth/index.vue"),
        meta: {
          title: "每月上报",
          icon: "Calendar",
        },
      },
      {
        path: "month/report",
        name: "WorkingMonthReport",
        component: () => import("@/views/working/workingDay/Report.vue"),
        meta: {
          title: "月报上报",
          icon: "Edit",
          hidden: true,
        },
      },
      {
        path: "year",
        name: "WorkingYear",
        component: () => import("@/views/working/workingYear/index.vue"),
        meta: {
          title: "每年上报",
          icon: "Calendar",
        },
      },
      {
        path: "year/report",
        name: "WorkingYearReport",
        component: () => import("@/views/working/workingDay/Report.vue"),
        meta: {
          title: "年报上报",
          icon: "Edit",
          hidden: true,
        },
      },
      {
        path: "session",
        name: "WorkingSession",
        component: () => import("@/views/working/workingSession/index.vue"),
        meta: {
          title: "学期上报",
          icon: "Calendar",
        },
      },
      {
        path: "session/report",
        name: "WorkingSessionReport",
        component: () => import("@/views/working/workingDay/Report.vue"),
        meta: {
          title: "学期报上报",
          icon: "Edit",
          hidden: true,
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// 路由映射表，用于检查路由是否存在
const routePathMap = new Map<string, boolean>();

/**
 * 预处理路由映射表
 */
function initRoutePathMap() {
  router.getRoutes().forEach((route) => {
    // 记录主路由
    routePathMap.set(route.path, true);

    // 记录子路由
    if (route.children && route.children.length > 0) {
      route.children.forEach((child) => {
        const fullPath =
          route.path === "/" ? `/${child.path}` : `${route.path}/${child.path}`;
        routePathMap.set(fullPath, true);
      });
    }
  });
}

// 初始化路由映射表
initRoutePathMap();

/**
 * 动态添加路由
 * @param path 路由路径
 * @param component 组件路径
 * @param name 路由名称
 */
export function addDynamicRoute(
  path: string,
  component: string,
  name?: string,
) {
  try {
    // 处理路径格式
    const routePath = path.startsWith("/") ? path : `/${path}`;

    // 检查路由是否已存在于映射表中
    if (routePathMap.has(routePath)) {
      return true;
    }

    // 处理名称
    const routeName =
      name || routePath.split("/").filter(Boolean).join("-") || "dynamic";

    // 检查路由是否已存在
    if (router.hasRoute(routeName)) {
      return true;
    }

    // 处理组件路径
    const importComponent = () => {
      // 确保组件路径格式正确
      const ensureComponentPath = (path: string) => {
        // 去除@前缀，转换为相对路径
        if (path.startsWith("@/")) {
          path = path.substring(2);
        }

        // 确保有 views/ 前缀
        if (!path.startsWith("views/")) {
          path = `views/${path}`;
        }

        // 确保有 .vue 后缀
        if (!path.endsWith(".vue")) {
          path = `${path}.vue`;
        }

        return path;
      };

      const componentPath = ensureComponentPath(component);

      // 使用动态导入，通过 glob 模式预加载所有可能的组件
      const modules = import.meta.glob('../views/**/*.vue');
      
      // // 构建完整的模块路径
      // const fullPath = componentPath.startsWith('../') ? componentPath : `../${componentPath}`;
      //
      // 尝试从 glob 导入中找到匹配的组件
      const moduleKey = Object.keys(modules).find(key => {
        // 标准化路径进行比较
        const normalizedKey = key.replace('../', '').replace(/\\/g, '/');
        const normalizedComponentPath = componentPath.replace(/\\/g, '/');
        return normalizedKey === normalizedComponentPath;
      });

      if (moduleKey && modules[moduleKey]) {
        console.log(`找到组件: ${moduleKey} -> ${componentPath}`);
        return modules[moduleKey]();
      }

      // 如果没有找到，尝试添加 index.vue 后缀
      const indexPath = componentPath.endsWith('.vue') 
        ? componentPath.replace('.vue', '/index.vue')
        : `${componentPath}/index.vue`;
      
      const indexModuleKey = Object.keys(modules).find(key => {
        const normalizedKey = key.replace('../', '').replace(/\\/g, '/');
        const normalizedIndexPath = indexPath.replace(/\\/g, '/');
        return normalizedKey === normalizedIndexPath;
      });

      if (indexModuleKey && modules[indexModuleKey]) {
        console.log(`找到索引组件: ${indexModuleKey} -> ${indexPath}`);
        return modules[indexModuleKey]();
      }

      // 最终回退到占位组件
      console.log(`组件路径未找到: ${componentPath}，使用占位组件`);
      const comingModule = modules['../views/common/Coming.vue'];
      if (comingModule) {
        return comingModule();
      }
      
      // 如果连占位组件都没有，返回一个简单的组件
      return Promise.resolve({
        default: {
          template: '<div>页面开发中...</div>'
        }
      });
    };

    // 判断是否是Layout的直接子路由
    if (routePath.split("/").length === 2 && routePath !== "/") {
      // 顶级路由，添加到主布局下
      router.addRoute("Layout", {
        path: routePath.substring(1), // 去掉开头的/
        name: routeName,
        component: importComponent,
        meta: {
          dynamicAdded: true,
          title: name || routeName, // 设置meta.title为菜单名称
          requireAuth: true,
        },
      });
    } else if (routePath.split("/").length > 2) {
      // 嵌套路由，添加到Layout下
      router.addRoute("Layout", {
        path: routePath.substring(1), // 去掉开头的/
        name: routeName,
        component: importComponent,
        meta: {
          dynamicAdded: true,
          title: name || routeName, // 设置meta.title为菜单名称
          requireAuth: true,
        },
      });
    } else {
      // 其他情况，直接添加
      router.addRoute({
        path: routePath,
        name: routeName,
        component: importComponent,
        meta: {
          dynamicAdded: true,
          title: name || routeName, // 设置meta.title为菜单名称
          requireAuth: true,
        },
      });
    }

    // 添加到路由映射表
    routePathMap.set(routePath, true);

    return true;
  } catch (error) {
    console.error(`添加路由失败: ${path}, ${component}`, error);
    return false;
  }
}

/**
 * 检查路径是否存在于路由表中
 * @param path 路由路径
 */
export function checkRouteExists(path: string): boolean {
  const routePath = path.startsWith("/") ? path : `/${path}`;
  return routePathMap.has(routePath);
}

// 路由前置守卫
router.beforeEach(async (to, _from, next) => {
  NProgress.start();

  const userStore = useUserStore();

  // 白名单路由
  const whiteList = ["/login", "/404"];

  if (whiteList.includes(to.path)) {
    // 设置页面标题
    document.title = to.meta?.title
      ? `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
      : import.meta.env.VITE_APP_TITLE;
    next();
    return;
  }

  // 检查登录状态
  if (!userStore.token) {
    next("/login");
    return;
  }

  // 尝试处理未找到的路由
  if (to.matched.length === 0) {
    console.log("路由未找到，尝试动态添加：", to.path);

    // 尝试从路径推断可能的组件路径
    const pathSegments = to.path.split("/").filter(Boolean);

    // 构建可能的组件路径列表
    const possibleComponentPaths = [
      // 1. 直接使用完整路径
      pathSegments.join("/"),
      // 2. 最后一级可能是index
      [...pathSegments, "index"].join("/"),
      // 3. 只使用最后一级
      pathSegments[pathSegments.length - 1],
      // 4. 最后一级加index
      `${pathSegments[pathSegments.length - 1]}/index`,
    ];

    // 创建一个尝试添加路由的函数，依次尝试不同的组件路径
    const tryAddRoute = async (index: number): Promise<boolean> => {
      if (index >= possibleComponentPaths.length) {
        // 所有可能的路径都尝试失败，使用占位组件
        console.log("尝试所有可能的组件路径都失败，使用占位组件");
        return addDynamicRoute(
          to.path,
          "views/common/Coming",
          `dynamic-${Date.now()}`,
        );
      }

      const componentPath = possibleComponentPaths[index];
      console.log(
        `尝试添加路由 [${index + 1}/${possibleComponentPaths.length}]: ${to.path} -> views/${componentPath}`,
      );

      // 尝试添加路由
      const added = addDynamicRoute(
        to.path,
        `views/${componentPath}`,
        `dynamic-${Date.now()}`,
      );

      if (added) {
        console.log(`成功添加路由: ${to.path} -> views/${componentPath}`);
        return true;
      } else {
        // 当前路径添加失败，尝试下一个
        return tryAddRoute(index + 1);
      }
    };

    // 开始尝试添加路由
    const added = await tryAddRoute(0);

    if (added) {
      // 添加成功后重新导航到同一个地址，此时应该能找到路由
      next({ path: to.path, replace: true });
      return;
    }
  }

  // 如果路由匹配成功，尝试从菜单中获取标题
  try {
    const menuStore = useMenuStore();
    const menuItem = menuStore.findMenuByPath(to.path);

    if (menuItem && menuItem.name) {
      // 动态更新路由元信息中的标题
      if (!to.meta) to.meta = {};
      to.meta.title = menuItem.name;
      console.log(`从菜单中获取到标题: ${menuItem.name}, 路径: ${to.path}`);
    }
  } catch (error) {
    console.error("获取菜单标题失败:", error);
  }

  // 设置页面标题
  document.title = to.meta?.title
    ? `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
    : import.meta.env.VITE_APP_TITLE;

  next();
});

// 路由后置守卫
router.afterEach(() => {
  NProgress.done();
});

// 全局错误处理
router.onError((error) => {
  console.error("全局路由错误:", error);
  NProgress.done();
});

export default router;
