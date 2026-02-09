"use client";

import { ObjectCard } from "./ObjectCard";
import type { ObjectSummary } from "@/lib/supabase/types";

interface ShelfRowProps {
  objects: ObjectSummary[];
  hoveredObjectId: string | null;
  isAnyHovered: boolean;
  onHover: (object: ObjectSummary | null) => void;
}

export function ShelfRow({
  objects,
  hoveredObjectId,
  isAnyHovered,
  onHover,
}: ShelfRowProps) {
  return (
    <div className="relative mb-2">
      {/* Objects container - evenly distributed */}
      <div className="flex justify-between items-end gap-2 md:gap-4 pb-2">
        {objects.map((object) => (
          <ObjectCard
            key={object.id}
            object={object}
            isHovered={hoveredObjectId === object.id}
            shouldGrayscale={isAnyHovered && hoveredObjectId !== object.id}
            onHover={onHover}
          />
        ))}
      </div>

      {/* Shelf line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-neutral-300"
        style={{
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        }}
      />
    </div>
  );
}
