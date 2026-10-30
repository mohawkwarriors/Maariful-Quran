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
 * Recreates the exact King Fahd Complex Uthmanic Quran medallion:
 * - Central circular medallion housing the verse number
 * - Ornate side ear finials (left and right) with connecting scrolls
 * - Classical top and bottom ornamental apex crowns
 * - Eastern Arabic numerals (٠-٩) mathematically centered in the medallion across all devices,
 *   preventing mobile Safari/WebKit unicode ligature separation.
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
          box: 'w-[26px] h-[26px]',
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
      {/* Precision Classical Uthmanic Ayah Medallion Vector */}
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
          r="14.5"
          stroke="currentColor"
          strokeWidth="1.3"
          fill="currentColor"
          fillOpacity="0.06"
        />

        {/* Inner Concentric Beaded Frame */}
        <circle
          cx="22"
          cy="22"
          r="11.8"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2.5 1.5"
          fill="currentColor"
          fillOpacity="0.03"
        />

        {/* Left Side Finial / Ear (Classic Uthmanic horizontal ornament) */}
        <path
          d="M 7.5,22 C 4.5,19 1.5,20.2 1,22 C 1.5,23.8 4.5,25 7.5,22 Z"
          stroke="currentColor"
          strokeWidth="1.1"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <circle cx="1.8" cy="22" r="1.1" fill="currentColor" />

        {/* Right Side Finial / Ear */}
        <path
          d="M 36.5,22 C 39.5,19 42.5,20.2 43,22 C 42.5,23.8 39.5,25 36.5,22 Z"
          stroke="currentColor"
          strokeWidth="1.1"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <circle cx="42.2" cy="22" r="1.1" fill="currentColor" />

        {/* Top Ornamental Apex Crown */}
        <path
          d="M 22,7.5 C 20.2,4.5 21,1.5 22,1 C 23,1.5 23.8,4.5 22,7.5 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.15"
        />
        <circle cx="22" cy="1.8" r="1.1" fill="currentColor" />

        {/* Bottom Ornamental Apex Crown */}
        <path
          d="M 22,36.5 C 20.2,39.5 21,42.5 22,43 C 23,42.5 23.8,39.5 22,36.5 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.15"
        />
        <circle cx="22" cy="42.2" r="1.1" fill="currentColor" />

        {/* Four Corner Petal Accents */}
        <circle cx="12" cy="12" r="0.8" fill="currentColor" />
        <circle cx="32" cy="12" r="0.8" fill="currentColor" />
        <circle cx="12" cy="32" r="0.8" fill="currentColor" />
        <circle cx="32" cy="32" r="0.8" fill="currentColor" />
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
