import type { App } from "vue";
import SvgIcon from "./SvgIcon.vue";
import StatusTag from "./StatusTag.vue";
import TitlePanel from "./TitlePanel.vue";
import ProgressDialog from "../ProgressDialog/index.vue";

// 全局组件列表
const components = {
  SvgIcon,
  StatusTag,
  TitlePanel,
  ProgressDialog,
};

/**
 * 注册全局组件
 * @param app Vue应用实例
 */
export function setupGlobalComponents(app: App<Element>): void {
  // 注册所有全局组件
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });

  // 这里可以添加其他全局组件的注册逻辑
  console.log("全局组件已注册");
}
