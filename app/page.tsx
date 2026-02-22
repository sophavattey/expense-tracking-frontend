"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import { useInView, useCounter } from "@/hooks/useInView";

// ─── Global styles ───────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
  * { font-family: 'DM Sans', sans-serif; }
  h1, h2, h3 { font-family: 'Sora', sans-serif; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes float-slow { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(3deg)} }
  .float { animation: float 4s ease-in-out infinite; }
  .float-slow { animation: float-slow 6s ease-in-out infinite; }
  .hero-blob { position:absolute; border-radius:50%; filter:blur(80px); opacity:0.15; }
`;

// ─── KHQR Interactive Phone ──────────────────────────────────────────────────
function KHQRPhone() {
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanned(true); }, 1800);
  };

  return (
    <div className="relative w-[260px] mx-auto select-none">
      <div className="rounded-[2.5rem] bg-gradient-to-b from-slate-800 to-slate-900 p-3 shadow-2xl shadow-blue-900/40 border border-slate-700">
        <div className="rounded-[2rem] bg-blue-50 overflow-hidden">
          <div className="bg-blue-600 px-4 py-2 flex justify-between items-center">
            <span className="text-white text-xs font-semibold tracking-wide">FinSet</span>
            <span className="text-blue-200 text-xs">9:41 AM</span>
          </div>
          <div className="p-4">
            {!scanned ? (
              <>
                <p className="text-blue-800 text-xs font-bold mb-3 text-center uppercase tracking-widest">KHQR Receipt</p>
                <div className="relative w-36 h-36 mx-auto mb-3 rounded-xl overflow-hidden cursor-pointer" onClick={handleScan}>
                  <div className="w-full h-full bg-white border-2 border-blue-200 rounded-xl grid grid-cols-7 grid-rows-7 gap-0.5 p-2">
                    {Array.from({ length: 49 }).map((_, i) => {
                      const row = Math.floor(i / 7), col = i % 7;
                      const isCorner = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2);
                      const isBorder = (row === 0 || row === 1 || row === 6) || (col === 0 || col === 6) || (row > 4 && col <= 1);
                      const rand = ((i * 37 + 13) % 3) === 0;
                      return <div key={i} className={`rounded-sm ${isCorner || isBorder || rand ? "bg-blue-800" : "bg-transparent"}`} />;
                    })}
                  </div>
                  {scanning && (
                    <div className="absolute inset-0 bg-blue-600/20 rounded-xl flex items-center justify-center">
                      <div className="w-full h-0.5 bg-blue-400/80 animate-bounce" />
                    </div>
                  )}
                </div>
                <button onClick={handleScan} disabled={scanning}
                  className={`w-full py-2 rounded-xl text-xs font-bold text-white transition-all ${scanning ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}>
                  {scanning ? "Scanning…" : "Tap to Scan QR"}
                </button>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-green-600 text-xs font-bold">Logged!</p>
                    <p className="text-blue-400 text-[10px]">Auto-categorized</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-blue-800 text-xs font-semibold">🏪 Brown Coffee</span>
                    <span className="text-red-500 text-xs font-bold">-$3.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400 text-[10px]">Food & Drink</span>
                    <span className="text-blue-400 text-[10px]">₭14,000</span>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm">
                  <p className="text-blue-800 text-[10px] font-semibold mb-1.5">Budget Remaining</p>
                  <div className="w-full bg-blue-100 rounded-full h-1.5 mb-1">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "62%" }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400 text-[10px]">Food: $38 left</span>
                    <span className="text-blue-600 text-[10px] font-bold">62%</span>
                  </div>
                </div>
                <button onClick={() => setScanned(false)}
                  className="w-full mt-3 py-1.5 rounded-xl text-[10px] font-bold text-blue-600 border border-blue-200 hover:bg-blue-50">
                  Scan Another
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-2xl -z-10" />
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, inView } = useInView();
  const count = useCounter(value, 2000, inView);
  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-black text-white font-['Sora',sans-serif] tabular-nums">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-blue-200 text-sm mt-1">{label}</p>
    </div>
  );
}

// ─── Dashboard Preview ───────────────────────────────────────────────────────
function DashboardPreview() {
  return (
    <div className="relative">
      <div className="bg-white rounded-3xl shadow-2xl shadow-blue-200/60 overflow-hidden border border-blue-100">
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs font-medium">Good Morning,</p>
            <p className="text-white font-bold">Sophea 👋</p>
          </div>
          <div className="bg-blue-500/50 rounded-xl px-3 py-1.5 text-xs text-white font-semibold">February 2025</div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-blue-400 text-xs mb-1">USD Balance</p>
              <p className="text-blue-800 text-2xl font-black">$1,245</p>
              <span className="text-green-500 text-xs font-semibold">↑ +12.4%</span>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-blue-400 text-xs mb-1">KHR Balance</p>
              <p className="text-blue-800 text-2xl font-black">₭2.1M</p>
              <span className="text-red-500 text-xs font-semibold">↓ -3.2%</span>
            </div>
          </div>
          <p className="text-blue-800 text-sm font-bold mb-3">Recent Transactions</p>
          {[
            { icon: "🛒", name: "Lucky Supermarket", cat: "Groceries", amount: "-$23.50", time: "2h ago", color: "text-red-500" },
            { icon: "🏍️", name: "PassApp Tuk-tuk", cat: "Transport", amount: "-₭8,000", time: "4h ago", color: "text-red-500" },
            { icon: "💵", name: "Salary Deposit", cat: "Income", amount: "+$500", time: "1d ago", color: "text-green-500" },
          ].map((tx) => (
            <div key={tx.name} className="flex items-center justify-between py-2.5 border-b border-blue-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-base">{tx.icon}</div>
                <div>
                  <p className="text-blue-800 text-xs font-semibold">{tx.name}</p>
                  <p className="text-blue-300 text-[10px]">{tx.cat} · {tx.time}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${tx.color}`}>{tx.amount}</span>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-blue-50">
            <div className="flex justify-between mb-2">
              <p className="text-blue-800 text-xs font-bold">Monthly Budget</p>
              <p className="text-blue-400 text-xs">$312 / $500</p>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full relative" style={{ width: "62%" }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow" />
              </div>
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-blue-400 text-[10px]">62% used</span>
              <span className="text-green-500 text-[10px] font-semibold">$188 remaining</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl -z-10" />
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
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

        {/* Navbar */}
        <Navbar />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          <div className="hero-blob w-[500px] h-[500px] bg-blue-500 -top-32 -right-32" />
          <div className="hero-blob w-[400px] h-[400px] bg-blue-300 bottom-0 -left-48" />
          <div className="hero-blob w-[300px] h-[300px] bg-green-400 top-1/2 right-1/4" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(90deg, #1e40af 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />

          <div className="max-w-6xl mx-auto px-6 py-20 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Copy */}
              <div>
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-blue-200 rounded-full px-4 py-1.5 mb-8 shadow-sm"
                  style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(-16px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">🇰🇭 Built for Cambodia</span>
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
                  FinSet is Cambodia's smartest personal finance app. Track expenses in KHR & USD,
                  scan KHQR receipts instantly, and stay on budget — all in one place.
                </p>

                <div className="flex flex-wrap gap-4" style={fadeIn(300)}>
                  <a href="/signup" className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-95">
                    Start for Free
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a href="#how-it-works" className="bg-white hover:bg-blue-50 text-blue-600 font-bold px-7 py-3.5 rounded-2xl border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-0.5">
                    See How It Works
                  </a>
                </div>

                <div className="flex items-center gap-4 mt-10 pt-8 border-t border-blue-200/60" style={{ opacity: heroVisible ? 1 : 0, transition: "opacity 0.8s ease 500ms" }}>
                  <div className="flex -space-x-2">
                    {["🧑‍💼","👩‍🎓","👨‍🍳","👩‍💻","🧑‍🏫"].map((e, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-blue-50 flex items-center justify-center text-sm shadow">{e}</div>
                    ))}
                  </div>
                  <div>
                    <div className="flex text-yellow-400 text-sm">★★★★★</div>
                    <p className="text-blue-400 text-xs mt-0.5">Loved by <strong className="text-blue-600">2,800+</strong> Cambodians</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex justify-center lg:justify-end" style={fadeIn(400)}>
                <div className="relative float">
                  <KHQRPhone />
                  <div className="absolute -left-12 top-16 bg-white rounded-2xl px-3 py-2 shadow-lg border border-blue-100 float-slow" style={{ animationDelay: "1s" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 text-lg">↑</span>
                      <div>
                        <p className="text-[10px] text-blue-400">Saved this month</p>
                        <p className="text-blue-800 text-xs font-black">$124.50</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-10 bottom-24 bg-white rounded-2xl px-3 py-2 shadow-lg border border-blue-100 float-slow" style={{ animationDelay: "2s" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💳</span>
                      <div>
                        <p className="text-[10px] text-blue-400">KHQR Scanned</p>
                        <p className="text-blue-800 text-xs font-black">₭87,500</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <section className="bg-blue-600 py-14">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard value={2800}  suffix="+" label="Active Users" />
              <StatCard value={98000} suffix="+" label="Expenses Tracked" />
              <StatCard value={45}    suffix="+" label="KHQR Merchants" />
              <StatCard value={99}    suffix="%" label="Uptime" />
            </div>
          </div>
        </section>

        {/* Features */}
        <Features />

        {/* How It Works */}
        <HowItWorks />

        {/* ── Currency Showcase ──────────────────────────────────────────── */}
        <section className="py-24 bg-blue-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <DashboardPreview />
              <div>
                <span className="text-blue-400 text-sm font-bold uppercase tracking-widest">Dual Currency</span>
                <h2 className="text-4xl font-black text-blue-800 mt-3 mb-6 font-['Sora',sans-serif]">
                  Riel or Dollar?<br />
                  <span className="text-blue-600">FinSet Handles Both.</span>
                </h2>
                <p className="text-blue-500 leading-relaxed mb-8">
                  Cambodia's unique dual-currency economy is no problem for FinSet. Automatically
                  track KHR and USD transactions, view live exchange rates, and see your total
                  wealth in either currency — at any time.
                </p>
                <div className="space-y-4">
                  {[
                    { emoji: "💱", title: "Live Exchange Rates", desc: "Up-to-date KHR/USD rates from NBC (National Bank of Cambodia)" },
                    { emoji: "🔄", title: "Instant Conversion", desc: "Switch your dashboard between KHR and USD in one tap" },
                    { emoji: "📊", title: "Mixed Currency Reports", desc: "Monthly reports that unify both currencies into clear totals" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg shrink-0">{item.emoji}</div>
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

        {/* Pricing */}
        <Pricing />

        {/* ── Final CTA ─────────────────────────────────────────────────── */}
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
              Join thousands of Cambodians who've transformed their financial habits with FinSet.
              Start free, no credit card required.
            </p>
            <a href="/signup" className="inline-flex items-center gap-2 bg-white text-blue-600 font-black text-lg px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all hover:shadow-2xl hover:shadow-blue-900/30 hover:-translate-y-0.5 active:scale-95">
              Create Free Account
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <p className="text-blue-300 text-sm mt-4">Free forever · No credit card · Available in English & ខ្មែរ</p>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}