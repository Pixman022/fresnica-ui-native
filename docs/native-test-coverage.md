# Native package coverage baseline

Status: enforced package-level Jest coverage gate.

This baseline measures the hostless package tests that run against the repository's React Native
primitive mock. It does not represent iOS Simulator, Android Emulator or physical-device coverage.

## Measured baseline

CI run `39215774421` on the Q04 implementation recorded 45 passing Jest tests and:

| Metric | Measured | Initial gate |
| --- | ---: | ---: |
| Statements | 97.74% | 97% |
| Branches | 86.97% | 86% |
| Functions | 96.66% | 96% |
| Lines | 97.69% | 97% |

The gate uses each measured metric's integer floor. Future changes must not lower these thresholds
to make a regression pass.

## Source denominator

Coverage includes:

- all runtime files under `src/components/`;
- `src/theme.ts`;
- `src/ui-context.tsx`;
- `src/locales.ts`.

The generated `src/generated-token-contract.ts` is excluded because its source-of-truth and
generated-output integrity are already enforced by the token source contract. `src/tokens.ts`
contains only TypeScript type declarations, and `src/index.ts` is the public re-export barrel;
neither is added to the runtime coverage denominator.

## Critical branch coverage

The package tests explicitly exercise:

- Header default and iOS accessibility-size behavior, empty-side-slot reclamation, a real back
  action, and Android large-font behavior;
- ListRow iOS accessibility-size trailing stacking and Android non-stacking behavior;
- Field disabled precedence, secure-input passthrough, input events and refs/identifiers;
- Modal close control, native request-close callback and public close-control ref;
- Provider theme/locale updates and explicit overrides;
- explicit and system Light/Dark theme resolution;
- Progress bounds and NaN normalization.

The React Native mock exposes resettable platform and font-scale controls. Component tests restore
both after each test so one platform branch cannot leak into the next case.

## Boundary

A green coverage gate proves package logic executed under Jest. Native layout, keyboard behavior,
focus restoration and other device behavior still require the existing Simulator/Emulator evidence
layers. Physical-device accessibility remains deferred.
