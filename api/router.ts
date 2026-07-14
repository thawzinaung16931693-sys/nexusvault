import { authRouter } from "./auth-router";
import { productRouter } from "./product-router";
import { categoryRouter } from "./category-router";
import { cartRouter } from "./cart-router";
import { orderRouter } from "./order-router";
import { adminRouter } from "./admin-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  category: categoryRouter,
  cart: cartRouter,
  order: orderRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
