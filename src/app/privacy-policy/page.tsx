import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CLINIC_INFO } from "@/lib/clinic-config";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-navy/60">{CLINIC_INFO.name}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-navy/80 sm:text-base">
          <section>
            <h2 className="text-lg font-bold text-navy">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              When you submit an appointment request or contact inquiry on our
              website, we collect only the information necessary to coordinate
              your consultation: your full name, mobile number, age, preferred
              appointment date and time, visit type, and reason for
              consultation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">
              2. How We Use Your Information
            </h2>
            <p className="mt-2">
              Your details are used solely by {CLINIC_INFO.name} and{" "}
              {CLINIC_INFO.doctor.name}&apos;s clinic desk to schedule, confirm,
              or communicate regarding your appointment or inquiry. We do not
              sell, rent, or share patient contact details with third-party
              marketers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">
              3. Data Security &amp; Storage
            </h2>
            <p className="mt-2">
              Appointment requests are stored securely using encrypted database
              connections and role-restricted access policies so that only
              authorised clinic administrators can view patient appointment
              records.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">4. Contact</h2>
            <p className="mt-2">
              For questions regarding your appointment data or privacy, please
              call us at{" "}
              <a
                href={CLINIC_INFO.phoneHref}
                className="font-semibold text-teal underline"
              >
                {CLINIC_INFO.phoneDisplay}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

