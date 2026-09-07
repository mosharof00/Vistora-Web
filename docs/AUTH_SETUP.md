# Auth email templates & OTP setup (Supabase Dashboard)

Paste these in **Authentication → Emails → Templates**.
Custom SMTP must stay enabled for reliable delivery to your inbox.

Keep **Email OTP expiration** at **3600 seconds (1 hour)**.

Brand name in templates: **Vistora** (from `src/config/brand.ts`).

---

## Dashboard checklist (do this first)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → project **Vistora**
2. **Authentication → URL Configuration**
   - **Site URL:** `http://localhost:3000` (later your production URL)
   - **Redirect URLs** add:
     - `http://localhost:3000/**`
     - `http://localhost:3000/auth/confirm`
     - `http://localhost:3000/auth/confirm**`
3. **Authentication → Providers → Email**
   - Enable Email
   - **Confirm email** = ON (for invites / new users)
4. **Authentication → Emails**
   - Enable **Custom SMTP** (required for real delivery)
   - Set **Email OTP expiration** = `3600`
5. Paste the three templates below (Confirm, Reset, Invite)

### SMTP (send from your email)

In **Project Settings → Authentication → SMTP Settings** (or Emails → SMTP):

| Field | Example |
|---|---|
| Sender email | your Gmail / workspace email |
| Sender name | Vistora |
| Host | `smtp.gmail.com` (Gmail) |
| Port | `465` (SSL) or `587` (STARTTLS) |
| Username | your full email |
| Password | Gmail **App Password** (not your normal password) |

Gmail: Google Account → Security → 2-Step Verification → App passwords → create one for “Mail”.

---

## 1. Confirm sign up

**Subject:** `Your Vistora verification code`

**Body:**

```html
<h2>Verify your Vistora account</h2>

<p>Hello,</p>

<p>Use the 6-digit code below to verify your email address.</p>

<div style="margin: 32px 0; text-align: center;">
  <div style="display: inline-block; background: #eef2f6; border-radius: 12px; padding: 24px 40px;">
    <p style="margin: 0; font-size: 13px; color: #6b7289; letter-spacing: 1px; text-transform: uppercase; font-family: sans-serif;">Your verification code</p>
    <p style="margin: 12px 0 0; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #03045e; font-family: monospace;">{{ .Token }}</p>
  </div>
</div>

<p style="color: #5a738c; font-size: 13px;">This code expires in <strong>1 hour</strong>. If you did not request this, you can safely ignore this email.</p>

<p style="color: #5a738c; font-size: 13px;">— Vistora Team</p>
```

---

## 2. Reset password

**Subject:** `Your Vistora password reset code`

**Body:**

```html
<h2>Reset your Vistora password</h2>

<p>Hello,</p>

<p>Use the 6-digit code below to reset or change your password.</p>

<div style="margin: 32px 0; text-align: center;">
  <div style="display: inline-block; background: #eef2f6; border-radius: 12px; padding: 24px 40px;">
    <p style="margin: 0; font-size: 13px; color: #6b7289; letter-spacing: 1px; text-transform: uppercase; font-family: sans-serif;">Password reset code</p>
    <p style="margin: 12px 0 0; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #03045e; font-family: monospace;">{{ .Token }}</p>
  </div>
</div>

<p style="color: #5a738c; font-size: 13px;">This code expires in <strong>1 hour</strong>. If you did not request this, ignore this email — your password will not change.</p>

<p style="color: #5a738c; font-size: 13px;">— Vistora Team</p>
```

---

## 3. Invite user (Accept button)

Used when admin invites staff / HR / candidates.

**Subject:** `You've been invited to Vistora`

**Body:**

```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #0b1f33;">
  <h1 style="font-size: 22px; line-height: 1.35; margin: 0 0 16px;">
    You've been invited to join Vistora
  </h1>

  <p style="font-size: 15px; line-height: 1.6; margin: 0 0 12px;">Hi{{ if .Data.full_name }} {{ .Data.full_name }}{{ end }},</p>

  <p style="font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
    A Vistora administrator has invited you to create an account on the manpower platform.
  </p>

  <div style="text-align: center; margin: 0 0 16px;">
    <a
      href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/set-password"
      style="display: inline-block; background: #03045e; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 8px;"
    >
      Accept invite
    </a>
  </div>

  <p style="font-size: 13px; line-height: 1.5; color: #666666; margin: 0 0 24px; text-align: center;">
    This invite expires in <strong>1 hour</strong>.
  </p>

  <p style="font-size: 13px; line-height: 1.5; color: #5a738c; margin: 0;">
    If you were not expecting this invitation, you can ignore this email.
  </p>

  <p style="font-size: 13px; color: #5a738c; margin: 24px 0 0;">— Vistora Team</p>
</div>
```

---

## Create your first admin (to test login)

You do **not** need to insert into `auth.users` by hand. The seed script uses the
Supabase Admin API (`createUser`) — same shape as Import Mark (`app_metadata.role`,
confirmed email, `user_metadata.full_name`).

Demo creds are in `.env.example`:

```bash
SEED_ADMIN_EMAIL=admin@vistora.com
SEED_ADMIN_PASSWORD=123456
SEED_ADMIN_NAME=Admin
```

Copy into `.env.local` (or rely on the script’s fallback), then:

```bash
npm run seed:admin
# or: node --env-file=.env.local scripts/seed-admin.mjs
```

Open `http://localhost:3000/login` and sign in.

### Demo users (all roles)

```bash
npm run seed:demo
```

Creates users + sample companies, agents, orders, cases, payments, HR rows.

| Role | Email | Password |
|---|---|---|
| admin | `admin@vistora.com` | `SEED_DEMO_PASSWORD` (default `12345678`) |
| staff | `staff@vistora.com` | same |
| hr | `hr@vistora.com` | same |
| office_assistant | `office@vistora.com` | same |
| candidate | `candidate@vistora.com` | same |

### Public registration

Only **candidates** can self-register at `/signup`. After email OTP, the app sets
`app_metadata.role = candidate` and creates/links a `public.candidates` row.
Admin, staff, HR, and office assistants are created by invite (under someone).

---

## Test plan

1. Login with seeded admin → `/admin`
2. Candidate signup → OTP → login → `/candidate`
3. Forgot password → OTP email → reset → back to dashboard
4. (Later) Admin invite staff → Accept invite → set password

OTP code in emails is **`{{ .Token }}`** (6 digits). Invite link uses **`{{ .TokenHash }}`**.
