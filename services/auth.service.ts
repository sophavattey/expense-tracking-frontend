import { apiFetch, BASE_URL } from "@/services/api-client";
import type { AuthUser } from "@/types/auth.types";

export const authService = {
  me: () =>
    apiFetch<AuthUser>("/api/auth/me", {}, true, false),

  login: (email: string, password: string) =>
    apiFetch<AuthUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, preferredCurrency: "USD" | "KHR" = "USD") =>
    apiFetch<AuthUser>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, preferredCurrency }),
    }),

  loginWithGoogle: () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/google`;
  },

  refresh: () =>
    apiFetch<AuthUser>("/api/auth/refresh", { method: "POST" }),

  logout: () =>
    apiFetch<void>("/api/auth/logout", { method: "POST" }),
};