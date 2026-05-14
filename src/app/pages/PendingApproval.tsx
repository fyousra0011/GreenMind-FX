import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Leaf,
  CheckCircle,
  Clock,
  Bell,
  ArrowRight,
  Receipt,
  Cpu,
  Droplets,
  Thermometer,
  Sun,
  Wind,
  FlaskConical,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const timeline = [
  { label: "Request Submitted", done: true, icon: CheckCircle },
  { label: "Team Review (< 24 hrs)", done: true, icon: Clock },
  { label: "Bill & Device List Sent", done: true, icon: Receipt },
  { label: "Your Approval", done: false, icon: CheckCircle },
  { label: "Installation Scheduled", done: false, icon: Cpu },
];

const whatHappens = [
  "Our agronomists analyze your space dimensions and location type",
  "We select the exact IoT devices needed for your setup",
  "A detailed cost breakdown is prepared for your review",
  "Installation timeline and support plan included",
];

export function PendingApproval() {
  const navigate = useNavigate();
  const { flowState } = useApp();
  const [showNotifHint, setShowNotifHint] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowNotifHint(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const hasBilling = flowState === "billing_received";

  return (
    <div
      className="min-h-screen w-full flex items-start justify-center py-12 px-6"
      style={{ background: "#0D1117" }}
    >
      {/* BG */}
      <div
        className="fixed inset-0 opacity-3 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,136,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 20%, rgba(0,255,136,0.06) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00FF88, #10B981)", boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}
          >
            <Leaf className="w-5 h-5 text-black" />
          </div>
          <span style={{ color: "#00FF88", fontWeight: 700, fontSize: "1.2rem" }}>GreenMind</span>
        </div>

        {/* Main card */}
        <div
          className="rounded-3xl p-8 mb-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          {/* Success icon */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{
                background: "rgba(0,255,136,0.1)",
                border: "2px solid rgba(0,255,136,0.3)",
                boxShadow: "0 0 40px rgba(0,255,136,0.15)",
              }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: "#00FF88" }} />
            </motion.div>
            <h1 className="text-3xl mb-2" style={{ color: "white", fontWeight: 700 }}>
              Request Submitted!
            </h1>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Your GreenMind installation request has been received. Our team is
              reviewing your space details and preparing a customized system proposal.
            </p>
          </div>

          {/* Billing notification hint */}
          {showNotifHint && hasBilling && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
              style={{
                background: "rgba(0,255,136,0.08)",
                border: "1px solid rgba(0,255,136,0.3)",
                boxShadow: "0 0 20px rgba(0,255,136,0.1)",
              }}
              onClick={() => navigate("/billing")}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(0,255,136,0.15)" }}
                >
                  <Receipt className="w-5 h-5" style={{ color: "#00FF88" }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm" style={{ color: "#00FF88", fontWeight: 600 }}>
                      🎉 Your Bill is Ready!
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full animate-pulse"
                      style={{ background: "rgba(0,255,136,0.2)", color: "#00FF88" }}
                    >
                      NEW
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Our team has prepared your installation bill with a full device list and cost breakdown.
                  </p>
                  <button
                    className="mt-2 flex items-center gap-1 text-xs"
                    style={{ color: "#00FF88", fontWeight: 600 }}
                  >
                    View Bill Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Timeline */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-4 uppercase tracking-wider">Progress</p>
            <div className="space-y-3">
              {timeline.map((item, i) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: item.done
                        ? "rgba(0,255,136,0.15)"
                        : "rgba(255,255,255,0.05)",
                      border: `1px solid ${item.done ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <item.icon
                      className="w-3.5 h-3.5"
                      style={{ color: item.done ? "#00FF88" : "#4B5563" }}
                    />
                  </div>
                  <div
                    className="h-px flex-1"
                    style={{
                      background: i < timeline.length - 1
                        ? item.done ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.05)"
                        : "transparent",
                      display: "none",
                    }}
                  />
                  <span
                    className="text-sm flex-1"
                    style={{ color: item.done ? "#E5E7EB" : "#4B5563" }}
                  >
                    {item.label}
                  </span>
                  {item.done && (
                    <span className="text-xs" style={{ color: "#00FF88" }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What happens now */}
          <div
            className="p-4 rounded-2xl mb-6"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">
              What our team is doing
            </p>
            <div className="space-y-2.5">
              {whatHappens.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: "#00FF88", boxShadow: "0 0 4px #00FF88" }}
                  />
                  <p className="text-sm text-gray-400">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Devices preview */}
          <div
            className="p-4 rounded-2xl"
            style={{
              background: "rgba(0,255,136,0.03)",
              border: "1px solid rgba(0,255,136,0.08)",
            }}
          >
            <p className="text-xs text-gray-400 mb-3">Likely devices for your setup</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { icon: Cpu, label: "ESP32" },
                { icon: Thermometer, label: "Temp" },
                { icon: Droplets, label: "Moisture" },
                { icon: FlaskConical, label: "pH" },
                { icon: Sun, label: "LED Lights" },
                { icon: Wind, label: "Fans" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.15)" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#10B981" }} />
                  </div>
                  <span className="text-xs text-center text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bell hint */}
        {showNotifHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl flex items-center gap-2 text-sm"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#9CA3AF",
            }}
          >
            <Bell className="w-4 h-4" style={{ color: "#F59E0B" }} />
            <span>You'll receive billing notifications in your dashboard — check the 🔔 bell icon!</span>
          </motion.div>
        )}

        {/* Go to dashboard */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard")}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base"
          style={{
            background: "linear-gradient(135deg, #00FF88, #10B981)",
            color: "#000",
            fontWeight: 700,
            boxShadow: "0 0 30px rgba(0,255,136,0.3)",
          }}
        >
          Go to Dashboard <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
