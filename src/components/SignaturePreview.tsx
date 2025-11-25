import React from "react";
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

const SignaturePreview: React.FC<SignaturePreviewProps> = ({
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
      case "minimal":
        return renderMinimalTemplate();
      case "minimalCorporate":
        return renderTemplate01();
      case "modernaSinBarra":
        return renderTemplate02();
      case "enterpriseVintage":
        return renderTemplate03();
      case "modern2":
        return renderTemplate05();
      case "qrProfesional":
        return renderTemplate06();
      case "modern3":
        return renderTemplate08();
      case "modern4":
        return renderTemplate09();
      case "qrCorporated":
        return renderTemplate10();
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

  // Minimal Corporate: Dos columnas separadas por línea vertical
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

  // Enterprise Vintage: Logo de empresa, línea azul, dos columnas, aviso confidencial
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
                colspan="2"
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
              colspan="2"
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
              colspan="2"
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

  // Modern 2: Foto cuadrada redondeada, línea vertical azul, labels azules
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

  // QR Profesional: Con QR code, líneas punteadas, redes sociales, horario
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

  // Modern 3: Foto cuadrada redondeada, línea vertical, iconos de redes mejorados
  const renderTemplate08 = () => {
    const cargoParts = (cargo || "").split("|").map((p) => p.trim());
    const cargoTitle = cargoParts[0] || cargo || "Tu Cargo";
    const company = cargoParts[1] || "";
    const email = redes.find((r) => r.url.includes("@"));
    const website = redes.find((r) => r.url.includes("www"));

    // Función para obtener icono según el nombre de la red
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

  // Modern 4: Foto circular, línea vertical con color personalizable, botón CTA personalizable
  const renderTemplate09 = () => {
    const cargoParts = (cargo || "").split("|").map((p) => p.trim());
    const cargoTitle = cargoParts[0] || cargo || "Tu Cargo";
    const company = cargoParts[1] || "";
    const email = redes.find((r) => r.url.includes("@"));
    const website = redes.find((r) => r.url.includes("www"));

    // Color por defecto: #20b2aa (teal), o color personalizado
    const accentColor = colorPersonalizado || "#20b2aa";
    const lightColor = `${accentColor}20`; // Versión clara para el botón

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
                rowSpan="3"
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
                colspan={qrURL ? "2" : "1"}
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
                colspan={qrURL ? "2" : "1"}
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
              colspan={qrURL ? "2" : "1"}
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

  return <div style={{ display: "inline-block" }}>{renderTemplate()}</div>;
};

export default SignaturePreview;

