# Fresnica Native UI 视觉基准审核单（待批准）

> **状态：待设计负责人审核，不是已批准的 Golden Baseline。**
> 本审核仅面向 `@fresnica/ui-native` 的中性 `example/` 预览宿主。
> 不包括钱包账户、交易、私钥、Mainnet、真实设备或 iOS 产品验收。

本文件用于执行 [DS-11](ui-library-delivery-plan.md)，并承接
[Issue #37](https://github.com/Pixman022/fresnica-ui-native/issues/37) 中已经完成的多尺寸截图采集。
审核基线的前提是**能定位到实际图片、设备环境、来源提交和明确的人工决定**，
不能因为 CI 为绿色而自动视为设计签核成功。

## 1. 待审核证据集

### 中文／深色／窄屏

- **320dp × fontScale 1.3 × Dark × zh-CN × Stress**：
  [PR #35 模拟器验收 #37879358007](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37879358007)，
  artifact `11593888236`。
- 观察：在很窄的屏幕上，主题分段控件的 `System` 选项可能换成两行；
  已记录为需要确认的布局现象，不等于被批准的组件样式。

### 英文／浅色／长文案和滚动内容

- **393dp × fontScale 1.3 × Light × English × Stress**：
  同一 [PR #35 验收](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37879358007)，
  首屏 artifact `11593499366`，滚动组件区 artifact `11593642602`。
- 观察：长文案可换行；长 `Header` 最多显示两行并省略，需由设计负责人确认
  是否符合规范意图。组件区展示 `Button` 各状态、`Header`、`IconButton`、
  `Divider` 和 `Skeleton`。

### 四组矩阵

- **320dp × 1.0 × Light × zh-CN × Stress**：
  [PR #39 验收 #37889383234](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37889383234)，
  artifact `11597572552`。
- **360dp × 1.0 × Dark × zh-CN × Stress**：同一 run，artifact `11598081033`。
- **390dp × 1.3 × Light × zh-CN × Stress**：同一 run，artifact `11598151724`。
- **430dp × 1.3 × Dark × zh-CN × Stress**：同一 run，artifact `11597522664`。
- 四组首屏在已审阅的画面中未观察到明显的横向溢出，
  但它们**不能证明下方所有控件、键盘、焦点顺序或 Modal 均通过**。

### 来源与复现条件

- PR #35 head：`d43fd3878945de1ee5f662d7609a5847b46da6d4`；
  GitHub Actions checkout：`20c8d4dba8f3e78b3e58b9334db2ef3d999a8fac`；
  后续 squash merge：`2519eb6b7795ccac4203310a80e2bd1baf81b0a4`。
- PR #39 head：`1c83f81fa7d71a9efd53000e7120c0b1b9f0e814`；
  GitHub Actions checkout：`72c25c7ce62a624bb81e420dc5a5fa3902619107`；
  后续 squash merge：`4cacbd0b2d458619d460d9f30ab5d4944d19fdda`。
- 环境：Android 15/API 35 模拟器 `sdk_gphone64_x86_64`、420dpi，
  由 Android Acceptance Profile 选择宽度、字体倍率和深浅色。
  模拟器系统 locale 为 `en-US`，中文内容由 Preview 内部切换为 `zh-CN`。
- 每个验收 artifact 包括 `device.json`、`screenshot.png`、
  `window.xml`、`manifest.json`，GitHub Actions 默认保留 90 天。
  **正式获批的视觉基准不应只引用可能过期的临时工件。**

## 2. 审批前必须确认的设计问题

- [ ] **布局与密度：** 对照 Web 设计规则，确认各宽度下页面内边距、
  文字等级、卡片间距和触摸目标视觉比例可接受。
- [ ] **小屏换行：** 判断 320dp 下 `System` 主题选项换行是否符合预期；
  若需要调整，另开单独的组件设计变更 PR，附前后截图。
- [ ] **标题截断：** 判断 393dp 英文长 `Header` 两行省略是否符合规范。
- [ ] **组件状态：** 核对按钮正常／禁用／加载、错误文案和状态反馈；
  不把首屏未展示的状态推断为已审核。
- [ ] **真实模拟器交互：** 核实 Android Back 关闭 `Modal`、
  软键盘显示和滚动后按钮可达性。工程验证由
  [PR #42](https://github.com/Pixman022/fresnica-ui-native/pull/42) 跟踪，
  **在其工作流和工件检查成功前不得勾选**。
- [ ] **来源一致性：** 检查截图对应的 Android API、密度、系统栏、
  fontScale、语言、主题、代码 SHA；每个例外有明确记录。
- [ ] **人工视觉审核：** 指定审核人逐张查看截图，
  记录接受或要求修改，不能由 CI 自动代替。

### 保持原配色的已知限制

项目所有者已决定**暂时保留原品牌绿和浅色按钮文字**。
现有白字／绿色按钮对比度为 **Light 3.06:1、Dark 2.14:1**，
低于 WCAG AA 普通文字 4.5:1 目标。
详见 [Native 对比度审计](native-contrast-audit.md)。
**选择保持颜色不变，不等于对颜色无障碍的豁免或达标批准。**

本次仅可审核布局、组件状态和设计还原的一致性。
若设计所有者希望正式声明 WCAG AA 达标，必须单独处理颜色、
状态字色等已知缺口并重新验证，不能在当前审核单中隐式签署。

## 3. 审批决定记录（留待人工填写）

- 审核人：**待填写**
- 审核日期：**待填写**
- 已逐一查看的源工件 ID：**待填写**
- 审核结果：**待决定 — 批准布局视觉基准／要求修改／延后审核**
- 已接受的差异（如果有）：**待填写**
- 仍需修复的差异及对应 Issue／PR：**待填写**
- 颜色对比度：**已知未达标；不属于可自动豁免项**
- Pixel-diff 强制检查：**未启用**。只有审批稳定的参考图、
  固定环境以及确认可接受的差异阈值后才能考虑启用。

## 4. 交付判定

- 现有证据可用于**内部 UI 包试集成和布局审阅**；
  不能作为钱包 App 上线批准或真实设备无障碍结论。
- DS-09 的多尺寸首屏证据已经齐备；模拟器交互验证单独跟踪。
- **DS-11 仍为未完成**：此处不存在设计负责人的签字与正式 Golden Baseline，
  也不存在已核定的自动像素差异阈值。
- 审批后应通过 PR 更新本记录、[视觉证据矩阵](native-visual-evidence.md)、
  [交付状态](ui-library-phase-one-status.md)和
  [Issue #37](https://github.com/Pixman022/fresnica-ui-native/issues/37)；
  不直接更改已经冻结的 Web／Native Token。
