import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(contactSubmissions)
    .orderBy(asc(contactSubmissions.createdAt));

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json(
      { error: "Name, email, and message are required" },
      { status: 400 }
    );
  }

  await db.insert(contactSubmissions).values({
    name: body.name,
    email: body.email,
    phone: body.phone || null,
    subject: body.subject || null,
    message: body.message,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
