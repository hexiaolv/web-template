# 执行计划：脚手架初始化

**状态**：进行中  
**创建**：2026-04-17  
**目标**：基础工程设施就绪，可作为业务项目起点

## 任务清单

- [x] 技术栈选型（React 19 + Umi Max 4 + Ant Design 6）
- [x] Biome 代码规范配置
- [x] 文档体系建立（AGENTS.md, ARCHITECTURE.md 等）
- [ ] 权限系统完善（RBAC + 双 token）
- [ ] 替换 Mock 为真实后端对接
- [ ] E2E 测试基线

## 关键决策

- 选用 Biome 替代 ESLint + Prettier（见 [core-beliefs.md](../design-docs/core-beliefs.md)）
- 文档体系参考 OpenAI Harness Engineering 规范

## 完成标准

- 新开发者克隆后 `pnpm install && pnpm start` 可正常启动
- 所有核心文档完整，AI 可无歧义理解项目结构
