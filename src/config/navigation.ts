import { siteConfig } from "@/config/site";

export type NavItem = {
  id: string;
  label: string;
  href: string;
};

export const marketingNav: NavItem[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "about", label: "About Us", href: "#about" },
  { id: "services", label: "Services", href: "#services" },
  { id: "tours", label: "Tours", href: "#tours" },
  { id: "visa", label: "Visa", href: "#visa" },
  { id: "contact", label: "Contact", href: "#contact" },
];

/** Compact pill links inside the cinematic hero. */
export const heroNav: NavItem[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "about", label: "About", href: "#about" },
  { id: "services", label: "Services", href: "#services" },
  { id: "tours", label: "Tours", href: "#tours" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export const footerNav: NavItem[] = marketingNav;

export function getWhatsAppHref(): string | null {
  const number = siteConfig.contact.whatsapp;
  if (!number) return null;
  const text = encodeURIComponent(siteConfig.whatsappPrefill);
  const digits = number.replace(/[^\d]/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${text}`;
}

export function getCallHref(): string | null {
  const phone = siteConfig.contact.phone;
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (!cleaned) return null;
  return `tel:${cleaned}`;
}
