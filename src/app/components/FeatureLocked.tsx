import { Lock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

interface FeatureLockedProps {
  featureName: string;
  description?: string;
}

export function FeatureLocked({ featureName, description }: FeatureLockedProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        {/* Lock Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex justify-center mb-6"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,150,255,0.1))",
              border: "2px solid",
              borderImage: "linear-gradient(135deg, #00FF88, #0096FF) 1",
            }}
          >
            <Lock className="w-10 h-10" style={{ color: "#00FF88" }} />
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">{featureName} Locked</h1>

        {/* Description */}
        <p className="text-gray-400 mb-4">
          {description ||
            "Complete your system setup and payment to unlock this feature and gain full access to your growing system."}
        </p>

        {/* Status Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-4 rounded-xl overflow-hidden"
          style={{
            background: "rgba(0,255,136,0.05)",
            border: "1px solid rgba(0,255,136,0.15)",
          }}
        >
          <p className="text-sm text-gray-300 mb-2 font-medium">What you need to do:</p>
          <ul className="text-left space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold mt-0.5">1.</span>
              <span>Complete your system setup in Get Started</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold mt-0.5">2.</span>
              <span>Review the billing details and confirm payment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 font-bold mt-0.5">3.</span>
              <span>Unlock full system access and monitoring</span>
            </li>
          </ul>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/get-started")}
          className="w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #00FF88, #00D97E)",
            color: "#0F172A",
          }}
        >
          Complete Setup <ChevronRight className="w-4 h-4" />
        </motion.button>

        {/* Secondary Button */}
        <button
          onClick={() => navigate("/billing")}
          className="w-full mt-3 px-6 py-3 rounded-lg font-semibold text-gray-300 transition-colors"
          style={{
            border: "1px solid rgba(0,255,136,0.3)",
            background: "transparent",
          }}
        >
          View Billing Status
        </button>
      </motion.div>
    </div>
  );
}
