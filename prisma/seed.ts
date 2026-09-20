import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database for BigAss SHOP (Clean - No products)...");

  // Clean all existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
  const hashedPasswordUser = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "BigAss Admin",
      email: "admin@bigass.shop",
      password: hashedPasswordAdmin,
      role: "ADMIN",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Alex Customer",
      email: "user@bigass.shop",
      password: hashedPasswordUser,
      role: "USER",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  // Create Modern Categories (General Tech & Lifestyle Categories - NO Apple names)
  await prisma.category.createMany({
    data: [
      {
        name: "Flagships",
        slug: "flagships",
        description: "Next-generation devices engineered for maximum power.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
      },
      {
        name: "Laptops & Workstations",
        slug: "laptops",
        description: "Ultimate computational performance for creator workflows.",
        image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
      },
      {
        name: "Smart Displays",
        slug: "displays",
        description: "Ultra-thin portable touch displays and tablets.",
        image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop&q=80",
      },
      {
        name: "Wearables",
        slug: "wearables",
        description: "Precision health trackers and rugged smart tech.",
        image: "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80",
      },
      {
        name: "Audio Studio",
        slug: "audio",
        description: "Acoustic engineering and high-fidelity sound.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      },
    ],
  });

  // Seed sample clean articles for BigAss Journal
  await prisma.article.create({
    data: {
      title: "Welcome to BigAss SHOP: Engineering The Future of High-End Tech",
      slug: "welcome-to-bigass-shop",
      summary:
        "BigAss SHOP opens its digital doors with a commitment to minimalist design, titanium craftsmanship, and relentless product quality.",
      content: `## A New Era of Technology Experience

Welcome to BigAss SHOP. We set out with a simple yet ambitious vision: build a storefront that blends minimalist luxury aesthetics with raw engineering excellence.

Every single curated release undergoes rigorous acoustic, thermal, and architectural verification before being offered to our community.

### Our Philosophy

Crafted for those who demand more from their gear. High refresh rates, aerospace-grade metals, seamless glassmorphism user experiences, and zero compromises.`,
      coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80",
      category: "Press Release",
      readTime: "3 min read",
      isFeatured: true,
      authorId: admin.id,
    },
  });

  await prisma.article.create({
    data: {
      title: "Designing For Maximum Performance: Why Titanium and Carbon Matter",
      slug: "designing-for-maximum-performance",
      summary:
        "An inside exploration into the modern metallurgy and tactile craftsmanship that goes into flagship gear.",
      content: `## Strength Meets Lightweight Form

In the quest to construct ultra-sleek devices, materials matter more than ever. Titanium offers extraordinary strength-to-weight ratios, ensuring devices endure demanding use without unwanted heft.

Coupled with ultra-responsive OLED panels and precision-milled aluminum shells, modern hardware achieves breathtaking durability.`,
      coverImage: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&auto=format&fit=crop&q=80",
      category: "Design Insights",
      readTime: "4 min read",
      isFeatured: false,
      authorId: admin.id,
    },
  });

  console.log("Database seeded: 0 products, clean categories, and BigAss accounts ready!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
