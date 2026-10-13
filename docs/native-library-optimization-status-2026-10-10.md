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

- **NU01 · P1 · Complete** — Public API, precedence and migration rules. Evidence: `docs/public-api-contract.md`, PR #58.
- **NU02 · P1 · Complete** — Field native props + interaction refs/test IDs. Evidence: PR #59.
- **NU03 · P1 · Complete** — Provider, theme hooks and enUS/zhCN locale. Evidence: PR #61 / `251ab13dacd3c19850e3c98663b9757623a11b84`.
- **NU04 · P1 · Complete** — Button variants, pressed and loading states. Evidence: PR #63 / `f594ffe2110a235964f9be7edc3a1ebdc7bc8de7`.
- **NU05 · P1 · Complete** — Modal focus, announcement and ListRow contracts. Evidence: PR #64 / `fca18a70f28bf2efaadbe3a4fe7a23e9fd04195a`.
- **NU06 · P1 · Complete** — Fixed cross-repository Token source. Evidence: PR #62 / `7b4988d683bd79789b9ec2fca72725c51803ad5b`.
- **NU07 · P1 · Complete** — Neutral Preview and package regression verification. Evidence: PR #65 / `764566d8912474f2e8890c7a0157f491652431c1`.
- **NU08 · P2 · Complete** — Delivery/version/document synchronization. Evidence: PR #66.

NU01 is delivered by PR #58. NU02 is delivered by PR #59, merged as
`872a6e8f7387e3a2f303ef3f911fb5e1e8ed35ea`; CI run `38052061625` passed after the
final accessibility-role boundary fix.

## Conditional items

G01 contrast changes, G02 physical-device accessibility, G03 iOS support and G04 system
reduced-motion remain conditional/deferred exactly as recorded in the source plan. They are
not converted into current engineering blockers.

## Scope guard

Only `Pixman022/fresnica-ui-native` and, where NU06 requires it, `Pixman022/fresnica-ui`
may be changed. Wallet product logic, keys, transactions, Realm, Stellar SDK, product
navigation, historical `product/`, image-derived theming and a new mobile repository remain
out of scope.

## NU08 delivery candidate evidence

- Version: `1.1.0-rc.1`
- Archive: `fresnica-ui-native-1.1.0-rc.1.tgz`
- SHA-256: `54913d4c4466d3cd5744b41d878a3af54344728bda30dc3592ccef2c07fd834f`
- Package-bearing Native SHA: `7182872be5c1557bc332d270bf3a5e7cec48c409`
- Locked Web Token SHA: `15d49e0be28a232ae6de2a7285a3a77add8c87d4`
- Candidate CI: run `38197192843` — success

NU08 is complete after PR #66 merged the verified internal integration candidate.

## Post-completion maintenance

After NU01–NU08 were completed, two documentation-only consistency fixes were merged without
reopening the optimization scope:

- PR #68 synchronized `docs/consumer-handoff.md` with the verified `1.1.0-rc.1` candidate
  and removed stale wording that implied remaining UI-only engineering work.
- PR #69 synchronized the physical-device acceptance guide with the disabled Field demo
  already present in the neutral Preview. The device result remains untested until an actual
  operator/device run; this correction does not claim TalkBack acceptance.

Protected `main` CI passed after both maintenance merges. Open Issue #49 remains the deferred
physical-device integration gate and does not block the component library's Complete / Maintenance
status.


## Engineering maintenance update — 2026-10-13

M01 of the engineering maintenance plan is complete in Native:

- PR #71 / `48fd6e165ac2b8ec2a652d094b9288e258440faa` made the production dependency audit blocking while keeping the full development audit report-only.
- Main CI `38359310945` succeeded with **0 production vulnerabilities** and passed standalone tests, fixed Web Token-source verification, build, packed-package verification and internal delivery-candidate creation.
- Temporary PR #72 intentionally forced the production audit command to return exit code 1 by targeting a nonexistent workspace. The required `test` job failed at that audit command; the PR was closed without merge.
- Active ruleset `Protect main` (ID `24701211`) requires the `test` status check, so a failed production audit prevents the required Native check from passing.
- The locked Web Token blobs remain `9c4bbc478618d5a5ef5d1ecdd11d41ee8afdeb5c` and `6ee1c1da3a3be52e84bc8247e13bb577fdbb4cc6`; no Token lock advance is required.

C01 physical-device accessibility remains deferred in Issue #49, and the approved contrast/color decision remains unchanged.
