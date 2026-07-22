import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { desc, sql, eq } from "drizzle-orm";
import {
  findAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} from "./queries/products";
import { getAllOrders, updateOrderStatus, getOrderStats } from "./queries/orders";

export const adminRouter = createRouter({
  // ─── Dashboard Stats ───
  dashboard: publicQuery.query(async () => {
    const db = getDb();
    const userCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const productStats = await getProductStats();
    const orderStats = await getOrderStats();

    return {
      users: userCount[0]?.count ?? 0,
      products: productStats,
      orders: orderStats,
    };
  }),

  // ─── Users ───
  users: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        role: users.role,
        createdAt: users.createdAt,
        lastSignInAt: users.lastSignInAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));
  }),

  updateUserRole: publicQuery
    .input(z.object({ id: z.number(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.id));
      return { success: true };
    }),

  // ─── Products ───
  products: publicQuery.query(() =>
    findAllProducts({ sort: "newest" })
  ),

  createProduct: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        price: z.string().min(1),
        originalPrice: z.string().optional(),
        image: z.string().optional(),
        categoryId: z.number().min(1),
        type: z.enum(["subscription", "one_time"]),
        billingPeriod: z.enum(["monthly", "yearly", "lifetime"]).optional(),
        features: z.string().optional(),
      })
    )
    .mutation(({ input }) => createProduct(input)),

  updateProduct: publicQuery
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          name: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          description: z.string().optional(),
          shortDescription: z.string().optional(),
          price: z.string().min(1).optional(),
          originalPrice: z.string().optional(),
          image: z.string().optional(),
          categoryId: z.number().optional(),
          type: z.enum(["subscription", "one_time"]).optional(),
          billingPeriod: z.enum(["monthly", "yearly", "lifetime"]).optional(),
          features: z.string().optional(),
          isActive: z.enum(["yes", "no"]).optional(),
          isFeatured: z.enum(["yes", "no"]).optional(),
        }),
      })
    )
    .mutation(({ input }) => updateProduct(input.id, input.data)),

  deleteProduct: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteProduct(input.id)),

  // ─── Orders ───
  orders: publicQuery.query(() => getAllOrders()),

  updateOrderStatus: publicQuery
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["pending", "completed", "cancelled", "refunded"]),
      })
    )
    .mutation(({ input }) => updateOrderStatus(input.orderId, input.status)),
});
