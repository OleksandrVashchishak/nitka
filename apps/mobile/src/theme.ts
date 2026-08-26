import { Platform } from "react-native";

/**
 * Visual tokens aligned with web (`apps/web` globals.css):
 * sage botanical + Fraunces / Manrope.
 *
 * Naming note: web `--paper` = page bg; mobile `mist` = page bg,
 * `paper` = white card surface.
 */
export const colors = {
  // Core (green-gray ink)
  ink: "#161a17",
  inkSoft: "#3a423c",
  inkMuted: "#6b756e",

  // Surfaces
  paper: "#ffffff",
  mist: "#f7f8f6",
  blush: "#eef1ee",
  champagne: "#e4e8e5",

  // Brand — sage
  primary: "#3f5d4e",
  primarySoft: "#6f8f7c",
  primaryMuted: "#e8ece9",
  primaryDeep: "#2d4438",

  // Accents
  sage: "#6f8f7c",
  sageMuted: "#e3ece7",
  gold: "#c4944a",
  goldMuted: "#faf3e6",
  /** Soft rose — invitations / wedding accents only */
  rose: "#b4637a",
  roseMuted: "#f5e6eb",

  // Semantic
  success: "#22c55e",
  successMuted: "#dcfce7",
  warn: "#f59e0b",
  warnMuted: "#fef9c3",
  danger: "#ef4444",
  dangerMuted: "#fee2e2",

  // Utility
  line: "rgba(22,26,23,0.12)",
  glow: "rgba(63,93,78,0.18)",
  white: "#ffffff",
  overlay: "rgba(22,26,23,0.4)",
} as const;

/** Loaded via `useAppFonts` — family names from @expo-google-fonts */
export const fonts = {
  sans: "Manrope_400Regular",
  sansMedium: "Manrope_500Medium",
  sansSemi: "Manrope_600SemiBold",
  sansBold: "Manrope_700Bold",
  sansExtra: "Manrope_800ExtraBold",
  display: "Fraunces_600SemiBold",
  displayBold: "Fraunces_700Bold",
  /** Cyrillic script (UA) */
  script: "MarckScript_400Regular",
  /** Latin script fallback */
  scriptLat: "GreatVibes_400Regular",
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
      ? ({ boxShadow: "0 4px 14px rgba(63,93,78,0.22)" } as const)
      : Platform.OS === "android"
        ? ({ elevation: 6 } as const)
        : ({
            shadowColor: "#3f5d4e",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.22,
            shadowRadius: 8,
          } as const),
} as const;
