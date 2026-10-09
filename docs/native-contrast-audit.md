# Native theme contrast audit

Scope: the current `@fresnica/ui-native` Light/Dark color outputs generated from
[`fresnica-ui/design-system/platform-token-source.json`](https://github.com/Pixman022/fresnica-ui/blob/main/design-system/platform-token-source.json).
The source and Web 1.0.0 visual values remain unchanged.

Run `npm run test:contrast`. The script reads `src/generated-token-contract.ts`
and prints actual WCAG relative-luminance contrast ratios for color combinations
used by existing primitives. It checks **4.5:1 for ordinary text** and **3:1 for
essential non-text control boundaries**; a decorative divider is not treated as
an essential control boundary.

## Gating and review-only coverage

- **CI-gated:** primary text on surface/canvas, secondary text on surface and
  white text on the danger button. A regression below the applicable threshold
  fails `npm test`.
- **Review-only:** primary/pressed button labels, muted text, positive/negative/
  warning status labels and essential control borders. Existing visual choices
  are measured on each run but do **not** silently change palette values or fail
  CI. `REVIEW` output means a contrast shortfall, **not an accessibility pass**.
- Full component contrast depends on the actual background and state; this test
  does not replace a UI screenshot review, text scaling or TalkBack checks.

## Baseline observations

The following ratios were calculated from the current generated Native colors;
run the script after any token-source update to get the latest figures.

| Combination                               |  Light |   Dark | Target           |
| ----------------------------------------- | -----: | -----: | ---------------- |
| Primary button white text / brand green   | 3.06:1 | 2.14:1 | 4.5:1            |
| Pressed primary button white text / green | 4.10:1 | 3.06:1 | 4.5:1            |
| Muted supporting copy / surface           | 3.13:1 | 5.96:1 | 4.5:1            |
| Positive status label / surface           | 3.06:1 | 8.13:1 | 4.5:1            |
| Negative status label / surface           | 5.12:1 | 3.40:1 | 4.5:1            |
| Warning status label / surface            | 4.03:1 | 8.10:1 | 4.5:1            |
| Default border / surface                  | 1.28:1 | 1.46:1 | 3:1 if essential |

## Decisions still needed before declaring all visual states accessible

1. The existing design explicitly specifies white text on branded green buttons,
   including in dark mode; both Native shades fall below 4.5:1 for ordinary-size
   text. A proposed color/foreground adjustment needs **design-owner approval**
   and a Web/Native compatibility review before implementation.
2. The status badge currently uses the tone color for its text. Review accessible
   text colors or different presentations for the failing theme/tone combinations.
3. Muted text in Light mode and any border necessary for recognizing an input
   control need component-context review. Decorative dividers are not included in
   the 3:1 requirement by default.
4. No exception in this document is a waiver of accessibility requirements.
   Document the final approved role, text size/context and screenshot evidence
   when remediating a reported gap.

See [the design-system delivery plan](ui-library-delivery-plan.md), tasks DS-04/05/06,
and [the cross-platform mapping](token-mapping.md). This audit concerns **UI tokens
and components only**, not the historical wallet product or Mainnet readiness.
