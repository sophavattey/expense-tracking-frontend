"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wallet, BarChart3, Receipt, Users, Shield,
  Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight
} from "lucide-react";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters",     pass: password.length >= 8 },
    { label: "Uppercase letter",  pass: /[A-Z]/.test(password) },
    { label: "Number",            pass: /[0-9]/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const levels     = ["", "Weak",      "Fair",          "Good",          "Strong"      ];
  const colors     = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400",   "bg-green-500"];
  const textColors = ["", "text-red-500","text-yellow-500","text-blue-500","text-green-600"];
  if (!password) return null;
  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : "bg-gray-200"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map((c) => (
            <span key={c.label} className={`text-[10px] flex items-center gap-1 transition-colors ${c.pass ? "text-green-500" : "text-gray-400"}`}>
              {c.pass ? <CheckCircle2 size={10} /> : <span className="text-[8px]">·</span>}
              {c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span className={`text-xs font-bold shrink-0 ml-2 ${textColors[score]}`}>{levels[score]}</span>}
      </div>
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder, id }: {
  value: string; onChange: (v: string) => void; placeholder?: string; id?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={show ? "text" : "password"} value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "••••••••"}
        className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      <button type="button" onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={show ? "Hide password" : "Show password"}>
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function FeatureItem({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-blue-100" strokeWidth={1.8} />
      </div>
      <span className="text-blue-100 text-sm">{text}</span>
    </div>
  );
}

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

export default function SignupPage() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  const [agreed,   setAgreed]   = useState(false);
  const [step,     setStep]     = useState<"form" | "success">("form");

  const { register, loginWithGoogle, loading, error, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    clearError();
    try { await register(name, email, password); setStep("success"); } catch {}
  };

  const handleGoogle = () => { clearError(); loginWithGoogle(); };

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
        .pop-in   { animation: pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .float-pill { animation: float-a 5s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen flex">

        {/* ── Left panel — untouched blue branding ── */}
        <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] relative bg-blue-600 flex-col overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-900/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <MiniChart />

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

          <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-16">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-blue-100 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Users size={12} strokeWidth={2} />
                Personal, Couple &amp; Family
              </div>
              <h2 className="text-white font-black text-3xl font-['Sora',sans-serif] leading-tight mb-3">
                Plan Together,<br />Spend Smarter
              </h2>
              <p className="text-blue-200 text-sm leading-relaxed">
                Take 30 seconds to set up your account and start tracking your money today.
              </p>
            </div>
            <div className="space-y-3.5">
              <FeatureItem icon={Receipt}   text="Track every expense by category" />
              <FeatureItem icon={BarChart3} text="Set budgets and get overspend alerts" />
              <FeatureItem icon={Users}     text="Share finances with partner or family" />
              <FeatureItem icon={Shield}    text="Bank-grade security, always private" />
            </div>
            <div className="mt-10 inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 float-pill w-fit">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Users size={18} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Trusted by 2,800+ users</p>
                <p className="text-blue-200 text-[10px]">Average 4.9 / 5 rating</p>
              </div>
            </div>
          </div>
          <div className="relative z-10 p-10" />
        </div>

        {/* ── Right panel — gray palette ── */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 bg-gray-50 overflow-y-auto">
          <div className="w-full max-w-[440px]">

            {step === "success" ? (
              <div className="text-center pop-in">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                  <CheckCircle2 size={40} className="text-green-500" strokeWidth={1.8} />
                </div>
                <h2 className="text-3xl font-black text-gray-800 font-['Sora',sans-serif] mb-2">You're in!</h2>
                <p className="text-gray-400 mb-8">
                  Welcome to FinSet, <strong className="text-blue-600">{name || "friend"}</strong>!<br />
                  Your account has been created successfully.
                </p>
                <Link href="/dashboard"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5">
                  Go to Dashboard
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <>
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Wallet size={15} className="text-white" strokeWidth={2} />
                  </div>
                  <span className="text-gray-800 font-black text-xl font-['Sora',sans-serif]">FinSet</span>
                </div>

                <div className="form-in mb-6">
                  <h1 className="text-3xl font-black text-gray-800 font-['Sora',sans-serif] mb-1">Create your account</h1>
                  <p className="text-gray-400 text-sm">
                    Already have one?{" "}
                    <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-2">Log in</Link>
                  </p>
                </div>

                {error && (
                  <div className="form-in mb-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                  </div>
                )}

                {/* Google */}
                <div className="form-in-1 mb-5">
                  <button onClick={handleGoogle} disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-sm py-3.5 rounded-xl transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait">
                    {loading ? (
                      <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                    {loading ? "Connecting…" : "Sign up with Google"}
                  </button>
                </div>

                <div className="form-in-2 relative flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-in-3">
                    <label htmlFor="name" className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1.5">Full Name</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Sophea Chan" required autoComplete="name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>

                  <div className="form-in-4">
                    <label htmlFor="email" className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1.5">Email Address</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" required autoComplete="email"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>

                  <div className="form-in-4">
                    <label htmlFor="password" className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1.5">Password</label>
                    <PasswordInput id="password" value={password} onChange={setPassword} placeholder="Create a strong password" />
                    <PasswordStrength password={password} />
                  </div>

                  <div className="form-in-5 flex items-start gap-2.5">
                    <input id="agree" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 shrink-0" />
                    <label htmlFor="agree" className="text-gray-500 text-sm leading-relaxed cursor-pointer select-none">
                      I agree to FinSet's{" "}
                      <a href="#" className="text-blue-600 font-semibold underline underline-offset-2 hover:text-blue-700">Terms of Service</a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 font-semibold underline underline-offset-2 hover:text-blue-700">Privacy Policy</a>
                    </label>
                  </div>

                  <div className="form-in-6 pt-1">
                    <button type="submit" disabled={loading || !agreed}
                      className="w-full shimmer-btn text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Creating your account…
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Create Free Account <ArrowRight size={16} />
                        </span>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-5 flex items-center justify-center gap-4 text-gray-400 text-xs">
                  {[
                    { icon: CheckCircle2, label: "Free forever"    },
                    { icon: Shield,       label: "No credit card"  },
                    { icon: Users,        label: "Family-friendly" },
                  ].map(({ icon: Icon, label }) => (
                    <span key={label} className="flex items-center gap-1">
                      <Icon size={11} className="text-green-400" strokeWidth={2.5} />
                      {label}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}