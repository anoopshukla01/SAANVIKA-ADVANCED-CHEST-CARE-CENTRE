"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import {
  Calendar,
  CheckCircle2,
  Clock,
  LogOut,
  Phone,
  Search,
  ShieldCheck,
  XCircle,
  AlertCircle,
  Lock,
  Plus,
  Trash2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import {
  CLINIC_INFO,
  getSlotsForDate,
  isWednesday,
} from "@/lib/clinic-config";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase";
import {
  Appointment,
  AppointmentStatus,
  BlockedSlot,
} from "@/types/appointment";

export default function AdminDashboardPage() {
  const configured = isSupabaseConfigured();
  const supabase = getSupabaseBrowserClient();

  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Slot Management Form
  const [blockDate, setBlockDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [blockTime, setBlockTime] = useState<string>("ALL_DAY");
  const [blockReason, setBlockReason] = useState("");
  const [blockingSlot, setBlockingSlot] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const fetchDashboardData = useCallback(async () => {
    if (!supabase || !session) return;
    setDataLoading(true);
    setActionError(null);
    try {
      const [apptRes, blockedRes] = await Promise.all([
        supabase
          .from("appointments")
          .select("*")
          .order("appointment_date", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("blocked_slots")
          .select("*")
          .order("slot_date", { ascending: true }),
      ]);

      if (apptRes.error) throw apptRes.error;
      if (blockedRes.error) throw blockedRes.error;

      setAppointments((apptRes.data as Appointment[]) || []);
      setBlockedSlots((blockedRes.data as BlockedSlot[]) || []);
    } catch (err) {
      console.error(err);
      setActionError("Unable to load clinic records. Verify RLS policies.");
    } finally {
      setDataLoading(false);
    }
  }, [supabase, session]);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session, fetchDashboardData]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setAuthError(null);
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError(error.message);
    }
    setSigningIn(false);
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAppointments([]);
    setBlockedSlots([]);
  }

  async function updateStatus(id: string, nextStatus: AppointmentStatus) {
    if (!supabase) return;
    setActionError(null);
    const { error } = await supabase
      .from("appointments")
      .update({ status: nextStatus })
      .eq("id", id);

    if (error) {
      setActionError(`Failed to update status: ${error.message}`);
      return;
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
    );
  }

  async function handleBlockSlot(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !blockDate) return;
    setActionError(null);
    setBlockingSlot(true);

    const slotTimeValue = blockTime === "ALL_DAY" ? null : blockTime;
    const { data, error } = await supabase
      .from("blocked_slots")
      .insert({
        slot_date: blockDate,
        slot_time: slotTimeValue,
        reason: blockReason.trim() || null,
      })
      .select("*")
      .single();

    if (error) {
      setActionError(`Could not block slot: ${error.message}`);
    } else if (data) {
      setBlockedSlots((prev) => [...prev, data as BlockedSlot]);
      setBlockReason("");
    }
    setBlockingSlot(false);
  }

  async function handleUnblockSlot(id: string) {
    if (!supabase) return;
    const { error } = await supabase
      .from("blocked_slots")
      .delete()
      .eq("id", id);
    if (error) {
      setActionError(`Could not remove blocked slot: ${error.message}`);
      return;
    }
    setBlockedSlots((prev) => prev.filter((b) => b.id !== id));
  }

  // Real database summary counts
  const totalCount = appointments.length;
  const pendingCount = appointments.filter(
    (a) => a.status === "Pending"
  ).length;
  const confirmedCount = appointments.filter(
    (a) => a.status === "Confirmed"
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "Completed"
  ).length;

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      !searchQuery.trim() ||
      appt.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.phone_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || appt.appointment_date === dateFilter;
    const matchesStatus =
      statusFilter === "All" || appt.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const availableSlotsForBlockDate = getSlotsForDate(blockDate);

  if (!configured) {
    return (
      <div className="min-h-screen bg-surface px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-navy/10 bg-white p-8 shadow-lg">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Clinic Website</span>
          </Link>

          <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-light text-gold">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-navy">
            Supabase Configuration Required for Admin Dashboard
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-navy/75">
            The admin dashboard connects directly to your Supabase database and
            Supabase Auth. To enable it:
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-navy/80">
            <li>
              Run <code className="rounded bg-surface px-1.5 py-0.5">supabase/schema.sql</code> in
              your Supabase SQL Editor.
            </li>
            <li>
              Create an admin user in Supabase Authentication &rarr; Users.
            </li>
            <li>
              Add <code className="rounded bg-surface px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
              <code className="rounded bg-surface px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,
              and <code className="rounded bg-surface px-1.5 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
              <code className="rounded bg-surface px-1.5 py-0.5">.env.local</code>.
            </li>
          </ol>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-sm font-semibold text-navy">
        Verifying clinic session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-navy/10 bg-white p-8 shadow-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Public Website</span>
          </Link>

          <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white">
            <Lock className="h-5 w-5 text-teal" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-navy">
            Clinic Admin Sign In
          </h1>
          <p className="mt-1 text-sm text-navy/65">
            {CLINIC_INFO.name}
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {authError && (
              <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">
                {authError}
              </div>
            )}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold text-navy"
              >
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-navy/15 bg-surface/40 px-4 py-2.5 text-sm text-navy outline-none focus:border-teal focus:bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-navy"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-navy/15 bg-surface/40 px-4 py-2.5 text-sm text-navy outline-none focus:border-teal focus:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={signingIn}
              className="w-full rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal disabled:opacity-50"
            >
              {signingIn ? "Signing In..." : "Sign In to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Admin Header */}
      <header className="border-b border-navy/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-teal">
              Clinic Administration
            </p>
            <h1 className="text-lg font-bold text-navy sm:text-xl">
              {CLINIC_INFO.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 px-3.5 py-2 text-xs font-semibold text-navy hover:bg-surface"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${dataLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
            <Link
              href="/"
              className="rounded-full border border-navy/15 px-3.5 py-2 text-xs font-semibold text-navy hover:bg-surface"
            >
              View Website
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-teal"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {actionError && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Summary Cards (Real DB Data) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy/60">
              Total Appointments
            </p>
            <p className="mt-2 text-3xl font-bold text-navy">{totalCount}</p>
          </div>
          <div className="rounded-2xl border border-gold/40 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">
              Pending Requests
            </p>
            <p className="mt-2 text-3xl font-bold text-navy">{pendingCount}</p>
          </div>
          <div className="rounded-2xl border border-teal/30 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">
              Confirmed Appointments
            </p>
            <p className="mt-2 text-3xl font-bold text-navy">
              {confirmedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy/60">
              Completed Appointments
            </p>
            <p className="mt-2 text-3xl font-bold text-navy">
              {completedCount}
            </p>
          </div>
        </div>

        {/* Appointment Requests Table & Filters */}
        <section className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-navy/10 pb-5 md:flex-row md:items-center">
            <h2 className="text-lg font-bold text-navy">
              Appointment Requests
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name or phone..."
                  className="rounded-xl border border-navy/15 bg-surface/50 py-2 pl-9 pr-3 text-sm text-navy outline-none focus:border-teal focus:bg-white"
                />
              </div>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                aria-label="Filter by date"
                className="rounded-xl border border-navy/15 bg-surface/50 px-3 py-2 text-sm text-navy outline-none focus:border-teal focus:bg-white"
              />

              {dateFilter && (
                <button
                  type="button"
                  onClick={() => setDateFilter("")}
                  className="text-xs font-semibold text-teal hover:underline"
                >
                  Clear Date
                </button>
              )}

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="rounded-xl border border-navy/15 bg-surface/50 px-3 py-2 text-sm text-navy outline-none focus:border-teal focus:bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            {filteredAppointments.length === 0 ? (
              <div className="py-12 text-center text-sm text-navy/60">
                No appointment records match your current filters.
              </div>
            ) : (
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead>
                  <tr className="border-b border-navy/10 text-xs uppercase tracking-wider text-navy/60">
                    <th className="py-3 pr-4">Patient</th>
                    <th className="py-3 pr-4">Contact</th>
                    <th className="py-3 pr-4">Schedule</th>
                    <th className="py-3 pr-4">Reason &amp; Visit</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/10">
                  {filteredAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-surface/40">
                      <td className="py-4 pr-4">
                        <p className="font-bold text-navy">
                          {appt.patient_name}
                        </p>
                        <p className="text-xs text-navy/60">
                          Age: {appt.age} yrs
                        </p>
                      </td>
                      <td className="py-4 pr-4">
                        <a
                          href={`tel:${appt.phone_number}`}
                          className="inline-flex items-center gap-1.5 font-semibold text-teal hover:underline"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>{appt.phone_number}</span>
                        </a>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-navy">
                          {appt.appointment_date}
                        </p>
                        <p className="inline-flex items-center gap-1 text-xs text-navy/70">
                          <Clock className="h-3 w-3" />
                          <span>{appt.appointment_time}</span>
                        </p>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="max-w-xs text-navy/85">
                          {appt.consultation_reason}
                        </p>
                        <span className="mt-1 inline-block rounded-md bg-surface px-2 py-0.5 text-[11px] font-semibold text-navy/70">
                          {appt.visit_type}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            appt.status === "Confirmed"
                              ? "bg-teal-light text-teal-dark"
                              : appt.status === "Pending"
                                ? "bg-gold-light text-navy"
                                : appt.status === "Completed"
                                  ? "bg-navy text-white"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-1.5">
                          {appt.status !== "Confirmed" && (
                            <button
                              type="button"
                              onClick={() => updateStatus(appt.id, "Confirmed")}
                              className="inline-flex items-center gap-1 rounded-lg bg-teal px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-dark"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Confirm</span>
                            </button>
                          )}
                          {appt.status !== "Completed" && (
                            <button
                              type="button"
                              onClick={() => updateStatus(appt.id, "Completed")}
                              className="inline-flex items-center gap-1 rounded-lg bg-navy px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-navy-light"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>Complete</span>
                            </button>
                          )}
                          {appt.status !== "Cancelled" && (
                            <button
                              type="button"
                              onClick={() => updateStatus(appt.id, "Cancelled")}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Slot Availability Management */}
        <section className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy">
            Manage Unavailable / Blocked Slots
          </h2>
          <p className="mt-1 text-sm text-navy/70">
            Block an entire date or a specific consultation time slot so
            patients cannot book it online.
          </p>

          <form
            onSubmit={handleBlockSlot}
            className="mt-5 grid gap-4 sm:grid-cols-4"
          >
            <div>
              <label className="block text-xs font-semibold text-navy">
                Date
              </label>
              <input
                type="date"
                required
                value={blockDate}
                onChange={(e) => {
                  setBlockDate(e.target.value);
                  setBlockTime("ALL_DAY");
                }}
                className="mt-1 w-full rounded-xl border border-navy/15 bg-surface/40 px-3 py-2 text-sm text-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy">
                Time Slot
              </label>
              <select
                value={blockTime}
                onChange={(e) => setBlockTime(e.target.value)}
                disabled={isWednesday(blockDate)}
                className="mt-1 w-full rounded-xl border border-navy/15 bg-surface/40 px-3 py-2 text-sm text-navy"
              >
                <option value="ALL_DAY">Entire Day</option>
                {availableSlotsForBlockDate.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy">
                Note (Optional)
              </label>
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="e.g. Out of station"
                className="mt-1 w-full rounded-xl border border-navy/15 bg-surface/40 px-3 py-2 text-sm text-navy"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={blockingSlot || isWednesday(blockDate)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                <span>Block Slot</span>
              </button>
            </div>
          </form>

          {blockedSlots.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {blockedSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-xl border border-navy/10 bg-surface px-4 py-3 text-sm"
                >
                  <div>
                    <p className="flex items-center gap-1.5 font-semibold text-navy">
                      <Calendar className="h-3.5 w-3.5 text-teal" />
                      <span>{slot.slot_date}</span>
                    </p>
                    <p className="text-xs text-navy/70">
                      {slot.slot_time ? slot.slot_time : "Full Day Blocked"}
                      {slot.reason ? ` · ${slot.reason}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnblockSlot(slot.id)}
                    aria-label="Unblock slot"
                    className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

