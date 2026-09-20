import HeroSection from "@/components/ui/HeroSection";
import ProductCard from "@/components/ui/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight, Sparkles, ArrowRight, PlusCircle, Package } from "lucide-react";

export const revalidate = 0;

export default async function HomePage() {
  const [featuredProducts, categories, latestArticles] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true },
      include: { category: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      take: 6,
    }),
    prisma.article.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. BigAss Hero Section */}
      <HeroSection />

      {/* 2. Secondary Spotlight: Workstation Concept */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#161618] to-[#0c0c0e] border border-white/10 p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg z-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Pro Studio & Workstation
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Mind-blowing Speed. <br />
              <span className="gradient-text-hero">Zero Limits.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-400">
              Curated gear optimized for heavy creative workloads, 3D rendering, and audio production.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/products?category=laptops"
                className="px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition shadow-lg shadow-blue-500/20"
              >
                Explore Workstations
              </Link>
              <Link
                href="/products"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
              >
                Browse all catalog <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center z-10">
            <img
              src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1000&auto=format&fit=crop&q=80"
              alt="BigAss Pro Hardware"
              className="rounded-2xl max-h-80 object-cover shadow-2xl border border-white/10 transform hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* 3. Category Browser Icons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Explore Lineup Categories
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Select a category to discover curated flagship technology.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
          >
            See all products <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group p-5 rounded-2xl bg-[#161618] border border-white/5 hover:border-white/20 transition-all flex flex-col items-center text-center hover:-translate-y-1 duration-300"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden mb-3 border border-white/10 bg-black/40">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600">
                    <Sparkles className="w-6 h-6" />
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                {cat.description || "Discover now"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Products Grid or Empty Catalog Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Curated Releases
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Next-generation devices and peripherals.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
          >
            Explore store <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#161618] border border-white/5 text-center space-y-4 max-w-xl mx-auto">
            <Package className="w-12 h-12 stroke-[1.2] text-neutral-500 mx-auto" />
            <h3 className="text-lg font-semibold text-white">
              Inventory Ready For Your Custom Products
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No products are loaded yet. As an administrator, you can log in to the Control Center and add your own custom products with price, specs, and images.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold transition shadow-lg shadow-blue-500/20"
              >
                <PlusCircle className="w-4 h-4" /> Go to Admin & Add Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. BigAss Journal Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/10 pt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                BigAss Journal
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Engineering Stories & Design Insights
              </h2>
            </div>
            <Link
              href="/blogs"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
            >
              All articles <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blogs/${article.slug}`}
                className="group flex flex-col sm:flex-row rounded-3xl overflow-hidden bg-[#161618] border border-white/5 hover:border-white/20 transition-all duration-300"
              >
                <div className="sm:w-1/2 h-52 sm:h-auto overflow-hidden bg-neutral-900 shrink-0">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-white font-medium">
                        {article.category}
                      </span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white mt-2 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                  <div className="text-xs font-medium text-blue-400 flex items-center gap-1 pt-2">
                    Read story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
