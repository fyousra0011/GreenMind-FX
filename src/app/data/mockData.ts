export type TimeRange = "1h" | "24h" | "7d";

export interface SensorDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  ph: number;
  energy: number;
  water: number;
  co2: number;
  light: number;
}

export interface Alert {
  id: string;
  type: "critical" | "warning" | "normal";
  message: string;
  device: string;
  timestamp: string;
  resolved: boolean;
}

export interface Device {
  id: string;
  name: string;
  type: "sensor" | "actuator" | "controller";
  status: "online" | "offline" | "warning";
  lastSeen: string;
  battery?: number;
  value?: string;
}

export interface Plant {
  id: string;
  name: string;
  variety: string;
  stage: "seedling" | "vegetative" | "flowering" | "harvest";
  stageProgress: number;
  health: "excellent" | "good" | "fair" | "poor";
  plantedDate: string;
  estimatedHarvest: string;
  row: number;
}

export interface AutomationRule {
  id: string;
  condition: string;
  action: string;
  enabled: boolean;
  triggered: number;
}

function rnd(min: number, max: number, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function generateTimeSeriesData(points: number, interval: "minutes" | "hours" | "days"): SensorDataPoint[] {
  const data: SensorDataPoint[] = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(now);
    if (interval === "minutes") d.setMinutes(d.getMinutes() - i * 5);
    else if (interval === "hours") d.setHours(d.getHours() - i);
    else d.setDate(d.getDate() - i);

    const timeStr =
      interval === "days"
        ? d.toLocaleDateString("en", { month: "short", day: "numeric" })
        : d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });

    data.push({
      time: timeStr,
      temperature: rnd(22, 28),
      humidity: rnd(60, 80),
      soilMoisture: rnd(45, 75),
      ph: rnd(5.8, 7.2, 2),
      energy: rnd(2.5, 4.5),
      water: rnd(50, 150),
      co2: rnd(800, 1200),
      light: rnd(400, 700),
    });
  }
  return data;
}

export const hourlyData = generateTimeSeriesData(12, "minutes");
export const dailyData = generateTimeSeriesData(24, "hours");
export const weeklyData = generateTimeSeriesData(7, "days");

export const currentMetrics = {
  temperature: 24.3,
  humidity: 72.1,
  soilMoisture: 63.4,
  ph: 6.4,
  energy: 3.2,
  water: 87,
  co2: 1050,
  light: 580,
  uptime: 99.7,
};

export const devices: Device[] = [
  { id: "d1", name: "ESP32 Controller A", type: "controller", status: "online", lastSeen: "now", value: "Active" },
  { id: "d2", name: "ESP32 Controller B", type: "controller", status: "online", lastSeen: "2m ago", value: "Active" },
  { id: "d3", name: "Temp Sensor Row 1", type: "sensor", status: "online", lastSeen: "now", battery: 85, value: "24.3°C" },
  { id: "d4", name: "Temp Sensor Row 2", type: "sensor", status: "online", lastSeen: "now", battery: 92, value: "23.8°C" },
  { id: "d5", name: "Humidity Sensor", type: "sensor", status: "online", lastSeen: "now", battery: 78, value: "72.1%" },
  { id: "d6", name: "Soil Moisture Row 1", type: "sensor", status: "online", lastSeen: "now", battery: 65, value: "63.4%" },
  { id: "d7", name: "Soil Moisture Row 2", type: "sensor", status: "warning", lastSeen: "5m ago", battery: 23, value: "41.2%" },
  { id: "d8", name: "pH Sensor Tank A", type: "sensor", status: "online", lastSeen: "now", battery: 88, value: "pH 6.4" },
  { id: "d9", name: "pH Sensor Tank B", type: "sensor", status: "offline", lastSeen: "12m ago", battery: 0, value: "N/A" },
  { id: "d10", name: "LED Array Row 1", type: "actuator", status: "online", lastSeen: "now", value: "ON 75%" },
  { id: "d11", name: "LED Array Row 2", type: "actuator", status: "online", lastSeen: "now", value: "ON 80%" },
  { id: "d12", name: "Water Pump Alpha", type: "actuator", status: "online", lastSeen: "now", value: "AUTO" },
  { id: "d13", name: "Cooling Fan #1", type: "actuator", status: "online", lastSeen: "now", value: "60 RPM" },
  { id: "d14", name: "Cooling Fan #2", type: "actuator", status: "online", lastSeen: "now", value: "60 RPM" },
  { id: "d15", name: "Arduino Nano Aux", type: "controller", status: "offline", lastSeen: "1h ago", value: "Offline" },
];

export const alerts: Alert[] = [
  {
    id: "a1",
    type: "warning",
    message: "Soil moisture in Row 2 dropping below threshold (41.2%)",
    device: "Soil Moisture Row 2",
    timestamp: "5 minutes ago",
    resolved: false,
  },
  {
    id: "a2",
    type: "critical",
    message: "pH Sensor Tank B offline — last reading: pH 6.1",
    device: "pH Sensor Tank B",
    timestamp: "12 minutes ago",
    resolved: false,
  },
  {
    id: "a3",
    type: "warning",
    message: "Battery critically low (23%) on Soil Moisture Row 2",
    device: "Soil Moisture Row 2",
    timestamp: "18 minutes ago",
    resolved: false,
  },
  {
    id: "a4",
    type: "normal",
    message: "Arduino Nano Aux went offline — check power supply",
    device: "Arduino Nano Aux",
    timestamp: "1 hour ago",
    resolved: false,
  },
  {
    id: "a5",
    type: "warning",
    message: "Water tank level at 28% — refill recommended",
    device: "Water Tank Alpha",
    timestamp: "2 hours ago",
    resolved: false,
  },
  {
    id: "a6",
    type: "critical",
    message: "Temperature spike detected in Row 3 (31.2°C)",
    device: "Temp Sensor Row 3",
    timestamp: "3 hours ago",
    resolved: true,
  },
  {
    id: "a7",
    type: "normal",
    message: "Scheduled nutrient cycle completed successfully",
    device: "Water Pump Alpha",
    timestamp: "4 hours ago",
    resolved: true,
  },
  {
    id: "a8",
    type: "normal",
    message: "LED grow lights entered evening spectrum mode",
    device: "LED Array Row 1",
    timestamp: "6 hours ago",
    resolved: true,
  },
];

export const plants: Plant[] = [
  {
    id: "p1",
    name: "Butterhead Lettuce",
    variety: "Lactuca sativa",
    stage: "vegetative",
    stageProgress: 68,
    health: "excellent",
    plantedDate: "Apr 12, 2026",
    estimatedHarvest: "May 18, 2026",
    row: 1,
  },
  {
    id: "p2",
    name: "Roma Tomato",
    variety: "Solanum lycopersicum",
    stage: "flowering",
    stageProgress: 45,
    health: "good",
    plantedDate: "Mar 20, 2026",
    estimatedHarvest: "Jun 2, 2026",
    row: 2,
  },
  {
    id: "p3",
    name: "Basil",
    variety: "Ocimum basilicum",
    stage: "vegetative",
    stageProgress: 80,
    health: "excellent",
    plantedDate: "Apr 18, 2026",
    estimatedHarvest: "May 25, 2026",
    row: 3,
  },
  {
    id: "p4",
    name: "Spinach",
    variety: "Spinacia oleracea",
    stage: "seedling",
    stageProgress: 25,
    health: "good",
    plantedDate: "Apr 28, 2026",
    estimatedHarvest: "Jun 10, 2026",
    row: 4,
  },
  {
    id: "p5",
    name: "Kale",
    variety: "Brassica oleracea",
    stage: "harvest",
    stageProgress: 95,
    health: "excellent",
    plantedDate: "Mar 5, 2026",
    estimatedHarvest: "May 8, 2026",
    row: 5,
  },
  {
    id: "p6",
    name: "Bell Pepper",
    variety: "Capsicum annuum",
    stage: "vegetative",
    stageProgress: 55,
    health: "fair",
    plantedDate: "Apr 5, 2026",
    estimatedHarvest: "Jun 15, 2026",
    row: 6,
  },
];

export const automationRules: AutomationRule[] = [
  {
    id: "r1",
    condition: "Temperature > 30°C",
    action: "Turn ON Cooling Fans (100%)",
    enabled: true,
    triggered: 3,
  },
  {
    id: "r2",
    condition: "Soil Moisture < 45%",
    action: "Activate Water Pump (2 min)",
    enabled: true,
    triggered: 12,
  },
  {
    id: "r3",
    condition: "pH < 5.5 OR pH > 7.5",
    action: "Alert + Pause Water Pump",
    enabled: true,
    triggered: 1,
  },
  {
    id: "r4",
    condition: "Time = 06:00 AM",
    action: "LED Lights ON (Veg. Spectrum)",
    enabled: true,
    triggered: 15,
  },
  {
    id: "r5",
    condition: "Time = 10:00 PM",
    action: "LED Lights OFF (Night Mode)",
    enabled: true,
    triggered: 15,
  },
  {
    id: "r6",
    condition: "Humidity > 85%",
    action: "Increase Fan Speed (80%)",
    enabled: false,
    triggered: 0,
  },
];

export const yieldData = [
  { month: "Nov", yield: 42, predicted: 45 },
  { month: "Dec", yield: 48, predicted: 50 },
  { month: "Jan", yield: 51, predicted: 52 },
  { month: "Feb", yield: 55, predicted: 56 },
  { month: "Mar", yield: 62, predicted: 60 },
  { month: "Apr", yield: 68, predicted: 65 },
  { month: "May", yield: null, predicted: 75 },
  { month: "Jun", yield: null, predicted: 82 },
];

export const efficiencyData = [
  { name: "Energy Eff.", value: 82 },
  { name: "Water Eff.", value: 91 },
  { name: "Growth Rate", value: 88 },
  { name: "Space Util.", value: 76 },
];
