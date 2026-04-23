# AGENTS.md

> 情境地图，而非手册。告诉你"去哪找"，而非"所有细节"。

## 项目定位

Ant Design Pro 企业级脚手架模板。React 19 + Umi Max 4 + Ant Design 6。

## 深层文档导航

| 文档 | 内容 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 技术架构、目录结构、核心配置 |
| [docs/FRONTEND.md](./docs/FRONTEND.md) | 组件规范、状态管理、API 调用模式 |
| [docs/DESIGN.md](./docs/DESIGN.md) | 设计系统、色彩、间距、组件使用规范 |
| [docs/PLANS.md](./docs/PLANS.md) | 当前迭代计划，执行前必读 |
| [docs/SECURITY.md](./docs/SECURITY.md) | 鉴权、权限、数据安全规范 |
| [docs/design-docs/core-beliefs.md](./docs/design-docs/core-beliefs.md) | 工程核心决策与背后原因 |
| [docs/product-specs/index.md](./docs/product-specs/index.md) | 产品功能规格索引 |

## 功能模块文档规范

### 1. 文件命名约定
统一使用小写并以中划线分隔，格式为：`[YYYY-MM-DD]-[功能名].[类型].md`
- **类型标识**：`spec` (规格), `design` (设计), `impl` (实施), `trouble` (避坑)
- **示例**：`2024-04-23-multitab.spec.md`

### 2. 必要元数据 (文档头部)
每篇文档开头必须包含以下区块：
```markdown
---
name: 功能名称
date: YYYY-MM-DD
status: [草稿 | 进行中 | 已完成 | 已废弃]
author: 负责人
---
```

### 3. 目录映射
每一个独立的功能模块必须提供以下文档：

- **产品规格 (`docs/product-specs/`)**：定义“是什么”，包含用户故事、验收标准、边界情况。新增后需更新该目录下的 `index.md`。
- **技术设计 (`docs/design-docs/`)**：定义“怎么做”，遵循四段式结构（背景、方案对比、决策、后果）。不写教程，聚焦决策原因。新增后需更新 `index.md`。
- **实施路径 (`docs/implementations/`)**：记录“做了什么”，包含集成步骤、核心代码说明。
- **执行计划 (`docs/exec-plans/`)**：记录任务拆解。`active/` 存放进行中，`completed/` 存放已完成。
- **避坑指南 (`docs/troubleshooting/`)**：记录“错了什么”，包含开发中遇到的坑、解决方案、遗留问题。
- **自动生成 (`docs/generated/`)**：只允许存放自动生成的 schema 记录或纯输出结果（如 `db-schema.md`）。

- 包管理器：**仅 pnpm**，禁止 npm/yarn
- API 调用：**仅 Umi request**，禁止 fetch/axios
- 类型：**禁止 any**，导入用 `import type`
- 样式：**禁止硬编码颜色**，用主题 token 或 Tailwind 工具类
- Git 提交：**仅英文** (Commit messages must be in English)
- `src/.umi/` **禁止手动修改**

## 常用命令

```bash
pnpm dev       # 启动（无 Mock，端口 3000）
pnpm start     # 启动（带 Mock）
pnpm build     # 构建
pnpm biome     # 格式化修复
pnpm tsc       # 类型检查
pnpm test      # 测试
```

## 新增页面：最短路径

```bash
# 1. 创建页面
src/pages/<name>/index.tsx

# 2. 注册路由（必须）
config/routes.ts

# 3. 添加菜单文本（显示在菜单时）
src/locales/zh-CN/menu.ts  →  'menu.<name>': '页面名称'

# 4. Mock 数据（可选）
src/pages/<name>/_mock.ts
```

详见 → [docs/product-specs/index.md](./docs/product-specs/index.md)

## 遇到问题？

| 问题 | 解决 |
|------|------|
| 端口占用 | 修改 `package.json` 的 `PORT` |
| Umi 缓存 | `rm -rf src/.umi && pnpm dev` |
| 类型缺失 | `max setup` |
| 依赖失败 | `pnpm store prune && rm -rf node_modules && pnpm install` |
