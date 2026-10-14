# iOS Typography Review

Status: IOS03 review in progress. No production typography values are changed by this document.

## Current Native typography

The current generated Native typography remains Android-first:

| Role | Current value |
| --- | ---: |
| body | 14 |
| supporting | 13 |
| action | 15 |
| sectionTitle | 18 |
| screenTitle | 20 |
| display | 48 |

These values come from the reviewed shared token source and remain unchanged until an iOS-specific
mapping has been validated and approved.

## Direct typography consumers

Typography is not consumed only by `Typography`. The current package also reads
`theme.typography` directly in:

- `Button`
- `Field`
- `Header`
- `ListRow`
- `Modal`
- `SegmentedControl`
- `InlineMessage`
- `StatusBadge`
- `StateView`

Any iOS mapping therefore needs regression coverage across these consumers.

## Existing scaling behavior

React Native text scaling has not been disabled in the package, so the current implementation is
not a fixed-size-only text system. However, iOS-specific Dynamic Type acceptance is not complete.

Current constraints that require Simulator verification include:

- `Field` supporting copy uses a fixed line height of 18.
- `StateView` description uses a fixed line height of 22.
- `Header` allows two title lines before truncation.
- Button, segmented-control and row layouts use minimum control heights that may need to grow when
  accessibility text sizes are enabled.
- Modal content scrolls, but title/action reachability still needs larger-text validation.

Do not classify these constraints as defects until a recorded iOS scenario reproduces clipping,
overlap or unreachable content.

## iOS review anchor

The iOS review starts from the system font and semantic text hierarchy rather than the Web
Roboto/Noto Sans stack. Apple's Dynamic Type guidance uses Body as the common default text style and
expects larger accessibility text sizes to remain usable.

The first candidate mapping for visual review is intentionally conservative:

| Fresnica role | Review candidate | Purpose |
| --- | ---: | --- |
| body | 17 pt | Primary readable content and field values |
| supporting | 15 pt | Supporting copy, metadata and compact status text |
| action | 17 pt | Button and action labels |
| sectionTitle | 20 pt | Section and modal headings |
| screenTitle | 22 pt | Screen-level title |
| display | 34 pt | Large emphasis without importing Web display scale directly |

These are **review candidates, not approved package values**. IOS05 Simulator evidence and IOS03
layout checks decide whether they are accepted, adjusted or partially applied.

## Implementation constraints

- Keep Android generated typography unchanged.
- Do not hand-edit `src/generated-token-contract.ts`.
- Prefer the existing `AppTheme` and platform-adaptation structure.
- Add new public types only if the existing theme structure cannot express the approved result.
- Do not change colors, contrast thresholds or the shared Modal fade behavior.
- Preserve caller-provided custom `AppTheme` compatibility.

## IOS03 acceptance sequence

1. Establish IOS05 launch evidence on the fixed iPhone Simulator.
2. Record default text-size screenshots before changing typography.
3. Apply the smallest iOS-specific mapping needed for the approved roles.
4. Verify all direct consumers listed above.
5. Exercise default, largest standard and representative accessibility text sizes.
6. Reproduce and fix only observed clipping, overlap or unreachable-action problems.
7. Record final values, rationale, source SHA and migration impact.
8. Keep VoiceOver physical-device acceptance separate.

## External reference boundary

Apple Human Interface Guidelines and accessibility guidance are design references for this review.
They do not by themselves prove Fresnica runtime behavior. Final acceptance requires Fresnica
Simulator evidence from the package and neutral Preview.
