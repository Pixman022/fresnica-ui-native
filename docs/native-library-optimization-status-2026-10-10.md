# Native Component Library Optimization Status — 2026-10-10

Source plan: `Fresnica Native 组件库优化工作计划` dated 2026-10-10.

## Baseline recheck

Implementation started by rechecking repository state as required by the plan.

| Item              | Rechecked value                            | Result                                    |
| ----------------- | ------------------------------------------ | ----------------------------------------- |
| Native main       | `dfe7f8c2c44d9d4a066644dcc3a0c28a5d752f6c` | Matches plan baseline                     |
| Native open PRs   | 0                                          | No conflicting work                       |
| Web main          | `15d49e0be28a232ae6de2a7285a3a77add8c87d4` | Advanced by one documentation-only commit |
| Plan Web baseline | `409e79930c190e718a324fd438336dcc63a3d3dc` | Superseded for future evidence            |
| Web delta         | project-status documentation only          | No Token-source change                    |

NU06 must pin the actual approved Web Token-source revision when it is implemented rather
than copying the older plan SHA.

## Engineering tasks

| Task                                                     | Priority | Status      | Evidence                                  |
| -------------------------------------------------------- | -------- | ----------- | ----------------------------------------- |
| NU01 Public API, precedence and migration rules          | P1       | Complete    | `docs/public-api-contract.md`             |
| NU02 Field native props + interaction refs/test IDs      | P1       | In progress | `Field` / `Button` / `IconButton` + tests |
| NU03 Provider, theme hooks and enUS/zhCN locale          | P1       | Pending     | —                                         |
| NU04 Button variants/pressed/loading states              | P1       | Pending     | —                                         |
| NU05 Modal focus, announcement and ListRow contracts     | P1       | Pending     | —                                         |
| NU06 Fixed cross-repository Token source                 | P1       | Pending     | —                                         |
| NU07 Neutral Preview and package regression verification | P1       | Pending     | —                                         |
| NU08 Delivery/version/document synchronization           | P2       | Pending     | —                                         |

NU01 is delivered by PR #58 after the public contract and baseline recheck pass the repository quality gates.

## Conditional items

G01 contrast changes, G02 physical-device accessibility, G03 iOS support and G04 system
reduced-motion remain conditional/deferred exactly as recorded in the source plan. They are
not converted into current engineering blockers.

## Scope guard

Only `Pixman022/fresnica-ui-native` and, where NU06 requires it, `Pixman022/fresnica-ui`
may be changed. Wallet product logic, keys, transactions, Realm, Stellar SDK, product
navigation, historical `product/`, image-derived theming and a new mobile repository remain
out of scope.
