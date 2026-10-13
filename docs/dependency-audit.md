# Dependency Audit Classification — 2026-10-13

This record separates the reusable Native package's production install graph from
repository development/test/build findings and records M01 gate behavior.

## Current evidence

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
