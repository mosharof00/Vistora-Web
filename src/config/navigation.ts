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

export const experienceNav: NavItem[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "journey", label: "Journey", href: "#journey" },
  { id: "arrival", label: "Arrival", href: "#arrival" },
  { id: "services", label: "Services", href: "#services" },
];

export const footerNav: NavItem[] = marketingNav;

export function getWhatsAppHref(): string | null {
  const number = siteConfig.contact.whatsapp;
  if (!number) return null;
  const text = encodeURIComponent(siteConfig.whatsappPrefill);
  const digits = number.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${text}`;
}
