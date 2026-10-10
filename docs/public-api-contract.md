# Public API and Migration Contract (NU01)

Status: frozen target contract for the Native component-library optimization plan.  
Baseline: `Pixman022/fresnica-ui-native@dfe7f8c2c44d9d4a066644dcc3a0c28a5d752f6c`.

This document defines the compatibility rules that NU02–NU05 must implement. It is
not a claim that every target API below already exists on the baseline commit.

## Compatibility principles

1. Existing component-level `theme={...}` calls remain valid.
2. Existing product copy remains caller-owned. The package only provides generic internal copy.
3. New configuration is additive within the 1.x line. Do not remove or rename current public exports.
4. No component spreads arbitrary Native props onto a root node. Native prop support is explicit by component.
5. Disabled/loading/accessibility state owned by the component cannot be re-enabled or contradicted by passthrough props.
6. Wallet-domain APIs, global theme setters, persistence, navigation and product formatting stay outside this package.

## Theme resolution

The effective theme priority is:

1. component `theme` prop;
2. nearest `FresnicaUiProvider` theme;
3. deterministic package fallback `themes.light`.

NU03 makes component `theme` props optional while preserving their current meaning.

`FresnicaUiProvider` uses React Context only. It must support reactive updates and
multiple independent React roots. It does not persist theme preference and does not read
Android dynamic accent colors.

`system` continues to be resolved by the host before an `AppTheme` reaches the provider.

### Existing usage remains valid

```tsx
const theme = resolveTheme(preference, systemAppearance);

return <Button theme={theme} label="Continue" onPress={submit} />;
```

### Provider usage

```tsx
const theme = resolveTheme(preference, systemAppearance);

return (
    <FresnicaUiProvider theme={theme} locale={enUS}>
        <Button label="Continue" onPress={submit} />
    </FresnicaUiProvider>
);
```

### Local theme override

```tsx
<FresnicaUiProvider theme={theme}>
    <Button label="Default provider theme" />
    <Button theme={alternateTheme} label="Local override" />
</FresnicaUiProvider>
```

The override applies only to that component subtree usage; it does not mutate provider state.

## Locale contract

The package locale contains only generic copy that the component itself owns.

The initial stable type is:

```ts
export type UiLocale = {
    close: string;
    loading: string;
};
```

Built-in packs:

- `enUS`
- `zhCN`

Stable language-pack import path:

```ts
import { enUS, zhCN } from '@fresnica/ui-native/locales';
```

Provider and hook exports remain available from the package root.

The effective locale priority is:

1. explicit component copy such as `closeAccessibilityLabel` or `loadingLabel`;
2. nearest provider locale;
3. `enUS`.

TypeScript consumers must pass a complete `UiLocale`. At runtime, a missing key falls
back to the corresponding `enUS` value and emits a development-only warning. Production
rendering must not fail solely because a JavaScript consumer supplied an incomplete locale.

Wallet names, field labels, validation reasons, amounts, dates, numbers and product messages
remain caller-owned.

## Field contract

NU02 extends `Field` from the current controlled wrapper into a typed `TextInputProps`
extension while retaining `label`, `supportingText`, `state`, `leading` and theme styling.

### State priority

Effective behavior is resolved in this order:

1. disabled: `state="disabled"` or native `editable={false}`;
2. error: `state="error"`;
3. focused: explicit `state="focused"` or internal focus state;
4. default.

Disabled always wins over `editable={true}`; passthrough props cannot re-enable a disabled
Field. Error styling wins over focus styling.

`state="default"` does not suppress real focus feedback.

### Native event behavior

`onFocus`, `onBlur` and `onSubmitEditing` are forwarded to the caller after/beside
the component's internal state handling. Internal focus tracking must not swallow caller events.

### Native prop boundaries

- `style` applies to the `TextInput` node.
- `containerStyle` applies to the outer Field wrapper.
- `testID` and `nativeID` apply to the `TextInput`.
- `containerTestID` targets the outer wrapper when a layout-level locator is required.
- the forwarded `ref` is a `TextInput` ref.
- caller `accessibilityLabel` overrides the visible `label` as the spoken input label.
- caller `accessibilityHint` overrides the automatic error/supporting hint.
- package-owned disabled state is merged last into `accessibilityState`.
- `accessible` and the input role remain package-owned and are not caller-overridable.

Do not add a generic Native-prop spread to the Field container.

### Native input example

```tsx
const amountRef = useRef<TextInput>(null);

<Field
    ref={amountRef}
    label="Amount"
    value={amount}
    onChangeText={setAmount}
    inputMode="decimal"
    keyboardType="decimal-pad"
    returnKeyType="done"
    maxLength={18}
    autoCorrect={false}
    onSubmitEditing={submit}
/>
```

## Button and IconButton boundaries

NU02 forwards refs to the underlying pressable host view for `Button` and `IconButton`.

Both components may expose `testID` and `nativeID` on the pressable node. They do not
gain an unrestricted `PressableProps` spread in NU02.

`Button loading` remains authoritative: `loading` implies disabled/busy and cannot be
overridden back to an interactive state.

NU04 may add `loadingLabel`; explicit `loadingLabel` overrides locale `loading`.
The current ellipsis is not a stable localization contract.

## Modal focus and close contract

`Modal` remains controlled by the caller through `visible` and `onRequestClose`.
`animationType="fade"` remains unchanged.

NU03 may make `closeAccessibilityLabel` optional by falling back to locale `close`.
Explicit copy still wins.

NU05 may expose a ref to the built-in close control so the host can choose an initial
focus target. The package does not own a global trigger stack and does not automatically
restore focus to an arbitrary external control.

The host retains the trigger ref and restores it after closing.

```tsx
const triggerRef = useRef<View>(null);

<Button ref={triggerRef} label="Open modal" onPress={() => setVisible(true)} />
<Modal visible={visible} title="Details" onRequestClose={() => setVisible(false)}>
    ...
</Modal>
```

The close button and Android system Back use the same `onRequestClose` contract. Device-level
focus restoration is still verified by the deferred physical-device acceptance gate.

## InlineMessage announcement ownership

To preserve the current 1.x behavior, `tone="error"` continues to expose alert semantics
unless the caller opts into passive delivery.

NU05 may add an explicit announcement mode with these meanings:

- `alert`: active alert semantics; the app must not separately announce the same message;
- `passive`: readable error/message text without active announcement.

Existing error rendering therefore remains compatible. New form flows that already own
announcement timing should explicitly choose passive mode.

A future default reversal would be a breaking behavior change and is not part of NU01–NU08.

## ListRow interaction contract

Two combinations are supported:

1. whole-row action: `onPress` is set and `trailing` is presentation-only;
2. independent trailing action: the row itself has no `onPress`; the trailing control owns its action.

Do not nest an independently actionable trailing control inside a row that is also exposed
as one accessible button. NU05 documents and tests both legal patterns; it does not add a
generic `trailingAction` subsystem.

## Public exports

The package root remains the component/theme entry point and gains only additive public
types/functions required by this plan, including provider/hooks and locale types.

The locale packs use the dedicated `./locales` subpath. Deep imports into `src/` or `dist/`
are not public API.

## Version and migration rule

The current repository version `1.0.0` is an unpublished baseline.

- additive optional props, provider/hooks, locale packs and additional supported native input
  props are compatible enhancements and may use a minor-version candidate;
- removing/renaming an export, changing an existing required prop incompatibly, or changing
  existing announcement defaults requires a major-version migration;
- implementation PRs must include a migration note when runtime behavior changes even if the
  TypeScript call site remains valid.

NU08 records the final candidate version, tarball checksum and immutable source SHA.

## Explicit non-goals for this contract

NU01 does not pre-design RTL support, a default size system, a reduced-motion policy,
iOS release support, image-derived themes, a secondary palette, wallet APIs or global
`setTheme`/`setLocale` functions.
