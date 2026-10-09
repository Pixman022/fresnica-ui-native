# Native Preview visual evidence and acceptance matrix

Status: **evidence recorded; visual baseline not approved**. Scope: the neutral
`@fresnica/ui-native` Preview host, **not** a wallet product or physical device.
This records tasks DS-09/10/11 in the
[UI component library delivery plan](ui-library-delivery-plan.md).

## Source of evidence

- [Android Emulator Acceptance #37872341735](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37872341735):
  `completed/success`, PR #29.
- PR head SHA: `7e53a35a21cd92d863d6b1795752d1478858eda2`.
- Evidence artifact:
  `android-acceptance-37872341735-1-320-1.3-dark` (artifact ID `11591325536`).
- The artifact contained `device.json`, `screenshot.png`, `window.xml`
  and `manifest.json`; these were inspected after the workflow validated
  the bundle.
- Manifest `source.commit` is
  `ebba5233990879ef9dc4aee8709d1de69f67bbba`, the checkout revision
  recorded during PR acceptance (not the eventual squash-merge commit).
  `source.dirty` was `false`.
- The screenshot was captured on Android 15/API 35 emulator
  `sdk_gphone64_x86_64`. The Preview showed **320 × 569dp**,
  `fontScale 1.30`, **Dark**. The in-app UI displayed
  **简体中文** and **压力测试** selections.
- The screenshot's initial viewport shows the title, environment, segment
  controls and error-state field. The System-mode option wraps to two lines;
  this is visible in the screenshot and warrants continued narrow-screen
  review rather than being assumed to pass at every scaling factor.

## PR #35 additional reviewed evidence

- [Android Emulator Acceptance #37879358007](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37879358007)
  completed/success for PR head `d43fd3878945de1ee5f662d7609a5847b46da6d4`,
  subsequently squash-merged as `2519eb6b7795ccac4203310a80e2bd1baf81b0a4`.
- All three ZIP bundles were downloaded and checked for `device.json`,
  `screenshot.png`, `window.xml`, and `manifest.json`. Their manifests
  consistently report the clean PR test merge checkout
  `20c8d4dba8f3e78b3e58b9334db2ef3d999a8fac` (not the PR head or squash commit).
- [Original 320dp Dark zh-CN Stress](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37879358007):
  `android-acceptance-37879358007-1-320-1.3-dark` (artifact `11593888236`).
  The screenshot still shows the segmented theme controls and Chinese stress text;
  the app's locale is selected independently of the emulator device locale.
- **393dp / 1.3 / Light / English / Stress first viewport**:
  `android-acceptance-37879358007-1-393-1.3-light-en-top`
  (artifact `11593499366`). Screenshot inspected: long English supporting
  text wraps, the input error and long list description appear, and the
  controls stay within the visible viewport.
- **393dp / 1.3 / Light / English / Stress shared-component gallery**:
  `android-acceptance-37879358007-1-393-1.3-light-en-gallery`
  (artifact `11593642602`). Screenshot inspected: long primary action label
  wraps to two lines; disabled/loading states are present; `Header`,
  `Divider`, `IconButton`, and `Skeleton` can be seen after scrolling.
  The long Header deliberately truncates after two lines. No horizontal
  overflow was visible **in this screenshot**, but truncation and contrast
  are not approved as visual or accessibility sign-off.
- Emulator metadata: Android 15 / API 35, `sdk_gphone64_x86_64`,
  physical density 420dpi, font scale 1.3. It reports device locale `en-US`;
  the Preview itself selects Chinese or English. Light screenshots report
  `Night mode: no`, and the 320dp screenshot reports `Night mode: yes`.
- All three uploaded artifacts were present and not expired during review.
  No binary screenshots have been committed to the component package.

## Coverage matrix

The current Android emulator workflow enforces on relevant UI PRs:

- **320dp / font scale 1.3 / Dark / zh-CN / Stress** — PR #29 run passed;
  artifact present and reviewed for provenance and the visible first viewport.

The existing Monday automated matrix is configured to cover:

- **320dp / 1.0 / Light / zh-CN / Stress** — configured; current evidence
  still to be linked after a successful scheduled run.
- **360dp / 1.0 / Dark / zh-CN / Stress** — configured; evidence pending.
- **390dp / 1.3 / Light / zh-CN / Stress** — configured; evidence pending.
- **430dp / 1.3 / Dark / zh-CN / Stress** — configured; evidence pending.

Additional acceptance work before a complete visual sign-off:

- **393dp / 1.3 / Light / English / Stress**, including the below-fold
  shared-component gallery, now has reviewed screenshot evidence from PR #35.
  The original 320dp / Dark / Simplified Chinese profile remains unchanged.
- The gallery screenshot includes Header, IconButton, Divider and Skeleton
  but does **not** display every one of the 15 primitives at once, and
  deliberate Header truncation still needs visual-baseline approval.
- Check error/disabled/loading/selected/pressed states, focus and keyboard
  accessibility through the host, including modal dismissal. An APK build
  and a top-viewport screenshot alone do not prove these visually.
- Compare the same theme and semantic roles against the approved Web
  design-system baseline, noting Native platform override reasons.
- Real TalkBack and physical-device safe-area/keyboard behavior remain
  explicitly outside this phase-one evidence.

## Baseline policy

1. A verified screenshot bundle is **evidence**, not automatic proof of visual
   parity. Evidence must name its exact PR head and manifest source commit.
2. Before defining pixel-diff thresholds, approve a fixed emulator/API,
   density, font, locale, viewport and representative component state for each
   baseline. A baseline change must link to a reviewed visual difference.
3. `screenshot.png` and `window.xml` are generated evidence, not assets to
   commit to the component package. Successful workflow artifacts are normally
   retained 90 days; link a fresh run when the previous artifact expires.
4. Existing automated bundle verification checks required files, PNG
   signature, metadata and hierarchy labels. It does **not** perform a
   pixel-by-pixel visual comparison or replace human approval.
5. Keep automated pixel-diff gating **deferred** until stable fixed-environment
   reference screenshots and an acceptable false-positive rate exist.

## Next acceptance action

Link the next successful scheduled four-profile matrix artifacts to
[Issue #37](https://github.com/Pixman022/fresnica-ui-native/issues/37)
and this document. Continue to review offscreen component interaction states,
keyboard/modal behavior and consistent Web/Native semantics. Until the
pending configurations and a design-owner-approved baseline are available,
DS-09 and DS-11 remain **open**; DS-10 documents repeatable evidence,
not complete visual or WCAG AA acceptance. The owner has chosen to retain
the original brand greens and light button text for now; see the
[documented contrast gaps](native-contrast-audit.md).
