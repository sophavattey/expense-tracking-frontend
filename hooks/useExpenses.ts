"use client";

import { useState, useEffect, useCallback } from "react";
import { expenseService } from "@/services/expense.service";
import type { Expense, ExpensePage, ExpenseRequest, ExpenseFilters } from "@/types/expense.types";

interface UseExpensesReturn {
  expenses: Expense[];
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createExpense: (data: ExpenseRequest) => Promise<Expense>;
  updateExpense: (id: number, data: ExpenseRequest) => Promise<Expense>;
  deleteExpense: (id: number) => Promise<void>;
}

export function useExpenses(filters?: ExpenseFilters): UseExpensesReturn {
  const [expenses,      setExpenses]      = useState<Expense[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages,    setTotalPages]    = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);

  // Destructure to primitives so the closure always captures the latest values
  const page       = filters?.page;
  const size       = filters?.size;
  const categoryId = filters?.categoryId;
  const from       = filters?.from;
  const to         = filters?.to;

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result: ExpensePage = await expenseService.getAll({
        page, size, categoryId, from, to,
      });
      setExpenses(result.content);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
    } catch (e: any) {
      setError(e.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [page, size, categoryId, from, to]); // primitives — stable, no stale closure

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const createExpense = useCallback(async (data: ExpenseRequest) => {
    const created = await expenseService.create(data);
    await fetchExpenses();
    return created;
  }, [fetchExpenses]);

  const updateExpense = useCallback(async (id: number, data: ExpenseRequest) => {
    const updated = await expenseService.update(id, data);
    setExpenses(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  }, []);

  const deleteExpense = useCallback(async (id: number) => {
    await expenseService.delete(id);
    await fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    totalElements,
    totalPages,
    loading,
    error,
    refetch: fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}