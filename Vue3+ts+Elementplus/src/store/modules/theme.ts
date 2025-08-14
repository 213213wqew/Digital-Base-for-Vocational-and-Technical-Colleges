import { defineStore } from "pinia";
import type { ThemeSettings } from "@/types";

interface ThemeState {
  settings: ThemeSettings;
}

const defaultSettings: ThemeSettings = {
  primaryColor: "#409EFF",
  isDark: false,
  darkMode: false,
  layout: "vertical",
  sidebarCollapsed: false,
  showTabs: true,
  showBreadcrumb: true,
  fixedHeader: true,
  showFooter: true,
  followSystem: false,
};

export const useThemeStore = defineStore("theme", {
  state: (): ThemeState => ({
    settings: { ...defaultSettings },
  }),

  getters: {
    // 当前主题模式
    themeMode: (state) => (state.settings.isDark ? "dark" : "light"),

    // 侧边栏宽度
    sidebarWidth: (state) =>
      state.settings.sidebarCollapsed ? "64px" : "280px",

    // 主要内容区域样式
    mainContentStyle: (state) => ({
      marginLeft:
        state.settings.layout === "vertical"
          ? state.settings.sidebarCollapsed
            ? "64px"
            : "280px"
          : "0",
      paddingTop: state.settings.fixedHeader ? "60px" : "0",
    }),

    // CSS变量
    cssVars: (state) => ({
      "--el-color-primary": state.settings.primaryColor,
      "--sidebar-width": state.settings.sidebarCollapsed ? "64px" : "280px",
      "--header-height": "60px",
    }),
  },

  actions: {
    // 初始化主题
    initTheme(): void {
      this.applyTheme();

      // 监听系统主题变化
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          if (this.settings.followSystem) {
            this.setDarkMode(e.matches);
          }
        };
        mediaQuery.addEventListener("change", handleSystemThemeChange);
      }
    },

    // 应用主题
    applyTheme(): void {
      const root = document.documentElement;

      // 设置CSS变量
      Object.entries(this.cssVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // 设置主题模式
      if (this.settings.isDark) {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
        document.body.setAttribute("data-theme", "dark");
        document.body.classList.add("dark-mode");
        // 添加Element Plus暗黑模式类
        document.documentElement.classList.add("dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
        document.body.setAttribute("data-theme", "light");
        document.body.classList.remove("dark-mode");
        // 移除Element Plus暗黑模式类
        document.documentElement.classList.remove("dark");
      }

      // 设置主题色 - 无论是亮色还是暗色模式都应用主题色
      root.style.setProperty("--el-color-primary", this.settings.primaryColor);

      // 确保标签页也应用主题色
      this.updateElementPlusTheme();
    },

    // 更新Element Plus主题色
    updateElementPlusTheme(): void {
      const style = document.createElement("style");
      const isDark = this.settings.isDark;

      style.innerHTML = `
        :root {
          --el-color-primary: ${this.settings.primaryColor};
          --el-color-primary-light-3: ${this.lightenColor(this.settings.primaryColor, 30)};
          --el-color-primary-light-5: ${this.lightenColor(this.settings.primaryColor, 50)};
          --el-color-primary-light-7: ${this.lightenColor(this.settings.primaryColor, 70)};
          --el-color-primary-light-8: ${this.lightenColor(this.settings.primaryColor, 80)};
          --el-color-primary-light-9: ${this.lightenColor(this.settings.primaryColor, 90)};
          --el-color-primary-dark-2: ${this.darkenColor(this.settings.primaryColor, 20)};
        }
        
        [data-theme='dark'] {
          --el-color-primary: ${this.settings.primaryColor};
          --el-color-primary-light-3: ${this.lightenColor(this.settings.primaryColor, 30)};
          --el-color-primary-light-5: ${this.lightenColor(this.settings.primaryColor, 50)};
          --el-color-primary-light-7: ${this.lightenColor(this.settings.primaryColor, 70)};
          --el-color-primary-light-8: ${this.lightenColor(this.settings.primaryColor, 80)};
          --el-color-primary-light-9: ${this.lightenColor(this.settings.primaryColor, 90)};
          --el-color-primary-dark-2: ${this.darkenColor(this.settings.primaryColor, 20)};
          
          /* 确保表格当前行使用主题色 */
          --el-table-current-row-bg-color: ${this.darkenColor(this.settings.primaryColor, 20)};
        }
      `;

      // 移除旧的样式标签
      const oldStyle = document.getElementById("theme-style");
      if (oldStyle) {
        oldStyle.remove();
      }

      // 添加新的样式标签
      style.id = "theme-style";
      document.head.appendChild(style);
    },

    // 颜色加亮
    lightenColor(color: string, amount: number): string {
      try {
        // 移除#并转换为RGB
        const hex = color.replace("#", "");
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // 加亮
        r = Math.min(255, r + Math.floor((255 - r) * (amount / 100)));
        g = Math.min(255, g + Math.floor((255 - g) * (amount / 100)));
        b = Math.min(255, b + Math.floor((255 - b) * (amount / 100)));

        // 转回HEX
        const rHex = r.toString(16).padStart(2, "0");
        const gHex = g.toString(16).padStart(2, "0");
        const bHex = b.toString(16).padStart(2, "0");

        return `#${rHex}${gHex}${bHex}`;
      } catch (e) {
        console.error("颜色转换错误", e);
        return color;
      }
    },

    // 颜色变暗
    darkenColor(color: string, amount: number): string {
      try {
        // 移除#并转换为RGB
        const hex = color.replace("#", "");
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        // 变暗
        r = Math.max(0, r - Math.floor(r * (amount / 100)));
        g = Math.max(0, g - Math.floor(g * (amount / 100)));
        b = Math.max(0, b - Math.floor(b * (amount / 100)));

        // 转回HEX
        const rHex = r.toString(16).padStart(2, "0");
        const gHex = g.toString(16).padStart(2, "0");
        const bHex = b.toString(16).padStart(2, "0");

        return `#${rHex}${gHex}${bHex}`;
      } catch (e) {
        console.error("颜色转换错误", e);
        return color;
      }
    },

    // 切换深色模式
    toggleDarkMode(): void {
      this.settings.isDark = !this.settings.isDark;
      this.settings.darkMode = this.settings.isDark;
      this.applyTheme();
    },

    // 设置深色模式
    setDarkMode(isDark: boolean): void {
      this.settings.isDark = isDark;
      this.settings.darkMode = isDark;
      this.applyTheme();
    },

    // 设置主题色
    setPrimaryColor(color: string): void {
      this.settings.primaryColor = color;
      this.applyTheme();
    },

    // 设置布局模式
    setLayout(layout: ThemeSettings["layout"]): void {
      this.settings.layout = layout;
      this.applyTheme();
    },

    // 切换侧边栏折叠状态
    toggleSidebar(): void {
      this.settings.sidebarCollapsed = !this.settings.sidebarCollapsed;
      this.applyTheme();
    },

    // 设置侧边栏折叠状态
    setSidebarCollapsed(collapsed: boolean): void {
      this.settings.sidebarCollapsed = collapsed;
      this.applyTheme();
    },

    // 更新主题设置
    updateSettings(settings: Partial<ThemeSettings>): void {
      this.settings = { ...this.settings, ...settings };
      this.applyTheme();
    },

    // 重置主题设置
    resetSettings(): void {
      this.settings = { ...defaultSettings };
      this.applyTheme();
    },

    // 保存主题设置
    saveThemeSettings(): void {
      // 无需额外操作，pinia-plugin-persistedstate会自动处理持久化
    },

    // 重命名为resetTheme以匹配组件调用
    resetTheme(): void {
      this.resetSettings();
    },

    // 切换跟随系统主题
    toggleFollowSystem(): void {
      this.settings.followSystem = !this.settings.followSystem;
      if (this.settings.followSystem) {
        // 如果开启跟随系统，则立即应用系统主题
        const isDarkMode =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        this.setDarkMode(isDarkMode);
      }
    },

    // 获取预设主题
    getPresetThemes() {
      return [
        { name: "默认蓝", color: "#409EFF" },
        { name: "薄荷绿", color: "#00C4A7" },
        { name: "极光绿", color: "#36CFC9" },
        { name: "拂晓蓝", color: "#1890FF" },
        { name: "日暮", color: "#F5222D" },
        { name: "火山", color: "#FA541C" },
        { name: "日出", color: "#FAAD14" },
        { name: "青春", color: "#13C2C2" },
        { name: "极客蓝", color: "#2F54EB" },
        { name: "酱紫", color: "#722ED1" },
      ];
    },
  },

  // 持久化配置
  persist: {
    key: "theme-store",
    storage: localStorage,
    paths: ["settings"],
  },
});
