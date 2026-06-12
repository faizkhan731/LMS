// ─────────────────────────────────────────────
// Class Name Merger (cn)
// ─────────────────────────────────────────────

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs
    .flat(Infinity)
    .filter(Boolean)
    .join(" ")
    .trim();
}

// ─────────────────────────────────────────────
// Currency Formatter (INR)
// ─────────────────────────────────────────────

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─────────────────────────────────────────────
// Date Formatters
// ─────────────────────────────────────────────

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatDateLong(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

// ─────────────────────────────────────────────
// Progress Percentage
// ─────────────────────────────────────────────

export function calcProgress(done: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

// ─────────────────────────────────────────────
// Initials from name (for avatar)
// ─────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ─────────────────────────────────────────────
// Course display name
// ─────────────────────────────────────────────

const COURSE_NAMES: Record<string, string> = {
  WD001: "Web Development",
  MERN001: "MERN Stack",
};

export function getCourseName(courseId: string): string {
  return COURSE_NAMES[courseId] ?? courseId;
}

// ─────────────────────────────────────────────
// Truncate long text
// ─────────────────────────────────────────────

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

// ─────────────────────────────────────────────
// Debounce (for search inputs)
// ─────────────────────────────────────────────

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ─────────────────────────────────────────────
// Generate unique ID (for toasts, etc.)
// ─────────────────────────────────────────────

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}
