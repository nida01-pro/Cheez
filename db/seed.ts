import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("Starting seed process...");

    // Seed users
    const existingAdmin = await db.query.users.findFirst({
      where: eq(schema.users.username, "admin"),
    });

    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.username, "user"),
    });

    if (!existingAdmin) {
      await db.insert(schema.users).values({
        username: "admin",
        password: "admin123",
        isAdmin: true,
      });
      console.log("Admin user created");
    }

    if (!existingUser) {
      await db.insert(schema.users).values({
        username: "user",
        password: "password",
        isAdmin: false,
      });
      console.log("Regular user created");
    }

    // Seed categories
    const categories = [
      { name: "After-School Snacks", emoji: "🎒", description: "Perfect for hungry kids after a long day of learning!" },
      { name: "Weekend Specials", emoji: "🎉", description: "Special treats for weekend fun and family time!" },
      { name: "Healthy Munchies", emoji: "🍎", description: "Nutritious and delicious options for health-conscious parents!" },
      { name: "Homemade Treats", emoji: "🧁", description: "Freshly made treats that taste like they're from mom's kitchen!" },
      { name: "Drinks & Juices", emoji: "🥤", description: "Refreshing beverages to quench your child's thirst!" },
    ];

    for (const category of categories) {
      const existingCategory = await db.query.categories.findFirst({
        where: eq(schema.categories.name, category.name),
      });

      if (!existingCategory) {
        await db.insert(schema.categories).values(category);
        console.log(`Category created: ${category.name}`);
      }
    }

    // Get category IDs for reference
    const categoryMap = new Map();
    const allCategories = await db.query.categories.findMany();
    allCategories.forEach(category => {
      categoryMap.set(category.name, category.id);
    });

    // Seed products
    const products = [
      {
        name: "Masala Crunch Chips 🌶️",
        description: "Tangy, spicy, aur ekdum crunchy!",
        price: 45,
        imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bd87e?auto=format&fit=crop&w=400&h=300",
        stock: 50,
        tag: "Kid's Favorite",
        categoryId: categoryMap.get("After-School Snacks"),
      },
      {
        name: "Chocolatey Biscuit Sticks 🍫",
        description: "Chocolate coated yummy sticks!",
        price: 75,
        imageUrl: "https://images.unsplash.com/photo-1531171673193-49affa0882e8?auto=format&fit=crop&w=400&h=300",
        stock: 40,
        tag: "New",
        categoryId: categoryMap.get("After-School Snacks"),
      },
      {
        name: "Sweet Tooth Pack 🍭",
        description: "Mix of sweet candies & chocolates!",
        price: 120,
        imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=400&h=300",
        stock: 30,
        tag: "Bestseller",
        categoryId: categoryMap.get("Weekend Specials"),
      },
      {
        name: "Fruit Munch Mix 🍓",
        description: "Dried fruits aur nuts ka tasty mix!",
        price: 95,
        imageUrl: "https://images.unsplash.com/photo-1599490659652-9ae92426f537?auto=format&fit=crop&w=400&h=300",
        stock: 25,
        tag: "Healthy",
        categoryId: categoryMap.get("Healthy Munchies"),
      },
      {
        name: "Homemade Muffins 🧁",
        description: "Freshly baked every morning!",
        price: 60,
        imageUrl: "https://images.unsplash.com/photo-1614735241165-6756e1df61ab?auto=format&fit=crop&w=400&h=300",
        stock: 20,
        tag: "New",
        categoryId: categoryMap.get("Homemade Treats"),
      },
      {
        name: "Fruit Jelly Cups 🍊",
        description: "Colorful jelly with real fruits!",
        price: 40,
        imageUrl: "https://images.unsplash.com/photo-1525059337994-6f2a1311b4d4?auto=format&fit=crop&w=400&h=300",
        stock: 35,
        tag: "",
        categoryId: categoryMap.get("Healthy Munchies"),
      },
      {
        name: "Crunchy Popcorn Mix 🍿",
        description: "Sweet and savory popcorn mix for movie nights!",
        price: 65,
        imageUrl: "https://images.unsplash.com/photo-1578849278602-b88d0052e5b3?auto=format&fit=crop&w=400&h=300",
        stock: 45,
        tag: "Weekend Special",
        categoryId: categoryMap.get("Weekend Specials"),
      },
      {
        name: "Fresh Fruit Juice 🍹",
        description: "100% natural, no preservatives added!",
        price: 85,
        imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&h=300",
        stock: 30,
        tag: "Healthy",
        categoryId: categoryMap.get("Drinks & Juices"),
      },
    ];

    for (const product of products) {
      const existingProduct = await db.query.products.findFirst({
        where: eq(schema.products.name, product.name),
      });

      if (!existingProduct) {
        await db.insert(schema.products).values(product);
        console.log(`Product created: ${product.name}`);
      }
    }

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error during seed process:", error);
  }
}

seed();
