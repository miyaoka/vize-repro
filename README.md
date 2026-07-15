# vize-repro

Minimal reproduction: `vize check` reports TS2307 for a workspace package import when the tsconfig has a `types` entry.

## Layout

```text
pnpm-workspace.yaml        # nodeLinker: hoisted
packages/lib/              # @repro/lib, exports "." -> ./src/index.ts (TS source)
app/                       # imports @repro/lib, devDeps: vize 0.290.0, @types/node
app/tsconfig.json          # moduleResolution: bundler, types: ["node"]
```

## Steps

```bash
pnpm install
cd app
pnpm run typecheck   # vize check
```

## Observed

```text
app/src/main.ts
  error:1:24 [TS2307] Cannot find module '@repro/lib' or its corresponding type declarations.

✗ Type checked 67 files
  1 error(s)
```

## Control conditions (all pass)

- Remove `"types": ["node"]` from `app/tsconfig.json` → `vize check` passes (`Type checked 1 files`)
- Keep `types` but pass an explicit pattern: `vize check src/main.ts` → passes
- Same tsconfig, checked by tsgo directly: `tsgo --noEmit` → exit 0

With `types` present, the checked file count grows from 1 to 67 (the type package declaration files are collected into the check set).

## Environment

- vize 0.290.0 (`@vizejs/native`), Corsa runtime via `@typescript/native-preview`
- pnpm 11.10.0, `nodeLinker: hoisted`
- macOS (darwin arm64)
