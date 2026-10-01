# Android App Shell Plan

This repository now contains an on-demand React Native 0.87 Preview Host under `example/`.
It validates the component package against a real Android build without turning
`@fresnica/ui-native` into a product App.

The eventual product shell may remain in this repository or be extracted later, but its
product responsibilities stay separate from the reusable component package.

## Boundary

- The product App owns `NavigationContainer`, native stack/bottom tabs, persistence and feature routes.
- `react-native-safe-area-context` owns insets; screens must not guess status-bar heights.
- `StatusBar` and Android navigation-bar appearance are driven from `AppTheme.systemBars`.
- `Appearance` resolves the platform result passed to `resolveTheme('system', mode)`.
- The product localization layer owns English/Simplified Chinese labels and accessibility copy.
- Android permissions, keyboard policy and hardware integration remain product-App responsibilities.

## Current build order

1. Generate the Preview Host from the approved React Native/Android baseline.
2. Install the current local `@fresnica/ui-native` package into that host.
3. Run package CI, Preview TypeScript validation and Android `assembleDebug`.
4. Exercise Standard/Stress Preview scenarios across the Android acceptance matrix.
5. Start product navigation and wallet routes only after reusable primitive defects are resolved.

See [`android-host-acceptance.md`](android-host-acceptance.md) for the device matrix and evidence requirements.

## Product-App Acceptance Checklist

The final Android product App repeats the host checks once real routes and feature state exist.

- [ ] TalkBack focus order is logical.
- [ ] All icon-only actions have localized labels.
- [ ] Keyboard does not hide focused fields or primary actions.
- [ ] Safe-area insets do not cover content.
- [ ] Status-bar and navigation-bar icon contrast is correct.
- [ ] Light and dark system appearance are correctly resolved.
- [ ] Large text does not clip or overlap.
- [ ] Reduced-motion preference is respected.
- [ ] 320 dp width does not cause horizontal overflow.
- [ ] English and Simplified Chinese labels fit expected layouts.
