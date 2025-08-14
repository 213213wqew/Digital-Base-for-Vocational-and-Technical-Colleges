import { defineStore } from "pinia";

interface AppState {
  loading: boolean;
  sidebarOpened: boolean;
  device: "desktop" | "tablet" | "mobile";
  layoutMode: "sidebar" | "top";
  showTags: boolean;
  fixedHeader: boolean;
  showBreadcrumb: boolean;
  pageTransition: boolean;
  enableCache: boolean;
  showMenuSearch: boolean;
}

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    loading: false,
    sidebarOpened: true,
    device: "desktop",
    layoutMode: "sidebar",
    showTags: true,
    fixedHeader: true,
    showBreadcrumb: false,
    pageTransition: true,
    enableCache: true,
    showMenuSearch: true,
  }),

  getters: {
    isMobile: (state) => state.device === "mobile",
  },

  actions: {
    setLoading(loading: boolean): void {
      this.loading = loading;
    },

    toggleSidebar(): void {
      this.sidebarOpened = !this.sidebarOpened;
    },

    initApp(): void {
      // 初始化应用
      this.updateDevice();
      window.addEventListener("resize", this.updateDevice);
    },

    updateDevice(): void {
      const width = window.innerWidth;
      if (width < 768) {
        this.device = "mobile";
        this.sidebarOpened = false;
      } else if (width < 1024) {
        this.device = "tablet";
      } else {
        this.device = "desktop";
      }
    },

    destroyApp(): void {
      window.removeEventListener("resize", this.updateDevice);
    },

    setLayoutMode(mode: "sidebar" | "top"): void {
      this.layoutMode = mode;
    },

    saveAppSettings(): void {
      // 保存设置，无需额外处理，pinia-plugin-persistedstate会自动处理
    },

    resetSettings(): void {
      this.layoutMode = "sidebar";
      this.showTags = true;
      this.fixedHeader = true;
      this.showBreadcrumb = false;
      this.pageTransition = true;
      this.enableCache = true;
      this.sidebarOpened = true;
      this.showMenuSearch = true;
    },

    resetState(): void {
      this.loading = false;
      this.sidebarOpened = true;
    },
  },

  persist: {
    key: "app-store",
    storage: localStorage,
    paths: [
      "sidebarOpened",
      "layoutMode",
      "showTags",
      "fixedHeader",
      "showBreadcrumb",
      "pageTransition",
      "enableCache",
      "showMenuSearch",
    ],
  },
});
