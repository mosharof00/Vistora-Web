import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { arrivalBento } from "@/content/editorial";

export function ArrivalBento() {
  return (
    <section
      id="services"
      className="px-4 pb-6 md:px-6 md:pb-8"
    >
      <div className="grid gap-3 md:grid-cols-2 md:grid-rows-2 md:gap-4">
        <article className="relative min-h-[280px] overflow-hidden rounded-[1.6rem] bg-[#0b1524] p-7 text-white md:row-span-2 md:min-h-[520px] md:p-10">
          <Image
            src="/hero/paris-dusk.jpg"
            alt=""
            fill
            className="object-cover opacity-55 brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
          <div className="relative flex h-full flex-col justify-end">
            <p className="text-[11px] tracking-[0.22em] text-white/70">
              {arrivalBento.night.kicker}
            </p>
            <h3 className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95] font-medium">
              {arrivalBento.night.title}
            </h3>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
              {arrivalBento.night.body}
            </p>
          </div>
        </article>

        <article className="rounded-[1.6rem] bg-[#ece6d9] p-7 md:p-10">
          <a
            href={arrivalBento.arrival.href}
            className="float-right grid h-10 w-10 place-items-center rounded-full border border-zinc-900/15 text-zinc-900"
            aria-label="Enquire"
          >
            <ArrowUpRight size={16} />
          </a>
          <p className="text-[11px] tracking-[0.22em] text-zinc-500">
            {arrivalBento.arrival.kicker}
          </p>
          <h3 className="mt-6 max-w-xs text-3xl leading-tight font-medium tracking-tight text-zinc-900 md:text-4xl">
            {arrivalBento.arrival.title}
          </h3>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-600">
            {arrivalBento.arrival.body}
          </p>
        </article>

        <article
          id="contact"
          className="rounded-[1.6rem] bg-[#e7e0d2] p-7 md:p-10"
        >
          <h3 className="max-w-md text-3xl leading-tight font-medium tracking-tight text-zinc-900 md:text-4xl">
            {arrivalBento.close.title}
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-600">
            {arrivalBento.close.body}
          </p>
          <a
            href={arrivalBento.close.href}
            className="mt-8 inline-flex rounded-full bg-zinc-900 px-5 py-2.5 text-sm text-white"
          >
            {arrivalBento.close.cta}
          </a>
        </article>
      </div>
    </section>
  );
}
