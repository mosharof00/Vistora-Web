"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/motion";
import { destinationsHome, toursHome, visaHome } from "@/content/home";

function formatPrice(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-BD")}`;
}

export function DestinationsSection() {
  return (
    <section
      id="destinations"
      className="scroll-mt-28 px-5 py-14 md:px-10 md:py-16"
    >
      <Reveal className="mb-10 max-w-2xl">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
          {destinationsHome.kicker}
        </p>
        <h2 className="mt-3 font-serif text-[clamp(1.85rem,4vw,3.2rem)] leading-[1.05] font-medium text-zinc-900">
          {destinationsHome.title}
        </h2>
        <p className="mt-3 text-[15px] text-zinc-600">{destinationsHome.body}</p>
      </Reveal>

      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {destinationsHome.items.map((item) => (
          <StaggerItem key={item.name}>
            <a
              href="#contact"
              className="group relative flex aspect-[4/5] overflow-hidden rounded-2xl"
              style={{ background: item.tone }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="relative mt-auto p-4">
                <p className="text-lg font-medium text-white">{item.name}</p>
                <p className="mt-1 text-[11px] tracking-[0.16em] text-white/60 uppercase">
                  Enquire
                </p>
              </div>
              <ArrowUpRight
                size={16}
                className="absolute top-4 right-4 text-white/70 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function ToursSection() {
  return (
    <section id="tours" className="scroll-mt-28 px-5 py-14 md:px-10 md:py-16">
      <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
            {toursHome.kicker}
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.85rem,4vw,3.2rem)] leading-[1.05] font-medium text-zinc-900">
            {toursHome.title}
          </h2>
          <p className="mt-3 text-[15px] text-zinc-600">{toursHome.body}</p>
        </div>
        <a
          href="#contact"
          className="text-sm font-medium text-[#03045e] underline-offset-4 hover:underline"
        >
          View all / Enquire
        </a>
      </Reveal>

      <Stagger className="grid gap-4 md:grid-cols-3">
        {toursHome.items.map((tour) => (
          <StaggerItem key={tour.id}>
            <article className="group overflow-hidden rounded-2xl border border-zinc-900/8 bg-white/70">
              <div className="relative aspect-[16/11] overflow-hidden bg-zinc-200">
                <Image
                  src={tour.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5 md:p-6">
                <p className="text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
                  {tour.destination} · {tour.duration}
                </p>
                <h3 className="mt-2 text-xl font-medium tracking-tight text-zinc-900">
                  {tour.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {tour.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-zinc-900">
                    From {formatPrice(tour.startingPrice, tour.currency)}
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#0077b6]"
                  >
                    Enquire
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function VisaSection() {
  return (
    <section id="visa" className="scroll-mt-28 px-5 py-14 md:px-10 md:py-16">
      <Reveal className="mb-10 max-w-2xl">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
          {visaHome.kicker}
        </p>
        <h2 className="mt-3 font-serif text-[clamp(1.85rem,4vw,3.2rem)] leading-[1.05] font-medium text-zinc-900">
          {visaHome.title}
        </h2>
        <p className="mt-3 text-[15px] text-zinc-600">{visaHome.body}</p>
        <p className="mt-3 text-sm text-zinc-500">{visaHome.disclaimer}</p>
      </Reveal>

      <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visaHome.items.map((item) => (
          <StaggerItem key={item.country}>
            <article className="rounded-2xl border border-zinc-900/8 bg-[#ece6d9]/80 p-5 md:p-6">
              <p className="text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
                {item.country}
              </p>
              <h3 className="mt-3 text-lg font-medium text-zinc-900">
                {item.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {item.excerpt}
              </p>
              <a
                href="#contact"
                className="mt-5 inline-flex text-sm font-medium text-[#03045e] underline-offset-4 hover:underline"
              >
                Get visa help
              </a>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
