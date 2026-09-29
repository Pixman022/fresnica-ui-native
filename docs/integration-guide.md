# Integration Guide

`@fresnica/ui-native` is a component package, not an application. A product app consumes
the package and owns navigation, wallet state, persistence, permissions, networking and
platform services.

## Package usage

1. Install the package in the product app after the native repository is published or linked.
2. Resolve the app's selected mode with `resolveTheme`; for `system`, pass the platform
   appearance result (`light` or `dark`).
3. Pass the resulting `AppTheme` to each component.
4. Inject translated labels, hints and errors from the app localization layer.
5. Keep product routes and business state outside the component package.

```tsx
const theme = resolveTheme(preference, systemAppearance);

return <Button theme={theme} label={labels.continue} onPress={submit} />;
```

## Compatibility

- Web and native share semantic role names, but native values are a separate adapter output.
- Do not import Web DOM/CSS/Less modules into the native package.
- Platform overrides require a recorded reason and accessibility review.
- The package does not provide a navigation container or app-level localization provider.

## Recommended Integration Order

1. Install and link `@fresnica/ui-native`.
2. Resolve the user's theme preference in the App shell.
3. Convert `system` appearance to `light` or `dark`.
4. Create the localization labels in the App layer.
5. Pass `theme` and localized labels into components.
6. Keep wallet state and business actions outside the component library.
7. Run product-level Android accessibility acceptance.

## Host Responsibilities

The product App owns:

- navigation
- wallet and account state
- transaction state
- networking
- persistence
- permissions
- localization
- date, time and number formatting
- safe-area handling
- keyboard behavior
- system status and navigation bars
- TalkBack and device-level acceptance

The component library owns:

- visual tokens
- component layout
- component states
- accessibility roles and state exposure
- theme-aware styling
- predictable callbacks
- TypeScript contracts

## Example With Localization

```tsx
const labels = {
    continue: language === 'zh-CN' ? '继续' : 'Continue',
};

const theme = resolveTheme(preference, systemAppearance);

return <Button theme={theme} label={labels.continue} accessibilityLabel={labels.continue} onPress={submit} />;
```
