# Native Component Contracts

These contracts define the first React Native component slice. They are intentionally
platform-neutral; navigation, safe areas, status bars and product state stay in the app shell.

| Component          | Required behavior                                                                                                                          | Accessibility gate                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `Button`           | Primary, secondary, quiet and danger variants; disabled/loading prevent duplicate presses; ref/test identifiers target the pressable node. | `button` role, label, disabled/busy state, minimum 44 logical px target.                       |
| `Field`            | Label/supporting copy plus typed native `TextInputProps`; input ref, events, styles and test identifiers target the native input.          | Label is exposed as the input label; disabled state cannot be re-enabled by passthrough props. |
| `StateView`        | Empty, error and success tone with optional action.                                                                                        | Title and description remain readable without relying on color alone.                          |
| `Screen`           | Background and optional scrolling/padding; no route ownership.                                                                             | Content order is preserved in the accessibility tree.                                          |
| `Header`           | Stable title, optional leading/trailing content and optional back action.                                                                  | Back action has a localized accessible label supplied by the app.                              |
| `ListRow`          | Title, optional description, leading and trailing content, disabled/pressed state.                                                         | Pressable rows expose a button role and disabled state.                                        |
| `Modal`            | Native modal lifecycle, scrim, title and explicit close callback.                                                                          | Modal is marked as a modal view; app restores focus after close.                               |
| `Typography`       | Shared body, supporting, action, section, screen and display metrics.                                                                      | Text can grow with Dynamic Type; callers provide translated content.                           |
| `IconButton`       | Icon-only action with a stable 44×44 target; ref/test identifiers target the pressable node.                                               | Caller provides the localized accessible label.                                                |
| `Divider`          | Semantic separator using the theme separator role.                                                                                         | Decorative/separator semantics are not used as the only state signal.                          |
| `StatusBadge`      | Positive, negative, warning and neutral status label.                                                                                      | Status includes text, not color alone.                                                         |
| `InlineMessage`    | Info, success, warning and error message with optional icon.                                                                               | Alert message is readable and caller owns announcement timing.                                 |
| `Skeleton`         | Non-interactive loading placeholder.                                                                                                       | Caller provides a localized loading label.                                                     |
| `Progress`         | Clamped 0–1 progress value.                                                                                                                | Progress role exposes min/max/current values.                                                  |
| `SegmentedControl` | Selectable set of short options.                                                                                                           | Tab/list labels and selected state are exposed; caller provides group label.                   |

## Test matrix

Each component must be tested in light and dark themes, with long English and Simplified
Chinese labels, disabled/loading/error states where applicable, and a 320 logical-pixel width.
Product labels, field copy and validation reasons remain caller-owned. The package ships only
generic internal `enUS` / `zhCN` copy such as close/loading fallbacks.
The Android app shell additionally verifies TalkBack focus order, keyboard behavior, safe-area
insets, system-bar icon contrast, reduced motion and Dynamic Type.

## Usage Rules

### Theme

Components resolve theme in this order: explicit component `theme`, nearest
`FresnicaUiProvider` theme, then `themes.light`. Existing per-component
`theme={...}` calls remain valid and override Provider context.

The component library does not persist theme preferences and does not read
Android dynamic accent colors. The host still resolves the selected/system mode
into an `AppTheme` before passing it to the Provider or a component.

Supported modes:

- `light`
- `dark`
- `system`

For `system`, the host application resolves the platform appearance first,
then passes the resolved light or dark theme to the component.

### Localization

Components do not contain product copy.

`FresnicaUiProvider` accepts a complete `UiLocale`; built-in `enUS` and `zhCN`
packs contain only package-owned generic copy. Explicit component copy overrides the
Provider locale, which falls back to `enUS` when a runtime key is missing.

The host application still provides:

- business/action labels
- field labels and placeholders
- supporting and validation text
- product-specific accessibility labels
- date, number and business formatting

### Native input and interaction refs

`Field` accepts supported React Native `TextInputProps` such as autocomplete/spellcheck,
capitalization, keyboard/input mode, return-key behavior, length, multiline and submit events.
The Field `ref`, `testID` and `nativeID` target the `TextInput`; `containerStyle` and
`containerTestID` target the outer wrapper. The normal `style` prop applies to the input.

State precedence is disabled, error, focused, default. `state="disabled"` cannot be undone
with `editable={true}`, and native `editable={false}` also produces disabled semantics.
Caller focus/blur/submit callbacks remain observable.

`Button` and `IconButton` forward their refs, `testID` and `nativeID` to the underlying
pressable host node. Their package-owned disabled/loading behavior remains authoritative.

See [the NU01 public API contract](public-api-contract.md) for the frozen prop boundaries
and migration rules used by this implementation.

### Accessibility

The host application must provide localized accessibility labels for:

- icon-only buttons
- close buttons
- back buttons
- loading indicators
- segmented control groups
- progress indicators

Do not communicate status through color alone. Status components must include
readable text or an equivalent accessible label.

### Layout

The component library supports a minimum logical width of 320 dp.

The host application is responsible for:

- safe-area insets
- keyboard avoidance
- system bars
- screen navigation
- window-level scrolling

## Render-test boundary

The Jest/React Native Testing Library suite exercises component rendering and
accessibility props, but React Native 0.87 requires the host application's native test
environment for those modules. The package-level checks remain runnable without an App
shell; device rendering, TalkBack, keyboard, safe-area and system-bar behavior remain
Android host acceptance responsibilities.
