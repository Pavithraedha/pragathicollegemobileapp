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

      {/* Outer Rings */}
      <circle cx="100" cy="100" r="92" stroke="#1E1B4B" strokeWidth="5" fill="none" />
      <circle cx="100" cy="100" r="82" stroke="#312E81" strokeWidth="2" fill="none" />

      {/* Circular Text Path for PRAGATHI JUNIOR COLLEGE */}
      <defs>
        <path
          id="pragathiTopArc"
          d="M 26,100 A 74,74 0 1,1 174,100"
          fill="none"
        />
        <path
          id="pragathiBottomArc"
          d="M 170,100 A 70,70 0 0,1 30,100"
          fill="none"
        />
        <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>

      {/* Upper Arc Text: PRAGATHI JUNIOR COLLEGE */}
      <text fill="#1E1B4B" fontSize="13" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.8">
        <textPath href="#pragathiTopArc" startOffset="50%" textAnchor="middle">
          PRAGATHI JUNIOR COLLEGE
        </textPath>
      </text>

      {/* Bottom Arc Text: DEGREE &amp; PG COLLEGE */}
      <text fill="#312E81" fontSize="9.5" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.8">
        <textPath href="#pragathiBottomArc" startOffset="50%" textAnchor="middle">
          Jr. DEGREE &amp; PG COLLEGE
        </textPath>
      </text>

      {/* Center Circular Medallion */}
      <circle cx="100" cy="98" rx="42" ry="42" fill="#0284C7" stroke="#0369A1" strokeWidth="2.5" />
      <circle cx="100" cy="98" rx="36" ry="36" fill="#F8FAFC" />

      {/* Sacred Flame (Wisdom Torch) */}
      <path
        d="M 100 58 C 95 68 92 74 92 81 C 92 88 96 93 100 93 C 104 93 108 88 108 81 C 108 74 105 68 100 58 Z"
        fill="url(#flameGrad)"
      />
      <path
        d="M 100 68 C 98 73 96 77 96 82 C 96 85 98 88 100 88 C 102 88 104 85 104 82 C 104 77 102 73 100 68 Z"
        fill="#FEF08A"
      />

      {/* Laurel Wreath / Leaves around flame */}
      <path
        d="M 80 84 C 84 81 92 81 100 84 C 108 81 116 81 120 84 C 114 90 106 91 100 88 C 94 91 86 90 80 84 Z"
        fill="#0284C7"
      />

      {/* Open Book of Knowledge (Cyan Covers) */}
      <rect x="74" y="96" width="24" height="38" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
      <rect x="102" y="96" width="24" height="38" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />

      {/* Book Inner White Pages */}
      <rect x="77" y="99" width="18" height="32" rx="2" fill="#FFFFFF" />
      <rect x="105" y="99" width="18" height="32" rx="2" fill="#FFFFFF" />

      {/* Page Lines Left */}
      <line x1="81" y1="105" x2="91" y2="105" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="81" y1="111" x2="91" y2="111" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="81" y1="117" x2="91" y2="117" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="81" y1="123" x2="91" y2="123" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />

      {/* Page Lines Right */}
      <line x1="109" y1="105" x2="119" y2="105" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="109" y1="111" x2="119" y2="111" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="109" y1="117" x2="119" y2="117" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <line x1="109" y1="123" x2="119" y2="123" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />

      {/* Center Spine */}
      <line x1="100" y1="96" x2="100" y2="134" stroke="#0369A1" strokeWidth="3" />

      {/* Pedestal Base */}
      <path
        d="M 58 148 L 142 148 L 100 142 Z"
        fill="#831843"
      />
      <rect x="54" y="148" width="92" height="3.5" rx="1.5" fill="#701A75" />
    </svg>
  );
};
