# Android Host Acceptance Checklist

The committed `example/` Preview Host provides pre-feature Android acceptance inside this
repository. The final product App must repeat the relevant checks once navigation, wallet
state, networking, persistence and permissions are introduced.

## Required test matrix

Run the Preview at:

- 320, 360, 390, 393 and 430 dp logical widths
- Android Light and Dark appearance
- English and Simplified Chinese
- default and large font scale
- Standard and Stress content scenarios

The Preview displays its current logical width, height, resolved theme and font scale.
With one emulator/device connected, run `npm run example:device-info` and record that
JSON beside the result.

## Automated gates

Pull requests that touch the Preview or native components must keep these checks green:

- standalone package tests and component contracts
- shared Web/Native token source contract
- Preview Host TypeScript validation
- React Native 0.87 Android `assembleDebug`

These gates verify compilation and package integration. They do not replace visual,
TalkBack, keyboard or real-device acceptance.

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
- [ ] The focused bottom field and primary action remain reachable when the keyboard opens.
- [ ] Sensitive fields use the approved autofill, spellcheck and screenshot policy.
- [ ] Android back closes the topmost modal/sheet before leaving the route.
- [ ] Status-bar and navigation-bar icon contrast is correct in both themes.
- [ ] The host resolves `system` appearance before passing a concrete theme to components.

## Layout and content resilience

Use Stress mode for the long-copy checks below.

- [ ] Long English and Simplified Chinese labels wrap or truncate according to the component contract.
- [ ] Long addresses, amounts and error messages do not cause horizontal overflow.
- [ ] Loading, empty, error and success states remain understandable without color.
- [ ] Touch targets are at least 44 dp even when visual controls use a smaller token height.

## Evidence and ownership

The Preview Host is owned by this repository and should catch reusable primitive defects
before wallet work begins. The final product App still owns device evidence and product-flow
defect triage. Automated visual regression remains out of scope for this phase.
