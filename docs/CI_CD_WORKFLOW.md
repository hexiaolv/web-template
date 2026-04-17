# CI/CD & Deploy Workflow Guide

本模板内置了从 Ant Design Pro 全盘引入并改良的 CI/CD 最佳实践。通过这套机制，您可以保证发布出去的代码必然通过了质量校验，并且能够让您的每一次 PR 都能自动生成可视化的 UI 预览站以供审核。

## ⚙️ 核心工作流大纲

我们目前配置了三种核心拦截和部署事件，均在您的 `.github/workflows` 目录下配置：

1. **`ci.yml` (自动代码质量检查&测试运行)**
   - **触发时机**：向 `main` 分支提交 Push 或者任何成员提交 `Pull Request` 给 `main`。
   - **内容**：代码风格检查 (`biome:lint`)、类型检查 (`tsc`)、单元测试并执行覆盖率 (`jest`)，最后尝试构建项目 (`run build`)。如果任何一步失败，PR 的合并按钮将变红阻止代码并入。
2. **`deploy.yml` (GitHub Pages 自动化发布)**
   - **触发时机**：只要代码成功被合并（Push）到 `main` 分支。
   - **内容**：执行一次生产环境级别的打包，自动推送到当前仓库的 `gh-pages` 分支中。
3. **`preview-*.yml` (PR 机器人预览引擎)**
   - **触发时机**：当任何一个 Pull Request 被开启或被追加 Commit 更新时。
   - **内容**：GitHub Actions 将独立打包这部分变更，并将产物部署到独立预览环境（使用无服务器工具 Surge ）。部署完成后，一个小机器人会在相应的 PR 留言区中评论专属的域名链接！

---

## 🔑 第一步：配置 GitHub Pages (公开演示站)

当项目推送到远端后，您的项目会自动使用 `deploy.yml` 生成前端页面。要让别人能看到它，我们需要在 GitHub 开启它：

1. 浏览器打开本项目的 [GitHub Settings] 页面。
2. 左侧栏找到 **Pages** 选项卡。
3. 在 `Build and deployment` 的 `Source` 中选择 **Deploy from a branch**。
4. 在下方的 `Branch` 下拉菜单中，选择 **`gh-pages`** 分支，目录选 `/(root)`。
5. 点击 Save 后，您的代码合并后就能在线通过 `https://<用户名>.github.io/<仓库名>` 访问啦！

---

## 🔑 第二步：配置 Surge Token 开启专属发版

如果您希望“每个未合并的请求都能生成一份临时链接用来点击体验”，需要开启 Surge 授权通道：

1. 在你的终端窗口（电脑控制台）里，运行以下命令（如果没有安装可能需要前置安装 `npm install -g surge`）：
   ```bash
   surge whoami
   # 按照提示先注册/登陆任意账号，然后生成并记住你在 Surge 的身份凭证：
   surge token
   ```
2. 注意保留好你在屏幕上拿到的一串 Token（这是一把密钥）。
3. 进入你项目的 **GitHub Settings -> Secrets and variables -> Actions**。
4. 点击绿色的 `New repository secret` 按钮。
5. 名字 (Name) 填入大写的：**`SURGE_TOKEN`**
6. 值 (Secret) 中填入你刚才打印出的那串乱码，点击保存。

---

## 🧑‍💻 接下来，如何使用这套机制进行日常开发？

如果您配置好了上述设定，那么在进行任何功能开发时只需采取如下步骤：

1. 切出一个新分支：`git checkout -b feature/xxx`
2. 进行常规开发并提交代码（在本地通过 `pnpm test` 测试）。
3. `git push origin feature/xxx` 推送到云端。
4. 顺势在 GitHub 界面上提交一个给 `main` 分支的 **Pull Request** (`New PR`)。 
5. ☕️ **请喝杯咖啡。** 大约 1-2 分钟内，你会看到当前 PR 界面出现了一个 Bot：
   > "🎊 PR Preview has been successfully built and deployed to: https://xxx-xxx.surge.sh"
6. 点击该链接可以直接肉眼查看你的 UI 修改是否破坏了界面，或者演示给产品经理看。确认无误后点击 Merge 合并。
7. 合并后 `deploy.yml` 将立刻打包你最新主线的代码，并在一两分钟内更新展示到你的 GitHub Pages 免费企业官网上！

> **注意：** 这套 Surge 基于美国线路，如果您加载过慢不满意，也可以在以后将 `.github/workflows/preview-deploy.yml` 的执行逻辑无痛替换为 `Vercel CLI` 或者您所在公司的内网预览引擎。
