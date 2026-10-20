# Fresnica Native UI library change record

This is a repository-level change record for the reusable
`@fresnica/ui-native` package. The package manifest currently declares
`1.1.0-rc.1` and `private: true`; that value is an **internal integration
candidate**, not proof of an npm publication, a Git tag, or an approved
production UI release.

## 2026-10-20 — 1.1.0-rc.1 quality-maintenance candidate

- Preserved the public package API, typography mapping, color palette and shared Modal `fade`
  behavior while completing the 2026-10-19 quality-maintenance work.
- Q03 reclaims empty Header side slots only at iOS accessibility text sizes; real leading/back/
  trailing controls retain their existing slots and hit areas. Simulator technical review supports
  keeping the change, while project-owner layout decision D01 remains pending.
- Q04 adds package-level Jest coverage measurement and a non-regressing CI gate, with explicit
  iOS/Android platform-branch coverage.
- Q05 adds XCUITest Simulator interaction evidence for software keyboard + primary action,
  long-content scrolling + action activation, and Modal open/close.
- Q06 freezes the current private candidate from Native source
  `1afeac9cab5c55e4baeb0e99514c933722935da0`; the tarball
  `fresnica-ui-native-1.1.0-rc.1.tgz` has SHA-256
  `341c1cc84590b802d2f8457500b6a30467417c5cf8670b62e54031e1a9313569`.
- Web quality-maintenance changes are already merged at
  `e026a6390fd16cf23122d5967b5fd23d6f3fbc57`; Native still pins the unchanged Web token source
  `15d49e0be28a232ae6de2a7285a3a77add8c87d4`.
- This remains a private design-system integration candidate. Physical-device iOS/Android
  acceptance, VoiceOver/TalkBack certification, color/contrast resolution, iPad commitment and
  wallet-product implementation remain outside the completed engineering round.

## 2026-10-12 — 1.1.0-rc.1 component-library optimization candidate

- Added the frozen public API/migration contract for Provider/theme/Locale, Field native props,
  interaction refs, focus and announcement ownership.
- Added `FresnicaUiProvider`, `useUiTheme`, `useUiLocale`, built-in `enUS` / `zhCN`
  packs and the stable `@fresnica/ui-native/locales` export.
- Extended Field with typed native input props/ref behavior and explicit disabled/error/focus precedence.
- Completed Button primary/secondary/quiet/danger states, pressed feedback and localized loading copy.
- Added Modal focus-cooperation hooks, InlineMessage alert/passive announcement modes and the two
  supported ListRow interaction patterns.
- Pinned the Web Token source to an immutable commit and file blob hashes.
- Expanded the neutral Preview and CI package regression so the built tarball, root/locales exports,
  React/RN peer contract and Android fresh-build/emulator paths are checked together.
- This is an **internal integration candidate**, not an npm publication, production release,
  full accessibility certification, iOS support statement or wallet-product approval.

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
- **Native phase-one visual layout approval:** [PR #45](https://github.com/Pixman022/fresnica-ui-native/pull/45)
  fixed narrow Chinese theme-label wrapping. The project owner approved the
  resulting layout on 2026-10-09. [PR #48](https://github.com/Pixman022/fresnica-ui-native/pull/48)
  pinned seven reviewed screenshots to stable device/source profiles and PNG
  SHA-256 values in [approved-manifest.json](docs/visual-baselines/approved-manifest.json).
  This is a **manual layout sign-off**, not an accessibility or product release.

The exact source SHA for a consuming App must be pinned and recorded.
See [consumer handoff](docs/consumer-handoff.md) and
[phase-one status](docs/ui-library-phase-one-status.md).

## Explicit open limitations

- The original green primary buttons with white text measure 3.06:1 in
  Light and 2.14:1 in Dark, below WCAG AA's 4.5:1 normal-text target.
  Palette is **unchanged by request**; no color-accessibility sign-off.
- Four Android width/theme profiles, core modal/keyboard interactions and
  the owner-approved representative **visual layout** now have source-linked
  evidence. Real TalkBack/focus order, physical-device behavior, reduced
  motion and full mobile accessibility certification remain **unverified**.
  A green CI run is not a general accessibility or product release sign-off.
- The archived 2026-10-15 iOS reference PNGs are retained in Git. Android approved PNG binaries
  and the later 2026-10-19 Q03 iOS PNG binaries may remain in time-limited GitHub Actions artifacts;
  the repository pins SHA-256 values and reproducible source/profile metadata. No automated
  pixel-diff threshold is enabled.
- The UI component package does not ship wallet features, Stellar transactions, Mainnet,
  production security approval, a SwiftUI/UIKit SDK, physical-device iOS acceptance or a public
  npm registry release. Current iPhone support is React Native Simulator-backed component support,
  not a product-release claim.

For the first-phase engineering completion checklist, refer to
[the scoped delivery plan](docs/ui-library-delivery-plan.md).
