import type { Category } from "./category.types";

export type BudgetPeriod = "DAILY" | "WEEKLY" | "MONTHLY";

export interface Budget {
  id: string;                           
  category: Category | null;
  period: BudgetPeriod;
  limitUsd: number;
  recurring: boolean;
  startDate?: string;
  endDate?: string;
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
  limitUsd: number;
  recurring: boolean;
  startDate?: string;
  endDate?: string;
}