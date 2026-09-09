import { CinematicHero } from "@/components/marketing/hero/cinematic-hero";
import { ExperienceShell } from "@/components/marketing/experience-shell";
import { FloatingContact } from "@/components/marketing/floating-contact";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import type { MarketingAccount } from "@/components/marketing/account-menu";
import {
  AboutSection,
  ServicesSection,
} from "@/components/marketing/sections/about-services";
import {
  DestinationsSection,
  ToursSection,
  VisaSection,
} from "@/components/marketing/sections/destinations-tours-visa";
import { InquirySection } from "@/components/marketing/sections/inquiry-section";
import {
  HowSection,
  ReviewsSection,
  WhySection,
} from "@/components/marketing/sections/why-how-reviews-gallery";
import { getAuthedUser } from "@/lib/auth/get-user";
import { getCurrentProfile } from "@/lib/auth/get-profile";

async function resolveMarketingAccount(): Promise<MarketingAccount | null> {
  const { user, role } = await getAuthedUser();
  if (!user || !role) return null;

  const profile = await getCurrentProfile(user.id, role);
  return {
    role,
    displayName:
      profile?.fullName ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Account",
    email: profile?.email ?? user.email ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
  };
}

export default async function HomePage() {
  const account = await resolveMarketingAccount();

  return (
    <ExperienceShell>
      <SiteHeader account={account} />
      <CinematicHero />

      <div className="relative z-10 mx-2 mt-3 overflow-hidden rounded-[1.5rem] bg-[#f8f9ff] text-[#0b1c30] sm:mx-3 md:rounded-[1.75rem]">
        <AboutSection />
        <ServicesSection />
        <DestinationsSection />
        <ToursSection />
        <VisaSection />
        <WhySection />
        <HowSection />
        <ReviewsSection />
        <InquirySection />
        <MarketingFooter />
      </div>

      <FloatingContact />
    </ExperienceShell>
  );
}
