import localFont from "next/font/local";
import {
  Cormorant_Garamond,
  Marck_Script,
  Montserrat,
  Poppins,
} from "next/font/google";

/** Standard width — nav, buttons, kickers */
export const akzidenz = localFont({
  src: [
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-LightIt.woff2", weight: "300", style: "italic" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-It.woff2", weight: "400", style: "italic" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-Md.woff2", weight: "500", style: "normal" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-MdIt.woff2", weight: "500", style: "italic" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-BoldIt.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-akzidenz",
  display: "swap",
});

/** Extended — landing headlines */
export const akzidenzExt = localFont({
  src: [
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-LightEx.woff2", weight: "300", style: "normal" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-LigExtIt.woff2", weight: "300", style: "italic" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-Ext.woff2", weight: "400", style: "normal" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-ExtItalic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-MdEx.woff2", weight: "500", style: "normal" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-MedExtIt.woff2", weight: "500", style: "italic" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-BoldEx.woff2", weight: "700", style: "normal" },
    { path: "../fonts/akzidenz/AkzidenzGroteskPro-BoldExIt.woff2", weight: "700", style: "italic" },
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
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const scriptCyr = Marck_Script({
  variable: "--font-script-cyr",
  weight: "400",
  subsets: ["cyrillic", "latin", "latin-ext"],
});

export const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["500"],
});
