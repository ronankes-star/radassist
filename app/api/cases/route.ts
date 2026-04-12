import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, image_url, modality, body_region, dicom_metadata, analysis, mode } = body;

    if (!user_id || !image_url) {
      return NextResponse.json(
        { error: "user_id and image_url are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("cases")
      .insert({
        user_id,
        image_url,
        modality: modality || "",
        body_region: body_region || "",
        dicom_metadata: dicom_metadata || null,
        analysis: analysis || null,
        mode: mode || "quick_read",
      })
      .select()
      .single();

    if (error) {
      console.error("Save case error:", error);
      return NextResponse.json({ error: "Failed to save case" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Cases POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id query param is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("cases")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Fetch cases error:", error);
      return NextResponse.json({ error: "Failed to fetch cases" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Cases GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
