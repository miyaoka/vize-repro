# vize-repro — workspace dependency resolution

Minimal reproduction for [vize](https://github.com/ubugeeei-prod/vize)
`vize check` failing to resolve dependencies that live in a package-local
`node_modules` of a pnpm workspace, while `vue-tsc` resolves them cleanly.

## Layout

A two-package pnpm workspace:

```text
app/                    @repro/app   — imports @repro/lib, tsconfig has types: ["node"]
packages/lib/           @repro/lib   — workspace package, exports raw ./src/index.ts
pnpm-workspace.yaml     nodeLinker: isolated | hoisted
```

`app/src/main.ts` imports the workspace package by name, and `app/tsconfig.json`
carries a non-empty `types: ["node"]` and includes the sibling package's source.

## Setup / check

```bash
mise install   # Node.js / pnpm, versions pinned in mise.toml
pnpm install
cd app
pnpm run typecheck:vuetsc   # baseline (Volar / vue-tsc) — clean under both linkers
pnpm run typecheck:vize     # vize
```

## What it demonstrates

`vue-tsc` is clean under **both** linkers. `vize check` fails under both, and the
diagnostic differs by linker because the failing dependency sits in a different
`node_modules`:

| `nodeLinker` | dependency location | `vize check` |
| --- | --- | --- |
| `hoisted` | `@repro/lib` symlinked into `app/node_modules`; `@types/node` hoisted to the workspace-root `node_modules` | `TS2307` — cannot find module `@repro/lib` |
| `isolated` | both symlinked into `app/node_modules` (`@types/node` → `.pnpm` store) | `TS2688` — cannot find type definition file for `node` |

Switch the linker in `pnpm-workspace.yaml`, then
`rm -rf node_modules app/node_modules packages/lib/node_modules && pnpm install`
to reproduce the other row.

Both failures share one cause: `vize check` materializes a canon project at the
workspace root, whose `node_modules` ancestor chain does not reach the checked
package's own `node_modules`, so package-local dependencies (the workspace
package under `hoisted`, the `types` entry under `isolated`) resolve to nothing.
`vue-tsc` runs in place from `app/`, where both resolve.
