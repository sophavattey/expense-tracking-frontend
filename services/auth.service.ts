import { apiFetch, BASE_URL } from "@/services/api-client";
import type { AuthUser } from "@/types/auth.types";

export const authService = {
  // redirectOn401=false: on mount we just want null user, not a redirect loop.
  // apiFetch will still try to refresh once; if that also fails it throws,
  // and AuthContext catches it and redirects cleanly.
  me: () =>
    apiFetch<AuthUser>("/api/auth/me", {}, true, false),

  login: (email: string, password: string) =>
    apiFetch<AuthUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiFetch<AuthUser>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  loginWithGoogle: () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/google`;
  },

  refresh: () =>
    apiFetch<AuthUser>("/api/auth/refresh", { method: "POST" }),

  logout: () =>
    apiFetch<void>("/api/auth/logout", { method: "POST" }),
};