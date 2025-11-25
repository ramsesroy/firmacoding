import React from "react";
import { SignatureProps, TemplateType } from "@/types/signature";

interface SignaturePreviewProps extends SignatureProps {
  template: TemplateType;
}

const SignaturePreview: React.FC<SignaturePreviewProps> = ({
  nombre,
  cargo,
  foto,
  telefono,
  redes = [],
  template,
}) => {
  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return renderClassicTemplate();
      case "modern":
        return renderModernTemplate();
      case "minimal":
        return renderMinimalTemplate();
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

  return <div style={{ display: "inline-block" }}>{renderTemplate()}</div>;
};

export default SignaturePreview;

