import { apiFetch } from "./api-client";
import type { Expense, ExpensePage, ExpenseRequest, ExpenseFilters, MonthlySummary } from "../types/expense.types";

export const expenseService = {
  getAll: (filters?: ExpenseFilters) => {
    const q = new URLSearchParams();
    if (filters?.page     != null) q.set("page",       String(filters.page));
    if (filters?.size     != null) q.set("size",       String(filters.size));
    if (filters?.categoryId)       q.set("categoryId", String(filters.categoryId));
    if (filters?.from)             q.set("from",       filters.from);
    if (filters?.to)               q.set("to",         filters.to);
    return apiFetch<ExpensePage>(`/api/expenses?${q}`);
  },

  getById: (id: number) =>
    apiFetch<Expense>(`/api/expenses/${id}`),

  create: (data: ExpenseRequest) =>
    apiFetch<Expense>("/api/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: ExpenseRequest) =>
    apiFetch<Expense>(`/api/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/api/expenses/${id}`, { method: "DELETE" }),

  getSummary: (params?: { year?: number; month?: number }) => {
    const q = new URLSearchParams();
    if (params?.year)  q.set("year",  String(params.year));
    if (params?.month) q.set("month", String(params.month));
    return apiFetch<MonthlySummary>(`/api/expenses/summary?${q}`);
  },
};