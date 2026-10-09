# Wallet Threat Model (Engineering Draft)

Status: **draft — not a release security review or sign-off**. Scope: Android product App, Stellar Testnet only.
Mainnet creation, signing and submission remain out of scope and disabled.

## Assets and trust boundaries

- **Secret seed:** entered transiently during import or generated on the device; stored using Android Keystore-backed Keychain, not AsyncStorage.
- **Public account metadata:** stored locally in AsyncStorage and must not be treated as signing authority.
- **Reviewed payment intent:** recipient and amount shown in Send before authentication; only the matching native-XLM transaction may be signed.
- **Signed transaction:** created locally after device authentication, passed directly to Testnet Horizon without rendering signed XDR in the UI.
- **External network:** HTTPS Testnet Horizon is outside the device trust boundary; network errors do not prove that submission failed.

## Threats, current controls and remaining risk

| Threat | Existing control | Remaining release work |
| --- | --- | --- |
| Extracting a stored secret | Android Keystore-backed Keychain and biometric/passcode access control | Confirm hardware/device behavior and backup/recovery policy |
| Substituting a payment or changing the approved amount | Signing verifies the local source, one native-XLM payment, reviewed recipient/amount and expected fee | Physical-device verification of review readability; formal security review |
| Exposing an imported secret through screen capture or recents | Import uses a secure text input and avoids logging the secret | Decide and verify screenshot/recents protection, including import-screen backgrounding |
| Duplicate payments after uncertain network responses | Each prepared transaction has a Stellar sequence number; the App does not automatically retry submission | Define retry, transaction-status reconciliation and duplicate-submission policy |
| Compromised or unavailable Horizon endpoint | Current implementation uses the fixed Stellar Testnet HTTPS Horizon endpoint | Approve production node trust, failover, availability and custom endpoint policy |
| Device loss or App uninstall | Generated accounts are explicitly disposable Testnet wallets without export | Decide secure backup/export/recovery before any Mainnet wallet |
| Faulty device authentication or insecure system UI | Android Keychain requests device authentication before secret retrieval | Complete physical-device biometric/passcode and accessibility acceptance |
| Unsafe dependency or build changes | GitHub CI and Android Product Acceptance validate build and hostless wallet tests | Review dependencies and threat model independently before release |

## Verification boundaries

- CI wallet smoke tests construct local XDR and reject unauthorized signing intents without obtaining real funds or submitting transactions.
- Automated Android acceptance checks navigation, localization and APK build. It does **not** validate hardware-backed Keychain behavior, physical biometrics or transfer submission.
- Real Testnet payments require separate, explicitly authorized end-to-end testing. No Mainnet operation is permitted.
- This document records threats and engineering mitigations, **not** approval for Mainnet or production funds.

## Open decisions tracked by Issue #22

1. Production wallet backup, recovery and secret-export UX.
2. Screenshot/recents handling for sensitive surfaces.
3. Network timeout, transaction-status reconciliation and safe retry / duplicate-submission behavior.
4. Production Horizon/provider trust, availability and custom endpoint configuration.
5. Physical-device authentication acceptance and independent security review sign-off.

These decisions must be resolved separately; this draft does not choose them on behalf of the product owner.
