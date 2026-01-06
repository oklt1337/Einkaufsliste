# Fullstack Shopping List

## Voraussetzungen
- Node.js LTS
- Docker + Docker Compose

## MongoDB via Docker Compose
```bash
docker compose up -d
```
Stoppen:
```bash
docker compose down
```

## Installation (ein Befehl)
```bash
npm run install:all
```

## Dev Start (ein Befehl)
```bash
npm run dev
```

## Tests (ein Befehl)
```bash
npm run test
```

Hinweis: Fuer E2E-Tests mit Playwright beim ersten Mal:
```bash
npx playwright install
```

## Lint / Format
```bash
npm run lint
npm run format
```

## Konfiguration
- `server/.env.example`
- `client/.env.example`

## Shared DTOs
Die DTO-Typen liegen in `shared/src/dto.ts` und werden von Client und Server als Type-Only Imports genutzt. So bleiben API-Vertraege stabil und Typsicherheit ist End-to-End gegeben.

## Architektur
- Client: `client/ARCHITECTURE.md`
- Server: `server/ARCHITECTURE.md`
- Shared: `shared/ARCHITECTURE.md`

## UI-Toolkit
Material UI (MUI).
