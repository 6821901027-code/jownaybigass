"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Articles (CMS)", href: "/admin/blogs", icon: FileText },
  ];

  return (
    <aside className="w-64 bg-[#121214] border-r border-white/10 flex flex-col justify-between shrink-0 min-h-[calc(100vh-48px)] p-6">
      <div className="space-y-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Admin Portal
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Control Center
          </h2>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 pt-6 border-t border-white/10 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
            {session?.user?.name ? session.user.name[0] : "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white truncate">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-[10px] text-neutral-400 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Public Store
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-white/5 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
