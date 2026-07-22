import { createRouter, publicQuery } from "./middleware";

export const authRouter = createRouter({
  me: publicQuery.query(({ ctx }) => ctx.user ?? null),
});
