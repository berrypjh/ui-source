# AGENTS.md

## Scope

This file contains package-specific instructions for `libs/react-native-ui`.

This package owns the React Native implementation of the UI library.

Always read the root `/AGENTS.md` first.

---

## Package Intent

`react-native-ui` should provide React Native-native implementations that stay aligned with:

- `libs/ui-core` for shared contracts and reusable logic
- `libs/design-tokens` for design values and theme semantics
- the broader component model used across the workspace where practical

---

## Core Rules

### React Native ownership

This package owns:

- React Native rendering
- mobile-native interaction details
- RN styling integration
- RN-specific accessibility mapping
- RN-specific component composition

---

## Architecture Rules

### Prefer `ui-core` for shared logic

Before adding logic here, ask whether it belongs in `ui-core`.

Promote logic to `ui-core` when it is:

- platform-agnostic
- shared by multiple platform packages
- contract-level rather than rendering-level

Keep logic here when it is:

- RN renderer specific
- gesture/interaction specific to RN
- RN accessibility mapping
- RN style object implementation details

### Token discipline

Do not hardcode design values when they should come from the token layer.
Consume the appropriate token outputs or token-derived abstractions instead.

---

## Implementation Style

### General

- Prefer small, composable components.
- Preserve consistent naming.
- Keep implementation straightforward.
- Avoid speculative abstractions.
- Avoid unnecessary wrappers.

### Platform awareness

Prefer native-platform correctness over forced parity with web internals.
However, do not diverge from shared design-system semantics without a clear reason.

### Accessibility

React Native accessibility is required, not optional.
When changing behavior, think about:

- accessibility roles
- labels
- hints
- disabled states
- focus/navigation implications

---

## Testing and Validation

### What to validate

Depending on the change:

- component behavior
- prop/state logic
- shared contract alignment
- token consumption
- accessibility mapping where applicable

### Validation mindset

Run the smallest relevant checks first.
If a change affects shared contracts, confirm it still aligns with `ui-core`.

### Regression discipline

When fixing a bug:

- identify root cause first
- add or update focused validation if practical
- avoid guess-based fixes

---

## Breaking Change Guidelines

Treat these as potentially breaking:

- changing exported component props
- changing variant or size semantics
- changing token consumption contracts
- removing shared conceptual parity with corresponding components on other platforms
- changing exported paths or public API shape

If a breaking change is necessary:

- document it
- update consumers
- update shared docs/examples as needed

---

## Do Not

- Do not duplicate token values from `design-tokens`.
- Do not move cross-platform logic here if it belongs in `ui-core`.
