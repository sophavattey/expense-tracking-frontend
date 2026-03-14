import { apiFetch } from "./api-client";
import type { Expense, ExpensePage, ExpenseRequest, ExpenseFilters, MonthlySummary } from "../types/expense.types";

function buildQuery(filters?: ExpenseFilters): string {
  const q = new URLSearchParams();
  if (filters?.page       != null) q.set("page",       String(filters.page));
  if (filters?.size       != null) q.set("size",       String(filters.size));
  if (filters?.categoryId)         q.set("categoryId", String(filters.categoryId));
  if (filters?.from)               q.set("from",       filters.from);
  if (filters?.to)                 q.set("to",         filters.to);
  return q.toString();
}

export const expenseService = {
  /** Personal expenses */
  getAll: (filters?: ExpenseFilters) =>
    apiFetch<ExpensePage>(`/api/expenses?${buildQuery(filters)}`),

  /** Group expenses — hits /api/expenses/group/{groupId}?... */
  getGroupExpenses: (groupId: string, filters?: ExpenseFilters) =>
    apiFetch<ExpensePage>(`/api/expenses/group/${groupId}?${buildQuery(filters)}`),

  /** Group monthly summary */
  getGroupSummary: (groupId: string, params?: { year?: number; month?: number }) => {
    const q = new URLSearchParams();
    if (params?.year)  q.set("year",  String(params.year));
    if (params?.month) q.set("month", String(params.month));
    return apiFetch<MonthlySummary>(`/api/expenses/group/${groupId}/summary?${q}`);
  },

  getById: (id: string) =>
    apiFetch<Expense>(`/api/expenses/${id}`),

  /** Create a personal expense */
  create: (data: ExpenseRequest) =>
    apiFetch<Expense>("/api/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Create an expense attributed to the current user within a group */
  createForGroup: (groupId: string, data: ExpenseRequest) =>
    apiFetch<Expense>(`/api/expenses/group/${groupId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: ExpenseRequest) =>
    apiFetch<Expense>(`/api/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/api/expenses/${id}`, { method: "DELETE" }),

  getSummary: (params?: { year?: number; month?: number }) => {
    const q = new URLSearchParams();
    if (params?.year)  q.set("year",  String(params.year));
    if (params?.month) q.set("month", String(params.month));
    return apiFetch<MonthlySummary>(`/api/expenses/summary?${q}`);
  },
};