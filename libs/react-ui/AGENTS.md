# AGENTS.md

## Scope

This file contains package-specific instructions for `libs/react-ui`.

This package owns the React web implementation of the UI library.
It should remain aligned with:

- `libs/ui-core` for shared contracts and cross-platform behavior
- `libs/design-tokens` for design values
- existing package exports and build contracts

Always read the root `/AGENTS.md` first.

---

## Package Intent

`react-ui` is the React web component library.

It should:

- expose stable public React components and theme utilities
- consume `ui-core` rather than duplicating cross-platform logic
- consume design tokens rather than hardcoding design values
- remain packaging-safe for downstream consumers

---

## Current Package Conventions

### Public entrypoints

Public exports should flow through:

- `src/index.ts`
- `src/components/index.ts`
- `src/theme/index.ts`

When adding new public surface area:

1. export it from the local feature index
2. export it from the package aggregators

### Build model

This package uses a split build strategy:

- JS build: Rollup + Babel
- type declaration build: separate `tsc` pass

---

## Source Layout

### Components

Place React web components in:

- `src/components/<component-name>/`

Keep each feature area cohesive:

- component implementation
- hooks for that component if needed
- local stylesheet
- local index export

---

### Theme

Place React-specific theming and rendering utilities under:

- `src/theme/`

Do not move general-purpose, cross-platform contracts into the theme layer.

---

## Architectural Rules

### Use `ui-core` correctly

Before adding logic here, check whether it belongs in `ui-core`.

Put code in `ui-core` when it is:

- platform-agnostic
- shared across multiple UI implementations
- contract-level rather than rendering-level

Keep code in `react-ui` when it is:

- React-specific
- DOM-specific
- CSS/styling-specific
- Storybook/test/demo-oriented for React web

### Token discipline

Do not hardcode design values when they should come from design tokens.
Prefer token-driven styling and established CSS variable usage where the package already follows that pattern.

---

## Implementation Style

### General

- Prefer small, focused components and hooks.
- Use clear names.
- Preserve existing file and folder patterns.
- Avoid speculative abstractions.
- Keep comments minimal and useful.

### Composition

- Prefer composition over duplication.
- Reuse existing primitives before adding near-duplicates.
- When extending an existing component pattern, inspect nearby components first.

### Accessibility

This package is a UI library.
Accessibility is not optional.

When changing component behavior:

- preserve semantic behavior
- preserve keyboard behavior
- preserve disabled/loading/focus behavior
- preserve or improve accessible naming and labeling

If a component state changes behavior, ensure tests cover the accessible contract, not just the DOM shape.

---

## Testing Rules

### Required mindset

When changing behavior:

- reproduce first when possible
- identify root cause
- prefer a focused regression test

### Testing expectations

Use the smallest relevant validation first:

- component-level tests
- package-level tests
- broader validation only when warranted

### What to update when UI behavior changes

Depending on the change, update:

- Vitest tests
- Storybook stories
- accessibility expectations
- exported types if the public component API changed

### Conformance mindset

For core reusable components, preserve existing conformance expectations where applicable:

- root class behavior
- prop spreading
- ref forwarding
- polymorphic rendering behavior
- className merging

Do not break conformance-style behavior accidentally.

---

## Storybook Rules

Storybook is part of the package's usage contract.

When a component change affects:

- props
- states
- variants
- accessibility
- composition patterns

consider updating or adding stories.

Stories should:

- reflect public usage
- demonstrate meaningful states
- avoid internal-only hacks
- remain aligned with the exported API

---

## Styling Rules

### General styling approach

- Keep styles colocated with the component when that is the current local pattern.
- Preserve existing class naming conventions.
- Prefer extending the current styling system over mixing in a new one.

### Avoid

- inline style sprawl unless the component already uses that approach intentionally
- token duplication
- CSS contracts that silently break distributed stylesheet expectations

---

## Do Not

- Do not manually edit `dist`.
- Do not bypass public exports with unstable deep-import recommendations.
- Do not change build output names casually.
- Do not couple this package to demo-app-specific behavior.
- Do not move shared contracts from `ui-core` into `react-ui`.
- Do not hardcode token values that should come from the token layer.
