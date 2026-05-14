import React from "react";
import { useApp, tc } from "../../context/AppContext";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function GlassCard({
  children,
  className = "",
  glow = false,
  onClick,
  style,
}: GlassCardProps) {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const colors = tc(isDark);

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        background: colors.surface,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${glow ? colors.borderAccent : colors.border}`,
        boxShadow: glow
          ? `${colors.shadowGlow}, ${colors.shadow}`
          : colors.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface NeonBadgeProps {
  children: React.ReactNode;
  color?: "green" | "teal" | "yellow" | "red" | "blue";
  size?: "sm" | "md";
}

const badgeColors = {
  green: { bg: "rgba(0,255,136,0.15)", border: "rgba(0,255,136,0.3)", text: "#00FF88" },
  teal: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", text: "#10B981" },
  yellow: { bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.3)", text: "#FBB924" },
  red: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", text: "#EF4444" },
  blue: { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", text: "#3B82F6" },
};

export function NeonBadge({ children, color = "green", size = "sm" }: NeonBadgeProps) {
  const c = badgeColors[color] || badgeColors.green;
  return (
    <span
      className={`inline-flex items-center rounded-full ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"}`}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

export function PulseIndicator({ active = true, size = 8 }: { active?: boolean; size?: number }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      {active && (
        <span
          className="absolute inline-flex rounded-full animate-ping"
          style={{ inset: 0, background: "#00FF88", opacity: 0.5 }}
        />
      )}
      <span
        className="relative inline-flex rounded-full"
        style={{
          width: size,
          height: size,
          background: active ? "#00FF88" : "#6B7280",
          boxShadow: active ? "0 0 6px #00FF88" : "none",
        }}
      />
    </span>
  );
}

export function MetricCard({
  icon,
  label,
  value,
  unit,
  trend,
  trendUp,
  status,
  color = "#00FF88",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendUp?: boolean;
  status?: "good" | "warning" | "critical";
  color?: string;
}) {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const colors = tc(isDark);
  const statusColor =
    status === "critical" ? "#EF4444" : status === "warning" ? "#F59E0B" : color;

  return (
    <GlassCard className="p-5 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-2.5 rounded-xl"
          style={{
            background: `rgba(${color === "#00FF88" ? "0,255,136" : "16,185,129"},0.1)`,
            border: `1px solid rgba(${color === "#00FF88" ? "0,255,136" : "16,185,129"},0.2)`,
          }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        {trend && (
          <span
            className="text-xs flex items-center gap-1"
            style={{ color: trendUp ? "#00FF88" : "#EF4444" }}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
      <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: colors.textDim }}>
        {label}
      </p>
      <div className="flex items-end gap-1">
        <span
          className="text-3xl"
          style={{
            color: statusColor,
            fontWeight: 700,
            fontFamily: "'Courier New', monospace",
            textShadow: `0 0 20px ${statusColor}40`,
          }}
        >
          {value}
        </span>
        {unit && <span className="text-sm mb-1" style={{ color: colors.textMuted }}>{unit}</span>}
      </div>
    </GlassCard>
  );
}
