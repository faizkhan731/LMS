"use client";

import { useEffect, useState, FC } from "react";
import Shell from "@/app/components/Shell";

interface Roadmap {
  dayNumber: number;
  title: string;
  description?: string;
  isMarked: boolean;
  zoomLink?: string;
}

interface RoadmapData {
  courseName: string;
  batchName?: string;
  roadmap: Roadmap[];
}

const StudentRoadmap: FC = () => {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const DEMO_DATA: RoadmapData = {
    courseName: "Web Development – WD001",
    batchName: "WD Batch Jan-26",
    roadmap: [
      { dayNumber: 1, title: "Introduction to HTML", description: "Basics of HTML structure and tags", isMarked: true, zoomLink: "https://zoom.us/rec/demo1" },
      { dayNumber: 2, title: "HTML Forms & Inputs", description: "Form elements, labels, and validation", isMarked: true, zoomLink: "https://zoom.us/rec/demo2" },
      { dayNumber: 3, title: "CSS Fundamentals", description: "Selectors, box model, and layout basics", isMarked: true, zoomLink: "https://zoom.us/rec/demo3" },
      { dayNumber: 4, title: "Flexbox Layout", description: "Flex container and item properties", isMarked: true, zoomLink: "https://zoom.us/rec/demo4" },
      { dayNumber: 5, title: "CSS Grid", description: "Grid layout system deep dive", isMarked: true, zoomLink: "https://zoom.us/rec/demo5" },
      { dayNumber: 6, title: "Responsive Design", description: "Media queries and mobile-first approach", isMarked: true, zoomLink: undefined },
      { dayNumber: 7, title: "JavaScript Basics", description: "Variables, data types, and operators", isMarked: true, zoomLink: "https://zoom.us/rec/demo7" },
      { dayNumber: 8, title: "DOM Manipulation", description: "Selecting elements and event listeners", isMarked: true, zoomLink: "https://zoom.us/rec/demo8" },
      { dayNumber: 9, title: "ES6+ Features", description: "Arrow functions, destructuring, spread", isMarked: true, zoomLink: undefined },
      { dayNumber: 10, title: "Async JavaScript", description: "Promises, async/await, fetch API", isMarked: true, zoomLink: "https://zoom.us/rec/demo10" },
      { dayNumber: 11, title: "Node.js Introduction", description: "Server-side JS fundamentals", isMarked: false, zoomLink: undefined },
      { dayNumber: 12, title: "Express.js Basics", description: "Routing and middleware", isMarked: false, zoomLink: undefined },
      { dayNumber: 13, title: "MongoDB & Mongoose", description: "NoSQL databases and ODM patterns", isMarked: false, zoomLink: undefined },
      { dayNumber: 14, title: "REST API Design", description: "Building CRUD endpoints", isMarked: false, zoomLink: undefined },
      { dayNumber: 15, title: "Authentication & JWT", description: "User sessions and token-based auth", isMarked: false, zoomLink: undefined },
    ],
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/roadmap`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.roadmap && d.roadmap.length > 0) setData(d);
        else setData(DEMO_DATA);
      })
      .catch(() => setData(DEMO_DATA))
      .finally(() => setLoading(false));
  }, []);

  const roadmap = data?.roadmap || [];
  const filtered = roadmap.filter((d) => {
    if (filter === "Completed") return d.isMarked;
    if (filter === "Pending") return !d.isMarked;
    if (filter === "Has Recording") return !!d.zoomLink;
    return true;
  });

  const markedCount = roadmap.filter((d) => d.isMarked).length;
  const pct = 90 > 0 ? Math.round((markedCount / 90) * 100) : 0;

  return (
    <Shell>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h1 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
            {data?.courseName || "My Roadmap"}
          </h1>
          {data?.batchName && (
            <span
              style={{
                fontSize: 11,
                color: "#777",
                backgroundColor: "#F5E6C8",
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              {data.batchName}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#777" }}>
            Day {markedCount} of 90
          </span>
          <div
            style={{
              flex: 1,
              maxWidth: 300,
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
          <span style={{ fontSize: 11, color: "#777" }}>{pct}% complete</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        {["All", "Completed", "Pending", "Has Recording"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              height: 28,
              padding: "0 12px",
              borderRadius: 4,
              border: "none",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              backgroundColor:
                filter === tab ? "#B8860B" : "#F5E6C8",
              color: filter === tab ? "#fff" : "#7A5C00",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Roadmap table */}
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
                {["Day", "Topic", "Status", "Recording"].map((h) => (
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
                ? Array.from({ length: 6 }).map((_, i) => (
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
                : filtered.length === 0
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
                        No days found for this filter.
                      </td>
                    </tr>
                  )
                  : filtered.map((day) => (
                    <tr
                      key={day.dayNumber}
                      style={{
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                        height: 40,
                        backgroundColor: day.isMarked
                          ? "#f0fdf4"
                          : "transparent",
                      }}
                    >
                      <td
                        style={{
                          padding: "0 12px",
                          fontSize: 12,
                          color: "#aaa",
                          width: 48,
                          textAlign: "center",
                        }}
                      >
                        {day.dayNumber}
                      </td>
                      <td style={{ padding: "0 12px" }}>
                        <p
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            margin: "0 0 2px",
                          }}
                        >
                          {day.title}
                        </p>
                        {day.description && (
                          <p style={{ fontSize: 11, color: "#777", margin: 0 }}>
                            {day.description}
                          </p>
                        )}
                      </td>
                      <td style={{ padding: "0 12px" }}>
                        {day.isMarked ? (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 600,
                              padding: "2px 7px",
                              borderRadius: 20,
                              backgroundColor: "#E8F5E9",
                              color: "#2E7D32",
                            }}
                          >
                            Completed
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 600,
                              padding: "2px 7px",
                              borderRadius: 20,
                              backgroundColor: "#FFF8E1",
                              color: "#F57F17",
                            }}
                          >
                            Pending
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "0 12px" }}>
                        {day.zoomLink ? (
                          <a
                            href={day.zoomLink}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: 11,
                              color: "#1565C0",
                              textDecoration: "none",
                            }}
                          >
                            ▶ Watch Recording
                          </a>
                        ) : (
                          <span
                            style={{
                              fontSize: 11,
                              color: "#aaa",
                            }}
                          >
                            No recording
                          </span>
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
};

export default StudentRoadmap;
