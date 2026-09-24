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
