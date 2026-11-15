"use client";

import { useState } from "react";
import { Phone, MessageCircle, Clock, X } from "lucide-react";
import {
  CLINIC_INFO,
  CONSULTATION_SCHEDULE,
  buildWhatsAppBookingUrl,
} from "@/lib/clinic-config";

export default function MobileBottomBar() {
  const [hoursOpen, setHoursOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      {/* Compact Hours Popover on Mobile */}
      {hoursOpen && (
        <div className="mx-3 mb-2 rounded-2xl border border-gold/45 bg-[#FFFDF7] p-4 shadow-xl ring-1 ring-navy/10">
          <div className="flex items-center justify-between border-b border-gold/25 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-navy">
              Consultation Hours
            </span>
            <button
              type="button"
              onClick={() => setHoursOpen(false)}
              aria-label="Close consultation hours"
              className="flex min-h-[44px] min-w-[44px] -mr-2 -my-2 items-center justify-center rounded-xl text-navy/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="mt-2.5 space-y-1.5 text-xs">
            {CONSULTATION_SCHEDULE.map((item) => (
              <li
                key={item.day}
                className="flex items-center justify-between gap-4"
              >
                <span className="font-medium text-navy/80">{item.day}</span>
                <span
                  className={
                    item.isClosed
                      ? "font-bold text-navy/45"
                      : "font-semibold text-teal"
                  }
                >
                  {item.hours}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Thumb-Reachable Action Bar */}
      <div className="border-t border-navy/10 bg-white/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(16,43,70,0.08)] backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <a
            href={CLINIC_INFO.phoneHref}
            className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-navy/15 bg-white px-3 text-xs font-semibold text-navy active:scale-[0.98]"
          >
            <Phone className="h-4 w-4 shrink-0 text-teal" />
            <span>Call</span>
          </a>

          <a
            href={buildWhatsAppBookingUrl({})}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] flex-[1.5] items-center justify-center gap-1.5 rounded-full bg-[#128C7E] px-3 text-xs font-semibold text-white active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span>Book WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setHoursOpen((prev) => !prev)}
            aria-expanded={hoursOpen}
            aria-label="Toggle consultation hours"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-gold/45 bg-[#FFFDF7] px-3 text-navy active:scale-[0.98]"
          >
            <Clock className="h-4 w-4 text-teal" />
          </button>
        </div>
      </div>
    </div>
  );
}
