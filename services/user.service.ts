import { apiFetch } from "./api-client";
import type { AuthUser } from "../types/auth.types";

export const userService = {
  /**
   * Updates the user's preferred display currency.
   * Returns the updated AuthUser so AuthContext can sync its state.
   */
  updatePreferredCurrency: (currency: "USD" | "KHR") =>
    apiFetch<AuthUser>("/api/user/preferences", {
      method: "PUT",
      body: JSON.stringify({ preferredCurrency: currency }),
    }),
};