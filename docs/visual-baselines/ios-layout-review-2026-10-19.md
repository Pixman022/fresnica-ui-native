# iOS extreme Dynamic Type layout review — 2026-10-19

**Engineering task:** Q03 from the 2026-10-19 quality-maintenance and iOS-experience plan.

**Technical review:** complete for the three Q03 Simulator frames. The implementation
head is `f15a38113af6ecf881d84485fd2ce5460888a7a7`; evidence comes from
[iOS Typography Detail Evidence run 39215086435](https://github.com/Pixman022/fresnica-ui-native/actions/runs/39215086435).

**Project-owner layout decision:** approved on 2026-10-20. After reviewing the before/after
S04 maximum-accessibility Header frames, the owner selected the current Q03 (second) layout:
reclaim empty side-slot placeholders at iOS accessibility text sizes while preserving slots
and hit areas for real leading/back/trailing controls. This approval is limited to Q03 and
does not create an owner-approved iOS Golden Baseline.

## Change under review

At iOS accessibility text sizes (`fontScale >= 1.5`), Header previously kept both
44-point side slots even when a side had no content. In the S04 actions frame both
slots were empty, so 88 points of horizontal space plus layout gaps reduced the
title column without protecting any actual control.

Q03 removes only an empty side-slot placeholder at those iOS accessibility sizes.
A real back/leading or trailing control keeps its existing slot and hit area.
Default-size iOS behavior, Android behavior, public API, typography values, tokens,
colors and Modal behavior are unchanged.

## Technical comparison

### S03 maximum-standard actions

The new S03 frame keeps the existing maximum-standard behavior: the long Chinese
Header still uses the standard two-line ellipsis and the long primary action remains
visible. Q03 therefore does not move the change below the existing accessibility-size
threshold.

- artifact: `12168868814`
- artifact digest:
  `sha256:2f2fcd6c17f2828ede41fa8845e90f33f701cb3e4ae6f84a004a1c99bce250a5`
- PNG SHA-256:
  `ed6080b53931c1ab65bbb385b14c4d06c4a24656627318ef6ac8f8c1cf2530d6`

### S04 maximum-accessibility actions

The 2026-10-15 archived S04 frame is preserved at
`ios/2026-10-15/s04-actions-post-fix.png`; it is not replaced.

In the new frame the empty side-slot width is available to the title. The visible
title is laid out as three complete lines — **Sample / screen / header** — instead of
being forced into the narrower column that caused additional word splitting. The
full title and **Continue** action remain visible. No font-size reduction, scaling
cap or hidden content is used.

- artifact: `12169214601`
- artifact digest:
  `sha256:fd1e9c76bd3a2f4886b44233c36f4ad90de509aa4f9b0d6360e57ded03432dc4`
- PNG SHA-256:
  `7e1e321f8666cf01dd3f6641341a2c08866ed5b08f1fdd4e21ab5d88ffca8c64`

**Technical recommendation:** keep the Q03 change. It removes unused layout
reservation only where no control exists and improves extreme-size reading without
changing the typography mapping.

### S04 maximum-accessibility content

The new content frame keeps the existing Field/ListRow accessibility layout
available in the reviewed viewport. Q03 does not change those components.

- artifact: `12169662134`
- artifact digest:
  `sha256:b17057ffb3cfaea31e1be4c5b4e0c244c5c5d7da6aebdc7a1af839b531b2ab5f`
- PNG SHA-256:
  `e90b8147fc1170a245ca1fb26ac445261033302a64a92c5554d32a82e86f3450`

## Validation boundary

Package CI, Android Preview, iOS Fresh Build and the detail-evidence workflow are
separate checks. The first Android Emulator Acceptance attempt reached a React
Native RedBox because Metro was unavailable; its diagnostic screenshot explicitly
reported that environment failure. The job was rerun rather than changing Android
component behavior.

These frames are Simulator technical evidence only. D01 is now approved for the Q03 Header
layout shown here. The decision does not approve colors, contrast, physical devices, VoiceOver,
real-device keyboard/autofill, iPad, wallet-product behavior, or the broader iOS Golden Baseline.

Exact source, artifact and screenshot digests are versioned in
[ios/2026-10-19/evidence-manifest.json](ios/2026-10-19/evidence-manifest.json).
