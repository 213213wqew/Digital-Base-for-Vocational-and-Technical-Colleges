import type { App } from "vue";
import { useUserStore } from "@/store/modules/user";

/**
 * 注册全局自定义指令
 * @param app Vue 应用实例
 */
export function setupDirectives(app: App<Element>): void {
  // 权限指令：v-permission
  app.directive("permission", {
    mounted(el, binding) {
      const { value } = binding;
      const userStore = useUserStore();

      if (value && value instanceof Array && value.length > 0) {
        const hasPermission = userStore.hasPermission(value);

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      } else {
        throw new Error("使用方式: v-permission=\"['admin','editor']\"");
      }
    },
  });

  // 角色指令：v-role
  app.directive("role", {
    mounted(el, binding) {
      const { value } = binding;
      const userStore = useUserStore();

      if (value && value instanceof Array && value.length > 0) {
        const hasRole = userStore.hasRole(value);

        if (!hasRole) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      } else {
        throw new Error("使用方式: v-role=\"['admin','editor']\"");
      }
    },
  });

  // 元素拖拽指令：v-draggable
  app.directive("draggable", {
    mounted(el) {
      el.style.cursor = "move";
      el.style.position = "absolute";

      el.onmousedown = function (e: MouseEvent) {
        const disx = e.pageX - el.offsetLeft;
        const disy = e.pageY - el.offsetTop;

        document.onmousemove = function (e: MouseEvent) {
          el.style.left = e.pageX - disx + "px";
          el.style.top = e.pageY - disy + "px";
        };

        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
        };

        return false;
      };
    },
  });

  // 只能输入数字：v-number
  app.directive("number", {
    mounted(el) {
      el.addEventListener("keypress", (e: KeyboardEvent) => {
        e = (e || window.event) as KeyboardEvent;
        const charCode =
          typeof e.charCode === "number" ? e.charCode : e.keyCode;
        const re = /\d/;
        if (
          !re.test(String.fromCharCode(charCode)) &&
          charCode > 9 &&
          !e.ctrlKey
        ) {
          e.preventDefault();
        }
      });
    },
  });

  // 防止按钮连续点击：v-throttle
  app.directive("throttle", {
    mounted(el, binding) {
      let throttleTime = binding.value || 2000; // 默认2秒内不可重复点击

      let timer: number | null = null;
      el.addEventListener(
        "click",
        (e: Event) => {
          if (!timer) {
            timer = window.setTimeout(() => {
              timer = null;
            }, throttleTime);
          } else {
            e.stopImmediatePropagation();
          }
        },
        true,
      );
    },
  });

  // 点击元素外部：v-click-outside
  app.directive("click-outside", {
    mounted(el, binding) {
      const handler = (e: MouseEvent) => {
        if (el.contains(e.target as Node)) {
          return;
        }
        binding.value(e);
      };
      el.__vueClickOutside__ = handler;
      document.addEventListener("click", handler);
    },
    beforeUnmount(el) {
      document.removeEventListener("click", el.__vueClickOutside__);
      delete el.__vueClickOutside__;
    },
  });
}

// 为TypeScript添加类型声明扩展
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    __vueClickOutside__?: any;
  }
}
