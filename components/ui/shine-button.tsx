"use client";

import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { scrollToHash } from "@/components/ui/anchor-link";

interface BaseProps {
  children: ReactNode;
  className?: string;
  /** Accent colour for the solid background. Falls back to the inherited `--accent`. */
  accent?: string;
  /** Readable text colour to sit on top of `accent` (light belts need a dark value). */
  onAccent?: string;
  variant?: "solid" | "ghost";
}

const SHARED =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-6 py-3 text-sm font-medium tracking-tight transition-[filter,background-color,transform,box-shadow] duration-300 active:scale-[0.98]";

function resolve(variant: "solid" | "ghost", accent?: string, onAccent?: string) {
  if (variant === "ghost") {
    return {
      className: "border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]",
      style: undefined as CSSProperties | undefined,
    };
  }
  const bg = accent ?? "var(--accent)";
  return {
    className: "border-black/10 hover:brightness-110",
    style: {
      backgroundColor: bg,
      color: onAccent ?? "#ffffff",
      boxShadow: `0 10px 34px -12px ${accent ?? "var(--accent)"}`,
    } as CSSProperties,
  };
}

export function ShineButton({
  children,
  className,
  accent,
  onAccent,
  variant = "solid",
  ...props
}: BaseProps & ComponentProps<"button">) {
  const { className: vc, style } = resolve(variant, accent, onAccent);
  return (
    <button style={style} className={cn(SHARED, vc, className)} {...props}>
      <Sheen />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export function ShineLink({
  children,
  className,
  accent,
  onAccent,
  variant = "solid",
  ...props
}: BaseProps & ComponentProps<typeof Link>) {
  const { className: vc, style } = resolve(variant, accent, onAccent);
  const inner = (
    <>
      <Sheen />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  // Same-page anchors scroll reliably with a native <a> (next/link doesn't
  // always scroll to in-page hashes in the App Router).
  if (typeof props.href === "string" && props.href.startsWith("#")) {
    const { href, ...rest } = props;
    return (
      <a
        href={href}
        onClick={(e) => scrollToHash(href, e)}
        style={style}
        className={cn(SHARED, vc, className)}
        {...(rest as ComponentProps<"a">)}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link style={style} className={cn(SHARED, vc, className)} {...props}>
      {inner}
    </Link>
  );
}

function Sheen() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
    />
  );
}
