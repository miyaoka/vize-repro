# vize-repro

Minimal reproductions for [vize](https://github.com/ubugeeei-prod/vize) bugs
(`vize check`, ...), cross-checked against `vue-tsc` as the passing baseline.

A pnpm workspace: the reproduction lives under `app/` (plus `packages/*` for the
workspace-resolution cases). `main` is the clean baseline; each `bug/*` branch
changes only the package(s) to reproduce one defect. See each branch's PR and
commit message for what it demonstrates.

## Setup

```bash
mise install   # Node.js / pnpm, versions pinned in mise.toml
pnpm install
```

## Type check

```bash
pnpm run typecheck:vuetsc:all   # baseline (Volar / vue-tsc) — clean on every branch
pnpm run typecheck:vize:all     # vize
```

Both fan out with `pnpm -r --include-workspace-root --if-present`, so the same
command runs whether the repro is a single package or a multi-package workspace.
On `main`, both pass.
