# Fresnica 钱包 UI 组件覆盖矩阵

> 基线：2026-10-09。  
> 用途：判断现有 15 个 `@fresnica/ui-native` primitive 是否足以启动未来钱包 UI 集成。  
> 证据来源：当前 Web 钱包示例与 Native 组件契约。此文档不把未出现的产品页面当作既定需求。

## 1. 当前共享 Primitive

`Button`、`Field`、`StateView`、`Screen`、`Header`、`ListRow`、`Modal`、`Typography`、`IconButton`、`Divider`、`StatusBadge`、`InlineMessage`、`Skeleton`、`Progress`、`SegmentedControl`。

分类：

- **Direct**：现有组件直接承担。
- **Compose**：现有组件 + React Native 基础布局组合。
- **Feature-local**：钱包领域组件，保留在 Feature。
- **Candidate**：需要更多真实复用证据后再决定。

## 2. 页面覆盖

### Wallet Home

当前 Web 示例包含：品牌/网络区、钱包摘要、复制地址、Send/Swap/Receive 快捷操作、资产列表、资产搜索入口和底部产品导航。

| UI                 | 建议映射                                             | 分类              | 结论                               |
| ------------------ | ---------------------------------------------------- | ----------------- | ---------------------------------- |
| 页面容器/标题/文案 | `Screen` + `Typography`                              | Direct            | 已覆盖                             |
| 快捷操作           | `Button` / `IconButton`                              | Direct/Compose    | 已覆盖                             |
| 复制地址           | `Typography` + `IconButton`                          | Compose           | 已覆盖                             |
| 网络状态/标签      | `StatusBadge` + Feature 状态                         | Compose           | 已覆盖                             |
| 钱包摘要卡         | token + `View` + `Typography`                        | Feature-local     | 钱包语义，不建立共享 Card 也可实现 |
| Asset row          | `ListRow` 作为布局基础，资产图标/余额为 Feature 内容 | Feature-local     | 不升为通用 AssetRow                |
| 资产搜索入口       | `Button` / `IconButton`                              | Direct            | 当前不是 inline search field       |
| 底部导航           | App shell navigation                                 | Feature/App-shell | 不属于组件包                       |

**共享缺口：无。**

### Transfer / Send

当前 Web 示例包含：返回/标题/网络状态、来源地址、资产选择、金额输入、余额/法币提示、Back / Next。

| UI           | 建议映射                                       | 分类                  | 结论                               |
| ------------ | ---------------------------------------------- | --------------------- | ---------------------------------- |
| 顶栏         | `Header`                                       | Direct                | 已覆盖                             |
| 来源地址显示 | `Typography` + Feature wrapper                 | Compose               | 地址格式属于钱包领域               |
| 资产选择     | `ListRow` + Feature asset content              | Feature-local         | 不升为通用钱包组件                 |
| 金额输入     | `Field` + Feature amount formatting/max action | Compose/Feature-local | 基础输入已覆盖，货币语义留 Feature |
| 错误/说明    | `InlineMessage` / `Field.supportingText`       | Direct                | 已覆盖                             |
| Back / Next  | `Button`                                       | Direct                | 已覆盖                             |

**共享缺口：无。** 现有 `Field` 不需要为了金额业务增加钱包专属 props。

### Activity

当前 Web 示例包含：标题、Filter、搜索、按日期分组的交易列表、方向/金额状态。

| UI           | 建议映射                                | 分类          | 结论                                                    |
| ------------ | --------------------------------------- | ------------- | ------------------------------------------------------- |
| 标题/Filter  | `Header` + `IconButton`                 | Direct        | 已覆盖                                                  |
| 搜索         | `Field` + leading search icon           | Compose       | 现有 Field 已支持 `leading`                             |
| Clear action | Feature-local wrapper                   | Compose       | 只有一个明确 inline search 场景，不足以立项 SearchField |
| 交易行       | `ListRow` + Feature transaction content | Feature-local | 交易状态/资产属于领域语义                               |
| 空/错误状态  | `StateView`                             | Direct        | 已覆盖                                                  |

**SearchField 判定：暂不立项。** Home 当前只是搜索入口按钮；Activity 才是明确 inline search，两者交互并不相同，尚未满足“至少两个 Feature 同一搜索语义”的门槛。

### Settings

当前 Web 示例包含：Accounts、Address book、General、Advanced、Security、Support、Terms、About 等设置行和分组。

| UI                    | 建议映射                               | 分类    | 结论         |
| --------------------- | -------------------------------------- | ------- | ------------ |
| 页面标题              | `Header` / `Typography`                | Direct  | 已覆盖       |
| 设置项                | `ListRow`                              | Direct  | 已覆盖       |
| 分组分隔              | `Divider`                              | Direct  | 已覆盖       |
| 主题/语言切换（未来） | `SegmentedControl`                     | Direct  | 已覆盖       |
| 二级设置页面          | App shell navigation + 同一 primitives | Compose | 无新共享组件 |

**共享缺口：无。**

### Swap

当前 Web 示例包含：返回/标题、From/To 资产选择、金额输入、反转、汇率/费用详情、Review Swap。

| UI            | 建议映射                          | 分类                  | 结论                   |
| ------------- | --------------------------------- | --------------------- | ---------------------- |
| 顶栏          | `Header`                          | Direct                | 已覆盖                 |
| From/To 输入  | `Field` + Feature amount panel    | Compose/Feature-local | 业务格式留 Feature     |
| 资产选择      | `ListRow` / Feature selector      | Feature-local         | 不引入钱包业务到共享层 |
| Switch        | `Button` / `IconButton`           | Direct                | 已覆盖                 |
| 汇率/费用详情 | `Typography` + `Divider` + `View` | Compose               | 已覆盖                 |
| Review        | `Button`                          | Direct                | 已覆盖                 |

**共享缺口：无。**

## 3. Import / Unlock

当前 Web 钱包示例路由中没有 Import / Unlock 页面，因此本矩阵**不声称已经验证该流程**。

现有 Native `Field` 已具备：

- `secureTextEntry`
- `autoCapitalize`
- `autoCorrect`
- error/supporting copy
- accessibility label/hint

所以未来出现 PIN、密码或其他敏感输入时，应先使用现有 `Field` + App-shell 的 autofill、截图、剪贴板、生命周期和安全策略完成真实集成验证。

只有当两个以上安全流程需要相同且无法由 `Field` + Feature wrapper 稳定实现的行为时，才立项 `SecureField`。

## 4. 当前候选组件判定

| Candidate                   | 当前结论 | 原因                                                                    |
| --------------------------- | -------- | ----------------------------------------------------------------------- |
| `SearchField`               | 不立项   | 仅 Activity 有明确 inline search；Home 是搜索入口，语义不同             |
| `SecureField`               | 不立项   | 现有 Field 已有 secureTextEntry；尚无真实 Import/Unlock UI 证据         |
| `Toast / Announcement`      | 不立项   | 当前示例没有证明跨 Feature 统一时序/队列需求                            |
| `BottomSheet / ActionSheet` | 不立项   | 当前代表页面可由现有布局/Modal/导航完成；未证明同一原生手势模式重复出现 |
| Generic `Card`              | 不立项   | 当前卡片/面板可用 token + View 组合；没有共享行为或语义需要封装         |

## 5. 结论

**现有 15 个 Native primitive 足以启动 Fresnica 钱包 UI 开发。**

这个结论的含义是：

- 五个当前可核对的代表页面没有发现必须新增共享 primitive 才能实现的阻塞；
- 钱包 Asset/Transaction/Amount/Network 等领域组件应保持 Feature-local；
- 未来缺口由真实页面驱动，不提前建立第二套组件系统。

这不代表完整钱包已经实现，也不代表 Import/Unlock、真机无障碍或产品安全已经验收。

## 6. 下一次重新评估触发条件

出现以下任一情况时重新评估共享组件：

1. 两个以上 Feature 复制相同复杂交互；
2. Feature wrapper 为适配同一交互出现明显 API 分叉；
3. 无障碍行为必须集中实现才能保证一致；
4. token + View 组合开始产生重复且易漂移的视觉/行为规范；
5. 首个真实钱包集成暴露现有 primitive 无法合理表达的通用能力。
