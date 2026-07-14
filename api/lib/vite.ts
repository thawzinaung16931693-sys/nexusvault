import { createServer } from "vite";

export async function createViteDevServer() {
  const server = await createServer({
    root: process.cwd(),
    server: { middlewareMode: true },
  });
  return server;
}
