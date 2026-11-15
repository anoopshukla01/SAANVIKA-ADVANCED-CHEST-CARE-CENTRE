import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CLINIC_INFO } from "@/lib/clinic-config";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  icons: {
    icon: "/images/logo.png",
  },
  title: {
    default: `${CLINIC_INFO.name} | Dr. Sandeep Gupta – Consultant Chest Physician`,
    template: `%s | ${CLINIC_INFO.name}`,
  },
  description:
    "Saanvika Advanced Chest Care Centre led by Dr. Sandeep Gupta (MBBS, MD Pulmonary Medicine, Former Physician – AIIMS Rishikesh). Expert respiratory, asthma, sleep apnea, and pulmonary diagnostic care.",
  keywords: [
    "Chest Specialist",
    "Pulmonologist",
    "Chest Doctor",
    "Asthma Specialist",
    "Lung Specialist",
    "Pulmonary Medicine",
    "Saanvika Advanced Chest Care Centre",
    "Dr. Sandeep Gupta",
    "Pulmonologist in Gorakhpur",
    "Chest Physician Gorakhpur",
    "Taramandal Gorakhpur",
    "Bronchoscopy",
    "Pulmonary Function Test",
    "Sleep Apnea",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: CLINIC_INFO.name,
    title: `${CLINIC_INFO.name} | Dr. Sandeep Gupta`,
    description:
      "Expert respiratory and pulmonary care with a focus on accurate diagnosis, personalised treatment and better lung health.",
    images: [
      {
        url: "/images/clinic-interior.jpg",
        width: 1200,
        height: 630,
        alt: CLINIC_INFO.name,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const medicalClinicSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: CLINIC_INFO.name,
    medicalSpecialty: "Pulmonary",
    telephone: "+91-7393038787",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${CLINIC_INFO.address.line1}, ${CLINIC_INFO.address.line2}`,
      addressLocality: CLINIC_INFO.address.city,
      addressRegion: CLINIC_INFO.address.state,
      postalCode: CLINIC_INFO.address.postalCode,
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "13:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "16:00",
        closes: "20:00",
      },
    ],
    physician: {
      "@type": "Physician",
      name: CLINIC_INFO.doctor.name,
      medicalSpecialty: "Pulmonary Medicine",
      description: `${CLINIC_INFO.doctor.qualifications}, ${CLINIC_INFO.doctor.formerRole}`,
    },
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${playfair.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-white text-navy antialiased selection:bg-teal/15 selection:text-navy"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(medicalClinicSchema),
          }}
        />
        {children}
      </body>
    </html>
  );
}

