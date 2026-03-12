"use client";

import { useState, useRef } from "react";
import {
  Users, Plus, LogIn, Copy, Check, RefreshCw,
  Crown, UserMinus, Trash2, ChevronRight, X, Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup } from "@/contexts/GroupContext";
import { useGroups } from "@/hooks/useGroups";
import type { Group, GroupMember } from "@/types/group.types";

/* ─── helpers ────────────────────────────────────────────────────── */
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ─── Avatar ─────────────────────────────────────────────────────── */
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

/* ─── Copy button ────────────────────────────────────────────────── */
function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        copied
          ? "bg-green-100 text-green-600"
          : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
      } ${className}`}>
      {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2.5} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

/* ─── Confirm dialog ─────────────────────────────────────────────── */
function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onClose, loading }: {
  title: string; message: string; confirmLabel: string; danger?: boolean;
  onConfirm: () => void; onClose: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        style={{ animation: "slideUp 0.2s ease both" }}>
        <h3 className="text-blue-800 font-black text-lg font-['Sora',sans-serif]">{title}</h3>
        <p className="text-blue-500 text-sm mt-2 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-blue-100 text-blue-500 font-bold text-sm hover:bg-blue-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50
              ${danger ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CREATE GROUP MODAL
═══════════════════════════════════════════════════════════════════ */
function CreateGroupModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string) => Promise<Group>;
}) {
  const [name,    setName]    = useState("");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handle = async () => {
    if (!name.trim()) { setError("Group name is required"); return; }
    setSaving(true); setError(null);
    try {
      await onCreate(name.trim());
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to create group");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-6"
        style={{ animation: "slideUp 0.25s ease both" }}>
        <div className="w-10 h-1 bg-blue-100 rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Create Group</h2>
            <p className="text-blue-400 text-xs mt-0.5">Start a shared budget with others</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            <X size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <label className="block text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-2">
          Group Name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handle()}
          placeholder="e.g. Our Family, Me & Dara"
          maxLength={100}
          className="w-full px-4 py-3.5 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-800 font-semibold
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-blue-200"
        />
        <p className="text-blue-200 text-xs mt-1.5">
          You'll become the owner. Share the invite code to add members.
        </p>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border-2 border-blue-100 text-blue-500 font-bold text-sm hover:bg-blue-50 transition-all">
            Cancel
          </button>
          <button onClick={handle} disabled={saving || !name.trim()}
            className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm
              transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-600/25 active:scale-[0.98]">
            {saving ? "Creating…" : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   JOIN GROUP MODAL
═══════════════════════════════════════════════════════════════════ */
function JoinGroupModal({ onClose, onJoin }: {
  onClose: () => void;
  onJoin: (code: string) => Promise<Group>;
}) {
  const [code,   setCode]   = useState("");
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  const handle = async () => {
    if (code.trim().length < 6) { setError("Enter the full invite code"); return; }
    setSaving(true); setError(null);
    try {
      await onJoin(code.trim().toUpperCase());
      onClose();
    } catch (e: any) {
      setError(e.message || "Invalid code or group not found");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md p-6"
        style={{ animation: "slideUp 0.25s ease both" }}>
        <div className="w-10 h-1 bg-blue-100 rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
            <LogIn size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Join a Group</h2>
            <p className="text-blue-400 text-xs mt-0.5">Enter the invite code from your group owner</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            <X size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <label className="block text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-2">
          Invite Code
        </label>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && handle()}
          placeholder="e.g. FINXK7Q2"
          maxLength={12}
          className="w-full px-4 py-3.5 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-800 font-black
            text-center text-xl tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-transparent transition-all placeholder:text-blue-200 placeholder:text-base placeholder:tracking-normal placeholder:font-semibold"
        />

        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border-2 border-blue-100 text-blue-500 font-bold text-sm hover:bg-blue-50 transition-all">
            Cancel
          </button>
          <button onClick={handle} disabled={saving || code.trim().length < 6}
            className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm
              transition-all disabled:opacity-50 hover:shadow-lg active:scale-[0.98]">
            {saving ? "Joining…" : "Join Group"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GROUP DETAIL PANEL
═══════════════════════════════════════════════════════════════════ */
function GroupDetailPanel({ group, onBack, onUpdate }: {
  group: Group;
  onBack: () => void;
  onUpdate: () => void;
}) {
  const { user }          = useAuth();
  const { switchToGroup } = useGroup();
  const { leaveGroup, removeMember, dissolveGroup, regenerateInvite } = useGroups();

  const isOwner = group.ownerId === user?.id;
  const myMembership = group.members.find(m => m.userId === user?.id);

  const [confirm, setConfirm] = useState<{
    type: "leave" | "dissolve" | "remove";
    targetId?: string;
    targetName?: string;
  } | null>(null);
  const [confirming,    setConfirming]    = useState(false);
  const [regenerating,  setRegenerating]  = useState(false);
  const [regenSuccess,  setRegenSuccess]  = useState(false);

  const handleConfirm = async () => {
    if (!confirm) return;
    setConfirming(true);
    try {
      if (confirm.type === "leave")    { await leaveGroup(group.id); onBack(); }
      if (confirm.type === "dissolve") { await dissolveGroup(group.id); onBack(); }
      if (confirm.type === "remove" && confirm.targetId) {
        await removeMember(group.id, confirm.targetId);
        onUpdate();
      }
      setConfirm(null);
    } catch { /* error handled in hook */ }
    finally { setConfirming(false); }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await regenerateInvite(group.id);
      setRegenSuccess(true);
      setTimeout(() => setRegenSuccess(false), 2500);
      onUpdate();
    } finally {
      setRegenerating(false);
    }
  };

  const inviteLink = typeof window !== "undefined"
    ? `${window.location.origin}/join?code=${group.inviteCode}`
    : "";

  return (
    <>
      <div style={{ animation: "slideUp 0.3s ease both" }} className="space-y-5">

        {/* Back + title */}
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="w-9 h-9 rounded-xl border border-blue-100 flex items-center justify-center text-blue-400 hover:bg-blue-50 transition-colors">
            <ChevronRight size={16} className="rotate-180" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-blue-800 font-black text-xl font-['Sora',sans-serif] truncate">{group.name}</h2>
            <p className="text-blue-400 text-xs mt-0.5">
              {group.members.length} member{group.members.length !== 1 ? "s" : ""} · Created {fmtDate(group.createdAt)}
            </p>
          </div>
          <button onClick={() => switchToGroup(group)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-600/25 active:scale-95">
            Switch to this group
          </button>
        </div>

        {/* Invite code card */}
        {isOwner && (
          <div className={`rounded-2xl p-5 relative overflow-hidden shadow-lg ${
            group.inviteCodeExpired
              ? "bg-linear-to-br from-red-500 to-red-600 shadow-red-600/20"
              : "bg-linear-to-br from-indigo-600 to-indigo-700 shadow-indigo-600/20"
          }`}>
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Invite Code</p>
                {group.inviteCodeExpired ? (
                  <span className="bg-red-400/30 text-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ⚠ Expired
                  </span>
                ) : (
                  <span className="bg-indigo-500/40 text-indigo-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Expires {fmtDate(group.inviteCodeExpiresAt)}
                  </span>
                )}
              </div>

              <div className={`flex items-center gap-3 mb-3 ${group.inviteCodeExpired ? "opacity-40 select-none" : ""}`}>
                <span className="text-white font-black text-3xl tracking-[0.25em] font-['Sora',sans-serif]">
                  {group.inviteCode}
                </span>
                {!group.inviteCodeExpired && (
                  <CopyButton text={group.inviteCode} className="bg-white/20! text-white! hover:bg-white/30!" />
                )}
              </div>

              {group.inviteCodeExpired ? (
                <p className="text-red-200 text-xs mb-3">
                  This code has expired. Generate a new one below.
                </p>
              ) : (
                <p className="text-indigo-200 text-xs mb-3">
                  Share this code or the link below with anyone you want to invite.
                </p>
              )}

              {/* Invite link — only show when not expired */}
              {!group.inviteCodeExpired && (
                <div className="flex items-center gap-2 bg-indigo-800/40 rounded-xl px-3 py-2.5 mb-3">
                  <span className="text-indigo-200 text-[11px] truncate flex-1">{inviteLink}</span>
                  <CopyButton text={inviteLink} className="bg-white/15! text-white! hover:bg-white/25! shrink-0" />
                </div>
              )}

              {/* Regenerate */}
              <button onClick={handleRegenerate} disabled={regenerating}
                className="flex items-center gap-1.5 text-indigo-300 hover:text-white text-xs font-semibold transition-colors disabled:opacity-50">
                <RefreshCw size={12} className={regenerating ? "animate-spin" : ""} />
                {regenSuccess ? "Code refreshed! (7 days)" : regenerating ? "Regenerating…" : "Generate new code"}
              </button>
            </div>
          </div>
        )}

        {/* Non-owner: read-only invite code display */}
        {!isOwner && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3">
            <Shield size={18} className="text-indigo-400 shrink-0" />
            <p className="text-indigo-600 text-sm">
              Ask <strong>{group.members.find(m => m.userId === group.ownerId)?.name ?? "the owner"}</strong> to share the invite code.
            </p>
          </div>
        )}

        {/* Members */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-blue-50 flex items-center justify-between">
            <p className="text-blue-800 font-black text-base font-['Sora',sans-serif]">Members</p>
            <span className="bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
              {group.members.length} / 10
            </span>
          </div>

          <div className="divide-y divide-blue-50">
            {group.members.map(member => {
              const isMe        = member.userId === user?.id;
              const isMemberOwner = member.role === "OWNER";
              return (
                <div key={member.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-blue-50/40 transition-colors">
                  <Avatar name={member.name} avatar={member.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-blue-800 text-sm font-semibold truncate">{member.name}</p>
                      {isMe && (
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-md">You</span>
                      )}
                    </div>
                    <p className="text-blue-400 text-xs truncate">{member.email}</p>
                  </div>
                  {/* Role badge */}
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                    isMemberOwner
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : "bg-blue-50 text-blue-400 border border-blue-100"}`}>
                    {isMemberOwner && <Crown size={10} strokeWidth={2.5} />}
                    {member.role}
                  </div>
                  {/* Remove button — owner can remove non-owner members */}
                  {isOwner && !isMe && !isMemberOwner && (
                    <button
                      onClick={() => setConfirm({ type: "remove", targetId: member.userId, targetName: member.name })}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-blue-300 hover:text-red-400 hover:bg-red-50 transition-all shrink-0">
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
          <div className="p-5 space-y-3">
            {!isOwner && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-800 text-sm font-semibold">Leave group</p>
                  <p className="text-blue-400 text-xs mt-0.5">You'll lose access to shared budgets</p>
                </div>
                <button onClick={() => setConfirm({ type: "leave" })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-all">
                  <LogIn size={13} className="rotate-180" />
                  Leave
                </button>
              </div>
            )}
            {isOwner && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-800 text-sm font-semibold">Dissolve group</p>
                  <p className="text-blue-400 text-xs mt-0.5">Permanently deletes the group and all shared budgets</p>
                </div>
                <button onClick={() => setConfirm({ type: "dissolve" })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all">
                  <Trash2 size={13} />
                  Dissolve
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm dialog */}
      {confirm && (
        <ConfirmDialog
          danger
          loading={confirming}
          onClose={() => setConfirm(null)}
          onConfirm={handleConfirm}
          title={
            confirm.type === "leave"    ? "Leave group?" :
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
            confirm.type === "leave"    ? "Leave"    :
            confirm.type === "dissolve" ? "Dissolve" :
            "Remove"
          }
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GROUP CARD
═══════════════════════════════════════════════════════════════════ */
function GroupCard({ group, isActive, onClick }: {
  group: Group; isActive: boolean; onClick: () => void;
}) {
  const { user } = useAuth();
  const isOwner = group.ownerId === user?.id;

  return (
    <div onClick={onClick}
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer group
        ${isActive ? "border-indigo-300 ring-2 ring-indigo-100" : "border-blue-100 hover:border-indigo-200"}`}
      style={{ animation: "slideUp 0.3s ease both" }}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Group icon */}
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm
            ${isActive ? "bg-indigo-600" : "bg-indigo-100"}`}>
            {isActive ? "👥" : "👥"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-blue-800 font-black text-base font-['Sora',sans-serif] truncate">{group.name}</p>
            <p className="text-blue-400 text-xs mt-0.5">{group.members.length} member{group.members.length !== 1 ? "s" : ""}</p>
          </div>
          {isOwner && (
            <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-xl shrink-0">
              <Crown size={10} strokeWidth={2.5} />
              Owner
            </span>
          )}
        </div>

        {/* Member avatars */}
        <div className="flex items-center gap-1 mb-4">
          {group.members.slice(0, 5).map((m, i) => (
            <div key={m.id} className="shrink-0" style={{ marginLeft: i > 0 ? "-8px" : "0" }}>
              <Avatar name={m.name} avatar={m.avatar} size="sm" />
            </div>
          ))}
          {group.members.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-500"
              style={{ marginLeft: "-8px" }}>
              +{group.members.length - 5}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-blue-300 text-xs">Created {fmtDate(group.createdAt)}</p>
          <ChevronRight size={15} className="text-blue-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {isActive && (
        <div className="px-5 py-2.5 bg-indigo-50 border-t border-indigo-100 rounded-b-2xl">
          <p className="text-indigo-600 text-[11px] font-bold">✓ Currently active context</p>
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
  const { groups, loading, error, createGroup, joinGroup, refetch } = useGroups();

  const [selectedGroup,  setSelectedGroup]  = useState<Group | null>(null);
  const [showCreate,     setShowCreate]     = useState(false);
  const [showJoin,       setShowJoin]       = useState(false);

  // After an update in the detail panel, re-fetch and refresh selected group
  const handleUpdate = async () => {
    await refetch();
    if (selectedGroup) {
      // re-select updated version
      const updated = groups.find(g => g.id === selectedGroup.id);
      if (updated) setSelectedGroup(updated);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div className="space-y-6 max-w-3xl" style={{ animation: "slideUp 0.3s ease both" }}>

        {/* ── Header ── */}
        {!selectedGroup && (
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Collaborative</p>
              <h1 className="text-blue-800 font-black text-2xl sm:text-3xl font-['Sora',sans-serif] mt-0.5">Groups</h1>
              <p className="text-blue-400 text-sm mt-1 hidden sm:block">
                {groups.length > 0
                  ? `You're in ${groups.length} group${groups.length !== 1 ? "s" : ""}`
                  : "Share budgets and track spending together"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setShowJoin(true)}
                className="flex items-center gap-1.5 border-2 border-blue-200 text-blue-600 text-xs sm:text-sm font-bold
                  px-3 sm:px-4 py-2.5 rounded-xl transition-all hover:bg-blue-50 active:scale-95">
                <LogIn size={15} />
                <span className="hidden sm:inline">Join</span>
              </button>
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold
                  px-3 sm:px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-600/25 active:scale-95">
                <Plus size={15} />
                <span className="hidden sm:inline">Create Group</span>
                <span className="sm:hidden">Create</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Detail panel ── */}
        {selectedGroup ? (
          <GroupDetailPanel
            group={selectedGroup}
            onBack={() => setSelectedGroup(null)}
            onUpdate={handleUpdate}
          />
        ) : (
          <>
            {/* ── Error ── */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <X size={14} className="shrink-0" />
                {error}
              </div>
            )}

            {/* ── Loading ── */}
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-blue-100 p-5 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-blue-100 rounded w-32" />
                        <div className="h-3 bg-blue-50 rounded w-20" />
                      </div>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="w-8 h-8 rounded-full bg-blue-100" />
                      ))}
                    </div>
                    <div className="h-3 bg-blue-50 rounded w-24" />
                  </div>
                ))}
              </div>
            ) : groups.length === 0 ? (
              /* ── Empty state ── */
              <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-12 text-center"
                style={{ animation: "slideUp 0.4s ease both" }}>
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-4xl mx-auto mb-5">
                  👥
                </div>
                <h2 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">No groups yet</h2>
                <p className="text-blue-400 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                  Create a group to share budgets and track spending together with family or friends.
                </p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <button onClick={() => setShowJoin(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all">
                    <LogIn size={16} />
                    Join with code
                  </button>
                  <button onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-indigo-600/25">
                    <Plus size={16} />
                    Create group
                  </button>
                </div>
              </div>
            ) : (
              /* ── Group cards grid ── */
              <div className="grid gap-4 sm:grid-cols-2">
                {groups.map(g => (
                  <GroupCard
                    key={g.id}
                    group={g}
                    isActive={activeContext.groupId === g.id}
                    onClick={() => setSelectedGroup(g)}
                  />
                ))}
              </div>
            )}

            {/* ── How it works — shown when at least 1 group exists ── */}
            {!loading && groups.length > 0 && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5"
                style={{ animation: "slideUp 0.5s ease both" }}>
                <p className="text-indigo-700 text-xs font-bold uppercase tracking-widest mb-3">How it works</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { icon: "👥", title: "Switch context", desc: "Use the switcher in the sidebar to view group or personal finances" },
                    { icon: "💰", title: "Shared budgets", desc: "Owners set category limits. Everyone's expenses count toward the same budget" },
                    { icon: "📊", title: "Live tracking", desc: "When any member adds an expense, the group budget updates for everyone" },
                  ].map(item => (
                    <div key={item.title} className="flex gap-3">
                      <span className="text-2xl shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-indigo-800 text-xs font-bold">{item.title}</p>
                        <p className="text-indigo-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreate={createGroup}
        />
      )}
      {showJoin && (
        <JoinGroupModal
          onClose={() => setShowJoin(false)}
          onJoin={joinGroup}
        />
      )}
    </>
  );
}