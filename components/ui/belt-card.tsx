"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { BeltDef } from "@/data/types";
import { BeltVisual } from "./belt-visual";

export function BeltCard({ belt, index }: { belt: BeltDef; index: number }) {
  const examined = belt.faecher.filter((f) => f.kind !== "notExamined").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.21, 0.5, 0.27, 0.99] }}
      className="group relative"
    >
      <Link
        href={`/builder?belt=${belt.id}`}
        className="glass relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-transform duration-300 group-hover:-translate-y-1"
      >
        {/* coloured ring + glow on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1px ${belt.color}66, 0 24px 70px -28px ${belt.color}` }}
        />

        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/45">
              {belt.kyu}. Kyu
            </div>
            <div className="mt-1 text-xl font-semibold text-white">{belt.name}</div>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ backgroundColor: `${belt.color}1f`, color: belt.color }}
          >
            {belt.colorName}
          </span>
        </div>

        <div className="mx-auto w-28 py-2 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-2">
          <BeltVisual color={belt.color} />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-white/55">
          <span>{examined} von 16 Fächern</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-white transition-all group-hover:gap-2.5">
            Programm
            <ArrowRight className="size-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
