import React from "react";

export const FoundIcon: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="2" />
    <path
      d="M15 15L21 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
