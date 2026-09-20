import { prisma } from "@/lib/prisma";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <AdminProductsClient
      initialProducts={products}
      categories={categories}
    />
  );
}
