import { Platform } from "react-native";

export const colors = {
  // Core
  ink: "#1a1a1a",
  inkSoft: "#71717a",
  inkMuted: "#a1a1aa",

  // Surfaces
  paper: "#ffffff",
  mist: "#fafafa",
  blush: "#f4f4f5",
  champagne: "#e4e4e7",

  // Brand — warm rose-gold / dusty rose
  primary: "#b4637a",
  primarySoft: "#d4899e",
  primaryMuted: "#f5e6eb",
  primaryDeep: "#8c3f5a",

  // Accents
  sage: "#6b9080",
  sageMuted: "#e3ece7",
  gold: "#c4944a",
  goldMuted: "#faf3e6",

  // Semantic
  success: "#22c55e",
  successMuted: "#dcfce7",
  warn: "#f59e0b",
  warnMuted: "#fef9c3",
  danger: "#ef4444",
  dangerMuted: "#fee2e2",

  // Utility
  line: "#e4e4e7",
  white: "#ffffff",
  overlay: "rgba(0,0,0,0.4)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/** Platform-safe elevation — use boxShadow on web to avoid deprecation warnings */
export const shadows = {
  fab:
    Platform.OS === "web"
      ? ({ boxShadow: "0 4px 14px rgba(0,0,0,0.18)" } as const)
      : Platform.OS === "android"
        ? ({ elevation: 6 } as const)
        : ({
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
          } as const),
} as const;

