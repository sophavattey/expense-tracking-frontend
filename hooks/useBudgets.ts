"use client";

import { useState, useEffect, useCallback } from "react";
import { budgetService } from "@/services/budget.service";
import type { BudgetSummary, BudgetRequest } from "@/types/budget.types";

interface UseBudgetsReturn {
  summary: BudgetSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createBudget: (data: BudgetRequest) => Promise<void>;
  updateBudget: (id: number, data: BudgetRequest) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
}

export function useBudgets(): UseBudgetsReturn {
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await budgetService.getStatus();
      setSummary(data);
    } catch (e: any) {
      setError(e.message || "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBudgets(); }, [fetchBudgets]);

  const createBudget = useCallback(async (data: BudgetRequest) => {
    await budgetService.create(data);
    await fetchBudgets();
  }, [fetchBudgets]);

  const updateBudget = useCallback(async (id: number, data: BudgetRequest) => {
    await budgetService.update(id, data);
    await fetchBudgets();
  }, [fetchBudgets]);

  const deleteBudget = useCallback(async (id: number) => {
    await budgetService.delete(id);
    await fetchBudgets();
  }, [fetchBudgets]);

  return { summary, loading, error, refetch: fetchBudgets,
           createBudget, updateBudget, deleteBudget };
}