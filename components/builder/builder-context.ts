"use client";

import { createContext, useContext } from "react";
import type { KeyLocation } from "@/lib/program-state";

/** Cross-cutting operations for the "übernehmen" (copy a technique) feature. */
export interface BuilderLinkApi {
  /** Resolve an entry key to its Fach + technique (static belt data). */
  locate: (key: string) => KeyLocation | null;
  /** Open the picker to copy another technique's flowchart into `destKey`. */
  openPicker: (destKey: string) => void;
}

export const BuilderLinkContext = createContext<BuilderLinkApi | null>(null);

export function useBuilderLink(): BuilderLinkApi | null {
  return useContext(BuilderLinkContext);
}
