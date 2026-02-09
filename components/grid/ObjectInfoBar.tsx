"use client";

import { cn } from "@/lib/utils/cn";
import type { ObjectSummary } from "@/lib/supabase/types";

interface ObjectInfoBarProps {
  object: ObjectSummary | null;
}

export function ObjectInfoBar({ object }: ObjectInfoBarProps) {
  // Build info string: "No. 027 | Llamador | Zapoteca | Teotihuacan | 200-600 d. C. | Barro | 21 x 21.3 x 20.5 cm"
  const infoString = object
    ? [
        `No. ${object.piece_number}`,
        object.title,
        object.cultura,
        object.origen,
        object.periodo,
        object.material,
        object.dimensiones,
      ]
        .filter(Boolean)
        .join("   ")
    : "";

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-neutral-900 text-white",
        "py-3 px-4 md:px-8",
        "transition-all duration-300 ease-out",
        object ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <p className="text-sm md:text-base font-light tracking-wide truncate">
        {infoString}
      </p>
    </div>
  );
}
