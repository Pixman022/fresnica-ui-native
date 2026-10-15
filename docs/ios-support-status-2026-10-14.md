# iOS Support Work Status — 2026-10-14

This record tracks the current state of the iOS component/design-system support plan after the
first successful Simulator runtime smoke. It intentionally keeps build, runtime, visual review and
physical-device acceptance as separate conclusions.

## Current repository heads

- Native main: `079f892159ae72baeb746c3353709f09c1f097d7`
  (`fix: make iOS Preview launch state deterministic (#89)`)
- Web main: `913d991df3bbe67f80a31fd18ef648dafb018190`
  (`docs: add iOS component specifications draft (#31)`)

## Task status

- **IOS01 — Complete.** Native iOS support baseline, Xcode 16.4 / iOS 18.5 Simulator
  baseline and Web platform baseline links are merged. Keep runtime coverage truthful when
  the toolchain changes.
- **IOS02 — Complete.** Web iOS guidelines and Native component/platform rule priority are
  merged. Maintain consistency when later iOS decisions change.
- **IOS03 — In progress.** S03/S04 top-frame evidence is now valid and reviewed. No obvious
  top-frame clipping/overlap was found in the corrected captures, but lower Header/Button/ListRow,
  Modal and action reachability are not yet covered. The candidate iOS typography mapping remains
  unapproved and production typography values remain unchanged.
- **IOS04 — In progress.** iOS component usage rules, Header heading semantics and iOS Field
  input examples are merged. Next: recheck IOS03-dependent layouts and fix only defects
  reproduced by Simulator evidence.
- **IOS05 — In progress.** S01-S06 runtime matrix is merged; automated iPhone 16 / iOS 18.5
  Release install+launch smoke passes. Corrected S03/S04 probes now exercise their exact
  locale/scenario/text-size/appearance launch state. Their current screenshots cover only the
  initial viewport, so lower-page layout and reachability remain open.
- **IOS06 — In progress.** English/Chinese specifications for all 15 components are merged as
  an explicit draft. Final typography values and verified Native evidence are still required
  before the draft wording is removed.
- **IOS07 — In progress.** A repeatable CI build/install/launch/screenshot gate exists and
  retains runtime evidence. PR #90 now requires visible Preview state to agree with scenario
  metadata; mismatched captures are invalid. Durable reference images, complete review records
  and any future required-check decision remain open.
- **IOS08 — Not started.** Final candidate handoff, consumer-document synchronization and the
  final limitation statement wait for IOS03-IOS07.

## First successful iOS runtime smoke

Latest verified PR-head run:

- PR: Native #79
- PR head: `f2c546d966e98141ced58a0135cfcbb2b38811dd`
- merged main commit: `7c2139d1828f786f53959cd1ef1cee3909c66a77`
- workflow run: `38535492749`
- workflow conclusion: success
- device: iPhone 16
- runtime: iOS 18.5
- configuration: Release
- bundle id: `org.reactjs.native.example.FresnicaPreview`
- package: `@fresnica/ui-native@1.1.0-rc.1`
- Xcode: 16.4 (16F6)
- Node: 22.13.0
- workflow `GITHUB_SHA` recorded inside the PR run: `07065af52331d3ff0743af9dd38f9f3be7669e51`
  (the pull-request workflow merge SHA, not the PR head)
- runtime artifact: `ios-preview-runtime-evidence`
- artifact id: `11880232457`
- artifact size: 176,865 bytes
- artifact digest:
  `sha256:9ac36d5ba5456a03b95047c328e74603fa5dbc6c14255b8cf6bac059253041ac`

The retained artifact contains:

- `metadata.json`
- `launch.png`

The launch screenshot shows the neutral Preview running at 393 × 852 dp, fontScale 1.00, Light
appearance. The visible frame includes the Preview heading, environment controls, Field examples,
status/list content and InlineMessage without an obvious default-text clipping/overlap failure.

This is a **runtime smoke result**, not a final visual approval. It does not prove large Dynamic Type
categories, Dark mode, Simplified Chinese, keyboard-constrained height, Modal interaction or all
S01-S06 scenarios.

## Corrected S03 / S04 typography evidence

The first PR #88 S03 capture is invalid because its metadata said `zh-CN + stress` while the
visible Preview remained English + Standard. PR #89 fixed the launch-state mechanism and PR #90
made this mismatch an explicit evidence-integrity failure.

Latest valid PR-head run:

- PR: Native #89
- PR head: `0e36210914c0e2e826d2f58187bb2880c3c05143`
- merged main commit: `079f892159ae72baeb746c3353709f09c1f097d7`
- workflow run: `38664206311`
- workflow conclusion: success
- S03 artifact id: `11940484492`
- S03 digest: `sha256:90b8cd97d3b993cae990f2e56104599bab831beba3206f248b39255e251a02d5`
- S04 artifact id: `11940726998`
- S04 digest: `sha256:3178643961a0f975be045b42b2c7cb1988986bfb91d34e1146c19ee156a60f54`

S03 visibly matches Simplified Chinese + stress + Dark at the maximum standard text category.
S04 visibly matches English + standard + Light at the maximum accessibility text category.
The visible top frames show wrapping without an obvious horizontal-overflow or overlap failure.

These captures are not full-scenario visual approvals: they do not yet show the lower Header,
long Button group, later ListRows, StateView, Modal or keyboard-constrained content. Those areas
remain pending evidence.

## Current merged iOS implementation/documentation slices

Native:

- #79 — automated iOS Preview runtime smoke and compact runtime artifact
- #81 — iOS component usage rules / platform-neutral device acceptance wording
- #82 — Header title heading semantics and regression
- #83 — Header heading contract synchronization
- #84 — iOS Field input examples
- #85 — concrete S01-S06 iOS Preview runtime matrix
- #87 — iOS typography Simulator probe
- #88 — exact S03/S04 probe state definitions
- #89 — deterministic generated-host launch state
- #90 — iOS evidence-integrity rule

Web:

- #30 — iOS design-system guideline entry points
- #31 — English/Chinese 15-component iOS specification draft

## Deferred / excluded

The following remain intentionally outside the active completion claim:

- color/contrast changes, including Increase Contrast palette work;
- physical-device acceptance;
- VoiceOver speech/gesture/focus execution;
- real-device keyboard/autofill validation;
- wallet product flows, keys, transactions, navigation/product adapters and historical product
  prototype work;
- iPad support commitment;
- a SwiftUI/UIKit component SDK;
- new shared components without a proven stable reuse need.

The existing Native Modal `fade` behavior remains unchanged.

## Next executable sequence

1. Capture lower-page S03/S04 evidence for Header, long Buttons, later ListRows, StateView and
   Modal/reachability risks without changing production typography.
2. Use complete larger-text evidence to approve, reject or narrow the IOS03 typography mapping,
   and fix only reproduced layout defects.
3. Re-run affected IOS05 scenarios after each typography/layout change.
4. Finalize IOS06 component specs from the verified Native implementation.
5. Close IOS07 durable visual/reference evidence and regression-gate documentation.
6. Complete IOS08 candidate handoff and cross-repository status synchronization.
