# Native Integration Review Follow-up Status — 2026-10-13

> **Status:** RP01 / RP02 complete; RP03 / RP04 deferred; O01 not started  
> **Primary repository:** `Pixman022/fresnica-ui-native`  
> **Contract repository:** `Pixman022/fresnica-ui`

## Delivery summary

The independently deliverable scope from the Native integration-review follow-up is complete.

- **RP01 · Theme responsibility + complete custom theme regression — Complete**
- **RP02 · Secure-input prop/display-boundary regression — Complete**
- **RP03 · Key color review and candidate evaluation — Deferred by owner decision**
- **RP04 · Approved color implementation and expanded contrast gate — Deferred by owner decision**
- **O01 · Minimum iOS Preview fresh-build gate — Not started**
- **Physical-device accessibility / Issue #49 — Deferred integration gate**

No wallet product flow, key/signing/transaction logic, new shared primitive, image-processing
pipeline, public npm release or Apple project was added.

## RP01 evidence

Native PR #74 merged as `1e1306c5c67ccdda06e62cf363d858a9ca9acebb`.

The existing Provider regression now switches between two complete `AppTheme` fixtures and
checks representative semantic consumers:

- `Screen` → `background`
- `Typography` → `contentPrimary`
- primary `Button` → `primary`, `primaryPressed`, `onPrimary`
- normal `Field` → `surface`, `border`, `contentPrimary`
- error `Field` → `negative`

The existing explicit component-theme precedence and independent React-root isolation coverage
remain in place.

Native contract documentation now states that the package accepts a complete custom
`AppTheme`. Generated Light/Dark themes remain built-in defaults. If a consuming application
derives a theme from an image, image selection, cropping, color extraction, theme construction
and persistence remain application responsibilities; the component package only consumes the
resulting complete theme.

Web PR #29 merged as `7583b205395a7c7e3fa07d6e6d348f7b0ed75081` and synchronized the same responsibility
boundary in the English and Simplified Chinese mobile/native baseline and platform-adapter
contract.

Default generated themes were not changed.

## RP02 evidence

Native PR #74 also added the focused secure-input regression using the fictitious value
`test-only-secret`.

The test verifies that `Field` forwards these native input props unchanged:

- `secureTextEntry`
- `autoComplete="off"`
- `importantForAutofill="no"`
- `textContentType="none"`
- `autoCorrect={false}`
- `spellCheck={false}`

It also verifies:

- `state="disabled"` remains authoritative even when the caller passes `editable={true}`;
- the final input is disabled and exposes disabled accessibility state;
- `value` is not used to derive accessibility label, accessibility hint or visible supporting copy;
- the caller remains responsible for explicit label/supporting/accessibility strings and must not
  intentionally place sensitive values in those strings.

This is a component-boundary regression only. Real keyboard, platform autofill and device
secure-entry behavior remain consuming-host validation.

## CI and delivery evidence

Native:

- `main`: `1e1306c5c67ccdda06e62cf363d858a9ca9acebb`
- CI run `38373964922`: **success**
- existing production dependency audit, standalone tests, fixed Web Token-source verification,
  build, packed-package verification and internal delivery candidate all remain green.

Web:

- `main`: `7583b205395a7c7e3fa07d6e6d348f7b0ed75081`
- CI run `38375190088`: **success**
- Pages run `38375695376`: **success**
- Node 20/22 lint/test, `Full quality gate`, React 18 packed consumer, Demo build and Delivery
  artifact all pass.

During Web PR #29, the temporary React 18 consumer environment repeatedly resolved npm metadata
to nonexistent `rollup@4.64.6`. The generated consumer fixture now pins published
`rollup@4.64.5` so that this verification is reproducible. This pin exists only in the temporary
consumer test package and does not change `fresnica-ui` runtime/package dependencies.

## Token and visual invariants

Shared Token sources remain unchanged:

- `design-system/tokens.json` blob:
  `9c4bbc478618d5a5ef5d1ecdd11d41ee8afdeb5c`
- `design-system/platform-token-source.json` blob:
  `6ee1c1da3a3be52e84bc8247e13bb577fdbb4cc6`

They still match `token-source.lock.json`. No Native Token-lock advance or regenerated default
visual change is required.

The existing Modal `fade` decision remains unchanged.

## Deferred and conditional items

### RP03 / RP04 — color work

Both remain deferred. The current formal Tokens, existing contrast audit and known limitations are
retained. This status does not claim that the known contrast gaps are fixed.

RP03/RP04 should be reopened only after a new explicit owner decision to resume color review.

### O01 — iOS Preview fresh build

Not started. No macOS/Xcode/CocoaPods/iOS Simulator result is claimed.

### Physical-device accessibility

Native Issue #49 remains open as the deferred first-real-consumer physical-device gate. No new
TalkBack, real keyboard, autofill, Dynamic Type or physical-device evidence is claimed by RP01/RP02.

## Repository protection follow-up

The earlier Web administrator configuration item is already complete:

- Web ruleset `Protect main` (ID `24981097`) is active.
- It requires GitHub Actions `Full quality gate`.
- The earlier temporary failure verification confirmed a red required check yields
  `mergeable_state: blocked`.

It is therefore not a remaining task of this follow-up plan.

## Conclusion

The follow-up plan's current independent delivery condition is satisfied: RP01 and RP02 are
implemented, verified and merged in the two existing Pixman022 repositories.

RP03/RP04 remain intentionally deferred, O01 remains not started, and Issue #49 remains a
future real-consumer device gate. None of those states reopens the completed RP01/RP02 work.
