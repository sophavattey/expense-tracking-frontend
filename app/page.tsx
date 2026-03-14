"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import {
  TrendingDown, ShoppingBag, Car, ArrowLeftRight,
  TrendingUp, ChevronRight, MapPin, Users, BarChart2,
} from "lucide-react";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
  * { font-family: 'DM Sans', sans-serif; }
  h1, h2, h3 { font-family: 'Sora', sans-serif; }
  @keyframes float      { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-12px)} }
  @keyframes float-slow { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(3deg)} }
  .float      { animation: float      4s ease-in-out infinite; }
  .float-slow { animation: float-slow 6s ease-in-out infinite; }
  .hero-blob  { position:absolute; border-radius:50%; filter:blur(80px); opacity:0.15; }
`;

/* ─── Google avatar URL (real public avatar placeholder) ─── */
const GOOGLE_AVATAR = "https://lh3.googleusercontent.com/a/ACg8ocKtBv8aHe1dDEGT_2TbzCWiGQHfWHJJtCkuTz5BaCp6Yg=s96-c";

/* ─── Transactions shown in phone mockup ─── */
const DEMO_TX = [
  { Icon: ShoppingBag, name: "Lucky Supermarket", cat: "Groceries",   amount: "-$23.50", khr: "₭94,000", iconBg: "bg-orange-50", iconColor: "text-orange-500" },
  { Icon: Car,         name: "PassApp Ride",      cat: "Transport",    amount: "-$2.00",  khr: "₭8,000",  iconBg: "bg-blue-50",   iconColor: "text-blue-500"   },
  { Icon: TrendingDown,name: "Dinner with friends",cat: "Food & Drink", amount: "-$8.75",  khr: "₭35,000", iconBg: "bg-red-50",    iconColor: "text-red-400"    },
];

/* ─── Phone Mockup ─── */
function PhoneMockup() {
  return (
    <div className="relative w-[260px] mx-auto select-none">
      <div className="rounded-[2.5rem] bg-gradient-to-b from-slate-800 to-slate-900 p-3 shadow-2xl shadow-blue-900/40 border border-slate-700">
        <div className="rounded-[2rem] bg-slate-50 overflow-hidden">

          {/* Status bar */}
          <div className="bg-blue-600 px-4 pt-3 pb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white text-xs font-semibold">FinSet</span>
              <span className="text-blue-200 text-xs">9:41</span>
            </div>
            {/* User row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={GOOGLE_AVATAR}
                  alt="Sophea"
                  className="w-8 h-8 rounded-full ring-2 ring-white/30 object-cover"
                  onError={(e) => {
                    /* fallback to initials if avatar fails */
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "flex";
                  }}
                />
                <div
                  className="w-8 h-8 rounded-full bg-blue-500 ring-2 ring-white/30 items-center justify-center text-white text-xs font-bold hidden"
                  aria-hidden>S</div>
                <div>
                  <p className="text-blue-200 text-[10px]">Good morning</p>
                  <p className="text-white text-xs font-bold">Sophea</p>
                </div>
              </div>
              <div className="bg-white/15 rounded-lg px-2 py-1">
                <span className="text-white text-[10px] font-semibold">Mar 2026</span>
              </div>
            </div>
          </div>

          <div className="p-3 space-y-3">
            {/* Spent card */}
            <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="text-blue-400 text-[10px] font-semibold uppercase tracking-wider">Total Spent</p>
                <div className="w-5 h-5 rounded-lg bg-red-50 flex items-center justify-center">
                  <TrendingDown size={11} strokeWidth={2} className="text-red-400" />
                </div>
              </div>
              <p className="text-blue-800 text-xl font-black">$34.25</p>
              <p className="text-blue-300 text-[10px]">₭137,000 · March 2026</p>
              <div className="mt-2 w-full bg-blue-50 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "34%" }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-blue-300 text-[9px]">34% of $100 budget</span>
                <span className="text-green-500 text-[9px] font-semibold">$65.75 left</span>
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
              <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
                <p className="text-blue-700 text-[11px] font-bold">Recent</p>
                <ChevronRight size={12} strokeWidth={2.5} className="text-blue-300" />
              </div>
              {DEMO_TX.map((tx) => (
                <div key={tx.name} className="flex items-center gap-2.5 px-3 py-2 border-t border-blue-50">
                  <div className={`w-7 h-7 rounded-lg ${tx.iconBg} flex items-center justify-center shrink-0`}>
                    <tx.Icon size={13} strokeWidth={1.75} className={tx.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-blue-800 text-[10px] font-semibold truncate">{tx.name}</p>
                    <p className="text-blue-300 text-[9px]">{tx.cat}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-red-500 text-[10px] font-bold">{tx.amount}</p>
                    <p className="text-blue-300 text-[9px]">{tx.khr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-2xl -z-10" />
    </div>
  );
}

/* ─── Dashboard Preview ─── */
function DashboardPreview() {
  return (
    <div className="relative">
      <div className="bg-white rounded-3xl shadow-2xl shadow-blue-200/60 overflow-hidden border border-blue-100">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={GOOGLE_AVATAR}
              alt="Sophea"
              className="w-9 h-9 rounded-full ring-2 ring-white/30 object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "flex";
              }}
            />
            <div className="w-9 h-9 rounded-full bg-blue-500 ring-2 ring-white/30 items-center justify-center text-white text-sm font-bold hidden" aria-hidden>S</div>
            <div>
              <p className="text-blue-200 text-xs">Good morning</p>
              <p className="text-white font-bold text-sm">Sophea</p>
            </div>
          </div>
          <div className="bg-blue-500/50 rounded-xl px-3 py-1.5 text-xs text-white font-semibold">March 2026</div>
        </div>

        <div className="p-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingDown size={12} strokeWidth={2} className="text-red-400" />
                <p className="text-blue-400 text-xs">Total Spent</p>
              </div>
              <p className="text-blue-800 text-2xl font-black">$124</p>
              <p className="text-blue-300 text-xs mt-0.5">₭496,000</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={12} strokeWidth={2} className="text-green-500" />
                <p className="text-blue-400 text-xs">Remaining</p>
              </div>
              <p className="text-blue-800 text-2xl font-black">$176</p>
              <p className="text-green-500 text-xs mt-0.5 font-semibold">59% budget left</p>
            </div>
          </div>

          {/* Transactions */}
          <p className="text-blue-800 text-sm font-bold mb-3">Recent Transactions</p>
          {[
            { Icon: ShoppingBag, name: "Lucky Supermarket", cat: "Groceries",   amount: "-$23.50", iconBg: "bg-orange-50", iconColor: "text-orange-500" },
            { Icon: Car,         name: "PassApp Ride",      cat: "Transport",    amount: "-$2.00",  iconBg: "bg-blue-50",   iconColor: "text-blue-500"   },
            { Icon: TrendingDown,name: "Dinner",            cat: "Food & Drink", amount: "-$8.75",  iconBg: "bg-red-50",    iconColor: "text-red-400"    },
          ].map((tx) => (
            <div key={tx.name} className="flex items-center justify-between py-2.5 border-b border-blue-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${tx.iconBg} flex items-center justify-center`}>
                  <tx.Icon size={16} strokeWidth={1.75} className={tx.iconColor} />
                </div>
                <div>
                  <p className="text-blue-800 text-xs font-semibold">{tx.name}</p>
                  <p className="text-blue-300 text-[10px]">{tx.cat}</p>
                </div>
              </div>
              <span className="text-red-500 text-sm font-bold">{tx.amount}</span>
            </div>
          ))}

          {/* Budget bar */}
          <div className="mt-4 pt-4 border-t border-blue-50">
            <div className="flex justify-between mb-2">
              <p className="text-blue-800 text-xs font-bold">Monthly Budget</p>
              <p className="text-blue-400 text-xs">$124 / $300</p>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2.5">
              <div className="bg-linear-to-r from-blue-500 to-blue-400 h-2.5 rounded-full relative" style={{ width: "41%" }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow" />
              </div>
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-blue-400 text-[10px]">41% used</span>
              <span className="text-green-500 text-[10px] font-semibold">$176 remaining</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl -z-10" />
    </div>
  );
}

/* ─── Landing Page ─── */
export default function LandingPage() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const fadeIn = (delay = 0): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? "translateY(0)" : "translateY(32px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  });

  return (
    <>
      <style>{globalStyles}</style>
      <div className="min-h-screen bg-blue-50 overflow-x-hidden">

        <Navbar />

        {/* ── Hero ─── */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          <div className="hero-blob w-[500px] h-[500px] bg-blue-500 -top-32 -right-32" />
          <div className="hero-blob w-[400px] h-[400px] bg-blue-300 bottom-0 -left-48" />
          <div className="hero-blob w-[300px] h-[300px] bg-green-400 top-1/2 right-1/4" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(#1e40af 1px, transparent 1px),linear-gradient(90deg,#1e40af 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

          <div className="max-w-6xl mx-auto px-6 py-20 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Copy */}
              <div>
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-blue-200 rounded-full px-4 py-1.5 mb-8 shadow-sm"
                  style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(-16px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <MapPin size={11} strokeWidth={2.5} className="text-blue-500" />
                  <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Built for Cambodia</span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-black text-blue-800 leading-[1.05] mb-6" style={fadeIn(100)}>
                  Master Your
                  <span className="block text-blue-600 relative">
                    Finances
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 240 12" fill="none">
                      <path d="M2 9 Q60 3 120 7 Q180 11 238 5" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                  in Riel & Dollar
                </h1>

                <p className="text-blue-500 text-lg leading-relaxed mb-8 max-w-md" style={fadeIn(200)}>
                  FinSet is Cambodia's personal finance app. Track expenses in KHR & USD,
                  manage budgets, and collaborate with groups — all in one place.
                </p>

                <div className="flex flex-wrap gap-4" style={fadeIn(300)}>
                  <a href="/signup"
                    className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-95">
                    Start for Free
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a href="#how-it-works"
                    className="bg-white hover:bg-blue-50 text-blue-600 font-bold px-7 py-3.5 rounded-2xl border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-0.5">
                    See How It Works
                  </a>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 mt-8" style={fadeIn(400)}>
                  {[
                    { Icon: TrendingDown,   label: "Expense Tracking" },
                    { Icon: Users,          label: "Group Budgets"    },
                    { Icon: ArrowLeftRight, label: "KHR + USD"        },
                    { Icon: BarChart2,      label: "Analytics"        },
                  ].map(({ Icon, label }) => (
                    <span key={label} className="inline-flex items-center gap-1.5 bg-white/80 border border-blue-200 text-blue-500 text-xs font-semibold px-3 py-1.5 rounded-full">
                      <Icon size={11} strokeWidth={2.5} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div className="flex justify-center lg:justify-end" style={fadeIn(400)}>
                <div className="relative float">
                  <PhoneMockup />
                  {/* Floating badges */}
                  <div className="absolute -left-14 top-20 bg-white rounded-2xl px-3 py-2 shadow-lg border border-blue-100 float-slow" style={{ animationDelay: "1s" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                        <TrendingUp size={14} strokeWidth={2} className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-blue-400">Saved this month</p>
                        <p className="text-blue-800 text-xs font-black">$124.50</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-12 bottom-28 bg-white rounded-2xl px-3 py-2 shadow-lg border border-blue-100 float-slow" style={{ animationDelay: "2s" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <Users size={14} strokeWidth={2} className="text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-blue-400">Group Budget</p>
                        <p className="text-blue-800 text-xs font-black">3 members</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features */}
        <Features />

        {/* How It Works */}
        <HowItWorks />

        {/* ── Dual Currency Showcase ─── */}
        <section className="py-24 bg-blue-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <DashboardPreview />
              <div>
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Dual Currency</span>
                <h2 className="text-4xl font-black text-blue-800 mt-3 mb-6 font-['Sora',sans-serif]">
                  Riel or Dollar?<br />
                  <span className="text-blue-600">FinSet Handles Both.</span>
                </h2>
                <p className="text-blue-500 leading-relaxed mb-8 text-sm">
                  Cambodia's unique dual-currency economy is no problem for FinSet. Every expense
                  is stored in USD and instantly shown in KHR — switch your preferred currency
                  in settings and all amounts update everywhere.
                </p>
                <div className="space-y-4">
                  {[
                    { Icon: ArrowLeftRight, iconBg: "bg-blue-100",  iconColor: "text-blue-600",  title: "Dual Display",       desc: "Every amount shown in both KHR and USD simultaneously, everywhere in the app" },
                    { Icon: TrendingUp,     iconBg: "bg-green-100", iconColor: "text-green-600", title: "Preferred Currency", desc: "Set KHR or USD as your primary — dashboards, stats, and budgets all follow" },
                    { Icon: BarChart2,      iconBg: "bg-cyan-100",  iconColor: "text-cyan-600",  title: "Unified Reports",    desc: "Monthly reports that unify both currencies into clear totals you can actually read" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 items-start">
                      <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                        <item.Icon size={18} strokeWidth={1.75} className={item.iconColor} />
                      </div>
                      <div>
                        <p className="text-blue-800 font-bold text-sm">{item.title}</p>
                        <p className="text-blue-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ─── */}
        <section className="py-24 bg-blue-600 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-800/40 rounded-full blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto px-6 text-center relative">
            <h2 className="text-5xl font-black text-white mb-6 font-['Sora',sans-serif]">
              Take Control of<br />Your Money Today
            </h2>
            <p className="text-blue-200 text-lg mb-10">
              Start tracking your expenses, set budgets, and build better financial habits — free, no credit card needed.
            </p>
            <a href="/signup"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-black text-lg px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all hover:shadow-2xl hover:shadow-blue-900/30 hover:-translate-y-0.5 active:scale-95">
              Create Free Account
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <p className="text-blue-300 text-sm mt-4">Free forever · No credit card · Available in English & ខ្មែរ</p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}