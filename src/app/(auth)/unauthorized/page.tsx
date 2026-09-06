import Link from "next/link";

import { APP_NAME } from "@/config/site";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--navy,#070b14)] px-6 text-center text-[var(--cream,#f3eee4)]">
      <h1 className="font-serif text-3xl">Unauthorized</h1>
      <p className="max-w-md text-sm text-white/70">
        Your account does not have access to this area of {APP_NAME}.
      </p>
      <Link href="/" className="text-sm underline underline-offset-4">
        Back to home
      </Link>
    </main>
  );
}
