# Android App Shell Plan

The component package is ready to be consumed by an Android-first React Native app shell.
The shell is deliberately kept out of this package until the app repository and product routes
are established.

## Boundary

- The app owns `NavigationContainer`, native stack/bottom tabs, persistence and feature routes.
- `react-native-safe-area-context` owns insets; screens must not guess status-bar heights.
- `StatusBar` and Android navigation-bar appearance are driven from `AppTheme.systemBars`.
- `Appearance` resolves the platform result passed to `resolveTheme('system', mode)`.
- LocalizationProvider injects English or Simplified Chinese labels and accessibility copy.
- Android permission, keyboard and hardware integration remain app-owned.

## Build order

1. Create the React Native CLI Android app with the approved RN/Android baseline.
2. Add the approved shell dependencies and register the root providers.
3. Add a theme preview route using `Screen`, `Header`, `Button`, `Field`, `ListRow`, `Modal` and `StateView`.
4. Add accessibility and state tests at the app boundary.
5. Run Android emulator checks at 320, 360, 390–393 and 430 logical pixels.

No shell dependency is added to this component package until the app repository is ready.

## Product-App Acceptance Checklist

These checks are performed in the final Android product App,
not inside the component library repository.

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
