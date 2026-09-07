"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { dashboardPathForRole, getUserRole } from "@/lib/auth/roles";
import {
  finalizeCandidateSignup,
  findAuthUserByEmail,
} from "@/lib/auth/finalize-candidate";
import {
  loginSchema,
  otpSchema,
  setPasswordSchema,
  forgotPasswordSchema,
  candidateSignupSchema,
  type LoginInput,
  type OtpInput,
  type SetPasswordInput,
  type ForgotPasswordInput,
  type CandidateSignupInput,
} from "@/lib/validations/auth";

type ActionResult = { error: string };
type ActionSuccess = { error?: undefined };
type LoginSuccess = { redirectTo: string };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function normalizeOtpToken(token: string) {
  return token.replace(/\s+/g, "").trim();
}

// ── LOGIN ────────────────────────────────────────────────────────────────
export async function login(
  values: LoginInput,
  nextPath?: string | null
): Promise<ActionResult | LoginSuccess> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message || "Invalid email or password." };
  }

  const role = getUserRole(data.user);
  if (!role) {
    await supabase.auth.signOut();
    return {
      error:
        "This account has no role assigned. Ask an admin to invite you with a role.",
    };
  }

  const safeNext =
    nextPath &&
    nextPath.startsWith("/") &&
    !nextPath.startsWith("//") &&
    !nextPath.startsWith("/login") &&
    !nextPath.startsWith("/signup")
      ? nextPath
      : null;

  return { redirectTo: safeNext ?? dashboardPathForRole(role) };
}

// ── INVITE: VERIFY OTP ───────────────────────────────────────────────────
export async function verifyInviteOtp(
  values: OtpInput
): Promise<ActionResult | void> {
  const parsed = otpSchema.safeParse({
    ...values,
    token: normalizeOtpToken(values.token),
  });
  if (!parsed.success) {
    return { error: "Enter the 6-digit code from your email." };
  }

  const supabase = await createClient();
  let verify = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: "invite",
  });

  if (verify.error) {
    verify = await supabase.auth.verifyOtp({
      email: parsed.data.email,
      token: parsed.data.token,
      type: "signup",
    });
  }

  if (verify.error || !verify.data.user) {
    return {
      error:
        verify.error?.message ??
        "Verification failed. Request a new invite and try again.",
    };
  }

  redirect("/set-password");
}

// ── INVITED USER: SET FIRST PASSWORD ─────────────────────────────────────
export async function setInvitedUserPassword(
  values: SetPasswordInput
): Promise<ActionResult | void> {
  const parsed = setPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Your session has expired. Please use the invite again." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return { error: error.message };
  }

  redirect(dashboardPathForRole(getUserRole(user)));
}

// ── PASSWORD RESET: REQUEST EMAIL OTP ────────────────────────────────────
export async function requestPasswordReset(
  values: ForgotPasswordInput
): Promise<ActionResult | void> {
  const parsed = forgotPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  const email = parsed.data.email;
  const result = await sendRecoveryOtp(email);
  if (result?.error) return result;

  redirect(`/verify-otp?email=${encodeURIComponent(email)}&flow=recovery`);
}

export async function resendRecoveryOtp(
  values: ForgotPasswordInput
): Promise<ActionResult | ActionSuccess> {
  const parsed = forgotPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }
  return sendRecoveryOtp(parsed.data.email);
}

async function sendRecoveryOtp(
  email: string
): Promise<ActionResult | ActionSuccess> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/confirm?next=/reset-password`,
  });
  if (error) return { error: error.message };
  return {};
}

export async function verifyRecoveryOtp(
  values: OtpInput
): Promise<ActionResult | void> {
  const parsed = otpSchema.safeParse({
    ...values,
    token: normalizeOtpToken(values.token),
  });
  if (!parsed.success) {
    return { error: "Enter the 6-digit code from your email." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: "recovery",
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Verification failed. Try again." };
  }

  redirect("/reset-password");
}

export async function updatePassword(
  values: SetPasswordInput
): Promise<ActionResult | void> {
  const parsed = setPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Your reset code has expired. Request a new one." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return { error: error.message };
  }

  redirect(dashboardPathForRole(getUserRole(user)));
}

// ── CANDIDATE PUBLIC SIGNUP ──────────────────────────────────────────────
export async function signUpCandidate(
  values: CandidateSignupInput
): Promise<ActionResult | void> {
  const parsed = candidateSignupSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const { fullName, phone, email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone ?? null,
      },
      emailRedirectTo: `${SITE_URL}/auth/confirm?flow=signup&next=/login`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(`/verify-otp?email=${encodeURIComponent(email)}&flow=signup`);
}

export async function verifyCandidateOtp(
  values: OtpInput
): Promise<ActionResult | void> {
  const parsed = otpSchema.safeParse({
    ...values,
    token: normalizeOtpToken(values.token),
  });
  if (!parsed.success) {
    return { error: "Enter the 6-digit code from your email." };
  }

  const email = parsed.data.email;
  const token = parsed.data.token;
  const supabase = await createClient();

  let verify = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });
  if (verify.error) {
    verify = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
  }

  const user = verify.data.user;

  if (verify.error || !user) {
    const existing = await findAuthUserByEmail(email);
    if (existing.user?.email_confirmed_at) {
      const finalized = await finalizeCandidateSignup(existing.user);
      if (finalized && "error" in finalized && finalized.error) {
        await supabase.auth.signOut();
        return { error: finalized.error };
      }
      await supabase.auth.signOut();
      redirect("/login?registered=1");
    }

    return {
      error:
        verify.error?.message ??
        "Verification failed. Request a new code and try again.",
    };
  }

  const finalized = await finalizeCandidateSignup(user);
  if (finalized && "error" in finalized && finalized.error) {
    await supabase.auth.signOut();
    return { error: finalized.error };
  }

  await supabase.auth.signOut();
  redirect("/login?registered=1");
}

export async function resendSignupOtp(
  values: ForgotPasswordInput
): Promise<ActionResult | ActionSuccess> {
  const parsed = forgotPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  const email = parsed.data.email;
  const existing = await findAuthUserByEmail(email);
  if (existing.user?.email_confirmed_at) {
    const finalized = await finalizeCandidateSignup(existing.user);
    if (finalized && "error" in finalized && finalized.error) {
      return { error: finalized.error };
    }
    return {
      error:
        "This email is already verified. Please sign in with your password.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${SITE_URL}/auth/confirm?flow=signup&next=/login`,
    },
  });

  if (error) return { error: error.message };
  return {};
}
