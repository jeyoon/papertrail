"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="px-8 pt-8 pb-6">
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="font-display text-4xl leading-none tracking-wide uppercase"
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="mt-4 border-t-2" style={{ borderColor: "var(--foreground)" }} />
    </div>
  );
}
