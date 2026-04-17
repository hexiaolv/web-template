# 工程核心信念

> 这些是不轻易改变的工程决策。修改前需要充分讨论。

## 1. 使用 pnpm 作为唯一包管理器

**原因**：pnpm 的 symlink 机制避免幻影依赖，`pnpm-lock.yaml` 确保环境一致性。npm/yarn 在 monorepo 场景下问题更多。

**约束**：禁止提交 `package-lock.json` 或 `yarn.lock`。CI 使用 `pnpm install --frozen-lockfile`。

---

## 2. Biome 替代 ESLint + Prettier

**原因**：Biome 是单一工具，配置更简单，速度快 10-100x，减少工具链复杂度。

**约束**：`biome.json` 是唯一规范来源，不引入 `.eslintrc`、`.prettierrc`。

---

## 3. 禁止在组件中直接调用 fetch/axios

**原因**：API 调用集中在 `src/services/` 便于 Mock、测试和统一添加拦截器（错误处理、token 注入）。组件直接调用导致逻辑分散，难以维护。

**约束**：组件只调用 `src/services/` 中的函数，不导入 axios 或直接使用 fetch。

---

## 4. 前端路由级权限，后端接口级校验

**原因**：前端权限控制是 UX 优化（避免用户看到无权限的功能），不是安全边界。真正的安全由后端 API 保证。前端权限靠 `src/access.ts` + 路由 `access` 字段实现。

**约束**：不依赖前端权限做安全决策，后端接口必须独立校验权限。

---

## 5. Ant Design ProComponents 优先，不重新实现

**原因**：ProTable、ProForm 解决了 90% 的中后台场景（分页、搜索、表单联动），重新实现会引入大量维护成本。

**约束**：有 ProComponents 能覆盖的场景，不自行实现等价组件。
