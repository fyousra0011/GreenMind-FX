import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Thermometer,
  Droplets,
  Activity,
  FlaskConical,
  Zap,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wind,
  Sun,
  TrendingUp,
  TrendingDown,
  Rocket,
  Leaf,
  Lock,
  Receipt,
  ChevronRight,
  Heart,
  AlertCircle,
  Cpu,
} from "lucide-react";
import { GlassCard, MetricCard, PulseIndicator, NeonBadge } from "../components/ui/GlassCard";
import {
  currentMetrics,
  hourlyData,
  dailyData,
  weeklyData,
  devices,
  alerts,
  plants,
  generateTimeSeriesData,
  type TimeRange,
} from "../data/mockData";
import { useApp, tc } from "../context/AppContext";

function rndDelta(val: number, delta: number, min: number, max: number) {
  const next = val + (Math.random() - 0.5) * delta;
  return Math.max(min, Math.min(max, parseFloat(next.toFixed(1))));
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-xs"
        style={{
          background: "rgba(13,17,23,0.95)",
          border: "1px solid rgba(0,255,136,0.2)",
          color: "#E5E7EB",
        }}
      >
        <p className="text-gray-500 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ── Pre-install preview ── */
function PreInstallDashboard() {
  const navigate = useNavigate();
  const { theme, user } = useApp();
  const isDark = theme === "dark";
  const colors = tc(isDark);

  const previewSections = [
    { icon: Thermometer, label: "Temperature", value: "24.3°C", color: "#00FF88" },
    { icon: Droplets, label: "Humidity", value: "72.1%", color: "#10B981" },
    { icon: Activity, label: "Soil Moisture", value: "63.4%", color: "#00FF88" },
    { icon: FlaskConical, label: "Water pH", value: "6.4 pH", color: "#10B981" },
  ];

  const previewPlants = [
    { name: "Butterhead Lettuce", health: "Excellent", stage: "Vegetative", color: "#00FF88" },
    { name: "Roma Tomato", health: "Good", stage: "Flowering", color: "#10B981" },
    { name: "Basil", health: "Excellent", stage: "Vegetative", color: "#00FF88" },
    { name: "Spinach", health: "Fair", stage: "Seedling", color: "#F59E0B" },
  ];

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(0,255,136,0.07), rgba(16,185,129,0.1))"
            : "linear-gradient(135deg, rgba(0,200,100,0.08), rgba(16,185,129,0.1))",
          border: `1px solid ${colors.borderAccent}`,
          boxShadow: isDark ? "0 0 40px rgba(0,255,136,0.06)" : "none",
        }}
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(0,255,136,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm mb-2" style={{ color: colors.accent }}>
              👋 Welcome, {user?.name ?? "Grower"}!
            </p>
            <h2 className="text-2xl mb-2" style={{ color: colors.text, fontWeight: 700 }}>
              Your GreenMind system is not yet installed
            </h2>
            <p className="text-sm mb-5" style={{ color: colors.textMuted, maxWidth: 480 }}>
              This is a preview of what your dashboard will look like after installation.
              Complete the setup to start monitoring your real farm data.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/get-started")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm"
              style={{
                background: "linear-gradient(135deg, #00FF88, #10B981)",
                color: "#000",
                fontWeight: 700,
                boxShadow: "0 0 20px rgba(0,255,136,0.3)",
              }}
            >
              <Rocket className="w-4 h-4" />
              Get Started — Setup Your Farm
            </motion.button>
          </div>
          <div
            className="hidden lg:flex w-20 h-20 rounded-2xl items-center justify-center shrink-0"
            style={{
              background: isDark ? "rgba(0,255,136,0.1)" : "rgba(0,180,100,0.1)",
              border: `1px solid ${colors.borderAccent}`,
            }}
          >
            <Leaf className="w-10 h-10" style={{ color: colors.accent }} />
          </div>
        </div>
      </motion.div>

      {/* Preview label */}
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4" style={{ color: colors.textDim }} />
        <span className="text-xs uppercase tracking-wider" style={{ color: colors.textDim }}>
          Preview — data shown is simulated until your system is installed
        </span>
      </div>

      {/* Blurred metric preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
        <div className="absolute inset-0 rounded-xl z-10 flex items-center justify-center"
          style={{ backdropFilter: "blur(4px)", background: "rgba(0,0,0,0.1)" }}>
          <div className="text-center px-6">
            <Lock className="w-6 h-6 mx-auto mb-2" style={{ color: colors.textDim }} />
            <p className="text-xs" style={{ color: colors.textMuted }}>Install your system to unlock live data</p>
          </div>
        </div>
        {previewSections.map((m) => (
          <GlassCard key={m.label} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl" style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)" }}>
                <m.icon className="w-5 h-5" style={{ color: m.color }} />
              </div>
            </div>
            <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: colors.textDim }}>{m.label}</p>
            <p className="text-3xl" style={{ color: m.color, fontWeight: 700, fontFamily: "'Courier New', monospace" }}>
              {m.value}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Preview Plants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-4 h-4" style={{ color: colors.accent }} />
            <h3 className="text-sm" style={{ color: colors.text, fontWeight: 600 }}>
              Your Plants (Preview)
            </h3>
            <NeonBadge color="green">Sample Data</NeonBadge>
          </div>
          <div className="space-y-2">
            {previewPlants.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: p.color, boxShadow: `0 0 4px ${p.color}` }} />
                  <span className="text-sm" style={{ color: colors.textSub }}>{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: colors.textDim }}>{p.stage}</span>
                  <NeonBadge color={p.health === "Excellent" ? "green" : p.health === "Good" ? "teal" : "yellow"}>
                    {p.health}
                  </NeonBadge>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm mb-4" style={{ color: colors.text, fontWeight: 600 }}>
            What You'll Get After Setup
          </h3>
          <div className="space-y-3">
            {[
              { icon: Activity, text: "Real-time sensor data from your farm" },
              { icon: Cpu, text: "Control pumps, lights & fans remotely" },
              { icon: TrendingUp, text: "AI crop health predictions & insights" },
              { icon: AlertTriangle, text: "Instant alerts for critical conditions" },
              { icon: Zap, text: "Energy & water usage analytics" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: isDark ? "rgba(0,255,136,0.08)" : "rgba(0,180,100,0.08)", border: `1px solid ${colors.borderAccent}` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                </div>
                <span className="text-sm" style={{ color: colors.textMuted }}>{text}</span>
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/get-started")}
            className="w-full mt-5 py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
            style={{
              background: "linear-gradient(135deg, #00FF88, #10B981)",
              color: "#000",
              fontWeight: 700,
            }}
          >
            <Rocket className="w-4 h-4" /> Get Started Now
          </motion.button>
        </GlassCard>
      </div>
    </div>
  );
}

/* ── Billing Received Dashboard ── */
function BillingReceivedBanner() {
  const navigate = useNavigate();
  const { theme } = useApp();
  const isDark = theme === "dark";
  const colors = tc(isDark);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-6 mt-6 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity"
      style={{
        background: isDark ? "rgba(0,255,136,0.07)" : "rgba(0,180,100,0.07)",
        border: `1px solid rgba(0,255,136,0.3)`,
        boxShadow: "0 0 20px rgba(0,255,136,0.08)",
      }}
      onClick={() => navigate("/billing")}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(0,255,136,0.15)" }}
      >
        <Receipt className="w-5 h-5" style={{ color: "#00FF88" }} />
      </div>
      <div className="flex-1">
        <p className="text-sm" style={{ color: colors.text, fontWeight: 600 }}>
          🎉 Your Installation Bill is Ready!
        </p>
        <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
          Review devices, costs and installation timeline — then agree to proceed.
        </p>
      </div>
      <button
        className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs"
        style={{
          background: "linear-gradient(135deg, #00FF88, #10B981)",
          color: "#000",
          fontWeight: 700,
        }}
      >
        View Bill <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

/* ── Full Installed Dashboard ── */
function InstalledDashboard() {
  const { theme, user } = useApp();
  const isDark = theme === "dark";
  const colors = tc(isDark);

  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [metrics, setMetrics] = useState(currentMetrics);
  const [liveData, setLiveData] = useState(dailyData);
  const [tick, setTick] = useState(0);

  const getChartData = useCallback(() => {
    if (timeRange === "1h") return hourlyData;
    if (timeRange === "7d") return weeklyData;
    return liveData;
  }, [timeRange, liveData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        temperature: rndDelta(prev.temperature, 0.4, 18, 35),
        humidity: rndDelta(prev.humidity, 0.8, 40, 95),
        soilMoisture: rndDelta(prev.soilMoisture, 0.6, 30, 90),
        ph: rndDelta(prev.ph, 0.05, 5.5, 8.0),
        energy: rndDelta(prev.energy, 0.1, 1, 6),
        water: rndDelta(prev.water, 2, 20, 200),
      }));
      setLiveData((prev) => {
        const newPoint = generateTimeSeriesData(1, "minutes")[0];
        return [...prev.slice(1), newPoint];
      });
      setTick((t) => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metricStatus = (val: number, low: number, high: number): "good" | "warning" | "critical" => {
    if (val < low * 0.85 || val > high * 1.15) return "critical";
    if (val < low || val > high) return "warning";
    return "good";
  };

  const onlineDevices = devices.filter((d) => d.status === "online").length;
  const offlineDevices = devices.filter((d) => d.status === "offline").length;
  const warningDevices = devices.filter((d) => d.status === "warning").length;
  const activeAlerts = alerts.filter((a) => !a.resolved);

  // Plant health summary
  const criticalPlants = plants.filter((p) => p.health === "poor" || p.health === "fair");
  const healthyPlants = plants.filter((p) => p.health === "excellent" || p.health === "good");

  const healthColor = (health: string) => {
    if (health === "excellent") return "#00FF88";
    if (health === "good") return "#10B981";
    if (health === "fair") return "#F59E0B";
    return "#EF4444";
  };

  const chartLineColor = isDark ? "#6B7280" : "#94A3B8";
  const gridColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl" style={{ color: colors.text, fontWeight: 700 }}>
            Farm Control Center
          </h1>
          <p className="text-sm mt-0.5" style={{ color: colors.textMuted }}>
            {user?.city ? `${user.city}` : "Your Home Farm"} ·{" "}
            <span style={{ color: colors.accent }}>All systems operational</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PulseIndicator active={true} size={8} />
          <span className="text-xs" style={{ color: colors.textMuted }}>
            Updated {tick > 0 ? "just now" : "loading..."}
          </span>
        </div>
      </div>

      {/* Plant Health Alert Banner (if critical) */}
      {criticalPlants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl"
          style={{
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <AlertCircle className="w-5 h-5 shrink-0" style={{ color: "#F59E0B" }} />
          <p className="text-sm" style={{ color: "#F59E0B" }}>
            <strong>{criticalPlants.length} plant(s)</strong> need attention —{" "}
            {criticalPlants.map((p) => p.name).join(", ")}
          </p>
        </motion.div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Thermometer className="w-5 h-5" />, label: "Temperature", value: metrics.temperature, unit: "°C", trend: "0.2°C", trendUp: false, status: metricStatus(metrics.temperature, 20, 28), color: "#00FF88" },
          { icon: <Droplets className="w-5 h-5" />, label: "Humidity", value: metrics.humidity, unit: "%", trend: "1.3%", trendUp: true, status: metricStatus(metrics.humidity, 60, 80), color: "#10B981" },
          { icon: <Activity className="w-5 h-5" />, label: "Soil Moisture", value: metrics.soilMoisture, unit: "%", trend: "0.5%", trendUp: true, status: metricStatus(metrics.soilMoisture, 50, 80), color: "#00FF88" },
          { icon: <FlaskConical className="w-5 h-5" />, label: "Water pH", value: metrics.ph, unit: "pH", trend: "0.1", trendUp: false, status: metricStatus(metrics.ph, 6.0, 7.0), color: "#10B981" },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <MetricCard {...m} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm" style={{ color: colors.text, fontWeight: 600 }}>Live Sensor Trends</h3>
              <p className="text-xs" style={{ color: colors.textDim }}>Temperature & Humidity</p>
            </div>
            <div className="flex gap-1">
              {(["1h", "24h", "7d"] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className="px-2.5 py-1 rounded-lg text-xs transition-all"
                  style={{
                    background: timeRange === r ? (isDark ? "rgba(0,255,136,0.15)" : "rgba(0,180,100,0.12)") : colors.surface,
                    border: `1px solid ${timeRange === r ? colors.borderAccent : colors.border}`,
                    color: timeRange === r ? colors.accent : colors.textDim,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={getChartData()} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="time" tick={{ fill: chartLineColor, fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: chartLineColor, fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#00FF88" strokeWidth={2} fill="url(#tempGrad)" dot={false} />
              <Area type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#10B981" strokeWidth={2} fill="url(#humGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-end">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-px inline-block" style={{ background: "#00FF88" }} />
              <span className="text-xs" style={{ color: colors.textDim }}>Temperature</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-px inline-block" style={{ background: "#10B981" }} />
              <span className="text-xs" style={{ color: colors.textDim }}>Humidity</span>
            </div>
          </div>
        </GlassCard>

        <div className="flex flex-col gap-4">
          <GlassCard className="p-4 flex-1">
            <p className="text-xs mb-2" style={{ color: colors.textDim }}>Soil Moisture (%)</p>
            <div className="text-2xl mb-2" style={{ color: "#00FF88", fontWeight: 700, fontFamily: "'Courier New', monospace" }}>
              {metrics.soilMoisture}%
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={getChartData().slice(-12)}>
                <Line type="monotone" dataKey="soilMoisture" stroke="#00FF88" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
          <GlassCard className="p-4 flex-1">
            <p className="text-xs mb-2" style={{ color: colors.textDim }}>Water pH</p>
            <div className="text-2xl mb-2" style={{ color: "#10B981", fontWeight: 700, fontFamily: "'Courier New', monospace" }}>
              {metrics.ph} pH
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={getChartData().slice(-12)}>
                <Line type="monotone" dataKey="ph" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </div>

      {/* Plant Health + System Status + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Plant Health */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm" style={{ color: colors.text, fontWeight: 600 }}>
              Plant Health
            </h3>
            <div className="flex items-center gap-2">
              <NeonBadge color="green">{healthyPlants.length} healthy</NeonBadge>
              {criticalPlants.length > 0 && (
                <NeonBadge color="yellow">{criticalPlants.length} attention</NeonBadge>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {plants.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-2.5 rounded-xl"
                style={{
                  background: p.health === "poor" || p.health === "fair"
                    ? "rgba(245,158,11,0.05)"
                    : colors.surface,
                  border: `1px solid ${p.health === "poor" || p.health === "fair"
                    ? "rgba(245,158,11,0.2)"
                    : colors.border}`,
                }}
              >
                <Heart
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: healthColor(p.health), fill: healthColor(p.health) }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate" style={{ color: colors.textSub }}>
                    {p.name}
                  </p>
                  <p className="text-xs" style={{ color: colors.textDim }}>
                    {p.stage} · Row {p.row}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: healthColor(p.health), fontWeight: 500 }}>
                    {p.health}
                  </p>
                  <div
                    className="h-1 w-14 rounded-full mt-1"
                    style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${p.stageProgress}%`,
                        background: `linear-gradient(90deg, ${healthColor(p.health)}, ${healthColor(p.health)}88)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* System Status */}
        <GlassCard className="p-5">
          <h3 className="text-sm mb-4" style={{ color: colors.text, fontWeight: 600 }}>
            System Status
          </h3>
          <div className="space-y-3">
            {[
              { icon: Wifi, label: "Online Devices", value: onlineDevices, color: "#00FF88", badgeColor: "green" as const },
              { icon: AlertTriangle, label: "Warnings", value: warningDevices, color: "#F59E0B", badgeColor: "yellow" as const },
              { icon: WifiOff, label: "Offline", value: offlineDevices, color: "#EF4444", badgeColor: "red" as const },
              { icon: AlertTriangle, label: "Active Alerts", value: activeAlerts.length, color: "#EF4444", badgeColor: "red" as const },
              { icon: CheckCircle, label: "System Uptime", value: "99.7%", color: "#00FF88", badgeColor: "green" as const },
            ].map(({ icon: Icon, label, value, color, badgeColor }) => (
              <div
                key={label}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: isDark
                    ? `rgba(${badgeColor === "green" ? "0,255,136" : badgeColor === "yellow" ? "245,158,11" : "239,68,68"},0.05)`
                    : `rgba(${badgeColor === "green" ? "0,180,100" : badgeColor === "yellow" ? "180,120,0" : "200,50,50"},0.04)`,
                  border: `1px solid rgba(${badgeColor === "green" ? "0,255,136" : badgeColor === "yellow" ? "245,158,11" : "239,68,68"},0.12)`,
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color }} />
                  <span className="text-xs" style={{ color: colors.textSub }}>{label}</span>
                </div>
                <NeonBadge color={badgeColor}>{value}</NeonBadge>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Alerts */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm" style={{ color: colors.text, fontWeight: 600 }}>
              Recent Alerts
            </h3>
            <NeonBadge color="red" size="sm">{activeAlerts.length} active</NeonBadge>
          </div>
          <div className="space-y-2">
            {activeAlerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-2 p-2.5 rounded-xl"
                style={{
                  background: alert.type === "critical" ? "rgba(239,68,68,0.06)" : alert.type === "warning" ? "rgba(245,158,11,0.06)" : "rgba(107,114,128,0.06)",
                  border: `1px solid ${alert.type === "critical" ? "rgba(239,68,68,0.15)" : alert.type === "warning" ? "rgba(245,158,11,0.15)" : "rgba(107,114,128,0.1)"}`,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{
                    background: alert.type === "critical" ? "#EF4444" : alert.type === "warning" ? "#F59E0B" : "#6B7280",
                    boxShadow: alert.type === "critical" ? "0 0 4px #EF4444" : alert.type === "warning" ? "0 0 4px #F59E0B" : "none",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-snug line-clamp-2" style={{ color: colors.textSub }}>
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-2.5 h-2.5" style={{ color: colors.textDim }} />
                    <span className="text-xs" style={{ color: colors.textDim }}>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Resource Usage */}
      <GlassCard className="p-5">
        <h3 className="text-sm mb-4" style={{ color: colors.text, fontWeight: 600 }}>
          Resource Usage
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Zap, label: "Energy", value: metrics.energy, max: 6, unit: "kWh", color: "#00FF88" },
            { icon: Droplets, label: "Water", value: metrics.water, max: 200, unit: "L", color: "#10B981" },
            { icon: Wind, label: "CO₂", value: metrics.co2, max: 1600, unit: "ppm", color: "#6B7280" },
            { icon: Sun, label: "Light", value: metrics.light, max: 1000, unit: "μmol", color: "#F59E0B" },
          ].map((r) => (
            <div key={r.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <r.icon className="w-3.5 h-3.5" style={{ color: r.color }} />
                  <span className="text-xs" style={{ color: colors.textMuted }}>{r.label}</span>
                </div>
                <span className="text-xs" style={{ color: r.color }}>{r.value} {r.unit}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min((Number(r.value) / r.max) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${r.color}, ${r.color}aa)`,
                    boxShadow: r.color !== "#6B7280" ? `0 0 6px ${r.color}50` : "none",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/* ── Main Dashboard Component ── */
export function Dashboard() {
  const { flowState } = useApp();

  if (flowState === "pre_install" || flowState === "pending_approval") {
    return (
      <>
        {flowState === "pending_approval" && (
          <div />
        )}
        <PreInstallDashboard />
      </>
    );
  }

  if (flowState === "billing_received") {
    return (
      <>
        <BillingReceivedBanner />
        <PreInstallDashboard />
      </>
    );
  }

  return <InstalledDashboard />;
}
