/**
 * Centralised budget colour + status logic.
 * Import this in both the dashboard page and the budgets page.
 *
 *  0 – 50%   → Safe    CheckCircle   green
 * 50 – 80%   → Warning AlertTriangle yellow
 * 80 – 100%  → Danger  AlertOctagon  orange
 *  > 100%    → Over    XCircle       red
 */

import type { LucideIcon } from "lucide-react";
import { CheckCircle, AlertTriangle, AlertOctagon, XCircle } from "lucide-react";

export type BudgetStatus = "safe" | "warning" | "danger" | "over";

export interface BudgetColor {
  status:      BudgetStatus;
  label:       string;
  /** Lucide icon component */
  Icon:        LucideIcon;
  /** Tailwind icon colour class */
  iconClass:   string;
  /** Tailwind bar fill class */
  barClass:    string;
  /** Tailwind text class for amounts / % */
  textClass:   string;
  /** Tailwind border tint for the card */
  borderClass: string;
  /** Tailwind subtle card background tint */
  bgTintClass: string;
}

export function getBudgetColor(pct: number): BudgetColor {
  if (pct > 100) return {
    status:      "over",
    label:       "Over Budget",
    Icon:        XCircle,
    iconClass:   "text-red-500",
    barClass:    "bg-red-500",
    textClass:   "text-red-500",
    borderClass: "border-red-200",
    bgTintClass: "bg-red-50/30",
  };
  if (pct >= 80) return {
    status:      "danger",
    label:       "Danger",
    Icon:        AlertOctagon,
    iconClass:   "text-orange-500",
    barClass:    "bg-orange-400",
    textClass:   "text-orange-500",
    borderClass: "border-orange-200",
    bgTintClass: "bg-orange-50/20",
  };
  if (pct >= 50) return {
    status:      "warning",
    label:       "Warning",
    Icon:        AlertTriangle,
    iconClass:   "text-yellow-500",
    barClass:    "bg-yellow-400",
    textClass:   "text-yellow-600",
    borderClass: "border-yellow-200",
    bgTintClass: "bg-yellow-50/10",
  };
  return {
    status:      "safe",
    label:       "Safe",
    Icon:        CheckCircle,
    iconClass:   "text-green-500",
    barClass:    "bg-green-500",
    textClass:   "text-green-600",
    borderClass: "border-green-100",
    bgTintClass: "",
  };
}