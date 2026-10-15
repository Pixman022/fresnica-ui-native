# Dependency Audit Classification — 2026-10-15

This record separates the reusable Native package's production install graph from
repository development/test/build findings and records M01 gate behavior.

## Compatible maintenance result — 2026-10-15

Starting source: Native main `d9bf6a8a408d54774ae3422cbcb02d5d2727edc5`.
A non-force lockfile refresh retains the declared React 19.2.3 / RN 0.87.0 / TypeScript
6.0.3 baseline and Metro 0.87.1. Jest and babel-jest resolve to 30.5.2 within the existing
30.x ranges. `shell-quote` moves from 1.10.0 to 1.12.0, clearing the critical finding
[GHSA-pqg4-j6r4-53mv](https://github.com/advisories/GHSA-pqg4-j6r4-53mv).

| Audit            | Before                              | After compatible updates            |
| ---------------- | ----------------------------------- | ----------------------------------- |
| Full graph       | 40: 5 moderate, 34 high, 1 critical | 29: 20 moderate, 9 high, 0 critical |
| Production graph | 0                                   | 0                                   |

These are npm vulnerable-package counts, not counts of independent advisories. Severity
moves also reflect dependency-path changes. Remaining findings come from `braces` through
Metro/RN and `sprintf-js` through Istanbul/YAML/Jest. npm's remaining remediation proposes
out-of-range changes including RN 0.72.17 or babel-jest 25.0.0; those are not applied to the
RN 0.87 / Jest 30 baseline. Recheck when those upstream chains receive compatible fixes.
The production gate remains blocking and the full development audit remains report-only.

The maintenance is validated with package checks, archived-evidence integrity, build/pack
contracts and the PR CI/Apple runtime checks. Actual run outcomes belong to the PR checks;
no green result is inferred from this dependency classification.

## Historical evidence before maintenance

Evidence: Native CI run
[`38200763953`](https://github.com/Pixman022/fresnica-ui-native/actions/runs/38200763953)
on `ea40207351d9a2a62c58226c2c361f06444ee309`.

- Full dependency audit: **40 vulnerabilities** — 5 moderate, 34 high, 1 critical.
- Production audit (`npm audit --omit=dev --audit-level=moderate`): **0 vulnerabilities**.
- React and React Native remain peer dependencies; the package has no ordinary runtime
  `dependencies` entry. The current findings are therefore in repository
  development/test/build tooling, not the package production install graph.
- Observed development paths include Jest/Babel/Istanbul, Metro/React Native tooling,
  `braces` / `micromatch`, `shell-quote`, and YAML/declaration tooling.

The production result applies only to this component repository's current install graph.
A consuming application owns and must audit its additional runtime dependencies.

## M01 production gate

The full development audit remains report-only. The production audit is now a blocking
step inside the Native `test` job: any moderate-or-higher production finding or audit
tool failure returns a non-zero status and fails the job.

Repository ruleset `Protect main` (ID `24701211`) is active for the default branch and
requires the `test` status check. Because build, fixed Token-source verification, package
contract verification, and internal delivery-candidate creation all run later in the same
required job, a failed production audit prevents those steps from succeeding and prevents
the required `test` check from passing.

## Development findings policy

1. Keep development and production audits separate.
2. Do not use `npm audit fix --force` merely to reduce the development finding count.
3. Prefer compatible, non-force updates only when React, React Native, Node, build, and
   package contracts remain intact.
4. Re-run full Native CI after any dependency or lockfile change.
5. Re-review retained findings when the owning Jest/Metro/React Native/tooling baseline is
   intentionally upgraded or when a currently dev-only package becomes runtime exposure.

M01 changes only gate semantics and documentation; it does not upgrade dependencies or
change the fixed Web Token source.
