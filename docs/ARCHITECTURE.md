# Architecture

Vistora ships a **marketing site** plus a **manpower ERP** backend on Supabase.

```
src/
  app/
    (marketing)/     Public landing
    (auth)/          login / unauthorized
    (dashboard)/     /admin /staff /hr /office /candidate
    auth/confirm/    Email / invite callback
  lib/
    auth/            roles, requireRole
    supabase/        browser / server / middleware / admin clients
    storage/         object path helpers
  types/
    database.types.ts  Generated from Supabase
    cms.ts             Marketing CMS shapes (static until tables land)
supabase/migrations/   Source of truth for schema
docs/DATABASE.md       Schema overview
```

## Auth

Same spine as Import Mark (login UI next):

1. Supabase Auth user
2. Role in `app_metadata.role` (`admin | staff | hr | office_assistant | candidate`)
3. Profile row (`admins` / `employees` / `candidates`)
4. Middleware session refresh + role path guards
5. RLS: Admin-only write on agents/employer companies; staff write candidates/cases

Agents and foreign employer companies are **records only** (no login).

## Dashboard UI

Import Mark shell: sidebar + topbar + avatar menu.  
Colors from logo via `src/config/brand.ts` → `globals.css` (light blue page, deep blue buttons).  
Logo: `public/brand/vistora_logo.png`.

## Config

- `src/config/site.ts` — app name, contact
- `src/config/brand.ts` — name, logo paths, colors, fonts (change once)
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Out of scope (for now)

Tourist visa products and air-ticket trading. Schema is ready to extend later.
