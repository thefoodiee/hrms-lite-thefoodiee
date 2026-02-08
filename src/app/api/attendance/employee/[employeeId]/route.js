import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase-server";

export async function GET(_req, { params }) {
  const { employeeId } = await params;

  if (!employeeId) {
    return NextResponse.json(
      { error: "Employee ID is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("attendance")
    .select("attendance_date, status")
    .eq("employee_id", employeeId)
    .order("attendance_date", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
