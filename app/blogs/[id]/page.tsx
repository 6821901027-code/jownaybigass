import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock } from "lucide-react";

export const revalidate = 0;

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { id: identifier } = await params;

  const article = await prisma.article.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
    include: {
      author: true,
    },
  });

  if (!article) {
    notFound();
  }

  const paragraphs = article.content.split("\n\n");

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back link */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition"
      >
        <ChevronLeft className="w-4 h-4" /> Back to BigAss Journal
      </Link>

      {/* Header Info */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-neutral-400">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white font-medium">
            {article.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          {article.title}
        </h1>

        <p className="text-lg sm:text-xl text-neutral-300 font-normal leading-relaxed pt-2">
          {article.summary}
        </p>

        {/* Author details */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          {article.author.image && (
            <img
              src={article.author.image}
              alt={article.author.name || "Author"}
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
          )}
          <div>
            <p className="text-xs font-semibold text-white">
              {article.author.name || "BigAss Editorial Staff"}
            </p>
            <p className="text-[11px] text-neutral-400">Editorial Studio</p>
          </div>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full max-h-[500px] object-cover"
        />
      </div>

      {/* Editorial Content */}
      <div className="max-w-3xl mx-auto space-y-6 text-neutral-300 leading-relaxed text-base font-normal">
        {paragraphs.map((p, idx) => {
          if (p.startsWith("## ")) {
            return (
              <h2
                key={idx}
                className="text-2xl sm:text-3xl font-bold text-white pt-6 tracking-tight"
              >
                {p.replace("## ", "")}
              </h2>
            );
          }
          if (p.startsWith("### ")) {
            return (
              <h3
                key={idx}
                className="text-xl sm:text-2xl font-semibold text-white pt-4 tracking-tight"
              >
                {p.replace("### ", "")}
              </h3>
            );
          }
          return (
            <p key={idx} className="text-neutral-300 leading-8">
              {p}
            </p>
          );
        })}
      </div>

      {/* Article footer */}
      <div className="border-t border-white/10 pt-8 flex justify-between items-center text-xs text-neutral-400 max-w-3xl mx-auto">
        <Link href="/blogs" className="text-blue-400 hover:underline">
          ← More Journal stories
        </Link>
        <span className="text-[11px] text-neutral-500">
          BigAss Media & Press Archive
        </span>
      </div>
    </article>
  );
}
