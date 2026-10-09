# Fresnica Native Preview

This directory keeps the source for the Android preview host without committing the
generated React Native template.

## Bootstrap

From the repository root:

```bash
npm ci
npm run example:bootstrap
```

The command:

1. builds `@fresnica/ui-native`
2. creates `example/FresnicaPreview` with React Native CLI 0.87.0 when it is missing
3. packs the current local component package
4. normalizes the generated Android host to the repository's minSdk 26 baseline
5. installs that package into the generated host
6. copies `example/App.tsx` into the generated app

The generated project and package tarball cache are ignored by Git.

## Run on Android

Start an emulator or connect a device, then run:

```bash
npm run example:android
```

For a compile-only check:

```bash
npm run example:android:build
```

With one ready device connected through `adb`, capture the current acceptance context with:

```bash
npm run example:device-info
```

The command prints model, Android/API version, locale, window size, density, font scale
and night-mode state as JSON so the result can be copied into an acceptance record.

After arranging the Preview in the exact state you want to review, capture one acceptance
evidence bundle with:

```bash
npm run example:capture
```

The command creates a timestamped directory under `artifacts/android-acceptance/` containing:

- `device.json` with the same device context as `example:device-info`
- `screenshot.png` with the current Android display
- `window.xml` with the current UIAutomator hierarchy
- `manifest.json` with capture metadata, Git commit and working-tree dirty state

The evidence directory is ignored by Git. The capture command does not change display,
font, theme or app settings; UIAutomator uses a temporary device file that is removed
after the hierarchy is pulled.

Before sharing or reviewing a bundle, verify that its files are complete and parseable:

```bash
npm run example:verify -- artifacts/android-acceptance/<timestamp>
```

The verifier is read-only. It checks the required files, device/manifest JSON fields,
PNG signature and UIAutomator hierarchy without contacting the Android device.

The screenshot and UIAutomator hierarchy can contain visible text from the current screen.
Use this helper only on the Preview or other non-sensitive test screens; do not capture
screens that display secrets, mnemonic phrases, private keys, account credentials or
personal data.

## Emulator acceptance profiles

The profile helper changes Android system settings and therefore refuses to run on a
physical device. Use it only with one ready Android emulator.

Set a target logical width, font scale and appearance:

```bash
npm run example:profile -- --width 320 --font-scale 1.0 --theme light
npm run example:profile -- --width 430 --font-scale 1.3 --theme dark
```

Supported logical widths are `320`, `360`, `390`, `393` and `430` dp. Width changes
keep the emulator's current density and physical aspect ratio. Locale remains an in-app
Preview toggle instead of a device-level mutation.

Reset display size, font scale and night mode after acceptance:

```bash
npm run example:profile:reset
```

## Component inventory

The neutral Preview includes all 15 current exports from the shared Native component layer:

- Controls: `Button`, `Field`, `IconButton`, `SegmentedControl`.
- Containers and structure: `Screen`, `Header`, `ListRow`, `Modal`, `Divider`.
- Content and feedback: `Typography`, `StateView`, `StatusBadge`, `InlineMessage`, `Skeleton`, `Progress`.

The additional-primitives gallery demonstrates the header's narrow/long-title layout, a decorative
separator, an accessible icon-only button with host-managed feedback, and a labeled loading
placeholder. Long-title variants are shown in Stress mode. The demo buttons never invoke wallet,
network or security operations.

## Acceptance scenarios

The Preview page shows its current logical width, height and font scale. Use the
Standard/Stress switch to exercise normal content or deliberately long English/Chinese
copy, long addresses, error text, loading/disabled controls and the bottom keyboard
visibility scenario.

The preview covers Light, Dark and System themes, English and Simplified Chinese,
Safe Area handling, core component states and accessibility labels. Product navigation,
wallet state, networking and persistence remain outside this preview host.

## Physical-device accessibility review (not yet completed)

The [manual Android accessibility acceptance matrix](../docs/native-accessibility-device-acceptance.md)
defines reproducible TalkBack, keyboard focus, Dynamic Type, touch target,
system-bar/safe-area and reduced-motion tests with an **unfilled operator,
device and results template**. These checks require an actual test operator
on a supported physical device.

CI and Android UIAutomator screenshots cover the **neutral Preview emulator**
only. They do not certify TalkBack spoken order, real-device accessibility
or WCAG AA. The original brand colors remain unchanged, and the outstanding
work is tracked in [Issue #49](https://github.com/Pixman022/fresnica-ui-native/issues/49).
