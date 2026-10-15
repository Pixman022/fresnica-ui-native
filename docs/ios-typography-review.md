# iOS Typography Review

Status: IOS03 review in progress. No production typography values are changed by this document.

## Current Native typography

The current generated Native typography remains Android-first:

- `body`: 14
- `supporting`: 13
- `action`: 15
- `sectionTitle`: 18
- `screenTitle`: 20
- `display`: 48

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

Current constraints and verified decisions include:

- `Field` supporting copy uses a fixed line height of 18 and still requires larger-text evidence.
- `StateView` description uses a fixed line height of 22 and still requires larger-text evidence.
- S04 reproduced Header truncation from the two-line cap; #94 removes that cap on iOS when
  `fontScale >= 1.5`.
- S04 reproduced a ListRow trailing badge squeezing the copy column; #94 stacks trailing content
  to a full-width second line on iOS when `fontScale >= 1.5`.
- S03 at the maximum standard text category (~1.35 fontScale) keeps the existing Header/ListRow
  layout.
- Modal content scrolls, but title/action reachability still needs larger-text validation.

Do not classify these constraints as defects until a recorded iOS scenario reproduces clipping,
overlap or unreachable content.

## iOS review anchor

The iOS review starts from the system font and semantic text hierarchy rather than the Web
Roboto/Noto Sans stack. Apple's Dynamic Type guidance uses Body as the common default text style and
expects larger accessibility text sizes to remain usable.

The first candidate mapping for visual review is intentionally conservative:

- `body`: 17 pt — primary readable content and field values.
- `supporting`: 15 pt — supporting copy, metadata and compact status text.
- `action`: 17 pt — button and action labels.
- `sectionTitle`: 20 pt — section and modal headings.
- `screenTitle`: 22 pt — screen-level title.
- `display`: 34 pt — large emphasis without importing the Web display scale directly.

These are **review candidates, not approved package values**. IOS05 Simulator evidence and IOS03
layout checks decide whether they are accepted, adjusted or partially applied.

## First larger-text Simulator evidence

The first S03/S04 capture on PR #88 exposed an evidence-integrity defect: metadata recorded the
requested locale/scenario while the visible Preview still rendered its default English/standard
state. That capture is invalid for visual approval and must not be used to approve typography.

PR #89 changed the generated iOS Preview host so requested launch state is injected before the
Release build, and added a hard failure when the expected injection points drift.

The corrected PR-head typography probe (workflow run `38664206311`) produced:

- **S03:** iPhone SE (3rd generation), iOS 18.5, maximum standard text category, Dark,
  Simplified Chinese, stress content. The visible top frame agrees with the recorded state.
  The title, subtitle, environment line, SegmentedControl labels, Field label/input,
  three-line long error/supporting copy and disabled Field are visible without an obvious
  horizontal overflow, overlap or text clipping failure.
- **S04:** iPhone SE (3rd generation), iOS 18.5, maximum accessibility text category, Light,
  English, standard content. The visible top frame shows the Preview title and subtitle
  wrapping vertically without horizontal overflow or clipped glyphs.

Targeted detail evidence from #92 adds lower action/content slices. The reviewed pre-fix captures
show:

- S03 actions at maximum standard text remain readable without the S04 failures.
- S04 Header title is truncated to a fragment by the two-line cap.
- S04 ListRow copy is squeezed into near single-character wrapping by trailing badge content.
- The long Button and StateView grow vertically rather than reproducing those two failures.

#94 fixes only the reproduced Header/ListRow defects and keeps production typography values
unchanged. The post-fix detail captures are now reviewed:

- S04 actions: the Header title is no longer capped with an ellipsis and can continue to grow
  vertically at the maximum accessibility category.
- S04 content: the trailing StatusBadge moves below the copy column, restoring usable text width.
- S03 actions: the maximum-standard layout remains unchanged at roughly 1.35 fontScale.

The current 17/15/17/20/22/34 iOS candidate mapping therefore remains unapproved. S04 continues to
show that increasing base sizes before Modal/keyboard reachability would be premature.

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
