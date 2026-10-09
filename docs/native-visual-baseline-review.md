# Fresnica Native UI 视觉基准审核单（布局已批准）

> **状态：项目所有者已于 2026-10-09 明确批准阶段一视觉布局与代表性参考画面。** 此批准不是 WCAG AA、TalkBack、真机或像素级自动验收的签核。

本文件只审核 `@fresnica/ui-native` 的中性 `example/` 预览宿主，不包括钱包账户、交易、私钥、Mainnet、真实设备或 iOS 验收。

与 [DS-11 交付计划](ui-library-delivery-plan.md)、[Issue #37](https://github.com/Pixman022/fresnica-ui-native/issues/37) 及 [视觉证据矩阵](native-visual-evidence.md) 配套使用。绿色 CI 和已采集的截图不自动等于设计批准。

## 待审的真实截图

- **320dp / 1.3 / Dark / zh-CN / Stress（修复前）：** [PR #35 运行 #37879358007](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37879358007)，artifact `11593888236`。当时「跟随系统」分成两行。
- **320dp / 1.3 / Dark / zh-CN / Stress（修复后、获布局批准）：** [PR #45 验收 #37900891035](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37900891035)，artifact `11601878335`。「系统」显示在一行；项目所有者已批准此缩写。
- **393dp / 1.3 / Light / English / Stress 首屏：** [PR #45 复测 #37900891035](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37900891035)，artifact `11602721487`。英文长文案可自然换行；PR #35 的历史样本 `11593499366` 仍可追溯。
- **393dp / 1.3 / Light / English / Stress 滚动组件区：** [PR #45 复测 #37900891035](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37900891035)，artifact `11602037743`。展示 Button、`Header`、`Divider`、`IconButton`、`Skeleton`；长 Header 的两行省略已获布局批准。PR #35 的旧样本 `11593642602` 保留作为历史证据。
- **320dp / 1.0 / Light / zh-CN / Stress：** [PR #48 复测 #37904497820](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37904497820)，artifact `11604366210`，已采用新版「系统」单行。旧版 PR #39 artifact `11597572552` 不再作为当前版本的批准参考图。
- **360dp / 1.0 / Dark / zh-CN / Stress：** 同一 PR #48 四配置复测，artifact `11603933870`。
- **390dp / 1.3 / Light / zh-CN / Stress：** 同一 PR #48 四配置复测，artifact `11604018736`。
- **430dp / 1.3 / Dark / zh-CN / Stress：** 同一 PR #48 四配置复测，artifact `11603908991`。

四组矩阵的已审核首屏没有发现明显横向溢出，现获**代表性视觉布局批准**。但首屏截图不证明焦点顺序、TalkBack、键盘或 Modal 的全部行为；这些能力的合规签核仍独立处理。

## 固定环境及代码来源

- **环境：** Android 15/API 35，`sdk_gphone64_x86_64`，420dpi；由 Preview 配置宽度、fontScale 和 Light/Dark，App 内切换 `zh-CN` / English。模拟器设备 locale 为 `en-US`。
- **PR #35：** head `d43fd3878945de1ee5f662d7609a5847b46da6d4`；Actions checkout `20c8d4dba8f3e78b3e58b9334db2ef3d999a8fac`；squash commit `2519eb6b7795ccac4203310a80e2bd1baf81b0a4`。
- **PR #39：** head `1c83f81fa7d71a9efd53000e7120c0b1b9f0e814`；Actions checkout `72c25c7ce62a624bb81e420dc5a5fa3902619107`；squash commit `4cacbd0b2d458619d460d9f30ab5d4944d19fdda`。
- **PR #42 交互：** [模拟器 #37896975342](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37896975342)，head `b0ad718db2d754ac75efe8f1dec339256a765f95`；Actions checkout `4c1f5575768878d2b73ac2256b22a8df724dabd5`；squash commit `87c3fc92f57c9660fd7d7aa9fa995648a8e4fb5c`。对应 Modal/键盘工件 ID：`11600614336`、`11600494850`、`11601495636`、`11601405854`。
- **PR #45 窄屏主题标签：** [模拟器 #37900891035](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37900891035)，head `a81a15a2a91eb76d1e91ae6b52f527243543fff5`；Actions checkout `bc110766630b83bbe42c190f84c3ee1d1e8eeac2`；squash commit `cd4a171c065df4cf83ad2cc16e1c06161d3c30c7`。320dp 修复后 artifact `11601878335`；CI、Android Preview、模拟器验收均通过。
- **工件内容：** 每份均有 `device.json`、`screenshot.png`、`window.xml`、`manifest.json`；GitHub Actions 通常保留 90 天，不宜仅凭临时工件作为长期 Golden Baseline。

## 已批准参考快照的长期元数据

[七组批准基准清单](visual-baselines/approved-manifest.json)固定了每张
真实 Android PNG 的 SHA-256、捕获时间、像素尺寸、Android 15/API 35、420dpi、
字体比例、主题、语言、实际 Actions checkout SHA 与工件 ID。
[复现与保留规则](visual-baselines/README.md)明确没有启用自动像素比较。
原始图片仍在 GitHub Actions 90 天工件中；若以后需要永久按像素比对，
应在过期前单独归档原始二进制图像，不能把仅有 SHA-256 的清单当作永久 PNG 托管。

## 设计负责人逐项审查

- [x] 项目所有者批准已审阅范围内的布局密度、内边距、文字层级、组件间距与代表性 Light/Dark 视觉关系；不代表未展示的全部平台状态。
- [x] 批准 [PR #45](https://github.com/Pixman022/fresnica-ui-native/pull/45) 修复后的 320dp「系统」单行，旧版「跟随系统」换行仅保留为历史对比。
- [x] 批准 393dp 英文压力测试中的 `Header` 两行省略，限于此有意加长的示例标题。
- [x] 批准已呈现的 Button 默认／禁用／加载、Field 错误提示及状态反馈的布局呈现；未将未展示状态或颜色对比度视为通过。
- [x] 接受已展示的下方基础组件布局；[PR #42](https://github.com/Pixman022/fresnica-ui-native/pull/42) 的弹窗返回和键盘上方按钮实际点击有独立工程证据。**不包括**焦点顺序、TalkBack 或键盘遮挡后的整段反馈文字可读性。
- [x] 复核七份 Android 截图的设备、宽度、字体比例、主题、语言、source checkout SHA 和 PNG SHA-256，并在版本化清单固定。
- [x] 选定七份代表性视觉布局参考截图及其工件链接和校验值。决定**保留人工视觉基准**，不启用自动 Pixel-diff；二进制 PNG 的长期单独归档仍需在工件过期前安排。

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

- 审核人：**项目所有者（在本次项目对话中明确批准，不推定个人姓名）**
- 审核日期：**2026-10-09**
- 批准对象：**中性 Native Preview 阶段一代表性视觉布局及可见组件状态**
- 参考工件 ID：`11601878335`、`11602721487`、`11602037743`、`11604366210`、`11603933870`、`11604018736`、`11603908991`。
- 决定：**批准上述视觉布局基准**，具体截图 SHA-256 和配置以 [版本化清单](visual-baselines/approved-manifest.json) 为准。
- 接受的视觉差异和理由：320dp 改用「系统」避免折行；英文 Header 允许两行省略；保留当前 Light/Dark 及原配色。
- 未纳入本次批准：**WCAG AA、完整 TalkBack/焦点顺序、真实手机/iOS、键盘遮挡后的反馈全文可读性、钱包产品上线**。
- 颜色可读性：**现有白字与绿色按钮对比度未达标，保持原状并明确保留问题**。
- 自动 Pixel-diff 门禁：**暂不启用**，未来必须单独审核固定 PNG 存储、环境稳定性和差异阈值。

## 交付边界

当前 UI 包可以内部试集成；DS-09 多尺寸与关键模拟器交互证据已齐备，**DS-11 的代表性视觉布局现已获得项目所有者批准**。真实 Android 手机、TalkBack、完整无障碍合规、iOS、钱包业务安全与 Mainnet 均不在这次视觉签核内。

本次通过 [PR #48](https://github.com/Pixman022/fresnica-ui-native/pull/48) 同步 [交付计划](ui-library-delivery-plan.md)、[视觉证据矩阵](native-visual-evidence.md)、[阶段交付报告](ui-library-phase-one-status.md) 和 [Issue #37](https://github.com/Pixman022/fresnica-ui-native/issues/37)。Web/Native Token 及品牌色不变。
