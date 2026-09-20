import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  if ((session.user as any)?.role !== "ADMIN") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">Access Restricted</h1>
        <p className="text-sm text-neutral-400 max-w-md">
          You are currently signed in as a standard user ({(session.user as any)?.email}). Only administrators with role <code className="text-blue-400 font-semibold">ADMIN</code> can view this dashboard.
        </p>
        <a
          href="/login"
          className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/10 transition"
        >
          Sign in with an Admin Account
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-48px)] bg-black">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-10 overflow-x-hidden">{children}</div>
    </div>
  );
}
