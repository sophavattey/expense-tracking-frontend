"use client";

import { useState, useEffect, useCallback } from "react";
import { budgetService } from "@/services/budget.service";
import type { BudgetSummary, BudgetRequest } from "@/types/budget.types";

interface UseBudgetsOptions {
  groupId?: string;
}

interface UseBudgetsReturn {
  summary: BudgetSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createBudget: (data: BudgetRequest) => Promise<void>;
  updateBudget: (id: string, data: BudgetRequest) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

export function useBudgets(options?: UseBudgetsOptions): UseBudgetsReturn {
  const groupId = options?.groupId;

  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = groupId
        ? await budgetService.getGroupStatus(groupId)
        : await budgetService.getStatus();
      setSummary(data);
    } catch (e: any) {
      setError(e.message || "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => { fetchBudgets(); }, [fetchBudgets]);

  const createBudget = useCallback(async (data: BudgetRequest) => {
    // Group context  → POST /api/budgets/group/{groupId}
    // Personal       → POST /api/budgets
    if (groupId) {
      await budgetService.createForGroup(groupId, data);
    } else {
      await budgetService.create(data);
    }
    await fetchBudgets();
  }, [fetchBudgets, groupId]);

  const updateBudget = useCallback(async (id: string, data: BudgetRequest) => {
    await budgetService.update(id, data);
    await fetchBudgets();
  }, [fetchBudgets]);

  const deleteBudget = useCallback(async (id: string) => {
    await budgetService.delete(id);
    await fetchBudgets();
  }, [fetchBudgets]);

  return { summary, loading, error, refetch: fetchBudgets,
           createBudget, updateBudget, deleteBudget };
}