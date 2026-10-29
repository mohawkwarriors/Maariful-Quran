import React from 'react';

export interface AyahMarkerProps {
  vNum: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const toArabicNumeral = (num: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .split('')
    .map((d) => arabicDigits[parseInt(d, 10)] ?? d)
    .join('');
};

/**
 * Authentic Classical Uthmanic Ayah End Medallion (علامة نهاية الآية).
 * Modeled after the genuine King Fahd Complex Quranic medallion:
 * - Concentric circular medallion framing the verse number
 * - Classical side finials (ornate ear crests on horizontal axis)
 * - Top and bottom ornamental apex crowns
 * - Mathematically centered Eastern Arabic numerals that align across all screen resolutions and fonts.
 */
export const AyahEndMarker: React.FC<AyahMarkerProps> = ({
  vNum,
  className = '',
  size = 'md',
}) => {
  // Proportional dimensional scale & font sizing for numerals
  const dimensions =
    size === 'sm'
      ? {
          box: 'w-[23px] h-[23px]',
          numSize: vNum >= 100 ? '9px' : vNum >= 10 ? '10.5px' : '11.5px',
          margin: 'mx-1',
          verticalAlign: '-0.15em',
        }
      : size === 'lg'
      ? {
          box: 'w-[36px] h-[36px] sm:w-[40px] sm:h-[40px]',
          numSize: vNum >= 100 ? '12.5px' : vNum >= 10 ? '14.5px' : '16px',
          margin: 'mx-2',
          verticalAlign: 'middle',
        }
      : {
          box: 'w-[27px] h-[27px]',
          numSize: vNum >= 100 ? '10px' : vNum >= 10 ? '11.5px' : '13px',
          margin: 'mx-1.5',
          verticalAlign: 'middle',
        };

  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${dimensions.box} ${dimensions.margin} ${className} transition-transform hover:scale-105 cursor-default`}
      title={`Ayah ${vNum}`}
      aria-label={`Ayah ${vNum}`}
      style={{
        verticalAlign: dimensions.verticalAlign,
        lineHeight: 1,
      }}
    >
      {/* Precision Uthmanic Ayah Medallion Vector */}
      <svg
        viewBox="0 0 44 44"
        className="absolute inset-0 w-full h-full text-[#CD7743] dark:text-[#E08955] drop-shadow-2xs overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Rim */}
        <circle
          cx="22"
          cy="22"
          r="15"
          stroke="currentColor"
          strokeWidth="1.3"
          fill="currentColor"
          fillOpacity="0.06"
        />

        {/* Inner Concentric Beaded Frame */}
        <circle
          cx="22"
          cy="22"
          r="12.2"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeDasharray="2.5 1.5"
          fill="currentColor"
          fillOpacity="0.03"
        />

        {/* Left Side Finial / Ear (Classic Uthmanic horizontal ornament) */}
        <path
          d="M 7,22 C 3.5,22 1.5,20.5 1.5,22 C 1.5,23.5 3.5,22 7,22 Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
          fill="currentColor"
        />
        <path
          d="M 7,22 C 4.5,19.5 2,20.5 1.5,22 C 2,23.5 4.5,24.5 7,22 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <circle cx="2" cy="22" r="1.1" fill="currentColor" />

        {/* Right Side Finial / Ear */}
        <path
          d="M 37,22 C 39.5,19.5 42,20.5 42.5,22 C 42,23.5 39.5,24.5 37,22 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <circle cx="42" cy="22" r="1.1" fill="currentColor" />

        {/* Top Ornamental Apex Crown */}
        <path
          d="M 22,7 C 20.5,4.5 21,2 22,1.5 C 23,2 23.5,4.5 22,7 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.15"
        />
        <circle cx="22" cy="2" r="1.1" fill="currentColor" />

        {/* Bottom Ornamental Apex Crown */}
        <path
          d="M 22,37 C 20.5,39.5 21,42 22,42.5 C 23,42 23.5,39.5 22,37 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.15"
        />
        <circle cx="22" cy="42" r="1.1" fill="currentColor" />

        {/* Four Subtle Corner Accent Points (45-degree diagonals) */}
        <circle cx="11.5" cy="11.5" r="0.9" fill="currentColor" />
        <circle cx="32.5" cy="11.5" r="0.9" fill="currentColor" />
        <circle cx="11.5" cy="32.5" r="0.9" fill="currentColor" />
        <circle cx="32.5" cy="32.5" r="0.9" fill="currentColor" />
      </svg>

      {/* Dead-center Eastern Arabic Numeral */}
      <span
        dir="rtl"
        className="relative z-10 flex items-center justify-center text-center font-bold text-[#CD7743] dark:text-[#E08955] leading-none select-none"
        style={{
          fontFamily: "'Amiri', 'Scheherazade New', serif",
          fontSize: dimensions.numSize,
          letterSpacing: vNum >= 100 ? '-0.4px' : 'normal',
          transform: 'translateY(-0.5px)',
        }}
      >
        {toArabicNumeral(vNum)}
      </span>
    </span>
  );
};

export { toArabicNumeral };

