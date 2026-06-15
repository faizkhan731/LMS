"use client";

import React from "react";
import Link from "next/link";
import Shell from "@/app/components/Shell";

interface Course {
  id: string;
  name: string;
  duration: string;
  description: string;
  students: number;
}

const COURSES: Course[] = [
  { id: "WD001", name: "Web Development", duration: "90 Days", description: "Master front-end and back-end fundamentals using HTML, CSS, and modern JS.", students: 142 },
  { id: "MERN001", name: "MERN Stack", duration: "90 Days", description: "Deep dive into MongoDB, Express, React, and Node for full-stack excellence.", students: 106 },
];

export default function AdminCourses() {
  return (
    <Shell>
      <style>{`
        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .course-card {
          position: relative;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .course-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(184, 134, 11, 0.12);
          border-color: rgba(184, 134, 11, 0.25);
          background: #fff;
        }
        .course-card::after {
          content: "";
          position: absolute;
          top: -40px;
          right: -40px;
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(184,134,11,0.15) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .course-card:hover::after {
          opacity: 1;
        }
        .course-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .course-card__icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(184, 134, 11, 0.1);
          color: #B8860B;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .course-card__title {
          font-size: 18px;
          font-weight: 700;
          color: #1A1A1A;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        .course-card__desc {
          font-size: 13px;
          line-height: 1.5;
          color: #666;
          margin: 0 0 24px;
          flex: 1;
        }
        .course-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid rgba(0,0,0,0.06);
        }
        .course-card__stat {
          font-size: 11px;
          font-weight: 600;
          color: #888;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .course-card__btn {
          height: 34px;
          padding: 0 16px;
          background: #B8860B;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
        .course-card__btn:hover {
          background: #D4A843;
          transform: scale(1.02);
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#1A1A1A" }}>Courses Portfolio</h1>
          <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Manage roadmaps and curriculum for all active tracks.</p>
        </div>
        <button className="course-card__btn" style={{ backgroundColor: "#1A1A1A" }}>+ Add Course</button>
      </div>

      <div className="course-grid">
        {COURSES.map((c) => (
          <div key={c.id} className="course-card">
            <div className="course-card__header">
              <div className="course-card__icon">
                {c.id === "WD001" ? "🌐" : "⚛️"}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 20,
                  backgroundColor: c.id === "WD001" ? "#E3F2FD" : "#FFF8E1",
                  color: c.id === "WD001" ? "#1565C0" : "#E65100",
                  letterSpacing: "0.05em"
                }}
              >
                {c.id}
              </span>
            </div>
            
            <h2 className="course-card__title">{c.name}</h2>
            <p className="course-card__desc">{c.description}</p>
            
            <div className="course-card__footer">
              <div style={{ display: "flex", gap: "16px" }}>
                <span className="course-card__stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  {c.duration}
                </span>
                <span className="course-card__stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  {c.students} Enrolled
                </span>
              </div>
              <Link href={`/admin/courses/${c.id}/roadmap`} style={{ textDecoration: "none" }}>
                <button className="course-card__btn">
                  Edit Roadmap
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
