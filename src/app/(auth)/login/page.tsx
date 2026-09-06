import { APP_NAME } from "@/config/site";
import { BrandLogo } from "@/components/layout/brand-logo";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <BrandLogo href="/" variant="full" showTagline={false} className="mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            {APP_NAME} auth (email OTP / invite) will follow the Import Mark
            flow next.
          </p>
        </div>
      </div>
    </main>
  );
}
