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

## Testing (TDD, Foldkit-native)

**Test-driven development is required.** Write a failing test before implementing or
fixing behavior. Do not ship MVU logic, mounts, or interactive view behavior without
automated coverage.

We follow **Foldkit's testing model** — not a custom harness, not raw DOM unit tests
as the default. Use what Foldkit ships:

| Tool | Role |
|------|------|
| **vitest** + **@effect/vitest** | Runner (`it`, `it.effect`, `describe`) |
| **happy-dom** | DOM environment for Scene tests |
| **foldkit/test** | `Story` and `Scene` test APIs |
| **foldkit/test/vitest** | `setup()` — registers Scene matchers with `expect` |

Local exemplars live in `../foldkit` (e.g. `packages/ui/src/virtualList/scene.test.ts`,
`examples/weather/src/story.test.ts`, `examples/auth/src/scene.test.ts`). Mirror
`packages/ui/vitest.config.ts` and `src/vitest-setup.ts` when adding a test target.

### Two test styles (Foldkit convention)

**Story tests** (`*.story.test.ts`) — drive `update` directly. Send Messages, assert on
the Model and pending Commands. Use `Story.story`, `Story.message`, `Story.model`.
Resolve Commands with `Story.Command.resolve(Definition, resultMessage)` — never run
Command Effects by hand in tests.

**Scene tests** (`*.scene.test.ts`) — assert through the rendered view. Use
`Scene.scene`, `Scene.click` / `Scene.type` / pointer steps, and `Scene.expect(...)`.
Prefer accessible locators (`Scene.role`, `Scene.label`, `Scene.text`) over CSS
selectors. For mounts, use `Scene.Mount.resolve` and `Scene.Mount.expectEnded`.

Name files by **test style**, beside the code under test. Multiple subjects in one
folder get a prefix: `appMenu.story.test.ts`, `appMenu.scene.test.ts`.

### What to test, in order

1. **Story** — `update` happy paths, edge cases, `isDragging` / open-close invariants
2. **Scene** — user-visible interactions (clicks, gestures, loading/error states)
3. **Pure helpers** — when gesture/math logic is non-trivial, extract it and add a
   small vitest unit file. This supplements Story/Scene; it does not replace them.

Every `Scene.scene` block must assert something (`Scene.expect`, `Scene.Command.resolve`,
or `Scene.Mount.resolve`). A scene that only calls `Scene.with(model)` is not a test.

### TDD loop

1. **Red** — failing Story or Scene for the behavior you want
2. **Green** — minimal change in `update`, view, or mount
3. **Refactor** — extract pure functions, keep tests green

Manual browser checks (`mise run dev`) complement automated tests; they do not replace them.

## Commands

```bash
mise run typecheck   # tsc across all packages
mise run test        # vitest across packages that define a test script
mise run check       # hk check hook (typecheck + tests)
mise run dev         # sidebar demo dev server
pnpm typecheck
pnpm test            # same as mise run test
pnpm --filter @foldstylex/foldkit test
```

## Packages

| Package | Role |
|---------|------|
| `@foldstylex/tokens` | StyleX theme vars (colors, layout) |
| `@foldstylex/styles` | shadcn component styles |
| `@foldstylex/foldkit` | Foldkit view helpers + StyleX attribute glue |
| `sidebar-demo` | POC app |