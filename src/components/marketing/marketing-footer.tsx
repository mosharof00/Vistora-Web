import Link from "next/link";
import { footerNav, getWhatsAppHref } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { footerHome } from "@/content/home";
import { SiteLogo } from "@/components/shared/site-logo";

export function MarketingFooter() {
  const whatsapp = getWhatsAppHref();
  const facebook = siteConfig.contact.facebook;

  return (
    <footer className="mt-4 border-t border-zinc-900/8 px-5 py-12 md:px-10 md:py-16">
      <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <SiteLogo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-600">
            {footerHome.blurb}
          </p>
          <p className="mt-3 text-sm text-zinc-500">{siteConfig.tagline}</p>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">
            Quick links
          </p>
          <ul className="mt-4 space-y-2">
            {footerNav.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="text-sm text-zinc-700 transition-colors hover:text-zinc-900"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.22em] text-zinc-500 uppercase">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-700">
            <li>{siteConfig.contact.address || "Dhaka, Bangladesh"}</li>
            {siteConfig.contact.phone ? (
              <li>
                <a href={`tel:${siteConfig.contact.phone}`}>
                  {siteConfig.contact.phone}
                </a>
              </li>
            ) : null}
            {siteConfig.contact.email ? (
              <li>
                <a href={`mailto:${siteConfig.contact.email}`}>
                  {siteConfig.contact.email}
                </a>
              </li>
            ) : null}
            {whatsapp ? (
              <li>
                <a href={whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
            ) : null}
            {facebook ? (
              <li>
                <Link href={facebook} target="_blank" rel="noreferrer">
                  Facebook
                </Link>
              </li>
            ) : null}
          </ul>
          <p className="mt-6 text-xs text-zinc-500">{footerHome.licenses}</p>
        </div>
      </div>

      <p className="mt-10 border-t border-zinc-900/8 pt-6 text-xs text-zinc-500">
        {footerHome.copyright}
      </p>
    </footer>
  );
}
