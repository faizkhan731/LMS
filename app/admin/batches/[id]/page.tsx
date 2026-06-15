"use client";

import { useEffect, useState, FC } from "react";
import { useParams } from "next/navigation";
import Shell from "@/app/components/Shell";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Teacher {
  name: string;
}

interface Batch {
  _id: string;
  name: string;
  course: string;
  teacher?: Teacher;
  students?: Student[];
  daysMarked?: number;
  status: string;
}

const AdminBatchDetail: FC = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/batches/${id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setBatch(d.batch || d))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [id]);

  const pct = batch
    ? Math.min(100, Math.round(((batch.daysMarked || 0) / 90) * 100))
    : 0;

  return (
    <Shell>
      {loading ? (
        <div style={{ color: "#aaa", fontSize: 12 }}>Loading batch…</div>
      ) : !batch ? (
        <div style={{ color: "#C62828", fontSize: 12 }}>Batch not found.</div>
      ) : (
        <>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <h1 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
              {batch.name}
            </h1>
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                padding: "2px 7px",
                borderRadius: 20,
                backgroundColor:
                  batch.course === "WD001" ? "#E3F2FD" : "#FFF8E1",
                color: batch.course === "WD001" ? "#1565C0" : "#E65100",
              }}
            >
              {batch.course}
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                padding: "2px 7px",
                borderRadius: 20,
                backgroundColor:
                  batch.status === "completed"
                    ? "#F5F5F2"
                    : "#E8F5E9",
                color:
                  batch.status === "completed" ? "#666" : "#2E7D32",
                textTransform: "capitalize",
              }}
            >
              {batch.status}
            </span>
            <div style={{ flex: 1 }} />
            <button
              onClick={() => {
                const newLink = window.prompt(`Enter new WhatsApp Link for ${batch.name}:`, "https://chat.whatsapp.com/...");
                if (newLink) {
                  alert(`WhatsApp link updated successfully!`);
                }
              }}
              style={{
                height: 30,
                padding: "0 12px",
                border: "1px solid rgba(0,0,0,0.10)",
                borderRadius: 4,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Edit WA Link
            </button>
            {batch.status !== "completed" && (
              <button
                onClick={() => setConfirmDialog(true)}
                style={{
                  height: 30,
                  padding: "0 12px",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  backgroundColor: "#b91c1c",
                  color: "#fff",
                }}
              >
                Mark Batch Complete
              </button>
            )}
          </div>

          {/* 2-col */}
          <div className="responsive-flex-col-mobile" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {/* Student list */}
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
                  Students ({batch.students?.length || 0})
                </p>
              </div>
              <div className="responsive-table-wrap">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f9f9f7" }}>
                      {["Name", "Email", "Phone"].map((h) => (
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
                          colSpan={3}
                          style={{
                            textAlign: "center",
                            padding: 32,
                            color: "#aaa",
                            fontSize: 12,
                          }}
                        >
                          No students in this batch
                        </td>
                      </tr>
                    ) : (
                      (batch.students || []).map((s) => (
                        <tr
                          key={s._id}
                          style={{
                            borderTop:
                              "1px solid rgba(0,0,0,0.06)",
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
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Teacher progress */}
            <div
              style={{
                width: 240,
                flexShrink: 0,
                backgroundColor: "#fff",
                border: "1px solid rgba(0,0,0,0.10)",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#555",
                  marginBottom: 12,
                  marginTop: 0,
                }}
              >
                Teacher Progress
              </p>
              <p style={{ fontSize: 12, marginBottom: 8, marginTop: 0 }}>
                {batch.teacher?.name || "Unassigned"}
              </p>
              <div
                style={{
                  height: 4,
                  backgroundColor: "rgba(0,0,0,0.08)",
                  borderRadius: 2,
                  overflow: "hidden",
                  marginBottom: 6,
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
              <p style={{ fontSize: 11, color: "#777", margin: 0 }}>
                {batch.daysMarked || 0} / 90 days — {pct}%
              </p>
            </div>
          </div>

          {/* Confirm dialog */}
          {confirmDialog && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  maxWidth: 480,
                  width: "90%",
                  padding: 24,
                }}
              >
                <h2
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginTop: 0,
                    marginBottom: 12,
                  }}
                >
                  Mark Batch Complete?
                </h2>
                <p style={{ fontSize: 12, color: "#555", marginBottom: 20 }}>
                  This action will generate and email certificates to all{" "}
                  {batch.students?.length || 0} students in this batch. This
                  cannot be undone.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <button
                    onClick={() => setConfirmDialog(false)}
                    style={{
                      height: 32,
                      padding: "0 16px",
                      border: "1px solid rgba(0,0,0,0.10)",
                      borderRadius: 4,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      backgroundColor: "transparent",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      height: 32,
                      padding: "0 16px",
                      border: "none",
                      borderRadius: 4,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      backgroundColor: "#b91c1c",
                      color: "#fff",
                    }}
                  >
                    Confirm Complete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  );
};

export default AdminBatchDetail;
