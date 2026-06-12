"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";

interface FormState {
  current: string;
  newPass: string;
  confirm: string;
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, changePassword, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState<FormState>({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [localError, setLocalError] = useState<string>("");

  const ROLE_DASHBOARDS: Record<string, string> = {
    admin: "/admin/dashboard",
    teacher: "/teacher/batches",
    student: "/student/roadmap",
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    clearError();
    setLocalError("");
    if (form.newPass !== form.confirm) {
      setLocalError("New passwords do not match.");
      return;
    }
    if (form.newPass.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    const result = await changePassword(form.current, form.newPass);
    if (result.success) router.push(ROLE_DASHBOARDS[user?.role || "student"] || "/");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 32,
    padding: "0 10px",
    fontSize: 12,
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: 4,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    display: "block",
    marginBottom: 4,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FAFAF7",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 28,
          border: "1px solid rgba(0,0,0,0.10)",
        }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, marginTop: 0 }}>
          Change Password
        </h1>
        <p style={{ fontSize: 12, color: "#777", marginBottom: 20 }}>
          Please set a new password before continuing.
        </p>

        {(error || localError) && (
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "#FFEBEE",
              color: "#C62828",
              borderRadius: 4,
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Current Password</label>
            <input
              type="password"
              required
              value={form.current}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setForm((f) => ({ ...f, current: e.target.value }))
              }
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>New Password</label>
            <input
              type="password"
              required
              value={form.newPass}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setForm((f) => ({ ...f, newPass: e.target.value }))
              }
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Confirm New Password</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setForm((f) => ({ ...f, confirm: e.target.value }))
              }
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              height: 32,
              backgroundColor: isLoading
                ? "rgba(26,26,26,0.4)"
                : "#1A1A1A",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {isLoading ? "Saving…" : "Save Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
