"use client";

import { useState } from "react";
import SignaturePreview from "./SignaturePreview";
import { SignatureProps, TemplateType } from "@/types/signature";

interface EmailClientPreviewProps extends SignatureProps {
  template: TemplateType;
}

export default function EmailClientPreview(props: EmailClientPreviewProps) {
  const [selectedClient, setSelectedClient] = useState<"gmail" | "outlook" | "apple">("gmail");

  const clientStyles = {
    gmail: {
      container: "bg-white border border-gray-300",
      padding: "p-4",
    },
    outlook: {
      container: "bg-white border-2 border-blue-200",
      padding: "p-3",
    },
    apple: {
      container: "bg-gray-50 border border-gray-200",
      padding: "p-5",
    },
  };

  const currentStyle = clientStyles[selectedClient];

  return (
    <div className="space-y-4">
      {/* Selector de cliente */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {[
          { id: "gmail" as const, name: "Gmail", icon: "📧" },
          { id: "outlook" as const, name: "Outlook", icon: "📮" },
          { id: "apple" as const, name: "Apple Mail", icon: "🍎" },
        ].map((client) => (
          <button
            key={client.id}
            onClick={() => setSelectedClient(client.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedClient === client.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="mr-2">{client.icon}</span>
            {client.name}
          </button>
        ))}
      </div>

      {/* Preview del cliente */}
      <div className={`${currentStyle.container} ${currentStyle.padding} rounded-lg`}>
        <div className="text-xs text-gray-500 mb-2 font-semibold uppercase">
          Vista previa en {selectedClient === "gmail" ? "Gmail" : selectedClient === "outlook" ? "Outlook" : "Apple Mail"}
        </div>
        <div className="border-t border-gray-200 pt-3">
          <SignaturePreview {...props} />
        </div>
      </div>
    </div>
  );
}

