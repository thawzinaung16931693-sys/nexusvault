import { SignJWT, jwtVerify } from "jose";
import { env } from "../lib/env";

const SECRET = new TextEncoder().encode(env.appSecret);

export async function signSession(payload: { userId: number }) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    return payload as unknown as { userId: number };
  } catch {
    return null;
  }
}
