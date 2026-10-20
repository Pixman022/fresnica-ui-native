# Fresnica Native UI Quality-Maintenance Candidate — 2026-10-20

## Candidate identity

This record freezes the private internal design-system candidate after the 2026-10-19 quality
maintenance and iOS experience optimization plan completed its engineering tasks Q01-Q06.

- Package: `@fresnica/ui-native`
- Version: `1.1.0-rc.1`
- Archive: `fresnica-ui-native-1.1.0-rc.1.tgz`
- Archive SHA-256: `341c1cc84590b802d2f8457500b6a30467417c5cf8670b62e54031e1a9313569`
- Native source SHA: `1afeac9cab5c55e4baeb0e99514c933722935da0`
- Web token source SHA: `15d49e0be28a232ae6de2a7285a3a77add8c87d4`
- Web quality-maintenance main SHA: `e026a6390fd16cf23122d5967b5fd23d6f3fbc57`
- CI run: `39352213975`
- Delivery artifact ID: `12233551785`
- Delivery artifact digest:
  `sha256:7dcb6eba30f0abbeac56721aebe97352f5b244bccfb2310fe22f70a7e27bec0f`

The downloaded delivery ZIP contains `delivery-record.json` plus the tarball. The record names the
same Native source SHA and tarball SHA-256 above, and the extracted tarball checksum was independently
verified after download.

## What changed from the 2026-10-15 candidate

The package version remains `1.1.0-rc.1`; consumers must therefore pin the source SHA and archive
checksum, not the version string alone.

Compared with the 2026-10-15 candidate, this candidate adds:

- Q03 / Native #103: at iOS accessibility text sizes, empty Header side-slot placeholders are
  reclaimed while real leading/back/trailing controls keep their existing slots and hit areas.
- Q04 / Native #105: package-level Jest coverage measurement and a non-regressing CI coverage gate,
  plus explicit iOS/Android platform-branch tests.
- Q05 / Native #106: XCUITest-based Simulator interaction evidence covering software keyboard plus
  primary action, long-content scrolling plus action activation, and Modal open/close with the
  trigger reachable after close.

Q01 was Web-only compatible esbuild maintenance and audit correction. Q02 was entry-document/test
statistic synchronization plus the Native iOS support README entry; those tasks do not change this
tarball's public API contract.

## Verification

Main CI run `39352213975` passed:

- Native production dependency audit gate;
- standalone tests;
- package coverage gate;
- archived iOS visual-evidence verification;
- immutable Web token-source contract;
- TypeScript build;
- packed-package consumer contract;
- internal delivery-candidate creation.

Q05's successful Simulator interaction run is `39235433519`; artifact `12180134517` has digest
`sha256:438dbeeb0093ccfb3942269ed30200b097cd754b1d04b4b1ea14f7fc1c86932d`.
It executed three XCUITests with zero failures:

1. keyboard Field, visible software keyboard, primary action, and visible callback feedback;
2. long-content scrolling to an action, real activation, and visible feedback;
3. Modal open, close-control activation, disappearance, and trigger reachability after close.

This is Simulator technical interaction evidence. It is not VoiceOver focus/speech/gesture
certification or physical-device keyboard/autofill acceptance.

## Design-decision boundary

Q03 engineering implementation and technical recommendation are complete. After this candidate was
frozen, the project owner approved D01 on 2026-10-20 by selecting the current Q03 (second) Header
layout. The approval does not change this candidate's source SHA, archive checksum or package API.
Existing color/contrast, physical-device, VoiceOver, iPad, broader iOS Golden Baseline and
wallet-product boundaries remain unchanged.

## Release meaning

This is a **private internal design-system integration candidate**, not an npm publication or public
production release. The existing Native Modal `fade` behavior, typography mapping and color palette
remain unchanged.
