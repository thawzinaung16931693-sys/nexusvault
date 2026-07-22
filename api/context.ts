import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: {
    id: number;
    name: string | null;
    email: string | null;
    role: string;
  };
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  // Authentication is now handled client-side via Neon Auth
  // Backend routes that need auth use the authedQuery middleware
  // For admin routes, we'll validate via session cookies if needed
  return ctx;
}
