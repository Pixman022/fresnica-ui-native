# iOS Support Work Status — 2026-10-14

This record tracks the current state of the iOS component/design-system support plan after the
first successful Simulator runtime smoke. It intentionally keeps build, runtime, visual review and
physical-device acceptance as separate conclusions.

## Current repository heads

- Native main snapshot before this status update: `c23b8ed6c0aee10b93e7d70ce44b6483cc83256a`
  (`docs: sync iOS large-text fix status (#95)`)
- Web main: `3f79aff9f1183e1cb3dd6f11dcbbbe98cc23c0e7`
  (`docs: sync iOS large-text component specs (#32)`)

## Task status

- **IOS01 — Complete.** Native iOS support baseline, Xcode 16.4 / iOS 18.5 Simulator
  baseline and Web platform baseline links are merged. Keep runtime coverage truthful when
  the toolchain changes.
- **IOS02 — Complete.** Web iOS guidelines and Native component/platform rule priority are
  merged. Maintain consistency when later iOS decisions change.
- **IOS03 — In progress.** Corrected S03/S04 top-frame and targeted detail evidence are available.
  S03 maximum-standard text remains acceptable in the reviewed action slice. S04 maximum
  accessibility text reproduced Header truncation and ListRow trailing-content squeeze; #94 fixes
  those two layout defects without changing base typography values. Post-fix S04 action/content
  screenshots are now reviewed and confirm the Header title can grow without ellipsis and the
  ListRow trailing badge no longer squeezes the copy column. S03 retains the original layout at
  ~1.35 fontScale. Modal/keyboard reachability and the final typography mapping remain open.
- **IOS04 — In progress.** iOS component usage rules, Header heading semantics and iOS Field
  input examples are merged. #94 lets Header titles grow and stacks ListRow trailing content
  below the copy on iOS accessibility text sizes (fontScale >= 1.5), matching reproduced S04
  failures. The post-fix S04 screenshots visually confirm both targeted fixes; S03 shows no
  regression in the maximum-standard action slice. Remaining changes continue to require
  Simulator reproduction.
- **IOS05 — In progress.** S01-S06 runtime matrix is merged; automated iPhone 16 / iOS 18.5
  Release install+launch smoke passes. #92 adds focused S03/S04 action/content evidence views,
  and #94 re-ran package/build/Android acceptance plus the detail captures successfully. The
  post-fix S03/S04 screenshots are reviewed. PR #96 is now collecting S05 Modal and S06
  keyboard-constrained evidence; those two reachability checks remain open until their screenshots
  are reviewed.
- **IOS06 — In progress.** English/Chinese specifications for all 15 components are merged as
  an explicit draft, and Web #32 synchronizes the verified Header/ListRow accessibility-text
  behavior. Final typography values and remaining Native evidence are still required before the
  draft wording is removed.
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
- #92 — targeted S03/S04 action/content evidence views
- #94 — iOS accessibility large-text Header/ListRow layout fixes

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

1. Review PR #96 S05 Modal and S06 keyboard-constrained evidence.
2. Fix only defects reproduced by those captures, if any.
3. Approve, reject or narrow the IOS03 typography mapping from the complete larger-text evidence.
4. Finalize IOS06 component specs from the verified Native implementation.
5. Close IOS07 durable visual/reference evidence and regression-gate documentation.
6. Complete IOS08 candidate handoff and cross-repository status synchronization.
