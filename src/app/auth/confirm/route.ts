import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { finalizeCandidateSignup } from "@/lib/auth/finalize-candidate";

function safeNextPath(next: string | null, fallback: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }
  return next;
}

/**
 * Handles Supabase auth email links (invite, confirm, recovery).
 * Must stay reachable without a session (middleware `/auth` allowlist).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const flow = searchParams.get("flow");

  const isCandidateSignup = type === "signup" || flow === "signup";

  const defaultNext = isCandidateSignup
    ? "/login?registered=1"
    : type === "invite"
      ? "/set-password"
      : "/";
  const next = safeNextPath(searchParams.get("next"), defaultNext);

  const supabase = await createClient();

  async function afterCandidateSignup() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await finalizeCandidateSignup(user);
      await supabase.auth.signOut();
    }
    return NextResponse.redirect(`${origin}/login?registered=1`);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (isCandidateSignup) return afterCandidateSignup();
      return NextResponse.redirect(`${origin}${next}`);
    }
  } else if (tokenHash && type) {
    let { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (error && type === "invite") {
      ({ error } = await supabase.auth.verifyOtp({
        type: "signup",
        token_hash: tokenHash,
      }));
    }

    if (!error) {
      if (isCandidateSignup) return afterCandidateSignup();
      return NextResponse.redirect(`${origin}${next}`);
    }

    if (type === "invite") {
      return NextResponse.redirect(`${origin}/login?error=invite_invalid`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
