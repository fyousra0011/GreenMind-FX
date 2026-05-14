import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Bell,
  Filter,
  X,
  Clock,
  Cpu,
  Check,
  Trash2,
  BellOff,
} from "lucide-react";
import { GlassCard, NeonBadge } from "../components/ui/GlassCard";
import { alerts, type Alert } from "../data/mockData";

type FilterType = "all" | "critical" | "warning" | "normal" | "resolved";

const typeConfig = {
  critical: {
    icon: AlertTriangle,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.18)",
    glow: "rgba(239,68,68,0.15)",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.18)",
    glow: "rgba(245,158,11,0.1)",
    label: "Warning",
  },
  normal: {
    icon: Info,
    color: "#6B7280",
    bg: "rgba(107,114,128,0.08)",
    border: "rgba(107,114,128,0.15)",
    glow: "transparent",
    label: "Info",
  },
};

export function Alerts() {
  const [alertList, setAlertList] = useState<Alert[]>(alerts);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selected, setSelected] = useState<string[]>([]);

  const resolveAlert = (id: string) => {
    setAlertList((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  };

  const dismissAlert = (id: string) => {
    setAlertList((prev) => prev.filter((a) => a.id !== id));
  };

  const resolveAll = () => {
    setAlertList((prev) =>
      prev.map((a) => (filter === "all" || a.type === filter ? { ...a, resolved: true } : a))
    );
  };

  const filteredAlerts = alertList.filter((a) => {
    if (filter === "all") return true;
    if (filter === "resolved") return a.resolved;
    return a.type === filter && !a.resolved;
  });

  const counts = {
    critical: alertList.filter((a) => a.type === "critical" && !a.resolved).length,
    warning: alertList.filter((a) => a.type === "warning" && !a.resolved).length,
    normal: alertList.filter((a) => a.type === "normal" && !a.resolved).length,
    resolved: alertList.filter((a) => a.resolved).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl" style={{ color: "white", fontWeight: 700 }}>
            Alerts & Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {counts.critical + counts.warning} active alerts · {counts.resolved} resolved today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resolveAll}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{
              background: "rgba(0,255,136,0.08)",
              border: "1px solid rgba(0,255,136,0.2)",
              color: "#00FF88",
            }}
          >
            <CheckCircle className="w-4 h-4" />
            Resolve All
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { type: "critical", count: counts.critical, label: "Critical" },
          { type: "warning", count: counts.warning, label: "Warnings" },
          { type: "normal", count: counts.normal, label: "Info" },
          { type: "resolved", count: counts.resolved, label: "Resolved" },
        ].map(({ type, count, label }) => {
          const color =
            type === "critical"
              ? "#EF4444"
              : type === "warning"
              ? "#F59E0B"
              : type === "normal"
              ? "#6B7280"
              : "#00FF88";
          return (
            <GlassCard
              key={type}
              className="p-4 cursor-pointer"
              glow={filter === type}
              onClick={() => setFilter(type as FilterType)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">{label}</span>
                {type !== "resolved" && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: color,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                )}
              </div>
              <p
                className="text-3xl"
                style={{
                  color,
                  fontWeight: 700,
                  fontFamily: "'Courier New', monospace",
                  textShadow: `0 0 20px ${color}40`,
                }}
              >
                {count}
              </p>
            </GlassCard>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
        {(["all", "critical", "warning", "normal", "resolved"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex-1 py-1.5 px-2 rounded-lg text-xs capitalize transition-all"
            style={{
              background: filter === f ? "rgba(0,255,136,0.12)" : "transparent",
              border: `1px solid ${filter === f ? "rgba(0,255,136,0.25)" : "transparent"}`,
              color: filter === f ? "#00FF88" : "#6B7280",
            }}
          >
            {f}
            {f !== "all" && (
              <span className="ml-1">
                ({f === "resolved" ? counts.resolved : counts[f as keyof typeof counts] || 0})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <BellOff className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-gray-500">No alerts in this category</p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert, idx) => {
              const cfg = typeConfig[alert.type];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <div
                    className="relative rounded-2xl p-4 overflow-hidden"
                    style={{
                      background: alert.resolved ? "rgba(255,255,255,0.02)" : cfg.bg,
                      border: `1px solid ${alert.resolved ? "rgba(255,255,255,0.05)" : cfg.border}`,
                      boxShadow: alert.resolved ? "none" : `0 0 20px ${cfg.glow}`,
                      opacity: alert.resolved ? 0.6 : 1,
                    }}
                  >
                    {/* Severity indicator */}
                    {!alert.resolved && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                        style={{
                          background: cfg.color,
                          boxShadow: `0 0 8px ${cfg.color}`,
                        }}
                      />
                    )}

                    <div className="flex items-start gap-4 pl-2">
                      {/* Icon */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: alert.resolved
                            ? "rgba(255,255,255,0.05)"
                            : `${cfg.color}20`,
                          border: `1px solid ${alert.resolved ? "rgba(255,255,255,0.06)" : `${cfg.color}30`}`,
                        }}
                      >
                        {alert.resolved ? (
                          <Check className="w-4 h-4" style={{ color: "#00FF88" }} />
                        ) : (
                          <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {!alert.resolved && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: `${cfg.color}20`,
                                border: `1px solid ${cfg.color}40`,
                                color: cfg.color,
                                fontWeight: 600,
                              }}
                            >
                              {cfg.label}
                            </span>
                          )}
                          {alert.resolved && (
                            <NeonBadge color="green" size="sm">Resolved</NeonBadge>
                          )}
                          <div className="flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-gray-600" />
                            <span className="text-xs text-gray-500">{alert.device}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-200 mb-2 leading-relaxed">{alert.message}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{alert.timestamp}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      {!alert.resolved && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                            style={{
                              background: "rgba(0,255,136,0.1)",
                              border: "1px solid rgba(0,255,136,0.2)",
                              color: "#00FF88",
                            }}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Resolve
                          </button>
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="p-1.5 rounded-lg"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              color: "#6B7280",
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Notification Settings */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5" style={{ color: "#00FF88" }} />
          <h3 className="text-sm" style={{ color: "white", fontWeight: 600 }}>
            Notification Settings
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Email Alerts", enabled: true },
            { label: "Push Notifications", enabled: true },
            { label: "SMS (Critical)", enabled: false },
            { label: "Slack Webhook", enabled: true },
          ].map(({ label, enabled: defaultEnabled }, i) => {
            return (
              <div
                key={label}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-xs text-gray-400">{label}</span>
                <div
                  className="w-8 h-4 rounded-full relative cursor-pointer"
                  style={{
                    background: defaultEnabled ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)",
                    border: `1px solid ${defaultEnabled ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div
                    className="absolute top-0.5 w-3 h-3 rounded-full"
                    style={{
                      left: defaultEnabled ? "calc(100% - 14px)" : "2px",
                      background: defaultEnabled ? "#00FF88" : "#6B7280",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
