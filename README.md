# fresnica-ui-native

This is the standalone native repository for the Fresnica design-system adapter.
The Web repository is maintained separately at `fresnica-ui/`.

Android-first React Native adapter for the Fresnica design system.

This package is intentionally separate from the Web `fresnica-ui` package. It consumes
the shared semantic design language and exposes native-friendly theme and component
contracts; it does not import DOM, CSS, Less, Web Portal or browser storage APIs.

## Baseline

- React Native CLI `0.87.0` (not Expo)
- React `19.2.3`, TypeScript `6.0.3`, Node `>=22.13.0`
- Hermes and New Architecture enabled
- Android first: minSdk 26, targetSdk 36, compileSdk 37, Kotlin 2.2.0
- English and Simplified Chinese through App-level localization injection
- Light, Dark and System themes. For `system`, the App shell must pass the platform-resolved
  appearance (`light` or `dark`) to `resolveTheme`; Android dynamic accent color is not consumed.
- The baseline has no generic secondary action color: `contentSecondary` is supporting text,
  while `accentBlue` is network information. Secondary controls use their component's neutral
  surface and border roles until a product-wide action role is approved.
- Image-derived theme generation is deferred

## First implementation slice

1. `AppTheme` and theme-mode resolution
2. Typography contracts
3. Button, Field and StateView primitives (implemented in this scaffold)
4. Screen, Header and ListRow primitives (implemented in this scaffold)
5. Modal primitive (implemented in this scaffold); platform-owned overlays remain in the App shell
6. Common supporting primitives: Typography, IconButton, Divider, StatusBadge, InlineMessage,
   Skeleton, Progress and SegmentedControl

Navigation, system bars, safe areas, persistence and product routes belong to the App
shell. Wallet flows remain Feature-local. See
[`../fresnica-ui/docs/design-system/mobile-native-baseline.md`](../fresnica-ui/docs/design-system/mobile-native-baseline.md)
for the complete boundary and acceptance contract.

## Local development

This repository is the standalone native component package; it deliberately does not add
React Native dependencies to the Web workspace. `npm test` runs type, formatting, theme,
component-contract and hostless render checks using only this repository.

Cross-repository token validation is intentionally separate. When `fresnica-ui` is checked
out beside this repository, `npm run test:source-contract` validates the shared Web token
source and verifies that the committed generated Native contract is current. CI checks out
both repositories before running this source-contract check. `npm run generate:tokens`
refreshes the committed Native dimension and color contract.

`npm run build` emits JavaScript and TypeScript declarations to `dist/`. The package export
keeps React and React Native as peer dependencies and does not bundle an App shell.
`npm run test:render` contains Jest/React Native Testing Library tests for component
rendering, callbacks and accessibility state. The standalone package uses a small
hostless Jest adapter for React Native primitives so these checks run before a product
App exists. A product App should run the same tests again with its real React Native
Jest/native host; this package-level suite must not be treated as Android device
acceptance.

## Android preview host

The `example/` directory contains the committed Preview App source. The generated React
Native CLI project is intentionally ignored so template output does not become part of the
component package history.

Run `npm run example:bootstrap` to generate a React Native 0.87 Android host and install the
current local package build into it. With an emulator or device available, run
`npm run example:android`. To verify only that the Android host compiles, run
`npm run example:android:build`.

The Preview App exercises theme resolution, English/Simplified Chinese copy, Safe Area,
core component states and accessibility roles before wallet features are introduced.
See [`example/README.md`](example/README.md) for details.

Component behavior and the phase-one acceptance matrix are documented in
[`docs/component-contracts.md`](docs/component-contracts.md).

The Android shell boundary and build order are documented in
[`docs/android-shell-plan.md`](docs/android-shell-plan.md).

The real-device-style Android Emulator acceptance workflow, evidence bundle and review
expectations are documented in
[`docs/android-emulator-acceptance.md`](docs/android-emulator-acceptance.md).

Product-app integration boundaries are documented in
[`docs/integration-guide.md`](docs/integration-guide.md).

`AppTheme` dimensions and Light/Dark color values are generated from the shared Token and
platform adapter sources by `npm run generate:tokens`. The generated contract is committed
at `src/generated-token-contract.ts` so builds do not depend on the Web repository being
present. The Native color values and semantic role mapping are reviewed in
`../fresnica-ui/design-system/platform-token-source.json`; any platform override must keep
its reason and accessibility review there. Theme preferences remain local to each host
platform and are not synchronized with Web or another device.
