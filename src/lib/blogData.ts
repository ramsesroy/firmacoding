import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-create-professional-email-signature-gmail-outlook-2026",
    title: "How to Create a Professional Email Signature in Gmail and Outlook (Step-by-Step 2026)",
    description: "The ultimate 2026 guide: create a professional signature in Gmail, Outlook, and Apple Mail in less than 5 minutes. Includes free templates and tricks to prevent it from breaking.",
    metaDescription: "Ultimate 2026 guide: create a professional signature in Gmail, Outlook, and Apple Mail in less than 5 minutes. Includes free templates and tricks to prevent it from breaking.",
    author: "Signature For Me Team",
    authorRole: "Email Signature Experts",
    publishedAt: "2026-01-15",
    readTime: 12,
    category: "Tutorials",
    tags: ["Gmail", "Outlook", "Tutorial", "2026"],
    featured: true,
    image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&h=450&fit=crop&auto=format&q=80",
    keywords: [
      "how to put signature in Gmail 2026",
      "professional Outlook signature",
      "create email signature for free",
      "email signature template",
      "Gmail signature setup",
      "Outlook signature tutorial"
    ],
  },
  {
    slug: "how-to-create-professional-email-signature-5-minutes-2026",
    title: "How to Create a Professional Email Signature in Less Than 5 Minutes (2026 Guide)",
    description: "Universal step-by-step guide to create a professional email signature in under 5 minutes. Includes 5 free downloadable templates and best practices for 2026.",
    metaDescription: "Complete 2026 guide: create a professional email signature in less than 5 minutes. Universal step-by-step instructions + 5 free downloadable templates included.",
    author: "Signature For Me Team",
    authorRole: "Email Signature Experts",
    publishedAt: "2026-01-20",
    readTime: 8,
    category: "Tutorials",
    tags: ["Quick Guide", "Templates", "2026", "Professional"],
    featured: true,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&auto=format&q=80",
    keywords: [
      "how to create professional email signature",
      "create email signature 5 minutes",
      "professional email signature guide",
      "free email signature templates",
      "email signature best practices 2026",
      "quick email signature tutorial"
    ],
  },
  {
    slug: "free-email-signature-create-professional-signature-30-seconds-2025",
    title: "Free Email Signature for Me: Create a Professional Signature in 30 Seconds (2025)",
    description: "Get a professional email signature that says 'this person has their sh*t together' - completely free, no credit card, no signup required. Works instantly in Gmail, Outlook, and Apple Mail.",
    metaDescription: "Create a professional email signature in 30 seconds - completely free at signaturefor.me. No credit card, no signup. Works in Gmail, Outlook, Apple Mail. 20+ modern templates available.",
    author: "Signature For Me Team",
    authorRole: "Email Signature Experts",
    publishedAt: "2026-01-25",
    readTime: 5,
    category: "Free Tools",
    tags: ["Free", "Quick Guide", "2025", "Templates"],
    featured: true,
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=450&fit=crop&auto=format&q=80",
    keywords: [
      "free email signature",
      "create email signature free",
      "professional email signature free",
      "email signature generator free",
      "free signature maker",
      "email signature template free"
    ],
  },
  {
    slug: "email-signature-best-practices-10-mistakes-costing-opportunities-2026",
    title: "Email Signature Best Practices: 10 Mistakes That Are Costing You Opportunities (2026)",
    description: "Data-driven guide to email signature optimization. Learn the 10 critical mistakes professionals make and how to fix them. Increase engagement, build trust, and avoid costly errors with proven best practices.",
    metaDescription: "Discover 10 email signature mistakes costing you opportunities. Data-driven best practices for 2026. Increase engagement, build trust, and optimize your signature for maximum impact.",
    author: "Sarah Chen",
    authorRole: "Email Marketing Strategist",
    publishedAt: "2026-01-30",
    readTime: 10,
    category: "Best Practices",
    tags: ["Best Practices", "Optimization", "2026", "Data-Driven"],
    featured: true,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop&auto=format&q=80",
    keywords: [
      "email signature best practices",
      "email signature mistakes",
      "email signature optimization",
      "professional email signature tips",
      "email signature engagement",
      "email signature conversion"
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(
    (post) =>
      post.featured &&
      post.slug !== "coming-soon-2" &&
      post.slug !== "coming-soon-3" &&
      post.slug !== "coming-soon-4"
  );
}

export function getAllPosts(): BlogPost[] {
  return blogPosts.filter(
    (post) =>
      post.slug !== "coming-soon-2" &&
      post.slug !== "coming-soon-3" &&
      post.slug !== "coming-soon-4"
  );
}

