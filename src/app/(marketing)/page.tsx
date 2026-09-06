import { CinematicHero } from "@/components/marketing/hero/cinematic-hero";
import { ExperienceShell } from "@/components/marketing/experience-shell";
import { ArrivalBento } from "@/components/marketing/sections/arrival-bento";

export default function HomePage() {
  return (
    <ExperienceShell>
      <CinematicHero />
      <div className="relative z-10 mx-3 mt-3 overflow-hidden rounded-[1.75rem] bg-[#f3eee4]">
        <ArrivalBento />
      </div>
    </ExperienceShell>
  );
}
