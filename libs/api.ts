// ─────────────────────────────────────────────
// Base Config
// ─────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─────────────────────────────────────────────
// Custom API Error class
// ─────────────────────────────────────────────

export class ApiException extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiException";
  }
}

// ─────────────────────────────────────────────
// Core fetch wrapper
// ─────────────────────────────────────────────

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
}

async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T | Blob | undefined> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    credentials: "include", // sends httpOnly JWT cookie automatically
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  // Handle PDF responses (certificate download)
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/pdf")) {
    return response.blob();
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiException(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }
    return undefined;
  }

  if (!response.ok) {
    const errorBody = body as Record<string, unknown>;
    throw new ApiException(
      errorBody?.message as string || "Something went wrong",
      response.status,
      errorBody?.errors as Record<string, unknown>
    );
  }

  return body as T;
}

// ─────────────────────────────────────────────
// HTTP method helpers
// ─────────────────────────────────────────────

export const api = {
  get<T = unknown>(path: string, params?: Record<string, string | number | boolean>) {
    return request<T>(path, { method: "GET", params });
  },

  post<T = unknown>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T = unknown>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T = unknown>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T = unknown>(path: string) {
    return request<T>(path, { method: "DELETE" });
  },

  // Multipart form-data (file upload) — no Content-Type header, browser sets it with boundary
  upload<T = unknown>(path: string, formData: FormData) {
    return request<T>(path, {
      method: "POST",
      body: formData,
      headers: {}, // override to remove Content-Type
    });
  },
};

// ─────────────────────────────────────────────
// API route constants
// ─────────────────────────────────────────────

export const ROUTES = {
  // Auth
  AUTH_LOGIN: "/api/auth/login",
  AUTH_LOGOUT: "/api/auth/logout",
  AUTH_ME: "/api/auth/me",
  AUTH_CHANGE_PASSWORD: "/api/auth/change-password",

  // Admin
  ADMIN_STATS: "/api/admin/stats",
  ADMIN_STUDENTS: "/api/admin/students",
  ADMIN_STUDENT: (id: string) => `/api/admin/students/${id}`,
  ADMIN_STUDENT_UPLOAD: "/api/admin/students/upload",
  ADMIN_BATCHES: "/api/admin/batches",
  ADMIN_BATCH: (id: string) => `/api/admin/batches/${id}`,
  ADMIN_BATCH_COMPLETE: (id: string) => `/api/batches/${id}/complete`,
  ADMIN_TEACHERS: "/api/admin/teachers",
  ADMIN_TEACHER: (id: string) => `/api/admin/teachers/${id}`,
  ADMIN_COURSES: "/api/admin/courses",
  ADMIN_COURSE_ROADMAP: (id: string) => `/api/admin/courses/${id}/roadmap`,
  ADMIN_REVENUE: "/api/admin/revenue",

  // Teacher
  TEACHER_BATCHES: "/api/teacher/batches",
  TEACHER_BATCH_ROADMAP: (batchId: string) =>
    `/api/teacher/batches/${batchId}/roadmap`,
  BATCH_ROADMAP_MARK: (batchId: string, dayNum: number) =>
    `/api/batch-roadmap/${batchId}/day/${dayNum}/mark`,
  BATCH_ROADMAP_ZOOM: (batchId: string, dayNum: number) =>
    `/api/batch-roadmap/${batchId}/day/${dayNum}/zoom-link`,

  // Student
  STUDENT_ROADMAP: "/api/student/roadmap",
  STUDENT_PROFILE: "/api/student/profile",
  STUDENT_CERTIFICATE: "/api/student/certificate",

  // Public
  VERIFY_CERT: (certId: string) => `/api/certificates/verify/${certId}`,
  DOWNLOAD_CERT: (certId: string) => `/api/certificates/${certId}/pdf`,
};
