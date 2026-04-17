# ARCHITECTURE.md

> 技术架构的记录系统。描述"是什么"和"为什么"。

## 技术栈

| 层次 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 19.x |
| 应用框架 | Umi Max | 4.x |
| UI 库 | Ant Design | 6.x |
| 业务组件 | @ant-design/pro-components | 3.x |
| 服务端状态 | @tanstack/react-query | 5.x |
| CSS-in-JS | antd-style | 4.x |
| 原子 CSS | Tailwind CSS | 4.x |
| 类型检查 | TypeScript | 6.x |
| 代码规范 | Biome | 2.x |
| 测试 | Jest | 30.x |
| 包管理 | pnpm | 10.x |

## 目录结构

```
config/
  config.ts           # Umi 主配置（插件、构建、环境）
  routes.ts           # 路由表（新增页面必须在此注册）
  defaultSettings.ts  # ProLayout 主题配置（主色 #1890ff）
  proxy.ts            # 开发代理配置

src/
  pages/              # 页面组件（kebab-case 目录名）
  components/         # 全局共享组件（PascalCase）
  services/           # API 调用层（禁止绕过，用 Umi request）
  locales/zh-CN/      # 中文 i18n（menu.ts / pages.ts）
  access.ts           # 权限定义（所有权限从这里导出）
  app.tsx             # 运行时入口（getInitialState, layout, request）
  global.less         # 全局样式覆盖

mock/                 # Mock 数据（pnpm start 时启用）
types/                # 全局 TypeScript 类型（API namespace）
docs/                 # 记录系统（见下方）
```

## 核心配置说明

### `src/app.tsx`

三个关键导出：

```typescript
// 1. 初始状态（currentUser 挂在这里）
export async function getInitialState() {}

// 2. 布局配置（头像、菜单、页面跳转守卫）
export const layout: RunTimeLayoutConfig = ({ initialState }) => {};

// 3. 请求全局配置（baseURL、拦截器）
export const request: RequestConfig = {};
```

### `src/access.ts`

权限由此导出，路由 `access` 字段引用这里的 key：

```typescript
export default function access({ currentUser }) {
  return {
    canAdmin: currentUser?.access === 'admin',
    canUser: !!currentUser,
  };
}
```

### `config/routes.ts`

路由字段说明：

| 字段 | 说明 |
|------|------|
| `path` | URL 路径 |
| `component` | 相对于 `src/pages/` 的路径 |
| `name` | 菜单文本的 i18n key（`menu.<name>`） |
| `access` | 权限标识，对应 `access.ts` 返回值 |
| `layout: false` | 不使用 ProLayout（登录页） |
| `hideInMenu: true` | 不在菜单显示 |

## docs/ 记录系统结构

```
docs/
  design-docs/        # 工程设计决策（为什么这样做）
  exec-plans/         # 执行计划
    active/           # 进行中
    completed/        # 已完成
    tech-debt-tracker.md
  generated/          # 自动生成的文档（禁止手动修改）
  product-specs/      # 产品规格（功能需求）
  references/         # 外部技术参考（llms.txt 格式）
  DESIGN.md           # 设计系统速查
  FRONTEND.md         # 前端开发规范
  PLANS.md            # 当前计划摘要
  PRODUCT_SENSE.md    # 产品判断原则
  QUALITY_SCORE.md    # 质量标准定义
  RELIABILITY.md      # 稳定性与容错规范
  SECURITY.md         # 安全规范
```

## 关键约束

- `src/.umi/` 由框架自动生成，禁止手动修改
- `docs/generated/` 禁止手动修改，由脚本生成
- 所有对外 API 调用必须经过 `src/services/`，禁止组件内直接调用
