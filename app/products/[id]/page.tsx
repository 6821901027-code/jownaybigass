import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/store/ProductDetailClient";

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id: identifier } = await params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
