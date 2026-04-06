import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "blue" | "emerald" | "amber" | "red" | "slate";
}

const COLOR_MAP = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", value: "text-blue-700" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", value: "text-emerald-700" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", value: "text-amber-700" },
  red: { bg: "bg-red-50", icon: "text-red-600", value: "text-red-700" },
  slate: { bg: "bg-slate-100", icon: "text-slate-600", value: "text-slate-700" },
};

export function StatCard({ title, value, description, icon: Icon, trend, color = "slate" }: StatCardProps) {
  const colors = COLOR_MAP[color];
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 flex items-start gap-4">
      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", colors.bg)}>
        <Icon className={cn("h-5 w-5", colors.icon)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className={cn("text-2xl font-bold mt-0.5", colors.value)}>{value}</p>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        {trend && (
          <p className={cn("text-xs font-medium mt-1", trend.value >= 0 ? "text-emerald-600" : "text-red-600")}>
            {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
