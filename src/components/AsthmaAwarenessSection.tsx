"use client";

import Image from "next/image";
import { MessageCircle, Wind, Activity, ShieldAlert, Volume2 } from "lucide-react";
import { buildWhatsAppBookingUrl } from "@/lib/clinic-config";
import { FadeIn, StaggerContainer, StaggerItem } from "./MotionPrimitives";

const ASTHMA_SYMPTOMS = [
  {
    title: "Persistent Cough",
    description:
      "A lingering cough that often worsens at night, early morning, or after exposure to cold air or dust.",
    icon: ShieldAlert,
  },
  {
    title: "Wheezing",
    description:
      "A high-pitched whistling sound while breathing out, caused by narrowed bronchial airways.",
    icon: Volume2,
  },
  {
    title: "Shortness of Breath",
    description:
      "A feeling of breathlessness or difficulty catching your breath during routine daily tasks.",
    icon: Wind,
  },
  {
    title: "Chest Tightness",
    description:
      "A sensation of pressure or constriction across the chest that makes deep breathing uncomfortable.",
    icon: Activity,
  },
];

export default function AsthmaAwarenessSection() {
  return (
    <section id="patient-information" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Educational Content & Symptoms */}
          <div className="lg:col-span-7">
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
                Patient Awareness
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
                Recognise the Common Symptoms of Asthma
              </h2>
              <p className="mt-3 text-base leading-relaxed text-navy/70">
                Early recognition of airway symptoms helps you seek timely
                pulmonary evaluation and breathe with greater comfort.
              </p>
            </FadeIn>

            <StaggerContainer className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {ASTHMA_SYMPTOMS.map((symptom) => {
                const Icon = symptom.icon;
                return (
                  <StaggerItem key={symptom.title}>
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-teal">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-navy">
                          {symptom.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-navy/70">
                          {symptom.description}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            {/* Clean CTA & Quiet Disclaimer */}
            <FadeIn delay={0.12} className="mt-10 border-t border-navy/10 pt-6">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <p className="text-sm font-semibold text-navy sm:text-base">
                  Experiencing these symptoms? Schedule a consultation.
                </p>
                <a
                  href={buildWhatsAppBookingUrl({})}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Schedule Consultation</span>
                </a>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-navy/55">
                <strong>Medical Disclaimer:</strong> Educational information
                on this website is for general patient awareness only and does
                not replace professional medical advice, diagnosis, or
                treatment.
              </p>
            </FadeIn>
          </div>

          {/* Right Airway Illustration */}
          <FadeIn delay={0.08} className="lg:col-span-5">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-navy/10 bg-surface shadow-sm">
              <Image
                src="/images/asthma-airway.jpg"
                alt="Medical illustration comparing a normal open bronchial airway and a narrowed asthmatic airway"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
