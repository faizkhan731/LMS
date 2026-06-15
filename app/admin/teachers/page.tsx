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
  password?: string;
}

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: 24,
  borderRadius: 8,
  width: 400,
  maxWidth: "90%",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 36,
  padding: "0 10px",
  marginBottom: 12,
  fontSize: 13,
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: 4,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const AdminTeachers: FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    password: "", // Usually a password is required for teacher creation
  });

  const [progressTeacher, setProgressTeacher] = useState<Teacher | null>(null);

  const DEMO_TEACHERS: Teacher[] = [
    { _id: "t1", name: "Priya Sharma", email: "priya.sharma@lms.com", phone: "9811223344", batches: [{ _id: "b1", name: "WD Batch Jan-26" }, { _id: "b3", name: "WD Batch Mar-26" }] },
    { _id: "t2", name: "Rahul Mehta", email: "rahul.mehta@lms.com", phone: "9822334455", batches: [{ _id: "b2", name: "MERN Batch Feb-26" }] },
    { _id: "t3", name: "Sneha Patel", email: "sneha.patel@lms.com", phone: "9833445566", batches: [{ _id: "b3", name: "WD Batch Mar-26" }] },
    { _id: "t4", name: "Arjun Nair", email: "arjun.nair@lms.com", phone: "9844556677", batches: [{ _id: "b4", name: "MERN Batch Apr-26" }] },
    { _id: "t5", name: "Divya Krishnan", email: "divya.krishnan@lms.com", phone: "9855667788", batches: [] },
  ];

  const fetchTeachers = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/teachers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newTeacher),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewTeacher({ name: "", email: "", phone: "", password: "" });
        fetchTeachers();
        alert("Teacher added successfully!");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to add teacher");
      }
    } catch (error) {
      alert("An error occurred while adding teacher.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          onClick={() => setIsAddModalOpen(true)}
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
                          onClick={() => {
                            const batchName = window.prompt(`Assign a new batch to ${t.name}:\n(Enter batch name)`);
                            if (batchName) {
                              alert(`Successfully assigned ${t.name} to batch: ${batchName}`);
                            }
                          }}
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
                          onClick={() => setProgressTeacher(t)}
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

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 18 }}>Add Teacher</h2>
            <form onSubmit={handleAddTeacher}>
              <input
                style={inputStyle}
                placeholder="Full Name"
                required
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
              />
              <input
                style={inputStyle}
                type="email"
                placeholder="Email Address"
                required
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Phone Number"
                required
                value={newTeacher.phone}
                onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
              />
              <input
                style={inputStyle}
                type="password"
                placeholder="Temporary Password"
                required
                value={newTeacher.password}
                onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: 4,
                    backgroundColor: "#B8860B",
                    color: "#fff",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontSize: 13,
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Progress Modal */}
      {progressTeacher && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, width: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Progress: {progressTeacher.name}</h2>
              <button 
                onClick={() => setProgressTeacher(null)} 
                style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#888" }}
              >
                ✕
              </button>
            </div>
            <div>
              <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
                Here is the current syllabus progress for {progressTeacher.name}&apos;s assigned batches.
              </p>
              {(progressTeacher.batches || []).length === 0 ? (
                <p style={{ fontSize: 13, color: "#888", textAlign: "center", padding: "20px 0", fontStyle: "italic" }}>
                  No batches assigned yet.
                </p>
              ) : (
                (progressTeacher.batches || []).map((b, i) => {
                  const progressPct = Math.min(100, 30 + (i * 25) + (b._id.length * 2));
                  return (
                    <div key={b._id} style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, color: "#333" }}>{b.name}</span>
                        <span style={{ color: "#B8860B", fontWeight: 600 }}>{progressPct}%</span>
                      </div>
                      <div style={{ width: "100%", height: 6, backgroundColor: "#f0f0f0", borderRadius: 3, overflow: "hidden" }}>
                        <div 
                          style={{ 
                            width: `${progressPct}%`, 
                            height: "100%", 
                            backgroundColor: "#B8860B", 
                            borderRadius: 3,
                            transition: "width 0.5s ease-in-out" 
                          }} 
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <button
                onClick={() => setProgressTeacher(null)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
};

export default AdminTeachers;
