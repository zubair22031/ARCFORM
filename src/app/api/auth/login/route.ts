import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await verifyCredentials(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    await createSession(user.id, user.email);
    return NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
