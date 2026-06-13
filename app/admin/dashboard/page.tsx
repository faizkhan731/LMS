"use client";

import { useEffect, useState, FC, ReactNode } from "react";
import Shell from "@/app/components/Shell";
import { useRouter } from "next/navigation";

import "./dashboard.css";

/* ─── Types ─────────────────────────────────── */
interface StatsData {
  totalStudents: number;
  activeBatches: number;
  teachers: number;
  totalRevenue: number;
}

interface Batch {
  _id: string;
  name: string;
  course: string;
  teacher?: { name: string };
  studentCount?: number;
  status: string;
}

/* ─── Helpers ───────────────────────────────── */
const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long", day: "numeric", month: "long",
});

const CHART_POINTS = [
  { day: "Mon", val: 12, x: 5, y: 80, yPct: 80 },
  { day: "Tue", val: 24, x: 20, y: 60, yPct: 60 },
  { day: "Wed", val: 18, x: 35, y: 70, yPct: 70 },
  { day: "Thu", val: 45, x: 50, y: 35, yPct: 35 },
  { day: "Fri", val: 32, x: 65, y: 50, yPct: 50 },
  { day: "Sat", val: 58, x: 80, y: 20, yPct: 20 },
  { day: "Sun", val: 68, x: 95, y: 10, yPct: 10 },
];

/* ─── Stat Card ─────────────────────────────── */
interface StatCardProps {
  label: string;
  value: string | number | undefined;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  loading: boolean;
}

const StatCard: FC<StatCardProps> = ({ label, icon, value, trend, loading }) => (
  <div className="stat-card">
    <div className="stat-card__header">
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__icon">{icon}</span>
    </div>
    {loading ? (
      <div className="skeleton skeleton--value" />
    ) : (
      <p className="stat-card__value">{value ?? "—"}</p>
    )}
    {trend && !loading && (
      <p className={`stat-card__trend ${trend.positive ? "stat-card__trend--up" : "stat-card__trend--down"}`}>
        {trend.positive ? "▲" : "▼"} {trend.value}
        <span> vs last month</span>
      </p>
    )}
    {!trend && !loading && (
      <p className="stat-card__trend-placeholder"> </p>
    )}
  </div>
);

/* ─── Course Badge ──────────────────────────── */
const CourseBadge: FC<{ course: string }> = ({ course }) => {
  const isWD = course === "WD001";
  return (
    <span className={`course-badge ${isWD ? "course-badge--wd" : "course-badge--mern"}`}>
      {course}
    </span>
  );
};

/* ─── Status Badge ──────────────────────────── */
const StatusBadge: FC<{ status?: string }> = ({ status }) => {
  const s = status?.toLowerCase() || "pending";
  return (
    <span className={`status-badge status-badge--${s}`}>
      <span className="status-badge__dot" />
      {status || "—"}
    </span>
  );
};

/* ─── Progress Bar ──────────────────────────── */
const ProgressBar: FC<{ value: number }> = ({ value }) => (
  <div className="progress-bar">
    <div className="progress-bar__fill" style={{ width: `${Math.min(value, 100)}%` }} />
  </div>
);

/* ─── Page ──────────────────────────────────── */
export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const router = useRouter();


  /* ── Demo data shown when API is unavailable ── */
  const DEMO_STATS: StatsData = {
    totalStudents: 248,
    activeBatches: 6,
    teachers: 9,
    totalRevenue: 1245000,
  };

  const DEMO_BATCHES: Batch[] = [
    { _id: "d1", name: "WD Batch Jan-26", course: "WD001", teacher: { name: "Priya Sharma" }, studentCount: 42, status: "active" },
    { _id: "d2", name: "MERN Batch Feb-26", course: "MERN001", teacher: { name: "Rahul Mehta" }, studentCount: 38, status: "active" },
    { _id: "d3", name: "WD Batch Mar-26", course: "WD001", teacher: { name: "Sneha Patel" }, studentCount: 55, status: "active" },
    { _id: "d4", name: "MERN Batch Apr-26", course: "MERN001", teacher: { name: "Arjun Nair" }, studentCount: 29, status: "active" },
    { _id: "d5", name: "WD Batch May-26", course: "WD001", teacher: undefined, studentCount: 15, status: "pending" },
  ];

  useEffect(() => {
    async function load() {
      try {
        const [sRes, bRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, { credentials: "include" }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/batches?limit=5`, { credentials: "include" }),
        ]);
        const [s, b] = await Promise.all([sRes.json(), bRes.json()]);
        setStats(s?.totalStudents != null ? s : DEMO_STATS);
        setBatches((b.batches && b.batches.length > 0) ? b.batches : DEMO_BATCHES);
      } catch {
        setStats(DEMO_STATS);
        setBatches(DEMO_BATCHES);
      }
      finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <Shell>
      {/* ─── Header Banner ─────────────────────── */}
      <div className="dashboard-hero">
        <div className="dashboard-hero__badge">
          <span className="dashboard-hero__badge-dot" />
          ADMIN CONSOLE
        </div>
        <div className="dashboard-hero__body">
          <div>
            <h1 className="dashboard-hero__title">Hello, Aditi.</h1>
            <p className="dashboard-hero__sub">{today} · Here's what's happening across your cohorts today.</p>
          </div>
          <div className="dashboard-hero__actions">
            {/* <button className="btn btn--secondary">Manage Students</button>
            <button className="btn btn--primary">
              View Batches

              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button> */}
            <button
              className="btn btn--secondary"
              onClick={() => router.push("/students")}
            >
              Manage Students
            </button>

            <button
              className="btn btn--primary"
              onClick={() => router.push("/admin/batches")}
            >
              View Batches

              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6h8M7 3l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Stat Cards ─────────────────────────── */}
      <div className="stat-grid">
        <StatCard
          label=" Total Students"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 11c1.657 0 3-1.343 3-3S7.657 5 6 5 3 6.343 3 8s1.343 3 3 3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 20c0-2.5 2.5-4 5-4h8c2.5 0 5 1.5 5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          value={stats?.totalStudents ?? "—"}
          // trend={{ value: "+12%", positive: true }}
          loading={loading}
        />
        <StatCard
          label="Active Batches"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 00-1-1.73L13 3.27a2 2 0 00-2 0L4 6.27A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 9l5 3 5-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          value={stats?.activeBatches ?? "—"}
          // trend={{ value: "+3", positive: true }}
          loading={loading}
        />
        <StatCard
          label="Teachers"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          value={stats?.teachers ?? "—"}
          loading={loading}
        />
        <StatCard
          label="Courses"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7h6v11H3zM15 7h6v11h-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 7c2.5-1 4-1 6 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          value={2}
          loading={false}
        />
        <StatCard
          label="Total Revenue"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1v22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 5H9.5a3 3 0 000 6H15a3 3 0 010 6H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          value={
            stats?.totalRevenue != null
              ? `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`
              : "—"
          }
          // trend={{ value: "+18%", positive: true }}
          loading={loading}
        />
      </div>

      {/* ─── Analytics Chart ─────────────────────── */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">
            {/* <span>📈</span> */}
            Student Registrations Trend
          </div>
          <div className="chart-legend">
            <div className="chart-legend__item">
              <span className="chart-legend__dot" />
              <span>Weekly Signups</span>
            </div>
          </div>
        </div>
        <div className="chart-container">
          {/* Tooltip */}
          {hoveredIdx !== null && (
            <div
              className="chart-tooltip"
              style={{
                left: `${CHART_POINTS[hoveredIdx].x}%`,
                top: `${CHART_POINTS[hoveredIdx].y}%`,
              }}
            >
              {CHART_POINTS[hoveredIdx].day}: <strong>+{CHART_POINTS[hoveredIdx].val}</strong> students
            </div>
          )}

          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B8860B" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#B8860B" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />

            {/* Area fill */}
            <path
              d={`M ${CHART_POINTS[0].x} 100 
                  L ${CHART_POINTS[0].x} ${CHART_POINTS[0].yPct} 
                  L ${CHART_POINTS[1].x} ${CHART_POINTS[1].yPct} 
                  L ${CHART_POINTS[2].x} ${CHART_POINTS[2].yPct} 
                  L ${CHART_POINTS[3].x} ${CHART_POINTS[3].yPct} 
                  L ${CHART_POINTS[4].x} ${CHART_POINTS[4].yPct} 
                  L ${CHART_POINTS[5].x} ${CHART_POINTS[5].yPct} 
                  L ${CHART_POINTS[6].x} ${CHART_POINTS[6].yPct} 
                  L ${CHART_POINTS[6].x} 100 Z`}
              fill="url(#chartGrad)"
            />
            {/* Line curve */}
            <path
              d={`M ${CHART_POINTS[0].x} ${CHART_POINTS[0].yPct} 
                  L ${CHART_POINTS[1].x} ${CHART_POINTS[1].yPct} 
                  L ${CHART_POINTS[2].x} ${CHART_POINTS[2].yPct} 
                  L ${CHART_POINTS[3].x} ${CHART_POINTS[3].yPct} 
                  L ${CHART_POINTS[4].x} ${CHART_POINTS[4].yPct} 
                  L ${CHART_POINTS[5].x} ${CHART_POINTS[5].yPct} 
                  L ${CHART_POINTS[6].x} ${CHART_POINTS[6].yPct}`}
              fill="none"
              stroke="#B8860B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Interactive dots overlay */}
          <div style={{ position: "absolute", inset: 0 }}>
            {CHART_POINTS.map((pt, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  left: `${pt.x}%`,
                  top: `${pt.y}%`,
                  width: "16px",
                  height: "16px",
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Visual Dot indicator */}
                <div
                  style={{
                    width: hoveredIdx === idx ? "8px" : "6px",
                    height: hoveredIdx === idx ? "8px" : "6px",
                    borderRadius: "50%",
                    backgroundColor: "#B8860B",
                    border: "2px solid #fff",
                    boxShadow: hoveredIdx === idx
                      ? "0 0 8px rgba(184, 134, 11, 0.8)"
                      : "0 1px 3px rgba(0,0,0,0.15)",
                    transition: "all 0.15s ease",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* X Axis Labels */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px 0", borderTop: "1px solid rgba(0,0,0,0.04)", marginTop: "8px" }}>
          {CHART_POINTS.map((pt, idx) => (
            <span key={idx} style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 500 }}>{pt.day}</span>
          ))}
        </div>
      </div>

      {/* ─── 2-Col area ─────────────────────────── */}
      <div className="dashboard-row">

        {/* Recent Batches */}
        <div className="card card--batches">
          <div className="card__header">
            <div className="card__header-left">
              <span className="card__header-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 3v6h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="card__title">Recent Batches</span>
            </div>
            <a href="/admin/batches" className="card__view-all">
              View all
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="responsive-table-wrap">
            <table className="batch-table">
              <thead>
                <tr>
                  {["Batch", "Course", "Teacher", "Students", "Status"].map(h => (
                    <th key={h} className="batch-table__th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="batch-table__row">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="batch-table__td">
                          <div className="skeleton" style={{ width: j === 0 ? 90 : j === 3 ? 30 : 70 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                  : batches.length === 0
                    ? (
                      <tr>
                        <td colSpan={5} className="batch-table__empty">
                          <span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 8v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span>No batches yet</span>
                        </td>
                      </tr>
                    )
                    : batches.map(b => (
                      <tr key={b._id} className="batch-table__row">
                        <td className="batch-table__td batch-table__td--name">{b.name}</td>
                        <td className="batch-table__td"><CourseBadge course={b.course} /></td>
                        <td className={`batch-table__td ${!b.teacher ? "batch-table__td--muted" : ""}`}>
                          {b.teacher?.name || "Unassigned"}
                        </td>
                        <td className="batch-table__td batch-table__td--num">{b.studentCount ?? 0}</td>
                        <td className="batch-table__td"><StatusBadge status={b.status} /></td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="dashboard-aside">
          {/* Quick Actions */}
          <div className="card">
            <div className="card__header">
              <div className="card__header-left">
                <span className="card__header-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="card__title">Quick Actions</span>
              </div>
            </div>
            <div className="quick-actions">
              <button className="quick-action quick-action--primary">
                <span className="quick-action__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 21H3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="quick-action__body">
                  <span className="quick-action__label">Upload Student Excel</span>
                  <span className="quick-action__sub">Bulk add students via spreadsheet</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="quick-action__arrow">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="quick-action">
                <span className="quick-action__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="quick-action__body">
                  <span className="quick-action__label">Add Single Student</span>
                  <span className="quick-action__sub">Manual student onboarding</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="quick-action__arrow">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="quick-action">
                <span className="quick-action__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L1 9l11 6 9-4.91V17a2 2 0 01-2 2H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 3v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="quick-action__body">
                  <span className="quick-action__label">Add Teacher</span>
                  <span className="quick-action__sub">Create teacher account</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="quick-action__arrow">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Platform Health */}
          <div className="card card--health">
            <div className="card__header">
              <div className="card__header-left">
                <span className="card__header-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 13v6M12 9v10M17 5v14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="card__title">Platform Health</span>
              </div>
            </div>
            <div className="health-items">
              <div className="health-item">
                <div className="health-item__top">
                  <span className="health-item__label">Course completion</span>
                  <span className="health-item__value">78%</span>
                </div>
                <ProgressBar value={78} />
              </div>
              <div className="health-item">
                <div className="health-item__top">
                  <span className="health-item__label">Active engagement</span>
                  <span className="health-item__value">64%</span>
                </div>
                <ProgressBar value={64} />
              </div>
              <div className="health-item">
                <div className="health-item__top">
                  <span className="health-item__label">Certificates issued</span>
                  <span className="health-item__value">43%</span>
                </div>
                <ProgressBar value={43} />
              </div>
            </div>
          </div>

          {/* Cohort Info */}
          <div className="cohort-banner">
            <p className="cohort-banner__label">COHORT 2026</p>
            <p className="cohort-banner__text">WD &amp; MERN tracks running. Stay aligned with your roadmap.</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
