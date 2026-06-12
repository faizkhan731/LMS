"use client";
import "./shell.css";

import React, { FC, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type Role = "admin" | "teacher" | "student";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface ShellProps {
  children: ReactNode;
}

// ─────────────────────────────────────────────
// Nav items per role (PRD Section 3.3)
// ─────────────────────────────────────────────

const NAV_ITEMS: Record<string, NavItem[]> = {
  admin: [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3h8v8H3V3zM13 3h8v8h-8V3zM3 13h8v8H3v-8zM13 13h8v8h-8v-8z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: "Students",
      href: "/admin/students",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 11c1.657 0 3-1.343 3-3S7.657 5 6 5 3 6.343 3 8s1.343 3 3 3z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 20c0-2.5 2.5-4 5-4h8c2.5 0 5 1.5 5 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: "Batches",
      href: "/admin/batches",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16V8a2 2 0 00-1-1.73L13 3.27a2 2 0 00-2 0L4 6.27A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 9l5 3 5-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: "Teachers",
      href: "/admin/teachers",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: "Courses",
      href: "/admin/courses",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7h6v11H3zM15 7h6v11h-6z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 7c2.5-1 4-1 6 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: "Revenue",
      href: "/admin/revenue",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1v22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 5H9.5a3 3 0 000 6H15a3 3 0 010 6H7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ],
  teacher: [
    { label: "My Batches", href: "/teacher/batches", icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16V8a2 2 0 00-1-1.73L13 3.27a2 2 0 00-2 0L4 6.27A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 9l5 3 5-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) }],
  student: [
    {
      label: "My Roadmap",
      href: "/student/roadmap",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6l6-3 6 3 6-3v12l-6 3-6-3-6 3V6z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    { label: "Profile", href: "/student/profile", icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) },
    {
      label: "Certificate",
      href: "/student/certificate",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 7l-9 6-9-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 13v8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ],
};

// Role pill colors
const ROLE_COLORS: Record<Role, string> = {
  admin: "bg-orange-100 text-orange-700",
  teacher: "bg-blue-100   text-blue-700",
  student: "bg-green-100  text-green-700",
};

const ROLE_ICONS: Record<Role, string> = {
  admin: "🛡️",
  teacher: "🧑‍🏫",
  student: "🎓",
};

const ROLE_OPTIONS: Role[] = ["admin", "teacher", "student"];

// ─────────────────────────────────────────────
// Shell
// ─────────────────────────────────────────────

const Shell: FC<ShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [demoRole, setDemoRole] = useState<Role>(user?.role || "student");

  useEffect(() => {
    setDemoRole(user?.role || "student");
  }, [user?.role]);

  const role = demoRole;
  const navItems = NAV_ITEMS[role] || [];

  // Initials for avatar
  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "?";

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Topbar ─────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{ height: "44px", backgroundColor: "#1A1A1A" }}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-md"
            style={{
              width: 24,
              height: 24,
              backgroundColor: "#1A1A1A",
              border: "1px solid #B8860B",
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#B8860B",
              }}
            >
              BBS
            </span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: "#FAFAF7" }}>
            Build Beyond Studio LMS
          </span>
        </div>

        {/* Center: Role label */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14 }}>{ROLE_ICONS[role]}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-10 font-semibold capitalize ${ROLE_COLORS[role]}`}
          >
            {role}
          </span>
          <select
            value={demoRole}
            onChange={(e) => setDemoRole(e.target.value as Role)}
            className="rounded-md"
            style={{
              fontSize: 10,
              padding: "4px 8px",
              backgroundColor: "#1A1A1A",
              color: "#FAFAF7",
              border: "1px solid rgba(255,255,255,0.18)",
              outline: "none",
            }}
            title="Select a role to preview its nav"
          >
            {ROLE_OPTIONS.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {ROLE_ICONS[roleOption]} {roleOption}
              </option>
            ))}
          </select>
        </div>

        {/* Right: User info */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 11, color: "#FAFAF7", opacity: 0.8 }}>
            {user?.name || "User"}
          </span>
          {/* Avatar */}
          <div
            className="flex items-center justify-center rounded-full bg-bbs-gold text-white font-semibold"
            style={{ width: 28, height: 28, fontSize: 10 }}
          >
            {initials}
          </div>
          {/* Logout */}
          <button
            onClick={logout}
            title="Logout"
            className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
            style={{
              fontSize: 14,
              color: "#FAFAF7",
              cursor: "pointer",
              background: "none",
              border: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Body (sidebar + content) ─────────── */}
      <div className="flex flex-1" style={{ paddingTop: 44 }}>
        {/* Sidebar */}
        <aside
          className="fixed left-0 bottom-0 overflow-y-auto transition-all duration-200 border-r"
          style={{
            top: 44,
            width: collapsed ? 48 : 200,
            backgroundColor: "#FAFAF7",
            borderColor: "rgba(0,0,0,0.10)",
          }}
        >
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-full flex items-center justify-end px-3 py-2 opacity-30 hover:opacity-70 transition-opacity"
            style={{
              fontSize: 12,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {collapsed ? "›" : "‹"}
          </button>

          {/* Nav sections */}
          <nav>
            {!collapsed && (
              <p
                className="px-3 mb-1 uppercase tracking-widest"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#999",
                  letterSpacing: "0.08em",
                }}
              >
                Menu
              </p>
            )}
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 transition-colors duration-100 relative"
                  style={{
                    height: 30,
                    paddingLeft: collapsed ? 14 : 12,
                    paddingRight: 8,
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#7A5C00" : "#1A1A1A",
                    backgroundColor: isActive ? "#F5E6C8" : "transparent",
                    borderLeft: isActive
                      ? "3px solid #B8860B"
                      : "3px solid transparent",
                    textDecoration: "none",
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main
          className="flex-1 overflow-auto"
          style={{
            marginLeft: collapsed ? 48 : 200,
            padding: 32,
            backgroundColor: "#fff",
            minHeight: "calc(100vh - 44px)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Shell;
