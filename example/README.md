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

## Acceptance scenarios

The Preview page shows its current logical width, height and font scale. Use the
Standard/Stress switch to exercise normal content or deliberately long English/Chinese
copy, long addresses, error text, loading/disabled controls and the bottom keyboard
visibility scenario.

The preview covers Light, Dark and System themes, English and Simplified Chinese,
Safe Area handling, core component states and accessibility labels. Product navigation,
wallet state, networking and persistence remain outside this preview host.
