import {
  LayoutDashboard,
  Receipt,
  Target,
  Tags,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",  href: "/dashboard",            id: "dashboard"  },
  { icon: Receipt,         label: "Expenses",   href: "/dashboard/expenses",   id: "expenses"   },
  { icon: Target,          label: "Budgets",    href: "/dashboard/budgets",    id: "budgets"    },
  { icon: Tags,            label: "Categories", href: "/dashboard/categories", id: "categories" },
  { icon: BarChart3,       label: "Analytics",  href: "/dashboard/analytics",  id: "analytics"  },
];

/** Items below the divider — always visible */
export const NAV_BOTTOM_ITEMS = [
  { icon: Users,    label: "Groups",   href: "/dashboard/groups",   id: "groups"   },
  { icon: Settings, label: "Settings", href: "/dashboard/settings", id: "settings" },
];

export const ALL_NAV_ITEMS = [...NAV_ITEMS, ...NAV_BOTTOM_ITEMS];

export type NavItem = (typeof ALL_NAV_ITEMS)[number];