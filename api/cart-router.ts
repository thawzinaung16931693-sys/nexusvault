import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findOrCreateCart,
  getCartWithItems,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  clearCart,
} from "./queries/carts";

export const cartRouter = createRouter({
  get: publicQuery
    .input(
      z
        .object({
          userId: z.number().optional(),
          sessionId: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const cart = await findOrCreateCart(input?.userId, input?.sessionId);
      return getCartWithItems(cart.id);
    }),

  addItem: publicQuery
    .input(
      z.object({
        cartId: z.number(),
        productId: z.number(),
        quantity: z.number().min(1).default(1),
      })
    )
    .mutation(async ({ input }) => {
      await addItemToCart(input.cartId, input.productId, input.quantity);
      return getCartWithItems(input.cartId);
    }),

  removeItem: publicQuery
    .input(z.object({ cartId: z.number(), itemId: z.number() }))
    .mutation(async ({ input }) => {
      await removeItemFromCart(input.cartId, input.itemId);
      return getCartWithItems(input.cartId);
    }),

  updateQuantity: publicQuery
    .input(
      z.object({
        cartId: z.number(),
        itemId: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      await updateCartItemQuantity(input.itemId, input.quantity);
      return getCartWithItems(input.cartId);
    }),

  clear: publicQuery
    .input(z.object({ cartId: z.number() }))
    .mutation(async ({ input }) => {
      await clearCart(input.cartId);
      return getCartWithItems(input.cartId);
    }),
});
