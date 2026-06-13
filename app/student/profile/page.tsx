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

const StudentProfile: FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
        </>
      )}
    </Shell>
  );
};

export default StudentProfile;
