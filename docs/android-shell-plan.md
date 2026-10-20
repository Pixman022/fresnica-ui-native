# Android Host Boundary Record

This repository retains two React Native 0.87 host sources with different status:

- `example/` is the active primitive Preview Host for the reusable component package.
- `product/` is a historical wallet-product shell retained for reference.

Both consume `@fresnica/ui-native` without moving product responsibilities into the
component package. The historical product host is not a current package Maintenance or
delivery gate.

## Boundary

- The product App owns `NavigationContainer`, native stack/bottom tabs, persistence and feature routes.
- `react-native-safe-area-context` owns insets; screens must not guess status-bar heights.
- `StatusBar` appearance is driven from `AppTheme.systemBars`; product release acceptance must also verify the Android navigation bar on a physical device.
- `Appearance` resolves the platform result passed to `resolveTheme('system', mode)`.
- The product localization layer owns English/Simplified Chinese labels and accessibility copy.
- Android permissions, keyboard policy and hardware integration remain product-App responsibilities.

## Recorded product implementation

1. The reusable package and Preview Host remain independently buildable.
2. `product/App.tsx` owns the primary Home / Activity / Scan / Explore / Settings tabs.
3. A native-stack Send route provides the first secondary wallet flow.
4. Theme and locale preferences persist through AsyncStorage.
5. NetInfo supplies connection state and the Scan route owns the user-initiated camera permission request.
6. The retained Android Product Acceptance workflow can build and exercise the product shell on
   a headless emulator when explicitly started.

See [`product-app-acceptance.md`](product-app-acceptance.md) for the manual historical workflow
and its separate product-release boundary.

## Historical Product-App Acceptance Checklist

When manually run, the emulator workflow covers launch, primary/secondary navigation, Android Back,
locale persistence and evidence capture. The following remain unresolved historical product-release
acceptance items; they are not blockers for the reusable UI package:

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
