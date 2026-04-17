# 设计规范

> UI 设计决策的权威来源。所有视觉相关改动对照此文档。

## 主题配置

```typescript
// config/defaultSettings.ts
{
  colorPrimary: '#1890ff',   // 拂晓蓝（主色）
  navTheme: 'light',
  layout: 'mix',
  contentWidth: 'Fluid',
}
```

## 色彩系统

| 角色 | 色值 | 使用场景 |
|------|------|--------|
| 主色 | `#1890ff` | 主按钮、链接、重点 |
| 成功 | `#52c41a` | 成功状态、正向反馈 |
| 警告 | `#faad14` | 警告提示 |
| 错误 | `#f5222d` | 错误、危险操作 |
| 文字主 | `rgba(0,0,0,0.88)` | 标题、重要内容 |
| 文字次 | `rgba(0,0,0,0.65)` | 正文 |
| 文字辅助 | `rgba(0,0,0,0.45)` | 说明、placeholder |
| 边框 | `#d9d9d9` | 分割线、输入框 |
| 背景 | `#f5f5f5` | 页面背景 |

禁止直接使用 hex 硬编码，使用 Ant Design Design Token 或 Tailwind 工具类。

## 间距系统（8px 基准）

| Token | px | Tailwind |
|-------|----|---------|
| xs | 8 | `p-2 / gap-2` |
| sm | 12 | `p-3 / gap-3` |
| md | 16 | `p-4 / gap-4` |
| lg | 24 | `p-6 / gap-6` |
| xl | 32 | `p-8 / gap-8` |
| xxl | 48 | `p-12 / gap-12` |

## 字号规范

| 场景 | 字号 | 字重 |
|------|------|------|
| 页面标题 | 30px | 600 |
| 模块标题 | 20px | 600 |
| 卡片标题 | 16px | 500 |
| 正文 | 14px | 400 |
| 辅助说明 | 12px | 400 |

## 响应式断点

| 断点 | 最小宽度 | 说明 |
|------|----------|------|
| xs | - | 手机竖屏 |
| sm | 576px | 手机横屏 |
| md | 768px | 平板 |
| lg | 992px | 桌面 |
| xl | 1200px | 宽屏 |

## 组件使用规范

- **表单**：使用 `ProForm`，不用 antd 原始 `Form`
- **表格**：使用 `ProTable`，不用 antd 原始 `Table`
- **布局**：使用 Tailwind `flex` / `grid`，不手写 CSS
- **图标**：使用 `@ant-design/icons`

## 状态UI规范

| 场景 | 组件 |
|------|------|
| 列表加载 | ProTable 内建 loading |
| 区域加载 | `<Spin spinning={loading}>` |
| 骨架屏 | `<Skeleton active>` |
| 空数据 | `<Empty description="暂无数据">` |
| 页面错误 | `<Result status="error">` |

## 开发检查清单

- [ ] 无硬编码颜色和 px 值
- [ ] 加载 / 错误 / 空 三种状态都已处理
- [ ] 表单验证提示友好（不只是"此项必填"）
- [ ] 移动端 / 小屏幕布局测试
- [ ] 国际化文本完整（zh-CN + en-US）
