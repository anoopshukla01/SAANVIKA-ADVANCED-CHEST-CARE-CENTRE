import { NextRequest, NextResponse } from "next/server";
import {
  buildWhatsAppBookingUrl,
  getSlotsForDate,
  isWednesday,
} from "@/lib/clinic-config";
import { getSupabaseServerClient } from "@/lib/supabase";
import { VisitType } from "@/types/appointment";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const patientName = String(body.patient_name || "").trim();
    const phoneNumber = String(body.phone_number || "").trim();
    const age = Number(body.age);
    const appointmentDate = String(body.appointment_date || "").trim();
    const appointmentTime = String(body.appointment_time || "").trim();
    const consultationReason = String(body.consultation_reason || "").trim();
    const visitType = String(body.visit_type || "").trim() as VisitType;

    // Input validation
    if (patientName.length < 2) {
      return NextResponse.json(
        { error: "Please enter the patient's full name." },
        { status: 400 }
      );
    }

    const digitsOnly = phoneNumber.replace(/\D/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(age) || age < 0 || age > 120) {
      return NextResponse.json(
        { error: "Please enter a valid age between 0 and 120." },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) {
      return NextResponse.json(
        { error: "Please select a valid appointment date." },
        { status: 400 }
      );
    }

    // Prevent past dates (using local clinic date comparison)
    const todayStr = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    if (appointmentDate < todayStr) {
      return NextResponse.json(
        { error: "Please select today or a future date." },
        { status: 400 }
      );
    }

    if (isWednesday(appointmentDate)) {
      return NextResponse.json(
        { error: "The clinic is closed on Wednesdays. Please choose another day." },
        { status: 400 }
      );
    }

    const validSlots = getSlotsForDate(appointmentDate);
    if (!validSlots.includes(appointmentTime)) {
      return NextResponse.json(
        { error: "Selected time slot is outside consultation hours for that day." },
        { status: 400 }
      );
    }

    if (consultationReason.length < 2) {
      return NextResponse.json(
        { error: "Please specify the reason for consultation." },
        { status: 400 }
      );
    }

    if (visitType !== "First Visit" && visitType !== "Follow-up") {
      return NextResponse.json(
        { error: "Please select First Visit or Follow-up." },
        { status: 400 }
      );
    }

    const whatsappUrl = buildWhatsAppBookingUrl({
      patientName,
      phone: phoneNumber,
      age,
      date: appointmentDate,
      time: appointmentTime,
      reason: consultationReason,
      visitType,
    });

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        {
          success: true,
          mode: "fallback",
          status: "Pending",
          whatsappUrl,
          message:
            "Online database is not yet connected. Please complete your appointment request via WhatsApp or phone call.",
        },
        { status: 200 }
      );
    }

    // Check if the date or slot is blocked by admin
    const { data: blockedRows } = await supabase
      .from("blocked_slots")
      .select("slot_time")
      .eq("slot_date", appointmentDate);

    if (
      Array.isArray(blockedRows) &&
      blockedRows.some(
        (b) => b.slot_time === null || b.slot_time === appointmentTime
      )
    ) {
      return NextResponse.json(
        {
          error:
            "This time slot is currently unavailable. Please choose another available slot.",
        },
        { status: 409 }
      );
    }

    // Check if slot is already booked (Pending or Confirmed)
    const { data: bookedRows } = await supabase.rpc("get_booked_slots", {
      target_date: appointmentDate,
    });

    if (
      Array.isArray(bookedRows) &&
      bookedRows.some(
        (b: { appointment_time: string }) =>
          b.appointment_time === appointmentTime
      )
    ) {
      return NextResponse.json(
        {
          error:
            "This time slot has already been requested. Please select another available time.",
        },
        { status: 409 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from("appointments")
      .insert({
        patient_name: patientName,
        phone_number: phoneNumber,
        age,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        consultation_reason: consultationReason,
        visit_type: visitType,
        status: "Pending",
      })
      .select("id, status, created_at")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "This time slot was just reserved by another patient. Please pick a different time.",
          },
          { status: 409 }
        );
      }
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Unable to submit appointment request right now. Please try WhatsApp or call us." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        mode: "supabase",
        referenceId: inserted.id,
        status: inserted.status, // Always 'Pending'
        whatsappUrl,
        message:
          "Your appointment request has been received and is pending confirmation by the clinic.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointment API error:", error);
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}

