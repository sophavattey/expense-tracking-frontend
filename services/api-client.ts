const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// ─── Refresh queue ────────────────────────────────────────────────
// Multiple requests can 401 simultaneously (e.g. categories + expenses on
// page load). We only want ONE refresh call. All others wait in this queue
// and resolve/reject together once the refresh settles.

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: () => void;
  reject:  (err: unknown) => void;
}> = [];

function drainQueue(error?: unknown) {
  refreshQueue.forEach(p => error ? p.reject(error) : p.resolve());
  refreshQueue = [];
}

async function tryRefresh(): Promise<void> {
  if (isRefreshing) {
    return new Promise<void>((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Refresh failed");
    drainQueue();
  } catch (err) {
    drainQueue(err);
    throw err; // caller decides what to do (AuthContext will redirect)
  } finally {
    isRefreshing = false;
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────
// `redirectOn401` — set false for calls that should simply throw (e.g. /me
//  on mount) so AuthContext can decide whether to redirect.

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
  redirectOn401 = true,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (res.status === 401 && retry) {
    try {
      await tryRefresh();
      // Refresh succeeded — retry the original request once
      return apiFetch<T>(path, options, false, redirectOn401);
    } catch {
      // Refresh failed — redirect only if caller asked for it AND we're in the browser
      if (redirectOn401 && typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    let message = "Something went wrong";
    try {
      const body: ApiResponse<unknown> = await res.json();
      message = body.message || message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  const body: ApiResponse<T> = await res.json();
  if (!body.success) throw new Error(body.message || "Request failed");
  return body.data as T;
}

export { BASE_URL };