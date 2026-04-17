# SECURITY.md

> 安全规范。所有涉及鉴权、数据访问的改动，必须先读此文档。

## 鉴权机制

### 当前方案

使用 Umi InitialState + `src/access.ts` 做前端路由级权限控制。

```typescript
// src/app.tsx - 登录守卫
export const layout: RunTimeLayoutConfig = ({ initialState }) => ({
  onPageChange: () => {
    const { location } = history;
    if (!initialState?.currentUser && location.pathname !== '/user/login') {
      history.push('/user/login');
    }
  },
});
```

### 权限粒度

| 权限 | 说明 |
|------|------|
| `canAdmin` | 管理员，`access === 'admin'` |
| `canUser` | 已登录用户 |

新增权限：编辑 `src/access.ts`，从 `initialState.currentUser` 派生。

## API 安全

- Token 存储：**不使用 localStorage**，使用 httpOnly cookie（由后端设置）
- 请求头：在 `src/app.tsx` 的 `request` 配置中统一注入
- 敏感数据：不在前端日志中输出，不在 URL 参数中传递

```typescript
// 请求拦截器示例
export const request: RequestConfig = {
  requestInterceptors: [
    (config) => {
      // 注入 token（示例）
      config.headers['Authorization'] = `Bearer ${getToken()}`;
      return config;
    },
  ],
  responseInterceptors: [
    (response) => {
      if (response.status === 401) {
        history.push('/user/login');
      }
      return response;
    },
  ],
};
```

## 前端安全规则

- **禁止** `dangerouslySetInnerHTML`，如需富文本使用白名单 sanitize
- **禁止** 在代码中硬编码 API Key、密码、密钥
- **所有** 用户输入在服务端做校验，前端校验仅为 UX 优化
- **敏感操作**（删除、批量操作）必须有二次确认弹窗

## Mock 安全

- Mock 数据**不使用真实用户数据**
- `mock/` 目录数据为虚构示例
- 生产构建时 Mock 自动关闭（`NODE_ENV=production`）
