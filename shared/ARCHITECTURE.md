# Shared Architecture

## Overview
- Holds DTO contracts shared between client and server.
- Types are minimal and stable, exported from `shared/src`.

## Patterns
- DTOs use `id` (string) instead of `_id`.
- Dates are ISO strings.
- Keep backward-compatible changes when possible.

