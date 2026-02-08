import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabase
    .from("employees")
    .select(
      "id, employee_code, full_name, email, department, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req) {
  try {
    const {
      employee_code,
      full_name,
      email,
      department,
    } = await req.json();

    // Server-side validation
    if (!employee_code || !full_name || !email || !department) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("employees")
      .insert([
        {
          employee_code,
          full_name,
          email,
          department,
        },
      ]);

    if (error) {
      let message = "Failed to add employee";

      if (error.code === "23505") {
        if (
          error.message.includes(
            "employees_employee_code_key"
          )
        ) {
          message = "Employee code already exists";
        } else if (
          error.message.includes("employees_email_key")
        ) {
          message = "Email already exists";
        }
      }

      return NextResponse.json(
        { error: message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
