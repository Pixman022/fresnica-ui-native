# Historical Wallet Threat Model (Engineering Draft)

Status: **historical draft — not a release security review or sign-off**. Scope: retained Android
product prototype, Stellar Testnet only. This is not a current `@fresnica/ui-native` Maintenance
workstream. Mainnet creation, signing and submission remain out of scope and disabled.

## Assets and trust boundaries

- **Secret seed:** entered transiently during import or generated on the device; stored using Android Keystore-backed Keychain, not AsyncStorage.
- **Public account metadata:** stored locally in AsyncStorage and must not be treated as signing authority.
- **Reviewed payment intent:** recipient and amount shown in Send before authentication; only the matching native-XLM transaction may be signed.
- **Signed transaction:** created locally after device authentication, passed directly to Testnet Horizon without rendering signed XDR in the UI.
- **External network:** HTTPS Testnet Horizon is outside the device trust boundary; network errors do not prove that submission failed.

## Threats, historical prototype controls and remaining risk

- **Stored secret extraction:** Android Keystore-backed Keychain requests biometric/passcode access.
  Physical-device behavior and production backup/recovery still require acceptance.
- **Payment substitution:** signing checks the local source, one native-XLM payment, reviewed recipient/amount
  and expected fee. Review readability and independent security approval are outstanding.
- **Import screen leakage:** import uses a secure text input without logging the secret.
  Screenshot/recents behavior, including backgrounding, still needs a policy and verification.
- **Duplicate submission after a network error:** prepared transactions use Stellar sequence numbers
  and the App has no automatic submission retry. Reconciliation and safe retry remain undecided.
- **Untrusted or unavailable Horizon:** the current endpoint is the fixed Stellar Testnet HTTPS server.
  Production node trust, failover, availability and custom endpoint policy still need approval.
- **Device loss or App uninstall:** generated Testnet wallets are disposable and lack export.
  Secure backup and recovery must be designed before Mainnet creation.
- **Authentication or system UI failure:** Android Keychain requests local authentication.
  Physical-device passcode/biometric and accessibility acceptance are still required.
- **Unsafe dependencies or build changes:** the retained manual Android Product Acceptance workflow
  can still check the historical build and wallet smoke tests when explicitly run. It is not a
  required package gate. Release dependency review and independent threat-model sign-off were not completed.

## Verification boundaries

- The retained wallet smoke test can construct local XDR and reject unauthorized signing intents without obtaining real funds or submitting transactions.
- The manual Android product workflow can check navigation, localization and APK build. It does **not** validate hardware-backed Keychain behavior, physical biometrics or transfer submission.
- Any future real Testnet payment testing requires a separate, explicitly authorized product-scope decision. No Mainnet operation is permitted.
- This document records threats and engineering mitigations, **not** approval for Mainnet or production funds.

## Historical open product decisions tracked by Issue #22

1. Production wallet backup, recovery and secret-export UX.
2. Screenshot/recents handling for sensitive surfaces.
3. Network timeout, transaction-status reconciliation and safe retry / duplicate-submission behavior.
4. Production Horizon/provider trust, availability and custom endpoint configuration.
5. Physical-device authentication acceptance and independent security review sign-off.

These decisions were not resolved by this historical draft. They do not block current UI-library
Maintenance and would need to be reconsidered only if wallet-product development is explicitly resumed.
