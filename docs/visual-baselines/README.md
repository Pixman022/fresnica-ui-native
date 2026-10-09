# Approved Native phase-one visual layout baselines

**Status:** The project owner explicitly approved the current visual layout on 2026-10-09.
This applies only to the neutral `example/` Preview's representative layouts
and visible shared-component states. It does not approve mobile-product release,
WCAG AA, TalkBack, physical-device behavior or automated pixel comparison.

## Approved design decisions

- At 320dp, the Chinese System-theme tab uses the short label **系统** on one line.
  The old **跟随系统** two-line presentation is superseded by PR #45.
- At 393dp, the deliberately long English `Header` may end with a two-line ellipsis.
- The reviewed 320, 360, 390, 393 and 430dp Light/Dark Preview layouts are accepted
  as a representative manual visual-layout baseline. Existing design tokens stay unchanged.

## Pinned reference evidence

The versioned [approved-manifest.json](approved-manifest.json) contains seven PNG
SHA-256 values and their GitHub Actions run/artifact IDs, original clean source
checkout SHAs, emulator configuration, screenshot pixel dimensions and capture time.
The 320dp Light reference was newly captured after PR #45, in the successful
[PR #48 visual matrix](https://github.com/Pixman022/fresnica-ui-native/pull/48).
It replaces the older PR #39 screenshot that still displayed the previous label.

Android profiles use Android 15/API 35, `sdk_gphone64_x86_64`, 420dpi and
device locale `en-US`. Each Preview selects its own zh-CN or English language,
Stress scenario, font scale and Light/Dark theme.

GitHub Actions screenshot binaries normally expire after 90 days. This repository
preserves their SHA-256 fingerprints and the source/environment needed for a
reviewable manual baseline, **not permanent PNG copies**. Archive the original
binary evidence separately before the workflow artifacts expire if exact image
comparison is needed later.

## Reproduce and review

1. Check out the source checkout SHA in the manifest. Install the pinned
   [toolchain](https://github.com/Pixman022/fresnica-ui/blob/main/docs/design-system/mobile-native-baseline.md)
   and follow the [Preview guide](../../example/README.md).
2. Configure the Android emulator using `npm run example:profile` with the
   reference width, font scale and theme. Select the Preview language and Stress.
3. For an English gallery reference, scroll to the shared-primitives section.
   Capture with `npm run example:capture` and verify via `npm run example:verify`.
4. Compare actual layout and component states against the approved decisions.
   Record differences and seek explicit owner approval before updating a baseline.

The Android Emulator Acceptance workflow can capture the four-profile matrix on
demand, but a passing workflow is **not** a pixel-parity approval.
No automatic pixel-diff threshold is enabled. Capture-time status bars and
emulator details may differ across otherwise equivalent screenshots.

## Explicit limitations

- Original brand-green primary buttons and light lettering remain unchanged.
  Known Light/Dark contrast deficits are **not WCAG AA compliant**.
- No general focus-traversal or TalkBack sign-off, reduced-motion sign-off,
  iOS/physical-device acceptance, wallet-product or Mainnet release approval.
- In PR #42, after-tap feedback appears in the UI hierarchy but is partly
  obscured by the keyboard in the screenshot. That full-text readability
  is not included in this approval.

These documents are design review metadata, not `@fresnica/ui-native`
runtime/package files. See the [approved review form](../native-visual-baseline-review.md)
for the exact user decision and remaining exceptions.
