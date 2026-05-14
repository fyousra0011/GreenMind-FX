import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Leaf, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

const perks = [
  "Free IoT system consultation",
  "Real-time crop monitoring",
  "AI-powered plant insights",
  "Expert support team",
];

export function SignUp() {
  const navigate = useNavigate();
  const { signup } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    signup(name.trim(), email.trim());
    navigate("/dashboard");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    outline: "none",
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center py-12 px-6"
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
          background: "radial-gradient(ellipse at 50% 30%, rgba(0,255,136,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left — Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden md:flex flex-col justify-center py-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00FF88, #10B981)", boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}
            >
              <Leaf className="w-5 h-5 text-black" />
            </div>
            <span style={{ color: "#00FF88", fontWeight: 700, fontSize: "1.2rem" }}>GreenMind</span>
          </div>

          <h2 className="mb-4" style={{ fontSize: "2rem", fontWeight: 700, color: "white", lineHeight: 1.2 }}>
            Start growing fresh food
            <br />
            <span style={{ background: "linear-gradient(135deg, #00FF88, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              in your own home.
            </span>
          </h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Join thousands of home growers who use GreenMind to automate their vertical farms and harvest fresh produce every week.
          </p>

          <div className="space-y-3">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#00FF88" }} />
                <span className="text-sm text-gray-400">{perk}</span>
              </div>
            ))}
          </div>

          <div
            className="mt-8 p-4 rounded-2xl"
            style={{
              background: "rgba(0,255,136,0.05)",
              border: "1px solid rgba(0,255,136,0.12)",
            }}
          >
            <p className="text-xs text-gray-400 leading-relaxed">
              "GreenMind paid for itself in 5 months. I now grow all my vegetables at home!"
            </p>
            <p className="text-xs mt-2" style={{ color: "#00FF88" }}>— Priya S., Mumbai</p>
          </div>
        </motion.div>

        {/* Right — Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="rounded-3xl p-8"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            <div className="mb-7">
              <h1 className="text-2xl" style={{ color: "white", fontWeight: 700 }}>
                Create Account
              </h1>
              <p className="text-sm text-gray-500 mt-1">Free forever · No credit card required</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                    placeholder="Alex Kumar"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    style={{ ...inputStyle, borderColor: errors.name ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)" }}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    style={{ ...inputStyle, borderColor: errors.email ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)" }}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
                style={{
                  background: loading
                    ? "rgba(0,255,136,0.5)"
                    : "linear-gradient(135deg, #00FF88, #10B981)",
                  color: "#000",
                  fontWeight: 700,
                  boxShadow: "0 0 20px rgba(0,255,136,0.3)",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center text-xs text-gray-600 mt-4">
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                style={{ color: "#00FF88", fontWeight: 600 }}
              >
                Sign In
              </button>
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full text-center text-sm text-gray-600 hover:text-gray-400 transition-colors"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
