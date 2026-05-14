# Aaludra Mini CRM

A small CRM that lists 1000+ customers on a single page with no pagination, search highlighting, status filtering, and a stats dashboard.

**Stack:** Next.js 16 (App Router) · Tailwind 4 · Nest.js 11 · Postgres 14+ · TypeORM · TanStack Virtual + Query · React Hook Form + Zod.

## What's inside

- **Auth** — JWT (bcrypt, 7-day expiry). Login / signup pages. HttpOnly session cookie on the client. Route protection via Next.js middleware + Nest `JwtAuthGuard`.
- **Customers** — full CRUD scoped per user. Fields: `name`, `email`, `phone`, `company`, `status` (`lead` | `active` | `inactive`), `createdAt`.
- **Search & filter** — server-side `ILIKE` on name/email, status enum filter. Debounced (250 ms) from the client.
- **Dashboard** — total / active / lead / inactive counts from a single grouped query.
- **1000-row list** — TanStack Virtual renders ~30 row nodes regardless of dataset size. Sticky header. Matches highlighted in `<mark>`.
- **Seed** — 1000 realistic customers via `@faker-js/faker`, weighted 50% active / 30% lead / 20% inactive.

## Project layout

```
server/   Nest.js + TypeORM + Postgres
  src/
    modules/{auth,users,customer}    # feature modules
    database/{entities,migrations}   # User, Customer + schema migrations
    scripts/seed.ts                  # 1000-record seed
    common/decorators/               # @CurrentUser()

client/   Next.js App Router
  app/
    (auth)/{login,signup}            # public auth pages
    (private)/{dashboard,customer}   # JWT-protected routes
    actions/{auth,customers}.ts      # "use server" RPC layer
    providers.tsx                    # React Query provider
  components/ui/                     # Button, Input, Select, Modal, Badge, Spinner
  lib/{api,session,customers,customer-types,highlight,dal}.ts
  middleware.ts                      # redirects based on session cookie
```

## Setup

### Prerequisites
- Node 20+
- Postgres 14+ running locally (or any reachable Postgres)
- A database created for the project (default name: `aaludracrm`)

```bash
createdb aaludracrm    # or psql -c "CREATE DATABASE aaludracrm"
```

### 1. Backend

```bash
cd server
cp .env.example .env   # if present; otherwise create .env with the keys below
npm install
npm run migration:run  # creates users + customers schema
npm run seed           # inserts demo user + 1000 customers
npm run start:dev      # http://localhost:8000
```

`.env` keys:
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=aaludracrm
PORT=8000
JWT_SECRET=<any-long-random-string>
JWT_EXPIRES_IN=7d
```

Seed creates a demo user:

```
email:    demo@aaludra.com
password: Demo@1234
```

### 2. Frontend

```bash
cd client
npm install
npm run dev            # http://localhost:3000
```

`.env`:
```
API_URL=http://localhost:8000/api
```

Open http://localhost:3000, log in with the demo credentials, and you'll land on `/customer`.

## API

All endpoints are guarded by `JwtAuthGuard` (except auth) and scoped to the authenticated user.

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/signup` | `{name,email,password,confirmPassword}` |
| POST | `/api/auth/login` | returns `{access_token, user}` |
| GET  | `/api/auth/me` | current user |
| GET  | `/api/customers?search=&status=` | full filtered set, no paging |
| GET  | `/api/customers/stats` | `{total,active,inactive,lead}` |
| GET  | `/api/customers/:id` | one |
| POST | `/api/customers` | create |
| PATCH | `/api/customers/:id` | update |
| DELETE | `/api/customers/:id` | soft delete |

Customer JSON shape:
```ts
{ id, name, email, phone, company, status: 'lead'|'active'|'inactive', createdAt, updatedAt }
```

## How the no-pagination constraint is met

The assignment requires loading and rendering all 1000 records at once. The implementation:

1. **Single network round-trip** — the server returns the full filtered set in one response. With composite indexes on `(owner_id, status)`, `(owner_id, name)`, `(owner_id, email)`, `(owner_id, created_at DESC)`, the query stays under ~40 ms even on cold cache for 1000 rows.
2. **Virtualized rendering** — `@tanstack/react-virtual` mounts only the rows that fit the viewport plus 10 overscan rows above and below. Total mounted DOM nodes ≈ 30, regardless of dataset size. Scroll stays at 60 fps.
3. **Debounced search** — keystrokes are debounced 250 ms via `use-debounce`, so a fast typist triggers ~4 requests instead of 30.
4. **`placeholderData` on the query** — previous results stay visible during refetch, so the list never flickers between renders.
5. **Stable row keys** — `key={row.id}` (not array index) so React doesn't remount rows when the filter changes.
6. **`tabular-nums`** on the dashboard numbers to avoid layout shift while counts settle.

### Observed performance (local, MacBook)

- `GET /api/customers` (1000 rows): **~32 ms** server time
- First paint of the customer list page: **<200 ms** after JS hydration
- DOM nodes for 1000 rows: **~30** (overscan + viewport)
- Search keystroke → filtered results visible: **~280 ms** (250 ms debounce + ~30 ms server)

The `<PerfBadge>` in the bottom-right corner shows live `rows · render · query` numbers in dev mode.

## Scripts

### Backend (`server/`)

| Script | What it does |
|---|---|
| `npm run start:dev` | dev server with watch |
| `npm run build` | TS compile |
| `npm run migration:run` | apply pending migrations |
| `npm run migration:revert` | undo the last migration |
| `npm run seed` | upsert demo user, wipe their customers, insert 1000 |

### Frontend (`client/`)

| Script | What it does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run start` | run the production build |
| `npm run lint` | ESLint |

## Notes

- The Customer entity refactor in migration `RefactorCustomersV2` is destructive — it drops the legacy `companies` and `customers` tables before recreating the customers schema. Fine for a fresh assignment install, not for any environment with real data.
- Search is server-side, not client-side. The "no pagination" constraint is about rendering, not about pulling everything client-side and filtering locally. Server-side search keeps payloads small as the dataset grows.
- The `proxy.ts → middleware.ts` rename: Next.js 16 actually prefers `proxy.ts` going forward and warns on `middleware.ts`. Either filename works today; this project uses `middleware.ts` for App Router familiarity.
