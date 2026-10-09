# Native component dimension audit

Scope: the 15 exported `src/components/*.tsx` primitives in the
Android-first `@fresnica/ui-native` package, evaluated against the typed
`AppTheme.spacing`, `AppTheme.radii` and `AppTheme.sizes` roles.
This work does not change palette values, API props or Web Token 1.0.0.

## Mapped to existing shared dimensions

| Primitive | Previous local numbers | Mapped Native roles |
| --- | --- | --- |
| Button | horizontal 16, vertical 8, gap 8 | `spacing.lg`, `spacing.sm` |
| InlineMessage | padding 12, gap 8, radius 12, border 1 | `spacing.md`, `spacing.sm`, `radii.control`, `sizes.border` |
| StatusBadge | border 1, pill radius 9999 | `sizes.border`, `radii.pill` |
| StateView | padding 24, gap 8, action top 8 | `spacing.xl`, `spacing.sm` |

The approved Native token values produce **the same dimensions** as the
previous local constants. Source-based component contract checks now guard
these mappings, alongside existing Jest/React Native render tests.

## Intentional local component metrics

The following values are **not silently remapped** simply because their
numeric value happens to equal a token:

- Minimum interactive targets of 44dp in buttons, rows and header actions
  are an Android accessibility contract, not a generic spacing token.
- Header minimum height 56dp, ListRow 64dp and compact status height 28dp
  reflect component-specific layout constraints.
- Field supporting-text line height 18 and wrapper gap 6, ListRow copy gap
  3, Modal maximum width 480 and Progress track geometry are component-
  specific until there is an approved reusable semantic dimension.
- `transparent` backgrounds, Native hairline separators and overlay
  percentages are platform styling rules, not arbitrary hardcoded brand colors.

The existing exported component source does not contain hex literals for
theme palette colors: theme-dependent colors use `theme.colors`. Any
future shared dimension should be added to the reviewed Web/Native Token
source before components consume it.

## Verification boundaries

- Run `npm test` to assert current theme-aware component contracts.
- Run `npm run test:source-contract` with the Web source checked out as a
  sibling directory to verify generated values.
- Use Android Preview/Emulator Acceptance for unchanged layouts at narrow
  widths; source-level equivalence is **not** a visual regression pass.
- The current contrast findings and design decisions are tracked separately
  in [Native contrast audit](native-contrast-audit.md).

This is task **DS-06** of the [UI delivery plan](ui-library-delivery-plan.md);
it does not extend or validate any wallet product behavior.
