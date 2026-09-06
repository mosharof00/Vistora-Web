import Link from "next/link";

import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

function brandSrc(path: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${brand.assetVersion}`;
}

/**
 * Brand lockup from `src/config/brand.ts` + files under `public/brand/`.
 */
export function BrandLogo({
  href,
  className,
  showTagline = true,
  variant = "mark",
}: {
  href: string;
  className?: string;
  showTagline?: boolean;
  variant?: "mark" | "full";
}) {
  if (variant === "full") {
    return (
      <Link
        href={href}
        className={cn("inline-flex items-center justify-center", className)}
        aria-label={`${brand.name} — home`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brandSrc(brand.logoFull)}
          alt={brand.name}
          width={200}
          height={200}
          className="h-14 w-auto object-contain sm:h-16"
        />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn("flex min-w-0 items-center gap-3", className)}
      aria-label={`${brand.name} — home`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brandSrc(brand.logoIcon)}
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-md bg-[#0a0a0a] object-contain p-0.5"
      />

      <div className="min-w-0 leading-none">
        <p className="truncate text-[13px] font-bold tracking-[0.16em] text-foreground">
          {brand.shortName}
        </p>
        {showTagline ? (
          <p className="mt-1 truncate text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
            {brand.tagline}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
