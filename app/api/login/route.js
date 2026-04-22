import { NextResponse } from "next/server";
import { createSession, isPasswordValid } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    if (!isPasswordValid(body.password)) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }
    await createSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
