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

## 关键规则（违反需说明原因）

- API 调用：**仅 Umi request**，禁止 fetch/axios
- 类型：**禁止 any**，导入用 `import type`
- 样式：**禁止硬编码颜色**，用主题 token 或 Tailwind 工具类
- `src/.umi/` **禁止手动修改**

## 常用命令

```bash
npm run dev       # 启动（无 Mock，端口 3000）
npm run start     # 启动（带 Mock）
npm run build     # 构建
npm run biome     # 格式化修复
npm run tsc       # 类型检查
npm run test      # 测试
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
| Umi 缓存 | `rm -rf src/.umi && npm run dev` |
| 类型缺失 | `npx max setup` |
| 依赖失败 | `rm -rf node_modules && npm install` |
