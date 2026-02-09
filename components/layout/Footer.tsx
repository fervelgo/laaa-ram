"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { FooterIcons } from "./FooterIcons";

export function Footer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-100">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* RAM text with expansion animation */}
        <div
          className="relative overflow-hidden cursor-default select-none"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className="flex items-baseline">
            <span className="text-2xl md:text-3xl font-bold tracking-tight">
              RAM
            </span>
            <div
              className={cn(
                "overflow-hidden transition-all duration-500 ease-out-expo",
                isExpanded ? "max-w-[400px] ml-2" : "max-w-0 ml-0"
              )}
            >
              <span
                className={cn(
                  "text-sm md:text-base font-light text-neutral-600 whitespace-nowrap",
                  "transition-opacity duration-300",
                  isExpanded ? "opacity-100" : "opacity-0"
                )}
              >
                Repositorio de Artefactos Mesoamericanos
              </span>
            </div>
          </div>
        </div>

        {/* Right icons */}
        <FooterIcons />
      </div>
    </footer>
  );
}
