import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Receipt,
  Cpu,
  Thermometer,
  Droplets,
  FlaskConical,
  Sun,
  Wind,
  Wifi,
  CheckCircle,
  Clock,
  MapPin,
  Wrench,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  Leaf,
} from "lucide-react";
import { useApp, tc } from "../context/AppContext";
import { GlassCard } from "../components/ui/GlassCard";

interface LineItem {
  icon: React.ElementType;
  name: string;
  desc: string;
  qty: number;
  unit: string;
  price: number;
}

const deviceItems: LineItem[] = [
  { icon: Cpu, name: "ESP32 WiFi Controller", desc: "Main IoT controller + MQTT bridge", qty: 2, unit: "unit", price: 80 },
  { icon: Thermometer, name: "DHT22 Temp & Humidity Sensor", desc: "±0.5°C precision, waterproof housing", qty: 3, unit: "unit", price: 30 },
  { icon: Droplets, name: "Capacitive Soil Moisture Sensor", desc: "Corrosion-resistant probe, 3.3/5V", qty: 4, unit: "unit", price: 20 },
  { icon: FlaskConical, name: "Analog pH Sensor Module", desc: "E-201C probe + BNC connector + amplifier", qty: 2, unit: "unit", price: 55 },
  { icon: Sun, name: "Full-Spectrum LED Grow Panel", desc: "100W, 3000K–300K, dimmable driver", qty: 3, unit: "unit", price: 200 },
  { icon: Droplets, name: "Submersible Water Pump", desc: "350L/h, silent, timer-controlled", qty: 2, unit: "unit", price: 43 },
  { icon: Wind, name: "DC Brushless Cooling Fan", desc: "12V, PWM speed control, low noise", qty: 4, unit: "unit", price: 34 },
  { icon: Wifi, name: "Local WiFi Relay Module", desc: "4-channel remote relay board", qty: 1, unit: "unit", price: 50 },
];

const serviceItems: LineItem[] = [
  { icon: Wrench, name: "Device Installation & Wiring", desc: "Professional setup by our team", qty: 1, unit: "visit", price: 160 },
  { icon: Cpu, name: "GreenMind Dashboard Setup", desc: "Account config, device pairing & testing", qty: 1, unit: "service", price: 68 },
  { icon: ShieldCheck, name: "1-Year System Warranty", desc: "Free repair/replacement for all devices", qty: 1, unit: "year", price: 90 },
  { icon: Clock, name: "3-Month AI Monitoring Subscription", desc: "Crop insights, alerts & optimizations", qty: 1, unit: "bundle", price: 80 },
];

function formatMYR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function BillingDetails() {
  const navigate = useNavigate();
  const { agreeAndPay, user, theme } = useApp();
  const isDark = theme === "dark";
  const colors = tc(isDark);

  const deviceTotal = deviceItems.reduce((s, i) => s + i.qty * i.price, 0);
  const serviceTotal = serviceItems.reduce((s, i) => s + i.qty * i.price, 0);
  const subtotal = deviceTotal + serviceTotal;
  const SST = Math.round(subtotal * 0.06);
  const total = subtotal + SST;

  const handleAgreeAndPay = () => {
    agreeAndPay();
    navigate("/dashboard");
  };

  const sectionHeader = (label: string) => (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-xl mb-3"
      style={{
        background: isDark ? "rgba(0,255,136,0.05)" : "rgba(0,180,100,0.06)",
        border: `1px solid ${colors.borderAccent}`,
      }}
    >
      <span className="text-xs uppercase tracking-wider" style={{ color: colors.accent }}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-full">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-5 h-5" style={{ color: colors.accent }} />
            <h1 className="text-2xl" style={{ color: colors.text, fontWeight: 700 }}>
              Installation Bill
            </h1>
          </div>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            Prepared by GreenMind · Valid for 14 days
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs"
          style={{
            background: isDark ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.3)",
            color: "#F59E0B",
          }}
        >
          <Clock className="w-3.5 h-3.5" />
          Awaiting Your Approval
        </div>
      </div>

      {/* Customer Info */}
      <GlassCard className="p-5 mb-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Customer", value: user?.name ?? "—" },
            { label: "Email", value: user?.email ?? "—" },
            { label: "Location", value: user?.city ?? "—" },
            { label: "Space Type", value: user?.locationType?.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs mb-0.5" style={{ color: colors.textDim }}>
                {label}
              </p>
              <p className="text-sm" style={{ color: colors.text, fontWeight: 500 }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Line items */}
        <div className="lg:col-span-2 space-y-5">
          {/* Devices */}
          <GlassCard className="p-5">
            {sectionHeader("IoT Devices & Hardware")}
            <div className="space-y-2">
              {deviceItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: isDark ? "rgba(0,255,136,0.08)" : "rgba(0,180,100,0.08)",
                      border: `1px solid ${colors.borderAccent}`,
                    }}
                  >
                    <item.icon className="w-4 h-4" style={{ color: colors.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: colors.text, fontWeight: 500 }}>
                      {item.name}
                    </p>
                    <p className="text-xs" style={{ color: colors.textDim }}>
                      {item.desc}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs" style={{ color: colors.textDim }}>
                      {item.qty} × {formatMYR(item.price)}
                    </p>
                    <p className="text-sm" style={{ color: colors.text, fontWeight: 600 }}>
                      {formatMYR(item.qty * item.price)}
                    </p>
                  </div>
                </div>
              ))}
              <div
                className="flex justify-between px-3 py-2"
                style={{ borderTop: `1px solid ${colors.border}` }}
              >
                <span className="text-sm" style={{ color: colors.textMuted }}>
                  Hardware subtotal
                </span>
                <span className="text-sm" style={{ color: colors.accent, fontWeight: 600 }}>
                  {formatMYR(deviceTotal)}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Services */}
          <GlassCard className="p-5">
            {sectionHeader("Installation & Services")}
            <div className="space-y-2">
              {serviceItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: isDark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.2)",
                    }}
                  >
                    <item.icon className="w-4 h-4" style={{ color: colors.accentAlt }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: colors.text, fontWeight: 500 }}>
                      {item.name}
                    </p>
                    <p className="text-xs" style={{ color: colors.textDim }}>
                      {item.desc}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm" style={{ color: colors.text, fontWeight: 600 }}>
                      {formatMYR(item.price)}
                    </p>
                  </div>
                </div>
              ))}
              <div
                className="flex justify-between px-3 py-2"
                style={{ borderTop: `1px solid ${colors.border}` }}
              >
                <span className="text-sm" style={{ color: colors.textMuted }}>
                  Services subtotal
                </span>
                <span className="text-sm" style={{ color: colors.accentAlt, fontWeight: 600 }}>
                  {formatMYR(serviceTotal)}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Summary + Actions */}
        <div className="space-y-5">
          {/* Cost summary */}
          <GlassCard className="p-5">
            <p className="text-sm mb-4" style={{ color: colors.text, fontWeight: 600 }}>
              Cost Summary
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Hardware", value: deviceTotal },
                { label: "Installation & Services", value: serviceTotal },
                { label: "Subtotal", value: subtotal },
                { label: "SST (18%)", value: SST },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span style={{ color: colors.textMuted }}>{label}</span>
                  <span style={{ color: colors.textSub }}>{formatMYR(value)}</span>
                </div>
              ))}
              <div
                className="flex justify-between pt-3"
                style={{ borderTop: `1px solid ${colors.border}` }}
              >
                <span className="text-base" style={{ color: colors.text, fontWeight: 700 }}>
                  Total
                </span>
                <span
                  className="text-xl"
                  style={{
                    color: colors.accent,
                    fontWeight: 700,
                    fontFamily: "'Courier New', monospace",
                    textShadow: isDark ? "0 0 20px rgba(0,255,136,0.4)" : "none",
                  }}
                >
                  {formatMYR(total)}
                </span>
              </div>
            </div>

            <div
              className="mt-4 p-3 rounded-xl text-xs"
              style={{
                background: isDark ? "rgba(0,255,136,0.04)" : "rgba(0,180,100,0.05)",
                border: `1px solid ${colors.borderAccent}`,
                color: colors.textDim,
              }}
            >
              💳 Payment accepted via UPI, Net Banking, or EMI (0% for 6 months)
            </div>
          </GlassCard>

          {/* Timeline */}
          <GlassCard className="p-5">
            <p className="text-sm mb-4" style={{ color: colors.text, fontWeight: 600 }}>
              Installation Timeline
            </p>
            <div className="space-y-3">
              {[
                { day: "Day 1", task: "Device procurement & pre-assembly" },
                { day: "Day 3–4", task: "On-site installation & wiring" },
                { day: "Day 5", task: "Testing, calibration & training" },
                { day: "Day 6+", task: "Live monitoring begins!" },
              ].map((t) => (
                <div key={t.day} className="flex items-start gap-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded shrink-0"
                    style={{
                      background: isDark ? "rgba(0,255,136,0.1)" : "rgba(0,180,100,0.1)",
                      color: colors.accent,
                    }}
                  >
                    {t.day}
                  </span>
                  <span className="text-xs" style={{ color: colors.textMuted }}>
                    {t.task}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Action buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAgreeAndPay}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base"
              style={{
                background: "linear-gradient(135deg, #00FF88, #10B981)",
                color: "#000",
                fontWeight: 700,
                boxShadow: "0 0 30px rgba(0,255,136,0.35)",
              }}
            >
              <CheckCircle className="w-5 h-5" />
              Agree & Pay {formatMYR(total)}
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <button
              disabled
              className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm opacity-40 cursor-not-allowed"
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                color: colors.textMuted,
              }}
              title="Coming soon"
            >
              <ChevronDown className="w-4 h-4" />
              Improvise / Request Changes
            </button>
          </div>

          <p className="text-xs text-center" style={{ color: colors.textDim }}>
            By clicking "Agree & Pay" you accept our Terms of Service and authorize the installation.
          </p>
        </div>
      </div>
    </div>
  );
}
