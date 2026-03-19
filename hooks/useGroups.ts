"use client";

import { useState, useEffect, useCallback } from "react";
import { groupService } from "@/services/group.service";
import { useGroup } from "@/contexts/GroupContext";
import { cache } from "@/lib/cache";
import type { Group } from "@/types/group.types";

const POLL_INTERVAL = 10_000;
const TTL           = 25_000;
const CACHE_KEY     = "groups:my";

export function useGroups() {
  const cached = cache.get<Group[]>(CACHE_KEY);
  const [groups,  setGroups]  = useState<Group[]>(cached ?? []);
  const [loading, setLoading] = useState(!cached);
  const [error,   setError]   = useState<string | null>(null);

  const { refreshGroups, switchToPersonal, activeContext } = useGroup();

  const doFetch = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await groupService.getMyGroups();
      cache.set(CACHE_KEY, data, TTL);
      setGroups(data);
    } catch (e: any) {
      if (!silent) setError(e.message || "Failed to load groups");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { doFetch(!!cached); }, []);

  useEffect(() => {
    const id = setInterval(() => doFetch(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const refetch = useCallback(async () => {
    cache.invalidate("groups:");
    await doFetch(false);
    await refreshGroups();
  }, [doFetch, refreshGroups]);

  const createGroup = useCallback(async (name: string): Promise<Group> => {
    const group = await groupService.create({ name });
    cache.invalidate("groups:");
    await refetch();
    return group;
  }, [refetch]);

  const joinGroup = useCallback(async (inviteCode: string): Promise<Group> => {
    const group = await groupService.join({ inviteCode });
    cache.invalidate("groups:");
    await refetch();
    return group;
  }, [refetch]);

  const renameGroup = useCallback(async (groupId: string, name: string): Promise<Group> => {
    const group = await groupService.rename(groupId, { name });
    cache.invalidate("groups:");
    await refetch();
    return group;
  }, [refetch]);

  const leaveGroup = useCallback(async (groupId: string) => {
    await groupService.leave(groupId);
    if (activeContext.groupId === groupId) switchToPersonal();
    cache.invalidate("groups:");
    await refetch();
  }, [activeContext.groupId, switchToPersonal, refetch]);

  const removeMember = useCallback(async (groupId: string, targetUserId: string) => {
    await groupService.removeMember(groupId, targetUserId);
    cache.invalidate("groups:");
  }, []);

  const dissolveGroup = useCallback(async (groupId: string) => {
    await groupService.dissolve(groupId);
    if (activeContext.groupId === groupId) switchToPersonal();
    cache.invalidate("groups:");
    await refetch();
  }, [activeContext.groupId, switchToPersonal, refetch]);

  const regenerateInvite = useCallback(async (groupId: string): Promise<Group> => {
    const group = await groupService.regenerateInviteCode(groupId);
    cache.invalidate("groups:");
    await refetch();
    return group;
  }, [refetch]);

  return { groups, loading, error, refetch, createGroup, joinGroup, renameGroup, leaveGroup, removeMember, dissolveGroup, regenerateInvite };
}