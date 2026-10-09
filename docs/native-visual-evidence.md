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

The four-profile matrix has now been **executed and reviewed** on
[PR #39](https://github.com/Pixman022/fresnica-ui-native/pull/39) in
[Android Emulator Acceptance #37889383234](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37889383234):

- **320dp / 1.0 / Light / zh-CN / Stress** — success; artifact
  `android-acceptance-37889383234-1-320-1.0-light` (ID `11597572552`).
- **360dp / 1.0 / Dark / zh-CN / Stress** — success; artifact
  `android-acceptance-37889383234-1-360-1.0-dark` (ID `11598081033`).
- **390dp / 1.3 / Light / zh-CN / Stress** — success; artifact
  `android-acceptance-37889383234-1-390-1.3-light` (ID `11598151724`).
- **430dp / 1.3 / Dark / zh-CN / Stress** — success; artifact
  `android-acceptance-37889383234-1-430-1.3-dark` (ID `11597522664`).

The four jobs and package CI completed successfully for PR head
`1c83f81fa7d71a9efd53000e7120c0b1b9f0e814`. All four ZIPs were
downloaded and checked to contain `device.json`, `screenshot.png`,
`window.xml` and `manifest.json`. Each reported the same clean test
checkout `72c25c7ce62a624bb81e420dc5a5fa3902619107`, Android
15/API 35 and physical density 420dpi. Screenshot widths match the declared
dp profiles, font scales and Light/Dark night modes; in-app Simplified
Chinese and Stress labels appear in each UI hierarchy.

Screenshots were visually inspected: error-supporting text and long row
content wrap without obvious horizontal overflow **within the initial
viewport** at the four sizes. Parts of the scrolling content lie below
the viewport, so these screenshots do **not** independently verify the
complete page, keyboard visibility, modal dismissal or focus order.
The PR was squash-merged as
`4cacbd0b2d458619d460d9f30ab5d4944d19fdda`.

The existing Monday schedule remains in place. To run the same profiles
on demand, use `run_matrix: true` or a trusted PR title beginning
`[visual-matrix]`; see the
[emulator acceptance guide](android-emulator-acceptance.md).

Additional acceptance work before a complete visual sign-off:

- **393dp / 1.3 / Light / English / Stress**, including the below-fold
  shared-component gallery, now has reviewed screenshot evidence from PR #35.
  The original 320dp / Dark / Simplified Chinese profile remains unchanged.
- The gallery screenshot includes Header, IconButton, Divider and Skeleton
  but does **not** display every one of the 15 primitives at once, and
  deliberate Header truncation still needs visual-baseline approval.
- The PR #42 Android emulator now verifies modal Back dismissal and
  keyboard-open button click with before/after evidence. **General focus
  navigation** and real TalkBack remain unverified; an APK screenshot
  alone cannot establish their spoken order.
- Compare the same theme and semantic roles against the approved Web
  design-system baseline, noting Native platform override reasons.
- Real TalkBack and physical-device safe-area/keyboard behavior remain
  explicitly outside this phase-one evidence.

## PR #42 verified emulator interactions

The neutral Preview's keyboard occlusion was reproduced, then corrected in
[PR #42](https://github.com/Pixman022/fresnica-ui-native/pull/42)
without changing shared Native components or brand colors.
[Android Emulator Acceptance #37896975342](https://github.com/Pixman022/fresnica-ui-native/actions/runs/37896975342)
and both package CI and Android Preview passed at head
`b0ad718db2d754ac75efe8f1dec339256a765f95`.
Clean Actions checkout: `4c1f5575768878d2b73ac2256b22a8df724dabd5`;
squash merge: `87c3fc92f57c9660fd7d7aa9fa995648a8e4fb5c`.

Seven distinct non-expired ZIP bundles were downloaded. Each contained
`device.json`, `screenshot.png`, `window.xml`, and `manifest.json`;
all report the same clean source checkout. On Android 15/API 35 and 420dpi,
fontScale 1.3, Light/English, the interactive captures show:

- **Modal open**: artifact `11600614336`, actual dialog titled
  `Preview modal` visible in screenshot/hierarchy.
- **Android Back dismissal**: artifact `11600494850`, dialog absent
  after sending `KEYCODE_BACK`; the original `Open modal` action returns.
- **IME plus button before tap**: artifact `11601495636`, soft keyboard
  visible and the complete `Primary action below keyboard field`
  is now visibly **above** it (UI node bounds `[42,883][990,1009]`).
- **Actual tap and feedback**: artifact `11601405854`, real emulator
  click succeeds and `Keyboard action was pressed` appears in the
  hierarchy. The feedback text itself is partly obscured at the bottom
  of this screenshot, so its full **visual readability is not certified**.
- Existing Chinese/Dark first view `11600413203`, English/Light first
  view `11601395724` and scrolled gallery `11601525300` also passed.

This verifies the phase-one **scripted Preview interactions**, not
general focus-navigation order, real-device TalkBack, physical-keyboard
navigation, design-owner-approved Golden Baselines, or WCAG AA compliance.

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

The four previously missing size/theme profiles now have verified,
reviewed first-viewport artifacts and are recorded in
[Issue #37](https://github.com/Pixman022/fresnica-ui-native/issues/37).
The scoped emulator Back/keyboard interactions now have reviewed evidence
from PR #42. DS-09 engineering acceptance is complete, but real TalkBack
and general focus order have **not** been tested and must not be assumed.
Next, obtain design-owner approval of fixed visual references. DS-11 remains
**open** pending explicit visual-baseline sign-off. Evidence collection
does not imply complete WCAG AA compliance: the owner has chosen to
retain the original brand greens and light button text, with the
[known contrast gaps](native-contrast-audit.md) documented.
