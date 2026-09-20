"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User as UserIcon, Menu, X, Shield, LogOut, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store/cartStore";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openCart, getTotalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartItems = mounted ? getTotalItems() : 0;
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const navLinks = [
    { name: "Store", href: "/products" },
    { name: "Flagships", href: "/products?category=flagships" },
    { name: "Workstations", href: "/products?category=laptops" },
    { name: "Displays", href: "/products?category=displays" },
    { name: "Wearables", href: "/products?category=wearables" },
    { name: "Audio", href: "/products?category=audio" },
    { name: "Journal", href: "/blogs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs tracking-tight text-[#f5f5f7]">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Flame className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-bold tracking-tight text-sm text-white">
            BigAss <span className="text-blue-400 font-semibold">SHOP</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-7 text-neutral-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-white transition-colors duration-200 ${
                pathname === link.href ? "text-white font-medium" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-5">
          {/* Admin link if role is ADMIN */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-neutral-200 transition-all border border-white/15"
              title="Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline font-medium">Admin</span>
            </Link>
          )}

          {/* User Profile / Auth */}
          {session ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-5 h-5 rounded-full border border-white/20 object-cover"
                  />
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
                <span className="hidden lg:inline max-w-[100px] truncate text-neutral-300">
                  {session.user?.name || "Account"}
                </span>
              </button>

              {/* User Dropdown */}
              <div className="absolute right-0 mt-2 w-48 py-2 bg-[#1d1d1f] border border-white/10 rounded-xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-xs font-medium text-white truncate">
                    {session.user?.name}
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {session.user?.email}
                  </p>
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-white/5"
                  >
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    Admin Control
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-white/5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1 text-neutral-300 hover:text-white"
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Cart Icon & Badge */}
          <button
            onClick={openCart}
            aria-label="Shopping Bag"
            className="relative opacity-80 hover:opacity-100 transition-opacity"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden opacity-80 hover:opacity-100"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#000000]/95 backdrop-blur-3xl px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg text-neutral-300 hover:text-white font-medium py-1"
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg text-blue-400 hover:text-blue-300 font-medium py-1"
            >
              Admin Control Center
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
