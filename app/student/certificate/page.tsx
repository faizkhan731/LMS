"use client";

import { useEffect, useState, FC } from "react";
import Shell from "@/app/components/Shell";

interface Certificate {
  certId: string;
  studentName: string;
  courseName: string;
  batchName: string;
  issuedDate: string;
  available: boolean;
}

const BASE_URL = "https://portal.buildbeyondstudio.com";

const StudentCertificate: FC = () => {
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/certificate`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setCert(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function downloadPdf(): Promise<void> {
    if (!cert) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/certificates/${cert.certId}/pdf`,
      { credentials: "include" }
    );
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BBS-Certificate-${cert.studentName}-${cert.courseName}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyLink(): void {
    if (!cert) return;
    navigator.clipboard.writeText(`${BASE_URL}/verify/${cert.certId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
        Certificate
      </h1>
      {loading ? (
        <div style={{ color: "#aaa", fontSize: 12 }}>Loading…</div>
      ) : !cert?.available ? (
        // State 1 — not available
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 8,
            padding: 48,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <p style={{ fontSize: 13, color: "#555", margin: 0 }}>
            Your certificate will be available once your batch is marked
            complete by admin.
          </p>
        </div>
      ) : (
        // State 2 — available
        <div style={{ maxWidth: 480 }}>
          {/* Certificate preview */}
          <div
            style={{
              backgroundColor: "#1A1A1A",
              borderRadius: 8,
              padding: 28,
              marginBottom: 16,
              color: "#fff",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#B8860B",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Build Beyond Studio
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 20,
              }}
            >
              Certificate of Completion
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
              {cert.studentName}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 4,
              }}
            >
              has successfully completed
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#B8860B",
                marginBottom: 4,
              }}
            >
              {cert.courseName}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 20,
              }}
            >
              {cert.batchName}
            </div>
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.1)",
                paddingTop: 12,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Issued
                </div>
                <div style={{ fontSize: 11 }}>
                  {new Date(cert.issuedDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Cert ID
                </div>
                <div style={{ fontSize: 10, fontFamily: "monospace" }}>
                  {cert.certId}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={downloadPdf}
            style={{
              width: "100%",
              height: 36,
              backgroundColor: "#B8860B",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: 8,
            }}
          >
            Download PDF Certificate
          </button>
          <button
            onClick={copyLink}
            style={{
              width: "100%",
              height: 36,
              backgroundColor: "transparent",
              color: "#1A1A1A",
              border: "1px solid rgba(0,0,0,0.10)",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: 12,
            }}
          >
            {copied ? "✓ Copied!" : "Copy Verify Link"}
          </button>

          <p
            style={{
              fontSize: 11,
              color: "#aaa",
              margin: 0,
              textAlign: "center",
              fontFamily: "monospace",
              wordBreak: "break-all",
            }}
          >
            {BASE_URL}/verify/{cert.certId}
          </p>
        </div>
      )}
    </Shell>
  );
};

export default StudentCertificate;
