import { db } from "@db";
import { users, categories, products, orders, orderItems } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import * as bcrypt from "bcrypt";

export const storage = {
  // User functions
  async createUser(username: string, password: string, isAdmin: boolean = false) {
    // In production, password would be hashed
    // const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({
      username,
      password,
      isAdmin,
    }).returning();
    return user;
  },

  async getUserByUsername(username: string) {
    return await db.query.users.findFirst({
      where: eq(users.username, username),
    });
  },

  async getUserById(id: number) {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  },

  // Category functions
  async createCategory(name: string, emoji: string, description?: string) {
    const [category] = await db.insert(categories).values({
      name,
      emoji,
      description,
    }).returning();
    return category;
  },

  async getAllCategories() {
    return await db.query.categories.findMany({
      where: eq(categories.isActive, true),
    });
  },

  // Product functions
  async createProduct(
    name: string,
    description: string,
    price: number,
    imageUrl: string,
    categoryId: number,
    stock: number = 0,
    tag?: string
  ) {
    const [product] = await db.insert(products).values({
      name,
      description,
      price,
      imageUrl,
      categoryId,
      stock,
      tag,
    }).returning();
    return product;
  },

  async getProductsByCategory(categoryId: number) {
    return await db.query.products.findMany({
      where: and(
        eq(products.categoryId, categoryId),
        eq(products.isActive, true)
      ),
      with: {
        category: true,
      },
    });
  },

  async getAllProducts() {
    return await db.query.products.findMany({
      where: eq(products.isActive, true),
      with: {
        category: true,
      },
    });
  },

  async updateProductStock(productId: number, quantity: number) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const [updatedProduct] = await db
      .update(products)
      .set({ stock: product.stock + quantity })
      .where(eq(products.id, productId))
      .returning();
    
    return updatedProduct;
  },

  // Order functions
  async createOrder(
    userId: number | null,
    name: string,
    phone: string,
    address: string,
    paymentMethod: string,
    subtotal: number,
    deliveryFee: number,
    total: number,
    instructions?: string
  ) {
    const [order] = await db.insert(orders).values({
      userId,
      name,
      phone,
      address,
      instructions,
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
      status: "pending",
    }).returning();
    return order;
  },

  async addOrderItem(
    orderId: number,
    productId: number,
    quantity: number,
    price: number
  ) {
    const subtotal = quantity * price;
    const [orderItem] = await db.insert(orderItems).values({
      orderId,
      productId,
      quantity,
      price,
      subtotal,
    }).returning();
    return orderItem;
  },

  async getOrderWithItems(orderId: number) {
    return await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });
  },

  async getUserOrders(userId: number) {
    return await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });
  },

  async updateOrderStatus(orderId: number, status: string) {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning();
    
    return updatedOrder;
  },
};
