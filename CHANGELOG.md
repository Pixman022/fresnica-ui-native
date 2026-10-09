# Fresnica Native UI library change record

This is a repository-level change record for the reusable
`@fresnica/ui-native` package. The package manifest currently declares
`1.0.0` and `private: true`; that value is an **internal source/package
baseline**, not proof of an npm publication, a Git tag, or an approved
production UI release.

## 2026-10-09 — phase-one engineering handoff (unreleased)

- **Shared component foundation:** the 15 exports in `src/index.ts`,
  typed Light/Dark/System theme handling and host-supplied locale strings.
- **Delivery scope:** [PR #27](https://github.com/Pixman022/fresnica-ui-native/pull/27)
  restricted the project to Web design contracts, Native primitives and
  the separate `example/` Preview. The historical `product/` wallet
  prototype remains out of scope.
- **Dependency visibility:** [PR #26](https://github.com/Pixman022/fresnica-ui-native/pull/26)
  reports Native package dependency advisories without blocking CI or claiming
  that reported advisories have been remediated.
- **Component coverage:** [PR #29](https://github.com/Pixman022/fresnica-ui-native/pull/29)
  completed direct render smoke tests and neutral Preview examples for the
  15 Native components.
- **Token governance:** [PR #30](https://github.com/Pixman022/fresnica-ui-native/pull/30)
  added generated-theme contrast reporting and Native semantic-role validation.
  [PR #32](https://github.com/Pixman022/fresnica-ui-native/pull/32)
  replaced repeated component layout constants with shared dimensions.
- **Consumer handoff:** [PR #31](https://github.com/Pixman022/fresnica-ui-native/pull/31)
  documented immutable-commit `npm pack` installation and manual
  Web-to-Native source contract validation.
- **Preview visual evidence:** [PR #33](https://github.com/Pixman022/fresnica-ui-native/pull/33)
  established evidence provenance. [PR #35](https://github.com/Pixman022/fresnica-ui-native/pull/35)
  captured and verified 320dp Dark Chinese stress and 393dp Light English
  stress plus its below-fold shared-component gallery.
- **Current visual policy:** [PR #36](https://github.com/Pixman022/fresnica-ui-native/pull/36)
  documents the decision to retain the existing brand-green/white-text
  palette until separately reviewed.

The exact source SHA for a consuming App must be pinned and recorded.
See [consumer handoff](docs/consumer-handoff.md) and
[phase-one status](docs/ui-library-phase-one-status.md).

## Explicit open limitations

- The original green primary buttons with white text measure 3.06:1 in
  Light and 2.14:1 in Dark, below WCAG AA's 4.5:1 normal-text target.
  Palette is **unchanged by request**; no color-accessibility sign-off.
- The four scheduled Android width/theme profiles, additional interaction
  states, and design-owner-approved visual baseline remain tracked by
  [Issue #37](https://github.com/Pixman022/fresnica-ui-native/issues/37).
  A green CI run is not visual parity or physical-device acceptance.
- The UI component package does not ship wallet features, Stellar
  transactions, Mainnet, production security approval, iOS, or a public
  npm registry release.

For the first-phase engineering completion checklist, refer to
[the scoped delivery plan](docs/ui-library-delivery-plan.md).
