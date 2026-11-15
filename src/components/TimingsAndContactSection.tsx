"use client";

import { useState, FormEvent } from "react";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { CLINIC_INFO } from "@/lib/clinic-config";
import { FadeIn } from "./MotionPrimitives";

export default function TimingsAndContactSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Please check your details and try again.");
        return;
      }
      setSent(true);
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      setError("Unable to send inquiry right now. Please call or use WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="bg-[#F2F7FB] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Get In Touch
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Visit Our Clinic
          </h2>
          <p className="mt-3 text-base leading-relaxed text-navy/70">
            Reach out for consultation inquiries, diagnostic scheduling, or
            clinic directions.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Clinic Details, Compact Hours & Map Integration */}
          <FadeIn className="space-y-6 lg:col-span-6">
            <div className="rounded-2xl border border-navy/10 bg-white p-7">
              <h3 className="text-xl font-bold text-navy">
                {CLINIC_INFO.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-teal">
                {CLINIC_INFO.doctor.name} &middot;{" "}
                {CLINIC_INFO.doctor.qualifications}
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                  <div>
                    <p className="text-xs font-medium text-navy/55">
                      Clinic Phone
                    </p>
                    <a
                      href={CLINIC_INFO.phoneHref}
                      className="text-base font-bold text-navy transition-colors hover:text-teal"
                    >
                      {CLINIC_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div id="timings" className="flex items-start gap-3.5">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                  <div>
                    <p className="text-xs font-medium text-navy/55">
                      Consultation Hours
                    </p>
                    <p className="text-sm font-semibold text-navy">
                      Mon – Sat: 1:00 PM – 8:00 PM
                    </p>
                    <p className="text-xs text-navy/70">
                      Sunday: 4:00 PM – 8:00 PM &middot; Wednesday: CLOSED
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                  <div>
                    <p className="text-xs font-medium text-navy/55">
                      Clinic Address
                    </p>
                    <p className="text-sm leading-relaxed text-navy/80">
                      {CLINIC_INFO.address.line1},
                      <br />
                      {CLINIC_INFO.address.line2},
                      <br />
                      {CLINIC_INFO.address.city}, {CLINIC_INFO.address.state}{" "}
                      {CLINIC_INFO.address.postalCode}
                    </p>
                    <a
                      href={CLINIC_INFO.address.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline"
                    >
                      <span>Get Directions on Google Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={CLINIC_INFO.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Clinic</span>
                </a>
                <a
                  href={`https://wa.me/${CLINIC_INFO.whatsappNumber}?text=${encodeURIComponent(
                    `Hello ${CLINIC_INFO.name}, I would like to book an appointment with ${CLINIC_INFO.doctor.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#128C7E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp Appointment</span>
                </a>
              </div>
            </div>

            {/* Interactive Google Maps Embed */}
            <div className="overflow-hidden rounded-2xl border border-navy/10 bg-surface/60 shadow-xs">
              <iframe
                title={`${CLINIC_INFO.name} Location Map`}
                src={CLINIC_INFO.address.googleMapsEmbedUrl}
                className="aspect-[16/9] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </FadeIn>

          {/* Contact Form */}
          <FadeIn delay={0.08} className="lg:col-span-6">
            <div className="h-full rounded-2xl border border-navy/10 bg-white p-7 sm:p-8">
              <h3 className="text-xl font-bold text-navy">
                Send a General Inquiry
              </h3>
              <p className="mt-1.5 text-sm text-navy/65">
                Have a question about consultation timings or diagnostic
                facilities? Write to us below.
              </p>

              {sent ? (
                <div className="mt-8 rounded-2xl bg-surface p-6 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-teal" />
                  <h4 className="mt-3 text-lg font-bold text-navy">
                    Inquiry Received
                  </h4>
                  <p className="mt-1 text-sm text-navy/70">
                    Thank you for reaching out. Our clinic team will get back
                    to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-5 rounded-full border border-navy/15 bg-white px-5 py-2 text-xs font-semibold text-navy hover:border-teal"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleContactSubmit}
                  className="mt-6 space-y-4"
                >
                  {error && (
                    <p className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">
                      {error}
                    </p>
                  )}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-semibold text-navy"
                    >
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="mt-1.5 w-full rounded-xl border border-navy/15 bg-surface/40 px-4 py-2.5 text-sm text-navy outline-none focus:border-teal focus:bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-sm font-semibold text-navy"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98XXXXXXXX"
                      className="mt-1.5 w-full rounded-xl border border-navy/15 bg-surface/40 px-4 py-2.5 text-sm text-navy outline-none focus:border-teal focus:bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-semibold text-navy"
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we assist you?"
                      className="mt-1.5 w-full rounded-xl border border-navy/15 bg-surface/40 px-4 py-2.5 text-sm text-navy outline-none focus:border-teal focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal disabled:opacity-50"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span>{sending ? "Sending..." : "Send Inquiry"}</span>
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
