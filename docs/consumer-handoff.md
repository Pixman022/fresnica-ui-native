# Consuming the Native UI package (phase-one handoff)

`@fresnica/ui-native` is a reusable React Native UI package. It does not provide
wallet accounts, routes, storage, network requests or key management. The package
is currently **private and not published to npm**. The phase-one `1.0.0` version is a
repository baseline; the current verified internal integration candidate is `1.1.0-rc.1`,
not a published registry release.

## Layout review and retained evidence

The archived [2026-10-15 iOS layout review](visual-baselines/ios-layout-review-2026-10-15.md)
links the retained baseline PNG/metadata files and original technical review. The current
[2026-10-19 extreme Dynamic Type review](visual-baselines/ios-layout-review-2026-10-19.md)
records the later Q03 Header optimization and its owner-decision boundary; Q05 interaction evidence
is summarized in the [2026-10-20 quality-maintenance status](quality-maintenance-ios-experience-status-2026-10-20.md).
The project owner approved the current Q03 (second) extreme-Dynamic-Type Header layout on
2026-10-20. The broader iOS Golden Baseline remains unapproved; color/contrast and physical-device
acceptance retain their deferred status.

## Supported baseline

- React Native CLI `0.87.0`, React `19.2.3`, Node.js `>=22.13.0`.
- React Native design-system package with Android support and the current Simulator-backed iPhone
  component-support baseline; Android minSdk 26; TypeScript with generated declarations.
- Light, Dark and System theme resolution with host-provided system appearance.
- English and Simplified Chinese labels supplied by the consuming application.
- Semantic tokens originate in [`Pixman022/fresnica-ui`](https://github.com/Pixman022/fresnica-ui).
  Never edit `src/generated-token-contract.ts` by hand.

## Install from an immutable source revision

Check out the Native repository at an explicitly approved **full commit SHA**.
For each release candidate, record the SHA and resulting archive checksum in
the consuming project's dependency review.

```bash
git clone https://github.com/Pixman022/fresnica-ui-native.git
cd fresnica-ui-native
git checkout <APPROVED_FULL_COMMIT_SHA>
npm ci
npm test
npm run build
npm pack --pack-destination .
```

For the current verified quality-maintenance/iOS-support candidate, use Native source
`1afeac9cab5c55e4baeb0e99514c933722935da0`. Its CI-generated output archive is
`fresnica-ui-native-1.1.0-rc.1.tgz` with SHA-256
`341c1cc84590b802d2f8457500b6a30467417c5cf8670b62e54031e1a9313569`.
The [current candidate record](delivery-candidate-ios-2026-10-20.md) pins main CI run
`39352213975` and delivery artifact `12233551785`. The same private version string was used for
earlier candidates, so consumers must pin this exact source SHA and checksum.
Copy that archive to the consumer's internal artifact location; do not commit
generated `dist/` to the source repository or infer a package version from
the changing `main` branch.

In a separate React Native `0.87.0` host:

```bash
npm install --save-exact /absolute/path/to/fresnica-ui-native-1.1.0-rc.1.tgz
npx tsc --noEmit
```

The host must already provide compatible `react` and `react-native` peer
dependencies. Do **not** install this repository directly from its Git URL:
the published package entry points resolve to generated `dist/` files that
are emitted by `npm run build`, not committed in Git.

The package tarball contains `dist/`, README, LICENSE and third-party
notices. It intentionally does not include `product/` or `example/`.

## Theme and UI contract

```tsx
import { Button, resolveTheme } from '@fresnica/ui-native';

const theme = resolveTheme(preference, systemAppearance);

return <Button theme={theme} label={labels.continue} onPress={onContinue} />;
```

The host resolves the `systemAppearance` argument to `light` or `dark`,
owns persistence and supplies translated labels. A host may instead inject any complete
`AppTheme` into `FresnicaUiProvider` or an individual component. The component package
does not select images, crop them, extract colors, generate themes from them or persist the
result; those are consumer-application responsibilities. Shared components must not manage
wallet transactions, navigation or storage.

## Independent consumer verification

This repository's `example/` Preview is a separate generated React Native
application. The normal bootstrap already exercises the archive route: it
builds the package, runs `npm pack`, installs the archive into the generated
host and typechecks that host during the Android Preview workflow.

```bash
npm run example:bootstrap
cd example/FresnicaPreview
npx tsc --noEmit
```

On changes to package entry points or peer dependencies, review the latest
[Android Preview workflow](../.github/workflows/android-preview.yml) result
for the exact commit. For iPhone design-system support, also review the pinned
[iOS Simulator evidence manifest](visual-baselines/ios-simulator-evidence-manifest.json), the
[current Q03 layout review](visual-baselines/ios-layout-review-2026-10-19.md), and the current iOS
Preview/reachability workflows. The Q05 iOS interaction workflow additionally exercises a real
software-keyboard action, long-content scrolling/action activation and Modal open/close in
Simulator using XCUITest. CI also runs the packed-package contract after build,
verifying the root and `./locales` exports, React/RN peer versions, required
distribution/license files, and exclusion of source/example/product paths.
A passing TypeScript build proves basic package imports, not visual parity or
physical-device accessibility.

## Cross-repository token update protocol

The Native repository records its exact Web source in `token-source.lock.json`.
The lock contains the full Web commit SHA plus Git blob SHAs for
`design-system/tokens.json` and `design-system/platform-token-source.json`.

1. Make an approved token/semantic-role change only in the Web
   `fresnica-ui/design-system/tokens.json` or
   `design-system/platform-token-source.json`, and merge/approve that Web revision first.
2. Check out `fresnica-ui` and `fresnica-ui-native` as **sibling directories**.
   Check out Web at the exact commit recorded in `token-source.lock.json`.
3. Run `npm run test:source-contract` from the Native directory. The check fails
   if Web HEAD differs from the lock, either locked file has a different Git blob SHA,
   or the committed generated Native contract is stale.
4. For an intentional Web Token update, update the lock commit/blob SHAs in the
   Native PR, run `npm run generate:tokens`, and review the generated diff.
5. Test light/dark behavior and submit the Native PR with the Web commit SHA,
   mapping rationale, generated diff and CI evidence. Do not change the approved
   Web visual baseline from Native.
6. Native CI uses the same immutable Web revision as the lock. A later Web `main`
   change does not alter an existing Native CI run; updating the source requires an
   explicit Native lock-file change.

This keeps synchronization reviewable without adding a cross-repository service.

## Deliberate non-goals

There is no npm registry publication requirement in phase one and no wallet App release gate.
The current Simulator-backed iPhone design-system support does **not** claim physical-device
VoiceOver, real keyboard/autofill, iPad, color/contrast or wallet-product acceptance. Use the
[current quality-maintenance candidate record](delivery-candidate-ios-2026-10-20.md) for the
current pinned `1.1.0-rc.1` archive identity. The 2026-10-15 and 2026-10-12 candidate records
remain historical identities and are not silently rewritten. Keep deferred physical-device accessibility in its separate integration gate.
