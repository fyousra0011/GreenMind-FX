import React, { createContext, useContext, useState, useCallback } from "react";

export type FlowState =
  | "unauthenticated"
  | "pre_install"
  | "pending_approval"
  | "billing_received"
  | "installed";

export type Theme = "dark" | "light";

export interface PlantSection {
  id: string;
  name: string;
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  locationType: "rooftop" | "apartment" | "ground_floor";
  areaSize: string;
  description: string;
  sections: PlantSection[];
}

interface AppContextType {
  flowState: FlowState;
  user: UserProfile | null;
  theme: Theme;
  setTheme: (t: Theme) => void;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  submitInstallation: (profile: UserProfile) => void;
  agreeAndPay: () => void;
}

const STORAGE_KEY = "greenmind_app_state";
const AppCtx = createContext<AppContextType | null>(null);

interface Stored {
  flowState: FlowState;
  user: UserProfile | null;
  theme: Theme;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Stored>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Stored;
    } catch {}
    return { flowState: "unauthenticated", user: null, theme: "dark" };
  });

  const persist = useCallback((next: Stored) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const login = useCallback(
    (email: string, name?: string) => {
      const u: UserProfile = state.user ?? {
        name: name ?? email.split("@")[0],
        email,
        phone: "",
        city: "",
        locationType: "apartment",
        areaSize: "",
        description: "",
        sections: [],
      };
      persist({ ...state, flowState: "pre_install", user: u });
    },
    [state, persist]
  );

  const signup = useCallback(
    (name: string, email: string) => {
      persist({
        ...state,
        flowState: "pre_install",
        user: {
          name,
          email,
          phone: "",
          city: "",
          locationType: "apartment",
          areaSize: "",
          description: "",
          sections: [],
        },
      });
    },
    [state, persist]
  );

  const logout = useCallback(() => {
    persist({ flowState: "unauthenticated", user: null, theme: state.theme });
  }, [state, persist]);

  const setTheme = useCallback(
    (theme: Theme) => {
      persist({ ...state, theme });
    },
    [state, persist]
  );

  const submitInstallation = useCallback(
    (profile: UserProfile) => {
      persist({ ...state, flowState: "billing_received", user: profile });
    },
    [state, persist]
  );

  const agreeAndPay = useCallback(() => {
    persist({ ...state, flowState: "installed" });
  }, [state, persist]);

  return (
    <AppCtx.Provider
      value={{
        flowState: state.flowState,
        user: state.user,
        theme: state.theme,
        setTheme,
        login,
        signup,
        logout,
        submitInstallation,
        agreeAndPay,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

/** Theme color helper — call with isDark boolean */
export function tc(isDark: boolean) {
  return {
    bg: isDark ? "#0D1117" : "#091410",
    bgAlt: isDark ? "#0A0F14" : "#061009",
    surface: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)",
    surfaceHover: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.1)",
    border: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.1)",
    borderAccent: isDark ? "rgba(0,255,136,0.15)" : "rgba(0,255,136,0.2)",
    text: isDark ? "#FFFFFF" : "#E8FFF5",
    textSub: isDark ? "#E5E7EB" : "#D1F0E2",
    textMuted: isDark ? "#9CA3AF" : "#7EC4A4",
    textDim: isDark ? "#6B7280" : "#4D8870",
    accent: "#00FF88",
    accentBright: "#00FF88",
    accentAlt: isDark ? "#10B981" : "#0FB87A",
    navBg: isDark ? "rgba(10,15,20,0.88)" : "rgba(6,18,12,0.95)",
    sidebarBg: isDark ? "rgba(10,15,20,0.97)" : "rgba(5,15,10,0.98)",
    shadow: isDark
      ? "0 4px 24px rgba(0,0,0,0.35)"
      : "0 4px 24px rgba(0,0,0,0.5)",
    shadowGlow: isDark
      ? "0 0 20px rgba(0,255,136,0.08)"
      : "0 0 20px rgba(0,255,136,0.1)",
    inputBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.06)",
    cardBg: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
    scrollbar: isDark ? "rgba(0,255,136,0.15)" : "rgba(0,255,136,0.25)",
  };
}