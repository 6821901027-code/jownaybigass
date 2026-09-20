import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [totalProducts, totalArticles, totalOrders, orders] =
      await Promise.all([
        prisma.product.count(),
        prisma.article.count(),
        prisma.order.count(),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { items: { include: { product: true } } },
        }),
      ]);

    const totalRevenue = (
      await prisma.order.aggregate({
        _sum: { totalAmount: true },
      })
    )._sum.totalAmount || 0;

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalProducts,
        totalArticles,
        totalOrders,
      },
      recentOrders: orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load stats" },
      { status: 500 }
    );
  }
}
