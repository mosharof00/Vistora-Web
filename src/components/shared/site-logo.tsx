import Image from "next/image";
import { brand } from "@/config/brand";
import { APP_NAME, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  showWordmark?: boolean;
  invert?: boolean;
};

export function SiteLogo({
  className,
  showWordmark = true,
  invert = false,
}: SiteLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={brand.assets.logo}
        alt=""
        width={36}
        height={36}
        className={cn(
          "h-8 w-8 object-contain",
          invert && "mix-blend-screen",
        )}
        priority
      />
      {showWordmark ? (
        <span
          className={cn(
            "text-[13px] font-medium tracking-[0.22em] uppercase",
            invert ? "text-white" : "text-zinc-900",
          )}
        >
          {APP_NAME}
        </span>
      ) : (
        <span className="sr-only">{siteConfig.legalName}</span>
      )}
    </span>
  );
}
