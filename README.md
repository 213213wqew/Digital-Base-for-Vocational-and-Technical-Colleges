# Vue3数字基座管理系统

基于 Vue3 + TypeScript + Element Plus 的现代化权限管理前端框架

## ✨ 特性

- 🎯 **最新技术栈**：Vue3 + TypeScript + Element Plus + Vite
- 🔐 **完整权限系统**：RBAC权限模型，支持菜单权限、按钮权限、数据权限
- 🎨 **精美界面**：基于Element Plus设计，支持主题切换
- 📱 **响应式设计**：完美适配桌面端、平板、手机
- ⚡ **性能优化**：路由懒加载、组件按需引入、PWA支持
- 🛠️ **开发体验**：TypeScript类型安全、ESLint代码规范、自动导入
- 🔧 **工程化**：标准化目录结构、配置化开发

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0 或 pnpm >= 8.0.0

### 安装依赖

```bash
# 使用npm
npm install

# 使用yarn
yarn install

# 使用pnpm
pnpm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
Vue3+ts+Elementplus/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API接口
│   ├── components/        # 公共组件
│   ├── directives/        # 自定义指令
│   ├── hooks/             # 组合式API
│   ├── layout/            # 布局组件
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── styles/            # 样式文件
│   ├── types/             # 类型定义
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── .env                   # 环境变量
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── index.html            # HTML模板
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
├── vite.config.ts        # Vite配置
└── README.md             # 项目文档
```

## 📊 功能模块

### 仪表盘
- 系统概览和数据统计
- 快捷操作入口
- 最近动态列表
- 待办事项管理
- 系统通知和状态监控

### 用户管理
- 用户列表查看和管理
- 用户新增、编辑、删除
- 用户角色分配
- 用户状态控制
- 批量操作支持

### 角色管理
- 角色列表管理
- 角色权限配置
- 用户角色分配
- 角色继承和层级管理

### 系统监控
- 在线用户实时监控
- 用户会话管理
- 系统性能监控
- 用户行为跟踪
- 强制退出和消息推送

### 权限管理
- 菜单权限配置
- 按钮权限控制
- 数据权限管理
- API接口权限

## 🔐 权限系统

### 默认登录账号

- 用户名：admin
- 密码：123456
### 功能
自动获取数,数据分析，数据对比，自动上传等功能

### 权限指令使用

```vue
<!-- 权限控制 -->
<el-button v-permission="'user:create'">新增用户</el-button>

<!-- 角色控制 -->
<el-button v-permission:role="'admin'">管理员功能</el-button>

<!-- 多权限控制 -->
<el-button v-permission="['user:create', 'user:impl']">操作用户</el-button>
```

## 🎨 主题配置

系统内置多套主题色，支持深色/浅色模式切换，支持动态主题色切换。

## 📱 响应式支持

完美适配各种设备尺寸：
- 手机：< 768px
- 平板：768px - 1024px  
- 桌面：> 1024px

## 🛠️ 开发指南

### 添加新页面

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 如需权限控制，在路由meta中添加permissions字段

### 添加新API

1. 在 `src/api/` 下创建API文件
2. 定义接口类型在 `src/types/index.ts`
3. 使用 `src/utils/request.ts` 中的http方法

### 状态管理

使用Pinia进行状态管理，在 `src/store/modules/` 下创建新的store模块。

## 📋 开发规范

- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 使用Prettier格式化代码
- 组件名使用PascalCase
- 文件名使用kebab-case

菜单介绍

<img width="1579" height="813" alt="image" src="https://github.com/user-attachments/assets/11db9d20-a65a-4564-bbf5-9bde91eeaa98" />

<img width="1879" height="935" alt="image" src="https://github.com/user-attachments/assets/87c27430-15df-4277-9db4-2a2626d1ee49" />

<img width="1920" height="874" alt="image" src="https://github.com/user-attachments/assets/3297faaa-09f4-4c49-82be-7f27edb5f94d" />
<img width="1920" height="926" alt="image" src="https://github.com/user-attachments/assets/e6b0cb97-d462-4ec9-a0bf-aca0df307057" />
<img width="1905" height="929" alt="image" src="https://github.com/user-attachments/assets/f8218698-ad35-47ab-bc54-720cd8777cff" />




## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送分支
5. 提交Pull Request

## 📄 许可证

MIT License

---

⭐ 如果这个项目对您有帮助，请给我们一个Star！
