"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/services/api-client";

export interface Notification {
  id:        string;
  type:      "BUDGET_WARNING" | "BUDGET_EXCEEDED" | "GROUP_EXPENSE_ADDED" | "GROUP_MEMBER_JOINED" | "GROUP_MEMBER_LEFT";
  title:     string;
  body:      string;
  actionUrl: string | null;
  read:      boolean;
  createdAt: string;
}

interface NotificationList {
  notifications: Notification[];
  unreadCount:   number;
}

const POLL_INTERVAL = 10_000;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      // Pass redirectOn401=false — don't redirect on auth failure for notifications
      const data = await apiFetch<NotificationList>("/api/notifications", {}, true, false);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  const silentFetch = useCallback(async () => {
    try {
      // redirectOn401=false — background poll should never force a redirect
      const data = await apiFetch<NotificationList>("/api/notifications", {}, true, false);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch { /* ignore background errors */ }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  useEffect(() => {
    const id = setInterval(silentFetch, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [silentFetch]);

  const markAllRead = useCallback(async () => {
    try {
      await apiFetch("/api/notifications/read-all", { method: "PUT" }, true, false);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  }, []);

  const markRead = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: "PUT" }, true, false);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  }, []);

  return { notifications, unreadCount, loading, markAllRead, markRead, refetch: fetchNotifications };
}