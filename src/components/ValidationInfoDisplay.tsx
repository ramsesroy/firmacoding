"use client";

import { useState, useEffect } from "react";
import { SignatureProps, TemplateType } from "@/types/signature";
import { generateValidationInfo } from "@/lib/validationUtils";
import { getBaseSignatureHTML } from "@/lib/signatureUtils";

interface ValidationInfoDisplayProps {
  signatureData: SignatureProps;
  template: TemplateType;
}

const ValidationInfoDisplay: React.FC<ValidationInfoDisplayProps> = ({
  signatureData,
  template,
}) => {
  const [validationInfo, setValidationInfo] = useState<{
    timestampFormatted: string;
    hash: string;
    hashShort: string;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateValidationInfo = async () => {
      setLoading(true);
      try {
        // Obtener HTML base sin validación para calcular el hash
        const baseHTML = getBaseSignatureHTML(signatureData, template);
        
        // Generar información de validación basada en el HTML base
        const userName = signatureData.nombre || "Usuario";
        const info = await generateValidationInfo(baseHTML, userName);
        
        setValidationInfo({
          timestampFormatted: info.timestampFormatted,
          hash: info.hash,
          hashShort: info.hashShort,
          message: info.message,
        });
      } catch (error) {
        console.error("Error generating validation info:", error);
      } finally {
        setLoading(false);
      }
    };

    updateValidationInfo();
  }, [signatureData, template]);

  if (loading || !validationInfo) {
    return (
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
        <p className="text-sm text-blue-600">Generando información de validación...</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-xl p-4 sm:p-5 border border-blue-200 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Verificación de Integridad
          </h3>
          <p className="text-xs text-blue-700 mb-2 leading-relaxed">
            {validationInfo.message}
          </p>
          <div className="mt-2 p-2 bg-white rounded border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">
              <strong>Hash SHA-256:</strong>
            </p>
            <code className="text-[10px] text-gray-700 font-mono break-all">
              {validationInfo.hash}
            </code>
          </div>
          <p className="text-[10px] text-blue-600 mt-2 italic">
            Esta información se incluirá en el HTML de la firma cuando la copies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValidationInfoDisplay;
