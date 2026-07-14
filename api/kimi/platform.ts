import { env } from "../lib/env";

export async function getUserInfo(accessToken: string) {
  const res = await fetch(`${env.kimiOpenUrl}/api/user`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
}
