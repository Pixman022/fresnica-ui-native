# Fresnica UI 阶段一交付状态报告（待视觉验收版）

> 记录日期：2026-10-09。**工程基础可供试集成，但本报告不是视觉无障碍通过声明，也不是钱包 App 生产发布批准。**

## 项目边界

- Web 规范源：[Pixman022/fresnica-ui](https://github.com/Pixman022/fresnica-ui)，
  当前 `main@9ad32c41be7eaf96662d2e8bacb1c9f957ba087b`。
- Native 消费包：[Pixman022/fresnica-ui-native](https://github.com/Pixman022/fresnica-ui-native)，
  此次工程状态基线 `main@87c3fc92f57c9660fd7d7aa9fa995648a8e4fb5c`。
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
  [#37899358856](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37899358856) 为成功。

## 尚未完成，不应关闭的工作

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
3. **DS-11 视觉基准：** 尚未批准固定的设备、系统字体和多主题视觉基准；
   已整理 [Native 视觉基准审核单](native-visual-baseline-review.md)
   供设计负责人逐项审阅，审核人和结果仍待填写。
   目前不应使用未经审核的图像进行自动像素差异强制判定。
4. **DS-14 工程交接与正式视觉批准分离：** 本报告记录了阶段一
   UI 包的现有版本、验证提交、集成方式和剩余限制；工程交接可进行，
   但**设计基准与无障碍合规未批准**，不得将状态报告作为正式
   视觉签核。公开 npm 发布非必要条件。

## 下一步验收顺序

1. 按当前决定**保留原按钮配色**。暂不处理候选的改色方案，保留上述
   对比度不合格记录，不对外声明全部配色已符合 WCAG AA。
2. PR #35/#39 的多尺寸中文/英文截图及 PR #42 的模拟器弹窗和
   键盘按钮实际点击证据已完成工程审查。完整焦点顺序和
   真机 TalkBack 尚未验证；当前截图仍未获
   **设计所有者的视觉基准批准**。
3. 审核视觉差异并明确批准基准，随后更新 DoD 和固定提交的消费方安装记录。
4. 保留真机/iOS/钱包业务/Mainnet 安全评估为独立未来产品工作；
   不把模拟器成功结果等同于上述验收。

本报告记录的完成项必须与现有 PR、工作流和文件对应；剩余项不会因 CI 通过而自动完成。
