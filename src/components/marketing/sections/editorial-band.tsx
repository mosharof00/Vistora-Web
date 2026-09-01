import { editorial } from "@/content/editorial";

export function EditorialBand() {
  return (
    <section
      id="about"
      className="px-6 py-16 text-zinc-900 md:px-12 md:py-24"
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500 uppercase">
          {editorial.kicker}
        </p>
        <h2 className="max-w-3xl text-[clamp(2rem,5vw,4.5rem)] leading-[0.98] font-medium tracking-tight text-balance">
          {editorial.title}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-zinc-600 md:text-[15px]">
          {editorial.body}
        </p>
      </div>
    </section>
  );
}
