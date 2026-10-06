import React from "react";

export const MaleIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="10" cy="14" r="5"></circle>
    <line x1="21" y1="3" x2="14.5" y2="9.5"></line>
    <polyline points="15 3 21 3 21 9"></polyline>
  </svg>
);

export const FemaleIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="9" r="5"></circle>
    <line x1="12" y1="14" x2="12" y2="21"></line>
    <line x1="9" y1="18" x2="15" y2="18"></line>
  </svg>
);
