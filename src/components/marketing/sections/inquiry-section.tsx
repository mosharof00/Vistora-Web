"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { Reveal } from "@/components/marketing/motion";
import { getWhatsAppHref } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { inquiryHome } from "@/content/home";

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
    setDone(true);
    form.reset();
  }

  return (
    <section
      id="contact"
      className="scroll-mt-28 bg-[#eff4ff] px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="grid lg:grid-cols-12">
            <Reveal
              className="flex flex-col justify-between space-y-8 bg-[#e5eeff] p-7 md:p-10 lg:col-span-5"
              direction="left"
            >
              <div className="space-y-4">
                <span className="text-[11px] font-bold tracking-[0.14em] text-[#0077b6] uppercase">
                  {inquiryHome.kicker}
                </span>
                <h2 className="font-serif text-[clamp(1.75rem,3.2vw,2.4rem)] font-semibold tracking-tight text-[#0b1c30]">
                  {inquiryHome.title}
                </h2>
                <p className="text-[15px] leading-relaxed text-[#45464d]">
                  {inquiryHome.body}
                </p>
                <div className="space-y-3 pt-2 text-sm text-[#0b1c30]">
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-[#0077b6]"
                    />
                    <div>
                      <strong className="block">Dhaka Head Office</strong>
                      <span className="text-[#45464d]">
                        {siteConfig.contact.address ||
                          "Dhaka, Bangladesh"}
                      </span>
                    </div>
                  </div>
                  {siteConfig.contact.phone ? (
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="shrink-0 text-[#0077b6]" />
                      <span>{siteConfig.contact.phone}</span>
                    </div>
                  ) : null}
                  {siteConfig.contact.email ? (
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="shrink-0 text-[#0077b6]" />
                      <span>{siteConfig.contact.email}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="shrink-0 text-[#0077b6]" />
                    <span>Saturday to Thursday · 9:30 AM – 7:30 PM</span>
                  </div>
                </div>
              </div>

              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition hover:bg-[#f8f9ff]"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#5bb8fe]/30 text-[#0077b6]">
                      <MessageCircle size={18} />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-[#0b1c30]">
                        Chat with an Expert
                      </span>
                      <span className="text-xs text-[#76777d]">
                        Direct WhatsApp hotline
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-[#0077b6] transition-transform group-hover:translate-x-1"
                  />
                </a>
              ) : null}
            </Reveal>

            <Reveal
              className="p-7 md:p-10 lg:col-span-7"
              direction="right"
              delay={0.1}
            >
              {done ? (
                <div className="flex h-full min-h-[320px] flex-col justify-center">
                  <h3 className="text-2xl font-semibold tracking-tight text-[#0b1c30]">
                    {inquiryHome.successTitle}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[#45464d]">
                    {inquiryHome.successBody}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDone(false)}
                    className="mt-8 inline-flex self-start text-sm font-semibold text-[#0077b6] underline-offset-4 hover:underline"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name *" name="name" required />
                  <Field label="Phone *" name="phone" type="tel" required />
                  <Field label="Email *" name="email" type="email" required />
                  <Field
                    label="Destination *"
                    name="destination"
                    required
                    placeholder="e.g. Malaysia, Dubai"
                  />
                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-sm font-semibold text-[#0b1c30]">
                      Service type *
                    </span>
                    <select
                      name="service"
                      required
                      defaultValue=""
                      className="h-12 rounded-xl border-0 bg-[#f8f9ff] px-3 text-sm text-[#0b1c30] shadow-sm outline-none focus:bg-[#eff4ff]"
                    >
                      <option value="" disabled>
                        Select service
                      </option>
                      {inquiryHome.serviceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-sm font-semibold text-[#0b1c30]">
                      Travel details or questions
                    </span>
                    <textarea
                      name="message"
                      rows={3}
                      className="rounded-xl border-0 bg-[#f8f9ff] px-3 py-2 text-sm text-[#0b1c30] shadow-sm outline-none focus:bg-[#eff4ff]"
                      placeholder="Dates, travelers, visa type…"
                    />
                  </label>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#03045e] text-sm font-semibold text-white shadow-md transition hover:bg-[#0077b6]"
                    >
                      Submit Travel Inquiry
                      <Send size={16} />
                    </button>
                    <p className="mt-3 text-center text-xs text-[#76777d]">
                      {inquiryHome.privacy}
                    </p>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
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
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-[#0b1c30]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-12 rounded-xl border-0 bg-[#f8f9ff] px-3 text-sm text-[#0b1c30] shadow-sm outline-none focus:bg-[#eff4ff]"
      />
    </label>
  );
}
