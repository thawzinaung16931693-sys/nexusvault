import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findAllCategories,
  findCategoryBySlug,
  findCategoryById,
} from "./queries/categories";

export const categoryRouter = createRouter({
  list: publicQuery.query(() => findAllCategories()),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => findCategoryBySlug(input.slug)),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findCategoryById(input.id)),
});
