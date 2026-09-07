"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import { agentSchema, type AgentInput } from "@/lib/validations/agent";

type ActionResult = { error: string };

function emptyToNull(value?: string) {
  const v = value?.trim();
  return v ? v : null;
}

function toRow(values: AgentInput) {
  return {
    agent_code: values.agentCode.trim().toUpperCase(),
    full_name: values.fullName.trim(),
    agency_name: emptyToNull(values.agencyName),
    phone: emptyToNull(values.phone),
    email: emptyToNull(values.email),
    district: emptyToNull(values.district),
    address: emptyToNull(values.address),
    nid_or_trade_license: emptyToNull(values.nidOrTradeLicense),
    bank_name: emptyToNull(values.bankName),
    bank_account: emptyToNull(values.bankAccount),
    commission_type: values.commissionType,
    commission_value: values.commissionValue,
    status: values.status,
    notes: emptyToNull(values.notes),
  };
}

export async function createAgent(
  values: AgentInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = agentSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("agents").insert(toRow(parsed.data));

  if (error) {
    if (error.code === "23505") {
      return { error: "That agent code is already in use." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/agents");
  revalidatePath("/admin");
  redirect("/admin/agents?created=1");
}

export async function updateAgent(
  id: string,
  values: AgentInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = agentSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("agents")
    .update(toRow(parsed.data))
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That agent code is already in use." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/agents");
  revalidatePath(`/admin/agents/${id}`);
  revalidatePath("/admin");
  redirect("/admin/agents?updated=1");
}

export async function setAgentStatus(
  id: string,
  status: "active" | "inactive"
): Promise<ActionResult | void> {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase
    .from("agents")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/agents");
  revalidatePath(`/admin/agents/${id}`);
  revalidatePath("/admin");
}
