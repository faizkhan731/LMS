"use client";

import { useEffect, useState, FC } from "react";
import Link from "next/link";
import Shell from "@/app/components/Shell";

interface Batch {
  _id: string;
  name: string;
  course: string;
  studentCount?: number;
  daysMarked?: number;
}

const TeacherBatches: FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teacher/batches`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setBatches(d.batches || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pct = (marked: number) =>
    Math.min(100, Math.round((marked / 90) * 100));

  return (
    <Shell>
      <h1
        style={{
          fontSize: 16,
          fontWeight: 500,
          marginBottom: 16,
          marginTop: 0,
        }}
      >
        My Batches
      </h1>
      {loading ? (
        <div style={{ display: "flex", gap: 16 }}>
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 120,
                borderRadius: 8,
                backgroundColor: "rgba(0,0,0,0.06)",
              }}
            />
          ))}
        </div>
      ) : batches.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 48,
            color: "#aaa",
            fontSize: 12,
          }}
        >
          No batches assigned yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {batches.map((b) => (
            <div
              key={b._id}
              style={{
                flex: "1 1 260px",
                backgroundColor: "#fff",
                border: "1px solid rgba(0,0,0,0.10)",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <h2 style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>
                  {b.name}
                </h2>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    padding: "2px 7px",
                    borderRadius: 20,
                    backgroundColor:
                      b.course === "WD001" ? "#E3F2FD" : "#FFF8E1",
                    color: b.course === "WD001" ? "#1565C0" : "#E65100",
                  }}
                >
                  {b.course}
                </span>
              </div>
              <p style={{ fontSize: 11, color: "#777", margin: "0 0 12px" }}>
                {b.studentCount || 0} students
              </p>
              {/* Progress bar */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 10, color: "#999" }}>
                    Progress
                  </span>
                  <span style={{ fontSize: 10, color: "#777" }}>
                    {b.daysMarked || 0}/90 days
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    backgroundColor: "rgba(0,0,0,0.08)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct(b.daysMarked || 0)}%`,
                      height: "100%",
                      backgroundColor: "#B8860B",
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
              <Link href={`/teacher/batches/${b._id}/roadmap`}>
                <button
                  style={{
                    width: "100%",
                    height: 30,
                    backgroundColor: "#B8860B",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Open Roadmap
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
};

export default TeacherBatches;
