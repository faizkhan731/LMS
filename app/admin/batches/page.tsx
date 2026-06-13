"use client";

import { useEffect, useState, FC } from "react";
import Link from "next/link";
import Shell from "@/app/components/Shell";

interface Batch {
  _id: string;
  name: string;
  course: string;
  teacher?: { name: string };
  studentCount?: number;
  daysMarked?: number;
  status: string;
}

const CourseBadge: FC<{ course: string }> = ({ course }) => {
  const isWD = course === "WD001";
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: 20,
        backgroundColor: isWD ? "#E3F2FD" : "#FFF8E1",
        color: isWD ? "#1565C0" : "#E65100",
      }}
    >
      {course}
    </span>
  );
};

const StatusBadge: FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { bg: string; color: string }> = {
    active: { bg: "#E8F5E9", color: "#2E7D32" },
    completed: { bg: "#F5F5F2", color: "#666" },
  };
  const s = map[status?.toLowerCase()] || map.active;
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: 20,
        backgroundColor: s.bg,
        color: s.color,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
};

const ProgressBar: FC<{ value: number; max: number }> = ({
  value,
  max,
}) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          flex: 1,
          height: 4,
          backgroundColor: "rgba(0,0,0,0.08)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: "#B8860B",
            borderRadius: 2,
          }}
        />
      </div>
      <span style={{ fontSize: 10, color: "#777", whiteSpace: "nowrap" }}>
        {value}/{max}d
      </span>
    </div>
  );
};

export default function AdminBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  const DEMO_BATCHES: Batch[] = [
    { _id: "b1", name: "WD Batch Jan-26", course: "WD001", teacher: { name: "Priya Sharma" }, studentCount: 42, daysMarked: 72, status: "active" },
    { _id: "b2", name: "MERN Batch Feb-26", course: "MERN001", teacher: { name: "Rahul Mehta" }, studentCount: 38, daysMarked: 55, status: "active" },
    { _id: "b3", name: "WD Batch Mar-26", course: "WD001", teacher: { name: "Sneha Patel" }, studentCount: 55, daysMarked: 40, status: "active" },
    { _id: "b4", name: "MERN Batch Apr-26", course: "MERN001", teacher: { name: "Arjun Nair" }, studentCount: 29, daysMarked: 20, status: "active" },
    { _id: "b5", name: "WD Batch May-26", course: "WD001", teacher: undefined, studentCount: 15, daysMarked: 5, status: "active" },
    { _id: "b6", name: "WD Batch Dec-25", course: "WD001", teacher: { name: "Priya Sharma" }, studentCount: 48, daysMarked: 90, status: "completed" },
  ];

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/batches`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        const fetched = d.batches || [];
        setBatches(fetched.length > 0 ? fetched : DEMO_BATCHES);
      })
      .catch(() => setBatches(DEMO_BATCHES))
      .finally(() => setLoading(false));
  }, []);

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
        Batches
      </h1>
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid rgba(0,0,0,0.10)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div className="responsive-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9f9f7" }}>
                {[
                  "Batch Name",
                  "Course",
                  "Teacher",
                  "Students",
                  "Progress",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#999",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} style={{ padding: "10px 12px" }}>
                        <div
                          style={{
                            height: 12,
                            width: "80%",
                            borderRadius: 4,
                            backgroundColor: "rgba(0,0,0,0.06)",
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
                : batches.length === 0
                  ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign: "center",
                          padding: 48,
                          color: "#aaa",
                          fontSize: 12,
                        }}
                      >
                        No batches found
                      </td>
                    </tr>
                  )
                  : batches.map((b) => (
                    <tr
                      key={b._id}
                      style={{
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                        height: 40,
                      }}
                    >
                      <td style={{ padding: "0 12px" }}>
                        <Link
                          href={`/admin/batches/${b._id}`}
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#1A1A1A",
                            textDecoration: "none",
                          }}
                        >
                          {b.name}
                        </Link>
                      </td>
                      <td style={{ padding: "0 12px" }}>
                        <CourseBadge course={b.course} />
                      </td>
                      <td
                        style={{
                          padding: "0 12px",
                          fontSize: 12,
                          color: b.teacher ? "#1A1A1A" : "#aaa",
                        }}
                      >
                        {b.teacher?.name || "Unassigned"}
                      </td>
                      <td style={{ padding: "0 12px", fontSize: 12 }}>
                        {b.studentCount ?? 0}
                      </td>
                      <td style={{ padding: "0 12px", minWidth: 140 }}>
                        <ProgressBar value={b.daysMarked ?? 0} max={90} />
                      </td>
                      <td style={{ padding: "0 12px" }}>
                        <StatusBadge status={b.status} />
                      </td>
                      <td style={{ padding: "0 12px", whiteSpace: "nowrap" }}>
                        <button
                          style={{
                            fontSize: 11,
                            padding: "2px 8px",
                            border: "1px solid rgba(0,0,0,0.10)",
                            borderRadius: 4,
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            fontFamily: "inherit",
                            marginRight: 4,
                          }}
                        >
                          Edit WA Link
                        </button>
                        <button
                          style={{
                            fontSize: 11,
                            padding: "2px 8px",
                            border: "1px solid rgba(0,0,0,0.10)",
                            borderRadius: 4,
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            fontFamily: "inherit",
                            marginRight: 4,
                          }}
                        >
                          Assign Teacher
                        </button>
                        {b.status !== "completed" && (
                          <button
                            style={{
                              fontSize: 11,
                              padding: "2px 8px",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                              backgroundColor: "#b91c1c",
                              color: "#fff",
                              fontFamily: "inherit",
                            }}
                          >
                            Mark Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
