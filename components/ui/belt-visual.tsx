import { cn } from "@/lib/cn";

/** A stylized martial-arts belt (band + knot + hanging tails) in a given colour. */
export function BeltVisual({ color, className }: { color: string; className?: string }) {
  const gid = `belt-sheen-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
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
      <rect x="49" y="44" width="9" height="34" rx="2.5" fill={color} transform="rotate(6 53 60)" />
      <rect x="62" y="44" width="9" height="31" rx="2.5" fill={color} transform="rotate(-7 66 60)" />
      <rect x="49" y="44" width="9" height="34" rx="2.5" fill={`url(#${gid})`} transform="rotate(6 53 60)" />
      <rect x="62" y="44" width="9" height="31" rx="2.5" fill={`url(#${gid})`} transform="rotate(-7 66 60)" />

      {/* main band */}
      <rect x="2" y="30" width="116" height="20" rx="6" fill={color} />
      <rect x="2" y="30" width="116" height="20" rx="6" fill={`url(#${gid})`} />

      {/* knot */}
      <rect x="46" y="26" width="28" height="28" rx="6" fill={color} />
      <rect x="46" y="26" width="28" height="28" rx="6" fill={`url(#${gid})`} />
      <rect x="46" y="26" width="28" height="28" rx="6" fill="none" stroke="#000" strokeOpacity="0.18" />
    </svg>
  );
}
