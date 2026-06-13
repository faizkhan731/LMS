"use client";

import { useEffect, useState, FC } from "react";
import Shell from "@/app/components/Shell";

interface Batch {
  _id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
  phone: string;
  batches?: Batch[];
}

const AdminTeachers: FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const DEMO_TEACHERS: Teacher[] = [
    { _id: "t1", name: "Priya Sharma", email: "priya.sharma@lms.com", phone: "9811223344", batches: [{ _id: "b1", name: "WD Batch Jan-26" }, { _id: "b3", name: "WD Batch Mar-26" }] },
    { _id: "t2", name: "Rahul Mehta", email: "rahul.mehta@lms.com", phone: "9822334455", batches: [{ _id: "b2", name: "MERN Batch Feb-26" }] },
    { _id: "t3", name: "Sneha Patel", email: "sneha.patel@lms.com", phone: "9833445566", batches: [{ _id: "b3", name: "WD Batch Mar-26" }] },
    { _id: "t4", name: "Arjun Nair", email: "arjun.nair@lms.com", phone: "9844556677", batches: [{ _id: "b4", name: "MERN Batch Apr-26" }] },
    { _id: "t5", name: "Divya Krishnan", email: "divya.krishnan@lms.com", phone: "9855667788", batches: [] },
  ];

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/teachers`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        const fetched = d.teachers || [];
        setTeachers(fetched.length > 0 ? fetched : DEMO_TEACHERS);
      })
      .catch(() => setTeachers(DEMO_TEACHERS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Shell>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Teachers</h1>
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
          + Add Teacher
        </button>
      </div>
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
                {["Name", "Email", "Phone", "Assigned Batches", "Actions"].map(
                  (h) => (
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
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
                : teachers.length === 0
                  ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          textAlign: "center",
                          padding: 48,
                          color: "#aaa",
                          fontSize: 12,
                        }}
                      >
                        No teachers added yet
                      </td>
                    </tr>
                  )
                  : teachers.map((t) => (
                    <tr
                      key={t._id}
                      style={{
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                        height: 40,
                      }}
                    >
                      <td style={{ padding: "0 12px", fontSize: 12, fontWeight: 500 }}>
                        {t.name}
                      </td>
                      <td style={{ padding: "0 12px", fontSize: 12, color: "#555" }}>
                        {t.email}
                      </td>
                      <td style={{ padding: "0 12px", fontSize: 12 }}>{t.phone}</td>
                      <td style={{ padding: "0 12px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {(t.batches || []).length === 0 ? (
                            <span style={{ fontSize: 11, color: "#aaa" }}>
                              None
                            </span>
                          ) : (
                            (t.batches || []).map((b) => (
                              <span
                                key={b._id}
                                style={{
                                  fontSize: 10,
                                  padding: "2px 7px",
                                  borderRadius: 4,
                                  backgroundColor: "#F5E6C8",
                                  color: "#7A5C00",
                                }}
                              >
                                {b.name}
                              </span>
                            ))
                          )}
                        </div>
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
                          Assign Batch
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
                          }}
                        >
                          View Progress
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
};

export default AdminTeachers;
