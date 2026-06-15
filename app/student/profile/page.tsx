"use client";

import { useEffect, useState, FC } from "react";
import Shell from "@/app/components/Shell";

interface Batch {
  name: string;
}

interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  course: string;
  batch?: Batch;
}

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: 24,
  borderRadius: 8,
  width: 400,
  maxWidth: "90%",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 36,
  padding: "0 10px",
  marginBottom: 12,
  fontSize: 13,
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: 4,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const StudentProfile: FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Password modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match!");
    }
    setIsUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/profile/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update password");
      }
      alert("Password updated successfully!");
      setIsModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      // Fallback for demo
      alert(error.message || "Failed to update password. (Mocked success)");
      setIsModalOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const DEMO_PROFILE: StudentProfile = {
    name: "Aarav Mehta",
    email: "aarav.mehta@email.com",
    phone: "9876543210",
    course: "WD001",
    batch: { name: "WD Batch Jan-26" },
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/profile`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        const p = d.student || d;
        setProfile(p?.name ? p : DEMO_PROFILE);
      })
      .catch(() => setProfile(DEMO_PROFILE))
      .finally(() => setLoading(false));
  }, []);

  const initials =
    profile?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <Shell>
      <h1
        style={{
          fontSize: 16,
          fontWeight: 500,
          marginBottom: 20,
          marginTop: 0,
        }}
      >
        Profile
      </h1>
      {loading ? (
        <div style={{ color: "#aaa", fontSize: 12 }}>Loading…</div>
      ) : (
        <>
          {/* Header card */}
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid rgba(0,0,0,0.10)",
              borderRadius: 8,
              padding: 20,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "#F5E6C8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                color: "#7A5C00",
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  margin: "0 0 4px",
                }}
              >
                {profile?.name}
              </h2>
              <span
                style={{
                  fontSize: 11,
                  color: "#777",
                  backgroundColor: "#F5E6C8",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                {profile?.batch?.name || "No batch"}
              </span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                height: 30,
                padding: "0 14px",
                border: "1px solid rgba(0,0,0,0.10)",
                borderRadius: 4,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                backgroundColor: "transparent",
              }}
            >
              Change Password
            </button>
          </div>

          {/* Details card */}
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid rgba(0,0,0,0.10)",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <div className="responsive-table-wrap">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    ["Email", profile?.email],
                    ["Phone", profile?.phone],
                    ["Course", profile?.course],
                    ["Course ID", profile?.course],
                    ["Batch", profile?.batch?.name || "—"],
                    ["WhatsApp", profile?.batch?.name],
                  ].map(([label, value]) => (
                    <tr key={label} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                      <td
                        style={{
                          padding: "10px 0",
                          fontSize: 11,
                          color: "#777",
                          width: 120,
                          fontWeight: 500,
                        }}
                      >
                        {label}
                      </td>
                      <td style={{ padding: "10px 0", fontSize: 12 }}>
                        {label === "Course" ? (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 600,
                              padding: "2px 7px",
                              borderRadius: 20,
                              backgroundColor:
                                value === "WD001" ? "#E3F2FD" : "#FFF8E1",
                              color:
                                value === "WD001" ? "#1565C0" : "#E65100",
                            }}
                          >
                            {value}
                          </span>
                        ) : (
                          value || "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Change Password Modal */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 18 }}>Change Password</h2>
            <form onSubmit={handleUpdatePassword}>
              <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>Current Password</label>
              <input
                style={inputStyle}
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>New Password</label>
              <input
                style={inputStyle}
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>Confirm New Password</label>
              <input
                style={inputStyle}
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: 4,
                    backgroundColor: "#B8860B",
                    color: "#fff",
                    cursor: isUpdating ? "not-allowed" : "pointer",
                    fontSize: 13,
                    opacity: isUpdating ? 0.7 : 1,
                  }}
                >
                  {isUpdating ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Shell>
  );
};

export default StudentProfile;
