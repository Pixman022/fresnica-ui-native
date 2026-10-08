# Wallet Security Boundary

Fresnica Native uses a non-custodial local-wallet architecture.

## Current scope

The current implementation is intentionally Testnet-only.

- Network: Stellar Testnet
- Secret custody: local device only
- Secret storage: `react-native-keychain` backed by Android Keystore
- Storage requirement: `SECURITY_LEVEL.SECURE_SOFTWARE` or stronger
- Authenticated storage: AES-GCM with biometric/device-passcode access control
- Randomness: `react-native-get-random-values` provides `crypto.getRandomValues` before Stellar SDK use
- Stellar implementation: `@stellar/stellar-sdk`
- Public metadata: AsyncStorage may contain the public key, network and custody mode
- Secret material: never written to AsyncStorage, logs, analytics or clipboard helpers

## Wallet creation and import

A generated wallet is a disposable Testnet development wallet. The secret is persisted directly
into the secure store and is not returned to the UI or exported.

Import accepts a Stellar secret seed through a secure text field. The seed is parsed to derive the
public key and is then written directly to the secure store. Invalid seeds fail without exposing
the input in error text.

Because uninstalling the App can erase Android secure storage, generated wallets are not suitable
for Mainnet until a production backup/recovery policy is approved.

## Signing boundary

The signing API retrieves the secret only from the secure store under device-authentication access
control. Before signing, the wallet core parses the XDR with the Stellar Testnet network passphrase
and verifies that the transaction source matches the local public key derived from the secret.

The Send flow loads the source sequence from Stellar Testnet Horizon, builds an unsigned native-XLM
payment, shows a review screen, then retrieves the local secret only after device authentication.
The signed transaction is submitted directly to Stellar Testnet Horizon. The UI does not expose the
secret or signed XDR, and Mainnet endpoints are not available in this slice.

## Mainnet gate

Mainnet signing and submission remain disabled until all of the following are complete:

- production backup/recovery/export policy;
- Mainnet creation/import UX and recovery acknowledgement;
- screenshot/recents policy for sensitive screens;
- retry and duplicate-submission policy;
- production Horizon/backend trust and availability policy;
- physical-device biometric/passcode acceptance;
- threat-model and security-review sign-off.

## Verification

Android Product Acceptance generates a clean React Native host, typechecks it, runs
`wallet-core-smoke.mts`, builds the APK and then runs the existing product-flow emulator gate.

The smoke check proves:

- Testnet key generation/import round-trips;
- a locally owned Testnet payment XDR can be signed;
- a transaction owned by another source is rejected;
- invalid Stellar secret seeds are rejected;
- zero, negative and values with more than seven XLM decimal places are rejected.

Biometric/passcode prompts and secure-store behavior still require physical-device acceptance.
