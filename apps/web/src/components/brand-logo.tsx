import Link from "next/link";

const LOGO_SRC = {
  dark: "/landing/logo-dark.svg",
  light: "/landing/logo-light.svg",
} as const;

export function BrandLogo({
  href = "/",
  /** dark = темні літери (світлий фон); light = світлі літери (темний фон) */
  variant = "dark",
  /** @deprecated use variant="light" */
  light = false,
  className = "",
  width = 154,
  height = 32,
}: {
  href?: string;
  variant?: keyof typeof LOGO_SRC;
  light?: boolean;
  className?: string;
  width?: number;
  height?: number;
}) {
  const src = LOGO_SRC[light ? "light" : variant];

  return (
    <Link
      href={href}
      className={`inline-flex items-center ${className}`.trim()}
      aria-label="fata.studio"
    >
      <img src={src} alt="fata.studio" width={width} height={height} />
    </Link>
  );
}
