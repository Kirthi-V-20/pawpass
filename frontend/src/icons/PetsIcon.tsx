import React from "react";

export const PetsIcon: React.FC<{
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
    <ellipse
      cx="8.1"
      cy="5.3"
      rx="2.0"
      ry="3.0"
      transform="rotate(-8 8.1 5.3)"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />

    <ellipse
      cx="15.9"
      cy="5.3"
      rx="2.0"
      ry="3.0"
      transform="rotate(8 15.9 5.3)"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />

    <ellipse
      cx="5.1"
      cy="9.4"
      rx="1.7"
      ry="2.7"
      transform="rotate(10 5.1 9.4)"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />

    <ellipse
      cx="18.9"
      cy="9.4"
      rx="1.7"
      ry="2.7"
      transform="rotate(-10 18.9 9.4)"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />

    <path
      d="
        M12 10.1
        C9.9 10.1 8.8 11.7 8.0 13.0
        C7.4 14.0 6.5 14.7 5.8 15.4
        C4.8 16.4 4.6 17.8 5.1 18.8
        C5.7 20.0 7.0 20.5 8.4 20.4
        C9.7 20.3 10.8 19.8 12 19.8
        C13.2 19.8 14.3 20.3 15.6 20.4
        C17.0 20.5 18.3 20.0 18.9 18.8
        C19.4 17.8 19.2 16.4 18.2 15.4
        C17.5 14.7 16.6 14.0 16.0 13.0
        C15.2 11.7 14.1 10.1 12 10.1
        Z
      "
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
