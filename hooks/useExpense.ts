"use client";

import { useState, useEffect } from "react";
import { expenseService } from "@/services/expense.service";
import type { Expense } from "@/types/expense.types";

interface UseExpenseReturn {
  expense: Expense | null;
  loading: boolean;
  error: string | null;
}

export function useExpense(id: string | null): UseExpenseReturn {  
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await expenseService.getById(id);
        if (!cancelled) setExpense(data);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load expense");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  return { expense, loading, error };
}