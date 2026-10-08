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
