import { create } from "zustand";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  avatar?: string;
}

interface AuthResponse {
  user: User;
  requiresPasswordChange?: boolean;
  success?: boolean;
  error?: string;
}

interface ChangePasswordResponse {
  success: boolean;
  error?: string;
}

interface AuthStoreState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthStoreActions {
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<ChangePasswordResponse>;
  clearError: () => void;
}

type AuthStore = AuthStoreState & AuthStoreActions;

// ─────────────────────────────────────────────
// Auth Store — manages user session state
// JWT is stored in httpOnly cookie by backend.
// This store holds decoded user info for UI use.
// ─────────────────────────────────────────────

const useAuthStore = create<AuthStore>((set) => ({
  // ── State ──────────────────────────────────
  user: null,
  isLoading: false,
  error: null,

  // ── Actions ────────────────────────────────

  /**
   * Login — POST /api/auth/login
   * Backend sets httpOnly cookie with JWT.
   * We store decoded user info in state.
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // important: send/receive cookies
          body: JSON.stringify({ email, password }),
        }
      );

      const data: AuthResponse = await res.json();

      if (!res.ok) {
        set({
          error: (data.message as string) || "Login failed",
          isLoading: false,
        });
        return { success: false, error: data.error };
      }

      set({ user: data.user, isLoading: false, error: null });

      return {
        success: true,
        ...data,
      };
    } catch (err) {
      const msg = "Network error. Please try again.";
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  /**
   * Logout — POST /api/auth/logout
   * Backend clears httpOnly cookie.
   */
  logout: async (): Promise<void> => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore network errors on logout
    }
    set({ user: null, error: null });
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  /**
   * Get current user from backend (called on app mount)
   * Uses existing cookie to rehydrate auth state.
   */
  fetchMe: async (): Promise<void> => {
    set({ isLoading: true });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        { credentials: "include" }
      );

      if (!res.ok) {
        set({ user: null, isLoading: false });
        return;
      }

      const data: AuthResponse = await res.json();
      set({ user: data.user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  /**
   * Change password (first login flow)
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<ChangePasswordResponse> => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data: Record<string, unknown> = await res.json();

      if (!res.ok) {
        set({
          error: (data.message as string) || "Failed to change password",
          isLoading: false,
        });
        return { success: false, error: data.message as string };
      }

      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = "Network error. Please try again.";
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
