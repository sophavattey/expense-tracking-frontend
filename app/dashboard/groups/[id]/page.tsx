"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight, Copy, Check, RefreshCw, Crown, UserMinus,
  Trash2, LogIn, Shield, ArrowRightLeft, AlertTriangle,
  Pencil, X, Users, Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup } from "@/contexts/GroupContext";
import { groupService } from "@/services/group.service";
import type { Group } from "@/types/group.types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Avatar({ name, avatar, size = "md" }: { name: string; avatar?: string; size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "w-14 h-14 text-xl" : size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
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

function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        copied ? "bg-green-100 text-green-600" : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
      } ${className}`}>
      {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2.5} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function ConfirmDialog({ title, message, confirmLabel, icon, onConfirm, onClose, loading }: {
  title: string; message: string; confirmLabel: string;
  icon?: React.ReactNode;
  onConfirm: () => void; onClose: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 text-center"
        style={{ animation: "slideUp 0.25s ease both" }}>
        {icon && (
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">{icon}</div>
          </div>
        )}
        <h3 className="text-gray-800 font-black text-xl font-['Sora',sans-serif] leading-tight mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-7">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-red-500/30">
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>Please wait…
                </span>
              : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function RenameInput({ current, onSave, onCancel }: { current: string; onSave: (name: string) => Promise<void>; onCancel: () => void }) {
  const [value, setValue] = useState(current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handle = async () => {
    const t = value.trim();
    if (!t) { setError("Name cannot be empty"); return; }
    if (t === current) { onCancel(); return; }
    setSaving(true); setError(null);
    try { await onSave(t); onCancel(); } catch (e: any) { setError(e.message || "Failed to rename"); } finally { setSaving(false); }
  };
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <input type="text" value={value} onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handle(); if (e.key === "Escape") onCancel(); }}
          maxLength={100} autoFocus
          className="flex-1 min-w-0 px-3 py-1.5 rounded-xl border-2 border-blue-200 bg-blue-50/50 text-gray-800 font-black text-xl font-['Sora',sans-serif] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
        <button onClick={handle} disabled={saving || !value.trim()}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50 shrink-0">
          {saving ? "…" : "Save"}
        </button>
        <button onClick={onCancel}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all shrink-0">
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GROUP DETAIL PAGE
═══════════════════════════════════════════════════════════════════ */
export default function GroupDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const groupId  = params.id as string;

  const { user }          = useAuth();
  const { switchToGroup, refreshGroups } = useGroup();

  const [group,       setGroup]       = useState<Group | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [renaming,    setRenaming]    = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenSuccess, setRegenSuccess] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{
    type: "leave" | "dissolve" | "remove";
    targetId?: string;
    targetName?: string;
  } | null>(null);
  const [confirming, setConfirming] = useState(false);

  const fetchGroup = useCallback(async () => {
    try {
      setError(null);
      const data = await groupService.getGroup(groupId);
      setGroup(data);
    } catch (e: any) {
      setError(e.message || "Failed to load group");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => { fetchGroup(); }, [fetchGroup]);

  const refresh = useCallback(async () => {
    await new Promise(r => setTimeout(r, 150));
    await fetchGroup();
    await refreshGroups();
  }, [fetchGroup, refreshGroups]);

  if (!group) return null;

  const isOwner     = user != null && String(group.ownerId) === String(user.id);
  const inviteLink  = typeof window !== "undefined" ? `${window.location.origin}/join?code=${group.inviteCode}` : "";

  const handleRename = async (name: string) => {
    await groupService.rename(groupId, { name });
    await refresh();
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await groupService.regenerateInviteCode(groupId);
      setRegenSuccess(true);
      setTimeout(() => setRegenSuccess(false), 2500);
      await fetchGroup();
    } finally {
      setRegenerating(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirm) return;
    setConfirming(true);
    setActionError(null);
    try {
      if (confirm.type === "leave") {
        await groupService.leave(groupId);
        await refreshGroups();
        router.push("/dashboard/groups");
        return;
      }
      if (confirm.type === "dissolve") {
        await groupService.dissolve(groupId);
        await refreshGroups();
        router.push("/dashboard/groups");
        return;
      }
      if (confirm.type === "remove" && confirm.targetId) {
        await groupService.removeMember(groupId, confirm.targetId);
        setConfirm(null);
        await refresh();
      }
    } catch (e: any) {
      setActionError(e.message || "Action failed");
      setConfirm(null);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-gray-300" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <X size={14} className="shrink-0" />{error}
        </div>
      ) : (
        <div className="w-full space-y-5" style={{ animation: "slideUp 0.3s ease both" }}>

          {/* Back + title + rename + switch */}
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard/groups")}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors shrink-0">
              <ChevronRight size={16} className="rotate-180" />
            </button>
            {renaming ? (
              <RenameInput current={group.name} onSave={handleRename} onCancel={() => setRenaming(false)} />
            ) : (
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <div className="min-w-0">
                  <h2 className="text-gray-800 font-black text-xl font-['Sora',sans-serif] truncate">{group.name}</h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {group.members.length} member{group.members.length !== 1 ? "s" : ""} · Created {fmtDate(group.createdAt)}
                  </p>
                </div>
                {isOwner && (
                  <button onClick={() => setRenaming(true)} title="Rename group"
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all shrink-0">
                    <Pencil size={14} strokeWidth={2} />
                  </button>
                )}
              </div>
            )}
            {!renaming && (
              <button onClick={() => switchToGroup(group)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-600/25 active:scale-95 shrink-0">
                <ArrowRightLeft size={13} strokeWidth={2.5} />
                <span className="hidden sm:inline">Switch to this group</span>
                <span className="sm:hidden">Switch</span>
              </button>
            )}
          </div>

          {/* Action error */}
          {actionError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              <X size={14} className="shrink-0" />{actionError}
            </div>
          )}

          {/* Invite code — owner only */}
          {isOwner && (
            <div className={`rounded-2xl p-5 relative overflow-hidden shadow-lg ${group.inviteCodeExpired
              ? "bg-linear-to-br from-red-500 to-red-600 shadow-red-600/20"
              : "bg-linear-to-br from-indigo-600 to-indigo-700 shadow-indigo-600/20"}`}>
              <div className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Invite Code</p>
                  {group.inviteCodeExpired
                    ? <span className="flex items-center gap-1 bg-red-400/30 text-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <AlertTriangle size={10} strokeWidth={2.5} /> Expired
                      </span>
                    : <span className="bg-indigo-500/40 text-indigo-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        Expires {fmtDate(group.inviteCodeExpiresAt)}
                      </span>}
                </div>
                <div className={`flex items-center gap-3 mb-3 ${group.inviteCodeExpired ? "opacity-40 select-none" : ""}`}>
                  <span className="text-white font-black text-3xl tracking-[0.25em] font-['Sora',sans-serif]">{group.inviteCode}</span>
                  {!group.inviteCodeExpired && <CopyButton text={group.inviteCode} />}
                </div>
                {group.inviteCodeExpired
                  ? <p className="text-red-200 text-xs mb-3">This code has expired. Generate a new one below.</p>
                  : <p className="text-indigo-200 text-xs mb-3">Share this code or the link below with anyone you want to invite.</p>}
                {!group.inviteCodeExpired && (
                  <div className="flex items-center gap-2 bg-indigo-800/40 rounded-xl px-3 py-2.5 mb-3">
                    <span className="text-indigo-200 text-[11px] truncate flex-1">{inviteLink}</span>
                    <CopyButton text={inviteLink} className="shrink-0" />
                  </div>
                )}
                <button onClick={handleRegenerate} disabled={regenerating}
                  className="flex items-center gap-1.5 text-indigo-300 hover:text-white text-xs font-semibold transition-colors disabled:opacity-50">
                  <RefreshCw size={12} className={regenerating ? "animate-spin" : ""} />
                  {regenSuccess ? "Code refreshed! (7 days)" : regenerating ? "Regenerating…" : "Generate new code"}
                </button>
              </div>
            </div>
          )}

          {/* Non-owner hint */}
          {!isOwner && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3">
              <Shield size={18} className="text-indigo-400 shrink-0" />
              <p className="text-indigo-600 text-sm">
                Ask <strong>{group.members.find(m => m.userId === group.ownerId)?.name ?? "the owner"}</strong> to share the invite code.
              </p>
            </div>
          )}

          {/* Members */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-gray-800 font-black text-base font-['Sora',sans-serif]">Members</p>
              <span className="bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
                {group.members.length} / 10
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {group.members.map(member => {
                const isMe          = member.userId === user?.id;
                const isMemberOwner = member.role === "OWNER";
                return (
                  <div key={member.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                    <Avatar name={member.name} avatar={member.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-800 text-sm font-semibold truncate">{member.name}</p>
                        {isMe && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-md">You</span>}
                      </div>
                      <p className="text-gray-400 text-xs truncate">{member.email}</p>
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold shrink-0 ${
                      isMemberOwner ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}>
                      {isMemberOwner && <Crown size={10} strokeWidth={2.5} />}{member.role}
                    </div>
                    {isOwner && !isMe && !isMemberOwner && (
                      <button
                        onClick={() => setConfirm({ type: "remove", targetId: member.userId, targetName: member.name })}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all shrink-0">
                        <UserMinus size={14} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-red-50">
              <p className="text-red-500 font-bold text-sm">Danger Zone</p>
            </div>
            <div className="p-5">
              {!isOwner ? (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-800 text-sm font-semibold">Leave group</p>
                    <p className="text-gray-400 text-xs mt-0.5">You'll lose access to shared budgets</p>
                  </div>
                  <button onClick={() => setConfirm({ type: "leave" })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-all shrink-0">
                    <LogIn size={13} className="rotate-180" />Leave
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-800 text-sm font-semibold">Dissolve group</p>
                    <p className="text-gray-400 text-xs mt-0.5">Permanently deletes the group and all shared data</p>
                  </div>
                  <button onClick={() => setConfirm({ type: "dissolve" })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all shrink-0">
                    <Trash2 size={13} />Dissolve
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {confirm && (
        <ConfirmDialog
          loading={confirming}
          onClose={() => setConfirm(null)}
          onConfirm={handleConfirm}
          icon={
            confirm.type === "dissolve"
              ? <Trash2 size={28} className="text-red-500" strokeWidth={1.75} />
              : confirm.type === "leave"
              ? <LogIn size={28} className="text-red-500 rotate-180" strokeWidth={1.75} />
              : <UserMinus size={28} className="text-red-500" strokeWidth={1.75} />
          }
          title={
            confirm.type === "leave" ? "Leave group?" :
            confirm.type === "dissolve" ? "Dissolve group?" :
            `Remove ${confirm.targetName}?`
          }
          message={
            confirm.type === "leave"
              ? `You'll lose access to "${group.name}" and its shared budgets. You can rejoin later with an invite code.`
              : confirm.type === "dissolve"
              ? `This will permanently delete "${group.name}", all shared budgets, and remove all ${group.members.length} members. This cannot be undone.`
              : `${confirm.targetName} will be removed from "${group.name}" and lose access to shared budgets.`
          }
          confirmLabel={
            confirm.type === "leave" ? "Leave" :
            confirm.type === "dissolve" ? "Dissolve" :
            "Remove"
          }
        />
      )}
    </>
  );
}