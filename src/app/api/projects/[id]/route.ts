import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import slugify from "slugify";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const slug = body.title
    ? slugify(body.title, { lower: true, strict: true })
    : undefined;

  const updateData: Record<string, unknown> = {
    ...body,
    updatedAt: new Date(),
  };
  if (slug) updateData.slug = slug;

  await db
    .update(projects)
    .set(updateData)
    .where(eq(projects.id, parseInt(id)));

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await db.delete(projects).where(eq(projects.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
