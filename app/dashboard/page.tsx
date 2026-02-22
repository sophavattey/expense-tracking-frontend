"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCurrency } from "@/contexts/CurrencyContext";

/* ═══════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════ */
const TRANSACTIONS = [
  { id:1,  icon:"🛒", name:"Lucky Supermarket",   cat:"Groceries",     amount:-23.50, khr:-94000,   date:"Today, 10:24 AM",  method:"KHQR" },
  { id:2,  icon:"☕", name:"Brown Coffee",         cat:"Food & Drink",  amount:-3.50,  khr:-14000,   date:"Today, 08:15 AM",  method:"KHQR" },
  { id:3,  icon:"🏍️",name:"PassApp Ride",          cat:"Transport",     amount:-2.00,  khr:-8000,    date:"Today, 07:50 AM",  method:"Cash" },
  { id:4,  icon:"💵", name:"Salary Deposit",       cat:"Income",        amount:500.00, khr:2000000,  date:"Feb 20, 09:00 AM", method:"Bank" },
  { id:5,  icon:"💊", name:"U-Care Pharmacy",      cat:"Health",        amount:-12.00, khr:-48000,   date:"Feb 20, 02:30 PM", method:"KHQR" },
  { id:6,  icon:"🎮", name:"Steam Games",          cat:"Entertainment", amount:-19.99, khr:-79960,   date:"Feb 19, 06:00 PM", method:"Card" },
  { id:7,  icon:"⚡", name:"EDC Electricity Bill", cat:"Utilities",     amount:-35.00, khr:-140000,  date:"Feb 19, 11:00 AM", method:"ABA"  },
  { id:8,  icon:"🍜", name:"Restaurant Malis",     cat:"Food & Drink",  amount:-18.00, khr:-72000,   date:"Feb 18, 12:45 PM", method:"KHQR" },
  { id:9,  icon:"📱", name:"Metfone Top-up",       cat:"Utilities",     amount:-10.00, khr:-40000,   date:"Feb 18, 09:00 AM", method:"App"  },
  { id:10, icon:"🛍️",name:"Aeon Mall Shopping",   cat:"Shopping",      amount:-55.00, khr:-220000,  date:"Feb 17, 04:00 PM", method:"Card" },
];

const BUDGETS = [
  { cat:"Food & Drink",  icon:"🍜", spent:156, limit:200, color:"bg-blue-500"   },
  { cat:"Groceries",     icon:"🛒", spent:87,  limit:150, color:"bg-green-500"  },
  { cat:"Transport",     icon:"🏍️", spent:42,  limit:60,  color:"bg-yellow-400" },
  { cat:"Shopping",      icon:"🛍️", spent:55,  limit:100, color:"bg-blue-400"   },
  { cat:"Utilities",     icon:"⚡", spent:45,  limit:50,  color:"bg-red-400"    },
  { cat:"Entertainment", icon:"🎮", spent:20,  limit:30,  color:"bg-green-400"  },
];

const CATEGORY_DATA = [
  { cat:"Food & Drink",  pct:34, color:"#2563eb", amount:174 },
  { cat:"Groceries",     pct:17, color:"#22c55e", amount:87  },
  { cat:"Shopping",      pct:11, color:"#60a5fa", amount:55  },
  { cat:"Utilities",     pct:9,  color:"#facc15", amount:45  },
  { cat:"Transport",     pct:8,  color:"#34d399", amount:42  },
  { cat:"Health",        pct:5,  color:"#f87171", amount:12  },
  { cat:"Entertainment", pct:4,  color:"#a78bfa", amount:20  },
  { cat:"Others",        pct:12, color:"#94a3b8", amount:62  },
];

const MONTHLY_SPEND = [180,240,195,320,280,350,310,290,410,380,420,497];
const MONTHS        = ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];

/* ═══════════════════════════════════════════════════════════════════
   DONUT CHART
═══════════════════════════════════════════════════════════════════ */
function DonutChart({ total }: { total: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const size = 160, r = 58, stroke = 20, circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = CATEGORY_DATA.map((d, i) => {
    const len = (d.pct / 100) * circ;
    const s = { ...d, offset: circ - offset, len, i };
    offset += len;
    return s;
  });
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {slices.map(s => (
            <circle key={s.i} cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={s.color}
              strokeWidth={hovered === s.i ? stroke + 5 : stroke}
              strokeDasharray={`${s.len - 2} ${circ - s.len + 2}`}
              strokeDashoffset={s.offset}
              strokeLinecap="round"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHovered(s.i)}
              onMouseLeave={() => setHovered(null)}
              style={{ opacity: hovered !== null && hovered !== s.i ? 0.45 : 1 }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hovered !== null ? (
            <>
              <p className="text-blue-800 font-black text-lg leading-none">{CATEGORY_DATA[hovered].pct}%</p>
              <p className="text-blue-400 text-[10px] text-center leading-tight mt-0.5 max-w-[56px]">{CATEGORY_DATA[hovered].cat}</p>
            </>
          ) : (
            <>
              <p className="text-blue-400 text-[10px] uppercase tracking-wider">Total</p>
              <p className="text-blue-800 font-black text-xl leading-none">{total}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SPENDING BAR CHART
═══════════════════════════════════════════════════════════════════ */
function SpendingChart() {
  const [hovered, setHovered] = useState<number | null>(11);
  const max = Math.max(...MONTHLY_SPEND);
  return (
    <div className="flex items-end gap-1 h-28 w-full mt-3">
      {MONTHLY_SPEND.map((v, i) => {
        const h = (v / max) * 100;
        const isHov = hovered === i, isCur = i === MONTHLY_SPEND.length - 1;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 cursor-pointer"
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            {isHov && (
              <div className="bg-blue-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap leading-none mb-0.5">
                ${v}
              </div>
            )}
            <div className="w-full flex items-end" style={{ height: "80px" }}>
              <div className={`w-full rounded-t-sm transition-all duration-300 ${isCur ? "bg-blue-600" : isHov ? "bg-blue-400" : "bg-blue-100"}`}
                style={{ height: `${h}%`, minHeight: "3px" }} />
            </div>
            <span className={`text-[7px] font-medium leading-none ${isCur ? "text-blue-600 font-bold" : isHov ? "text-blue-500" : "text-blue-200"}`}>
              {MONTHS[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════ */
function StatCard({ label, value, sub, change, positive, icon, accent, delay }: {
  label: string; value: string; sub: string; change: string;
  positive: boolean; icon: string; accent: string; delay: number;
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div className={`bg-white rounded-2xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-500 relative overflow-hidden group ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
      style={{ transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, box-shadow 0.3s` }}>
      <div className={`absolute -top-5 -right-5 w-16 h-16 ${accent} rounded-full blur-xl opacity-10 group-hover:opacity-20 transition-opacity`} />
      <div className="flex items-start justify-between mb-2">
        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest leading-tight">{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-blue-800 font-black text-xl font-['Sora',sans-serif] leading-none mb-0.5 truncate">{value}</p>
      <p className="text-blue-300 text-[10px] mb-2">{sub}</p>
      <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
        {positive ? "↑" : "↓"} {change}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BUDGET BAR
═══════════════════════════════════════════════════════════════════ */
function BudgetBar({ cat, icon, spent, limit, color }: { cat: string; icon: string; spent: number; limit: number; color: string }) {
  const pct = Math.min((spent / limit) * 100, 100);
  const over = pct >= 90;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{icon}</span>
          <span className="text-blue-700 text-xs font-semibold">{cat}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs font-bold ${over ? "text-red-500" : "text-blue-600"}`}>${spent}</span>
          <span className="text-blue-200 text-[10px]">/${limit}</span>
        </div>
      </div>
      <div className="w-full bg-blue-50 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full transition-all duration-700 ${over ? "bg-red-400" : color}`} style={{ width: `${pct}%` }} />
      </div>
      {over && <p className="text-red-400 text-[9px] mt-0.5">⚠ Almost at limit</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TRANSACTION ROW
═══════════════════════════════════════════════════════════════════ */
function TxRow({ tx, currency, delay }: { tx: typeof TRANSACTIONS[0]; currency: "USD" | "KHR"; delay: number }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  const isIncome = tx.amount > 0;
  const amt = currency === "KHR"
    ? `₭${Math.abs(tx.khr).toLocaleString()}`
    : `$${Math.abs(tx.amount).toFixed(2)}`;
  return (
    <div className={`flex items-center gap-3 py-2.5 border-b border-blue-50 last:border-0 hover:bg-blue-50/40 -mx-1 px-1 rounded-xl transition-all ${vis ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"}`}
      style={{ transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms` }}>
      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-base shrink-0">{tx.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-blue-800 text-sm font-semibold truncate leading-tight">{tx.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-blue-300 text-[10px]">{tx.cat}</span>
          <span className="text-blue-200 text-[10px]">·</span>
          <span className="text-blue-300 text-[10px] truncate">{tx.date}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={`font-bold text-sm ${isIncome ? "text-green-500" : "text-red-500"}`}>
          {isIncome ? "+" : "-"}{amt}
        </p>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
          tx.method === "KHQR" ? "bg-blue-100 text-blue-500" :
          tx.method === "Cash" ? "bg-green-50 text-green-600" :
          tx.method === "Card" ? "bg-yellow-50 text-yellow-600" :
          "bg-blue-50 text-blue-400"}`}>{tx.method}</span>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   DASHBOARD PAGE
═══════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { currency } = useCurrency();
  const [txFilter, setTxFilter] = useState("All");
  const [txCount, setTxCount]   = useState(5);

  const totalSpent  = TRANSACTIONS.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalIncome = TRANSACTIONS.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalSaved  = totalIncome - totalSpent;
  const khqrCount   = TRANSACTIONS.filter(t => t.method === "KHQR").length;
  const fmtVal = (usd: number) => currency === "KHR" ? `₭${(usd * 4000).toLocaleString()}` : `$${usd.toFixed(2)}`;

  const txCats      = ["All", ...Array.from(new Set(TRANSACTIONS.map(t => t.cat)))];
  const filteredTx  = TRANSACTIONS.filter(t => txFilter === "All" || t.cat === txFilter).slice(0, txCount);
  const totalFiltered = TRANSACTIONS.filter(t => txFilter === "All" || t.cat === txFilter).length;

  const budgetSpent = BUDGETS.reduce((s, b) => s + b.spent, 0);
  const budgetLimit = BUDGETS.reduce((s, b) => s + b.limit, 0);
  const budgetPct   = Math.round((budgetSpent / budgetLimit) * 100);

  return (
    <div className="space-y-4">

{/* ── GREETING BANNER ── */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 rounded-2xl p-4 md:p-5 relative overflow-hidden card-in shadow-lg shadow-blue-600/20">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-blue-400/20 rounded-full blur-2xl" />
        <div className="flex items-center justify-between relative">
          <div>
            <p className="text-blue-200 text-xs">Good morning 👋</p>
            <p className="text-white font-black text-lg md:text-xl font-['Sora',sans-serif] leading-tight">Sophea Chan</p>
            <p className="text-blue-200 text-xs mt-1 leading-snug">
              You've spent <strong className="text-white">{fmtVal(totalSpent)}</strong> this month.
              <span className="hidden sm:inline"> You're doing great!</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0 ml-3">
            <Link href="/dashboard/expenses/new"
              className="flex items-center gap-1.5 bg-white text-blue-600 hover:bg-blue-50 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow">
              + <span className="hidden sm:inline">Add </span>Expense
            </Link>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Spent"  value={fmtVal(totalSpent)}        sub="This month"       change="18% vs last"  positive={false} icon="💸" accent="bg-red-400"   delay={0}   />
        <StatCard label="Total Income" value={fmtVal(totalIncome)}        sub="Salary + others"  change="On track"     positive={true}  icon="💰" accent="bg-green-400" delay={60}  />
        <StatCard label="Net Savings"  value={fmtVal(totalSaved)}         sub="After expenses"   change="Ahead of goal" positive={true} icon="🏦" accent="bg-blue-400"  delay={120} />
        <StatCard label="KHQR Scanned" value={`${khqrCount} receipts`}   sub="Auto-logged"      change="3 new today"  positive={true}  icon="📱" accent="bg-blue-500"  delay={180} />
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-5 border border-blue-100 shadow-sm card-in" style={{ animationDelay: "80ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Monthly Spending</p>
              <p className="text-blue-800 font-black text-xl md:text-2xl font-['Sora',sans-serif]">
                {currency === "USD" ? "$497" : "₭1,988,000"}
                <span className="text-blue-300 text-xs md:text-sm font-normal ml-1.5">Feb 2025</span>
              </p>
            </div>
            <span className="flex items-center gap-1 bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-full">↑ 18%</span>
          </div>
          <SpendingChart />
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-5 border border-blue-100 shadow-sm card-in" style={{ animationDelay: "120ms" }}>
          <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-3">By Category</p>
          <DonutChart total={currency === "USD" ? "$497" : "₭1.99M"} />
          <div className="mt-3 space-y-1.5">
            {CATEGORY_DATA.slice(0, 4).map(d => (
              <div key={d.cat} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-blue-500 text-[11px] flex-1 truncate">{d.cat}</span>
                <span className="text-blue-800 text-[11px] font-bold">{d.pct}%</span>
              </div>
            ))}
            <p className="text-blue-200 text-[10px] pl-3.5">+{CATEGORY_DATA.length - 4} more categories</p>
          </div>
        </div>
      </div>

      {/* ── TRANSACTIONS + BUDGETS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-5 border border-blue-100 shadow-sm card-in" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-blue-800 font-bold text-sm md:text-base font-['Sora',sans-serif]">Recent Transactions</p>
            <Link href="/dashboard/expenses" className="text-blue-500 text-xs font-semibold hover:text-blue-700">View all →</Link>
          </div>
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {txCats.slice(0, 7).map(cat => (
              <button key={cat} onClick={() => { setTxFilter(cat); setTxCount(5); }}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${txFilter === cat ? "bg-blue-600 text-white shadow" : "bg-blue-50 text-blue-400 hover:bg-blue-100"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div>
            {filteredTx.length === 0
              ? <div className="text-center py-8 text-blue-300"><p className="text-3xl mb-1">🔍</p><p className="text-xs">No transactions here</p></div>
              : filteredTx.map((tx, i) => <TxRow key={tx.id} tx={tx} currency={currency} delay={i * 40} />)
            }
          </div>
          {txCount < totalFiltered && (
            <button onClick={() => setTxCount(txCount + 4)}
              className="w-full mt-3 py-2 text-blue-500 text-xs font-semibold border border-blue-100 rounded-xl hover:bg-blue-50 transition-all">
              Load more
            </button>
          )}
        </div>

        {/* Budget panel */}
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-blue-100 shadow-sm card-in flex flex-col" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-800 font-bold text-sm md:text-base font-['Sora',sans-serif]">Budget Progress</p>
            <Link href="/dashboard/budgets" className="text-blue-500 text-xs font-semibold hover:text-blue-700">Manage →</Link>
          </div>
          <div className="space-y-3.5 flex-1">
            {BUDGETS.map(b => <BudgetBar key={b.cat} {...b} />)}
          </div>
          <div className="mt-4 pt-4 border-t border-blue-50">
            <div className="flex justify-between mb-1.5">
              <span className="text-blue-500 text-xs font-semibold">Overall</span>
              <span className="text-blue-400 text-xs">${budgetSpent} / ${budgetLimit}</span>
            </div>
            <div className="w-full bg-blue-50 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full relative" style={{ width: `${budgetPct}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow" />
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-blue-300 text-[10px]">{budgetPct}% used</span>
              <span className="text-green-500 text-[10px] font-semibold">${budgetLimit - budgetSpent} left</span>
            </div>
          </div>
          <Link href="/dashboard/categories"
            className="mt-4 flex items-center gap-3 bg-blue-600 hover:bg-blue-700 rounded-xl p-3 transition-all hover:shadow-lg hover:shadow-blue-600/20 group">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-base shrink-0">🏷️</div>
            <div className="flex-1">
              <p className="text-white text-xs font-bold">Manage Categories</p>
              <p className="text-blue-300 text-[10px]">Organize your spending</p>
            </div>
            <svg className="w-4 h-4 text-blue-300 group-hover:translate-x-0.5 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

    </div>
  );
}