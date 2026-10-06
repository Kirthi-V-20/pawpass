import React from "react";

export const ShareIcon: React.FC<{
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
    <circle cx="18" cy="5" r="3" stroke={color} strokeWidth="2" />

    <circle cx="6" cy="12" r="3" stroke={color} strokeWidth="2" />

    <circle cx="18" cy="19" r="3" stroke={color} strokeWidth="2" />

    <path
      d="M8.6 10.5L15.4 6.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />

    <path
      d="M8.6 13.5L15.4 17.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
