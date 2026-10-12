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
3. Pass the resulting `AppTheme` to `FresnicaUiProvider` or directly to a component.
4. Pass `enUS`, `zhCN` or a complete custom `UiLocale` to the Provider for generic package copy.
5. Continue injecting business labels, hints, validation reasons and formatting from the app layer.
6. Keep product routes and business state outside the component package.

```tsx
import { Button, FresnicaUiProvider, resolveTheme } from '@fresnica/ui-native';
import { zhCN } from '@fresnica/ui-native/locales';

const theme = resolveTheme(preference, systemAppearance);

return (
    <FresnicaUiProvider theme={theme} locale={zhCN}>
        <Button label={labels.continue} onPress={submit} />
    </FresnicaUiProvider>
);
```

Existing direct usage remains supported and has higher precedence:

```tsx
<Button theme={theme} label={labels.continue} onPress={submit} />
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
- The package provides UI configuration context only; the App still owns language/theme
  preference, persistence and product localization.

## Wallet UI readiness

Before adding a new shared primitive, review the current
[wallet UI component coverage matrix](wallet-ui-component-coverage.md). The current
five-page evidence set concludes that the existing 15 primitives are sufficient to
**start** wallet UI integration; wallet-domain rows, amount panels, asset selectors and
transaction presentation remain Feature-local until stable reuse is proven.

The [integration readiness plan](wallet-ui-integration-readiness-plan.md) records the
approved product decisions: image-derived theming is not required, shared components
are not expanded by count, and real-device accessibility becomes a hard gate for the
first actual wallet App integration.

## Recommended Integration Order

1. Install and link `@fresnica/ui-native`.
2. Resolve the user's theme preference in the App shell.
3. Convert `system` appearance to `light` or `dark`.
4. Create product localization labels in the App layer and select a package `UiLocale`.
5. Provide the resolved theme/locale through `FresnicaUiProvider`; use explicit component
   props only for local overrides.
6. Keep wallet state and business actions outside the component library.
7. Run product-level Android accessibility acceptance. **Do not mark the wallet UI integration complete until the real-device integration gate below passes.**

The `example/` Preview host exercises the UI-only integration order. Wallet product acceptance is separate
from component package delivery.

## First wallet integration hard gate

Package CI and emulator evidence are not substitutes for product-level physical-device
acceptance. Before the first consuming wallet App is marked UI-integration complete,
verify on a real supported Android device:

- TalkBack reading and focus order for primary flows;
- button, icon-button and field labels/states, including modal focus restoration;
- real soft-keyboard avoidance and Android system Back behavior;
- safe-area and status/navigation-bar legibility in Light and Dark;
- at least 1.3× system font scale without critical clipping or hidden actions;
- 44dp touch targets and status/error communication that does not rely on color alone;
- English and Simplified Chinese long-content behavior.

Full multi-device coverage, final contrast release review and complete reduced-motion
reassessment remain release-stage work. The existing Modal fade deferral is not a
reduced-motion compliance claim.

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
