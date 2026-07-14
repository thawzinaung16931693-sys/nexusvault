import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findAllProducts,
  findProductBySlug,
  findProductById,
  getProductStats,
} from "./queries/products";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          categorySlug: z.string().optional(),
          search: z.string().optional(),
          featured: z.boolean().optional(),
          sort: z.string().optional(),
        })
        .optional()
    )
    .query(({ input }) => findAllProducts(input ?? {})),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => findProductBySlug(input.slug)),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findProductById(input.id)),

  stats: publicQuery.query(() => getProductStats()),
});
