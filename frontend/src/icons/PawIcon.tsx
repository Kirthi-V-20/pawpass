"use client";

import { COLORS } from "@/styles/colors";

interface PawIconProps {
  size?: number;
  color?: string;
}

export function PawIcon({
  size = 24,
  color = COLORS.primary.DEFAULT,
}: PawIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="7" r="2.2" fill={color} />
      <circle cx="16" cy="7" r="2.2" fill={color} />
      <circle cx="5.5" cy="12" r="2" fill={color} />
      <circle cx="18.5" cy="12" r="2" fill={color} />
      <path
        d="M12 10.5C9.7 10.5 7.5 13 7.5 15.7C7.5 18.1 9.3 19.5 12 19.5C14.7 19.5 16.5 18.1 16.5 15.7C16.5 13 14.3 10.5 12 10.5Z"
        fill={color}
      />
    </svg>
  );
}
