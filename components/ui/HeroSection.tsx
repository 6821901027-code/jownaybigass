import Link from "next/link";
import { ChevronRight, Sparkles, Plus } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full pt-20 pb-28 flex flex-col items-center justify-center text-center overflow-hidden bg-black">
      {/* Background radial highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/15 blur-[150px] pointer-events-none rounded-full" />

      {/* Product Tag & Heading */}
      <div className="z-10 space-y-3 px-4 max-w-4xl mx-auto">
        <span className="text-xs font-semibold tracking-widest uppercase text-blue-400">
          Next-Gen Flagship Architecture
        </span>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white">
          BigAss <span className="gradient-text-hero">SHOP</span>
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-medium gradient-text-titanium">
          Pure Power. Minimalist Titanium. Zero Compromise.
        </p>

        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto pt-2">
          Curated luxury tech, workstation hardware, and smart lifestyle gear built for creators and visionaries.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          <Link
            href="/products"
            className="px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm font-medium transition shadow-lg shadow-blue-500/20"
          >
            Explore Catalog
          </Link>
          <Link
            href="/admin/products"
            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-neutral-200 text-sm font-medium transition border border-white/10 flex items-center gap-1.5 group"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            Add First Product
          </Link>
        </div>

        <p className="text-xs text-neutral-500 pt-1">
          Complimentary nationwide express courier on all flagship orders.
        </p>
      </div>

      {/* Hero Showcase Banner */}
      <div className="relative mt-12 w-full max-w-5xl px-4 z-10">
        <div className="relative mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0c]">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=85"
            alt="BigAss SHOP Hardware"
            className="w-full h-[380px] sm:h-[500px] object-cover object-center transform hover:scale-[1.01] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-neutral-400">
            <span className="backdrop-blur-md bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10 text-white font-medium">
              Aerospace Grade Finish
            </span>
            <span className="backdrop-blur-md bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10 text-blue-400 font-medium">
              BigAss Certified Quality
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
