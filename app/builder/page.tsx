import { Suspense } from "react";
import { BuilderClient } from "@/components/builder/builder-client";

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-white/40">
          Lädt …
        </div>
      }
    >
      <BuilderClient />
    </Suspense>
  );
}
