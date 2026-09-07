# Auth routes

- `/login` — email + password
- `/signup` — **candidates only** public self-registration
- `/forgot-password` — send recovery OTP
- `/verify-otp` — enter 6-digit code (`flow=recovery` | `invite` | `signup`)
- `/reset-password` — set new password after recovery
- `/set-password` — first password after invite
- `/unauthorized` — wrong role
- `/auth/confirm` — email invite / magic-link callback
- `/auth/signout` — POST sign out

Setup guide: `docs/AUTH_SETUP.md`  
Seed admin: `npm run seed:admin`
