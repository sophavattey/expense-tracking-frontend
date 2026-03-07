"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useExpenses } from "@/hooks/useExpenses";
import { useCategories } from "@/hooks/useCategories";
import { expenseService } from "@/services/expense.service";
import type { Expense } from "@/types/expense.types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const KHR_RATE = 4000;

// amountBase is always USD — use it directly for all maths
function fmtUSD(n: number) { return `$${n.toFixed(2)}`; }
function fmtKHR(usd: number) { return `៛${Math.round(usd * KHR_RATE).toLocaleString()}`; }
function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// ─── Delete modal ─────────────────────────────────────────────────
function DeleteModal({ expense, onConfirm, onClose, deleting }: {
  expense: Expense; onConfirm: () => void; onClose: () => void; deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-sm p-7"
        style={{ animation: "slideUp 0.25s ease both" }}>
        <div className="w-10 h-1 bg-blue-100 rounded-full mx-auto mb-6 sm:hidden" />
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{ backgroundColor: expense.category.color + "20" }}>
            {expense.category.icon}
          </div>
          <h3 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Delete this expense?</h3>
          <p className="text-red-500 font-bold text-lg mt-1">{fmtUSD(expense.amountBase)}</p>
          <p className="text-blue-300 text-sm">{fmtKHR(expense.amountBase)}</p>
          <p className="text-blue-400 text-sm mt-1">
            {expense.merchantName ?? expense.category.name} · {fmtDate(expense.date)}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border-2 border-blue-100 text-blue-500 font-bold text-sm hover:bg-blue-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all disabled:opacity-50">
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Expense row ──────────────────────────────────────────────────
function ExpenseRow({ expense, onEdit, onDelete }: {
  expense: Expense; onEdit: (e: Expense) => void; onDelete: (e: Expense) => void;
}) {
  const pmColors: Record<string, string> = {
    KHQR: "bg-blue-100 text-blue-600", CASH: "bg-green-50 text-green-600",
    CARD: "bg-yellow-50 text-yellow-600", BANK: "bg-purple-50 text-purple-600",
    APP: "bg-orange-50 text-orange-500", OTHER: "bg-slate-50 text-slate-500",
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-blue-50 last:border-0 active:bg-blue-50/60 sm:hover:bg-blue-50/40 -mx-2 px-2 rounded-xl transition-all group">
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0"
        style={{ backgroundColor: expense.category.color + "18", border: `1.5px solid ${expense.category.color}30` }}>
        {expense.category.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-blue-800 text-sm font-semibold truncate leading-tight">
          {expense.merchantName ?? expense.category.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-blue-400 text-xs">{expense.category.name}</span>
          <span className="text-blue-200 text-xs">·</span>
          <span className="text-blue-300 text-xs">{fmtDate(expense.date)}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md inline-block ${pmColors[expense.paymentMethod] ?? "bg-blue-50 text-blue-400"}`}>
            {expense.paymentMethod}
          </span>
        </div>
      </div>

      {/* Always show original amount + USD base */}
      <div className="text-right shrink-0">
        <p className="text-red-500 font-bold text-sm leading-tight">
          -{expense.currency === "USD"
            ? fmtUSD(expense.amount)
            : `៛${Math.round(expense.amount).toLocaleString()}`}
        </p>
        <p className="text-blue-300 text-xs leading-tight">
          {expense.currency === "KHR" ? `-${fmtUSD(expense.amountBase)}` : `-${fmtKHR(expense.amountBase)}`}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(expense)} aria-label="Edit"
          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button onClick={() => onDelete(expense)} aria-label="Delete"
          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PAGE
// ═══════════════════════════════════════════════════════════════════
export default function ExpensesPage() {
  const router = useRouter();

  const [catFilter,    setCatFilter]    = useState<number | null>(null);
  const [from,         setFrom]         = useState("");
  const [to,           setTo]           = useState("");
  const [showFilters,  setShowFilters]  = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleting,     setDeleting]     = useState(false);

  const { expenses, totalElements, loading, error, refetch } = useExpenses({
    size: 200,
    categoryId: catFilter ?? undefined,
    from: from || undefined,
    to:   to   || undefined,
  });

  const { categories } = useCategories();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await expenseService.delete(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch {
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  // Use amountBase (always USD) for totals — no manual conversion needed
  const totalUSD   = expenses.reduce((s, e) => s + e.amountBase, 0);
  const hasFilters = catFilter !== null || from || to;

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
      `}</style>

      <div className="w-full space-y-4">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Track</p>
            <h1 className="text-blue-800 font-black text-2xl sm:text-3xl font-['Sora',sans-serif] leading-tight mt-0.5">Expenses</h1>
            <p className="text-blue-400 text-xs sm:text-sm mt-1 hidden sm:block">
              {totalElements > 0 ? `${totalElements} total expenses recorded` : "Start tracking your spending"}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                hasFilters ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-blue-100 text-blue-500 hover:bg-blue-50"
              }`}>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline">Filters</span>
              {hasFilters && <span className="w-1.5 h-1.5 bg-white rounded-full sm:hidden" />}
              {hasFilters && <span className="hidden sm:inline bg-white/30 text-white text-[10px] px-1.5 rounded-md">ON</span>}
            </button>
            <Link href="/dashboard/expenses/new"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-95">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Expense</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </div>

        {/* ── Summary strip ── */}
        {!loading && expenses.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" style={{ animation: "fadeIn 0.3s ease" }}>
            <div className="bg-white rounded-2xl border border-blue-100 px-4 py-3 sm:px-5 sm:py-4">
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Showing</p>
              <p className="text-blue-800 font-black text-lg sm:text-xl font-['Sora',sans-serif] leading-tight">{expenses.length}</p>
              <p className="text-blue-300 text-xs mt-0.5">of {totalElements} total</p>
            </div>
            <div className="bg-white rounded-2xl border border-blue-100 px-4 py-3 sm:px-5 sm:py-4">
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Spent</p>
              <p className="text-red-500 font-black text-lg sm:text-xl font-['Sora',sans-serif] leading-tight">{fmtUSD(totalUSD)}</p>
              <p className="text-blue-300 text-xs mt-0.5">{fmtKHR(totalUSD)}</p>
            </div>
            <div className="hidden sm:block bg-white rounded-2xl border border-blue-100 px-5 py-4">
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Average</p>
              <p className="text-blue-800 font-black text-xl font-['Sora',sans-serif] leading-tight">
                {fmtUSD(expenses.length > 0 ? totalUSD / expenses.length : 0)}
              </p>
              <p className="text-blue-300 text-xs mt-0.5">per expense</p>
            </div>
          </div>
        )}

        {/* ── Filter panel ── */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-blue-100 p-4 sm:p-5 space-y-4 shadow-sm"
            style={{ animation: "slideUp 0.2s ease" }}>
            <div className="flex items-center justify-between">
              <p className="text-blue-800 font-bold text-sm">Filter Expenses</p>
              {hasFilters && (
                <button onClick={() => { setCatFilter(null); setFrom(""); setTo(""); }}
                  className="text-red-400 text-xs sm:text-sm font-semibold hover:text-red-600 transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all
                </button>
              )}
            </div>
            <div>
              <p className="text-blue-400 text-xs font-semibold mb-2">Category</p>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                <button onClick={() => setCatFilter(null)}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${catFilter === null ? "bg-blue-600 text-white shadow-md" : "bg-blue-50 text-blue-400 hover:bg-blue-100"}`}>
                  All
                </button>
                {categories.map(c => (
                  <button key={c.id} onClick={() => setCatFilter(c.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${catFilter === c.id ? "text-white shadow-md" : "bg-blue-50 text-blue-400 hover:bg-blue-100"}`}
                    style={catFilter === c.id ? { backgroundColor: c.color } : {}}>
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-blue-400 text-xs font-semibold mb-1.5">From</p>
                <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <p className="text-blue-400 text-xs font-semibold mb-1.5">To</p>
                <input type="date" value={to} onChange={e => setTo(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3.5 rounded-2xl">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Expense list ── */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          {!loading && expenses.length > 0 && (
            <div className="hidden sm:flex items-center gap-4 px-8 py-3 border-b border-blue-50 bg-blue-50/50">
              <div className="w-11 shrink-0" />
              <div className="flex-1 text-blue-400 text-[10px] font-bold uppercase tracking-widest">Expense</div>
              <div className="text-right text-blue-400 text-[10px] font-bold uppercase tracking-widest min-w-[100px] mr-2">Original · USD</div>
              <div className="w-[72px] shrink-0" />
            </div>
          )}

          {loading ? (
            <div className="p-4 sm:p-6 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-100 shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-blue-100 rounded-lg w-36 sm:w-48 mb-2" />
                    <div className="h-3 bg-blue-50 rounded-lg w-24 sm:w-32" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-4 bg-blue-100 rounded-lg w-14 sm:w-16" />
                    <div className="h-3 bg-blue-50 rounded-lg w-16 sm:w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-16 sm:py-20 px-6">
              <p className="text-5xl sm:text-6xl mb-4">📊</p>
              <p className="text-blue-800 font-bold text-lg sm:text-xl">
                {hasFilters ? "No expenses match your filters" : "No expenses yet"}
              </p>
              <p className="text-blue-400 text-sm mt-2">
                {hasFilters ? "Try adjusting your filters" : "Start tracking your spending"}
              </p>
              {!hasFilters && (
                <Link href="/dashboard/expenses/new"
                  className="inline-flex items-center gap-2 mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add your first expense
                </Link>
              )}
            </div>
          ) : (
            <div className="p-3 sm:p-6">
              {expenses.map(e => (
                <ExpenseRow key={e.id} expense={e}
                  onEdit={exp => router.push(`/dashboard/expenses/new?id=${exp.id}`)}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-4 sm:h-0" />
      </div>

      {deleteTarget && (
        <DeleteModal
          expense={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </>
  );
}