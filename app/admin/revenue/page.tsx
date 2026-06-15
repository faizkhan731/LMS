"use client";

import { useEffect, useState, FC } from "react";
import Shell from "@/app/components/Shell";

interface StatCardProps {
  label: string;
  value: string | number | undefined;
  loading: boolean;
  icon?: React.ReactNode;
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

const StatCard: FC<StatCardProps> = ({ label, value, loading, icon }) => (
  <div className="rev-stat-card">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "rgba(255,255,255,0.6)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          margin: 0,
        }}
      >
        {label}
      </p>
      {icon && <div style={{ color: "#B8860B" }}>{icon}</div>}
    </div>
    {loading ? (
      <div
        style={{
          height: 32,
          width: 120,
          borderRadius: 6,
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      />
    ) : (
      <p className="rev-stat-value">
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
  <div className="rev-table-wrap">
    <div
      style={{
        padding: "16px 20px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        backgroundColor: "#fff",
      }}
    >
      <p
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#1A1A1A",
          margin: 0,
        }}
      >
        {title}
      </p>
    </div>
    <div className="responsive-table-wrap">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#fafaf8" }}>
            {cols.map((h, idx) => (
              <th
                key={h}
                style={{
                  padding: "12px 20px",
                  textAlign: idx === cols.length - 1 ? "right" : "left",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
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
                {cols.map((_, j) => (
                  <td key={j} style={{ padding: "12px 20px" }}>
                    <div
                      style={{
                        height: 12,
                        width: "80%",
                        borderRadius: 4,
                        backgroundColor: "rgba(0,0,0,0.04)",
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
                      padding: 48,
                      color: "#aaa",
                      fontSize: 13,
                    }}
                  >
                    No revenue data available
                  </td>
                </tr>
              )
              : rows.map((r, i) => (
                <tr
                  key={i}
                  className="rev-table-row"
                  style={{
                    borderTop: "1px solid rgba(0,0,0,0.04)",
                    height: 44,
                  }}
                >
                  <td
                    style={{
                      padding: "0 20px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#333",
                    }}
                  >
                    {r.name}
                  </td>
                  <td style={{ padding: "0 20px", fontSize: 13, color: "#666" }}>
                    {r.students} <span style={{ fontSize: 10, color: "#aaa" }}>students</span>
                  </td>
                  <td
                    style={{
                      padding: "0 20px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1A1A1A",
                      textAlign: "right",
                    }}
                  >
                    ₹{Number(r.revenue).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
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
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v: number | null | undefined) =>
    v != null ? `₹${Number(v).toLocaleString("en-IN")}` : "—";

  return (
    <Shell>
      <style>{`
        .rev-stat-card {
          position: relative;
          flex: 1;
          background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 24px;
          overflow: hidden;
          color: #fff;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .rev-stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(184,134,11,0.2);
          border-color: rgba(184,134,11,0.3);
        }
        .rev-stat-card::after {
          content: "";
          position: absolute;
          top: -40px;
          right: -40px;
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(184,134,11,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .rev-stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #FAFAF7;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .rev-table-wrap {
          flex: 1;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: box-shadow 0.3s ease;
        }
        .rev-table-wrap:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }
        .rev-table-row {
          transition: background 0.15s ease;
        }
        .rev-table-row:hover {
          background: #fafaf8;
        }
      `}</style>
      
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#1A1A1A" }}>Revenue & Analytics</h1>
        <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Overview of financial performance and enrollment metrics.</p>
      </div>
      
      <div className="responsive-flex-col-mobile" style={{ display: "flex", gap: 20, marginBottom: 32 }}>
        <StatCard
          label="Total Revenue"
          value={fmt(data?.totalRevenue)}
          loading={loading}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
        />
        <StatCard
          label="Total Enrollments"
          value={data?.totalEnrollments ?? "—"}
          loading={loading}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
        />
        <StatCard
          label="Avg Fee per Student"
          value={fmt(data?.avgFeePerStudent)}
          loading={loading}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>}
        />
      </div>
      
      <div className="responsive-flex-col-mobile" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
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
