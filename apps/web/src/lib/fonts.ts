import localFont from "next/font/local";
import {
  Comforter,
  Cormorant_Garamond,
  Cormorant_Infant,
  Forum,
  Great_Vibes,
  Jost,
  Oranienbaum,
  Manrope,
  Marck_Script,
  Spectral,
} from "next/font/google";

/** Standard width — nav, buttons, kickers */
export const akzidenz = localFont({
  src: [
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-LightIt.woff2", weight: "300", style: "italic" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-Md.woff2", weight: "500", style: "normal" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-MdIt.woff2", weight: "500", style: "italic" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-BoldIt.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-akzidenz",
  display: "swap",
});

/** Extended — landing headlines */
export const akzidenzExt = localFont({
  src: [
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-LigExtIt.woff2", weight: "300", style: "italic" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-Ext.woff2", weight: "400", style: "normal" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-ExtItalic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-MdEx.woff2", weight: "500", style: "normal" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-MedExtIt.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const mak = localFont({
  src: [{ path: "../fonts/MAK.ttf", weight: "300", style: "normal" }],
  variable: "--font-mak",
  display: "swap",
});

export const cormorant = Cormorant_Garamond({
  variable: "--font-script",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/** Name cards «Елегантний» — first name script */
export const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  preload: false,
});

/** Name cards «Журнальний» — condensed high-contrast serif */
export const oranienbaum = Oranienbaum({
  variable: "--font-oranienbaum",
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  preload: false,
});

export const scriptCyr = Marck_Script({
  variable: "--font-script-cyr",
  weight: "400",
  subsets: ["cyrillic", "latin", "latin-ext"],
  preload: false,
});

export const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  preload: false,
});


/** Сайт-запрошення «Ботанічний» — заголовки */
export const forum = Forum({
  variable: "--font-forum",
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  preload: false,
});

/** Сайт-запрошення «Ботанічний» — текст і підписи */
export const jost = Jost({
  variable: "--font-jost",
  weight: ["300", "400", "500"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  preload: false,
  /* Без авто-fallback (Arial): є/і/ї/ґ, яких немає в Jost, має добирати Manrope зі стеку в стилях */
  adjustFontFallback: false,
});

/** Сайт-запрошення «Ніжний» — рукописні слова в заголовках, монограма */
export const comforter = Comforter({
  variable: "--font-comforter",
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  preload: false,
});

/** Сайт-запрошення «Ніжний» — курсивні підписи, час, номери */
export const cormorantInfant = Cormorant_Infant({
  variable: "--font-cormorant-infant",
  weight: ["300"],
  style: ["italic"],
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  preload: false,
});

/** Сайт-запрошення «Ніжний» — основний текст */
export const spectral = Spectral({
  variable: "--font-spectral",
  weight: ["300", "400"],
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  preload: false,
});
