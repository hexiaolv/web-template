# TESTING.md

> 测试用例开发规范。确保代码稳定性与可维护性的重要支撑。

## 测试架构

| 层次 | 工具 | 用途 |
|------|------|------|
| 单元测试 | Jest | 测试纯函数、工具类逻辑、Hooks |
| 组件测试 | React Testing Library | 测试 UI 渲染、DOM 交互、生命周期 |
| 端到端测试 | (计划中) | 测试全链路业务流程 |

## 文件命名与存放

- **存放位置**：测试文件应与其要测试的模块放在同一目录下。这保证了组件和它自己的测试保持高内聚。
- **命名规范**：`[组件/文件名].test.ts` 或 `[组件/文件名].test.tsx`。

示例结构：
```
src/components/Footer/
├── index.tsx
├── index.module.less
└── index.test.tsx      # 组件测试文件
```

## 测试编写规范 (The "AAA" Pattern)

每个测试用例应遵守 **AAA (Arrange, Act, Assert)** 的模式编写：

1. **Arrange（准备阶段）**：初始化组件状态，模拟（mock）所需的函数和 API 响应，渲染组件。
2. **Act（执行阶段）**：模拟用户的操作，例如点击按钮、输入文本等。
3. **Assert（断言阶段）**：验证期望的结果是否发生，例如页面是否展示了某个特定文本、某个函数是否被正确调用。

### 示例

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './index';

describe('MyComponent', () => {
  it('should call onClick when button is clicked', () => {
    // Arrange
    const onClickMock = jest.fn();
    render(<MyComponent onClick={onClickMock} />);
    
    // Act
    const button = screen.getByRole('button', { name: /提交/i });
    fireEvent.click(button);
    
    // Assert
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
```

## Mock 的规范

1. **API 请求**：永远不要在单元/组件测试中发起真实网络请求。使用 `jest.mock` 或类似机制来拦截模块。
2. **Umi Max 的依赖**：组件中若使用了 `@umijs/max` 的一些内置 `Hooks`，通常需要在测试文件顶部进行 Mock 覆盖，例如 `useIntl`、`useRequest` 等。

示例：
```tsx
jest.mock('@umijs/max', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));
```

## 各类测试的建议与要求

- **工具函数 (Utils)**: 应力求 100% 覆盖关键边界分支（负数、空字符串、极限对象等）。
- **通用展示组件**: 需要确保不同的 `Props` 输入渲染出对应的稳定结构（建议覆盖其特有状态切换）。
- **页面级/业务型组件**: 由于依赖较多（API、全局 State 等），只需测试**核心骨干逻辑**。过于琐碎的 UI 断言容易导致测试脆弱。

## 运行测试

```bash
# 运行全部测试
pnpm test

# 运行并生成覆盖率报告
pnpm test:coverage

# 开发时监听特定文件的变动进行自动测试
pnpm test -- --watch
```
