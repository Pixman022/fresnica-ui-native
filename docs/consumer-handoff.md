# Consuming the Native UI package (phase-one handoff)

`@fresnica/ui-native` is a reusable React Native UI package. It does not provide
wallet accounts, routes, storage, network requests or key management. The package
is currently **private and not published to npm**; version `1.0.0` is a
repository baseline, not a published registry release.

## Supported baseline

- React Native CLI `0.87.0`, React `19.2.3`, Node.js `>=22.13.0`.
- Android-first, minSdk 26, TypeScript with generated declarations.
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

The output archive is normally named `fresnica-ui-native-1.0.0.tgz`. Copy
that archive to the consumer's internal artifact location; do not commit
generated `dist/` to the source repository or infer a package version from
the changing `main` branch.

In a separate React Native `0.87.0` host:

```bash
npm install --save-exact /absolute/path/to/fresnica-ui-native-1.0.0.tgz
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
owns persistence and supplies translated labels. Shared components must not
manage wallet transactions, navigation or storage.

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
for the exact commit. A passing TypeScript build proves basic package imports,
not visual parity or physical-device accessibility.

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

There is no npm registry publication requirement in phase one, no wallet App
release gate, and no claim of device-level TalkBack acceptance or Mainnet
security review. Continue to use the [delivery plan](ui-library-delivery-plan.md)
for the remaining UI-only acceptance work.
