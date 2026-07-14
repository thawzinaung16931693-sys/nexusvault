import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { trpcServer } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { handleOAuthCallback } from "./kimi/auth";

const app = new Hono();

app.use(logger());
app.use(cors({ origin: "*", credentials: true }));

// OAuth callback
app.get("/api/oauth/callback", handleOAuthCallback);

// tRPC
app.use("/api/trpc/*", async (c) => {
  return trpcServer({
    router: appRouter,
    createContext,
    req: c.req.raw,
    resHeaders: c.res.headers,
  })(c);
});

// Static files
app.use("/*", serveStatic({ root: "./public" }));

export default app;
