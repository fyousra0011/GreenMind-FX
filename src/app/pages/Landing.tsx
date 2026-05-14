import { useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Leaf,
  Cpu,
  Brain,
  BarChart3,
  Zap,
  Droplets,
  ArrowRight,
  Activity,
  Shield,
  CheckCircle,
  Play,
  Thermometer,
  Wind,
  FlaskConical,
  Home,
  Building2,
  TreePine,
  Wallet,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";

/* ─── Images ─── */
const farmHeroImg =
  "https://images.unsplash.com/photo-1681313409698-dbe22c68cfce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJ0aWNhbCUyMGZhcm0lMjBpbmRvb3IlMjBoeWRyb3BvbmljJTIwbmVvbnxlbnwxfHx8fDE3Nzc5ODEwODJ8MA&ixlib=rb-4.1.0&q=80&w=1080";
const esp32Img =
  "https://images.unsplash.com/photo-1682971829405-42b40b5f0895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFU1AzMiUyMEFyZHVpbm8lMjBtaWNyb2NvbnRyb2xsZXIlMjBjaXJjdWl0JTIwYm9hcmR8ZW58MXx8fHwxNzc3OTgxMDgyfDA&ixlib=rb-4.1.0&q=80&w=400";
const ledImg =
  "https://images.unsplash.com/photo-1631323272726-9b6c17a0efaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMRUQlMjBncm93JTIwbGlnaHRzJTIwaHlkcm9wb25pYyUyMHBsYW50cyUyMHB1cnBsZXxlbnwxfHx8fDE3Nzc5ODEwODN8MA&ixlib=rb-4.1.0&q=80&w=400";
const pumpImg =
  "https://images.unsplash.com/photo-1670843837803-8122fdb3d4c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHB1bXAlMjBoeWRyb3BvbmljcyUyMGlycmlnYXRpb24lMjBzeXN0ZW18ZW58MXx8fHwxNzc3OTgxMDgzfDA&ixlib=rb-4.1.0&q=80&w=400";
const rooftopImg =
  "https://images.unsplash.com/photo-1769690093863-4f2a3fd17dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwZ2FyZGVuJTIwdXJiYW4lMjBmYXJtaW5nJTIwY2l0eXxlbnwxfHx8fDE3Nzc5ODEwODN8MA&ixlib=rb-4.1.0&q=80&w=600";
const apartmentImg =
  "https://images.unsplash.com/photo-1716139368053-40ed3648fb69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBpbmRvb3IlMjBwbGFudCUyMHdhbGwlMjBnYXJkZW58ZW58MXx8fHwxNzc3OTgxMDg0fDA&ixlib=rb-4.1.0&q=80&w=600";
const tempSensorImg =
  "https://images.unsplash.com/photo-1603694681044-e71c5993d6cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wZXJhdHVyZSUyMGh1bWlkaXR5JTIwc2Vuc29yJTIwZWxlY3Ryb25pYyUyMElvVHxlbnwxfHx8fDE3Nzc5ODEwODZ8MA&ixlib=rb-4.1.0&q=80&w=400";
const soilImg =
  "https://images.unsplash.com/photo-1570111844561-39404dd40148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2lsJTIwbW9pc3R1cmUlMjBzZW5zb3IlMjBwcm9iZSUyMHBsYW50JTIwZ2FyZGVufGVufDF8fHx8MTc3Nzk4MTA4N3ww&ixlib=rb-4.1.0&q=80&w=400";
const phImg =
  "https://images.unsplash.com/photo-1748261347718-48afb646c3d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwSCUyMHdhdGVyJTIwc2Vuc29yJTIwbGlxdWlkJTIwdGVzdGluZyUyMGxhYnxlbnwxfHx8fDE3Nzc5ODEwODd8MA&ixlib=rb-4.1.0&q=80&w=400";
const fanImg =
  "https://images.unsplash.com/photo-1769006708689-afe6f69b4f76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29saW5nJTIwZmFuJTIwdmVudGlsYXRpb24lMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3Nzk4MTA4N3ww&ixlib=rb-4.1.0&q=80&w=400";
const groundImg =
  "https://images.unsplash.com/photo-1512953771805-0b6127a70676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlbWVudCUyMGluZG9vciUyMGZhcm0lMjBncm93JTIwdGVudCUyMHNldHVwfGVufDF8fHx8MTc3Nzk4MTA4OHww&ixlib=rb-4.1.0&q=80&w=600";

/* ─── Data ─── */
const stats = [
  { value: "99.7%", label: "System Uptime" },
  { value: "40%", label: "Water Saved" },
  { value: "3×", label: "Faster Growth" },
  { value: "₹500+", label: "Monthly Savings" },
];

const benefits = [
  {
    icon: Wallet,
    title: "Save on Groceries",
    desc: "Cut monthly vegetable bills by up to ₹3,000. Grow lettuce, tomatoes, herbs, and more at a fraction of market prices.",
    color: "#00FF88",
  },
  {
    icon: TrendingUp,
    title: "Year-Round Harvest",
    desc: "Controlled indoor environments mean no seasonal restrictions. Harvest fresh produce every week, 365 days a year.",
    color: "#10B981",
  },
  {
    icon: Brain,
    title: "AI-Driven Care",
    desc: "Machine learning predicts optimal water, light, and nutrient schedules. No expertise needed — we guide you every step.",
    color: "#00FF88",
  },
  {
    icon: Shield,
    title: "Zero Pesticides",
    desc: "Closed hydroponic systems prevent pests naturally. Eat clean, organic produce grown in your own home.",
    color: "#10B981",
  },
  {
    icon: Clock,
    title: "5 Minutes a Day",
    desc: "Our IoT automation handles watering, lighting and climate control. You only need to check the app and harvest.",
    color: "#00FF88",
  },
  {
    icon: Activity,
    title: "Real-Time Control",
    desc: "Monitor your farm from anywhere with live sensor data. Get instant alerts if anything needs attention.",
    color: "#10B981",
  },
];

const iotDevices = [
  {
    name: "ESP32 Controller",
    desc: "The brain of your farm — connects all sensors & actuators via WiFi/MQTT. Runs 24/7 with only 0.5W.",
    img: esp32Img,
    badge: "Core System",
  },
  {
    name: "Temp & Humidity Sensor",
    desc: "DHT22 sensor measures ambient conditions with ±0.5°C accuracy. Ensures your plants never overheat.",
    img: tempSensorImg,
    badge: "Sensor",
  },
  {
    name: "Soil Moisture Sensor",
    desc: "Capacitive probe monitors water levels in hydroponic substrate. Triggers auto-watering when needed.",
    img: soilImg,
    badge: "Sensor",
  },
  {
    name: "Water pH Sensor",
    desc: "Analog pH probe keeps nutrient solution in the ideal 5.5–7.0 range. Critical for plant health.",
    img: phImg,
    badge: "Sensor",
  },
  {
    name: "LED Grow Lights",
    desc: "Full-spectrum grow LEDs with programmable intensity and schedules. Replaces sunlight for any room.",
    img: ledImg,
    badge: "Actuator",
  },
  {
    name: "Hydroponic Pump",
    desc: "Silent submersible pump circulates nutrient solution on a timed schedule. 100% automated watering.",
    img: pumpImg,
    badge: "Actuator",
  },
  {
    name: "Cooling Fans",
    desc: "Adjustable-speed fans maintain airflow and prevent heat buildup. Automatically triggered by temp sensors.",
    img: fanImg,
    badge: "Actuator",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Sign Up & Describe Your Space",
    desc: "Tell us about your home — whether it's a rooftop, apartment, or ground floor. Share the area size and your planting goals.",
    icon: Home,
  },
  {
    step: "02",
    title: "We Design & Install Your System",
    desc: "Our team selects the right IoT devices for your space, provides a cost breakdown, and handles the full installation.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Monitor, Automate & Harvest",
    desc: "The GreenMind dashboard gives you full real-time control. AI alerts you to issues before they affect your plants.",
    icon: Leaf,
  },
];

const locations = [
  {
    type: "Rooftop",
    icon: TreePine,
    img: rooftopImg,
    desc: "Turn unused rooftop space into a productive vertical farm. Maximizes natural light with LED supplements.",
    tags: ["High sunlight", "Large area", "Wind protection included"],
  },
  {
    type: "Apartment",
    icon: Building2,
    img: apartmentImg,
    desc: "Transform a balcony, kitchen wall, or spare room into a thriving hydroponic garden.",
    tags: ["Space-efficient", "No mess", "Perfect for herbs & greens"],
  },
  {
    type: "Ground Floor / Basement",
    icon: Home,
    img: groundImg,
    desc: "Dedicated grow rooms in basements or ground floors offer the most control over climate and scale.",
    tags: ["Fully controlled", "Scalable", "Best for large yields"],
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Apartment, Mumbai",
    text: "I grow spinach, lettuce, and basil in my balcony. The GreenMind system notified me before my plants even showed stress signs. Amazing!",
    stars: 5,
  },
  {
    name: "Rahul Verma",
    location: "Rooftop, Delhi",
    text: "Installed on my 200 sq ft rooftop. The ROI was under 4 months. I no longer buy vegetables from the market.",
    stars: 5,
  },
  {
    name: "Anita Nair",
    location: "Ground Floor, Bangalore",
    text: "The team designed everything for my basement. The AI insights are mind-blowing — it predicted my harvest dates within 2 days.",
    stars: 5,
  },
];

/* ─── Component ─── */
export function Landing() {
  const navigate = useNavigate();
  const demoRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () =>
    demoRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen w-full" style={{ background: "#0D1117", color: "white" }}>
      {/* ── TOP NAV ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16"
        style={{
          background: "rgba(13,17,23,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,255,136,0.08)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #00FF88, #10B981)",
              boxShadow: "0 0 16px rgba(0,255,136,0.5)",
            }}
          >
            <Leaf className="w-5 h-5 text-black" />
          </div>
          <span className="text-lg" style={{ color: "#00FF88", fontWeight: 700 }}>
            GreenMind
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "#9CA3AF" }}>
          <button onClick={scrollToDemo} className="hover:text-white transition-colors">
            How It Works
          </button>
          <button onClick={() => document.getElementById("devices")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">
            IoT Devices
          </button>
          <button onClick={() => document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">
            Where to Grow
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/signin")}
            className="px-4 py-2 text-sm rounded-lg transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#E5E7EB",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-all"
            style={{
              background: "linear-gradient(135deg, #00FF88, #10B981)",
              color: "#000",
              fontWeight: 700,
              boxShadow: "0 0 16px rgba(0,255,136,0.35)",
            }}
          >
            Sign Up Free
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={farmHeroImg}
            alt="Vertical Farm"
            className="w-full h-full object-cover opacity-15"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #0D1117 40%, transparent 70%, #0D1117 100%), linear-gradient(to top, #0D1117 0%, transparent 50%)",
            }}
          />
        </div>

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-4"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,136,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-3xl"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{
                background: "rgba(0,255,136,0.08)",
                border: "1px solid rgba(0,255,136,0.2)",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00FF88" }} />
              <span className="text-xs" style={{ color: "#00FF88" }}>
                IoT-Powered Home Vertical Farming System
              </span>
            </div>

            <h1
              className="mb-6"
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              Grow Fresh Food
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #00FF88, #10B981)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                at Home.
              </span>
              <br />
              Automate Everything.
            </h1>

            <p
              className="mb-8 max-w-xl"
              style={{ fontSize: "1.15rem", color: "#9CA3AF", lineHeight: 1.8 }}
            >
              Whether you live in an apartment, rooftop, or ground floor — GreenMind
              installs smart IoT devices and a full dashboard to help you grow
              organic food year-round with zero effort.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base"
                style={{
                  background: "linear-gradient(135deg, #00FF88, #10B981)",
                  color: "#000",
                  fontWeight: 700,
                  boxShadow: "0 0 30px rgba(0,255,136,0.4), 0 4px 15px rgba(0,0,0,0.3)",
                }}
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToDemo}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "white",
                }}
              >
                <Play className="w-5 h-5" style={{ color: "#00FF88" }} />
                View Demo
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p
                    className="text-3xl"
                    style={{
                      fontWeight: 700,
                      color: "#00FF88",
                      fontFamily: "'Courier New', monospace",
                      textShadow: "0 0 20px rgba(0,255,136,0.4)",
                    }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 animate-pulse" style={{ background: "linear-gradient(to bottom, transparent, #00FF88)" }} />
          <span className="text-xs text-gray-600">Scroll to explore</span>
        </div>
      </section>

      {/* ── WHY GREENMIND ── */}
      <section className="py-28 max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(0,255,136,0.07)", border: "1px solid rgba(0,255,136,0.15)" }}
          >
            <span className="text-xs" style={{ color: "#00FF88" }}>WHY GREENMIND</span>
          </div>
          <h2 className="mb-4" style={{ fontSize: "2.4rem", fontWeight: 700 }}>
            Your{" "}
            <span style={{ background: "linear-gradient(135deg, #00FF88, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              profitability
            </span>{" "}
            starts here
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            GreenMind turns any unused space in your home into a smart, profitable,
            and self-sustaining vertical farm.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl group hover:scale-[1.02] transition-transform duration-200"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)" }}
              >
                <b.icon className="w-6 h-6" style={{ color: b.color }} />
              </div>
              <h3 className="mb-2 text-base" style={{ color: "white", fontWeight: 600 }}>
                {b.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ROI Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 rounded-3xl relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(0,255,136,0.05), rgba(16,185,129,0.08))",
            border: "1px solid rgba(0,255,136,0.12)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: Wallet, value: "₹2,000–5,000", label: "Monthly grocery savings" },
              { icon: TrendingUp, value: "4–8 months", label: "Average ROI period" },
              { icon: CheckCircle, value: "100+ kg/year", label: "Fresh produce per household" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <item.icon className="w-8 h-8" style={{ color: "#00FF88" }} />
                <p className="text-2xl" style={{ color: "#00FF88", fontWeight: 700, fontFamily: "'Courier New', monospace" }}>
                  {item.value}
                </p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-8" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4" style={{ fontSize: "2.4rem", fontWeight: 700 }}>
              How It{" "}
              <span style={{ background: "linear-gradient(135deg, #00FF88, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Works
              </span>
            </h2>
            <p className="text-gray-500">From sign-up to harvest in 3 simple steps.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div
              className="absolute top-12 left-1/6 right-1/6 h-px hidden md:block"
              style={{ background: "linear-gradient(to right, transparent, rgba(0,255,136,0.3), transparent)" }}
            />
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center mb-6 relative"
                  style={{
                    background: "rgba(0,255,136,0.06)",
                    border: "1px solid rgba(0,255,136,0.2)",
                    boxShadow: "0 0 30px rgba(0,255,136,0.08)",
                  }}
                >
                  <step.icon className="w-8 h-8 mb-1" style={{ color: "#00FF88" }} />
                  <span className="text-xs" style={{ color: "#00FF88", opacity: 0.6 }}>
                    {step.step}
                  </span>
                </div>
                <h3 className="mb-2 text-base" style={{ color: "white", fontWeight: 600 }}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IOT DEVICES ── */}
      <section id="devices" className="py-28 max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(0,255,136,0.07)", border: "1px solid rgba(0,255,136,0.15)" }}
          >
            <Cpu className="w-3 h-3" style={{ color: "#00FF88" }} />
            <span className="text-xs" style={{ color: "#00FF88" }}>WHAT WE INSTALL</span>
          </div>
          <h2 className="mb-4" style={{ fontSize: "2.4rem", fontWeight: 700 }}>
            IoT Devices in Your{" "}
            <span style={{ background: "linear-gradient(135deg, #00FF88, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              GreenMind System
            </span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Every device is selected specifically for home farming. We handle installation, wiring, and configuration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {iotDevices.map((dev, i) => (
            <motion.div
              key={dev.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl overflow-hidden group"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dev.img}
                  alt={dev.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,17,23,0.9) 0%, transparent 60%)" }} />
                <span
                  className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(0,255,136,0.15)",
                    border: "1px solid rgba(0,255,136,0.3)",
                    color: "#00FF88",
                  }}
                >
                  {dev.badge}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm mb-1.5" style={{ color: "white", fontWeight: 600 }}>
                  {dev.name}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{dev.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WHERE YOU CAN GROW ── */}
      <section id="locations" className="py-24 px-8" style={{ background: "rgba(0,255,136,0.01)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4" style={{ fontSize: "2.4rem", fontWeight: 700 }}>
              Works in{" "}
              <span style={{ background: "linear-gradient(135deg, #00FF88, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Your Home
              </span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              GreenMind is designed specifically for home growers — wherever you live.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map((loc, i) => (
              <motion.div
                key={loc.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl overflow-hidden group"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={loc.img}
                    alt={loc.type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(13,17,23,1) 0%, rgba(13,17,23,0.3) 60%)" }}
                  />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2">
                      <loc.icon className="w-5 h-5" style={{ color: "#00FF88" }} />
                      <span className="text-lg" style={{ color: "white", fontWeight: 700 }}>
                        {loc.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{loc.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {loc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: "rgba(0,255,136,0.08)",
                          border: "1px solid rgba(0,255,136,0.15)",
                          color: "#10B981",
                        }}
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO DEMO ── */}
      <section ref={demoRef} className="py-28 max-w-5xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="mb-4" style={{ fontSize: "2.4rem", fontWeight: 700 }}>
            See GreenMind in{" "}
            <span style={{ background: "linear-gradient(135deg, #00FF88, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Action
            </span>
          </h2>
          <p className="text-gray-500">Watch how a real GreenMind home farm is set up and monitored.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden group cursor-pointer"
          style={{
            border: "1px solid rgba(0,255,136,0.15)",
            boxShadow: "0 0 40px rgba(0,255,136,0.08)",
            aspectRatio: "16/9",
          }}
          onClick={() => {}}
        >
          <img
            src={farmHeroImg}
            alt="Demo Video"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-300"
          />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            style={{ background: "rgba(13,17,23,0.55)" }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0,255,136,0.15)",
                border: "2px solid rgba(0,255,136,0.5)",
                boxShadow: "0 0 40px rgba(0,255,136,0.3)",
              }}
            >
              <Play className="w-8 h-8 ml-1" style={{ color: "#00FF88" }} />
            </motion.div>
            <div className="text-center">
              <p style={{ color: "white", fontWeight: 600, fontSize: "1.2rem" }}>View Demo</p>
              <p className="text-sm text-gray-400 mt-1">3 min walkthrough — full system setup & dashboard</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-8" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="mb-4" style={{ fontSize: "2.2rem", fontWeight: 700 }}>
              What Our{" "}
              <span style={{ background: "linear-gradient(135deg, #00FF88, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Growers Say
              </span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4" style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm" style={{ color: "white", fontWeight: 600 }}>{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div
            className="rounded-3xl p-14 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,136,0.05), rgba(16,185,129,0.08))",
              border: "1px solid rgba(0,255,136,0.15)",
            }}
          >
            <div
              className="absolute inset-0 opacity-8"
              style={{
                backgroundImage: "linear-gradient(rgba(0,255,136,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative z-10">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)" }}
              >
                <Leaf className="w-8 h-8" style={{ color: "#00FF88" }} />
              </div>
              <h2 className="mb-4" style={{ fontSize: "2.2rem", fontWeight: 700 }}>
                Ready to grow your own food?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Sign up free, tell us about your space, and we'll design the perfect GreenMind system for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base"
                  style={{
                    background: "linear-gradient(135deg, #00FF88, #10B981)",
                    color: "#000",
                    fontWeight: 700,
                    boxShadow: "0 0 30px rgba(0,255,136,0.4)",
                  }}
                >
                  Sign Up Free <ArrowRight className="w-5 h-5" />
                </motion.button>
                <button
                  onClick={() => navigate("/signin")}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                  }}
                >
                  Already have an account? Sign In
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="border-t py-10 px-8"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00FF88, #10B981)" }}
            >
              <Leaf className="w-4 h-4 text-black" />
            </div>
            <span style={{ color: "#00FF88", fontWeight: 700 }}>GreenMind</span>
            <span className="text-gray-600 text-sm">· IoT-Powered Smart Vertical Farming · 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
