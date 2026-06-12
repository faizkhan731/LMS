"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";

const ROLE_DASHBOARDS: Record<string, string> = {
  admin: "/admin/dashboard",
  teacher: "/teacher/batches",
  student: "/student/roadmap",
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    clearError();
    const result = await login(email, password);

    if (result.success) {
      const role = (result as Record<string, unknown>).role as string;
      if ((result as Record<string, unknown>).requiresPasswordChange) {
        router.push("/change-password");
      } else {
        router.push(ROLE_DASHBOARDS[role] || "/");
      }
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#FAFAF7" }}
    >
      <div
        className="w-full bg-white"
        style={{
          maxWidth: 360,
          padding: 28,
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.10)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="flex items-center justify-center rounded-md mb-3"
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#1A1A1A",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "#B8860B" }}>
              BBS
            </span>
          </div>
          <h1
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "#1A1A1A",
              margin: 0,
            }}
          >
            Build Beyond Studio
          </h1>
          <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
            Learning Management System
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="mb-4 px-3 py-2 rounded"
            style={{
              backgroundColor: "#FFEBEE",
              color: "#C62828",
              fontSize: 12,
              borderRadius: 4,
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#1A1A1A",
                display: "block",
                marginBottom: 4,
              }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="you@buildbeyondstudio.com"
              style={{
                width: "100%",
                height: 32,
                padding: "0 10px",
                fontSize: 12,
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: 4,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#1A1A1A",
                display: "block",
                marginBottom: 4,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                style={{
                  width: "100%",
                  height: 32,
                  padding: "0 10px",
                  fontSize: 12,
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRadius: 4,
                  outline: "none",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  paddingRight: 32,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                title={showPass ? "Hide" : "Show"}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#777",
                }}
              >
                {showPass ? "👁" : "👁‍🗨"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              height: 32,
              backgroundColor: isLoading ? "rgba(26,26,26,0.4)" : "#1A1A1A",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {isLoading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
