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
4. installs that package into the generated host
5. copies `example/App.tsx` into the generated app

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

The preview covers Light, Dark and System themes, English and Simplified Chinese,
Safe Area handling, core component states and accessibility labels. Product navigation,
wallet state, networking and persistence remain outside this preview host.
