"use client";

import { useEffect, useState, ChangeEvent, FC } from "react";
import { useParams } from "next/navigation";
import Shell from "@/app/components/Shell";

interface RoadmapDay {
  dayNumber: number;
  title: string;
  description: string;
  _new?: boolean;
}

interface EditValues {
  title: string;
  description: string;
}

const RoadmapEditor: FC = () => {
  const { id } = useParams();
  const [days, setDays] = useState<RoadmapDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (!id) return;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}/roadmap`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then((d) => setDays(d.roadmap || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  function startEdit(day: RoadmapDay): void {
    setEditingDay(day.dayNumber);
    setEditValues({ title: day.title, description: day.description });
  }

  function cancelEdit(): void {
    setEditingDay(null);
    setEditValues({ title: "", description: "" });
  }

  async function saveEdit(day: RoadmapDay): Promise<void> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}/roadmap/${day.dayNumber}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editValues),
      }
    );
    if (res.ok) {
      setDays((prev) =>
        prev.map((d) =>
          d.dayNumber === day.dayNumber ? { ...d, ...editValues } : d
        )
      );
      cancelEdit();
    }
  }

  function addDay(): void {
    const nextNum =
      days.length > 0 ? Math.max(...days.map((d) => d.dayNumber)) + 1 : 1;
    const newDay: RoadmapDay = {
      dayNumber: nextNum,
      title: "",
      description: "",
      _new: true,
    };
    setDays((prev) => [...prev, newDay]);
    setEditingDay(nextNum);
    setEditValues({ title: "", description: "" });
  }

  return (
    <Shell>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
          Roadmap — {id}
        </h1>
        <button
          onClick={addDay}
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
          + Add Day
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
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9f9f7" }}>
              {["Day", "Topic Title", "Description", "Actions"].map((h) => (
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
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
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
              : days.length === 0
              ? (
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
                      No days in roadmap. Click "Add Day" to start.
                    </td>
                  </tr>
                )
              : days.map((day) => (
                  <tr key={day.dayNumber} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <td
                      style={{
                        padding: "8px 12px",
                        fontSize: 12,
                        color: "#aaa",
                        width: 48,
                        verticalAlign: "top",
                      }}
                    >
                      {day.dayNumber}
                    </td>
                    {editingDay === day.dayNumber ? (
                      <>
                        <td style={{ padding: "6px 12px" }}>
                          <input
                            value={editValues.title}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditValues((v) => ({
                                ...v,
                                title: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              height: 28,
                              padding: "0 8px",
                              fontSize: 12,
                              border: "1px solid #B8860B",
                              borderRadius: 4,
                              fontFamily: "inherit",
                            }}
                            placeholder="Topic title"
                          />
                        </td>
                        <td style={{ padding: "6px 12px" }}>
                          <input
                            value={editValues.description}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditValues((v) => ({
                                ...v,
                                description: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              height: 28,
                              padding: "0 8px",
                              fontSize: 12,
                              border: "1px solid rgba(0,0,0,0.15)",
                              borderRadius: 4,
                              fontFamily: "inherit",
                            }}
                            placeholder="Description"
                          />
                        </td>
                        <td style={{ padding: "6px 12px", whiteSpace: "nowrap" }}>
                          <button
                            onClick={() => saveEdit(day)}
                            style={{
                              fontSize: 11,
                              padding: "2px 8px",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                              backgroundColor: "#B8860B",
                              color: "#fff",
                              fontFamily: "inherit",
                              marginRight: 4,
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
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
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td
                          style={{
                            padding: "8px 12px",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {day.title || (
                            <span style={{ color: "#aaa" }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "8px 12px", fontSize: 11, color: "#777" }}>
                          {day.description || (
                            <span style={{ color: "#aaa" }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "8px 12px", whiteSpace: "nowrap" }}>
                          <button
                            onClick={() => startEdit(day)}
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
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
};

export default RoadmapEditor;
