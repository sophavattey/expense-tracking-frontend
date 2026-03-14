import { apiFetch } from "./api-client";
import type { Budget, BudgetSummary, BudgetRequest } from "../types/budget.types";

export const budgetService = {
  /** Personal budgets with live spent / remaining / percentage */
  getStatus: () =>
    apiFetch<BudgetSummary>("/api/budgets/status"),

  /** Group budgets with live spent / remaining / percentage */
  getGroupStatus: (groupId: string) =>
    apiFetch<BudgetSummary>(`/api/budgets/group/${groupId}/status`),

  /** Create a personal budget */
  create: (data: BudgetRequest) =>
    apiFetch<Budget>("/api/budgets", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Create a budget scoped to a group (owner only) */
  createForGroup: (groupId: string, data: BudgetRequest) =>
    apiFetch<Budget>(`/api/budgets/group/${groupId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: BudgetRequest) =>
    apiFetch<Budget>(`/api/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/api/budgets/${id}`, { method: "DELETE" }),
};