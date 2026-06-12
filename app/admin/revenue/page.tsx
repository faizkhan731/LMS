"use client";

import { useEffect, useState, FC } from "react";
import Shell from "@/app/components/Shell";

interface StatCardProps {
  label: string;
  value: string | number | undefined;
  loading: boolean;
}

interface RevenueRow {
  name: string;
  students: number;
  revenue: number;
}

interface RevenueData {
  totalRevenue: number;
  totalEnrollments: number;
  avgFeePerStudent: number;
  courseRevenue: RevenueRow[];
  batchRevenue: RevenueRow[];
}

const StatCard: FC<StatCardProps> = ({ label, value, loading }) => (
  <div
    style={{
      flex: 1,
      backgroundColor: "#fff",
      border: "1px solid rgba(0,0,0,0.10)",
      borderRadius: 8,
      padding: 16,
    }}
  >
    <p
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: "#999",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        margin: "0 0 6px",
      }}
    >
      {label}
    </p>
    {loading ? (
      <div
        style={{
          height: 24,
          width: 80,
          borderRadius: 4,
          backgroundColor: "rgba(0,0,0,0.06)",
        }}
      />
    ) : (
      <p style={{ fontSize: 20, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>
        {value}
      </p>
    )}
  </div>
);

interface RevenueTableProps {
  title: string;
  rows: RevenueRow[] | undefined;
  cols: string[];
  loading: boolean;
}

const RevenueTable: FC<RevenueTableProps> = ({ title, rows, cols, loading }) => (
  <div
    style={{
      flex: 1,
      backgroundColor: "#fff",
      border: "1px solid rgba(0,0,0,0.10)",
      borderRadius: 8,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        padding: "10px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#555",
          margin: 0,
        }}
      >
        {title}
      </p>
    </div>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ backgroundColor: "#f9f9f7" }}>
          {cols.map((h) => (
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
          ? Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                {cols.map((_, j) => (
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
          : !rows || rows.length === 0
          ? (
              <tr>
                <td
                  colSpan={cols.length}
                  style={{
                    textAlign: "center",
                    padding: 32,
                    color: "#aaa",
                    fontSize: 12,
                  }}
                >
                  No data
                </td>
              </tr>
            )
          : rows.map((r, i) => (
              <tr
                key={i}
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.06)",
                  height: 36,
                }}
              >
                <td
                  style={{
                    padding: "0 12px",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {r.name}
                </td>
                <td style={{ padding: "0 12px", fontSize: 12 }}>
                  {r.students}
                </td>
                <td
                  style={{
                    padding: "0 12px",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  ₹{Number(r.revenue).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  </div>
);

export default function AdminRevenue() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/revenue`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v: number | null | undefined) =>
    v != null ? `₹${Number(v).toLocaleString("en-IN")}` : "—";

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
        Revenue
      </h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <StatCard
          label="Total Revenue"
          value={fmt(data?.totalRevenue)}
          loading={loading}
        />
        <StatCard
          label="Total Enrollments"
          value={data?.totalEnrollments ?? "—"}
          loading={loading}
        />
        <StatCard
          label="Avg Fee per Student"
          value={fmt(data?.avgFeePerStudent)}
          loading={loading}
        />
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Course-wise */}
        <RevenueTable
          title="Course-wise Revenue"
          rows={data?.courseRevenue}
          cols={["Course", "Students", "Revenue"]}
          loading={loading}
        />
        {/* Batch-wise */}
        <RevenueTable
          title="Batch-wise Revenue"
          rows={data?.batchRevenue}
          cols={["Batch", "Students", "Revenue"]}
          loading={loading}
        />
      </div>
    </Shell>
  );
}
