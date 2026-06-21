import { Suspense } from "react";
import { ProgramView } from "@/components/program-view";

export default function ProgramPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-white/40">
          Lädt …
        </div>
      }
    >
      <ProgramView />
    </Suspense>
  );
}
