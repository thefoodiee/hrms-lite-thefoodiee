import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase-server";

export async function DELETE(_req, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Employee ID is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", id);

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

export async function GET(_req, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Employee ID is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("employees")
    .select("full_name")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Employee not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
