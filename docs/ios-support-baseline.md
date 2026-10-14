# iOS Support Baseline

Status: IOS01 baseline for the 2026-10-14 iOS support round.

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

| Area | Current support statement | Validation status |
| --- | --- | --- |
| Minimum package target | iOS 15.1 | Derived from RN 0.87 template/helper; runtime not yet exercised at this floor |
| CI build SDK | iOS 18.5 / Xcode 16.4 | Fresh Simulator build verified by the Apple build gate |
| Runtime | iPhone Simulator | IOS05 will record concrete runtimes/devices and launch evidence |
| First device family | iPhone | In scope |
| iPad | No first-round compatibility promise | Deferred unless IOS05 exposes a blocking shared-layout issue |
| Orientation | Portrait is the first-round baseline | Landscape only where the consuming host explicitly supports it |
| Physical iPhone | Not claimed | Deferred |
| VoiceOver / real keyboard / real autofill | Not claimed | Deferred |
| Dynamic Type | Component and Simulator support is in scope | IOS03/IOS05 |
| Light / Dark / English / zh-CN | Existing package capability | iOS runtime matrix in IOS05 |

A new SDK build must not be described as proof of the minimum runtime. IOS05 will record the exact
Simulator runtime and device used for each scenario.

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
- The existing Apple gate proves build compatibility; launch/layout evidence is IOS05 work.
