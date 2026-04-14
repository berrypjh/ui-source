# AGENTS.md

## Scope

This file contains package-specific instructions for `libs/ui-core`.

This package owns platform-agnostic contracts, shared logic, and reusable primitives that can be consumed by multiple UI implementations.

Always read the root `/AGENTS.md` first.

---

## Package Intent

`ui-core` should be the shared foundation for the UI system.

It should:

- define stable contracts
- host reusable types and platform-agnostic logic
- reduce duplication across platform-specific UI packages
- remain conceptually clean and reusable

---

## Core Design Principle

Before adding code here, ask:

**Is this truly platform-agnostic?**

Put code in `ui-core` when it is:

- shared across Web and Native platforms
- a contract, token mapping, or reusable utility
- independent of DOM rendering details
- not tied to Storybook, browser APIs, or app environment

Do not put code here when it is:

- browser-only
- CSS-specific
- demo-app specific

---

## Responsibilities

### This package should own

- shared types and contracts
- cross-platform component prop models where appropriate
- reusable utility functions
- polymorphic or structural typing utilities when they are part of shared architecture
- shared token-facing abstractions when they are platform-agnostic

---

## API Discipline

### Exported surface

Treat exported types, contracts, and helpers as stable.
Changes here can cascade into multiple packages.

If changing exports:

- update import sites
- update affected tests
- update downstream packages
- update docs/examples if the public contract is consumed externally

### Backward compatibility

Prefer additive changes over breaking ones.
Avoid renaming or reshaping widely used contracts unless clearly necessary.

---

## Design and Implementation Rules

### General

- Keep code small, explicit, and reusable.
- Prefer clear contracts over hidden magic.
- Name shared concepts carefully.
- Avoid utilities that are only used once.

### Cross-platform mindset

Think about:

- React web consumer
- React Native consumer
- future consumers

If logic only helps one platform, it likely belongs outside `ui-core`.

### Dependency discipline

Avoid pulling platform-heavy dependencies into `ui-core`.
This package should remain light and portable.

---

## Relationship To Other Packages

### `design-tokens`

`ui-core` may depend on token contracts or token-facing utilities, but should not redefine token values that belong in the token source layer.

### `react-ui`

React web should consume shared contracts from `ui-core` rather than duplicating them.

### `react-native-ui`

React Native should also consume shared contracts from `ui-core` when they are applicable.

When duplication appears in both platform packages, check whether it should be promoted into `ui-core`.

---

## Testing Rules

### What to test here

Focus on:

- contract behavior
- utility correctness
- shared logic invariants
- cross-platform assumptions at the non-rendering layer

---

## Change Evaluation Checklist

Before finalizing a change in `ui-core`, check:

- Is this truly platform-agnostic?
- Does this belong in shared contracts or should it remain in a platform package?
- Did exported types or contracts change?
- Were downstream consumers checked?
- Is this the smallest reusable abstraction that solves the problem?

---

## Do Not

- Do not add React web rendering assumptions.
- Do not add React Native-only rendering assumptions.
- Do not move demo or app-specific behavior into this package.
- Do not duplicate token values that belong in `design-tokens`.
- Do not introduce broad abstraction layers without clear multi-package benefit.
