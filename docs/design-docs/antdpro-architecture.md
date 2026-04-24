---
name: Ant Design Pro 架构方案
date: 2026-04-24
status: 进行中
author: heguanghai
---

# Ant Design Pro 大型后台管理系统架构方案

> 适用于 100+ 页面的企业级后台  
> 基于 Umi Max 4 · React 19 · Ant Design 6 · TypeScript 6

> **文档性质**：目标落地方案。各章节以「目标架构」为主线，通过状态标记区分已落地与待实现部分。

### 各章节落地状态

| 章节 | 状态 | 说明 |
|------|------|------|
| 1. 技术栈 | ✅ 已验证 | 与 package.json 一致 |
| 2. 分层架构 | 📐 架构设计 | 分层理念已确定，部分层级待建设 |
| 3. 目录结构 | 🔄 部分实现 | 基础框架已有，shared/hooks/utils/constants 待创建 |
| 4. 共享实体层 | 📋 待实现 | 设计完成，代码未实现 |
| 5. 业务模块 | 📋 规划 | 模块清单，待逐步建设 |
| 6. 组件体系 | 🔄 部分实现 | MultiTab 已有，通用业务组件待建设 |
| 7. 自定义 Hook | 📋 待实现 | 待实现 |
| 8. 数据层设计 | ✅ 已实现 | request + TanStack Query 配置已到位 |
| 9. 权限系统 | 🔄 基础版 | 仅 canAdmin，动态权限模型待扩展 |
| 10. 路由配置 | 🔄 基础版 | 脚手架示例路由，待按业务扩展 |
| 11. 工具函数 | 📋 待实现 | 待实现 |
| 12. 代码规范 | 🔄 部分实现 | Biome 基础配置已有，架构边界规则待补充 |
| 13. 设计原则 | ✅ 有效 | 原则性内容不依赖具体实现 |

---

## 目录

1. [技术栈](#1-技术栈)
2. [分层架构](#2-分层架构)
3. [目录结构](#3-目录结构)
4. [共享实体层（Shared）](#4-共享实体层shared)
5. [业务模块划分](#5-业务模块划分)
6. [组件体系](#6-组件体系)
7. [自定义 Hook](#7-自定义-hook)
8. [数据层设计](#8-数据层设计)
   - [补充：MultiTab 多页签系统 ✅](#补充multitab-多页签系统-)
   - [补充：构建与部署决策 ✅](#补充构建与部署决策-)
9. [权限系统](#9-权限系统)
10. [路由配置](#10-路由配置)
11. [工具函数](#11-工具函数)
12. [代码规范与边界约束](#12-代码规范与边界约束)
13. [设计原则总结](#13-设计原则总结)

---

## 1. 技术栈

> 版本均来自项目实际 `package.json`，非泛指。

| 分类 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 应用框架 | `@umijs/max` | 4.6.x | 路由、构建、权限、i18n、Mock 一体化 |
| UI 框架 | React | **19.2.x** | 视图层，支持并发特性 |
| 组件库 | Ant Design | **6.2.x** | 基础 UI 组件 |
| 高级组件 | `@ant-design/pro-components` | **3.1.x** | ProTable / ProForm / ProLayout |
| 服务端状态 | `@tanstack/react-query` | **5.97.x** | API 缓存、请求去重、后台刷新 |
| CSS-in-JS | `antd-style` | 4.1.x | 动态主题、组件级样式 |
| 原子 CSS | Tailwind CSS | **4.0.x** | 辅助布局与间距 |
| 包管理 | pnpm | **10.33.x** | 强制使用（`preinstall` 脚本保证） |
| 类型检查 | TypeScript | **6.0.x** | 全项目类型安全 |
| 代码规范 | **Biome** | **2.1.x** | Lint + Format 一体（替代 ESLint + Prettier） |
| 提交校验 | Husky + commitlint | — | `prepare` 钩子自动安装 |
| 测试 | Jest 30 + Testing Library | 30.x / 16.x | 单元 & 组件测试 |
| 拖拽 | `@dnd-kit/*` | — | 可排序列表、拖拽交互 |
| 路由页签 | **MultiTab** | — | 内置多页签与 KeepAlive 状态保持 |
| 时间处理 | dayjs | 1.11.x | 日期格式化 |
| HTTP | Umi request（内置） | — | 通过 `src/app.tsx` RequestConfig 统一配置 |

### 关键决策说明

**Biome 而非 ESLint + Prettier**

Biome 是 Rust 编写的单一工具，同时承担 Lint 和 Format，速度比 ESLint + Prettier 组合快约 25 倍。项目通过 `pnpm biome` 进行全量检查与修复。后续将通过 `biome.json` 的 `noRestrictedImports` 规则强制执行架构边界（如禁止页面间直接引用 service），具体配置见[第 12 章](#12-代码规范与边界约束)。

**HTTP 层用 Umi 内置 request，不引入独立 Axios**

`@umijs/max` 内置了基于 `umi-request` 的请求方案，在 `src/app.tsx` 的 `export const request: RequestConfig` 中统一配置 baseURL、拦截器、Token 注入和错误处理。`src/services/` 中直接使用 `import { request } from '@umijs/max'`。

**TanStack Query v5**

v5 有破坏性变更：`cacheTime` 改为 `gcTime`，`useQuery` 参数改为对象形式，`status` 枚举也有调整。所有代码示例均按 v5 语法编写。

**全局状态用 Umi `useModel`，不引入 Zustand**

当前 `package.json` 未包含 Zustand。全局客户端状态（currentUser、权限）由 Umi Max 内置的 `getInitialState` + `useModel` 管理，与 ProLayout 深度集成。如后续需要更复杂的客户端状态，再按需引入。

---

## 2. 分层架构

```
┌─────────────────────────────────────────────┐
│              浏览器 / Browser                │
│  路由守卫 config/routes.ts                   │
│  权限过滤 src/access.ts                      │
│  全局布局 src/app.tsx → layout               │
│  ★ 页签系统 src/components/MultiTab          │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│               页面层 Pages                   │
│  src/pages/  业务页面（kebab-case 目录名）    │
│  ProTable / ProForm / 页面级 useState        │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│        ★ 共享实体层 Shared（核心）            │
│  src/shared/dept / user / dict / ...        │
│  跨模块实体的组件、Hook、只读 service、类型   │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              通用层 Common                   │
│  src/components/  src/hooks/                │
│  src/utils/       src/constants/            │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│               数据层 Data                    │
│  TanStack Query v5（服务端状态缓存）          │
│  Umi useModel / getInitialState（全局状态）   │
│  src/services/（API 调用，禁止绕过）          │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              网络层 Network                  │
│  src/app.tsx → RequestConfig                │
│  Token 注入  错误统一处理  baseURL           │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              服务端 API                      │
│  RESTful / OpenAPI   Mock（pnpm start）      │
└─────────────────────────────────────────────┘
```

---

## 3. 目录结构

> 与项目 `ARCHITECTURE.md` 约定对齐，在其基础上扩展 `shared/` 层。
> 标注说明：✅ 已存在 · 📋 待创建

```
project-root/
├── config/                             ✅
│   ├── config.ts                       # Umi 主配置（插件、构建、环境、hash 路由）
│   ├── routes.ts                       # 路由表（新增页面必须在此注册）
│   ├── defaultSettings.ts             # ProLayout 主题配置（主色 #1890ff、tabsLayout 开关）
│   ├── proxy.ts                       # 开发代理配置
│   └── oneapi.json                    # OpenAPI schema（配合 openapi 插件生成 service）
│
├── mock/                               ✅ Mock 数据（pnpm start 时启用）
│   ├── user.ts / listTableList.ts / notices.ts / ...
│   └── [业务模块].ts                   📋 按需新增
│
├── types/                              ✅ 全局 TypeScript 类型
│   └── index.d.ts                     # API namespace（由 OpenAPI 插件生成）
│
├── docs/                               ✅ 记录系统（见 ARCHITECTURE.md）
│
└── src/
    ├── app.tsx                         ✅ 运行时入口：getInitialState / layout / request
    ├── access.ts                       ✅ 权限定义，所有权限从这里导出
    ├── requestErrorConfig.ts           ✅ 请求错误统一配置
    ├── global.tsx                      ✅ 全局入口（Tailwind 导入、PWA / Service Worker 管理）
    ├── global.less                     ✅ 全局样式覆盖
    ├── global.style.ts                 ✅ 全局 CSS-in-JS 样式
    ├── tailwind.css                    ✅ Tailwind CSS 4 入口（@import "tailwindcss"）
    ├── loading.tsx                     ✅ 全局 loading 占位
    │
    ├── models/                         ✅ Umi useModel 全局状态
    │   └── multiTab.ts                # MultiTab 页签核心 Model
    │
    ├── shared/                         📋 共享实体层（核心新增，见第 4 章）
    │   ├── dept/
    │   ├── user/
    │   ├── dict/
    │   ├── position/
    │   └── index.ts
    │
    ├── pages/                          ✅ 业务页面（kebab-case 目录名）
    │   ├── user/login/                ✅ 登录页
    │   ├── Welcome.tsx                ✅ 欢迎页（脚手架默认首页）
    │   ├── table-list/                ✅ 表格演示页
    │   ├── Admin.tsx                   ✅ 管理页演示
    │   ├── 404.tsx                     ✅ 异常页
    │   ├── dashboard/                 📋 工作台
    │   ├── system/                    📋 系统管理（user / role / menu / dept）
    │   ├── finance/                   📋 财务模块
    │   ├── report/                    📋 报表模块
    │   └── ...
    │
    ├── components/                     ✅ 全局共享组件（PascalCase，无业务逻辑）
    │   ├── MultiTab/                  ✅ 多页签与 KeepAlive 系统
    │   ├── Footer/                    ✅ 页脚
    │   ├── HeaderDropdown/            ✅ 头部下拉菜单
    │   ├── RightContent/              ✅ 顶栏右侧（头像、语言切换）
    │   ├── AuthButton/                📋 权限按钮
    │   ├── SearchForm/                📋 统一查询表单
    │   ├── ModalForm/                 📋 弹窗表单封装
    │   ├── TableAction/               📋 表格操作列
    │   ├── DictTag/                   📋 字典标签（→ 可能移至 shared/dict）
    │   ├── FileUpload/                📋 文件上传
    │   ├── ExportBtn/                 📋 导出按钮
    │   ├── ImportModal/               📋 导入弹窗
    │   └── Charts/                    📋 图表组件
    │
    ├── services/                       ✅ API 调用层（禁止绕过，用 Umi request）
    │   ├── ant-design-pro/            ✅ 脚手架默认 API（api.ts / login.ts）
    │   └── modules/                   📋 按业务模块拆分（目标结构）
    │       ├── user.ts
    │       ├── dept.ts
    │       └── ...
    │
    ├── hooks/                          📋 自定义 Hook（通用，无业务语义）
    │   ├── useTable.ts
    │   ├── usePermission.ts
    │   ├── useDownload.ts
    │   └── useDebounce.ts
    │
    ├── utils/                          📋 纯函数工具
    │   ├── auth.ts
    │   ├── format.ts
    │   ├── validator.ts
    │   └── storage.ts
    │
    ├── constants/                      📋 常量（消灭魔法字符串）
    │   ├── dict.ts
    │   └── routes.ts
    │
    └── locales/zh-CN/                  ✅ 中文 i18n
        ├── menu.ts
        └── pages.ts
```

### 模块内部结构约定

每个业务模块（`pages/xxx/`）遵循统一结构：

```
pages/finance/
├── index.tsx              # 模块路由入口（或直接是列表页）
├── service.ts             # 本模块 API（禁止被其他模块直接引用）
├── typing.d.ts            # 本模块类型定义
├── components/            # 模块私有组件（不对外暴露）
│   ├── ExpenseForm.tsx
│   └── BillDetail.tsx
└── [子页面目录]/
    ├── index.tsx
    └── ...
```

---

## 4. 共享实体层（Shared）

> **📋 待实现** — 设计已完成，代码尚未创建。待第一个跨模块引用需求出现时落地。

这是 100+ 页面系统的核心架构决策。

### 问题

`部门`、`用户`、`岗位`、`字典`等实体被几乎所有业务模块引用（表单选项、查询条件、展示标签等），但它们不应该"属于"任何一个业务模块。若放在某个业务模块下，其他模块必须跨模块引用，产生强耦合。

### 解法：所有权 vs 引用权分离

| 层 | 路径 | 职责 | 可写入 |
|---|---|---|---|
| 共享层（读） | `src/shared/dept/` | 提供 DeptSelect、useDept、类型 | ❌ 只读 |
| 管理页（写） | `src/pages/system/dept/` | 部门增删改查 UI | ✅ 唯一写入口 |

**核心规则：共享层只暴露读取能力；写操作只发生在对应的管理页面。**

### 目录结构

```
src/shared/
├── dept/
│   ├── index.ts           # 对外唯一入口（控制暴露边界）
│   ├── DeptSelect.tsx     # 下拉 / 树选组件
│   ├── DeptTree.tsx       # 树形展示组件
│   ├── DeptCascader.tsx   # 级联选择组件
│   ├── useDept.ts         # Hook：TanStack Query 缓存
│   ├── service.ts         # 只在此处调用 dept 的 GET 接口
│   └── typing.d.ts        # Dept 相关类型
│
├── user/
│   ├── index.ts
│   ├── UserSelect.tsx
│   ├── UserAvatar.tsx
│   ├── useUser.ts
│   └── typing.d.ts
│
├── dict/                  # 特殊：全局枚举缓存，几乎所有模块依赖
│   ├── index.ts
│   ├── DictTag.tsx
│   ├── DictSelect.tsx
│   ├── useDict.ts
│   └── service.ts
│
├── position/              # 岗位
│
└── index.ts               # 可选：统一再导出
```

### 对外暴露契约（index.ts）

```typescript
// src/shared/dept/index.ts
// 只暴露三类：组件 · Hook · 类型
// ❌ 不导出 service.ts，业务模块无法直接调用 dept 写接口

export { DeptSelect }   from './DeptSelect';
export { DeptTree }     from './DeptTree';
export { DeptCascader } from './DeptCascader';
export { useDept }      from './useDept';
export type { Dept, DeptNode, DeptTreeNode } from './typing';
```

### useDept：TanStack Query v5 全局缓存

```typescript
// src/shared/dept/useDept.ts
import { useQuery } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { getDeptTree } from './service';

const DEPT_QUERY_KEY = ['shared', 'dept', 'tree'] as const;

export function useDept() {
  const { data = [], isLoading } = useQuery({
    queryKey: DEPT_QUERY_KEY,
    queryFn: getDeptTree,
    staleTime: 5 * 60 * 1000,  // 5 分钟内不重新请求
    gcTime:   30 * 60 * 1000,  // v5 语法（原 cacheTime）
  });

  // React 19 注意：在并发渲染模式下，确保 derive 数据是稳定的

  // 派生数据：避免调用处重复计算
  const deptMap = useMemo(
    () => new Map(data.map(d => [d.id, d])),
    [data]
  );

  const getDeptName = useCallback(
    (id: number) => deptMap.get(id)?.name ?? '-',
    [deptMap]
  );

  return { deptTree: data, deptMap, getDeptName, loading: isLoading };
}
```

100 个页面同时调用 `useDept()`，TanStack Query 保证只发一次请求，staleTime 内命中缓存，无额外网络开销。

### DeptSelect 组件

```typescript
// src/shared/dept/DeptSelect.tsx
import { TreeSelect } from 'antd';
import { useDept } from './useDept';
import type { DeptNode } from './typing';

interface DeptSelectProps {
  value?: number;
  onChange?: (val: number, node: DeptNode) => void;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  rootId?: number;       // 仅展示某个部门下的子树
  style?: React.CSSProperties;
}

export const DeptSelect: React.FC<DeptSelectProps> = ({
  value, onChange, placeholder = '请选择部门', ...rest
}) => {
  const { deptTree, loading } = useDept();

  return (
    <TreeSelect
      loading={loading}
      treeData={deptTree}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      treeDefaultExpandAll
      showSearch
      allowClear
      {...rest}
    />
  );
};
```

### 业务模块引用示例

```typescript
// pages/finance/components/ExpenseForm.tsx
import { DeptSelect } from '@/shared/dept';  // ✓ 通过 shared 层

export function ExpenseForm() {
  return (
    <ProForm>
      <ProFormItem name="deptId" label="归属部门" rules={[{ required: true }]}>
        <DeptSelect />
      </ProFormItem>
    </ProForm>
  );
}
```

```typescript
// pages/report/index.tsx
import { useDept } from '@/shared/dept';     // ✓ 通过 shared 层

export default function ReportPage() {
  const { getDeptName } = useDept();         // 命中缓存，无额外请求

  const columns = [
    {
      title: '部门',
      dataIndex: 'deptId',
      render: (id: number) => getDeptName(id),
    },
  ];

  return <ProTable columns={columns} request={fetchReportList} />;
}
```

### 哪些实体应进入 shared 层？

**判断标准：被 2 个以上业务模块引用的只读实体。**

| 实体 | 典型引用场景 |
|------|-------------|
| `dept` 部门 | 用户表单、查询过滤、财务归因、报表维度 |
| `user` 用户 | 审批人选择、操作者展示、消息发送目标 |
| `position` 岗位 | 人事表单、权限配置 |
| `dict` 字典 | 几乎所有模块的状态枚举标签 |
| `warehouse` 仓库（SPD） | 入库单、出库单、库存查询 |
| `material` 物料（SPD） | 采购单、入库单、消耗统计 |
| `supplier` 供应商（SPD） | 采购单、合同管理、对账 |
| `hospital` 医院（多院版） | 所有业务单据的归属机构 |

---

## 5. 业务模块划分

> **📋 规划清单** — 以下为目标业务模块，当前仅有脚手架演示页（Welcome / Admin / table-list）。新模块按需逐步建设。

### 模块清单

| 模块 | 路径 | 主要页面 | 状态 |
|------|------|---------|------|
| 认证 | `pages/user/` | 登录、注册、找回密码、MFA | 🔄 登录已有 |
| 仪表盘 | `pages/dashboard/` | 工作台、数据概览、实时监控 | 📋 |
| 系统管理 | `pages/system/` | 用户、角色、菜单、**部门**、岗位、字典、参数、日志 | 📋 |
| 权限中心 | `pages/permission/` | 权限分配、数据权限、API 权限 | 📋 |
| 组织架构 | `pages/hr/` | 组织树、员工管理、考勤 | 📋 |
| 财务 | `pages/finance/` | 账单、收款、付款、对账、发票 | 📋 |
| 内容管理 | `pages/content/` | 文章、分类、标签、评论、素材库 | 📋 |
| 订单 | `pages/order/` | 列表、详情、退款、物流 | 📋 |
| 商品 | `pages/product/` | 商品、分类、规格、库存、价格 | 📋 |
| 报表 | `pages/report/` | 销售、用户、运营、自定义、导出 | 📋 |
| 工作流 | `pages/workflow/` | 流程设计、待办、监控、表单设计 | 📋 |
| 消息 | `pages/message/` | 站内信、模板、推送、统计 | 📋 |
| 运维监控 | `pages/monitor/` | 服务器、在线用户、缓存、任务调度 | 📋 |

### 模块边界规则

```
❌ 禁止：跨业务模块直接引用 service
  finance/service.ts  →  import from 'pages/system/dept/service'

✓ 允许：通过 shared 层引用共享实体
  finance/ExpenseForm →  import from '@/shared/dept'

✓ 允许：引用 src/components/ 通用组件
  finance/BillList    →  import from '@/components/AuthButton'

✓ 允许：引用 utils / hooks / constants
  finance/utils       →  import from '@/utils/format'
```

---

## 6. 组件体系

### 分层结构

```
Ant Design 6 / ProComponents 3（第三方基础）
          ↓
src/components/（项目通用，PascalCase，无业务逻辑）
          ↓
src/shared/*/（共享实体组件，含轻量业务语义）     📋 待建设
          ↓
src/pages/*/components/（模块私有，禁止对外引用）
```

### 已有组件（src/components/）

| 组件 | 路径 | 说明 |
|------|------|------|
| **MultiTab** | `components/MultiTab/` | 多页签 + KeepAlive 系统，含 TabBar / KeepAliveWrapper / RouteListener |
| Footer | `components/Footer/` | 页脚布局 |
| HeaderDropdown | `components/HeaderDropdown/` | 顶栏下拉封装 |
| RightContent | `components/RightContent/` | 顶栏右侧区域（头像下拉、语言切换） |

### 规划组件说明（📋 待建设）

#### AuthButton — 权限按钮

```typescript
// src/components/AuthButton/index.tsx
import { useAccess } from '@umijs/max';   // 对接 src/access.ts
import type { ButtonProps } from 'antd';

interface AuthButtonProps extends ButtonProps {
  permission: string;  // 对应 access.ts 中定义的权限标识
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  permission, children, ...rest
}) => {
  const access = useAccess();
  if (!access.canAccess?.(permission)) return null;
  return <Button {...rest}>{children}</Button>;
};

// 使用
<AuthButton permission="system:user:add" type="primary" onClick={handleAdd}>
  新增用户
</AuthButton>
```

#### SearchForm — 统一查询表单

```typescript
interface SearchFormProps {
  items: SearchItem[];
  onSearch: (values: Record<string, unknown>) => void;
  onReset?: () => void;
  defaultCollapsed?: boolean;
  colSpan?: number;    // 默认 6（4 列布局）
}

// 使用
<SearchForm
  items={[
    { label: '用户名',  name: 'username',  type: 'input' },
    { label: '部门',    name: 'deptId',    type: 'custom', component: <DeptSelect /> },
    { label: '状态',    name: 'status',    type: 'dict', dictKey: 'sys_user_status' },
    { label: '创建时间', name: 'dateRange', type: 'dateRange' },
  ]}
  onSearch={handleSearch}
/>
```

#### DictTag — 字典标签

```typescript
export const DictTag: React.FC<{ dictKey: string; value: string | number }> = ({
  dictKey, value,
}) => {
  const { getLabel, getColor } = useDict(dictKey);
  return <Tag color={getColor(value)}>{getLabel(value)}</Tag>;
};

// 在表格列中使用
{
  title: '状态',
  dataIndex: 'status',
  render: (v) => <DictTag dictKey="sys_user_status" value={v} />,
}
```

#### ModalForm — 弹窗表单

```typescript
// ProComponents ModalForm 已经完善，项目层做轻量封装：
// 统一宽度默认值、接管 onFinish 后关闭逻辑

<ModalForm<UserFormValues>
  title="新增用户"
  trigger={
    <AuthButton permission="system:user:add" type="primary">新增</AuthButton>
  }
  onFinish={async (values) => {
    await createUser(values);
    actionRef.current?.reload();
    return true;   // return true → ProComponents 自动关闭弹窗
  }}
>
  <ProFormText name="username" label="用户名" rules={[{ required: true }]} />
  <ProFormItem name="deptId" label="部门">
    <DeptSelect />
  </ProFormItem>
</ModalForm>
```

#### TableAction — 表格操作列

```typescript
// 超过 maxShow 个按钮时，多余的收入「更多」下拉
<TableAction
  maxShow={2}
  actions={[
    { label: '编辑',    permission: 'system:user:edit',   onClick: () => handleEdit(row) },
    { label: '重置密码', permission: 'system:user:reset',  onClick: () => handleReset(row) },
    { label: '删除',    permission: 'system:user:delete', danger: true, onClick: () => handleDelete(row) },
  ]}
/>
```

#### ExportBtn / ImportModal

```typescript
// 导出：封装 loading / 权限 / 文件名
<ExportBtn
  permission="finance:bill:export"
  params={queryParams}
  exportFn={exportBillList}
  filename="账单列表"
/>

// 导入：模板下载 + 上传 + 结果反馈
<ImportModal
  templateUrl="/template/user_import.xlsx"
  uploadFn={importUserList}
  onSuccess={() => actionRef.current?.reload()}
/>
```

---

## 7. 自定义 Hook

> **📋 待实现** — 以下 Hook 为目标设计，随业务模块建设逐步落地。

### useTable — 表格数据管理

> 适用于不使用 ProTable `request` 属性、需要手动控制数据流的场景。

```typescript
// src/hooks/useTable.ts
interface UseTableOptions<T> {
  fetchFn: (params: TableParams) => Promise<PageResult<T>>;
  defaultParams?: Record<string, unknown>;
  defaultPageSize?: number;
}

export function useTable<T>({
  fetchFn,
  defaultParams = {},
  defaultPageSize = 20,
}: UseTableOptions<T>) {
  const [data, setData]       = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1, pageSize: defaultPageSize, total: 0,
  });
  const searchParams = useRef(defaultParams);

  const fetch = useCallback(async (params?: Record<string, unknown>) => {
    if (params) searchParams.current = { ...defaultParams, ...params };
    setLoading(true);
    try {
      const res = await fetchFn({ ...searchParams.current, ...pagination });
      setData(res.list);
      setPagination(p => ({ ...p, total: res.total }));
    } finally {
      setLoading(false);
    }
  }, [fetchFn, defaultParams, pagination]);

  useEffect(() => { fetch(); }, []);

  return {
    data, loading, pagination,
    refresh: fetch,
    search: (params: Record<string, unknown>) => {
      setPagination(p => ({ ...p, current: 1 }));
      fetch(params);
    },
  };
}
```

### usePermission — 按钮权限

```typescript
// src/hooks/usePermission.ts
import { useAccess } from '@umijs/max';

export function usePermission() {
  const access = useAccess();

  const hasPermission = useCallback(
    (permission: string) => access.canAccess?.(permission) ?? false,
    [access]
  );

  const hasAnyPermission = useCallback(
    (perms: string[]) => perms.some(p => access.canAccess?.(p)),
    [access]
  );

  return { hasPermission, hasAnyPermission };
}
```

### useDict — 字典数据（来自 shared/dict）

```typescript
// src/shared/dict/useDict.ts
import { useQuery } from '@tanstack/react-query';

export function useDict(dictKey: string) {
  const { data = [] } = useQuery({
    queryKey: ['shared', 'dict', dictKey],
    queryFn: () => getDictByKey(dictKey),
    staleTime: Infinity,   // 字典几乎不变，永久缓存
    gcTime: Infinity,
  });

  const getLabel = useCallback(
    (value: string | number) =>
      data.find(d => d.value == value)?.label ?? String(value),
    [data]
  );

  const getColor = useCallback(
    (value: string | number) =>
      data.find(d => d.value == value)?.color ?? 'default',
    [data]
  );

  return { options: data, getLabel, getColor };
}
```

### useDownload — 文件下载

```typescript
// src/hooks/useDownload.ts
export function useDownload() {
  const [loading, setLoading] = useState(false);

  const download = useCallback(async (
    fetchFn: () => Promise<Blob>,
    filename: string,
  ) => {
    setLoading(true);
    try {
      const blob = await fetchFn();
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), {
        href: url, download: filename,
      });
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }, []);

  return { download, loading };
}
```

---

## 8. 数据层设计

### HTTP 请求（Umi request）

所有对外 API 调用必须经过 `src/services/`，HTTP 层由 `src/app.tsx` 引入 `src/requestErrorConfig.ts` 进行配置：

```typescript
// src/app.tsx
import { errorConfig } from './requestErrorConfig';

export const request: RequestConfig = {
  baseURL: '',  // 通常留空，由代理或后端网关处理
  ...errorConfig,
};
```

### 错误处理逻辑（src/requestErrorConfig.ts）

项目遵循 Umi Max 的错误处理规范，分为「请求拦截」、「响应拦截」和「错误抛出」三个阶段：

1. **errorThrower**: 解析后端返回的 `success` 字段。若为 `false`，则抛出 `BizError` 并携带 `showType`。
2. **errorHandler**: 捕获错误并根据 `showType` (SILENT, WARN_MESSAGE, ERROR_MESSAGE, NOTIFICATION) 触发 UI 反馈。
3. **requestInterceptors**: 统一注入请求头（如 Token）。

> ⚠️ 当前拦截器为脚手架 demo 占位（简单拼接 `?token=123`），接入真实后端后需替换为 `Authorization: Bearer <token>` 标准方案。

### 选型建议

| 场景 | 推荐方案 | 原因 |
|---|---|---|
| **普通业务请求** | `useRequest` (来自 Umi) | 配置简单，与 ProTable 契约对齐 |
| **高频共享数据** | `TanStack Query` | 自动去重、缓存持久化、后台静默刷新 |
| **静态/配置数据** | `useModel` (@@initialState) | 运行时全局单例，适合权限、用户信息 |

service 层直接使用 `@umijs/max` 导出的 `request`：

```typescript
// src/services/modules/user.ts
import { request } from '@umijs/max';

export const getUserList = (params: API.UserQuery) =>
  request<PageResult<API.User>>('/system/user/list', { method: 'GET', params });

export const createUser = (data: API.UserForm) =>
  request<void>('/system/user', { method: 'POST', data });
```

### 全局状态管理（Umi useModel）

```typescript
// src/app.tsx — currentUser 挂在 getInitialState
export async function getInitialState() {
  const currentUser = await fetchCurrentUser().catch(() => undefined);
  return { currentUser };
}

// 任意页面读取
import { useModel } from '@umijs/max';
const { initialState } = useModel('@@initialState');
const { currentUser } = initialState ?? {};

// 自定义全局状态（src/models/global.ts）
export default () => {
  const [collapsed, setCollapsed] = useState(false);
  return { collapsed, setCollapsed };
};

// 使用自定义 model
const { collapsed } = useModel('global');
```

### TanStack Query v5 使用模式

```typescript
// ProTable 直接用 request 属性（推荐，最简洁）
<ProTable<API.User>
  actionRef={actionRef}
  request={async (params) => {
    const { list, total } = await getUserList(params);
    return { data: list, total, success: true };
  }}
  columns={columns}
/>

// 需要手动控制缓存时，用 useQuery
const { data, isLoading } = useQuery({
  queryKey: ['user', 'detail', userId],
  queryFn:  () => getUserDetail(userId),
  enabled:  !!userId,
  staleTime: 60_000,
});

// 提交后使缓存失效，自动刷新
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
    message.success('创建成功');
  },
});
```

---

### 补充：MultiTab 多页签系统 ✅

> 已完整实现，是项目的核心交互特性。

#### 架构组成

| 文件 | 职责 |
|------|------|
| `src/models/multiTab.ts` | Umi Model，管理页签状态（tabs / activeKey / 各操作方法） |
| `src/components/MultiTab/TabBar.tsx` | 页签栏 UI（拖拽排序、右键菜单、固定/关闭） |
| `src/components/MultiTab/KeepAliveWrapper.tsx` | KeepAlive 缓存容器，保持页面组件状态 |
| `src/components/MultiTab/RouteListener.tsx` | 路由变更监听，自动同步页签 |
| `config/defaultSettings.ts` | `tabsLayout: true` / `homeTabPath: '/'` 配置开关 |

#### 核心 API（multiTab Model）

```typescript
interface MultiTabModel {
  tabs: TabItem[];              // 当前页签列表
  activeKey: string;            // 当前激活路径
  openTab: (tab) => void;       // 打开/切换页签
  switchTab: (path) => void;    // 切换到指定页签
  closeTab: (path) => void;     // 关闭页签
  moveTab: (from, to) => void;  // 拖拽排序
  toggleFixedTab: (path) => void; // 固定/取消固定
  reloadTab: (path) => void;    // 刷新页签
  closeOtherTabs: (path) => void;
  closeRightTabs: (path) => void;
  closeAllTabs: () => void;
  syncRoute: (pathname) => void; // 路由同步
}
```

#### 关键设计决策

- **组件文件去重**：通过路由的 `file` 字段判断物理组件，避免 redirect 路径产生重复页签
- **固定页签**：支持固定/取消固定，固定页签始终排在最前
- **页签上限**：`MAX_TABS = 15`，超出不再新增
- **与 app.tsx 集成**：通过 `childrenRender` 注入 `TabWithKeepAlive` 组件包装
- **菜单联动**：`menuItemRender` 拦截菜单点击，通过 `useModel('multiTab')` 调用 `openTab`

### 补充：构建与部署决策 ✅

| 决策 | 配置 | 原因 |
|------|------|------|
| Hash 路由 | `config.ts → history: { type: 'hash' }` | GitHub Pages 等静态部署不支持 History API fallback |
| 固定 publicPath | `config.ts → publicPath: '/web-template/'` | 部署在子路径下，静态资源需要绝对路径前缀 |
| 路由预加载 | `config.ts → routePrefetch: {}` | 提升页面切换速度 |
| OpenAPI 集成 | `@umijs/max-plugin-openapi` + `oneapi.json` | 根据 Swagger schema 自动生成 service 代码 |
| Tailwind CSS 4 | `postcss.config.js → @tailwindcss/postcss` | 通过 PostCSS 插件集成，入口 `src/tailwind.css`，在 `global.tsx` 中 import |
| antd 主题 | `config.ts → antd.configProvider.variant: 'filled'` | 全局使用 filled 风格变体 |
| 自定义字体 | `antd.configProvider.theme.token.fontFamily: 'AlibabaSans'` | 统一字体 |

---

## 9. 权限系统

> **🔄 基础版已实现** — 当前仅有 `canAdmin` 布尔权限，以下为目标扩展方案（支持函数式动态权限）。

### 当前实现（src/access.ts）

```typescript
// ✅ 已落地：基于 currentUser.access 的简单布尔权限
export default function access(
  initialState: { currentUser?: API.CurrentUser } | undefined,
) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
  };
}
```

### 目标模型（待扩展）

### src/access.ts — 路由级权限

```typescript
export default function access(initialState: {
  currentUser?: API.CurrentUser;
}) {
  const { currentUser } = initialState ?? {};
  const permissions = currentUser?.permissions ?? [];
  const roles       = currentUser?.roles ?? [];

  return {
    canRead:   !!currentUser,
    isAdmin:   roles.includes('admin'),
    // 函数形式支持动态权限标识，供 AuthButton / usePermission 使用
    canAccess: (perm: string) => permissions.includes(perm),
  };
}
```

### 路由配置权限字段

```typescript
// config/routes.ts
{ path: '/system/user', name: 'user', access: 'isAdmin', component: './system/user' }
// access 字段对应 access.ts 返回对象的 key（布尔值形式）
```

### 按钮级权限

```typescript
// 方式一：AuthButton 组件（推荐）
<AuthButton permission="system:user:add" type="primary">新增</AuthButton>

// 方式二：usePermission Hook（条件渲染复杂逻辑时）
const { hasPermission } = usePermission();
const canExport = hasPermission('finance:bill:export');
```

### 数据权限

数据权限（如"只能看本部门数据"）由**后端在 SQL 层拦截**，前端仅需在请求中携带 Token（拦截器自动注入），不做前端数据过滤，避免安全漏洞。

---

## 10. 路由配置

> **🔄 基础版** — 当前为脚手架示例路由（welcome / admin / list），以下为业务模块建设后的目标路由结构。
>
> 重要架构决策：项目使用 **hash 路由**（`config.ts` 中 `history: { type: 'hash' }`），服务于 GitHub Pages 静态部署场景。

```typescript
// config/routes.ts（目标结构）
export default [
  {
    path: '/user',
    layout: false,          // 不使用 ProLayout
    routes: [
      { path: '/user/login',    component: './user/Login' },
      { path: '/user/register', component: './user/Register' },
    ],
  },

  { path: '/', redirect: '/dashboard' },

  {
    path: '/dashboard',
    name: 'dashboard',      // 对应 locales/zh-CN/menu.ts 的 menu.dashboard
    icon: 'DashboardOutlined',
    component: './dashboard',
    access: 'canRead',
  },

  {
    path: '/system',
    name: 'system',
    icon: 'SettingOutlined',
    access: 'isAdmin',
    routes: [
      { path: '/system/user', name: 'user', component: './system/user' },
      { path: '/system/role', name: 'role', component: './system/role' },
      { path: '/system/menu', name: 'menu', component: './system/menu' },
      { path: '/system/dept', name: 'dept', component: './system/dept' },
    ],
  },

  {
    path: '/finance',
    name: 'finance',
    icon: 'AccountBookOutlined',
    routes: [
      { path: '/finance/bill',    name: 'bill',    component: './finance/bill' },
      { path: '/finance/receipt', name: 'receipt', component: './finance/receipt' },
    ],
  },

  { path: '*', layout: false, component: './exception/404' },
];
```

路由字段说明（与 `ARCHITECTURE.md` 保持一致）：

| 字段 | 说明 |
|------|------|
| `path` | URL 路径 |
| `component` | 相对于 `src/pages/` 的路径 |
| `name` | 菜单文本的 i18n key（`menu.<name>`） |
| `access` | 权限标识，对应 `access.ts` 返回值的 key |
| `layout: false` | 不使用 ProLayout（登录页用） |
| `hideInMenu: true` | 不在菜单显示 |

---

## 11. 工具函数

> **📋 待实现** — 以下为目标工具函数设计，随业务需要逐步创建。

### format.ts

```typescript
// src/utils/format.ts
import dayjs from 'dayjs';

/** 金额格式化：分 → 元，千分位 */
export const formatMoney = (fen: number, decimals = 2) =>
  (fen / 100).toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/** 文件大小 */
export const formatFileSize = (bytes: number) => {
  if (bytes < 1024)      return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
};

/** 日期格式化 */
export const formatDate = (
  date: string | number | Date,
  fmt = 'YYYY-MM-DD HH:mm:ss',
) => dayjs(date).format(fmt);

/** 手机号脱敏 */
export const maskPhone = (phone: string) =>
  phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
```

### auth.ts

```typescript
// src/utils/auth.ts
const TOKEN_KEY   = 'Authorization';
const REFRESH_KEY = 'RefreshToken';

export const getToken   = () => localStorage.getItem(TOKEN_KEY);
export const setToken   = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
};
export const isLoggedIn = () => !!getToken();
```

### validator.ts

```typescript
// src/utils/validator.ts
export const phoneValidator = (_: unknown, value: string) =>
  /^1[3-9]\d{9}$/.test(value)
    ? Promise.resolve()
    : Promise.reject(new Error('请输入正确的手机号'));

export const emailValidator = (_: unknown, value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? Promise.resolve()
    : Promise.reject(new Error('请输入正确的邮箱'));

export const idCardValidator = (_: unknown, value: string) =>
  /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
    ? Promise.resolve()
    : Promise.reject(new Error('请输入正确的身份证号'));
```

---

## 12. 代码规范与边界约束

### Biome 配置

> **🔄 部分实现** — 基础配置已就绪，架构边界约束规则（`noRestrictedImports`）待补充。

项目使用 Biome 2.x，单一工具同时承担 Lint 和 Format，取代 ESLint + Prettier 组合。

#### 当前配置（biome.json ✅）

```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "css": { "parser": { "tailwindDirectives": true } },
  "files": {
    "ignoreUnknown": true,
    "includes": [
      "**/*",
      "!**/.umi", "!**/.umi-production", "!**/.umi-test", "!**/.umi-test-production",
      "!**/src/services", "!**/mock", "!**/dist", "!**/server",
      "!**/public", "!**/coverage", "!**/node_modules"
    ]
  },
  "formatter": { "enabled": true, "indentStyle": "space" },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": { "noExplicitAny": "off", "noUnknownAtRules": "off" },
      "correctness": { "useUniqueElementIds": "off", "useExhaustiveDependencies": "off" },
      "a11y": { "noStaticElementInteractions": "off", "useValidAnchor": "off", "useKeyWithClickEvents": "off" }
    }
  },
  "javascript": { "jsxRuntime": "reactClassic", "formatter": { "quoteStyle": "single" } }
}
```

#### 待补充：架构边界约束（📋）

当业务模块建设后，需在 `biome.json` 追加以下规则，通过 Lint 强制执行分层边界：

```jsonc
// 📋 目标增量
{
  "linter": {
    "rules": {
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error"
      },
      "nursery": {
        "noRestrictedImports": {
          "level": "error",
          "options": {
            "paths": {
              "*/pages/system/dept/service": "禁止跨模块引用 dept service，请使用 @/shared/dept",
              "*/pages/finance/*":           "禁止跨业务模块引用，共享逻辑请提升到 @/shared 或 @/components",
              "*/pages/hr/*":                "禁止跨业务模块引用",
              "axios":                       "请使用 @umijs/max 导出的 request"
            }
          }
        }
      }
    }
  }
}
```

### 常用命令

```bash
pnpm biome:lint     # 仅 Lint 检查（npx @biomejs/biome lint）
pnpm biome          # Lint + Format + Fix（biome check --write）
pnpm tsc            # 类型检查，不输出产物
pnpm lint           # biome:lint + tsc，CI 入口
```

### lint-staged 配置

```jsonc
// ✅ 已落地：.lintstagedrc
{
  "**/*.{js,jsx,tsx,ts,md,css,less,json}": [
    "npx @biomejs/biome check --write --no-errors-on-unmatched"
  ]
}
```

Husky 通过 `prepare` 脚本自动安装 Git hooks，提交时 lint-staged 自动触发 Biome。

### commitlint（已安装，conventional 规范）

```
feat:     新功能
fix:      Bug 修复
refactor: 重构（不改变功能）
perf:     性能优化
style:    代码格式（不影响逻辑）
test:     测试
docs:     文档
chore:    构建 / 依赖 / 工具链
```

### 文件命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 页面目录 | kebab-case | `system-config/` |
| 组件文件 | PascalCase | `DeptSelect.tsx` |
| Hook 文件 | camelCase（use 前缀） | `useDept.ts` |
| 工具 / 服务 | camelCase | `format.ts` |
| 类型文件 | 小写 | `typing.d.ts` |
| 常量文件 | 小写 | `dict.ts` |
| 样式文件 | 与组件同名 | `DeptSelect.module.less` |

### 架构边界强制（📋 待配置）

通过 `biome.json` 的 `noRestrictedImports` 配置，确保分层架构不被破坏（上方「待补充」部分已包含完整配置）。

### tsconfig 路径别名

#### 当前配置（✅ 已落地）

```json
{
  "compilerOptions": {
    "paths": {
      "@/*":      ["./src/*"],
      "@@/*":     ["./src/.umi/*"],
      "@@test/*": ["./src/.umi-test/*"],
      "@root/*":  ["./*"]
    }
  }
}
```

#### 待扩展（📋 随 shared / hooks / utils 目录创建后添加）

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*":     ["./src/shared/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*":      ["./src/hooks/*"],
      "@utils/*":      ["./src/utils/*"],
      "@constants/*":  ["./src/constants/*"]
    }
  }
}

### 禁区约定（来自 ARCHITECTURE.md）

- `src/.umi/` 由框架自动生成，**禁止手动修改**
- `docs/generated/` 由脚本生成，**禁止手动修改**
- 组件内**禁止直接调用 API**，必须经过 `src/services/`

---

## 13. 设计原则总结

| 原则 | 具体实践 |
|------|---------|
| **功能内聚** | 页面、service、类型定义放在同一模块目录，降低跨模块耦合 |
| **共享实体分离** | 被多模块引用的实体提升到 `src/shared/`，只暴露读接口，写操作归属管理页 |
| **权限前置** | 路由级 `access.ts` + 按钮级 `AuthButton`（基于 `useAccess`），无权限自动隐藏 |
| **状态分层** | TanStack Query v5 管服务端状态；Umi `useModel` / `getInitialState` 管全局客户端状态；`useState` 管页面局部 |
| **边界强制** | Biome `noRestrictedImports` 规则，违规即报错，不依赖人工约定 |
| **网络统一** | 所有 API 调用必须经过 `src/services/`，HTTP 层由 `src/app.tsx` RequestConfig 统一配置 |
| **CRUD 标准化** | ProTable + SearchForm + ModalForm + useTable 四件套，覆盖约 80% 列表页场景 |
| **按需加载** | Umi 路由级代码分割，动态 import，首屏只加载必要资源 |
| **禁区保护** | `src/.umi/` 和 `docs/generated/` 禁止手动修改，Biome ignore 配置同步排除 |

---

*文档版本：v2.0 · 更新日期：2026-04-24 · 对应 package.json v6.0.0-beta.4*
*本版本增加：各章节状态标注、现状 vs 目标区分、MultiTab 系统文档、构建部署决策记录*
