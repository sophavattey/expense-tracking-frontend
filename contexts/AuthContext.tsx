"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import type { AuthUser } from "../types/auth.types";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, skipRedirect?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, preferredCurrency?: "USD" | "KHR") => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  clearError: () => void;
  updateCurrency: (currency: "USD" | "KHR") => Promise<void>;
}

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password", "/join"];
const REDIRECT_KEY = "finset_auth_redirect";

const AuthContext = createContext<AuthContextType | null>(null);

function saveRedirect(path: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(REDIRECT_KEY, path);
}

function popRedirect(): string {
  if (typeof window === "undefined") return "/dashboard";
  const val = sessionStorage.getItem(REDIRECT_KEY) ?? "/dashboard";
  sessionStorage.removeItem(REDIRECT_KEY);
  return val;
}

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
        if (typeof window !== "undefined") {
          const stored   = sessionStorage.getItem(REDIRECT_KEY);
          const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));
          if (stored) {
            router.replace(popRedirect());
          } else if (isPublic && !pathname.startsWith("/join")) {
            // Authenticated but on a public page — go to dashboard
            // Exclude /join so an already-logged-in user visiting an invite link
            // stays on the page and sees the confirm dialog
            router.replace("/dashboard");
          }
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

  const login = useCallback(async (
    email: string,
    password: string,
    skipRedirect = false,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const u = await authService.login(email, password);
      setUser(u);
      if (!skipRedirect) {
        const params        = new URLSearchParams(window.location.search);
        const redirectParam = params.get("redirect") ?? "";
        const destination   = redirectParam || popRedirect();
        router.push(destination);
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      throw err;
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
    const params   = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    // Save redirect in a cookie so it survives the cross-origin OAuth round trip
    if (redirect) {
      document.cookie = `oauth_redirect=${encodeURIComponent(redirect)};path=/;max-age=300;SameSite=None;Secure`;
      saveRedirect(redirect); // also keep sessionStorage as fallback
    }
    authService.loginWithGoogle();
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try { await authService.logout(); }
    finally {
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
      user, loading, error,
      isAuthenticated: !!user,
      login, register, loginWithGoogle, logout, clearError, updateCurrency,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}