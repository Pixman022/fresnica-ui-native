# Fresnica Native UI iOS Support Candidate — 2026-10-15

## Candidate identity

This record freezes the internal design-system candidate after the current iOS Simulator support
work completed.

- Package: `@fresnica/ui-native`
- Version: `1.1.0-rc.1`
- Archive: `fresnica-ui-native-1.1.0-rc.1.tgz`
- Archive SHA-256: `29fc4c244148e28326488d31f1ea6397ace9d304a62c62cdf33f4bc0adab1f8b`
- Native source SHA: `2b2bac959e4b926bf789d5fe88c36077df1f6542`
- Web token source SHA: `15d49e0be28a232ae6de2a7285a3a77add8c87d4`
- Web iOS specification SHA: `f1b3436f6f19043a4ac0d50e4f954c0f479913f2`
- CI run: `38699064654`
- Delivery artifact ID: `11955465470`
- Delivery artifact digest:
  `sha256:1c494f3da87c7d8549195af90fd2d09ec8f0106b90764dcd355c682fb877bb55`

The delivery artifact contains `delivery-record.json` plus the tarball. The record inside the
artifact names the same archive SHA-256 and Native source SHA above.

## iOS design-system verification completed

The current candidate includes the production Header/ListRow accessibility-size fixes from #94.
The package and neutral Preview have also been reviewed through the current iOS Simulator evidence:

- S03 maximum-standard text: valid, no regression in the reviewed layout.
- S04 maximum-accessibility text: reproduced Header/ListRow failures; #94 fixes those exact defects.
- S05 Modal: title/content/close control remain visible at the maximum accessibility category.
- S06 software keyboard: keyboard visibly present; focused Field and primary action remain reachable.
- The proposed 17/15/17/20/22/34 iOS-only typography mapping was not adopted. Existing
  14/13/15/18/20/48 package values remain authoritative with system text scaling enabled.
- English and Simplified Chinese iOS component specifications are synchronized in Web #33.

See `visual-baselines/ios-simulator-evidence-manifest.json` for the reviewed run/artifact/digest
records. Original PNG/metadata files and the pending owner layout decision are linked from
`docs/visual-baselines/ios-layout-review-2026-10-15.md`. The candidate above remains a frozen
historical package identity; later maintenance commits do not silently change its source or checksum.

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
