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
| `ListRow`          | Title, optional description, leading/trailing content; either whole-row action or independent trailing action.                             | Pressable rows expose one button; independent trailing actions remain separate.                |
| `Modal`            | Native modal lifecycle, scrim, title, show/close callbacks and close-control ref.                                                          | Modal is marked modal; host chooses initial focus and restores trigger focus.                  |
| `Typography`       | Shared body, supporting, action, section, screen and display metrics.                                                                      | Text can grow with Dynamic Type; callers provide translated content.                           |
| `IconButton`       | Icon-only action with a stable 44×44 target; ref/test identifiers target the pressable node.                                               | Caller provides the localized accessible label.                                                |
| `Divider`          | Semantic separator using the theme separator role.                                                                                         | Decorative/separator semantics are not used as the only state signal.                          |
| `StatusBadge`      | Positive, negative, warning and neutral status label.                                                                                      | Status includes text, not color alone.                                                         |
| `InlineMessage`    | Info, success, warning and error message with optional icon and alert/passive announcement mode.                                           | Error keeps alert compatibility; passive mode avoids duplicate announcements.                  |
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

The component library accepts a complete custom `AppTheme` through the Provider or an explicit
component override. Generated Light/Dark themes are the built-in defaults, not the only supported
theme values. The library does not persist theme preferences and does not read Android dynamic
accent colors. The host still resolves selected/system mode before passing an `AppTheme`.

If a consumer chooses to build a theme from an image, image selection, cropping, color extraction,
theme construction and persistence remain consumer responsibilities; the library only consumes the
resulting complete `AppTheme`.

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

Secure-input props are ordinary native-input configuration: `secureTextEntry`, `autoComplete`,
`importantForAutofill`, `textContentType`, `autoCorrect` and `spellCheck` are forwarded to
the `TextInput`. The component does not derive visible supporting copy or accessibility
labels/hints from the input `value`. Callers remain responsible for label/supporting/accessibility
content and must not deliberately place sensitive values in those strings.

`Button` and `IconButton` forward their refs, `testID` and `nativeID` to the underlying
pressable host node. Their package-owned disabled/loading behavior remains authoritative.

`Button` variants are `primary`, `secondary`, `quiet` and `danger`. Primary uses the
`primaryPressed` semantic token when pressed. Secondary is outlined and quiet is borderless;
both use `surfaceRaised` for pressed feedback without adding a secondary palette. Danger keeps
the existing negative semantic color with pressed opacity feedback because no separate danger
pressed token exists. Loading remains disabled/busy and displays `loadingLabel` when provided,
otherwise the current Provider locale `loading` copy.

See [the NU01 public API contract](public-api-contract.md) for the frozen prop boundaries
and migration rules used by this implementation.

### Modal focus and announcement ownership

`Modal` remains controlled by `visible` and `onRequestClose`; its animation remains
`fade`. The optional `onShow` callback tells the host when native modal presentation is
ready, and `closeButtonRef` exposes the built-in close control as a possible initial
accessibility-focus target. The package does not keep a global trigger stack and does not
restore arbitrary external focus automatically.

A consuming host that wants focus restoration keeps the trigger ref, focuses the close
control after `onShow`, closes through the same `onRequestClose` path for the close button
and Android system Back, and restores the trigger after the modal has closed. Actual spoken
focus behavior remains part of the deferred physical-device acceptance gate.

`InlineMessage` supports `announcementMode="alert"` and `"passive"`. For 1.x
compatibility an error with no explicit mode remains an alert. Use passive mode when the
application already owns announcement timing; when alert mode is used, the application must
not separately announce the same message.

### ListRow interaction patterns

Only two interaction patterns are supported:

1. **Whole-row action:** set `onPress`; `trailing` must be presentation-only.
2. **Independent trailing action:** omit row `onPress`; put the independent control in
   `trailing`.

Do not nest an independently actionable trailing control inside a ListRow that is itself one
accessible button. No generic `trailingAction` subsystem is introduced by NU05.

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
