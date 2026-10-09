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

1. Make an approved token/semantic-role change only in the Web
   `fresnica-ui/design-system/tokens.json` or
   `design-system/platform-token-source.json`.
2. Check out `fresnica-ui` and `fresnica-ui-native` as **sibling
   directories**, at the exact reviewable Web and Native commits.
3. Run `npm run test:source-contract` from the Native directory.
4. If the check detects intentional drift, run `npm run generate:tokens`
   in Native, review the generated diff and test both light/dark behavior.
5. Submit a Native PR with the Web commit SHA, mapping rationale, and CI
   evidence; do not change the approved Web visual baseline from Native.
6. Re-run the Native CI manually through GitHub Actions **Run workflow** when
   a Web-only source update needs validation before Native code changes.
   Native CI checks out the current Web main branch and verifies generation;
   a `main` push in Web alone does not automatically launch Native CI.

This protocol avoids adding a separate Web-to-Native synchronization service
until a real maintenance need justifies one.

## Deliberate non-goals

There is no npm registry publication requirement in phase one, no wallet App
release gate, and no claim of device-level TalkBack acceptance or Mainnet
security review. Continue to use the [delivery plan](ui-library-delivery-plan.md)
for the remaining UI-only acceptance work.
