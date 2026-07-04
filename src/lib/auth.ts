import { cookies } from "next/headers";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "arcform_session";

// Simple token-based auth (token = base64 of id:email)
export async function createSession(userId: number, email: string) {
  const token = Buffer.from(`${userId}:${email}:${Date.now()}`).toString(
    "base64"
  );
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [idStr, email] = decoded.split(":");
    const id = parseInt(idStr, 10);
    if (!id || !email) return null;

    const user = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1);

    if (user.length === 0 || user[0].email !== email) return null;
    return { id: user[0].id, email: user[0].email, name: user[0].name };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function verifyCredentials(email: string, password: string) {
  const user = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  if (user.length === 0) return null;

  const valid = await bcrypt.compare(password, user[0].passwordHash);
  if (!valid) return null;

  return { id: user[0].id, email: user[0].email, name: user[0].name };
}
