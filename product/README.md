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
- Stellar Testnet wallet core
- Android Keystore-backed local secret storage
- device-authenticated local signing boundary

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

The Home route still uses demo balances. Settings now exposes a Testnet-only non-custodial
wallet setup surface. A generated Testnet wallet is disposable and is not exported; an existing
Stellar Testnet secret may be imported through a secure field. Secret material is written to
Android Keystore-backed storage and is never returned by the UI.

The Send route can now prepare a native-XLM payment by loading the local account sequence from
Stellar Testnet Horizon. Review is separated from signing: the final action requests device
authentication, signs locally with the Keystore-protected secret and submits the signed transaction
to Stellar Testnet Horizon. Raw secrets and signed XDR are never displayed.

Mainnet signing and submission remain disabled until the remaining release security decisions and
physical-device checks are complete.

See [product app acceptance](../docs/product-app-acceptance.md) and
[wallet security](../docs/wallet-security.md) for the automated/manual acceptance and security
boundaries.
