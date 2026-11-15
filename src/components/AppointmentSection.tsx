"use client";

import { useState, useEffect, FormEvent } from "react";
import { Calendar, MessageCircle, Phone } from "lucide-react";
import {
  CLINIC_INFO,
  CONSULTATION_REASONS,
  buildWhatsAppBookingUrl,
  getSlotsForDate,
  isWednesday,
} from "@/lib/clinic-config";
import { FadeIn } from "./MotionPrimitives";

function getInitialOpenDate(): string {
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const candidate = new Date(now);
    candidate.setDate(now.getDate() + i);
    const yyyy = candidate.getFullYear();
    const mm = String(candidate.getMonth() + 1).padStart(2, "0");
    const dd = String(candidate.getDate()).padStart(2, "0");
    const str = `${yyyy}-${mm}-${dd}`;
    if (!isWednesday(str)) {
      return str;
    }
  }
  return new Date().toLocaleDateString("en-CA");
}

export default function AppointmentSection() {
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [minDate, setMinDate] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reasonSelect, setReasonSelect] = useState<string>(
    CONSULTATION_REASONS[0]
  );
  const [customReason, setCustomReason] = useState("");

  useEffect(() => {
    setMinDate(new Date().toLocaleDateString("en-CA"));
    setAppointmentDate(getInitialOpenDate());
  }, []);

  const closedOnSelectedDate = isWednesday(appointmentDate);
  const slots =
    !appointmentDate || closedOnSelectedDate
      ? []
      : getSlotsForDate(appointmentDate);

  const effectiveReason =
    reasonSelect === "Other Chest / Pulmonary Concern" && customReason.trim()
      ? customReason.trim()
      : reasonSelect;

  function handleWhatsAppSubmit(e: FormEvent) {
    e.preventDefault();
    const url = buildWhatsAppBookingUrl({
      patientName,
      phone: phoneNumber,
      age,
      date: appointmentDate,
      time: appointmentTime,
      reason: effectiveReason,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="book-appointment" className="bg-surface py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column */}
          <FadeIn className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              WhatsApp Appointments
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              Book an Appointment
            </h2>
            <p className="mt-4 text-base leading-relaxed text-navy/70">
              Appointments with{" "}
              <strong className="text-navy">{CLINIC_INFO.doctor.name}</strong>{" "}
              are scheduled directly through WhatsApp. Enter your details to
              send your request in one tap, or call the clinic desk.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-navy/10 pt-6">
              <a
                href={`https://wa.me/${CLINIC_INFO.whatsappNumber}?text=${encodeURIComponent(
                  `Hello ${CLINIC_INFO.name}, I would like to book an appointment with ${CLINIC_INFO.doctor.name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#128C7E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={CLINIC_INFO.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
              >
                <Phone className="h-4 w-4 text-teal" />
                <span>{CLINIC_INFO.phoneDisplay}</span>
              </a>
            </div>
          </FadeIn>

          {/* Right WhatsApp Booking Builder */}
          <FadeIn delay={0.08} className="lg:col-span-7">
            <form
              onSubmit={handleWhatsAppSubmit}
              className="space-y-5 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-9"
            >
              {/* Name & Mobile */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="patient-name"
                    className="block text-sm font-semibold text-navy"
                  >
                    Patient Full Name *
                  </label>
                  <input
                    id="patient-name"
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter full name"
                    className="mt-1.5 w-full rounded-xl border border-navy/15 bg-surface/40 px-4 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal focus:bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone-number"
                    className="block text-sm font-semibold text-navy"
                  >
                    Mobile Number *
                  </label>
                  <input
                    id="phone-number"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98XXXXXXXX"
                    className="mt-1.5 w-full rounded-xl border border-navy/15 bg-surface/40 px-4 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal focus:bg-white"
                  />
                </div>
              </div>

              {/* Age & Preferred Date */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="patient-age"
                    className="block text-sm font-semibold text-navy"
                  >
                    Age (Years) *
                  </label>
                  <input
                    id="patient-age"
                    type="number"
                    required
                    min={0}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 42"
                    className="mt-1.5 w-full rounded-xl border border-navy/15 bg-surface/40 px-4 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal focus:bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="appointment-date"
                    className="block text-sm font-semibold text-navy"
                  >
                    Preferred Date *
                  </label>
                  <input
                    id="appointment-date"
                    type="date"
                    required
                    min={minDate}
                    value={appointmentDate}
                    onChange={(e) => {
                      setAppointmentDate(e.target.value);
                      setAppointmentTime("");
                    }}
                    className="mt-1.5 w-full rounded-xl border border-navy/15 bg-surface/40 px-4 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal focus:bg-white"
                  />
                  <p className="mt-1 text-[11px] text-navy/55">
                    Mon–Sat: 1–8 PM &middot; Sun: 4–8 PM &middot; Wed: Closed
                  </p>
                </div>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-sm font-semibold text-navy">
                  Preferred Time
                </label>

                {closedOnSelectedDate ? (
                  <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-900">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>
                      The clinic is <strong>CLOSED on Wednesdays</strong>.
                      Please select another day.
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {slots.map((slot) => {
                      const isSelected = appointmentTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setAppointmentTime(slot)}
                          className={`rounded-xl border px-2.5 py-2 text-xs font-semibold transition-all ${
                            isSelected
                              ? "border-teal bg-teal text-white"
                              : "border-navy/15 bg-white text-navy hover:border-teal hover:text-teal"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Reason for Consultation */}
              <div>
                <label
                  htmlFor="consultation-reason"
                  className="block text-sm font-semibold text-navy"
                >
                  Reason for Consultation *
                </label>
                <select
                  id="consultation-reason"
                  value={reasonSelect}
                  onChange={(e) => setReasonSelect(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-navy/15 bg-surface/40 px-4 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal focus:bg-white"
                >
                  {CONSULTATION_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
                {reasonSelect === "Other Chest / Pulmonary Concern" && (
                  <input
                    type="text"
                    required
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Briefly describe your symptoms or concern"
                    className="mt-2.5 w-full rounded-xl border border-navy/15 bg-surface/40 px-4 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal focus:bg-white"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={closedOnSelectedDate}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#128C7E] px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Send Appointment Request on WhatsApp</span>
              </button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
