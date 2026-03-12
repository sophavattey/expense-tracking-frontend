"use client";

import {
  createContext, useContext, useState, useEffect,
  useCallback, ReactNode,
} from "react";
import { apiFetch } from "@/services/api-client";
import type { ActiveContext, Group } from "@/types/group.types";

/* ─── Cookie helpers ────────────────────────────────────────────── */
const COOKIE_KEY = "finset_ctx";
const COOKIE_MAX = 30 * 24 * 60 * 60; // 30 days

function readCookie(): ActiveContext {
  if (typeof document === "undefined") return { type: "personal" };
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_KEY}=([^;]*)`));
  if (!match) return { type: "personal" };
  try { return JSON.parse(decodeURIComponent(match[1])); }
  catch { return { type: "personal" }; }
}

function writeCookie(ctx: ActiveContext) {
  document.cookie =
    `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(ctx))};` +
    `path=/;max-age=${COOKIE_MAX};SameSite=Lax`;
}

/* ─── Context type ──────────────────────────────────────────────── */
interface GroupContextType {
  activeContext:   ActiveContext;
  isGroup:         boolean;           // shorthand: activeContext.type === "group"
  groups:          Group[];           // all groups this user belongs to
  loadingGroups:   boolean;
  switchToPersonal: () => void;
  switchToGroup:   (group: Group) => void;
  refreshGroups:   () => Promise<void>;
}

const GroupContext = createContext<GroupContextType | null>(null);

/* ─── Provider ──────────────────────────────────────────────────── */
export function GroupProvider({ children }: { children: ReactNode }) {
  const [activeContext, setActiveContext] = useState<ActiveContext>({ type: "personal" });
  const [groups,        setGroups]        = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  /* ── Restore from cookie on mount ── */
  useEffect(() => {
    setActiveContext(readCookie());
  }, []);

  /* ── Fetch groups the user belongs to ── */
  const refreshGroups = useCallback(async () => {
    setLoadingGroups(true);
    try {
      const data = await apiFetch<Group[]>("/api/groups/mine");
      setGroups(data);

      // If cookie points to a group that no longer exists, reset to personal
      const saved = readCookie();
      if (saved.type === "group" && !data.find(g => g.id === saved.groupId)) {
        const reset: ActiveContext = { type: "personal" };
        setActiveContext(reset);
        writeCookie(reset);
      }
    } catch {
      setGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  }, []);

  useEffect(() => { refreshGroups(); }, [refreshGroups]);

  /* ── Switch helpers ── */
  const switchToPersonal = useCallback(() => {
    const ctx: ActiveContext = { type: "personal" };
    setActiveContext(ctx);
    writeCookie(ctx);
  }, []);

  const switchToGroup = useCallback((group: Group) => {
    const ctx: ActiveContext = {
      type:         "group",
      groupId:      group.id,
      groupName:    group.name,
      groupMembers: group.members,
      role:         group.members.find(m => m.userId === group.ownerId)?.role ?? "MEMBER",
    };
    setActiveContext(ctx);
    writeCookie(ctx);
  }, []);

  return (
    <GroupContext.Provider value={{
      activeContext,
      isGroup: activeContext.type === "group",
      groups,
      loadingGroups,
      switchToPersonal,
      switchToGroup,
      refreshGroups,
    }}>
      {children}
    </GroupContext.Provider>
  );
}

/* ─── Hook ──────────────────────────────────────────────────────── */
export function useGroup() {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error("useGroup must be used inside <GroupProvider>");
  return ctx;
}