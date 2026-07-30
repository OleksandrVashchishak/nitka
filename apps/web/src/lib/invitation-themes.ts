export type InvitationTheme = {
  id: string;
  name: string;
  description: string;
  colors: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    line: string;
  };
  headlineFont: "display" | "script";
  frame: "none" | "line" | "double";
};

export const INVITATION_THEMES: InvitationTheme[] = [
  {
    id: "sage-linen",
    name: "Sage Linen",
    description: "Мʼякий шавлія + чиста типографіка",
    colors: {
      bg: "#e8efe8",
      surface: "#f4f7f4",
      text: "#1c2a22",
      muted: "#5c6d62",
      accent: "#3f6b55",
      line: "rgba(28,42,34,0.14)",
    },
    headlineFont: "display",
    frame: "line",
  },
  {
    id: "midnight-frame",
    name: "Midnight Frame",
    description: "Темна рамка й акцентний шрифт",
    colors: {
      bg: "#14181f",
      surface: "#1c222c",
      text: "#e8e2d6",
      muted: "#a79f90",
      accent: "#c9b18a",
      line: "rgba(201,177,138,0.28)",
    },
    headlineFont: "script",
    frame: "double",
  },
  {
    id: "meadow",
    name: "Meadow",
    description: "Світлий ботанічний вайб",
    colors: {
      bg: "#f2f5ef",
      surface: "#ffffff",
      text: "#243028",
      muted: "#66756a",
      accent: "#6b8f71",
      line: "rgba(36,48,40,0.12)",
    },
    headlineFont: "script",
    frame: "none",
  },
];

export function getInvitationTheme(id: string): InvitationTheme {
  return (
    INVITATION_THEMES.find((t) => t.id === id) ?? INVITATION_THEMES[0]!
  );
}
