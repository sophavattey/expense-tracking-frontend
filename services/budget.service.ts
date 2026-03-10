import { apiFetch } from "./api-client";
import type { Budget, BudgetSummary, BudgetRequest } from "../types/budget.types";

export const budgetService = {
  getStatus: () =>
    apiFetch<BudgetSummary>("/api/budgets/status"),

  create: (data: BudgetRequest) =>
    apiFetch<Budget>("/api/budgets", {
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