import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

const app = new Hono();

app.use(logger());
app.use(cors({ origin: "*", credentials: true }));

// tRPC
app.use("/api/trpc/*", async (c) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req: c.req.raw,
    createContext,
  });
  return response;
});

// Static files (serves built frontend in production)
app.use("/*", serveStatic({ root: "./dist" }));

const port = parseInt(process.env.PORT || "3001", 10);
console.log(`Server running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
