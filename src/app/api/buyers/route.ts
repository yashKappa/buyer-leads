import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Here you’d save buyer to DB (for now just log it)
    console.log("New buyer received:", body);

    return NextResponse.json({ message: "Buyer created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
