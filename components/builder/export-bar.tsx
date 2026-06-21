"use client";

import { useState } from "react";
import { Check, Link2, Printer } from "lucide-react";
import type { ProgramState } from "@/lib/program-state";
import { encodeState } from "@/lib/encode";
import { ShineButton } from "@/components/ui/shine-button";

export function ExportBar({
  state,
  accent,
  onAccent,
}: {
  state: ProgramState;
  accent: string;
  onAccent: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl = (extra = "") =>
    `${window.location.origin}/p?d=${encodeState(state)}${extra}`;

  const share = async () => {
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Link zum Kopieren:", url);
    }
  };

  const print = () => {
    window.open(shareUrl("&print=1"), "_blank", "noopener");
  };

  return (
    <div className="flex items-center gap-2">
      <ShineButton variant="ghost" onClick={share} className="px-4 py-2.5">
        {copied ? <Check className="size-4 text-emerald-400" /> : <Link2 className="size-4" />}
        <span className="hidden sm:inline">{copied ? "Kopiert!" : "Link teilen"}</span>
      </ShineButton>
      <ShineButton accent={accent} onAccent={onAccent} onClick={print} className="px-4 py-2.5">
        <Printer className="size-4" />
        <span className="hidden sm:inline">PDF</span>
      </ShineButton>
    </div>
  );
}
