import { LoginForm } from "@/app/(auth)/login/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <LoginForm
      justRegistered={params.registered === "1"}
      errorCode={params.error ?? null}
      nextPath={params.next ?? null}
    />
  );
}
