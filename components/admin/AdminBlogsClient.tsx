"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, FileText, X, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  readTime: string;
  isFeatured: boolean;
  createdAt: Date;
  author: {
    name: string | null;
  };
}

export default function AdminBlogsClient({
  initialArticles,
}: {
  initialArticles: Article[];
}) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("Press Release");
  const [readTime, setReadTime] = useState("3 min read");
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitle("");
    setSummary("");
    setContent("## Story Heading\n\nBigAss SHOP introduces innovative new architecture.");
    setCoverImage("https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200");
    setCategory("Press Release");
    setReadTime("4 min read");
    setIsFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (a: Article) => {
    setEditingArticle(a);
    setTitle(a.title);
    setSummary(a.summary);
    setContent(a.content);
    setCoverImage(a.coverImage);
    setCategory(a.category);
    setReadTime(a.readTime);
    setIsFeatured(a.isFeatured);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        summary,
        content,
        coverImage,
        category,
        readTime,
        isFeatured,
      };

      if (editingArticle) {
        const res = await fetch(`/api/articles/${editingArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update article");
      } else {
        const res = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create article");
      }

      setModalOpen(false);
      router.refresh();
      const refetched = await fetch("/api/articles");
      const data = await refetched.json();
      setArticles(data);
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, artTitle: string) => {
    if (!confirm(`Are you sure you want to delete article "${artTitle}"?`)) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete article");
      setArticles(articles.filter((a) => a.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Could not delete");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Editorial CMS
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">
            Journal Articles ({articles.length})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Publish press releases, engineering insights, and official announcements.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold transition shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      <div className="rounded-2xl bg-[#161618] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-white/10 text-neutral-400 bg-black/40">
              <tr>
                <th className="py-3 px-4 font-medium">Article</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Author</th>
                <th className="py-3 px-4 font-medium">Featured</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={a.coverImage}
                      alt={a.title}
                      className="w-12 h-10 rounded-lg object-cover bg-neutral-900 border border-white/10"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate max-w-sm">
                        {a.title}
                      </p>
                      <p className="text-[10px] text-neutral-500">{a.readTime}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-md bg-white/5 text-[11px] text-neutral-300 border border-white/5">
                      {a.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {a.author?.name || "Editor"}
                  </td>
                  <td className="py-3 px-4">
                    {a.isFeatured ? (
                      <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full font-medium">
                        Spotlight
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-500">Standard</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-neutral-400">
                    {new Date(a.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      href={`/blogs/${a.slug}`}
                      target="_blank"
                      className="p-1.5 inline-block rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition"
                      title="View article"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => openEditModal(a)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
                      title="Edit article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id, a.title)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition"
                      title="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xl glass-card p-6 rounded-3xl border border-white/15 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingArticle ? "Edit Article" : "Publish New Article"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next-generation architecture breakthroughs"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1b1b1d] border border-white/10 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Press Release">Press Release</option>
                    <option value="Design Insights">Design Insights</option>
                    <option value="Product Update">Product Update</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="3 min read"
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Summary / Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A short punchy preview of the article..."
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Body Content (supports ## Headings) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write editorial content with ## headings and paragraphs..."
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 font-mono text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="artFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-black/50 border border-white/20 accent-blue-600"
                />
                <label htmlFor="artFeatured" className="text-neutral-300 text-xs cursor-pointer">
                  Spotlight this article on Journal header
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold transition disabled:opacity-50"
                >
                  {loading ? "Publishing..." : editingArticle ? "Update Story" : "Publish Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
