"use client";

import { create } from "zustand";
import { generateId } from "@/libs/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type ToastType = "success" | "warning" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastStoreState {
  toasts: Toast[];
}

interface ToastStoreActions {
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

type ToastStore = ToastStoreState & ToastStoreActions;

// ─────────────────────────────────────────────
// Toast Store
// ─────────────────────────────────────────────

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (type: ToastType, message: string) => {
    const id = generateId();

    set((state) => ({
      toasts: [{ id, type, message }, ...state.toasts].slice(0, 5), // max 5
    }));

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },

  removeToast: (id: string) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearAll: () => set({ toasts: [] }),
}));

// ─────────────────────────────────────────────
// useToast — convenience hook for components
//
// Usage:
//   const toast = useToast()
//   toast.success("Student added!")
//   toast.error("Something went wrong")
// ─────────────────────────────────────────────

export function useToast() {
  const { addToast } = useToastStore();
  return {
    success: (msg: string) => addToast("success", msg),
    warning: (msg: string) => addToast("warning", msg),
    error: (msg: string) => addToast("error", msg),
    info: (msg: string) => addToast("info", msg),
  };
}
