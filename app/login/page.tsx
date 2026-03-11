"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wallet, BarChart3, TrendingDown, PiggyBank, Receipt,
  Eye, EyeOff, AlertCircle
} from "lucide-react";

// ─── Floating finance stat pill ──────────────────────────────────
function StatPill({
  icon: Icon, label, value, color, style
}: {
  icon: React.ElementType; label: string; value: string;
  color: string; style?: React.CSSProperties;
}) {
  return (
    <div
      className="absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 shadow-xl"
      style={style}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Icon size={17} className="text-white" strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium">{label}</p>
          <p className={`font-black text-sm ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Mini chart bars ──────────────────────────────────────────────
function MiniChart() {
  const bars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100];
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end gap-1.5 px-8 opacity-20">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 bg-white rounded-t-lg" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

// ─── Password input with toggle ───────────────────────────────────
function PasswordInput({
  value, onChange, placeholder, id
}: { value: string; onChange: (v: string) => void; placeholder?: string; id?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "••••••••"}
        className="w-full px-4 py-3 pr-11 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-800 placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-500 transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const { login, loginWithGoogle, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(email, password);
  };

  const handleGoogle = () => {
    clearError();
    loginWithGoogle();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, .font-display { font-family: 'Sora', sans-serif; }
        @keyframes float-a { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
        @keyframes float-b { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-14px) rotate(-1deg)} }
        @keyframes slide-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .form-in   { animation: slide-up 0.6s ease forwards; }
        .form-in-1 { animation: slide-up 0.6s ease 0.1s both; }
        .form-in-2 { animation: slide-up 0.6s ease 0.2s both; }
        .form-in-3 { animation: slide-up 0.6s ease 0.3s both; }
        .form-in-4 { animation: slide-up 0.6s ease 0.4s both; }
        .form-in-5 { animation: slide-up 0.6s ease 0.5s both; }
        .shimmer-btn {
          background: linear-gradient(90deg, #2563eb, #1d4ed8, #3b82f6, #2563eb);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .shimmer-btn:hover { animation-play-state: paused; }
      `}</style>

      <div className="min-h-screen flex">

        {/* ── Left panel ────────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative bg-blue-600 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-800/50 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <MiniChart />

          {/* Logo */}
          <div className="relative z-10 p-10">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
                <Wallet size={18} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-white font-black text-xl font-['Sora',sans-serif] tracking-tight">
                Fin<span className="text-blue-200">Set</span>
              </span>
            </Link>
          </div>

          {/* Floating stat pills */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 pb-8">
            <div className="relative w-full max-w-[300px] h-[320px]">
              <StatPill icon={PiggyBank} label="This Month Saved"  value="$248.50"      color="text-green-300"
                style={{ top: "0%",    left: "5%",  animation: "float-a 5s ease-in-out infinite" }} />
              <StatPill icon={BarChart3} label="Budget Used"       value="62% of $500"  color="text-blue-200"
                style={{ top: "30%",   right: "0%", animation: "float-b 6s ease-in-out infinite 1s" }} />
              <StatPill icon={Receipt}   label="Largest Expense"   value="៛87,000"      color="text-red-300"
                style={{ bottom: "10%", left: "8%", animation: "float-a 7s ease-in-out infinite 0.5s" }} />

              {/* Center icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                <div className="w-20 h-20 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                  <TrendingDown size={36} className="text-white" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <h2 className="text-white font-black text-2xl font-['Sora',sans-serif] leading-tight mb-2">
                Your Money,<br />Under Control
              </h2>
              <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
                Track expenses by category, set budgets, and manage finances with your partner or family.
              </p>
            </div>
          </div>

          {/* Bottom spacer — language switcher removed */}
          <div className="relative z-10 p-10" />
        </div>

        {/* ── Right panel: form ──────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-blue-50">
          <div className="w-full max-w-[420px]">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <Wallet size={15} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">
                Fin<span className="text-blue-600">Set</span>
              </span>
            </div>

            {/* Heading */}
            <div className="form-in mb-8">
              <h1 className="text-3xl font-black text-blue-800 font-['Sora',sans-serif] mb-1">
                Welcome back
              </h1>
              <p className="text-blue-400 text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-2">
                  Sign up free
                </Link>
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="form-in mb-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Google button */}
            <div className="form-in-1 mb-5">
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-blue-200 hover:border-blue-300 text-blue-700 font-semibold text-sm py-3.5 rounded-xl transition-all hover:shadow-md hover:shadow-blue-100 active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                {loading ? "Connecting…" : "Continue with Google"}
              </button>
            </div>

            {/* Divider */}
            <div className="form-in-2 relative flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-blue-100" />
              <span className="text-blue-300 text-xs font-medium uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-blue-100" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-in-3">
                <label htmlFor="email" className="block text-blue-700 text-xs font-bold uppercase tracking-widest mb-1.5">
                  Email
                </label>
                <input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-800 placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="form-in-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-blue-700 text-xs font-bold uppercase tracking-widest">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-blue-400 text-xs hover:text-blue-600 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput id="password" value={password} onChange={setPassword} />
              </div>

              <div className="form-in-5 pt-1">
                <button
                  type="submit" disabled={loading}
                  className="w-full shimmer-btn text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 disabled:opacity-70 disabled:cursor-wait disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in…
                    </span>
                  ) : "Sign In to FinSet"}
                </button>
              </div>
            </form>

            <p className="text-blue-300 text-xs text-center mt-8">
              By continuing, you agree to FinSet's{" "}
              <a href="#" className="hover:text-blue-500 underline underline-offset-2">Terms</a>{" "}
              &amp;{" "}
              <a href="#" className="hover:text-blue-500 underline underline-offset-2">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}