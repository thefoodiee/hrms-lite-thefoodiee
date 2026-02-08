import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase-server";

// GET /api/attendance?date=YYYY-MM-DD
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Date is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("attendance")
    .select("employee_id, status")
    .eq("attendance_date", date);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}

// POST /api/attendance
export async function POST(req) {
  const { date, records } = await req.json();

  if (!date || !Array.isArray(records)) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    );
  }

  const payload = records.map((record) => ({
    employee_id: record.employee_id,
    attendance_date: date,
    status: record.status,
  }));

  const { error } = await supabase
    .from("attendance")
    .upsert(payload, {
      onConflict: "employee_id,attendance_date",
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { success: true },
    { status: 200 }
  );
}
