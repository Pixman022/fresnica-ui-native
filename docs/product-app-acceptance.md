# Product App Android Acceptance

The first product App shell is committed under `product/`. It is separate from the reusable
component package and from the primitive-only Preview host.

## Automated product gate

`.github/workflows/android-product-acceptance.yml` generates a clean React Native 0.87
host, installs the current local `@fresnica/ui-native` build plus the approved App-shell
dependencies, typechecks the host, builds the Android APK, starts a headless emulator and
runs a focused product flow.

The flow verifies:

1. the Home route launches and exposes the Fresnica wallet shell;
2. the Send action opens the secondary Transfer route;
3. Android Back returns to the primary navigation shell;
4. Settings can switch the App-owned locale to Simplified Chinese;
5. the selected locale survives an Android process restart through AsyncStorage;
6. an evidence bundle can be captured and validated for the exact source revision.

The acceptance profile uses 320dp, font scale 1.3 and Dark system appearance so the product
slice is exercised under the existing narrow/large-text stress baseline.

## Implemented host responsibilities

- React Navigation 7 native stack and bottom tabs
- safe-area composition
- dynamic status-bar contrast from `AppTheme`
- Light, Dark and System theme resolution
- English and Simplified Chinese App-owned strings
- persisted theme and locale preferences
- connection-state reporting through NetInfo
- user-initiated Android camera permission request on the Scan route
- reduced-motion preference observation
- Android Back handling through the navigation stack
- scrollable transfer fields for keyboard reachability

## Security boundary

The first wallet route contains non-sensitive demo balances and an abbreviated demo address.
It does not create or import wallets, hold mnemonic phrases or private keys, sign payloads,
submit transactions or connect to a production wallet backend.

Those behaviors must not be added until their domain model, secure storage, signing boundary,
network/API contract and recovery policy are explicitly approved.

## Manual device checks still required before a product release

Automation cannot claim human assistive-technology acceptance. Before a release candidate,
run the product App on at least one supported physical Android device and record:

- TalkBack reading/focus order;
- system navigation-bar contrast;
- on-screen keyboard reachability on the Transfer route;
- large-text wrapping at the supported maximum;
- reduced-motion behavior;
- camera permission allow/deny behavior;
- long English and Simplified Chinese copy;
- absence of horizontal overflow at 320dp.

These are release acceptance tasks, not blockers for keeping the product shell source and
automated emulator gate in the repository.
