# Fresnica UI 设计系统交付计划（阶段一）

> 状态：执行中 · 2026-10-09 · 责任范围：仅 `Pixman022/fresnica-ui` 与 `Pixman022/fresnica-ui-native`。
> 本计划是 UI 设计规范和可复用组件库的交付计划，不是钱包 App 的开发或上线计划。

## 1. 依据与现状

- 原评估依据：用户提供的《评估结果.md》，评估的是 Web 仓库 `74220ac0583f4194239d88247f903f165ac63c37`，并非今天的最新实现。
- 复核基线：Web `main@9ad32c41be7eaf96662d2e8bacb1c9f957ba087b`；Native `main@1973007f6f019793473e0752aa81019f2df34671`。
- 已有能力：两仓库 MIT 许可；Web 48 个组件与三层 Token；Native 独立包、15 个共享组件、Light/Dark/System 解析、Token 生成和来源校验、Jest、Android Preview 及模拟器验收。
- 已解决的历史阻塞：商业使用许可、Web 组件不能直接作为 RN 组件使用、第一阶段共享 Token 的平台输出、基础国际化注入。
- 当前遗留限制：15 个 Native 组件的基础测试、Preview、Token 对比度审计、消费方文档、四组尺寸/主题首屏及模拟器级弹窗 Back / 软键盘按钮可达性已完成。仍缺设计负责人批准的稳定视觉基准；焦点顺序与 TalkBack 未经过真实无障碍验收。原品牌配色保持不变，已有文字对比度短板不视为达标。
- 限定：已有 Android 自动化验证并不等于真机 TalkBack、键盘、安全区或未来钱包产品验收通过。

## 2. 产品边界与交付物

### 纳入范围

1. **Web 规范源**：`fresnica-ui/design-system/tokens.json`、`platform-token-source.json`、设计规则和组件文档，继续保留 Primitive → Semantic → Component。
2. **原生适配包**：`fresnica-ui-native/src/` 的 `@fresnica/ui-native`；保留 Android-first React Native 0.87 基线、类型定义、组件、无障碍语义和主题。
3. **组件预览**：`example/` 作为中性组件展示、交互和边界压力测试宿主；不需要钱包账户、网络或签名功能。
4. **工程交付**：来源一致性校验、组件测试、可重复的模拟器证据、文档、版本与安装演示。

### 不纳入范围

- `product/` 内的 Stellar Testnet、Horizon、密钥、转账、钱包状态和 Mainnet 逻辑；现有代码作为历史原型留存，不扩展也不作为组件库发布门槛。
- 钱包备份恢复策略、生产节点信任、链上交易测试、Mainnet 安全签核和产品级真机验收。原 Issue #21/#22 作为未来钱包项目资料保留。
- iOS/VoiceOver、图片取色主题、完整钱包业务页面、额外的 48 个 Web 组件全量原生移植。
- 为了提升组件数量而引入原生插件、手势库或另建并行组件系统。
- 当前阶段不需要公开 npm 发布，也不要求未来的钱包 App 已经存在。

## 3. 工作包（按依赖关系执行）

### P0 — 范围收口和计划基线

- [x] **DS-01**：在仓库中发布本计划，README 明确两个仓库和 `src/`、`example/`、`product/` 的交付边界；所有任务以 UI 组件库为目标。
- [x] **DS-02**：评估并处置现有 PR #26：其 Android 钱包产品运行时审计和 `docs/wallet-security.md` 修改不纳入本计划；根 Native 包的依赖审计可以作为非阻断诊断保留或另起 UI 范围 PR。
- [x] **DS-03**：把 Issue #21/#22 与设计系统阶段一交付脱钩，保留原始安全和真机验收记录，不谎称已完成，不删除历史代码。

**验收**：README 与本计划引用同一范围；没有因本计划合并新的钱包功能；UI 主线 PR 的检查不以钱包资金或 Mainnet 决策为条件。

### P1 — Token 与跨平台视觉语义

- [x] **DS-04**：验证 Web Token → Native 生成文件一致；确认所有 Native 主题色、维度及语义角色可溯源，并记录必要的平台覆盖理由。
- [x] **DS-05**：为 Native Light/Dark 的代表性文本、按钮、状态组合加入可复现的颜色对比度检查；明确 WCAG AA 文本 4.5:1 和重要非文本边界 3:1 的目标，例外需有审查记录。
- [x] **DS-06**：检查基础组件中绕过 Token 的重复布局常量和主题硬编码；只修复影响规范一致性的点，不改动 Web 1.0.0 冻结视觉值。

**验收**：`npm run test:source-contract` 与 Native CI 通过；对比度检查输出明确的通过/失败及语义组合；未经批准不修改品牌色和原有 Web Token。

### P1 — 现有 15 个 Native 组件的质量

- [x] **DS-07**：补齐全部 15 个组件的最基本直接渲染测试。当前 `test/components.test.tsx` 没有直接测试 `Divider` 和 `StateView`；优先补足，再覆盖适用的状态、无障碍属性及回调。
- [x] **DS-08**：扩展 `example/`，让所有 15 个已导出组件都有可见、可操作或可检查的示例；补齐目前未展示的 `Header`、`IconButton`、`Divider`、`Skeleton`。
- [x] **DS-09**：完成窄屏 320dp、常见尺寸、Light/Dark、英文/简体中文长文案及较大字体的 UI 回归；PR #39 提供四组真实截图，PR #35 提供英文长文案与组件区，PR #42 的模拟器验收已确认 Android Back 关闭弹窗、键盘打开后按钮可见且可点击。以上仅为中性 Preview 的工程范围；焦点顺序/TalkBack 与设计基准批准不在这项结果中。

**验收**：导出组件清单、渲染测试矩阵和 Preview 清单一一对应；CI、Android Preview 与受影响的模拟器验收通过；无新增业务依赖。

### P1 — 视觉证据与回归

- [x] **DS-10**：将现有 Preview 截图、设备元数据和 UI hierarchy 作为可重复验证证据，建立组件状态/主题/宽度清单；记录截图对应 commit。
- [ ] **DS-11**：在可靠的固定环境中先审定视觉基线，再评估是否加入自动像素差异比对；若波动或误报不可控，保留人工批准机制，不制造虚假的绿色视觉验收。审批材料见 [Native 视觉基准审核单](native-visual-baseline-review.md)，未签核前保持未完成。

**验收**：主要组件、主题和布局状态有可追溯的验收记录；不把模拟器截图等同于真实设备无障碍验收。

### P2 — 集成和交付收尾

- [x] **DS-12**：写明 Native 包在未公开发布时的版本固定与安装方式（例如 Git commit/本地 `npm pack`），用独立预览宿主验证消费方确实能引用构建产物和类型声明。
- [x] **DS-13**：为 Web Token 变更制定明确的 Native 下游验证入口；先复用现有 `test:source-contract`，有实际维护需求时再增加定时/跨仓库触发。
- [x] **DS-14**：核对 README、组件清单、变更记录和版本契约，给出阶段一**工程交接状态报告**；明确未完成的模拟器矩阵和正式视觉/无障碍验收，不把其标成已完成。

**验收**：新消费方有可执行的安装步骤；可复现 `npm test`、Token 同步检查和 `npm run build`；说明不包含的产品功能。

> 进度记录（2026-10-09）：DS-01/02/03 已通过 PR #26/#27 和 Issue #21/#22 的范围说明完成；DS-04 的 Web→Native 完整映射检查及 DS-05 的可复现对比度**审计能力**已通过 PR #30，DS-06 的布局 Token 规范化已通过 PR #32，三项均在最新 SHA 的 CI、Android Preview 与模拟器验收成功后合并。**DS-05 勾选代表测量和记录已完成，不代表按钮、状态字色与边框的所有组合均满足 WCAG；设计修正尚未获得批准。** DS-07/08 的 15 个组件测试和 Preview 已由 PR #29 合并；DS-12/13 的固定提交打包安装指南和手动 Token 校验由 PR #31 合并。DS-10 已建立 [模拟器证据与验收矩阵](native-visual-evidence.md)，；DS-09 的限定工程验收已通过，DS-11 的正式视觉基准仍未批准。DS-14 的[工程交接状态报告](ui-library-phase-one-status.md)与仓库[内部变更记录](../CHANGELOG.md)已交付；原配色已按用户决定保持，正式视觉基准及 WCAG 符合性**尚未获得批准**。DS-09/11 继续由 [Issue #37](https://github.com/Pixman022/fresnica-ui-native/issues/37) 跟踪，PR #35 提供实测 393dp 英文浅色首屏和下方组件区证据；PR #39 的四组按需模拟器矩阵已全部通过并核对截图，PR #40 已加强 Modal 返回与滚动键盘配置的组件单测。PR #42 补齐模拟器级弹窗/键盘点击证据，仍缺焦点无障碍专门验收和设计基准审批。

已按用户决定维持原品牌绿和白色按钮文字，不调整 Web/Native 共享 Token。对比度不足与历史候选色值只作为[设计记录](native-primary-button-color-review.md)，不是本轮视觉变更授权。

## 4. 当前组件映射与扩展门槛

已交付的共享原生组件为：`Button`、`Field`、`StateView`、`Screen`、`Header`、`ListRow`、`Modal`、`Typography`、`IconButton`、`Divider`、`StatusBadge`、`InlineMessage`、`Skeleton`、`Progress`、`SegmentedControl`。

`SearchField`、`SecureField`、`Toast/Announcement`、`BottomSheet/ActionSheet` 只在真实复用需求、宿主职责及无障碍行为明确后立项。助记词、交易审核、钱包账户行、扫码等保持 Feature-local；`Table`、`Pagination`、日期/时间控件等 Web 专属组件不列入第一阶段 Native 数量目标。

## 5. 变更流程和风险约束

1. 所有更改先进入现有 `Pixman022` 仓库的专题分支和 PR；不直接绕过受保护的 Native `main`。
2. 小步推进：完成一个有定义的任务包 → 检查格式、测试与受影响 Android 工作流 → 才申请或执行合并。
3. 在 PR 描述注明受影响的任务编号、实际验证及未验证事项。对视觉偏差和组件公共 API 变更保留差异说明。
4. 不自动运行 `npm audit fix --force`，不因为非阻断依赖告警误称安全无风险。
5. 不操作 `luneShaoGM`、不新建仓库、不删除现有钱包原型、不修改分支保护策略、不使用真实钱包私钥或进行链上资金操作。

## 6. 第一阶段完成定义（DoD）

- [x] 范围、许可证、组件职责和跨仓库 Token 所有权一致，README 与计划不矛盾。
- [x] Native 15 个共享组件均有基本直接渲染测试和 Preview 示例，重要状态可检查。
- [x] Web/Native 生成 Token 一致，代表性主题角色的可读性有可复现的验证记录（包含不达标的真实比率）。
- [x] 已合并的组件变更具备成功的 Native CI、Android Preview 和模拟器证据，且可追溯到测试提交。
- [x] 已描述固定版本的消费方接入方式，产物、类型定义和主题/国际化契约可被独立宿主使用。
- [x] 工程交接报告明确列出真机、iOS、业务钱包、Mainnet 与正式视觉无障碍审查尚未完成。
- [x] **DS-09**：四组多尺寸/主题矩阵和英文长文案均有经审阅的截图；模拟器弹窗 Back、软键盘避让及按钮实际点击均有成功工件。真实 TalkBack/焦点顺序仍未批准。
- [ ] **DS-11**：设计负责人批准稳定、可复现的视觉基准；不使用未经审核的像素差异阈值。

> 前六项代表**工程交付与可试集成能力**，不代表全部视觉或 WCAG AA 验收。阶段一的最终视觉签核仍取决于 DS-11；在保持原配色的前提下，现有白字对比度不足必须持续作为明确限制。

## 7. 参考依据

- 用户《评估结果.md》，Web 基线 `74220ac`：许可、平台 Token、国际化、组件缺口、工程与视觉验收评估。
- [Web 平台适配路线](https://github.com/Pixman022/fresnica-ui/blob/main/docs/design-system/platform-adaptation-roadmap.md)。
- [原生组件映射](component-migration.md)、[原生组件契约](component-contracts.md)、[Token 映射](token-mapping.md)。
- [Android Preview 验收](android-emulator-acceptance.md)和[集成指南](integration-guide.md)。

> 这是工程执行清单；阶段与风险不等于承诺发布日期。任务状态只在 GitHub 上有对应代码、文档或 CI 证据后更新。
