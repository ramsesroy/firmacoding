import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: "Signature For Me - Professional Email Signature Generator",
  description: "Create and manage professional email signatures in minutes. Intuitive tool with multiple templates and HTML export.",
  keywords: ["email signature", "signature generator", "professional signature", "Gmail signature", "Outlook signature"],
  openGraph: {
    title: "Signature For Me - Professional Email Signature Generator",
    description: "Create and manage professional email signatures in minutes.",
    type: "website",
    siteName: "Signature For Me",
  },
  twitter: {
    card: "summary_large_image",
    title: "Signature For Me - Professional Email Signature Generator",
    description: "Create and manage professional email signatures in minutes.",
  },
};

export const loginMetadata: Metadata = {
  title: "Sign In - Signature For Me",
  description: "Sign in to your Signature For Me account to create and manage your professional email signatures.",
};

export const forgotPasswordMetadata: Metadata = {
  title: "Forgot Password - Signature For Me",
  description: "Reset your password for Signature For Me. Enter your email to receive a password reset link.",
};

export const resetPasswordMetadata: Metadata = {
  title: "Reset Password - Signature For Me",
  description: "Reset your password for Signature For Me account.",
};

export const dashboardMetadata: Metadata = {
  title: "Dashboard - Signature For Me",
  description: "Create and customize your professional email signature with our intuitive editor.",
};

export const signaturesMetadata: Metadata = {
  title: "My Signatures - Signature For Me",
  description: "View and manage all your saved email signatures.",
};

export const settingsMetadata: Metadata = {
  title: "Settings - Signature For Me",
  description: "Manage your Signature For Me account settings and preferences.",
};

