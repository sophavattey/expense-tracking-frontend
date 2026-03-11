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
  updateCurrency: (currency: "USD" | "KHR") => Promise<void>;  // ✅ NEW
}

const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password"];

// ─── Context ──────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    authService.me()
      .then(setUser)
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
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ✅ register now accepts optional preferredCurrency
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

  // ✅ NEW: call API and sync user state — no page reload needed
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