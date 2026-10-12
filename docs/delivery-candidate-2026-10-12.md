# Fresnica Native UI Delivery Candidate — 2026-10-12

## Candidate identity

This record freezes the internal integration candidate produced by NU08.

- Package: `@fresnica/ui-native`
- Version: `1.1.0-rc.1`
- Archive: `fresnica-ui-native-1.1.0-rc.1.tgz`
- SHA-256: `54913d4c4466d3cd5744b41d878a3af54344728bda30dc3592ccef2c07fd834f`
- Package-bearing Native SHA: `7182872be5c1557bc332d270bf3a5e7cec48c409`
- Locked Web Token SHA: `15d49e0be28a232ae6de2a7285a3a77add8c87d4`
- React peer: `19.2.3`
- React Native peer: `0.87.0`
- Node: `>=22.13.0`
- CI evidence: run `38197192843`

The package-bearing SHA is intentionally the commit used to generate and hash the archive.
This documentation record is added afterwards and is not part of the package `files` list,
so recording the checksum does not alter the verified archive.

## Verification completed

The candidate CI run completed successfully for:

- standalone type, format, script, theme, contrast, contract and render checks;
- immutable Web Token source verification;
- TypeScript package build;
- packed-package contract verification;
- real `npm pack` archive generation;
- delivery metadata generation;
- 90-day GitHub Actions artifact upload.

The packed-package contract verified 67 files, package root and `./locales` exports, peer
dependency contracts, required README/LICENSE/third-party notices, and exclusion of source,
tests, scripts, Preview and historical product files.

Android Preview, Android Emulator Acceptance and Android Product Acceptance all passed on the
NU08 implementation head before the delivery PR was merged. PR #66 is merged as
`b51ac540646e7a798183a797bf32793e0bbcc2d7`.

## Scope and release meaning

This is a **private internal integration candidate**. It is not:

- an npm registry publication;
- a public or production release;
- a wallet-product implementation or approval;
- an iOS support claim;
- full physical-device/TalkBack accessibility certification;
- a reduced-motion certification;
- a resolution of the documented brand-green/white-text contrast limitation.

The owner-approved palette and current Modal `fade` policy remain unchanged.

## Consumer use

A consuming App should use the exact verified archive or reproduce it from the package-bearing
Native SHA, and should retain the archive SHA-256 plus the locked Web Token SHA in its dependency
review. Do not infer a stable release from `main` or from the `1.1.0-rc.1` label alone.
