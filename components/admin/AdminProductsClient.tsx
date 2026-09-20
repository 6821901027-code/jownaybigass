"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Plus, Trash2, Edit2, Package, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  subtitle: string | null;
  description: string;
  price: number;
  stock: number;
  images: string;
  colors: string | null;
  specs: string | null;
  isFeatured: boolean;
  categoryId: string;
  category: {
    name: string;
  };
}

export default function AdminProductsClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("50");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [image, setImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName("");
    setTagline("");
    setDescription("");
    setPrice("");
    setStock("50");
    setCategoryId(categories[0]?.id || "");
    setImage("https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000");
    setIsFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setTagline(p.tagline || "");
    setDescription(p.description);
    setPrice(p.price.toString());
    setStock(p.stock.toString());
    setCategoryId(p.categoryId);

    let firstImg = "";
    try {
      const arr = JSON.parse(p.images);
      firstImg = arr[0] || "";
    } catch {
      firstImg = p.images;
    }
    setImage(firstImg);
    setIsFeatured(p.isFeatured);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        tagline,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId,
        images: JSON.stringify([image]),
        isFeatured,
      };

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update");
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create");
      }

      setModalOpen(false);
      router.refresh();
      const updatedRes = await fetch("/api/products");
      const data = await updatedRes.json();
      setProducts(data);
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete ${productName}?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts(products.filter((p) => p.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Could not delete");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Catalog Management
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">
            Products ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Create custom products, set pricing, adjust inventory, and select categories.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold transition shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#161618] border border-white/5 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-neutral-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No products currently in store</p>
            <p className="text-xs text-neutral-400">
              Click &quot;Add New Product&quot; to begin building your custom BigAss SHOP catalog.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="border-b border-white/10 text-neutral-400 bg-black/40">
                <tr>
                  <th className="py-3 px-4 font-medium">Item</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Price</th>
                  <th className="py-3 px-4 font-medium">Stock</th>
                  <th className="py-3 px-4 font-medium">Featured</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => {
                  let img = "";
                  try {
                    img = JSON.parse(p.images)[0];
                  } catch {
                    img = p.images;
                  }
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={img}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-white/10"
                        />
                        <div>
                          <p className="font-semibold text-white">{p.name}</p>
                          <p className="text-[10px] text-neutral-500 truncate max-w-xs">
                            {p.tagline || p.subtitle || p.slug}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-md bg-white/5 text-[11px] text-neutral-300 border border-white/5">
                          {p.category?.name || "General"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-neutral-300">{p.stock} units</span>
                      </td>
                      <td className="py-3 px-4">
                        {p.isFeatured ? (
                          <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full font-medium">
                            Featured
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500">Standard</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Create / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg glass-card p-6 rounded-3xl border border-white/15 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
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
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. BigAss Ultra Studio"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Pure performance. Aerospace titanium."
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Price (THB) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="29900"
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1b1b1d] border border-white/10 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Primary Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed specs and architectural features..."
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-black/50 border border-white/20 accent-blue-600"
                />
                <label htmlFor="isFeatured" className="text-neutral-300 text-xs cursor-pointer">
                  Feature this item on homepage spotlight
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
                  {loading ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
