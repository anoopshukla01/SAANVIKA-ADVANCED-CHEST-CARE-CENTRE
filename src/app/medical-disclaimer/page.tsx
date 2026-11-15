import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CLINIC_INFO } from "@/lib/clinic-config";

export const metadata = {
  title: "Medical Disclaimer",
};

export default function MedicalDisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <h1 className="mt-6 font-serif text-3xl font-semibold text-navy sm:text-4xl">
          Medical Disclaimer
        </h1>
        <p className="mt-2 text-sm text-navy/60">{CLINIC_INFO.name}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-navy/80 sm:text-base">
          <section>
            <h2 className="text-lg font-bold text-navy">
              Educational Purpose Only
            </h2>
            <p className="mt-2">
              All health-related information, symptom guides (including asthma
              awareness), and facility descriptions published on this website
              are intended solely for general patient education and awareness.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">
              Not a Substitute for Professional Medical Advice
            </h2>
            <p className="mt-2">
              Content on this website does not constitute medical advice,
              diagnosis, or treatment, nor does browsing or submitting an
              appointment request establish a doctor-patient relationship prior
              to an in-person clinical consultation. Always seek the advice of a
              qualified physician for any medical condition or respiratory
              symptom.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">
              Medical Emergencies
            </h2>
            <p className="mt-2">
              If you are experiencing severe breathing difficulty, acute chest
              pain, or a medical emergency, please seek immediate emergency
              hospital care rather than waiting for an online appointment
              confirmation.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

