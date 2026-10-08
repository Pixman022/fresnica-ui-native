# Fresnica Product App Shell

The `product/` directory contains the committed source for the first Android product shell.
The generated React Native CLI host lives at `product/FresnicaWallet/` and is intentionally
ignored.

The shell uses the approved Android-first baseline:

- React Native 0.87
- React Navigation 7 native stack + bottom tabs
- Fresnica `@fresnica/ui-native` primitives
- English and Simplified Chinese app-owned copy
- Light, Dark and System theme resolution
- AsyncStorage for theme/locale preferences
- NetInfo for connection state
- Android camera permission requested only from the Scan route

Run:

```sh
npm run product:bootstrap
npm run product:android
```

For a compile-only check:

```sh
npm run product:android:build
```

## Current product slice

The root stack contains the five primary wallet destinations defined by the Fresnica
navigation hierarchy: Home, Activity, Scan, Explore and Settings. A secondary Send route is
implemented as the first focused task flow.

The Home route intentionally uses demo wallet data. No secret material, signing, key
management, transaction submission or production networking is implemented in this slice.
Those capabilities require explicit product and security specifications before implementation.

See [product app acceptance](../docs/product-app-acceptance.md) for the automated and manual
acceptance boundary.
