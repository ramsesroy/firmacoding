import React, { memo } from "react";
import { SignatureProps, TemplateType } from "@/types/signature";
import { generateQRCodeURL } from "@/lib/qrUtils";

interface SignaturePreviewProps extends SignatureProps {
  template: TemplateType;
  horario?: string;
  textoAdicional?: string;
  colorPersonalizado?: string;
  qrLink?: string;
  logoEmpresa?: string;
  ctaTexto?: string;
  telefonoMovil?: string;
  direccion?: string;
  iconoTelefono?: string;
  iconoTelefonoMovil?: string;
  iconoDireccion?: string;
}

const SignaturePreview: React.FC<SignaturePreviewProps> = memo(({
  nombre,
  cargo,
  foto,
  telefono,
  redes = [],
  template,
  horario,
  textoAdicional,
  colorPersonalizado,
  qrLink,
  logoEmpresa,
  ctaTexto,
  telefonoMovil,
  direccion,
  iconoTelefono,
  iconoTelefonoMovil,
  iconoDireccion,
}) => {
  const renderTemplate = () => {
    switch (template) {
      case "professional":
        return renderProfessionalTemplate();
      case "classic":
        return renderClassicTemplate();
      case "modern":
        return renderModernTemplate();
      case "modernaSinBarra":
        return renderTemplate02();
      case "qrProfesional":
        return renderTemplate06();
      case "developerMinimal2025":
        return renderDeveloperMinimal2025();
      case "ultraMinimal":
        return renderUltraMinimal();
      case "growthMarketing":
        return renderGrowthMarketing();
      case "freelanceDesigner":
        return renderFreelanceDesigner();
      case "corporateConsultant":
        return renderCorporateConsultant();
      case "interiorDesign":
        return renderInteriorDesign();
      case "universityProfessor":
        return renderUniversityProfessor();
      case "universityBanner":
        return renderUniversityBanner();
      case "creativePortfolio":
        return renderCreativePortfolio();
      case "militaryProfessional":
        return renderMilitaryProfessional();
      case "churchProfessional":
        return renderChurchProfessional();
      case "universityPresident":
        return renderUniversityPresident();
      case "pastorSignature":
        return renderPastorSignature();
      case "lawStudent":
        return renderLawStudent();
      case "greenExecutive":
        return renderGreenExecutive();
      default:
        return renderClassicTemplate();
    }
  };

  const renderClassicTemplate = () => {
    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
          lineHeight: "1.5",
        }}
      >
        <tbody>
          <tr>
            {foto && (
              <td
                valign="top"
                style={{
                  paddingRight: "20px",
                  paddingBottom: "10px",
                }}
              >
                <img
                  src={foto}
                  alt={nombre}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "4px",
                    objectFit: "cover",
                    display: "block",
                    border: "1px solid #dddddd",
                  }}
                />
              </td>
            )}
            <td valign="top" style={{ paddingBottom: "10px" }}>
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#1a1a1a",
                        paddingBottom: "5px",
                      }}
                    >
                      {nombre}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontSize: "13px",
                        color: "#666666",
                        paddingBottom: "8px",
                      }}
                    >
                      {cargo}
                    </td>
                  </tr>
                  {telefono && (
                    <tr>
                      <td
                        style={{
                          fontSize: "12px",
                          color: "#555555",
                          paddingBottom: "5px",
                        }}
                      >
                        Tel: {telefono}
                      </td>
                    </tr>
                  )}
                  {redes.length > 0 && (
                    <tr>
                      <td style={{ paddingTop: "8px" }}>
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          border={0}
                          style={{
                            borderCollapse: "collapse",
                          }}
                        >
                          <tbody>
                            <tr>
                              {redes.map((red, index) => (
                                <td
                                  key={index}
                                  style={{
                                    paddingRight: index < redes.length - 1 ? "10px" : "0",
                                  }}
                                >
                                  <a
                                    href={red.url}
                                    style={{
                                      color: "#0066cc",
                                      textDecoration: "none",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {red.nombre}
                                  </a>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderModernTemplate = () => {
    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
          lineHeight: "1.6",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                borderLeft: "4px solid #0066cc",
                paddingLeft: "15px",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                }}
              >
                <tbody>
                  <tr>
                    {foto && (
                      <td
                        valign="top"
                        rowSpan={3}
                        style={{
                          paddingRight: "20px",
                          paddingBottom: "10px",
                        }}
                      >
                        <img
                          src={foto}
                          alt={nombre}
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            display: "block",
                            border: "3px solid #0066cc",
                          }}
                        />
                      </td>
                    )}
                    <td
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#0066cc",
                        paddingBottom: "5px",
                      }}
                    >
                      {nombre}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontSize: "13px",
                        color: "#666666",
                        paddingBottom: "8px",
                      }}
                    >
                      {cargo}
                    </td>
                  </tr>
                  {telefono && (
                    <tr>
                      <td
                        style={{
                          fontSize: "12px",
                          color: "#555555",
                          paddingBottom: "8px",
                        }}
                      >
                        <span
                          style={{
                            color: "#888888",
                          }}
                        >
                          📞
                        </span>{" "}
                        {telefono}
                      </td>
                    </tr>
                  )}
                  {redes.length > 0 && (
                    <tr>
                      <td style={{ paddingTop: "5px" }}>
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          border={0}
                          style={{
                            borderCollapse: "collapse",
                          }}
                        >
                          <tbody>
                            <tr>
                              {redes.map((red, index) => (
                                <td
                                  key={index}
                                  style={{
                                    paddingRight: index < redes.length - 1 ? "12px" : "0",
                                  }}
                                >
                                  <a
                                    href={red.url}
                                    style={{
                                      color: "#0066cc",
                                      textDecoration: "none",
                                      fontSize: "12px",
                                      borderBottom: "1px solid #0066cc",
                                    }}
                                  >
                                    {red.nombre}
                                  </a>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderMinimalTemplate = () => {
    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          fontSize: "13px",
          color: "#333333",
          lineHeight: "1.8",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                borderTop: "1px solid #dddddd",
                borderBottom: "1px solid #dddddd",
                padding: "12px 0",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                }}
              >
                <tbody>
                  <tr>
                    {foto && (
                      <td
                        valign="top"
                        style={{
                          paddingRight: "15px",
                          width: "70px",
                        }}
                      >
                        <img
                          src={foto}
                          alt={nombre}
                          style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "2px",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </td>
                    )}
                    <td valign="top">
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        style={{
                          borderCollapse: "collapse",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "#000000",
                                paddingBottom: "3px",
                              }}
                            >
                              {nombre}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                fontSize: "12px",
                                color: "#777777",
                                paddingBottom: "5px",
                              }}
                            >
                              {cargo}
                            </td>
                          </tr>
                          {telefono && (
                            <tr>
                              <td
                                style={{
                                  fontSize: "11px",
                                  color: "#999999",
                                  paddingBottom: "3px",
                                }}
                              >
                                {telefono}
                              </td>
                            </tr>
                          )}
                          {redes.length > 0 && (
                            <tr>
                              <td style={{ paddingTop: "5px" }}>
                                <table
                                  cellPadding="0"
                                  cellSpacing="0"
                                  border={0}
                                  style={{
                                    borderCollapse: "collapse",
                                  }}
                                >
                                  <tbody>
                                    <tr>
                                      {redes.map((red, index) => (
                                        <td
                                          key={index}
                                          style={{
                                            paddingRight: index < redes.length - 1 ? "8px" : "0",
                                          }}
                                        >
                                          <a
                                            href={red.url}
                                            style={{
                                              color: "#666666",
                                              textDecoration: "none",
                                              fontSize: "11px",
                                            }}
                                          >
                                            {red.nombre}
                                          </a>
                                          {index < redes.length - 1 && (
                                            <span style={{ color: "#cccccc", paddingLeft: "8px" }}>
                                              |
                                            </span>
                                          )}
                                        </td>
                                      ))}
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // Professional: Most Popular - Clean two-column design with company logo
  const renderProfessionalTemplate = () => {
    const iconoTel = iconoTelefono || "📞";
    const iconoTelMovil = iconoTelefonoMovil || "📱";
    const iconoDir = iconoDireccion || "📍";
    const cargoParts = (cargo || "").split("|").map((p) => p.trim());
    const cargoTitle = cargoParts[0] || cargo || "Tu Cargo";
    
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const website = redes.find((r) => r.url.includes("www") || (r.url.includes("http") && !r.url.includes("@")));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
        }}
      >
        <tbody>
          <tr>
            <td
              valign="top"
              style={{
                paddingRight: "40px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {logoEmpresa && (
                <img
                  src={logoEmpresa}
                  alt="Logo"
                  style={{
                    width: "120px",
                    height: "auto",
                    maxWidth: "120px",
                    display: "block",
                    border: "0",
                    objectFit: "contain",
                  }}
                />
              )}
            </td>
            <td valign="top" style={{ fontFamily: "Arial, sans-serif" }}>
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#333333",
                        paddingBottom: "8px",
                        lineHeight: "1.3",
                        textTransform: "uppercase",
                      }}
                    >
                      {(nombre || "Tu Nombre").toUpperCase()}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "11px",
                        color: "#cccccc",
                        textAlign: "center",
                        paddingBottom: "4px",
                        lineHeight: "1.2",
                        letterSpacing: "2px",
                      }}
                    >
                      &bull; &bull; &bull;
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "11px",
                        color: "#666666",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        paddingBottom: "12px",
                        lineHeight: "1.4",
                      }}
                    >
                      {(cargoTitle || "Tu Cargo").toUpperCase()}
                    </td>
                  </tr>
                  {telefono && (
                    <tr>
                      <td
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          color: "#666666",
                          paddingBottom: "6px",
                          lineHeight: "1.6",
                        }}
                      >
                        <span style={{ fontFamily: "Arial, sans-serif", color: "#333333", fontSize: "13px" }}>
                          {iconoTel}
                        </span>{" "}
                        <span style={{ fontFamily: "Arial, sans-serif", color: "#666666" }}>
                          {telefono}
                        </span>
                      </td>
                    </tr>
                  )}
                  {telefonoMovil && (
                    <tr>
                      <td
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          color: "#666666",
                          paddingBottom: "6px",
                          lineHeight: "1.6",
                        }}
                      >
                        <span style={{ fontFamily: "Arial, sans-serif", color: "#333333", fontSize: "13px" }}>
                          {iconoTelMovil}
                        </span>{" "}
                        <span style={{ fontFamily: "Arial, sans-serif", color: "#666666" }}>
                          {telefonoMovil}
                        </span>
                      </td>
                    </tr>
                  )}
                  {email && (
                    <tr>
                      <td
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          color: "#666666",
                          paddingBottom: "6px",
                          lineHeight: "1.6",
                        }}
                      >
                        <span style={{ fontFamily: "Arial, sans-serif", color: "#333333", fontSize: "13px" }}>
                          {email.icono || "✉️"}
                        </span>{" "}
                        <a
                          href={email.url}
                          style={{
                            fontFamily: "Arial, sans-serif",
                            color: "#666666",
                            textDecoration: "none",
                          }}
                        >
                          {email.url}
                        </a>
                      </td>
                    </tr>
                  )}
                  {direccion && (
                    <tr>
                      <td
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          color: "#666666",
                          paddingBottom: "6px",
                          lineHeight: "1.6",
                        }}
                      >
                        <span style={{ fontFamily: "Arial, sans-serif", color: "#333333", fontSize: "13px" }}>
                          {iconoDir}
                        </span>{" "}
                        <span style={{ fontFamily: "Arial, sans-serif", color: "#666666" }}>
                          {direccion}
                        </span>
                      </td>
                    </tr>
                  )}
                  {website && (
                    <tr>
                      <td
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          color: "#666666",
                          lineHeight: "1.6",
                        }}
                      >
                        <span style={{ fontFamily: "Arial, sans-serif", color: "#333333", fontSize: "13px" }}>
                          {website.icono || "🌐"}
                        </span>{" "}
                        <a
                          href={website.url}
                          style={{
                            fontFamily: "Arial, sans-serif",
                            color: "#666666",
                            textDecoration: "none",
                          }}
                        >
                          {website.url}
                        </a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // Minimal Corporate: Two columns separated by vertical line
  const renderTemplate01 = () => {
    const cargoParts = (cargo || "").split("|").map((p) => p.trim());
    const cargoTitle = cargoParts[0] || cargo || "Tu Cargo";
    const company = cargoParts[1] || "";

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
          lineHeight: "1.6",
        }}
      >
        <tbody>
          <tr>
            <td
              valign="top"
              style={{
                paddingRight: "30px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#333333",
                        paddingBottom: "8px",
                        lineHeight: "1.4",
                      }}
                    >
                      {nombre || "Tu Nombre"}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "14px",
                        color: "#666666",
                        lineHeight: "1.6",
                      }}
                    >
                      {cargoTitle || "Tu Cargo"}
                      {company && (
                        <>
                          {" | "}
                          <span style={{ fontFamily: "Arial, sans-serif", color: "#666666" }}>
                            {company}
                          </span>
                        </>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td
              valign="top"
              style={{
                borderLeft: "1px solid #e0e0e0",
                paddingLeft: "30px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  {telefono && (
                    <tr>
                      <td
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "13px",
                          color: "#666666",
                          paddingBottom: "6px",
                          lineHeight: "1.6",
                        }}
                      >
                        <span style={{ fontFamily: "Arial, sans-serif", fontWeight: "600" }}>
                          Phone:
                        </span>{" "}
                        <span style={{ fontFamily: "Arial, sans-serif", color: "#333333" }}>
                          {telefono}
                        </span>
                      </td>
                    </tr>
                  )}
                  {redes.find((r) => r.nombre.toLowerCase().includes("email") || r.url.includes("@")) && (
                    <tr>
                      <td
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "13px",
                          color: "#666666",
                          paddingBottom: "6px",
                          lineHeight: "1.6",
                        }}
                      >
                        <span style={{ fontFamily: "Arial, sans-serif", fontWeight: "600" }}>
                          Email:
                        </span>{" "}
                        <span style={{ fontFamily: "Arial, sans-serif", color: "#333333" }}>
                          {redes.find((r) => r.nombre.toLowerCase().includes("email") || r.url.includes("@"))?.url || ""}
                        </span>
                      </td>
                    </tr>
                  )}
                  {redes.find((r) => r.nombre.toLowerCase().includes("website") || r.url.includes("www")) && (
                    <tr>
                      <td
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "13px",
                          color: "#666666",
                          lineHeight: "1.6",
                        }}
                      >
                        <span style={{ fontFamily: "Arial, sans-serif", fontWeight: "600" }}>
                          Website:
                        </span>{" "}
                        <span style={{ fontFamily: "Arial, sans-serif", color: "#333333" }}>
                          {redes.find((r) => r.nombre.toLowerCase().includes("website") || r.url.includes("www"))?.url || ""}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // Moderna sin barra: Foto circular con borde color personalizable, info a la derecha
  const renderTemplate02 = () => {
    const accentColor = colorPersonalizado || "#0066cc";
    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
        }}
      >
        <tbody>
          <tr>
            {foto && (
              <td
                valign="top"
                style={{
                  paddingRight: "20px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <img
                  src={foto}
                  alt={nombre}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    border: `3px solid ${accentColor}`,
                  }}
                />
              </td>
            )}
            <td valign="top" style={{ fontFamily: "Arial, sans-serif" }}>
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#000000",
                        paddingBottom: "5px",
                        lineHeight: "1.4",
                      }}
                    >
                      {nombre}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "14px",
                        color: accentColor,
                        paddingBottom: "8px",
                        borderBottom: `1px solid ${accentColor}`,
                        lineHeight: "1.4",
                      }}
                    >
                      {(cargo || "").split("|")[0]?.trim() || cargo || "Tu Cargo"}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "13px",
                        color: "#999999",
                        paddingBottom: "12px",
                        lineHeight: "1.4",
                      }}
                    >
                      {(cargo || "").split("|")[1]?.trim() || ""}
                    </td>
                  </tr>
                  {(telefono || redes.length > 0) && (
                    <tr>
                      <td style={{ paddingTop: "8px", fontFamily: "Arial, sans-serif" }}>
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          border={0}
                          style={{
                            borderCollapse: "collapse",
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          <tbody>
                            {telefono && (
                              <tr>
                                <td
                                  style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontSize: "12px",
                                    color: "#666666",
                                    paddingBottom: "4px",
                                  }}
                                >
                                  <span style={{ fontFamily: "Arial, sans-serif", color: "#666666" }}>
                                    📞
                                  </span>{" "}
                                  {telefono}
                                </td>
                              </tr>
                            )}
                            {redes.length > 0 && (
                              <tr>
                                <td style={{ paddingTop: "8px", fontFamily: "Arial, sans-serif" }}>
                                  <table
                                    cellPadding="0"
                                    cellSpacing="0"
                                    border={0}
                                    style={{
                                      borderCollapse: "collapse",
                                      fontFamily: "Arial, sans-serif",
                                    }}
                                  >
                                    <tbody>
                                      <tr>
                                        {redes.slice(0, 3).map((red, index) => (
                                          <td
                                            key={index}
                                            style={{
                                              paddingRight: "12px",
                                              fontFamily: "Arial, sans-serif",
                                            }}
                                          >
                                            <a
                                              href={red.url}
                                              style={{
                                                fontFamily: "Arial, sans-serif",
                                                color: accentColor,
                                                textDecoration: "none",
                                                fontSize: "12px",
                                                borderBottom: `1px solid ${accentColor}`,
                                              }}
                                            >
                                              {red.nombre}
                                            </a>
                                          </td>
                                        ))}
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // Enterprise Vintage: Company logo, blue line, two columns, confidential notice
  const renderTemplate03 = () => {
    const cargoParts = (cargo || "").split("|").map((p) => p.trim());
    const cargoTitle = cargoParts[0] || cargo || "Tu Cargo";
    const company = cargoParts[1] || "";

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
        }}
      >
        <tbody>
          {logoEmpresa && (
            <tr>
              <td
                colSpan={2}
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "8px 12px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  style={{
                    borderCollapse: "collapse",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        <img
                          src={logoEmpresa}
                          alt="Logo"
                          style={{
                            width: "40px",
                            height: "40px",
                            display: "block",
                            border: "0",
                            objectFit: "contain",
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )}
          <tr>
            <td
              colSpan={2}
              style={{
                height: "3px",
                backgroundColor: "#1e40af",
                padding: "0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              &nbsp;
            </td>
          </tr>
          <tr>
            <td
              valign="top"
              style={{
                paddingRight: "40px",
                paddingTop: "15px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#000000",
                        paddingBottom: "6px",
                        lineHeight: "1.3",
                      }}
                    >
                      {nombre}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "14px",
                        color: "#333333",
                        paddingBottom: "6px",
                        lineHeight: "1.4",
                      }}
                    >
                      {cargoTitle}
                    </td>
                  </tr>
                  {company && (
                    <tr>
                      <td
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#333333",
                          lineHeight: "1.4",
                        }}
                      >
                        {company}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
            <td
              valign="top"
              style={{
                paddingTop: "15px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  {telefono && (
                    <>
                      <tr>
                        <td
                          style={{
                            fontFamily: "Arial, sans-serif",
                            fontSize: "13px",
                            color: "#333333",
                            paddingBottom: "4px",
                            lineHeight: "1.5",
                          }}
                        >
                          <span style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                            O:
                          </span>{" "}
                          {telefono}
                        </td>
                      </tr>
                    </>
                  )}
                  {textoAdicional && (
                    <tr>
                      <td
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          color: "#666666",
                          paddingBottom: "4px",
                          lineHeight: "1.5",
                        }}
                      >
                        {textoAdicional}
                      </td>
                    </tr>
                  )}
                  {redes.length > 0 && (
                    <>
                      {redes.find((r) => r.url.includes("@")) && (
                        <tr>
                          <td
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontSize: "13px",
                              color: "#333333",
                              paddingBottom: "4px",
                              lineHeight: "1.5",
                            }}
                          >
                            <span style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                              E:
                            </span>{" "}
                            <a
                              href={redes.find((r) => r.url.includes("@"))?.url}
                              style={{
                                fontFamily: "Arial, sans-serif",
                                color: "#0066cc",
                                textDecoration: "underline",
                              }}
                            >
                              {redes.find((r) => r.url.includes("@"))?.url}
                            </a>
                          </td>
                        </tr>
                      )}
                      {redes.find((r) => r.url.includes("www")) && (
                        <tr>
                          <td
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontSize: "13px",
                              color: "#333333",
                              lineHeight: "1.5",
                            }}
                          >
                            <span style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                              W:
                            </span>{" "}
                            <a
                              href={redes.find((r) => r.url.includes("www"))?.url}
                              style={{
                                fontFamily: "Arial, sans-serif",
                                color: "#0066cc",
                                textDecoration: "underline",
                              }}
                            >
                              {redes.find((r) => r.url.includes("www"))?.url}
                            </a>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              style={{
                borderTop: "1px solid #e0e0e0",
                paddingTop: "12px",
                paddingBottom: "8px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "11px",
                        color: "#999999",
                        fontStyle: "italic",
                        lineHeight: "1.5",
                      }}
                    >
                      CONFIDENTIALITY NOTICE: This email and any attachments are for the sole use
                      of the intended recipient(s) and may contain confidential and privileged
                      information. Any unauthorized review, use, disclosure, or distribution is
                      prohibited.
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // Modern 2: Rounded square photo, blue vertical line, blue labels
  const renderTemplate05 = () => {
    const cargoParts = (cargo || "").split("|").map((p) => p.trim());
    const cargoTitle = cargoParts[0] || cargo || "Tu Cargo";
    const company = cargoParts[1] || "";

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
        }}
      >
        <tbody>
          <tr>
            {foto && (
              <td
                valign="top"
                style={{
                  paddingRight: "20px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <img
                  src={foto}
                  alt={nombre}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    display: "block",
                    border: "0",
                  }}
                />
              </td>
            )}
            <td
              valign="top"
              style={{
                borderLeft: "2px solid #0066cc",
                paddingLeft: "20px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#0066cc",
                        paddingBottom: "6px",
                        lineHeight: "1.3",
                      }}
                    >
                      {nombre}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "13px",
                        color: "#666666",
                        paddingBottom: "10px",
                        lineHeight: "1.4",
                      }}
                    >
                      {cargoTitle}
                      {company && (
                        <>
                          {" | "}
                          <span style={{ fontFamily: "Arial, sans-serif", color: "#666666" }}>
                            {company}
                          </span>
                        </>
                      )}
                    </td>
                  </tr>
                  {(telefono || redes.length > 0) && (
                    <>
                      {telefono && (
                        <tr>
                          <td
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontSize: "12px",
                              color: "#333333",
                              paddingBottom: "4px",
                              lineHeight: "1.5",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: "600",
                                color: "#0066cc",
                              }}
                            >
                              P:
                            </span>{" "}
                            <span style={{ fontFamily: "Arial, sans-serif", color: "#333333" }}>
                              {telefono}
                            </span>
                          </td>
                        </tr>
                      )}
                      {redes.find((r) => r.url.includes("@")) && (
                        <tr>
                          <td
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontSize: "12px",
                              color: "#333333",
                              paddingBottom: "4px",
                              lineHeight: "1.5",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: "600",
                                color: "#0066cc",
                              }}
                            >
                              E:
                            </span>{" "}
                            <span style={{ fontFamily: "Arial, sans-serif", color: "#333333" }}>
                              {redes.find((r) => r.url.includes("@"))?.url}
                            </span>
                          </td>
                        </tr>
                      )}
                      {redes.find((r) => r.url.includes("www")) && (
                        <tr>
                          <td
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontSize: "12px",
                              color: "#333333",
                              lineHeight: "1.5",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "Arial, sans-serif",
                                fontWeight: "600",
                                color: "#0066cc",
                              }}
                            >
                              W:
                            </span>{" "}
                            <span style={{ fontFamily: "Arial, sans-serif", color: "#333333" }}>
                              {redes.find((r) => r.url.includes("www"))?.url}
                            </span>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // QR Professional: With QR code, dotted lines, social networks, schedule
  const renderTemplate06 = () => {
    const cargoParts = (cargo || "").split("|").map((p) => p.trim());
    const cargoTitle = cargoParts[0] || cargo || "Tu Cargo";
    const email = redes.find((r) => r.url.includes("@"));
    const website = redes.find((r) => r.url.includes("www")) || redes.find((r) => r.nombre.toLowerCase().includes("website"));

    const qrURL = qrLink ? generateQRCodeURL(qrLink, 80) : null;

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333333",
                paddingBottom: "5px",
                lineHeight: "1.4",
              }}
            >
              {nombre}
            </td>
          </tr>
          <tr>
            <td
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                color: "#0066cc",
                paddingBottom: "12px",
                lineHeight: "1.4",
              }}
            >
              {cargoTitle}
            </td>
          </tr>
          <tr>
            <td
              style={{
                borderTop: "1px dotted #cccccc",
                borderBottom: "1px dotted #cccccc",
                paddingTop: "10px",
                paddingBottom: "10px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      valign="top"
                      style={{
                        paddingRight: "20px",
                        fontFamily: "Arial, sans-serif",
                      }}
                    >
                      {qrURL ? (
                        <img
                          src={qrURL}
                          alt="QR Code"
                          style={{
                            width: "80px",
                            height: "80px",
                            display: "block",
                            border: "0",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: "#000000",
                            fontFamily: "Arial, sans-serif",
                            fontSize: "10px",
                            color: "#ffffff",
                            textAlign: "center",
                            verticalAlign: "middle",
                            display: "table-cell",
                            lineHeight: "80px",
                          }}
                        >
                          QR
                        </div>
                      )}
                    </td>
                    <td valign="top" style={{ fontFamily: "Arial, sans-serif" }}>
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        style={{
                          borderCollapse: "collapse",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        <tbody>
                          {telefono && (
                            <tr>
                              <td
                                style={{
                                  fontFamily: "Arial, sans-serif",
                                  fontSize: "12px",
                                  color: "#333333",
                                  paddingBottom: "4px",
                                  lineHeight: "1.5",
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: "bold",
                                  }}
                                >
                                  T:
                                </span>{" "}
                                {telefono}
                              </td>
                            </tr>
                          )}
                          {horario && (
                            <tr>
                              <td
                                style={{
                                  fontFamily: "Arial, sans-serif",
                                  fontSize: "12px",
                                  color: "#666666",
                                  paddingBottom: "4px",
                                  lineHeight: "1.5",
                                }}
                              >
                                Horario: {horario}
                              </td>
                            </tr>
                          )}
                          {email && (
                            <tr>
                              <td
                                style={{
                                  fontFamily: "Arial, sans-serif",
                                  fontSize: "12px",
                                  color: "#333333",
                                  paddingBottom: "4px",
                                  lineHeight: "1.5",
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontWeight: "bold",
                                  }}
                                >
                                  M:
                                </span>{" "}
                                {email.url}
                              </td>
                            </tr>
                          )}
                          {website && (
                            <tr>
                              <td
                                style={{
                                  fontFamily: "Arial, sans-serif",
                                  fontSize: "12px",
                                  color: "#333333",
                                  lineHeight: "1.5",
                                }}
                              >
                                {website.url}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {redes.length > 0 && (
            <tr>
              <td
                style={{
                  borderBottom: "1px dotted #cccccc",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  style={{
                    borderCollapse: "collapse",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  <tbody>
                    <tr>
                      {redes.slice(0, 5).map((red, index) => (
                        <td
                          key={index}
                          style={{
                            paddingRight: "8px",
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          <a
                            href={red.url}
                            style={{
                              fontFamily: "Arial, sans-serif",
                              color: "#0066cc",
                              textDecoration: "none",
                              fontSize: "12px",
                            }}
                          >
                            {red.nombre}
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  // Modern 3: Rounded square photo, vertical line, improved social network icons
  const renderTemplate08 = () => {
    const cargoParts = (cargo || "").split("|").map((p) => p.trim());
    const cargoTitle = cargoParts[0] || cargo || "Tu Cargo";
    const company = cargoParts[1] || "";
    const email = redes.find((r) => r.url.includes("@"));
    const website = redes.find((r) => r.url.includes("www"));

    // Function to get icon based on network name
    const getSocialIcon = (nombre: string): string => {
      if (!nombre) return "🔗";
      const nameLower = nombre.toLowerCase();
      if (nameLower.includes("linkedin")) return "💼";
      if (nameLower.includes("twitter") || nameLower.includes("x.com")) return "🐦";
      if (nameLower.includes("github")) return "💻";
      if (nameLower.includes("instagram")) return "📷";
      if (nameLower.includes("facebook")) return "👤";
      if (nameLower.includes("youtube")) return "▶️";
      return "🔗";
    };

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
        }}
      >
        <tbody>
          <tr>
            {foto && (
              <td
                valign="top"
                style={{
                  paddingRight: "20px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <img
                  src={foto}
                  alt={nombre}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    border: "0",
                  }}
                />
              </td>
            )}
            <td
              valign="top"
              style={{
                fontFamily: "Arial, sans-serif",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#0066cc",
                        paddingBottom: "6px",
                        lineHeight: "1.4",
                      }}
                    >
                      {nombre}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "13px",
                        color: "#666666",
                        paddingBottom: "5px",
                        lineHeight: "1.4",
                      }}
                    >
                      {cargoTitle}
                    </td>
                  </tr>
                  {company && (
                    <tr>
                      <td
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "13px",
                          color: "#666666",
                          paddingBottom: "12px",
                          lineHeight: "1.4",
                        }}
                      >
                        {company}
                      </td>
                    </tr>
                  )}
                  {(telefono || email || website) && (
                    <>
                      <tr>
                        <td
                          style={{
                            borderTop: "1px solid #e0e0e0",
                            paddingTop: "10px",
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          <table
                            cellPadding="0"
                            cellSpacing="0"
                            border={0}
                            style={{
                              borderCollapse: "collapse",
                              fontFamily: "Arial, sans-serif",
                            }}
                          >
                            <tbody>
                              {telefono && (
                                <tr>
                                  <td
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                      fontSize: "12px",
                                      color: "#666666",
                                      paddingBottom: "5px",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontFamily: "Arial, sans-serif",
                                        color: "#0066cc",
                                      }}
                                    >
                                      📞
                                    </span>{" "}
                                    {telefono}
                                  </td>
                                </tr>
                              )}
                              {email && (
                                <tr>
                                  <td
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                      fontSize: "12px",
                                      color: "#666666",
                                      paddingBottom: "5px",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontFamily: "Arial, sans-serif",
                                        color: "#0066cc",
                                      }}
                                    >
                                      ✉️
                                    </span>{" "}
                                    <a
                                      href={email.url}
                                      style={{
                                        fontFamily: "Arial, sans-serif",
                                        color: "#666666",
                                        textDecoration: "none",
                                      }}
                                    >
                                      {email.url}
                                    </a>
                                  </td>
                                </tr>
                              )}
                              {website && (
                                <tr>
                                  <td
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                      fontSize: "12px",
                                      color: "#666666",
                                      paddingBottom: "10px",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontFamily: "Arial, sans-serif",
                                        color: "#0066cc",
                                      }}
                                    >
                                      🌐
                                    </span>{" "}
                                    <a
                                      href={website.url}
                                      style={{
                                        fontFamily: "Arial, sans-serif",
                                        color: "#666666",
                                        textDecoration: "none",
                                      }}
                                    >
                                      {website.url}
                                    </a>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      {redes.length > 0 && (
                        <tr>
                          <td
                            style={{
                              paddingTop: "8px",
                              fontFamily: "Arial, sans-serif",
                            }}
                          >
                            <table
                              cellPadding="0"
                              cellSpacing="0"
                              border={0}
                              style={{
                                borderCollapse: "collapse",
                                fontFamily: "Arial, sans-serif",
                              }}
                            >
                              <tbody>
                                <tr>
                                  {redes.slice(0, 4).map((red, index) => (
                                    <td
                                      key={index}
                                      style={{
                                        paddingRight: "10px",
                                        fontFamily: "Arial, sans-serif",
                                      }}
                                    >
                                      <a
                                        href={red.url}
                                        title={red.nombre}
                                        style={{
                                          fontFamily: "Arial, sans-serif",
                                          color: "#0066cc",
                                          textDecoration: "none",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {getSocialIcon(red.nombre)}
                                      </a>
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // Modern 4: Circular photo, vertical line with customizable color, customizable CTA button
  const renderTemplate09 = () => {
    const cargoParts = (cargo || "").split("|").map((p) => p.trim());
    const cargoTitle = cargoParts[0] || cargo || "Tu Cargo";
    const company = cargoParts[1] || "";
    const email = redes.find((r) => r.url.includes("@"));
    const website = redes.find((r) => r.url.includes("www"));

    // Color por defecto: #20b2aa (teal), o color personalizado
    const accentColor = colorPersonalizado || "#20b2aa";
    const lightColor = `${accentColor}20`; // Light version for the button

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
        }}
      >
        <tbody>
          <tr>
            {foto && (
              <td
                valign="top"
                rowSpan={3}
                style={{
                  paddingRight: "20px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <img
                  src={foto}
                  alt={nombre}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    border: `3px solid ${accentColor}`,
                  }}
                />
              </td>
            )}
            <td
              valign="top"
              style={{
                borderLeft: `2px solid ${accentColor}`,
                paddingLeft: "20px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: accentColor,
                        paddingBottom: "5px",
                        lineHeight: "1.4",
                      }}
                    >
                      {nombre}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "13px",
                        color: "#666666",
                        paddingBottom: "12px",
                        lineHeight: "1.4",
                      }}
                    >
                      {cargoTitle}
                      {company && ` | ${company}`}
                    </td>
                  </tr>
                  {(telefono || email || website) && (
                    <tr>
                      <td
                        style={{
                          paddingBottom: "12px",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          border={0}
                          style={{
                            borderCollapse: "collapse",
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          <tbody>
                            {telefono && (
                              <tr>
                                <td
                                  style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontSize: "12px",
                                    color: "#666666",
                                    paddingBottom: "4px",
                                    lineHeight: "1.5",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                      color: accentColor,
                                    }}
                                  >
                                    📞
                                  </span>{" "}
                                  {telefono}
                                </td>
                              </tr>
                            )}
                            {email && (
                              <tr>
                                <td
                                  style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontSize: "12px",
                                    color: "#666666",
                                    paddingBottom: "4px",
                                    lineHeight: "1.5",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                      color: accentColor,
                                    }}
                                  >
                                    ✉️
                                  </span>{" "}
                                  <a
                                    href={email.url}
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                      color: "#666666",
                                      textDecoration: "none",
                                    }}
                                  >
                                    {email.url}
                                  </a>
                                </td>
                              </tr>
                            )}
                            {website && (
                              <tr>
                                <td
                                  style={{
                                    fontFamily: "Arial, sans-serif",
                                    fontSize: "12px",
                                    color: "#666666",
                                    paddingBottom: "12px",
                                    lineHeight: "1.5",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                      color: accentColor,
                                    }}
                                  >
                                    🌐
                                  </span>{" "}
                                  <a
                                    href={website.url}
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                      color: "#666666",
                                      textDecoration: "none",
                                    }}
                                  >
                                    {website.url}
                                  </a>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                      }}
                    >
                      <a
                        href="#"
                        style={{
                          fontFamily: "Arial, sans-serif",
                          display: "inline-block",
                          backgroundColor: lightColor,
                          color: accentColor,
                          padding: "8px 16px",
                          borderRadius: "4px",
                          textDecoration: "none",
                          fontSize: "12px",
                          fontWeight: "600",
                          border: `1px solid ${accentColor}`,
                        }}
                      >
                        {ctaTexto || "Book a Meeting"}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // QR Corporated: QR code (sin foto), redes sociales, aviso confidencial
  const renderTemplate10 = () => {
    const cargoParts = (cargo || "").split("|").map((p) => p.trim());
    const cargoTitle = cargoParts[0] || cargo || "Tu Cargo";
    const company = cargoParts[1] || "";
    const email = redes.find((r) => r.url.includes("@"));
    const website = redes.find((r) => r.url.includes("www"));

    const qrURL = qrLink ? generateQRCodeURL(qrLink, 80) : null;

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
        }}
      >
        <tbody>
          <tr>
            <td
              valign="top"
              style={{
                paddingBottom: "8px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#000000",
                        paddingBottom: "5px",
                        lineHeight: "1.4",
                      }}
                    >
                      {nombre}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "13px",
                        color: "#666666",
                        paddingBottom: "12px",
                        lineHeight: "1.4",
                      }}
                    >
                      {cargoTitle}
                      {company && ` at ${company}`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            {qrURL && (
              <td
                valign="top"
                align="right"
                style={{
                  paddingLeft: "20px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <img
                  src={qrURL}
                  alt="QR Code"
                  style={{
                    width: "60px",
                    height: "60px",
                    display: "block",
                    border: "0",
                  }}
                />
              </td>
            )}
          </tr>
          {(telefono || email || website) && (
            <tr>
              <td
                colSpan={qrURL ? 2 : 1}
                valign="top"
                style={{
                  paddingBottom: "12px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  style={{
                    borderCollapse: "collapse",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  <tbody>
                    {telefono && (
                      <tr>
                        <td
                          style={{
                            fontFamily: "Arial, sans-serif",
                            fontSize: "12px",
                            color: "#666666",
                            paddingBottom: "4px",
                            lineHeight: "1.5",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontWeight: "600",
                            }}
                          >
                            phone:
                          </span>{" "}
                          {telefono}
                        </td>
                      </tr>
                    )}
                    {email && (
                      <tr>
                        <td
                          style={{
                            fontFamily: "Arial, sans-serif",
                            fontSize: "12px",
                            color: "#666666",
                            paddingBottom: "4px",
                            lineHeight: "1.5",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontWeight: "600",
                            }}
                          >
                            email:
                          </span>{" "}
                          <a
                            href={email.url}
                            style={{
                              fontFamily: "Arial, sans-serif",
                              color: "#666666",
                              textDecoration: "none",
                            }}
                          >
                            {email.url}
                          </a>
                        </td>
                      </tr>
                    )}
                    {website && (
                      <tr>
                        <td
                          style={{
                            fontFamily: "Arial, sans-serif",
                            fontSize: "12px",
                            color: "#666666",
                            lineHeight: "1.5",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontWeight: "600",
                            }}
                          >
                            site:
                          </span>{" "}
                          <a
                            href={website.url}
                            style={{
                              fontFamily: "Arial, sans-serif",
                              color: "#666666",
                              textDecoration: "none",
                            }}
                          >
                            {website.url}
                          </a>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          )}
          {redes.length > 0 && (
            <tr>
              <td
                colSpan={qrURL ? 2 : 1}
                style={{
                  borderTop: "1px solid #e0e0e0",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  border={0}
                  style={{
                    borderCollapse: "collapse",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  <tbody>
                    <tr>
                      {redes.slice(0, 3).map((red, index) => (
                        <td
                          key={index}
                          style={{
                            paddingRight: "12px",
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          <a
                            href={red.url}
                            style={{
                              fontFamily: "Arial, sans-serif",
                              color: "#666666",
                              textDecoration: "none",
                              fontSize: "12px",
                            }}
                          >
                            {red.nombre}
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )}
          <tr>
            <td
              colSpan={qrURL ? 2 : 1}
              style={{
                borderTop: "1px solid #e0e0e0",
                paddingTop: "12px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "11px",
                        color: "#999999",
                        fontStyle: "italic",
                        lineHeight: "1.5",
                      }}
                    >
                      The content of this email is strictly confidential and only intended for the
                      specified recipient. It is forbidden to share the email or its contents with
                      any third party without the sender's written consent. If this email reached
                      you by mistake, please let us know so that we can ensure that this doesn't
                      happen in the future and delete the message.
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // Developer Minimal 2025: Minimal design for developers with clean layout
  const renderDeveloperMinimal2025 = () => {
    const email = redes.find((r) => r.url.includes("@"));
    const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
    const github = redes.find((r) => r.nombre.toLowerCase().includes("github"));
    const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
    const website = redes.find((r) => r.url.includes("www") && !r.url.includes("linkedin") && !r.url.includes("github") && !r.url.includes("twitter") && !r.url.includes("x.com"));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
          lineHeight: "1.5",
        }}
      >
        <tbody>
          <tr>
            {foto && (
              <td
                valign="top"
                style={{
                  paddingRight: "16px",
                  verticalAlign: "top",
                }}
              >
                <img
                  src={foto}
                  alt={nombre}
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    border: "2px solid #e5e7eb",
                  }}
                />
              </td>
            )}
            <td valign="top" style={{ verticalAlign: "top" }}>
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  {/* Nombre + Cargo */}
                  <tr>
                    <td style={{ paddingBottom: "4px" }}>
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        style={{
                          borderCollapse: "collapse",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#111827",
                                paddingRight: "12px",
                                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                              }}
                            >
                              {nombre}
                            </td>
                            <td
                              style={{
                                fontSize: "18px",
                                color: "#9ca3af",
                                paddingRight: "12px",
                              }}
                            >
                              |
                            </td>
                            <td
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#4b5563",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                              }}
                            >
                              {cargo}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {/* Links con iconos */}
                  <tr>
                    <td style={{ paddingTop: "4px" }}>
                      <table
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                        style={{
                          borderCollapse: "collapse",
                        }}
                      >
                        <tbody>
                          <tr>
                            {telefono && (
                              <td style={{ paddingRight: "20px", paddingBottom: "2px" }}>
                                <a
                                  href={`tel:${telefono.replace(/[^0-9+]/g, "")}`}
                                  style={{
                                    color: "#374151",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                                  }}
                                >
                                  📞 {telefono}
                                </a>
                              </td>
                            )}
                            {email && (
                              <td style={{ paddingRight: "20px", paddingBottom: "2px" }}>
                                <a
                                  href={`mailto:${email.url}`}
                                  style={{
                                    color: "#374151",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                                  }}
                                >
                                  ✉️ {email.url}
                                </a>
                              </td>
                            )}
                            {linkedin && (
                              <td style={{ paddingRight: "20px", paddingBottom: "2px" }}>
                                <a
                                  href={linkedin.url}
                                  style={{
                                    color: "#374151",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                                  }}
                                >
                                  💼 LinkedIn
                                </a>
                              </td>
                            )}
                            {github && (
                              <td style={{ paddingRight: "20px", paddingBottom: "2px" }}>
                                <a
                                  href={github.url}
                                  style={{
                                    color: "#374151",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                                  }}
                                >
                                  💻 GitHub
                                </a>
                              </td>
                            )}
                            {twitter && (
                              <td style={{ paddingRight: "20px", paddingBottom: "2px" }}>
                                <a
                                  href={twitter.url}
                                  style={{
                                    color: "#374151",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                                  }}
                                >
                                  🐦 Twitter
                                </a>
                              </td>
                            )}
                            {website && (
                              <td style={{ paddingRight: "20px", paddingBottom: "2px" }}>
                                <a
                                  href={website.url}
                                  style={{
                                    color: "#374151",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                                  }}
                                >
                                  🌐 {website.nombre || "Website"}
                                </a>
                              </td>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderUltraMinimal = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const github = redes.find((r) => r.nombre.toLowerCase().includes("github"));
    const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
    const website = redes.find((r) => {
      const url = r.url.toLowerCase();
      const name = r.nombre.toLowerCase();
      return (url.includes("www") || url.includes("http")) && 
             !url.includes("github") && 
             !url.includes("linkedin") &&
             !name.includes("github") &&
             !name.includes("linkedin");
    });

    const links: JSX.Element[] = [];
    
    if (email) {
      const emailUrl = email.url.includes("@") ? `mailto:${email.url}` : email.url;
      const emailText = email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "");
      links.push(
        <a key="email" href={emailUrl} style={{ color: "#374151", textDecoration: "none" }}>
          {emailText}
        </a>
      );
    }
    
    if (github) {
      const githubUrl = github.url.includes("http") ? github.url : `https://${github.url}`;
      const githubText = github.url.replace(/^https?:\/\//, "").replace(/^www\./, "");
      links.push(
        <React.Fragment key="github-sep">
          <span style={{ color: "#9ca3af", margin: "0 10px" }}>•</span>
          <a href={githubUrl} style={{ color: "#374151", textDecoration: "none" }}>
            {githubText}
          </a>
        </React.Fragment>
      );
    }

    if (linkedin) {
      const linkedinUrl = linkedin.url.includes("http") ? linkedin.url : `https://${linkedin.url}`;
      const linkedinText = linkedin.url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/in\//, "").replace(/\/$/, "");
      links.push(
        <React.Fragment key="linkedin-sep">
          <span style={{ color: "#9ca3af", margin: "0 10px" }}>•</span>
          <a href={linkedinUrl} style={{ color: "#374151", textDecoration: "none" }}>
            {linkedinText}
          </a>
        </React.Fragment>
      );
    }

    if (website) {
      const websiteUrl = website.url.includes("http") ? website.url : `https://${website.url}`;
      const websiteText = website.url.replace(/^https?:\/\//, "").replace(/^www\./, "");
      links.push(
        <React.Fragment key="website-sep">
          <span style={{ color: "#9ca3af", margin: "0 10px" }}>•</span>
          <a href={websiteUrl} style={{ color: "#374151", textDecoration: "none" }}>
            {websiteText}
          </a>
        </React.Fragment>
      );
    }

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
          lineHeight: "1.5",
        }}
      >
        <tbody>
          <tr>
            <td>
              <strong style={{ fontSize: "16px", color: "#111827" }}>{nombre}</strong>
              <span style={{ color: "#9ca3af", margin: "0 10px" }}>•</span>
              <span style={{ fontSize: "13px", color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {cargo}
              </span>
              {links.length > 0 && (
                <>
                  <br />
                  {links}
                </>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderGrowthMarketing = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const calendly = redes.find((r) => r.url.toLowerCase().includes("calendly") || r.nombre.toLowerCase().includes("book") || r.nombre.toLowerCase().includes("call"));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
          lineHeight: "1.5",
        }}
      >
        <tbody>
          <tr>
            {foto && (
              <td valign="top" style={{ paddingRight: "16px", verticalAlign: "top" }}>
                <img
                  src={foto}
                  alt={nombre}
                  width={64}
                  height={64}
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    border: "2px solid #e5e7eb",
                  }}
                />
              </td>
            )}
            <td valign="top" style={{ verticalAlign: "top" }}>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ paddingBottom: "4px" }}>
                      <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                        <tbody>
                          <tr>
                            <td style={{ fontSize: "18px", fontWeight: "600", color: "#111827", paddingRight: "12px" }}>
                              {nombre}
                            </td>
                            <td style={{ fontSize: "18px", color: "#9ca3af", paddingRight: "12px" }}>|</td>
                            <td style={{ fontSize: "14px", fontWeight: "500", color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              {cargo}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingTop: "4px" }}>
                      <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                        <tbody>
                          <tr>
                            {email && (
                              <td style={{ paddingRight: "20px", paddingBottom: "8px" }}>
                                <a
                                  href={`mailto:${email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}`}
                                  style={{ color: "#374151", textDecoration: "none", fontSize: "14px" }}
                                >
                                  {email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}
                                </a>
                              </td>
                            )}
                            {calendly && (
                              <td style={{ paddingRight: "20px", paddingBottom: "8px" }}>
                                <a href={calendly.url} style={{ color: "#374151", textDecoration: "none", fontSize: "14px" }}>
                                  Book a call
                                </a>
                              </td>
                            )}
                          </tr>
                          {ctaTexto && (
                            <tr>
                              <td colSpan={2} style={{ paddingTop: "8px" }}>
                                <a
                                  href="#"
                                  style={{
                                    background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
                                    color: "white",
                                    padding: "10px 16px",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    fontWeight: "600",
                                    fontSize: "13px",
                                    display: "inline-block",
                                  }}
                                >
                                  {ctaTexto}
                                </a>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderFreelanceDesigner = () => {
    const website = redes.find((r) => {
      const url = r.url.toLowerCase();
      const name = r.nombre.toLowerCase();
      return (url.includes("http") || url.includes("www") || url.includes(".")) && 
             !url.includes("behance") &&
             !name.includes("behance");
    });
    const behance = redes.find((r) => r.url.toLowerCase().includes("behance") || r.nombre.toLowerCase().includes("behance"));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
          lineHeight: "1.5",
        }}
      >
        <tbody>
          <tr>
            {foto && (
              <td valign="top" style={{ paddingRight: "16px", verticalAlign: "top" }}>
                <img
                  src={foto}
                  alt={nombre}
                  width={64}
                  height={64}
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    border: "2px solid #e5e7eb",
                  }}
                />
              </td>
            )}
            <td valign="top" style={{ verticalAlign: "top" }}>
              <strong style={{ fontSize: "16px", color: "#111827" }}>{nombre}</strong>
              <span style={{ color: "#9ca3af", margin: "0 10px" }}>|</span>
              <span style={{ fontSize: "13px", color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {cargo}
              </span>
              <br />
              <br />
              {telefono && (
                <a
                  href={`tel:${telefono.replace(/[^0-9+]/g, "")}`}
                  style={{ color: "#374151", textDecoration: "none", marginRight: "16px" }}
                >
                  {telefono}
                </a>
              )}
              {website && (
                <a
                  href={website.url.includes("http") ? website.url : `https://${website.url}`}
                  style={{ color: "#374151", textDecoration: "none", marginRight: "16px" }}
                >
                  {website.url.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                </a>
              )}
              {behance && (
                <a
                  href={behance.url.includes("http") ? behance.url : `https://${behance.url}`}
                  style={{ color: "#374151", textDecoration: "none" }}
                >
                  Behance
                </a>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderCorporateConsultant = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#333333",
          lineHeight: "1.5",
        }}
      >
        <tbody>
          <tr>
            {logoEmpresa && (
              <td valign="top" style={{ paddingRight: "16px", verticalAlign: "top" }}>
                <img
                  src={logoEmpresa}
                  alt="Company Logo"
                  width={120}
                  height={40}
                  style={{ display: "block" }}
                />
              </td>
            )}
            <td valign="top" style={{ verticalAlign: "top" }}>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ paddingBottom: "4px" }}>
                      <strong style={{ fontSize: "16px", color: "#111827" }}>{nombre}</strong>
                      <span style={{ color: "#9ca3af", margin: "0 10px" }}>|</span>
                      <span style={{ fontSize: "13px", color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {cargo}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingTop: "4px" }}>
                      {telefono && (
                        <a
                          href={`tel:${telefono.replace(/[^0-9+]/g, "")}`}
                          style={{ color: "#374151", textDecoration: "none", marginRight: "20px" }}
                        >
                          {telefono}
                        </a>
                      )}
                      {email && (
                        <a
                          href={`mailto:${email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}`}
                          style={{ color: "#374151", textDecoration: "none" }}
                        >
                          {email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}
                        </a>
                      )}
                    </td>
                  </tr>
                  {textoAdicional && (
                    <tr>
                      <td style={{ paddingTop: "8px", fontSize: "10px", color: "#9ca3af" }}>
                        {textoAdicional}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderInteriorDesign = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const website = redes.find((r) => {
      const url = r.url.toLowerCase();
      return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
    });

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#000000",
          lineHeight: "1.6",
        }}
      >
        <tbody>
          <tr>
            {foto && (
              <td valign="top" style={{ paddingRight: "0", verticalAlign: "top", position: "relative" }}>
                <img
                  src={foto}
                  alt={nombre}
                  width={80}
                  height={80}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    position: "relative",
                    zIndex: 2,
                  }}
                />
                <div style={{ position: "absolute", left: "40px", top: 0, bottom: 0, width: "2px", backgroundColor: "#000000", zIndex: 1 }}></div>
              </td>
            )}
            <td valign="top" style={{ verticalAlign: "top", paddingLeft: "20px" }}>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  <tr>
                    <td style={{ paddingBottom: "8px" }}>
                      <div style={{ fontSize: "18px", fontWeight: "700", color: "#000000" }}>{nombre}</div>
                      <div style={{ fontSize: "11px", fontWeight: "600", color: "#000000", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "4px" }}>
                        {cargo}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                        <tbody>
                          {logoEmpresa && (
                            <tr>
                              <td style={{ paddingBottom: "12px" }}>
                                <img src={logoEmpresa} alt="Company Logo" height={30} style={{ height: "30px", maxWidth: "200px", display: "block" }} />
                              </td>
                            </tr>
                          )}
                          {telefono && (
                            <tr>
                              <td style={{ paddingBottom: "6px", fontSize: "13px", color: "#000000" }}>
                                📞 {telefono}
                              </td>
                            </tr>
                          )}
                          {website && (
                            <tr>
                              <td style={{ paddingBottom: "6px", fontSize: "13px", color: "#000000" }}>
                                🌐 <a href={website.url} style={{ color: "#000000", textDecoration: "none" }}>
                                  {website.url.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                                </a>
                              </td>
                            </tr>
                          )}
                          {email && (
                            <tr>
                              <td style={{ paddingBottom: "6px", fontSize: "13px", color: "#000000" }}>
                                ✉️ <a href={`mailto:${email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}`} style={{ color: "#000000", textDecoration: "none" }}>
                                  {email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}
                                </a>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderUniversityProfessor = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const website = redes.find((r) => {
      const url = r.url.toLowerCase();
      return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
    });
    const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
    const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
    const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#1e293b",
          lineHeight: "1.6",
        }}
      >
        <tbody>
          <tr>
            <td style={{ paddingBottom: "12px" }}>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                {nombre}
              </div>
              <div style={{ fontSize: "12px", fontWeight: "400", color: "#64748b", textTransform: "uppercase", marginTop: "4px" }}>
                {cargo}
              </div>
              <div style={{ borderTop: "1px solid #e2e8f0", marginTop: "12px", marginBottom: "12px" }}></div>
            </td>
          </tr>
          {logoEmpresa && (
            <tr>
              <td style={{ paddingBottom: "12px" }}>
                <img src={logoEmpresa} alt="University Logo" height={50} style={{ height: "50px", maxWidth: "250px", display: "block" }} />
              </td>
            </tr>
          )}
          <tr>
            <td>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ paddingBottom: "8px", fontSize: "14px", color: "#1e293b" }}>
                      {telefono && (
                        <>
                          <span style={{ color: "#2563eb", fontWeight: "600" }}>Office:</span> <span style={{ color: "#2563eb" }}>{telefono}</span>
                        </>
                      )}
                      {telefono && (telefonoMovil || direccion) && <span style={{ color: "#cbd5e1", margin: "0 8px" }}>|</span>}
                      {direccion && (
                        <>
                          <span style={{ color: "#64748b" }}>{direccion}</span>
                        </>
                      )}
                    </td>
                  </tr>
                  {website && (
                    <tr>
                      <td style={{ paddingBottom: "8px", fontSize: "14px" }}>
                        <a href={website.url} style={{ color: "#2563eb", textDecoration: "none", fontWeight: "700", textTransform: "uppercase" }}>
                          {website.url.replace(/^https?:\/\//, "").replace(/^www\./, "").toUpperCase()}
                        </a>
                      </td>
                    </tr>
                  )}
                  {email && (
                    <tr>
                      <td style={{ paddingBottom: "12px" }}>
                        <a href={`mailto:${email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}`} style={{ color: "#2563eb", textDecoration: "none", fontSize: "14px" }}>
                          {email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}
                        </a>
                      </td>
                    </tr>
                  )}
                  {(linkedin || twitter || facebook) && (
                    <tr>
                      <td style={{ paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
                        {linkedin && (
                          <a
                            href={linkedin.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#2563eb",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "8px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "12px",
                            }}
                          >
                            in
                          </a>
                        )}
                        {twitter && (
                          <a
                            href={twitter.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#1e293b",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "8px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "14px",
                            }}
                          >
                            X
                          </a>
                        )}
                        {facebook && (
                          <a
                            href={facebook.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#2563eb",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "8px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "16px",
                            }}
                          >
                            f
                          </a>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderUniversityBanner = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const website = redes.find((r) => {
      const url = r.url.toLowerCase();
      return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
    });
    const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
    const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
    const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#1e293b",
          lineHeight: "1.6",
        }}
      >
        <tbody>
          <tr>
            <td style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", padding: "20px", textAlign: "right" }}>
              {foto && (
                <img
                  src={foto}
                  alt={nombre}
                  width={80}
                  height={80}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "inline-block",
                    border: "3px solid rgba(255,255,255,0.3)",
                  }}
                />
              )}
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "12px" }}>
                {nombre}
              </div>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "20px", backgroundColor: "#ffffff" }}>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  <tr>
                    <td style={{ paddingBottom: "12px", fontSize: "14px", color: "#64748b" }}>
                      {cargo}
                      {textoAdicional && ` | ${textoAdicional}`}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingBottom: "8px", fontSize: "14px", color: "#1e293b" }}>
                      {telefono && <span style={{ color: "#2563eb", marginRight: "16px" }}>📞 {telefono}</span>}
                      {telefonoMovil && <span style={{ color: "#2563eb" }}>📱 {telefonoMovil}</span>}
                    </td>
                  </tr>
                  {direccion && (
                    <tr>
                      <td style={{ paddingBottom: "8px", fontSize: "14px", color: "#64748b" }}>{direccion}</td>
                    </tr>
                  )}
                  {website && (
                    <tr>
                      <td style={{ paddingBottom: "12px", fontSize: "14px" }}>
                        <a href={website.url} style={{ color: "#2563eb", textDecoration: "none", fontWeight: "700", textTransform: "uppercase" }}>
                          {website.url.replace(/^https?:\/\//, "").replace(/^www\./, "").toUpperCase()}
                        </a>
                      </td>
                    </tr>
                  )}
                  {email && (
                    <tr>
                      <td style={{ paddingBottom: "12px" }}>
                        <a href={`mailto:${email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}`} style={{ color: "#2563eb", textDecoration: "none", fontSize: "14px" }}>
                          {email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}
                        </a>
                      </td>
                    </tr>
                  )}
                  {(linkedin || twitter || facebook) && (
                    <tr>
                      <td style={{ textAlign: "center", paddingTop: "12px" }}>
                        {linkedin && (
                          <a
                            href={linkedin.url}
                            style={{
                              display: "inline-block",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              backgroundColor: "#2563eb",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "36px",
                              margin: "0 6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "13px",
                            }}
                          >
                            in
                          </a>
                        )}
                        {twitter && (
                          <a
                            href={twitter.url}
                            style={{
                              display: "inline-block",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              backgroundColor: "#1e293b",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "36px",
                              margin: "0 6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "16px",
                            }}
                          >
                            X
                          </a>
                        )}
                        {facebook && (
                          <a
                            href={facebook.url}
                            style={{
                              display: "inline-block",
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              backgroundColor: "#2563eb",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "36px",
                              margin: "0 6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "18px",
                            }}
                          >
                            f
                          </a>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderCreativePortfolio = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const website = redes.find((r) => {
      const url = r.url.toLowerCase();
      return (url.includes("www") || url.includes("http")) && !url.includes("behance") && !url.includes("dribbble");
    });
    const behance = redes.find((r) => r.url.toLowerCase().includes("behance") || r.nombre.toLowerCase().includes("behance"));
    const dribbble = redes.find((r) => r.url.toLowerCase().includes("dribbble") || r.nombre.toLowerCase().includes("dribbble"));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#1e293b",
          lineHeight: "1.6",
        }}
      >
        <tbody>
          <tr>
            {foto && (
              <td valign="top" style={{ paddingRight: "20px", verticalAlign: "top" }}>
                <img
                  src={foto}
                  alt={nombre}
                  width={90}
                  height={90}
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    display: "block",
                    border: "1px solid #e2e8f0",
                  }}
                />
              </td>
            )}
            <td valign="top" style={{ verticalAlign: "top" }}>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ paddingBottom: "8px" }}>
                      <div style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>{nombre}</div>
                      <div style={{ borderLeft: "2px solid #cbd5e1", paddingLeft: "12px", marginTop: "4px", marginLeft: "0" }}>
                        <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>{cargo}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingBottom: "12px" }}>
                      <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                        <tbody>
                          {email && (
                            <tr>
                              <td style={{ paddingBottom: "6px", fontSize: "14px", color: "#64748b" }}>
                                ✉️{" "}
                                <a href={`mailto:${email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}`} style={{ color: "#64748b", textDecoration: "none" }}>
                                  {email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}
                                </a>
                              </td>
                            </tr>
                          )}
                          {telefono && (
                            <tr>
                              <td style={{ paddingBottom: "6px", fontSize: "14px", color: "#64748b" }}>📞 {telefono}</td>
                            </tr>
                          )}
                          {website && (
                            <tr>
                              <td style={{ paddingBottom: "12px", fontSize: "14px", color: "#64748b" }}>
                                🌐 <a href={website.url} style={{ color: "#64748b", textDecoration: "none" }}>
                                  {website.url.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                                </a>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {(behance || dribbble) && (
                    <tr>
                      <td>
                        <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                          <tbody>
                            <tr>
                              {behance && (
                                <td style={{ paddingRight: "8px" }}>
                                  <a
                                    href={behance.url}
                                    style={{
                                      display: "inline-block",
                                      border: "1px solid #e2e8f0",
                                      borderRadius: "4px",
                                      padding: "8px 12px",
                                      textDecoration: "none",
                                      backgroundColor: "#ffffff",
                                    }}
                                  >
                                    <span style={{ color: "#2563eb", fontWeight: "700", fontSize: "16px", marginRight: "8px" }}>Bē</span>
                                    <span style={{ color: "#64748b", fontSize: "13px", borderLeft: "1px solid #e2e8f0", paddingLeft: "8px" }}>My Behance portfolio</span>
                                  </a>
                                </td>
                              )}
                              {dribbble && (
                                <td>
                                  <a
                                    href={dribbble.url}
                                    style={{
                                      display: "inline-block",
                                      border: "1px solid #e2e8f0",
                                      borderRadius: "4px",
                                      padding: "8px 12px",
                                      textDecoration: "none",
                                      backgroundColor: "#ffffff",
                                    }}
                                  >
                                    <span style={{ color: "#ea4c89", fontSize: "18px", marginRight: "8px" }}>🏀</span>
                                    <span style={{ color: "#64748b", fontSize: "13px", borderLeft: "1px solid #e2e8f0", paddingLeft: "8px" }}>My Dribbble shots</span>
                                  </a>
                                </td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderMilitaryProfessional = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const website = redes.find((r) => {
      const url = r.url.toLowerCase();
      return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
    });
    const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
    const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
    const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));
    const instagram = redes.find((r) => r.nombre.toLowerCase().includes("instagram"));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#1e293b",
          lineHeight: "1.6",
        }}
      >
        <tbody>
          <tr>
            <td style={{ paddingBottom: "12px" }}>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#365314", letterSpacing: "0.02em" }}>{nombre}</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", textTransform: "uppercase", marginTop: "4px" }}>{cargo}</div>
            </td>
          </tr>
          <tr>
            <td>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                <tbody>
                  {telefono && (
                    <tr>
                      <td style={{ paddingBottom: "6px", fontSize: "14px", color: "#1e293b" }}>
                        <span style={{ color: "#365314", marginRight: "8px" }}>📞</span>
                        {telefono}
                      </td>
                    </tr>
                  )}
                  {email && (
                    <tr>
                      <td style={{ paddingBottom: "6px", fontSize: "14px", color: "#1e293b" }}>
                        <span style={{ color: "#365314", marginRight: "8px" }}>✉️</span>
                        <a href={`mailto:${email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}`} style={{ color: "#1e293b", textDecoration: "none" }}>
                          {email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}
                        </a>
                      </td>
                    </tr>
                  )}
                  {website && (
                    <tr>
                      <td style={{ paddingBottom: "6px", fontSize: "14px", color: "#1e293b" }}>
                        <span style={{ color: "#365314", marginRight: "8px" }}>🌐</span>
                        <a href={website.url} style={{ color: "#1e293b", textDecoration: "none" }}>
                          {website.url.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                        </a>
                      </td>
                    </tr>
                  )}
                  {direccion && (
                    <tr>
                      <td style={{ paddingBottom: "12px", fontSize: "14px", color: "#1e293b" }}>
                        <span style={{ color: "#365314", marginRight: "8px" }}>📍</span>
                        {direccion}
                      </td>
                    </tr>
                  )}
                  {(linkedin || twitter || facebook || instagram) && (
                    <tr>
                      <td style={{ paddingTop: "12px", borderTop: "1px solid #cbd5e1" }}>
                        <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>Follow us</div>
                        <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                          <tbody>
                            <tr>
                              {linkedin && (
                                <td style={{ paddingRight: "8px" }}>
                                  <a
                                    href={linkedin.url}
                                    style={{
                                      display: "inline-block",
                                      width: "32px",
                                      height: "32px",
                                      backgroundColor: "#365314",
                                      color: "white",
                                      textAlign: "center",
                                      lineHeight: "32px",
                                      textDecoration: "none",
                                      fontWeight: "700",
                                      fontSize: "12px",
                                    }}
                                  >
                                    in
                                  </a>
                                </td>
                              )}
                              {twitter && (
                                <td style={{ paddingRight: "8px" }}>
                                  <a
                                    href={twitter.url}
                                    style={{
                                      display: "inline-block",
                                      width: "32px",
                                      height: "32px",
                                      backgroundColor: "#365314",
                                      color: "white",
                                      textAlign: "center",
                                      lineHeight: "32px",
                                      textDecoration: "none",
                                      fontWeight: "700",
                                      fontSize: "14px",
                                    }}
                                  >
                                    🐦
                                  </a>
                                </td>
                              )}
                              {facebook && (
                                <td style={{ paddingRight: "8px" }}>
                                  <a
                                    href={facebook.url}
                                    style={{
                                      display: "inline-block",
                                      width: "32px",
                                      height: "32px",
                                      backgroundColor: "#365314",
                                      color: "white",
                                      textAlign: "center",
                                      lineHeight: "32px",
                                      textDecoration: "none",
                                      fontWeight: "700",
                                      fontSize: "16px",
                                    }}
                                  >
                                    f
                                  </a>
                                </td>
                              )}
                              {instagram && (
                                <td>
                                  <a
                                    href={instagram.url}
                                    style={{
                                      display: "inline-block",
                                      width: "32px",
                                      height: "32px",
                                      backgroundColor: "#365314",
                                      color: "white",
                                      textAlign: "center",
                                      lineHeight: "32px",
                                      textDecoration: "none",
                                      fontWeight: "700",
                                      fontSize: "16px",
                                    }}
                                  >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign: "middle", display: "inline-block"}}>
                                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="white"/>
                                    </svg>
                                  </a>
                                </td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderChurchProfessional = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const website = redes.find((r) => {
      const url = r.url.toLowerCase();
      return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
    });
    const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
    const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
    const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));
    const instagram = redes.find((r) => r.nombre.toLowerCase().includes("instagram"));
    const youtube = redes.find((r) => r.nombre.toLowerCase().includes("youtube"));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#1e293b",
          lineHeight: "1.6",
        }}
      >
        <tbody>
          <tr>
            <td style={{ paddingRight: "30px", verticalAlign: "top" }}>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ paddingBottom: "8px" }}>
                      <div style={{ fontSize: "22px", fontWeight: "700", color: "#14b8a6", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {nombre}
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>
                        {cargo}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ borderTop: "2px solid #14b8a6", marginTop: "8px", marginBottom: "8px", paddingTop: "8px", paddingBottom: "8px" }}>
                      {telefono && <div style={{ fontSize: "14px", color: "#1e293b", marginBottom: "4px" }}>Office: {telefono}</div>}
                      {telefonoMovil && <div style={{ fontSize: "14px", color: "#1e293b", marginBottom: "4px" }}>Cell: {telefonoMovil}</div>}
                      {email && (
                        <div style={{ fontSize: "14px", color: "#1e293b" }}>
                          Email:{" "}
                          <a href={`mailto:${email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}`} style={{ color: "#1e293b", textDecoration: "none" }}>
                            {email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}
                          </a>
                        </div>
                      )}
                    </td>
                  </tr>
                  {(linkedin || twitter || facebook || instagram || youtube) && (
                    <tr>
                      <td style={{ borderTop: "2px solid #14b8a6", paddingTop: "8px", paddingBottom: "8px" }}>
                        {linkedin && (
                          <a
                            href={linkedin.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#64748b",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "12px",
                            }}
                          >
                            in
                          </a>
                        )}
                        {twitter && (
                          <a
                            href={twitter.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#64748b",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "14px",
                            }}
                          >
                            🐦
                          </a>
                        )}
                        {facebook && (
                          <a
                            href={facebook.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#64748b",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "16px",
                            }}
                          >
                            f
                          </a>
                        )}
                        {instagram && (
                          <a
                            href={instagram.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#64748b",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "16px",
                            }}
                          >
                            📷
                          </a>
                        )}
                        {youtube && (
                          <a
                            href={youtube.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#64748b",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "14px",
                            }}
                          >
                            ▶
                          </a>
                        )}
                      </td>
                    </tr>
                  )}
                  {website && (
                    <tr>
                      <td style={{ paddingTop: "8px" }}>
                        <a href={website.url} style={{ color: "#14b8a6", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                          {website.url.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                        </a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
            {logoEmpresa && (
              <td style={{ verticalAlign: "top", textAlign: "right" }}>
                <img src={logoEmpresa} alt="Church Logo" height={80} style={{ height: "80px", maxWidth: "200px", display: "block" }} />
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#14b8a6", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "8px", textAlign: "center" }}>
                  CHURCH
                </div>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    );
  };

  const renderUniversityPresident = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
    const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
    const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "Georgia, serif",
          fontSize: "14px",
          color: "#1e293b",
          lineHeight: "1.7",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ paddingBottom: "16px" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#7c2d12", fontFamily: "Georgia, serif" }}>{nombre}</div>
              <div style={{ fontSize: "14px", color: "#64748b", fontFamily: "Georgia, serif", marginTop: "4px" }}>{cargo}</div>
            </td>
          </tr>
          <tr>
            <td style={{ paddingBottom: "12px", fontSize: "14px", color: "#1e293b" }}>
              {telefono && (
                <>
                  Office: <span style={{ color: "#7c2d12" }}>{telefono}</span>
                </>
              )}
              {telefono && telefonoMovil && <span style={{ color: "#cbd5e1" }}> • </span>}
              {telefonoMovil && (
                <>
                  Mobile: <span style={{ color: "#7c2d12" }}>{telefonoMovil}</span>
                </>
              )}
            </td>
          </tr>
          {email && (
            <tr>
              <td style={{ paddingBottom: "12px" }}>
                <a href={`mailto:${email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}`} style={{ color: "#7c2d12", textDecoration: "none", fontSize: "14px" }}>
                  {email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}
                </a>
              </td>
            </tr>
          )}
          <tr>
            <td style={{ paddingBottom: "16px", borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    {logoEmpresa && (
                      <td style={{ paddingRight: "16px", verticalAlign: "top" }}>
                        <img src={logoEmpresa} alt="University Logo" width={60} height={60} style={{ width: "60px", height: "60px", display: "block" }} />
                      </td>
                    )}
                    <td style={{ verticalAlign: "top" }}>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", fontFamily: "Georgia, serif" }}>UNIVERSITY NAME</div>
                      <div style={{ fontSize: "14px", color: "#64748b", fontFamily: "Georgia, serif" }}>Christian University</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {(linkedin || twitter || facebook) && (
            <tr>
              <td style={{ paddingBottom: "16px", borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
                <div style={{ fontSize: "14px", color: "#7c2d12" }}>
                  {linkedin && (
                    <>
                      <a href={linkedin.url} style={{ color: "#7c2d12", textDecoration: "none", marginRight: "8px" }}>
                        LinkedIn
                      </a>
                    </>
                  )}
                  {linkedin && (twitter || facebook) && <span style={{ color: "#cbd5e1" }}>|</span>}
                  {twitter && (
                    <>
                      <a href={twitter.url} style={{ color: "#7c2d12", textDecoration: "none", marginRight: "8px", marginLeft: "8px" }}>
                        Twitter
                      </a>
                    </>
                  )}
                  {(linkedin || twitter) && facebook && <span style={{ color: "#cbd5e1" }}>|</span>}
                  {facebook && (
                    <>
                      <a href={facebook.url} style={{ color: "#7c2d12", textDecoration: "none", marginLeft: "8px" }}>
                        Facebook
                      </a>
                    </>
                  )}
                </div>
              </td>
            </tr>
          )}
          {textoAdicional && (
            <tr>
              <td style={{ paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "13px", fontStyle: "italic", color: "#7c2d12", fontFamily: "Georgia, serif" }}>~ {textoAdicional}</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const renderPastorSignature = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
    const twitter = redes.find((r) => r.nombre.toLowerCase().includes("twitter") || r.nombre.toLowerCase().includes("x.com"));
    const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));
    const youtube = redes.find((r) => r.nombre.toLowerCase().includes("youtube"));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#1e293b",
          lineHeight: "1.6",
        }}
      >
        <tbody>
          <tr>
            <td style={{ paddingRight: "30px", verticalAlign: "top", borderRight: "1px solid #cbd5e1" }}>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ paddingBottom: "12px" }}>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#14b8a6" }}>{nombre}</div>
                      <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{cargo}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingBottom: "8px", fontSize: "14px", color: "#64748b" }}>
                      {telefono && <div>M. {telefono}</div>}
                      {email && (
                        <div>
                          E.{" "}
                          <a href={`mailto:${email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}`} style={{ color: "#64748b", textDecoration: "none" }}>
                            {email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}
                          </a>
                        </div>
                      )}
                      {direccion && <div>A. {direccion}</div>}
                    </td>
                  </tr>
                  {textoAdicional && (
                    <tr>
                      <td style={{ paddingTop: "12px", paddingBottom: "12px", fontStyle: "italic", color: "#14b8a6", fontSize: "14px" }}>
                        {textoAdicional}
                      </td>
                    </tr>
                  )}
                  {(linkedin || twitter || facebook || youtube) && (
                    <tr>
                      <td style={{ paddingTop: "8px" }}>
                        {linkedin && (
                          <a
                            href={linkedin.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#64748b",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "12px",
                            }}
                          >
                            in
                          </a>
                        )}
                        {twitter && (
                          <a
                            href={twitter.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#64748b",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "14px",
                            }}
                          >
                            🐦
                          </a>
                        )}
                        {facebook && (
                          <a
                            href={facebook.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#64748b",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "16px",
                            }}
                          >
                            f
                          </a>
                        )}
                        {youtube && (
                          <a
                            href={youtube.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#64748b",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "14px",
                            }}
                          >
                            ▶
                          </a>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
            <td style={{ paddingLeft: "30px", verticalAlign: "middle", textAlign: "center" }}>
              {logoEmpresa && <img src={logoEmpresa} alt="Church Logo" width={80} height={80} style={{ width: "80px", height: "80px", borderRadius: "50%", display: "block", margin: "0 auto" }} />}
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#14b8a6", marginTop: "12px", textTransform: "uppercase" }}>CHURCH NAME</div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderLawStudent = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const website = redes.find((r) => {
      const url = r.url.toLowerCase();
      return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
    });
    const linkedin = redes.find((r) => r.nombre.toLowerCase().includes("linkedin"));
    const instagram = redes.find((r) => r.nombre.toLowerCase().includes("instagram"));
    const facebook = redes.find((r) => r.nombre.toLowerCase().includes("facebook"));

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#1e293b",
          lineHeight: "1.6",
        }}
      >
        <tbody>
          <tr>
            <td style={{ background: "linear-gradient(135deg, #059669 0%, #047857 100%)", padding: "20px" }}>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    {foto && (
                      <td style={{ paddingRight: "16px", verticalAlign: "middle" }}>
                        <img
                          src={foto}
                          alt={nombre}
                          width={70}
                          height={70}
                          style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            display: "block",
                            border: "3px solid rgba(255,255,255,0.3)",
                          }}
                        />
                      </td>
                    )}
                    <td style={{ verticalAlign: "middle" }}>
                      <div style={{ fontSize: "11px", fontWeight: "600", color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                        {cargo}
                      </div>
                      <div style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.05em" }}>{nombre}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "20px", backgroundColor: "#ffffff" }}>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ borderCollapse: "collapse" }}>
                <tbody>
                  {direccion && (
                    <tr>
                      <td style={{ paddingBottom: "6px", fontSize: "14px", color: "#059669" }}>
                        <strong>A:</strong> <span style={{ color: "#1e293b" }}>{direccion}</span>
                      </td>
                    </tr>
                  )}
                  {telefonoMovil && (
                    <tr>
                      <td style={{ paddingBottom: "6px", fontSize: "14px", color: "#059669" }}>
                        <strong>M:</strong> <span style={{ color: "#1e293b" }}>{telefonoMovil}</span>
                      </td>
                    </tr>
                  )}
                  {telefono && (
                    <tr>
                      <td style={{ paddingBottom: "6px", fontSize: "14px", color: "#059669" }}>
                        <strong>T:</strong> <span style={{ color: "#1e293b" }}>{telefono}</span>
                      </td>
                    </tr>
                  )}
                  {email && (
                    <tr>
                      <td style={{ paddingBottom: "12px", fontSize: "14px", color: "#059669" }}>
                        <strong>E:</strong>{" "}
                        <a href={`mailto:${email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}`} style={{ color: "#1e293b", textDecoration: "none" }}>
                          {email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}
                        </a>
                      </td>
                    </tr>
                  )}
                  {website && (
                    <tr>
                      <td style={{ paddingBottom: "12px", fontSize: "14px" }}>
                        <a href={website.url} style={{ color: "#059669", textDecoration: "none", fontWeight: "600" }}>
                          {website.url.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                        </a>
                      </td>
                    </tr>
                  )}
                  {(linkedin || instagram || facebook) && (
                    <tr>
                      <td style={{ paddingTop: "8px", paddingBottom: "12px" }}>
                        {linkedin && (
                          <a
                            href={linkedin.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              background: "#059669",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "12px",
                            }}
                          >
                            in
                          </a>
                        )}
                        {instagram && (
                          <a
                            href={instagram.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              background: "#059669",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "16px",
                            }}
                          >
                            📷
                          </a>
                        )}
                        {facebook && (
                          <a
                            href={facebook.url}
                            style={{
                              display: "inline-block",
                              width: "32px",
                              height: "32px",
                              background: "#059669",
                              color: "white",
                              textAlign: "center",
                              lineHeight: "32px",
                              marginRight: "6px",
                              textDecoration: "none",
                              fontWeight: "700",
                              fontSize: "16px",
                            }}
                          >
                            f
                          </a>
                        )}
                      </td>
                    </tr>
                  )}
                  {textoAdicional && (
                    <tr>
                      <td style={{ paddingTop: "12px", borderTop: "1px solid #e2e8f0", fontSize: "12px", color: "#059669", lineHeight: "1.6" }}>
                        🌳 {textoAdicional}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderGreenExecutive = () => {
    const email = redes.find((r) => r.url.includes("@") || r.nombre.toLowerCase().includes("email"));
    const website = redes.find((r) => {
      const url = r.url.toLowerCase();
      return (url.includes("www") || url.includes("http")) && !url.includes("linkedin") && !url.includes("github");
    });

    const nombreParts = nombre.split(" ");
    const firstName = nombreParts[0] || nombre;
    const lastName = nombreParts.slice(1).join(" ") || "";

    return (
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        style={{
          borderCollapse: "collapse",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSize: "14px",
          color: "#1e293b",
          lineHeight: "1.7",
        }}
      >
        <tbody>
          <tr>
            <td style={{ paddingRight: "40px", verticalAlign: "top", borderRight: "1px solid #86efac" }}>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "#166534", textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: "4px" }}>
                {firstName}
              </div>
              {lastName && (
                <div style={{ fontSize: "32px", fontWeight: "700", color: "#166534", textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: "16px" }}>
                  {lastName}
                </div>
              )}
              {telefono && <div style={{ fontSize: "14px", color: "#86efac", marginBottom: "4px" }}>{telefono}</div>}
              {email && (
                <div style={{ fontSize: "14px", color: "#86efac", marginBottom: "4px" }}>
                  <a href={`mailto:${email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}`} style={{ color: "#86efac", textDecoration: "none" }}>
                    {email.url.includes("@") ? email.url : email.url.replace(/^mailto:/, "")}
                  </a>
                </div>
              )}
              {website && (
                <div style={{ fontSize: "14px", color: "#86efac" }}>
                  <a href={website.url} style={{ color: "#86efac", textDecoration: "none" }}>
                    {website.url.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                  </a>
                </div>
              )}
            </td>
            <td style={{ paddingLeft: "40px", verticalAlign: "top" }}>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#86efac", marginBottom: "8px" }}>{cargo}</div>
              <div style={{ fontSize: "14px", color: "#86efac", marginBottom: "16px" }}>B2B Marketing</div>
              <div style={{ fontSize: "20px", color: "#166534", marginBottom: "16px" }}>🌳</div>
              {textoAdicional && (
                <div style={{ fontSize: "12px", color: "#86efac", lineHeight: "1.6" }}>{textoAdicional}</div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return <div style={{ display: "inline-block" }}>{renderTemplate()}</div>;
});

SignaturePreview.displayName = "SignaturePreview";

export default SignaturePreview;
