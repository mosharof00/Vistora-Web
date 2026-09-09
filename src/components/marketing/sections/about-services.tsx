"use client";

import {
  ArrowRight,
  Briefcase,
  Car,
  FileCheck,
  Hotel,
  Landmark,
  Map,
  MessageCircle,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/motion";
import { getWhatsAppHref } from "@/config/navigation";
import { aboutHome, servicesHome } from "@/content/home";

const ICONS: Record<string, LucideIcon> = {
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
  const whatsapp = getWhatsAppHref();

  return (
    <section
      id="about"
      className="relative scroll-mt-28 overflow-hidden bg-[#e8e9f4] px-5 py-16 md:px-10 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-[#0077b6]/10 blur-3xl"
      />

      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="space-y-5 lg:col-span-7" direction="left">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#dce9ff] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[#006398] uppercase">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#0077b6]" />
              {aboutHome.kicker}
            </div>
            <h2 className="font-serif text-[clamp(1.85rem,4.2vw,2.75rem)] leading-[1.15] font-semibold tracking-tight text-[#0b1c30]">
              {aboutHome.titleLead}{" "}
              <span className="font-normal text-[#0077b6] italic">
                {aboutHome.titleAccent}
              </span>{" "}
              {aboutHome.titleTrail}
            </h2>
            <p className="max-w-2xl text-[17px] leading-relaxed text-[#45464d]">
              {aboutHome.body}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#03045e] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#0077b6]"
              >
                {aboutHome.primaryCta}
                <ArrowRight size={16} />
              </a>
              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0b1c30] shadow-sm transition hover:bg-[#eff4ff]"
                >
                  <MessageCircle size={18} className="text-[#0077b6]" />
                  {aboutHome.secondaryCta}
                </a>
              ) : null}
            </div>
          </Reveal>

          <Reveal
            className="relative rounded-2xl bg-white p-7 shadow-xl lg:col-span-5"
            direction="right"
            delay={0.12}
          >
            <div className="flex items-start justify-between gap-4 pb-4">
              <div>
                <p className="text-[11px] font-bold tracking-[0.14em] text-[#76777d] uppercase">
                  {aboutHome.hubLabel}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-[#0b1c30]">
                  {aboutHome.hubTitle}
                </h3>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#dce9ff] text-[#0077b6]">
                <Shield size={22} />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#45464d]">
              {aboutHome.hubBody}
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#eff4ff] p-3">
              <Map size={22} className="shrink-0 text-[#0077b6]" />
              <div className="text-sm text-[#0b1c30]">
                <span className="block font-semibold">
                  {aboutHome.hubAddressLabel}
                </span>
                <span className="text-[#45464d]">
                  {aboutHome.hubAddressDetail}
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-4 md:gap-6 md:p-8">
          {aboutHome.metrics.map((metric, index) => (
            <StaggerItem
              key={metric.label}
              direction={index % 2 === 0 ? "up" : "scale"}
            >
              <div className="space-y-1 text-center md:text-left">
                <div className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-[#0b1c30]">
                  {metric.value}
                  {metric.suffix ? (
                    <span className="text-[#0077b6]">{metric.suffix}</span>
                  ) : null}
                </div>
                <div className="text-[11px] font-bold tracking-[0.12em] text-[#76777d] uppercase">
                  {metric.label}
                </div>
                <p className="hidden text-sm text-[#45464d] md:block">
                  {metric.hint}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-3 text-center text-xs text-[#76777d] md:text-left">
          {aboutHome.metricsNote}
        </p>
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section
      id="services"
      className="scroll-mt-28 bg-[#eff4ff] px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <Reveal className="max-w-xl space-y-2" direction="up">
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#0077b6] uppercase">
              {servicesHome.kicker}
            </span>
            <h2 className="font-serif text-[clamp(1.85rem,4vw,2.6rem)] font-semibold tracking-tight text-[#0b1c30]">
              {servicesHome.title}
            </h2>
            <p className="text-[15px] text-[#45464d]">{servicesHome.body}</p>
          </Reveal>
          <Reveal delay={0.1} direction="right">
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0077b6] transition hover:text-[#0b1c30]"
            >
              {servicesHome.cta}
              <ArrowRight size={16} className="-rotate-45" />
            </a>
          </Reveal>
        </div>

        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4" stagger={0.14} delayChildren={0.12}>
          {servicesHome.items.map((item, index) => {
            const Icon = ICONS[item.icon] ?? FileCheck;
            const dir =
              index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right";
            return (
              <StaggerItem key={item.id} direction={dir} distance={32} duration={1.05}>
                <article className="group flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="space-y-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#dce9ff] text-[#0077b6] transition-colors group-hover:bg-[#03045e] group-hover:text-white">
                      <Icon size={22} strokeWidth={1.6} />
                    </div>
                    <span className="inline-block text-[11px] font-bold tracking-[0.12em] text-[#76777d] uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-semibold text-[#0b1c30]">
                      {item.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#45464d]">
                      {item.excerpt}
                    </p>
                  </div>
                  <a
                    href="#contact"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0077b6] transition-transform group-hover:translate-x-1"
                  >
                    Enquire Now
                    <ArrowRight size={14} />
                  </a>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
