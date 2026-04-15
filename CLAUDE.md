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

```bash
yarn dev          # Start dev server (Vite default port 5173)
yarn build        # Production build
yarn preview      # Preview production build
yarn format       # Prettier formatting (set up after init)
```

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

### Response Envelope

All endpoints return:
```json
{ "success": true, "data": { ... } }
{ "success": true, "message": "..." }          // on delete
{ "success": false, "message": "...", "errors": [...] }  // on error
```

No pagination. List endpoints return all matching records. Use query params to filter.

### Colors — `/api/v1/colors` (read-only)
- `GET /` — all 491 DMC colors ordered by code
- `GET /dmc/:code` — lookup by DMC code (e.g. `/dmc/310` → Black)
- `GET /:id` — by UUID

**Color shape:** `{ id, dmc_code, symbol?, name, hex_value?, created_at }`

### Zones — `/api/v1/zones`
- `GET /` — `?include_inactive=true`
- `GET /:id` — includes nested `locations[]`
- `POST /` — `{ code, name, description?, sort_order? }`
- `PUT /:id` — partial update
- `DELETE /:id` — soft delete if has locations, hard if empty

**Zone shape:** `{ id, code, name, description?, sort_order, is_active, created_at }`

### Locations — `/api/v1/locations`
- `GET /` — `?zone_id=&include_inactive=true`
- `GET /:id`
- `POST /` — `{ zone_id, code, name, description?, sort_order? }`
- `PUT /:id` — partial update
- `DELETE /:id` — soft delete if referenced, hard if not

**Location shape:** `{ id, zone_id, code, name, description?, sort_order, is_active, created_at, zone_code, zone_name }`

### Drills — `/api/v1/drills`
- `GET /` — `?color_id=&location_id=&include_inactive=true`
- `GET /by-location/:location_id`
- `GET /:id`
- `POST /` — `{ color_id, location_id, quantity, notes? }`
- `PUT /:id` — partial update
- `DELETE /:id` — soft delete

**Drill shape:** `{ id, color_id, location_id, quantity, notes?, is_active, created_at, dmc_code, color_name, hex_value?, location_code, location_name, zone_code, zone_name }`

**Note:** Unique constraint on `color_id + location_id`. Returns 409 on duplicate.

### Equipment — `/api/v1/equipment`
- `GET /categories` — distinct category strings
- `GET /` — `?category=&status=&location_id=&include_inactive=true`
- `GET /by-location/:location_id`
- `GET /:id`
- `POST /` — `{ name, category, brand?, model?, location_id?, status?, serial_number?, purchase_date?, purchase_price?, purchase_location?, notes? }`
- `PUT /:id` — partial update
- `DELETE /:id` — soft delete

**Equipment shape:** `{ id, name, category, brand?, model?, location_id?, status, serial_number?, purchase_date?, purchase_price?, purchase_location?, notes?, is_active, created_at, location_code?, location_name?, zone_code?, zone_name? }`

**Statuses:** `working`, `needs_repair`, `broken`, `retired`

### Supplies — `/api/v1/supplies`
- `GET /categories` — distinct category strings
- `GET /` — `?search=&category=&location_id=&include_inactive=true`
- `GET /by-location/:location_id`
- `GET /:id`
- `POST /` — `{ name, category, quantity?, location_id?, notes? }`
- `PUT /:id` — partial update
- `DELETE /:id` — soft delete

**Supply shape:** `{ id, name, category, quantity, location_id?, notes?, is_active, created_at, location_code?, location_name?, zone_code?, zone_name? }`

**Note:** `?search=` uses ILIKE (case-insensitive partial match on name).

### Projects — `/api/v1/projects`
- `GET /` — `?status=&include_inactive=true`
- `GET /:id` — includes nested `supplies[]`
- `POST /` — `{ name, description?, status?, progress?, last_worked_on?, notes? }`
- `PUT /:id` — partial update (auto-sets progress=100 if status→completed)
- `DELETE /:id` — soft delete
- `POST /:id/supplies` — link a supply: `{ supply_id, quantity_needed?, notes? }`
- `DELETE /:id/supplies/:supplyId` — unlink supply

**Project shape:** `{ id, name, description?, status, progress, last_worked_on?, notes?, is_active, created_at, updated_at }`

**Statuses:** `planning`, `in_progress`, `completed`, `on_hold`, `abandoned`

**Project with supplies:** `{ ...project, supplies: [{ id, project_id, supply_id, quantity_needed, notes?, supply_name, supply_category, supply_quantity }] }`

## Implementation Phases

### Phase 1: Foundation
1. Initialize Vite + React + TypeScript project with `yarn create vite . --template react-ts`
2. Install dependencies: `react-router-dom`, `lucide-react` (icons)
3. Set up project structure:
   ```
   src/
     api/          — API client functions (one file per resource)
     components/   — Shared UI components (Layout, Header, etc.)
     pages/        — One folder per route
     types/        — TypeScript interfaces matching API shapes
     hooks/        — Custom hooks for data fetching
   ```
4. Create API client with base URL config (env var for production, localhost for dev)
5. Set up React Router with all routes
6. Build app shell: responsive layout with sidebar/bottom nav

### Phase 2: Core Pages
7. Build Dashboard page (quick stats, navigation cards)
8. Build Drills page (list with color swatches, filter by DMC code, add/edit modal)
9. Build Supplies page (list with search bar, category filter chips, add/edit modal)
10. Build Equipment page (list with status badges, category filter, add/edit modal)
11. Build Projects page (kanban or list view with status, progress bar)
12. Build Project Detail page (linked supplies, add/remove supplies)

### Phase 3: Supporting Pages
13. Build Locations page (zones + nested locations, manage both)
14. Build Colors page (searchable grid of DMC colors with swatches)

### Phase 4: Polish & Deploy
15. Responsive tweaks for iPad-first
16. Loading states, error states, empty states
17. Set up Cloudflare Pages deployment
18. Add `https://craftvault.pages.dev` to server's `ALLOWED_ORIGINS`

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

## TypeScript Interfaces

Create these in `src/types/` matching the API shapes exactly:

```typescript
// All entities have these common fields:
interface BaseEntity {
  id: string;
  is_active: boolean;
  created_at: string;
}

// Color, Zone, Location, Drill, Equipment, Supply, Project, ProjectSupply
// — shapes documented in the API Reference section above
```

## Code Style

- **Functional components** with hooks
- **Named exports** (not default exports)
- Keep components co-located with their pages
- Extract shared components to `src/components/`
- Use CSS modules or a simple CSS approach (no CSS-in-JS runtime)
