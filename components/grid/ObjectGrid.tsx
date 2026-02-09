"use client";

import { useState, useCallback, useMemo } from "react";
import { ShelfRow } from "./ShelfRow";
import { ObjectInfoBar } from "./ObjectInfoBar";
import type { ObjectSummary } from "@/lib/supabase/types";

interface ObjectGridProps {
  objects: ObjectSummary[];
}

const ITEMS_PER_ROW = 8;

export function ObjectGrid({ objects }: ObjectGridProps) {
  const [hoveredObject, setHoveredObject] = useState<ObjectSummary | null>(
    null
  );

  const handleHover = useCallback((object: ObjectSummary | null) => {
    setHoveredObject(object);
  }, []);

  // Split objects into rows of ITEMS_PER_ROW
  const rows = useMemo(() => {
    const result: ObjectSummary[][] = [];
    for (let i = 0; i < objects.length; i += ITEMS_PER_ROW) {
      result.push(objects.slice(i, i + ITEMS_PER_ROW));
    }
    return result;
  }, [objects]);

  const isAnyHovered = hoveredObject !== null;

  return (
    <div className="relative w-full h-full">
      {/* Info bar overlay - fixed at top */}
      <ObjectInfoBar object={hoveredObject} />

      {/* Grid container with shelf rows */}
      <div className="px-4 md:px-8 lg:px-12 pt-8 pb-24">
        {rows.map((row, rowIndex) => (
          <ShelfRow
            key={rowIndex}
            objects={row}
            hoveredObjectId={hoveredObject?.id ?? null}
            isAnyHovered={isAnyHovered}
            onHover={handleHover}
          />
        ))}
      </div>
    </div>
  );
}
