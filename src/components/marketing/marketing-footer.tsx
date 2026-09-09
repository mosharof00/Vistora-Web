import Link from "next/link";
import { footerNav, getWhatsAppHref } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { footerHome } from "@/content/home";
import { SiteLogo } from "@/components/shared/site-logo";

export function MarketingFooter() {
  const whatsapp = getWhatsAppHref();
  const facebook = siteConfig.contact.facebook;

  return (
    <footer className="border-t border-[#c6c6cd]/40 bg-white px-5 pt-14 pb-10 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <SiteLogo />
          <p className="max-w-sm text-sm leading-relaxed text-[#45464d]">
            {footerHome.blurb}
          </p>
          <p className="text-sm font-medium text-[#0077b6]">
            {siteConfig.tagline}
          </p>
        </div>

        <div className="space-y-3 lg:col-span-3">
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#0b1c30]/70 uppercase">
            Quick links
          </p>
          <ul className="space-y-2">
            {footerNav.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="text-sm text-[#45464d] transition hover:text-[#0b1c30]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 lg:col-span-5">
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#0b1c30]/70 uppercase">
            Contact
          </p>
          <ul className="space-y-2 text-sm text-[#45464d]">
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
          <p className="pt-2 text-xs text-[#76777d]">{footerHome.licenses}</p>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl border-t border-[#c6c6cd]/40 pt-6 text-xs text-[#76777d]">
        {footerHome.copyright}
      </p>
    </footer>
  );
}
