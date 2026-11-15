export const CLINIC_INFO = {
  name: "SAANVIKA ADVANCED CHEST CARE CENTRE",
  shortName: "Saanvika Chest Care",
  tagline: "Breathe Better. Live Healthier.",
  doctor: {
    name: "Dr. Sandeep Gupta",
    qualifications: "MBBS, MD (Pulmonary Medicine)",
    formerRole: "Former Physician – AIIMS Rishikesh",
    specialisationTitle: "Consultant Chest Physician",
    specialisations: [
      "Pulmonary Medicine",
      "Respiratory Diseases",
      "Asthma Management",
      "Sleep-Related Breathing Disorders",
      "Chest Diseases",
    ],
  },
  phoneDisplay: "+91 7393038787",
  phoneHref: "tel:+917393038787",
  whatsappNumber: "917393038787",
  address: {
    line1: "In front of Virdayani Hospital, Taramandal Budha Vihar",
    line2: "Taramandal Rd, near SBI Head Office",
    city: "Gorakhpur",
    state: "Uttar Pradesh",
    postalCode: "273017",
    full: "In front of Virdayani Hospital, Taramandal Budha Vihar, Taramandal Rd, near SBI Head Office, Gorakhpur, Uttar Pradesh 273017",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Dr.Sandeep+Gupta+-Pulmonologist%2Fchest+physician+in+Gorakhpur%2C+commercial%2C+infront+of+virdayani+hospital%2C+Taramandal+Budha+vihar%2C+Taramandal+Rd%2C+near+SBI+Head+office%2C+Gorakhpur%2C+Uttar+Pradesh+273017",
    googleMapsEmbedUrl:
      "https://maps.google.com/maps?q=Dr.Sandeep%20Gupta%20Pulmonologist%20chest%20physician%20in%20Gorakhpur%2C%20Taramandal%20Rd%2C%20near%20SBI%20Head%20office%2C%20Gorakhpur%2C%20Uttar%20Pradesh%20273017&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
} as const;

export interface DaySchedule {
  day: string;
  hours: string;
  isClosed: boolean;
}

export const CONSULTATION_SCHEDULE: DaySchedule[] = [
  { day: "Monday", hours: "1:00 PM – 8:00 PM", isClosed: false },
  { day: "Tuesday", hours: "1:00 PM – 8:00 PM", isClosed: false },
  { day: "Wednesday", hours: "CLOSED", isClosed: true },
  { day: "Thursday", hours: "1:00 PM – 8:00 PM", isClosed: false },
  { day: "Friday", hours: "1:00 PM – 8:00 PM", isClosed: false },
  { day: "Saturday", hours: "1:00 PM – 8:00 PM", isClosed: false },
  { day: "Sunday", hours: "4:00 PM – 8:00 PM", isClosed: false },
];

// 30-minute consultation slots respecting clinic hours
export const MON_SAT_SLOTS = [
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
] as const;

export const SUNDAY_SLOTS = [
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
] as const;

/**
 * Returns available time slots for a YYYY-MM-DD date string based on clinic hours.
 * Wednesday (day 3) returns [] (CLOSED).
 * Sunday (day 0) returns 4:00 PM – 7:30 PM (last slot before 8:00 PM closing).
 * Mon–Sat returns 1:00 PM – 7:30 PM (last slot before 8:00 PM closing).
 */
export function getSlotsForDate(dateStr: string): string[] {
  if (!dateStr) return [];
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return [];
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 3) return []; // Wednesday CLOSED
  if (dayOfWeek === 0) return [...SUNDAY_SLOTS];
  return [...MON_SAT_SLOTS];
}

export function isWednesday(dateStr: string): boolean {
  if (!dateStr) return false;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return false;
  return new Date(year, month - 1, day).getDay() === 3;
}

export function buildWhatsAppBookingUrl(params: {
  patientName?: string;
  phone?: string;
  age?: string | number;
  date?: string;
  time?: string;
  reason?: string;
  visitType?: string;
}): string {
  const lines = [
    `Hello ${CLINIC_INFO.name},`,
    `I would like to request an appointment with ${CLINIC_INFO.doctor.name}.`,
  ];

  if (params.patientName) lines.push(`Patient Name: ${params.patientName}`);
  if (params.phone) lines.push(`Mobile: ${params.phone}`);
  if (params.age) lines.push(`Age: ${params.age}`);
  if (params.date) lines.push(`Preferred Date: ${params.date}`);
  if (params.time) lines.push(`Preferred Time: ${params.time}`);
  if (params.visitType) lines.push(`Visit Type: ${params.visitType}`);
  if (params.reason) lines.push(`Reason: ${params.reason}`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${CLINIC_INFO.whatsappNumber}?text=${text}`;
}

export const CONSULTATION_REASONS = [
  "Asthma & Breathing Difficulty",
  "Persistent Cough / Wheezing",
  "Chest & Respiratory Evaluation",
  "Allergies & Sinus/Airway Symptoms",
  "Sleep Apnea / Snoring / Sleep Disorder",
  "Tuberculosis (TB) / Infection Evaluation",
  "Post-COVID Respiratory Care",
  "Pulmonary Function Test (PFT)",
  "Follow-up Consultation",
  "Other Chest / Pulmonary Concern",
] as const;

