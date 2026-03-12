"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import type { AuthUser } from "../types/auth.types";

// ─── Types ────────────────────────────────────────────────────────
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, preferredCurrency?: "USD" | "KHR") => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  clearError: () => void;
  updateCurrency: (currency: "USD" | "KHR") => Promise<void>;
}

const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/join"];

// ─── Context ──────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ─── Redirect helpers ─────────────────────────────────────────────
// We store the post-auth destination in sessionStorage so it survives
// the Google OAuth full-page redirect without polluting the URL.
const REDIRECT_KEY = "finset_auth_redirect";

function saveRedirect(path: string) {
  if (typeof window !== "undefined") sessionStorage.setItem(REDIRECT_KEY, path);
}

function popRedirect(): string {
  if (typeof window === "undefined") return "/dashboard";
  const val = sessionStorage.getItem(REDIRECT_KEY) ?? "/dashboard";
  sessionStorage.removeItem(REDIRECT_KEY);
  return val;
}

// ─── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    authService.me()
      .then(u => {
        setUser(u);
        // If we just came back from Google OAuth and there's a saved redirect, use it
        if (typeof window !== "undefined") {
          const stored = sessionStorage.getItem(REDIRECT_KEY);
          if (stored) router.replace(popRedirect());
        }
      })
      .catch(() => {
        setUser(null);
        const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));
        if (!isPublic) router.replace("/login");
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const u = await authService.login(email, password);
      setUser(u);
      // Respect ?redirect= query param, then sessionStorage, then default
      const params   = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || popRedirect();
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    preferredCurrency: "USD" | "KHR" = "USD",
  ) => {
    setLoading(true);
    setError(null);
    try {
      const u = await authService.register(name, email, password, preferredCurrency);
      setUser(u);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(() => {
    // Save the ?redirect= param (if any) to sessionStorage before the
    // full-page redirect to Google. After OAuth completes, Spring Boot
    // redirects back to the frontend, then the useEffect above picks up
    // the stored redirect and navigates there.
    const params   = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) saveRedirect(redirect);
    authService.loginWithGoogle();
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setLoading(false);
      router.push("/login");
    }
  }, [router]);

  const clearError = useCallback(() => setError(null), []);

  const updateCurrency = useCallback(async (currency: "USD" | "KHR") => {
    const updated = await userService.updatePreferredCurrency(currency);
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated: !!user,
      login,
      register,
      loginWithGoogle,
      logout,
      clearError,
      updateCurrency,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}