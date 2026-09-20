"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, CheckCircle2, ArrowRight } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      if (session.user.name) setName(session.user.name);
      if (session.user.email) setEmail(session.user.email);
    }
  }, [session]);

  if (!mounted) return null;

  const totalPrice = getTotalPrice();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          customerAddress: address,
          items,
          totalAmount: totalPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order placement failed");

      setOrderComplete(data.order);
      clearCart();
    } catch (err: any) {
      alert(err.message || "Failed to submit order");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
          Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Thank you for choosing BigAss SHOP.
        </h1>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">
          We&apos;ve received your order{" "}
          <span className="text-white font-mono font-medium">
            #{orderComplete.orderNumber}
          </span>{" "}
          and our team is preparing it for express dispatch. A confirmation receipt has been sent to{" "}
          <span className="text-white">{orderComplete.customerEmail}</span>.
        </p>

        <div className="p-6 rounded-2xl bg-[#161618] border border-white/10 text-left max-w-lg mx-auto space-y-3">
          <h3 className="text-xs font-semibold uppercase text-neutral-400">
            Delivery Destination
          </h3>
          <p className="text-sm text-white font-medium">{orderComplete.customerName}</p>
          <p className="text-xs text-neutral-400">{orderComplete.customerAddress}</p>
          <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
            <span className="text-neutral-400">Total Paid</span>
            <span className="text-white font-semibold">
              {formatPrice(orderComplete.totalAmount)}
            </span>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold transition"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Bag is empty.</h2>
        <p className="text-sm text-neutral-400">
          Looks like you haven&apos;t added any items to your bag yet.
        </p>
        <Link
          href="/products"
          className="inline-block mt-4 px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-medium"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Review and place your order.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Shipping Form */}
          <form
            onSubmit={handleCheckout}
            className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5"
          >
            <h2 className="text-lg font-semibold text-white">
              1. Delivery Details
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Customer"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@bigass.shop"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+66 81 234 5678"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Shipping Address
                </label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, building, sub-district, district, province, postal code"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">
                2. Payment Method
              </h2>
              <div className="p-4 rounded-xl border border-blue-500/40 bg-blue-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-4 border-blue-500 bg-white" />
                  <span className="text-sm font-medium text-white">
                    Credit / Debit Card / QR PromptPay
                  </span>
                </div>
                <span className="text-xs text-blue-400 font-medium">Instant & Secure</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-6 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-sm transition shadow-xl shadow-blue-500/25 disabled:opacity-50"
            >
              {loading ? "Authorizing Payment..." : `Pay ${formatPrice(totalPrice)}`}
            </button>
          </form>

          {/* Order Summary Column */}
          <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-white/10 space-y-5">
            <h3 className="text-base font-semibold text-white">Order Summary</h3>

            <div className="divide-y divide-white/10 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg bg-neutral-900 border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {item.name}
                    </p>
                    {item.color && (
                      <p className="text-[11px] text-neutral-400">
                        {item.color}
                      </p>
                    )}
                    <p className="text-[11px] text-neutral-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-neutral-200">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Shipping</span>
                <span className="text-emerald-400 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-white/10">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-neutral-400 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>Standard Delivery (1-2 business days)</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Encrypted 256-bit SSL transaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
