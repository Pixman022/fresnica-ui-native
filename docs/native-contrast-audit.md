# Native theme contrast audit

Scope: `@fresnica/ui-native` Light/Dark themes generated from the pinned Web design token source, version **1.1.1** (additive body-text role on the approved 1.1.0 palette). The 2026-11-26 palette decision updated primary button values and added a distinct danger foreground.

Run `npm run test:contrast` for WCAG relative-luminance checks. Ordinary text targets **4.5:1**; essential non-text UI indicators target **3:1**. The static audit does not replace screenshot, zoom, text-scaling or real-device testing.

## CI-gated primary and danger combinations

The following pairs meet the WCAG AA normal-text contrast threshold:

- **Primary label** — Light: `#FFFFFF` on `#0F7954`, **5.41:1**; Dark: `#101312` on `#00CA8A`, **8.73:1**.
- **Pressed primary label** — Light: `#FFFFFF` on `#0C6748`, **6.89:1**; Dark: `#101312` on `#00A875`, **6.10:1**.
- **Danger label** — Both themes: `#FFFFFF` on `#C73945`, **5.12:1**.

**Body content** — Dark `#E8EFEB` on canvas `#101312` = **16.00:1**; on surface `#171B19` = **14.89:1**; on raised surface `#202623` = **13.19:1**. The new `contentBody` role is limited to ordinary Typography (`body`) and ListRow names, with `contentPrimary` retained for headings and balances. The optional `contentBody` field falls back to `contentPrimary` for existing custom `AppTheme` objects.

**Non-text white audit** — Pure white `onDanger` text stays on the red danger action; white `onPrimary` is light-theme only. Dark on-primary is `#101312`, and Native dark canvas/cards/icons use semantic dark surfaces, not arbitrary white backgrounds. Light inverse surfaces, brand art and QR representations are deliberate exceptions and must retain locally appropriate contrast. The static audit does not assert that every icon/border passes 3:1.

`onDanger` maps to the `content-on-error` semantic role and is independent of `onPrimary`. It is optional for caller-provided `AppTheme` values, with the generated white danger foreground as backward-compatible fallback. The audit also gates content-primary on surface/canvas and content-secondary on surface.

## Review-only coverage

Muted copy, positive/negative/warning status foregrounds and essential control borders still report `REVIEW` if below their target. Financial states remain separate from the brand palette; a brand update does not mean every remaining status combination has passed.

## Source contract

The versioned Web token source must be merged first. Then Native pins the precise Web commit and token-source Git blob SHAs, regenerates `src/generated-token-contract.ts`, and passes Native CI source-contract, contrast and component checks.
