# Approved Native phase-one **visual-layout** baselines

> **Design-owner decision: approved on 2026-10-09.** Approval was explicitly given in the project conversation immediately after the DS-11 approval question and applies **only** to the neutral `example/` Preview's layout, representative component states, and current Light/Dark visual consistency.
>
> **Not approved:** WCAG AA compliance, original brand-green/light-text contrast, full accessibility focus order, TalkBack, reduced-motion, physical device/iOS behavior, wallet production flows, Mainnet, or pixel-perfect automatic diff thresholds.

## Accepted layout decisions

1. **320dp**, `fontScale=1.3`, Dark, zh-CN/Stress: compact **系统** theme label stays on a single line after [PR #45](https://github.com/Pixman022/fresnica-ui-native/pull/45); the old **跟随系统** two-line presentation is **superseded**.
2. **393dp**, `fontScale=1.3`, Light, English/Stress: the deliberately long sample `Header` may be truncated with a two-line ellipsis. English long supporting text may wrap naturally.
3. Existing representative **320 / 360 / 390 / 393 / 430dp** Light/Dark layouts and visible Button/Field/Status/Header/IconButton/Divider/Skeleton states are accepted as a *visual layout* baseline, with existing theme tokens unchanged.

This approval is a **layout decision**, not a claim that the actual screenshots meet all WCAG contrast thresholds, cover every component state, or pass TalkBack. Keep all known issues and platform acceptance boundaries in [the human checklist](../native-visual-baseline-review.md) and [the phase-one report](../ui-library-phase-one-status.md).

## Reference policy

- Pin the **run ID, GitHub artifact ID, source checkout SHA, Android API/density/fontScale/theme/locale, screenshot dimensions and SHA-256** for each approved screenshot in `approved-manifest.json`. Never equate a squash commit to the PR test checkout recorded in `manifest.json`.
- Android 15/API 35, emulator `sdk_gphone64_x86_64`, density **420dpi**, system locale `en-US`, with Preview-selected `zh-CN` or English/Stress. Preserve viewport-specific width/height, theme and font scale.
- GitHub Actions screenshots are **90-day evidence**, not permanently hosted Golden PNG assets. Screenshot hashes and pinned source/environment remain durable in this repository, but the original binary images must be archived externally before the Actions artifacts expire if future exact screenshot comparisons are required.
- The available workflow reproduces the Preview and captures a fresh PNG/UI hierarchy/device manifest. Regenerated PNGs can differ in system-bar clock or emulator rendering. **No automated pixel-diff gate or threshold is authorized**. Review diffs manually and request a new owner approval for intentional changes.
- A **320dp / 1.0 / Light** screenshot from [PR #39](https://github.com/Pixman022/fresnica-ui-native/pull/39) predates the [PR #45](https://github.com/Pixman022/fresnica-ui-native/pull/45) compact label. It remains historical evidence and **must not be copied into the new post-fix approved reference manifest unchanged**. Recollect this configuration before pinning it as the approved version.

## How to reproduce evidence

1. Check out the *source checkout SHA* from the reference manifest, install Node.js and Android toolchain versions from [the Web mobile baseline](https://github.com/Pixman022/fresnica-ui/blob/main/docs/design-system/mobile-native-baseline.md) and [Native Preview setup](../../example/README.md).
2. On Android 15/API 35 emulator at 420dpi, use `npm run example:profile -- --width <dp> --font-scale <scale> --theme <light|dark>`.
3. Use the Preview's in-app language/scenario selections. For English gallery capture, scroll to the actual shared-primitives section.
4. Run `npm run example:capture`, then `npm run example:verify -- <bundle_dir>`, and compare observed text/layout and device metadata with this approved manifest. Archive the new ZIP if a permanent asset is required.
5. For regression, use the existing **Android Emulator Acceptance** workflow's `run_matrix` option or PR title prefix `[visual-matrix]`. It collects **four** different width/font/theme variants, not 393dp English or full-device accessibility.

This directory is source-controlled *review metadata*, not runtime or package assets. No files here are included in the `@fresnica/ui-native` consumer tarball.
