import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import { CLINIC_INFO } from "@/lib/clinic-config";

const QUICK_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Specialities", href: "/#specialities" },
  { label: "Facilities", href: "/#facilities" },
  { label: "Asthma Care", href: "/#patient-information" },
  { label: "Contact", href: "/#contact" },
];

const FOOTER_SPECIALITIES = [
  "Chest & Respiratory Diseases",
  "Asthma & Allergies",
  "Pulmonary Function Test (PFT)",
  "Bronchoscopy & Thoracoscopy",
  "Obstructive Sleep Apnea (OSA)",
  "Tuberculosis (TB) & Pneumonia",
];

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Clinic Brand & Doctor Qualifications */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                <Image
                  src="/images/logo.png"
                  alt="Saanvika Advanced Chest Care Centre Logo"
                  fill
                  sizes="44px"
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide text-white">
                  {CLINIC_INFO.name}
                </p>
                <p className="text-xs text-teal">{CLINIC_INFO.tagline}</p>
              </div>
            </div>

            <div className="mt-5 space-y-1 text-sm text-white/80">
              <p className="font-semibold text-white">
                {CLINIC_INFO.doctor.name}
              </p>
              <p>{CLINIC_INFO.doctor.qualifications}</p>
              <p className="text-white/65">{CLINIC_INFO.doctor.formerRole}</p>
              <p className="text-gold">
                {CLINIC_INFO.doctor.specialisationTitle}
              </p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-teal"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialities */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold">
              Specialities
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              {FOOTER_SPECIALITIES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Consultation Hours & Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold">
              Consultation Hours
            </h3>
            <div className="mt-4 space-y-1.5 text-sm text-white/80">
              <p>Mon – Sat: 1:00 PM – 8:00 PM</p>
              <p>Sunday: 4:00 PM – 8:00 PM</p>
              <p className="text-white/60">Wednesday: CLOSED</p>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-white/65">
              {CLINIC_INFO.address.full}
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              <a
                href={CLINIC_INFO.phoneHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-teal"
              >
                <Phone className="h-4 w-4 text-teal" />
                <span>{CLINIC_INFO.phoneDisplay}</span>
              </a>
              <a
                href={`https://wa.me/${CLINIC_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Clinic Desk</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} {CLINIC_INFO.name}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/medical-disclaimer"
              className="transition-colors hover:text-white"
            >
              Medical Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

