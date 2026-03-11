import type { Category } from "./category.types";

export type BudgetPeriod   = "DAILY" | "WEEKLY" | "MONTHLY";
export type BudgetCurrency = "USD" | "KHR";

export interface Budget {
  id: string;
  category: Category | null;
  period: BudgetPeriod;
  limitUsd: number;
  limitKhr: number;
}

export interface BudgetStatus {
  id: string;
  category: Category | null;
  period: BudgetPeriod;
  limitUsd: number;
  limitKhr: number;
  spentUsd: number;
  spentKhr: number;
  remainingUsd: number;
  remainingKhr: number;
  percentage: number;
  isOver: boolean;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
}

export interface BudgetSummary {
  totalBudgets: number;
  overBudgetCount: number;
  nearLimitCount: number;
  totalLimitUsd: number;
  totalSpentUsd: number;
  totalRemainingUsd: number;
  statuses: BudgetStatus[];
}

export interface BudgetRequest {
  categoryId?: string | null;
  period: BudgetPeriod;
  inputCurrency: BudgetCurrency;  // "USD" | "KHR" — tells the backend which field to use
  limitUsd?: number;              // required when inputCurrency = "USD"
  limitKhr?: number;              // required when inputCurrency = "KHR"
}