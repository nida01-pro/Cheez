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
      { name: "Biscuits", emoji: "🍪", description: "Har tarah ke biscuits, sweet and salty!" },
      { name: "Chips", emoji: "🥔", description: "Crispy, crunchy, masaledar chips!" },
      { name: "Chocolates", emoji: "🍫", description: "Sweet treats aur chocolatey delights!" },
      { name: "Nimko", emoji: "🌶️", description: "Traditional Pakistani nimko, mixture aur chatpatay snacks!" },
      { name: "Juices", emoji: "🥤", description: "Refreshing drinks aur juices!" },
      { name: "Choti Moti Cheez", emoji: "🧸", description: "Small treats aur fun size snacks for kids!" },
      { name: "Homemade Treats", emoji: "🧁", description: "Freshly made ghar ke banay huay treats!" },
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
        categoryId: categoryMap.get("Chips"),
      },
      {
        name: "Chocolatey Biscuit Sticks 🍫",
        description: "Chocolate coated yummy sticks!",
        price: 75,
        imageUrl: "https://images.unsplash.com/photo-1531171673193-49affa0882e8?auto=format&fit=crop&w=400&h=300",
        stock: 40,
        tag: "New",
        categoryId: categoryMap.get("Biscuits"),
      },
      {
        name: "Meethi Nimko Mix 🌶️",
        description: "Sweet and savory traditional nimko mix!",
        price: 60,
        imageUrl: "https://images.unsplash.com/photo-1612200143978-e239427393db?auto=format&fit=crop&w=400&h=300",
        stock: 40,
        tag: "Bestseller",
        categoryId: categoryMap.get("Nimko"),
      },
      {
        name: "Dairy Milk Chocolate 🍫",
        description: "Smooth, creamy chocolate bars!",
        price: 120,
        imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=400&h=300",
        stock: 30,
        tag: "Bestseller",
        categoryId: categoryMap.get("Chocolates"),
      },
      {
        name: "Peanut Chikki 🥜",
        description: "Crunchy peanut brittle with jaggery!",
        price: 50,
        imageUrl: "https://images.unsplash.com/photo-1599490659652-9ae92426f537?auto=format&fit=crop&w=400&h=300",
        stock: 25,
        tag: "Homemade",
        categoryId: categoryMap.get("Choti Moti Cheez"),
      },
      {
        name: "Homemade Nankhatai 🍪",
        description: "Traditional shortbread cookies!",
        price: 60,
        imageUrl: "https://images.unsplash.com/photo-1614735241165-6756e1df61ab?auto=format&fit=crop&w=400&h=300",
        stock: 20,
        tag: "New",
        categoryId: categoryMap.get("Homemade Treats"),
      },
      {
        name: "Karachi Biscuits 🍪",
        description: "Famous fruit biscuits with tutti-frutti!",
        price: 70,
        imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&h=300",
        stock: 35,
        tag: "Popular",
        categoryId: categoryMap.get("Biscuits"),
      },
      {
        name: "Spicy Daal Moth 🌶️",
        description: "Chatpata lentil snack mix!",
        price: 65,
        imageUrl: "https://images.unsplash.com/photo-1615474634824-f4a24887a7d8?auto=format&fit=crop&w=400&h=300",
        stock: 45,
        tag: "Spicy",
        categoryId: categoryMap.get("Nimko"),
      },
      {
        name: "Fresh Mango Juice 🥭",
        description: "100% real mango, no preservatives added!",
        price: 85,
        imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&h=300",
        stock: 30,
        tag: "Seasonal",
        categoryId: categoryMap.get("Juices"),
      },
      {
        name: "Salt & Pepper Chips 🥔",
        description: "Perfectly seasoned thin-cut potato chips!",
        price: 40,
        imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&h=300",
        stock: 50,
        tag: "Classic",
        categoryId: categoryMap.get("Chips"),
      },
      {
        name: "Mini Samosas 🔺",
        description: "Bite-sized savory pastries with spicy filling!",
        price: 95,
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&h=300",
        stock: 25,
        tag: "Hot",
        categoryId: categoryMap.get("Choti Moti Cheez"),
      },
      {
        name: "Fruit Chaat Box 🍉",
        description: "Mixed fresh fruits with chaat masala!",
        price: 75,
        imageUrl: "https://images.unsplash.com/photo-1563699182-58cc5639dd26?auto=format&fit=crop&w=400&h=300",
        stock: 15,
        tag: "Healthy",
        categoryId: categoryMap.get("Homemade Treats"),
      },
    ];

    for (const product of products) {
      const existingProduct = await db.query.products.findFirst({
        where: eq(schema.products.name, product.name),
      });

      if (!existingProduct) {
        await db.insert(schema.products).values({
          ...product,
          price: product.price.toString(), // Convert number to string for DB
        });
        console.log(`Product created: ${product.name}`);
      }
    }

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error during seed process:", error);
  }
}

seed();
