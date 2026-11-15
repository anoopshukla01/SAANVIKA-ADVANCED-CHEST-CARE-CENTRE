"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { FadeIn } from "./MotionPrimitives";

const PILLARS = [
  {
    title: "Qualified Pulmonary Medicine Specialist",
    description:
      "Consult directly with Dr. Sandeep Gupta, MBBS, MD (Pulmonary Medicine), trained specifically in respiratory and chest medicine.",
  },
  {
    title: "Former Physician at AIIMS Rishikesh",
    description:
      "Clinical background shaped by experience at one of India's premier medical institutions.",
  },
  {
    title: "Specialised Chest and Respiratory Care",
    description:
      "Focused attention on asthma, allergies, infections, lung health, and sleep-related breathing disorders.",
  },
  {
    title: "Dedicated Pulmonary Diagnostic Facilities",
    description:
      "Equipped for Pulmonary Function Testing (PFT), Bronchoscopy, Thoracoscopy, and Nebulization under one roof.",
  },
  {
    title: "Patient-focused Consultation",
    description:
      "Clear communication, unhurried clinical evaluation, and respectful guidance tailored to each patient.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="bg-navy py-20 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Clean Clinic Interior Visual */}
          <FadeIn className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 shadow-xl lg:aspect-[4/4.5]">
              <Image
                src="/images/clinic-interior.jpg"
                alt="Saanvika Advanced Chest Care Centre calm modern reception interior"
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </FadeIn>

          {/* Clean Divider-Based Pillars List */}
          <div className="lg:col-span-7">
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
                Why Choose Our Clinic
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Trusted Expertise in Pulmonary &amp; Chest Care
              </h2>
            </FadeIn>

            <ul className="mt-8 divide-y divide-white/10">
              {PILLARS.map((pillar) => (
                <li key={pillar.title} className="flex items-start gap-4 py-4">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/20 text-teal">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">
                      {pillar.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
