# foldstylex

shadcn-inspired styling for Foldkit, powered by StyleX.

## Stack

- **Foldkit** — MVU UI (`Runtime`, `Schema`, `Match`, view helpers)
- **Effect v4** — `effect@4.0.0-beta.83` (same lineage as [effect-smol](https://github.com/Effect-TS/effect-smol))
- **StyleX** — component styles and design tokens
- **Vite 8** — sidebar demo bundler

## Local Effect source

Effect v4 is cloned at `../effect-smol` for reference. Use it to explore APIs,
implementation patterns, and type definitions when docs are not enough.

Effect usage in this repo stays at the Foldkit boundary: `Schema` for models,
`Match` for updates, `m()` for tagged messages. See [effect-solutions](https://www.npmjs.com/package/effect-solutions)
guides via `mise exec -- effect-solutions list`.

## Commands

```bash
mise run typecheck   # tsc across all packages
mise run check       # hk check hook (typecheck)
mise run dev         # sidebar demo dev server
pnpm typecheck
```

## Packages

| Package | Role |
|---------|------|
| `@foldstylex/tokens` | StyleX theme vars (colors, layout) |
| `@foldstylex/styles` | shadcn component styles |
| `@foldstylex/foldkit` | Foldkit view helpers + StyleX attribute glue |
| `sidebar-demo` | POC app |