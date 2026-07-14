export function getSessionCookieOptions(headers: Headers) {
  const isSecure = headers.get("x-forwarded-proto") === "https";
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: isSecure,
  };
}
