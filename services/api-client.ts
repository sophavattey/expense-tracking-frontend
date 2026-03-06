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
    // Another request is already refreshing — join the queue
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
    drainQueue();          // wake all waiting requests — they will retry
  } catch (err) {
    drainQueue(err);       // wake all waiting requests — they will throw
    // Redirect to login. Works in both browser and during RSC navigation.
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw err;
  } finally {
    isRefreshing = false;
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (res.status === 401 && retry) {
    // Will either resolve (refresh succeeded) or throw (refresh failed + redirect)
    await tryRefresh();
    // Retry the original request once with the new access-token cookie
    return apiFetch<T>(path, options, false);
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