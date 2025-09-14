import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // get current user from cookie
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // insert into buyers_data with owner_id
    const { error } = await supabase.from("buyers_data").insert([
      {
        owner_id: user.id,
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        city: body.city,
        property_type: body.propertyType,
        bhk: body.bhk,
        purpose: body.purpose,
        timeline: body.timeline,
        budget_min: body.budgetMin,
        budget_max: body.budgetMax,
        source: body.source,
        tags: body.tags,
        notes: body.notes,
        status: body.status,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Buyer created successfully!" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
