"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on dashboard home
  if (pathname === "/dashboard") {
    return null;
  }

  const pathSegments = pathname.split("/").filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  ];

  // Map paths to friendly labels
  const pathLabels: Record<string, string> = {
    signatures: "My Signatures",
    subscription: "Subscription",
    settings: "Settings",
  };

  // Build breadcrumb path
  let currentPath = "";
  for (let i = 1; i < pathSegments.length; i++) {
    currentPath += `/${pathSegments[i]}`;
    const segment = pathSegments[i];
    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({
      label,
      href: currentPath,
    });
  }

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {index > 0 && (
                <span className="material-symbols-outlined text-gray-400 text-base" aria-hidden="true">
                  chevron_right
                </span>
              )}
              {isLast ? (
                <span className="flex items-center gap-1.5 text-gray-900 font-medium">
                  {crumb.icon && (
                    <span className="material-symbols-outlined text-base">{crumb.icon}</span>
                  )}
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {index === 0 && crumb.icon && (
                    <span className="material-symbols-outlined text-base">{crumb.icon}</span>
                  )}
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

