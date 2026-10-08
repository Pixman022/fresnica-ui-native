# Android App Shell Plan

This repository contains two on-demand React Native 0.87 hosts:

- `example/` is the primitive Preview Host.
- `product/` is the first product App shell and wallet slice.

Both consume `@fresnica/ui-native` without moving product responsibilities into the
component package.

## Boundary

- The product App owns `NavigationContainer`, native stack/bottom tabs, persistence and feature routes.
- `react-native-safe-area-context` owns insets; screens must not guess status-bar heights.
- `StatusBar` appearance is driven from `AppTheme.systemBars`; product release acceptance must also verify the Android navigation bar on a physical device.
- `Appearance` resolves the platform result passed to `resolveTheme('system', mode)`.
- The product localization layer owns English/Simplified Chinese labels and accessibility copy.
- Android permissions, keyboard policy and hardware integration remain product-App responsibilities.

## Current implementation

1. The reusable package and Preview Host remain independently buildable.
2. `product/App.tsx` owns the primary Home / Activity / Scan / Explore / Settings tabs.
3. A native-stack Send route provides the first secondary wallet flow.
4. Theme and locale preferences persist through AsyncStorage.
5. NetInfo supplies connection state and the Scan route owns the user-initiated camera permission request.
6. Android Product Acceptance builds and exercises the product shell on a headless emulator.

See [`product-app-acceptance.md`](product-app-acceptance.md) for the automated gate and
manual release boundary.

## Product-App Acceptance Checklist

The emulator workflow now covers launch, primary/secondary navigation, Android Back,
locale persistence and evidence capture. The following remain physical-device release
acceptance because CI cannot credibly claim human assistive-technology behavior:

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
