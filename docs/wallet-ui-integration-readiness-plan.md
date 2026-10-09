# Fresnica 钱包 UI 集成准备工作计划

> 状态：本阶段完成 · 2026-10-09  
> 范围：仅 `Pixman022/fresnica-ui` 与 `Pixman022/fresnica-ui-native` 的设计系统 / UI 集成准备。  
> 不包含钱包密钥、签名、链上交易、Mainnet 启用或产品安全实现。

## 1. 已确认决策

1. **不需要图片取色主题。** 当前主题能力固定为 Light / Dark / System，不为图片提色、Android 动态色或自动生成 secondary palette 增加工作。
2. **不按组件数量扩容。** 现有 15 个 Native primitive 作为未来钱包的起始共享层；只有真实页面证明同一交互在至少两个 Feature 稳定复用时，才考虑新增共享组件。
3. **真机无障碍是首个钱包 App 集成完成前的硬门槛。** 组件库阶段不重新打开已经完成的 DS-01～DS-14；真实产品集成后再执行 TalkBack、焦点、键盘、安全区、字体缩放等人工验收。
4. **Modal 减少动画维持现状。** 已按项目所有者选择 A 暂缓改变共享 Modal 动画；这不是 reduced-motion 合规通过。

## 2. 本阶段目标

回答两个问题：

- 当前 15 个 Native primitive 是否足以启动钱包 UI 开发？
- 哪些能力应该保持 Feature-local，哪些缺口真正值得升级为共享组件？

本阶段**不以新增组件为成功标准**。如果覆盖矩阵证明现有基础层足够，则“零新增组件”是可接受的正确结果。

## 3. 工作包

### IR-01 — 建立真实页面组件覆盖矩阵

以 Web 仓库现有钱包示例作为当前可核对证据：

- Wallet Home
- Transfer / Send
- Activity
- Settings
- Swap

逐项把页面 UI 映射为：

- **Direct**：现有 Native primitive 可直接承担；
- **Compose**：用现有 primitive + React Native 基础 View/Text 组合；
- **Feature-local**：包含钱包领域语义，不应进入共享 UI；
- **Candidate**：发现跨 Feature 稳定复用证据后才可立项。

当前 Web 示例没有 Import / Unlock 页面，因此不把其需求假定为已知。未来产品出现该流程时，优先验证现有 `Field.secureTextEntry` 和 App-shell 安全策略是否够用，再决定是否需要 `SecureField`。

**验收：** 覆盖矩阵引用当前 Web 示例和 Native 组件契约；不凭空增加产品需求。

### IR-02 — 给出“15 个组件是否够用”的结论

判定规则：

1. 五个代表页面都能由 Direct / Compose / Feature-local 覆盖；
2. 不存在至少两个 Feature 都必须复制同一复杂交互、且现有 primitive 无法合理承载的缺口；
3. 缺失项若属于钱包领域语义，默认 Feature-local；
4. 只有公共 API 不含钱包业务名词、交互跨 Feature 一致、无障碍契约可稳定定义时，才升级为 Candidate。

**验收：** 明确输出“足够启动 / 不足”，并列出证据，不用主观组件数量判断。

### IR-03 — 冻结首个钱包集成的无障碍门槛

分三层：

- **组件库门槛（当前）：** 组件 role/state/label、44dp 触控目标、320dp、长文案、主题和自动化测试。
- **首个钱包集成硬门槛：** Android 真机 TalkBack 阅读/焦点顺序、Modal 关闭焦点恢复、真实软键盘避让、系统 Back、安全区/系统栏、至少 1.3× 字体、触控目标、中英文长文案。
- **正式发布门槛：** 多设备/系统版本、完整 reduced-motion 复核、最终颜色对比审查；iOS 开发启动后再增加 VoiceOver / iPhone 真机门槛。

**验收：** 不把模拟器证据冒充真机验收；首个钱包 UI 集成不得在第二层未完成时标记为“集成完成”。

### IR-04 — 同步规范

- 把“图片取色主题”从未来待办改为当前明确不需要；
- 在集成文档中记录上述硬门槛；
- 保持现有品牌配色和 Modal 决策不变。

## 4. 明确不做

- 不新增钱包业务代码；
- 不实现图片取色主题；
- 不为了凑数量实现 SearchField / SecureField / Toast / BottomSheet；
- 不全量移植 Web 48 个组件；
- 不公开发布 npm 作为本阶段门槛；
- 不操作其他 GitHub 所有者仓库。

## 5. 完成定义

- [x] 真实页面组件覆盖矩阵完成；
- [x] 现有 15 个 primitive 是否够用有明确结论；
- [x] 新组件候选有可验证的立项门槛，没有无证据立项；
- [x] 首个钱包 App 真机无障碍硬门槛被文档化；
- [x] 图片取色主题从当前路线中移除；
- [x] 文档变更通过现有 CI 并合并。


## 6. 完成记录

- Native 覆盖矩阵、集成门槛与迁移结论：PR #55，合并提交 `ee62fc77b88701f9f2aa2e12ee0c75bf1e6a5765`。
- Web 移动端基线同步：`Pixman022/fresnica-ui` PR #1，合并提交 `aa9670abbfd0c648d7f615a9033c2c5c7c582be0`。
- 当前结论：15 个 Native primitive 足以启动钱包 UI 集成；本阶段不新增 SearchField、SecureField、Toast/Announcement、BottomSheet/ActionSheet 或 Generic Card。
- Import / Unlock 尚无当前 Web 示例，因此保持“未来真实产品出现后再评估”；不将其标记为已验收。
- 真机无障碍不是当前组件库返工项，但在首个真实钱包 App 标记 UI 集成完成前必须执行规定的 Android 真机门槛。
