# iOS Field Input Examples

These examples document how a consuming iPhone host can configure the existing `Field`
contract. They do not add product policy or new Field props. The caller still owns labels,
validation, submission flow and any sensitive-data handling.

## General text

Use the default native text input behavior unless the content purpose needs a more specific
keyboard, content type or capitalization rule.

```tsx
<Field label={labels.displayName} value={displayName} onChangeText={setDisplayName} returnKeyType="next" />
```

## Email address

Email input should use native email-oriented configuration and avoid automatic capitalization.

```tsx
<Field
    label={labels.email}
    value={email}
    onChangeText={setEmail}
    autoCapitalize="none"
    autoComplete="email"
    keyboardType="email-address"
    textContentType="emailAddress"
    returnKeyType="next"
/>
```

The host decides whether email is optional, validated locally or verified remotely.

## Numeric or decimal input

Choose the input mode that matches the actual value model. Formatting and decimal normalization
remain application responsibilities.

```tsx
<Field
    label={labels.amount}
    value={amount}
    onChangeText={setAmount}
    inputMode="decimal"
    keyboardType="decimal-pad"
    returnKeyType="done"
    onSubmitEditing={submitAmount}
/>
```

A keyboard hint is not a validation rule. The host must still validate the submitted value.

## Secure input

Secure entry remains a native-input configuration. The package does not derive visible or
accessible copy from the secret value.

```tsx
<Field
    label={labels.password}
    value={password}
    onChangeText={setPassword}
    secureTextEntry
    autoCapitalize="none"
    autoCorrect={false}
    spellCheck={false}
    autoComplete="current-password"
    textContentType="password"
    returnKeyType="done"
    onSubmitEditing={submitPassword}
/>
```

Choose the actual autocomplete/content type for the product flow. Do not place the secret value in
`supportingText`, `accessibilityLabel` or `accessibilityHint`.

## Multiline content

Use multiline only where the content model permits free-form text. Long content must remain
reachable when Dynamic Type increases the text size.

```tsx
<Field label={labels.note} value={note} onChangeText={setNote} multiline returnKeyType="default" />
```

## Submit and keyboard ownership

The component forwards native focus, blur and submit callbacks. The consuming screen owns:

- focus order between fields;
- whether a return key moves focus or submits;
- keyboard avoidance and scrolling;
- validation timing and error copy;
- final autofill and physical-keyboard acceptance.

Simulator checks can validate layout and callback wiring. Real keyboard, autofill and VoiceOver
behavior remain part of the separate physical-device acceptance boundary.
