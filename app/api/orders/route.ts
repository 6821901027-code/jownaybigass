import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      totalAmount,
    } = body;

    if (!customerName || !customerEmail || !customerAddress || !items?.length) {
      return NextResponse.json(
        { error: "Missing required checkout details" },
        { status: 400 }
      );
    }

    const orderNumber = `APL-${Date.now().toString().slice(-6)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: (session?.user as any)?.id || null,
        customerName,
        customerEmail,
        customerPhone: customerPhone || "",
        customerAddress,
        totalAmount,
        status: "COMPLETED",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            color: item.color || null,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
