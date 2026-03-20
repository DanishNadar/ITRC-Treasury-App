import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "itrc_treasury_session";

function getExpectedSessionValue() {
  const password = process.env.ADMIN_PASSWORD || "";
  return createHash("sha256").update(password).digest("hex");
}

export function isPasswordValid(password) {
  const expected = Buffer.from(process.env.ADMIN_PASSWORD || "");
  const provided = Buffer.from(password || "");
  if (expected.length === 0 || provided.length !== expected.length) return false;
  return timingSafeEqual(expected, provided);
}

export function getSessionToken() {
  return getExpectedSessionValue();
}

export async function createSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, getSessionToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionValue) return false;
  const expected = Buffer.from(getSessionToken());
  const provided = Buffer.from(sessionValue);
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}
