"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Timer, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError("Invalid email. Try: lavitta@lavittamm.com");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Timer className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Lavitta</h1>
              <p className="text-purple-200 text-sm">Marketing Management</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Track time,<br />
            maximize <span className="text-purple-300">productivity</span>
          </h2>
          <p className="text-purple-200 text-lg max-w-md leading-relaxed">
            Streamline your team&apos;s time tracking with real-time clock management,
            smart timesheets, and powerful analytics.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "150+", label: "Teams" },
              { value: "50K+", label: "Hours Tracked" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-purple-300 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center px-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Timer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Lavitta</h1>
              <p className="text-xs text-muted">Marketing Management</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-1">Welcome back</h3>
          <p className="text-muted text-sm mb-8">Sign in to your time tracking account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@lavittamm.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                />
                <span className="text-sm text-muted">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary hover:text-primary-dark font-medium">
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-semibold text-sm hover:from-purple-700 hover:to-violet-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
            <p className="text-xs font-medium text-purple-800 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-purple-600">
              <p><span className="font-medium">Admin:</span> lavitta@lavittamm.com</p>
              <p><span className="font-medium">Manager:</span> marcus@lavittamm.com</p>
              <p><span className="font-medium">Employee:</span> aisha@lavittamm.com</p>
              <p className="text-purple-400 mt-1">Any password works for demo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
