# RELIABILITY.md

> 稳定性规范。定义错误处理、加载状态、降级策略的标准做法。

## 错误处理层级

```
API 错误（网络/服务端） → requestErrorConfig.ts 全局处理
组件级错误               → ErrorBoundary 包裹
表单验证错误             → ProForm rules 本地处理
```

### 全局 API 错误

`src/requestErrorConfig.ts` 统一处理：

```typescript
export default {
  errorConfig: {
    errorHandler(error) {
      if (error.response?.status === 500) {
        message.error('服务器错误，请稍后重试');
      }
    },
  },
};
```

### 组件级错误边界

```tsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<div>加载失败，请刷新页面</div>}>
  <ComplexComponent />
</ErrorBoundary>
```

## 加载状态规范

每个数据加载场景必须处理三种状态：

| 状态 | 组件 |
|------|------|
| 加载中 | `<Spin>` / ProTable 内建 loading |
| 加载失败 | 错误提示 + 重试按钮 |
| 数据为空 | `<Empty>` 组件 |

```tsx
// ProTable 自动处理三种状态
<ProTable
  request={async (params) => {
    const res = await getUserList(params);
    return { data: res.data, success: res.success, total: res.total };
  }}
/>
```

## 关键操作确认

删除、批量提交等破坏性操作必须二次确认：

```tsx
<Popconfirm
  title="确认删除？此操作不可恢复。"
  onConfirm={() => handleDelete(record.id)}
>
  <a>删除</a>
</Popconfirm>
```

## 用户反馈规范

| 场景 | 组件 | 时机 |
|------|------|------|
| 操作成功 | `message.success` | 接口返回后 |
| 操作失败 | `message.error` | catch 块 |
| 耗时操作 | `notification` | > 3s 的操作 |
| 页面级错误 | `Result` 组件 | 页面无法继续 |
