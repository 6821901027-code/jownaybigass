"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    tagline?: string | null;
    subtitle?: string | null;
    price: number;
    images: string;
    colors?: string | null;
    category?: {
      name: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  let imageList: string[] = [];
  try {
    imageList = JSON.parse(product.images);
  } catch {
    imageList = [product.images];
  }
  const coverImage = imageList[0] || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800";

  let colorList: { name: string; hex: string }[] = [];
  try {
    if (product.colors) colorList = JSON.parse(product.colors);
  } catch {}

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: coverImage,
      color: colorList[0]?.name,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative rounded-3xl p-6 bg-[#161618] border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/50">
      {/* Top Header */}
      <div>
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
            {product.category?.name || "Hardware"}
          </span>
          {colorList.length > 0 && (
            <div className="flex space-x-1.5 items-center">
              {colorList.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        <Link href={`/products/${product.slug}`} className="block mt-2">
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
            {product.tagline || product.subtitle || "Engineered to perfection."}
          </p>
        </Link>
      </div>

      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="my-6 relative h-48 sm:h-56 flex items-center justify-center overflow-hidden rounded-2xl bg-black/30"
      >
        <img
          src={coverImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Footer & Actions */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-neutral-500 block">From</span>
          <span className="text-sm font-semibold text-white">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleQuickAdd}
            aria-label="Add to bag"
            className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-white/10 hover:bg-white/20 text-neutral-200"
            }`}
          >
            {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="text-xs px-3.5 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium rounded-full transition"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
