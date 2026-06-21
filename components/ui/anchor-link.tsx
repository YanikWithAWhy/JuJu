"use client";

import type { MouseEvent, ReactNode } from "react";

/**
 * Smoothly scrolls to an in-page `#id` target via JS, which works reliably even
 * with `overflow-x: hidden` on the body (native hash navigation does not here).
 */
export function scrollToHash(href: string, e: MouseEvent<HTMLAnchorElement>) {
  if (!href.startsWith("#")) return;
  const el = document.getElementById(href.slice(1));
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", href);
}

export function AnchorLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={(e) => scrollToHash(href, e)}>
      {children}
    </a>
  );
}
