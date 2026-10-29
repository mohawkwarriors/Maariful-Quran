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
 * Authentic, unified Uthmanic Ayah End Marker (علامة نهاية الآية - U+06DD).
 * Renders the same classical Uthmanic Quranic Ayah glyph (۝) with Eastern Arabic numerals,
 * ensuring seamless visual harmony between the Arabic Mushaf text, English translations,
 * and inline word-by-word modes.
 */
export const AyahEndMarker: React.FC<AyahMarkerProps> = ({
  vNum,
  className = '',
  size = 'md',
}) => {
  const arabicNum = toArabicNumeral(vNum);

  // Size configurations to match font scale in English translation, inline, or headings
  const sizeClasses =
    size === 'sm'
      ? 'text-[1.25em] mx-1'
      : size === 'lg'
      ? 'text-[1.6em] mx-2'
      : 'text-[1.35em] mx-1.5';

  return (
    <span
      dir="rtl"
      className={`font-quran inline-flex items-center justify-center align-middle select-none text-[#CD7743] dark:text-[#E08955] transition-transform hover:scale-105 cursor-default ${sizeClasses} ${className}`}
      title={`Ayah ${vNum}`}
      aria-label={`Ayah ${vNum}`}
      style={{
        lineHeight: 1,
      }}
    >
      <span className="leading-none">
        ۝{arabicNum}
      </span>
    </span>
  );
};

export { toArabicNumeral };
