# Cross-platform Token Mapping

This document records the Web-to-React-Native token contract.

- Source of truth: `fresnica-ui/design-system/tokens.json` (`1.0.0`).
- Native output: `scripts/generate-native-token-contract.mjs` produces `src/generated-token-contract.ts`.
- App shell owns system appearance, system bars, safe-area insets and localization.

The first migration keeps existing Web visual values unchanged. Any platform value
override must be recorded here with an accessibility reason and native test coverage.

| Web primitive                                      |                 Current RN value | Mapping                          |
| -------------------------------------------------- | -------------------------------: | -------------------------------- |
| `space.xs / sm / md / lg / xl`                     |        `4 / 8 / 12 / 16 / 24` dp | Adopt                            |
| `radius.sm / control / base / lg / pill`           |     `8 / 12 / 16 / 24 / 9999` dp | Adopt                            |
| `size.control-sm / compact / base / emphasis / lg` |      `32 / 36 / 48 / 52 / 56` dp | Adopt; hit target remains 44 dp  |
| `border.width-default`                             |                           `1` dp | Adapt to numeric RN border width |
| `font.size-*`                                      | `14 / 13 / 15 / 18 / 20 / 48` sp | Adopt with font scaling          |
| `font.family-*`                                    |                  Host font stack | Adapt per platform               |
| `motion.duration-*`                                |              Host duration in ms | Adapt and honor reduced motion   |
| `shadow.base`                                      |        No shared elevation token | Defer; Web baseline is `none`    |

| Semantic role                         | `AppTheme.colors`  |
| ------------------------------------- | ------------------ |
| `background-canvas`                   | `background`       |
| `surface-default`                     | `surface`          |
| `surface-raised`                      | `surfaceRaised`    |
| `content-primary`                     | `contentPrimary`   |
| `content-secondary`                   | `contentSecondary` |
| `content-muted` / `content-disabled`  | `contentMuted`     |
| `border-default`                      | `border`           |
| `border-light` / `border-subtle`      | `separator`        |
| `action-primary`                      | `primary`          |
| `action-primary-pressed`              | `primaryPressed`   |
| `content-on-primary`                  | `onPrimary`        |
| `feedback-success`                    | `positive`         |
| `feedback-error` / `feedback-failure` | `negative`         |
| `feedback-warning`                    | `warning`          |
| `overlay-scrim`                       | `overlay`          |

CSS variable strings are never passed to React Native. Keep existing `--Fresnica-*`
aliases in Web, and do not import DOM/CSS/Less modules into the native package.
Do not use Android dynamic accent or image-derived colors in this phase.
