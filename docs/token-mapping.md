# Cross-platform Token Mapping

This document records the Web-to-React-Native token contract.

- Source of truth: `fresnica-ui/design-system/tokens.json` (`1.0.0`).
- Native output: `scripts/generate-native-token-contract.mjs` produces `src/generated-token-contract.ts`.
- Native Light/Dark colors and their semantic role mapping come from
  `fresnica-ui/design-system/platform-token-source.json` and are generated with the same command.
- App shell owns system appearance, system bars, safe-area insets and localization.
- Theme preferences are host-local. A Web dark-mode choice does not change the Native mode,
  and Native mode changes do not update Web.
- There is no generic `secondary` action color in this baseline. `contentSecondary` is
  supporting content only, and `accentBlue` is reserved for network information; do not
  map either role to a generic secondary button without a new product decision.

The first migration keeps existing Web visual values unchanged. Any platform value
override must be recorded here with an accessibility reason and native test coverage.

| Web primitive                                      | Current RN value                 | Mapping                                            |
| -------------------------------------------------- | -------------------------------: | -------------------------------------------------- |
| `space.xs / sm / md / lg / xl`                     | `4 / 8 / 12 / 16 / 24` dp        | Adopt                                              |
| `radius.sm / control / base / lg / pill`           | `8 / 12 / 16 / 24 / 9999` dp     | Adopt                                              |
| `size.control-sm / compact / base / emphasis / lg` | `32 / 36 / 48 / 52 / 56` dp      | Adopt; hit target remains 44 dp                    |
| `border.width-default`                             | `1` dp                           | Adapt to numeric RN border width                   |
| `font.size-*`                                      | `14 / 13 / 15 / 18 / 20 / 48` sp | Adopt with font scaling                            |
| `font.family-*`                                    | Host font stack                  | Adapt per platform                                 |
| `motion.duration-*`                                | Host duration in ms              | Adapt; product gate owns reduced-motion acceptance |
| `shadow.base`                                      | No shared elevation token        | Defer; Web baseline is `none`                      |

| Semantic role                               | `AppTheme.colors`                        |
| ------------------------------------------- | ---------------------------------------- |
| `background-canvas`                         | `background`                             |
| `surface-default`                           | `surface`                                |
| `surface-raised`                            | `surfaceRaised`                          |
| `content-primary`                           | `contentPrimary`                         |
| `content-secondary`                         | `contentSecondary`                       |
| `content-muted` / `content-disabled`        | `contentMuted`                           |
| `border-default`                            | `border`                                 |
| `border-light` / `border-subtle`            | `separator`                              |
| `action-primary`                            | `primary`                                |
| `action-primary-pressed`                    | `primaryPressed`                         |
| `content-on-primary`                        | `onPrimary`                              |
| `accent-purple` / `accent-purple-container` | `accentPurple` / `accentPurpleContainer` |
| `accent-blue` / `accent-blue-container`     | `accentBlue` / `accentBlueContainer`     |
| `accent-orange` / `accent-orange-container` | `accentOrange` / `accentOrangeContainer` |
| `accent-yellow` / `accent-yellow-container` | `accentYellow` / `accentYellowContainer` |
| `feedback-success`                          | `positive`                               |
| `feedback-error` / `feedback-failure`       | `negative`                               |
| `feedback-warning`                          | `warning`                                |
| `overlay-scrim`                             | `overlay`                                |
| `background-canvas`                         | `statusBar` / `navigationBar`            |

CSS variable strings are never passed to React Native. Keep existing `--Fresnica-*`
aliases in Web, and do not import DOM/CSS/Less modules into the native package.
Native values are explicit adapter outputs, not a shared runtime theme store. Android dynamic
accent and image-derived colors are not part of the current Fresnica product direction; reintroduce
either only after a new explicit product decision.

The current shared `Modal` keeps its owner-approved native `fade` behavior. This token contract
must not be read as a claim that the component package has passed reduced-motion acceptance;
full reduced-motion behavior is reassessed at the future product integration/release gate.
