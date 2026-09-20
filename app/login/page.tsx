"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, AlertCircle, Flame } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred during login");
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: "admin" | "user") => {
    if (role === "admin") {
      setEmail("admin@bigass.shop");
      setPassword("admin123");
    } else {
      setEmail("user@bigass.shop");
      setPassword("user123");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 glass-card p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 border border-white/10 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/25">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Sign in to BigAss SHOP
          </h2>
          <p className="text-xs text-neutral-400">
            Enter your account credentials to continue
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
          <p className="text-[11px] font-semibold text-neutral-300">
            Quick Auto-fill for Testing:
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-medium transition"
            >
              👑 Admin (admin@bigass.shop)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("user")}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-neutral-200 border border-white/10 text-[11px] font-medium transition"
            >
              👤 User (user@bigass.shop)
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Account Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bigass.shop"
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Register footer link */}
        <div className="text-center text-xs text-neutral-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center text-xs text-neutral-500">
          Loading BigAss Account...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
