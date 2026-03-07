"use client";

import { useState } from "react";
import { useBudgets } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { getBudgetColor } from "@/utils/budgetColors";
import type { BudgetStatus, BudgetRequest, BudgetPeriod } from "@/types/budget.types";
import type { Category } from "@/types/category.types";

const KHR_RATE = 4000;
const PERIODS: { value: BudgetPeriod; label: string; desc: string }[] = [
  { value: "DAILY",   label: "Daily",   desc: "Resets every day"     },
  { value: "WEEKLY",  label: "Weekly",  desc: "Resets every Monday"  },
  { value: "MONTHLY", label: "Monthly", desc: "Resets 1st of month"  },
];

function fmtUSD(n: number) { return `$${n.toFixed(2)}`; }
function fmtKHR(usd: number) { return `៛${Math.round(usd * KHR_RATE).toLocaleString()}`; }

/* ── Period badge ──────────────────────────────────────────────── */
function PeriodBadge({ period }: { period: BudgetPeriod }) {
  const styles: Record<BudgetPeriod, string> = {
    DAILY:   "bg-purple-50 text-purple-600 border-purple-100",
    WEEKLY:  "bg-yellow-50 text-yellow-600 border-yellow-100",
    MONTHLY: "bg-blue-50   text-blue-600   border-blue-100",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${styles[period]}`}>
      {period}
    </span>
  );
}

/* ── Budget progress bar ───────────────────────────────────────── */
function BudgetBar({ pct, color }: { pct: number; color: ReturnType<typeof getBudgetColor> }) {
  const w = Math.min(pct, 100);
  return (
    <div className="w-full bg-blue-50 rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-700 ${color.barClass}`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

/* ── Budget card ───────────────────────────────────────────────── */
function BudgetCard({ status, onEdit, onDelete }: {
  status:   BudgetStatus;
  onEdit:   (s: BudgetStatus) => void;
  onDelete: (s: BudgetStatus) => void;
}) {
  const color   = getBudgetColor(status.percentage);
  const catName = status.category?.name  ?? "Overall";
  const catIcon = status.category?.icon  ?? "📊";
  const catColor= status.category?.color ?? "#2563eb";

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 transition-all hover:shadow-md group
      ${color.borderClass} ${color.bgTintClass}`}>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ backgroundColor: catColor + "18", border: `1.5px solid ${catColor}30` }}
          >
            {catIcon}
          </div>
          <div>
            <p className="text-blue-800 font-bold text-sm leading-tight">{catName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <PeriodBadge period={status.period} />
              <span className="text-blue-300 text-[10px]">{status.periodLabel}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={() => onEdit(status)}
              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button onClick={() => onDelete(status)}
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
        </div>
      </div>

      {/* Amounts */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className={`font-black text-xl font-['Sora',sans-serif] leading-none ${color.textClass}`}>
            {fmtUSD(status.spentUsd)}
          </p>
          <p className="text-blue-300 text-xs mt-0.5">{fmtKHR(status.spentUsd)}</p>
        </div>
        <div className="text-right">
          <p className="text-blue-400 text-xs">of {fmtUSD(status.limitUsd)}</p>
          <p className="text-blue-300 text-[10px]">{fmtKHR(status.limitUsd)}</p>
        </div>
      </div>

      {/* Bar */}
      <BudgetBar pct={status.percentage} color={color} />

      {/* Footer — remaining / over + percent */}
      <div className="flex items-center justify-between mt-2.5">
        <span className={`flex items-center gap-1 text-xs font-bold ${color.textClass}`}>
          <color.Icon size={12} strokeWidth={2.5} />
          {color.status === "over"
            ? `${fmtUSD(Math.abs(status.remainingUsd))} over budget`
            : color.status === "danger"
            ? `${fmtUSD(status.remainingUsd)} left — very close!`
            : color.status === "warning"
            ? `${fmtUSD(status.remainingUsd)} left`
            : `${fmtUSD(status.remainingUsd)} remaining`}
        </span>
        <span className={`text-xs font-black ${color.textClass}`}>
          {status.percentage}%
        </span>
      </div>
    </div>
  );
}

/* ── Budget modal ──────────────────────────────────────────────── */
function BudgetModal({ editStatus, categories, onSave, onClose, saving, error: saveError }: {
  editStatus:  BudgetStatus | null;
  categories:  Category[];
  onSave:      (data: BudgetRequest) => Promise<void>;
  onClose:     () => void;
  saving:      boolean;
  error:       string | null;
}) {
  const isEdit = !!editStatus;

  const [categoryId, setCategoryId] = useState<number | null>(editStatus?.category?.id ?? null);
  const [period,     setPeriod]     = useState<BudgetPeriod>(editStatus?.period   ?? "MONTHLY");
  const [limitUsd,   setLimitUsd]   = useState(editStatus ? String(editStatus.limitUsd) : "");
  const [recurring,  setRecurring]  = useState(true);
  const [startDate,  setStartDate]  = useState("");
  const [endDate,    setEndDate]    = useState("");
  const [formErr,    setFormErr]    = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!limitUsd || isNaN(Number(limitUsd)) || Number(limitUsd) <= 0)
      e.limit = "Enter a valid limit greater than 0";
    if (!recurring && !startDate) e.startDate = "Start date is required";
    if (!recurring && endDate && startDate && endDate < startDate)
      e.endDate = "End date must be after start date";
    setFormErr(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave({
      categoryId:  categoryId ?? null,
      period,
      limitUsd:    parseFloat(limitUsd),
      recurring,
      startDate:   !recurring && startDate ? startDate : undefined,
      endDate:     !recurring && endDate   ? endDate   : undefined,
    });
  };

  const numLimit = Number(limitUsd) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg overflow-hidden"
        style={{ animation: "slideUp 0.25s ease both", maxHeight: "92dvh", overflowY: "auto" }}
      >
        <div className="w-10 h-1 bg-blue-100 rounded-full mx-auto mt-4 mb-1 sm:hidden" />

        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <h2 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">
              {isEdit ? "Edit Budget" : "New Budget"}
            </h2>
            <p className="text-blue-400 text-sm mt-0.5">
              {isEdit ? "Update your spending limit" : "Set a spending limit for a category or overall"}
            </p>
          </div>

          {/* Save error */}
          {saveError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {saveError}
            </div>
          )}

          {/* Category picker */}
          <div>
            <label className="block text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setCategoryId(null)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all
                  ${categoryId === null
                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                    : "bg-blue-50 border-blue-100 text-blue-600 hover:border-blue-300"}`}>
                <span className="text-base">📊</span>
                <span className="text-xs font-semibold truncate">Overall</span>
              </button>
              {categories.map(c => (
                <button key={c.id} onClick={() => setCategoryId(c.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all
                    ${categoryId === c.id ? "border-transparent shadow-md" : "bg-blue-50 border-blue-100 hover:border-blue-300"}`}
                  style={categoryId === c.id
                    ? { backgroundColor: c.color + "18", borderColor: c.color + "60" }
                    : {}}>
                  <span className="text-base shrink-0">{c.icon}</span>
                  <span className="text-xs font-semibold truncate text-blue-700">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Period picker */}
          <div>
            <label className="block text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-2">
              Period
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PERIODS.map(p => (
                <button key={p.value} onClick={() => setPeriod(p.value)}
                  className={`flex flex-col items-center py-3 rounded-xl border text-center transition-all
                    ${period === p.value
                      ? "bg-blue-600 border-blue-600 text-white shadow-md"
                      : "bg-blue-50 border-blue-100 text-blue-500 hover:border-blue-300"}`}>
                  <span className="text-sm font-bold">{p.label}</span>
                  <span className={`text-[10px] mt-0.5 ${period === p.value ? "text-blue-200" : "text-blue-300"}`}>
                    {p.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Limit input */}
          <div>
            <label className="block text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-2">
              Limit (USD) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold">$</span>
              <input
                type="number" min="0.01" step="0.01" value={limitUsd}
                onChange={e => setLimitUsd(e.target.value)}
                placeholder="0.00" inputMode="decimal"
                className={`w-full pl-8 pr-4 py-3.5 rounded-xl border bg-blue-50/50 text-blue-800 font-bold
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                  ${formErr.limit ? "border-red-300 bg-red-50/30" : "border-blue-100"}`}
              />
            </div>
            {formErr.limit && <p className="text-red-500 text-xs mt-1">{formErr.limit}</p>}
            {numLimit > 0 && (
              <p className="text-blue-300 text-xs mt-1.5">≈ {fmtKHR(numLimit)} at ៛{KHR_RATE}/USD</p>
            )}
          </div>

          {/* Recurring toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div>
              <p className="text-blue-700 text-sm font-bold">Recurring</p>
              <p className="text-blue-400 text-xs mt-0.5">
                {recurring ? "Automatically resets each period" : "One-time budget with fixed dates"}
              </p>
            </div>
            <button onClick={() => setRecurring(!recurring)}
              className={`relative w-12 h-6 rounded-full transition-all ${recurring ? "bg-blue-600" : "bg-blue-200"}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${recurring ? "left-7" : "left-1"}`} />
            </button>
          </div>

          {/* Fixed date range */}
          {!recurring && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1.5">Start Date *</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className={`w-full px-3 py-3 rounded-xl border bg-blue-50/50 text-blue-800 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                    ${formErr.startDate ? "border-red-300" : "border-blue-100"}`} />
                {formErr.startDate && <p className="text-red-500 text-xs mt-1">{formErr.startDate}</p>}
              </div>
              <div>
                <label className="block text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1.5">End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                  className={`w-full px-3 py-3 rounded-xl border bg-blue-50/50 text-blue-800 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                    ${formErr.endDate ? "border-red-300" : "border-blue-100"}`} />
                {formErr.endDate && <p className="text-red-500 text-xs mt-1">{formErr.endDate}</p>}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border-2 border-blue-100 text-blue-500 font-bold text-sm hover:bg-blue-50 transition-all">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm
                transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {isEdit ? "Saving…" : "Creating…"}
                </span>
              ) : isEdit ? "Save Changes" : "Create Budget"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Delete modal ──────────────────────────────────────────────── */
function DeleteModal({ status, onConfirm, onClose, deleting }: {
  status: BudgetStatus; onConfirm: () => void; onClose: () => void; deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-sm p-7"
        style={{ animation: "slideUp 0.25s ease both" }}>
        <div className="w-10 h-1 bg-blue-100 rounded-full mx-auto mb-6 sm:hidden" />
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl bg-red-50">🗑️</div>
          <h3 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Delete this budget?</h3>
          <p className="text-blue-500 font-semibold mt-1">{status.category?.name ?? "Overall"} · {status.period}</p>
          <p className="text-blue-400 text-sm mt-1">Limit: {fmtUSD(status.limitUsd)} / {status.period.toLowerCase()}</p>
          <p className="text-blue-300 text-xs mt-0.5">This won't delete any expenses.</p>
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

/* ═══════════════════════════════════════════════════════════════════
   BUDGETS PAGE
═══════════════════════════════════════════════════════════════════ */
export default function BudgetsPage() {
  const { summary, loading, error, createBudget, updateBudget, deleteBudget } = useBudgets();
  const { categories } = useCategories();

  const [modalOpen,    setModalOpen]    = useState(false);
  const [editStatus,   setEditStatus]   = useState<BudgetStatus | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BudgetStatus | null>(null);
  const [saving,       setSaving]       = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [saveError,    setSaveError]    = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState<BudgetPeriod | "ALL">("ALL");

  const openCreate = () => { setEditStatus(null); setSaveError(null); setModalOpen(true); };
  const openEdit   = (s: BudgetStatus) => { setEditStatus(s); setSaveError(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditStatus(null); setSaveError(null); };

  const handleSave = async (data: BudgetRequest) => {
    setSaving(true); setSaveError(null);
    try {
      if (editStatus) await updateBudget(editStatus.id, data);
      else            await createBudget(data);
      closeModal();
    } catch (e: any) {
      setSaveError(e.message || "Failed to save budget");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try   { await deleteBudget(deleteTarget.id); setDeleteTarget(null); }
    catch { setDeleteTarget(null); }
    finally { setDeleting(false); }
  };

  const statuses     = summary?.statuses ?? [];
  const filtered     = periodFilter === "ALL" ? statuses : statuses.filter(s => s.period === periodFilter);
  const overallColor = getBudgetColor(
    summary && summary.totalLimitUsd > 0
      ? Math.round((summary.totalSpentUsd / summary.totalLimitUsd) * 100)
      : 0
  );
  const overallPct = summary && summary.totalLimitUsd > 0
    ? Math.min(Math.round((summary.totalSpentUsd / summary.totalLimitUsd) * 100), 100)
    : 0;

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
      `}</style>

      <div className="w-full space-y-5" style={{ animation: "slideUp 0.3s ease both" }}>

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Manage</p>
            <h1 className="text-blue-800 font-black text-2xl sm:text-3xl font-['Sora',sans-serif] mt-0.5">Budgets</h1>
            <p className="text-blue-400 text-sm mt-1 hidden sm:block">
              {summary
                ? `${summary.totalBudgets} budget${summary.totalBudgets !== 1 ? "s" : ""} · ${summary.overBudgetCount} over limit`
                : "Set limits to control your spending"}
            </p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold
              px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-95 shrink-0">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Budget</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* ── Summary strip ── */}
        {!loading && summary && summary.totalBudgets > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ animation: "fadeIn 0.4s ease" }}>
            {[
              { label: "Total Limit",     value: `$${summary.totalLimitUsd.toFixed(2)}`,     sub: `៛${Math.round(summary.totalLimitUsd * KHR_RATE).toLocaleString()}`,     color: "text-blue-800"        },
              { label: "Total Spent",     value: `$${summary.totalSpentUsd.toFixed(2)}`,     sub: `៛${Math.round(summary.totalSpentUsd * KHR_RATE).toLocaleString()}`,     color: overallColor.textClass },
              { label: "Total Remaining", value: `$${summary.totalRemainingUsd.toFixed(2)}`, sub: `៛${Math.round(summary.totalRemainingUsd * KHR_RATE).toLocaleString()}`, color: summary.totalRemainingUsd < 0 ? "text-red-500" : "text-green-600" },
              { label: "Over Budget",     value: `${summary.overBudgetCount} budget${summary.overBudgetCount !== 1 ? "s" : ""}`,  sub: `${summary.nearLimitCount} near limit`, color: summary.overBudgetCount > 0 ? "text-red-500" : "text-green-600" },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-2xl border border-blue-100 px-4 py-3 sm:px-5 sm:py-4 shadow-sm">
                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">{card.label}</p>
                <p className={`font-black text-lg sm:text-xl font-['Sora',sans-serif] leading-tight ${card.color}`}>{card.value}</p>
                <p className="text-blue-300 text-xs mt-0.5">{card.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Overall progress bar ── */}
        {!loading && summary && summary.totalBudgets > 0 && (() => {
          const rawPct = summary.totalLimitUsd > 0
            ? Math.round((summary.totalSpentUsd / summary.totalLimitUsd) * 100)
            : 0;
          const oc = getBudgetColor(rawPct);
          return (
            <div className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-sm ${oc.borderClass}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-blue-800 font-bold text-sm">Overall Budget Usage</p>
                <span className={`text-sm font-black ${oc.textClass}`}>{rawPct}%</span>
              </div>
              <div className="w-full bg-blue-50 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${oc.barClass}`}
                  style={{ width: `${Math.min(rawPct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-blue-300 text-xs">${summary.totalSpentUsd.toFixed(2)} spent</span>
                <span className={`text-xs font-semibold ${oc.textClass}`}>
                  {rawPct > 100
                    ? `$${(summary.totalSpentUsd - summary.totalLimitUsd).toFixed(2)} over budget`
                    : `$${summary.totalRemainingUsd.toFixed(2)} left`}
                </span>
              </div>
            </div>
          );
        })()}

        {/* ── Period filter tabs ── */}
        {!loading && statuses.length > 0 && (
          <div className="flex gap-2">
            {(["ALL", "DAILY", "WEEKLY", "MONTHLY"] as const).map(p => (
              <button key={p} onClick={() => setPeriodFilter(p)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all
                  ${periodFilter === p ? "bg-blue-600 text-white shadow-md" : "bg-white border border-blue-100 text-blue-400 hover:bg-blue-50"}`}>
                {p === "ALL"
                  ? `All (${statuses.length})`
                  : `${p.charAt(0) + p.slice(1).toLowerCase()} (${statuses.filter(s => s.period === p).length})`}
              </button>
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3.5 rounded-2xl">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Budget cards grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-blue-100 p-5 animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-blue-100 rounded w-24" />
                    <div className="h-3 bg-blue-50 rounded w-16" />
                  </div>
                </div>
                <div className="h-6 bg-blue-50 rounded w-20" />
                <div className="h-2 bg-blue-100 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm text-center py-16 sm:py-20 px-6">
            <p className="text-5xl mb-4">💰</p>
            <p className="text-blue-800 font-bold text-lg sm:text-xl">
              {periodFilter !== "ALL" ? `No ${periodFilter.toLowerCase()} budgets` : "No budgets yet"}
            </p>
            <p className="text-blue-400 text-sm mt-2">
              {periodFilter !== "ALL"
                ? "Try a different period filter or create one"
                : "Create your first budget to start tracking limits"}
            </p>
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Create Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(s => (
              <BudgetCard key={s.id} status={s} onEdit={openEdit} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}

        <div className="h-4 sm:h-0" />
      </div>

      {/* Modals */}
      {modalOpen && (
        <BudgetModal
          editStatus={editStatus}
          categories={categories}
          onSave={handleSave}
          onClose={closeModal}
          saving={saving}
          error={saveError}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          status={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </>
  );
}