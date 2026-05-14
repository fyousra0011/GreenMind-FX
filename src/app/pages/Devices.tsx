import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Sun,
  Droplets,
  Wind,
  Wifi,
  WifiOff,
  AlertTriangle,
  Plus,
  Trash2,
  Play,
  Pause,
  ChevronDown,
  ChevronRight,
  Battery,
  CheckCircle,
  FlaskConical,
  Thermometer,
  Activity,
  Zap,
} from "lucide-react";
import { GlassCard, NeonBadge, PulseIndicator } from "../components/ui/GlassCard";
import { devices, automationRules, type AutomationRule } from "../data/mockData";

interface DeviceControl {
  ledIntensity: number;
  ledSpectrum: number;
  pumpMode: "auto" | "manual";
  pumpActive: boolean;
  fan1Speed: number;
  fan2Speed: number;
}

interface NewRule {
  condition: string;
  action: string;
}

export function Devices() {
  const [controls, setControls] = useState<DeviceControl>({
    ledIntensity: 75,
    ledSpectrum: 60,
    pumpMode: "auto",
    pumpActive: false,
    fan1Speed: 60,
    fan2Speed: 60,
  });
  const [rules, setRules] = useState<AutomationRule[]>(automationRules);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState<NewRule>({ condition: "", action: "" });
  const [expandedDevice, setExpandedDevice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"controls" | "devices" | "automation">("controls");

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const addRule = () => {
    if (newRule.condition && newRule.action) {
      setRules((prev) => [
        ...prev,
        {
          id: `r${Date.now()}`,
          condition: newRule.condition,
          action: newRule.action,
          enabled: true,
          triggered: 0,
        },
      ]);
      setNewRule({ condition: "", action: "" });
      setShowAddRule(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    if (type === "controller") return <Cpu className="w-4 h-4" />;
    if (type === "actuator") return <Zap className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "online") return "#00FF88";
    if (status === "warning") return "#F59E0B";
    return "#EF4444";
  };

  const getStatusIcon = (status: string) => {
    if (status === "online") return <Wifi className="w-3.5 h-3.5" style={{ color: "#00FF88" }} />;
    if (status === "warning") return <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />;
    return <WifiOff className="w-3.5 h-3.5" style={{ color: "#EF4444" }} />;
  };

  const RangeSlider = ({
    value,
    onChange,
    min = 0,
    max = 100,
    color = "#00FF88",
    label,
    unit = "%",
  }: {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    color?: string;
    label: string;
    unit?: string;
  }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs" style={{ color, fontFamily: "'Courier New', monospace" }}>
          {value}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`,
            outline: "none",
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl" style={{ color: "white", fontWeight: 700 }}>
            Device Control Panel
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage IoT devices, hardware controls, and automation rules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NeonBadge color="green">
            {devices.filter((d) => d.status === "online").length} Online
          </NeonBadge>
          <NeonBadge color="red">
            {devices.filter((d) => d.status !== "online").length} Issues
          </NeonBadge>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
        {(["controls", "devices", "automation"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 px-4 rounded-lg text-sm capitalize transition-all"
            style={{
              background: activeTab === tab ? "rgba(0,255,136,0.12)" : "transparent",
              border: `1px solid ${activeTab === tab ? "rgba(0,255,136,0.25)" : "transparent"}`,
              color: activeTab === tab ? "#00FF88" : "#6B7280",
              fontWeight: activeTab === tab ? 600 : 400,
            }}
          >
            {tab === "controls" ? "Hardware Controls" : tab === "devices" ? "Device Manager" : "Automation Rules"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "controls" && (
          <motion.div
            key="controls"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            {/* LED Lights */}
            <GlassCard className="p-5" glow>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}
                >
                  <Sun className="w-5 h-5" style={{ color: "#F59E0B" }} />
                </div>
                <div>
                  <h3 className="text-sm" style={{ color: "white", fontWeight: 600 }}>LED Grow Lights</h3>
                  <p className="text-xs text-gray-500">Array Row 1 & 2</p>
                </div>
                <div className="ml-auto">
                  <NeonBadge color="green">ON</NeonBadge>
                </div>
              </div>

              <div className="space-y-4">
                <RangeSlider
                  label="Intensity"
                  value={controls.ledIntensity}
                  onChange={(v) => setControls((c) => ({ ...c, ledIntensity: v }))}
                  color="#F59E0B"
                />
                <RangeSlider
                  label="Blue Spectrum (Veg)"
                  value={controls.ledSpectrum}
                  onChange={(v) => setControls((c) => ({ ...c, ledSpectrum: v }))}
                  color="#3B82F6"
                />
                <RangeSlider
                  label="Red Spectrum (Bloom)"
                  value={100 - controls.ledSpectrum}
                  onChange={(v) => setControls((c) => ({ ...c, ledSpectrum: 100 - v }))}
                  color="#EF4444"
                />
              </div>

              {/* Spectrum preview */}
              <div className="mt-4 h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${controls.ledSpectrum}%, #EF4444 ${controls.ledSpectrum}%, #EF4444 100%)`,
                    boxShadow: "0 0 10px rgba(251,191,36,0.3)",
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Current: {controls.ledSpectrum}% Blue / {100 - controls.ledSpectrum}% Red
              </p>

              {/* Schedule presets */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["Seedling", "Vegetative", "Bloom"].map((mode) => (
                  <button
                    key={mode}
                    className="py-1.5 rounded-lg text-xs"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#9CA3AF",
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Water Pump */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}
                >
                  <Droplets className="w-5 h-5" style={{ color: "#3B82F6" }} />
                </div>
                <div>
                  <h3 className="text-sm" style={{ color: "white", fontWeight: 600 }}>Hydroponic Pump</h3>
                  <p className="text-xs text-gray-500">Water Circuit Alpha</p>
                </div>
              </div>

              {/* Mode toggle */}
              <div className="flex gap-2 mb-4">
                {(["auto", "manual"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setControls((c) => ({ ...c, pumpMode: mode }))}
                    className="flex-1 py-2 rounded-lg text-sm capitalize"
                    style={{
                      background: controls.pumpMode === mode ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${controls.pumpMode === mode ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.06)"}`,
                      color: controls.pumpMode === mode ? "#3B82F6" : "#6B7280",
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {controls.pumpMode === "manual" && (
                <div className="text-center mb-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setControls((c) => ({ ...c, pumpActive: !c.pumpActive }))}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                    style={{
                      background: controls.pumpActive
                        ? "rgba(59,130,246,0.2)"
                        : "rgba(255,255,255,0.05)",
                      border: `2px solid ${controls.pumpActive ? "#3B82F6" : "rgba(255,255,255,0.1)"}`,
                      boxShadow: controls.pumpActive ? "0 0 30px rgba(59,130,246,0.3)" : "none",
                      color: controls.pumpActive ? "#3B82F6" : "#6B7280",
                    }}
                  >
                    {controls.pumpActive ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8" />
                    )}
                  </motion.button>
                  <p className="text-xs text-gray-500 mt-2">
                    {controls.pumpActive ? "Pumping..." : "Idle"}
                  </p>
                </div>
              )}

              {controls.pumpMode === "auto" && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)" }}>
                    <p className="text-xs text-gray-400 mb-1">Auto-trigger condition</p>
                    <p className="text-xs" style={{ color: "#3B82F6" }}>Soil Moisture &lt; 45% → Pump ON (2 min)</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.08)" }}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">Status</p>
                      <NeonBadge color="green">AUTO ACTIVE</NeonBadge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Last cycle: 14 min ago</p>
                  </div>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-2 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-xs text-gray-500">Flow Rate</p>
                  <p className="text-sm" style={{ color: "#3B82F6" }}>2.4 L/min</p>
                </div>
                <div className="p-2 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-xs text-gray-500">Tank Level</p>
                  <p className="text-sm" style={{ color: "#F59E0B" }}>28%</p>
                </div>
              </div>
            </GlassCard>

            {/* Cooling Fans */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}
                >
                  <Wind className="w-5 h-5" style={{ color: "#10B981" }} />
                </div>
                <div>
                  <h3 className="text-sm" style={{ color: "white", fontWeight: 600 }}>Cooling Fans</h3>
                  <p className="text-xs text-gray-500">2 Active Units</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(16,185,129,0.1)" }}
                    >
                      <span className="text-xs" style={{ color: "#10B981" }}>1</span>
                    </div>
                    <span className="text-xs text-gray-300">Cooling Fan #1</span>
                    <NeonBadge color="green" size="sm">RUNNING</NeonBadge>
                  </div>
                  <RangeSlider
                    label="Speed"
                    value={controls.fan1Speed}
                    onChange={(v) => setControls((c) => ({ ...c, fan1Speed: v }))}
                    color="#10B981"
                    unit=" RPM%"
                  />
                  {/* Fan animation */}
                  <div className="flex items-center gap-2 mt-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2 - (controls.fan1Speed / 100), ease: "linear" }}
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: "#10B981", borderTopColor: "transparent" }}
                    />
                    <span className="text-xs text-gray-500">{Math.round(controls.fan1Speed * 25)} RPM</span>
                  </div>
                </div>

                <div
                  className="w-full h-px"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(16,185,129,0.1)" }}
                    >
                      <span className="text-xs" style={{ color: "#10B981" }}>2</span>
                    </div>
                    <span className="text-xs text-gray-300">Cooling Fan #2</span>
                    <NeonBadge color="green" size="sm">RUNNING</NeonBadge>
                  </div>
                  <RangeSlider
                    label="Speed"
                    value={controls.fan2Speed}
                    onChange={(v) => setControls((c) => ({ ...c, fan2Speed: v }))}
                    color="#10B981"
                    unit=" RPM%"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2 - (controls.fan2Speed / 100), ease: "linear" }}
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: "#10B981", borderTopColor: "transparent" }}
                    />
                    <span className="text-xs text-gray-500">{Math.round(controls.fan2Speed * 25)} RPM</span>
                  </div>
                </div>
              </div>

              <button
                className="mt-4 w-full py-2 rounded-lg text-xs"
                style={{
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.15)",
                  color: "#10B981",
                }}
                onClick={() => setControls((c) => ({ ...c, fan1Speed: c.fan2Speed }))}
              >
                Sync Both Fans
              </button>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "devices" && (
          <motion.div
            key="devices"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {devices.map((device) => (
                <GlassCard
                  key={device.id}
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedDevice(expandedDevice === device.id ? null : device.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: `rgba(${device.status === "online" ? "0,255,136" : device.status === "warning" ? "245,158,11" : "239,68,68"},0.1)`,
                        border: `1px solid rgba(${device.status === "online" ? "0,255,136" : device.status === "warning" ? "245,158,11" : "239,68,68"},0.2)`,
                      }}
                    >
                      <span style={{ color: getStatusColor(device.status) }}>
                        {getDeviceIcon(device.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: "white", fontWeight: 500 }}>
                        {device.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {getStatusIcon(device.status)}
                        <span className="text-xs capitalize" style={{ color: getStatusColor(device.status) }}>
                          {device.status}
                        </span>
                        <span className="text-gray-700">·</span>
                        <span className="text-xs text-gray-500">{device.lastSeen}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs" style={{ color: "#00FF88", fontFamily: "'Courier New', monospace" }}>
                        {device.value}
                      </p>
                      {device.battery !== undefined && (
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <Battery className="w-3 h-3 text-gray-500" />
                          <span
                            className="text-xs"
                            style={{ color: device.battery < 30 ? "#EF4444" : "#6B7280" }}
                          >
                            {device.battery}%
                          </span>
                        </div>
                      )}
                    </div>
                    <ChevronRight
                      className="w-4 h-4 text-gray-600 shrink-0 transition-transform"
                      style={{ transform: expandedDevice === device.id ? "rotate(90deg)" : "none" }}
                    />
                  </div>
                  <AnimatePresence>
                    {expandedDevice === device.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mt-3 pt-3 space-y-1.5"
                          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                        >
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Device ID</span>
                            <span className="text-gray-300 font-mono">{device.id.toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Type</span>
                            <span className="text-gray-300 capitalize">{device.type}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Protocol</span>
                            <span className="text-gray-300">MQTT v3.1</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Firmware</span>
                            <span className="text-gray-300">v2.4.1</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              ))}

              {/* Add device card */}
              <GlassCard className="p-4 border-dashed flex items-center justify-center min-h-24 cursor-pointer group"
                style={{
                  border: "2px dashed rgba(0,255,136,0.15)",
                  background: "rgba(0,255,136,0.02)",
                }}
              >
                <div className="text-center">
                  <Plus className="w-6 h-6 mx-auto mb-1" style={{ color: "#00FF88" }} />
                  <p className="text-xs" style={{ color: "#00FF88" }}>Pair New Device</p>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {activeTab === "automation" && (
          <motion.div
            key="automation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {rules.filter((r) => r.enabled).length} of {rules.length} rules active
              </p>
              <button
                onClick={() => setShowAddRule((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                style={{
                  background: "rgba(0,255,136,0.1)",
                  border: "1px solid rgba(0,255,136,0.25)",
                  color: "#00FF88",
                }}
              >
                <Plus className="w-4 h-4" /> Add Rule
              </button>
            </div>

            {/* Add rule form */}
            <AnimatePresence>
              {showAddRule && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <GlassCard className="p-4" glow>
                    <h3 className="text-sm mb-3" style={{ color: "#00FF88", fontWeight: 600 }}>
                      New Automation Rule
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">IF condition</label>
                        <input
                          type="text"
                          placeholder="e.g. Temperature > 28°C"
                          value={newRule.condition}
                          onChange={(e) => setNewRule((r) => ({ ...r, condition: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(0,255,136,0.15)",
                            color: "white",
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">THEN action</label>
                        <input
                          type="text"
                          placeholder="e.g. Turn ON Fan at 80%"
                          value={newRule.action}
                          onChange={(e) => setNewRule((r) => ({ ...r, action: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(0,255,136,0.15)",
                            color: "white",
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={addRule}
                        className="px-4 py-2 rounded-lg text-sm"
                        style={{
                          background: "linear-gradient(135deg, #00FF88, #10B981)",
                          color: "#000",
                          fontWeight: 600,
                        }}
                      >
                        Add Rule
                      </button>
                      <button
                        onClick={() => setShowAddRule(false)}
                        className="px-4 py-2 rounded-lg text-sm text-gray-400"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rules list */}
            {rules.map((rule, idx) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Toggle */}
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className="relative w-10 h-5 rounded-full transition-all shrink-0"
                      style={{
                        background: rule.enabled ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.08)",
                        border: `1px solid ${rule.enabled ? "rgba(0,255,136,0.5)" : "rgba(255,255,255,0.1)"}`,
                        boxShadow: rule.enabled ? "0 0 8px rgba(0,255,136,0.3)" : "none",
                      }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                        style={{
                          left: rule.enabled ? "calc(100% - 18px)" : "2px",
                          background: rule.enabled ? "#00FF88" : "#6B7280",
                          boxShadow: rule.enabled ? "0 0 6px rgba(0,255,136,0.6)" : "none",
                        }}
                      />
                    </button>

                    {/* Rule content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded text-xs"
                          style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}
                        >
                          IF
                        </span>
                        <span className="text-sm text-gray-300">{rule.condition}</span>
                        <span
                          className="px-2 py-0.5 rounded text-xs"
                          style={{ background: "rgba(0,255,136,0.15)", color: "#00FF88" }}
                        >
                          THEN
                        </span>
                        <span className="text-sm text-gray-300">{rule.action}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-600">
                          Triggered {rule.triggered}× today
                        </span>
                        {!rule.enabled && (
                          <span className="text-xs text-gray-600">Disabled</span>
                        )}
                      </div>
                    </div>

                    {rule.enabled && (
                      <NeonBadge color="green" size="sm">Active</NeonBadge>
                    )}
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-1.5 rounded-lg"
                      style={{ color: "#6B7280" }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
