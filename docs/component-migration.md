# Component Migration Map

The native package is a shared primitive layer for the future Fresnica Mobile
application. It does not own wallet features.

## Shared primitives

`Button`, `Field`, `StateView`, `Screen`, `Header`, `ListRow`, `Modal`,
`Typography`, `IconButton`, `Divider`, `StatusBadge`, `InlineMessage`,
`Skeleton`, `Progress` and `SegmentedControl` are shared primitives. Their
contracts define props, visual states, callbacks, accessibility roles and
minimum-width behavior. Product copy and business state are injected by the host app.

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
