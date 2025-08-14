import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import App from "./App.vue";
import router from "./router";

// 样式文件 - 导入顺序很重要
import "element-plus/dist/index.css";
// 导入Element Plus暗黑模式样式
import "element-plus/theme-chalk/dark/css-vars.css";
// 导入Font Awesome图标
import "@fortawesome/fontawesome-free/css/all.css";
import "@/styles/element-plus.scss";
import "@/styles/dark-theme.scss";
import "@/styles/index.scss";

// 权限指令
import { setupDirectives } from "./directives";

// 全局组件
import { setupGlobalComponents } from "./components/global";

async function bootstrap() {
  const app = createApp(App);

  // 状态管理
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  app.use(pinia);

  // 路由
  app.use(router);

  // Element Plus
  app.use(ElementPlus, {
    locale: zhCn,
    size: "default",
  });

  // 注册 Element Plus 图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  // 设置权限指令
  setupDirectives(app);

  // 设置全局组件
  setupGlobalComponents(app);

  // 挂载应用
  app.mount("#app");
}

bootstrap();
