"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-md h-full glass-drawer flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-300" />
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Shopping Bag ({totalItems})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-neutral-400">
              <ShoppingBag className="w-12 h-12 stroke-[1.2] text-neutral-600" />
              <p className="text-base text-neutral-300">Your Bag is empty.</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                Explore catalog <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 items-center hover:border-white/15 transition-all"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl bg-neutral-900 border border-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {item.name}
                  </h4>
                  {item.color && (
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Finish: {item.color}
                    </p>
                  )}
                  <p className="text-xs font-semibold text-neutral-200 mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border border-white/20 rounded-lg bg-black/40">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-white text-neutral-400 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs px-2 font-medium text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-white text-neutral-400 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-neutral-500 hover:text-red-400 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-black/40 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-400">Total</span>
              <span className="text-lg font-semibold text-white">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Complimentary courier and guaranteed secure checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition shadow-lg shadow-blue-600/20"
            >
              Check Out
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
