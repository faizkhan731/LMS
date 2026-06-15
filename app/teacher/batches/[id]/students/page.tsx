"use client";

import { useEffect, useState, FC } from "react";
import { useParams } from "next/navigation";
import Shell from "@/app/components/Shell";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
}

interface Batch {
  _id: string;
  name: string;
  course: string;
  students?: Student[];
}

const TeacherBatchStudents: FC = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback demo data if API is not fully wired
  const DEMO_BATCH: Batch = {
    _id: id as string,
    name: "WD Batch Jan-26",
    course: "WD001",
    students: [
      { _id: "s1", name: "Aarav Mehta", email: "aarav.mehta@email.com", phone: "9876543210", status: "active" },
      { _id: "s2", name: "Priya Singh", email: "priya.singh@email.com", phone: "9823456781", status: "active" },
      { _id: "s3", name: "Rohan Kumar", email: "rohan.kumar@email.com", phone: "9845672345", status: "inactive" },
    ],
  };

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teacher/batches/${id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        const b = d.batch || d;
        setBatch(b?.name ? b : DEMO_BATCH);
      })
      .catch(() => setBatch(DEMO_BATCH))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Shell>
      {loading ? (
        <div style={{ color: "#aaa", fontSize: 12 }}>Loading students…</div>
      ) : !batch ? (
        <div style={{ color: "#C62828", fontSize: 12 }}>Batch not found.</div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 4px" }}>
              {batch.name} — Students
            </h1>
            <p style={{ fontSize: 12, color: "#777", margin: 0 }}>
              Total Students: {batch.students?.length || 0}
            </p>
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
                    {["Name", "Email", "Phone", "Status"].map((h) => (
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
                  {(batch.students || []).length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          textAlign: "center",
                          padding: 48,
                          color: "#aaa",
                          fontSize: 12,
                        }}
                      >
                        No students assigned to this batch.
                      </td>
                    </tr>
                  ) : (
                    (batch.students || []).map((s) => (
                      <tr
                        key={s._id}
                        style={{
                          borderTop: "1px solid rgba(0,0,0,0.06)",
                          height: 40,
                        }}
                      >
                        <td
                          style={{
                            padding: "0 12px",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {s.name}
                        </td>
                        <td
                          style={{
                            padding: "0 12px",
                            fontSize: 12,
                            color: "#555",
                          }}
                        >
                          {s.email}
                        </td>
                        <td style={{ padding: "0 12px", fontSize: 12 }}>
                          {s.phone}
                        </td>
                        <td style={{ padding: "0 12px", fontSize: 12 }}>
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 600,
                              padding: "2px 7px",
                              borderRadius: 20,
                              backgroundColor: s.status === "inactive" ? "#FFEBEE" : "#E8F5E9",
                              color: s.status === "inactive" ? "#C62828" : "#2E7D32",
                              textTransform: "capitalize",
                            }}
                          >
                            {s.status || "Active"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Shell>
  );
};

export default TeacherBatchStudents;
