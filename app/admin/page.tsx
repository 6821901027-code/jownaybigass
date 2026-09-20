import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package, FileText, ShoppingBag, DollarSign, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminOverviewPage() {
  const [productsCount, articlesCount, ordersCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.article.count(),
    prisma.order.count(),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: true },
        },
      },
    }),
  ]);

  const totalRevenue = (
    await prisma.order.aggregate({
      _sum: { totalAmount: true },
    })
  )._sum.totalAmount || 0;

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Total Orders",
      value: ordersCount.toString(),
      icon: ShoppingBag,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Active Products",
      value: productsCount.toString(),
      icon: Package,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Journal Articles",
      value: articlesCount.toString(),
      icon: FileText,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Welcome Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
          Executive Dashboard
        </span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-1">
          Store & Content Performance
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Live statistics, catalog metrics, and real-time customer orders.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#161618] border border-white/5 space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-neutral-400">
                  {s.label}
                </span>
                <div className={`p-2 rounded-xl border ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products"
          className="p-6 rounded-2xl bg-[#161618] border border-white/5 hover:border-white/20 transition flex items-center justify-between group"
        >
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition">
              Manage Product Catalog
            </h3>
            <p className="text-xs text-neutral-400">
              Add new custom devices, update pricing, change specifications.
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition" />
        </Link>

        <Link
          href="/admin/blogs"
          className="p-6 rounded-2xl bg-[#161618] border border-white/5 hover:border-white/20 transition flex items-center justify-between group"
        >
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition">
              Manage Journal Articles
            </h3>
            <p className="text-xs text-neutral-400">
              Publish editorial press releases, product guides, and updates.
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition" />
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-2xl bg-[#161618] border border-white/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Recent Orders</h2>
          <span className="text-xs text-neutral-400">Showing {orders.length} latest</span>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-neutral-500 py-6 text-center">
            No customer orders received yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="border-b border-white/10 text-neutral-400">
                <tr>
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 font-mono text-white">
                      #{o.orderNumber}
                    </td>
                    <td className="py-3.5">
                      <p className="font-medium text-white">{o.customerName}</p>
                      <p className="text-[10px] text-neutral-500">{o.customerEmail}</p>
                    </td>
                    <td className="py-3.5">
                      {o.items.map((it) => (
                        <span key={it.id} className="block text-[11px]">
                          {it.product.name} (x{it.quantity})
                        </span>
                      ))}
                    </td>
                    <td className="py-3.5 font-semibold text-white">
                      {formatPrice(o.totalAmount)}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-neutral-400">
                      {new Date(o.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
