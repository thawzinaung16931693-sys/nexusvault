import { getDb } from "./connection";
import { products, categories } from "@db/schema";
import { eq, and, like, desc, asc, sql } from "drizzle-orm";

export async function findAllProducts(options?: {
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  sort?: string;
}) {
  const db = getDb();
  const conditions = [];

  if (options?.categorySlug) {
    const cat = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, options.categorySlug))
      .limit(1);
    if (cat[0]) {
      conditions.push(eq(products.categoryId, cat[0].id));
    }
  }

  if (options?.search) {
    conditions.push(like(products.name, `%${options.search}%`));
  }

  if (options?.featured) {
    conditions.push(eq(products.isFeatured, "yes"));
  }

  conditions.push(eq(products.isActive, "yes"));

  const where = conditions.length > 1 ? and(...conditions) : conditions[0];

  const sort = options?.sort || "featured";
  const orderBy =
    sort === "price-asc"
      ? asc(products.price)
      : sort === "price-desc"
      ? desc(products.price)
      : sort === "newest"
      ? desc(products.createdAt)
      : sort === "rating"
      ? desc(products.rating)
      : [desc(products.isFeatured), desc(products.salesCount)];

  const cols = {
    id: products.id,
    name: products.name,
    slug: products.slug,
    description: products.description,
    shortDescription: products.shortDescription,
    price: products.price,
    originalPrice: products.originalPrice,
    image: products.image,
    categoryId: products.categoryId,
    type: products.type,
    billingPeriod: products.billingPeriod,
    features: products.features,
    isActive: products.isActive,
    isFeatured: products.isFeatured,
    rating: products.rating,
    reviewCount: products.reviewCount,
    salesCount: products.salesCount,
    createdAt: products.createdAt,
    updatedAt: products.updatedAt,
    categoryName: categories.name,
  };

  if (where) {
    return db
      .select(cols)
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(...(Array.isArray(orderBy) ? orderBy : [orderBy]));
  }

  return db
    .select(cols)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(...(Array.isArray(orderBy) ? orderBy : [orderBy]));
}

export async function findProductBySlug(slug: string) {
  const db = getDb();
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      shortDescription: products.shortDescription,
      price: products.price,
      originalPrice: products.originalPrice,
      image: products.image,
      categoryId: products.categoryId,
      type: products.type,
      billingPeriod: products.billingPeriod,
      features: products.features,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      rating: products.rating,
      reviewCount: products.reviewCount,
      salesCount: products.salesCount,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.isActive, "yes")))
    .limit(1);

  return rows[0] ?? null;
}

export async function findProductById(id: number) {
  const db = getDb();
  return db.query.products.findFirst({
    where: eq(products.id, id),
  });
}

export async function createProduct(data: {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: string;
  originalPrice?: string;
  image?: string;
  categoryId: number;
  type: "subscription" | "one_time";
  billingPeriod?: "monthly" | "yearly" | "lifetime";
  features?: string;
}) {
  const db = getDb();
  const result = await db.insert(products).values(data).returning();
  return result[0];
}

export async function updateProduct(
  id: number,
  data: Partial<{
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: string;
    originalPrice: string;
    image: string;
    categoryId: number;
    type: "subscription" | "one_time";
    billingPeriod: "monthly" | "yearly" | "lifetime";
    features: string;
    isActive: "yes" | "no";
    isFeatured: "yes" | "no";
  }>
) {
  const db = getDb();
  const result = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  return result[0];
}

export async function deleteProduct(id: number) {
  const db = getDb();
  await db.delete(products).where(eq(products.id, id));
}

export async function getProductStats() {
  const db = getDb();
  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(products);
  const active = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.isActive, "yes"));
  const featured = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.isFeatured, "yes"));

  return {
    total: total[0]?.count ?? 0,
    active: active[0]?.count ?? 0,
    featured: featured[0]?.count ?? 0,
  };
}
