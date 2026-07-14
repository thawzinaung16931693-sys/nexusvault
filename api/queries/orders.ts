import { getDb } from "./connection";
import { orders, orderItems } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function createOrder(data: {
  userId?: number;
  orderNumber: string;
  totalAmount: string;
  itemCount: number;
  customerEmail?: string;
  customerName?: string;
}) {
  const db = getDb();
  const result = await db.insert(orders).values(data).returning();
  return result[0];
}

export async function addOrderItem(data: {
  orderId: number;
  productId: number;
  productName: string;
  price: string;
  quantity: number;
}) {
  const db = getDb();
  await db.insert(orderItems).values(data);
}

export async function getOrdersByUser(userId: number) {
  const db = getDb();
  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  return Promise.all(
    userOrders.map(async (order) => {
      const items = await db
        .select({
          id: orderItems.id,
          productId: orderItems.productId,
          productName: orderItems.productName,
          price: orderItems.price,
          quantity: orderItems.quantity,
        })
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
      return { ...order, items };
    })
  );
}

export async function getOrderById(orderId: number) {
  const db = getDb();
  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  if (!order[0]) return null;

  const items = await db
    .select({
      id: orderItems.id,
      productId: orderItems.productId,
      productName: orderItems.productName,
      price: orderItems.price,
      quantity: orderItems.quantity,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return { ...order[0], items };
}

export async function getAllOrders() {
  const db = getDb();
  const allOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));

  return Promise.all(
    allOrders.map(async (order) => {
      const items = await db
        .select({
          id: orderItems.id,
          productId: orderItems.productId,
          productName: orderItems.productName,
          price: orderItems.price,
          quantity: orderItems.quantity,
        })
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
      return { ...order, items };
    })
  );
}

export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "completed" | "cancelled" | "refunded"
) {
  const db = getDb();
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
}

export async function getOrderStats() {
  const db = getDb();
  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders);
  const pending = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.status, "pending"));
  const completed = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.status, "completed"));
  const revenue = await db
    .select({ total: sql<string>`COALESCE(SUM(totalAmount), 0)` })
    .from(orders)
    .where(eq(orders.status, "completed"));

  return {
    total: total[0]?.count ?? 0,
    pending: pending[0]?.count ?? 0,
    completed: completed[0]?.count ?? 0,
    revenue: revenue[0]?.total ?? "0",
  };
}
