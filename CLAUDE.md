# CLAUDE.md — CraftVault Client

## Project Overview

CraftVault is a craft supply, equipment, and project management app. The primary use case is answering **"Do I already have this?"** while shopping at craft stores. It tracks diamond painting drill inventory, craft equipment, general supplies, and projects.

This is the **React frontend** for the CraftVault API. The server is complete and running at:
- **Production:** `https://craftvault-api.staubracing.com`
- **Local dev:** `http://localhost:3002`

The API is open (no auth). All routes are prefixed with `/api/v1`.

## Tech Stack

- **Vite + React + TypeScript**
- **React Router** for routing
- **No heavy UI framework** — prefer custom/themed components, use project-specific libraries only
- **Fetch API** or a lightweight HTTP client (no axios needed)
- **Deploy target:** Cloudflare Pages

## Commands

| Command | Description |
|---------|-------------|
| `yarn install` | Install dependencies |
| `yarn dev` | Start dev server (Vite default port 5173) |
| `yarn build` | Production build (`tsc -b && vite build`) |
| `yarn preview` | Preview production build |
| `yarn lint` | Run ESLint (`eslint .`) |

## Design Target

- **iPad-first responsive** — the app is primarily used on an iPad while crafting/shopping
- Must also work well on desktop and mobile
- Clean, functional, craft-themed UI — not corporate/boring, not overly decorative
- Touch-friendly tap targets (min 44px)

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Overview — quick stats, recent activity |
| `/drills` | Drills | Diamond painting drill inventory, filter by color/DMC code |
| `/supplies` | Supplies | General craft supplies, search by name, filter by category |
| `/equipment` | Equipment | Craft equipment tracking, filter by category/status |
| `/projects` | Projects | Project list with status tracking |
| `/projects/:id` | Project Detail | Single project with linked supplies |
| `/locations` | Locations | Storage zones and containers |
| `/colors` | Colors | DMC color reference (491 colors, read-only) |

## API Reference

All entity shapes and create-input types are defined in `src/types/index.ts` — reference those rather than duplicating here.

### Response Envelope

```json
{ "success": true, "data": { ... } }
{ "success": true, "message": "..." }          // on delete
{ "success": false, "message": "...", "errors": [...] }  // on error
```

No pagination. List endpoints return all matching records. Use query params to filter.

### Endpoints Summary

| Resource | Base Path | Key Query Params | Notes |
|----------|-----------|-----------------|-------|
| Colors | `/api/v1/colors` | _(none)_ | Read-only, 491 DMC colors. Also `GET /dmc/:code` |
| Zones | `/api/v1/zones` | `include_inactive` | `GET /:id` includes nested `locations[]` |
| Locations | `/api/v1/locations` | `zone_id`, `include_inactive` | Soft delete if referenced |
| Drills | `/api/v1/drills` | `color_id`, `location_id`, `include_inactive` | Unique on `color_id + location_id` (409). Also `GET /by-location/:id` |
| Equipment | `/api/v1/equipment` | `category`, `status`, `location_id`, `include_inactive` | Statuses: `working`, `needs_repair`, `broken`, `retired`. Also `GET /categories`, `GET /by-location/:id` |
| Supplies | `/api/v1/supplies` | `search`, `category`, `location_id`, `include_inactive` | `search` uses ILIKE. Also `GET /categories`, `GET /by-location/:id` |
| Projects | `/api/v1/projects` | `status`, `include_inactive` | `GET /:id` includes `supplies[]`. Also `POST/DELETE /:id/supplies`. Auto-sets progress=100 if status→completed. Statuses: `planning`, `in_progress`, `completed`, `on_hold`, `abandoned` |

All resources support: `GET /`, `GET /:id`, `POST /`, `PUT /:id` (partial), `DELETE /:id` (soft).

## Current Status

**Built:** Project shell, API client layer, all routes, Layout with nav, TypeScript types for all resources.

**Remaining:** Page implementations (Dashboard, Drills, Supplies, Equipment, Projects, Project Detail, Locations, Colors), iPad-first responsive polish, loading/error/empty states, Cloudflare Pages deployment.

**Architecture:**
```
src/
  api/client.ts    — Generic fetch helpers: getAll, getOne, create, update, remove, request
  api/{resource}.ts — One file per resource, exports a {resource}Api object
  api/index.ts     — Barrel re-export
  types/index.ts   — All TypeScript interfaces, query param types, create input types
  components/      — Shared UI (Layout.tsx, Layout.css)
  pages/{route}/   — One folder per route, named exports
```

## Environment Variables

```
VITE_API_URL=https://craftvault-api.staubracing.com  # production
VITE_API_URL=http://localhost:3002                     # development
```

## Key API Behaviors for Frontend

- **All IDs are UUIDs** — validate on forms where needed
- **Soft deletes** — `is_active` flag. Default list views hide inactive. Consider an "show inactive" toggle.
- **PUT is partial update** — only send fields you want to change. Omitted fields keep current values.
- **No pagination** — all results come back at once. For large lists (491 colors), use client-side search/filter.
- **Error responses** have `{ success: false, message: string, errors?: array }` — display `message` to user, use `errors` array for field-level form validation.
- **DELETE returns `{ success: true, message: "..." }`** — no `data` field on delete.

## Key Files

- `src/api/client.ts` — Fetch wrapper with `ApiError` class, generic `getAll`/`getOne`/`create`/`update`/`remove` helpers, `buildQuery` for query strings
- `src/types/index.ts` — All interfaces: entity types (`Drill`, `Equipment`, etc.), create inputs (`DrillCreateInput`), query params (`DrillQueryParams`), API response envelopes
- `src/components/Layout.tsx` — App shell with header + sidebar nav, wraps all routes via `<Outlet />`
- `src/main.tsx` — Entry point, `BrowserRouter` with all routes defined

## Code Style

- **Functional components** with hooks
- **Named exports** (not default exports)
- Keep components co-located with their pages
- Extract shared components to `src/components/`
- Use CSS modules or a simple CSS approach (no CSS-in-JS runtime)

## Gotchas

- **`ApiError` class** — `client.ts` throws `ApiError` (not plain Error) with `status`, `message`, and `errors` fields. Catch with `instanceof ApiError` when you need field-level validation messages.
- **`ZoneDetail` vs `Zone`** — `GET /zones/:id` returns `ZoneDetail` which includes a nested `locations[]` array. `GET /zones` returns plain `Zone[]` without locations.
- **`by-location` endpoints** — Drills, Equipment, and Supplies each have `GET /by-location/:location_id` for filtering items in a specific location. Use these instead of filtering client-side.
- **Drill 409 conflict** — Creating a drill with an existing `color_id + location_id` pair returns HTTP 409. Show a user-friendly message, not a generic error.
- **Package name is `craftvault-client-temp`** in `package.json` — rename when ready to deploy.
