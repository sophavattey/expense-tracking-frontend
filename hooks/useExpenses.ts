"use client";

import { useState, useEffect, useCallback } from "react";
import { expenseService } from "@/services/expense.service";
import { cache } from "@/lib/cache";
import type { Expense, ExpensePage, ExpenseRequest, ExpenseFilters } from "@/types/expense.types";

interface UseExpensesOptions extends ExpenseFilters { groupId?: string; }
interface UseExpensesReturn {
  expenses: Expense[];
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createExpense: (data: ExpenseRequest) => Promise<Expense>;
  updateExpense: (id: string, data: ExpenseRequest) => Promise<Expense>;
  deleteExpense: (id: string) => Promise<void>;
}

const POLL_INTERVAL = 10_000;
const TTL           = 25_000;

export function useExpenses(filters?: UseExpensesOptions): UseExpensesReturn {
  const { groupId, page, size, categoryId, from, to } = filters ?? {};
  const cacheKey = `expenses:${JSON.stringify({ groupId, page, size, categoryId, from, to })}`;

  const cached = cache.get<ExpensePage>(cacheKey);
  const [expenses,      setExpenses]      = useState<Expense[]>(cached?.content ?? []);
  const [totalElements, setTotalElements] = useState(cached?.totalElements ?? 0);
  const [totalPages,    setTotalPages]    = useState(cached?.totalPages ?? 0);
  const [loading,       setLoading]       = useState(!cached);
  const [error,         setError]         = useState<string | null>(null);

  const doFetch = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const result: ExpensePage = groupId
        ? await expenseService.getGroupExpenses(groupId, { page, size, categoryId, from, to })
        : await expenseService.getAll({ page, size, categoryId, from, to });
      cache.set(cacheKey, result, TTL);
      setExpenses(result.content);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
    } catch (e: any) {
      if (!silent) setError(e.message || "Failed to load expenses");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [groupId, page, size, categoryId, from, to, cacheKey]);

  useEffect(() => { doFetch(!!cached); }, [groupId, page, size, categoryId, from, to]);

  useEffect(() => {
    if (!groupId) return;
    const id = setInterval(() => doFetch(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [groupId]);

  const refetch = useCallback(async () => {
    cache.invalidate("expenses:");
    await doFetch(false);
  }, [doFetch]);

  const createExpense = useCallback(async (data: ExpenseRequest) => {
    const payload = groupId ? { ...data, groupId } : data;
    const created = await expenseService.create(payload);
    cache.invalidate("expenses:");
    await doFetch(false);
    return created;
  }, [doFetch, groupId]);

  const updateExpense = useCallback(async (id: string, data: ExpenseRequest) => {
    const updated = await expenseService.update(id, data);
    cache.invalidate("expenses:");
    setExpenses(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    await expenseService.delete(id);
    cache.invalidate("expenses:");
    await doFetch(false);
  }, [doFetch]);

  return { expenses, totalElements, totalPages, loading, error, refetch, createExpense, updateExpense, deleteExpense };
}