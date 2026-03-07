import type { Category } from "./category.types";

export type Currency      = "USD" | "KHR";
export type PaymentMethod = "CASH" | "CARD" | "KHQR" | "BANK" | "APP" | "OTHER";

export interface Expense {
  id: number;
  amount: number;
  currency: Currency;
  amountBase: number; // always USD — use this for all calculations
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
  categoryId: number;
  merchantName?: string;
  note?: string;
  paymentMethod?: string;
}

export interface ExpenseFilters {
  page?: number;
  size?: number;
  categoryId?: number;
  from?: string;
  to?: string;
}

export interface MonthlySummary {
  year: number;
  month: number;
  totalSpentUsd: number; // sum of amountBase — always USD
  totalSpentKhr: number; // totalSpentUsd × 4000
  breakdown: {
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    totalUsd: number;    // category total in USD
    totalKhr: number;    // category total in KHR
    percentage: number;
  }[];
}