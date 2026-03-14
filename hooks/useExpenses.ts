"use client";

import { useState, useEffect, useCallback } from "react";
import { expenseService } from "@/services/expense.service";
import type { Expense, ExpensePage, ExpenseRequest, ExpenseFilters } from "@/types/expense.types";

interface UseExpensesOptions extends ExpenseFilters {
  groupId?: string; // if provided, fetches group expenses
}

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

export function useExpenses(filters?: UseExpensesOptions): UseExpensesReturn {
  const [expenses,      setExpenses]      = useState<Expense[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages,    setTotalPages]    = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);

  const groupId    = filters?.groupId;
  const page       = filters?.page;
  const size       = filters?.size;
  const categoryId = filters?.categoryId;
  const from       = filters?.from;
  const to         = filters?.to;

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Group context → /api/expenses/group/{groupId}?...
      // Personal      → /api/expenses?...
      const result: ExpensePage = groupId
        ? await expenseService.getGroupExpenses(groupId, { page, size, categoryId, from, to })
        : await expenseService.getAll({ page, size, categoryId, from, to });
      setExpenses(result.content);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
    } catch (e: any) {
      setError(e.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [groupId, page, size, categoryId, from, to]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const createExpense = useCallback(async (data: ExpenseRequest) => {
    const payload = groupId ? { ...data, groupId } : data;
    const created = await expenseService.create(payload);
    await fetchExpenses();
    return created;
  }, [fetchExpenses, groupId]);

  const updateExpense = useCallback(async (id: string, data: ExpenseRequest) => {
    const updated = await expenseService.update(id, data);
    setExpenses(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    await expenseService.delete(id);
    await fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses, totalElements, totalPages,
    loading, error,
    refetch: fetchExpenses,
    createExpense, updateExpense, deleteExpense,
  };
}