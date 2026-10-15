# iOS Preview Runtime Matrix

Status: IOS05 representative Simulator matrix.

This matrix expands the single automated launch smoke into the six representative scenarios defined
by the 2026-10-14 iOS support plan. It is intentionally not a claim that every component state,
device or system preference combination has been tested.

## Fixed toolchain

- GitHub Actions runner: `macos-15`
- Xcode: `16.4`
- Simulator runtime: `iOS 18.5`
- Package: `@fresnica/ui-native@1.1.0-rc.1`
- First-round device family: iPhone
- First-round orientation: portrait
- Physical-device acceptance: deferred

The pinned runner currently provides iOS 18.5 simulators for iPhone SE (3rd generation),
iPhone 16 and iPhone 16 Pro Max. Those profiles cover the small, middle and large iPhone
representatives required by this round.

## Automated smoke

The CI smoke uses iPhone 16 / iOS 18.5 and verifies that the locally packed package can be installed
into the neutral Preview host, built in Release, installed, launched and captured to a screenshot.

The automated smoke proves launch/runtime compatibility only. It does not replace the scenario
matrix, visual approval or physical-device acceptance.

## Scenario matrix

### S01 — small iPhone, default text

- Device: iPhone SE (3rd generation)
- Runtime: iOS 18.5
- Orientation: portrait
- Preview scenario: standard
- Text size: default
- Appearance: Light
- Preview locale: Simplified Chinese
- Focus: normal component layout, primary actions, field labels and compact-width wrapping

### S02 — large iPhone, default text

- Device: iPhone 16 Pro Max
- Runtime: iOS 18.5
- Orientation: portrait
- Preview scenario: standard
- Text size: default
- Appearance: Dark
- Preview locale: English
- Focus: scroll reachability, standard rows, control states and large-screen spacing

### S03 — small iPhone, maximum standard text

- Device: iPhone SE (3rd generation)
- Runtime: iOS 18.5
- Orientation: portrait
- Preview scenario: stress
- Text size: largest non-accessibility category
- Appearance: Dark
- Preview locale: Simplified Chinese
- Focus: long Header title, Field supporting copy, long ListRow content, segmented labels and
  long Button labels

### S04 — small iPhone, maximum accessibility text

- Device: iPhone SE (3rd generation)
- Runtime: iOS 18.5
- Orientation: portrait
- Preview scenario: standard
- Text size: largest accessibility category
- Appearance: Light
- Preview locale: English
- Focus: key information remains readable and primary actions remain reachable

### S05 — large iPhone, long content and maximum accessibility text

- Device: iPhone 16 Pro Max
- Runtime: iOS 18.5
- Orientation: portrait
- Preview scenario: stress
- Text size: largest accessibility category
- Appearance: Dark
- Preview locale: Simplified Chinese
- Focus: lists, forms, long labels, status feedback, Modal content and scroll growth

### S06 — constrained available height

- Device: iPhone 16
- Runtime: iOS 18.5
- Orientation: portrait
- Preview scenario: standard
- Text size: representative larger category
- Appearance: Light
- Preview locale: English
- Focus: keyboard-open Field, the primary action below it, scrolling, Modal open/close and content
  reachability with reduced usable height

Landscape is not part of the first-round package promise. S06 therefore constrains height through
the software keyboard instead of introducing a landscape claim.

## Required Preview coverage

The neutral Preview must keep reachable examples for:

- Button normal, pressed, disabled and loading states;
- Field normal, error, disabled, secure/native-prop and keyboard interaction examples;
- long Header titles;
- long ListRow title/description content;
- SegmentedControl selection;
- Modal open and close paths;
- InlineMessage and StatusBadge feedback;
- Skeleton and Progress states;
- scrolling and keyboard reachability.

The matrix does not require every state to be photographed in every scenario. Each scenario targets
the risks listed above.

## Evidence record

Record the following for every executed scenario:

- scenario ID;
- result: passed, failed, blocked or not tested;
- evidence-integrity check: the visible Preview state must agree with the recorded locale, content
  scenario, appearance and text-size settings; metadata alone is not sufficient;
- source SHA;
- package version;
- packed tarball SHA-256;
- Xcode version;
- device and iOS runtime;
- orientation;
- system text-size category;
- appearance;
- Preview locale and content scenario;
- screenshot path or retained artifact;
- observed clipping, overlap, unreachable actions or presentation problems;
- fix/retest reference when a failure is confirmed.

Screenshots must contain only neutral Preview content. Do not use real accounts, keys, wallet data or
other sensitive product information.

If metadata and the visible Preview state disagree, mark the capture invalid and rerun it. An invalid
capture cannot be used to approve IOS03 typography, IOS05 scenario results or IOS07 visual evidence.

## Automation boundary

The iPhone 16 launch smoke checks build, install, launch and evidence generation. The typography
probe additionally captures S01-S04 with explicit Simulator text-size, appearance, locale and scenario
settings; the reachability workflow captures the targeted S05 Modal and S06 software-keyboard views.
S01/S02 originals come from run `38709105594`; the corrected S05 close-control original comes from
run `38708758540`. All current references are pinned in the
[evidence manifest](visual-baselines/ios-simulator-evidence-manifest.json).

These automated captures support review of specific visible frames. They do not exercise every
interaction or prove all offscreen content is reachable. The
[layout review](visual-baselines/ios-layout-review-2026-10-15.md) records seven current candidate
frames, the technical reviewer and scoped outcomes; owner design approval remains pending.
A scenario result applies only to the state actually exercised and reviewed. Broader interaction
coverage requires its own reproducible check.

## Acceptance boundary

A green package test does not prove Simulator layout. A successful Simulator scenario does not prove
visual approval. Neither proves physical-device VoiceOver, real keyboard/autofill or product
acceptance. Colors and Increase Contrast remain on the separately deferred track.
