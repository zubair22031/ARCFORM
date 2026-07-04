import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get("all") === "true";
  const session = await getSession();

  let rows;
  if (showAll && session) {
    rows = await db.select().from(services).orderBy(asc(services.sortOrder));
  } else {
    rows = await db
      .select()
      .from(services)
      .where(eq(services.published, true))
      .orderBy(asc(services.sortOrder));
  }

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = await db
    .insert(services)
    .values({
      title: body.title,
      description: body.description || "",
      icon: body.icon || "building",
      sortOrder: body.sortOrder ?? 0,
      published: body.published ?? true,
    })
    .returning();

  return NextResponse.json(result[0], { status: 201 });
}
