---
name: 登录页美化与无滚动条重构
date: 2026-06-03
status: 已完成
author: Antigravity
---

# 登录页美化与无滚动条重构实施记录 (最终版)

## 实施步骤

1. **整体设计方案落地**：
   - 修改 [index.tsx](file:///Users/heguanghai/Code/opensource/web-template/src/pages/user/login/index.tsx)，全局背景变更为浅湖青渐变 `linear-gradient(135deg, #f3faf9 0%, #e8f5f3 50%, #dcf2f0 100%)`。
2. **Logo 与标题大小调大并水平对齐**：
   - 将 Logo 与主标题从 `LoginForm` 默认属性中剥离，移入自定义居中 Flex 布局容器。Logo 高度放大调整为 `34px`，标题字号调整为 `26px` 且加粗，并进行垂直居中对齐，大大收缩了与卡片顶部的空白。
   - 自主渲染“请填写您的账号密码”副标题。
3. **消除表单顶部大片红框间隙**：
   - 对 `LoginForm` 的 `contentStyle` 设置 `marginTop: '-18px'`。
   - 将第一个输入框 `username` 的 `formItemProps.style.marginTop` 设置为 `0`。两者共同作用，完美抵消了 ProComponents 原生表单顶部大面积留白的问题，实现了表单项与副标题的合理贴合。
4. **输入表单整体加宽**：
   - 将 `card` 宽度扩展为 `1000px`，高度限制为 `630px`。
   - `loginPanel` 宽度调为 `480px`，并将 `padding` 调至 `32px 36px`。这使得表单实际展示宽度由 `364px` 拓宽至 `408px`，可以极好地完整呈现较长的科室选择项，避免折行。
   - 隐去 `loginPanel` 下的所有滚动条外观样式。
5. **耗材业务域默认选中**：
   - 修改 `initialValues.domain` 默认值为 `'consumable'`，并调整 Radio 选项顺序，将“🩺 耗材业务域”放在左边。
6. **消除编译/类型报错**：
   - 移除了验证码输入框上不属于其原生属性的 `onChange` 回调与未定义变量引用，在提交时通过 ProForm 收集的参数直接校验，彻底解决类型检查警告。

## 验证结果

- **类型检查**：运行 `pnpm tsc`，确认登录页组件本身无任何编译错误。
- **视觉验收**：使用 Playwright 捕获了高品质截图（大标题和 logo 水平对齐、红框处大片间距完全消除、左置默认耗材选择、零滚动条），页面排版比例极佳，文字承载力充裕。
