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

- **393dp / 1.3 / Light / English / Stress** and a screenshot scrolled to
  the shared-component gallery are now included in the **PR-triggered** emulator
  acceptance steps, reusing the existing Android build. These are **pending
  evidence until a successful workflow run and inspected artifact exist**.
  The original 320dp / Dark / Simplified Chinese profile is unchanged.
- Scroll to capture controls below the initial viewport, including the
  added Header, IconButton, Divider and Skeleton examples. The current
  screenshot does **not** show all 15 primitives at once.
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

Review the 320dp screenshot beyond the initial viewport, then link the next
weekly matrix evidence to this document. Until the pending combinations and
a human-approved baseline are available, DS-09 and DS-11 remain **open**;
DS-10 records the evidence and repeatable matrix without claiming complete
visual acceptance.
