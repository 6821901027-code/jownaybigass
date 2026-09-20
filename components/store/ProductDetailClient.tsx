"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";
import { Check, ShieldCheck, Truck, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface ProductDetailClientProps {
  product: {
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
    category: {
      name: string;
      slug: string;
    };
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCartStore();

  let imageList: string[] = [];
  try {
    imageList = JSON.parse(product.images);
  } catch {
    imageList = [product.images];
  }

  let colorList: { name: string; hex: string }[] = [];
  try {
    if (product.colors) colorList = JSON.parse(product.colors);
  } catch {}

  let specsObj: Record<string, string> = {};
  try {
    if (product.specs) specsObj = JSON.parse(product.specs);
  } catch {}

  const [selectedImage, setSelectedImage] = useState(imageList[0] || "");
  const [selectedColor, setSelectedColor] = useState(colorList[0]?.name || "");
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage || imageList[0],
      color: selectedColor || undefined,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <Link href="/products" className="hover:text-white flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Store
        </Link>
        <span>/</span>
        <span>{product.category.name}</span>
        <span>/</span>
        <span className="text-white font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Gallery */}
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-[#161618] border border-white/10 aspect-square flex items-center justify-center p-4">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl transition-all duration-500"
            />
          </div>

          {/* Thumbnails */}
          {imageList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImage === img
                      ? "border-blue-500 scale-105"
                      : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Options */}
        <div className="space-y-8">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {product.category.name}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
              Order {product.name}
            </h1>
            <p className="text-base text-neutral-400 font-medium mt-2">
              {product.tagline || product.subtitle}
            </p>
            <div className="mt-4 text-2xl font-bold text-white">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* Color Finish Selector */}
          {colorList.length > 0 && (
            <div className="space-y-3 border-t border-white/10 pt-6">
              <label className="text-xs font-semibold text-neutral-300 block">
                Finish: <span className="text-white font-normal">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {colorList.map((col) => {
                  const isSelected = selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-white/10 bg-[#161618] text-neutral-300 hover:border-white/20"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: col.hex }}
                      />
                      {col.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="border-t border-white/10 pt-6 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Overview
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Add to Bag CTA */}
          <div className="pt-4 space-y-3">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 px-6 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xl ${
                added
                  ? "bg-emerald-600 text-white shadow-emerald-600/30"
                  : "bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-blue-500/25"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Bag
                </>
              ) : (
                <>Add to Bag • {formatPrice(product.price)}</>
              )}
            </button>

            <p className="text-[11px] text-center text-neutral-500">
              Complimentary express courier. 14-day replacement guarantee.
            </p>
          </div>

          {/* Perks Bar */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-center text-xs text-neutral-400">
            <div className="space-y-1">
              <Truck className="w-5 h-5 mx-auto text-blue-400" />
              <p className="font-medium text-white text-[11px]">Free Shipping</p>
              <p className="text-[10px] text-neutral-500">Fast doorstep delivery</p>
            </div>
            <div className="space-y-1">
              <RefreshCw className="w-5 h-5 mx-auto text-blue-400" />
              <p className="font-medium text-white text-[11px]">Direct Exchange</p>
              <p className="text-[10px] text-neutral-500">14-day warranty exchange</p>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-5 h-5 mx-auto text-blue-400" />
              <p className="font-medium text-white text-[11px]">BigAss Care</p>
              <p className="text-[10px] text-neutral-500">1 year official warranty</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {Object.keys(specsObj).length > 0 && (
        <div className="border-t border-white/10 pt-16 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Technical Specifications
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Precision Crafted Architecture.
            </h2>
          </div>

          <div className="max-w-4xl mx-auto divide-y divide-white/10 border-y border-white/10">
            {Object.entries(specsObj).map(([key, val]) => (
              <div
                key={key}
                className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 text-sm"
              >
                <span className="font-medium text-neutral-400">{key}</span>
                <span className="sm:col-span-2 text-white font-medium">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
