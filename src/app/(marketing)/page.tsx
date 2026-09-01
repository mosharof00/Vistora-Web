import { CinematicHero } from "@/components/marketing/hero/cinematic-hero";
import { ExperienceShell } from "@/components/marketing/experience-shell";
import { ArrivalBento } from "@/components/marketing/sections/arrival-bento";
import { EditorialBand } from "@/components/marketing/sections/editorial-band";

export default function HomePage() {
  return (
    <ExperienceShell>
      <CinematicHero />
      <div className="relative z-10 mx-3 -mt-6 overflow-hidden rounded-[1.75rem] bg-[#f3eee4]">
        <EditorialBand />
        <ArrivalBento />
      </div>
    </ExperienceShell>
  );
}
