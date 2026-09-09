"use client";

import {
  FileStack,
  Hourglass,
  Lock,
  Map,
  MessageCircle,
  Plane,
  Send,
  Star,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/motion";
import { howHome, reviewsHome, whyHome } from "@/content/home";

const WHY_ICONS: Record<string, LucideIcon> = {
  UserCheck,
  FileStack,
  Hourglass,
  MessageCircle,
};

const HOW_ICONS: Record<string, LucideIcon> = {
  Send,
  Map,
  Lock,
  Plane,
};

export function WhySection() {
  return (
    <section
      id="why"
      className="scroll-mt-28 bg-[#dce9ff] px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 max-w-xl space-y-2" direction="left">
          <span className="text-[11px] font-bold tracking-[0.14em] text-[#0077b6] uppercase">
            {whyHome.kicker}
          </span>
          <h2 className="font-serif text-[clamp(1.85rem,4vw,2.6rem)] font-semibold tracking-tight text-[#0b1c30]">
            {whyHome.title}
          </h2>
          <p className="text-[15px] text-[#45464d]">{whyHome.body}</p>
        </Reveal>

        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyHome.items.map((item, index) => {
            const Icon = WHY_ICONS[item.icon] ?? UserCheck;
            return (
              <StaggerItem
                key={item.title}
                direction={index % 2 === 0 ? "up" : "scale"}
              >
                <article className="space-y-3 rounded-2xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#eff4ff] text-[#0077b6]">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0b1c30]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#45464d]">
                    {item.body}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

export function HowSection() {
  return (
    <section id="how" className="scroll-mt-28 px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal
          className="mx-auto mb-14 max-w-xl space-y-2 text-center"
          direction="up"
        >
          <span className="text-[11px] font-bold tracking-[0.14em] text-[#0077b6] uppercase">
            {howHome.kicker}
          </span>
          <h2 className="font-serif text-[clamp(1.85rem,4vw,2.6rem)] font-semibold tracking-tight text-[#0b1c30]">
            {howHome.title}
          </h2>
          <p className="text-[15px] text-[#45464d]">{howHome.body}</p>
        </Reveal>

        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {howHome.steps.map((step, index) => {
            const Icon = HOW_ICONS[step.icon] ?? Send;
            return (
              <StaggerItem
                key={step.index}
                direction={
                  index === 0
                    ? "left"
                    : index === 3
                      ? "right"
                      : "up"
                }
                distance={40}
              >
                <article className="relative space-y-3 rounded-2xl bg-[#eff4ff] p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl font-bold text-[#0077b6]">
                      {step.index}
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#dce9ff] text-[#0b1c30]">
                      <Icon size={16} />
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#0b1c30]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#45464d]">
                    {step.body}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section
      id="reviews"
      className="scroll-mt-28 bg-white px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <Reveal className="space-y-2" direction="left">
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#0077b6] uppercase">
              {reviewsHome.kicker}
            </span>
            <h2 className="font-serif text-[clamp(1.85rem,4vw,2.6rem)] font-semibold tracking-tight text-[#0b1c30]">
              {reviewsHome.title}
            </h2>
            <p className="text-[15px] text-[#45464d]">{reviewsHome.body}</p>
          </Reveal>
          <Reveal delay={0.1} direction="right">
            <div className="flex items-center gap-1 text-[#0077b6]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
              <span className="ml-2 text-sm font-bold text-[#0b1c30]">
                {reviewsHome.ratingLabel}
              </span>
            </div>
          </Reveal>
        </div>

        <Stagger className="grid gap-5 md:grid-cols-3">
          {reviewsHome.items.map((item, index) => (
            <StaggerItem
              key={item.author}
              direction={index === 0 ? "left" : index === 2 ? "right" : "up"}
            >
              <blockquote className="flex h-full flex-col justify-between space-y-5 rounded-2xl bg-[#f8f9ff] p-7 shadow-sm">
                <div className="space-y-3">
                  <div className="flex gap-0.5 text-[#0077b6]">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="font-serif text-lg leading-snug text-[#0b1c30] italic">
                    “{item.quote}”
                  </p>
                </div>
                <footer className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#dce9ff] text-sm font-bold text-[#0077b6]">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0b1c30]">
                      {item.author}
                    </p>
                    <p className="text-xs text-[#76777d]">{item.meta}</p>
                  </div>
                </footer>
              </blockquote>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
