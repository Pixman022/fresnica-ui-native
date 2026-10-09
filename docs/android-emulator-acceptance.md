# Android Emulator Acceptance

This repository includes a real Android Emulator acceptance workflow at
`.github/workflows/android-emulator-acceptance.yml`.

The workflow is intended to prove that the Native package can build, install, launch, switch
to the required acceptance scenario, and capture evidence on an Android emulator. It is
stronger than the package-level render tests and the compile-only Android Preview workflow.

## Acceptance profile

The current required profile is:

- width: 320dp
- font scale: 1.3
- theme: Dark
- language: Simplified Chinese
- content scenario: Stress

The workflow creates a headless Android emulator, builds the Preview host, starts Metro,
installs the debug APK, launches the app, and selects the required language and scenario by
accessibility label.

## Automated cadence

Ordinary pull requests keep the core acceptance profile so review feedback stays focused and
reasonably fast:

- 320dp
- font scale 1.3
- Dark
- Simplified Chinese
- Stress scenario

A four-profile regression runs every Monday at 09:00 UTC (and can be requested on demand):

- 320dp / 1.0 / Light
- 360dp / 1.0 / Dark
- 390dp / 1.3 / Light
- 430dp / 1.3 / Dark

The matrix jobs run independently with `fail-fast: false`, so one failing profile
does not hide results from the other profiles.

To run **all four configurations before the next Monday**:

- From GitHub Actions, run **Android Emulator Acceptance** using
  `workflow_dispatch` and select `run_matrix: true`; width, font scale and
  theme inputs are ignored in this mode.
- Or open an in-repository PR whose title starts with `[visual-matrix]`.
  Only PRs whose head is in this same repository may opt in this way.
  The PR CI still runs; the normal single-profile acceptance job is skipped
  to avoid building the same app a fifth time.
- Leave `run_matrix` unchecked to run a single manually selected profile.
  Inputs: width 320/360/390/393/430dp; font scale 1.0/1.3; theme Light/Dark.

The four-profile path preserves the existing Monday schedule and the ordinary
PR acceptance checks. Its UI language/content scenario remains Simplified
Chinese + Stress so screenshots can be compared across configurations.
Inspect all four uploaded artifact bundles for the **same workflow run** before
marking DS-09 evidence collected; a successful build alone is insufficient.

## Additional PR evidence: English and lower-screen gallery

After the normal 320dp / 1.3 / Dark / 简体中文 / Stress capture, pull-request
runs reuse the already built and installed Preview for an additional **393dp /
1.3 / Light / English / Stress** scenario. The App restarts to use its
initial English locale, the Stress control is selected by its accessibility
label, and a verified screenshot bundle is uploaded.

A second capture scrolls to the previously offscreen **More shared
primitives** heading and uploads a separate, verified artifact. The job
requires the target heading to be present in the UIAutomator hierarchy;
failure to reach it is a CI failure rather than being called a passed
gallery review. These extra captures run on pull requests, not during the
four-profile scheduled matrix or manual workflow dispatch.

The workflow checks artifact completeness and relevant visible labels. Human
inspection is still required to judge text wrapping, overflow, spacing,
component rendering and consistency with the approved design reference.

## PR interaction evidence (Android emulator only)

After the English/Light 393dp gallery capture, pull-request runs additionally
exercise the **neutral Preview** (no wallet functionality):

- Scroll to the App-owned **Open modal** action, capture its visible title,
  press the actual Android `KEYCODE_BACK`, then capture and verify the modal
  title is no longer present. Upload separate open/dismissed evidence.
- Focus the bottom **Keyboard visibility check** field, enter sample text,
  scroll until the button below it is visible and check Android input-method
  state before uploading keyboard/scroll evidence.

The workflow reuses the *already installed* Preview and 393dp emulator: no
second Android build. Each capture includes the same normal device/PNG/window/
manifest bundle and runs `example:verify`; these steps fail if expected labels
or required keyboard state cannot be confirmed. Artifacts are stored for 90 days.

**This is a newly added check, pending proof from a successful run.** Even if it
passes, it establishes emulator interaction evidence, not TalkBack focus-order
certification, physical-phone keyboard behavior, formal design baseline approval
or WCAG AA color compliance. Any failure requires investigation of the actual
job logs and capture, not a silent workaround or a palette change.

## Evidence bundle

A successful run captures an evidence directory containing:

- `device.json` — model, API level, Android version, locale, display size/density, font scale and night mode
- `screenshot.png` — the rendered Preview
- `window.xml` — UIAutomator hierarchy
- `manifest.json` — capture timestamp, source commit provenance and file list

Before upload, the workflow runs:

```sh
npm run example:verify -- <acceptance-bundle-directory>
```

The verifier requires all evidence files to be present and non-empty, validates the PNG
signature, checks required device fields, validates the UI hierarchy, and verifies the
manifest structure.

The workflow also requires the UI hierarchy to contain both:

- `Fresnica 原生预览`
- `压力测试`

Only a verified bundle is uploaded as a GitHub Actions artifact named
`android-acceptance-<run-id>`.

## Artifact retention

Acceptance evidence artifacts are retained for 90 days. Failure-only diagnostic artifacts
are retained for 30 days so broken runs remain debuggable without keeping transient
diagnostics as long as successful acceptance evidence.

## Local commands

With an Android emulator already running:

```sh
npm run example:bootstrap
npm run example:android:build
npm run example:profile -- --width 320 --font-scale 1.3 --theme dark
npm run example:tap-label -- "Language, 简体中文"
npm run example:tap-label -- "内容场景, 压力测试"
npm run example:capture
npm run example:verify -- <captured-bundle-directory>
```

The profile command refuses to modify a non-emulator Android device.

## Failure diagnostics

The workflow prints emulator logs, Metro logs, connected ADB devices, emulator processes,
configured AVDs and a bounded logcat sample on failure. AVD creation, ADB discovery and
logcat diagnostics use explicit timeouts so a broken emulator setup fails with useful
evidence instead of consuming the full job timeout.

## Review expectation

For changes that affect Native UI behavior, the Preview host, Android acceptance scripts or
the emulator workflow, reviewers should expect the following before merge:

1. `CI` succeeds.
2. `Android Preview` succeeds.
3. `Android Emulator Acceptance` succeeds.
4. The acceptance artifact is present and the verifier reports `valid: true`.

The artifact is acceptance evidence for the exact source revision exercised by the run; it
should not be treated as a substitute for product-level release testing.
