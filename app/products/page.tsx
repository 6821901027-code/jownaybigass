import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { Sparkles, SlidersHorizontal, PlusCircle } from "lucide-react";

export const revalidate = 0;

interface ProductsPageProps {
  searchParams?: Promise<{ category?: string; search?: string }> | { category?: string; search?: string };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const categorySlug = resolvedParams?.category;
  const searchQuery = resolvedParams?.search;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const whereClause: any = {};

  if (categorySlug) {
    const matchedCategory = categories.find(
      (c) => c.slug.toLowerCase() === categorySlug.toLowerCase()
    );
    if (matchedCategory) {
      whereClause.categoryId = matchedCategory.id;
    }
  }

  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery } },
      { description: { contains: searchQuery } },
    ];
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title & Description */}
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
          BigAss Storefront
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Catalog. <span className="gradient-text-hero">High performance hardware & essentials.</span>
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Browse our collection of precision hardware, workstations, and high-fidelity devices.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            !categorySlug
              ? "bg-white text-black font-semibold shadow-md"
              : "bg-white/5 text-neutral-300 hover:bg-white/10"
          }`}
        >
          All Categories
        </Link>
        {categories.map((cat) => {
          const isActive = categorySlug === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-white text-black font-semibold shadow-md"
                  : "bg-white/5 text-neutral-300 hover:bg-white/10"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Product List Grid */}
      {products.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-500">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-lg text-white font-semibold">No products in catalog</p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            The catalog currently has no products. Administrators can create new products anytime from the Admin Dashboard.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition shadow-lg shadow-blue-500/20"
            >
              <PlusCircle className="w-4 h-4" /> Add Product in Admin
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
