# Fresnica UI 阶段一交付状态报告（待视觉验收版）

> 记录日期：2026-10-09。**工程基础可供试集成，但本报告不是视觉无障碍通过声明，也不是钱包 App 生产发布批准。**

## 项目边界

- Web 规范源：[Pixman022/fresnica-ui](https://github.com/Pixman022/fresnica-ui)，
  当前 `main@9ad32c41be7eaf96662d2e8bacb1c9f957ba087b`。
- Native 消费包：[Pixman022/fresnica-ui-native](https://github.com/Pixman022/fresnica-ui-native)，
  此次审查 `main@65f917c069e1e39551d44924b7107eca41540760`。
- 对外交付是 `src/` UI 组件、共享 Token 契约、`example/` 中性 Preview、测试和集成文档。
  `product/` 是保留的历史钱包原型，不属于 UI 库的交付或测试门槛。

## 已完成的工程能力和证据

- **范围与许可（DS-01/02/03）：** README、交付计划及原产品 Issue 已区分设计系统与钱包。
  MIT 许可、包名 `@fresnica/ui-native`、非 npm 公开发布状态都已明示。
- **跨仓库 Token 可追溯性（DS-04）：** Web 源经生成器输出 Native Light/Dark Token，
  `test:source-contract` 检查映射、完整覆盖以及覆盖原因。
  [PR #30](https://github.com/Pixman022/fresnica-ui-native/pull/30) 的 CI/Preview/模拟器验收通过。
- **可复现的对比度审计（DS-05 工程部分）：** `test:contrast` 计算代表性组合，
  明确区分 CI 达标检查与尚待设计评审的 `REVIEW` 不达标组合。
  **不意味着所有主题颜色已符合 WCAG。**
- **复用 Token 的组件布局（DS-06）：** [PR #32](https://github.com/Pixman022/fresnica-ui-native/pull/32)
  将可直接映射的固定布局数字改用 `theme.spacing/radii/sizes`，保留 44dp 触摸目标等平台约束。
- **15 个组件直接渲染测试及 Preview（DS-07/08）：**
  [PR #29](https://github.com/Pixman022/fresnica-ui-native/pull/29) 已通过 CI、
  Android Preview 和模拟器 320dp / fontScale 1.3 / Dark / 简体中文 / Stress 验收。
- **视觉证据基础（DS-10）：** [Native 视觉证据文档](native-visual-evidence.md)
  明确当前截图、设备/窗口层级/manifest 和来源 SHA，并列出未覆盖的视口。
- **消费方交付和下游复核（DS-12/13）：**
  [固定提交安装与 Token 交接说明](consumer-handoff.md)描述本地 `npm pack`
  安装、宿主类型检查、Web 更新后手动校验 Native CI 的路径。
- **CI：** 上述 PR 在其最新测试 SHA 的三个 UI 验证工作流已成功。
  截至本报告基线，最新 Native `main` CI
  [#37878757967](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37878757967) 为成功。

## 尚未完成，不应关闭的工作

1. **设计确认：** 原生主按钮浅色/深色模式的白字对比度分别为
   3.06:1 和 2.14:1，低于普通文字 4.5:1；浅色 muted、
   部分状态字色和必要控件边框也需审查。
   详见[浅色按钮字色候选方案](native-primary-button-color-review.md)与
   [对比度审计](native-contrast-audit.md)。
2. **DS-09 多配置实测：** 当前 320dp / 1.3 / Dark / zh-CN / Stress
   有成功证据；计划中的 320 Light、360 Dark、390 Light、430 Dark 周期矩阵
   及 English 长文案、393dp 和滚动到视口下方的组件尚缺完整独立证据。
3. **DS-11 视觉基准：** 尚未批准固定的设备、系统字体和多主题视觉基准；
   目前不应使用未经审核的图像进行自动像素差异强制判定。
4. **DS-14 正式交付批准：** 本报告是状态交接草案；颜色问题及视觉矩阵完成后，
   需要再确认 DoD、验收截图和版本/来源指纹。公开 npm 发布非必要条件。

## 下一步验收顺序

1. 由设计负责人选择浅色字体所需的绿色按钮底色方案，先通过 Web/Native
   语义角色审查，不自动改动原 Web 1.0.0 品牌色。
2. 继续累积 Android 中性 Preview 的多宽度/主题证据，补 English 长文案和
   初始可视区域之外的 Header/IconButton/Skeleton/Divider 等组件状态。
3. 审核视觉差异并明确批准基准，随后更新 DoD 和固定提交的消费方安装记录。
4. 保留真机/iOS/钱包业务/Mainnet 安全评估为独立未来产品工作；
   不把模拟器成功结果等同于上述验收。

本报告记录的完成项必须与现有 PR、工作流和文件对应；剩余项不会因 CI 通过而自动完成。
