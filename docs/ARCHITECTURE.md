# Architecture

Vistora is a **marketing site first**. Folders below are shaped so a company OS (roles, leads, packages, visas) can be added without moving the landing page.

```
src/
  app/
    (marketing)/     Public site. Current homepage lives here.
    (auth)/          Future: login / invite / password reset
    (dashboard)/     Future: admin + staff roles
    api/             Future: Route Handlers (inquiries, webhooks)
  components/
    marketing/       Landing-only UI (hero, sections)
    shared/          Logo, pieces used by marketing AND future app
    ui/              Future primitives (button, input, dialog)
  config/            App name, brand, nav — change once, reuse everywhere
  content/           Static copy. Later replaced or hydrated from Supabase
  lib/               Pure helpers
  types/             CMS / lead shapes used by future admin
  hooks/
public/
  brand/             Logo
  hero/              Cinematic stills (licensed Unsplash, not the paid template)
```

## Config before components

- `src/config/site.ts` — `APP_NAME`, legal name, tagline, contact, socials
- `src/config/brand.ts` — colors, asset paths
- `src/config/navigation.ts` — header / experience / footer links

Do not hardcode “Vistora” in random files. Import from config.

## Content vs CMS

`src/content/*` is the stand-in for a CMS. Keep objects serializable (no React nodes) so they can move to Supabase tables later:

- destinations
- tour packages
- visa products
- reviews
- inquiries (`New → Contacted → Processing → Completed → Cancelled`)

Types already live in `src/types/cms.ts`.

## Hero

The header is an original scroll-scrubbed sequence inspired by the VELUNE motion language (window → descent → tower), with Vistora copy. It does not use HorizonX source files.

Motion lives in `src/components/marketing/hero/`. Copy lives in `src/content/hero.ts`.

## Route groups

| Group | URL today | Later |
|---|---|---|
| `(marketing)` | `/` | `/tours`, `/visa`, `/about` |
| `(auth)` | — | `/login` |
| `(dashboard)` | — | `/admin`, `/staff` |

Layouts stay separate so the cinematic landing never wraps the admin chrome.
