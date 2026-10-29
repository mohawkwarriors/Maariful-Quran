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
 * Authentic Classical Uthmanic Ayah End Marker (علامة نهاية الآية - U+06DD).
 * Uses the genuine Quranic font glyph and ligature (۝ + Eastern Arabic numerals)
 * from the King Fahd Complex Uthmanic script font, ensuring identical design, ornamentation,
 * and proportions as the full Arabic Quran block.
 */
export const AyahEndMarker: React.FC<AyahMarkerProps> = ({
  vNum,
  className = '',
  size = 'md',
}) => {
  const arabicNum = toArabicNumeral(vNum);

  // Proportional sizing calibrated to font em heights:
  // - 'sm' for English translation body text (seamless baseline inline flow)
  // - 'md' for standard standalone markers
  // - 'lg' for inline word-by-word Arabic flow (matches 28px-32px Arabic font)
  const sizeStyles =
    size === 'sm'
      ? {
          fontSize: '1.45em',
          margin: '0 0.35rem',
          lineHeight: '1',
          verticalAlign: '-0.12em',
        }
      : size === 'lg'
      ? {
          fontSize: '1.9em',
          margin: '0 0.5rem',
          lineHeight: '1',
          verticalAlign: 'middle',
        }
      : {
          fontSize: '1.6em',
          margin: '0 0.4rem',
          lineHeight: '1',
          verticalAlign: 'middle',
        };

  return (
    <span
      dir="rtl"
      className={`font-quran inline-flex items-center justify-center select-none text-[#CD7743] dark:text-[#E08955] transition-transform hover:scale-105 cursor-default shrink-0 ${className}`}
      title={`Ayah ${vNum}`}
      aria-label={`Ayah ${vNum}`}
      style={sizeStyles}
    >
      <span className="leading-none whitespace-nowrap">
        {'\u06dd'}{arabicNum}
      </span>
    </span>
  );
};

export { toArabicNumeral };
