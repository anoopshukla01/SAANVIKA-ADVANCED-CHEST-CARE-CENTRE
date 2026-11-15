import { NextRequest, NextResponse } from "next/server";
import { getSlotsForDate, isWednesday } from "@/lib/clinic-config";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Please provide a valid date in YYYY-MM-DD format." },
      { status: 400 }
    );
  }

  const closedWednesday = isWednesday(date);
  const allSlots = getSlotsForDate(date);

  if (closedWednesday) {
    return NextResponse.json({
      configured: isSupabaseConfigured(),
      date,
      isClosed: true,
      fullDayBlocked: false,
      slots: [],
      unavailableSlots: [],
    });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({
      configured: false,
      date,
      isClosed: false,
      fullDayBlocked: false,
      slots: allSlots,
      unavailableSlots: [],
    });
  }

  try {
    const [bookedRes, blockedRes] = await Promise.all([
      supabase.rpc("get_booked_slots", { target_date: date }),
      supabase
        .from("blocked_slots")
        .select("slot_time")
        .eq("slot_date", date),
    ]);

    const bookedTimes: string[] = Array.isArray(bookedRes.data)
      ? bookedRes.data.map((row: { appointment_time: string }) => row.appointment_time)
      : [];

    const blockedRows: Array<{ slot_time: string | null }> = Array.isArray(blockedRes.data)
      ? blockedRes.data
      : [];

    const fullDayBlocked = blockedRows.some((row) => row.slot_time === null);
    const blockedTimes = blockedRows
      .filter((row): row is { slot_time: string } => row.slot_time !== null)
      .map((row) => row.slot_time);

    const unavailableSlots = Array.from(new Set([...bookedTimes, ...blockedTimes]));

    return NextResponse.json({
      configured: true,
      date,
      isClosed: false,
      fullDayBlocked,
      slots: fullDayBlocked ? [] : allSlots,
      unavailableSlots,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      {
        configured: true,
        date,
        isClosed: false,
        fullDayBlocked: false,
        slots: allSlots,
        unavailableSlots: [],
      },
      { status: 200 }
    );
  }
}

