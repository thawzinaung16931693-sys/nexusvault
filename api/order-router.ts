import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import {
  createOrder,
  addOrderItem,
  getOrdersByUser,
  getOrderById,
  getAllOrders,
  getOrderStats,
} from "./queries/orders";

export const orderRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        cartId: z.number(),
        items: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            price: z.string(),
            quantity: z.number(),
          })
        ),
        totalAmount: z.string(),
        customerEmail: z.string().optional(),
        customerName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const orderNumber = `NV-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const order = await createOrder({
        userId: ctx.user?.id,
        orderNumber,
        totalAmount: input.totalAmount,
        itemCount: input.items.length,
        customerEmail: input.customerEmail,
        customerName: input.customerName,
      });

      await Promise.all(
        input.items.map((item) =>
          addOrderItem({
            orderId: order.id,
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
          })
        )
      );

      return order;
    }),

  myOrders: authedQuery.query(({ ctx }) => getOrdersByUser(ctx.user.id)),

  byId: authedQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getOrderById(input.id)),

  list: authedQuery.query(() => getAllOrders()),

  stats: authedQuery.query(() => getOrderStats()),
});
