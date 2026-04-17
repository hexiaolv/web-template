# FRONTEND.md

> 前端开发规范。"怎么写代码"的权威来源。

## 组件规范

```tsx
// 标准组件结构
interface UserCardProps {
  user: UserInfo;
  onClick?: (user: UserInfo) => void;
  className?: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick, className }) => {
  const [loading, setLoading] = useState(false);

  // 条件渲染提前 return
  if (!user) return null;

  return (
    <Card className={className} onClick={() => onClick?.(user)}>
      {user.name}
    </Card>
  );
};

export default UserCard;
```

**规则**：
- 函数式组件 + TypeScript，Props 必须定义 `interface`，命名为 `XxxProps`
- Hooks 必须放在组件顶部
- 禁止 `any`，确实需要时加注释 `// TODO: 补充类型`
- 类型导入用 `import type { Foo } from './types'`

## 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 全局组件 | PascalCase | `UserCard.tsx` |
| 页面目录 | kebab-case | `user-list/index.tsx` |
| 工具函数 | camelCase | `formatDate.ts` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| 接口/类型 | PascalCase | `UserInfo`, `UserRole` |

## 导入顺序

```typescript
// 1. React 及第三方库
import React, { useState, useCallback } from 'react';
import { Button } from 'antd';
import { useRequest } from '@umijs/max';

// 2. 项目内部（@/ 别名）
import { getUserList } from '@/services/user';
import UserCard from '@/components/UserCard';

// 3. 相对路径
import { formatUser } from './utils';
import styles from './index.module.less';

// 4. 类型（最后，用 import type）
import type { UserItem } from '@/types';
```

## API 调用

**必须使用 Umi request，禁止 fetch/axios**：

```typescript
// src/services/user.ts
import { request } from '@umijs/max';
import type { UserItem } from '@/types';

export function getUserList(params: API.PageParams) {
  return request<API.Response<UserItem[]>>('/api/users', {
    method: 'GET',
    params,
  });
}
```

在组件中使用 `useRequest` 或 `@tanstack/react-query`：

```tsx
// 简单场景：useRequest
const { data, loading } = useRequest(getUserList, { defaultParams: [{ page: 1 }] });

// 复杂场景：react-query
const { data, isLoading } = useQuery({
  queryKey: ['users', params],
  queryFn: () => getUserList(params),
});
```

## 状态管理选择

| 场景 | 方案 |
|------|------|
| 服务端数据（列表、详情） | @tanstack/react-query |
| 用户信息、全局设置 | Umi InitialState |
| 跨页面共享状态 | Umi Model |
| 组件内部状态 | useState / useReducer |

## 样式规范

优先级顺序：**Ant Design 组件属性 > Tailwind 工具类 > CSS Modules**

```tsx
// ✅ 优先：Ant Design 属性
<Space size="large" direction="vertical">

// ✅ 布局/间距：Tailwind
<div className="flex items-center gap-4 p-6">

// ✅ 组件私有复杂样式：CSS Modules
import styles from './index.module.less';
<div className={styles.container}>

// ❌ 禁止：硬编码颜色和尺寸
<div style={{ color: '#1890ff', marginTop: '24px' }}>
```

## 性能规范

```tsx
// 纯展示组件用 React.memo
const UserCard = React.memo<UserCardProps>(({ user }) => (
  <div>{user.name}</div>
));

// 复杂计算用 useMemo
const sortedList = useMemo(
  () => [...list].sort((a, b) => a.name.localeCompare(b.name)),
  [list],
);

// 事件回调有外部依赖时用 useCallback
const handleSelect = useCallback(
  (id: number) => navigate(`/detail/${id}`),
  [navigate],
);
```

## 列表页模板（ProTable）

```tsx
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';

const columns: ProColumns<UserItem>[] = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '姓名', dataIndex: 'name' },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: {
      active: { text: '启用', status: 'Success' },
      inactive: { text: '禁用', status: 'Error' },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    render: (_, record) => [
      <a key="edit" onClick={() => handleEdit(record)}>编辑</a>,
    ],
  },
];

const UserList: React.FC = () => (
  <ProTable<UserItem>
    columns={columns}
    request={async (params) => getUserList(params)}
    rowKey="id"
    pagination={{ defaultPageSize: 10 }}
  />
);
```

## 提交前检查

```bash
pnpm biome        # 格式化
pnpm biome:lint   # 规范检查
pnpm tsc          # 类型检查
pnpm test         # 测试
```
