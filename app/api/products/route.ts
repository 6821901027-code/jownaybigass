import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    const {
      name,
      slug,
      tagline,
      subtitle,
      description,
      price,
      stock,
      images,
      colors,
      specs,
      categoryId,
      isFeatured,
    } = data;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: "Name, description, price, and category are required" },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        tagline: tagline || "",
        subtitle: subtitle || "",
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 50,
        images: typeof images === "string" ? images : JSON.stringify(images || []),
        colors: typeof colors === "string" ? colors : JSON.stringify(colors || []),
        specs: typeof specs === "string" ? specs : JSON.stringify(specs || {}),
        categoryId,
        isFeatured: Boolean(isFeatured),
      },
      include: { category: true },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
