# Fresnica Native UI 视觉基准审核单（待批准）

> **状态：待设计负责人审核；没有 Golden Baseline 签核。**

本文件只审核 `@fresnica/ui-native` 的中性 `example/` 预览宿主，不包括钱包账户、交易、私钥、Mainnet、真实设备或 iOS 验收。

与 [DS-11 交付计划](ui-library-delivery-plan.md)、[Issue #37](https://github.com/Pixman022/fresnica-ui-native/issues/37) 及 [视觉证据矩阵](native-visual-evidence.md) 配套使用。绿色 CI 和已采集的截图不自动等于设计批准。

## 待审的真实截图

- **320dp / 1.3 / Dark / zh-CN / Stress（修复前）：** [PR #35 运行 #37879358007](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37879358007)，artifact `11593888236`。当时「跟随系统」分成两行。
- **320dp / 1.3 / Dark / zh-CN / Stress（修复后）：** [PR #45 验收 #37900891035](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37900891035)，artifact `11601878335`。中性 Preview 在窄屏上将视觉标签缩写为「系统」；真实截图与窗口层级确认单行显示，其他两个主题选项仍完整。**工程修复成功，不等于设计负责人已批准正式基准。**
- **393dp / 1.3 / Light / English / Stress 首屏：** [PR #35 运行 #37879358007](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37879358007)，artifact `11593499366`。已经看到英文长文案自然换行。
- **393dp / 1.3 / Light / English / Stress 滚动组件区：** 同一 PR #35 运行，artifact `11593642602`。有按钮状态、`Header`、`Divider`、`IconButton`、`Skeleton`；长 Header 最多两行并省略，需设计确认。
- **320dp / 1.0 / Light / zh-CN / Stress：** [PR #39 运行 #37889383234](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37889383234)，artifact `11597572552`。
- **360dp / 1.0 / Dark / zh-CN / Stress：** 同一 PR #39 运行，artifact `11598081033`。
- **390dp / 1.3 / Light / zh-CN / Stress：** 同一 PR #39 运行，artifact `11598151724`。
- **430dp / 1.3 / Dark / zh-CN / Stress：** 同一 PR #39 运行，artifact `11597522664`。

四组矩阵的已审核首屏没有发现明显横向溢出。但首屏截图不证明所有下方组件、焦点、键盘或 Modal 交互正常，也不代表已获批的参考图。

## 固定环境及代码来源

- **环境：** Android 15/API 35，`sdk_gphone64_x86_64`，420dpi；由 Preview 配置宽度、fontScale 和 Light/Dark，App 内切换 `zh-CN` / English。模拟器设备 locale 为 `en-US`。
- **PR #35：** head `d43fd3878945de1ee5f662d7609a5847b46da6d4`；Actions checkout `20c8d4dba8f3e78b3e58b9334db2ef3d999a8fac`；squash commit `2519eb6b7795ccac4203310a80e2bd1baf81b0a4`。
- **PR #39：** head `1c83f81fa7d71a9efd53000e7120c0b1b9f0e814`；Actions checkout `72c25c7ce62a624bb81e420dc5a5fa3902619107`；squash commit `4cacbd0b2d458619d460d9f30ab5d4944d19fdda`。
- **PR #42 交互：** [模拟器 #37896975342](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37896975342)，head `b0ad718db2d754ac75efe8f1dec339256a765f95`；Actions checkout `4c1f5575768878d2b73ac2256b22a8df724dabd5`；squash commit `87c3fc92f57c9660fd7d7aa9fa995648a8e4fb5c`。对应 Modal/键盘工件 ID：`11600614336`、`11600494850`、`11601495636`、`11601405854`。
- **PR #45 窄屏主题标签：** [模拟器 #37900891035](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37900891035)，head `a81a15a2a91eb76d1e91ae6b52f527243543fff5`；Actions checkout `bc110766630b83bbe42c190f84c3ee1d1e8eeac2`；squash commit `cd4a171c065df4cf83ad2cc16e1c06161d3c30c7`。320dp 修复后 artifact `11601878335`；CI、Android Preview、模拟器验收均通过。
- **工件内容：** 每份均有 `device.json`、`screenshot.png`、`window.xml`、`manifest.json`；GitHub Actions 通常保留 90 天，不宜仅凭临时工件作为长期 Golden Baseline。

## 设计负责人逐项审查

- [ ] 对照 Web 语义设计规则，逐张确认布局密度、内边距、文字层级、组件间距和系统栏。
- [ ] 对比旧版 320dp「跟随系统」两行与 [PR #45](https://github.com/Pixman022/fresnica-ui-native/pull/45) 修复后「系统」单行，确认缩写是否符合设计语言。工程已复核单行显示；**设计负责人批准仍待填写**。
- [ ] 判断 393dp 英文 `Header` 的两行截断是否符合设计规则。
- [ ] 确认按钮默认、禁用、加载、错误提示与状态色在实际截图中的视觉关系。
- [ ] 设计负责人审阅下方组件与交互差异。工程侧 [PR #42](https://github.com/Pixman022/fresnica-ui-native/pull/42) 已在真实模拟器验证弹窗 Android Back 关闭、键盘打开后按钮可见且可点击；但一般焦点顺序与 TalkBack 未验证，操作反馈文案也并未在键盘打开时完整可见。
- [ ] 核对每份截图的设备、主题、字号、语言、来源 SHA 和具体例外。
- [ ] 人工选定获批的参考截图及其持久保管位置；如果需自动像素差异检查，应先单独审定稳定环境和误报阈值。

## 当前保留的配色限制

项目所有者已明确暂时**保留原品牌绿和浅色按钮文字**。普通按钮白字对比度为 Light **3.06:1**、Dark **2.14:1**，低于 WCAG AA 普通文字 **4.5:1**。详见 [对比度审计](native-contrast-audit.md)。保持配色不等于无障碍豁免，也不允许声明全部 WCAG AA 达标。

本次可审核布局和设计还原一致性，不能在未处理颜色不足的情况下签署色彩无障碍合规声明。

## 与 Web 移动端基线的验收边界

[Web 移动端实施基线](https://github.com/Pixman022/fresnica-ui/blob/main/docs/design-system/mobile-native-baseline.md)
将 Android TalkBack、键盘、安全区、系统栏、减少动画和动态字体的手工验收列为
**完整移动端阶段门槛**。当前此仓库的 [阶段一组件库交付计划](ui-library-delivery-plan.md)
仅把中性 Preview 的模拟器布局及必要交互列入 **DS-09 工程验收**；
真机 TalkBack、完整焦点顺序、减少动画和产品 App 验收**没有被证明通过**。

这是**两个不同交付范围**，不能以 DS-09 的成功替代 Web 基线所要求的完整移动端验收。
如需要将交付范围扩展为完整原生客户端的无障碍签核，应单独制定具备
测试设备、实际用例和人工审核人的后续验收计划，不在此页自动补齐。
目前 DS-11 只等待布局视觉基准的明确批准，不包含 WCAG AA 或 TalkBack 的批准。

## 审核决定（待人工填写）

- 审核人：**待填写**
- 审核日期：**待填写**
- 实际打开检查的工件 ID：**待填写**
- 决定：**待批准布局视觉基准／要求修改／延后审核**
- 接受的视觉差异和理由：**待填写**
- 需改动的组件及对应 Issue／PR：**待填写**
- 颜色可读性：**已有不达标记录，尚无合规结论**
- 自动 Pixel-diff 门禁：**尚未启用；不得用未批准截图作为 Golden Baseline**

## 交付边界

当前代码可以用于内部组件库试集成和视觉审阅；真实 Android 手机、TalkBack、iOS、钱包产品、安全与 Mainnet 均不在当前交付签核内。DS-09 的多尺寸首屏与核心模拟器弹窗／键盘交互工程证据已齐备；**DS-11 保持未完成**，直到设计负责人审核并记录决定。

审批后再通过 PR 更新本审核单、[视觉证据矩阵](native-visual-evidence.md)、[阶段交付报告](ui-library-phase-one-status.md) 与 [Issue #37](https://github.com/Pixman022/fresnica-ui-native/issues/37)，不直接更改已冻结的 Web/Native Token。
