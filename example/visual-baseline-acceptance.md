# Phase-one Native Preview visual-layout reference

The design owner approved the **current neutral Preview layout** on 2026-10-09,
with compact `系统` at 320dp, allowed two-line ellipsis for deliberately long
English Header text at 393dp, and the previously reviewed Light/Dark layouts.

See [approved visual baseline metadata](../docs/visual-baselines/README.md),
[full review checklist](../docs/native-visual-baseline-review.md) and
[the Android Emulator Acceptance workflow](../.github/workflows/android-emulator-acceptance.yml).

When a project PR explicitly starts with `[visual-matrix]`, the existing
acceptance workflow builds the Preview and collects four non-wallet, neutral
screen scenarios. The extra capture is needed here because the old PR #39
320dp/Light screenshot predates the compact Chinese label in PR #45.
The evidence must be checked and recorded by artifact/source SHA before any
post-fix screenshot is called a reference.

**Visual layout approval does not sign off accessibility or code changes:**
keep the existing palette intact; WCAG AA contrast and full TalkBack/real-device
acceptance remain outside this review. Automated pixel-diff gating is deferred.
