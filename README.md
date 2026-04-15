# CraftVault Client

React frontend for [CraftVault](https://craftvault-api.staubracing.com) — a craft supply, equipment, and project management app. The primary use case is answering **"Do I already have this?"** while shopping at craft stores.

## Tech Stack

- **Vite + React + TypeScript**
- **React Router** — client-side routing
- **Lucide React** — icons
- **Deploy target:** Cloudflare Pages

## Getting Started

```bash
yarn install
yarn dev          # http://localhost:5173
```

The app expects the CraftVault API running at `http://localhost:3002` (dev) or `https://craftvault-api.staubracing.com` (production).

## Project Structure

```
src/
  api/            — API client functions (one file per resource)
  components/     — Shared UI components
  pages/          — One folder per route
  types/          — TypeScript interfaces matching API shapes
  hooks/          — Custom hooks for data fetching
```

## Routes

| Route | Page |
|-------|------|
| `/` | Dashboard |
| `/drills` | Diamond painting drill inventory |
| `/supplies` | General craft supplies |
| `/equipment` | Craft equipment tracking |
| `/projects` | Project list |
| `/projects/:id` | Project detail with linked supplies |
| `/locations` | Storage zones and containers |
| `/colors` | DMC color reference (491 colors) |

## Scripts

```bash
yarn dev          # Start dev server
yarn build        # Production build
yarn preview      # Preview production build
```
