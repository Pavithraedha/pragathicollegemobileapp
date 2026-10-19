import React from 'react';

interface PragathiLogoProps {
  className?: string;
  size?: number;
}

export const PragathiLogo: React.FC<PragathiLogoProps> = ({ className = 'w-10 h-10', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Background Circle */}
      <circle cx="100" cy="100" r="94" fill="#FFFFFF" />

      {/* Outer Purple/Indigo Ring */}
      <circle cx="100" cy="100" r="92" stroke="#4C1D95" strokeWidth="6" fill="none" />
      <circle cx="100" cy="100" r="82" stroke="#4C1D95" strokeWidth="2.5" fill="none" />

      {/* Circular Text Path */}
      <defs>
        <path
          id="pragathiTextPath"
          d="M 28,100 A 72,72 0 1,1 172,100"
          fill="none"
        />
      </defs>

      <text fill="#4C1D95" fontSize="13.5" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1.2">
        <textPath href="#pragathiTextPath" startOffset="50%" textAnchor="middle">
          PRAGATHI Jr. DEGREE &amp; PG COLLEGE
        </textPath>
      </text>

      {/* Decorative Center Garland / Wreath (Cyan & Blue) */}
      <ellipse cx="100" cy="80" rx="36" ry="32" fill="#0284C7" stroke="#0369A1" strokeWidth="3" />
      <ellipse cx="100" cy="80" rx="28" ry="24" fill="#FFFFFF" />

      {/* Sacred Flame (Red / Orange Torch of Wisdom) */}
      <path
        d="M 100 56 C 96 66 93 72 93 79 C 93 87 97 93 100 93 C 103 93 107 87 107 79 C 107 72 104 66 100 56 Z"
        fill="#DC2626"
      />
      <path
        d="M 100 66 C 98 72 97 76 97 80 C 97 84 99 88 100 88 C 101 88 103 84 103 80 C 103 76 102 72 100 66 Z"
        fill="#FBBF24"
      />

      {/* Garland Leaves Under Flame */}
      <path
        d="M 80 84 C 84 81 92 81 100 84 C 108 81 116 81 120 84 C 114 90 106 91 100 88 C 94 91 86 90 80 84 Z"
        fill="#0284C7"
      />

      {/* Open Book of Knowledge (Cyan Outline with horizontal lines) */}
      <rect x="76" y="94" width="23" height="42" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
      <rect x="101" y="94" width="23" height="42" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />

      {/* Book Inner Pages & Text Simulation Lines */}
      <rect x="80" y="98" width="15" height="34" rx="2" fill="#FFFFFF" />
      <rect x="105" y="98" width="15" height="34" rx="2" fill="#FFFFFF" />

      {/* Page Lines Left */}
      <line x1="83" y1="104" x2="92" y2="104" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="83" y1="110" x2="92" y2="110" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="83" y1="116" x2="92" y2="116" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="83" y1="122" x2="92" y2="122" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="83" y1="128" x2="92" y2="128" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />

      {/* Page Lines Right */}
      <line x1="108" y1="104" x2="117" y2="104" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="108" y1="110" x2="117" y2="110" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="108" y1="116" x2="117" y2="116" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="108" y1="122" x2="117" y2="122" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="108" y1="128" x2="117" y2="128" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />

      {/* Center Spine */}
      <line x1="100" y1="94" x2="100" y2="136" stroke="#0369A1" strokeWidth="3" />

      {/* Maroon / Deep Red Pedestal Base */}
      <path
        d="M 54 152 L 146 152 L 100 144 Z"
        fill="#831843"
      />
      <rect x="52" y="152" width="96" height="3" rx="1.5" fill="#701A75" />
    </svg>
  );
};
