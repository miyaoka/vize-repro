# vize-repro

Minimal reproductions for [vize](https://github.com/ubugeeei-prod/vize) bugs
(`vize check`, `vize lint`, ...).

`main` is a clean baseline Vue single-file-component project wired for type
checking. Each `bug/*` branch changes only `src/` to reproduce one vize defect,
cross-checked against `vue-tsc`. See each branch's commit message and
`src/App.vue` comments for what it demonstrates.

## Setup

```bash
mise install   # Node.js / pnpm, versions pinned in mise.toml
pnpm install
```

## Type check

```bash
pnpm run typecheck:vuetsc   # baseline (Volar / vue-tsc)
pnpm run typecheck:vize     # vize
```

On `main`, both pass.
