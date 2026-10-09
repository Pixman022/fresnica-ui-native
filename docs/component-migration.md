# Component Migration Map

The native package is a shared primitive layer for the future Fresnica Mobile
application. It does not own wallet features.

## Shared primitives

`Button`, `Field`, `StateView`, `Screen`, `Header`, `ListRow`, `Modal`,
`Typography`, `IconButton`, `Divider`, `StatusBadge`, `InlineMessage`,
`Skeleton`, `Progress` and `SegmentedControl` are shared primitives. Their
contracts define props, visual states, callbacks, accessibility roles and
minimum-width behavior. Product copy and business state are injected by the host app.

## Current readiness verdict — 2026-10-09

The [five-page coverage review](wallet-ui-component-coverage.md) maps the current Web
Wallet Home, Transfer, Activity, Settings and Swap examples to these primitives. No
shared primitive is currently required to start wallet UI integration.

- Search remains composable with `Field.leading`; Home exposes a search entry action,
  while Activity is the only reviewed inline search field, so `SearchField` does not yet
  meet the two-Feature promotion rule.
- `Field` already supports `secureTextEntry`, `autoCapitalize` and `autoCorrect`;
  no current Web Import/Unlock example exists, so `SecureField` is not justified yet.
- Wallet asset rows, transaction rows, amount panels and selectors remain Feature-local.
- Image-derived theming is not required for the current product direction.

## Next candidates

| Candidate                     | Recommendation                     | Entry criteria                                                             |
| ----------------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| `SearchField`                 | Adapt from field patterns          | A second feature needs the same search semantics and clear action.         |
| `SecureField`                 | Add as a native primitive          | Keyboard, autofill and screenshot policy is agreed by the App shell.       |
| `Toast` / `Announcement`      | Add as a host-integrated primitive | Announcement timing and screen-reader queue policy are documented.         |
| `BottomSheet` / `ActionSheet` | Add after modal review             | Native gesture, back handling and focus restoration are tested on Android. |

## Feature-local components

Keep slide-to-authorize, mnemonic verification, account picker, activity/trustline
row, memo editor, transaction review/result, QR receive/scanner and hardware
signer presentation inside their feature. They encode wallet workflows, security
policy or domain state and should not couple the design system to product behavior.

## Web-only or deferred

`Table`, `Pagination`, `DatePicker`, `TimePicker`, `BackTop`, `Cursor`,
`Typewriter`, `CodeBlock` and `Footer` remain Web-only for the Android-first scope.

Promote a feature component only after two features share the same interaction,
the public props contain no wallet-specific nouns, labels are caller-injected,
TalkBack/Dynamic Type/keyboard/320 dp behavior is specified, and a contract test
plus an owner exist.
