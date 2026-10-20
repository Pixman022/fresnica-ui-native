# Quality Maintenance and iOS Experience Status — 2026-10-20

This record closes the engineering tasks from
`Fresnica_质量维护与iOS体验优化工作计划_2026-10-19.md`.
It keeps engineering completion separate from the pending owner layout decision D01.

## Final task status

| Item | Status | Delivered result |
| --- | --- | --- |
| Q01 | Complete | Web #35 updates the compatible esbuild chain to 0.28.2, corrects the audit explanation, and keeps the production dependency audit at 0. Web main: `e026a6390fd16cf23122d5967b5fd23d6f3fbc57`. |
| Q02 | Complete | Web README statistics are synchronized to the actual 561 unit tests and 49 accessibility tests; Native #102 adds the iOS support summary and entry links. |
| Q03 | Engineering complete | Native #103 reclaims empty Header side slots only at iOS accessibility text sizes. Real controls retain their slots. Q03 Simulator evidence supports keeping the change. D01 owner layout approval remains pending. |
| Q04 | Complete | Native #105 establishes package-level Jest coverage and a CI gate: statements 97.74%, branches 86.97%, functions 96.66%, lines 97.69%, with explicit iOS/Android branch tests. |
| Q05 | Complete | Native #106 adds XCUITest Simulator interaction evidence for keyboard + primary action, long-content scrolling + action, and Modal open/close. Successful run `39235433519`, artifact `12180134517`. |
| Q06 | Complete | A new private candidate is frozen from Native `1afeac9cab5c55e4baeb0e99514c933722935da0`; main CI `39352213975` passes and delivery artifact `12233551785` records tarball SHA-256 `341c1cc84590b802d2f8457500b6a30467417c5cf8670b62e54031e1a9313569`. |
| D01 | Pending actual owner decision | Engineering review is complete, but no owner identity, date or approval is inferred. The 2026-10-19 layout review remains the decision record. |

## Q05 interaction evidence

The successful iOS Interaction Evidence run `39235433519` uses Xcode 16.4, iOS 18.5,
iPhone 16, Release configuration, Light appearance and the extra-extra-extra-large content size.

The run executed three tests with zero failures:

- keyboard Field -> software keyboard visible -> primary action -> visible feedback;
- ScrollView navigation to long-content action -> real tap -> visible feedback;
- Modal trigger -> Modal visible -> close control -> Modal disappears -> trigger reachable again.

The workflow fails if a required target, keyboard or callback feedback is missing. It does not use
blind coordinate taps to infer success. Screenshots and the `.xcresult` bundle are retained in the
workflow artifact. Physical-device and VoiceOver focus certification remain outside this result.

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

## Completion statement

Q01-Q06 satisfy the engineering completion criteria from the 2026-10-19 plan. D01 is intentionally
still pending. The correct project state is therefore:

**Engineering optimization complete; project-owner layout approval pending.**
