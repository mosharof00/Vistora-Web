"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/motion";
import { destinationsHome, toursHome, visaHome } from "@/content/home";
import { cn } from "@/lib/utils";

function formatPrice(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-BD")}`;
}

export function DestinationsSection() {
  const [filter, setFilter] = useState("all");
  const items = useMemo(
    () =>
      filter === "all"
        ? destinationsHome.items
        : destinationsHome.items.filter((item) => item.region === filter),
    [filter],
  );

  return (
    <section
      id="destinations"
      className="scroll-mt-28 px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <Reveal className="space-y-2" direction="left">
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#0077b6] uppercase">
              {destinationsHome.kicker}
            </span>
            <h2 className="font-serif text-[clamp(1.85rem,4vw,2.6rem)] font-semibold tracking-tight text-[#0b1c30]">
              {destinationsHome.title}
            </h2>
            <p className="text-[15px] text-[#45464d]">{destinationsHome.body}</p>
          </Reveal>

          <Reveal direction="right" delay={0.08}>
            <div className="flex flex-wrap gap-1 rounded-xl bg-[#dce9ff]/80 p-1">
              {destinationsHome.filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                    filter === item.id
                      ? "bg-white text-[#0b1c30] shadow-sm"
                      : "text-[#45464d] hover:text-[#0b1c30]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <Stagger
          key={filter}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
          stagger={0.1}
          delayChildren={0.1}
        >
          {items.map((item, index) => (
            <StaggerItem
              key={item.name}
              direction={index % 2 === 0 ? "up" : "scale"}
              distance={24}
            >
              <a
                href="#contact"
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden" style={{ background: item.tone }}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 20vw"
                  />
                  <div className="absolute top-2 left-2 rounded bg-[#03045e]/70 px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] text-white uppercase backdrop-blur-md">
                    {item.badge}
                  </div>
                </div>
                <div className="space-y-1 p-4">
                  <h3 className="text-lg font-semibold text-[#0b1c30]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[#45464d]">{item.places}</p>
                  <div className="flex items-center justify-between pt-2 text-sm font-semibold text-[#0077b6]">
                    <span>{item.fromPrice}</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function ToursSection() {
  return (
    <section
      id="tours"
      className="scroll-mt-28 bg-[#e5eeff] px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <Reveal className="max-w-2xl space-y-2" direction="up">
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#0077b6] uppercase">
              {toursHome.kicker}
            </span>
            <h2 className="font-serif text-[clamp(1.85rem,4vw,2.6rem)] font-semibold tracking-tight text-[#0b1c30]">
              {toursHome.title}
            </h2>
            <p className="text-[15px] text-[#45464d]">{toursHome.body}</p>
          </Reveal>
          <Reveal delay={0.1} direction="right">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0b1c30] shadow-sm transition hover:bg-[#f8f9ff]"
            >
              {toursHome.cta}
              <ArrowRight size={16} />
            </a>
          </Reveal>
        </div>

        <Stagger className="grid gap-6 lg:grid-cols-3" stagger={0.18} delayChildren={0.15}>
          {toursHome.items.map((tour, index) => (
            <StaggerItem
              key={tour.id}
              direction={index === 1 ? "up" : index === 0 ? "left" : "right"}
              distance={40}
              duration={1.1}
            >
              <article className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-md">
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={tour.image}
                      alt={tour.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:1024px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 rounded-lg bg-white/90 px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-[#0b1c30] uppercase backdrop-blur-md">
                      {tour.duration}
                    </div>
                    <div
                      className={cn(
                        "absolute right-3 bottom-3 rounded-lg px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-white uppercase",
                        tour.badge === "Bestseller"
                          ? "bg-[#0077b6]"
                          : "bg-[#03045e]",
                      )}
                    >
                      {tour.badge}
                    </div>
                  </div>
                  <div className="space-y-3 p-6">
                    <h3 className="text-xl font-semibold text-[#0b1c30]">
                      {tour.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#45464d]">
                      {tour.excerpt}
                    </p>
                    <ul className="space-y-1.5 pt-1 text-sm text-[#45464d]">
                      {tour.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="mt-0.5 shrink-0 text-[#0077b6]"
                          />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 px-6 pb-6">
                  <div>
                    <span className="block text-[11px] font-bold tracking-[0.12em] text-[#76777d] uppercase">
                      Pricing from
                    </span>
                    <span className="text-lg font-bold text-[#0b1c30]">
                      {formatPrice(tour.startingPrice, tour.currency)}
                      <span className="text-sm font-normal text-[#45464d]">
                        {" "}
                        / person
                      </span>
                    </span>
                  </div>
                  <a
                    href="#contact"
                    className="rounded-xl bg-[#03045e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0077b6]"
                  >
                    Enquire
                  </a>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function VisaSection() {
  return (
    <section id="visa" className="scroll-mt-28 px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-12 max-w-2xl space-y-2 text-center" direction="up">
          <span className="text-[11px] font-bold tracking-[0.14em] text-[#0077b6] uppercase">
            {visaHome.kicker}
          </span>
          <h2 className="font-serif text-[clamp(1.85rem,4vw,2.6rem)] font-semibold tracking-tight text-[#0b1c30]">
            {visaHome.title}
          </h2>
          <p className="text-[15px] text-[#45464d]">{visaHome.body}</p>
          <p className="text-sm text-[#76777d]">{visaHome.disclaimer}</p>
        </Reveal>

        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visaHome.items.map((item, index) => (
            <StaggerItem
              key={item.country}
              direction={index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right"}
            >
              <article className="space-y-3 rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.flag}</span>
                    <h3 className="text-lg font-semibold text-[#0b1c30]">
                      {item.country}
                    </h3>
                  </div>
                  <span className="rounded-lg bg-[#dce9ff] px-2 py-1 text-[10px] font-bold tracking-[0.1em] text-[#0077b6] uppercase">
                    {item.turnaround}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[#45464d]">
                  {item.excerpt}
                </p>
                <ul className="space-y-1.5 pt-1 text-sm text-[#0b1c30]">
                  {item.checks.map((check) => (
                    <li key={check} className="flex items-start gap-2">
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-[#0077b6]"
                      />
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
