import { eq } from "drizzle-orm";
import { users } from "@db/schema";
import { getDb } from "../queries/connection";
import { signSession, verifySession } from "./session";
import { getSessionCookieOptions } from "../lib/cookies";
import { env } from "../lib/env";
import * as cookie from "cookie";
import { Session } from "@contracts/constants";

export async function handleOAuthCallback(c: any) {
  const code = c.req.query("code");
  if (!code) return c.text("Missing code", 400);

  // Exchange code for token
  const tokenRes = await fetch(`${env.kimiAuthUrl}/api/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.appId,
      client_secret: env.appSecret,
      code,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = (await tokenRes.json()) as { access_token?: string };
  if (!tokenData.access_token) return c.text("Auth failed", 401);

  // Get user info
  const userRes = await fetch(`${env.kimiOpenUrl}/api/user`, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = (await userRes.json()) as {
    union_id: string;
    name: string;
    email: string;
    avatar: string;
  };

  // Upsert user
  const db = getDb();
  await db
    .insert(users)
    .values({
      unionId: userData.union_id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
    })
    .onConflictDoUpdate({
      target: users.unionId,
      set: {
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        lastSignInAt: new Date(),
      },
    });

  // Get user from DB
  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.unionId, userData.union_id))
    .limit(1);

  const user = dbUser[0];

  // Sign JWT session
  const token = await signSession({ userId: user.id });

  const opts = getSessionCookieOptions(c.req.raw.headers);
  const serialized = cookie.serialize(Session.cookieName, token, {
    httpOnly: opts.httpOnly,
    path: opts.path,
    sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
    secure: opts.secure,
    maxAge: Session.maxAgeMs / 1000,
  });

  return c.redirect("/", 302, { "Set-Cookie": serialized });
}

export async function authenticateRequest(headers: Headers) {
  const cookieHeader = headers.get("cookie");
  if (!cookieHeader) return undefined;

  const cookies = cookie.parse(cookieHeader);
  const sessionToken = cookies[Session.cookieName];
  if (!sessionToken) return undefined;

  const session = await verifySession(sessionToken);
  if (!session) return undefined;

  const db = getDb();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  return rows[0] ?? undefined;
}
