import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Leaf,
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  TreePine,
  Building2,
  Home,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Image,
  Ruler,
  FileText,
  Layers,
} from "lucide-react";
import { useApp, UserProfile, PlantSection } from "../context/AppContext";

const STEPS = ["Personal Info", "Your Space", "Plant Sections", "Review & Submit"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300"
              style={{
                background:
                  i < current
                    ? "linear-gradient(135deg, #00FF88, #10B981)"
                    : i === current
                    ? "rgba(0,255,136,0.15)"
                    : "rgba(255,255,255,0.06)",
                border:
                  i === current
                    ? "2px solid #00FF88"
                    : i < current
                    ? "none"
                    : "2px solid rgba(255,255,255,0.1)",
                color: i < current ? "#000" : i === current ? "#00FF88" : "#6B7280",
                fontWeight: 600,
              }}
            >
              {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className="text-xs mt-1 hidden sm:block"
              style={{
                color: i === current ? "#00FF88" : "#6B7280",
                fontWeight: i === current ? 600 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="h-px mx-2 mb-4"
              style={{
                width: "60px",
                background: i < current ? "linear-gradient(to right, #00FF88, #10B981)" : "rgba(255,255,255,0.08)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

const locationTypes = [
  { value: "rooftop", label: "Rooftop", icon: TreePine, desc: "Open terrace or rooftop space" },
  { value: "apartment", label: "Apartment", icon: Building2, desc: "Balcony, room, or wall space" },
  { value: "ground_floor", label: "Ground Floor / Basement", icon: Home, desc: "Dedicated grow room" },
] as const;

export function GetStarted() {
  const navigate = useNavigate();
  const { submitInstallation, user } = useApp();
  const [step, setStep] = useState(0);

  // Form state
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [locationType, setLocationType] = useState<UserProfile["locationType"]>(
    user?.locationType ?? "apartment"
  );
  const [areaSize, setAreaSize] = useState(user?.areaSize ?? "");
  const [description, setDescription] = useState(user?.description ?? "");
  const [sections, setSections] = useState<PlantSection[]>(
    user?.sections?.length
      ? user.sections
      : [{ id: "s1", name: "", description: "" }]
  );

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: `s${Date.now()}`, name: "", description: "" },
    ]);
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, field: keyof PlantSection, value: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = () => {
    submitInstallation({
      name,
      email,
      phone,
      city,
      locationType,
      areaSize,
      description,
      sections,
    });
    navigate("/pending");
  };

  const inputBase: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    outline: "none",
    width: "100%",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
  };

  const inputWithIcon: React.CSSProperties = {
    ...inputBase,
    paddingLeft: "42px",
  };

  return (
    <div
      className="min-h-screen w-full flex items-start justify-center py-10 px-6"
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
          background: "radial-gradient(ellipse at 50% 20%, rgba(0,255,136,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00FF88, #10B981)", boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}
            >
              <Leaf className="w-5 h-5 text-black" />
            </div>
            <span style={{ color: "#00FF88", fontWeight: 700, fontSize: "1.2rem" }}>GreenMind</span>
          </div>
          <h1 className="text-3xl mb-2" style={{ color: "white", fontWeight: 700 }}>
            Set Up Your Farm
          </h1>
          <p className="text-sm text-gray-500">
            Tell us about your space and we'll design your perfect GreenMind system.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center mb-8">
          <StepIndicator current={step} />
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          <AnimatePresence mode="wait">
            {/* ── STEP 0: PERSONAL INFO ── */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl mb-1" style={{ color: "white", fontWeight: 600 }}>
                    Personal Information
                  </h2>
                  <p className="text-sm text-gray-500">Help us know who you are</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Kumar"
                        style={inputWithIcon}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={inputWithIcon}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Phone / WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        style={inputWithIcon}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">City / Location *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Mumbai, Maharashtra"
                        style={inputWithIcon}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 1: SPACE ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl mb-1" style={{ color: "white", fontWeight: 600 }}>
                    Your Growing Space
                  </h2>
                  <p className="text-sm text-gray-500">Tell us where you plan to install your farm</p>
                </div>

                {/* Location Type */}
                <div>
                  <label className="text-xs text-gray-400 mb-3 block">Location Type *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {locationTypes.map((lt) => (
                      <button
                        key={lt.value}
                        type="button"
                        onClick={() => setLocationType(lt.value)}
                        className="p-4 rounded-xl text-left transition-all duration-200"
                        style={{
                          background:
                            locationType === lt.value
                              ? "rgba(0,255,136,0.1)"
                              : "rgba(255,255,255,0.03)",
                          border: `1px solid ${locationType === lt.value ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.08)"}`,
                          boxShadow:
                            locationType === lt.value
                              ? "0 0 20px rgba(0,255,136,0.1)"
                              : "none",
                        }}
                      >
                        <lt.icon
                          className="w-5 h-5 mb-2"
                          style={{ color: locationType === lt.value ? "#00FF88" : "#6B7280" }}
                        />
                        <p
                          className="text-sm"
                          style={{
                            color: locationType === lt.value ? "#00FF88" : "white",
                            fontWeight: locationType === lt.value ? 600 : 400,
                          }}
                        >
                          {lt.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{lt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Area size */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Area / Size of Space *
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={areaSize}
                      onChange={(e) => setAreaSize(e.target.value)}
                      placeholder="e.g. 50 sq ft, 10×10 ft, 20 sq meters"
                      style={inputWithIcon}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Description of Your Space
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your space — ceiling height, sunlight, existing setup, etc."
                      rows={4}
                      style={{ ...inputBase, paddingLeft: "42px", resize: "none" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: PLANT SECTIONS ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl mb-1" style={{ color: "white", fontWeight: 600 }}>
                      Plant Sections
                    </h2>
                    <p className="text-sm text-gray-500">
                      Add the sections / zones of your plantation
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all"
                    style={{
                      background: "rgba(0,255,136,0.1)",
                      border: "1px solid rgba(0,255,136,0.3)",
                      color: "#00FF88",
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Section
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {sections.map((section, idx) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4" style={{ color: "#00FF88" }} />
                          <span className="text-sm" style={{ color: "#00FF88", fontWeight: 600 }}>
                            Section {idx + 1}
                          </span>
                        </div>
                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(section.id)}
                            className="text-gray-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Section Name</label>
                          <input
                            type="text"
                            value={section.name}
                            onChange={(e) => updateSection(section.id, "name", e.target.value)}
                            placeholder="e.g. Herbs Corner, Tomato Row, Green Shelf"
                            style={inputBase}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">
                            What you plan to grow
                          </label>
                          <input
                            type="text"
                            value={section.description}
                            onChange={(e) => updateSection(section.id, "description", e.target.value)}
                            placeholder="e.g. Lettuce, Basil, Cherry Tomatoes"
                            style={inputBase}
                          />
                        </div>
                        {/* Photos/Videos upload (UI only for demo) */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">
                            Photos / Videos (optional)
                          </label>
                          <div
                            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                              background: "rgba(255,255,255,0.03)",
                              border: "2px dashed rgba(255,255,255,0.1)",
                            }}
                          >
                            <Image className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="text-xs text-gray-400">Click to upload photos or videos</p>
                              <p className="text-xs text-gray-600">JPG, PNG, MP4 · Max 20MB each</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addSection}
                  className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "2px dashed rgba(255,255,255,0.08)",
                    color: "#6B7280",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Another Section
                </button>
              </motion.div>
            )}

            {/* ── STEP 3: REVIEW ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl mb-1" style={{ color: "white", fontWeight: 600 }}>
                    Review Your Request
                  </h2>
                  <p className="text-sm text-gray-500">
                    Everything look right? Submit to send your request to the GreenMind team.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Name", value: name },
                    { label: "Email", value: email },
                    { label: "Phone", value: phone || "—" },
                    { label: "Location", value: city },
                    {
                      label: "Space Type",
                      value: locationTypes.find((l) => l.value === locationType)?.label ?? locationType,
                    },
                    { label: "Area Size", value: areaSize },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <span className="text-xs text-gray-500">{row.label}</span>
                      <span className="text-sm" style={{ color: "white" }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {sections.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">
                      Plant Sections ({sections.length})
                    </p>
                    {sections.map((s, i) => (
                      <div
                        key={s.id}
                        className="flex items-start gap-3 px-4 py-3 rounded-xl mb-2"
                        style={{
                          background: "rgba(0,255,136,0.04)",
                          border: "1px solid rgba(0,255,136,0.1)",
                        }}
                      >
                        <Layers className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#00FF88" }} />
                        <div>
                          <p className="text-sm" style={{ color: "#00FF88" }}>
                            {s.name || `Section ${i + 1}`}
                          </p>
                          {s.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {description && (
                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <p className="text-xs text-gray-400 mb-1">Space Description</p>
                    <p className="text-sm text-gray-300">{description}</p>
                  </div>
                )}

                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(0,255,136,0.05)",
                    border: "1px solid rgba(0,255,136,0.15)",
                  }}
                >
                  <p className="text-xs text-gray-400 mb-1">What happens next?</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Our team will analyze your request within 24 hours and send you a detailed bill including device list, installation cost, and expected timeline.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              onClick={() => (step === 0 ? navigate("/dashboard") : setStep((s) => s - 1))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#9CA3AF",
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 0 ? "Back to Dashboard" : "Previous"}
            </button>

            {step < STEPS.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm"
                style={{
                  background: "linear-gradient(135deg, #00FF88, #10B981)",
                  color: "#000",
                  fontWeight: 700,
                  boxShadow: "0 0 20px rgba(0,255,136,0.25)",
                }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm"
                style={{
                  background: "linear-gradient(135deg, #00FF88, #10B981)",
                  color: "#000",
                  fontWeight: 700,
                  boxShadow: "0 0 20px rgba(0,255,136,0.3)",
                }}
              >
                <CheckCircle className="w-4 h-4" />
                Submit Request
              </motion.button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Your information is secure and only used for system design purposes.
        </p>
      </div>
    </div>
  );
}
