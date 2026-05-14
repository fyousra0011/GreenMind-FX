import { useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Cpu,
  Leaf,
  BarChart3,
  Bell,
  Settings,
  ChevronRight,
  Wifi,
  Zap,
  LogOut,
} from "lucide-react";
import { PulseIndicator } from "../ui/GlassCard";
import { useApp, tc } from "../../context/AppContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/devices", label: "Devices", icon: Cpu },
  { path: "/plants", label: "Plants & AI", icon: Leaf },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/alerts", label: "Alerts", icon: Bell, badge: 3 },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, user, logout, flowState } = useApp();
  const isDark = theme === "dark";
  const colors = tc(isDark);
  const isInstalled = flowState === "installed";

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GM";

  return (
    <aside
      className="flex flex-col h-full w-64 shrink-0 overflow-hidden relative"
      style={{
        background: colors.sidebarBg,
        borderRight: `1px solid ${colors.borderAccent}`,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-0 w-full h-48 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.08) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(0,200,100,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <div className="p-6 flex items-center gap-3 relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #00FF88, #10B981)",
            boxShadow: "0 0 20px rgba(0,255,136,0.4)",
          }}
        >
          <Leaf className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1
            className="text-lg leading-tight"
            style={{ color: colors.accent, fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            GreenMind
          </h1>
          <p className="text-xs" style={{ color: colors.textDim }}>
            IoT Farm System
          </p>
        </div>
      </div>

      {/* System Status */}
      <div
        className="mx-4 mb-4 px-3 py-2 rounded-xl flex items-center gap-2"
        style={{
          background: isDark ? "rgba(0,255,136,0.05)" : "rgba(0,200,100,0.07)",
          border: `1px solid ${colors.borderAccent}`,
        }}
      >
        <PulseIndicator active={isInstalled} size={8} />
        <span className="text-xs" style={{ color: colors.textMuted }}>
          {isInstalled ? "System Online" : "Awaiting Setup"}
        </span>
        {isInstalled && (
          <span className="ml-auto text-xs" style={{ color: colors.accent }}>
            99.7%
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon, badge }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
              style={{
                background: active
                  ? isDark
                    ? "rgba(0,255,136,0.1)"
                    : "rgba(0,180,100,0.1)"
                  : "transparent",
                border: active
                  ? `1px solid ${colors.borderAccent}`
                  : "1px solid transparent",
                color: active ? colors.accent : colors.textDim,
              }}
            >
              {active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full"
                  style={{
                    height: "60%",
                    background: colors.accent,
                    boxShadow: `0 0 8px ${colors.accent}`,
                  }}
                />
              )}
              <Icon
                className="w-5 h-5 shrink-0"
                style={{ color: active ? colors.accent : colors.textDim }}
              />
              <span
                className="text-sm flex-1 text-left"
                style={{
                  fontWeight: active ? 600 : 400,
                  color: active ? colors.accent : colors.textMuted,
                }}
              >
                {label}
              </span>
              {badge && !active && isInstalled && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(239,68,68,0.2)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    color: "#EF4444",
                  }}
                >
                  {badge}
                </span>
              )}
              {active && <ChevronRight className="w-4 h-4 opacity-50" />}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-3" style={{ height: 1, background: colors.border }} />

      {/* Bottom items */}
      <div className="px-3 pb-4 space-y-1">
        {isInstalled && (
          <>
            <div
              className="px-3 py-2 rounded-xl flex items-center gap-3"
              style={{
                background: isDark ? "rgba(0,255,136,0.04)" : "rgba(0,200,100,0.06)",
                border: `1px solid ${colors.borderAccent}`,
              }}
            >
              <Wifi className="w-4 h-4" style={{ color: colors.accent }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs" style={{ color: colors.textMuted }}>
                  Devices
                </p>
                <p className="text-xs" style={{ color: colors.accent }}>
                  12/15 Online
                </p>
              </div>
            </div>
            <div
              className="px-3 py-2 rounded-xl flex items-center gap-3"
              style={{
                background: isDark ? "rgba(16,185,129,0.04)" : "rgba(16,185,129,0.06)",
                border: `1px solid ${colors.borderAccent}`,
              }}
            >
              <Zap className="w-4 h-4" style={{ color: colors.accentAlt }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs" style={{ color: colors.textMuted }}>
                  Energy
                </p>
                <p className="text-xs" style={{ color: colors.accentAlt }}>
                  3.2 kWh
                </p>
              </div>
            </div>
          </>
        )}
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ color: colors.textDim }}
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm" style={{ color: colors.textMuted }}>
            Settings
          </span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ color: colors.textDim }}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm" style={{ color: colors.textMuted }}>
            Sign Out
          </span>
        </button>
      </div>

      {/* User */}
      <div
        className="m-4 p-3 rounded-xl flex items-center gap-3"
        style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0"
          style={{
            background: "linear-gradient(135deg, #00FF88, #10B981)",
            color: "#000",
            fontWeight: 700,
          }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs" style={{ color: colors.textSub }}>
            {user?.name ?? "User"}
          </p>
          <p className="text-xs truncate" style={{ color: colors.textDim }}>
            {user?.email ?? ""}
          </p>
        </div>
        <PulseIndicator active={isInstalled} size={6} />
      </div>
    </aside>
  );
}
