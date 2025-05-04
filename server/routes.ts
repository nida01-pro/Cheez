import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import * as bcrypt from "bcrypt";
import session from "express-session";
import { db } from "@db";
import { and, eq, desc, ne, gt } from "drizzle-orm";
import { 
  users, 
  categories, 
  products, 
  orders, 
  orderItems, 
  insertUserSchema, 
  insertCategorySchema, 
  insertProductSchema, 
  insertOrderSchema, 
  insertOrderItemSchema 
} from "@shared/schema";
import PgSimpleStore from "connect-pg-simple";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Implement session store
const PostgresStore = PgSimpleStore(session);

// Type definitions for session
declare module "express-session" {
  interface SessionData {
    userId: number;
    isAdmin: boolean;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(
    session({
      store: new PostgresStore({
        conString: process.env.DATABASE_URL,
        tableName: "session",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "cheez-app-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  // Configure passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await db.query.users.findFirst({
          where: eq(users.username, username),
        });

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        // For demo purposes, simple password check (normally would use bcrypt)
        if (password !== user.password) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message || "Authentication failed" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.session.userId = user.id;
        req.session.isAdmin = user.isAdmin;
        return res.status(200).json({
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to destroy session" });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logged out successfully" });
      });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = req.user as any;
    return res.status(200).json({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await db.query.categories.findMany({
        where: eq(categories.isActive, true),
      });
      res.json(allCategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      let query = db.query.products;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      let result;
      if (categoryId) {
        result = await query.findMany({
          where: and(
            eq(products.isActive, true),
            eq(products.categoryId, categoryId)
          ),
          with: {
            category: true,
          },
        });
      } else {
        result = await query.findMany({
          where: eq(products.isActive, true),
          with: {
            category: true,
          },
        });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/inventory", async (req, res) => {
    try {
      // Check if user is admin
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const result = await db.query.products.findMany({
        orderBy: desc(products.name),
      });
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.patch("/api/products/:id/inventory", async (req, res) => {
    try {
      // Check if user is admin
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      // Validate quantity
      if (!quantity || typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      // Get current product
      const product = await db.query.products.findFirst({
        where: eq(products.id, id),
      });
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Update stock
      const updatedProduct = await db
        .update(products)
        .set({ 
          stock: product.stock + quantity 
        })
        .where(eq(products.id, id))
        .returning();
      
      res.json(updatedProduct[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inventory" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { name, phone, address, instructions, paymentMethod, items, subtotal, deliveryFee, total } = req.body;
      
      // Create order
      const orderData = {
        userId: req.session.userId,
        name,
        phone,
        address,
        instructions,
        paymentMethod,
        subtotal,
        deliveryFee,
        total,
        status: "pending"
      };
      
      const [newOrder] = await db.insert(orders).values(orderData).returning();
      
      // Create order items
      const orderItemsData = items.map((item: any) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }));
      
      await db.insert(orderItems).values(orderItemsData);
      
      // Update product stock
      for (const item of items) {
        const product = await db.query.products.findFirst({
          where: eq(products.id, item.productId),
        });
        
        if (product) {
          await db
            .update(products)
            .set({ 
              stock: Math.max(0, product.stock - item.quantity) 
            })
            .where(eq(products.id, item.productId));
        }
      }
      
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      // Check if user is logged in
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userOrders = await db.query.orders.findMany({
        where: eq(orders.userId, req.session.userId),
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
        orderBy: desc(orders.createdAt),
      });
      
      res.json(userOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/admin", async (req, res) => {
    try {
      // Check if user is admin
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const allOrders = await db.query.orders.findMany({
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
        orderBy: desc(orders.createdAt),
      });
      
      res.json(allOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      // Check if user is admin
      if (!req.session.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      // Validate status
      const validStatuses = ["pending", "packing", "out_for_delivery", "delivered", "cancelled"];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedOrder = await db
        .update(orders)
        .set({ status })
        .where(eq(orders.id, id))
        .returning();
      
      if (updatedOrder.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
