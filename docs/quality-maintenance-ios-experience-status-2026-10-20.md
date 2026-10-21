# Quality Maintenance and iOS Experience Status — 2026-10-20

This record closes the engineering tasks from
`Fresnica_质量维护与iOS体验优化工作计划_2026-10-19.md`.
It records both engineering completion and the subsequent project-owner layout decision D01.

## Final task status

- **Q01 — Complete.** Web #35 updates the compatible esbuild chain to 0.28.2, corrects the audit
  explanation, and keeps the production dependency audit at 0. Web main:
  `e026a6390fd16cf23122d5967b5fd23d6f3fbc57`.
- **Q02 — Complete.** Web README statistics are synchronized to the actual 561 unit tests and
  49 accessibility tests; Native #102 adds the iOS support summary and entry links.
- **Q03 — Complete and owner-approved.** Native #103 reclaims empty Header side slots only at iOS
  accessibility text sizes. Real controls retain their slots and hit areas. After reviewing the
  before/after S04 maximum-accessibility frames, the owner selected the current Q03 (second) layout
  on 2026-10-20.
- **Q04 — Complete.** Native #105 establishes package-level Jest coverage and a CI gate:
  statements 97.74%, branches 86.97%, functions 96.66%, lines 97.69%, with explicit iOS/Android
  branch tests.
- **Q05 — Complete.** Native #106 adds XCUITest Simulator interaction evidence for keyboard +
  primary action, long-content scrolling + action, and Modal open/close. Successful run
  `39235433519`, artifact `12180134517`.
- **Q06 — Complete.** A new private candidate is frozen from Native
  `1afeac9cab5c55e4baeb0e99514c933722935da0`; main CI `39352213975` passes and delivery
  artifact `12233551785` records tarball SHA-256
  `341c1cc84590b802d2f8457500b6a30467417c5cf8670b62e54031e1a9313569`.
- **D01 — Approved 2026-10-20.** Keep the current Q03 Header layout: reclaim empty side-slot
  placeholders at iOS accessibility text sizes, while preserving real leading/back/trailing control
  slots and hit areas. This decision is layout-only and does not approve the broader iOS Golden Baseline.

## Q05 interaction evidence

The successful iOS Interaction Evidence run `39235433519` uses Xcode 16.4, iOS 18.5,
iPhone 16, Release configuration, Light appearance and the extra-extra-extra-large content size.

The run executed three tests with zero failures:

- keyboard Field -> software keyboard visible -> primary action -> visible feedback;
- ScrollView navigation to long-content action -> real tap -> visible feedback;
- Modal trigger -> Modal visible -> close control -> Modal disappears -> trigger reachable again.

The workflow fails if a required target, keyboard or callback feedback is missing. It does not use
blind coordinate taps to infer success. The seven original screenshots, original metadata and
attachment manifest, plus a traceable three-test result summary, are now retained in
`visual-baselines/ios/2026-10-20/q05-interactions`. The full `.xcresult` remains in the pinned
source artifact rather than being duplicated in Git. Physical-device and VoiceOver focus
certification remain outside this result.

## Current private candidate

- version: `1.1.0-rc.1`
- Native source: `1afeac9cab5c55e4baeb0e99514c933722935da0`
- archive SHA-256: `341c1cc84590b802d2f8457500b6a30467417c5cf8670b62e54031e1a9313569`
- main CI: `39352213975`
- delivery artifact: `12233551785`
- delivery artifact digest:
  `sha256:7dcb6eba30f0abbeac56721aebe97352f5b244bccfb2310fe22f70a7e27bec0f`

See `delivery-candidate-ios-2026-10-20.md` for the candidate comparison and consumer identity.

## Cross-repository consistency

Web Q01/Q02 outputs are already merged on Web main `e026a6390fd16cf23122d5967b5fd23d6f3fbc57`.
No token source change was made; Native continues to pin Web token source
`15d49e0be28a232ae6de2a7285a3a77add8c87d4`.

The Native candidate, consumer handoff, coverage record and iOS interaction evidence all retain the
same scope boundaries: no color/contrast resolution, physical-device acceptance, VoiceOver
speech/gesture/focus certification, real-device keyboard/autofill, iPad commitment, SwiftUI/UIKit
SDK, or wallet-product implementation.

## 2026-10-21 follow-up maintenance

The plan's later F01-F04 maintenance round does not alter Q01-Q06 or D01:

- **F02 — Complete.** Native #130 adds the real package-source/build-input trigger paths for
  iOS Interaction Evidence while keeping manual dispatch. A later Header source PR automatically
  started the XCUITest workflow through the new `src/**` path, proving source-trigger coverage.
- **F03 — Complete.** Native #131 archives the three Q03 PNG/metadata pairs and seven Q05
  screenshots plus original metadata/attachment manifest, pins source artifact/run/job identities,
  and extends `verify-ios-evidence.mjs`. A temporary checksum mismatch was rejected by CI before
  the correct manifest was restored and the final CI passed.
- **F01 — Validation in progress.** Native #132 final head
  `a615c448a45dd3c287f5ea1d592c4e26f49370db` contains the Header React-empty side-slot boundary
  fix, focused regression coverage and a separate `f01-header-boundary` maximum-accessibility
  Simulator evidence view. Package CI `39533706772` passes 53 tests with 97.90% statements,
  87.62% branches, 96.87% functions and 97.82% lines; Android Preview `39533706732` and Android
  Emulator Acceptance `39533706824` pass. Final-head iOS Interaction Evidence
  `39533706886` passes all three Q05 XCUITests with zero failures and publishes artifact
  `12317779291` (digest
  `sha256:56304bccf88bce32a12fedf921db3d7bec7683316741d2d1cd06e9d19adb6ecb`).
  Typography Detail `39533706770` remains queued, so F01 is not recorded as complete yet.
- **F04 — In progress.** Final cross-repository specification/status/consumer-handoff synchronization
  follows the completed F01 validation.

The frozen `1.1.0-rc.1` candidate remains the Q06 artifact listed above. It does **not** acquire
post-freeze F01-F03 Maintenance behavior merely because `main` advances.

## Completion statement

Q01-Q06 satisfy the engineering completion criteria from the 2026-10-19 plan, and D01 is now
explicitly approved for the Q03 Header layout. Deferred color/contrast, physical-device,
VoiceOver/TalkBack, iPad and wallet-product gates remain unchanged. The correct project state is:

**Engineering optimization complete; Q03 owner layout decision approved; project remains in maintenance with deferred integration gates.**
