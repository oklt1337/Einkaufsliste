# Client Architecture

## Overview

- Stack: React + TypeScript + Vite + MUI.
- State: `useState`/`useEffect`, no server-state libraries.
- Data: typed DTOs from `shared`.

## Structure

- `src/api/` — fetch wrapper and typed API calls.
- `src/components/` — UI building blocks.
- `src/test/` — Vitest + RTL tests.
- `src/i18n.ts` — UI strings + locale fallback.

## Patterns

- Single source of truth per view (App owns list state).
- Optimistic UI for quantity/order updates with server reconciliation.
- A11y via labels and `aria-*` attributes.

## UX Notes

- Mobile-first layout with safe-area padding.
- Drag & drop sorting via `@dnd-kit` with touch support.
