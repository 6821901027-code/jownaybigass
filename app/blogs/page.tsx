import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function BlogsPage() {
  const articles = await prisma.article.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
  const remainingArticles = articles.filter((a) => a.id !== featuredArticle?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          BigAss Journal
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
          Stories, Updates & Engineering.
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl">
          Curated deep dives into high-performance materials, minimalist architecture, and product announcements.
        </p>
      </div>

      {/* Featured Big Article */}
      {featuredArticle && (
        <Link
          href={`/blogs/${featuredArticle.slug}`}
          className="group block relative rounded-3xl overflow-hidden bg-[#161618] border border-white/10 hover:border-white/20 transition-all duration-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 h-80 sm:h-[450px] overflow-hidden">
              <img
                src={featuredArticle.coverImage}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white font-medium">
                    {featuredArticle.category}
                  </span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                  {featuredArticle.title}
                </h2>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {featuredArticle.summary}
                </p>
              </div>

              <div className="text-xs font-semibold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read full article <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Remaining Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
        {remainingArticles.map((article) => (
          <Link
            key={article.id}
            href={`/blogs/${article.slug}`}
            className="group flex flex-col rounded-3xl overflow-hidden bg-[#161618] border border-white/5 hover:border-white/20 transition-all duration-300"
          >
            <div className="relative h-52 overflow-hidden bg-neutral-900">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-neutral-300 border border-white/10">
                {article.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                  <span>
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="text-xs font-medium text-blue-400 flex items-center gap-1 pt-2">
                Read article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
