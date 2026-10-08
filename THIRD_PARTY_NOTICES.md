# Third-party notices

The MIT License in [`LICENSE`](./LICENSE) applies to Fresnica UI Native's
project-owned source code and documentation. Third-party packages keep their
own licenses.

## Runtime peer dependencies

| Dependency     | Use                      | License |
| -------------- | ------------------------ | ------- |
| `react`        | Component runtime        | MIT     |
| `react-native` | Native component runtime | MIT     |

## Product host security dependencies

These dependencies are installed only into the generated `product/FresnicaWallet` host. Their
exact versions are pinned in `scripts/bootstrap-product-app.mjs`.

| Dependency                       | Use                                       | License    |
| -------------------------------- | ----------------------------------------- | ---------- |
| `@stellar/stellar-sdk`           | Stellar Testnet keys/XDR/signing          | Apache-2.0 |
| `react-native-get-random-values` | React Native Web Crypto random-value shim | MIT        |
| `react-native-keychain`          | Android Keystore-backed secret storage    | MIT        |

## Development dependencies

| Dependency     | Use                           | License    |
| -------------- | ----------------------------- | ---------- |
| `@types/react` | React TypeScript declarations | MIT        |
| `prettier`     | Source formatting             | MIT        |
| `typescript`   | Type checking                 | Apache-2.0 |

Exact versions are recorded in `package-lock.json`. Re-run the dependency
license review after adding a package or bundling an external asset.
