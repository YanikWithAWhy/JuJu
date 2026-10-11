import { cn } from "@/lib/cn";

/** Rough relative luminance of a #rrggbb colour (0 = black, 1 = white). */
function luminance(hex: string): number {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return 1;
  const [r, g, b] = m.slice(1).map((c) => parseInt(c, 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * A stylized martial-arts belt (band + knot + hanging tails) in a given colour.
 * Dan belts get `stripes` (one bar per Dan) near the end of the band.
 */
export function BeltVisual({
  color,
  stripes = 0,
  stripeColor = "#D4AF37",
  className,
}: {
  color: string;
  stripes?: number;
  stripeColor?: string;
  className?: string;
}) {
  const gid = `belt-sheen-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  // Very dark belts (Schwarzgurt) get a faint light contour so they stay
  // visible on the dark theme.
  const outline =
    luminance(color) < 0.15 ? { style: { stroke: "var(--fg)", strokeOpacity: 0.22 } } : null;

  return (
    <svg
      viewBox="0 0 120 84"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {/* hanging tails */}
      <rect x="49" y="44" width="9" height="34" rx="2.5" fill={color} transform="rotate(6 53 60)" {...outline} />
      <rect x="62" y="44" width="9" height="31" rx="2.5" fill={color} transform="rotate(-7 66 60)" {...outline} />
      <rect x="49" y="44" width="9" height="34" rx="2.5" fill={`url(#${gid})`} transform="rotate(6 53 60)" />
      <rect x="62" y="44" width="9" height="31" rx="2.5" fill={`url(#${gid})`} transform="rotate(-7 66 60)" />

      {/* main band */}
      <rect x="2" y="30" width="116" height="20" rx="6" fill={color} {...outline} />

      {/* Dan stripes */}
      {Array.from({ length: stripes }, (_, i) => (
        <rect key={i} x={106 - i * 5} y="30" width="2.6" height="20" fill={stripeColor} />
      ))}

      <rect x="2" y="30" width="116" height="20" rx="6" fill={`url(#${gid})`} />

      {/* knot */}
      <rect x="46" y="26" width="28" height="28" rx="6" fill={color} {...outline} />
      <rect x="46" y="26" width="28" height="28" rx="6" fill={`url(#${gid})`} />
      <rect x="46" y="26" width="28" height="28" rx="6" fill="none" stroke="#000" strokeOpacity="0.18" />
    </svg>
  );
}
