# Historical Android App Shell Plan

> Historical product-prototype record. The active repository scope is the reusable
> `@fresnica/ui-native` package plus the neutral `example/` Preview. The `product/` host and
> its wallet flow are retained for reference and manual reproduction only; they do not gate
> current package Maintenance.

This repository contains two on-demand React Native 0.87 hosts:

- `example/` is the active primitive Preview Host.
- `product/` is the historical product App shell and wallet slice.

Both consume `@fresnica/ui-native` without moving product responsibilities into the
component package.

## Boundary

- The product App owns `NavigationContainer`, native stack/bottom tabs, persistence and feature routes.
- `react-native-safe-area-context` owns insets; screens must not guess status-bar heights.
- `StatusBar` appearance is driven from `AppTheme.systemBars`; product release acceptance must also verify the Android navigation bar on a physical device.
- `Appearance` resolves the platform result passed to `resolveTheme('system', mode)`.
- The product localization layer owns English/Simplified Chinese labels and accessibility copy.
- Android permissions, keyboard policy and hardware integration remain product-App responsibilities.

## Historical implementation snapshot

1. The reusable package and Preview Host remain independently buildable.
2. `product/App.tsx` owns the primary Home / Activity / Scan / Explore / Settings tabs.
3. A native-stack Send route provides the first secondary wallet flow.
4. Theme and locale preferences persist through AsyncStorage.
5. NetInfo supplies connection state and the Scan route owns the user-initiated camera permission request.
6. The manual Android Product Acceptance workflow can build and exercise the historical product
   shell on a headless emulator when explicitly requested.

See [`product-app-acceptance.md`](product-app-acceptance.md) for the retained manual workflow and
historical product-release boundary.

## Product-App Acceptance Checklist

When the historical emulator workflow is explicitly run, it covers launch,
primary/secondary navigation, Android Back, locale persistence and evidence capture. The following
would remain physical-device product-release acceptance if this prototype were ever resumed; they
are not current component-library tasks:

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
