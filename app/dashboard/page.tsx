"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingDown, TrendingUp, PiggyBank, ScanLine, type LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/hooks/useExpenses";
import { useBudgets } from "@/hooks/useBudgets";
import { expenseService } from "@/services/expense.service";
import { getBudgetColor } from "@/utils/budgetColors";
import type { Expense, MonthlySummary } from "@/types/expense.types";
import type { BudgetStatus } from "@/types/budget.types";

/* ─── constants ─────────────────────────────────────────────────── */
const KHR_RATE  = 4000;
const SHORT_MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmtUSD(n: number) { return `$${n.toFixed(2)}`; }
function fmtDate(iso: string) {
  const d     = new Date(iso + "T00:00:00");
  const today = new Date();
  const isToday =
    d.getDate()     === today.getDate()     &&
    d.getMonth()    === today.getMonth()    &&
    d.getFullYear() === today.getFullYear();
  if (isToday) return "Today";
  return `${SHORT_MON[d.getMonth()]} ${d.getDate()}`;
}

/* ═══════════════════════════════════════════════════════════════════
   DONUT CHART
═══════════════════════════════════════════════════════════════════ */
interface DonutSlice { cat: string; pct: number; color: string; totalUsd: number }

function DonutChart({ slices, totalUsd }: { slices: DonutSlice[]; totalUsd: number }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const size = 200, r = 72, stroke = 24, circ = 2 * Math.PI * r;
  let offset = 0;
  const computed = slices.map((d, i) => {
    const len = (d.pct / 100) * circ;
    const s = { ...d, offset: circ - offset, len, i };
    offset += len;
    return s;
  });

  if (slices.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: 200, height: 200 }}>
        <p className="text-blue-200 text-sm">No data this month</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {computed.map(s => (
            <circle key={s.i} cx={size/2} cy={size/2} r={r} fill="none"
              stroke={s.color} strokeWidth={hovered === s.i ? stroke + 6 : stroke}
              strokeDasharray={`${s.len - 2} ${circ - s.len + 2}`}
              strokeDashoffset={s.offset} strokeLinecap="round"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHovered(s.i)} onMouseLeave={() => setHovered(null)}
              style={{ opacity: hovered !== null && hovered !== s.i ? 0.45 : 1 }} />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hovered !== null ? (
            <>
              <p className="text-blue-800 font-black text-2xl leading-none">{slices[hovered].pct}%</p>
              <p className="text-blue-400 text-xs text-center leading-tight mt-1 max-w-[72px]">{slices[hovered].cat}</p>
            </>
          ) : (
            <>
              <p className="text-blue-400 text-xs uppercase tracking-wider font-semibold">Total</p>
              <p className="text-blue-800 font-black text-2xl leading-none mt-0.5">{fmtUSD(totalUsd)}</p>
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
function SpendingChart({ data }: { data: { label: string; amount: number }[] }) {
  const lastIdx = data.length - 1;
  const [hovered, setHovered] = useState<number | null>(lastIdx);
  const max = Math.max(...data.map(d => d.amount), 1);

  return (
    <div className="flex items-end gap-1.5 h-36 w-full mt-4">
      {data.map((d, i) => {
        const h = (d.amount / max) * 100;
        const isHov = hovered === i, isCur = i === lastIdx;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 cursor-pointer"
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            {isHov && (
              <div className="bg-blue-800 text-white text-[9px] font-bold px-2 py-1 rounded-lg whitespace-nowrap leading-none mb-1 shadow-lg">
                {fmtUSD(d.amount)}
              </div>
            )}
            <div className="w-full flex items-end" style={{ height: "96px" }}>
              <div className={`w-full rounded-t transition-all duration-300 ${isCur ? "bg-blue-600" : isHov ? "bg-blue-400" : "bg-blue-100"}`}
                style={{ height: `${h}%`, minHeight: d.amount > 0 ? "4px" : "0px" }} />
            </div>
            <span className={`text-[8px] font-medium leading-none ${isCur ? "text-blue-600 font-bold" : isHov ? "text-blue-500" : "text-blue-300"}`}>
              {d.label}
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
function StatCard({ label, value, sub, change, positive, Icon, iconColor, accent, delay }: {
  label: string; value: string; sub: string; change: string;
  positive: boolean; Icon: LucideIcon; iconColor: string; accent: string; delay: number;
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div className={`bg-white rounded-2xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-500 relative overflow-hidden group
      ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, box-shadow 0.3s` }}>
      <div className={`absolute -top-6 -right-6 w-20 h-20 ${accent} rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity`} />
      <div className="flex items-start justify-between mb-3">
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest leading-tight">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
      <p className="text-blue-800 font-black text-2xl font-['Sora',sans-serif] leading-none mb-1 truncate">{value}</p>
      <p className="text-blue-300 text-xs mb-3">{sub}</p>
      <div className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
        {positive ? "↑" : "↓"} {change}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BUDGET BAR  — uses colour system
═══════════════════════════════════════════════════════════════════ */
function BudgetBar({ status }: { status: BudgetStatus }) {
  const pct      = status.limitUsd > 0
    ? Math.round((status.spentUsd / status.limitUsd) * 100)
    : 0;
  const color    = getBudgetColor(pct);
  const catName  = status.category?.name  ?? "Overall";
  const catIcon  = status.category?.icon  ?? "📊";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base">{catIcon}</span>
          <span className="text-blue-700 text-sm font-semibold">{catName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <color.Icon size={12} strokeWidth={2.5} className={color.iconClass} />
          <span className={`text-sm font-bold ${color.textClass}`}>{fmtUSD(status.spentUsd)}</span>
          <span className="text-blue-200 text-xs">/{fmtUSD(status.limitUsd)}</span>
        </div>
      </div>
      <div className="w-full bg-blue-50 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-700 ${color.barClass}`}
          style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      {/* Status comment line */}
      <div className="flex items-center justify-between mt-1">
        <p className={`flex items-center gap-1 text-[10px] font-semibold ${color.textClass}`}>
          <color.Icon size={11} strokeWidth={2.5} />
          {color.status === "over"    && `Over budget by ${fmtUSD(Math.abs(status.remainingUsd))}`}
          {color.status === "danger"  && `Only ${fmtUSD(status.remainingUsd)} left — very close!`}
          {color.status === "warning" && `${fmtUSD(status.remainingUsd)} remaining`}
          {color.status === "safe"    && `${fmtUSD(status.remainingUsd)} remaining`}
        </p>
        <span className={`text-[10px] font-bold ${color.textClass}`}>{pct}%</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TRANSACTION ROW
═══════════════════════════════════════════════════════════════════ */
const PM_COLORS: Record<string, string> = {
  KHQR:  "bg-blue-100 text-blue-500",
  CASH:  "bg-green-50 text-green-600",
  CARD:  "bg-yellow-50 text-yellow-600",
  BANK:  "bg-purple-50 text-purple-600",
  APP:   "bg-orange-50 text-orange-500",
  OTHER: "bg-slate-50 text-slate-500",
};

function TxRow({ expense, delay }: { expense: Expense; delay: number }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);

  const displayAmt = expense.currency === "KHR"
    ? `៛${Math.round(expense.amount).toLocaleString()}`
    : fmtUSD(expense.amount);

  return (
    <div className={`flex items-center gap-4 py-3 border-b border-blue-50 last:border-0 hover:bg-blue-50/50 -mx-2 px-2 rounded-xl transition-all
      ${vis ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"}`}
      style={{ transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ backgroundColor: expense.category.color + "18", border: `1.5px solid ${expense.category.color}30` }}>
        {expense.category.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-blue-800 text-sm font-semibold truncate leading-tight">
          {expense.merchantName ?? expense.category.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-blue-300 text-xs">{expense.category.name}</span>
          <span className="text-blue-200 text-xs">·</span>
          <span className="text-blue-300 text-xs truncate">{fmtDate(expense.date)}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-red-500 font-bold text-sm">-{displayAmt}</p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${PM_COLORS[expense.paymentMethod] ?? "bg-blue-50 text-blue-400"}`}>
          {expense.paymentMethod}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DASHBOARD PAGE
═══════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user } = useAuth();
  const now = new Date();

  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const { expenses, loading: expLoading } = useExpenses({ size: 200, from: monthStart });

  const { summary: budgetSummary, loading: budgetLoading } = useBudgets();

  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [chartData,      setChartData]      = useState<{ label: string; amount: number }[]>([]);
  const [chartLoading,   setChartLoading]   = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const monthlyPromise = expenseService.getSummary({ year: now.getFullYear(), month: now.getMonth() + 1 });
        const historyPromises = Array.from({ length: 12 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
          return expenseService
            .getSummary({ year: d.getFullYear(), month: d.getMonth() + 1 })
            .then(s => ({ label: SHORT_MON[d.getMonth()], amount: s.totalSpentUsd ?? 0 }))
            .catch(() => ({ label: SHORT_MON[d.getMonth()], amount: 0 }));
        });
        const [monthly, ...history] = await Promise.all([monthlyPromise, ...historyPromises]);
        if (!cancelled) { setMonthlySummary(monthly); setChartData(history); }
      } catch { /* degrade gracefully */ }
      finally { if (!cancelled) setChartLoading(false); }
    };
    fetchAll();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Derived ── */
  const totalSpentUsd  = monthlySummary?.totalSpentUsd ?? expenses.reduce((s, e) => s + e.amountBase, 0);
  const digitalCount   = expenses.filter(e => e.paymentMethod === "KHQR" || e.paymentMethod === "APP").length;
  const budgetLimitUsd = budgetSummary?.totalLimitUsd ?? 0;
  const budgetSpentUsd = budgetSummary?.totalSpentUsd ?? 0;
  const budgetRawPct   = budgetLimitUsd > 0 ? Math.round((budgetSpentUsd / budgetLimitUsd) * 100) : 0;
  const overallColor   = getBudgetColor(budgetRawPct);

  const curMonthAmt  = chartData[chartData.length - 1]?.amount ?? 0;
  const prevMonthAmt = chartData[chartData.length - 2]?.amount ?? 0;
  const momDiff      = prevMonthAmt > 0 ? Math.round(((curMonthAmt - prevMonthAmt) / prevMonthAmt) * 100) : 0;

  const donutSlices: DonutSlice[] = (monthlySummary?.breakdown ?? []).map(b => ({
    cat:      b.categoryName,
    pct:      b.percentage,
    color:    b.categoryColor || "#94a3b8",
    totalUsd: b.totalUsd,
  }));

  const [txFilter, setTxFilter] = useState("All");
  const [txCount,  setTxCount]  = useState(5);
  const txCats        = ["All", ...Array.from(new Set(expenses.map(e => e.category.name)))];
  const filteredTx    = expenses.filter(e => txFilter === "All" || e.category.name === txFilter).slice(0, txCount);
  const totalFiltered = expenses.filter(e => txFilter === "All" || e.category.name === txFilter).length;

  const curMonthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const hour          = now.getHours();
  const greeting      = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 max-w-[1600px]">

      {/* ── GREETING BANNER ── */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 rounded-2xl p-6 md:p-8 relative overflow-hidden card-in shadow-xl shadow-blue-600/20">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-blue-300/10 rounded-full blur-2xl" />
        <div className="flex items-center justify-between relative">
          <div>
            <p className="text-blue-200 text-sm font-medium">{greeting} 👋</p>
            <p className="text-white font-black text-2xl md:text-3xl font-['Sora',sans-serif] leading-tight mt-1">
              {user?.name ?? "Welcome back"}
            </p>
            <p className="text-blue-200 text-sm mt-2 leading-relaxed max-w-md">
              {expLoading ? "Loading your data…" : (
                <>
                  You've spent <strong className="text-white">{fmtUSD(totalSpentUsd)}</strong> this month.
                  {budgetLimitUsd > 0 && (
                    <span className="hidden sm:inline">
                      {" "}Budget at {budgetRawPct}% —{" "}
                      {overallColor.status === "safe"    && "you're doing great!"}
                      {overallColor.status === "warning" && "getting close."}
                      {overallColor.status === "danger"  && "very close to limit!"}
                      {overallColor.status === "over"    && "you've exceeded your budget!"}
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
          <div className="shrink-0 ml-6">
            <Link href="/dashboard/expenses/new"
              className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Expense</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Spent"    value={expLoading     ? "—" : fmtUSD(totalSpentUsd)}   sub={curMonthLabel}    change={expLoading     ? "…" : `${expenses.length} expenses`}                        positive={false} Icon={TrendingDown} iconColor="bg-red-50 text-red-400"    accent="bg-red-400"   delay={0}   />
        <StatCard label="Monthly Budget" value={budgetLoading  ? "—" : fmtUSD(budgetLimitUsd)}  sub="Total limit set"  change={budgetLoading  ? "…" : `${budgetRawPct}% used`}                              positive={budgetRawPct < 50} Icon={TrendingUp} iconColor="bg-green-50 text-green-500" accent="bg-green-400" delay={60}  />
        <StatCard label="Remaining"      value={budgetLoading  ? "—" : fmtUSD(Math.max(budgetLimitUsd - budgetSpentUsd, 0))} sub="Budget left" change={budgetLoading ? "…" : budgetLimitUsd > 0 ? `${Math.max(100 - budgetRawPct, 0)}% free` : "No budget set"} positive={budgetRawPct < 80} Icon={PiggyBank} iconColor="bg-blue-50 text-blue-400"  accent="bg-blue-400"  delay={120} />
        <StatCard label="KHQR / App"     value={expLoading     ? "—" : `${digitalCount} receipts`} sub="Digital payments" change={expLoading ? "…" : `of ${expenses.length} total`}                       positive={true}  Icon={ScanLine}    iconColor="bg-blue-50 text-blue-500"   accent="bg-blue-500"  delay={180} />
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-blue-100 shadow-sm card-in" style={{ animationDelay: "80ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Monthly Spending</p>
              {chartLoading
                ? <div className="h-9 w-32 bg-blue-50 rounded-xl animate-pulse mt-1" />
                : <p className="text-blue-800 font-black text-3xl font-['Sora',sans-serif] mt-1">
                    {fmtUSD(curMonthAmt)}
                    <span className="text-blue-300 text-base font-normal ml-2">{curMonthLabel}</span>
                  </p>
              }
            </div>
            {!chartLoading && chartData.length >= 2 && (
              <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${momDiff > 0 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>
                {momDiff > 0 ? "↑" : "↓"} {Math.abs(momDiff)}% vs last month
              </span>
            )}
          </div>
          {chartLoading
            ? <div className="h-36 bg-blue-50 rounded-xl animate-pulse mt-4" />
            : <SpendingChart data={chartData} />
          }
        </div>

        <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm card-in" style={{ animationDelay: "120ms" }}>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">By Category</p>
          {chartLoading
            ? <div className="flex items-center justify-center h-[200px]"><div className="w-32 h-32 rounded-full border-8 border-blue-100 animate-pulse" /></div>
            : <DonutChart slices={donutSlices} totalUsd={totalSpentUsd} />
          }
          <div className="mt-4 space-y-2.5">
            {chartLoading
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5 animate-pulse">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-100 shrink-0" />
                    <div className="h-3 bg-blue-50 rounded flex-1" />
                    <div className="h-3 bg-blue-50 rounded w-10" />
                  </div>
                ))
              : donutSlices.slice(0, 5).map(d => (
                  <div key={d.cat} className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-blue-500 text-xs flex-1 truncate">{d.cat}</span>
                    <span className="text-blue-400 text-xs">{fmtUSD(d.totalUsd)}</span>
                    <span className="text-blue-800 text-xs font-bold w-8 text-right">{d.pct}%</span>
                  </div>
                ))
            }
            {donutSlices.length > 5 && <p className="text-blue-200 text-xs pl-5">+{donutSlices.length - 5} more categories</p>}
          </div>
        </div>
      </div>

      {/* ── TRANSACTIONS + BUDGETS ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Transactions */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-blue-100 shadow-sm card-in" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-800 font-black text-lg font-['Sora',sans-serif]">Recent Transactions</p>
            <Link href="/dashboard/expenses" className="text-blue-500 text-sm font-semibold hover:text-blue-700 transition-colors">View all →</Link>
          </div>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {txCats.slice(0, 8).map(cat => (
              <button key={cat} onClick={() => { setTxFilter(cat); setTxCount(5); }}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${txFilter === cat ? "bg-blue-600 text-white shadow-md" : "bg-blue-50 text-blue-400 hover:bg-blue-100"}`}>
                {cat}
              </button>
            ))}
          </div>
          {expLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 shrink-0" />
                  <div className="flex-1 space-y-1.5"><div className="h-4 bg-blue-100 rounded w-40" /><div className="h-3 bg-blue-50 rounded w-28" /></div>
                  <div className="h-4 bg-blue-100 rounded w-16" />
                </div>
              ))}
            </div>
          ) : filteredTx.length === 0 ? (
            <div className="text-center py-10 text-blue-300"><p className="text-4xl mb-2">🔍</p><p className="text-sm">No transactions here</p></div>
          ) : (
            <>
              {filteredTx.map((e, i) => <TxRow key={e.id} expense={e} delay={i * 40} />)}
              {txCount < totalFiltered && (
                <button onClick={() => setTxCount(txCount + 4)}
                  className="w-full mt-4 py-2.5 text-blue-500 text-sm font-semibold border border-blue-100 rounded-xl hover:bg-blue-50 transition-all">
                  Load more ({totalFiltered - txCount} remaining)
                </button>
              )}
            </>
          )}
        </div>

        {/* Budget widget */}
        <div className={`bg-white rounded-2xl p-6 border shadow-sm card-in flex flex-col ${overallColor.borderClass}`} style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-blue-800 font-black text-lg font-['Sora',sans-serif]">Budget Progress</p>
            <Link href="/dashboard/budgets" className="text-blue-500 text-sm font-semibold hover:text-blue-700 transition-colors">Manage →</Link>
          </div>

          {budgetLoading ? (
            <div className="space-y-5 flex-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                  <div className="flex justify-between"><div className="h-4 bg-blue-100 rounded w-28" /><div className="h-4 bg-blue-50 rounded w-16" /></div>
                  <div className="h-2 bg-blue-50 rounded-full w-full" />
                  <div className="h-3 bg-blue-50 rounded w-32" />
                </div>
              ))}
            </div>
          ) : (budgetSummary?.statuses ?? []).length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
              <p className="text-3xl mb-2">💰</p>
              <p className="text-blue-400 text-sm font-semibold">No budgets set yet</p>
              <Link href="/dashboard/budgets" className="mt-3 text-blue-600 text-xs font-bold hover:underline">
                Create your first budget →
              </Link>
            </div>
          ) : (
            <div className="space-y-5 flex-1">
              {(budgetSummary?.statuses ?? []).slice(0, 6).map(s => (
                <BudgetBar key={s.id} status={s} />
              ))}
            </div>
          )}

          {/* Overall progress bar */}
          {!budgetLoading && budgetLimitUsd > 0 && (
            <div className="mt-5 pt-5 border-t border-blue-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-500 text-sm font-semibold">Overall Budget</span>
                <span className={`text-sm font-bold ${overallColor.textClass}`}>{budgetRawPct}%</span>
              </div>
              <div className="w-full bg-blue-50 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full relative transition-all duration-700 ${overallColor.barClass}`}
                  style={{ width: `${Math.min(budgetRawPct, 100)}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full border-2 border-current shadow-md" />
                </div>
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-blue-300 text-xs">{fmtUSD(budgetSpentUsd)} spent</span>
                <span className={`text-xs font-semibold ${overallColor.textClass}`}>
                  {budgetRawPct > 100
                    ? `${fmtUSD(budgetSpentUsd - budgetLimitUsd)} over budget`
                    : `${fmtUSD(budgetLimitUsd - budgetSpentUsd)} remaining`}
                </span>
              </div>
            </div>
          )}

          <Link href="/dashboard/categories"
            className="mt-5 flex items-center gap-3 bg-blue-600 hover:bg-blue-700 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-blue-600/20 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-xl shrink-0">🏷️</div>
            <div className="flex-1">
              <p className="text-white text-sm font-bold">Manage Categories</p>
              <p className="text-blue-300 text-xs mt-0.5">Organize your spending</p>
            </div>
            <svg className="w-5 h-5 text-blue-300 group-hover:translate-x-0.5 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

    </div>
  );
}