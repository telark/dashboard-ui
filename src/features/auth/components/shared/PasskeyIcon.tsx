import React from 'react';

interface PasskeyIconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

// Approximation of the FIDO Alliance passkey icon
// (https://fidoalliance.org/wp-content/uploads/2023/10/passkey-icon-black.svg)
// Replace SVG paths with the official asset once available in /public.
export const PasskeyIcon: React.FC<PasskeyIconProps> = ({
  size = 18,
  color = 'currentColor',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    aria-hidden="true"
  >
    <circle cx="9" cy="6" r="3" fill={color} />
    <path
      d="M3 20c0-3.314 2.686-6 6-6s6 2.686 6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="18.5" cy="13" r="2.5" stroke={color} strokeWidth="1.8" />
    <path d="M16.5 15l-3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14.5 16.5l1 1M13 18l1 1" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
