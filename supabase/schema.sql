-- ============================================================================
-- SAANVIKA ADVANCED CHEST CARE CENTRE — SUPABASE DATABASE SCHEMA
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor to set up the tables, indexes,
-- and Row Level Security (RLS) policies.
-- ============================================================================

-- 1. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL CHECK (char_length(trim(patient_name)) >= 2),
  phone_number TEXT NOT NULL CHECK (char_length(trim(phone_number)) >= 10),
  age INTEGER NOT NULL CHECK (age >= 0 AND age <= 120),
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  consultation_reason TEXT NOT NULL,
  visit_type TEXT NOT NULL CHECK (visit_type IN ('First Visit', 'Follow-up')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prevent double-booking of active (Pending or Confirmed) slots at the database level
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_appointment_slot
  ON public.appointments (appointment_date, appointment_time)
  WHERE status IN ('Pending', 'Confirmed');

CREATE INDEX IF NOT EXISTS idx_appointments_date
  ON public.appointments (appointment_date);

CREATE INDEX IF NOT EXISTS idx_appointments_status
  ON public.appointments (status);

-- 2. Blocked / Unavailable Slots Table (Managed by Admin)
CREATE TABLE IF NOT EXISTS public.blocked_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date DATE NOT NULL,
  slot_time TEXT, -- NULL means the entire day is blocked
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_blocked_slot
  ON public.blocked_slots (slot_date, COALESCE(slot_time, '__FULL_DAY__'));

-- 3. Contact Inquiries Table (For Section 10 Contact Form)
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Appointments:
-- Anyone can submit a new appointment request (status MUST be 'Pending')
CREATE POLICY "Allow public appointment request insert"
  ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'Pending');

-- Only authenticated clinic admins can view full appointment records
CREATE POLICY "Allow authenticated admin read appointments"
  ON public.appointments
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated clinic admins can update appointment statuses
CREATE POLICY "Allow authenticated admin update appointments"
  ON public.appointments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed'));

-- Blocked Slots:
-- Public can read blocked slots (no PII) so the booking calendar disables them
CREATE POLICY "Allow public read blocked slots"
  ON public.blocked_slots
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated admins can insert or delete blocked slots
CREATE POLICY "Allow authenticated admin manage blocked slots"
  ON public.blocked_slots
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Contact Inquiries:
CREATE POLICY "Allow public insert contact inquiries"
  ON public.contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admin read contact inquiries"
  ON public.contact_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- SAFE PUBLIC AVAILABILITY FUNCTION (Returns only booked times, zero PII)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_booked_slots(target_date DATE)
RETURNS TABLE (appointment_time TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.appointment_time
  FROM public.appointments a
  WHERE a.appointment_date = target_date
    AND a.status IN ('Pending', 'Confirmed');
$$;

GRANT EXECUTE ON FUNCTION public.get_booked_slots(DATE) TO anon, authenticated;

