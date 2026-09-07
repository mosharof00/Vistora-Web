import Link from "next/link";

import { APP_NAME } from "@/config/site";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Unauthorized</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Your account does not have access to this area of {APP_NAME}.
      </p>
      <Link
        href="/login"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Back to sign in
      </Link>
    </main>
  );
}
