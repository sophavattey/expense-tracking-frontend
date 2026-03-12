"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup } from "@/contexts/GroupContext";
import { NAV_ITEMS, NAV_BOTTOM_ITEMS, ALL_NAV_ITEMS } from "./nav-items";
import type { LucideIcon } from "lucide-react";

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

/* ─── User / member avatar ───────────────────────────────────────── */
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
    <div className={`${dims} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-black text-white shrink-0 shadow-md`}>
      {initial}
    </div>
  );
}

/* ─── Context Switcher ───────────────────────────────────────────── */
function ContextSwitcher({ collapsed }: { collapsed: boolean }) {
  const { activeContext, groups, loadingGroups, switchToPersonal, switchToGroup } = useGroup();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isGroup    = activeContext.type === "group";
  const label      = isGroup ? activeContext.groupName! : "Personal";
  const shortLabel = isGroup
    ? activeContext.groupName!.slice(0, 2).toUpperCase()
    : user?.name?.charAt(0)?.toUpperCase() ?? "P";

  if (collapsed) {
    return (
      <div className="mx-3 mb-3 flex items-center justify-center">
        <button onClick={() => setOpen(!open)} title={label}
          className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-lg transition-all hover:scale-105">
          {isGroup ? "👥" : shortLabel}
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative mx-3 mb-3">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-blue-800/60 border-blue-700 hover:bg-blue-700 transition-all">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-sm">
          {isGroup ? "👥" : (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
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
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden z-50"
          style={{ animation: "ctxDrop 0.18s ease both" }}>
          <style>{`@keyframes ctxDrop { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }`}</style>

          {/* Personal */}
          <button onClick={() => { switchToPersonal(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-blue-50">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-blue-800 text-sm font-bold truncate">Personal</p>
              <p className="text-blue-400 text-[11px]">Your private finances</p>
            </div>
            {activeContext.type === "personal" && (
              <Check size={14} className="text-blue-600 shrink-0" strokeWidth={2.5} />
            )}
          </button>

          {/* Groups */}
          {loadingGroups ? (
            <div className="px-4 py-3 text-blue-300 text-xs">Loading groups…</div>
          ) : groups.length === 0 ? (
            <div className="px-4 py-3">
              <p className="text-blue-300 text-xs">No groups yet</p>
            </div>
          ) : (
            groups.map(g => (
              <button key={g.id} onClick={() => { switchToGroup(g); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-blue-50 last:border-0">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm shrink-0">
                  👥
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-blue-800 text-sm font-bold truncate">{g.name}</p>
                  <p className="text-blue-400 text-[11px]">{g.members.length} member{g.members.length !== 1 ? "s" : ""}</p>
                </div>
                {activeContext.groupId === g.id && (
                  <Check size={14} className="text-blue-600 shrink-0" strokeWidth={2.5} />
                )}
              </button>
            ))
          )}

          {/* Create / Join */}
          <div className="px-4 py-2.5 bg-blue-50/60 flex gap-2">
            <Link href="/dashboard/groups" onClick={() => setOpen(false)}
              className="flex-1 text-center text-[11px] font-bold text-blue-600 hover:text-blue-800 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
              + Create group
            </Link>
            <Link href="/dashboard/groups?join=1" onClick={() => setOpen(false)}
              className="flex-1 text-center text-[11px] font-bold text-blue-500 hover:text-blue-800 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
              Join with code
            </Link>
          </div>
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
        <p className="text-blue-500/60 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Menu</p>
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

      <div className="my-3 mx-3 border-t border-blue-800 opacity-50" />

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
function UserRow({ compact = false }: { compact?: boolean }) {
  const { user, logout } = useAuth();
  const name   = user?.name   ?? "";
  const email  = user?.email  ?? "";
  const avatar = user?.avatar;

  if (compact) {
    return (
      <div className="flex items-center justify-center py-2">
        <UserAvatar name={name} avatar={avatar} />
      </div>
    );
  }

  return (
    <div className="mb-2">
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-700/50 cursor-pointer transition-colors">
        <UserAvatar name={name} avatar={avatar} />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold truncate">{user?.name ?? "—"}</p>
          <p className="text-blue-400 text-xs truncate">{email}</p>
        </div>
      </div>
      <button onClick={() => logout()}
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
   DESKTOP SIDEBAR
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
          className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-3"} py-2 rounded-xl text-blue-400 hover:text-white hover:bg-blue-700/50 transition-all`}>
          <svg className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MOBILE DRAWER
═══════════════════════════════════════════════════════════════════ */
export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const activeId = ALL_NAV_ITEMS.slice().reverse()
    .find(item => pathname.startsWith(item.href))?.id ?? "dashboard";

  return (
    <>
      {open && <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div className={`md:hidden fixed top-0 left-0 h-full w-72 bg-blue-900 z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-14 flex items-center px-5 border-b border-blue-800 justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="text-white font-black text-xl font-['Sora',sans-serif]">
              Fin<span className="text-blue-300">Set</span>
            </span>
          </div>
          <button onClick={onClose}
            className="text-blue-400 hover:text-white p-1.5 rounded-lg hover:bg-blue-700/50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="pt-3 px-0 border-b border-blue-800 pb-3">
          <ContextSwitcher collapsed={false} />
        </div>

        <NavLinks activeId={activeId} onLinkClick={onClose} />

        <div className="p-4 border-t border-blue-800 space-y-2">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-blue-800/60">
            <UserAvatar name={user?.name ?? ""} avatar={user?.avatar} />
            <div className="min-w-0">
              <p className="text-white text-sm font-bold truncate">{user?.name ?? "—"}</p>
              <p className="text-blue-400 text-xs truncate">{user?.email ?? ""}</p>
            </div>
          </div>
          <button onClick={() => { logout(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-blue-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MOBILE BOTTOM NAV
═══════════════════════════════════════════════════════════════════ */
export function MobileBottomNav() {
  const pathname = usePathname();
  const activeId = ALL_NAV_ITEMS.slice().reverse()
    .find(item => pathname.startsWith(item.href))?.id ?? "dashboard";

  const mobileItems = [...NAV_ITEMS.slice(0, 4), NAV_BOTTOM_ITEMS[0]];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-blue-100 flex items-center px-1"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
      {mobileItems.map(item => {
        const Icon: LucideIcon = item.icon;
        const isActive = item.id === activeId;
        return (
          <Link key={item.id} href={item.href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl mx-0.5 transition-all ${
              isActive ? "text-blue-600" : "text-blue-300 hover:text-blue-500"}`}>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75}
              className={`transition-transform ${isActive ? "scale-110" : ""}`} />
            <span className={`text-[9px] font-semibold leading-none ${isActive ? "font-bold" : ""}`}>{item.label}</span>
            {isActive && <div className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
          </Link>
        );
      })}
    </nav>
  );
}