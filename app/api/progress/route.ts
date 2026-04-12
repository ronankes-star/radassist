import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    let { data, error } = await supabaseAdmin
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      const { data: newData, error: insertError } = await supabaseAdmin
        .from("user_progress")
        .insert({ user_id: userId })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json(
          { error: "Failed to create progress record" },
          { status: 500 }
        );
      }
      data = newData;
    } else if (error) {
      return NextResponse.json(
        { error: "Failed to fetch progress" },
        { status: 500 }
      );
    }

    const { count } = await supabaseAdmin
      .from("cases")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    return NextResponse.json({ ...data, total_cases: count || 0 });
  } catch (error) {
    console.error("Progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
