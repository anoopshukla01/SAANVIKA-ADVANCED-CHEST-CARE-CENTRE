import { NextRequest, NextResponse } from "next/server";
import { CLINIC_INFO } from "@/lib/clinic-config";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();

    if (name.length < 2 || phone.replace(/\D/g, "").length < 10 || message.length < 5) {
      return NextResponse.json(
        { error: "Please provide your name, a valid phone number, and your message." },
        { status: 400 }
      );
    }

    const whatsappUrl = `https://wa.me/${CLINIC_INFO.whatsappNumber}?text=${encodeURIComponent(
      `Hello ${CLINIC_INFO.name},\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`
    )}`;

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        mode: "fallback",
        whatsappUrl,
      });
    }

    const { error } = await supabase.from("contact_inquiries").insert({
      name,
      phone,
      message,
    });

    if (error) {
      console.error("Contact insert error:", error);
      return NextResponse.json({
        success: true,
        mode: "fallback",
        whatsappUrl,
      });
    }

    return NextResponse.json({
      success: true,
      mode: "supabase",
      whatsappUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process your inquiry." },
      { status: 400 }
    );
  }
}

