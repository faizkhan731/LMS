"use client";

import React from "react";
import Link from "next/link";
import Shell from "@/app/components/Shell";

interface Course {
  id: string;
  name: string;
  duration: string;
}

const COURSES: Course[] = [
  { id: "WD001", name: "Web Development", duration: "90 Days" },
  { id: "MERN001", name: "MERN Stack", duration: "90 Days" },
];

export default function AdminCourses() {
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
        Courses
      </h1>
      <div style={{ display: "flex", gap: 16 }}>
        {COURSES.map((c) => (
          <div
            key={c.id}
            style={{
              flex: 1,
              backgroundColor: "#fff",
              border: "1px solid rgba(0,0,0,0.10)",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  padding: "2px 7px",
                  borderRadius: 20,
                  backgroundColor:
                    c.id === "WD001" ? "#E3F2FD" : "#FFF8E1",
                  color: c.id === "WD001" ? "#1565C0" : "#E65100",
                }}
              >
                {c.id}
              </span>
            </div>
            <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>
              {c.name}
            </h2>
            <p style={{ fontSize: 12, color: "#777", margin: "0 0 16px" }}>
              Duration: {c.duration}
            </p>
            <Link href={`/admin/courses/${c.id}/roadmap`}>
              <button
                style={{
                  height: 30,
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
                Edit Roadmap
              </button>
            </Link>
          </div>
        ))}
      </div>
    </Shell>
  );
}
