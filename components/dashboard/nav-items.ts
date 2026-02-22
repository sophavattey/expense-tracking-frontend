import {
  LayoutDashboard,
  Receipt,
  Target,
  Tags,
  BarChart3,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",  href: "/dashboard",            id: "dashboard"  },
  { icon: Receipt,         label: "Expenses",   href: "/dashboard/expenses",   id: "expenses"   },
  { icon: Target,          label: "Budgets",    href: "/dashboard/budgets",    id: "budgets"    },
  { icon: Tags,            label: "Categories", href: "/dashboard/categories", id: "categories" },
  { icon: BarChart3,       label: "Analytics",  href: "/dashboard/analytics",  id: "analytics"  },
  { icon: Settings,        label: "Settings",   href: "/dashboard/settings",   id: "settings"   },
];

export type NavItem = (typeof NAV_ITEMS)[number];