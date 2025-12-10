"use client";

export default function JsonLdSchema() {
    // SoftwareApplication Schema
    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Signature For Me",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "10000",
            "bestRating": "5",
            "worstRating": "1"
        },
        "description": "Generador de firmas de correo electrónico profesional. Crea firmas para Gmail, Outlook y más. Plantillas personalizables, exportación HTML. 100% gratis.",
        "screenshot": `${typeof window !== 'undefined' ? window.location.origin : 'https://signaturefor.me'}/og-image.png`,
        "url": typeof window !== 'undefined' ? window.location.origin : "https://signaturefor.me",
        "author": {
            "@type": "Organization",
            "name": "Signature For Me",
            "url": typeof window !== 'undefined' ? window.location.origin : "https://signaturefor.me"
        },
        "featureList": [
            "Generador de firmas de correo electrónico",
            "Plantillas profesionales personalizables",
            "Exportación HTML, PNG y PDF",
            "Compatible con Gmail y Outlook",
            "Sin conocimientos técnicos requeridos",
            "100% gratis para siempre"
        ]
    };

    // Organization Schema
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Signature For Me",
        "url": typeof window !== 'undefined' ? window.location.origin : "https://signaturefor.me",
        "logo": `${typeof window !== 'undefined' ? window.location.origin : 'https://signaturefor.me'}/icon.svg`,
        "description": "Generador de firmas de correo electrónico profesional",
        "sameAs": [
            "https://twitter.com/signatureforme"
        ]
    };

    // FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "¿Es Signature For Me realmente gratis?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí! Nuestro plan básico es completamente gratis para siempre. Puedes crear firmas ilimitadas con acceso a todas las plantillas y funciones de exportación."
                }
            },
            {
                "@type": "Question",
                "name": "¿Puedo usar las firmas con Gmail?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "¡Absolutamente! Nuestras firmas funcionan con Gmail, Outlook, Apple Mail y prácticamente cualquier cliente de correo que soporte firmas HTML."
                }
            },
            {
                "@type": "Question",
                "name": "¿Necesito conocimientos técnicos?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "¡Para nada! Nuestro editor intuitivo hace que sea fácil para cualquiera crear firmas profesionales. Solo completa tu información y personaliza."
                }
            },
            {
                "@type": "Question",
                "name": "¿Puedo personalizar las plantillas?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí! Puedes personalizar colores, fuentes, diseños y agregar tu propio logo y fotos. Cada plantilla es completamente personalizable para que coincida con tu marca."
                }
            },
            {
                "@type": "Question",
                "name": "¿Mis datos están seguros?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, tomamos la seguridad en serio. Todos tus datos están encriptados y almacenados de forma segura. Puedes eliminar tus datos en cualquier momento desde la configuración de tu cuenta."
                }
            },
            {
                "@type": "Question",
                "name": "¿Puedo exportar mi firma?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "¡Sí! Puedes exportar tu firma como HTML, PNG o PDF. Copia y pega directamente en tu cliente de correo o descarga para uso offline."
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </>
    );
}
