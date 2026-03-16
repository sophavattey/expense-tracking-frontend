"use client";

import { useState } from "react";
import { Tag, Sparkles, LayoutGrid, Plus, AlertTriangle } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import type { Category, CategoryRequest } from "@/types/category.types";

const EMOJI_OPTIONS = [
  "🍜","🛒","🏍️","🛍️","⚡","🎮","💊","📚","✈️","📦",
  "☕","🏠","💅","🐾","🎵","🎨","💪","🍺","🎁","💻",
  "🚗","🏥","⛽","🌿","🎓","🍕","💇","🛺","🧴","🎪",
];
const COLOR_OPTIONS = [
  "#2563eb","#22c55e","#f59e0b","#60a5fa","#f87171",
  "#a78bfa","#34d399","#fb923c","#38bdf8","#94a3b8",
  "#ec4899","#14b8a6","#f97316","#8b5cf6","#06b6d4",
];

// ─── Category Form Modal ──────────────────────────────────────────
function CategoryModal({ initial, onSave, onClose, saving, error }: {
  initial?: Category; onSave: (d: CategoryRequest) => void;
  onClose: () => void; saving: boolean; error: string | null;
}) {
  const [name,  setName]  = useState(initial?.name  ?? "");
  const [icon,  setIcon]  = useState(initial?.icon  ?? "📦");
  const [color, setColor] = useState(initial?.color ?? "#2563eb");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg"
        style={{ animation: "slideUp 0.25s ease both", maxHeight: "92dvh", overflowY: "auto" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-4 mb-2 sm:hidden" />
        <div className="p-5 sm:p-7">

          {/* Header with X */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{initial ? "Editing" : "New"}</p>
              <h2 className="text-gray-800 font-black text-xl sm:text-2xl font-['Sora',sans-serif]">
                {initial ? "Edit Category" : "Create Category"}
              </h2>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all shrink-0 ml-3 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Live preview */}
          <div className="flex items-center gap-4 rounded-2xl p-4 mb-5 border border-gray-100 bg-gray-50">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0"
              style={{ backgroundColor: color + "20", border: `2px solid ${color}40` }}>{icon}</div>
            <div>
              <p className="text-gray-800 font-black text-lg leading-tight">{name || "Category name"}</p>
              <p className="text-gray-400 text-xs mt-0.5">Live preview</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs font-mono text-gray-400">{color}</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Coffee & Tea" maxLength={50}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>

          {/* Emoji picker */}
          <div className="mb-4">
            <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Icon</label>
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} type="button" onClick={() => setIcon(e)}
                  className={`h-10 rounded-xl text-xl flex items-center justify-center transition-all ${icon === e ? "scale-110 shadow-md" : "bg-gray-100 hover:bg-gray-200"}`}
                  style={icon === e ? { backgroundColor: color + "30", border: `2px solid ${color}60` } : {}}>{e}</button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Color</label>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_OPTIONS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`w-9 h-9 rounded-xl transition-all ${color === c ? "scale-125 shadow-lg ring-2 ring-offset-2 ring-gray-300" : "hover:scale-110"}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button onClick={() => onSave({ name: name.trim(), icon, color })} disabled={saving || !name.trim()}
              className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-600/25">
              {saving
                ? <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>Saving…
                  </span>
                : initial ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────
function DeleteModal({ category, onConfirm, onClose, deleting, deleteError }: {
  category: Category; onConfirm: () => void; onClose: () => void;
  deleting: boolean; deleteError: string | null;
}) {
  const isBlocked = !!deleteError;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={!deleting ? onClose : undefined} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-sm p-6 sm:p-7"
        style={{ animation: "slideUp 0.25s ease both" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />

        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{ backgroundColor: category.color + "20" }}>{category.icon}</div>
          <h3 className="text-gray-800 font-black text-xl font-['Sora',sans-serif]">Delete "{category.name}"?</h3>
          {!isBlocked && (
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              This cannot be undone. Expenses using this category will be affected.
            </p>
          )}
        </div>

        {isBlocked && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={15} className="text-amber-500" strokeWidth={2} />
              </div>
              <div>
                <p className="text-amber-800 font-bold text-sm">Can't delete this category</p>
                <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">{deleteError}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-amber-200 space-y-1">
              <p className="text-amber-600 text-xs font-semibold">To delete it you must first:</p>
              <p className="text-amber-600 text-xs flex items-start gap-1.5"><span className="shrink-0 mt-0.5">•</span>Move those expenses to a different category, or</p>
              <p className="text-amber-600 text-xs flex items-start gap-1.5"><span className="shrink-0 mt-0.5">•</span>Delete those expenses from the Expenses page</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} disabled={deleting}
            className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all disabled:opacity-50">
            {isBlocked ? "Close" : "Cancel"}
          </button>
          {!isBlocked && (
            <button onClick={onConfirm} disabled={deleting}
              className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25">
              {deleting
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>Deleting…</>
                : "Delete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Category Card ────────────────────────────────────────────────
function CategoryCard({ category, onEdit, onDelete }: {
  category: Category; onEdit: (c: Category) => void; onDelete: (c: Category) => void;
}) {
  const isEditable = category.isOwned && !category.isDefault;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-md hover:border-gray-200 transition-all group">
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-sm"
        style={{ backgroundColor: category.color + "18", border: `1.5px solid ${category.color}30` }}>{category.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-800 font-bold text-sm sm:text-base truncate leading-tight">{category.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
          <span className="text-gray-400 text-xs">{category.isDefault ? "System · Read-only" : "Custom"}</span>
        </div>
      </div>
      {isEditable ? (
        <div className="flex items-center gap-1.5 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(category)} aria-label="Edit"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden sm:inline text-xs font-semibold">Edit</span>
          </button>
          <button onClick={() => onDelete(category)} aria-label="Delete"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline text-xs font-semibold">Delete</span>
          </button>
        </div>
      ) : (
        <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-1 rounded-lg shrink-0">DEFAULT</span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PAGE
// ═══════════════════════════════════════════════════════════════════
export default function CategoriesPage() {
  const { categories, loading, error: fetchError, createCategory, updateCategory, deleteCategory } = useCategories();

  const [showCreate,   setShowCreate]   = useState(false);
  const [editTarget,   setEditTarget]   = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [saving,       setSaving]       = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [modalError,   setModalError]   = useState<string | null>(null);
  const [deleteError,  setDeleteError]  = useState<string | null>(null);

  const handleCreate = async (data: CategoryRequest) => {
    setSaving(true); setModalError(null);
    try { await createCategory(data); setShowCreate(false); }
    catch (e: any) { setModalError(e.message); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (data: CategoryRequest) => {
    if (!editTarget) return;
    setSaving(true); setModalError(null);
    try { await updateCategory(editTarget.id, data); setEditTarget(null); }
    catch (e: any) { setModalError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true); setDeleteError(null);
    try { await deleteCategory(deleteTarget.id); setDeleteTarget(null); }
    catch (e: any) { setDeleteError(e.message); }
    finally { setDeleting(false); }
  };

  const openDelete  = (category: Category) => { setDeleteError(null); setDeleteTarget(category); };
  const closeDelete = () => { setDeleteTarget(null); setDeleteError(null); };

  const defaults = categories.filter(c =>  c.isDefault);
  const customs  = categories.filter(c => !c.isDefault);

  return (
    <>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>

      <div className="w-full space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Manage</p>
            <h1 className="text-gray-800 font-black text-2xl sm:text-3xl font-['Sora',sans-serif] leading-tight mt-0.5">Categories</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 hidden sm:block">Organize your spending into meaningful groups</p>
          </div>
          <button onClick={() => { setModalError(null); setShowCreate(true); }}
            className="shrink-0 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-95">
            <Plus size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">New Category</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { Icon: Tag,        value: categories.length, label: "Total",    bg: "bg-blue-50",   iconColor: "text-blue-500",   desktopOnly: false },
            { Icon: Sparkles,   value: customs.length,    label: "Custom",   bg: "bg-indigo-50", iconColor: "text-indigo-500", desktopOnly: false },
            { Icon: LayoutGrid, value: defaults.length,   label: "Defaults", bg: "bg-gray-100",  iconColor: "text-gray-400",   desktopOnly: true  },
          ].map(({ Icon, value, label, bg, iconColor, desktopOnly }) => (
            <div key={label} className={`bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex items-center gap-3 sm:gap-4 ${desktopOnly ? "hidden sm:flex" : ""}`}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={20} className={iconColor} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-gray-800 font-black text-xl sm:text-2xl font-['Sora',sans-serif] leading-none">{value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fetch error */}
        {fetchError && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3.5 rounded-2xl">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {fetchError}
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3.5 flex items-center gap-3 animate-pulse">
                <div className="w-11 h-11 rounded-2xl bg-gray-100 shrink-0" />
                <div className="flex-1"><div className="h-4 bg-gray-100 rounded-lg w-32 mb-2" /><div className="h-3 bg-gray-50 rounded-lg w-20" /></div>
              </div>
            ))}
          </div>
        )}

        {/* Custom categories */}
        {!loading && (
          <section>
            <div className="mb-3">
              <p className="text-gray-800 font-bold text-sm sm:text-base">Your Categories</p>
              <p className="text-gray-400 text-xs mt-0.5">{customs.length} custom {customs.length === 1 ? "category" : "categories"}</p>
            </div>
            {customs.length === 0 ? (
              <button onClick={() => { setModalError(null); setShowCreate(true); }}
                className="w-full bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-2xl p-8 sm:p-10 text-center transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-blue-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-sm">
                  <Tag size={24} className="text-blue-400" strokeWidth={1.75} />
                </div>
                <p className="text-gray-600 font-bold text-sm sm:text-base">Create your first category</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Organize your spending your way</p>
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {customs.map(c => <CategoryCard key={c.id} category={c} onEdit={cat => { setModalError(null); setEditTarget(cat); }} onDelete={openDelete} />)}
              </div>
            )}
          </section>
        )}

        {/* Default categories */}
        {!loading && defaults.length > 0 && (
          <section>
            <div className="mb-3">
              <p className="text-gray-800 font-bold text-sm sm:text-base">System Defaults</p>
              <p className="text-gray-400 text-xs mt-0.5">Read-only · {defaults.length} categories</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {defaults.map(c => <CategoryCard key={c.id} category={c} onEdit={() => {}} onDelete={() => {}} />)}
            </div>
          </section>
        )}

        <div className="h-4 sm:h-0" />
      </div>

      {showCreate   && <CategoryModal onSave={handleCreate} onClose={() => setShowCreate(false)} saving={saving} error={modalError} />}
      {editTarget   && <CategoryModal initial={editTarget} onSave={handleUpdate} onClose={() => setEditTarget(null)} saving={saving} error={modalError} />}
      {deleteTarget && <DeleteModal category={deleteTarget} onConfirm={handleDelete} onClose={closeDelete} deleting={deleting} deleteError={deleteError} />}
    </>
  );
}