import { useState } from "react";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  TrendingUp,
  BarChart3,
  Brain,
  Zap,
  Droplets,
  Leaf,
  Download,
  Calendar,
  Star,
} from "lucide-react";
import { GlassCard, NeonBadge } from "../components/ui/GlassCard";
import { yieldData, efficiencyData, weeklyData, dailyData } from "../data/mockData";

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
          <p key={i} style={{ color: p.color || "#00FF88" }}>
            {p.name}: {p.value !== null ? p.value : "—"} {p.name?.includes("Yield") ? "kg" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const energyWaterData = dailyData.slice(-7).map((d, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7],
  energy: d.energy,
  water: d.water / 40,
}));

const growthRateData = weeklyData.map((d, i) => ({
  week: d.time,
  growth: 5 + i * 1.2 + Math.random() * 2,
  baseline: 4.5,
}));

const RADIAL_COLORS = ["#00FF88", "#10B981", "#3B82F6", "#F59E0B"];

const aiSuggestions = [
  {
    priority: "High",
    category: "Water",
    title: "Reduce water frequency in Rows 1–3",
    desc: "Soil moisture consistently at 70%+. Cutting irrigation by 15% could save ~120L/week.",
    impact: "Save 120L/week",
    color: "#3B82F6",
  },
  {
    priority: "High",
    category: "Energy",
    title: "Optimize LED schedule for off-peak hours",
    desc: "Shifting grow light peak hours to 11PM–5AM could reduce energy cost by 22%.",
    impact: "−22% cost",
    color: "#F59E0B",
  },
  {
    priority: "Medium",
    category: "Growth",
    title: "Increase CO₂ in Rows 2 & 4 during peak hours",
    desc: "Raising CO₂ to 1400ppm between 8AM–2PM can increase tomato yield by 18%.",
    impact: "+18% yield",
    color: "#00FF88",
  },
  {
    priority: "Low",
    category: "Nutrients",
    title: "Add iron chelate supplement to lettuce rows",
    desc: "Slight chlorosis detected. Iron supplement can prevent further yellowing.",
    impact: "Better health",
    color: "#10B981",
  },
];

export function Analytics() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");

  const totalYield = yieldData.filter((d) => d.yield !== null).reduce((sum, d) => sum + (d.yield || 0), 0);
  const avgEfficiency = Math.round(efficiencyData.reduce((sum, d) => sum + d.value, 0) / efficiencyData.length);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl" style={{ color: "white", fontWeight: 700 }}>
            Analytics & Reports
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Historical trends, yield predictions, and efficiency metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className="px-3 py-1 rounded-md text-xs transition-all"
                style={{
                  background: dateRange === r ? "rgba(0,255,136,0.15)" : "transparent",
                  color: dateRange === r ? "#00FF88" : "#6B7280",
                  border: `1px solid ${dateRange === r ? "rgba(0,255,136,0.25)" : "transparent"}`,
                }}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#9CA3AF",
            }}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Yield",
            value: `${totalYield}kg`,
            change: "+12.4%",
            up: true,
            icon: Leaf,
            color: "#00FF88",
          },
          {
            label: "Avg Efficiency",
            value: `${avgEfficiency}%`,
            change: "+3.1%",
            up: true,
            icon: BarChart3,
            color: "#10B981",
          },
          {
            label: "Water Saved",
            value: "840L",
            change: "vs last period",
            up: true,
            icon: Droplets,
            color: "#3B82F6",
          },
          {
            label: "Energy Cost",
            value: "−18%",
            change: "optimized",
            up: false,
            icon: Zap,
            color: "#F59E0B",
          },
        ].map(({ label, value, change, up, icon: Icon, color }) => (
          <GlassCard key={label} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-5 h-5" style={{ color }} />
              <span
                className="text-xs"
                style={{ color: up ? "#00FF88" : "#EF4444" }}
              >
                {up ? "↑" : "↓"} {change}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p
              className="text-2xl"
              style={{
                color,
                fontWeight: 700,
                fontFamily: "'Courier New', monospace",
                textShadow: `0 0 20px ${color}40`,
              }}
            >
              {value}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Yield Prediction */}
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm" style={{ color: "white", fontWeight: 600 }}>
                Yield Trend & Prediction
              </h3>
              <p className="text-xs text-gray-500">Monthly harvest output (kg)</p>
            </div>
            <NeonBadge color="green">AI Forecast</NeonBadge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={yieldData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predictGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="yield"
                name="Actual Yield"
                stroke="#00FF88"
                strokeWidth={2.5}
                fill="url(#yieldGrad)"
                dot={{ fill: "#00FF88", strokeWidth: 0, r: 4 }}
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                name="Predicted Yield"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="6 3"
                fill="url(#predictGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-end">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5" style={{ background: "#00FF88" }} />
              <span className="text-xs text-gray-500">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5" style={{ background: "#10B981", borderTop: "1px dashed #10B981" }} />
              <span className="text-xs text-gray-500">Predicted</span>
            </div>
          </div>
        </GlassCard>

        {/* Efficiency Radial */}
        <GlassCard className="p-5">
          <h3 className="text-sm mb-4" style={{ color: "white", fontWeight: 600 }}>
            Efficiency Metrics
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="100%"
              data={efficiencyData.map((d, i) => ({ ...d, fill: RADIAL_COLORS[i] }))}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar dataKey="value" cornerRadius={4} background={{ fill: "rgba(255,255,255,0.04)" }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {efficiencyData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: RADIAL_COLORS[i] }} />
                <span className="text-xs text-gray-400 flex-1">{d.name}</span>
                <span className="text-xs" style={{ color: RADIAL_COLORS[i] }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Second row charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Energy vs Water */}
        <GlassCard className="p-5">
          <h3 className="text-sm mb-1" style={{ color: "white", fontWeight: 600 }}>
            Energy & Water Consumption
          </h3>
          <p className="text-xs text-gray-500 mb-4">Daily usage this week</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={energyWaterData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="energy" name="Energy (kWh)" fill="#00FF88" radius={[3, 3, 0, 0]} opacity={0.8} />
              <Bar dataKey="water" name="Water (×40L)" fill="#3B82F6" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Growth Rate */}
        <GlassCard className="p-5">
          <h3 className="text-sm mb-1" style={{ color: "white", fontWeight: 600 }}>
            Growth Rate
          </h3>
          <p className="text-xs text-gray-500 mb-4">Weekly growth vs baseline (%/week)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={growthRateData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: "#6B7280", fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 14]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="growth"
                name="Growth Rate"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#growthGrad)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="baseline"
                name="Baseline"
                stroke="#4B5563"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* AI Optimization Suggestions */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(0,255,136,0.1)",
              border: "1px solid rgba(0,255,136,0.2)",
            }}
          >
            <Brain className="w-5 h-5" style={{ color: "#00FF88" }} />
          </div>
          <div>
            <h3 className="text-sm" style={{ color: "white", fontWeight: 600 }}>
              AI Optimization Suggestions
            </h3>
            <p className="text-xs text-gray-500">Based on 30-day analysis of your farm data</p>
          </div>
          <NeonBadge color="green" size="sm">4 new</NeonBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiSuggestions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className="p-4 rounded-xl"
                style={{
                  background: `${s.color}08`,
                  border: `1px solid ${s.color}18`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5" style={{ color: s.color }} />
                    <span className="text-xs" style={{ color: s.color, fontWeight: 600 }}>
                      {s.priority} Priority
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "#9CA3AF",
                      }}
                    >
                      {s.category}
                    </span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${s.color}15`, color: s.color }}
                  >
                    {s.impact}
                  </span>
                </div>
                <p className="text-sm text-gray-200 mb-1" style={{ fontWeight: 500 }}>
                  {s.title}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                <button
                  className="mt-3 text-xs px-3 py-1.5 rounded-lg"
                  style={{
                    background: `${s.color}15`,
                    border: `1px solid ${s.color}25`,
                    color: s.color,
                  }}
                >
                  Apply Suggestion →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}