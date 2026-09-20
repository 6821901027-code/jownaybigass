import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to get product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        tagline: body.tagline,
        subtitle: body.subtitle,
        description: body.description,
        price: body.price ? parseFloat(body.price) : undefined,
        stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
        images: typeof body.images === "string" ? body.images : JSON.stringify(body.images || []),
        colors: typeof body.colors === "string" ? body.colors : JSON.stringify(body.colors || []),
        specs: typeof body.specs === "string" ? body.specs : JSON.stringify(body.specs || {}),
        categoryId: body.categoryId,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
