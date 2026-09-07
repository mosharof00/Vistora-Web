import { BrandLogo } from "@/components/layout/brand-logo";

/**
 * Auth pages layout. Middleware handles bouncing signed-in users from /login.
 * reset-password / set-password keep an active recovery/invite session.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <BrandLogo href="/" variant="full" className="mx-auto" />
        </div>
        {children}
      </div>
    </div>
  );
}
