"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Password strength meter ──────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const levels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];
  const textColors = ["", "text-red-500", "text-yellow-500", "text-blue-500", "text-green-600"];

  if (!password) return null;

  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-blue-100"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map((c) => (
            <span
              key={c.label}
              className={`text-[10px] flex items-center gap-1 transition-colors ${
                c.pass ? "text-green-500" : "text-blue-300"
              }`}
            >
              <span>{c.pass ? "✓" : "·"}</span>
              {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className={`text-xs font-bold shrink-0 ml-2 ${textColors[score]}`}>
            {levels[score]}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Password input with toggle ───────────────────────────────────────────────
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
        {show ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── Feature checklist for left panel ────────────────────────────────────────
function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-base shrink-0">
        {icon}
      </div>
      <span className="text-blue-100 text-sm">{text}</span>
    </div>
  );
}

// ─── Mini chart ───────────────────────────────────────────────────────────────
function MiniChart() {
  const bars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100];
  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end gap-1.5 px-8 opacity-15">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 bg-white rounded-t-lg" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

// ─── Signup Page ──────────────────────────────────────────────────────────────
export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currency, setCurrency] = useState<"USD" | "KHR">("USD");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    // TODO: connect to your auth service
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 2000);
  };

  const handleGoogle = () => {
    setGoogleLoading(true);
    // TODO: trigger Google OAuth
    setTimeout(() => setGoogleLoading(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3 { font-family: 'Sora', sans-serif; }
        @keyframes float-a { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes pop-in { 0%{opacity:0;transform:scale(0.85)} 100%{opacity:1;transform:scale(1)} }
        .form-in   { animation: slide-up 0.5s ease both; }
        .form-in-1 { animation: slide-up 0.5s ease 0.08s both; }
        .form-in-2 { animation: slide-up 0.5s ease 0.16s both; }
        .form-in-3 { animation: slide-up 0.5s ease 0.24s both; }
        .form-in-4 { animation: slide-up 0.5s ease 0.32s both; }
        .form-in-5 { animation: slide-up 0.5s ease 0.40s both; }
        .form-in-6 { animation: slide-up 0.5s ease 0.48s both; }
        .form-in-7 { animation: slide-up 0.5s ease 0.56s both; }
        .shimmer-btn {
          background: linear-gradient(90deg, #2563eb, #1d4ed8, #3b82f6, #2563eb);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .shimmer-btn:hover { animation-play-state: paused; }
        .pop-in { animation: pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .float-pill { animation: float-a 5s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen flex">

        {/* ── Left panel ───────────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] relative bg-blue-600 flex-col overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-900/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <MiniChart />

          {/* Logo */}
          <div className="relative z-10 p-10">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white font-black text-xl font-['Sora',sans-serif] tracking-tight">
                Fin<span className="text-blue-200">Set</span>
              </span>
            </Link>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-16">
            <div className="mb-8">
              <span className="inline-block bg-white/15 border border-white/20 text-blue-100 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                🇰🇭 Cambodia's #1 Finance App
              </span>
              <h2 className="text-white font-black text-3xl font-['Sora',sans-serif] leading-tight mb-3">
                Join 2,800+<br />Cambodians<br />Already Saving
              </h2>
              <p className="text-blue-200 text-sm leading-relaxed">
                Take 30 seconds to set up your account and start tracking your money today.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-3.5">
              <FeatureItem icon="📱" text="Scan KHQR receipts in seconds" />
              <FeatureItem icon="💱" text="Track KHR & USD simultaneously" />
              <FeatureItem icon="🎯" text="Set budgets, get real-time alerts" />
              <FeatureItem icon="📊" text="Beautiful monthly spending reports" />
              <FeatureItem icon="🔒" text="Bank-grade security, always private" />
            </div>

            {/* Social proof pill */}
            <div className="mt-10 inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 float-pill w-fit">
              <div className="flex -space-x-2">
                {["🧑‍💼","👩‍🎓","👨‍🍳"].map((e, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-blue-400 border-2 border-blue-600 flex items-center justify-center text-xs">{e}</div>
                ))}
              </div>
              <div>
                <p className="text-white text-xs font-bold">Trusted by 2,800+ users</p>
                <p className="text-blue-200 text-[10px]">⭐⭐⭐⭐⭐ Average 4.9/5</p>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="relative z-10 p-10 flex items-center gap-3">
            <span className="text-blue-300 text-xs">Available in</span>
            <span className="bg-white/15 text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/20">EN</span>
            <span className="bg-white/15 text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/20">ខ្មែរ</span>
          </div>
        </div>

        {/* ── Right panel: form ─────────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 bg-blue-50 overflow-y-auto">
          <div className="w-full max-w-[440px]">

            {step === "success" ? (
              /* Success state */
              <div className="text-center pop-in">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                  <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-blue-800 font-['Sora',sans-serif] mb-2">You're in! 🎉</h2>
                <p className="text-blue-400 mb-8">
                  Welcome to FinSet, <strong className="text-blue-600">{name || "friend"}</strong>!<br />
                  Your account has been created successfully.
                </p>
                <Link href="/dashboard"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5">
                  Go to Dashboard
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ) : (
              <>
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">FinSet</span>
                </div>

                {/* Heading */}
                <div className="form-in mb-6">
                  <h1 className="text-3xl font-black text-blue-800 font-['Sora',sans-serif] mb-1">
                    Create your account
                  </h1>
                  <p className="text-blue-400 text-sm">
                    Already have one?{" "}
                    <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-2">
                      Log in
                    </Link>
                  </p>
                </div>

                {/* Google button */}
                <div className="form-in-1 mb-5">
                  <button
                    onClick={handleGoogle}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-blue-200 hover:border-blue-300 text-blue-700 font-semibold text-sm py-3.5 rounded-xl transition-all hover:shadow-md hover:shadow-blue-100 active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait"
                  >
                    {googleLoading ? (
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
                    {googleLoading ? "Connecting…" : "Sign up with Google"}
                  </button>
                </div>

                {/* Divider */}
                <div className="form-in-2 relative flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-blue-100" />
                  <span className="text-blue-300 text-xs font-medium uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-blue-100" />
                </div>

                {/* Form fields */}
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Full name */}
                  <div className="form-in-3">
                    <label htmlFor="name" className="block text-blue-700 text-xs font-bold uppercase tracking-widest mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sophea Chan"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-800 placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="form-in-4">
                    <label htmlFor="email" className="block text-blue-700 text-xs font-bold uppercase tracking-widest mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-800 placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div className="form-in-4">
                    <label htmlFor="password" className="block text-blue-700 text-xs font-bold uppercase tracking-widest mb-1.5">
                      Password
                    </label>
                    <PasswordInput id="password" value={password} onChange={setPassword} placeholder="Create a strong password" />
                    <PasswordStrength password={password} />
                  </div>

                  {/* Currency preference */}
                  <div className="form-in-5">
                    <label className="block text-blue-700 text-xs font-bold uppercase tracking-widest mb-2">
                      Primary Currency
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["USD", "KHR"] as const).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCurrency(c)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                            currency === c
                              ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                              : "border-blue-100 bg-white text-blue-600 hover:border-blue-200"
                          }`}
                        >
                          <span className="text-lg">{c === "USD" ? "🇺🇸" : "🇰🇭"}</span>
                          <div className="text-left">
                            <p className={`font-bold text-sm ${currency === c ? "text-white" : "text-blue-800"}`}>{c}</p>
                            <p className={`text-[10px] ${currency === c ? "text-blue-200" : "text-blue-400"}`}>
                              {c === "USD" ? "US Dollar" : "Cambodian Riel"}
                            </p>
                          </div>
                          {currency === c && (
                            <svg className="w-4 h-4 ml-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-blue-300 text-[10px] mt-1.5">You can use both KHR and USD at any time. This is just your default view.</p>
                  </div>

                  {/* Terms */}
                  <div className="form-in-6 flex items-start gap-2.5">
                    <input
                      id="agree"
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-blue-200 text-blue-600 focus:ring-blue-500 accent-blue-600 shrink-0"
                    />
                    <label htmlFor="agree" className="text-blue-500 text-sm leading-relaxed cursor-pointer select-none">
                      I agree to FinSet's{" "}
                      <a href="#" className="text-blue-600 font-semibold underline underline-offset-2 hover:text-blue-700">Terms of Service</a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 font-semibold underline underline-offset-2 hover:text-blue-700">Privacy Policy</a>
                    </label>
                  </div>

                  {/* Submit */}
                  <div className="form-in-7 pt-1">
                    <button
                      type="submit"
                      disabled={loading || !agreed}
                      className="w-full shimmer-btn text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:animation-none"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Creating your account…
                        </span>
                      ) : "Create Free Account →"}
                    </button>
                  </div>
                </form>

                {/* Free tag */}
                <div className="mt-5 flex items-center justify-center gap-2 text-blue-300 text-xs">
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Free forever &nbsp;·&nbsp;
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  No credit card &nbsp;·&nbsp;
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Setup in 30 sec
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}