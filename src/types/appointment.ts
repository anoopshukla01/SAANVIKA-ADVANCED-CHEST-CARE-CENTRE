export type AppointmentStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

export type VisitType = "First Visit" | "Follow-up";

export interface Appointment {
  id: string;
  patient_name: string;
  phone_number: string;
  age: number;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // e.g., "01:00 PM"
  consultation_reason: string;
  visit_type: VisitType;
  status: AppointmentStatus;
  created_at: string;
}

export interface BlockedSlot {
  id: string;
  slot_date: string; // YYYY-MM-DD
  slot_time: string | null; // null = entire day blocked
  reason: string | null;
  created_at: string;
}

export interface AppointmentCreateInput {
  patient_name: string;
  phone_number: string;
  age: number;
  appointment_date: string;
  appointment_time: string;
  consultation_reason: string;
  visit_type: VisitType;
}

