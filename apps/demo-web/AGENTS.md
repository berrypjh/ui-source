# AGENTS.md

## Purpose

A demo app that renders `@berrypjh/react-ui` components to visually verify their behavior.
The goal is to show **usage examples**, not to modify the library itself.

---

## Structure

- Each component page lives under `src/app/pages/` as `{ComponentName}Page.tsx`.
- Shared layout primitives (`PageHeader`, `DemoSection`) are defined in `src/app/components/DemoSection.tsx`.
- When adding a new component page, also register it in the router (`app.tsx`) and the sidebar nav (`Layout.tsx` → `NAV_GROUPS`).
- Route pattern: `/components/{kebab-case-name}`

---

## Coding Rules

- Page files contain only local state and icon components needed for the demo.
- Use inline `style` props for layout and demo containers — do not rely on Tailwind classes for structural layout.
- Base component props on the actual `@berrypjh/react-ui` types. Do not guess or assume prop shapes.
- `Select` must always follow the `FormControl + InputLabel + Select` pattern — there is no standalone `label` prop.

---

## Validation

| Change type          | How to validate                                 |
| -------------------- | ----------------------------------------------- |
| New page added       | `nx run @berrypjh/demo-web:build`               |
| Routing change       | E2E tests (`nx run @berrypjh/demo-web-e2e:e2e`) |
| Component prop usage | Build passes + visual check in browser          |

---

## Things To Avoid

- Do not modify library source (`libs/react-ui`) from within the demo app.
- Do not assert fine-grained styles or pixel values in E2E tests — validate behavior and visibility only.
