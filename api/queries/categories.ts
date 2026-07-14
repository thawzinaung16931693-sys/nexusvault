import { getDb } from "./connection";
import { categories } from "@db/schema";
import { eq } from "drizzle-orm";

export async function findAllCategories() {
  return getDb().select().from(categories).orderBy(categories.name);
}

export async function findCategoryBySlug(slug: string) {
  const rows = await getDb()
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function findCategoryById(id: number) {
  return getDb().query.categories.findFirst({
    where: eq(categories.id, id),
  });
}
