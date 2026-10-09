# Integration Guide

`@fresnica/ui-native` is a component package, not an application. A product app consumes
the package and owns navigation, wallet state, persistence, permissions, networking and
platform services.

The canonical integration reference is the neutral `example/` Preview host. An older wallet prototype
remains under `product/` for historical reference, intentionally outside `src/` so no product navigation,
wallet state, storage or signing dependency enters the reusable package.
See [the UI library delivery plan](ui-library-delivery-plan.md) for the current project boundary.

## Package usage

Follow [the pinned package install and token handoff guide](consumer-handoff.md) to build,
pack and install the currently private Native package from an approved commit.

1. Install the prebuilt archive in the consuming App; do not install raw Git sources.
2. Resolve the app's selected mode with `resolveTheme`; for `system`, pass the platform
   appearance result (`light` or `dark`).
3. Pass the resulting `AppTheme` to each component.
4. Inject translated labels, hints and errors from the app localization layer.
5. Keep product routes and business state outside the component package.

```tsx
const theme = resolveTheme(preference, systemAppearance);

return <Button theme={theme} label={labels.continue} onPress={submit} />;
```

## Reference host

The committed `example/App.tsx` demonstrates UI-only integration:

- App-owned English/Simplified Chinese labels
- Light/Dark/System theme resolution
- responsive and long-content scenarios
- safe-area-aware scrolling and component behavior
- reusable primitive states without wallet accounts or network calls

The historical `product/` host does implement some Testnet wallet actions, but none of those actions
belong to the component package or form part of its acceptance criteria. Future wallet security,
transaction submission, backup and release requirements must be managed by the consuming product.

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

The `example/` Preview host exercises the UI-only integration order. Wallet product acceptance is separate
from component package delivery.

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

return <Button theme={theme} label={labels.continue} onPress={submit} />;
```
