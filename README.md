# Vistora Web

Marketing site + manpower ERP for **Vistora Tours & Travels**.

Tagline: *Explore More, Travel Beyond*

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion
- Supabase (Auth, Postgres, Storage)

## Develop

```bash
cp .env.example .env.local
# fill NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What is in place

- Cinematic marketing homepage
- Full manpower schema on Supabase (candidates, passports, job orders, visa batches, process steps, documents/storage, HR attendance, BDT finance)
- Auth spine: roles, middleware, `requireRole`, dashboard route stubs
- Generated types: `src/types/database.types.ts`

See `docs/DATABASE.md` and `docs/ARCHITECTURE.md`.

## Scripts

```bash
npm run gen:types   # regenerate Database types (requires Supabase CLI + project id)
```
