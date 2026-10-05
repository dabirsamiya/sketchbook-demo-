import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || !("email" in body) || typeof body.email !== "string") {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    await db.insert(newsletterSubscribers).values({ email }).onConflictDoNothing();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Could not save newsletter subscription", error);
    return NextResponse.json({ error: "We couldn't subscribe you just now. Please try again." }, { status: 500 });
  }
}
