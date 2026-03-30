# AGENTS.md

> Note: `CLAUDE.md` is a symlink to AGENTS.md. They are the same file.

## Purpose

This repository is an Nx monorepo for a cross-platform UI system.
The intended flow is:

`design-tokens -> ui-core -> platform UI libraries -> demo apps`

Agents must optimize for:

- maintainability
- consistency across packages
- small, verifiable changes
- preserving public API stability unless the task explicitly allows breaking changes

---

## Workspace Overview

### Main directories

- `apps/demo-mobile`: Expo / React Native demo app
- `apps/demo-web`: React + Vite demo app
- `apps/demo-web-e2e`: Cypress E2E tests for the web demo
- `libs/design-tokens`: design token sources, transforms, and generated outputs
- `libs/ui-core`: platform-agnostic contracts, shared logic, and foundational utilities
- `libs/react-ui`: React web UI component library
- `libs/react-native-ui`: React Native UI component library
- `tools/scripts/release`: local release and publishing scripts
- `.github/workflows`: CI/CD automation
