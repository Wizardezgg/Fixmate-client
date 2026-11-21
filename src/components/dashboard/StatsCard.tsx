import React from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  accent?: "primary" | "secondary" | "neutral";
}

export function StatsCard({
  label,
  value,
  subtext,
  icon,
  accent = "primary",
}: StatsCardProps) {
  const barColor =
    accent === "secondary"
      ? "bg-secondary-container"
      : accent === "neutral"
        ? "bg-outline"
        : "bg-primary";

  return (
    <div className="relative overflow-hidden bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 shadow-sm">
      <div className={`absolute top-0 left-0 h-1 w-full ${barColor}`} />
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          {label}
        </span>
        <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
        {value}
      </div>
      {subtext && (
        <p className="text-xs text-on-surface-variant mt-1.5">{subtext}</p>
      )}
    </div>
  );
}
