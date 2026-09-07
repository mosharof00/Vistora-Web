"use client";

import { MessageCircle, Phone } from "lucide-react";
import { getCallHref, getWhatsAppHref } from "@/config/navigation";

export function FloatingContact() {
  const whatsapp = getWhatsAppHref();
  const call = getCallHref();

  if (!whatsapp && !call) return null;

  return (
    <div className="fixed right-4 bottom-5 z-50 flex flex-col items-end gap-2 md:right-6 md:bottom-6">
      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={16} />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      ) : null}
      {call ? (
        <a
          href={call}
          className="inline-flex items-center gap-2 rounded-full bg-[#03045e] px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] md:hidden"
          aria-label="Call Vistora"
        >
          <Phone size={16} />
          Call
        </a>
      ) : null}
    </div>
  );
}
