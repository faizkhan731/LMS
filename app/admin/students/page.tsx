"use client";

import { useEffect, useState, useCallback, ChangeEvent, FC } from "react";
import Shell from "@/app/components/Shell";

interface CourseBadgeProps {
  course: string;
}

interface StatusBadgeProps {
  status?: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  status: string;
  batch?: { name: string };
}

interface StudentsData {
  students: Student[];
  total: number;
}

const CourseBadge: FC<CourseBadgeProps> = ({ course }) => {
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

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const map: Record<string, { bg: string; color: string }> = {
    active: { bg: "#E8F5E9", color: "#2E7D32" },
    inactive: { bg: "#FFEBEE", color: "#C62828" },
  };
  const s = map[status?.toLowerCase() || "inactive"] || map.inactive;
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

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 20;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: PAGE_SIZE.toString(),
      });
      if (search) params.set("search", search);
      if (courseFilter !== "All") params.set("course", courseFilter);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/students?${params}`,
        { credentials: "include" }
      );
      const data: StudentsData = await res.json();
      setStudents(data.students || []);
      setTotal(data.total || 0);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, courseFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

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
        Students
      </h1>

      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <input
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, email, phone…"
          style={{
            flex: 1,
            minWidth: 200,
            height: 32,
            padding: "0 10px",
            fontSize: 12,
            border: "1px solid rgba(0,0,0,0.15)",
            borderRadius: 4,
            fontFamily: "inherit",
          }}
        />
        {/* Course filter chips */}
        {["All", "WD001", "MERN001"].map((c) => (
          <button
            key={c}
            onClick={() => {
              setCourseFilter(c);
              setPage(1);
            }}
            style={{
              height: 28,
              padding: "0 12px",
              borderRadius: 20,
              border: "none",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              backgroundColor:
                courseFilter === c ? "#B8860B" : "#F5E6C8",
              color: courseFilter === c ? "#fff" : "#7A5C00",
            }}
          >
            {c}
          </button>
        ))}
        <button
          style={{
            height: 32,
            padding: "0 14px",
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
          + Add Student
        </button>
        <button
          style={{
            height: 32,
            padding: "0 14px",
            backgroundColor: "transparent",
            color: "#1A1A1A",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 4,
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ↑ Upload Excel
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid rgba(0,0,0,0.10)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9f9f7" }}>
              {["", "Name", "Email", "Phone", "Course", "Batch", "Status", "Actions"].map((h) => (
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
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} style={{ padding: "8px 12px" }}>
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
              : students.length === 0
              ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: 48,
                        color: "#aaa",
                        fontSize: 12,
                      }}
                    >
                      No students found
                    </td>
                  </tr>
                )
              : students.map((s) => (
                  <tr
                    key={s._id}
                    style={{
                      borderTop: "1px solid rgba(0,0,0,0.06)",
                      height: 36,
                    }}
                  >
                    <td style={{ padding: "0 12px" }}>
                      <input type="checkbox" />
                    </td>
                    <td
                      style={{
                        padding: "0 12px",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {s.name}
                    </td>
                    <td style={{ padding: "0 12px", fontSize: 12, color: "#555" }}>
                      {s.email}
                    </td>
                    <td style={{ padding: "0 12px", fontSize: 12 }}>{s.phone}</td>
                    <td style={{ padding: "0 12px" }}>
                      <CourseBadge course={s.course} />
                    </td>
                    <td style={{ padding: "0 12px", fontSize: 11, color: "#777" }}>
                      {s.batch?.name || "—"}
                    </td>
                    <td style={{ padding: "0 12px" }}>
                      <StatusBadge status={s.status} />
                    </td>
                    <td style={{ padding: "0 12px" }}>
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
                        Edit
                      </button>
                      <button
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          border: "1px solid #ffcdd2",
                          borderRadius: 4,
                          cursor: "pointer",
                          backgroundColor: "#fff",
                          color: "#C62828",
                          fontFamily: "inherit",
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <p style={{ fontSize: 12, color: "#777", margin: 0 }}>
            Showing {from}–{to} of {total}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                height: 28,
                padding: "0 12px",
                border: "1px solid rgba(0,0,0,0.10)",
                borderRadius: 4,
                fontSize: 12,
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.4 : 1,
                fontFamily: "inherit",
              }}
            >
              Prev
            </button>
            <span
              style={{
                fontSize: 12,
                lineHeight: "28px",
                color: "#555",
              }}
            >
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={page === totalPages}
              style={{
                height: 28,
                padding: "0 12px",
                border: "1px solid rgba(0,0,0,0.10)",
                borderRadius: 4,
                fontSize: 12,
                cursor:
                  page === totalPages
                    ? "not-allowed"
                    : "pointer",
                opacity: page === totalPages ? 0.4 : 1,
                fontFamily: "inherit",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}
