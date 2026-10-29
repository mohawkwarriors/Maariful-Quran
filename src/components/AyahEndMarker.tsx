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
 * Geometric Islamic 8-Pointed Star Rosette (Rub el Hizb Motif).
 * Uses explicit SVG geometry with mathematically centered concentric circles and Eastern Arabic numerals,
 * ensuring flawless vertical and horizontal centering inside both English paragraphs and Arabic words.
 */
export const AyahEndMarker: React.FC<AyahMarkerProps> = ({
  vNum,
  className = '',
  size = 'md',
}) => {
  // Dimension definitions for pixel-perfect centering and proportional scaling
  const dimensions =
    size === 'sm'
      ? { box: 'w-[23px] h-[23px]', numSize: vNum >= 100 ? '9px' : vNum >= 10 ? '10.5px' : '12px', margin: 'mx-1' }
      : size === 'lg'
      ? { box: 'w-[36px] h-[36px]', numSize: vNum >= 100 ? '12px' : vNum >= 10 ? '14px' : '16px', margin: 'mx-2' }
      : { box: 'w-[28px] h-[28px]', numSize: vNum >= 100 ? '10.5px' : vNum >= 10 ? '12px' : '13.5px', margin: 'mx-1.5' };

  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${dimensions.box} ${dimensions.margin} ${className} transition-transform hover:scale-105 cursor-default`}
      title={`Ayah ${vNum}`}
      aria-label={`Ayah ${vNum}`}
      style={{
        verticalAlign: 'middle',
      }}
    >
      {/* Precision 8-Pointed Star Rosette vector */}
      <svg
        viewBox="0 0 40 40"
        className="absolute inset-0 w-full h-full text-[#CD7743] dark:text-[#E08955] drop-shadow-2xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Unified 8-pointed Islamic Star perimeter */}
        <polygon
          points="20,1.5 25.66,6.33 33.08,6.92 33.67,14.34 38.5,20 33.67,25.66 33.08,33.08 25.66,33.67 20,38.5 14.34,33.67 6.92,33.08 6.33,25.66 1.5,20 6.33,14.34 6.92,6.92 14.34,6.33"
          fill="currentColor"
          fillOpacity="0.07"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        {/* Inner concentric circular frame */}
        <circle
          cx="20"
          cy="20"
          r="13"
          stroke="currentColor"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.04"
        />
        {/* 4 cardinal alignment dots */}
        <circle cx="20" cy="4" r="1.1" fill="currentColor" />
        <circle cx="20" cy="36" r="1.1" fill="currentColor" />
        <circle cx="4" cy="20" r="1.1" fill="currentColor" />
        <circle cx="36" cy="20" r="1.1" fill="currentColor" />
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
