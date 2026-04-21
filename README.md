# Ant Design Pro Web Template

<p align="center">
  <img src="./public/logo.svg" width="120" alt="Logo" />
</p>

<p align="center">
  <strong>基于 React 19 + Umi Max 4 + Ant Design 6 的企业级前端开发模板</strong>
</p>

<p align="center">
  <a href="https://github.com/hexiaolv/web-template/actions"><img src="https://github.com/hexiaolv/web-template/workflows/CI/badge.svg" alt="CI Status" /></a>
  <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg" alt="pnpm" /></a>
  <a href="https://biomejs.dev/"><img src="https://img.shields.io/badge/linted%20with-Biome-60a5fa.svg" alt="Biome" /></a>
  <a href="https://ant.design"><img src="https://img.shields.io/badge/UI-Ant%20Design%206-0170fe.svg" alt="Ant Design" /></a>
</p>

---

## 🚀 项目愿景

本模板旨在为中大型企业应用提供一个**开箱即用、性能卓越、标准严格**的前端初始方案。它集成了业界最先进的工程化工具链，确保代码的可维护性与开发体验。

> [!IMPORTANT]
> 本项目已被部署至 [GitHub Pages 演示地址](https://hexiaolv.github.io/web-template/)。
> *注：演示环境采用生产 Mock 模式，支持虚假登录展示功能。*

## 🛠️ 技术栈

| 维度 | 技术选型 | 版本 | 说明 |
| :--- | :--- | :--- | :--- |
| **框架** | [React](https://react.dev/) | 19.x | 包含最新 Concurrent 特性 |
| **应用框架** | [Umi Max](https://umijs.org/docs/max/introduce) | 4.x | 企业级应用框架 |
| **UI 组件库** | [Ant Design](https://ant.design) | 6.x | 现代化的视觉设计系统 |
| **业务库** | [@ant-design/pro-components](https://procomponents.ant.design/) | 3.min | 高级业务组件 |
| **状态管理** | [React Query](https://tanstack.com/query) | 5.x | 强大的服务端状态管理 |
| **基础样式** | [Tailwind CSS](https://tailwindcss.com/) | 4.x | 原子化 CSS 引擎 |
| **代码工具** | [Biome](https://biomejs.dev/) | 2.x | 极速的代码格式化与校验 |
| **包管理** | [pnpm](https://pnpm.io/) | 10.x | 快速、磁盘空间利用率高 |

## 📂 目录结构预览

```bash
├── config/             # 工程配置文件（路由、代理、环境）
├── mock/               # Mock 数据（本地开发模式）
├── public/             # 静态资源
├── src/
│   ├── access.ts       # 权限定义与管理
│   ├── app.tsx         # 运行时配置（入口、初始状态、请求拦截）
│   ├── components/     # 全局公共组件
│   ├── locales/        # 国际化语言包
│   ├── pages/          # 页面组件集
│   ├── services/       # API 请求层（统一管理）
│   └── requestErrorConfig.ts # 全局请求错误处理逻辑
├── tests/              # 测试配置文件
├── ARCHITECTURE.md     # 技术架构详细说明
└── AGENTS.md           # 智能代理开发指南
```

## ⚡ 快速开始

### 1. 环境依赖
确保您的 Node.js 版本 `>= 20.0.0`，并安装了 `pnpm`。

### 2. 安装依赖
```bash
pnpm install
```

### 3. 启动开发服务器
```bash
pnpm dev       # 默认不带 Mock (端口 3000)
pnpm start     # 启用 Mock 数据
```

### 4. 代码质量与测试
```bash
pnpm lint      # 执行 Biome 校验与 TypeScript 类型检查
pnpm test      # 运行 Jest 单元测试
pnpm build     # 生产环境构建
```

## ☁️ CI/CD 与部署

项目集成了 GitHub Actions 自动化流程：

- **CI 工作流**：每次提交代码或提交 PR 时自动运行 Lint 和单元测试。
- **部署工作流**：支持手动触发将 `dist` 产物分发至 GitHub Pages。由于 GitHub Pages 为静态托管，我们在生产环境下通过 API 拦截机制实现了 Demo 演示所需的 Mock 数据回退功能。

## 📖 深度文档

- [ARCHITECTURE.md](./ARCHITECTURE.md) - 技术架构设计细节
- [docs/FRONTEND.md](./docs/FRONTEND.md) - 前端代码规范与最佳实践
- [docs/SECURITY.md](./docs/SECURITY.md) - 安全性规范保证

---

<p align="center">
  Made with ❤️ by hexiaolv
</p>
