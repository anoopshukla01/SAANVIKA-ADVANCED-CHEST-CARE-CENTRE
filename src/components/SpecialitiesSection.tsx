"use client";

import { useRef, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleScroll() {
    const el = sliderRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    const step = firstCard.offsetWidth + 16; // card width + gap-4 (16px)
    const idx = Math.round(el.scrollLeft / step);
    setActiveIndex(Math.max(0, Math.min(SPECIALITIES.length - 1, idx)));
  }

  function scrollToIndex(idx: number) {
    const el = sliderRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    const step = firstCard.offsetWidth + 16;
    el.scrollTo({ left: idx * step, behavior: "smooth" });
  }

  return (
    <section id="specialities" className="bg-[#F6FAFD] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
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

          {/* Mobile-only Prev/Next Controls */}
          <div className="flex shrink-0 items-center gap-1.5 sm:hidden">
            <button
              type="button"
              onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous speciality"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-navy/15 bg-white text-navy disabled:opacity-35"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                scrollToIndex(
                  Math.min(SPECIALITIES.length - 1, activeIndex + 1)
                )
              }
              disabled={activeIndex === SPECIALITIES.length - 1}
              aria-label="Next speciality"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-navy/15 bg-white text-navy disabled:opacity-35"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile: Horizontal Swipe Slider | Tablet & Desktop: Grid */}
        <StaggerContainer>
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 px-4 pb-2 sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
          >
            {SPECIALITIES.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem
                  key={item.title}
                  className="w-[82vw] max-w-[310px] shrink-0 snap-start sm:w-auto sm:max-w-none"
                >
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
          </div>
        </StaggerContainer>

        {/* Mobile-only Slide Dots */}
        <div
          className="mt-4 flex items-center justify-center gap-1.5 sm:hidden"
          aria-hidden="true"
        >
          {SPECIALITIES.map((item, idx) => (
            <button
              key={item.title}
              type="button"
              onClick={() => scrollToIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeIndex ? "w-5 bg-teal" : "w-1.5 bg-navy/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
