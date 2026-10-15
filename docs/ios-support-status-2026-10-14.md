# iOS Support Work Status — 2026-10-14

This record tracks the current state of the iOS component/design-system support plan after the
first successful Simulator runtime smoke. It intentionally keeps build, runtime, visual review and
physical-device acceptance as separate conclusions.

## Current repository heads

- Native main: `2b2bac959e4b926bf789d5fe88c36077df1f6542`
  (`docs: finalize iOS reachability and typography review (#98)`)
- Web main: `f1b3436f6f19043a4ac0d50e4f954c0f479913f2`
  (`docs: finalize iOS component specifications (#33)`)

## Task status

- **IOS01 — Complete.** Native iOS support baseline, Xcode 16.4 / iOS 18.5 Simulator
  baseline and Web platform baseline links are merged. Keep runtime coverage truthful when
  the toolchain changes.
- **IOS02 — Complete.** Web iOS guidelines and Native component/platform rule priority are
  merged. Maintain consistency when later iOS decisions change.
- **IOS03 — Complete for the current Simulator scope.** Corrected S03/S04 top-frame and targeted
  detail evidence are reviewed. S03 maximum-standard text remains acceptable. S04 reproduced Header
  truncation and ListRow trailing-content squeeze; #94 fixes those layout defects without changing
  base typography values. S05/S06 then confirm Modal content remains reachable at the maximum
  accessibility category and the keyboard-constrained Field/action slice remains usable at ~1.35
  fontScale. No evidence requires the proposed 17/15/17/20/22/34 iOS base-size mapping, so that
  candidate is rejected for this release scope and the current typography values remain unchanged.
- **IOS04 — Complete for the current design-system scope.** iOS component usage rules, Header
  heading semantics and iOS Field input examples are merged. #94 lets Header titles grow and
  stacks ListRow trailing content below the copy on iOS accessibility text sizes
  (`fontScale >= 1.5`), matching the reproduced S04 failures. Post-fix S04 screenshots confirm
  both targeted fixes and S03 shows no regression at maximum-standard text. Future behavior changes
  still require new Simulator reproduction before acceptance.
- **IOS05 — Complete for the current Simulator matrix.** S01-S06 runtime coverage is merged and the
  automated iPhone 16 / iOS 18.5 Release install+launch smoke passes. #92/#94 cover the corrected
  S03/S04 large-text detail slices. #96 adds S05 Modal and S06 keyboard-constrained evidence.
  S05 is visually acceptable at the maximum accessibility category. The first S06 artifact was
  invalid because the iOS keyboard tutorial obscured the software keyboard; #96 now suppresses that
  first-run tutorial in Simulator evidence mode, and the final S06 capture visibly shows the software
  keyboard with the focused Field and primary action still reachable. These are Simulator conclusions,
  not physical-device or VoiceOver acceptance.
- **IOS06 — Complete for the current design-system scope.** Web #33 finalizes the English and
  Simplified Chinese specifications for all 15 components, records the unchanged typography mapping
  and synchronizes the verified S05/S06 reachability conclusions.
- **IOS07 — Complete for the current Simulator evidence scope.** Repeatable CI
  build/install/launch/screenshot gates exist; #90 requires visible Preview state to agree with
  scenario metadata. `docs/visual-baselines/ios-simulator-evidence-manifest.json` now versions the
  reviewed S03-S06 run IDs, artifact IDs, SHA-256 digests, source SHAs, scenarios and outcomes.
  Artifact binaries remain temporary and no automated pixel-diff gate is claimed.
- **IOS08 — Complete for the current internal design-system handoff.** The final private candidate
  is recorded in `docs/delivery-candidate-ios-2026-10-15.md` with archive SHA-256
  `29fc4c244148e28326488d31f1ea6397ace9d304a62c62cdf33f4bc0adab1f8b`,
  Native source `2b2bac959e4b926bf789d5fe88c36077df1f6542`, CI run `38699064654`
  and delivery artifact `11955465470`. Consumer handoff wording is synchronized.

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
- #96 — iOS Modal / keyboard reachability evidence and deterministic keyboard-tutorial suppression

Web:

- #30 — iOS design-system guideline entry points
- #31 — English/Chinese 15-component iOS specification draft
- #32 — verified Header/ListRow large-text behavior synchronization
- #33 — final iOS component specifications and typography/reachability status

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

## Completion boundary

IOS01-IOS08 are complete for the current **Simulator-backed design-system scope**. Remaining work is
intentionally deferred rather than incomplete: physical-device/VoiceOver acceptance, real-device
keyboard/autofill, color/contrast changes, iPad support and wallet-product integration/release
acceptance.
