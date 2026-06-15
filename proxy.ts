import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────
// Route config
// ─────────────────────────────────────────────

const PUBLIC_ROUTES: string[] = ["/login", "/verify"];

const ROLE_DASHBOARDS: Record<string, string> = {
  admin: "/admin/dashboard",
  teacher: "/teacher/batches",
  student: "/student/roadmap",
};

// ─────────────────────────────────────────────
// JWT Payload type
// ─────────────────────────────────────────────

interface JwtPayload {
  role?: string;
  [key: string]: unknown;
}

// ─────────────────────────────────────────────
// Minimal JWT decode (Edge Runtime safe — no verify)
// Actual verification is done by the Express backend.
// This proxy only does optimistic role-based redirect.
// ─────────────────────────────────────────────

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    return JSON.parse(atob(base64)) as JwtPayload;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// Proxy function  (Next.js middleware)
// ─────────────────────────────────────────────

export function proxy(request: NextRequest): NextResponse {
  // DEV MODE => auth bypass
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }
  if (!process.env.NEXT_PUBLIC_API_URL) {        // ← YEH ADD KARO
    return NextResponse.next();                   // ← YEH ADD KARO
  }

  const { pathname } = request.nextUrl;

  // 1. Always allow public routes
  const isPublic = PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  if (isPublic) return NextResponse.next();

  // 2. Read JWT from httpOnly cookie
  const token = request.cookies.get("token")?.value;

  // 3. No token → send to /login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Decode role
  const payload = decodeJwtPayload(token);
  const role = payload?.role as string | undefined;

  if (!role || !ROLE_DASHBOARDS[role]) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 5. Root / → role dashboard
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(ROLE_DASHBOARDS[role], request.url)
    );
  }

  // 6. Already logged in, hitting /login → role dashboard
  if (pathname === "/login") {
    return NextResponse.redirect(
      new URL(ROLE_DASHBOARDS[role], request.url)
    );
  }

  // 7. Wrong role accessing another role's route
  //    e.g. teacher trying to open /admin/*
  const routeRole = pathname.split("/")[1];
  if (
    ["admin", "teacher", "student"].includes(routeRole) &&
    routeRole !== role
  ) {
    return NextResponse.redirect(
      new URL(ROLE_DASHBOARDS[role], request.url)
    );
  }

  // 8. All good
  return NextResponse.next();
}

// ─────────────────────────────────────────────
// Matcher — skip _next static, images, favicon
// ─────────────────────────────────────────────

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
