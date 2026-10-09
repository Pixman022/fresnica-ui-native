# Fresnica UI 阶段一交付状态报告（视觉布局已批准）

> 记录日期：2026-10-09。**全部 14 项限定范围内的设计系统工程/视觉布局任务已完成，可供内部试集成；本报告不是 WCAG AA、TalkBack 或钱包 App 生产发布批准。**

## 项目边界

- Web 规范源：[Pixman022/fresnica-ui](https://github.com/Pixman022/fresnica-ui)，
  当前 `main@9ad32c41be7eaf96662d2e8bacb1c9f957ba087b`。
- Native 消费包：[Pixman022/fresnica-ui-native](https://github.com/Pixman022/fresnica-ui-native)，
  阶段一获批布局的代码基线 `main@14c4bd3f255d7b0d1edf27c7db6c1a3b109f6ffe`；PR #48 仅更新审核/交付文档。
- 对外交付是 `src/` UI 组件、共享 Token 契约、`example/` 中性 Preview、测试和集成文档。
  `product/` 是保留的历史钱包原型，不属于 UI 库的交付或测试门槛。
  完整移动客户端的无障碍手工验收仍需遵守
  [Web 移动端实施基线](https://github.com/Pixman022/fresnica-ui/blob/main/docs/design-system/mobile-native-baseline.md)
  的单独门槛；本报告的中性 Preview 工程通过记录不替代真实 TalkBack、
  焦点顺序和真机产品验收。

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
- **视觉证据与批准（DS-10/11）：** [Native 视觉证据文档](native-visual-evidence.md)
  记录截图、设备/窗口层级/manifest 和来源 SHA；项目所有者于 2026-10-09
  批准代表性视觉布局，[七组固定参考](visual-baselines/approved-manifest.json)
  保留设备参数、真实工件 ID 和 PNG SHA-256。原图在 90 天 Actions 工件中，长期二进制归档与自动像素差异检测未启用。
- **消费方交付和下游复核（DS-12/13）：**
  [固定提交安装与 Token 交接说明](consumer-handoff.md)描述本地 `npm pack`
  安装、宿主类型检查、Web 更新后手动校验 Native CI 的路径。
- **CI：** 上述 PR 在其最新测试 SHA 的三个 UI 验证工作流已成功。
  截至本报告基线，最新 Native `main` CI
  [#37903416816](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37903416816) 为成功。

## 后续维护补记（2026-10-09）

- [PR #50](https://github.com/Pixman022/fresnica-ui-native/pull/50) 已修复中性 Preview 键盘开启时反馈文案的可见性，并取得模拟器截图证据。下文第 2 项描述的「被键盘部分遮住」是**阶段一当时的历史观察**，不再代表现行 Preview 的已知模拟器问题；但仍不能据此宣称真实设备、TalkBack 或软键盘的无障碍验收通过。
- [PR #51](https://github.com/Pixman022/fresnica-ui-native/pull/51) 已提供 [人工设备验收手册](native-accessibility-device-acceptance.md)；12 项真机测试仍待实际操作与记录，由 [Issue #49](https://github.com/Pixman022/fresnica-ui-native/issues/49) 独立追踪。
- 本报告保留阶段一原始验证的提交、工件和限制，不把后续修复倒填为阶段一时已经完成的证据；原品牌色与浅色按钮文字保持不变。

## 已批准交付之外的独立限制与未验收事项

1. **当前保持原配色（已确认范围约束）：** 暂不修改品牌绿、白字或
   Light/Dark Token。主按钮普通白字对比度分别为 **3.06:1**（Light）和
   **2.14:1**（Dark），仍低于普通文字 **4.5:1**；浅色 muted、
   部分状态字色及必要控件边框也有未解决的评审项。
   这意味着**可试集成不等于 WCAG AA 达标**。后续若需无障碍合规声明，
   须另行批准配色修复并验证；详见[原配色及候选方案记录](native-primary-button-color-review.md)
   和[对比度审计](native-contrast-audit.md)。
2. **DS-09 限定工程验收已完成，深层无障碍仍未验证：**
   [PR #35](https://github.com/Pixman022/fresnica-ui-native/pull/35) 已验证
   320dp Dark 中文、393dp Light 英文首屏与下方组件区。
   [PR #39](https://github.com/Pixman022/fresnica-ui-native/pull/39) 的
   [四组矩阵 #37889383234](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37889383234)
   实测 320 Light、360 Dark、390 Light、430 Dark 中文压力测试首屏。
   [PR #40](https://github.com/Pixman022/fresnica-ui-native/pull/40)
   验证组件 Back 回调与滚动键盘点击配置。
   [PR #42](https://github.com/Pixman022/fresnica-ui-native/pull/42) 的
   [模拟器验收 #37896975342](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37896975342)
   新增真实 Android 返回键关闭弹窗、软键盘可见及其上方按钮可点击的
   截图、UI 层级和来源提交证据，且 CI、Preview 和模拟器均通过。
   **一般焦点导航顺序、TalkBack、真机键盘行为仍未验证**；
   操作反馈文案在最后一张截图中也被键盘部分遮住，不将其完整可读性
   声明为已验收。详见 [Issue #37](https://github.com/Pixman022/fresnica-ui-native/issues/37)。
3. **DS-11 代表性视觉布局已批准：** 项目所有者于 **2026-10-09** 接受
   [PR #45](https://github.com/Pixman022/fresnica-ui-native/pull/45) 的 320dp「系统」单行、
   393dp 英文长 Header 两行省略及已审阅的 Light/Dark 布局；
   [PR #48](https://github.com/Pixman022/fresnica-ui-native/pull/48) 重新采集
   修复后的 320dp 浅色等四个场景，七份 PNG 的 SHA-256 和设备配置已归档。
   [正式签核单](native-visual-baseline-review.md)限定该批准仅为**布局视觉**；
   不代表 WCAG AA 或 TalkBack 通过。未启用像素差异门禁，永久 PNG 归档仍待独立安排。
4. **DS-14 工程交接与正式视觉批准分离：** 本报告记录了阶段一
   UI 包的现有版本、验证提交、集成方式和剩余限制；工程交接可进行，
   **阶段一代表性布局基准已批准，但无障碍合规仍未批准**；
   不能将本报告作为钱包产品的完整视觉/无障碍上线签核。
   公开 npm 发布非必要条件。

## 下一步验收顺序

1. 按当前决定**保留原按钮配色**。暂不处理候选的改色方案，保留上述
   对比度不合格记录，不对外声明全部配色已符合 WCAG AA。
2. PR #35/#45 的中性 Preview 截图及 PR #48 的新四配置矩阵
   已获得项目所有者的**阶段一布局视觉批准**，详见
   [批准清单](visual-baselines/approved-manifest.json)。完整焦点顺序与真机 TalkBack
   尚未验证，不能将这些截图作为全面无障碍合规结论。
3. DS-11 签核与 DoD 已更新。消费者仍须固定完整 Git SHA、运行测试并记录打包校验值；
   任何后续视觉变动均需新的差异记录与明确批准，永久 PNG 归档和 Pixel-diff 为独立后续决策。
4. 保留真机/iOS/钱包业务/Mainnet 安全评估为独立未来产品工作；
   不把模拟器成功结果等同于上述验收。

本报告记录的完成项必须与现有 PR、工作流和文件对应；剩余项不会因 CI 通过而自动完成。
