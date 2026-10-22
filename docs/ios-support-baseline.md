# iOS Support Baseline

Status: IOS01 baseline established 2026-10-14; current Simulator-backed support status synchronized through 2026-10-22.

This document separates planned support, build compatibility and runtime validation. A successful
Simulator build does not prove that every supported iOS version has been launched and exercised.

## Package and host baseline

- Package: `@fresnica/ui-native@1.1.0-rc.1`
- React Native: `0.87.0`
- React: `19.2.3`
- TypeScript: `6.0.3`
- Node: `22.13.0` in CI
- Host type: React Native Community CLI neutral Preview
- Package consumption: local packed tarball through the public package exports
- Architecture: React Native New Architecture / Hermes baseline from the generated host

The React Native 0.87 Community Template uses
`platform :ios, min_ios_version_supported`. React Native 0.87 currently resolves that floor to
iOS 15.1. Fresnica therefore uses **iOS 15.1 as the planned package minimum**, while keeping
runtime verification separate below.

## Apple build toolchain

The reproducible CI path uses:

- GitHub Actions `macos-15`
- Xcode `16.4` selected explicitly
- iOS SDK `18.5`
- generic iOS Simulator build with code signing disabled
- CocoaPods through the generated host Gemfile/Bundler
- Node `22.13.0`

The workflow prints macOS, Xcode, SDK, Node, Ruby, Bundler, CocoaPods and the resolved React Native
minimum iOS version on every run. Ruby gem versions remain owned by the generated RN host rather
than by the reusable component package.

Do not upgrade Xcode, CocoaPods or the deployment target only to chase the newest available runner
image. A toolchain change needs a concrete React Native, dependency or platform compatibility reason.

## Support matrix

- **Minimum package target:** iOS 15.1. Derived from the RN 0.87 template/helper; runtime has not yet been exercised at this floor.
- **CI build SDK:** iOS 18.5 with Xcode 16.4. Fresh Simulator compilation is covered by the Apple build gate.
- **Runtime:** iPhone Simulator. IOS05 records the concrete runtime, device and launch evidence.
- **First device family:** iPhone.
- **iPad:** no first-round compatibility promise. Revisit only if IOS05 exposes a blocking shared-layout issue.
- **Orientation:** portrait is the first-round baseline. Landscape is covered only where a consuming host explicitly supports it.
- **Physical iPhone:** not claimed; deferred.
- **VoiceOver / real keyboard / real autofill:** not claimed; deferred.
- **Dynamic Type:** IOS03/IOS05 Simulator work is complete for the current component scope, including maximum-standard and representative maximum-accessibility evidence, the Q03 Header layout review and the later post-freeze F01 React-empty side-content boundary on Maintenance `main`.
- **Light / Dark / English / zh-CN:** covered by the recorded S01-S06 Simulator matrix; this remains package/Simulator evidence, not physical-device acceptance.

A new SDK build must not be described as proof of the minimum runtime. IOS05 records the exact
Simulator runtime and device used for each scenario in the [iOS Preview Runtime Matrix](ios-preview-matrix.md).

## Responsibility boundary

The component package owns reusable component layout, states, accessibility props, theme-aware
styling and stable TypeScript contracts.

The consuming application owns navigation, safe-area composition at the screen shell, keyboard
avoidance strategy, system presentation, product state, final routing, final device acceptance and
product-specific platform services.

No SwiftUI/UIKit component SDK is introduced by this baseline. Native Swift/Objective-C code remains
a host or platform-bridge concern unless a later requirement proves that a reusable native module is
necessary.

## iOS design entry point

Shared semantic meaning remains defined by the Web design-system documents. iOS-specific typography,
layout, touch, navigation/presentation and system-preference rules are documented in the Web
`ios-guidelines.md` page. Native implementation and Preview evidence must follow that page when it
contains an explicit iOS override.

## Known limits

- Color/contrast work remains deferred; existing semantic roles and known limitations are retained.
- The shared Native Modal keeps its existing `fade` behavior.
- Physical-device accessibility remains a future integration gate.
- The Apple gate covers build and launch. Recorded Simulator frame coverage is linked from
  `ios-support-status-2026-10-14.md`; the later Q03 Header layout decision is recorded in
  `quality-maintenance-ios-experience-status-2026-10-20.md`. That narrow approval does not create
  a broader owner-approved iOS Golden Baseline, and unrecorded system-preference behavior remains separate.
