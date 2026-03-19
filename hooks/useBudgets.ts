"use client";

import { useState, useEffect, useCallback } from "react";
import { budgetService } from "@/services/budget.service";
import { cache } from "@/lib/cache";
import type { BudgetSummary, BudgetRequest } from "@/types/budget.types";

interface UseBudgetsOptions { groupId?: string; }
interface UseBudgetsReturn {
  summary: BudgetSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createBudget: (data: BudgetRequest) => Promise<void>;
  updateBudget: (id: string, data: BudgetRequest) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

const POLL_INTERVAL = 10_000;
const TTL           = 25_000;

export function useBudgets(options?: UseBudgetsOptions): UseBudgetsReturn {
  const groupId  = options?.groupId;
  const cacheKey = `budgets:${groupId ?? "personal"}`;

  const cached   = cache.get<BudgetSummary>(cacheKey);
  const [summary, setSummary] = useState<BudgetSummary | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [error,   setError]   = useState<string | null>(null);

  const doFetch = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const data = groupId
        ? await budgetService.getGroupStatus(groupId)
        : await budgetService.getStatus();
      cache.set(cacheKey, data, TTL);
      setSummary(data);
    } catch (e: any) {
      if (!silent) setError(e.message || "Failed to load budgets");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [groupId, cacheKey]);

  useEffect(() => { doFetch(!!cached); }, [groupId]);

  useEffect(() => {
    if (!groupId) return;
    const id = setInterval(() => doFetch(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [groupId]);

  const refetch = useCallback(async () => {
    cache.invalidate("budgets:");
    await doFetch(false);
  }, [doFetch]);

  const createBudget = useCallback(async (data: BudgetRequest) => {
    if (groupId) await budgetService.createForGroup(groupId, data);
    else         await budgetService.create(data);
    cache.invalidate("budgets:");
    await doFetch(false);
  }, [doFetch, groupId]);

  const updateBudget = useCallback(async (id: string, data: BudgetRequest) => {
    await budgetService.update(id, data);
    cache.invalidate("budgets:");
    await doFetch(false);
  }, [doFetch]);

  const deleteBudget = useCallback(async (id: string) => {
    await budgetService.delete(id);
    cache.invalidate("budgets:");
    await doFetch(false);
  }, [doFetch]);

  return { summary, loading, error, refetch, createBudget, updateBudget, deleteBudget };
}