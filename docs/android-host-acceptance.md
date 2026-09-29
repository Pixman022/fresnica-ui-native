# Android Host Acceptance Checklist

These checks belong to the final React Native product App, not this component
package. The package provides predictable roles and states, while the native host
verifies system UI, navigation, keyboard and device accessibility.

## Required test matrix

Run the preview route and at least one real feature at:

- 320, 360, 390, 393 and 430 dp logical widths
- Android Light and Dark appearance
- English and Simplified Chinese
- default and large font scale
- enabled, disabled, loading, error and selected states where applicable

Record device/API level, font scale, locale, theme and result for each run.

## Accessibility and interaction

- [ ] TalkBack focus order follows the visual reading order.
- [ ] Every icon-only, close and back action has a localized label and hint where needed.
- [ ] Button, field, tab, progress and modal roles expose the correct state.
- [ ] Status is conveyed with text or an accessible equivalent, never color alone.
- [ ] Error announcement happens once through the form/announcement owner.
- [ ] Large text increases control height or wraps without clipping/overlap.
- [ ] Reduced-motion preference disables or shortens non-essential animation.

## Window and keyboard behavior

- [ ] Safe-area/inset padding is applied by the host and does not double-apply.
- [ ] The focused field and primary action remain visible when the keyboard opens.
- [ ] Sensitive fields use the approved autofill, spellcheck and screenshot policy.
- [ ] Android back closes the topmost modal/sheet before leaving the route.
- [ ] Status-bar and navigation-bar icon contrast is correct in both themes.
- [ ] The host resolves `system` appearance before passing a concrete theme to components.

## Layout and content resilience

- [ ] Long English and Simplified Chinese labels wrap or truncate according to the component contract.
- [ ] Long addresses, amounts and error messages do not cause horizontal overflow.
- [ ] Loading, empty, error and success states remain understandable without color.
- [ ] Touch targets are at least 44 dp even when visual controls use a smaller token height.

## Evidence and ownership

The App team owns device evidence and defect triage. The component team owns
contract changes when a failure is caused by a reusable primitive. Automated visual
regression remains out of scope for this phase.
