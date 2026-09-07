"use client";

import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/marketing/motion";
import {
  galleryHome,
  howHome,
  reviewsHome,
  whyHome,
} from "@/content/home";

export function WhySection() {
  return (
    <section id="why" className="scroll-mt-28 px-5 py-14 md:px-10 md:py-16">
      <Reveal className="mb-10 max-w-2xl">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
          {whyHome.kicker}
        </p>
        <h2 className="mt-3 font-serif text-[clamp(1.85rem,4vw,3.2rem)] leading-[1.05] font-medium text-zinc-900">
          {whyHome.title}
        </h2>
      </Reveal>
      <Stagger className="grid gap-3 md:grid-cols-2">
        {whyHome.items.map((item) => (
          <StaggerItem key={item.title}>
            <article className="rounded-2xl bg-[#0b1524] p-6 text-white md:p-8">
              <h3 className="text-xl font-medium tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {item.body}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function HowSection() {
  return (
    <section id="how" className="scroll-mt-28 px-5 py-14 md:px-10 md:py-16">
      <Reveal className="mb-10 max-w-2xl">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
          {howHome.kicker}
        </p>
        <h2 className="mt-3 font-serif text-[clamp(1.85rem,4vw,3.2rem)] leading-[1.05] font-medium text-zinc-900">
          {howHome.title}
        </h2>
      </Reveal>
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {howHome.steps.map((step) => (
          <StaggerItem key={step.index}>
            <article className="border-t border-zinc-900/15 pt-5">
              <p className="text-[12px] tracking-[0.22em] text-[#0077b6]">
                {step.index}
              </p>
              <h3 className="mt-3 text-lg font-medium text-zinc-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {step.body}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="scroll-mt-28 px-5 py-14 md:px-10 md:py-16">
      <Reveal className="mb-10 max-w-2xl">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
          {reviewsHome.kicker}
        </p>
        <h2 className="mt-3 font-serif text-[clamp(1.85rem,4vw,3.2rem)] leading-[1.05] font-medium text-zinc-900">
          {reviewsHome.title}
        </h2>
      </Reveal>
      <Stagger className="grid gap-3 md:grid-cols-3">
        {reviewsHome.items.map((item) => (
          <StaggerItem key={item.author}>
            <blockquote className="flex h-full flex-col rounded-2xl border border-zinc-900/8 bg-white/70 p-6">
              <p className="text-sm leading-relaxed text-zinc-700">
                “{item.quote}”
              </p>
              <footer className="mt-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {item.author}
                  </p>
                  <p className="text-xs text-zinc-500">{item.country}</p>
                </div>
                <p className="text-xs tracking-[0.16em] text-[#0077b6]">
                  {"★".repeat(item.rating)}
                </p>
              </footer>
            </blockquote>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function GallerySection() {
  return (
    <section id="gallery" className="scroll-mt-28 px-5 py-14 md:px-10 md:py-16">
      <Reveal className="mb-8 max-w-2xl">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
          {galleryHome.kicker}
        </p>
        <h2 className="mt-3 font-serif text-[clamp(1.85rem,4vw,3.2rem)] leading-[1.05] font-medium text-zinc-900">
          {galleryHome.title}
        </h2>
      </Reveal>
      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {galleryHome.images.map((image) => (
          <StaggerItem key={image.src}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-200">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width:768px) 50vw, 33vw"
              />
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
