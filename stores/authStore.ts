// // import { create } from "zustand";

// // // ─────────────────────────────────────────────
// // // Types
// // // ─────────────────────────────────────────────

// // export interface User {
// //   id: string;
// //   name: string;
// //   email: string;
// //   role: "admin" | "teacher" | "student";
// //   avatar?: string;
// // }

// // interface AuthResponse {
// //   // user: User;
// //     user?: User;  
// //   requiresPasswordChange?: boolean;
// //   success?: boolean;
// //   error?: string;
// //   message?: string; 

// // }

// // interface ChangePasswordResponse {
// //   success: boolean;
// //   error?: string;
// // }

// // interface AuthStoreState {
// //   user: User | null;
// //   isLoading: boolean;
// //   error: string | null;
// // }

// // interface AuthStoreActions {
// //   login: (email: string, password: string) => Promise<AuthResponse>;
// //   logout: () => Promise<void>;
// //   fetchMe: () => Promise<void>;
// //   changePassword: (
// //     currentPassword: string,
// //     newPassword: string
// //   ) => Promise<ChangePasswordResponse>;
// //   clearError: () => void;
// // }

// // type AuthStore = AuthStoreState & AuthStoreActions;

// // // ─────────────────────────────────────────────
// // // Auth Store — manages user session state
// // // JWT is stored in httpOnly cookie by backend.
// // // This store holds decoded user info for UI use.
// // // ─────────────────────────────────────────────

// // const useAuthStore = create<AuthStore>((set) => ({
// //   // ── State ──────────────────────────────────
// //   user: null,
// //   isLoading: false,
// //   error: null,

// //   // ── Actions ────────────────────────────────

// //   /**
// //    * Login — POST /api/auth/login
// //    * Backend sets httpOnly cookie with JWT.
// //    * We store decoded user info in state.
// //    */
// //   // login: async (email: string, password: string): Promise<AuthResponse> => {
// //   //   set({ isLoading: true, error: null });
// //   //       console.log("DEBUG →", JSON.stringify(email), JSON.stringify(password)); // 👈 temporary

// //   //    const demoUsers: Record<string, User> = {
// //   //     "admin@demo.com": {
// //   //       id: "demo-admin",
// //   //       name: "Admin User",
// //   //       email: "admin@demo.com",
// //   //       role: "admin",
// //   //     },
// //   //     "teacher@demo.com": {
// //   //       id: "demo-teacher",
// //   //       name: "Teacher User",
// //   //       email: "teacher@demo.com",
// //   //       role: "teacher",
// //   //     },
// //   //     "student@demo.com": {
// //   //       id: "demo-student",
// //   //       name: "Student User",
// //   //       email: "student@demo.com",
// //   //       role: "student",
// //   //     },
// //   //   };

// //   //   if (password === "Demo@123" && demoUsers[email]) {
// //   //     const user = demoUsers[email];
// //   //     set({ user, isLoading: false, error: null });
// //   //     return { success: true, user };
// //   //   }


// //   login: async (email: string, password: string): Promise<AuthResponse> => {
// //     set({ isLoading: true, error: null });

// //     const demoUsers: Record<string, { password: string; user: User }> = {
// //       "admin@demo.com": {
// //         password: "admin123",
// //         user: { id: "demo-admin", name: "Admin User", email: "admin@demo.com", role: "admin" },
// //       },
// //       "teacher@demo.com": {
// //         password: "teacher123",
// //         user: { id: "demo-teacher", name: "Teacher User", email: "teacher@demo.com", role: "teacher" },
// //       },
// //       "student@demo.com": {
// //         password: "student123",
// //         user: { id: "demo-student", name: "Student User", email: "student@demo.com", role: "student" },
// //       },
// //     };

// //    const emailKey = email.trim().toLowerCase();
// // const passKey = password.trim();
// // const demo = demoUsers[emailKey];

// // console.log("DEBUG", {
// //   emailKey,
// //   passKey,
// //   demoFound: !!demo,
// //   demoPassword: demo?.password,
// //   match: demo?.password === passKey,
// // });

// // if (demo && demo.password === passKey) {
// //   set({ user: demo.user, isLoading: false, error: null });
// //   return { success: true, user: demo.user };
// // }
// //     // try {
// //     //   const res = await fetch(
// //     //     `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
// //     //     {
// //     //       method: "POST",
// //     //       headers: { "Content-Type": "application/json" },
// //     //       credentials: "include", // important: send/receive cookies
// //     //       body: JSON.stringify({ email, password }),
// //     //     }
// //     //   );
// //      try {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           credentials: "include", // important: send/receive cookies
// //           body: JSON.stringify({ email, password }),
// //         }
// //       );

// //       const data: AuthResponse = await res.json();

// //       if (!res.ok) {
// //         set({
// //           error: (data.message as string) || "Login failed",
// //           isLoading: false,
// //         });
// //         // return { success: false, error: data.error };
// //         return { success: false, error: data.message || data.error };

// //       }

// //       set({ user: data.user, isLoading: false, error: null });

// //       return {
// //         success: true,
// //         ...data,
// //       };
// //     } catch (err) {
// //       const msg = "Network error. Please try again.";
// //       set({ error: msg, isLoading: false });
// //       return { success: false, error: msg };
// //     }
// //   },

// //   /**
// //    * Logout — POST /api/auth/logout
// //    * Backend clears httpOnly cookie.
// //    */
// //   logout: async (): Promise<void> => {
// //     try {
// //       await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
// //         method: "POST",
// //         credentials: "include",
// //       });
// //     } catch {
// //       // Ignore network errors on logout
// //     }
// //     set({ user: null, error: null });
// //     if (typeof window !== "undefined") {
// //       window.location.href = "/login";
// //     }
// //   },

// //   /**
// //    * Get current user from backend (called on app mount)
// //    * Uses existing cookie to rehydrate auth state.
// //    */
// //   fetchMe: async (): Promise<void> => {
// //     set({ isLoading: true });
// //     try {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
// //         { credentials: "include" }
// //       );

// //       if (!res.ok) {
// //         set({ user: null, isLoading: false });
// //         return;
// //       }

// //       const data: AuthResponse = await res.json();
// //       set({ user: data.user, isLoading: false });
// //     } catch {
// //       set({ user: null, isLoading: false });
// //     }
// //   },

// //   /**
// //    * Change password (first login flow)
// //    */
// //   changePassword: async (
// //     currentPassword: string,
// //     newPassword: string
// //   ): Promise<ChangePasswordResponse> => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           credentials: "include",
// //           body: JSON.stringify({ currentPassword, newPassword }),
// //         }
// //       );

// //       const data: Record<string, unknown> = await res.json();

// //       if (!res.ok) {
// //         set({
// //           error: (data.message as string) || "Failed to change password",
// //           isLoading: false,
// //         });
// //         return { success: false, error: data.message as string };
// //       }

// //       set({ isLoading: false });
// //       return { success: true };
// //     } catch (err) {
// //       const msg = "Network error. Please try again.";
// //       set({ error: msg, isLoading: false });
// //       return { success: false, error: msg };
// //     }
// //   },

// //   // Clear error
// //   clearError: () => set({ error: null }),
// // }));

// // export default useAuthStore;


// import { create } from "zustand";

// // ─────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: "admin" | "teacher" | "student";
//   avatar?: string;
// }

// interface AuthResponse {
//   user?: User;
//   requiresPasswordChange?: boolean;
//   success?: boolean;
//   error?: string;
//   message?: string;
// }

// interface ChangePasswordResponse {
//   success: boolean;
//   error?: string;
// }

// interface AuthStoreState {
//   user: User | null;
//   isLoading: boolean;
//   error: string | null;
// }

// interface AuthStoreActions {
//   login: (email: string, password: string) => Promise<AuthResponse>;
//   logout: () => Promise<void>;
//   fetchMe: () => Promise<void>;
//   changePassword: (
//     currentPassword: string,
//     newPassword: string
//   ) => Promise<ChangePasswordResponse>;
//   clearError: () => void;
// }

// type AuthStore = AuthStoreState & AuthStoreActions;

// // ─────────────────────────────────────────────
// // Demo users — frontend only, no backend needed
// // ─────────────────────────────────────────────

// const DEMO_USERS: Record<string, { password: string; user: User }> = {
//   "admin@demo.com": {
//     password: "admin123",
//     user: {
//       id: "demo-admin",
//       name: "Admin User",
//       email: "admin@demo.com",
//       role: "admin",
//     },
//   },
//   "teacher@demo.com": {
//     password: "teacher123",
//     user: {
//       id: "demo-teacher",
//       name: "Teacher User",
//       email: "teacher@demo.com",
//       role: "teacher",
//     },
//   },
//   "student@demo.com": {
//     password: "student123",
//     user: {
//       id: "demo-student",
//       name: "Student User",
//       email: "student@demo.com",
//       role: "student",
//     },
//   },
// };

// // ─────────────────────────────────────────────
// // Auth Store
// // ─────────────────────────────────────────────

// const useAuthStore = create<AuthStore>((set) => ({
//   // ── State ──────────────────────────────────
//   user: null,
//   isLoading: false,
//   error: null,

//   // ── Actions ────────────────────────────────

//   /**
//    * Login — checks demo users first.
//    * If NEXT_PUBLIC_API_URL is set, falls back to real API.
//    * Otherwise returns "Invalid credentials" cleanly.
//    */
//   login: async (email: string, password: string): Promise<AuthResponse> => {
//     set({ isLoading: true, error: null });

//     const emailKey = email.trim().toLowerCase();
//     const passKey = password.trim();
//     const demo = DEMO_USERS[emailKey];

//     // ── Demo login check ──────────────────────
//     if (demo) {
//       if (demo.password === passKey) {
//         set({ user: demo.user, isLoading: false, error: null });
//         return { success: true, user: demo.user };
//       } else {
//         // Email matched but password wrong — don't hit API
//         const msg = "Invalid password.";
//         set({ error: msg, isLoading: false });
//         return { success: false, error: msg };
//       }
//     }

//     // ── Real API fallback (only if backend URL is configured) ──
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//     if (!apiUrl) {
//       // No backend configured — fail cleanly instead of hitting undefined
//       const msg = "Invalid email or password.";
//       set({ error: msg, isLoading: false });
//       return { success: false, error: msg };
//     }

//     try {
//       const res = await fetch(`${apiUrl}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email, password }),
//       });

//       const data: AuthResponse = await res.json();

//       if (!res.ok) {
//         const msg = data.message || data.error || "Login failed.";
//         set({ error: msg, isLoading: false });
//         return { success: false, error: msg };
//       }

//       set({ user: data.user, isLoading: false, error: null });
//       return { success: true, ...data };
//     } catch {
//       const msg = "Network error. Please try again.";
//       set({ error: msg, isLoading: false });
//       return { success: false, error: msg };
//     }
//   },

//   /**
//    * Logout — clears state and redirects to login.
//    * Calls backend logout only if API URL is configured.
//    */
//   logout: async (): Promise<void> => {
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//     if (apiUrl) {
//       try {
//         await fetch(`${apiUrl}/api/auth/logout`, {
//           method: "POST",
//           credentials: "include",
//         });
//       } catch {
//         // Ignore network errors on logout
//       }
//     }

//     set({ user: null, error: null });

//     if (typeof window !== "undefined") {
//       window.location.href = "/login";
//     }
//   },

//   /**
//    * fetchMe — rehydrates auth state from backend cookie.
//    * Silently skips if no API URL is configured (demo mode).
//    */
//   fetchMe: async (): Promise<void> => {
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//     if (!apiUrl) {
//       // Demo mode — nothing to fetch, just mark loading done
//       set({ isLoading: false });
//       return;
//     }

//     set({ isLoading: true });

//     try {
//       const res = await fetch(`${apiUrl}/api/auth/me`, {
//         credentials: "include",
//       });

//       if (!res.ok) {
//         set({ user: null, isLoading: false });
//         return;
//       }

//       const data: AuthResponse = await res.json();
//       set({ user: data.user ?? null, isLoading: false });
//     } catch {
//       set({ user: null, isLoading: false });
//     }
//   },

//   /**
//    * Change password — requires real backend.
//    */
//   changePassword: async (
//     currentPassword: string,
//     newPassword: string
//   ): Promise<ChangePasswordResponse> => {
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//     if (!apiUrl) {
//       return { success: false, error: "Backend not configured." };
//     }

//     set({ isLoading: true, error: null });

//     try {
//       const res = await fetch(`${apiUrl}/api/auth/change-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ currentPassword, newPassword }),
//       });

//       const data: Record<string, unknown> = await res.json();

//       if (!res.ok) {
//         const msg = (data.message as string) || "Failed to change password.";
//         set({ error: msg, isLoading: false });
//         return { success: false, error: msg };
//       }

//       set({ isLoading: false });
//       return { success: true };
//     } catch {
//       const msg = "Network error. Please try again.";
//       set({ error: msg, isLoading: false });
//       return { success: false, error: msg };
//     }
//   },

//   clearError: () => set({ error: null }),
// }));

// export default useAuthStore;



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
// localStorage helpers (safe for SSR)
// ─────────────────────────────────────────────

const STORAGE_KEY = "lms_demo_user";

function saveUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function clearUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ─────────────────────────────────────────────
// Demo users — frontend only, no backend needed
// ─────────────────────────────────────────────

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@demo.com": {
    password: "admin123",
    user: {
      id: "demo-admin",
      name: "Admin User",
      email: "admin@demo.com",
      role: "admin",
    },
  },
  "teacher@demo.com": {
    password: "teacher123",
    user: {
      id: "demo-teacher",
      name: "Teacher User",
      email: "teacher@demo.com",
      role: "teacher",
    },
  },
  "student@demo.com": {
    password: "student123",
    user: {
      id: "demo-student",
      name: "Student User",
      email: "student@demo.com",
      role: "student",
    },
  },
};

// ─────────────────────────────────────────────
// Auth Store
// ─────────────────────────────────────────────

const useAuthStore = create<AuthStore>((set) => ({
  // ── State ──────────────────────────────────
  // Initialise from localStorage so page refresh keeps user logged in
  user: loadUser(),
  isLoading: false,
  error: null,

  // ── Actions ────────────────────────────────

  login: async (email: string, password: string): Promise<AuthResponse> => {
    set({ isLoading: true, error: null });

    const emailKey = email.trim().toLowerCase();
    const passKey = password.trim();
    const demo = DEMO_USERS[emailKey];

    // ── Demo login ────────────────────────────
    if (demo) {
      if (demo.password === passKey) {
        saveUser(demo.user); // persist so page refresh keeps user
        set({ user: demo.user, isLoading: false, error: null });
        return { success: true, user: demo.user };
      } else {
        const msg = "Invalid password.";
        set({ error: msg, isLoading: false });
        return { success: false, error: msg };
      }
    }

    // ── Real API fallback ─────────────────────
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      const msg = "Invalid email or password.";
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }

    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await res.json();

      if (!res.ok) {
        const msg = data.message || data.error || "Login failed.";
        set({ error: msg, isLoading: false });
        return { success: false, error: msg };
      }

      if (data.user) saveUser(data.user);
      set({ user: data.user, isLoading: false, error: null });
      return { success: true, ...data };
    } catch {
      const msg = "Network error. Please try again.";
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  logout: async (): Promise<void> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (apiUrl) {
      try {
        await fetch(`${apiUrl}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch {
        // Ignore
      }
    }

    clearUser(); // wipe localStorage on logout
    set({ user: null, error: null });

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  /**
   * fetchMe — called on app mount.
   * Demo mode: user already loaded from localStorage in initial state.
   * Real API: re-validates cookie with backend.
   */
  fetchMe: async (): Promise<void> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      // Demo mode — user already in state from loadUser(), nothing to fetch
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      const res = await fetch(`${apiUrl}/api/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        clearUser();
        set({ user: null, isLoading: false });
        return;
      }

      const data: AuthResponse = await res.json();
      if (data.user) saveUser(data.user);
      set({ user: data.user ?? null, isLoading: false });
    } catch {
      // Keep existing localStorage user on network error
      set({ isLoading: false });
    }
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<ChangePasswordResponse> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return { success: false, error: "Backend not configured." };
    }

    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`${apiUrl}/api/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data: Record<string, unknown> = await res.json();

      if (!res.ok) {
        const msg = (data.message as string) || "Failed to change password.";
        set({ error: msg, isLoading: false });
        return { success: false, error: msg };
      }

      set({ isLoading: false });
      return { success: true };
    } catch {
      const msg = "Network error. Please try again.";
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;