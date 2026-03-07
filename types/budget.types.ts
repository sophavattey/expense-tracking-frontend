import type { Category } from "./category.types";

export type BudgetPeriod = "DAILY" | "WEEKLY" | "MONTHLY";

export interface Budget {
  id: number;
  category: Category | null; // null = overall budget
  period: BudgetPeriod;
  limitUsd: number;
  recurring: boolean;
  startDate?: string;
  endDate?: string;
}

export interface BudgetStatus {
  id: number;
  category: Category | null;
  period: BudgetPeriod;
  limitUsd: number;
  limitKhr: number;
  spentUsd: number;
  spentKhr: number;
  remainingUsd: number;
  remainingKhr: number;
  percentage: number;   // 0–999+
  isOver: boolean;
  periodLabel: string;  // e.g. "Mar 2026", "Week of Mar 3", "Mar 7, 2026"
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
  categoryId?: number | null;
  period: BudgetPeriod;
  limitUsd: number;
  recurring: boolean;
  startDate?: string;
  endDate?: string;
}