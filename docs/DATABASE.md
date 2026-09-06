# Vistora database (Supabase / Postgres)

Project ref: `fvbveampvhegucibltdf`  
Focus: manpower ERP (travel ticketing / tourist visa deferred).

## Auth spine (Import Mark pattern)

- Role lives in `auth.users.raw_app_meta_data.role` only (`user_role` enum).
- Login profiles: `admins`, `employees` (staff/hr/office_assistant), `candidates` (`auth_user_id` nullable until invite).
- Non-login parties: `agents`, `employer_companies` — **Admin only** may create/edit; staff may read.
- Staff create/update **candidates** and case processing.

## Employer deals & quota

- `job_orders` = demand from an employer (category, `required_count`, salary in destination currency).
- Docs: `demand_letter`, `visa_advice`, `employer_other` (via `documents` + optional FKs on job order).
- `filled_count` auto-updates when `candidate_cases` are assigned; remaining = `required_count - filled_count`.
- Same pattern on `visa_batches.quota_count` / `filled_count`.
- `ticket_provision`: none | go_only | return_only | go_and_return.

## Multi-currency & payments

- `currencies` (BDT, SAR, AED, …).
- Job order salary: `salary_amount` + `salary_currency_code` (candidate sees destination currency via `candidate_case_salary` view).
- `payment_gateways` — Admin CRUD; selectable on payments.
- `payments` — candidate money in (gateway + amount + currency).
- `company_payments` — Vistora investment / settlements with employer (gateway + proof document).

## Storage paths

```
avatars/candidates/{id}/{file}
avatars/employees/{id}/{file}
passports/candidates/{id}/{file}
case-docs/cases/{caseId}/{docType}/{file}
contracts/employer_companies/{id}/demand_letter/{file}
finance-proofs/company_payments/{id}/{file}
```

Helper: `src/lib/storage/paths.ts`

## Brand / UI

- Logo: `public/brand/vistora_logo.png`
- Colors/fonts: `src/config/brand.ts` → `src/app/globals.css`
- Dashboard shell: Import Mark layout (sidebar + topbar), Vistora blue tokens

See `docs/ARCHITECTURE.md`.
