#!/usr/bin/env node
/**
 * Create / refresh the demo Vistora admin (Auth + public.admins).
 * Same shape as Import Mark: app_metadata.role = "admin", email_confirm = true.
 *
 * Usage:
 *   npm run seed:admin
 *
 * Reads .env.local. Falls back to demo defaults from .env.example when
 * SEED_ADMIN_* are unset:
 *   admin@vistora.com / 123456 / Admin
 *
 * You do NOT need to insert into auth.users manually — the Admin API does it.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i <= 0) continue;
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env.example"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.SEED_ADMIN_EMAIL || "admin@vistora.com").trim();
const password = process.env.SEED_ADMIN_PASSWORD || "123456";
const fullName = process.env.SEED_ADMIN_NAME || "Admin";
const phone = process.env.SEED_ADMIN_PHONE || "+8801700000000";

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(target) {
  const normalized = target.toLowerCase();
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const match = data.users.find(
      (u) => (u.email || "").toLowerCase() === normalized
    );
    if (match) return match;
    if (data.users.length < 200) break;
  }
  return null;
}

async function upsertAdminRow(userId) {
  const { error } = await admin.from("admins").upsert(
    {
      id: userId,
      email,
      full_name: fullName,
      phone,
      is_active: true,
    },
    { onConflict: "id" }
  );
  if (error) throw error;
}

const existing = await findUserByEmail(email);

if (existing) {
  const { error: updateError } = await admin.auth.admin.updateUserById(
    existing.id,
    {
      password,
      email_confirm: true,
      app_metadata: {
        role: "admin",
        provider: "email",
        providers: ["email"],
      },
      user_metadata: {
        full_name: fullName,
        phone,
        email_verified: true,
      },
    }
  );
  if (updateError) {
    console.error(updateError.message);
    process.exit(1);
  }
  await upsertAdminRow(existing.id);
  console.log(`Updated demo admin: ${email} (id=${existing.id})`);
  process.exit(0);
}

const { data: created, error: createError } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  app_metadata: {
    role: "admin",
    provider: "email",
    providers: ["email"],
  },
  user_metadata: {
    full_name: fullName,
    phone,
    email_verified: true,
  },
});

if (createError || !created.user) {
  console.error(createError?.message || "No user returned");
  process.exit(1);
}

await upsertAdminRow(created.user.id);
console.log(`Created demo admin: ${email} (id=${created.user.id})`);
console.log("Login at /login with SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD");
