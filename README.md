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
- Image-derived theme generation is deferred

## First implementation slice

1. `AppTheme` and theme-mode resolution
2. Typography contracts
3. Button, Field and StateView primitives (implemented in this scaffold)
4. Screen, Header and ListRow primitives (implemented in this scaffold)
5. Modal primitive (implemented in this scaffold); platform-owned overlays remain in the App shell

Navigation, system bars, safe areas, persistence and product routes belong to the App
shell. Wallet flows remain Feature-local. See
[`../fresnica-ui/docs/design-system/mobile-native-baseline.md`](../fresnica-ui/docs/design-system/mobile-native-baseline.md)
for the complete boundary and acceptance contract.

## Local development

This directory is a source scaffold until the native client repository is initialized.
The package deliberately does not add React Native dependencies to the Web workspace.
The token validation script is a source-contract check only; it does not generate native
artifacts yet. Copy this directory into the approved `fresnica-ui-native` repository before
installing the native toolchain and generating the lockfile.

`AppTheme.colors` is currently mapped to the shared semantic roles by
`scripts/validate-token-source.mjs`. The hand-authored light/dark values in `src/theme.ts`
are a temporary reviewable adapter; a future generator must preserve this role map and
record every platform override before replacing it.
