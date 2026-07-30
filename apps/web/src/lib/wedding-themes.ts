export type ThemeComposition = "typography" | "photo-hero" | "botanical";

export type WeddingTheme = {
  id: string;
  name: string;
  description: string;
  headlineMode: "serif" | "script";
  composition: ThemeComposition;
  colors: {
    bg: string;
    surface: string;
    text: string;
    textMuted: string;
    textDim: string;
    accent: string;
    line: string;
    navBg: string;
  };
  decorations: {
    heroOverlay: string;
    heroFallbackGradient: string;
    dividerSymbol: string;
    showBokeh?: boolean;
    showBotanical?: boolean;
    showMoth?: boolean;
  };
};

export const THEME_CLASSIC_WHITE: WeddingTheme = {
  id: "classic-white",
  name: "Classic White",
  description: "Типографіка + білий мінімалізм",
  headlineMode: "serif",
  composition: "typography",
  colors: {
    bg: "#faf9f7",
    surface: "#ffffff",
    text: "#1f1f1f",
    textMuted: "#6b6b6b",
    textDim: "#9a9a9a",
    accent: "#1f1f1f",
    line: "rgba(0,0,0,0.1)",
    navBg: "rgba(250,249,247,0.92)",
  },
  decorations: {
    heroOverlay:
      "linear-gradient(to bottom, rgba(250,249,247,0.05) 0%, rgba(250,249,247,0.55) 70%, rgba(250,249,247,0.98) 100%)",
    heroFallbackGradient: "none",
    dividerSymbol: "·",
  },
};

export const THEME_NAVY_GOLD: WeddingTheme = {
  id: "navy-gold",
  name: "Navy & Gold",
  description: "Photo hero, navy і золото",
  headlineMode: "script",
  composition: "photo-hero",
  colors: {
    bg: "#1b334a",
    surface: "#203a52",
    text: "#e4b29e",
    textMuted: "#c9a08c",
    textDim: "#a88775",
    accent: "#e4b29e",
    line: "rgba(228,178,158,0.2)",
    navBg: "rgba(27,51,74,0.92)",
  },
  decorations: {
    heroOverlay:
      "linear-gradient(to bottom, rgba(27,51,74,0.25) 0%, rgba(27,51,74,0.55) 50%, rgba(27,51,74,0.95) 100%)",
    heroFallbackGradient: "none",
    dividerSymbol: "✦",
    showBokeh: true,
  },
};

export const THEME_DARK_BOTANICAL: WeddingTheme = {
  id: "dark-botanical",
  name: "Dark Botanical",
  description: "Чорний frame з флоральним декором",
  headlineMode: "serif",
  composition: "botanical",
  colors: {
    bg: "#050505",
    surface: "#111111",
    text: "#b5935b",
    textMuted: "#9a7d4f",
    textDim: "#7a6540",
    accent: "#b5935b",
    line: "rgba(181,147,91,0.2)",
    navBg: "rgba(5,5,5,0.92)",
  },
  decorations: {
    heroOverlay:
      "linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, rgba(5,5,5,0.55) 55%, rgba(5,5,5,0.98) 100%)",
    heroFallbackGradient: "none",
    dividerSymbol: "❧",
    showBotanical: true,
    showMoth: true,
  },
};

export const ALL_THEMES: WeddingTheme[] = [
  THEME_CLASSIC_WHITE,
  THEME_NAVY_GOLD,
  THEME_DARK_BOTANICAL,
];

export function getThemeById(id: string): WeddingTheme {
  if (id === "classic") return THEME_CLASSIC_WHITE;
  return ALL_THEMES.find((t) => t.id === id) ?? THEME_CLASSIC_WHITE;
}
