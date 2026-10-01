# Native Component Contracts

These contracts define the first React Native component slice. They are intentionally
platform-neutral; navigation, safe areas, status bars and product state stay in the app shell.

| Component          | Required behavior                                                                              | Accessibility gate                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `Button`           | Primary, secondary, quiet and danger variants; disabled and loading prevent duplicate presses. | `button` role, label, disabled/busy state, minimum 44 logical px target.            |
| `Field`            | Label, value, placeholder, supporting/error copy and disabled state.                           | Label is exposed as the input label; error copy is announced by the app form layer. |
| `StateView`        | Empty, error and success tone with optional action.                                            | Title and description remain readable without relying on color alone.               |
| `Screen`           | Background and optional scrolling/padding; no route ownership.                                 | Content order is preserved in the accessibility tree.                               |
| `Header`           | Stable title, optional leading/trailing content and optional back action.                      | Back action has a localized accessible label supplied by the app.                   |
| `ListRow`          | Title, optional description, leading and trailing content, disabled/pressed state.             | Pressable rows expose a button role and disabled state.                             |
| `Modal`            | Native modal lifecycle, scrim, title and explicit close callback.                              | Modal is marked as a modal view; app restores focus after close.                    |
| `Typography`       | Shared body, supporting, action, section, screen and display metrics.                          | Text can grow with Dynamic Type; callers provide translated content.                |
| `IconButton`       | Icon-only action with a stable 44×44 target.                                                   | Caller provides the localized accessible label.                                     |
| `Divider`          | Semantic separator using the theme separator role.                                             | Decorative/separator semantics are not used as the only state signal.               |
| `StatusBadge`      | Positive, negative, warning and neutral status label.                                          | Status includes text, not color alone.                                              |
| `InlineMessage`    | Info, success, warning and error message with optional icon.                                   | Alert message is readable and caller owns announcement timing.                      |
| `Skeleton`         | Non-interactive loading placeholder.                                                           | Caller provides a localized loading label.                                          |
| `Progress`         | Clamped 0–1 progress value.                                                                    | Progress role exposes min/max/current values.                                       |
| `SegmentedControl` | Selectable set of short options.                                                               | Tab/list labels and selected state are exposed; caller provides group label.        |

## Test matrix

Each component must be tested in light and dark themes, with long English and Simplified
Chinese labels, disabled/loading/error states where applicable, and a 320 logical-pixel width.
All accessibility labels for actions, loading indicators and groups are required props;
the component package does not ship default English or Chinese UI copy.
The Android app shell additionally verifies TalkBack focus order, keyboard behavior, safe-area
insets, system-bar icon contrast, reduced motion and Dynamic Type.

## Usage Rules

### Theme

Every component receives an `AppTheme` object from the host application.

The component library does not persist theme preferences and does not read
Android dynamic accent colors.

Supported modes:

- `light`
- `dark`
- `system`

For `system`, the host application resolves the platform appearance first,
then passes the resolved light or dark theme to the component.

### Localization

Components do not contain product copy.

The host application provides:

- English labels
- Simplified Chinese labels
- accessibility labels
- placeholders
- supporting text
- error messages
- loading messages

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
