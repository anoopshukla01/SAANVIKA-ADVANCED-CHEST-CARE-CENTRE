"use client";

import {
  Wind,
  Activity,
  Flower2,
  ScanLine,
  Thermometer,
  ShieldAlert,
  ShieldPlus,
  Moon,
  BedDouble,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./MotionPrimitives";

const SPECIALITIES = [
  {
    title: "Chest & Respiratory Diseases",
    description:
      "Comprehensive evaluation and clinical management for acute and chronic conditions affecting the lungs and airways.",
    icon: Activity,
  },
  {
    title: "Asthma",
    description:
      "Structured assessment, trigger identification, and personalised care plans to help maintain comfortable breathing.",
    icon: Wind,
  },
  {
    title: "Allergies",
    description:
      "Evaluation of respiratory and airway allergies, seasonal sensitivities, and allergic rhinitis.",
    icon: Flower2,
  },
  {
    title: "Lung Cancer",
    description:
      "Careful diagnostic workup and specialist guidance for suspicious lung nodules, masses, and thoracic findings.",
    icon: ScanLine,
  },
  {
    title: "Pneumonia",
    description:
      "Timely diagnosis and medical management of bacterial, viral, and community-acquired lung infections.",
    icon: Thermometer,
  },
  {
    title: "Tuberculosis (TB)",
    description:
      "Dedicated evaluation, diagnostic testing guidance, and structured medical follow-up for tuberculosis.",
    icon: ShieldAlert,
  },
  {
    title: "COVID-19",
    description:
      "Respiratory assessment and follow-up consultation for COVID-19 and persistent post-viral lung symptoms.",
    icon: ShieldPlus,
  },
  {
    title: "Obstructive Sleep Apnea (OSA)",
    description:
      "Evaluation of loud snoring, breathing pauses during sleep, and daytime fatigue related to airway obstruction.",
    icon: Moon,
  },
  {
    title: "Sleep Disorders",
    description:
      "Clinical consultation for sleep-related breathing disorders and nocturnal respiratory symptoms.",
    icon: BedDouble,
  },
];

export default function SpecialitiesSection() {
  return (
    <section id="specialities" className="bg-[#F6FAFD] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Clinical Expertise
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Medical Specialities
          </h2>
          <p className="mt-3 text-base leading-relaxed text-navy/70">
            Focused, evidence-based pulmonary consultation across chest,
            airway, infectious, and sleep-related respiratory conditions.
          </p>
        </FadeIn>

        <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SPECIALITIES.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <div className="group flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-md">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-teal transition-colors duration-300 group-hover:bg-teal group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-navy sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/70">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
