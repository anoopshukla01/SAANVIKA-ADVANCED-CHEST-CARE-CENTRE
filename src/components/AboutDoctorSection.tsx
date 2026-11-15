"use client";

import Image from "next/image";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { CLINIC_INFO } from "@/lib/clinic-config";
import { FadeIn } from "./MotionPrimitives";

export default function AboutDoctorSection() {
  return (
    <section id="about-doctor" className="bg-surface py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Clean Editorial Image */}
          <FadeIn className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-sm lg:aspect-[4/4.5]">
              <Image
                src="/images/consultation-scene.jpg"
                alt="Pulmonary consultation with Dr. Sandeep Gupta"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </FadeIn>

          {/* Doctor Bio & Specialisation */}
          <FadeIn delay={0.08} className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              About The Specialist
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              Meet Your Chest Specialist
            </h2>

            <p className="mt-3 text-sm font-semibold text-navy/75">
              {CLINIC_INFO.doctor.name} &middot;{" "}
              {CLINIC_INFO.doctor.qualifications} &middot;{" "}
              <span className="text-teal">{CLINIC_INFO.doctor.formerRole}</span>
            </p>

            <p className="mt-5 text-base leading-relaxed text-navy/80 sm:text-lg">
              Dr. Sandeep Gupta is a qualified pulmonary medicine specialist with
              an MBBS and MD in Pulmonary Medicine. He previously served as a
              physician at AIIMS Rishikesh and provides consultation for
              respiratory and chest-related conditions.
            </p>

            <div className="mt-8 border-t border-navy/10 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-navy/60">
                Areas of Specialisation
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {CLINIC_INFO.doctor.specialisations.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm font-medium text-navy"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-teal" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <a
                href="#book-appointment"
                className="inline-flex items-center gap-2.5 rounded-full bg-teal px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy"
              >
                <CalendarCheck className="h-4 w-4" />
                <span>Book Consultation</span>
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
