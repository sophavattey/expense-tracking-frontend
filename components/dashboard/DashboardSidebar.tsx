"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown, Check, User, Users,
  PanelLeftClose, PanelLeftOpen, X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup } from "@/contexts/GroupContext";
import { NAV_ITEMS, NAV_BOTTOM_ITEMS, ALL_NAV_ITEMS } from "./nav-items";

/* ─── Logo mark ──────────────────────────────────────────────────── */
function LogoMark() {
  return (
    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/30">
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
}

/* ─── User avatar ────────────────────────────────────────────────── */
export function UserAvatar({ name, avatar, size = "md" }: {
  name: string; avatar?: string; size?: "xs" | "sm" | "md";
}) {
  const dims = size === "xs" ? "w-6 h-6 text-[10px]" : "w-9 h-9 text-sm";
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  if (avatar) {
    return (
      <img src={avatar} alt={name} referrerPolicy="no-referrer"
        className={`${dims} rounded-full object-cover shrink-0 shadow-md`} />
    );
  }
  return (
    <div className={`${dims} rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center font-black text-white shrink-0 shadow-md`}>
      {initial}
    </div>
  );
}

/* ─── Shared context list (used in both desktop + mobile drawer) ─── */
function ContextList({ onClose }: { onClose: () => void }) {
  const { activeContext, groups, loadingGroups, switchToPersonal, switchToGroup } = useGroup();

  return (
    <>
      <button onClick={() => { switchToPersonal(); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-700/50 transition-colors text-left border-b border-blue-800">
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
          <User size={15} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold">Personal</p>
          <p className="text-blue-400 text-[11px]">Your private finances</p>
        </div>
        {activeContext.type === "personal" && (
          <Check size={14} className="text-blue-400 shrink-0" strokeWidth={2.5} />
        )}
      </button>

      {loadingGroups ? (
        <div className="px-4 py-3 text-blue-400 text-xs">Loading groups…</div>
      ) : groups.length === 0 ? (
        <div className="px-4 py-3 text-blue-400 text-xs">No groups yet</div>
      ) : groups.map(g => (
        <button key={g.id} onClick={() => { switchToGroup(g); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-700/50 transition-colors text-left border-b border-blue-800 last:border-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <Users size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold truncate">{g.name}</p>
            <p className="text-blue-400 text-[11px]">{g.members.length} member{g.members.length !== 1 ? "s" : ""}</p>
          </div>
          {activeContext.groupId === g.id && (
            <Check size={14} className="text-blue-400 shrink-0" strokeWidth={2.5} />
          )}
        </button>
      ))}

      <div className="px-4 py-2.5 bg-blue-950/40 flex gap-2">
        <Link href="/dashboard/groups" onClick={onClose}
          className="flex-1 text-center text-[11px] font-bold text-blue-400 hover:text-white py-1.5 rounded-lg hover:bg-blue-700/50 transition-colors">
          + Create group
        </Link>
        <Link href="/dashboard/groups?join=1" onClick={onClose}
          className="flex-1 text-center text-[11px] font-bold text-blue-400 hover:text-white py-1.5 rounded-lg hover:bg-blue-700/50 transition-colors">
          Join with code
        </Link>
      </div>
    </>
  );
}

/* ─── Desktop context switcher ───────────────────────────────────── */
function ContextSwitcher({ collapsed }: { collapsed: boolean }) {
  const { activeContext } = useGroup();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const isGroup = activeContext.type === "group";
  const label   = isGroup ? activeContext.groupName! : "Personal";

  /* Collapsed icon button — fly-out to the right */
  if (collapsed) {
    return (
      <div ref={ref} className="mx-3 mb-3 relative flex justify-center">
        <button onClick={() => setOpen(!open)} title={`Context: ${label}`}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all hover:scale-105
            ${isGroup ? "bg-indigo-600" : "bg-blue-600"}`}>
          {isGroup
            ? <Users size={16} className="text-white" strokeWidth={2} />
            : <User  size={16} className="text-white" strokeWidth={2} />
          }
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute left-[52px] top-0 w-56 bg-blue-900 border border-blue-700 rounded-2xl shadow-2xl overflow-hidden z-50"
              style={{ animation: "ctxSlide 0.18s ease both" }}>
              <style>{`@keyframes ctxSlide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}`}</style>
              <div className="px-4 py-2.5 border-b border-blue-800">
                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Switch context</p>
              </div>
              <ContextList onClose={() => setOpen(false)} />
            </div>
          </>
        )}
      </div>
    );
  }

  /* Expanded dropdown */
  return (
    <div ref={ref} className="relative mx-3 mb-3">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-blue-800/60 border-blue-700 hover:bg-blue-700/80 transition-all">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isGroup ? "bg-indigo-600" : "bg-blue-600"}`}>
          {isGroup
            ? <Users size={14} className="text-white" strokeWidth={2} />
            : <User  size={14} className="text-white" strokeWidth={2} />
          }
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-white text-xs font-bold truncate leading-tight">{label}</p>
          <p className="text-blue-400 text-[10px] leading-tight">
            {isGroup ? `${activeContext.groupMembers?.length ?? 0} members` : "Personal Finance"}
          </p>
        </div>
        <ChevronDown size={13} className={`text-blue-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-blue-900 border border-blue-700 rounded-2xl shadow-2xl overflow-hidden z-50"
          style={{ animation: "ctxDrop 0.18s ease both" }}>
          <style>{`@keyframes ctxDrop{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
          <ContextList onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

/* ─── Nav links ──────────────────────────────────────────────────── */
function NavLinks({ activeId, collapsed = false, onLinkClick }: {
  activeId: string; collapsed?: boolean; onLinkClick?: () => void;
}) {
  return (
    <nav className="flex-1 py-2 overflow-y-auto px-3">
      {!collapsed && (
        <p className="text-blue-500/50 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Menu</p>
      )}
      {NAV_ITEMS.map(item => {
        const Icon: LucideIcon = item.icon;
        const isActive = item.id === activeId;
        return (
          <Link key={item.id} href={item.href} onClick={onLinkClick}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all
              ${isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                : "text-blue-300 hover:bg-blue-700/50 hover:text-white"}
              ${collapsed ? "justify-center" : ""}`}>
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
            {!collapsed && <span className="text-sm font-semibold flex-1">{item.label}</span>}
            {!collapsed && isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />}
          </Link>
        );
      })}

      <div className="my-3 mx-3 border-t border-blue-800 opacity-40" />

      {NAV_BOTTOM_ITEMS.map(item => {
        const Icon: LucideIcon = item.icon;
        const isActive = item.id === activeId;
        return (
          <Link key={item.id} href={item.href} onClick={onLinkClick}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all
              ${isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                : "text-blue-300 hover:bg-blue-700/50 hover:text-white"}
              ${collapsed ? "justify-center" : ""}`}>
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
            {!collapsed && <span className="text-sm font-semibold flex-1">{item.label}</span>}
            {!collapsed && isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />}
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── User row ───────────────────────────────────────────────────── */
function UserRow({ compact = false, onAction }: { compact?: boolean; onAction?: () => void }) {
  const { user, logout } = useAuth();
  const name   = user?.name   ?? "";
  const email  = user?.email  ?? "";
  const avatar = user?.avatar;

  if (compact) {
    return (
      <div className="flex justify-center py-1.5">
        <UserAvatar name={name} avatar={avatar} />
      </div>
    );
  }

  return (
    <div className="mb-1">
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-700/50 cursor-default transition-colors">
        <UserAvatar name={name} avatar={avatar} />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold truncate">{name || "—"}</p>
          <p className="text-blue-400 text-xs truncate">{email}</p>
        </div>
      </div>
      <button onClick={() => { logout(); onAction?.(); }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-blue-400 hover:text-red-400 hover:bg-red-500/10 transition-all mt-0.5">
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="text-sm">Sign out</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DESKTOP SIDEBAR  (hidden on mobile)
═══════════════════════════════════════════════════════════════════ */
export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const activeId = ALL_NAV_ITEMS.slice().reverse()
    .find(item => pathname.startsWith(item.href))?.id ?? "dashboard";

  return (
    <aside className={`hidden md:flex ${collapsed ? "w-[68px]" : "w-[260px]"} shrink-0 bg-blue-900 flex-col transition-all duration-300 z-20`}>
      <div className={`h-16 flex items-center ${collapsed ? "justify-center px-4" : "px-5"} border-b border-blue-800 shrink-0`}>
        <LogoMark />
        {!collapsed && (
          <div className="ml-3">
            <span className="text-white font-black text-xl font-['Sora',sans-serif] tracking-tight">
              Fin<span className="text-blue-300">Set</span>
            </span>
            <p className="text-blue-400 text-[10px] font-medium -mt-0.5">Personal Finance</p>
          </div>
        )}
      </div>

      <div className="pt-3 border-b border-blue-800 pb-3">
        <ContextSwitcher collapsed={collapsed} />
      </div>

      <NavLinks activeId={activeId} collapsed={collapsed} />

      <div className="border-t border-blue-800 p-3">
        <UserRow compact={collapsed} />
        <button onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-3"} py-2 rounded-xl text-blue-400 hover:text-white hover:bg-blue-700/50 transition-all`}>
          {collapsed
            ? <PanelLeftOpen  size={16} strokeWidth={2} />
            : <PanelLeftClose size={16} strokeWidth={2} />
          }
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MOBILE DRAWER  (hamburger → full-width slide-in panel)
   No bottom nav — this is the only mobile navigation.
═══════════════════════════════════════════════════════════════════ */
export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const activeId = ALL_NAV_ITEMS.slice().reverse()
    .find(item => pathname.startsWith(item.href))?.id ?? "dashboard";

  /* Lock body scroll while open */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else       document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40 transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-72 bg-blue-900 z-50 flex flex-col
        transition-transform duration-300 ease-in-out shadow-2xl
        ${open ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Header */}
        <div className="h-14 flex items-center px-4 border-b border-blue-800 justify-between shrink-0">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="text-white font-black text-xl font-['Sora',sans-serif]">
              Fin<span className="text-blue-300">Set</span>
            </span>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-400 hover:text-white hover:bg-blue-700/50 transition-colors">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Context switcher */}
        <div className="pt-3 border-b border-blue-800 pb-3">
          {/* Inline accordion-style context switcher for mobile */}
          <MobileContextSection onClose={onClose} />
        </div>

        {/* Nav links */}
        <NavLinks activeId={activeId} onLinkClick={onClose} />

        {/* User + sign out */}
        <div className="border-t border-blue-800 p-3 shrink-0">
          <UserRow onAction={onClose} />
        </div>
      </div>
    </>
  );
}

/* ─── Mobile context section (inline in drawer) ──────────────────── */
function MobileContextSection({ onClose }: { onClose: () => void }) {
  const { activeContext } = useGroup();
  const [expanded, setExpanded] = useState(false);

  const isGroup = activeContext.type === "group";
  const label   = isGroup ? activeContext.groupName! : "Personal";

  return (
    <div className="mx-3">
      {/* Current context — tap to expand */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-blue-800/60 border-blue-700 hover:bg-blue-700/80 transition-all">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isGroup ? "bg-indigo-600" : "bg-blue-600"}`}>
          {isGroup
            ? <Users size={14} className="text-white" strokeWidth={2} />
            : <User  size={14} className="text-white" strokeWidth={2} />
          }
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-white text-xs font-bold truncate leading-tight">{label}</p>
          <p className="text-blue-400 text-[10px] leading-tight">
            {isGroup ? `${activeContext.groupMembers?.length ?? 0} members` : "Personal Finance"}
          </p>
        </div>
        <ChevronDown size={13} className={`text-blue-400 transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* Expandable list */}
      {expanded && (
        <div className="mt-1.5 bg-blue-900 border border-blue-700 rounded-2xl overflow-hidden">
          <ContextList onClose={() => { setExpanded(false); onClose(); }} />
        </div>
      )}
    </div>
  );
}