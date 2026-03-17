import type { Category } from "./category.types";

export type Currency      = "USD" | "KHR";
export type PaymentMethod = "CASH" | "KHQR" | "CARD" | "EWALLET" | "OTHER";

export interface Expense {
  id: string;
  /** UUID of the user who created this expense — used for group member attribution */
  userId: string;
  amount: number;
  currency: Currency;
  amountBase: number;
  date: string;
  category: Category;
  merchantName?: string;
  note?: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensePage {
  content: Expense[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ExpenseRequest {
  amount: number;
  currency: Currency;
  date: string;
  categoryId: string;
  merchantName?: string;
  note?: string;
  paymentMethod?: string;
}

export interface ExpenseFilters {
  page?: number;
  size?: number;
  categoryId?: string;
  from?: string;
  to?: string;
}

export interface MonthlySummary {
  year: number;
  month: number;
  totalSpentUsd: number;
  totalSpentKhr: number;
  breakdown: {
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    totalUsd: number;
    totalKhr: number;
    percentage: number;
  }[];
}