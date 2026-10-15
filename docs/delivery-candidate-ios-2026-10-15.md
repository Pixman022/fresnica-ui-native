# Fresnica Native UI iOS Support Candidate — 2026-10-15

## Candidate identity

This record freezes the internal design-system candidate after the iOS Simulator support and
2026-10-15 engineering closeout. Later documentation commits do not change this package identity.

- Package: `@fresnica/ui-native`
- Version: `1.1.0-rc.1`
- Archive: `fresnica-ui-native-1.1.0-rc.1.tgz`
- Archive SHA-256: `5b42564fcbc7b47a9b8609d7252de4f47377d3ed2223fbb9ec117b5de7eb5ceb`
- Native source SHA: `14934ce59e6009a90ca88c4e709c484bb3a36175`
- Web token source SHA: `15d49e0be28a232ae6de2a7285a3a77add8c87d4`
- Web iOS specification SHA: `f1b3436f6f19043a4ac0d50e4f954c0f479913f2`
- CI run: [`38712835267`](https://github.com/Pixman022/fresnica-ui-native/actions/runs/38712835267) — success
- Delivery artifact ID: `11961517450`
- Delivery artifact digest:
  `sha256:a106e0d4291dc70af07382b008afcfee5d5efdf3de871b5eee59388bbb9e3a82`

The delivery artifact contains `delivery-record.json` plus the tarball. The record inside the
artifact names the same archive SHA-256 and Native source SHA above. The downloaded ZIP digest
and extracted tarball SHA-256 were independently checked against those records on 2026-10-15.

## iOS design-system verification completed

The current candidate includes the production Header/ListRow accessibility-size fixes from #94
and the Modal close-control minimum-size fix from #100.
The package and neutral Preview have also been reviewed through the current iOS Simulator evidence:

- S01/S02: actual default-text small/large iPhone frames captured by run `38709105594`.
- S03 maximum-standard text: valid, no regression in the reviewed layout.
- S04 maximum-accessibility text: reproduced Header/ListRow failures; #94 fixes those exact defects.
- S05 Modal: run `38708758540` confirms the complete close glyph after #100; the older
  clipped-glyph frame is retained only as superseded history.
- S06 software keyboard: keyboard visibly present; focused Field and primary action remain reachable.
- The proposed 17/15/17/20/22/34 iOS-only typography mapping was not adopted. Existing
  14/13/15/18/20/48 package values remain authoritative with system text scaling enabled.
- English and Simplified Chinese iOS component specifications are synchronized in Web #33.
- Android emulator run `38711514868` passes the keyboard/focus/action regression after the
  tap helper rejects inverted bounds and the harness confirms actual software-keyboard visibility.
- Non-force compatible dependency maintenance removes the Native critical finding; the full
  Native audit is 29 (20 moderate, 9 high, 0 critical), with production 0. Remaining development
  chains and upgrade constraints are recorded in `dependency-audit.md`.

See `visual-baselines/ios-simulator-evidence-manifest.json` for the reviewed run/artifact/digest
records. Original PNG/metadata files and the pending owner layout decision are linked from
`visual-baselines/ios-layout-review-2026-10-15.md`. Ten original PNG/metadata pairs are retained in
Git; seven frames are the current layout-review candidates. The technical review names its actual
reviewer and scope. Project-owner design approval remains pending.

## Superseded candidate identity

The earlier internal candidate remains traceable and has not been silently rewritten:

- Native source SHA: `2b2bac959e4b926bf789d5fe88c36077df1f6542`
- Archive SHA-256: `29fc4c244148e28326488d31f1ea6397ace9d304a62c62cdf33f4bc0adab1f8b`
- CI run: `38699064654`
- Delivery artifact ID: `11955465470`
- Delivery artifact digest:
  `sha256:1c494f3da87c7d8549195af90fd2d09ec8f0106b90764dcd355c682fb877bb55`

Use the current identity above for a new handoff. Both candidates are private `1.1.0-rc.1`
archives, so consumers must pin the source SHA and tarball checksum rather than the version alone.

## Release meaning

This is a **private internal design-system integration candidate**. It is not:

- an npm registry publication or public production release;
- physical-device iOS acceptance;
- VoiceOver speech/gesture/focus certification;
- real-device keyboard/autofill validation;
- iPad support approval;
- a color/contrast or Increase Contrast resolution;
- a wallet-product implementation, navigation model or release approval.

The existing Native Modal `fade` behavior and current color palette remain unchanged.
