"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/marketing/motion";
import { inquiryHome } from "@/content/home";
import { getWhatsAppHref } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function InquirySection() {
  const [done, setDone] = useState(false);
  const whatsapp = getWhatsAppHref();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Lead inbox / Supabase wiring comes later — capture UX first.
    setDone(true);
    form.reset();
  }

  return (
    <section id="contact" className="scroll-mt-28 px-5 py-14 md:px-10 md:py-20">
      <div className="overflow-hidden rounded-[1.6rem] border border-zinc-900/8 bg-white/80">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="bg-[#0b1524] p-7 text-white md:p-10">
            <p className="text-[11px] tracking-[0.28em] text-white/55 uppercase">
              {inquiryHome.kicker}
            </p>
            <h2 className="mt-4 font-serif text-[clamp(1.9rem,3.5vw,3rem)] leading-[1.05] font-medium">
              {inquiryHome.title}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              {inquiryHome.body}
            </p>
            <dl className="mt-10 space-y-4 text-sm text-white/75">
              {siteConfig.contact.phone ? (
                <div>
                  <dt className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
                    Phone
                  </dt>
                  <dd className="mt-1">{siteConfig.contact.phone}</dd>
                </div>
              ) : null}
              {siteConfig.contact.email ? (
                <div>
                  <dt className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
                    Email
                  </dt>
                  <dd className="mt-1">{siteConfig.contact.email}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
                  Office
                </dt>
                <dd className="mt-1">
                  {siteConfig.contact.address || "Dhaka, Bangladesh"}
                </dd>
              </div>
            </dl>
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-900"
              >
                WhatsApp Us
              </a>
            ) : null}
          </Reveal>

          <Reveal delay={0.08} className="p-7 md:p-10">
            {done ? (
              <div className="flex h-full min-h-[320px] flex-col justify-center">
                <h3 className="text-2xl font-medium tracking-tight text-zinc-900">
                  {inquiryHome.successTitle}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600">
                  {inquiryHome.successBody}
                </p>
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="mt-8 inline-flex self-start text-sm font-medium text-[#0077b6] underline-offset-4 hover:underline"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name *" name="name" required />
                <Field label="Mobile *" name="phone" type="tel" required />
                <Field label="Email" name="email" type="email" />
                <Field label="Destination *" name="destination" required />
                <Field label="Travel date" name="travelDate" type="date" />
                <Field
                  label="Travelers"
                  name="travelers"
                  type="number"
                  min={1}
                />
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-[12px] font-medium text-zinc-700">
                    Service type
                  </span>
                  <select
                    name="service"
                    className="h-10 rounded-xl border border-zinc-900/12 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-[#0077b6]"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {inquiryHome.serviceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-[12px] font-medium text-zinc-700">
                    Message
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    className="rounded-xl border border-zinc-900/12 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#0077b6]"
                    placeholder="Tell us dates, travelers, or visa type…"
                  />
                </label>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex rounded-full bg-[#03045e] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#02033f]"
                  >
                    Submit enquiry
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-zinc-700">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        className="h-10 rounded-xl border border-zinc-900/12 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-[#0077b6]"
      />
    </label>
  );
}
