# Fresnica Native 组件库：人工无障碍验收手册（待执行）

> **状态：仅建立可执行的人工验收方案，未进行真机验收。**
> 本文件是 [Issue #49](https://github.com/Pixman022/fresnica-ui-native/issues/49)
> 的后续工作，不重新打开已完成的 [DS-09/DS-11](ui-library-delivery-plan.md)。
> 当前阶段一获批的是中性 Preview 的代表性**视觉布局**，
> 并非 WCAG AA、Android TalkBack 或完整产品可访问性认证。

## 1. 适用范围与验收责任

- **验收对象：** `Pixman022/fresnica-ui-native` 的
  `@fresnica/ui-native` 和独立 `example/` Android Preview。
  当前组件库有 15 个导出组件；检查通过 Preview 能够触达的控件。
- **适用来源：** [Web 移动端基线](https://github.com/Pixman022/fresnica-ui/blob/main/docs/design-system/mobile-native-baseline.md)
  的角色、标签、状态、焦点、动态字号、触摸目标、减少动画与平台验收要求。
- **执行者：** 具有设备使用权限的人工测试人员，**尚未指定**。
  不能使用 Jest 输出、无障碍层级快照或 CI 绿色状态代替实际朗读和触摸操作。
- **验收限制：** 不打开历史 `product/` 钱包原型；
  不测试账号、签名、密钥、交易、Mainnet 或其他 GitHub 所有者仓库。
- **配色：** 原品牌绿与浅色按钮字色维持不变。
  当前主按钮文字对比度 Light 3.06:1、Dark 2.14:1，低于普通文字 4.5:1。
  本手册**不能**签发 WCAG AA 认证或豁免。

## 2. 测试环境与版本固定

使用一台可真实操作、支持 TalkBack 的 Android 设备，
记录设备型号、API 级别、系统版本、TalkBack 版本、
输入法及系统导航模式。可选第二台不同尺寸设备作为交叉验证，
但**未测试**时不得写成已通过。

在项目根目录运行：

```powershell
git rev-parse HEAD
npm ci
npm run example:android
adb devices -l
npm run example:device-info
```

物理设备上**不要运行** `npm run example:profile`。
该命令为模拟器专用，会主动修改显示设置且拒绝真机。
真实设备的文字尺寸、Light/Dark、减少动画、TalkBack 和
手势/三键导航由测试员在系统设置中逐项切换。
不同 Android 厂商的设置名称可能不同，必须记录实际取值。

建议至少覆盖默认字号与约 1.3 倍字号；
320、360、390–393、430dp 的工程截图已由模拟器矩阵验证，
**不等于这些宽度的真机无障碍测试全部完成**。

## 3. 人工操作矩阵

每个编号都填写 **通过 / 失败 / 阻塞 / 未测试**，
并提供观察和来源提交。若无实际操作或没有设备，一律为「未测试」。

- **TB-01 — TalkBack 阅读顺序：** 开启 TalkBack 后从中性 Preview 顶部逐项右滑。检查标题、环境、主题、语言和内容场景的顺序，没有无故重复或跳过的节点。
- **TB-02 — 分段选择语义：** 依次聚焦主题和语言分段，听取选项及已选中状态，双击切换并重新检查状态。320dp 的中文「系统」应清晰可理解。
- **TB-03 — Field 错误与禁用：** 聚焦金额输入框，在 Stress 模式下听取错误和提示。当前 Preview 未展示禁用 Field；禁用状态须有独立可见测试宿主才能操作，缺失时把该子项记为「阻塞」，不可假称通过。
- **TB-04 — 按钮与状态：** 检查普通、禁用、加载中的 Button 和 IconButton。听取标签、不可用与忙碌状态；双击图标按钮并确认其反馈可发现。
- **TB-05 — 非交互状态：** 检查 Progress、Skeleton、StatusBadge、ListRow 和空状态。确认进度/忙碌/状态文字及列表信息被正确传达，不只依赖颜色。
- **TB-06 — Modal 焦点与关闭：** 从「Open modal / 打开弹窗」打开对话框，逐项滑动，按系统 Back 和关闭按钮。检查对话框可达、背景不被错误聚焦、关闭后焦点合理恢复。
- **KB-01 — 真实软键盘：** 在键盘开启时滚动至下方主要按钮并执行，确认按钮不被遮挡、完整反馈文字可见且能被朗读；再次检查关闭键盘后的状态。
- **KB-02 — 实体键盘（如果具备）：** 用 Tab、Shift+Tab、Enter 和返回键检查焦点与激活行为。没有硬件时填「阻塞」，不能推断通过。
- **DT-01 — 系统字体缩放：** 默认字号和至少 1.3 倍下，重复关键控件和中英文 Stress 长文案；检查重要内容不被错误截断，窄屏「系统」单行。
- **TC-01 — 触控区域：** 手动点按图标按钮、紧凑控件、Modal 关闭控件。核对至少 44 × 44 逻辑像素或有效命中扩展，并观察 TalkBack 焦点与触控位置。
- **SYS-01 — 系统栏与安全区：** 切换 Light/Dark、手势与三键导航，观察 StatusBar、导航栏和安全区，记录屏幕开孔与底部导航造成的实际差异。
- **RM-01 — 减少动画：** 在系统设置中切换「减少/移除动画」，分别打开和关闭 Modal，观察并记录实际动画。现有 Modal 固定 `animationType="fade"`，未获减少动画合规结论。

### 已批准的设计决定：暂缓改变 Modal 动画（2026-10-09）

项目所有者选择 **A：保留现有 Modal 动画，现阶段不修改共享组件**；
见 [Issue #49 决策记录](https://github.com/Pixman022/fresnica-ui-native/issues/49)。
这属于明确延期，**不是**减少动画合规验收通过或豁免。
RM-01 的真机观察仍为「未测试」，不得把未修改行为当作通过；
未来若产品集成阶段重新启动无障碍完善，应基于真机证据取得新的设计授权。

当前 [共享 Modal 源码](https://github.com/Pixman022/fresnica-ui-native/blob/main/src/components/Modal.tsx)
使用固定 `animationType="fade"`，未根据系统减少动画设置选择不同策略。
如 RM-01 发现未尊重系统设置，应在 Issue #49 记录证据，
并请设计负责人在「系统减少动画时直接无动画」、
「暴露可覆盖的动画策略」等方案中明确决策。
**未获得新授权时不修改这个已交付共享组件的行为。**

## 4. 可复现的证据记录

每次测试至少记录：

- 测试员（由实际执行人员填写）及测试时间；
- 设备厂商/型号、Android 版本/API、TalkBack 版本、
  软键盘名称、系统导航模式、文字缩放比例和减少动画状态；
- Native 仓库完整 `git rev-parse HEAD` 提交 SHA、
  `npm run example:device-info` 结果和使用的 Preview 语言/场景/主题；
- 每个用例的实际操作路径、朗读/焦点观察、期望与实际差异、
  通过/失败/阻塞/未测试状态、可复现步骤；
- 仅对中性 Preview 采集必要的截图/录屏。
  不收集真实账户、钱包凭据、密钥或用户私人内容；
- 发现缺陷时提交新 Issue/PR，注明设备、代码 SHA、
  对应测试 ID 和关联验收工件。复测必须使用明确的新提交。

### 一次实际验收记录模板

- 操作人员 / 时间：**未填写**。
- Android 设备 / API / TalkBack 版本：**未填写**。
- 源码 SHA / Preview 主题、语言、字号：**未填写**。
- 输入法 / 导航方式 / 减少动画状态：**未填写**。
- 测试 ID 与结果：**均未测试**。
- 失败与阻塞证据链接：**未填写**。
- 人工验收结论：**尚未作出**。

## 5. 与既有自动化的关系

- [PR #48 视觉参考](visual-baselines/approved-manifest.json)：
  七组**布局参考图**有固定设备环境、源码和截图 SHA-256；
  不证明 TalkBack 或真实设备焦点顺序。
- [PR #42 模拟器交互](https://github.com/Pixman022/fresnica-ui-native/pull/42)：
  Android Back 和键盘按钮可达性曾通过自动模拟。
- [PR #50 键盘反馈修复](https://github.com/Pixman022/fresnica-ui-native/pull/50)：
  中性 Preview 的英文反馈已在模拟器截图中显示于键盘之上；
  **不代表 KB-01 的真机朗读或跨设备行为通过**。
- [组件渲染测试](../test/components.test.tsx)：
  已对部分 role/state/label 和回调进行 hostless 测试，
  不包含系统 TalkBack 的实际朗读顺序。
- 即使所有上述自动测试通过，
  **本手册的 TB / KB / DT / SYS / RM 人工用例仍保持未测试**。

## 6. 结论与关闭条件

只有实际测试人员填完上述环境、执行结果及失败复测，
并明确记录 RM-01 的实际观察及届时适用的无障碍验收标准后，
才可评估关闭 [Issue #49](https://github.com/Pixman022/fresnica-ui-native/issues/49)。

此次编制手册只是**增加验收准备工作**，
不修改已批准的视觉布局、不改变 Native/Web 品牌 Token，
也不改变 DS-01 至 DS-14 已完成的阶段一记录。
