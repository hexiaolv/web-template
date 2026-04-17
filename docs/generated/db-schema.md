# 数据库 / 数据模型文档

> 此文件由脚本自动生成，禁止手动修改。
> 运行 `pnpm generate:schema` 更新。

## 当前状态

此脚手架尚未连接真实数据库。

接入数据库后，此文件将自动包含：
- 数据表结构
- 字段类型和约束
- 表关系图

## API 类型定义（当前）

```typescript
// types/index.d.ts
declare namespace API {
  interface CurrentUser {
    name?: string;
    avatar?: string;
    access?: 'admin' | 'user';
    email?: string;
  }

  interface LoginParams {
    username: string;
    password: string;
    type?: string;
  }

  interface LoginResult {
    status?: string;
    type?: string;
    currentAuthority?: string;
  }

  interface Response<T> {
    data: T;
    success: boolean;
    errorMessage?: string;
    total?: number;
  }
}
```
