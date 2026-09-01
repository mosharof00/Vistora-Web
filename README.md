# Vistora Web

Marketing site for **Vistora Tours & Travels**.

Tagline: *Explore More, Travel Beyond*

This repo is intentionally split so a public landing page can ship first, then an admin panel, auth, and a multi-role operations system can land without rewriting the app.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion (UI + scroll-linked hero)
- Supabase later (not wired yet)

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What is in this pass

- Project structure for marketing now, auth/admin later
- Brand and site constants (`src/config`)
- Cinematic scroll hero (aircraft window → clouds → Eiffel Tower)
- Editorial band + arrival bento, matching the reference sequence
- CMS-shaped TypeScript types for destinations, tours, visas, inquiries

## What is not in this pass

- Full services / visa / tours pages
- Inquiry form + WhatsApp number
- Admin panel, auth, Supabase

See `docs/ARCHITECTURE.md` and `docs/REQUIREMENTS.md`.
