"use client";

import { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { CONSULTATION_SCHEDULE } from "@/lib/clinic-config";

export default function ConsultationHoursStickyNote() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      aria-label="Clinic Consultation Hours"
      className="fixed bottom-4 right-4 z-40 hidden max-w-[270px] lg:block"
    >
      <div className="overflow-hidden rounded-2xl border border-gold/45 bg-[#FFFDF7] shadow-lg ring-1 ring-navy/5">
        {/* Top sticky-note accent bar */}
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gold-light/50"
          aria-expanded={expanded}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-teal" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-navy">
                Consultation Hours
              </p>
              <p className="text-[11px] font-medium text-navy/70">
                Mon–Sat 1–8 PM &middot; Wed Closed
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-navy/55" />
          ) : (
            <ChevronUp className="h-4 w-4 shrink-0 text-navy/55" />
          )}
        </button>

        {expanded && (
          <div className="border-t border-gold/25 px-4 py-3 text-xs">
            <ul className="space-y-1.5">
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
      </div>
    </aside>
  );
}

