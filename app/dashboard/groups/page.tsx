"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Plus, LogIn, Check, Crown,
  ChevronRight, X, ArrowRightLeft, Wallet, BarChart3,
} from "lucide-react";
import { useGroup } from "@/contexts/GroupContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGroups } from "@/hooks/useGroups";
import type { Group } from "@/types/group.types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Avatar({ name, avatar, size = "sm" }: { name: string; avatar?: string; size?: "sm" | "md" }) {
  const dims = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  if (avatar) {
    return <img src={avatar} alt={name} referrerPolicy="no-referrer"
      className={`${dims} rounded-full object-cover shrink-0 ring-2 ring-white shadow-md`} />;
  }
  return (
    <div className={`${dims} rounded-full bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center font-black text-white shrink-0 ring-2 ring-white shadow-md`}>
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
}

/* ── Create modal ── */
function CreateGroupModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => Promise<Group> }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handle = async () => {
    if (!name.trim()) { setError("Group name is required"); return; }
    setSaving(true); setError(null);
    try { await onCreate(name.trim()); onClose(); }
    catch (e: any) { setError(e.message || "Failed to create group"); }
    finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-6"
        style={{ animation: "slideUp 0.25s ease both" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-gray-800 font-black text-xl font-['Sora',sans-serif]">Create Group</h2>
              <p className="text-gray-400 text-xs mt-0.5">Start a shared budget with others</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all shrink-0 ml-2 mt-0.5">
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>
        {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4"><X size={14} className="shrink-0" />{error}</div>}
        <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Group Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()}
          placeholder="e.g. Our Family, Me & Dara" maxLength={100}
          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-300" />
        <p className="text-gray-400 text-xs mt-1.5">You'll become the owner. Share the invite code to add members.</p>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">Cancel</button>
          <button onClick={handle} disabled={saving || !name.trim()}
            className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]">
            {saving ? "Creating…" : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Join modal ── */
function JoinGroupModal({ onClose, onJoin }: { onClose: () => void; onJoin: (code: string) => Promise<Group> }) {
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handle = async () => {
    if (code.trim().length < 6) { setError("Enter the full invite code"); return; }
    setSaving(true); setError(null);
    try { await onJoin(code.trim().toUpperCase()); onClose(); }
    catch (e: any) { setError(e.message || "Invalid code or group not found"); }
    finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-6"
        style={{ animation: "slideUp 0.25s ease both" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
              <LogIn size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-gray-800 font-black text-xl font-['Sora',sans-serif]">Join a Group</h2>
              <p className="text-gray-400 text-xs mt-0.5">Enter the invite code from your group owner</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all shrink-0 ml-2 mt-0.5">
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>
        {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4"><X size={14} className="shrink-0" />{error}</div>}
        <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Invite Code</label>
        <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && handle()}
          placeholder="e.g. FINXK7Q2" maxLength={12}
          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 font-black text-center text-xl tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-300 placeholder:text-base placeholder:tracking-normal placeholder:font-semibold" />
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">Cancel</button>
          <button onClick={handle} disabled={saving || code.trim().length < 6}
            className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all disabled:opacity-50 hover:shadow-lg active:scale-[0.98]">
            {saving ? "Joining…" : "Join Group"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Group card ── */
function GroupCard({ group, isActive }: { group: Group; isActive: boolean }) {
  const { user }  = useAuth();
  const router    = useRouter();
  const isOwner   = user != null && String(group.ownerId) === String(user.id);

  return (
    <div onClick={() => router.push(`/dashboard/groups/${group.id}`)}
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer group ${
        isActive ? "border-indigo-300 ring-2 ring-indigo-100" : "border-gray-100 hover:border-indigo-200"
      }`}
      style={{ animation: "slideUp 0.3s ease both" }}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isActive ? "bg-indigo-600" : "bg-indigo-100"}`}>
            <Users size={22} className={isActive ? "text-white" : "text-indigo-500"} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 font-black text-base font-['Sora',sans-serif] truncate">{group.name}</p>
            <p className="text-gray-400 text-xs mt-0.5">{group.members.length} member{group.members.length !== 1 ? "s" : ""}</p>
          </div>
          {isOwner && (
            <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-xl shrink-0">
              <Crown size={10} strokeWidth={2.5} />Owner
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mb-4">
          {group.members.slice(0, 5).map((m, i) => (
            <div key={m.id} className="shrink-0" style={{ marginLeft: i > 0 ? "-8px" : "0" }}>
              <Avatar name={m.name} avatar={m.avatar} size="sm" />
            </div>
          ))}
          {group.members.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500"
              style={{ marginLeft: "-8px" }}>+{group.members.length - 5}</div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-xs">Created {fmtDate(group.createdAt)}</p>
          <ChevronRight size={15} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
      {isActive && (
        <div className="px-5 py-2.5 bg-indigo-50 border-t border-indigo-100 rounded-b-2xl flex items-center gap-2">
          <Check size={12} className="text-indigo-500" strokeWidth={2.5} />
          <p className="text-indigo-600 text-[11px] font-bold">Currently active context</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GROUPS PAGE
═══════════════════════════════════════════════════════════════════ */
export default function GroupsPage() {
  const { activeContext } = useGroup();
  const { groups, loading, error, createGroup, joinGroup } = useGroups();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin,   setShowJoin]   = useState(false);

  return (
    <>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Collaborative</p>
            <h1 className="text-gray-800 font-black text-2xl sm:text-3xl font-['Sora',sans-serif] mt-0.5">Groups</h1>
            <p className="text-gray-400 text-sm mt-1 hidden sm:block">
              {groups.length > 0
                ? `You're in ${groups.length} group${groups.length !== 1 ? "s" : ""}`
                : "Share budgets and track spending together"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setShowJoin(true)}
              className="flex items-center gap-1.5 border-2 border-gray-200 text-gray-600 text-xs sm:text-sm font-bold px-3 sm:px-4 py-2.5 rounded-xl transition-all hover:bg-gray-50 active:scale-95">
              <LogIn size={15} /><span className="hidden sm:inline">Join</span>
            </button>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-95">
              <Plus size={15} /><span className="hidden sm:inline">Create Group</span><span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <X size={14} className="shrink-0" />{error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                  <div className="flex-1 space-y-2"><div className="h-4 bg-gray-100 rounded w-32" /><div className="h-3 bg-gray-50 rounded w-20" /></div>
                </div>
                <div className="flex gap-1 mb-4">{[...Array(3)].map((_, j) => <div key={j} className="w-8 h-8 rounded-full bg-gray-100" />)}</div>
                <div className="h-3 bg-gray-50 rounded w-24" />
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 px-6 text-center"
            style={{ animation: "slideUp 0.4s ease both" }}>
            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
              <Users size={36} className="text-blue-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-gray-800 font-bold text-xl font-['Sora',sans-serif]">No groups yet</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
              Create a group to share budgets and track spending together with family or friends.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={() => setShowJoin(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all">
                <LogIn size={16} />Join with code
              </button>
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-blue-600/25">
                <Plus size={16} />Create group
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {groups.map(g => <GroupCard key={g.id} group={g} isActive={activeContext.groupId === g.id} />)}
          </div>
        )}

        {!loading && groups.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5"
            style={{ animation: "slideUp 0.5s ease both" }}>
            <p className="text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4">How it works</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { Icon: ArrowRightLeft, title: "Switch context",  desc: "Use the switcher in the header to view group or personal finances" },
                { Icon: Wallet,         title: "Shared budgets",  desc: "Owners set category limits. Everyone's expenses count toward the same budget" },
                { Icon: BarChart3,      title: "Live tracking",   desc: "When any member adds an expense, the group budget updates for everyone" },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={15} className="text-indigo-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-indigo-800 text-xs font-bold">{title}</p>
                    <p className="text-indigo-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} onCreate={createGroup} />}
      {showJoin   && <JoinGroupModal   onClose={() => setShowJoin(false)}   onJoin={joinGroup}    />}
    </>
  );
}