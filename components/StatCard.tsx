import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  accent?: "blue" | "emerald" | "slate";
};

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  slate: "bg-slate-100 text-slate-600",
};

export default function StatCard({
  title,
  value,
  hint,
  icon,
  accent = "blue",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          {hint ? (
            <p className="mt-2 text-xs text-slate-400">{hint}</p>
          ) : null}
        </div>
        {icon ? (
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-lg ${accentClasses[accent]}`}
          >
            {icon}
          </span>
        ) : null}
      </div>
    </div>
  );
}