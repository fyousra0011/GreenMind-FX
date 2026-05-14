import { useState } from "react";
import {
  Bell,
  Search,
  Sun,
  Moon,
  Phone,
  Rocket,
  ChevronRight,
  Receipt,
  X,
} from "lucide-react";
import { PulseIndicator } from "../ui/GlassCard";
import { useNavigate } from "react-router";
import { useApp, tc } from "../../context/AppContext";

export function Navbar() {
  const navigate = useNavigate();
  const { theme, setTheme, flowState, user } = useApp();
  const isDark = theme === "dark";
  const colors = tc(isDark);

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const hasBilling = flowState === "billing_received";
  const isPreInstall = flowState === "pre_install";
  const isInstalled = flowState === "installed";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GM";

  const notifCount = hasBilling ? 1 : isInstalled ? 3 : 0;

  return (
    <header
      className="flex items-center gap-3 px-6 h-16 shrink-0 relative z-20"
      style={{
        background: colors.navBg,
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1 max-w-xs"
        style={{
          background: colors.inputBg,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Search className="w-4 h-4" style={{ color: colors.textDim }} />
        <input
          type="text"
          placeholder="Search devices, plants…"
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: colors.textMuted }}
        />
        <kbd
          className="text-xs px-1 rounded"
          style={{ background: colors.surface, color: colors.textDim }}
        >
          ⌘K
        </kbd>
      </div>

      <div className="flex-1" />

      {/* Live indicator */}
      {isInstalled && (
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: isDark ? "rgba(0,255,136,0.06)" : "rgba(0,180,100,0.08)",
            border: `1px solid ${colors.borderAccent}`,
          }}
        >
          <PulseIndicator active={true} size={6} />
          <span className="text-xs" style={{ color: colors.accent }}>
            LIVE
          </span>
        </div>
      )}

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          color: colors.textMuted,
        }}
        title="Toggle theme"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
      </button>

      {/* Get Started button */}
      {(isPreInstall || flowState === "pending_approval" || flowState === "billing_received") && (
        <button
          onClick={() => navigate("/get-started")}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs transition-all"
          style={{
            background: "linear-gradient(135deg, #00FF88, #10B981)",
            color: "#000",
            fontWeight: 700,
            boxShadow: "0 0 16px rgba(0,255,136,0.3)",
          }}
        >
          <Rocket className="w-3.5 h-3.5" />
          Get Started
        </button>
      )}

      {/* Contact Us */}
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          color: colors.textMuted,
        }}
      >
        <Phone className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Contact</span>
      </button>

      {/* Notifications Bell */}
      <div className="relative">
        <button
          onClick={() => setShowNotifDropdown((v) => !v)}
          className="relative p-2 rounded-lg"
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            color: colors.textMuted,
          }}
        >
          <Bell className="w-5 h-5" />
          {notifCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs"
              style={{
                background: "#EF4444",
                color: "white",
                boxShadow: "0 0 8px rgba(239,68,68,0.6)",
              }}
            >
              {notifCount}
            </span>
          )}
        </button>

        {showNotifDropdown && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowNotifDropdown(false)}
            />
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-40"
              style={{
                background: isDark ? "rgba(13,17,23,0.98)" : "rgba(255,255,255,0.98)",
                border: `1px solid ${colors.border}`,
                backdropFilter: "blur(20px)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: `1px solid ${colors.border}` }}
              >
                <span className="text-sm" style={{ color: colors.text, fontWeight: 600 }}>
                  Notifications
                </span>
                <button onClick={() => setShowNotifDropdown(false)}>
                  <X className="w-4 h-4" style={{ color: colors.textDim }} />
                </button>
              </div>

              <div className="p-2">
                {hasBilling && (
                  <div
                    className="flex items-start gap-3 p-3 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      background: isDark
                        ? "rgba(0,255,136,0.06)"
                        : "rgba(0,180,100,0.06)",
                      border: `1px solid ${colors.borderAccent}`,
                    }}
                    onClick={() => {
                      setShowNotifDropdown(false);
                      navigate("/billing");
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(0,255,136,0.15)" }}
                    >
                      <Receipt className="w-5 h-5" style={{ color: colors.accent }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs" style={{ color: colors.text, fontWeight: 600 }}>
                        Installation Bill Ready 🎉
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                        Your GreenMind installation package has been prepared. Review costs & devices.
                      </p>
                      <button
                        className="mt-2 flex items-center gap-1 text-xs"
                        style={{ color: colors.accent, fontWeight: 600 }}
                      >
                        View Details <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {isInstalled && (
                  <>
                    {[
                      { text: "Soil moisture in Row 2 below threshold", time: "5m ago", color: "#F59E0B" },
                      { text: "pH Sensor Tank B offline", time: "12m ago", color: "#EF4444" },
                      { text: "Water tank at 28% — refill recommended", time: "2h ago", color: "#F59E0B" },
                    ].map((n, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl mt-1"
                        style={{
                          background: colors.surface,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ background: n.color, boxShadow: `0 0 4px ${n.color}` }}
                        />
                        <div className="flex-1">
                          <p className="text-xs" style={{ color: colors.textSub }}>
                            {n.text}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: colors.textDim }}>
                            {n.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {!hasBilling && !isInstalled && (
                  <p className="text-center text-xs py-6" style={{ color: colors.textDim }}>
                    No notifications yet
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Avatar */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #00FF88, #10B981)",
          color: "#000",
          fontWeight: 700,
          boxShadow: "0 0 12px rgba(0,255,136,0.3)",
        }}
      >
        {initials}
      </div>
    </header>
  );
}
