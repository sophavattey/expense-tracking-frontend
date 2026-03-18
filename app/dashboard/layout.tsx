"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell, Users, User, ChevronDown, Check,
  AlertTriangle, Receipt, UserPlus, UserMinus, Wallet,
  type LucideIcon,
} from "lucide-react";
import { DashboardSidebar, MobileDrawer } from "@/components/dashboard/DashboardSidebar";
import { ALL_NAV_ITEMS } from "@/components/dashboard/nav-items";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup, GroupProvider } from "@/contexts/GroupContext";
import { useNotifications, type Notification } from "@/hooks/useNotifications";
import { useRouter as useNextRouter } from "next/navigation";

/* ─── Notification helpers ───────────────────────────────────────── */
function notifIcon(type: Notification["type"]) {
  switch (type) {
    case "BUDGET_EXCEEDED":      return { Icon: AlertTriangle, bg: "bg-red-100",    color: "text-red-500"    };
    case "BUDGET_WARNING":       return { Icon: Wallet,        bg: "bg-amber-100",  color: "text-amber-500"  };
    case "GROUP_EXPENSE_ADDED":  return { Icon: Receipt,       bg: "bg-blue-100",   color: "text-blue-500"   };
    case "GROUP_MEMBER_JOINED":  return { Icon: UserPlus,      bg: "bg-green-100",  color: "text-green-500"  };
    case "GROUP_MEMBER_LEFT":    return { Icon: UserMinus,     bg: "bg-gray-100",   color: "text-gray-500"   };
  }
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/* ─── Notification panel (shared between mobile + desktop) ───────── */
function NotifPanel({
  notifications, unreadCount, onMarkAllRead, onClickItem, size,
}: {
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onClickItem: (n: Notification) => void;
  size: "sm" | "md";
}) {
  const px  = size === "sm" ? "px-4" : "px-5";
  const py  = size === "sm" ? "py-2.5" : "py-3.5";
  const txt = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className={`${px} ${py} border-b border-gray-100 flex items-center justify-between`}>
        <p className={`text-gray-800 ${txt} font-bold`}>Notifications</p>
        {unreadCount > 0 && (
          <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
            {unreadCount} new
          </span>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {notifications.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <Bell size={22} className="text-gray-200 mx-auto mb-2" strokeWidth={1.75} />
            <p className="text-gray-400 text-sm">No notifications yet</p>
          </div>
        ) : notifications.map(n => {
          const { Icon, bg, color } = notifIcon(n.type);
          return (
            <div key={n.id}
              onClick={() => onClickItem(n)}
              className={`${px} ${py} hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 flex gap-3 items-start transition-colors
                ${!n.read ? "bg-blue-50/30" : ""}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon size={14} className={color} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-gray-800 text-xs font-semibold leading-snug ${!n.read ? "font-bold" : ""}`}>
                    {n.title}
                  </p>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                </div>
                <p className="text-gray-400 text-[11px] mt-0.5 leading-snug">{n.body}</p>
                <p className="text-gray-300 text-[10px] mt-1">{relativeTime(n.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {unreadCount > 0 && (
        <div className={`${px} py-2.5 border-t border-gray-100 bg-gray-50`}>
          <button onClick={onMarkAllRead}
            className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Context list ───────────────────────────────────────────────── */
function ContextList({ onClose }: { onClose: () => void }) {
  const { activeContext, groups, loadingGroups, switchToPersonal, switchToGroup } = useGroup();
  return (
    <>
      <button onClick={() => { switchToPersonal(); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
          <User size={15} className="text-blue-600" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 text-sm font-bold">Personal</p>
          <p className="text-gray-400 text-[11px]">Your private finances</p>
        </div>
        {activeContext.type === "personal" && <Check size={14} className="text-blue-600 shrink-0" strokeWidth={2.5} />}
      </button>

      {loadingGroups ? (
        <div className="px-4 py-3 text-gray-400 text-xs">Loading groups…</div>
      ) : groups.length === 0 ? (
        <div className="px-4 py-3 text-gray-400 text-xs">No groups yet</div>
      ) : groups.map(g => (
        <button key={g.id} onClick={() => { switchToGroup(g); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <Users size={15} className="text-indigo-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-sm font-bold truncate">{g.name}</p>
            <p className="text-gray-400 text-[11px]">{g.members.length} member{g.members.length !== 1 ? "s" : ""}</p>
          </div>
          {activeContext.groupId === g.id && <Check size={14} className="text-blue-600 shrink-0" strokeWidth={2.5} />}
        </button>
      ))}

      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex gap-2">
        <a href="/dashboard/groups"
          className="flex-1 text-center text-[11px] font-bold text-blue-600 hover:text-blue-700 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
          + Create group
        </a>
        <a href="/dashboard/groups?join=1"
          className="flex-1 text-center text-[11px] font-bold text-blue-600 hover:text-blue-700 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
          Join with code
        </a>
      </div>
    </>
  );
}

/* ─── Mobile header ──────────────────────────────────────────────── */
function MobileHeader({ onMenuOpen, notifications, unreadCount, onMarkAllRead, onClickNotif }: {
  onMenuOpen: () => void;
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onClickNotif: (n: Notification) => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [ctxOpen,   setCtxOpen]   = useState(false);
  const { isGroup, activeContext } = useGroup();

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
      <button onClick={onMenuOpen}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 shrink-0 transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="font-black text-base font-['Sora',sans-serif] text-gray-800">
          Fin<span className="text-blue-600">Set</span>
        </span>
      </div>

      <div className="relative flex-1">
        <button onClick={() => setCtxOpen(!ctxOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all max-w-[160px]
            ${isGroup ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-blue-50 border-blue-200 text-blue-600"}`}>
          {isGroup ? <Users size={11} strokeWidth={2.5} /> : <User size={11} strokeWidth={2.5} />}
          <span className="truncate leading-none">{isGroup ? activeContext.groupName : "Personal"}</span>
          <ChevronDown size={10} className={`shrink-0 transition-transform ${ctxOpen ? "rotate-180" : ""}`} />
        </button>
        {ctxOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setCtxOpen(false)} />
            <div className="fixed left-4 right-4 top-16 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50"
              style={{ animation: "ctxDrop 0.18s ease both", maxWidth: "320px" }}>
              <style>{`@keyframes ctxDrop{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Switch context</p>
              </div>
              <ContextList onClose={() => setCtxOpen(false)} />
            </div>
          </>
        )}
      </div>

      <div className="relative ml-auto shrink-0">
        <button onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell size={15} className="text-gray-500" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[7px] font-black">{unreadCount > 9 ? "9+" : unreadCount}</span>
            </span>
          )}
        </button>
        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-10 w-72 z-50">
              <NotifPanel
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAllRead={() => { onMarkAllRead(); setNotifOpen(false); }}
                onClickItem={n => { onClickNotif(n); setNotifOpen(false); }}
                size="sm"
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
}

/* ─── Desktop header ─────────────────────────────────────────────── */
function DesktopHeader({ notifications, unreadCount, onMarkAllRead, onClickNotif }: {
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onClickNotif: (n: Notification) => void;
}) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [ctxOpen,   setCtxOpen]   = useState(false);
  const { isGroup, activeContext } = useGroup();

  const label     = isGroup ? activeContext.groupName! : "Personal";
  const active    = ALL_NAV_ITEMS.slice().reverse().find(item => pathname.startsWith(item.href));
  const pageTitle = active?.label ?? "Dashboard";
  const PageIcon: LucideIcon = active?.icon ?? ALL_NAV_ITEMS[0].icon;

  return (
    <header className="hidden md:flex h-16 bg-white border-b border-gray-100 items-center justify-between px-8 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-gray-200 flex items-center justify-center">
            <PageIcon size={18} className="text-blue-400" strokeWidth={1.75} />
          </div>
          <h1 className="font-bold text-md font-['Sora',sans-serif] text-gray-800">{pageTitle}</h1>
        </div>
        <div className="w-px h-6 bg-gray-200" />
        <div className="relative">
          <button onClick={() => setCtxOpen(!ctxOpen)}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all hover:shadow-sm
              ${isGroup ? "bg-indigo-50 border-indigo-200" : "bg-blue-50 border-blue-200"}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isGroup ? "bg-indigo-100" : "bg-blue-100"}`}>
              {isGroup
                ? <Users size={14} className="text-indigo-600" strokeWidth={2} />
                : <User  size={14} className="text-blue-600"  strokeWidth={2} />}
            </div>
            <div className="text-left">
              <p className={`text-sm font-bold leading-tight ${isGroup ? "text-indigo-700" : "text-blue-700"}`}>{label}</p>
              <p className="text-gray-400 text-[10px] leading-tight">
                {isGroup ? `${activeContext.groupMembers?.length ?? 0} members` : "Personal Finance"}
              </p>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform shrink-0 ml-1 ${ctxOpen ? "rotate-180" : ""}`} />
          </button>
          {ctxOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setCtxOpen(false)} />
              <div className="absolute left-0 top-12 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50"
                style={{ animation: "ctxDrop 0.18s ease both" }}>
                <style>{`@keyframes ctxDrop{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Switch context</p>
                </div>
                <ContextList onClose={() => setCtxOpen(false)} />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative">
        <button onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell size={17} className="text-gray-500" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[8px] font-black">{unreadCount > 9 ? "9+" : unreadCount}</span>
            </span>
          )}
        </button>
        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-12 w-80 z-50">
              <NotifPanel
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAllRead={() => { onMarkAllRead(); setNotifOpen(false); }}
                onClickItem={n => { onClickNotif(n); setNotifOpen(false); }}
                size="md"
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
}

/* ─── Auth guard + notification wiring ──────────────────────────── */
function DashboardInner({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const nav    = useNextRouter();

  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();

  const handleClickNotif = (n: Notification) => {
    if (!n.read) markRead(n.id);
    if (n.actionUrl) nav.push(n.actionUrl);
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/login");
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">Loading FinSet…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <DashboardSidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <MobileHeader
          onMenuOpen={() => setDrawerOpen(true)}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
          onClickNotif={handleClickNotif}
        />
        <DesktopHeader
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
          onClickNotif={handleClickNotif}
        />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-7 pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        h1, h2, h3 { font-family: 'Sora', sans-serif; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }
        ::-webkit-scrollbar-track { background: transparent; }
        @keyframes slide-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .card-in { animation: slide-in 0.45s ease both; }
      `}</style>
      <GroupProvider>
        <DashboardInner>{children}</DashboardInner>
      </GroupProvider>
    </>
  );
}