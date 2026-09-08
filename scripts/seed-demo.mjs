#!/usr/bin/env node
/**
 * Seed demo users (all roles) + representative manpower ERP data.
 *
 * Usage:
 *   npm run seed:demo
 *
 * Shared password (all demo users):
 *   SEED_DEMO_PASSWORD || SEED_ADMIN_PASSWORD || 12345678
 *
 * Idempotent: fixed demo UUIDs / unique codes; safe to re-run.
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
const password =
  process.env.SEED_DEMO_PASSWORD ||
  process.env.SEED_ADMIN_PASSWORD ||
  "12345678";

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** Fixed demo UUIDs (v4-shaped) for idempotent upserts. */
const ID = {
  company1: "d1000001-0000-4000-8000-000000000001",
  company2: "d1000001-0000-4000-8000-000000000002",
  agent1: "d1000002-0000-4000-8000-000000000001",
  agent2: "d1000002-0000-4000-8000-000000000002",
  catConstruction: "d1000003-0000-4000-8000-000000000001",
  catDriver: "d1000003-0000-4000-8000-000000000002",
  catCleaner: "d1000003-0000-4000-8000-000000000003",
  order1: "d1000004-0000-4000-8000-000000000001",
  order2: "d1000004-0000-4000-8000-000000000002",
  order3: "d1000004-0000-4000-8000-000000000003",
  batch1: "d1000005-0000-4000-8000-000000000001",
  batch2: "d1000005-0000-4000-8000-000000000002",
  cand1: "d1000006-0000-4000-8000-000000000001",
  cand2: "d1000006-0000-4000-8000-000000000002",
  cand3: "d1000006-0000-4000-8000-000000000003",
  cand4: "d1000006-0000-4000-8000-000000000004",
  cand5: "d1000006-0000-4000-8000-000000000005",
  case1: "d1000007-0000-4000-8000-000000000001",
  case2: "d1000007-0000-4000-8000-000000000002",
  case3: "d1000007-0000-4000-8000-000000000003",
  case4: "d1000007-0000-4000-8000-000000000004",
  fee1: "d1000008-0000-4000-8000-000000000001",
  fee2: "d1000008-0000-4000-8000-000000000002",
  pay1: "d1000009-0000-4000-8000-000000000001",
  pay2: "d1000009-0000-4000-8000-000000000002",
  pay3: "d1000009-0000-4000-8000-000000000003",
  cpay1: "d100000a-0000-4000-8000-000000000001",
  expense1: "d100000b-0000-4000-8000-000000000001",
  expense2: "d100000b-0000-4000-8000-000000000002",
  commission1: "d100000c-0000-4000-8000-000000000001",
  passport1: "d100000d-0000-4000-8000-000000000001",
  passport2: "d100000d-0000-4000-8000-000000000002",
  holiday1: "d100000e-0000-4000-8000-000000000001",
  leave1: "d100000f-0000-4000-8000-000000000001",
  attendance1: "d1000010-0000-4000-8000-000000000001",
  attendance2: "d1000010-0000-4000-8000-000000000002",
  salary1: "d1000011-0000-4000-8000-000000000001",
  salaryItem1: "d1000012-0000-4000-8000-000000000001",
};

const DEMO_USERS = [
  {
    key: "admin",
    email: process.env.SEED_ADMIN_EMAIL || "admin@vistora.com",
    role: "admin",
    fullName: process.env.SEED_ADMIN_NAME || "Demo Admin",
    phone: "+8801700000001",
  },
  {
    key: "staff",
    email: "staff@vistora.com",
    role: "staff",
    fullName: "Demo Staff",
    phone: "+8801700000002",
    employeeCode: "EMP-STAFF-01",
    department: "Operations",
    designation: "Manpower Officer",
    salary: 45000,
  },
  {
    key: "hr",
    email: "hr@vistora.com",
    role: "hr",
    fullName: "Demo HR",
    phone: "+8801700000003",
    employeeCode: "EMP-HR-01",
    department: "Human Resources",
    designation: "HR Executive",
    salary: 40000,
  },
  {
    key: "office",
    email: "office@vistora.com",
    role: "office_assistant",
    fullName: "Demo Office Assistant",
    phone: "+8801700000004",
    employeeCode: "EMP-OFF-01",
    department: "Front Desk",
    designation: "Office Assistant",
    salary: 25000,
  },
  {
    key: "candidate",
    email: "candidate@vistora.com",
    role: "candidate",
    fullName: "Demo Candidate",
    phone: "+8801700000005",
  },
];

function assertOk(label, error) {
  if (error) {
    console.error(`✗ ${label}:`, error.message);
    throw error;
  }
  console.log(`✓ ${label}`);
}

async function findUserByEmail(target) {
  const normalized = target.toLowerCase();
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await db.auth.admin.listUsers({
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

async function ensureAuthUser(spec) {
  const existing = await findUserByEmail(spec.email);
  const meta = {
    app_metadata: {
      role: spec.role,
      provider: "email",
      providers: ["email"],
    },
    user_metadata: {
      full_name: spec.fullName,
      phone: spec.phone,
      email_verified: true,
    },
  };

  if (existing) {
    const { data, error } = await db.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      ...meta,
    });
    assertOk(`auth update ${spec.email}`, error);
    return data.user;
  }

  const { data, error } = await db.auth.admin.createUser({
    email: spec.email,
    password,
    email_confirm: true,
    ...meta,
  });
  assertOk(`auth create ${spec.email}`, error);
  return data.user;
}

async function main() {
  console.log(`\nSeeding Vistora demo data…\nPassword for all demo users: ${password}\n`);

  const users = {};
  for (const spec of DEMO_USERS) {
    users[spec.key] = await ensureAuthUser(spec);
  }

  // Profiles
  {
    const admin = DEMO_USERS.find((u) => u.key === "admin");
    const { error } = await db.from("admins").upsert(
      {
        id: users.admin.id,
        email: admin.email,
        full_name: admin.fullName,
        phone: admin.phone,
        is_active: true,
      },
      { onConflict: "id" }
    );
    assertOk("admins profile", error);
  }

  for (const key of ["staff", "hr", "office"]) {
    const spec = DEMO_USERS.find((u) => u.key === key);
    const { error } = await db.from("employees").upsert(
      {
        id: users[key].id,
        email: spec.email,
        full_name: spec.fullName,
        phone: spec.phone,
        employee_code: spec.employeeCode,
        role: spec.role,
        department: spec.department,
        designation: spec.designation,
        basic_salary_bdt: spec.salary,
        joining_date: "2025-01-15",
        status: "active",
      },
      { onConflict: "id" }
    );
    assertOk(`employee ${key}`, error);
  }

  // Parties
  {
    const { error } = await db.from("employer_companies").upsert(
      [
        {
          id: ID.company1,
          company_code: "EMP-KSA-01",
          legal_name: "Al Noor Contracting LLC",
          trade_name: "Al Noor",
          country_code: "SA",
          city: "Riyadh",
          contact_person: "Abdullah Al Harbi",
          contact_phone: "+966500000001",
          contact_email: "hr@alnoor.example",
          status: "active",
          notes: "DEMO: Saudi construction employer",
        },
        {
          id: ID.company2,
          company_code: "EMP-UAE-01",
          legal_name: "Gulf Facilities Management",
          trade_name: "Gulf FM",
          country_code: "AE",
          city: "Dubai",
          contact_person: "Sara Khan",
          contact_phone: "+971500000002",
          contact_email: "ops@gulffm.example",
          status: "active",
          notes: "DEMO: UAE facilities employer",
        },
      ],
      { onConflict: "id" }
    );
    assertOk("employer_companies", error);
  }

  {
    const { error } = await db.from("agents").upsert(
      [
        {
          id: ID.agent1,
          agent_code: "AGT-DHK-01",
          full_name: "Karim Hossain",
          agency_name: "Karim Overseas",
          phone: "+8801711000001",
          email: "karim@agent.example",
          district: "Dhaka",
          commission_type: "fixed",
          commission_value: 15000,
          status: "active",
          notes: "DEMO agent",
        },
        {
          id: ID.agent2,
          agent_code: "AGT-CTG-01",
          full_name: "Nasrin Akter",
          agency_name: "Nasrin Travels",
          phone: "+8801811000002",
          email: "nasrin@agent.example",
          district: "Chattogram",
          commission_type: "per_candidate",
          commission_value: 12000,
          status: "active",
          notes: "DEMO agent",
        },
      ],
      { onConflict: "id" }
    );
    assertOk("agents", error);
  }

  {
    const { error } = await db.from("job_categories").upsert(
      [
        {
          id: ID.catConstruction,
          name: "Construction Labor",
          slug: "construction-labor",
          description: "General construction workers",
          is_active: true,
        },
        {
          id: ID.catDriver,
          name: "Heavy Driver",
          slug: "heavy-driver",
          description: "Truck / heavy vehicle drivers",
          is_active: true,
        },
        {
          id: ID.catCleaner,
          name: "Cleaner",
          slug: "cleaner",
          description: "Facility cleaning staff",
          is_active: true,
        },
      ],
      { onConflict: "id" }
    );
    assertOk("job_categories", error);
  }

  {
    const { error } = await db.from("fee_schedules").upsert(
      [
        {
          id: ID.fee1,
          fee_code: "FEE-KSA-PROC",
          name: "Saudi processing fee",
          amount_bdt: 85000,
          currency: "BDT",
          country_code: "SA",
          job_category_id: ID.catConstruction,
          is_active: true,
          notes: "DEMO",
        },
        {
          id: ID.fee2,
          fee_code: "FEE-UAE-PROC",
          name: "UAE processing fee",
          amount_bdt: 65000,
          currency: "BDT",
          country_code: "AE",
          job_category_id: ID.catCleaner,
          is_active: true,
          notes: "DEMO",
        },
      ],
      { onConflict: "id" }
    );
    assertOk("fee_schedules", error);
  }

  {
    const { error } = await db.from("job_orders").upsert(
      [
        {
          id: ID.order1,
          order_code: "JO-2026-001",
          title: "Construction workers — Riyadh",
          employer_company_id: ID.company1,
          job_category_id: ID.catConstruction,
          country_code: "SA",
          required_count: 20,
          status: "open",
          salary_amount: 1500,
          salary_currency_code: "SAR",
          salary_bdt: 48000,
          contract_duration_months: 24,
          ticket_provision: "go_only",
          received_at: "2026-08-01",
          created_by: users.staff.id,
          notes: "DEMO open order",
        },
        {
          id: ID.order2,
          order_code: "JO-2026-002",
          title: "Cleaners — Dubai malls",
          employer_company_id: ID.company2,
          job_category_id: ID.catCleaner,
          country_code: "AE",
          required_count: 12,
          status: "open",
          salary_amount: 1200,
          salary_currency_code: "AED",
          salary_bdt: 38000,
          contract_duration_months: 24,
          ticket_provision: "go_and_return",
          received_at: "2026-08-15",
          created_by: users.staff.id,
          notes: "DEMO open order",
        },
        {
          id: ID.order3,
          order_code: "JO-2026-003",
          title: "Heavy drivers — Jeddah",
          employer_company_id: ID.company1,
          job_category_id: ID.catDriver,
          country_code: "SA",
          required_count: 5,
          status: "draft",
          salary_amount: 1800,
          salary_currency_code: "SAR",
          salary_bdt: 56000,
          contract_duration_months: 24,
          ticket_provision: "none",
          created_by: users.staff.id,
          notes: "DEMO draft order",
        },
      ],
      { onConflict: "id" }
    );
    assertOk("job_orders", error);
  }

  {
    const { error } = await db.from("visa_batches").upsert(
      [
        {
          id: ID.batch1,
          batch_code: "VB-KSA-001",
          title: "Al Noor Visa Block A",
          job_order_id: ID.order1,
          quota_count: 20,
          status: "open",
          visa_number: "VISA-DEMO-1001",
          pro_office: "Dhaka PRO",
          opened_at: "2026-08-05",
          notes: "DEMO",
        },
        {
          id: ID.batch2,
          batch_code: "VB-UAE-001",
          title: "Gulf FM Visa Block 1",
          job_order_id: ID.order2,
          quota_count: 12,
          status: "processing",
          visa_number: "VISA-DEMO-2001",
          pro_office: "Chattogram PRO",
          opened_at: "2026-08-20",
          notes: "DEMO",
        },
      ],
      { onConflict: "id" }
    );
    assertOk("visa_batches", error);
  }

  // Link demo candidate login to one candidates row (may already exist from signup)
  let cand1Id = ID.cand1;
  {
    const { data: linked } = await db
      .from("candidates")
      .select("id")
      .eq("auth_user_id", users.candidate.id)
      .maybeSingle();
    if (linked?.id) cand1Id = linked.id;
  }

  {
    const { error } = await db.from("candidates").upsert(
      [
        {
          id: cand1Id,
          auth_user_id: users.candidate.id,
          candidate_code: "CAND-DEMO-01",
          full_name: "Demo Candidate",
          email: "candidate@vistora.com",
          phone: "+8801700000005",
          status: "in_process",
          source: "direct",
          gender: "male",
          nationality: "BD",
          primary_agent_id: null,
        },
        {
          id: ID.cand2,
          candidate_code: "CAND-DEMO-02",
          full_name: "Rafiul Islam",
          email: "rafiul@example.com",
          phone: "+8801712000002",
          status: "in_process",
          source: "agent",
          gender: "male",
          nationality: "BD",
          primary_agent_id: ID.agent1,
        },
        {
          id: ID.cand3,
          candidate_code: "CAND-DEMO-03",
          full_name: "Shahin Alam",
          email: "shahin@example.com",
          phone: "+8801712000003",
          status: "registered",
          source: "agent",
          gender: "male",
          nationality: "BD",
          primary_agent_id: ID.agent2,
        },
        {
          id: ID.cand4,
          candidate_code: "CAND-DEMO-04",
          full_name: "Mehedi Hasan",
          email: "mehedi@example.com",
          phone: "+8801712000004",
          status: "in_process",
          source: "walk_in",
          gender: "male",
          nationality: "BD",
        },
        {
          id: ID.cand5,
          candidate_code: "CAND-DEMO-05",
          full_name: "Jahidul Karim",
          email: "jahid@example.com",
          phone: "+8801712000005",
          status: "lead",
          source: "referral",
          gender: "male",
          nationality: "BD",
          primary_agent_id: ID.agent1,
        },
      ],
      { onConflict: "id" }
    );
    assertOk("candidates", error);
  }

  {
    const { error } = await db.from("passports").upsert(
      [
        {
          id: ID.passport1,
          candidate_id: cand1Id,
          passport_number: "A22619693",
          passport_type: "P",
          issuing_country: "BD",
          issue_date: "2026-06-17",
          expiry_date: "2036-06-16",
          is_current: true,
          place_of_issue: "Dhaka",
          issuing_authority: "DIP/DHAKA",
          surname: "KHAN",
          given_names: "BILAL",
          full_name_as_in_passport: "BILAL KHAN",
          nationality_label: "BANGLADESHI",
          sex: "M",
          date_of_birth: "1992-02-20",
          place_of_birth: "SUNAMGANJ",
          personal_no: "19929012311000023",
          previous_passport_no: "A02472386",
          father_name: "MOSODDAR KHAN",
          mother_name: "SOMLA BIBI",
          permanent_address:
            "CHATARPOI, CHHATAK, CHHATAK - 3080, SUNAMGANJ",
          emergency_contact_name: "MOSODDAR KHAN",
          emergency_contact_relationship: "FATHER",
          emergency_contact_address:
            "CHATARPOI, CHHATAK, CHHATAK - 3080, SUNAMGANJ",
          emergency_contact_phone: "+8801727119025",
          notes: "Demo BD passport biodata (Bilal Khan sample).",
        },
        {
          id: ID.passport2,
          candidate_id: ID.cand2,
          passport_number: "BX9988776",
          passport_type: "P",
          issuing_country: "BD",
          issue_date: "2021-06-15",
          expiry_date: "2031-06-15",
          is_current: true,
          place_of_issue: "Chattogram",
          issuing_authority: "DIP/CTG",
          surname: "HOSSAIN",
          given_names: "RAFID",
          full_name_as_in_passport: "RAFID HOSSAIN",
          nationality_label: "BANGLADESHI",
          sex: "M",
          date_of_birth: "1995-08-12",
          place_of_birth: "CHATTOGRAM",
          personal_no: "19950812123456789",
          previous_passport_no: "BQ7654321",
          father_name: "ABDUL HOSSAIN",
          mother_name: "NASIMA BEGUM",
          permanent_address: "Agrabad, Chattogram",
          emergency_contact_name: "ABDUL HOSSAIN",
          emergency_contact_relationship: "FATHER",
          emergency_contact_address: "Agrabad, Chattogram",
          emergency_contact_phone: "+8801711002299",
          notes: "Demo BD passport biodata (Rafid Hossain).",
        },
      ],
      { onConflict: "id" }
    );
    assertOk("passports", error);
  }

  // Cases — process steps auto-seed via trigger
  {
    const { error } = await db.from("candidate_cases").upsert(
      [
        {
          id: ID.case1,
          case_code: "CASE-2026-001",
          candidate_id: cand1Id,
          job_order_id: ID.order1,
          visa_batch_id: ID.batch1,
          agent_id: null,
          assigned_staff_id: users.staff.id,
          overall_status: "processing",
          mofa_number: "MOFA-DEMO-001",
          processing_office: "Dhaka",
          remarks: "DEMO case",
        },
        {
          id: ID.case2,
          case_code: "CASE-2026-002",
          candidate_id: ID.cand2,
          job_order_id: ID.order1,
          visa_batch_id: ID.batch1,
          agent_id: ID.agent1,
          assigned_staff_id: users.staff.id,
          overall_status: "processing",
          mofa_number: "MOFA-DEMO-002",
          processing_office: "Dhaka",
          remarks: "DEMO case",
        },
        {
          id: ID.case3,
          case_code: "CASE-2026-003",
          candidate_id: ID.cand3,
          job_order_id: ID.order2,
          visa_batch_id: ID.batch2,
          agent_id: ID.agent2,
          assigned_staff_id: users.staff.id,
          overall_status: "registered",
          processing_office: "Chattogram",
          remarks: "DEMO case",
        },
        {
          id: ID.case4,
          case_code: "CASE-2026-004",
          candidate_id: ID.cand4,
          job_order_id: ID.order2,
          visa_batch_id: ID.batch2,
          assigned_staff_id: users.staff.id,
          overall_status: "cleared",
          processing_office: "Dhaka",
          remarks: "DEMO case",
        },
      ],
      { onConflict: "id" }
    );
    assertOk("candidate_cases", error);
  }

  // Advance a few process steps on case1
  {
    const updates = [
      { step_code: "mofa", status: "done", reference_no: "MOFA-DEMO-001" },
      { step_code: "medical", status: "done" },
      { step_code: "fit_card", status: "in_progress" },
    ];
    for (const step of updates) {
      const { error } = await db
        .from("case_process_steps")
        .update({
          status: step.status,
          reference_no: step.reference_no ?? null,
          started_at: new Date().toISOString(),
          completed_at: step.status === "done" ? new Date().toISOString() : null,
          updated_by: users.staff.id,
        })
        .eq("candidate_case_id", ID.case1)
        .eq("step_code", step.step_code);
      assertOk(`case1 step ${step.step_code}`, error);
    }
  }

  const { data: gateways, error: gwErr } = await db
    .from("payment_gateways")
    .select("id, code");
  assertOk("load payment_gateways", gwErr);
  const gw = Object.fromEntries((gateways || []).map((g) => [g.code, g.id]));

  {
    const now = new Date();
    const thisMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 10)
    ).toISOString();
    const { error } = await db.from("payments").upsert(
      [
        {
          id: ID.pay1,
          candidate_id: cand1Id,
          candidate_case_id: ID.case1,
          fee_schedule_id: ID.fee1,
          amount_bdt: 40000,
          amount: 40000,
          currency: "BDT",
          currency_code: "BDT",
          direction: "in",
          method: "bkash",
          payment_gateway_id: gw.bkash,
          reference_no: "BKASH-DEMO-001",
          received_at: thisMonth,
          recorded_by: users.staff.id,
          notes: "DEMO partial payment",
        },
        {
          id: ID.pay2,
          candidate_id: ID.cand2,
          candidate_case_id: ID.case2,
          fee_schedule_id: ID.fee1,
          amount_bdt: 85000,
          amount: 85000,
          currency: "BDT",
          currency_code: "BDT",
          direction: "in",
          method: "bank",
          payment_gateway_id: gw.bank_transfer,
          reference_no: "BANK-DEMO-002",
          received_at: thisMonth,
          recorded_by: users.staff.id,
          notes: "DEMO full payment",
        },
        {
          id: ID.pay3,
          candidate_id: ID.cand4,
          candidate_case_id: ID.case4,
          fee_schedule_id: ID.fee2,
          amount_bdt: 30000,
          amount: 30000,
          currency: "BDT",
          currency_code: "BDT",
          direction: "in",
          method: "cash",
          payment_gateway_id: gw.cash,
          reference_no: "CASH-DEMO-003",
          received_at: thisMonth,
          recorded_by: users.office.id,
          notes: "DEMO cash payment",
        },
      ],
      { onConflict: "id" }
    );
    assertOk("payments", error);
  }

  {
    const { error } = await db.from("company_payments").upsert(
      {
        id: ID.cpay1,
        employer_company_id: ID.company1,
        job_order_id: ID.order1,
        kind: "investment_out",
        amount: 250000,
        amount_bdt: 250000,
        currency_code: "BDT",
        method: "bank",
        payment_gateway_id: gw.bank_transfer,
        paid_at: "2026-08-10",
        reference_no: "CPAY-DEMO-001",
        notes: "DEMO employer advance / investment",
        recorded_by: users.staff.id,
      },
      { onConflict: "id" }
    );
    assertOk("company_payments", error);
  }

  {
    const { error } = await db.from("expenses").upsert(
      [
        {
          id: ID.expense1,
          category: "medical",
          amount_bdt: 4500,
          currency: "BDT",
          expense_date: "2026-08-12",
          vendor_name: "Popular Diagnostic",
          candidate_case_id: ID.case1,
          recorded_by: users.staff.id,
          notes: "DEMO medical expense",
        },
        {
          id: ID.expense2,
          category: "office",
          amount_bdt: 2200,
          currency: "BDT",
          expense_date: "2026-09-01",
          vendor_name: "Stationery Mart",
          recorded_by: users.office.id,
          notes: "DEMO office expense",
        },
      ],
      { onConflict: "id" }
    );
    assertOk("expenses", error);
  }

  {
    const { error } = await db.from("agent_commissions").upsert(
      {
        id: ID.commission1,
        agent_id: ID.agent1,
        candidate_case_id: ID.case2,
        amount_bdt: 15000,
        currency: "BDT",
        status: "pending",
        milestone_step: "visa",
        notes: "DEMO commission",
      },
      { onConflict: "id" }
    );
    assertOk("agent_commissions", error);
  }

  {
    const { error } = await db.from("holidays").upsert(
      {
        id: ID.holiday1,
        holiday_date: "2026-12-16",
        name: "Victory Day",
        is_optional: false,
      },
      { onConflict: "id" }
    );
    assertOk("holidays", error);
  }

  const { data: leaveTypes, error: ltErr } = await db
    .from("leave_types")
    .select("id, code");
  assertOk("load leave_types", ltErr);
  const leaveByCode = Object.fromEntries(
    (leaveTypes || []).map((t) => [t.code, t.id])
  );

  {
    const { error } = await db.from("leave_requests").upsert(
      {
        id: ID.leave1,
        employee_id: users.staff.id,
        leave_type_id: leaveByCode.casual,
        start_date: "2026-09-20",
        end_date: "2026-09-21",
        days: 2,
        reason: "DEMO personal work",
        status: "pending",
      },
      { onConflict: "id" }
    );
    assertOk("leave_requests", error);
  }

  {
    const today = new Date();
    const yday = new Date(today);
    yday.setUTCDate(today.getUTCDate() - 1);
    const d0 = today.toISOString().slice(0, 10);
    const d1 = yday.toISOString().slice(0, 10);

    const { error } = await db.from("attendance_days").upsert(
      [
        {
          id: ID.attendance1,
          employee_id: users.staff.id,
          work_date: d1,
          status: "present",
          check_in_at: `${d1}T03:05:00Z`,
          check_out_at: `${d1}T12:02:00Z`,
          late_minutes: 5,
          overtime_minutes: 0,
          source: "manual",
          edited_by: users.hr.id,
        },
        {
          id: ID.attendance2,
          employee_id: users.office.id,
          work_date: d0,
          status: "present",
          check_in_at: `${d0}T03:00:00Z`,
          late_minutes: 0,
          overtime_minutes: 0,
          source: "app",
        },
      ],
      { onConflict: "id" }
    );
    assertOk("attendance_days", error);
  }

  {
    const now = new Date();
    const { error } = await db.from("salary_months").upsert(
      {
        id: ID.salary1,
        employee_id: users.staff.id,
        year: now.getUTCFullYear(),
        month: now.getUTCMonth() === 0 ? 12 : now.getUTCMonth(),
        basic_salary_bdt: 45000,
        allowances_bdt: 3000,
        deductions_bdt: 500,
        net_salary_bdt: 47500,
        present_days: 22,
        absent_days: 0,
        leave_days: 1,
        late_count: 2,
        overtime_minutes: 60,
        currency: "BDT",
        status: "draft",
        notes: "DEMO salary month",
      },
      { onConflict: "id" }
    );
    assertOk("salary_months", error);

    const { error: itemErr } = await db.from("salary_items").upsert(
      {
        id: ID.salaryItem1,
        salary_month_id: ID.salary1,
        label: "Transport allowance",
        amount_bdt: 3000,
        is_deduction: false,
      },
      { onConflict: "id" }
    );
    assertOk("salary_items", error);
  }

  console.log("\nDemo login accounts (same password):");
  for (const u of DEMO_USERS) {
    console.log(`  ${u.role.padEnd(18)} ${u.email}`);
  }
  console.log(`\nPassword: ${password}`);
  console.log("Open http://localhost:3000/login\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
