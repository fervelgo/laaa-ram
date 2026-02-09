"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { cn } from "@/lib/utils/cn";
import type { ObjectSummary } from "@/lib/supabase/types";

interface ObjectCardProps {
  object: ObjectSummary;
  isHovered: boolean;
  shouldGrayscale: boolean;
  onHover: (object: ObjectSummary | null) => void;
}

export const ObjectCard = memo(function ObjectCard({
  object,
  isHovered,
  shouldGrayscale,
  onHover,
}: ObjectCardProps) {
  return (
    <Link
      href={`/objeto/${object.slug}`}
      className={cn(
        "relative flex flex-col items-center",
        "flex-1 min-w-0",
        "transition-all duration-300 ease-out grayscale-transition",
        shouldGrayscale && "grayscale opacity-50",
        isHovered && "scale-105"
      )}
      onMouseEnter={() => onHover(object)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Object image container */}
      <div className="relative w-full aspect-square flex items-end justify-center">
        {object.thumbnail_url ? (
          <Image
            src={object.thumbnail_url}
            alt={object.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 20vw, 12vw"
            className="object-contain object-bottom"
            loading="lazy"
          />
        ) : (
          // Placeholder for objects without thumbnails
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-16 h-20 rounded"
              style={{
                backgroundColor: `hsl(${(object.piece_number.charCodeAt(0) * 37) % 360}, 40%, 65%)`,
              }}
            />
          </div>
        )}

        {/* Shadow underneath object */}
        <div
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2",
            "w-3/4 h-2 bg-black/10 rounded-[50%] blur-sm",
            "transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-40"
          )}
        />
      </div>
    </Link>
  );
});
