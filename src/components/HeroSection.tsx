"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, Phone, CheckCircle2 } from "lucide-react";
import { CLINIC_INFO, buildWhatsAppBookingUrl } from "@/lib/clinic-config";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="bg-gradient-to-br from-[#E7F0F7] via-[#F2F7FB] to-white pb-16 pt-10 sm:pb-20 sm:pt-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Content: Hero + Meet Your Chest Specialist Combined */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              {CLINIC_INFO.name}
            </p>

            <h1 className="mt-3 font-serif text-[clamp(1.95rem,6vw,3.35rem)] font-semibold leading-[1.12] tracking-tight text-navy lg:text-[3.35rem]">
              Breathe Better.{" "}
              <span className="text-teal">Live Healthier.</span>
            </h1>

            {/* Doctor Identity */}
            <div id="about-doctor" className="mt-6 border-l-2 border-teal pl-5">
              <h2 className="text-xl font-bold text-navy">
                {CLINIC_INFO.doctor.name}
              </h2>
              <p className="mt-0.5 text-sm font-semibold text-teal">
                {CLINIC_INFO.doctor.qualifications}
              </p>
              <p className="mt-0.5 text-sm text-navy/70">
                {CLINIC_INFO.doctor.formerRole} &middot;{" "}
                {CLINIC_INFO.doctor.specialisationTitle}
              </p>
            </div>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy/75">
              Dr. Sandeep Gupta is a qualified pulmonary medicine specialist with
              an MBBS and MD in Pulmonary Medicine. He previously served as a
              physician at AIIMS Rishikesh and provides consultation for
              respiratory and chest-related conditions, with a focus on accurate
              diagnosis, personalised treatment, and better lung health.
            </p>

            {/* Areas of Specialisation */}
            <div className="mt-6 border-t border-navy/10 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy/55">
                Areas of Specialisation
              </p>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {CLINIC_INFO.doctor.specialisations.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-medium text-navy"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-teal" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary Actions */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href={buildWhatsAppBookingUrl({})}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Book via WhatsApp</span>
              </a>
              <a
                href={CLINIC_INFO.phoneHref}
                className="inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-full border border-navy/15 bg-white px-7 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
              >
                <Phone className="h-4 w-4 text-teal" />
                <span>Call Now &middot; {CLINIC_INFO.phoneDisplay}</span>
              </a>
            </div>
          </motion.div>

          {/* Right Side: Actual Photograph of Dr. Sandeep Gupta */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-navy/10 bg-surface shadow-lg">
              <Image
                src="/images/dr-sandeep-gupta.jpg"
                alt="Dr. Sandeep Gupta, MBBS, MD (Pulmonary Medicine) – Consultant Chest Physician"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
