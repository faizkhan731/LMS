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
  // user: User;
    user?: User;  
  requiresPasswordChange?: boolean;
  success?: boolean;
  error?: string;
  message?: string; 

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
  // login: async (email: string, password: string): Promise<AuthResponse> => {
  //   set({ isLoading: true, error: null });
  //       console.log("DEBUG →", JSON.stringify(email), JSON.stringify(password)); // 👈 temporary

  //    const demoUsers: Record<string, User> = {
  //     "admin@demo.com": {
  //       id: "demo-admin",
  //       name: "Admin User",
  //       email: "admin@demo.com",
  //       role: "admin",
  //     },
  //     "teacher@demo.com": {
  //       id: "demo-teacher",
  //       name: "Teacher User",
  //       email: "teacher@demo.com",
  //       role: "teacher",
  //     },
  //     "student@demo.com": {
  //       id: "demo-student",
  //       name: "Student User",
  //       email: "student@demo.com",
  //       role: "student",
  //     },
  //   };

  //   if (password === "Demo@123" && demoUsers[email]) {
  //     const user = demoUsers[email];
  //     set({ user, isLoading: false, error: null });
  //     return { success: true, user };
  //   }


  login: async (email: string, password: string): Promise<AuthResponse> => {
    set({ isLoading: true, error: null });

    const demoUsers: Record<string, { password: string; user: User }> = {
      "admin@demo.com": {
        password: "admin123",
        user: { id: "demo-admin", name: "Admin User", email: "admin@demo.com", role: "admin" },
      },
      "teacher@demo.com": {
        password: "teacher123",
        user: { id: "demo-teacher", name: "Teacher User", email: "teacher@demo.com", role: "teacher" },
      },
      "student@demo.com": {
        password: "student123",
        user: { id: "demo-student", name: "Student User", email: "student@demo.com", role: "student" },
      },
    };

   const emailKey = email.trim().toLowerCase();
const passKey = password.trim();
const demo = demoUsers[emailKey];

console.log("DEBUG", {
  emailKey,
  passKey,
  demoFound: !!demo,
  demoPassword: demo?.password,
  match: demo?.password === passKey,
});

if (demo && demo.password === passKey) {
  set({ user: demo.user, isLoading: false, error: null });
  return { success: true, user: demo.user };
}
    // try {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       credentials: "include", // important: send/receive cookies
    //       body: JSON.stringify({ email, password }),
    //     }
    //   );
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
        // return { success: false, error: data.error };
        return { success: false, error: data.message || data.error };

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
