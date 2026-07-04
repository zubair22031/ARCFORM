import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get("all") === "true";
  const session = await getSession();

  let rows;
  if (showAll && session) {
    rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  } else {
    rows = await db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(asc(projects.sortOrder));
  }

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const slug = slugify(body.title || "project", { lower: true, strict: true });

  const result = await db
    .insert(projects)
    .values({
      title: body.title,
      slug,
      description: body.description || "",
      category: body.category || "Architecture",
      imageUrl: body.imageUrl || "",
      client: body.client || null,
      location: body.location || null,
      year: body.year || null,
      published: body.published ?? false,
      sortOrder: body.sortOrder ?? 0,
    })
    .returning();

  return NextResponse.json(result[0], { status: 201 });
}
