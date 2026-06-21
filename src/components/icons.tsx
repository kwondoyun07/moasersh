import React from 'react';

type IconProps = { size?: number; color?: string; strokeWidth?: number };

export const SearchIcon: React.FC<IconProps> = ({ size = 20, color = '#8B95A1', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="20" y1="20" x2="16.5" y2="16.5" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({ size = 22, color = '#4E5968', strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5 2 5.5H4c.5-.5 2-1.5 2-5.5Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 13, color = '#F5C84C', strokeWidth = 3.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 12 10 18 20 6" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 18, color = '#B0B8C1', strokeWidth = 2.4 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);
