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
        "description": "Professional email signature generator. Create beautiful signatures for Gmail, Outlook, and more. Customizable templates, HTML export. 100% free.",
        "screenshot": `${typeof window !== 'undefined' ? window.location.origin : 'https://signaturefor.me'}/og-image.png`,
        "url": typeof window !== 'undefined' ? window.location.origin : "https://signaturefor.me",
        "author": {
            "@type": "Organization",
            "name": "Signature For Me",
            "url": typeof window !== 'undefined' ? window.location.origin : "https://signaturefor.me"
        },
        "featureList": [
            "Professional email signature generator",
            "Customizable professional templates",
            "HTML, PNG and PDF export",
            "Compatible with Gmail and Outlook",
            "No technical skills required",
            "100% free forever"
        ]
    };

    // Organization Schema
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Signature For Me",
        "url": typeof window !== 'undefined' ? window.location.origin : "https://signaturefor.me",
        "logo": `${typeof window !== 'undefined' ? window.location.origin : 'https://signaturefor.me'}/icon.svg`,
        "description": "Professional email signature generator",
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
                "name": "Is Signature For Me really free?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Our basic plan is completely free forever. You can create unlimited signatures with access to all templates and export features."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use the signatures with Gmail?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely! Our signatures work with Gmail, Outlook, Apple Mail, and virtually any email client that supports HTML signatures."
                }
            },
            {
                "@type": "Question",
                "name": "Do I need technical skills?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Not at all! Our intuitive editor makes it easy for anyone to create professional signatures. Just fill in your information and customize."
                }
            },
            {
                "@type": "Question",
                "name": "Can I customize the templates?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! You can customize colors, fonts, layouts, and add your own logo and photos. Every template is fully customizable to match your brand."
                }
            },
            {
                "@type": "Question",
                "name": "Is my data secure?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we take security seriously. All your data is encrypted and stored securely. You can delete your data anytime from your account settings."
                }
            },
            {
                "@type": "Question",
                "name": "Can I export my signature?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! You can export your signature as HTML, PNG, or PDF. Copy and paste directly into your email client or download for offline use."
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
