import { getDb } from "./connection";
import { carts, cartItems, products } from "@db/schema";
import { eq, and } from "drizzle-orm";

export async function findOrCreateCart(userId?: number, sessionId?: string) {
  const db = getDb();

  let existing;
  if (userId) {
    const rows = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);
    existing = rows[0];
  } else if (sessionId) {
    const rows = await db
      .select()
      .from(carts)
      .where(eq(carts.sessionId, sessionId))
      .limit(1);
    existing = rows[0];
  }

  if (existing) return existing;

  const result = await db
    .insert(carts)
    .values({ userId: userId ?? null, sessionId: sessionId ?? null })
    .returning();

  return result[0];
}

export async function getCartWithItems(cartId: number) {
  const db = getDb();
  const cart = await db.select().from(carts).where(eq(carts.id, cartId)).limit(1);
  if (!cart[0]) return null;

  const items = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      productName: products.name,
      productSlug: products.slug,
      productPrice: products.price,
      productImage: products.image,
      productType: products.type,
      productBillingPeriod: products.billingPeriod,
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cartId));

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.productPrice ?? "0");
    return sum + price * item.quantity;
  }, 0);

  return { ...cart[0], items, total };
}

export async function addItemToCart(
  cartId: number,
  productId: number,
  quantity: number = 1
) {
  const db = getDb();

  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))
    .limit(1);

  if (existing[0]) {
    await db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItems.id, existing[0].id));
    return existing[0].id;
  }

  const result = await db
    .insert(cartItems)
    .values({ cartId, productId, quantity })
    .returning();

  return result[0].id;
}

export async function removeItemFromCart(cartId: number, itemId: number) {
  const db = getDb();
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.id, itemId)));
}

export async function updateCartItemQuantity(itemId: number, quantity: number) {
  const db = getDb();
  await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
}

export async function clearCart(cartId: number) {
  const db = getDb();
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}
