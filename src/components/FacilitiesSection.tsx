"use client";

import Image from "next/image";
import { FadeIn, StaggerContainer, StaggerItem } from "./MotionPrimitives";

const FACILITIES = [
  {
    title: "Bronchoscopy",
    image: "/images/bronchoscopy-suite.jpg",
    alt: "Modern video bronchoscopy equipment in a clean pulmonary suite",
    description:
      "A minimally invasive airway examination using a thin, flexible scope with high-definition visualisation to inspect the trachea and bronchial passages.",
  },
  {
    title: "Thoracoscopy",
    image: "/images/thoracoscopy-suite.jpg",
    alt: "Modern thoracoscopic diagnostic suite",
    description:
      "A specialised diagnostic procedure allowing direct inspection of the pleural space and chest cavity to evaluate pleural and thoracic conditions.",
  },
  {
    title: "Nebulization",
    image: "/images/nebulization-care.jpg",
    alt: "Patient receiving nebulization therapy in a serene clinic room",
    description:
      "Targeted aerosol respiratory therapy delivering prescribed medication directly into the airways to help relieve breathing discomfort.",
  },
  {
    title: "Pulmonary Function Test (PFT)",
    image: "/images/pft-testing.jpg",
    alt: "Patient undergoing Pulmonary Function Test spirometry",
    description:
      "Non-invasive spirometry and lung function testing to measure airflow, lung volumes, and respiratory capacity for accurate diagnosis.",
  },
];

export default function FacilitiesSection() {
  return (
    <section id="facilities" className="bg-[#EBF2F8] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Diagnostic Infrastructure
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Advanced Diagnostic Facilities
          </h2>
          <p className="mt-3 text-base leading-relaxed text-navy/70">
            Dedicated pulmonary diagnostic and respiratory care services
            designed for clarity, comfort, and clinical precision.
          </p>
        </FadeIn>

        <StaggerContainer className="mt-12 grid gap-8 md:grid-cols-2">
          {FACILITIES.map((facility) => (
            <StaggerItem key={facility.title}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
                  <Image
                    src={facility.image}
                    alt={facility.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 48vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-lg font-bold text-navy sm:text-xl">
                    {facility.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/70 sm:text-base">
                    {facility.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
