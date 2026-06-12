import { notFound } from "next/navigation";

interface CertificateData {
  studentName: string;
  courseName: string;
  batchName: string;
  issuedDate: string;
}

interface VerifyPageProps {
  params: { certId: string };
}

export async function generateMetadata() {
  return {
    title: "Certificate Verification | Build Beyond Studio",
    description:
      "Verify the authenticity of a Build Beyond Studio certificate",
  };
}

async function getCertificate(
  certId: string
): Promise<CertificateData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/certificates/verify/${certId}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function VerifyPage({
  params,
}: VerifyPageProps): Promise<JSX.Element> {
  const cert = await getCertificate(params.certId);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF7" }}>
      {/* Topbar */}
      <div
        style={{
          height: 44,
          backgroundColor: "#1A1A1A",
          display: "flex",
          alignItems: "center",
          paddingLeft: 24,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            border: "1px solid #B8860B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 8,
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
          Build Beyond Studio
        </span>
      </div>

      {/* Card */}
      <div style={{ display: "flex", justifyContent: "center", padding: "48px 16px" }}>
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            backgroundColor: "#fff",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 12,
            padding: 32,
          }}
        >
          {cert ? (
            <>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                <h1
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#2E7D32",
                    margin: "0 0 4px",
                  }}
                >
                  Valid Certificate
                </h1>
                <p
                  style={{
                    fontSize: 11,
                    color: "#aaa",
                    fontFamily: "monospace",
                    margin: 0,
                  }}
                >
                  {params.certId}
                </p>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    ["Student Name", cert.studentName],
                    ["Course", cert.courseName],
                    ["Batch", cert.batchName],
                    [
                      "Issued Date",
                      new Date(cert.issuedDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }),
                    ],
                    ["Status", "Valid"],
                  ].map(([label, value]) => (
                    <tr
                      key={label}
                      style={{
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 0",
                          fontSize: 11,
                          color: "#777",
                          width: 120,
                        }}
                      >
                        {label}
                      </td>
                      <td
                        style={{
                          padding: "10px 0",
                          fontSize: 12,
                          fontWeight:
                            label === "Status" ? 600 : 400,
                          color:
                            label === "Status" ? "#2E7D32" : "#1A1A1A",
                        }}
                      >
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>❌</div>
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#C62828",
                  margin: "0 0 8px",
                }}
              >
                Invalid Certificate
              </h1>
              <p
                style={{
                  fontSize: 12,
                  color: "#aaa",
                  margin: 0,
                }}
              >
                No certificate found with this ID.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
