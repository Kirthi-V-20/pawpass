"use client";

import { useEffect, useRef, useState } from "react";

import { PET_SPECIES } from "@/constants/petSpecies";
import { COLORS } from "@/styles/colors";
import { localize } from "@/utils/localize";
import { cn } from "@/lib/utils";

interface PetSpeciesSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function PetSpeciesSelect({
  value,
  onChange,
  className,
}: PetSpeciesSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = value || localize.pets.all_species;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full sm:w-48", className)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-9 w-full items-center justify-between rounded-lg border px-3 text-sm"
        style={{
          backgroundColor: COLORS.neutral.white,
          borderColor: COLORS.grey[300],
          color: COLORS.neutral.black,
        }}
      >
        <span className="truncate">{selectedLabel}</span>

        <span className="ml-2 text-xs">▼</span>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-11 z-50 w-full overflow-hidden rounded-lg border shadow-md"
          style={{
            backgroundColor: COLORS.neutral.white,
            borderColor: COLORS.grey[200],
          }}
        >
          <div className="max-h-48 overflow-y-auto p-1">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="w-full rounded-md px-3 py-2 text-left text-sm"
              style={{
                color: COLORS.neutral.black,
              }}
            >
              {localize.pets.all_species}
            </button>

            {PET_SPECIES.map((species) => (
              <button
                key={species}
                type="button"
                onClick={() => {
                  onChange(species);
                  setIsOpen(false);
                }}
                className="w-full rounded-md px-3 py-2 text-left text-sm"
                style={{
                  color: COLORS.neutral.black,
                }}
              >
                {species}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
