"use client";

import {
  Briefcase,
  Car,
  FileCheck,
  Hotel,
  Landmark,
  Map,
  MessageCircle,
  Plane,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/motion";
import { aboutHome, servicesHome } from "@/content/home";

const ICONS: Record<string, LucideIcon> = {
  Plane,
  FileCheck,
  Map,
  Mosque: Landmark,
  Briefcase,
  Hotel,
  Shield,
  Car,
  MessageCircle,
};

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 px-5 py-14 md:px-10 md:py-20">
      <Reveal className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
        <div>
          <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
            {aboutHome.kicker}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.05] font-medium tracking-tight text-zinc-900 text-balance">
            {aboutHome.title}
          </h2>
        </div>
        <div>
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-600">
            {aboutHome.body}
          </p>
          <a
            href="#contact"
            className="mt-6 inline-flex text-sm font-medium text-[#03045e] underline-offset-4 hover:underline"
          >
            {aboutHome.cta}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-28 px-5 py-14 md:px-10 md:py-16">
      <Reveal className="mb-10 max-w-2xl">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
          {servicesHome.kicker}
        </p>
        <h2 className="mt-3 font-serif text-[clamp(1.85rem,4vw,3.2rem)] leading-[1.05] font-medium text-zinc-900">
          {servicesHome.title}
        </h2>
        <p className="mt-3 text-[15px] text-zinc-600">{servicesHome.body}</p>
      </Reveal>

      <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {servicesHome.items.map((item) => {
          const Icon = ICONS[item.icon] ?? Plane;
          return (
            <StaggerItem key={item.id}>
              <article className="group flex h-full flex-col rounded-2xl border border-zinc-900/8 bg-white/70 p-5 transition-transform duration-300 hover:-translate-y-0.5 md:p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#03045e]/8 text-[#03045e]">
                  <Icon size={18} strokeWidth={1.6} />
                </span>
                <h3 className="mt-4 text-lg font-medium tracking-tight text-zinc-900">
                  {item.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
                  {item.excerpt}
                </p>
                <a
                  href="#contact"
                  className="mt-5 inline-flex text-sm font-medium text-[#0077b6] underline-offset-4 group-hover:underline"
                >
                  Enquire Now
                </a>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
