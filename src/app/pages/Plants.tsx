import { useState } from "react";
import { motion } from "motion/react";
import {
  Leaf,
  Sprout,
  Sun,
  Droplets,
  Brain,
  Calendar,
  TrendingUp,
  ChevronDown,
  Clock,
  FlaskConical,
  Thermometer,
  Zap,
  Star,
} from "lucide-react";
import { GlassCard, NeonBadge, PulseIndicator } from "../components/ui/GlassCard";
import { plants, type Plant } from "../data/mockData";

const cropOptions = [
  "Butterhead Lettuce",
  "Roma Tomato",
  "Basil",
  "Spinach",
  "Kale",
  "Bell Pepper",
  "Cucumber",
  "Cilantro",
  "Arugula",
];

const aiRecommendations = {
  "Butterhead Lettuce": {
    lighting: "16h on / 8h off · Blue:Red = 70:30 · 400 μmol",
    nutrients: "N: 150ppm · P: 40ppm · K: 180ppm · pH 6.0–6.5",
    harvest: "May 18, 2026 (13 days remaining)",
    tips: [
      "Reduce nitrogen by 20% to prevent tip burn",
      "Lower temperature to 18°C at night for compact growth",
      "Increase calcium supplementation",
    ],
  },
  "Roma Tomato": {
    lighting: "18h on / 6h off · Blue:Red = 40:60 · 650 μmol",
    nutrients: "N: 200ppm · P: 60ppm · K: 250ppm · pH 6.0–6.8",
    harvest: "Jun 2, 2026 (28 days remaining)",
    tips: [
      "Add potassium support during flowering stage",
      "Maintain CO₂ at 1200ppm for optimal yield",
      "Install support stakes — fruit load increasing",
    ],
  },
  "Basil": {
    lighting: "14h on / 10h off · Blue:Red = 60:40 · 350 μmol",
    nutrients: "N: 120ppm · P: 30ppm · K: 140ppm · pH 5.5–6.5",
    harvest: "May 25, 2026 (20 days remaining)",
    tips: [
      "Pinch off flower buds to encourage leaf growth",
      "Optimal temperature: 21–26°C",
      "Avoid water on leaves to prevent fungal issues",
    ],
  },
};

const stageLabels = ["Seedling", "Vegetative", "Flowering", "Harvest"];
const stageColors: Record<string, string> = {
  seedling: "#3B82F6",
  vegetative: "#10B981",
  flowering: "#F59E0B",
  harvest: "#00FF88",
};

const healthColors: Record<string, { bg: string; text: string }> = {
  excellent: { bg: "rgba(0,255,136,0.15)", text: "#00FF88" },
  good: { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  fair: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
  poor: { bg: "rgba(239,68,68,0.15)", text: "#EF4444" },
};

const plantImage = "https://images.unsplash.com/photo-1765261221588-9c9f3b6dfb52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHBsYW50JTIwc2VlZGxpbmclMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3Nzc5NzcxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

function PlantCard({ plant, selected, onClick }: { plant: Plant; selected: boolean; onClick: () => void }) {
  const stageColor = stageColors[plant.stage];
  const hc = healthColors[plant.health];
  const stageIdx = stageLabels.findIndex((s) => s.toLowerCase() === plant.stage);

  return (
    <GlassCard
      className="p-4 cursor-pointer"
      glow={selected}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: `${stageColor}20`,
              border: `1px solid ${stageColor}40`,
            }}
          >
            <Leaf className="w-4 h-4" style={{ color: stageColor }} />
          </div>
          <div>
            <p className="text-sm" style={{ color: selected ? "#00FF88" : "white", fontWeight: 600 }}>
              {plant.name}
            </p>
            <p className="text-xs text-gray-500 italic">{plant.variety}</p>
          </div>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: hc.bg, color: hc.text }}
        >
          {plant.health}
        </span>
      </div>

      {/* Stage progress */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-xs capitalize" style={{ color: stageColor }}>{plant.stage}</span>
          <span className="text-xs text-gray-500">{plant.stageProgress}%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${plant.stageProgress}%`,
              background: `linear-gradient(90deg, ${stageColor}, ${stageColor}99)`,
              boxShadow: `0 0 6px ${stageColor}40`,
            }}
          />
        </div>
      </div>

      {/* Stage dots */}
      <div className="flex items-center gap-1 mb-3">
        {stageLabels.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: i <= stageIdx ? stageColor : "rgba(255,255,255,0.1)",
                boxShadow: i === stageIdx ? `0 0 6px ${stageColor}` : "none",
              }}
            />
            {i < stageLabels.length - 1 && (
              <div
                className="flex-1 h-px"
                style={{
                  background: i < stageIdx ? stageColor : "rgba(255,255,255,0.08)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Row {plant.row}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{plant.estimatedHarvest}</span>
        </div>
      </div>
    </GlassCard>
  );
}

export function Plants() {
  const [selectedPlant, setSelectedPlant] = useState<Plant>(plants[0]);
  const [selectedCrop, setSelectedCrop] = useState(cropOptions[0]);
  const [showCropDropdown, setShowCropDropdown] = useState(false);

  const rec = aiRecommendations[selectedPlant.name as keyof typeof aiRecommendations] || aiRecommendations["Butterhead Lettuce"];
  const stageColor = stageColors[selectedPlant.stage];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl" style={{ color: "white", fontWeight: 700 }}>
            Plant Management & AI
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor growth stages, health, and get AI-driven crop insights
          </p>
        </div>
        {/* Crop selector */}
        <div className="relative">
          <button
            onClick={() => setShowCropDropdown((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{
              background: "rgba(0,255,136,0.08)",
              border: "1px solid rgba(0,255,136,0.2)",
              color: "#00FF88",
            }}
          >
            <Sprout className="w-4 h-4" />
            {selectedCrop}
            <ChevronDown className="w-4 h-4" />
          </button>
          {showCropDropdown && (
            <div
              className="absolute right-0 top-full mt-1 w-48 rounded-xl overflow-hidden z-50"
              style={{
                background: "rgba(13,17,23,0.98)",
                border: "1px solid rgba(0,255,136,0.15)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              {cropOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => { setSelectedCrop(c); setShowCropDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                  style={{ color: selectedCrop === c ? "#00FF88" : "#9CA3AF" }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plant List */}
        <div className="space-y-3">
          <h2 className="text-sm text-gray-400 uppercase tracking-wider">Active Crops ({plants.length})</h2>
          {plants.map((plant) => (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <PlantCard
                plant={plant}
                selected={selectedPlant.id === plant.id}
                onClick={() => setSelectedPlant(plant)}
              />
            </motion.div>
          ))}
        </div>

        {/* Detail + AI Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selected plant detail */}
          <GlassCard className="overflow-hidden" glow>
            <div className="relative h-36">
              <img
                src={plantImage}
                alt="Plant"
                className="w-full h-full object-cover"
                style={{ opacity: 0.3 }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(13,17,23,1) 0%, transparent 60%)" }}
              />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <div>
                  <h2 className="text-xl" style={{ color: "white", fontWeight: 700 }}>
                    {selectedPlant.name}
                  </h2>
                  <p className="text-xs italic text-gray-400">{selectedPlant.variety}</p>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-sm capitalize"
                  style={{
                    background: `${stageColor}20`,
                    border: `1px solid ${stageColor}40`,
                    color: stageColor,
                  }}
                >
                  {selectedPlant.stage}
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Health</p>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: healthColors[selectedPlant.health].text,
                      boxShadow: `0 0 6px ${healthColors[selectedPlant.health].text}`,
                    }}
                  />
                  <span className="text-sm capitalize" style={{ color: healthColors[selectedPlant.health].text }}>
                    {selectedPlant.health}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Stage Progress</p>
                <span className="text-sm" style={{ color: stageColor }}>{selectedPlant.stageProgress}%</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Planted</p>
                <span className="text-sm text-gray-300">{selectedPlant.plantedDate}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Est. Harvest</p>
                <span className="text-sm" style={{ color: "#00FF88" }}>{selectedPlant.estimatedHarvest}</span>
              </div>
            </div>

            {/* Growth stage progress bar */}
            <div className="px-5 pb-5">
              <div className="relative">
                <div className="flex justify-between mb-2">
                  {stageLabels.map((s, i) => {
                    const isActive = s.toLowerCase() === selectedPlant.stage;
                    const isPast = stageLabels.findIndex((x) => x.toLowerCase() === selectedPlant.stage) > i;
                    return (
                      <div key={s} className="flex flex-col items-center gap-1">
                        <div
                          className="w-3 h-3 rounded-full relative z-10"
                          style={{
                            background: isActive || isPast ? stageColor : "rgba(255,255,255,0.1)",
                            boxShadow: isActive ? `0 0 10px ${stageColor}` : "none",
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: isActive ? stageColor : isPast ? "#6B7280" : "#4B5563" }}
                        >
                          {s}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div
                  className="absolute top-1.5 left-0 right-0 h-px -translate-y-1/2"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              </div>
            </div>
          </GlassCard>

          {/* AI Insights Panel */}
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
                  AI Crop Insights
                </h3>
                <p className="text-xs text-gray-500">Powered by GreenMind AI — last updated 2 min ago</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <PulseIndicator active={true} size={6} />
                <span className="text-xs" style={{ color: "#00FF88" }}>Live</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div
                className="p-3 rounded-xl"
                style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.1)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-4 h-4" style={{ color: "#F59E0B" }} />
                  <span className="text-xs" style={{ color: "#F59E0B", fontWeight: 600 }}>Lighting</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{rec.lighting}</p>
              </div>
              <div
                className="p-3 rounded-xl"
                style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="w-4 h-4" style={{ color: "#3B82F6" }} />
                  <span className="text-xs" style={{ color: "#3B82F6", fontWeight: 600 }}>Nutrients</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{rec.nutrients}</p>
              </div>
              <div
                className="p-3 rounded-xl"
                style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.1)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" style={{ color: "#00FF88" }} />
                  <span className="text-xs" style={{ color: "#00FF88", fontWeight: 600 }}>Harvest</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{rec.harvest}</p>
              </div>
            </div>

            {/* AI Tips */}
            <div>
              <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">AI Recommendations</h4>
              <div className="space-y-2">
                {rec.tips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2.5 rounded-lg"
                    style={{
                      background: "rgba(0,255,136,0.03)",
                      border: "1px solid rgba(0,255,136,0.07)",
                    }}
                  >
                    <Star className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#00FF88" }} />
                    <p className="text-xs text-gray-300">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Thermometer, label: "Optimal Temp", value: "18–24°C", color: "#F59E0B" },
              { icon: Droplets, label: "Water Need", value: "Med-High", color: "#3B82F6" },
              { icon: TrendingUp, label: "Growth Rate", value: "+8%/week", color: "#00FF88" },
              { icon: Zap, label: "Light Hours", value: "16h/day", color: "#10B981" },
            ].map(({ icon: Icon, label, value, color }) => (
              <GlassCard key={label} className="p-3 text-center">
                <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm mt-0.5" style={{ color, fontWeight: 600 }}>{value}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
