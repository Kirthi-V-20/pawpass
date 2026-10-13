import React from "react";

export const QRIcon: React.FC<{
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
    <rect x="3" y="3" width="7" height="7" stroke={color} strokeWidth="2" />
    <rect x="14" y="3" width="7" height="7" stroke={color} strokeWidth="2" />
    <rect x="3" y="14" width="7" height="7" stroke={color} strokeWidth="2" />
    <path d="M14 14H17V17H14V14Z" fill={color} />
    <path d="M18 18H21V21H18V18Z" fill={color} />
    <path d="M14 21H17V21.01H14V21Z" stroke={color} strokeWidth="2" />
    <path d="M21 14H21.01V17H21V14Z" stroke={color} strokeWidth="2" />
  </svg>
);
